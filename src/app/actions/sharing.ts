"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, IDENTITY_COOKIE } from "@/lib/identity";
import { AVATAR_COLORS, MEMBER_ROLES } from "@/lib/constants";

function generateToken(): string {
  return randomBytes(9).toString("base64url");
}

export async function regenerateShareLink(tripId: string, role: "editor" | "viewer") {
  const existing = await prisma.shareLink.findFirst({ where: { tripId, role } });
  if (existing) {
    await prisma.shareLink.update({ where: { id: existing.id }, data: { token: generateToken() } });
  } else {
    await prisma.shareLink.create({ data: { tripId, role, token: generateToken() } });
  }
  revalidatePath(`/trips/${tripId}`);
}

export async function removeMember(tripId: string, memberId: string) {
  const member = await prisma.tripMember.findUnique({ where: { id: memberId } });
  if (!member || member.role === "owner") return;
  await prisma.tripMember.delete({ where: { id: memberId } });
  revalidatePath(`/trips/${tripId}/travelers`);
}

export async function updateMemberRole(tripId: string, memberId: string, role: string) {
  const member = await prisma.tripMember.findUnique({ where: { id: memberId } });
  if (!member || member.role === "owner") return;
  const validRoles = new Set<string>(MEMBER_ROLES.map((r) => r.value));
  if (!validRoles.has(role) || role === "owner") return;
  await prisma.tripMember.update({ where: { id: memberId }, data: { role } });
  revalidatePath(`/trips/${tripId}/travelers`);
}

export async function joinTripViaLink(token: string, formData: FormData) {
  const shareLink = await prisma.shareLink.findUnique({ where: { token } });
  if (!shareLink) {
    redirect(`/join/${token}?error=invalid`);
  }

  let currentUser = await getCurrentUser();

  if (!currentUser) {
    const name = formData.get("name")?.toString().trim();
    if (!name) {
      redirect(`/join/${token}?error=name`);
    }
    currentUser = await prisma.user.create({
      data: { name, avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)] },
    });
    const cookieStore = await cookies();
    cookieStore.set(IDENTITY_COOKIE, currentUser.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  const existingMembership = await prisma.tripMember.findUnique({
    where: { tripId_userId: { tripId: shareLink.tripId, userId: currentUser.id } },
  });

  if (!existingMembership) {
    await prisma.tripMember.create({
      data: { tripId: shareLink.tripId, userId: currentUser.id, role: shareLink.role },
    });
  }

  revalidatePath(`/trips/${shareLink.tripId}`);
  redirect(`/trips/${shareLink.tripId}`);
}

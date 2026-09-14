"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, IDENTITY_COOKIE } from "@/lib/identity";
import { tripFormSchema } from "@/lib/validations/trip";
import { AVATAR_COLORS } from "@/lib/constants";

export type CreateTripState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
};

export async function createTrip(
  _prevState: CreateTripState,
  formData: FormData,
): Promise<CreateTripState> {
  const raw = {
    name: formData.get("name")?.toString() ?? "",
    destination: formData.get("destination")?.toString() ?? "",
    startDate: formData.get("startDate")?.toString() ?? "",
    endDate: formData.get("endDate")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    coverImage: formData.get("coverImage")?.toString() ?? "",
    status: formData.get("status")?.toString() ?? "planning",
    yourName: formData.get("yourName")?.toString() ?? "",
  };

  const parsed = tripFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;

  let currentUser = await getCurrentUser();

  if (!currentUser) {
    const name = data.yourName?.trim();
    if (!name) {
      return {
        error: "Please tell us your name so we know who's planning this trip.",
        fieldErrors: { yourName: "Your name is required" },
      };
    }
    currentUser = await prisma.user.create({
      data: {
        name,
        avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      },
    });

    const cookieStore = await cookies();
    cookieStore.set(IDENTITY_COOKIE, currentUser.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  const trip = await prisma.trip.create({
    data: {
      name: data.name,
      destination: data.destination,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      description: data.description || null,
      coverImage: data.coverImage || null,
      status: data.status,
      ownerId: currentUser.id,
      members: {
        create: [{ userId: currentUser.id, role: "owner" }],
      },
    },
  });

  revalidatePath("/");
  redirect(`/trips/${trip.id}`);
}

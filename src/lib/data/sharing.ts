import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

function generateToken(): string {
  return randomBytes(9).toString("base64url");
}

/** Ensures a trip has one shareable link per role, creating them on first use. */
export async function getOrCreateShareLinks(tripId: string) {
  const existing = await prisma.shareLink.findMany({ where: { tripId } });

  const editor =
    existing.find((l) => l.role === "editor") ??
    (await prisma.shareLink.create({ data: { tripId, role: "editor", token: generateToken() } }));

  const viewer =
    existing.find((l) => l.role === "viewer") ??
    (await prisma.shareLink.create({ data: { tripId, role: "viewer", token: generateToken() } }));

  return { editor, viewer };
}

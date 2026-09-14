import { cache } from "react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const IDENTITY_COOKIE = "tp_uid";

/**
 * Reads the current visitor's identity from their cookie, if any. There's no
 * password-based auth in this version — this is a lightweight stand-in that
 * keeps the schema (User, TripMember, etc.) ready for real auth later.
 */
export const getCurrentUser = cache(async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(IDENTITY_COOKIE)?.value;
  if (!userId) return null;

  return prisma.user.findUnique({ where: { id: userId } });
});

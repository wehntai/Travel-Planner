"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PACKING_CATEGORIES } from "@/lib/constants";

const categoryValues = new Set<string>(PACKING_CATEGORIES.map((c) => c.value));

export async function createPackingItem(tripId: string, formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const categoryRaw = formData.get("category")?.toString() ?? "misc";
  const category = categoryValues.has(categoryRaw) ? categoryRaw : "misc";
  if (!name) return;

  await prisma.packingItem.create({ data: { tripId, name, category } });
  revalidatePath(`/trips/${tripId}/packing`);
  revalidatePath(`/trips/${tripId}`);
}

export async function togglePackingItem(tripId: string, itemId: string, packed: boolean) {
  await prisma.packingItem.update({ where: { id: itemId }, data: { packed } });
  revalidatePath(`/trips/${tripId}/packing`);
  revalidatePath(`/trips/${tripId}`);
}

export async function deletePackingItem(tripId: string, itemId: string) {
  await prisma.packingItem.delete({ where: { id: itemId } });
  revalidatePath(`/trips/${tripId}/packing`);
  revalidatePath(`/trips/${tripId}`);
}

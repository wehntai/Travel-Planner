"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { bucketListItemSchema } from "@/lib/validations/bucket-list";

export type BucketListFormState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  success?: boolean;
};

function parseForm(formData: FormData) {
  return bucketListItemSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    location: formData.get("location")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "other",
    description: formData.get("description")?.toString() ?? "",
    photoUrl: formData.get("photoUrl")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
    priority: formData.get("priority")?.toString() ?? "medium",
    estimatedCost: formData.get("estimatedCost")?.toString() ?? "",
    notes: formData.get("notes")?.toString() ?? "",
    status: formData.get("status")?.toString() ?? "want_to_visit",
  });
}

function fieldErrorsFrom(error: ZodError) {
  const fieldErrors: Partial<Record<string, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString();
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function createBucketListItem(
  tripId: string,
  _prevState: BucketListFormState,
  formData: FormData,
): Promise<BucketListFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const data = parsed.data;
  await prisma.bucketListItem.create({
    data: {
      tripId,
      name: data.name,
      location: data.location || null,
      category: data.category,
      description: data.description || null,
      photoUrl: data.photoUrl || null,
      website: data.website || null,
      priority: data.priority,
      estimatedCost: data.estimatedCost ?? null,
      notes: data.notes || null,
      status: data.status,
    },
  });

  revalidatePath(`/trips/${tripId}/bucket-list`);
  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}

export async function updateBucketListItem(
  tripId: string,
  itemId: string,
  _prevState: BucketListFormState,
  formData: FormData,
): Promise<BucketListFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const data = parsed.data;
  await prisma.bucketListItem.update({
    where: { id: itemId },
    data: {
      name: data.name,
      location: data.location || null,
      category: data.category,
      description: data.description || null,
      photoUrl: data.photoUrl || null,
      website: data.website || null,
      priority: data.priority,
      estimatedCost: data.estimatedCost ?? null,
      notes: data.notes || null,
      status: data.status,
    },
  });

  revalidatePath(`/trips/${tripId}/bucket-list`);
  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}

export async function deleteBucketListItem(tripId: string, itemId: string) {
  await prisma.bucketListItem.delete({ where: { id: itemId } });
  revalidatePath(`/trips/${tripId}/bucket-list`);
  revalidatePath(`/trips/${tripId}`);
}

export async function setBucketListItemStatus(tripId: string, itemId: string, status: string) {
  await prisma.bucketListItem.update({ where: { id: itemId }, data: { status } });
  revalidatePath(`/trips/${tripId}/bucket-list`);
  revalidatePath(`/trips/${tripId}`);
}

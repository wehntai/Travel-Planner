"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { accommodationSchema } from "@/lib/validations/accommodation";

export type AccommodationFormState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  success?: boolean;
};

function fieldErrorsFrom(error: ZodError) {
  const fieldErrors: Partial<Record<string, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString();
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function parseForm(formData: FormData) {
  return accommodationSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    address: formData.get("address")?.toString() ?? "",
    checkIn: formData.get("checkIn")?.toString() ?? "",
    checkOut: formData.get("checkOut")?.toString() ?? "",
    confirmationNumber: formData.get("confirmationNumber")?.toString() ?? "",
    price: formData.get("price")?.toString() ?? "",
    bookingLink: formData.get("bookingLink")?.toString() ?? "",
    notes: formData.get("notes")?.toString() ?? "",
  });
}

export async function createAccommodation(
  tripId: string,
  _prevState: AccommodationFormState,
  formData: FormData,
): Promise<AccommodationFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  const data = parsed.data;

  await prisma.accommodation.create({
    data: {
      tripId,
      name: data.name,
      address: data.address || null,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      confirmationNumber: data.confirmationNumber || null,
      price: data.price ?? null,
      bookingLink: data.bookingLink || null,
      notes: data.notes || null,
    },
  });

  revalidatePath(`/trips/${tripId}/stays`);
  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}

export async function updateAccommodation(
  tripId: string,
  accommodationId: string,
  _prevState: AccommodationFormState,
  formData: FormData,
): Promise<AccommodationFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  const data = parsed.data;

  await prisma.accommodation.update({
    where: { id: accommodationId },
    data: {
      name: data.name,
      address: data.address || null,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      confirmationNumber: data.confirmationNumber || null,
      price: data.price ?? null,
      bookingLink: data.bookingLink || null,
      notes: data.notes || null,
    },
  });

  revalidatePath(`/trips/${tripId}/stays`);
  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}

export async function deleteAccommodation(tripId: string, accommodationId: string) {
  await prisma.accommodation.delete({ where: { id: accommodationId } });
  revalidatePath(`/trips/${tripId}/stays`);
  revalidatePath(`/trips/${tripId}`);
}

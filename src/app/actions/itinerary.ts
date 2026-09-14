"use server";

import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay } from "date-fns";
import type { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { itineraryEventSchema } from "@/lib/validations/itinerary";

export type ItineraryFormState = {
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
  const bucketListItemId = formData.get("bucketListItemId")?.toString() ?? "";
  return itineraryEventSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    date: formData.get("date")?.toString() ?? "",
    time: formData.get("time")?.toString() ?? "",
    location: formData.get("location")?.toString() ?? "",
    notes: formData.get("notes")?.toString() ?? "",
    bucketListItemId: bucketListItemId === "none" ? "" : bucketListItemId,
  });
}

export async function createItineraryEvent(
  tripId: string,
  _prevState: ItineraryFormState,
  formData: FormData,
): Promise<ItineraryFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  const data = parsed.data;
  const startAt = new Date(`${data.date}T${data.time}`);
  if (Number.isNaN(startAt.getTime())) {
    return { error: "Enter a valid date and time.", fieldErrors: { date: "Invalid date/time" } };
  }

  const siblingCount = await prisma.itineraryEvent.count({
    where: { tripId, startAt: { gte: startOfDay(startAt), lte: endOfDay(startAt) } },
  });

  await prisma.itineraryEvent.create({
    data: {
      tripId,
      title: data.title,
      startAt,
      location: data.location || null,
      notes: data.notes || null,
      bucketListItemId: data.bucketListItemId || null,
      sortOrder: siblingCount,
    },
  });

  revalidatePath(`/trips/${tripId}/itinerary`);
  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}

export async function updateItineraryEvent(
  tripId: string,
  eventId: string,
  _prevState: ItineraryFormState,
  formData: FormData,
): Promise<ItineraryFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  const data = parsed.data;
  const startAt = new Date(`${data.date}T${data.time}`);
  if (Number.isNaN(startAt.getTime())) {
    return { error: "Enter a valid date and time.", fieldErrors: { date: "Invalid date/time" } };
  }

  await prisma.itineraryEvent.update({
    where: { id: eventId },
    data: {
      title: data.title,
      startAt,
      location: data.location || null,
      notes: data.notes || null,
      bucketListItemId: data.bucketListItemId || null,
    },
  });

  revalidatePath(`/trips/${tripId}/itinerary`);
  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}

export async function deleteItineraryEvent(tripId: string, eventId: string) {
  await prisma.itineraryEvent.delete({ where: { id: eventId } });
  revalidatePath(`/trips/${tripId}/itinerary`);
  revalidatePath(`/trips/${tripId}`);
}

export async function moveItineraryEvent(
  tripId: string,
  eventId: string,
  direction: "up" | "down",
) {
  const current = await prisma.itineraryEvent.findUnique({ where: { id: eventId } });
  if (!current) return;

  const siblings = await prisma.itineraryEvent.findMany({
    where: {
      tripId,
      startAt: { gte: startOfDay(current.startAt), lte: endOfDay(current.startAt) },
    },
    orderBy: { sortOrder: "asc" },
  });

  const index = siblings.findIndex((e) => e.id === eventId);
  const swapWithIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWithIndex < 0 || swapWithIndex >= siblings.length) return;

  const swapWith = siblings[swapWithIndex];

  await prisma.$transaction([
    prisma.itineraryEvent.update({ where: { id: current.id }, data: { sortOrder: swapWith.sortOrder } }),
    prisma.itineraryEvent.update({ where: { id: swapWith.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidatePath(`/trips/${tripId}/itinerary`);
}

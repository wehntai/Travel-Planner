"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { flightSchema } from "@/lib/validations/flight";

export type FlightFormState = {
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
  return flightSchema.safeParse({
    type: formData.get("type")?.toString() ?? "departure",
    airline: formData.get("airline")?.toString() ?? "",
    flightNumber: formData.get("flightNumber")?.toString() ?? "",
    departureAirport: (formData.get("departureAirport")?.toString() ?? "").toUpperCase(),
    departureDate: formData.get("departureDate")?.toString() ?? "",
    departureTime: formData.get("departureTime")?.toString() ?? "",
    arrivalAirport: (formData.get("arrivalAirport")?.toString() ?? "").toUpperCase(),
    arrivalDate: formData.get("arrivalDate")?.toString() ?? "",
    arrivalTime: formData.get("arrivalTime")?.toString() ?? "",
    confirmationNumber: formData.get("confirmationNumber")?.toString() ?? "",
    terminal: formData.get("terminal")?.toString() ?? "",
    gate: formData.get("gate")?.toString() ?? "",
    notes: formData.get("notes")?.toString() ?? "",
  });
}

export async function createFlight(
  tripId: string,
  _prevState: FlightFormState,
  formData: FormData,
): Promise<FlightFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  const data = parsed.data;

  await prisma.flight.create({
    data: {
      tripId,
      type: data.type,
      airline: data.airline,
      flightNumber: data.flightNumber,
      departureAirport: data.departureAirport,
      departureDateTime: new Date(`${data.departureDate}T${data.departureTime}`),
      arrivalAirport: data.arrivalAirport,
      arrivalDateTime: new Date(`${data.arrivalDate}T${data.arrivalTime}`),
      confirmationNumber: data.confirmationNumber || null,
      terminal: data.terminal || null,
      gate: data.gate || null,
      notes: data.notes || null,
    },
  });

  revalidatePath(`/trips/${tripId}/flights`);
  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}

export async function updateFlight(
  tripId: string,
  flightId: string,
  _prevState: FlightFormState,
  formData: FormData,
): Promise<FlightFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  const data = parsed.data;

  await prisma.flight.update({
    where: { id: flightId },
    data: {
      type: data.type,
      airline: data.airline,
      flightNumber: data.flightNumber,
      departureAirport: data.departureAirport,
      departureDateTime: new Date(`${data.departureDate}T${data.departureTime}`),
      arrivalAirport: data.arrivalAirport,
      arrivalDateTime: new Date(`${data.arrivalDate}T${data.arrivalTime}`),
      confirmationNumber: data.confirmationNumber || null,
      terminal: data.terminal || null,
      gate: data.gate || null,
      notes: data.notes || null,
    },
  });

  revalidatePath(`/trips/${tripId}/flights`);
  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}

export async function deleteFlight(tripId: string, flightId: string) {
  await prisma.flight.delete({ where: { id: flightId } });
  revalidatePath(`/trips/${tripId}/flights`);
  revalidatePath(`/trips/${tripId}`);
}

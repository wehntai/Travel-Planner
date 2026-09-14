import { z } from "zod";
import { FLIGHT_TYPES } from "@/lib/constants";

const typeValues = FLIGHT_TYPES.map((t) => t.value) as [string, ...string[]];

// Note: there's no per-airport timezone modeling here (dates/times are
// stored as entered), so we deliberately don't validate that arrival is
// "after" departure — for a real international flight crossing the date
// line, the local arrival time can be numerically earlier than departure.
export const flightSchema = z.object({
  type: z.enum(typeValues).default("departure"),
  airline: z.string().trim().min(1, "Airline is required").max(100),
  flightNumber: z.string().trim().min(1, "Flight number is required").max(20),
  departureAirport: z.string().trim().min(1, "Departure airport is required").max(10),
  departureDate: z.string().trim().min(1, "Departure date is required"),
  departureTime: z.string().trim().min(1, "Departure time is required"),
  arrivalAirport: z.string().trim().min(1, "Arrival airport is required").max(10),
  arrivalDate: z.string().trim().min(1, "Arrival date is required"),
  arrivalTime: z.string().trim().min(1, "Arrival time is required"),
  confirmationNumber: z.string().trim().max(50).optional().or(z.literal("")),
  terminal: z.string().trim().max(50).optional().or(z.literal("")),
  gate: z.string().trim().max(20).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type FlightValues = z.infer<typeof flightSchema>;

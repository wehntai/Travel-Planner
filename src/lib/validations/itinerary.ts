import { z } from "zod";

export const itineraryEventSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),
  date: z.string().trim().min(1, "Date is required"),
  time: z.string().trim().min(1, "Time is required"),
  location: z.string().trim().max(150).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  bucketListItemId: z.string().trim().optional().or(z.literal("")),
});

export type ItineraryEventValues = z.infer<typeof itineraryEventSchema>;

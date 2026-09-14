import { z } from "zod";
import { TRIP_STATUSES } from "@/lib/constants";

const statusValues = TRIP_STATUSES.map((s) => s.value) as [string, ...string[]];

export const tripFormSchema = z
  .object({
    name: z.string().trim().min(1, "Trip name is required").max(100),
    destination: z.string().trim().min(1, "Destination is required").max(150),
    startDate: z.string().optional().or(z.literal("")),
    endDate: z.string().optional().or(z.literal("")),
    description: z.string().trim().max(2000).optional().or(z.literal("")),
    coverImage: z
      .string()
      .trim()
      .url("Enter a valid image URL")
      .max(500)
      .optional()
      .or(z.literal("")),
    status: z.enum(statusValues).default("planning"),
    yourName: z.string().trim().max(60).optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    { message: "End date can't be before the start date", path: ["endDate"] },
  );

export type TripFormValues = z.infer<typeof tripFormSchema>;

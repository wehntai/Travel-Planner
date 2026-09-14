import { z } from "zod";

export const accommodationSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(150),
    address: z.string().trim().max(300).optional().or(z.literal("")),
    checkIn: z.string().trim().min(1, "Check-in date is required"),
    checkOut: z.string().trim().min(1, "Check-out date is required"),
    confirmationNumber: z.string().trim().max(50).optional().or(z.literal("")),
    price: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((v) => (v ? Number(v) : undefined))
      .refine((v) => v === undefined || (!Number.isNaN(v) && v >= 0), { message: "Enter a valid price" }),
    bookingLink: z.string().trim().url("Enter a valid URL").max(500).optional().or(z.literal("")),
    notes: z.string().trim().max(2000).optional().or(z.literal("")),
  })
  .refine((data) => new Date(data.checkOut) >= new Date(data.checkIn), {
    message: "Check-out can't be before check-in",
    path: ["checkOut"],
  });

export type AccommodationValues = z.infer<typeof accommodationSchema>;

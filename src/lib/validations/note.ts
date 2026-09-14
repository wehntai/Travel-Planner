import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().trim().max(150).optional().or(z.literal("")),
  content: z.string().trim().min(1, "Note can't be empty").max(5000),
});

export type NoteValues = z.infer<typeof noteSchema>;

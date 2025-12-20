import { z } from "zod";

export const CreateTicketSchema = z.object({
  subject: z.string().trim().min(3).max(100),
  description: z.string().trim().min(3).max(2000),
});

export const UpdateTicketStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
});

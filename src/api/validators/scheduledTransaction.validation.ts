import { z } from "zod";

export const CreateScheduledTxSchema = z.object({
  type: z.enum(["DEPOSIT", "WITHDRAWAL", "TRANSFER"]),
  amount: z.coerce.number().positive(),
  fromAccountId: z.coerce.number().int().positive().optional(),
  toAccountId: z.coerce.number().int().positive().optional(),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  nextRunAt: z.string().min(10), // ISO string
});

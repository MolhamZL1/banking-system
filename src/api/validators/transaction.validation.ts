import { z } from "zod";

export const CreateTransactionSchema = z.object({
  type: z.enum(["DEPOSIT", "WITHDRAWAL", "TRANSFER"]),
  amount: z.coerce.number().positive(),
  fromAccountId: z.coerce.number().int().positive().optional(),
  toAccountId: z.coerce.number().int().positive().optional(),
});

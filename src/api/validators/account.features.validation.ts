import { z } from "zod";

export const AddFeatureSchema = z.object({
  type: z.enum(["PREMIUM", "INSURANCE", "OVERDRAFT_PLUS"]),
  numberValue: z.coerce.number().nonnegative().optional(),
});

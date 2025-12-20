"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateScheduledTxSchema = void 0;
const zod_1 = require("zod");
exports.CreateScheduledTxSchema = zod_1.z.object({
    type: zod_1.z.enum(["DEPOSIT", "WITHDRAWAL", "TRANSFER"]),
    amount: zod_1.z.coerce.number().positive(),
    fromAccountId: zod_1.z.coerce.number().int().positive().optional(),
    toAccountId: zod_1.z.coerce.number().int().positive().optional(),
    frequency: zod_1.z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
    nextRunAt: zod_1.z.string().min(10), // ISO string
});

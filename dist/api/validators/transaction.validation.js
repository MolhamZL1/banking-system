"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransactionSchema = void 0;
const zod_1 = require("zod");
exports.CreateTransactionSchema = zod_1.z.object({
    type: zod_1.z.enum(["DEPOSIT", "WITHDRAWAL", "TRANSFER"]),
    amount: zod_1.z.coerce.number().positive(),
    fromAccountId: zod_1.z.coerce.number().int().positive().optional(),
    toAccountId: zod_1.z.coerce.number().int().positive().optional(),
});

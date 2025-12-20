"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTicketStatusSchema = exports.CreateTicketSchema = void 0;
const zod_1 = require("zod");
exports.CreateTicketSchema = zod_1.z.object({
    subject: zod_1.z.string().trim().min(3).max(100),
    description: zod_1.z.string().trim().min(3).max(2000),
});
exports.UpdateTicketStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
});

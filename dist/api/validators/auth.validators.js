"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshSchema = exports.LoginSchema = exports.VerifyEmailSchema = exports.ResendCodeSchema = exports.CreateStaffSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(3).max(30),
    password: zod_1.z.string().min(6).max(100),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().trim().min(6).max(30).optional(),
});
exports.CreateStaffSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(3).max(30),
    password: zod_1.z.string().min(6).max(100),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().trim().min(6).max(30).optional(),
    role: zod_1.z.enum(['MANAGER', 'TELLER', 'CUSTOMER']),
});
exports.ResendCodeSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.VerifyEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    code: zod_1.z.string().trim().length(6),
});
exports.LoginSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(3).max(30),
    password: zod_1.z.string().min(6).max(100),
});
exports.RefreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10),
});

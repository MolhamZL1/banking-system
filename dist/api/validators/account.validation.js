"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountGroupSchema = exports.RenameAccountSchema = exports.ChangeStateSchema = exports.CreateAccountSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const state_1 = require("../../domain/accounts/state");
exports.CreateAccountSchema = zod_1.z.object({
    userId: zod_1.z.coerce.number().int().positive(),
    accountType: zod_1.z.nativeEnum(client_1.AccountType),
    name: zod_1.z.string().trim().min(3).max(30),
    initialBalance: zod_1.z.coerce.number().nonnegative().optional(),
    parentAccountId: zod_1.z.coerce.number().int().positive().optional(),
});
exports.ChangeStateSchema = zod_1.z.object({
    action: zod_1.z.nativeEnum(state_1.AccountStateAction),
});
exports.RenameAccountSchema = zod_1.z.object({
    newName: zod_1.z.string().trim().min(3).max(30),
});
exports.CreateAccountGroupSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(3).max(30),
    childAccountIds: zod_1.z.array(zod_1.z.coerce.number().int().positive()),
});

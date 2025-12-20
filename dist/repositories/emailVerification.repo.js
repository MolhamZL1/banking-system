"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationRepo = void 0;
const client_1 = __importDefault(require("../infrastructure/prisma/client"));
class EmailVerificationRepo {
    create(email, codeHash, expiresAt) {
        return client_1.default.emailVerification.create({ data: { email, codeHash, expiresAt } });
    }
    findValid(email, codeHash) {
        return client_1.default.emailVerification.findFirst({
            where: { email, codeHash, usedAt: null, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'desc' },
        });
    }
    markUsed(id) {
        return client_1.default.emailVerification.update({ where: { id }, data: { usedAt: new Date() } });
    }
}
exports.EmailVerificationRepo = EmailVerificationRepo;

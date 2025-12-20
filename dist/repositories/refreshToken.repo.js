"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRepo = void 0;
const client_1 = __importDefault(require("../infrastructure/prisma/client"));
class RefreshTokenRepo {
    create(userId, tokenHash, expiresAt) {
        return client_1.default.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
    }
    findValid(tokenHash) {
        return client_1.default.refreshToken.findFirst({
            where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
            include: { user: true },
        });
    }
    revokeByHash(tokenHash) {
        return client_1.default.refreshToken.updateMany({
            where: { tokenHash, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
}
exports.RefreshTokenRepo = RefreshTokenRepo;

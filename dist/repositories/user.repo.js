"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const client_1 = __importDefault(require("../infrastructure/prisma/client"));
class UserRepo {
    create(data) {
        return client_1.default.user.create({ data });
    }
    findById(id) {
        return client_1.default.user.findUnique({ where: { id } });
    }
    findByUsername(username) {
        return client_1.default.user.findUnique({ where: { username } });
    }
    findByEmail(email) {
        return client_1.default.user.findUnique({ where: { email } });
    }
    setEmailVerified(id) {
        return client_1.default.user.update({ where: { id }, data: { isEmailVerified: true } });
    }
}
exports.UserRepo = UserRepo;

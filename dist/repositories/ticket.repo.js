"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRepo = void 0;
const client_1 = __importDefault(require("../infrastructure/prisma/client"));
class TicketRepo {
    create(data) {
        return client_1.default.ticket.create({ data });
    }
    listForUser(userId) {
        return client_1.default.ticket.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    }
    listAll() {
        return client_1.default.ticket.findMany({ orderBy: { createdAt: "desc" }, include: { user: { select: { id: true, username: true, email: true } } } });
    }
    updateStatus(id, status) {
        return client_1.default.ticket.update({ where: { id }, data: { status } });
    }
}
exports.TicketRepo = TicketRepo;

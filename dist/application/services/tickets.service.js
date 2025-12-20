"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const http_error_1 = require("../errors/http-error");
const ticket_repo_1 = require("../../repositories/ticket.repo");
class TicketsService {
    constructor(repo = new ticket_repo_1.TicketRepo()) {
        this.repo = repo;
    }
    create(userId, input) {
        return this.repo.create({ userId, ...input });
    }
    list(requester) {
        const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
        return staff ? this.repo.listAll() : this.repo.listForUser(requester.userId);
    }
    async setStatus(requester, id, status) {
        const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
        if (!staff)
            throw new http_error_1.HttpError(403, "Forbidden");
        return this.repo.updateStatus(id, status);
    }
}
exports.TicketsService = TicketsService;

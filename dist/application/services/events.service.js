"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const event_repo_1 = require("../../repositories/event.repo");
class EventsService {
    constructor(repo = new event_repo_1.EventRepo()) {
        this.repo = repo;
    }
    list(requester, filters) {
        const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
        if (staff)
            return this.repo.listAll(filters);
        return this.repo.listForUser(requester.userId);
    }
}
exports.EventsService = EventsService;

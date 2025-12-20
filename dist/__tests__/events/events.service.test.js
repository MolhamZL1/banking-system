"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_service_1 = require("../../application/services/events.service");
const event_repo_1 = require("../../repositories/event.repo");
describe("EventsService", () => {
    test("Customer can only list own events", async () => {
        jest.spyOn(event_repo_1.EventRepo.prototype, "listForUser").mockResolvedValue([{ id: 1 }]);
        const s = new events_service_1.EventsService();
        const out = await s.list({ userId: 10, role: "CUSTOMER" });
        expect(out).toEqual([{ id: 1 }]);
    });
    test("Staff can list all events", async () => {
        jest.spyOn(event_repo_1.EventRepo.prototype, "listAll").mockResolvedValue([{ id: 2 }]);
        const s = new events_service_1.EventsService();
        const out = await s.list({ userId: 10, role: "ADMIN" }, { userId: 99 });
        expect(out).toEqual([{ id: 2 }]);
    });
});

import { EventsService } from "../../application/services/events.service";
import { EventRepo } from "../../repositories/event.repo";

describe("EventsService", () => {
  test("Customer can only list own events", async () => {
    jest.spyOn(EventRepo.prototype, "listForUser").mockResolvedValue([{ id: 1 }] as any);
    const s = new EventsService();
    const out = await s.list({ userId: 10, role: "CUSTOMER" });
    expect(out).toEqual([{ id: 1 }]);
  });

  test("Staff can list all events", async () => {
    jest.spyOn(EventRepo.prototype, "listAll").mockResolvedValue([{ id: 2 }] as any);
    const s = new EventsService();
    const out = await s.list({ userId: 10, role: "ADMIN" }, { userId: 99 });
    expect(out).toEqual([{ id: 2 }]);
  });
});

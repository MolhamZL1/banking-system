import { EventRepo } from "../../repositories/event.repo";

export class EventsService {
  constructor(private readonly repo = new EventRepo()) {}

  list(requester: { userId: number; role: string }, filters?: { userId?: number }) {
    const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
    if (staff) return this.repo.listAll(filters);
    return this.repo.listForUser(requester.userId);
  }
}

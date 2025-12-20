import { TicketStatus } from "@prisma/client";
import { HttpError } from "../errors/http-error";
import { TicketRepo } from "../../repositories/ticket.repo";

export class TicketsService {
  constructor(private readonly repo = new TicketRepo()) {}

  create(userId: number, input: { subject: string; description: string }) {
    return this.repo.create({ userId, ...input });
  }

  list(requester: { userId: number; role: string }) {
    const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
    return staff ? this.repo.listAll() : this.repo.listForUser(requester.userId);
  }

  async setStatus(requester: { role: string }, id: number, status: TicketStatus) {
    const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
    if (!staff) throw new HttpError(403, "Forbidden");
    return this.repo.updateStatus(id, status);
  }
}

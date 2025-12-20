import prisma from "../infrastructure/prisma/client";
import { TicketStatus } from "@prisma/client";

export class TicketRepo {
  create(data: { userId: number; subject: string; description: string }) {
    return prisma.ticket.create({ data });
  }

  listForUser(userId: number) {
    return prisma.ticket.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  listAll() {
    return prisma.ticket.findMany({ orderBy: { createdAt: "desc" }, include: { user: { select: { id: true, username: true, email: true } } } });
  }

  updateStatus(id: number, status: TicketStatus) {
    return prisma.ticket.update({ where: { id }, data: { status } });
  }
}

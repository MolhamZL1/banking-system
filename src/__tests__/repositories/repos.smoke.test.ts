import prisma from "../../infrastructure/prisma/client";
import { UserRepo } from "../../repositories/user.repo";
import { RefreshTokenRepo } from "../../repositories/refreshToken.repo";
import { EmailVerificationRepo } from "../../repositories/emailVerification.repo";
import { NotificationRepo } from "../../repositories/notification.repo";
import { TicketRepo } from "../../repositories/ticket.repo";

describe("Repositories smoke tests", () => {
  test("UserRepo basic calls", async () => {
    (prisma as any).user.create.mockResolvedValue({ id: 1 });
    (prisma as any).user.update.mockResolvedValue({ id: 1 });

    const r = new UserRepo();
    await r.create({ username: "u", passwordHash: "h" } as any);
    await r.setEmailVerified(1);

    expect((prisma as any).user.create).toHaveBeenCalled();
    expect((prisma as any).user.update).toHaveBeenCalled();
  });

  test("RefreshTokenRepo basic calls", async () => {
    (prisma as any).refreshToken.create.mockResolvedValue({ id: 1 });
    (prisma as any).refreshToken.findFirst.mockResolvedValue(null);
    (prisma as any).refreshToken.updateMany.mockResolvedValue({ count: 1 });

    const r = new RefreshTokenRepo();
    await r.create(1, "hash", new Date());
    await r.findValid("hash");
    await r.revokeByHash("hash");

    expect((prisma as any).refreshToken.create).toHaveBeenCalled();
    expect((prisma as any).refreshToken.findFirst).toHaveBeenCalled();
    expect((prisma as any).refreshToken.updateMany).toHaveBeenCalled();
  });

  test("EmailVerificationRepo basic calls", async () => {
    (prisma as any).emailVerification.create.mockResolvedValue({ id: 1 });
    (prisma as any).emailVerification.findFirst.mockResolvedValue({ id: 1 });
    (prisma as any).emailVerification.update.mockResolvedValue({ id: 1 });

    const r = new EmailVerificationRepo();
    await r.create("a@a.com", "h", new Date());
    await r.findValid("a@a.com", "h");
    await r.markUsed(1);

    expect((prisma as any).emailVerification.create).toHaveBeenCalled();
    expect((prisma as any).emailVerification.findFirst).toHaveBeenCalled();
    expect((prisma as any).emailVerification.update).toHaveBeenCalled();
  });

  test("NotificationRepo basic calls", async () => {
    (prisma as any).notification.create.mockResolvedValue({ id: 1 });
    (prisma as any).notification.findMany.mockResolvedValue([]);
    (prisma as any).notification.updateMany.mockResolvedValue({ count: 1 });

    const r = new NotificationRepo();
    await r.create({ userId: 1, channel: "IN_APP" as any, message: "m" });
    await r.listByUser(1);
    await r.markRead(1, 1);

    expect((prisma as any).notification.create).toHaveBeenCalled();
    expect((prisma as any).notification.findMany).toHaveBeenCalled();
    expect((prisma as any).notification.updateMany).toHaveBeenCalled();
  });

  test("TicketRepo basic calls", async () => {
    (prisma as any).ticket.create.mockResolvedValue({ id: 1 });
    (prisma as any).ticket.findMany.mockResolvedValue([]);
    (prisma as any).ticket.update.mockResolvedValue({ id: 1 });

    const r = new TicketRepo();
    await r.create({ userId: 1, subject: "s", description: "d" });
    await r.listForUser(1);
    await r.listAll();
    await r.updateStatus(1, "CLOSED" as any);

    expect((prisma as any).ticket.create).toHaveBeenCalled();
    expect((prisma as any).ticket.findMany).toHaveBeenCalled();
    expect((prisma as any).ticket.update).toHaveBeenCalled();
  });
});

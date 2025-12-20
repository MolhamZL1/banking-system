import { NotificationRepo } from "../../repositories/notification.repo";

export class NotificationsService {
  constructor(private readonly repo = new NotificationRepo()) {}

  list(userId: number) {
    return this.repo.listByUser(userId);
  }

  async markRead(userId: number, id: number) {
    await this.repo.markRead(userId, id);
    return { ok: true };
  }
}

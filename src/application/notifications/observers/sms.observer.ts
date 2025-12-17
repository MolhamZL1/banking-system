import prisma from '../../../infrastructure/prisma/client';
import { Observer } from '../../../domain/notifications/observer';
import { AccountEvent } from '../../../domain/notifications/events';
import { NotificationRepo } from '../../../repositories/notification.repo';
import { UserRepo } from '../../../repositories/user.repo';

export class SmsNotificationObserver implements Observer<AccountEvent> {
notifRepo = new NotificationRepo();
userRepo = new UserRepo();
    async update(event: AccountEvent) {

   const user = await this.userRepo.findById(event.userId);
    if (!user?.phone) return;
//sent here

    const rec = await this.notifRepo.create({
      userId: event.userId,
      relatedAccountId: event.accountId,
      channel: 'SMS',
      message: event.message,
      status: 'PENDING',
    });
  }
}

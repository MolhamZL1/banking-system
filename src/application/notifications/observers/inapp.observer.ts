import prisma from '../../../infrastructure/prisma/client';
import { Observer } from '../../../domain/notifications/observer';
import { AccountEvent } from '../../../domain/notifications/events';
import { NotificationRepo } from '../../../repositories/notification.repo';

export class InAppNotificationObserver implements Observer<AccountEvent> {
    notfiRepo = new NotificationRepo();
  async update(event: AccountEvent) {
    await this.notfiRepo.create({
      userId: event.userId,

      relatedAccountId: event.accountId,
      channel: 'IN_APP',
      message: event.message ,
      status: 'SENT',
    });
}}

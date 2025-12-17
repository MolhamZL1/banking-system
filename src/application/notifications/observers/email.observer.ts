import prisma from '../../../infrastructure/prisma/client';
import { mailer } from '../../../infrastructure/mailer/mailer';
import { Observer } from '../../../domain/notifications/observer';
import { AccountEvent } from '../../../domain/notifications/events';
import { NotificationRepo } from '../../../repositories/notification.repo';
import { UserRepo } from '../../../repositories/user.repo';

export class EmailNotificationObserver implements Observer<AccountEvent> {
 notifRepo = new NotificationRepo();
    userRepo = new UserRepo();

async update(event: AccountEvent) {
 

    const user = await this.userRepo.findById(event.userId);

    if (!user?.email) return;

    await mailer.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Account notification',
      text: event.message ,
    });

   await this.notifRepo.create({
      userId: event.userId,
      relatedAccountId: event.accountId,
      channel: 'EMAIL',
      message: event.message ,
      status: 'SENT',
    });
  }
}

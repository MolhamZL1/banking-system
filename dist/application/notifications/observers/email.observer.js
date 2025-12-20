"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotificationObserver = void 0;
const mailer_1 = require("../../../infrastructure/mailer/mailer");
const notification_repo_1 = require("../../../repositories/notification.repo");
const user_repo_1 = require("../../../repositories/user.repo");
class EmailNotificationObserver {
    constructor() {
        this.notifRepo = new notification_repo_1.NotificationRepo();
        this.userRepo = new user_repo_1.UserRepo();
    }
    async update(event) {
        const user = await this.userRepo.findById(event.userId);
        if (!user?.email)
            return;
        await mailer_1.mailer.sendMail({
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Account notification',
            text: event.message,
        });
        await this.notifRepo.create({
            userId: event.userId,
            relatedAccountId: event.accountId,
            channel: 'EMAIL',
            message: event.message,
            status: 'SENT',
        });
    }
}
exports.EmailNotificationObserver = EmailNotificationObserver;

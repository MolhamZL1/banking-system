"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsNotificationObserver = void 0;
const notification_repo_1 = require("../../../repositories/notification.repo");
const user_repo_1 = require("../../../repositories/user.repo");
class SmsNotificationObserver {
    constructor() {
        this.notifRepo = new notification_repo_1.NotificationRepo();
        this.userRepo = new user_repo_1.UserRepo();
    }
    async update(event) {
        const user = await this.userRepo.findById(event.userId);
        if (!user?.phone)
            return;
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
exports.SmsNotificationObserver = SmsNotificationObserver;

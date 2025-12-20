"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InAppNotificationObserver = void 0;
const notification_repo_1 = require("../../../repositories/notification.repo");
class InAppNotificationObserver {
    constructor() {
        this.notfiRepo = new notification_repo_1.NotificationRepo();
    }
    async update(event) {
        await this.notfiRepo.create({
            userId: event.userId,
            relatedAccountId: event.accountId,
            channel: 'IN_APP',
            message: event.message,
            status: 'SENT',
        });
    }
}
exports.InAppNotificationObserver = InAppNotificationObserver;

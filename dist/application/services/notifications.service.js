"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const notification_repo_1 = require("../../repositories/notification.repo");
class NotificationsService {
    constructor(repo = new notification_repo_1.NotificationRepo()) {
        this.repo = repo;
    }
    list(userId) {
        return this.repo.listByUser(userId);
    }
    async markRead(userId, id) {
        await this.repo.markRead(userId, id);
        return { ok: true };
    }
}
exports.NotificationsService = NotificationsService;

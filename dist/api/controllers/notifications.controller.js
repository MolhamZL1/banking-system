"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const notifications_service_1 = require("../../application/services/notifications.service");
class NotificationsController {
    constructor(service = new notifications_service_1.NotificationsService()) {
        this.service = service;
        this.list = async (req, res, next) => {
            try {
                const out = await this.service.list(req.auth.userId);
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.read = async (req, res, next) => {
            try {
                const out = await this.service.markRead(req.auth.userId, Number(req.params.id));
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.NotificationsController = NotificationsController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const events_service_1 = require("../../application/services/events.service");
class EventsController {
    constructor(service = new events_service_1.EventsService()) {
        this.service = service;
        this.list = async (req, res, next) => {
            try {
                const userId = req.query.userId ? Number(req.query.userId) : undefined;
                const out = await this.service.list({ userId: req.auth.userId, role: req.auth.role }, userId ? { userId } : undefined);
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.EventsController = EventsController;

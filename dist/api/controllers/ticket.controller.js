"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const tickets_service_1 = require("../../application/services/tickets.service");
class TicketController {
    constructor(service = new tickets_service_1.TicketsService()) {
        this.service = service;
        this.create = async (req, res, next) => {
            try {
                const out = await this.service.create(req.auth.userId, req.body);
                res.status(201).json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.list = async (req, res, next) => {
            try {
                const out = await this.service.list({ userId: req.auth.userId, role: req.auth.role });
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.setStatus = async (req, res, next) => {
            try {
                const out = await this.service.setStatus({ role: req.auth.role }, Number(req.params.id), req.body.status);
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.TicketController = TicketController;

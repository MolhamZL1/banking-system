"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
class AdminController {
    constructor(service) {
        this.service = service;
        this.dashboard = async (_req, res, next) => {
            try {
                const out = await this.service.dashboard();
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.dailyTx = async (req, res, next) => {
            try {
                const out = await this.service.dailyTx(req.query.date);
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.accountsSummary = async (req, res, next) => {
            try {
                const out = await this.service.accountsSummary({
                    userId: req.query.userId ? Number(req.query.userId) : undefined,
                    type: req.query.type,
                    state: req.query.state,
                });
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.audit = async (req, res, next) => {
            try {
                const out = await this.service.audit({
                    from: req.query.from,
                    to: req.query.to,
                    userId: req.query.userId ? Number(req.query.userId) : undefined,
                    eventType: req.query.eventType,
                });
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.AdminController = AdminController;

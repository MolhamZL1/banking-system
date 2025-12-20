"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledTransactionController = void 0;
const scheduledTransactions_service_1 = require("../../application/services/scheduledTransactions.service");
class ScheduledTransactionController {
    constructor(service = new scheduledTransactions_service_1.ScheduledTransactionsService()) {
        this.service = service;
        this.create = async (req, res, next) => {
            try {
                const out = await this.service.create({ userId: req.auth.userId }, req.body);
                res.status(201).json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.list = async (req, res, next) => {
            try {
                const out = await this.service.list({ userId: req.auth.userId });
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.stop = async (req, res, next) => {
            try {
                const out = await this.service.stop({ userId: req.auth.userId }, Number(req.params.id));
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.resume = async (req, res, next) => {
            try {
                const out = await this.service.resume({ userId: req.auth.userId }, Number(req.params.id));
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.ScheduledTransactionController = ScheduledTransactionController;

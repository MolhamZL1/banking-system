"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
class TransactionController {
    constructor(service) {
        this.service = service;
        this.create = async (req, res, next) => {
            try {
                const out = await this.service.create({
                    ...req.body,
                    requester: { userId: req.auth.userId, role: req.auth.role },
                });
                res.status(201).json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.pending = async (req, res, next) => {
            try {
                const out = await this.service.pending({ role: req.auth.role });
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.approve = async (req, res, next) => {
            try {
                const out = await this.service.approve({ userId: req.auth.userId, role: req.auth.role }, Number(req.params.id));
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.reject = async (req, res, next) => {
            try {
                const out = await this.service.reject({ userId: req.auth.userId, role: req.auth.role }, Number(req.params.id), req.body?.reason);
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.TransactionController = TransactionController;

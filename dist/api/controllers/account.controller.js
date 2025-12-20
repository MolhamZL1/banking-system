"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
class AccountController {
    constructor(service) {
        this.service = service;
        this.create = async (req, res, next) => {
            try {
                const acc = await this.service.createAccount(req.body);
                res.status(201).json({ success: true, data: acc });
            }
            catch (e) {
                next(e);
            }
        };
        this.listMine = async (req, res, next) => {
            try {
                const userIdParam = req.query.userId ? Number(req.query.userId) : undefined;
                const out = await this.service.listAccountsApi({ userId: req.auth.userId, role: req.auth.role }, userIdParam);
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const acc = await this.service.getAccount(Number(req.params.id));
                res.json({ success: true, data: acc });
            }
            catch (e) {
                next(e);
            }
        };
        this.rename = async (req, res, next) => {
            try {
                const out = await this.service.renameAccountApi({ userId: req.auth.userId, role: req.auth.role }, Number(req.params.id), req.body.newName);
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.changeState = async (req, res, next) => {
            try {
                const updated = await this.service.changeState(Number(req.params.id), req.body.action);
                res.json({ success: true, data: updated });
            }
            catch (e) {
                next(e);
            }
        };
        this.addFeature = async (req, res, next) => {
            try {
                const out = await this.service.addFeature(Number(req.params.id), req.body);
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.removeFeature = async (req, res, next) => {
            try {
                const out = await this.service.removeFeature(Number(req.params.id), req.params.type);
                res.json({ success: true, data: out });
            }
            catch (e) {
                next(e);
            }
        };
        this.createGroup = async (req, res, next) => {
            try {
                const group = await this.service.createAccountGroup({
                    userId: req.auth.userId,
                    name: req.body.name,
                    childAccountIds: req.body.childAccountIds ?? [],
                });
                res.status(201).json({ success: true, data: group });
            }
            catch (e) {
                next(e);
            }
        };
        this.addToGroup = async (req, res, next) => {
            try {
                const result = await this.service.addToGroup(Number(req.params.groupId), Number(req.body.childAccountId));
                res.json({ success: true, ...result });
            }
            catch (e) {
                next(e);
            }
        };
        this.removeFromGroup = async (req, res, next) => {
            try {
                const result = await this.service.removeFromGroup(Number(req.params.groupId), Number(req.params.childId));
                res.json({ success: true, ...result });
            }
            catch (e) {
                next(e);
            }
        };
        this.search = async (req, res, next) => {
            try {
                const filters = {
                    userId: req.query.userId ? Number(req.query.userId) : undefined,
                    accountType: req.query.accountType,
                    state: req.query.state,
                    minBalance: req.query.minBalance ? Number(req.query.minBalance) : undefined,
                    maxBalance: req.query.maxBalance ? Number(req.query.maxBalance) : undefined,
                };
                const results = await this.service.searchAccounts(filters);
                res.json({ success: true, data: results });
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.AccountController = AccountController;

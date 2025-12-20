"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../../application/services/auth.service");
const service = new auth_service_1.AuthService();
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.createStaff = async (req, res, next) => {
    try {
        const out = await service.createStaff(req.body);
        res.status(201).json({ success: true, data: out });
    }
    catch (e) {
        next(e);
    }
};
AuthController.register = async (req, res, next) => {
    try {
        const out = await service.register(req.body);
        res.status(201).json({ success: true, data: out });
    }
    catch (e) {
        next(e);
    }
};
AuthController.resendCode = async (req, res, next) => {
    try {
        const out = await service.resendCode(req.body.email);
        res.json({ success: true, data: out });
    }
    catch (e) {
        next(e);
    }
};
AuthController.verifyEmail = async (req, res, next) => {
    try {
        const out = await service.verifyEmail(req.body);
        res.json({ success: true, data: out });
    }
    catch (e) {
        next(e);
    }
};
AuthController.login = async (req, res, next) => {
    try {
        const out = await service.login(req.body);
        res.json({ success: true, data: out });
    }
    catch (e) {
        next(e);
    }
};
AuthController.refresh = async (req, res, next) => {
    try {
        const out = await service.refresh(req.body.refreshToken);
        res.json({ success: true, data: out });
    }
    catch (e) {
        next(e);
    }
};
AuthController.logout = async (req, res, next) => {
    try {
        const out = await service.logout(req.body.refreshToken);
        res.json({ success: true, data: out });
    }
    catch (e) {
        next(e);
    }
};
AuthController.me = async (req, res, next) => {
    try {
        const out = await service.me(req.auth.userId);
        res.json({ success: true, data: out });
    }
    catch (e) {
        next(e);
    }
};

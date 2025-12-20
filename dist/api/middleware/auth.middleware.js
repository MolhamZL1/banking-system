"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRoles = requireRoles;
const jwt_1 = require("../../infrastructure/auth/jwt");
const http_error_1 = require("../../application/errors/http-error");
function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
        return next(new http_error_1.HttpError(401, 'Missing Bearer token'));
    const token = header.slice('Bearer '.length);
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.auth = { userId: payload.userId, role: payload.role };
        next();
    }
    catch {
        next(new http_error_1.HttpError(401, 'Invalid token'));
    }
}
function requireRoles(...roles) {
    return (req, _res, next) => {
        if (!req.auth)
            return next(new http_error_1.HttpError(401, 'Unauthorized'));
        if (!roles.includes(req.auth.role))
            return next(new http_error_1.HttpError(403, 'Forbidden'));
        next();
    };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const http_error_1 = require("../../application/errors/http-error");
const validateBody = (schema) => (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return next(new http_error_1.HttpError(400, JSON.stringify(parsed.error.issues)));
    }
    req.body = parsed.data;
    next();
};
exports.validateBody = validateBody;

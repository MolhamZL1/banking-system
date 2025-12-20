"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerApprove = void 0;
const ApprovalHandler_1 = require("./ApprovalHandler");
class ManagerApprove extends ApprovalHandler_1.ApprovalHandler {
    tryApprove(req) {
        const ok = ['MANAGER', 'ADMIN'].includes(req.requestedByRole);
        if (ok)
            return { approved: true, level: 'MANAGER' };
        return null;
    }
}
exports.ManagerApprove = ManagerApprove;

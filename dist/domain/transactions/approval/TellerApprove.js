"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TellerApprove = void 0;
const ApprovalHandler_1 = require("./ApprovalHandler");
class TellerApprove extends ApprovalHandler_1.ApprovalHandler {
    constructor(maxAmount = 1000) {
        super();
        this.maxAmount = maxAmount;
    }
    tryApprove(req) {
        const staff = ['TELLER', 'MANAGER', 'ADMIN'].includes(req.requestedByRole);
        if (staff && req.amount <= this.maxAmount)
            return { approved: true, level: 'TELLER' };
        return null;
    }
}
exports.TellerApprove = TellerApprove;

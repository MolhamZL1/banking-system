"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoApprove = void 0;
const ApprovalHandler_1 = require("./ApprovalHandler");
class AutoApprove extends ApprovalHandler_1.ApprovalHandler {
    constructor(maxAmount = 100) {
        super();
        this.maxAmount = maxAmount;
    }
    tryApprove(req) {
        if (req.amount <= this.maxAmount)
            return { approved: true, level: 'AUTO' };
        return null;
    }
}
exports.AutoApprove = AutoApprove;

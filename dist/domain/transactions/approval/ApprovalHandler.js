"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalHandler = void 0;
class ApprovalHandler {
    constructor(next) {
        this.next = next;
    }
    setNext(next) {
        this.next = next;
        return next;
    }
    handle(req) {
        const res = this.tryApprove(req);
        if (res)
            return res;
        if (!this.next)
            return { approved: false, reason: 'No approver available' };
        return this.next.handle(req);
    }
}
exports.ApprovalHandler = ApprovalHandler;

"use strict";
// src/domain/accounts/decorator/InsuranceDecorator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceDecorator = void 0;
const AccountDecorator_1 = require("./AccountDecorator");
class InsuranceDecorator extends AccountDecorator_1.AccountDecorator {
    constructor(wrap, feePerWithdraw = 2) {
        super(wrap);
        this.feePerWithdraw = feePerWithdraw;
    }
    withdraw(amount) {
        // نسحب المبلغ
        super.withdraw(amount);
        // وبعدين نسحب رسوم التأمين
        super.withdraw(this.feePerWithdraw);
    }
}
exports.InsuranceDecorator = InsuranceDecorator;

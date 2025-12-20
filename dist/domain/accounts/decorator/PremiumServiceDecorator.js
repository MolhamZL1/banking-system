"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumServiceDecorator = void 0;
const AccountDecorator_1 = require("./AccountDecorator");
class PremiumServiceDecorator extends AccountDecorator_1.AccountDecorator {
    constructor(wrap, cashbackRate = 0.005) {
        super(wrap);
        this.cashbackRate = cashbackRate;
    }
    deposit(amount) {
        const cashback = amount * this.cashbackRate;
        return super.deposit(amount + cashback);
    }
}
exports.PremiumServiceDecorator = PremiumServiceDecorator;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedRateInterest = void 0;
class FixedRateInterest {
    constructor(annualRate) {
        this.annualRate = annualRate;
    }
    calculate(balance, context) {
        return Math.max(balance, 0) * this.annualRate;
    }
}
exports.FixedRateInterest = FixedRateInterest;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketBasedInterest = void 0;
class MarketBasedInterest {
    constructor(baseRate, premiumBonus = 0.01) {
        this.baseRate = baseRate;
        this.premiumBonus = premiumBonus;
    }
    calculate(balance, context) {
        const b = Math.max(balance, 0);
        const market = context?.marketRate ?? 0;
        const premium = context?.isPremium ? this.premiumBonus : 0;
        return b * (this.baseRate + market + premium);
    }
}
exports.MarketBasedInterest = MarketBasedInterest;

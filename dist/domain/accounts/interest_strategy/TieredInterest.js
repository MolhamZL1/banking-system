"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TieredInterest = void 0;
class TieredInterest {
    constructor(tier1Limit, tier1Rate, tier2Rate) {
        this.tier1Limit = tier1Limit;
        this.tier1Rate = tier1Rate;
        this.tier2Rate = tier2Rate;
    }
    calculate(balance, context) {
        const b = Math.max(balance, 0);
        const tier1 = Math.min(b, this.tier1Limit);
        const tier2 = Math.max(b - this.tier1Limit, 0);
        return tier1 * this.tier1Rate + tier2 * this.tier2Rate;
    }
}
exports.TieredInterest = TieredInterest;

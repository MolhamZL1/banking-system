"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDecorators = applyDecorators;
const CheckingAccount_1 = require("../composite/CheckingAccount");
const InsuranceDecorator_1 = require("./InsuranceDecorator");
const PremiumServiceDecorator_1 = require("./PremiumServiceDecorator");
const OverdraftDecorator_1 = require("./OverdraftDecorator");
const unwrap_1 = require("./unwrap");
function applyDecorators(base, features) {
    let acc = base;
    const overdraft = features.find(f => f.type === "OVERDRAFT_PLUS");
    if (overdraft) {
        const raw = (0, unwrap_1.unwrapToBase)(base);
        if (raw instanceof CheckingAccount_1.CheckingAccount) {
            const extra = overdraft.numberValue ?? 100;
            acc = new OverdraftDecorator_1.OverdraftDecorator(raw, extra);
        }
    }
    for (const f of features) {
        if (f.type === "PREMIUM") {
            acc = new PremiumServiceDecorator_1.PremiumServiceDecorator(acc, 0.005);
        }
        if (f.type === "INSURANCE") {
            const fee = f.numberValue ?? 2;
            acc = new InsuranceDecorator_1.InsuranceDecorator(acc, fee);
        }
    }
    return acc;
}

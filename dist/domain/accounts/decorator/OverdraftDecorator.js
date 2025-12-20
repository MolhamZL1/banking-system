"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverdraftDecorator = void 0;
// src/domain/accounts/decorator/OverdraftDecorator.ts
const AccountDecorator_1 = require("./AccountDecorator");
class OverdraftDecorator extends AccountDecorator_1.AccountDecorator {
    constructor(wrap, extraLimit) {
        super(wrap);
        if (extraLimit <= 0)
            throw new Error('extraLimit must be positive');
        wrap.setOverdraftLimit(wrap.getOverdraftLimit() + extraLimit);
    }
}
exports.OverdraftDecorator = OverdraftDecorator;

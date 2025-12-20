"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountMapper = void 0;
const AccountFactory_1 = require("../../domain/accounts/AccountFactory");
const AccountGroup_1 = require("../../domain/accounts/composite/AccountGroup");
// استيراد الـ States
const ActiveState_1 = require("../../domain/accounts/state/ActiveState");
const FrozenState_1 = require("../../domain/accounts/state/FrozenState");
const SuspendedState_1 = require("../../domain/accounts/state/SuspendedState");
const ClosedState_1 = require("../../domain/accounts/state/ClosedState");
class AccountMapper {
    static toDomain(db) {
        if (db.accountType === 'GROUP') {
            const group = new AccountGroup_1.AccountGroup(db.id.toString(), `Group#${db.id}`);
            (db.subAccounts ?? []).forEach(child => {
                group.add(this.toDomain(child));
            });
            return group;
        }
        // 2. إذا لم يكن لديه -> Leaf
        const leaf = AccountFactory_1.AccountFactory.create({
            id: db.id.toString(),
            name: db.name,
            type: db.accountType,
            initialBalance: Number(db.balance),
            state: db.state === 'ACTIVE' ? new ActiveState_1.ActiveState() :
                db.state === 'FROZEN' ? new FrozenState_1.FrozenState() :
                    db.state === 'SUSPENDED' ? new SuspendedState_1.SuspendedState() :
                        new ClosedState_1.ClosedState(),
        });
        return leaf;
    }
    static balanceToDbDecimal(balance) {
        const { Prisma } = require('@prisma/client');
        return new Prisma.Decimal(balance);
    }
}
exports.AccountMapper = AccountMapper;

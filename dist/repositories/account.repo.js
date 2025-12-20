"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepo = void 0;
const client_1 = __importDefault(require("../infrastructure/prisma/client"));
const account_mapper_1 = require("../application/mappers/account.mapper");
const AccountLeaf_1 = require("../domain/accounts/composite/AccountLeaf");
const applyDecorators_1 = require("../domain/accounts/decorator/applyDecorators");
const unwrap_1 = require("../domain/accounts/decorator/unwrap");
class AccountRepo {
    // original (non-decorated) read
    async findById(id) {
        const dbAcc = await client_1.default.account.findUnique({
            where: { id },
            include: { subAccounts: true }
        });
        if (!dbAcc)
            return null;
        return account_mapper_1.AccountMapper.toDomain(dbAcc);
    }
    // decorated read (applies features stored in DB)
    async findByIdDecorated(id) {
        const dbAcc = await client_1.default.account.findUnique({
            where: { id },
            include: { subAccounts: true, features: true }
        });
        if (!dbAcc)
            return null;
        const domain = account_mapper_1.AccountMapper.toDomain(dbAcc);
        if (dbAcc.accountType === 'GROUP')
            return domain;
        const features = (dbAcc.features ?? []).map((f) => ({
            type: f.type,
            numberValue: f.numberValue ? Number(f.numberValue) : null
        }));
        return (0, applyDecorators_1.applyDecorators)(domain, features);
    }
    async save(account) {
        const raw = (0, unwrap_1.unwrapToBase)(account);
        const data = {
            balance: account_mapper_1.AccountMapper.balanceToDbDecimal(account.getBalance()),
        };
        if (raw instanceof AccountLeaf_1.AccountLeaf) {
            data.state = raw.getState();
        }
        await client_1.default.account.update({
            where: { id: Number(account.getId()) },
            data
        });
    }
    async create(data) {
        const dbAccount = await client_1.default.account.create({ data });
        return account_mapper_1.AccountMapper.toDomain(dbAccount);
    }
    async createGroup(params) {
        const dbAccount = await client_1.default.account.create({
            data: {
                userId: params.userId,
                accountType: 'GROUP',
                balance: 0,
                state: 'ACTIVE',
                name: params.name
            },
        });
        return account_mapper_1.AccountMapper.toDomain(dbAccount);
    }
    async setParent(childId, parentId) {
        await client_1.default.account.update({
            where: { id: childId },
            data: { parentAccountId: parentId },
        });
    }
    async removeParent(childId) {
        await client_1.default.account.update({
            where: { id: childId },
            data: { parentAccountId: null },
        });
    }
    async findManyByUserId(userId) {
        const list = await client_1.default.account.findMany({
            where: { userId, parentAccountId: null },
            include: { subAccounts: true, features: true }
        });
        return list.map(dbAcc => {
            const domain = account_mapper_1.AccountMapper.toDomain(dbAcc);
            if (dbAcc.accountType === 'GROUP')
                return domain;
            const features = (dbAcc.features ?? []).map((f) => ({
                type: f.type,
                numberValue: f.numberValue ? Number(f.numberValue) : null
            }));
            return (0, applyDecorators_1.applyDecorators)(domain, features);
        });
    }
    async search(filters) {
        const where = {};
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.accountType)
            where.accountType = filters.accountType;
        if (filters.state)
            where.state = filters.state;
        if (filters.minBalance !== undefined || filters.maxBalance !== undefined) {
            where.balance = {};
            if (filters.minBalance !== undefined)
                where.balance.gte = filters.minBalance;
            if (filters.maxBalance !== undefined)
                where.balance.lte = filters.maxBalance;
        }
        const accounts = await client_1.default.account.findMany({
            where,
            include: { user: { select: { username: true, email: true } } },
        });
        return accounts.map(acc => ({
            id: acc.id,
            type: acc.accountType,
            balance: Number(acc.balance),
            state: acc.state,
            user: acc.user,
        }));
    }
    async getOwnerUserIdByAccountId(accountId) {
        const acc = await client_1.default.account.findUnique({
            where: { id: accountId },
            select: { userId: true },
        });
        if (!acc)
            throw new Error('Account not found');
        return acc.userId;
    }
    // ---- features (Decorator persistence) ----
    async addFeature(accountId, type, numberValue) {
        const { Prisma } = require('@prisma/client');
        return client_1.default.accountFeature.upsert({
            where: { accountId_type: { accountId, type } },
            update: { numberValue: numberValue !== undefined ? new Prisma.Decimal(numberValue) : undefined },
            create: {
                accountId,
                type,
                numberValue: numberValue !== undefined ? new Prisma.Decimal(numberValue) : undefined,
            },
        });
    }
    async removeFeature(accountId, type) {
        return client_1.default.accountFeature.delete({
            where: { accountId_type: { accountId, type } },
        });
    }
}
exports.AccountRepo = AccountRepo;

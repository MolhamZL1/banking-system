"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const account_mapper_1 = require("../mappers/account.mapper");
const http_error_1 = require("../errors/http-error");
const state_1 = require("../../domain/accounts/state");
const AccountLeaf_1 = require("../../domain/accounts/composite/AccountLeaf");
const AccountGroup_1 = require("../../domain/accounts/composite/AccountGroup");
const client_1 = __importDefault(require("../../infrastructure/prisma/client"));
const unwrap_1 = require("../../domain/accounts/decorator/unwrap");
class AccountsService {
    constructor(repo, notifications) {
        this.repo = repo;
        this.notifications = notifications;
    }
    async createAccount(params) {
        if (params.parentAccountId) {
            const parent = await this.repo.findById(params.parentAccountId);
            if (!parent)
                throw new http_error_1.HttpError(404, 'Parent account not found');
        }
        const created = await this.repo.create({
            user: { connect: { id: params.userId } },
            accountType: params.accountType,
            name: params.name,
            balance: account_mapper_1.AccountMapper.balanceToDbDecimal(params.initialBalance ?? 0),
            parentAccount: params.parentAccountId
                ? { connect: { id: params.parentAccountId } }
                : undefined,
        });
        const event = {
            type: 'ACCOUNT_CREATED',
            at: new Date(),
            userId: params.userId,
            message: `Account ${created.getName()} has been created`,
            accountId: Number(created.getId()),
            accountName: created.getName(),
        };
        await this.notifications.notify(event);
        return created;
    }
    async getAccount(id) {
        const acc = await this.repo.findByIdDecorated(id);
        if (!acc)
            throw new http_error_1.HttpError(404, 'Account not found');
        return acc;
    }
    async listUserAccounts(userId) {
        return this.repo.findManyByUserId(userId);
    }
    async listAccountsApi(requester, userIdParam) {
        const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
        const target = staff && userIdParam ? userIdParam : requester.userId;
        return this.listUserAccounts(target);
    }
    async renameAccountApi(requester, accountId, newName) {
        const acc = await client_1.default.account.findUnique({ where: { id: accountId }, select: { id: true, userId: true, accountType: true } });
        if (!acc)
            throw new http_error_1.HttpError(404, "Account not found");
        const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
        if (!staff && acc.userId !== requester.userId)
            throw new http_error_1.HttpError(403, "Forbidden");
        await client_1.default.account.update({ where: { id: accountId }, data: { name: newName } });
        return { ok: true };
    }
    async changeState(id, action) {
        const account = await this.repo.findByIdDecorated(id);
        if (!account)
            throw new http_error_1.HttpError(404, 'Account not found');
        const raw = (0, unwrap_1.unwrapToBase)(account);
        if (!(raw instanceof AccountLeaf_1.AccountLeaf)) {
            throw new http_error_1.HttpError(400, 'Cannot change state of an account group directly');
        }
        this.applyAction(raw, action);
        await this.repo.save(account);
        const owner = await this.repo.getOwnerUserIdByAccountId(id);
        const event = {
            type: 'ACCOUNT_STATE_CHANGED',
            at: new Date(),
            userId: owner,
            accountId: id,
            accountName: raw.getName(),
            message: `Account ${raw.getName()} has been ${action}`,
        };
        await this.notifications.notify(event);
        return raw;
    }
    applyAction(acc, action) {
        const actions = {
            [state_1.AccountStateAction.FREEZE]: () => acc.freeze(),
            [state_1.AccountStateAction.SUSPEND]: () => acc.suspend(),
            [state_1.AccountStateAction.ACTIVATE]: () => acc.activate(),
            [state_1.AccountStateAction.CLOSE]: () => acc.close(),
        };
        if (!actions[action])
            throw new http_error_1.HttpError(400, 'Invalid action');
        actions[action]();
    }
    async createAccountGroup(params) {
        const accounts = await Promise.all(params.childAccountIds.map(id => this.repo.findById(id)));
        if (accounts.some(acc => !acc))
            throw new http_error_1.HttpError(404, 'One or more accounts not found');
        const group = await this.repo.createGroup({ userId: params.userId, name: params.name });
        await Promise.all(params.childAccountIds.map(childId => this.repo.setParent(childId, Number(group.getId()))));
        return group;
    }
    async addToGroup(groupId, childAccountId) {
        const group = await this.repo.findById(groupId);
        const child = await this.repo.findById(childAccountId);
        if (!group || !child)
            throw new http_error_1.HttpError(404, 'Account not found');
        if (!(group instanceof AccountGroup_1.AccountGroup))
            throw new http_error_1.HttpError(400, 'Target is not a group account');
        await this.repo.setParent(childAccountId, groupId);
        return { message: 'Account added to group successfully' };
    }
    async removeFromGroup(groupId, childAccountId) {
        const group = await this.repo.findById(groupId);
        const child = await this.repo.findById(childAccountId);
        if (!group || !child)
            throw new http_error_1.HttpError(404, 'Account not found');
        if (!(group instanceof AccountGroup_1.AccountGroup))
            throw new http_error_1.HttpError(400, 'Target is not a group account');
        await this.repo.removeParent(childAccountId);
        return { message: 'Account removed from group successfully' };
    }
    async addFeature(accountId, input) {
        const acc = await client_1.default.account.findUnique({ where: { id: accountId } });
        if (!acc)
            throw new http_error_1.HttpError(404, 'Account not found');
        if (input.type === 'OVERDRAFT_PLUS' && acc.accountType !== 'CHECKING') {
            throw new http_error_1.HttpError(400, 'OVERDRAFT_PLUS only allowed for CHECKING accounts');
        }
        await this.repo.addFeature(accountId, input.type, input.numberValue);
        return { ok: true };
    }
    async removeFeature(accountId, type) {
        await this.repo.removeFeature(accountId, type);
        return { ok: true };
    }
    async searchAccounts(filters) {
        return this.repo.search(filters);
    }
}
exports.AccountsService = AccountsService;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const admin_repo_1 = require("../../repositories/admin.repo");
const http_error_1 = require("../errors/http-error");
function parseDateYYYYMMDD(s) {
    if (!s)
        return null;
    const ok = /^\\d{4}-\\d{2}-\\d{2}$/.test(s);
    if (!ok)
        throw new http_error_1.HttpError(400, "Invalid date format. Use YYYY-MM-DD");
    const d = new Date(s + "T00:00:00.000Z");
    if (Number.isNaN(d.getTime()))
        throw new http_error_1.HttpError(400, "Invalid date");
    return d;
}
class AdminService {
    constructor(repo = new admin_repo_1.AdminRepo()) {
        this.repo = repo;
    }
    dashboard() {
        return this.repo.dashboard();
    }
    dailyTx(dateStr) {
        const d = parseDateYYYYMMDD(dateStr) ?? new Date();
        return this.repo.dailyTransactionsReport(d);
    }
    accountsSummary(filters) {
        return this.repo.accountsSummaryReport(filters);
    }
    audit(filters) {
        const from = parseDateYYYYMMDD(filters.from) ?? undefined;
        const to = parseDateYYYYMMDD(filters.to) ?? undefined;
        return this.repo.auditReport({ from, to, userId: filters.userId, eventType: filters.eventType });
    }
}
exports.AdminService = AdminService;

import { AdminRepo } from "../../repositories/admin.repo";
import { HttpError } from "../errors/http-error";

function parseDateYYYYMMDD(s?: string) {
  if (!s) return null;
  const ok = /^\\d{4}-\\d{2}-\\d{2}$/.test(s);
  if (!ok) throw new HttpError(400, "Invalid date format. Use YYYY-MM-DD");
  const d = new Date(s + "T00:00:00.000Z");
  if (Number.isNaN(d.getTime())) throw new HttpError(400, "Invalid date");
  return d;
}

export class AdminService {
  constructor(private readonly repo = new AdminRepo()) {}

  dashboard() {
    return this.repo.dashboard();
  }

  dailyTx(dateStr?: string) {
    const d = parseDateYYYYMMDD(dateStr) ?? new Date();
    return this.repo.dailyTransactionsReport(d);
  }

  accountsSummary(filters: { userId?: number; type?: string; state?: string }) {
    return this.repo.accountsSummaryReport(filters);
  }

  audit(filters: { from?: string; to?: string; userId?: number; eventType?: string }) {
    const from = parseDateYYYYMMDD(filters.from) ?? undefined;
    const to = parseDateYYYYMMDD(filters.to) ?? undefined;
    return this.repo.auditReport({ from, to, userId: filters.userId, eventType: filters.eventType });
  }
}

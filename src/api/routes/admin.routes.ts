import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.middleware";
import { AdminService } from "../../application/services/admin.service";
import { AdminController } from "../controllers/admin.controller";

const router = Router();

const service = new AdminService();
const controller = new AdminController(service);

// Dashboard (monitoring)
router.get("/dashboard", requireAuth, requireRoles("ADMIN", "MANAGER"), controller.dashboard);

// Reports
router.get("/reports/transactions/daily", requireAuth, requireRoles("ADMIN", "MANAGER"), controller.dailyTx);
router.get("/reports/accounts/summary", requireAuth, requireRoles("ADMIN", "MANAGER"), controller.accountsSummary);
router.get("/reports/audit", requireAuth, requireRoles("ADMIN", "MANAGER"), controller.audit);

export default router;

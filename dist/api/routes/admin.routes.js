"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_service_1 = require("../../application/services/admin.service");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
const service = new admin_service_1.AdminService();
const controller = new admin_controller_1.AdminController(service);
// Dashboard (monitoring)
router.get("/dashboard", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRoles)("ADMIN", "MANAGER"), controller.dashboard);
// Reports
router.get("/reports/transactions/daily", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRoles)("ADMIN", "MANAGER"), controller.dailyTx);
router.get("/reports/accounts/summary", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRoles)("ADMIN", "MANAGER"), controller.accountsSummary);
router.get("/reports/audit", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRoles)("ADMIN", "MANAGER"), controller.audit);
exports.default = router;

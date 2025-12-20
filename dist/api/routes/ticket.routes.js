"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validateRequest_1 = require("../middleware/validateRequest");
const ticket_controller_1 = require("../controllers/ticket.controller");
const ticket_validation_1 = require("../validators/ticket.validation");
const router = (0, express_1.Router)();
const c = new ticket_controller_1.TicketController();
router.post("/", auth_middleware_1.requireAuth, (0, validateRequest_1.validateBody)(ticket_validation_1.CreateTicketSchema), c.create);
router.get("/", auth_middleware_1.requireAuth, c.list);
// Staff only
router.patch("/:id/status", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRoles)("ADMIN", "TELLER", "MANAGER"), (0, validateRequest_1.validateBody)(ticket_validation_1.UpdateTicketStatusSchema), c.setStatus);
exports.default = router;

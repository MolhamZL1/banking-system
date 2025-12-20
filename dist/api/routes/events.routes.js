"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const events_controller_1 = require("../controllers/events.controller");
const router = (0, express_1.Router)();
const c = new events_controller_1.EventsController();
router.get("/", auth_middleware_1.requireAuth, c.list);
exports.default = router;

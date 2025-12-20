"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const scheduled_runner_1 = require("./infrastructure/scheduler/scheduled-runner");
const PORT = process.env.PORT || 3000;
(0, scheduled_runner_1.startScheduledRunner)();
const server = app_1.default.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
process.on('SIGINT', () => {
    console.log('🔻 Shutting down...');
    server.close(() => process.exit(0));
});

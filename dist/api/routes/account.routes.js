"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_controller_1 = require("../controllers/account.controller");
const accounts_service_1 = require("../../application/services/accounts.service");
const account_repo_1 = require("../../repositories/account.repo");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validateRequest_1 = require("../middleware/validateRequest");
const account_validation_1 = require("../validators/account.validation");
const account_features_validation_1 = require("../validators/account.features.validation");
const notification_wiring_1 = require("../../application/notifications/notification.wiring");
const router = (0, express_1.Router)();
const repo = new account_repo_1.AccountRepo();
const notificationCenter = (0, notification_wiring_1.buildNotificationCenter)();
const service = new accounts_service_1.AccountsService(repo, notificationCenter);
const controller = new account_controller_1.AccountController(service);
// البحث
router.get('/search', auth_middleware_1.requireAuth, controller.search);
// list
router.get('/', auth_middleware_1.requireAuth, controller.listMine);
// الحسابات
router.post('/create', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRoles)('ADMIN', 'TELLER'), (0, validateRequest_1.validateBody)(account_validation_1.CreateAccountSchema), controller.create);
router.get('/:id', auth_middleware_1.requireAuth, controller.getById);
router.patch('/:id/rename', auth_middleware_1.requireAuth, (0, validateRequest_1.validateBody)(account_validation_1.RenameAccountSchema), controller.rename);
router.patch('/state/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRoles)('ADMIN', 'TELLER'), (0, validateRequest_1.validateBody)(account_validation_1.ChangeStateSchema), controller.changeState);
// Decorator Features
router.post('/:id/features', auth_middleware_1.requireAuth, (0, validateRequest_1.validateBody)(account_features_validation_1.AddFeatureSchema), controller.addFeature);
router.delete('/:id/features/:type', auth_middleware_1.requireAuth, controller.removeFeature);
// المجموعات
router.post('/groups/create', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRoles)('CUSTOMER'), (0, validateRequest_1.validateBody)(account_validation_1.CreateAccountGroupSchema), controller.createGroup);
router.post('/groups/:groupId/children', auth_middleware_1.requireAuth, controller.addToGroup);
router.delete('/groups/:groupId/children/:childId', auth_middleware_1.requireAuth, controller.removeFromGroup);
exports.default = router;

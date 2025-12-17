
import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { AccountsService } from '../../application/services/accounts.service';
import { AccountRepo } from '../../repositories/account.repo';
import { requireAuth, requireRoles } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validateRequest';
import { CreateAccountSchema, ChangeStateSchema, CreateAccountGroupSchema } from '../validators/account.validation';
import { buildNotificationCenter } from '../../application/notifications/notification.wiring';

const router = Router();

const repo = new AccountRepo();
const notificationCenter = buildNotificationCenter();
const service = new AccountsService(repo, notificationCenter);
const controller = new AccountController(service);

// البحث
router.get('/search', requireAuth, controller.search);

// الحسابات
router.post('/create', requireAuth, requireRoles('ADMIN', 'TELLER'), validateBody(CreateAccountSchema), controller.create);
router.get('/:id', requireAuth, controller.getById);
router.patch('/state/:id', requireAuth, requireRoles('ADMIN', 'TELLER'), validateBody(ChangeStateSchema), controller.changeState);

// المجموعات
router.post('/groups/create', requireAuth, requireRoles('CUSTOMER'),validateBody(CreateAccountGroupSchema), controller.createGroup);
router.post('/groups/:groupId/children', requireAuth, controller.addToGroup);
router.delete('/groups/:groupId/children/:childId', requireAuth, controller.removeFromGroup);

export default router;

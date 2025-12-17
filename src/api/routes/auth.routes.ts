import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validateRequest';
import { requireAuth, requireRoles } from '../middleware/auth.middleware';
import { RegisterSchema, ResendCodeSchema, VerifyEmailSchema, LoginSchema, RefreshSchema, CreateStaffSchema } from '../validators/auth.validators';

const router = Router();

router.post('/register', validateBody(RegisterSchema), AuthController.register);
router.post('/create-staff', requireAuth, requireRoles('ADMIN') ,validateBody(CreateStaffSchema), AuthController.createStaff);
router.post('/resend-code', validateBody(ResendCodeSchema), AuthController.resendCode);
router.post('/verify-email', validateBody(VerifyEmailSchema), AuthController.verifyEmail);

router.post('/login', validateBody(LoginSchema), AuthController.login);
router.post('/refresh', validateBody(RefreshSchema), AuthController.refresh);
router.post('/logout', validateBody(RefreshSchema), AuthController.logout);

router.get('/me', requireAuth, AuthController.me);

export default router;

import { Router } from 'express';
import accountRoutes from './account.routes';
import authRoutes from './auth.routes';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);

export default router;

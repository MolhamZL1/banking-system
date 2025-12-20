import adminRoutes from "./admin.routes";
import { Router } from 'express';
import accountRoutes from './account.routes';
import authRoutes from './auth.routes';
import transactionRoutes from './transaction.routes';
import notificationRoutes from './notifications.routes';
import ticketRoutes from './ticket.routes';
import eventsRoutes from './events.routes';
import scheduledRoutes from './scheduledTransaction.routes';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/admin', adminRoutes);

router.use('/notifications', notificationRoutes);
router.use('/tickets', ticketRoutes);
router.use('/events', eventsRoutes);
router.use('/scheduled-transactions', scheduledRoutes);

export default router;

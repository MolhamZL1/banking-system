import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validateRequest";
import { CreateTransactionSchema } from "../validators/transaction.validation";
import { TransactionController } from "../controllers/transaction.controller";
import { TransactionsService } from "../../application/services/transactions.service";
import { AccountRepo } from "../../repositories/account.repo";
import { TransactionRepo } from "../../repositories/transaction.repo";
import { buildNotificationCenter } from "../../application/notifications/notification.wiring";
import { z } from "zod";

const router = Router();

const service = new TransactionsService(new AccountRepo(), new TransactionRepo(), buildNotificationCenter());
const controller = new TransactionController(service);

router.post("/", requireAuth, validateBody(CreateTransactionSchema), controller.create);

// approvals
router.get("/pending", requireAuth, requireRoles("ADMIN", "TELLER", "MANAGER"), controller.pending);
router.patch("/:id/approve", requireAuth, requireRoles("ADMIN", "TELLER", "MANAGER"), controller.approve);
router.patch("/:id/reject", requireAuth, requireRoles("ADMIN", "TELLER", "MANAGER"), validateBody(z.object({ reason: z.string().optional() })), controller.reject);

export default router;

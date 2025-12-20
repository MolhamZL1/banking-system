import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validateRequest";
import { ScheduledTransactionController } from "../controllers/scheduledTransaction.controller";
import { CreateScheduledTxSchema } from "../validators/scheduledTransaction.validation";

const router = Router();
const c = new ScheduledTransactionController();

router.post("/", requireAuth, validateBody(CreateScheduledTxSchema), c.create);
router.get("/", requireAuth, c.list);
router.patch("/:id/stop", requireAuth, c.stop);
router.patch("/:id/resume", requireAuth, c.resume);

export default router;

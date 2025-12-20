import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { NotificationsController } from "../controllers/notifications.controller";

const router = Router();
const c = new NotificationsController();

router.get("/", requireAuth, c.list);
router.patch("/:id/read", requireAuth, c.read);

export default router;

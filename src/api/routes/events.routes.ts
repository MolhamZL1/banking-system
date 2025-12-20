import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { EventsController } from "../controllers/events.controller";

const router = Router();
const c = new EventsController();

router.get("/", requireAuth, c.list);

export default router;

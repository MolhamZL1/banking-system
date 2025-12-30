import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validateRequest";
import { TicketController } from "../controllers/ticket.controller";
import { CreateTicketSchema, UpdateTicketStatusSchema } from "../validators/ticket.validation";

const router = Router();
const c = new TicketController();

router.post("/", requireAuth, validateBody(CreateTicketSchema), c.create);
router.get("/", requireAuth, c.list);

router.patch("/:id/status", requireAuth, requireRoles("ADMIN", "TELLER", "MANAGER"), validateBody(UpdateTicketStatusSchema), c.setStatus);

export default router;

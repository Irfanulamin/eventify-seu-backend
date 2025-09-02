import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controllers";
import { upload } from "../services/upload.services";

const router = Router();

router.post("/", upload.single("image"), createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.patch("/update/:id", upload.single("image"), updateEvent);
router.delete("/delete/:id", deleteEvent);

export default router;

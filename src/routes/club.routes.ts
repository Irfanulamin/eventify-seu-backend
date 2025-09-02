import { Router } from "express";
import {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
} from "../controllers/club.controllers";
import { upload } from "../services/upload.services";

const router = Router();

router.post("/", upload.single("image"), createClub);
router.get("/", getAllClubs);
router.get("/:id", getClubById);
router.patch("/update/:id", upload.single("image"), updateClub);
router.delete("/delete/:id", deleteClub);

export default router;

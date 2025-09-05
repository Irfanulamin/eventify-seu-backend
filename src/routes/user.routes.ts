import { Router } from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  createUser,
} from "../controllers/user.controllers";

const router = Router();

router.get("/", getAllUsers);
router.patch("/:id/role", updateUserRole);
router.delete("/delete/:id", deleteUser);
router.post("/create-user", createUser);

export default router;

import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controllers";

const router = Router();

router.get("/", getAnalytics);

export default router;

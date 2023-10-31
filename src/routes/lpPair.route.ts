import { Router } from "express";
import * as LpPairController from "../controllers/lpPair.controller";

const router = Router();

router.get("/", LpPairController.getLpPairs);

export default router;

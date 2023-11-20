import { Router } from "express";
import * as LpPairController from "../controllers/lpPair.controller";

const router = Router();

router.get("/", LpPairController.getLpPairs);
router.get("/all-pools", LpPairController.getAllPairsDataForAllPool);
router.get("/positions", LpPairController.getAllPairsDataForPosition);

export default router;

import { Router } from "express";
import * as MerlinPoolController from "../controllers/merlinPool.controller";

const router = Router();

router.get("/info/:address", MerlinPoolController.getInfo);
router.get("/", MerlinPoolController.getAllMerlinPoolsData);

export default router;

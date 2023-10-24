import { Router } from "express";
import * as TxController from "../controllers/tx.controller";

const router = Router();

router.get("/", TxController.getAllTimeTotalVolume);
router.get("/lp", TxController.getTotalVolumeByLp);

export default router;

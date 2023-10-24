import { Router } from 'express';
import * as TxController from '../controllers/tx.controller';

const router = Router();

router.get('/', TxController.getTxsByPairAddress);
router.get('/24h', TxController.getLast24hTotalVolumeByLPAddress);

export default router;
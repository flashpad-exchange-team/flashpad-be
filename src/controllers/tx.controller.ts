import { Request, Response } from 'express';
import txService from '../services/tx.service';

export const getTxsByPairAddress = async (req: Request, res: Response) => {
  try {
    const address = req.query.address as string;

    const result = await txService.getTxsByPairAddress(address);

    const response: any = {
      data: result,
      message: 'ok',
    };

    return res.status(200).json(response);
  } catch (err: any) {
    console.error(`getTxsByPairAddress error: ${err?.message || err}`);
    return res.status(400).json({
      message: err?.message || 'Bad request',
    });
  }
};

export const getLast24hTotalVolumeByLPAddress = async (req: Request, res: Response) => {
  try {
    const address = req.query.address as string;

    const result = await txService.getLast24hTotalVolumeByLPAddress(address);

    const response: any = {
      data: result,
      message: 'ok',
    };

    return res.status(200).json(response);
  } catch (err: any) {
    console.error(`getLast24hTotalVolumeByLPAddress error: ${err?.message || err}`);
    return res.status(500).json({
      message: err?.message || 'Internal server error',
    });
  }
}
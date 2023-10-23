import { Request, Response } from 'express';
import lpPairService from '../services/lpPair.service';

export const getAllLpPairs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    // const isRead = typeof req.query.isRead === 'undefined' ? undefined : !!req.query.isRead;

    const result = await lpPairService.getAllPairs(
        page,
        limit,
    );

    const { total, data } = result;
    const response: any = {
        data,
        message: 'ok',
        total,
        page,
        limit,
    };

    return res.status(200).json(response);
  } catch (err: any) {
    console.error(`getAllLpPairs error: ${err?.message || err}`);
    return res.status(400).json({
        message: err?.message || 'Bad request',
    });
  }
};
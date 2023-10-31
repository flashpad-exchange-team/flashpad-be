import { Request, Response } from "express";
import * as lpPairService from "../services/lpPair.service";

export const getLpPairs = async (req: Request, res: Response) => {
	try {
		const address = req.query.address as string;
		if (!!address) {
			return getOneLpPair(res, address);
		}

		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		const result = await lpPairService.getAllPairs(page, limit);

		const { total, data } = result;
		const response: any = {
			data,
			message: "ok",
			total,
			page,
			limit,
		};

		return res.status(200).json(response);
	} catch (err: any) {
		console.error(`getAllLpPairs error: ${err?.message || err}`);
		return res.status(500).json({
			message: err?.message || "Internal server error",
		});
	}
};

const getOneLpPair = async (res: Response, address: string) => {
	try {
		const data = await lpPairService.getOnePair(address);

		const response: any = {
			message: "ok",
			data,
		};

		return res.status(200).json(response);
	} catch (err: any) {
		console.error(`getAllLpPairs error: ${err?.message || err}`);
		return res.status(500).json({
			message: err?.message || "Internal server error",
		});
	}
};

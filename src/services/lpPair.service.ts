import * as lpPairRepository from "../repositories/lpPair.repository";
import * as txService from "./tx.service";
import { instanceToPlain } from "class-transformer";

export const getAllPairs = async (page: number, limit: number) => {
	const { total, data: allPairsData } = await lpPairRepository.getAllPairs(page, limit);
	const result = await Promise.all(allPairsData.map(async (pair) => {
		const tvl = await txService.getTotalVolumeByLp(pair.address, false);
		const tvl24h = await txService.getTotalVolumeByLp(pair.address, true);
		return {
			...instanceToPlain(pair),
			tvl,
			tvl24h,
		}
	}));
	return {
		total,
		data: result,
	};
};

export const getOnePair = async (lpAddress: string) => {
	const pairData = await lpPairRepository.getPairByAddress(lpAddress);

	const tvl = await txService.getTotalVolumeByLp(pairData.address, false);
	const tvl24h = await txService.getTotalVolumeByLp(pairData.address, true);

	return {
		...instanceToPlain(pairData),
		tvl,
		tvl24h,
	}
};

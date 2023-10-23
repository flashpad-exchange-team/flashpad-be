import { LpPairEntity } from "../entities/lpPair.entity";
import { In, getRepository } from "typeorm";

const lpPairRepository = () => getRepository(LpPairEntity);

export const getAllPairs = async (page: number, limit: number) => {
	const [data, total] = await lpPairRepository().findAndCount({
		skip: (page - 1) * limit,
		take: limit,
	});
	return { total, data };
};

export const getPairByAddress = async (address: string) => {
	const lpPair = await lpPairRepository().findOne({
		where: { address },
	});
	return lpPair;
};

export const createPair = async (
	pairAddress: string,
	token1Address: string,
	token2Address: string
) => {
	const lpPairObj: Partial<LpPairEntity> = {
		address: pairAddress,
		token1_address: token1Address,
		token2_address: token2Address,
	};

	const lpPair = await lpPairRepository().save(lpPairObj);

	return lpPair;
};

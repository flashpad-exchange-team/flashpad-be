import * as lpPairRepository from "../repositories/lpPair.repository";

const getAllPairs = async (page: number, limit: number) => {
	return await lpPairRepository.getAllPairs(page, limit);
};

export default {
	getAllPairs,
};

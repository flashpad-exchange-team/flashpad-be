import { MerlinPoolEntity } from "../entities/merlinPool.entity";
import { getRepository } from "typeorm";

const merlinPoolRepository = () => getRepository(MerlinPoolEntity);

export const getAllMerlinPools = async (page: number, limit: number) => {
	const queryBuilder = merlinPoolRepository()
		.createQueryBuilder("merlin_pools")
		.innerJoinAndSelect("merlin_pools.nft_pool", "nft_pools")
    .skip((page - 1) * limit)
    .take(limit);

	const [data, total] = await queryBuilder.getManyAndCount();
	return { total, data };
};
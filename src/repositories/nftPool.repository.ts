import { NftPoolEntity } from "../entities/nftPool.entity";
import { getRepository } from "typeorm";
import * as lpPairRepository from "./lpPair.repository";

const nftPoolRepository = () => getRepository(NftPoolEntity);

export const getAllNftPools = async (page: number, limit: number) => {
	const queryBuilder = nftPoolRepository()
		.createQueryBuilder("nft_pools")
		.innerJoinAndSelect("nft_pools.lp_pair", "lp_pairs")
    .skip((page - 1) * limit)
    .take(limit);

	const [data, total] = await queryBuilder.getManyAndCount();
	return { total, data };
};

export const createNftPool = async (
	lpAddress: string,
	nftPoolAddress: string,
) => {
  const lpPair = await lpPairRepository.getPairByAddress(lpAddress);

  if (!lpPair) {
    throw new Error(`LpPair with address ${lpAddress} not found`);
  }

	const nftPoolObj: Partial<NftPoolEntity> = {
    pair_id: lpPair.id,
		address: nftPoolAddress,
	};

	const nftPool = await nftPoolRepository().save(nftPoolObj);

	return nftPool;
};

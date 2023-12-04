import { getRepository } from "typeorm";
import { MerlinPoolEntity } from "../entities/merlinPool.entity";
import * as nftPoolRepository from "./nftPool.repository";

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

export const getMerlinPoolsByConditions = async (
  conditions: Record<string, any>
) => {
  return merlinPoolRepository().find({ where: conditions });
};

export const getOneMerlinPoolByConditions = async (
  conditions: Record<string, any>
) => {
  return merlinPoolRepository().findOne({
    where: conditions,
    relations: ["nft_pool", "nft_pool.lp_pair"],
  });
};

export const createMerlinPool = async (
  merlinPoolAddress: string,
  nftPoolAddress: string,
) => {
  const nftPool = await nftPoolRepository.getNftPoolByAddress(nftPoolAddress);

	const merlinPoolObj: Partial<MerlinPoolEntity> = {
    address: merlinPoolAddress,
    ...(nftPool ? { nft_pool_id: nftPool.id } : {}),
	};

	const merlinPool = await merlinPoolRepository().save(merlinPoolObj);

	return merlinPool;
};

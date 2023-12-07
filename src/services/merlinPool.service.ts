import * as merlinPoolRepository from "../repositories/merlinPool.repository";

export const getMerlinPoolByAddress = (address: string) => {
  return merlinPoolRepository.getOneMerlinPoolByConditions({ address });
};

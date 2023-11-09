import * as merlinPoolRepository from "../repositories/merlinPool.repository";
import { instanceToPlain } from "class-transformer";

export const getMerlinPoolByAddress = (address: string) => {
  return merlinPoolRepository.getOneMerlinPoolByConditions({ address });
};

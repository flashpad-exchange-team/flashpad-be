import { LpPairEntity } from "../entities/lpPair.entity";
import { In, getRepository } from "typeorm";

const lpPairRepository = () => getRepository(LpPairEntity);

const getAllPairs = async (
  page: number,
  limit: number,
) => {
  const [data, total] = await lpPairRepository().findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });
  return { total, data };
};

export default { getAllPairs };
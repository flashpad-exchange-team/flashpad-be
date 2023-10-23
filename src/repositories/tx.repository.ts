import { TransactionEntity } from "../entities/tx.entity";
import { In, getRepository } from "typeorm";

const txRepository = () => getRepository(TransactionEntity);

export const getAllTxs = async (page: number, limit: number) => {
	const [data, total] = await txRepository().findAndCount({
		skip: (page - 1) * limit,
		take: limit,
	});
	return { total, data };
};

export const getTxsByPairAddress = async (address: string) => {
	const queryBuilder = txRepository()
		.createQueryBuilder("transactions")
		.innerJoinAndSelect(
			"transactions.lp_pair",
			"lp_pairs"
		)
		.where("lp_pairs.address = :address", { address });

	const transactions = await queryBuilder.getMany();

	return transactions;
};

export const createTx = async (
  pairId: string,
	txHash: string,
	token1Amount: string,
	token2Amount: string,
) => {
	const txObj: Partial<TransactionEntity> = {
    pair_id: pairId,
		tx_hash: txHash,
		token1_amount: token1Amount,
		token2_amount: token2Amount,
	};

	const tx = await txRepository().save(txObj);

	return tx;
};

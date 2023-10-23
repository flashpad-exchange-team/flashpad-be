import { Entity, Column, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "./base.entity";
import { LpPairEntity } from "./lpPair.entity";

@Entity("transactions")
@Unique(["tx_hash"])
export class TransactionEntity extends BaseEntity {
	@Column({ name: "tx_hash" })
	tx_hash: string;

	@Column({ name: "token1_amount" })
	token1_amount: string;

	@Column({ name: "token2_amount" })
	token2_amount: string;

	@ManyToOne(() => LpPairEntity, (pair) => pair.transactions, {
		onDelete: "CASCADE",
	})
	lp_pair: LpPairEntity;

	@Column({ name: "pair_id" })
	pair_id: string;
}

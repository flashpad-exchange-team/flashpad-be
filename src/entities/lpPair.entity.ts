import { Entity, Column, OneToMany, Unique } from "typeorm";
import { BaseEntity } from "./base.entity";
import { TransactionEntity } from "./tx.entity";

@Entity("lp_pairs")
@Unique(["address"])
@Unique(["token1_address", "token2_address"])
export class LpPairEntity extends BaseEntity {
	@Column()
	address: string;

	@Column({ name: "token1_address" })
	token1_address: string;

	@Column({ name: "token2_address" })
	token2_address: string;

	@OneToMany(() => TransactionEntity, (tx) => tx.lp_pair)
	transactions: TransactionEntity[];
}

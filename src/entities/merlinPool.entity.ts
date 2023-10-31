import { Entity, Column, Unique, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { NftPoolEntity } from "./nftPool.entity";

@Entity("merlin_pools")
@Unique(["address"])
export class MerlinPoolEntity extends BaseEntity {
	@Column()
	address: string;

  @OneToOne(() => NftPoolEntity, (nftPool) => nftPool.merlin_pool, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "nft_pool_id", referencedColumnName: "id" })
	nft_pool: NftPoolEntity;

	@Column({ name: "nft_pool_id" })
	nft_pool_id: string;
}

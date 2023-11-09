import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMerlinPoolsTable1699541868574 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE merlin_pools ALTER COLUMN nft_pool_id DROP NOT NULL`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
			`ALTER TABLE merlin_pools ALTER COLUMN nft_pool_id SET NOT NULL`
		);
    }
}

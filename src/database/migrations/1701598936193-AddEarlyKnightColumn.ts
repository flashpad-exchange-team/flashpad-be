import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEarlyKnightColumn1701598936193 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
        const query = `ALTER TABLE merlin_pools ADD COLUMN is_early_knight BOOLEAN`;
		await queryRunner.query(query);
    }

	public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE merlin_pools DROP COLUMN is_early_knight`
        );
    }
}

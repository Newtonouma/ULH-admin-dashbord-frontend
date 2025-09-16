import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTeamImageUrls1737471900000 implements MigrationInterface {
  name = 'UpdateTeamImageUrls1737471900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Starting migration: Converting Team imageUrl to imageUrls array');

    // First, add the new imageUrls column
    await queryRunner.query(`
      ALTER TABLE "teams" 
      ADD COLUMN "imageUrls" text
    `);

    // Convert existing imageUrl values to imageUrls array format
    await queryRunner.query(`
      UPDATE "teams" 
      SET "imageUrls" = "imageUrl"
      WHERE "imageUrl" IS NOT NULL AND "imageUrl" != ''
    `);

    // Drop the old imageUrl column
    await queryRunner.query(`
      ALTER TABLE "teams" 
      DROP COLUMN "imageUrl"
    `);

    console.log('Migration completed: Team imageUrl converted to imageUrls array');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Starting rollback: Converting Team imageUrls array back to imageUrl');

    // Add back the imageUrl column
    await queryRunner.query(`
      ALTER TABLE "teams" 
      ADD COLUMN "imageUrl" character varying
    `);

    // Convert imageUrls array back to single imageUrl (take first URL if multiple)
    await queryRunner.query(`
      UPDATE "teams" 
      SET "imageUrl" = "imageUrls"
      WHERE "imageUrls" IS NOT NULL AND "imageUrls" != ''
    `);

    // Drop the imageUrls column
    await queryRunner.query(`
      ALTER TABLE "teams" 
      DROP COLUMN "imageUrls"
    `);

    console.log('Rollback completed: Team imageUrls converted back to imageUrl');
  }
}
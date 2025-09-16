import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEventImageUrls1737471800000 implements MigrationInterface {
  name = 'UpdateEventImageUrls1737471800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Starting migration: Converting Event imageUrl to imageUrls array');

    // First, add the new imageUrls column
    await queryRunner.query(`
      ALTER TABLE "events" 
      ADD COLUMN "imageUrls" text
    `);

    // Convert existing imageUrl values to imageUrls array format
    await queryRunner.query(`
      UPDATE "events" 
      SET "imageUrls" = "imageUrl"
      WHERE "imageUrl" IS NOT NULL AND "imageUrl" != ''
    `);

    // Drop the old imageUrl column
    await queryRunner.query(`
      ALTER TABLE "events" 
      DROP COLUMN "imageUrl"
    `);

    console.log('Migration completed: Event imageUrl converted to imageUrls array');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Starting rollback: Converting Event imageUrls array back to imageUrl');

    // Add back the imageUrl column
    await queryRunner.query(`
      ALTER TABLE "events" 
      ADD COLUMN "imageUrl" character varying
    `);

    // Convert imageUrls array back to single imageUrl (take first URL if multiple)
    await queryRunner.query(`
      UPDATE "events" 
      SET "imageUrl" = "imageUrls"
      WHERE "imageUrls" IS NOT NULL AND "imageUrls" != ''
    `);

    // Drop the imageUrls column
    await queryRunner.query(`
      ALTER TABLE "events" 
      DROP COLUMN "imageUrls"
    `);

    console.log('Rollback completed: Event imageUrls converted back to imageUrl');
  }
}
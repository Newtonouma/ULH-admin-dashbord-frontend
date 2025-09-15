import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSocialMediaAndContactToTeams1735679400000 implements MigrationInterface {
  name = 'AddSocialMediaAndContactToTeams1735679400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add contact and social media columns to teams table
    await queryRunner.query(`
      ALTER TABLE "teams" 
      ADD COLUMN "contact" varchar,
      ADD COLUMN "facebook" varchar,
      ADD COLUMN "email" varchar,
      ADD COLUMN "tiktok" varchar,
      ADD COLUMN "twitter" varchar,
      ADD COLUMN "linkedin" varchar
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove contact and social media columns from teams table
    await queryRunner.query(`
      ALTER TABLE "teams" 
      DROP COLUMN IF EXISTS "linkedin",
      DROP COLUMN IF EXISTS "twitter",
      DROP COLUMN IF EXISTS "tiktok",
      DROP COLUMN IF EXISTS "email",
      DROP COLUMN IF EXISTS "facebook",
      DROP COLUMN IF EXISTS "contact"
    `);
  }
}

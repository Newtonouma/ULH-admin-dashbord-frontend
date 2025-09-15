import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1735603200000 implements MigrationInterface {
  name = 'InitialSchema1735603200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create UUID extension if it doesn't exist
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create causes table
    await queryRunner.query(`
      CREATE TABLE "causes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" varchar NOT NULL,
        "goal" integer NOT NULL,
        "category" varchar NOT NULL,
        "description" text NOT NULL,
        "raised" decimal(12,2) NOT NULL DEFAULT '0',
        "imageUrl" varchar,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_causes_id" PRIMARY KEY ("id")
      )
    `);

    // Create cause_images table
    await queryRunner.query(`
      CREATE TABLE "cause_images" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "url" varchar NOT NULL,
        "alt" varchar,
        "causeId" uuid NOT NULL,
        CONSTRAINT "PK_cause_images_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cause_images_cause" FOREIGN KEY ("causeId") REFERENCES "causes"("id") ON DELETE CASCADE
      )
    `);

    // Create events table
    await queryRunner.query(`
      CREATE TABLE "events" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "date" TIMESTAMP NOT NULL,
        "location" varchar NOT NULL,
        "imageUrl" varchar,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_events_id" PRIMARY KEY ("id")
      )
    `);

    // Create teams table
    await queryRunner.query(`
      CREATE TABLE "teams" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text NOT NULL,
        "imageUrl" varchar,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_teams_id" PRIMARY KEY ("id")
      )
    `);

    // Create gallery table
    await queryRunner.query(`
      CREATE TABLE "gallery" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "imageUrl" varchar NOT NULL,
        "caption" varchar,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_gallery_id" PRIMARY KEY ("id")
      )
    `);

    // Create donations table
    await queryRunner.query(`
      CREATE TABLE "donations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "amount" decimal(12,2) NOT NULL,
        "donorName" varchar(255),
        "donorEmail" varchar(255),
        "causeId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_donations_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_donations_cause" FOREIGN KEY ("causeId") REFERENCES "causes"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "donations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "gallery"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "teams"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "events"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cause_images"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "causes"`);
  }
}

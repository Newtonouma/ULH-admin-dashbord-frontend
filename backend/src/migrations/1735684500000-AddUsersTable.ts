import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersTable1735684500000 implements MigrationInterface {
    name = 'AddUsersTable1735684500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the enum type already exists
        const enumExists = await queryRunner.query(`
            SELECT 1 FROM pg_type WHERE typname = 'users_role_enum'
        `);
        
        if (enumExists.length === 0) {
            await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin')`);
        }
        
        // Check if the users table already exists
        const tableExists = await queryRunner.query(`
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'users'
        `);
        
        if (tableExists.length === 0) {
            await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'admin', "resetToken" character varying, "resetTokenExpiry" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}
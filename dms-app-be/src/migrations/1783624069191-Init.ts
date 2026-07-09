import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1783624069191 implements MigrationInterface {
    name = 'Init1783624069191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favorites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "document_id" uuid, "folder_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."document_activity_activitytype_enum" AS ENUM('UPLOADED', 'VIEWED', 'UPDATED', 'SHARED', 'DOWNLOADED', 'RESTORED', 'MOVED', 'FAVORITED', 'UNFAVORITED', 'DELETED', 'CREATED', 'MOVED_TO_TRASH', 'PERMANENTLY_DELETED')`);
        await queryRunner.query(`CREATE TABLE "document_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityType" "public"."document_activity_activitytype_enum" NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "document_id" uuid, "folder_id" uuid, "user_id" uuid, CONSTRAINT "PK_cf311ccda75abcd6427464329dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "folder_id" uuid, "fileName" character varying(500) NOT NULL, "description" text, "tags" text array, "file_type" text NOT NULL, "extension" character varying(20), "size_bytes" bigint, "checksum_sha256" character varying(64), "thumbnail_url" character varying(1000), "preview_url" character varying(1000), "current_version_id" character varying, "version_count" integer NOT NULL DEFAULT '1', "owner_id" uuid NOT NULL, "file_url" character varying(1000), "status" character varying(30) NOT NULL DEFAULT 'active', "workflow_status" character varying(30), "is_locked" boolean NOT NULL DEFAULT false, "locked_by" uuid, "locked_at" TIMESTAMP WITH TIME ZONE, "ocr_text" text, "ocr_status" character varying(20) NOT NULL DEFAULT 'pending', "ocr_completed_at" TIMESTAMP WITH TIME ZONE, "virus_scan_status" character varying(20) NOT NULL DEFAULT 'pending', "language" character varying(10), "page_count" integer, "download_count" integer NOT NULL DEFAULT '0', "view_count" integer NOT NULL DEFAULT '0', "aiSummary" text, "aiTags" text array, "documentCategory" character varying, "metadata" jsonb, "ai_status" character varying NOT NULL DEFAULT 'pending', "ai_processed_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "folders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "parent_id" uuid, "path" character varying(500) NOT NULL, "owner_id" uuid, "inherit_permissions" boolean NOT NULL DEFAULT true, "color" character varying(7), "icon" character varying(50), "is_archived" boolean NOT NULL DEFAULT false, "document_count" integer NOT NULL DEFAULT '0', "size_bytes" bigint NOT NULL DEFAULT '0', "retention_days" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_b82c9c49e110a9b813cfb8d685c" UNIQUE ("path"), CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token" text NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'MANAGER', 'USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "employee_id" character varying(50), "phone" character varying(20), "department" character varying(100), "designation" character varying(100), "avatar_url" character varying(500), "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "is_active" boolean NOT NULL DEFAULT true, "last_login_at" TIMESTAMP WITH TIME ZONE, "last_login_ip" character varying, "password_changed_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."document_shares_permission_enum" AS ENUM('VIEW', 'EDIT', 'DOWNLOAD', 'FULL_ACCESS')`);
        await queryRunner.query(`CREATE TABLE "document_shares" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "permission" "public"."document_shares_permission_enum" NOT NULL DEFAULT 'VIEW', "document_id" uuid NOT NULL, "shared_by" uuid NOT NULL, "shared_with" uuid NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_69704f195ba1451f13de600e8c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "document_embeddings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "documentId" character varying NOT NULL, "contentChunk" text NOT NULL, "embedding" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "document_id" uuid, CONSTRAINT "PK_a544f56a62c3bd971e68fc6d211" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_645415fa59398743cd20a8790be" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_e063d57ef96e3a6432b14748be7" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_activity" ADD CONSTRAINT "FK_e637cda90d710f1813a93a3c297" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_activity" ADD CONSTRAINT "FK_ebbb9723e127002e0b38f351a21" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_activity" ADD CONSTRAINT "FK_972d610704b332ff347409db338" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_e0ccba38ea80d444e2f4614d7cd" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_888a4852e27627d1ebd8a094e98" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_023bef7f68a7df933e4ba518d9e" FOREIGN KEY ("locked_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_938a930768697b6ece215667d8e" FOREIGN KEY ("parent_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_ecee72de3b100ef0bbebe47f3c4" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_shares" ADD CONSTRAINT "FK_76861e417382761ff9e925c7e4e" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_shares" ADD CONSTRAINT "FK_80b781e2a5f68c671ca0ae133e8" FOREIGN KEY ("shared_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_shares" ADD CONSTRAINT "FK_3c2b7d9350713d5c2e6d5f67c1d" FOREIGN KEY ("shared_with") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_embeddings" ADD CONSTRAINT "FK_be94066b03dec036e24f6b7f8ad" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_embeddings" DROP CONSTRAINT "FK_be94066b03dec036e24f6b7f8ad"`);
        await queryRunner.query(`ALTER TABLE "document_shares" DROP CONSTRAINT "FK_3c2b7d9350713d5c2e6d5f67c1d"`);
        await queryRunner.query(`ALTER TABLE "document_shares" DROP CONSTRAINT "FK_80b781e2a5f68c671ca0ae133e8"`);
        await queryRunner.query(`ALTER TABLE "document_shares" DROP CONSTRAINT "FK_76861e417382761ff9e925c7e4e"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_ecee72de3b100ef0bbebe47f3c4"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_938a930768697b6ece215667d8e"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_023bef7f68a7df933e4ba518d9e"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_888a4852e27627d1ebd8a094e98"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_e0ccba38ea80d444e2f4614d7cd"`);
        await queryRunner.query(`ALTER TABLE "document_activity" DROP CONSTRAINT "FK_972d610704b332ff347409db338"`);
        await queryRunner.query(`ALTER TABLE "document_activity" DROP CONSTRAINT "FK_ebbb9723e127002e0b38f351a21"`);
        await queryRunner.query(`ALTER TABLE "document_activity" DROP CONSTRAINT "FK_e637cda90d710f1813a93a3c297"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_e063d57ef96e3a6432b14748be7"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_645415fa59398743cd20a8790be"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593"`);
        await queryRunner.query(`DROP TABLE "document_embeddings"`);
        await queryRunner.query(`DROP TABLE "document_shares"`);
        await queryRunner.query(`DROP TYPE "public"."document_shares_permission_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "folders"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TABLE "document_activity"`);
        await queryRunner.query(`DROP TYPE "public"."document_activity_activitytype_enum"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
    }

}

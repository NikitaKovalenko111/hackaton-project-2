import { MigrationInterface, QueryRunner } from 'typeorm'

export class initialSchema1765128806097 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
            CREATE TYPE "role_type" AS ENUM ('hr', 'developer', 'teamlead', 'techlead', 'admin', 'moderator');
        `)

    await queryRunner.query(`
            CREATE TYPE "request_type" AS ENUM ('upgrade');
        `)

    await queryRunner.query(`
            CREATE TYPE "request_status" AS ENUM ('pending', 'completed', 'canceled');
        `)

    await queryRunner.query(`
            CREATE TYPE "interview_type" AS ENUM ('tech', 'soft', 'hr', 'case');
        `)

    await queryRunner.query(`
            CREATE TYPE "interview_status_type" AS ENUM ('planned', 'completed', 'canceled');
        `)

    await queryRunner.query(`
            CREATE TYPE "skill_level" AS ENUM ('junior', 'junior+', 'middle', 'middle+', 'senior');
        `)

    await queryRunner.query(`
            CREATE TYPE "review_status" AS ENUM ('active', 'pending');
        `)

    await queryRunner.query(`
            CREATE TYPE "client_type" AS ENUM ('web', 'telegram');
        `)

    await queryRunner.query(`
            CREATE TYPE "notification_type" AS ENUM ('newRequest', 'completedRequest', 'newInterview', 'canceledRequest', 'canceledInterview');
        `)

    await queryRunner.query(`
            CREATE TYPE "notification_status_type" AS ENUM ('applied', 'not_applied');
        `)

    // Create company table
    await queryRunner.query(`
            CREATE TABLE "company" (
                "company_id" SERIAL PRIMARY KEY,
                "company_name" VARCHAR(128) NOT NULL,
                "company_logo" VARCHAR(128)
            );
        `)

    // Create team table
    await queryRunner.query(`
            CREATE TABLE "team" (
                "team_id" SERIAL PRIMARY KEY,
                "team_name" VARCHAR(64) NOT NULL,
                "team_desc" VARCHAR(256),
                "teamlead_id" INTEGER,
                "company_id" INTEGER
            );
        `)

    // Create employee table
    await queryRunner.query(`
            CREATE TABLE "employee" (
                "employee_id" SERIAL PRIMARY KEY,
                "employee_name" VARCHAR(64) NOT NULL,
                "employee_surname" VARCHAR(64) NOT NULL,
                "employee_email" VARCHAR(128) NOT NULL,
                "employee_status" VARCHAR(256) NOT NULL DEFAULT '',
                "employee_photo" VARCHAR(128) NOT NULL DEFAULT '',
                "employee_password" VARCHAR(64) NOT NULL,
                "telegram_id" BIGINT DEFAULT NULL,
                "company_id" INTEGER,
                "team_id" INTEGER
            );
        `)

    // Create role table
    await queryRunner.query(`
            CREATE TABLE "role" (
                "role_id" SERIAL PRIMARY KEY,
                "role_name" "role_type" NOT NULL,
                "employee_id" INTEGER,
                "company_id" INTEGER
            );
        `)

    // Create skill_shape table
    await queryRunner.query(`
            CREATE TABLE "skill_shape" (
                "skill_shape_id" SERIAL PRIMARY KEY,
                "skill_name" VARCHAR(96) NOT NULL,
                "skill_desc" VARCHAR(256) NOT NULL,
                "company_id" INTEGER
            );
        `)

    // Create skill table
    await queryRunner.query(`
            CREATE TABLE "skill" (
                "skill_connection_id" SERIAL PRIMARY KEY,
                "skill_level" "skill_level" NOT NULL,
                "skill_shape_id" INTEGER,
                "employee_id" INTEGER
            );
        `)

    // Create skill_order table
    await queryRunner.query(`
            CREATE TABLE "skill_order" (
                "skill_order_id" SERIAL PRIMARY KEY,
                "skill_level" "skill_level" NOT NULL,
                "order_text" TEXT NOT NULL,
                "skill_shape_id" INTEGER
            );
        `)

    // Create interview table
    await queryRunner.query(`
            CREATE TABLE "interview" (
                "interview_id" SERIAL PRIMARY KEY,
                "interview_duration" BIGINT,
                "interview_date" TIMESTAMP NOT NULL,
                "interview_desc" TEXT NOT NULL,
                "interview_status" "interview_status_type" NOT NULL DEFAULT 'planned',
                "interview_type" "interview_type" NOT NULL,
                "interview_comment" TEXT NOT NULL DEFAULT '',
                "interview_subject_id" INTEGER,
                "interview_owner_id" INTEGER,
                "company_id" INTEGER
            );
        `)

    // Create review table
    await queryRunner.query(`
            CREATE TABLE "review" (
                "review_id" SERIAL PRIMARY KEY,
                "review_interval" VARCHAR,
                "review_status" "review_status" NOT NULL DEFAULT 'pending',
                "review_cycle" INTEGER NOT NULL DEFAULT 1,
                "company_id" INTEGER
            );
        `)

    // Create question table
    await queryRunner.query(`
            CREATE TABLE "question" (
                "question_id" SERIAL PRIMARY KEY,
                "question_text" TEXT NOT NULL,
                "review_id" INTEGER
            );
        `)

    // Create answer table
    await queryRunner.query(`
            CREATE TABLE "answer" (
                "answer_id" SERIAL PRIMARY KEY,
                "answer_text" TEXT NOT NULL,
                "sendedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "question_id" INTEGER,
                "employee_id" INTEGER,
                "employee_answer_to_id" INTEGER
            );
        `)

    // Create socket table
    await queryRunner.query(`
            CREATE TABLE "socket" (
                "socket_id" SERIAL PRIMARY KEY,
                "client_id" VARCHAR(256) NOT NULL UNIQUE,
                "client_type" "client_type" NOT NULL,
                "employee_id" INTEGER
            );
        `)

    // Create request table
    await queryRunner.query(`
            CREATE TABLE "request" (
                "request_id" SERIAL PRIMARY KEY,
                "request_type" "request_type" NOT NULL,
                "justification" TEXT,
                "request_status" "request_status" NOT NULL DEFAULT 'pending',
                "request_date" TIMESTAMP NOT NULL DEFAULT NOW(),
                "request_role_receiver" "role_type",
                "request_skill_id" INTEGER,
                "request_receiver_id" INTEGER,
                "request_owner_id" INTEGER
            );
        `)

    // Create notification table
    await queryRunner.query(`
            CREATE TABLE "notification" (
                "notification_id" SERIAL PRIMARY KEY,
                "notification_type" "notification_type" NOT NULL,
                "object_id" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "notification_status" "notification_status_type" NOT NULL DEFAULT 'not_applied',
                "receiver_id" INTEGER
            );
        `)

    // Create statistics table
    await queryRunner.query(`
            CREATE TABLE "statistics" (
                "statistics_id" SERIAL PRIMARY KEY,
                "statistics_name" VARCHAR(96) NOT NULL,
                "statistics_data" TEXT NOT NULL,
                "company_id" INTEGER
            );
        `)

    // Create employee_token table
    await queryRunner.query(`
            CREATE TABLE "employee_token" (
                "token_id" SERIAL PRIMARY KEY,
                "employee_id" INTEGER NOT NULL,
                "token_data" VARCHAR NOT NULL
            );
        `)

    // Add foreign key constraints
    // Team foreign keys
    await queryRunner.query(`
            ALTER TABLE "team"
            ADD CONSTRAINT "fk_team_teamlead" FOREIGN KEY ("teamlead_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION;
        `)

    await queryRunner.query(`
            ALTER TABLE "team"
            ADD CONSTRAINT "fk_team_company" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE NO ACTION;
        `)

    // Employee foreign keys
    await queryRunner.query(`
            ALTER TABLE "employee"
            ADD CONSTRAINT "fk_employee_company" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE CASCADE;
        `)

    await queryRunner.query(`
            ALTER TABLE "employee"
            ADD CONSTRAINT "fk_employee_team" FOREIGN KEY ("team_id") REFERENCES "team"("team_id") ON DELETE NO ACTION;
        `)

    // Role foreign keys
    await queryRunner.query(`
            ALTER TABLE "role"
            ADD CONSTRAINT "fk_role_employee" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE CASCADE;
        `)

    await queryRunner.query(`
            ALTER TABLE "role"
            ADD CONSTRAINT "fk_role_company" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE NO ACTION;
        `)

    // Skill_shape foreign keys
    await queryRunner.query(`
            ALTER TABLE "skill_shape"
            ADD CONSTRAINT "fk_skill_shape_company" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE NO ACTION;
        `)

    // Skill foreign keys
    await queryRunner.query(`
            ALTER TABLE "skill"
            ADD CONSTRAINT "fk_skill_skill_shape" FOREIGN KEY ("skill_shape_id") REFERENCES "skill_shape"("skill_shape_id") ON DELETE NO ACTION;
        `)

    await queryRunner.query(`
            ALTER TABLE "skill"
            ADD CONSTRAINT "fk_skill_employee" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION;
        `)

    // Skill_order foreign keys
    await queryRunner.query(`
            ALTER TABLE "skill_order"
            ADD CONSTRAINT "fk_skill_order_skill_shape" FOREIGN KEY ("skill_shape_id") REFERENCES "skill_shape"("skill_shape_id") ON DELETE NO ACTION;
        `)

    // Interview foreign keys
    await queryRunner.query(`
            ALTER TABLE "interview"
            ADD CONSTRAINT "fk_interview_subject" FOREIGN KEY ("interview_subject_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION;
        `)

    await queryRunner.query(`
            ALTER TABLE "interview"
            ADD CONSTRAINT "fk_interview_owner" FOREIGN KEY ("interview_owner_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION;
        `)

    await queryRunner.query(`
            ALTER TABLE "interview"
            ADD CONSTRAINT "fk_interview_company" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE NO ACTION;
        `)

    // Review foreign keys
    await queryRunner.query(`
            ALTER TABLE "review"
            ADD CONSTRAINT "fk_review_company" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE NO ACTION;
        `)

    // Question foreign keys
    await queryRunner.query(`
            ALTER TABLE "question"
            ADD CONSTRAINT "fk_question_review" FOREIGN KEY ("review_id") REFERENCES "review"("review_id") ON DELETE NO ACTION;
        `)

    // Answer foreign keys
    await queryRunner.query(`
            ALTER TABLE "answer"
            ADD CONSTRAINT "fk_answer_question" FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE NO ACTION;
        `)

    await queryRunner.query(`
            ALTER TABLE "answer"
            ADD CONSTRAINT "fk_answer_employee" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION;
        `)

    await queryRunner.query(`
            ALTER TABLE "answer"
            ADD CONSTRAINT "fk_answer_employee_to" FOREIGN KEY ("employee_answer_to_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION;
        `)

    // Socket foreign keys
    await queryRunner.query(`
            ALTER TABLE "socket"
            ADD CONSTRAINT "fk_socket_employee" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION;
        `)

    // Request foreign keys
    await queryRunner.query(`
            ALTER TABLE "request"
            ADD CONSTRAINT "fk_request_skill" FOREIGN KEY ("request_skill_id") REFERENCES "skill"("skill_connection_id") ON DELETE NO ACTION;
        `)

    await queryRunner.query(`
            ALTER TABLE "request"
            ADD CONSTRAINT "fk_request_receiver" FOREIGN KEY ("request_receiver_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION;
        `)

    await queryRunner.query(`
            ALTER TABLE "request"
            ADD CONSTRAINT "fk_request_owner" FOREIGN KEY ("request_owner_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION;
        `)

    // Notification foreign keys
    await queryRunner.query(`
            ALTER TABLE "notification"
            ADD CONSTRAINT "fk_notification_receiver" FOREIGN KEY ("receiver_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION;
        `)

    // Statistics foreign keys
    await queryRunner.query(`
            ALTER TABLE "statistics"
            ADD CONSTRAINT "fk_statistics_company" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE NO ACTION;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all foreign key constraints first
    await queryRunner.query(
      `ALTER TABLE "statistics" DROP CONSTRAINT "fk_statistics_company";`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "fk_notification_receiver";`,
    )
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "fk_request_owner";`,
    )
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "fk_request_receiver";`,
    )
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "fk_request_skill";`,
    )
    await queryRunner.query(
      `ALTER TABLE "socket" DROP CONSTRAINT "fk_socket_employee";`,
    )
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "fk_answer_employee_to";`,
    )
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "fk_answer_employee";`,
    )
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "fk_answer_question";`,
    )
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "fk_question_review";`,
    )
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "fk_review_company";`,
    )
    await queryRunner.query(
      `ALTER TABLE "interview" DROP CONSTRAINT "fk_interview_company";`,
    )
    await queryRunner.query(
      `ALTER TABLE "interview" DROP CONSTRAINT "fk_interview_owner";`,
    )
    await queryRunner.query(
      `ALTER TABLE "interview" DROP CONSTRAINT "fk_interview_subject";`,
    )
    await queryRunner.query(
      `ALTER TABLE "skill_order" DROP CONSTRAINT "fk_skill_order_skill_shape";`,
    )
    await queryRunner.query(
      `ALTER TABLE "skill" DROP CONSTRAINT "fk_skill_employee";`,
    )
    await queryRunner.query(
      `ALTER TABLE "skill" DROP CONSTRAINT "fk_skill_skill_shape";`,
    )
    await queryRunner.query(
      `ALTER TABLE "skill_shape" DROP CONSTRAINT "fk_skill_shape_company";`,
    )
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "fk_role_company";`,
    )
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "fk_role_employee";`,
    )
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "fk_employee_team";`,
    )
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "fk_employee_company";`,
    )
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "fk_team_company";`,
    )
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "fk_team_teamlead";`,
    )

    // Drop all tables
    await queryRunner.query(`DROP TABLE "employee_token";`)
    await queryRunner.query(`DROP TABLE "statistics";`)
    await queryRunner.query(`DROP TABLE "notification";`)
    await queryRunner.query(`DROP TABLE "request";`)
    await queryRunner.query(`DROP TABLE "socket";`)
    await queryRunner.query(`DROP TABLE "answer";`)
    await queryRunner.query(`DROP TABLE "question";`)
    await queryRunner.query(`DROP TABLE "review";`)
    await queryRunner.query(`DROP TABLE "interview";`)
    await queryRunner.query(`DROP TABLE "skill_order";`)
    await queryRunner.query(`DROP TABLE "skill";`)
    await queryRunner.query(`DROP TABLE "skill_shape";`)
    await queryRunner.query(`DROP TABLE "role";`)
    await queryRunner.query(`DROP TABLE "employee";`)
    await queryRunner.query(`DROP TABLE "team";`)
    await queryRunner.query(`DROP TABLE "company";`)

    // Drop all enum types
    await queryRunner.query(`DROP TYPE "notification_status_type";`)
    await queryRunner.query(`DROP TYPE "notification_type";`)
    await queryRunner.query(`DROP TYPE "client_type";`)
    await queryRunner.query(`DROP TYPE "review_status";`)
    await queryRunner.query(`DROP TYPE "skill_level";`)
    await queryRunner.query(`DROP TYPE "interview_status_type";`)
    await queryRunner.query(`DROP TYPE "interview_type";`)
    await queryRunner.query(`DROP TYPE "request_status";`)
    await queryRunner.query(`DROP TYPE "request_type";`)
    await queryRunner.query(`DROP TYPE "role_type";`)
  }
}

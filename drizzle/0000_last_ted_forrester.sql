CREATE TABLE "mockInterview" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonMockResp" text NOT NULL,
	"jobPosition" varchar NOT NULL,
	"jobDesc" varchar NOT NULL,
	"jobExperience" varchar NOT NULL,
	"createdBy" varchar NOT NULL,
	"createdAt" varchar,
	"mockId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userAnswer" (
	"id" serial PRIMARY KEY NOT NULL,
	"mockId" varchar NOT NULL,
	"question" varchar NOT NULL,
	"correctAns" varchar,
	"UserAns" text,
	"feedback" text,
	"rating" varchar,
	"userEmail" varchar,
	"createdAt" varchar
);
--> statement-breakpoint
CREATE TABLE "contest_participations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"contest_id" text NOT NULL,
	"reason" text NOT NULL,
	"xp" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "historyTable" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "historyTable_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"recordId" varchar(255) NOT NULL,
	"content" json,
	"userEmail" varchar(255),
	"createdAt" varchar(255),
	"aiAgentType" varchar,
	"metaData" varchar,
	"originalFileName" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "user_quiz_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"path" varchar(255) NOT NULL,
	"unlocked_levels" json DEFAULT '[]'::json NOT NULL,
	"completed_levels" json DEFAULT '[]'::json NOT NULL,
	"updated_at" varchar(255),
	CONSTRAINT "user_quiz_progress_user_id_path_unique" UNIQUE("user_id","path")
);
--> statement-breakpoint
CREATE TABLE "user_xp" (
	"user_id" text PRIMARY KEY NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "historyTable" ADD CONSTRAINT "historyTable_userEmail_users_email_fk" FOREIGN KEY ("userEmail") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;
import { integer, json, pgTable, serial, text, varchar, uuid, unique, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { auth, currentUser } from "@clerk/nextjs/server";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),

});
export const historyTable = pgTable("historyTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  recordId: varchar({ length: 255 }).notNull(),
  content: json(),
  userEmail: varchar({ length: 255 }).references(() => usersTable.email),
  createdAt: varchar({ length: 255 }),
  aiAgentType:varchar(),metaData:varchar(),
  originalFileName: varchar({ length: 255 })
});
export const MockInterview=pgTable('mockInterview',{
    id:serial('id').primaryKey(),
    jsonMockResp:text('jsonMockResp').notNull(),
    jobPosition:varchar('jobPosition').notNull(),
    jobDesc:varchar('jobDesc').notNull(),
    jobExperience:varchar('jobExperience').notNull(),
    createdBy:varchar('createdBy').notNull(),
    createdAt:varchar('createdAt'),
    mockId:varchar('mockId').notNull()
})

export const UserAnswer=pgTable('userAnswer',{
    id:serial('id').primaryKey(),
    mockIdRef:varchar('mockId').notNull(),
    question:varchar('question').notNull(),
    correctAns:varchar('correctAns'),
    userAns:text('UserAns'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt:varchar('createdAt'),
})
export const userXP = pgTable("user_xp", {
  userId: text("user_id").primaryKey(),
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
});

export const contestParticipations = pgTable("contest_participations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  contestId: text("contest_id").notNull(),
  reason: text("reason").notNull(),
  xp: integer("xp").notNull(),
});

export const userQuizProgress = pgTable("user_quiz_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  path: varchar("path", { length: 255 }).notNull(),
  unlockedLevels: json("unlocked_levels").notNull().default([]),
  completedLevels: json("completed_levels").notNull().default([]),
  updatedAt: varchar("updated_at", { length: 255 }),
}, (table) => ({
  userPathUnique: unique().on(table.userId, table.path),
}));


import { NextRequest } from "next/server";
import { db } from "@/configs/db";
import { userQuizProgress } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest, context: { params: { path: string } }) {
  const { params } = await context;
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const userId = user.id;
  const path = params.path;
  const [progress] = await db
    .select()
    .from(userQuizProgress)
    .where(and(eq(userQuizProgress.userId, userId), eq(userQuizProgress.path, path)));
  return Response.json(
    progress || { unlockedLevels: [0], completedLevels: [] }
  );
}

export async function POST(req: NextRequest, context: { params: { path: string } }) {
  const { params } = await context;
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const userId = user.id;
  const path = params.path;
  let body = {};
  try {
    body = await req.json();
  } catch (e) {
    return new Response("Bad Request", { status: 400 });
  }
  const { unlockedLevels, completedLevels } = body;
  try {
    await db
      .insert(userQuizProgress)
      .values({ userId, path, unlockedLevels, completedLevels, updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: [userQuizProgress.userId, userQuizProgress.path],
        set: { unlockedLevels, completedLevels, updatedAt: new Date().toISOString() },
      });
    return new Response("OK");
  } catch (err) {
    return new Response("DB Error", { status: 500 });
  }
} 
// /app/api/contests/xp/route.ts
import { NextRequest } from "next/server";
import { db } from "@/configs/db";
import { userXP, contestParticipations } from "@/configs/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, reason, contestId } = body;

  let points = 0;
  if (reason === "join") points = 10;
  else if (reason === "streak") points = 20;
  else if (reason === "win") points = 50;

  await db.insert(contestParticipations).values({
    userId,
    contestId,
    reason,
    xp: points,
  });

  await db
    .insert(userXP)
    .values({ userId, xp: points })
    .onConflictDoUpdate({
      target: userXP.userId,
      set: { xp: sql`${userXP.xp} + ${points}` },
    });

  return new Response(JSON.stringify({ success: true, points }), { status: 200 });
}

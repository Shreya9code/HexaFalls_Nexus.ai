// /app/api/contests/leaderboard/route.ts
import { db } from "@/configs/db";
import { userXP, usersTable } from "@/configs/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const topUsers = await db
    .select({
      username: usersTable.name,
      xp: userXP.xp,
    })
    .from(usersTable)
    .innerJoin(userXP, eq(usersTable.id, userXP.userId))
    .orderBy(desc(userXP.xp))
    .limit(10);

  return new Response(JSON.stringify(topUsers), { status: 200 });
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { userXP } from '@/configs/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;
    const { streak } = await req.json(); // get streak from frontend
    // Check if user already has XP
    const existing = await db.select().from(userXP).where(eq(userXP.userId, userId));
    let newXP = 5;
    let currentStreak = streak ?? 0;
    if (existing.length > 0) {
      newXP = (existing[0].xp || 0) + 5;
      await db.update(userXP).set({ xp: newXP, streak: currentStreak }).where(eq(userXP.userId, userId));
    } else {
      await db.insert(userXP).values({ userId, xp: 5, streak: currentStreak });
    }
    return NextResponse.json({ 
      xp: newXP, 
      streak: currentStreak,
      message: `+5 XP! Streak: ${currentStreak}`
    });
  } catch (err) {
    console.error('Error awarding XP:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;
    const existing = await db.select().from(userXP).where(eq(userXP.userId, userId));
    const xp = existing.length > 0 ? existing[0].xp : 0;
    const streak = existing.length > 0 ? existing[0].streak : 0;
    const totalQuizzes = Math.floor(xp / 5);
    return NextResponse.json({ 
      xp,
      streak,
      totalQuizzes,
      level: Math.floor(xp / 25) + 1, // Level up every 25 XP
      nextLevelXP: Math.ceil(xp / 25) * 25 // XP needed for next level
    });
  } catch (err) {
    console.error('Error fetching XP:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
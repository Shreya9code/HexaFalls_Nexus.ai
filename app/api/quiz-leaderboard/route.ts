import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { userXP } from '@/configs/schema';
import { currentUser } from '@clerk/nextjs/server';
import { desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    console.log('=== Quiz Leaderboard API Called ===');
    
    // Temporarily skip authentication for testing
    const user = await currentUser();
    const currentUserId = user?.id;
    console.log('Current user:', currentUserId);
    console.log('User details:', user);
    
    // Check if userXP table exists and has data
    const tableCheck = await db.select().from(userXP).limit(1);
    console.log('Table check result:', tableCheck);
    
    // If no data in table, add some sample data for testing
    if (tableCheck.length === 0) {
      console.log('No data found in userXP table, adding sample data for testing');
      try {
        await db.insert(userXP).values([
          { userId: 'user_123', xp: 150 },
          { userId: 'user_456', xp: 120 },
          { userId: 'user_789', xp: 90 },
          { userId: 'user_101', xp: 75 },
          { userId: 'user_202', xp: 60 },
        ]);
        console.log('Sample data inserted successfully');
      } catch (insertErr) {
        console.error('Error inserting sample data:', insertErr);
      }
    }
    
    // Get top 10 users by XP
    const topUsers = await db.select({
      userId: userXP.userId,
      xp: userXP.xp
    })
      .from(userXP)
      .orderBy(desc(userXP.xp))
      .limit(10);
    
    console.log('Top users from DB:', topUsers);

    // Get all users sorted by XP to find current user's rank
    let currentUserRank = null;
    let currentUserXP = null;
    if (currentUserId) {
      const allUsers = await db.select({
        userId: userXP.userId,
        xp: userXP.xp
      })
        .from(userXP)
        .orderBy(desc(userXP.xp));
      console.log('All users from DB:', allUsers);
      const idx = allUsers.findIndex(u => u.userId === currentUserId);
      if (idx !== -1) {
        currentUserRank = idx + 1;
        currentUserXP = allUsers[idx].xp;
      }
    }

    // Format leaderboard
    const leaderboard = topUsers.map((u, i) => ({
      rank: i + 1,
      name: u.userId === currentUserId ? (user?.firstName || 'You') : `User #${u.userId.slice(-4)}`,
      xp: u.xp,
      isCurrentUser: currentUserId === u.userId
    }));

    // If current user not in top 10, add them at the end
    if (
      currentUserId &&
      !leaderboard.some(u => u.isCurrentUser) &&
      currentUserRank !== null &&
      currentUserXP !== null
    ) {
      leaderboard.push({
        rank: currentUserRank,
        name: user?.firstName || 'You',
        xp: currentUserXP,
        isCurrentUser: true
      });
    }

    console.log('Final leaderboard:', leaderboard);
    
    return NextResponse.json({ leaderboard });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
} 
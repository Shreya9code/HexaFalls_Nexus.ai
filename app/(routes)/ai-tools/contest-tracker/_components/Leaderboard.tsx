// /app/(routes)/ai-tools/contest-tracker/_components/Leaderboard.tsx
"use client";
import { useEffect, useState } from "react";

type LeaderboardEntry = {
  username: string;
  xp: number;
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch("/api/contests/leaderboard");
      const data = await res.json();
      setLeaderboard(data);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border">
      <h2 className="text-2xl font-bold mb-4 text-card-foreground">🏆 Leaderboard</h2>
      <ol className="space-y-2">
        {leaderboard.map((entry, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b border-border pb-1"
          >
            <div>
              <span className="font-medium text-card-foreground">{index + 1}. {entry.username}</span>
            </div>
            <div className="text-primary font-semibold">{entry.xp} XP</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
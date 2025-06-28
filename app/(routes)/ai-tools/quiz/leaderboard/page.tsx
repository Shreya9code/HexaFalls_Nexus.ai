"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  isCurrentUser: boolean;
}

export default function QuizLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        console.log('Fetching leaderboard...');
        const res = await fetch('/api/quiz-leaderboard');
        console.log('Response status:', res.status);
        console.log('Response headers:', Object.fromEntries(res.headers.entries()));
        
        if (res.ok) {
          const data = await res.json();
          console.log('Leaderboard data:', data);
          setLeaderboard(data.leaderboard || []);
          setMessage(data.message || null);
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error('Failed to load leaderboard:', res.status, errorData);
          setError(`Failed to load leaderboard: ${errorData.error || res.statusText}`);
        }
      } catch (err) {
        console.error('Error loading leaderboard:', err);
        setError(`Error loading leaderboard: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Quiz Leaderboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Top performers in quiz challenges</p>
        </div>
        <Link href="/ai-tools/quiz">
          <Button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Take Quiz
          </Button>
        </Link>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200">{message}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Player</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboard.map((entry, index) => (
                <tr
                  key={entry.rank}
                  className={`${
                    entry.isCurrentUser
                      ? 'bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  } transition-colors`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`font-medium ${
                        entry.isCurrentUser
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {entry.name}
                      </span>
                      {entry.isCurrentUser && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold ${
                      entry.isCurrentUser
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {entry.xp} XP
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {leaderboard.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No quiz data available yet.</p>
          <Link href="/ai-tools/quiz">
            <Button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              Be the First!
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
} 
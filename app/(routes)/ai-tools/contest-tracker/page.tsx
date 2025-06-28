"use client";
import { useEffect, useState, useMemo } from "react";
import { ContestPlatformIcon } from "./_components/ContestPlatformIcon";
import { TimeRemaining } from "./_components/TimeRemaining";
// import Leaderboard from "./_components/Leaderboard"; // Uncomment if you want leaderboard

type Contest = {
  platform: string;
  name: string;
  url: string;
  startTime: string;
  duration: number;
};

const PLATFORMS = [
  "Codeforces",
  "LeetCode",
  "AtCoder",
  "HackerRank",
  "HackerEarth",
  "CodeChef",
];

function mapPlatformToIconKey(platform: string): 
  "codeforces" | "codechef" | "atcoder" | "leetcode" | "hackerrank" | "hackerearth" | "topcoder" | "kickstart" | "other" {
  switch (platform.toLowerCase()) {
    case "codeforces":
      return "codeforces";
    case "codechef":
      return "codechef";
    case "atcoder":
      return "atcoder";
    case "leetcode":
      return "leetcode";
    case "hackerrank":
      return "hackerrank";
    case "hackerearth":
      return "hackerearth";
    case "topcoder":
      return "topcoder";
    case "kickstart":
      return "kickstart";
    default:
      return "other";
  }
}

export default function ContestTrackerPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/contests");
        let data = await res.json();
        // If you want to mock more contests for demo, add them here:
        if (data.length < 6) {
          data = [
            ...data,
            {
              platform: "LeetCode",
              name: "LeetCode Weekly Contest 400",
              url: "https://leetcode.com/contest/weekly-contest-400",
              startTime: new Date(Date.now() + 86400000 * 2).toISOString(),
              duration: 5400,
            },
            {
              platform: "AtCoder",
              name: "AtCoder Beginner Contest 350",
              url: "https://atcoder.jp/contests/abc350",
              startTime: new Date(Date.now() + 86400000 * 3).toISOString(),
              duration: 7200,
            },
          ];
        }
        setContests(data);
      } catch (e) {
        setContests([]);
      }
      setLoading(false);
    };
    fetchContests();
  }, []);

  const filteredContests = useMemo(() => {
    return contests.filter(
      (c) =>
        (platform === "All" || c.platform === platform) &&
        (c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.platform.toLowerCase().includes(search.toLowerCase()))
    );
  }, [contests, search, platform]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">🔥 Upcoming Contests</h1>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search contests or platforms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-full sm:w-1/2"
        />
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="px-3 py-2 border rounded w-full sm:w-1/4"
        >
          <option value="All">All Platforms</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredContests.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center text-gray-500 mt-10">
          <img src="/public/robot.mp4" alt="No contests" className="w-32 h-32 mb-4" />
          <p>No contests found. Try a different search or check back later!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContests.map((c, i) => {
            const encodedTitle = encodeURIComponent(c.name);
            const encodedDesc = encodeURIComponent(
              `Participate in ${c.name} on ${c.platform}`
            );
            const start = new Date(c.startTime)
              .toISOString()
              .replace(/[-:]|\.\d{3}/g, "")
              .slice(0, 15);
            const end = new Date(
              new Date(c.startTime).getTime() + c.duration * 1000
            )
              .toISOString()
              .replace(/[-:]|\.\d{3}/g, "")
              .slice(0, 15);
            const calendarUrl = `https://calendar.google.com/calendar/r/eventedit?action=TEMPLATE&text=${encodedTitle}&details=${encodedDesc}&dates=${start}/${end}`;

            return (
              <div
                key={i}
                className="bg-card p-5 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ContestPlatformIcon platform={mapPlatformToIconKey(c.platform)} />
                  <h2 className="text-xl font-semibold">{c.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Platform: <span className="font-medium">{c.platform}</span>
                </p>
                <p className="text-sm text-blue-600 mb-1">
                  Starts: {new Date(c.startTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  Duration: {Math.floor(c.duration / 3600)}h {((c.duration % 3600) / 60).toFixed(0)}m
                </p>
                <div className="mb-2">
                  <TimeRemaining startTime={c.startTime} />
                </div>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Join Contest
                </a>
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-sm text-blue-500 hover:underline"
                >
                  📅 Add to Google Calendar
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* Leaderboard Section (optional) */}
      {/* <div className="mt-10">
        <Leaderboard />
      </div> */}
    </div>
  );
}

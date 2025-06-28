"use client";
import { useEffect, useState, useMemo } from "react";
import { ContestPlatformIcon } from "./_components/ContestPlatformIcon";
import { TimeRemaining } from "./_components/TimeRemaining";

// Types
type Contest = {
  platform: string;
  name: string;
  url: string;
  startTime: string;
  duration: number;
};

type SkillProgress = {
  platform: "Coursera" | "Udemy" | "YouTube" | "Others";
  skill: string;
  title: string;
  url: string;
  completedPercent: number;
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
  | "codeforces"
  | "codechef"
  | "atcoder"
  | "leetcode"
  | "hackerrank"
  | "hackerearth"
  | "topcoder"
  | "kickstart"
  | "other" {
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
  const [skills, setSkills] = useState<SkillProgress[]>([]);
  const [path, setPath] = useState("programming");
  const [skillsLoading, setSkillsLoading] = useState(false);

  // Move fetchSkills outside useEffect so it can be called from anywhere
  const fetchSkills = async (skillPath: string = "programming") => {
    setSkillsLoading(true);
    try {
      const res = await fetch(`/api/courses?path=${encodeURIComponent(skillPath)}`);
      const data = await res.json();
      setSkills(data);
    } catch (e) {
      console.error("Failed to fetch skills:", e);
      // Fallback to mocked data
      setSkills([
        {
          platform: "Coursera",
          skill: skillPath,
          title: `Introduction to ${skillPath}`,
          url: `https://www.coursera.org/search?query=${encodeURIComponent(skillPath)}`,
          completedPercent: 0,
        },
        {
          platform: "Udemy",
          skill: skillPath,
          title: `Complete ${skillPath} Bootcamp`,
          url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skillPath)}`,
          completedPercent: 0,
        },
      ]);
    }
    setSkillsLoading(false);
  };

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/contests");
        let data = await res.json();
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
    fetchSkills(path); // Now we can call fetchSkills here
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
    <div className="min-h-screen p-6 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">🔥 Upcoming Contests</h1>

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

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredContests.length === 0 ? (
        <div className="text-center text-gray-500">No contests found</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContests.map((c, i) => {
            const start = new Date(c.startTime).toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15);
            const end = new Date(new Date(c.startTime).getTime() + c.duration * 1000).toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15);
            const calendarUrl = `https://calendar.google.com/calendar/r/eventedit?action=TEMPLATE&text=${encodeURIComponent(c.name)}&details=${encodeURIComponent(`Participate in ${c.name} on ${c.platform}`)}&dates=${start}/${end}`;
            return (
              <div key={i} className="bg-white p-4 rounded-xl shadow">
                <div className="flex items-center gap-2 mb-2">
                  <ContestPlatformIcon platform={mapPlatformToIconKey(c.platform)} />
                  <h2 className="text-xl font-semibold">{c.name}</h2>
                </div>
                <p className="text-sm">Starts: {new Date(c.startTime).toLocaleString()}</p>
                <p className="text-sm">Duration: {Math.floor(c.duration / 3600)}h {((c.duration % 3600) / 60).toFixed(0)}m</p>
                <TimeRemaining startTime={c.startTime} />
                <a href={c.url} target="_blank" className="text-blue-600 text-sm">Join Contest</a>
                <a href={calendarUrl} target="_blank" className="text-sm text-blue-500">📅 Add to Calendar</a>
              </div>
            );
          })}
        </div>
      )}

      {/* Skill Progress Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold">📚 Skill Up Progress</h2>
        <div className="flex gap-3 mb-6 mt-4">
          <input
            type="text"
            placeholder="Search courses by path (e.g., programming, design, business)"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="px-3 py-2 border rounded flex-1"
          />
          <button 
            onClick={() => fetchSkills(path)} // Now this works!
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {skillsLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center text-gray-500">No courses found</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((s, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-gray-600">Platform: {s.platform}</p>
                <p className="text-sm">Skill: {s.skill}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${s.completedPercent}%` }} />
                </div>
                <a href={s.url} target="_blank" className="text-blue-500 text-sm mt-2 inline-block">
                  View Course →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
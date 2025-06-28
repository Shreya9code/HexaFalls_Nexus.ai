import { NextResponse } from "next/server";
import axios from "axios";

type Contest = {
  platform: string;
  name: string;
  url: string;
  startTime: string;
  duration: number;
};

export async function GET() {
  try {
    const leetcode = await axios.post("https://leetcode.com/graphql", {
      query: `
        query upcomingContests {
          upcomingContests {
            title
            titleSlug
            startTime
            duration
          }
        }
      `,
    });

    const lcContests = leetcode.data.data.upcomingContests.map((c: any) => ({
      platform: "LeetCode",
      name: c.title,
      url: `https://leetcode.com/contest/${c.titleSlug}`,
      startTime: new Date(c.startTime * 1000).toISOString(),
      duration: c.duration,
    }));

    const codechefRes = await axios.get("https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all");

    const ccContests = codechefRes.data.future_contests.map((c: any) => ({
      platform: "CodeChef",
      name: c.contest_name,
      url: `https://www.codechef.com/${c.contest_code}`,
      startTime: new Date(c.contest_start_date_iso).toISOString(),
      duration: c.contest_duration,
    }));

    const combined: Contest[] = [...lcContests, ...ccContests].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return NextResponse.json(combined);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch contests" }, { status: 500 });
  }
}

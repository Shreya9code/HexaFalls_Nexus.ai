// app/api/ai-career-chat-agent/status/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.inngest.com/v1/run/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "Failed to fetch status", details: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: "Unexpected error", details: error }, { status: 500 });
  }
}

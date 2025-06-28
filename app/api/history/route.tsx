import { db } from "@/configs/db";
import { historyTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const { content, recordId,aiAgentType } = await req.json();
  const user = await currentUser();
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const result = await db.insert(historyTable).values({
      recordId: recordId,
      content: content,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: today,
      aiAgentType: aiAgentType
    });
    console.log("POST result frm route.tsx", result);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(error);
  }
}
export async function PUT(req: any) {
  const { content, recordId } = await req.json();
  try {
    const result = await db
      .update(historyTable)
      .set({
        content: content,
      })
      .where(eq(historyTable.recordId, recordId));
    console.log("PUT result frm route.tsx", result);
    return NextResponse.json({ success: true, result }); // ✅ Return a response
  } catch (error) {
    return NextResponse.json(error);
  }
}
export async function GET(req: any) {
  const { searchParams } = new URL(req.url);
  const recordId = searchParams.get("recordId");
  const aiAgentType = searchParams.get("aiAgentType");
  try {
    if (recordId) {
      const result = await db
        .select()
        .from(historyTable)
        .where(eq(historyTable.recordId, recordId));
      return NextResponse.json(result[0]);
    }
    if (aiAgentType) {
      const result = await db
        .select()
        .from(historyTable)
        .where(eq(historyTable.aiAgentType, aiAgentType));
      return NextResponse.json(result);
    }
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json(error);
  }
}

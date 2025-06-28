import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const {roadmapId,userInput} = await req.json();
    const user=await currentUser()
    const resultIds = await inngest.send({
    name: "AIRoadmapAgent",
    data: {
      userInput: userInput,roadmapId:roadmapId,userEmail:user?.primaryEmailAddress?.emailAddress
    },
  });
  const runId = resultIds?.ids[0];console.log("runId:", runId);
  let  runStatus;
  while(true){
    runStatus=await getRuns(runId)
    if(runStatus?.data[0]?.status==='Completed')
        break
    await new Promise(resolve=>setTimeout(resolve,500))
  } return NextResponse.json({runStatus})
}
export async function getRuns(runId: string) {
    console.log("INNGEST_SERVER_HOST:", process.env.INNGEST_SERVER_HOST);
  const response = await axios.get(`${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );
  return response.data;
}
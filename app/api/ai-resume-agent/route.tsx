import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import axios from "axios";
import { currentUser } from "@clerk/nextjs/server";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  const FormData = await req.formData();
  const resumeFile: any = FormData.get("resumeFile");
  const recordId = FormData.get("recordId");
  const originalFileName = resumeFile?.name || "Unknown file";
  let textContent = "";
  let base64 = "";
  if (resumeFile && originalFileName.toLowerCase().endsWith(".pdf")) {
    // PDF handling
    const loader = new WebPDFLoader(resumeFile);
    const docs = await loader.load();
    textContent = docs[0]?.pageContent || "";
    const arrayBuffer = await resumeFile.arrayBuffer();
    base64 = Buffer.from(arrayBuffer).toString("base64");
    console.log("PDF TEXT CONTENT:", textContent);
  } else if (resumeFile && originalFileName.toLowerCase().endsWith(".docx")) {
    // DOCX handling
    const arrayBuffer = await resumeFile.arrayBuffer();
    base64 = Buffer.from(arrayBuffer).toString("base64");
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer });
    textContent = result.value;
    console.log("DOCX TEXT CONTENT:", textContent);
  } else {
    return NextResponse.json({ error: "Unsupported file type. Please upload a PDF or DOCX." }, { status: 400 });
  }
  const resultIds = await inngest.send({
    name: "AiResumeAgent",
    data: {
      recordId: recordId,
      base64ResumeFile: base64,
      pdfText: textContent,
      aiAgentType: "/ai-tools/ai-resume-analyzer",
      userEmail: user?.primaryEmailAddress?.emailAddress,
      originalFileName,
    },
  });
  const runId = resultIds?.ids[0];
  console.log("Inngest runId:", runId);
  let runStatus;
  while (true) {
    runStatus = await getRuns(runId);
    console.log("Current run status:", runStatus?.data?.[0]?.status);
    if (runStatus?.data[0]?.status === "Completed") break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return NextResponse.json({ runStatus });
}
export async function getRuns(runId: string) {
  console.log("INNGEST_SERVER_HOST:", process.env.INNGEST_SERVER_HOST);
  const response = await axios.get(
    `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );
  return response.data;
}

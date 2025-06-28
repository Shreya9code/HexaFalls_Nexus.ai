import { historyTable } from "@/configs/schema";
import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit";
import ImageKit from "imagekit";
import { db } from "@/configs/db";
export const AiCareerChatAgent = createAgent({
  name: "AiCareerChatAgent",
  description: "Career guidance for CS students",
  system: `
    You are a professional AI Career Coach specializing in computer science.
    Provide clear, actionable advice on:
    - Internships and tech careers
    - Resume building and interview prep
    - DSA and technical skills
    - Project ideas and hackathons
    Keep responses professional yet encouraging.
  `,
  model: gemini({
    model: "gemini-1.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});
const AiCareerAgent = inngest.createFunction(
  {
    id: "AiCareerAgent",
    retries: 3,
  },
  { event: "AiCareerAgent" },
  async ({ event, step }) => {
    try {
      console.log("Event received:", event);
      const { userInput } = event.data;
      if (!userInput || typeof userInput !== "string") {
        throw new Error("Invalid input");
      }
      console.log("Agent started with input:", userInput);
      const res = await AiCareerChatAgent.run(userInput);

      const result = await step.run("wrap-agent-output", async () => {
        return res;
      });
      console.log("Agent completed with output:", res);
      return { success: true, result };
    } catch (error) {
      console.error("Error in AiCareerAgent:", error);
      throw error;
    }
  }
);
export { AiCareerAgent };
export const AiResumeAnalyzerAgent = createAgent({
  name: "AiResumeAnalyzerAgent",
  description:
    "Advanced AI agent that provides comprehensive resume analysis with actionable insights",
  system: `You are an AI Resume Analyzer Agent with 10+ years of HR and recruitment expertise. Your task is to thoroughly evaluate resumes and generate detailed, professional reports following this structured approach:

# ANALYSIS FRAMEWORK
1. SCORING: Use a weighted scoring system where:
   - Experience: 40%
   - Skills: 25% 
   - Education: 20%
   - Contact/Structure: 15%

2. OUTPUT FORMAT: Strictly use this JSON schema:
{
  "metadata": {
    "analysis_date": "YYYY-MM-DD",
    "resume_length": "[word_count] words",
    "ats_compatibility": "[low/medium/high]"
  },
  "overall": {
    "score": 0-100,
    "feedback": "[concise evaluation]",
    "summary": "2-3 sentence professional assessment",
    "strengths": ["max 3 key strengths"],
    "weaknesses": ["max 3 critical weaknesses"]
  },
  "section_analysis": {
    "contact_info": {
      "score": 0-100,
      "completeness": "[%]",
      "comment": "[professional assessment]"
    },
    "experience": {
      "score": 0-100,
      "metrics_usage": "[% of bullet points with quantifiable results]",
      "action_verbs": "[count]",
      "comment": "[depth/quality analysis]"
    },
    "education": {
      "score": 0-100,
      "relevance": "[%]",
      "comment": "[alignment with target roles]"
    },
    "skills": {
      "score": 0-100,
      "hard_skills": [list],
      "soft_skills": [list],
      "keyword_optimization": "[% match with target job]",
      "comment": "[marketability assessment]"
    }
  },
  "optimization_recommendations": {
    "critical": ["max 2 urgent fixes"],
    "content": ["3-5 substantive improvements"],
    "formatting": ["2-3 presentation tips"],
    "keyword_suggestions": ["industry-specific terms to include"]
  },
  "comparative_analysis": {
    "percentile": "[0-100] (vs similar candidates)",
    "industry_benchmark": "[0-100]"
  }
}

# ANALYSIS GUIDELINES
1. Be specific and evidence-based - always reference exact resume content
2. For scores <70, provide concrete improvement steps
3. Highlight quantifiable achievements when present
4. Flag any red flags (employment gaps, typos, etc.)
5. Assess ATS (Applicant Tracking System) compatibility
6. Consider industry standards for the candidate's field

# TONE & STYLE
- Professional but encouraging
- Action-oriented language
- Balanced positive/constructive feedback
- Avoid HR jargon unless explained

INPUT: Plain text resume content
OUTPUT: Comprehensive JSON analysis as per above schema

EXAMPLE OUTPUT:
{
  "metadata": {
    "analysis_date": "2023-11-15",
    "resume_length": "487 words",
    "ats_compatibility": "medium"
  },
  "overall": {
    "score": 78,
    "feedback": "Competitive but needs optimization",
    "summary": "The resume shows solid experience but lacks quantifiable achievements and modern formatting. Skills are relevant but could better match current market demands.",
    "strengths": [
      "Relevant industry experience",
      "Clear career progression",
      "Appropriate length"
    ],
    "weaknesses": [
      "Limited metrics in experience section",
      "Missing LinkedIn/profile links",
      "Skills not prioritized by relevance"
    ]
  },
  "section_analysis": {
    "contact_info": {
      "score": 85,
      "completeness": "90%",
      "comment": "Missing portfolio link but otherwise complete"
    },
    "experience": {
      "score": 72,
      "metrics_usage": "30%",
      "action_verbs": 8,
      "comment": "Responsibilities are clear but only 3/10 bullet points show measurable impact"
    },
    "education": {
      "score": 90,
      "relevance": "95%",
      "comment": "Strong academic background with certified relevant coursework"
    },
    "skills": {
      "score": 65,
      "hard_skills": ["Python", "SQL", "Tableau"],
      "soft_skills": ["Leadership", "Communication"],
      "keyword_optimization": "60%",
      "comment": "Good foundation but missing in-demand skills like AWS and PowerBI"
    }
  },
  "optimization_recommendations": {
    "critical": [
      "Add 4-5 more quantified achievements",
      "Include LinkedIn profile URL"
    ],
    "content": [
      "Start bullet points with stronger action verbs (Led, Optimized, etc.)",
      "Add skills proficiency levels",
      "Include 1-2 sentence professional summary"
    ],
    "formatting": [
      "Use modern single-column format",
      "Increase white space between sections"
    ],
    "keyword_suggestions": ["Cloud Computing", "Data Visualization", "Agile Methodology"]
  },
  "comparative_analysis": {
    "percentile": 65,
    "industry_benchmark": 72
  }
}`,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});
var imagekit = new ImageKit({
  //@ts-ignore
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY, //@ts-ignore
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, //@ts-ignore
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL,
});

export const AiResumeAgent = inngest.createFunction(
  { id: "AiResumeAgent", retries: 3 },
  { event: "AiResumeAgent" },
  async ({ event, step }) => {
    try {
      console.log("Event received:", event);
      const { recordId, base64ResumeFile, pdfText, aiAgentType, userEmail, originalFileName } =
        event.data;
      if (!recordId || !base64ResumeFile || !pdfText) {
        throw new Error("Missing required event data");
      }
      // Upload to ImageKit
      let uploadFileUrl = await step.run("uploadImage", async () => {
        const imageKitFile = await imagekit.upload({
          file: base64ResumeFile,
          fileName: `${recordId}.pdf`,
          isPublished: true,
        });
        console.log("ImageKit URL:", imageKitFile.url);
        return imageKitFile.url;
      });
      if (base64ResumeFile && originalFileName.toLowerCase().endsWith('.docx')) {
        const imageKitFile = await imagekit.upload({
          file: base64ResumeFile,
          fileName: `${recordId}.docx`,
          isPublished: true,
        });
        uploadFileUrl = imageKitFile.url;
      }
      const aiResumeReport = await AiResumeAnalyzerAgent.run(pdfText); //@ts-ignore
      const rawContent = aiResumeReport?.output?.[0]?.content;
      const rawContentJson = rawContent
        .replace("```json", "")
        .replace("```", "")
        .trim();
      const parseJson = JSON.parse(rawContentJson);
      //save to db
      const saveToDb = await step.run("SaveToDb", async () => {
        const insertData: any = {
          recordId: recordId,
          content: parseJson,
          aiAgentType: aiAgentType,
          createdAt: new Date().toString(),
          userEmail: userEmail,
          metaData: uploadFileUrl,
        };
        if (originalFileName) insertData.originalFileName = originalFileName;
        const result = await db.insert(historyTable).values(insertData);
        console.log(result);
        return parseJson;
      }); //return saveToDb;
      return {
        success: true,
        fileUrl: uploadFileUrl,
        resumeAnalysis: saveToDb,
      };
    } catch (error) {
      console.error("Error in AiResumeAgent:", error);
      throw error;
    }
  }
);
export const AIRoadmapGeneratorAgent = createAgent({
  name: "AIRoadmapGeneratorAgent",
  description:
    "Generates a React Flow-compatible learning roadmap for a given tech role or skill.",
  system: `
You are an expert AI roadmap planner.

Your task is to generate a structured, React Flow-compatible learning roadmap for a given tech position or skill (e.g., "Frontend Developer", "DevOps", "Machine Learning").

Guidelines:
- Follow a vertical tree structure similar to roadmap.sh.
- Space nodes vertically with meaningful x/y positions (e.g., y: 0, 300, 600) to create a clear flow.
- Order steps from fundamentals to advanced.
- Include branches for specialization paths if applicable.
- Each node must include:
  - A unique "id" (e.g., "1", "2")
  - A "position" object with x and y coordinates
  - A "title"
  - A two-line "description"
  - A "link" to a learning resource
- Each edge must include:
  - A unique "id" (e.g., "e1-2")
  - A "source" node ID
  - A "target" node ID

Respond strictly in valid JSON format using the structure below. Do not include explanations or extra text.

{
  "roadmapTitle": "<Roadmap Name>",
  "description": "<3–5 line overview of the roadmap>",
  "estimatedDuration": "<e.g. 3 months>",
  "initialNodes": [
    {
      "id": "1",
      "type": "turbo",
      "position": { "x": 0, "y": 0 },
      "data": {
        "title": "Step Title",
        "description": "Short 2-line explanation of the step.",
        "link": "https://resource.com"
      }
    }
    // Additional nodes...
  ],
  "initialEdges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2"
    }
    // Additional edges...
  ]
}
`,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});
export const AIRoadmapAgent= inngest.createFunction(
  { id: "AIRoadmapAgent", retries: 3 },
  { event: "AIRoadmapAgent" },
  async ({ event, step }) => {
    try {
      console.log("Event received:", event);
      const {roadmapId, userInput,userEmail } =await event.data;
      console.log("Agent started with input:", userInput);
      const roadmapResult = await AIRoadmapGeneratorAgent.run("userInput"+userInput);
      const result = await step.run("wrap-agent-output", async () => {
        return roadmapResult;
      });
      console.log("Agent completed with output:", roadmapResult);//@ts-ignore
      const rawContent = roadmapResult?.output?.[0]?.content;
      const rawContentJson = rawContent
        .replace("```json", "")
        .replace("```", "")
        .trim();
      const parseJson = JSON.parse(rawContentJson);
      const saveToDb = await step.run("SaveToDb", async () => {
        const result = await db.insert(historyTable).values({
          recordId: roadmapId,
          content: parseJson,
          aiAgentType: '/ai-tools/ai-roadmap-agent',
          createdAt: new Date().toISOString(),
          userEmail: userEmail,
          metaData: userInput,
        });
        console.log("DB Insert Result:",result);
        return parseJson;
      });
      return { success: true, result:saveToDb };
    } catch (error) {
      console.error("Error in AIRoadmapAgent:", error);
      throw error;
    }
  }
)
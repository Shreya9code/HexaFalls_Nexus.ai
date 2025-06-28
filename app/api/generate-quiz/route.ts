import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function getLevelDescription(level: number): string {
  if (level < 10) return `level ${level + 1} (very easy)`;
  if (level < 25) return `level ${level + 1} (easy)`;
  if (level < 50) return `level ${level + 1} (intermediate)`;
  if (level < 75) return `level ${level + 1} (advanced)`;
  return `level ${level + 1} (expert)`;
}

const pathExamples: Record<string, { question: string; options: string[]; answer: string }> = {
  "Frontend Development": {
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<a>", "<link>", "<href>", "<hyper>"],
    answer: "<a>"
  },
  "Backend Development": {
    question: "Which language is commonly used for backend development?",
    options: ["Node.js", "HTML", "CSS", "Photoshop"],
    answer: "Node.js"
  },
  // Add more topics and examples as needed
};

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY not set" }), { status: 500 });
  }

  let genAI;
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to initialize Gemini SDK", raw: String(err) }), { status: 500 });
  }

  const { topic, numQuestions = 5, level = 0 } = await req.json();
  const levelDescription = getLevelDescription(level);
  const example = pathExamples[topic] || null;

  let exampleText = "";
  if (example) {
    exampleText = `\nExample for topic '${topic}':\n[\n  {\n    \"question\": \"${example.question}\",\n    \"options\": [${example.options.map(o => `\"${o}\"`).join(", ")}],\n    \"answer\": \"${example.answer}\"\n  }\n]\n`;
  }

  const prompt = `You are a quiz generator for a learning platform. Generate ${numQuestions} multiple-choice quiz questions strictly about the topic: '${topic}'. The questions should be suitable for a learner at ${levelDescription}. Do not include any questions from other domains or general knowledge—only about '${topic}'. Each question must have 1 correct answer and 3 plausible but incorrect options. Format the response as a JSON array: [{\"question\": string, \"options\": string[], \"answer\": string}]. Do not include explanations or any text outside the JSON array.${exampleText}`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const match = text.match(/\[[\s\S]*\]/);
    const quizData = match ? JSON.parse(match[0]) : [];

    return new Response(JSON.stringify(quizData), { status: 200 });
  } catch (err) {
    console.error("❌ Failed to parse Gemini response:", err);
    return new Response(
      JSON.stringify({ error: "Failed to parse AI response.", raw: (err as Error).message }),
      { status: 500 }
    );
  }
}

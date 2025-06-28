import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    /*const { position, description, experience } = await req.json();
    console.log("Received data in route:", {
      position,
      description,
      experience,
    });*/const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is missing" }), {
        status: 400,
      });
    }
    console.log("GEMINI_API_KEY in route:", process.env.GEMINI_API_KEY);
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in environment variables.");
      return Response.json(
        { error: "GEMINI_API_KEY is not set." },
        { status: 500 }
      );
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    /*const prompt = `Generate 10 interview questions and answers in JSON format for the following job:
Position: ${position}
Description: ${description}
Experience: ${experience} years
Return ONLY a JSON object with this exact structure:
{
  "questions": [
    {
      "question": "string",
      "answer": "string"
    }
  ]
}`;*/

    const result = await model.generateContent(prompt);
    console.log("Generated result in route:", result);
    console.log("Generated response in route:", result.response);
    const text = result.response.text();
    console.log("Generated text in route:", text);
    return Response.json({ result: text });
  } catch (err) {
    console.error("Gemini Error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
    });
  }
}

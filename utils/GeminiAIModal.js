const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in environment variables");
  throw new Error("GEMINI_API_KEY is not configured. Please add it to your .env.local file");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `I am applying for a Full Stack Developer role. The job description includes React, Node.js, MongoDB, and REST APIs.`
        }
      ]
    },
    {
      role: "model",
      parts: [
        { text: "Got it. What would you like help with?" }
      ]
    },
    {
      role: "user",
      parts: [
        {
          text: `Generate 10 mock interview questions with answers in JSON format. Each item should include a "question" and an "answer" field.`
        }
      ]
    },
    {
      role: "model",
      parts: [
        {
          text: `[
  {
    "question": "What is React?",
    "answer": "React is a JavaScript library for building user interfaces."
  }
]`
        }
      ]
    },
    {
      role: "user",
      parts: [
        {
          text: `Also include behavioral and HR questions and answers in the same JSON array.`
        }
      ]
    }
  ]
});

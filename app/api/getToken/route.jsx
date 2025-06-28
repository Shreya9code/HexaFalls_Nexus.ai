import { AssemblyAI } from "assemblyai";

// ✅ Create a named client instance
const assembly = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

export async function GET(req) {
  try {
    const token = await assembly.realtime.createTemporaryToken();

    console.log("Temporary token generated:", token);

    return Response.json({ token });
  } catch (error) {
    console.error("Failed to generate token:", error);
    return new Response("Failed to generate token", { status: 500 });
  }
}

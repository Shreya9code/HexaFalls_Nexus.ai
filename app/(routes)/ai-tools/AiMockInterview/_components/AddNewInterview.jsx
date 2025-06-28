// Popup screen to get the interview details
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/configs/db";
import { MockInterview } from "@/configs/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const cleanJsonResponse = (text) => {
    // Remove any markdown code block indicators
    let cleaned = text.replace(/```json\n?|\n?```/g, "").trim();

    // Find the first { and last } to extract just the JSON object
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    return cleaned;
  };

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      // Creating a more structured prompt for better JSON response
      const InputPrompt = `Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions and answers in JSON format for the following job:
            Position: ${jobPosition}
            Description: ${jobDesc}
            Experience: ${jobExperience} years
            Return ONLY a JSON object with this exact structure:
            {
                "questions": [
                    {
                        "question": "string",
                        "answer": "string"
                    }
                ]
            }
            
            Do not include any other text or explanation, only the JSON object.`;
      if (!InputPrompt || InputPrompt.trim() === "") {
        toast.error("Prompt is empty");
        return;
      }
      console.log("Input Prompt", InputPrompt);
      console.log(
        "gemini api in add new interview",
        process.env.GEMINI_API_KEY
      );
      const response = await fetch("/api/generate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: InputPrompt }),
      });
      const data = await response.json();
      console.log("Response from AI:", data);
      const rawText = data.result;
      console.log("Raw AI response:", rawText); //correct upto this
      try {
        let cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();
        console.log("Cleaned text:", cleaned);
        const parsedJson = JSON.parse(cleaned);
        if (!parsedJson.questions || !Array.isArray(parsedJson.questions)) {
          throw new Error("Invalid JSON structure: missing questions array");
        }
        console.log(parsedJson.questions); // Access the array of {question, answer}
        
        // Store the entire questions array as a JSON string
        const MockJsonResp = JSON.stringify(parsedJson.questions);
        setJsonResponse(MockJsonResp);
        console.log("mock json response", MockJsonResp);
        
        const resp = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: MockJsonResp, // Store the stringified array
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-yyyy"),
          })
          .returning({ mockId: MockInterview.mockId });
        if (resp) {
          setOpenDailog(false);
router.push('/ai-tools/AiMockInterview/interview/' + resp[0]?.mockId);
        }
      } catch (jsonError) {
        console.error("Invalid JSON response:", jsonError);
        console.log("Raw response:", MockJsonResp);
        alert(
          "Error: The AI response was not in the correct format. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "An error occurred while generating the interview questions. Please try again."
      );
    }
    setLoading(false);
  };
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary
            hover:scale-105 hover:shadow-md cursor-pointer
             transition-all border-dashed"
        onClick={() => setOpenDailog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription>
              Add Details about your job position/role, Job description and
              years of experience
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="mt-7">
              <label className="block mb-2">Job Role/Job Position</label>
              <Input
                placeholder="Ex. Full Stack Developer"
                required
                onChange={(event) => setJobPosition(event.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">
                Job Description/ Tech Stack (In Short)
              </label>
              <Textarea
                placeholder="Ex. React, Angular, NodeJs, MySql etc"
                required
                onChange={(event) => setJobDesc(event.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Years of experience</label>
              <Input
                placeholder="Ex.5"
                type="number"
                max="100"
                required
                onChange={(event) => setJobExperience(event.target.value)}
              />
            </div>
            <div className="flex gap-5 justify-end mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDailog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2" />
                    Generating from AI
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;

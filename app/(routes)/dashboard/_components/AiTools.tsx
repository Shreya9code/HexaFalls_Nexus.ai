"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import AiToolCard from "./AiToolCard";

const tools = [
  {
    name: "AI Career Chat",
    desc: "Get personalized career advice and guidance from our AI mentor. Ask questions about career paths, job search strategies, and professional development.",
    icon: "/globe.svg",
    button: "Start Chat",
    path: "/ai-tools/ai-chat",
  },
  {
    name: "AI Resume Analyzer",
    desc: "Upload your resume and get detailed feedback on content, formatting, and optimization suggestions to make it stand out to employers.",
    icon: "/file.svg",
    button: "Analyze Resume",
    path: "/ai-tools/ai-resume-analyzer",
  },
  {
    name: "Career Roadmap",
    desc: "Generate a personalized career roadmap based on your goals, skills, and experience. Get step-by-step guidance for your career journey.",
    icon: "/grid.svg",
    button: "Create Roadmap",
    path: "/ai-tools/ai-roadmap-agent",
  },
  {
    name: "AI Mock Interview",
    desc: "Practice interviews with our AI interviewer. Get real-time feedback on your responses and improve your interview skills.",
    icon: "/webcam.png",
    button: "Start Interview",
    path: "/ai-tools/AiMockInterview",
  },
  {
    name: "Coding Contest Tracker",
    desc: "Track coding contests and competitions. Stay updated with upcoming events and manage your participation.",
    icon: "/ban.png",
    button: "View Contests",
    path: "/ai-tools/contest-tracker",
  },
  {
    name: "Quiz",
    desc: "Test your knowledge and skills with AI-generated quizzes. Compete on the leaderboard and track your progress.",
    icon: "/grid.svg",
    button: "Start Quiz",
    path: "/ai-tools/quiz",
  },
];

const AiTools = () => {
  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Available AI Tools
        </h2>
        <p className="text-muted-foreground text-lg">
          Start building and shape your career with smart tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <AiToolCard key={index} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default AiTools;

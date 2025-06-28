"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import AiToolCard from "./AiToolCard";

const tools = [
  {
    name: "AI Career Chat",
    desc: "Summon the ancient AI spirits for personalized career guidance. Ask questions about career paths, job search strategies, and professional development.",
    icon: "/globe.svg",
    button: "🧭 Seer’s Compass ",
    path: "/ai-tools/ai-chat",
    emoji: "🔮",
    color: "emerald"
  },
  {
    name: "AI Resume Analyzer",
    desc: "Unlock the secrets hidden within your resume. Upload and receive mystical insights on content, formatting, and optimization to make it stand out.",
    icon: "/file.svg",
    button: "📜Journal of Insights",
    path: "/ai-tools/ai-resume-analyzer",
    emoji: "📜",
    color: "violet"
  },
  {
    name: "Career Roadmap",
    desc: "Chart your path through the enchanted forest of career possibilities. Generate a personalized roadmap based on your goals, skills, and experience.",
    icon: "/grid.svg",
    button: "🗺️ Create Map",
    path: "/ai-tools/ai-roadmap-agent",
    emoji: "🗺️",
    color: "cyan"
  },
  {
    name: "AI Mock Interview",
    desc: "Face the digital temple guardian in practice interviews. Get real-time feedback on your responses and improve your interview skills.",
    icon: "/webcam.png",
    button: "⚔️Mirror Realm Interviews:",
    path: "/ai-tools/AiMockInterview",
    emoji: "⚔️",
    color: "emerald"
  },
  {
    name: "Coding Contest Tracker",
    desc: "Track the great coding tournaments and competitions. Stay updated with upcoming events and manage your participation in the digital arena.",
    icon: "/ban.png",
    button: "🏆 Wishing Well Contests",
    path: "/ai-tools/contest-tracker",
    emoji: "🏆",
    color: "violet"
  },
  {
    name: "Quiz",
    desc: "Test your knowledge and skills with AI-generated mystical quizzes. Compete on the leaderboard and track your progress through the enchanted challenges.",
    icon: "/grid.svg",
    button: "🧠Mystery Quest",
    path: "/ai-tools/quiz",
    emoji: "🧠",
    color: "cyan"
  },
];

const AiTools = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
          
        </h2>
        <p className="text-emerald-100 text-xl max-w-2xl mx-auto">
          Choose your magical tools and begin your journey through the enchanted forest of career possibilities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <div key={index} className="floating" style={{ animationDelay: `${index * 0.2}s` }}>
            <AiToolCard tool={tool} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;

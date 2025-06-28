"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ResumeUploadDialog from "./ResumeUploadDialog";
import RoadmapGeneratorDialog from "./RoadmapGeneratorDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Sparkles } from 'lucide-react'

interface TOOL {
  name: string;
  desc: string;
  icon: string;
  button: string;
  path: string;
  emoji?: string;
  color?: string;
}

interface AiToolProps {
  tool: TOOL;
}

const AiToolCard = ({ tool }: AiToolProps) => {
  const [id, setId] = useState("");
  const [openResumeUpload, setOpenResumeUpload] = useState(false);
  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false);
  
  useEffect(() => {
    setId(uuidv4());
  }, []);
  
  const { user } = useUser();
  const router = useRouter();
  
  const onClickButton = async () => {
    if (tool.name == "AI Resume Analyzer") {
      setOpenResumeUpload(true);
      return;
    }
    if (tool.path == "/ai-tools/ai-roadmap-agent") {
      setOpenRoadmapDialog(true);
      return;
    }
    if (tool.name === "Coding Contest Tracker" || tool.name === "AI Mock Interview") {
      router.push(tool.path);
      return;
    }
    console.log(`Navigating to: ${tool.path}/${id}`);
    const result = await axios.post("/api/history", {
      recordId: id,
      content: [],
      aiAgentType: tool.path,
    });
    console.log("result after axios post", result);
    router.push(`${tool.path}/${id}`);
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'emerald':
        return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 hover:border-emerald-400/50';
      case 'violet':
        return 'from-violet-500/20 to-violet-600/20 border-violet-500/30 hover:border-violet-400/50';
      case 'cyan':
        return 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 hover:border-cyan-400/50';
      default:
        return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 hover:border-emerald-400/50';
    }
  };
  
  return (
    <>
      <Card className={`group glass-panel mystical-border transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl ${getColorClasses(tool.color)}`}>
        <CardHeader className="pb-4 relative">
          {/* Mystical glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-violet-500/5 rounded-t-xl"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className={`p-4 rounded-xl bg-gradient-to-br ${getColorClasses(tool.color)} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10 flex items-center justify-center">
                <Image src={tool.icon} alt={tool.name} width={28} height={28} className="filter brightness-0 invert" />
              </div>
              {/* Floating sparkle */}
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-emerald-400 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{tool.emoji}</span>
                <CardTitle className="text-xl font-bold text-foreground bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                  {tool.name}
                </CardTitle>
              </div>
              <CardDescription className="text-emerald-100 text-sm leading-relaxed">
                {tool.desc}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <Button 
            onClick={onClickButton}
            variant="outline" 
            className={`w-full group-hover:bg-gradient-to-r ${getColorClasses(tool.color)} group-hover:text-white transition-all duration-300 border-current hover:scale-105 relative overflow-hidden`}
          >
            <span className="relative z-10">{tool.button}</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Button>
        </CardContent>
        
        {/* Mystical corner decorations */}
        <div className="absolute top-2 right-2 text-emerald-400 text-xs animate-pulse">✨</div>
        <div className="absolute bottom-2 left-2 text-violet-400 text-xs animate-pulse" style={{ animationDelay: '1s' }}>💫</div>
      </Card>

      <ResumeUploadDialog
        openResumeUpload={openResumeUpload}
        setOpenResumeDialog={setOpenResumeUpload}
      />
      
      <RoadmapGeneratorDialog
        openDialog={openRoadmapDialog}
        setOpenDialog={setOpenRoadmapDialog}
      />
    </>
  );
};

export default AiToolCard;

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
import { ArrowRight } from 'lucide-react'

interface TOOL {
  name: string;
  desc: string;
  icon: string;
  button: string;
  path: string;
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
  
  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <div className="text-blue-600 dark:text-blue-400">
                <Image src={tool.icon} alt={tool.name} width={24} height={24} />
              </div>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">{tool.name}</CardTitle>
              <CardDescription className="text-muted-foreground">{tool.desc}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onClickButton}
            variant="outline" 
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 border-border hover:border-primary"
          >
            {tool.button}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
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

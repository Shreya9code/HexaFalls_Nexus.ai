import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import axios from "axios";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";

const RoadmapGeneratorDialog = ({openDialog,setOpenDialog,}: {openDialog: boolean;setOpenDialog: (open: boolean) => void;}) => {
  const [userInput,setUserInput]=useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router=useRouter()
  const generateRoadmap = async () => {
    const roadmapId = v4();setLoading(true)
    console.log("Generating roadmap...",roadmapId);
    try {
      const result = await axios.post("/api/ai-roadmap-agent", {
        roadmapId: roadmapId,userInput:userInput
      });//console.log("Roadmap generation result:", result.data);
      router.push(`/ai-tools/ai-roadmap-agent/${roadmapId}`);
      //window.location.href = `/ai-tools/ai-roadmap-agent/${roadmapId}`;
    } catch (e) {
      console.error("Error",e)
    }setLoading(false)
    setOpenDialog(false);
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[425px] rounded-lg bg-white dark:bg-gray-800 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Enter Position
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
            <Input placeholder="e.g., Frontend Intern" onChange={(event)=>setUserInput(event.target.value)}/>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
  disabled={loading || !userInput}
  onClick={generateRoadmap}
  className="ml-2 bg-blue-600 text-white hover:bg-blue-700"
>
  {loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4" />
      Generating...
    </>
  ) : (
    <>
      <Sparkles className="mr-2 h-4 w-4" />
      Generate
    </>
  )}
</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoadmapGeneratorDialog;

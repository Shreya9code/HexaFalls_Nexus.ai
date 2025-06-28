import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { File, Loader2Icon, Sparkle, UploadCloud } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const ResumeUploadDialog = ({ openResumeUpload, setOpenResumeDialog }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading,setLoading]=useState(false)
  const router=useRouter()
  const onFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file.name);
      setFile(file);
    }
  };
  const onUploadAndAnalyze =async () => {
    setLoading(true)
    if (!file) return;
    const recordId = uuidv4();
    const formData = new FormData();
    formData.append("recordId", recordId);
    formData.append("resumeFile", file);
    //formData.append("aiAgentType", '/ai-tools/ai-resume-analyzer');
    console.log("FormData ready to be sent:", formData);
    // ✅ Proper FormData inspection
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }try {
    const result = await axios.post("/api/ai-resume-agent", formData);
    console.log("result.data", result.data);
    console.log("result.data.runStatus.data",result.data.runStatus.data)
    console.log("result.data.runStatus.data[0].output.resumeAnalysis",result.data.runStatus.data[0].output.resumeAnalysis);
    console.log("result.data.runStatus.data[0].output.resumeAnalysis.overall.score",result.data.runStatus.data[0].output.resumeAnalysis.overall.score)
    router.push('/ai-tools/ai-resume-analyzer/'+recordId)
    setOpenResumeDialog(false)
  } catch (err) {
    console.error("Upload error", err);
  }setLoading(false);
  };
  return (
    <Dialog open={openResumeUpload} onOpenChange={setOpenResumeDialog}>
      <DialogContent className="sm:max-w-[425px] rounded-lg bg-white dark:bg-gray-800 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Upload Your Resume
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
            AI-powered analysis of your professional resume
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <label
            htmlFor="resumeUpload"
            className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              <UploadCloud className="w-10 h-10 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              {file ? (
                <h2>{file.name}</h2>
              ) : (
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, DOCX (MAX. 5MB)
              </p>
            </div>
            <input
              id="resumeUpload"
              onChange={onFileChange}
              type="file"
              className="hidden"
              accept=".pdf,.docx"
            />
          </label>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setOpenResumeDialog(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            Cancel
          </button>{loading ? (
  <Button disabled className="px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2">
    <Loader2Icon className="animate-spin w-4 h-4" />
    Analyzing...
  </Button>
) : (
  <Button
    onClick={onUploadAndAnalyze}
    disabled={!file}
    className="px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2"
    variant={file ? "default" : "secondary"}
  >
    <Sparkle className="w-4 h-4" />
    Analyze with AI
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 ml-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  </Button>
)}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeUploadDialog;

"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Report from "./_components/Report";
import ResumeUploadDialog from "@/app/(routes)/dashboard/_components/ResumeUploadDialog";

const AiResumeAnalyzer = () => {
  const params = useParams();
  const recordId = params?.recordid;
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [aiReport, setAiReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openResumeUpload, setOpenResumeDialog] = useState(false);

  useEffect(() => {
    if (recordId) getResumeAnalyzerRecord();
  }, [recordId]);

  const getResumeAnalyzerRecord = async () => {
    try {
      const result = await axios.get("/api/history?recordId=" + recordId);
      console.log("result.data", result.data);
      setPdfUrl(result.data.metaData);
      setAiReport(result.data.content);
    } catch (error) {
      console.error("Failed to fetch history record:", error);
    }
  };

  useEffect(() => {
    if (aiReport) {
      console.log("aiReport", aiReport);
    }
  }, [aiReport]);

  /*useEffect(() => {
    const getResumeAnalyzerRecord = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await axios.get("/api/history?recordId=" + recordId);
        console.log("Full API response:", result);
        console.log("API Response:", result.data);
        /*console.log("Run data:", result.data?.runStatus?.data?.[0]);
        console.log("Output:", result.data?.runStatus?.data?.[0]?.output);
        const runData = result.data?.runStatus?.data?.[0];
        if (!runData) {
          throw new Error("Invalid data structure: missing runStatus.data[0]");
        }
        const data = runData.output;
        if (!data?.resumeAnalysis) {
          throw new Error("Missing resumeAnalysis in response");
        }
        if (data) {
          setPdfUrl(data.fileUrl);
          setAiReport(data.resumeAnalysis);
        } else {
          console.warn("Invalid result data structure.");
        }
      } catch (error) {
        console.error("Error fetching resume analysis:", error);
      }
    };
console.log("recordId from useParams:", recordId);
    if (recordId) getResumeAnalyzerRecord();
  }, [recordId]);*/
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl shadow-md min-h-[120vh]">
      {/* Report Section */}
      <div className="p-4 bg-card rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground dark:text-gray-100">AI Resume Report</h2>
          <button
            type="button"
            onClick={() => setOpenResumeDialog(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300
                       bg-gradient-to-r from-blue-700 to-violet-800 text-white shadow-sm hover:shadow-md
                       hover:from-violet-800 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30
                       active:scale-[0.98] transform-gpu border border-violet-600/30 hover:border-violet-500/50
                       group"
          >
            <span className="group-hover:translate-x-0.5 transition-transform">Upload New Resume</span>
            <i className="fa-solid fa-upload text-slate-300 group-hover:text-white transition-all duration-500"></i>
          </button>
        </div>
        <Report aiReport={aiReport} />
      </div>

      {/* Resume Preview Section */}
      <div className="p-4 bg-card rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-gray-100">
          Resume Preview
        </h2>
        <div className="relative w-full h-[150vh] border border-gray-200 rounded-lg overflow-hidden">
          {pdfUrl && typeof window !== "undefined" && pdfUrl.trim() !== "" && pdfUrl.toLowerCase().endsWith('.pdf') ? (
            <iframe src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`} className="w-full h-full" frameBorder="0"/>
          ) : aiReport && aiReport.originalFileName && aiReport.originalFileName.toLowerCase().endsWith('.docx') ? (
            <DocxAutoDownloadMessage fileName={aiReport.originalFileName} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300 text-lg">
              Resume preview is only available for PDF files.
            </div>
          )}
        </div>
      </div>
      <ResumeUploadDialog openResumeUpload={openResumeUpload} setOpenResumeDialog={setOpenResumeDialog} />
    </div>
  );
};

function DocxAutoDownloadMessage({ fileName }: { fileName: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-300 text-lg">
      <span>Resume preview is only available for PDF files.</span>
    </div>
  );
}

export default AiResumeAnalyzer;

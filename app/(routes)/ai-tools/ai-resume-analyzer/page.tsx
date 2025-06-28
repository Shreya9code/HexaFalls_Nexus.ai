"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Report from './[recordid]/_components/Report';
import ResumeUploadDialog from '../../dashboard/_components/ResumeUploadDialog';

export default function ResumeAnalyzerPage() {
  const [openResumeUpload, setOpenResumeDialog] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch all previous resume analyses for the user
    fetch('/api/history?aiAgentType=/ai-tools/ai-resume-analyzer')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHistory(data);
      });
  }, []);

  // When a new resume is uploaded, store its recordId
  const handleUploadSuccess = (recordId: string) => {
    localStorage.setItem('resumeAnalyzerLastRecordId', recordId);
    setOpenResumeDialog(false);
    // Refetch history
    fetch('/api/history?aiAgentType=/ai-tools/ai-resume-analyzer')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHistory(data);
      });
    router.push(`/ai-tools/ai-resume-analyzer/${recordId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-6 text-foreground">AI Resume Analyzer</h1>
      <p className="mb-8 text-muted-foreground text-center max-w-xl">Upload your resume to get instant, AI-powered feedback and actionable insights to improve your job prospects.</p>
      <button
        onClick={() => setOpenResumeDialog(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors mb-8"
      >
        Upload Resume
      </button>
      <ResumeUploadDialog openResumeUpload={openResumeUpload} setOpenResumeDialog={setOpenResumeDialog} onUploadSuccess={handleUploadSuccess} />
      {history.length > 0 ? (
        <div className="w-full max-w-2xl mb-8">
          <h2 className="text-xl font-semibold mb-2 text-foreground">Previous Analyses</h2>
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {history.map((item) => {
              // Prefer originalFileName if present
              let fileName = item.originalFileName || 'Unknown file';
              if (!item.originalFileName && item.metaData && typeof item.metaData === 'string') {
                try {
                  const urlParts = item.metaData.split('/');
                  fileName = urlParts[urlParts.length - 1] || fileName;
                } catch {}
              }
              return (
                <li key={item.recordId} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-accent transition-colors">
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">{item.content?.metadata?.analysis_date || 'Unknown date'}</span>
                    <span className="ml-2 text-muted-foreground">Score: {item.content?.overall?.score ?? '--'}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{fileName}</span>
                  </div>
                  <button
                    className="mt-2 md:mt-0 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    onClick={() => router.push(`/ai-tools/ai-resume-analyzer/${item.recordId}`)}
                  >
                    View Report
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="mb-8 text-muted-foreground">No previous resume analyses found.</div>
      )}
    </div>
  );
} 
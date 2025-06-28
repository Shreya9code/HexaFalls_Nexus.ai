// Handling the start of a new interview
"use client";
import { db } from "@/configs/db";
import { MockInterview, UserAnswer } from "@/configs/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState, useRef } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Webcam from "react-webcam";
//import { getToken } from "@/services/GlobalServices";
//import AssemblyAITranscriber from "./_components/socket";

function StartInterview({ params }) {
  const recorder = useRef(null);
  const silenceTimeout = useRef(null);
  const { interviewId } = React.use(params);
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const router = useRouter();
  const [enableMic, setEnableMic] = useState(false);
  const realtimeTranscriber = useRef(null);
  const [isFirstQuestionSpoken, setIsFirstQuestionSpoken] = useState(false);
  const webcamRef = useRef(null);
  const [mlAnalysisResult, setMlAnalysisResult] = useState(null);

  useEffect(() => {
    GetInterviewDetails();
  }, [interviewId]);

  // Auto-speak first question when interview loads
  useEffect(() => {
    if (!loading && mockInterviewQuestion.length > 0 && !isFirstQuestionSpoken) {
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        speakQuestion(mockInterviewQuestion[0]?.question);
        setIsFirstQuestionSpoken(true);
      }, 1000);
    }
  }, [loading, mockInterviewQuestion, isFirstQuestionSpoken]);

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window && text) {
      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const speech = new SpeechSynthesisUtterance(text);
        
        // Configure speech settings for better quality
        speech.rate = 0.9; // Slightly slower for clarity
        speech.pitch = 1.0; // Normal pitch
        speech.volume = 1.0; // Full volume
        
        // Wait for voices to load if they haven't already
        const setVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            // Try to use a better voice if available
            const preferredVoice = voices.find(voice => 
              voice.name.includes('Google') || 
              voice.name.includes('Natural') || 
              voice.name.includes('Enhanced') ||
              voice.name.includes('Microsoft')
            );
            if (preferredVoice) {
              speech.voice = preferredVoice;
            }
          }
        };
        
        // Set voice immediately if available, otherwise wait
        setVoice();
        if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = setVoice;
        }
        
        // Add event listeners for better control
        speech.onstart = () => {
          console.log('Started speaking first question');
        };
        
        speech.onend = () => {
          console.log('First question finished speaking');
        };
        
        speech.onerror = (event) => {
          console.warn('Speech synthesis error:', event.error || 'Unknown error');
          // Don't show alert for common errors that don't affect functionality
          if (event.error !== 'interrupted' && event.error !== 'canceled') {
            console.warn('Speech synthesis failed, but continuing with interview');
          }
        };
        
        window.speechSynthesis.speak(speech);
        
        console.log('Speaking question:', text);
      } catch (error) {
        console.warn('Speech synthesis setup error:', error);
      }
    }
  };

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (!result[0]?.jsonMockResp) {
        console.error("No interview data found");
        setLoading(false);
        return;
      }

      const jsonData = result[0].jsonMockResp;
      console.log("Raw JSON data from DB:", jsonData);

      let parsedQuestions = [];

      try {
        // First try to parse the raw data
        parsedQuestions = JSON.parse(jsonData);

        // Validate the parsed data
        if (!Array.isArray(parsedQuestions)) {
          throw new Error("Parsed data is not an array");
        }

        // Ensure each question has the required format
        parsedQuestions = parsedQuestions
          .map((q) => {
            if (typeof q === "string") {
              return { question: q, answer: "" };
            }
            if (!q.question) {
              return null;
            }
            return {
              question: q.question,
              answer: q.answer || "",
            };
          })
          .filter(Boolean);

        console.log("Successfully parsed questions:", parsedQuestions);
      } catch (e) {
        console.error("Failed to parse questions:", e);
        parsedQuestions = [];
      }

      setMockInterviewQuestion(parsedQuestions);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview data:", error);
    } finally {
      setLoading(false);
    }
  };

/*  const connectToServer = async () => {
    try {
      setEnableMic(true);
      const token = await getToken();
      console.log("Token received in page.jsx:", token);
      
      realtimeTranscriber.current = new AssemblyAITranscriber(token);
      
      realtimeTranscriber.current.on("transcript", (transcript) => {
        console.log("📝Transcript received:", transcript);
      });
      
      realtimeTranscriber.current.on("error", (e) => {
        console.log("WebSocket error:", e);
      });
      
      await realtimeTranscriber.current.connect();
      console.log("Connected to AssemblyAI!");
      
      // Initialize audio recording
      if (typeof window !== "undefined" && typeof navigator !== "undefined") {
        const RecordRTC = (await import("recordrtc")).default;
        
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            recorder.current = new RecordRTC(stream, {
              type: "audio",
              mimeType: "audio/webm;codecs=pcm",
              recorderType: RecordRTC.StereoAudioRecorder,
              timeSlice: 250,
              desiredSampleRate: 16000,
              audioBitsPerSecond: 128000,
              numberOfAudioChannels: 1,
              bufferSize: 4096,
              ondataavailable: async (blob) => {
                if (!realtimeTranscriber.current) return;
                clearTimeout(silenceTimeout.current);
                const buffer = await blob.arrayBuffer();
                console.log("Sending buffer of size:", buffer.byteLength);
                realtimeTranscriber.current.sendAudio(buffer);
                silenceTimeout.current = setTimeout(() => {
                  console.log("Candidate stopped speaking");
                }, 8000);
              },
            });
            recorder.current.startRecording();
            console.log("Started recording audio stream.");
          })
          .catch((err) => console.log("Error accessing microphone:", err));
      }
    } catch (error) {
      console.error("Error connecting to AssemblyAI:", error);
      setEnableMic(false);
    }
  };
  
  const disconnect = async (e) => {
    e.preventDefault();
    try {
      if (realtimeTranscriber.current) {
        await realtimeTranscriber.current.close();
      }
      if (recorder.current) {
        recorder.current.stopRecording();
        recorder.current = null;
      }
      setEnableMic(false);
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };
*/
  // End Interview logic: insert default feedback for unanswered questions
  const handleEndInterview = async () => {
    try {
      // Fetch all user answers for this interview
      const existingAnswers = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId));

      const answeredQuestions = new Set(
        existingAnswers.map((ans) => ans.question)
      );

      const userEmail = interviewData?.createdBy || null;
      const today = new Date();
      const dateStr = today.toLocaleDateString("en-GB").replace(/\//g, "-");

      // Insert default feedback for unanswered questions
      for (let q of mockInterviewQuestion) {
        if (!answeredQuestions.has(q.question)) {
          await db.insert(UserAnswer).values({
            mockIdRef: interviewId,
            question: q.question,
            correctAns: q.answer || "",
            userAns: "",
            feedback: "No answer provided.",
            rating: "N/A",
            userEmail: userEmail,
            createdAt: dateStr,
          });
        }
      }

      // Redirect to feedback page
      router.push(
        `/ai-tools/AiMockInterview/interview/${interviewId}/feedback`
      );
    } catch (error) {
      console.error("Error ending interview:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading interview questions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            AI Mock Interview
          </h1>
          <p className="text-muted-foreground">
            Question {activeQuestionIndex + 1} of {mockInterviewQuestion.length}
          </p>
        </div>

        {/* Video Call Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Window */}
          <div className="space-y-4">
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  AI Interviewer
                </h2>
              </div>
              <div className="p-6">
                {/* AI Video Window */}
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-4 mb-4">
                  <div className="flex justify-center items-center">
                    <div className="relative w-full max-w-md">
                      <div className="relative w-full h-[300px] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                        {/* Pulsing ring to indicate speaking */}
                        <span className="absolute inline-flex h-full w-full rounded-lg bg-blue-400 opacity-75 animate-ping"></span>
                        {/* AI Avatar */}
                        <Image
                          src="/logo.png?v=2"
                          alt="AI Avatar"
                          width={200}
                          height={200}
                          className="relative rounded-lg border-4 border-blue-500 shadow-lg"
                        />
                        {/* Animated sound waves */}
                        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1">
                          <span className="block w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.2s]"></span>
                          <span className="block w-2 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-.1s]"></span>
                          <span className="block w-2 h-4 bg-blue-300 rounded-full animate-bounce"></span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                      AI is interviewing you...
                    </p>
                  </div>
                </div>

                {/* Current Question */}
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Current Question:</h3>
                  <p className="text-foreground leading-relaxed">
                    {mockInterviewQuestion[activeQuestionIndex]?.question || "Loading question..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Question Progress */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Question Progress
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {mockInterviewQuestion.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveQuestionIndex(index);
                      setShowFeedback(false);
                      setFeedbackData(null);
                    }}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      index === activeQuestionIndex
                        ? 'bg-primary text-primary-foreground'
                        : index < activeQuestionIndex
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                        : 'bg-muted text-muted-foreground border border-border hover:bg-accent'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Window */}
          <div className="space-y-4">
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="text-xl">👤</span>
                  You (Candidate)
                </h2>
              </div>
              <div className="p-6">
                {/* User Video Window */}
                <div className="relative bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg p-4 mb-4">
                  <div className="flex justify-center items-center">
                    <div className="relative w-full max-w-md">
                      <Image src={'/webcam.png'} width={400} height={300} alt='webcam' className="absolute w-full h-full object-cover rounded-lg" />
                      <Webcam
                        ref={webcamRef}
                        mirrored={true}
                        style={{
                          width: '100%',
                          height: '300px',
                          zIndex: 10,
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                      Ready to answer...
                    </p>
                  </div>
                </div>

                {/* Recording Controls */}
                <div className="space-y-4">
                  <RecordAnswerSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                    setActiveQuestionIndex={setActiveQuestionIndex}
                    setShowFeedback={setShowFeedback}
                    setFeedbackData={setFeedbackData}
                    webcamRef={webcamRef}
                    setMlAnalysisResult={setMlAnalysisResult}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Section - Below both windows */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
            📊 Video Analysis Results
          </h2>
          <div className="space-y-4">
            {/* Analysis content will be rendered here */}
            {mlAnalysisResult && (
              <div className="space-y-6">
                {/* Duration and Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-background p-4 rounded-lg border text-center">
                    <div className="text-sm text-muted-foreground mb-1">Duration</div>
                    <div className="text-xl font-bold text-primary">
                      {mlAnalysisResult.duration_seconds || mlAnalysisResult.facial_metrics?.duration_seconds || 'N/A'}s
                    </div>
                  </div>
                  <div className="bg-background p-4 rounded-lg border text-center">
                    <div className="text-sm text-muted-foreground mb-1">Face Visibility</div>
                    <div className="text-xl font-bold text-primary">
                      {mlAnalysisResult.facial_analysis?.face_visibility || mlAnalysisResult.facial_metrics?.face_visibility || 0}%
                    </div>
                  </div>
                  <div className="bg-background p-4 rounded-lg border text-center">
                    <div className="text-sm text-muted-foreground mb-1">Eye Contact</div>
                    <div className="text-xl font-bold text-primary">
                      {mlAnalysisResult.facial_analysis?.eye_contact || mlAnalysisResult.facial_metrics?.eye_contact || 0}%
                    </div>
                  </div>
                  <div className="bg-background p-4 rounded-lg border text-center">
                    <div className="text-sm text-muted-foreground mb-1">Facial Stability</div>
                    <div className="text-xl font-bold text-primary">
                      {mlAnalysisResult.facial_analysis?.facial_stability || mlAnalysisResult.facial_metrics?.facial_stability || 0}%
                    </div>
                  </div>
                </div>

                {/* Feedback and Suggestions Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-background p-4 rounded-lg border">
                    <h5 className="font-semibold text-foreground mb-3">💬 Facial Expression Feedback</h5>
                    <p className="text-sm text-foreground leading-relaxed">
                      {mlAnalysisResult.facial_expression_feedback || mlAnalysisResult.facialAnalysis?.feedback || 'No feedback available'}
                    </p>
                  </div>
                  <div className="bg-background p-4 rounded-lg border">
                    <h5 className="font-semibold text-foreground mb-3">💡 Suggestions</h5>
                    <ul className="space-y-1">
                      {(mlAnalysisResult.facial_suggestions || mlAnalysisResult.facialAnalysis?.suggestions || []).slice(0, 3).map((suggestion, index) => (
                        <li key={index} className="flex items-start text-sm text-foreground">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Speech Analysis (if available) */}
                {mlAnalysisResult.speechAnalysis && (
                  <div className="bg-background p-4 rounded-lg border">
                    <h5 className="font-semibold text-foreground mb-3">🎤 Speech Analysis</h5>
                    <p className="text-sm text-foreground mb-2">
                      <strong>Feedback:</strong> {mlAnalysisResult.speechAnalysis.feedback}
                    </p>
                    {mlAnalysisResult.speechAnalysis.suggestions && mlAnalysisResult.speechAnalysis.suggestions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-primary mb-1">Suggestions:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {mlAnalysisResult.speechAnalysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && feedbackData && (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              AI Feedback
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Rating</h3>
                <div className="text-2xl font-bold text-primary">{feedbackData.rating}/5</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Feedback</h3>
                <p className="text-foreground">{feedbackData.feedback}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Correct Answer</h3>
                <p className="text-foreground">{feedbackData.correctAns}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          {activeQuestionIndex > 0 && (
            <Button
              onClick={() => {
                setActiveQuestionIndex(activeQuestionIndex - 1);
                setShowFeedback(false);
                setFeedbackData(null);
              }}
              variant="outline"
              className="px-6"
            >
              ← Previous
            </Button>
          )}
          {activeQuestionIndex < mockInterviewQuestion.length - 1 && (
            <Button
              onClick={() => {
                setActiveQuestionIndex(activeQuestionIndex + 1);
                setShowFeedback(false);
                setFeedbackData(null);
              }}
              variant="outline"
              className="px-6"
            >
              Next →
            </Button>
          )}
          {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
            <Button 
              onClick={handleEndInterview} 
              disabled={loading}
              className="px-6"
            >
              End Interview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartInterview;

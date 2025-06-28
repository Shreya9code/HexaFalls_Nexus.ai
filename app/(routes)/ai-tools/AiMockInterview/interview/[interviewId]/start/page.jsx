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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
          setActiveQuestionIndex={setActiveQuestionIndex}
          setShowFeedback={setShowFeedback}
          setFeedbackData={setFeedbackData}
        />
      </div>
      
      {/* AI Avatar section moved below the main content */}
      <div className="flex justify-center items-center my-4">
        <div className="relative">
          {/* Pulsing ring to indicate speaking */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
          {/* Avatar image */}
          <Image
            src="/logo.png?v=2"
            alt="AI Avatar"
            width={100}
            height={100}
            className="relative rounded-full border-4 border-blue-500 shadow-lg"
          />
          {/* Optional: animated "mouth" or sound waves */}
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            <span className="block w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.2s]"></span>
            <span className="block w-2 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-.1s]"></span>
            <span className="block w-2 h-4 bg-blue-300 rounded-full animate-bounce"></span>
          </span>
        </div>
        <span className="ml-4 text-xl font-semibold text-blue-700">
          AI is interviewing you...
        </span>
      </div>
      
      {showFeedback && feedbackData && (
        <div className="mt-8 p-4 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-2">Feedback</h3>
          <p>
            <strong>Rating:</strong> {feedbackData.rating}/5
          </p>
          <p>
            <strong>Feedback:</strong> {feedbackData.feedback}
          </p>
          <p>
            <strong>Correct Answer:</strong> {feedbackData.correctAns}
          </p>
        </div>
      )}
      {/*enableMic ? (
        <Button onClick={disconnect}>Disconnect from Server</Button>
      ) : (
        <Button onClick={connectToServer}>Connect to Server</Button>
      )*/}
      <div className="flex justify-end gap-4">
        {activeQuestionIndex > 0 && (
          <Button
            onClick={() => {
              setActiveQuestionIndex(activeQuestionIndex - 1);
              setShowFeedback(false);
              setFeedbackData(null);
            }}
            variant="outline"
          >
            Previous Question
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
          >
            Next Question
          </Button>
        )}
        {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
          <Button onClick={handleEndInterview} disabled={loading}>
            End Interview
          </Button>
        )}
      </div>
      <div className="mt-8">
        <div className="bg-card rounded-lg shadow-md p-4 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">
            Chat Section
          </h2>
          <div
            className="h-64 overflow-y-auto space-y-4 px-2"
            id="chat-transcript"
          >
            {/* Example messages, replace with your dynamic transcript data */}
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0">
                <Image
                  src="/logo.png?v=2"
                  alt="AI"
                  width={32}
                  height={32}
                  className="rounded-full border border-blue-400"
                />
              </div>
              <div>
                <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm shadow">
                  Hello! I am your AI interviewer. Let's get started.
                </div>
                <div className="text-xs text-gray-400 mt-1">AI</div>
              </div>
            </div>
            <div className="flex items-start gap-2 flex-row-reverse">
              <div className="flex-shrink-0">
                <span className="inline-block w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold">
                  U
                </span>
              </div>
              <div>
                <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm shadow">
                  Thank you! I'm ready for the interview.
                </div>
                <div className="text-xs text-gray-400 mt-1 text-right">You</div>
              </div>
            </div>
            {/* More messages here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartInterview;

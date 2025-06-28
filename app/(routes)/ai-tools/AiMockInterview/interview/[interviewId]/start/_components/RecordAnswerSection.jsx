// Recording user responses on interview screen
"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect,useRef, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { db } from '@/configs/db'
import { UserAnswer } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
const ASSEMBLYAI_API_KEY = "9b7b08f286fa46c2a2e10242b7de56e7";
const WS_URL = `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000`;

function RecordAnswerSection({ 
    mockInterviewQuestion, 
    activeQuestionIndex, 
    interviewData, 
    setActiveQuestionIndex
}) {
    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    // Always derive the latest answer from results
    const latestTranscript = results && results.length > 0
        ? results.map(r => r.transcript).join(' ')
        : userAnswer;

    useEffect(() => {
        if (results && results.length > 0) {
            setUserAnswer(results.map(r => r.transcript).join(' '));
        }
    }, [results])

    // Reset transcript and userAnswer when question changes
    useEffect(() => {
        setUserAnswer('');
        setResults([]);
    }, [activeQuestionIndex, setResults]);

    // Automatically save answer when recording stops and transcript is not empty
    useEffect(() => {
        if (!isRecording && latestTranscript?.trim().length > 0) {
            UpdateUserAnswer();
        } else if (!isRecording && latestTranscript?.trim().length === 0) {
            toast('Please say something to record your answer.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRecording]);

    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText()
        } else {
            startSpeechToText();
        }
    }

    // Save answer logic
    const UpdateUserAnswer = async () => {
        try {
            setLoading(true);
            const feedbackPrompt = `You are an AI interviewer. Review the following question and answer, and provide feedback in JSON format with the following structure:
            {
                "rating": number (1-5),
                "feedback": "string",
                "correctAns": "string"
            }
            
            Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}
            Answer: ${userAnswer}
            
            Provide your feedback in valid JSON format only.`;

            const result = await chatSession.sendMessage(feedbackPrompt);
            const responseText = result.response.text();
            
            // Extract JSON from the response
            let jsonStr = responseText;
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            }

            try {
                const JsonFeedbackResp = JSON.parse(jsonStr);
                
                // Validate the response structure
                if (!JsonFeedbackResp.rating || !JsonFeedbackResp.feedback || !JsonFeedbackResp.correctAns) {
                    throw new Error('Invalid feedback structure');
                }

                const resp = await db.insert(UserAnswer).values({
                    mockIdRef: interviewData?.mockId,
                    question: mockInterviewQuestion[activeQuestionIndex]?.question,
                    userAns: userAnswer,
                    rating: JsonFeedbackResp.rating.toString(),
                    feedback: JsonFeedbackResp.feedback,
                    correctAns: JsonFeedbackResp.correctAns,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-yyyy')
                });

                if (resp) {
                    setActiveQuestionIndex(activeQuestionIndex + 1);
                    setUserAnswer('');
                    toast.success('Answer recorded successfully');
                }
            } catch (parseError) {
                console.error('Error parsing feedback:', parseError);
                // Fallback to a default feedback structure
                const defaultFeedback = {
                    rating: "3",
                    feedback: "Unable to generate detailed feedback. Please review your answer carefully.",
                    correctAns: "No correct answer provided."
                };
                
                const resp = await db.insert(UserAnswer).values({
                    mockIdRef: interviewData?.mockId,
                    question: mockInterviewQuestion[activeQuestionIndex]?.question,
                    userAns: userAnswer,
                    rating: defaultFeedback.rating,
                    feedback: defaultFeedback.feedback,
                    correctAns: defaultFeedback.correctAns,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-yyyy')
                });

                if (resp) {
                    setActiveQuestionIndex(activeQuestionIndex + 1);
                    setUserAnswer('');
                    toast.success('Answer recorded successfully');
                }
            }
        } catch (error) {
            console.error('Error in UpdateUserAnswer:', error);
            toast.error('Failed to save answer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
                <Image src={'/webcam.png'} width={200} height={200} alt='webcam'
                    className='absolute' />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 500,
                        width: 500,
                        zIndex: 10,
                    }}
                />
            </div>
            <Button
                disabled={loading}
                variant="outline" className="my-10"
                onClick={StartStopRecording}
            >
                {isRecording ? (
                    <h2 className='text-foreground animate-pulse flex gap-2 items-center'>
                        <Mic className="h-5 w-5" />
                        Recording...
                    </h2>
                ) : (
                    <h2 className='text-foreground flex gap-2 items-center'>
                        <Mic className="h-5 w-5" />
                        Click to Record
                    </h2>
                )}
            </Button>
            {/* Show live transcription */}
            <div className="w-full max-w-lg min-h-[40px] p-2 border rounded bg-background text-foreground text-center mb-4">
                <strong>Live Transcription:</strong> {interimResult || latestTranscript || <span className="text-gray-400">(Say something...)</span>}
            </div>
        </div>
    )
}

export default RecordAnswerSection

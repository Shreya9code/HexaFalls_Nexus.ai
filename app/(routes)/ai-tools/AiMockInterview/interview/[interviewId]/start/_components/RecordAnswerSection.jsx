// Recording user responses on interview screen
"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect,useRef, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle, Video, Download, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { db } from '@/configs/db'
import { UserAnswer } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'
const ASSEMBLYAI_API_KEY = "9b7b08f286fa46c2a2e10242b7de56e7";
const WS_URL = `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000`;

function RecordAnswerSection({ 
    mockInterviewQuestion, 
    activeQuestionIndex, 
    interviewData, 
    setActiveQuestionIndex,
    webcamRef,
    setMlAnalysisResult
}) {
    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isVideoRecording, setIsVideoRecording] = useState(false);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
    const [analysisCompleted, setAnalysisCompleted] = useState(false);
    const mediaRecorderRef = useRef(null);
    const videoStreamRef = useRef(null);
    const audioStreamRef = useRef(null);
    const router = useRouter();
    
    const {
        error,
        interimResult,
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
        if (!isRecording && !isVideoRecording && latestTranscript?.trim().length > 0) {
            UpdateUserAnswer();
        } else if (!isRecording && !isVideoRecording && latestTranscript?.trim().length === 0) {
            toast('Please say something to record your answer.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRecording, isVideoRecording]);

    // Unified recording function that handles both audio and video
    const handleRecording = async () => {
        if (isRecording || isVideoRecording) {
            // Stop recording
            if (isRecording) {
                stopSpeechToText();
            }
            if (isVideoRecording) {
                stopVideoRecording();
            }
            setIsRecording(false);
            setIsVideoRecording(false);
        } else {
            // Start recording both audio and video
            try {
                setIsRecording(true);
                setIsVideoRecording(true);
                
                // Start audio recording
                startSpeechToText();
                
                // Start video recording
                await startVideoRecording();
                
                toast.success('Recording started (audio + video)');
            } catch (error) {
                console.error('Error starting recording:', error);
                setIsRecording(false);
                setIsVideoRecording(false);
                toast.error('Failed to start recording');
            }
        }
    };

    // Start video recording with audio
    const startVideoRecording = async () => {
        try {
            // Reset analysis state
            setAnalysisCompleted(false);
            
            // Get video stream from webcam
            const videoStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'user'
                } 
            });
            
            // Get audio stream
            const audioStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                } 
            });

            videoStreamRef.current = videoStream;
            audioStreamRef.current = audioStream;

            // Combine video and audio streams
            const combinedStream = new MediaStream([
                ...videoStream.getVideoTracks(),
                ...audioStream.getAudioTracks()
            ]);

            // Create MediaRecorder with combined stream
            const mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: 'video/webm;codecs=vp9,opus'
            });

            const chunks = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setRecordedVideoUrl(url);
                
                // Save video to server
                saveVideoToServer(blob);
                
                // Stop all tracks
                videoStream.getTracks().forEach(track => track.stop());
                audioStream.getTracks().forEach(track => track.stop());
                
                toast.success('Video recorded and saved');
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
        } catch (error) {
            console.error('Error starting video recording:', error);
            toast.error('Failed to start video recording');
            throw error;
        }
    };

    // Stop video recording
    const stopVideoRecording = () => {
        if (mediaRecorderRef.current && isVideoRecording) {
            mediaRecorderRef.current.stop();
            toast.info('Video recording stopped');
        }
    };

    // Save video to server
    const saveVideoToServer = async (videoBlob) => {
        try {
            const formData = new FormData();
            formData.append('video', videoBlob, 'temp.webm');
            formData.append('interviewId', interviewData?.mockId || 'unknown');
            formData.append('questionIndex', activeQuestionIndex.toString());

            const response = await fetch('/api/save-interview-video', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Video saved to server:', result);
                toast.success(`Video saved: ${result.filename}`);
            } else {
                let errorMessage = 'Failed to save video to server';
                try {
                    const error = await response.json();
                    errorMessage = error.error || errorMessage;
                } catch (parseError) {
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                console.error('Failed to save video:', errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Error saving video to server:', error);
            toast.error(`Network error: ${error.message}`);
        }
    };

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
        <div className='flex items-center justify-center flex-col space-y-4'>
            {/* Unified Recording Button */}
            <Button
                disabled={loading}
                variant={isRecording || isVideoRecording ? "destructive" : "default"}
                className="px-8 py-3 text-lg font-medium"
                onClick={handleRecording}
            >
                {isRecording || isVideoRecording ? (
                    <div className='flex gap-2 items-center'>
                        <StopCircle className="h-5 w-5" />
                        Stop Recording
                    </div>
                ) : (
                    <div className='flex gap-2 items-center'>
                        <Mic className="h-5 w-5" />
                        Start Recording
                    </div>
                )}
            </Button>

            {/* Recording Status */}
            <div className="text-center">
                {(isRecording || isVideoRecording) && (
                    <div className="text-destructive font-semibold animate-pulse">
                        🎤🎥 Recording Audio & Video...
                    </div>
                )}
            </div>

            {/* Live Transcription */}
            <div className="w-full max-w-lg min-h-[40px] p-3 border rounded-lg bg-muted text-foreground text-center">
                <strong>Live Transcription:</strong> {interimResult || latestTranscript || <span className="text-muted-foreground">(Say something...)</span>}
            </div>

            {/* Recorded Video Preview */}
            {recordedVideoUrl && (
                <div className="mt-4 text-center space-y-4">
                    <h3 className="font-semibold">Video Analysis</h3>
                    <div className="space-y-2">
                        {/* Analyze Video Button */}
                        <Button
                            disabled={loading}
                            variant="default"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    const response = await fetch('/api/analyze-video', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            videoPath: 'uploads/temp.mp4',
                                            questionText: mockInterviewQuestion[activeQuestionIndex]?.question || ''
                                        })
                                    });

                                    if (response.ok) {
                                        const result = await response.json();
                                        if (result.error) {
                                            toast.error(result.error);
                                        } else {
                                            setAnalysisCompleted(true);
                                            setMlAnalysisResult(result);
                                            toast.success('Video analysis completed!');
                                        }
                                    } else {
                                        toast.error('Failed to analyze video');
                                    }
                                } catch (error) {
                                    console.error('Error analyzing video:', error);
                                    toast.error('Failed to analyze video');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="flex gap-2 items-center mx-auto"
                        >
                            <Download className="h-5 w-5" />
                            {loading ? 'Analyzing...' : 'Analyze Video'}
                        </Button>
                        
                        {/* View Feedback Button */}
                        {analysisCompleted && (
                            <div className="mt-4 space-y-2">
                                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                                    ✅ Video analysis completed!
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setAnalysisCompleted(false);
                                        setRecordedVideoUrl(null);
                                        setMlAnalysisResult(null);
                                    }}
                                    className="flex gap-2 items-center mx-auto"
                                >
                                    <Video className="h-5 w-5" />
                                    Record New Video
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecordAnswerSection

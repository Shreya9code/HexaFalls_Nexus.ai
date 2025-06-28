// Recording user responses on interview screen
"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect,useRef, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle, Video, Download } from 'lucide-react'
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
    const [isVideoRecording, setIsVideoRecording] = useState(false);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const videoStreamRef = useRef(null);
    const audioStreamRef = useRef(null);
    const webcamRef = useRef(null);
    
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

    // Start video recording with audio
    const startVideoRecording = async () => {
        try {
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
                
                toast.success('Video recorded and saved to uploads folder');
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsVideoRecording(true);
            
            toast.success('Video recording started');
        } catch (error) {
            console.error('Error starting video recording:', error);
            toast.error('Failed to start video recording');
        }
    };

    // Stop video recording
    const stopVideoRecording = () => {
        if (mediaRecorderRef.current && isVideoRecording) {
            mediaRecorderRef.current.stop();
            setIsVideoRecording(false);
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
                    ref={webcamRef}
                    mirrored={true}
                    style={{
                        height: 500,
                        width: 500,
                        zIndex: 10,
                    }}
                />
            </div>
            
            {/* Video Recording Controls */}
            <div className="flex gap-4 my-4">
                <Button
                    disabled={loading || isVideoRecording}
                    variant="outline"
                    onClick={startVideoRecording}
                    className="flex gap-2 items-center"
                >
                    <Video className="h-5 w-5" />
                    Start Video Recording
                </Button>
                
                <Button
                    disabled={loading || !isVideoRecording}
                    variant="destructive"
                    onClick={stopVideoRecording}
                    className="flex gap-2 items-center"
                >
                    <StopCircle className="h-5 w-5" />
                    Stop Video Recording
                </Button>
            </div>

            {/* Audio Recording Button */}
            <Button
                disabled={loading}
                variant="outline" 
                className="my-4"
                onClick={StartStopRecording}
            >
                {isRecording ? (
                    <h2 className='text-foreground animate-pulse flex gap-2 items-center'>
                        <Mic className="h-5 w-5" />
                        Recording Audio...
                    </h2>
                ) : (
                    <h2 className='text-foreground flex gap-2 items-center'>
                        <Mic className="h-5 w-5" />
                        Click to Record Audio
                    </h2>
                )}
            </Button>

            {/* Recording Status */}
            <div className="mb-4 text-center">
                {isVideoRecording && (
                    <div className="text-red-500 font-semibold animate-pulse">
                        🎥 Video Recording in Progress...
                    </div>
                )}
                {isRecording && (
                    <div className="text-blue-500 font-semibold animate-pulse">
                        🎤 Audio Recording in Progress...
                    </div>
                )}
                <div className="text-sm text-muted-foreground mt-2">
                    📁 Videos will be saved to: <code className="bg-muted px-1 rounded">uploads/</code>
                </div>
            </div>

            {/* Show live transcription */}
            <div className="w-full max-w-lg min-h-[40px] p-2 border rounded bg-background text-foreground text-center mb-4">
                <strong>Live Transcription:</strong> {interimResult || latestTranscript || <span className="text-gray-400">(Say something...)</span>}
            </div>

            {/* Recorded Video Preview */}
            {recordedVideoUrl && (
                <div className="mt-4 text-center">
                    <h3 className="font-semibold mb-2">Recorded Video (Saved to uploads/):</h3>
                    <video 
                        controls 
                        width="400" 
                        height="300" 
                        className="border rounded"
                    >
                        <source src={recordedVideoUrl} type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-2">
                            Video saved to uploads folder. Click below to download locally.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                const a = document.createElement('a');
                                a.href = recordedVideoUrl;
                                a.download = 'temp.mp4';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            }}
                            className="flex gap-2 items-center mx-auto"
                        >
                            <Download className="h-4 w-4" />
                            Download temp.mp4
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecordAnswerSection

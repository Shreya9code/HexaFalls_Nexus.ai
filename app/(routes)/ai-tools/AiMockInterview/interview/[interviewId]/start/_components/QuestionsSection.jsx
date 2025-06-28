// Implementing the questions section on interview screen
import { Lightbulb, Volume2 } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function QuestionsSection({mockInterviewQuestion, activeQuestionIndex}) {
    const speechRef = useRef(null);
    const isAutoSpeaking = useRef(false);

    const textToSpeach = (text) => {
        if ('speechSynthesis' in window) {
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
                
                speechRef.current = speech;
                
                // Add event listeners for better control
                speech.onstart = () => {
                    console.log('Started speaking question');
                    isAutoSpeaking.current = true;
                };
                
                speech.onend = () => {
                    console.log('Question finished speaking');
                    isAutoSpeaking.current = false;
                };
                
                speech.onerror = (event) => {
                    console.warn('Speech synthesis error:', event.error || 'Unknown error');
                    isAutoSpeaking.current = false;
                    
                    // Don't show alert for common errors that don't affect functionality
                    if (event.error !== 'interrupted' && event.error !== 'canceled') {
                        console.warn('Speech synthesis failed, but continuing with interview');
                    }
                };
                
                // Start speaking
                window.speechSynthesis.speak(speech);
                
            } catch (error) {
                console.warn('Speech synthesis setup error:', error);
                isAutoSpeaking.current = false;
            }
        } else {
            console.warn('Speech synthesis not supported in this browser');
        }
    }

    // Auto-speak when question changes
    useEffect(() => {
        if (questionsArray.length > 0 && questionsArray[activeQuestionIndex]?.question) {
            const currentQuestion = questionsArray[activeQuestionIndex].question;
            console.log('Auto-speaking question:', currentQuestion);
            isAutoSpeaking.current = true;
            
            // Small delay to ensure smooth transition
            setTimeout(() => {
                textToSpeach(currentQuestion);
            }, 500);
        }
    }, [activeQuestionIndex]);

    // Cleanup speech when component unmounts
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Parse and extract questions array
    let questionsArray = [];
    if (typeof mockInterviewQuestion === 'string') {
        try {
            const parsed = JSON.parse(mockInterviewQuestion);
            if (parsed && Array.isArray(parsed.questions)) {
                questionsArray = parsed.questions;
            } else if (Array.isArray(parsed)) {
                questionsArray = parsed;
            }
        } catch (e) {
            console.error("Error parsing questions:", e);
            questionsArray = [];
        }
    } else if (mockInterviewQuestion && Array.isArray(mockInterviewQuestion.questions)) {
        questionsArray = mockInterviewQuestion.questions;
    } else if (Array.isArray(mockInterviewQuestion)) {
        questionsArray = mockInterviewQuestion;
    }

    // If no questions are available, show a message
    if (!questionsArray.length) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-muted-foreground">No questions available for this interview.</p>
                </CardContent>
            </Card>
        );
    }

    const handleManualSpeak = () => {
        const currentQuestion = questionsArray[activeQuestionIndex]?.question;
        if (currentQuestion) {
            textToSpeach(currentQuestion);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Interview Questions</span>
                        <div className="flex items-center gap-2">
                            {isAutoSpeaking.current && (
                                <div className="flex items-center gap-1 text-sm text-blue-600">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                    Speaking...
                                </div>
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        {questionsArray.map((question, index) => (
                            <div
                                key={index}
                                className={`p-2 border rounded-full text-center cursor-pointer transition-colors
                                    ${activeQuestionIndex === index 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'hover:bg-muted'}`}
                            >
                                Question #{index + 1}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <p className="text-lg">{questionsArray[activeQuestionIndex]?.question}</p>
                            <button
                                onClick={handleManualSpeak}
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                                title="Replay question"
                            >
                                <Volume2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-muted">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Note
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {process.env.NEXT_PUBLIC_QUESTION_NOTE || "Questions will be automatically spoken. You can click the speaker icon to replay the current question. Please answer each question to the best of your ability."}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default QuestionsSection;
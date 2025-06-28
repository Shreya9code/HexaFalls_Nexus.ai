// Creating feedback page to provide feedback about the interview
"use client"
import { use } from 'react'
import { db } from '@/configs/db'
import { UserAnswer } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronsUpDown, Trophy, Target, TrendingUp, Star, ArrowLeft, CheckCircle, AlertCircle, Lightbulb, BarChart3, MessageSquare, Clock } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Fetching user recorded responses from database
export default function GetFeedback({ params }) {
    const [answers, setAnswers] = useState([]);
    const [overallFeedback, setOverallFeedback] = useState(null);
    const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    
    // Unwrap params using React.use()
    const unwrappedParams = use(params);
    const interviewId = unwrappedParams.interviewId;

    useEffect(() => {
        async function fetchFeedback() {
            try {
                setLoading(true);
                const result = await db.select()
                    .from(UserAnswer)
                    .where(eq(UserAnswer.mockIdRef, interviewId))
                    .orderBy(UserAnswer.id);
                setAnswers(result);
                generateOverallFeedback(result);
            } catch (error) {
                console.error('Error fetching feedback:', error);
                setError('Failed to load interview feedback. Please try again.');
            } finally {
                setLoading(false);
            }
        }
        fetchFeedback();
    }, [interviewId]);

    const generateOverallFeedback = (answers) => {
        if (!answers.length) return;

        // Calculate base metrics
        const totalRating = answers.reduce((sum, ans) => {
            const rating = parseInt(ans.rating) || 0;
            return sum + rating;
        }, 0);
        const averageRating = totalRating / answers.length;

        // Analyze questions for specific skills
        const skillAnalysis = analyzeSkills(answers);

        // Generate performance summary
        const performanceSummary = generatePerformanceSummary(answers, averageRating, skillAnalysis);

        // Calculate overall score based on skill analysis
        const overallScore = Math.round(
            (skillAnalysis.technical + 
             skillAnalysis.communication + 
             skillAnalysis.problemSolving + 
             skillAnalysis.experience) / 4
        );

        setOverallFeedback({
            overallScore,
            skills: skillAnalysis,
            summary: performanceSummary,
            averageRating: Math.round(averageRating * 10) / 10,
            totalQuestions: answers.length
        });
    };

    const analyzeSkills = (answers) => {
        // Initialize skill scores
        const skills = {
            technical: 0,
            communication: 0,
            problemSolving: 0,
            experience: 0
        };

        // Keywords for each skill category
        const skillKeywords = {
            technical: [
                'implementation', 'code', 'algorithm', 'data structure', 'framework',
                'database', 'api', 'architecture', 'design pattern', 'testing'
            ],
            communication: [
                'explain', 'describe', 'communicate', 'present', 'document',
                'clarify', 'discuss', 'articulate', 'express', 'convey'
            ],
            problemSolving: [
                'solve', 'approach', 'strategy', 'optimize', 'debug',
                'troubleshoot', 'analyze', 'evaluate', 'improve', 'enhance'
            ],
            experience: [
                'project', 'experience', 'practice', 'real-world', 'production',
                'deployment', 'maintenance', 'scaling', 'performance', 'security'
            ]
        };

        // Analyze each answer
        answers.forEach(answer => {
            const rating = parseInt(answer.rating) || 0;
            const question = answer.question.toLowerCase();
            const userAnswer = (answer.userAns || '').toLowerCase();

            // Check which skills are relevant to this question
            Object.entries(skillKeywords).forEach(([skill, keywords]) => {
                const questionRelevance = keywords.filter(keyword => 
                    question.includes(keyword)
                ).length;
                const answerRelevance = keywords.filter(keyword => 
                    userAnswer.includes(keyword)
                ).length;

                // Calculate skill score based on relevance and rating
                const relevance = (questionRelevance + answerRelevance) / 2;
                const skillScore = (rating / 5) * 100 * (relevance > 0 ? 1 : 0.5);
                
                // Update skill score with weighted average
                skills[skill] = (skills[skill] + skillScore) / 2;
            });
        });

        // Normalize scores
        Object.keys(skills).forEach(skill => {
            skills[skill] = Math.min(100, Math.max(0, Math.round(skills[skill])));
        });

        return skills;
    };

    const generatePerformanceSummary = (answers, averageRating, skillAnalysis) => {
        const strengths = [];
        const areas = [];
        const recommendations = [];

        // Analyze answers to generate feedback
        answers.forEach(answer => {
            const rating = parseInt(answer.rating) || 0;
            if (rating >= 4) {
                strengths.push(answer.question);
            } else if (rating <= 2) {
                areas.push(answer.question);
            }
        });

        // Generate recommendations based on skill analysis
        if (skillAnalysis.technical < 60) {
            recommendations.push("Focus on strengthening your core technical concepts and implementation skills");
        }
        if (skillAnalysis.communication < 60) {
            recommendations.push("Work on improving your ability to explain technical concepts clearly");
        }
        if (skillAnalysis.problemSolving < 60) {
            recommendations.push("Practice breaking down complex problems into manageable steps");
        }
        if (skillAnalysis.experience < 60) {
            recommendations.push("Gain more hands-on experience with real-world projects");
        }

        // Add general recommendations based on overall performance
        if (averageRating >= 4) {
            recommendations.push("Continue building on your strong foundation");
            recommendations.push("Consider mentoring others to reinforce your knowledge");
        } else if (averageRating >= 3) {
            recommendations.push("Focus on areas where you scored lower");
            recommendations.push("Practice implementing solutions to common problems");
        } else {
            recommendations.push("Review fundamental concepts in your field");
            recommendations.push("Work on improving your technical communication skills");
        }

        return {
            strengths: strengths.length > 0 ? strengths : ["No specific strengths identified"],
            areas: areas.length > 0 ? areas : ["No specific areas for improvement identified"],
            recommendations: [...new Set(recommendations)] // Remove duplicates
        };
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-100';
        if (score >= 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getScoreBadge = (score) => {
        if (score >= 80) return { text: 'Excellent', color: 'bg-green-500' };
        if (score >= 60) return { text: 'Good', color: 'bg-yellow-500' };
        return { text: 'Needs Work', color: 'bg-red-500' };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8 pt-24">
                {loading ? (
                    <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground text-lg">Analyzing your interview performance...</p>
                    </div>
                ) : error ? (
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <p className="text-red-500 text-lg">{error}</p>
                        <Button
                            onClick={() => router.push('/ai-tools/AiMockInterview')}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Interviews
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Header Section */}
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center space-x-2">
                                <Trophy className="w-8 h-8 text-yellow-500" />
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Interview Results
                                </h1>
                            </div>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Your comprehensive performance analysis and personalized recommendations
                            </p>
                        </div>

                        {/* Overall Performance Card */}
                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                            <CardHeader className="text-center pb-6">
                                <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
                                    <BarChart3 className="w-6 h-6 text-blue-600" />
                                    <span>Overall Performance</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* Main Score */}
                                <div className="text-center space-y-4">
                                    <div className="relative inline-block">
                                        <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-foreground">
                                                    {overallFeedback?.overallScore || 0}%
                                                </div>
                                                <div className="text-sm text-muted-foreground">Overall Score</div>
                                            </div>
                                        </div>
                                        <div 
                                            className="absolute inset-0 w-32 h-32 rounded-full border-8 border-transparent border-t-blue-600 border-r-purple-600 border-b-green-600 border-l-yellow-600 animate-spin"
                                            style={{ 
                                                animationDuration: '3s',
                                                transform: `rotate(${(overallFeedback?.overallScore || 0) * 3.6}deg)`
                                            }}
                                        ></div>
                                    </div>
                                    <Badge className={`text-sm font-medium px-4 py-2 ${getScoreColor(overallFeedback?.overallScore || 0)}`}>
                                        {getScoreBadge(overallFeedback?.overallScore || 0).text}
                                    </Badge>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                                        <div className="text-2xl font-bold text-blue-600">{overallFeedback?.averageRating || 0}/5</div>
                                        <div className="text-sm text-muted-foreground">Average Rating</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg dark:bg-purple-900/20">
                                        <div className="text-2xl font-bold text-purple-600">{overallFeedback?.totalQuestions || 0}</div>
                                        <div className="text-sm text-muted-foreground">Questions Answered</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
                                        <div className="text-2xl font-bold text-green-600">
                                            {Math.round((overallFeedback?.summary?.strengths?.length || 0) / (overallFeedback?.totalQuestions || 1) * 100)}%
                                        </div>
                                        <div className="text-sm text-muted-foreground">Strong Areas</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills Analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Target className="w-5 h-5 text-blue-600" />
                                        <span>Skills Analysis</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {overallFeedback?.skills && Object.entries(overallFeedback.skills).map(([skill, score]) => (
                                        <div key={skill} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium capitalize">
                                                    {skill.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                                <span className="text-sm font-semibold">{score}%</span>
                                            </div>
                                            <Progress value={score} className="h-3" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Quick Insights */}
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                                        <span>Quick Insights</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-green-700 dark:text-green-400">Strengths</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {overallFeedback?.summary?.strengths?.length || 0} areas where you excelled
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-orange-700 dark:text-orange-400">Areas to Improve</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {overallFeedback?.summary?.areas?.length || 0} areas need attention
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-blue-700 dark:text-blue-400">Recommendations</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {overallFeedback?.summary?.recommendations?.length || 0} actionable tips
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Strengths */}
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Strengths</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {overallFeedback?.summary?.strengths?.slice(0, 3).map((strength, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-sm">{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Areas for Improvement */}
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-orange-700 dark:text-orange-400">
                                        <AlertCircle className="w-5 h-5" />
                                        <span>Areas to Improve</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {overallFeedback?.summary?.areas?.slice(0, 3).map((area, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-sm">{area}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Recommendations */}
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                                        <TrendingUp className="w-5 h-5" />
                                        <span>Recommendations</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {overallFeedback?.summary?.recommendations?.slice(0, 3).map((rec, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-sm">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => setShowDetailedFeedback(!showDetailedFeedback)}
                                variant="outline"
                                className="flex items-center space-x-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>{showDetailedFeedback ? 'Hide' : 'Show'} Detailed Feedback</span>
                            </Button>
                            <Button
                                onClick={() => router.push('/ai-tools/AiMockInterview')}
                                className="bg-primary hover:bg-primary/90"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Start New Interview
                            </Button>
                        </div>

                        {/* Detailed Feedback Section */}
                        {showDetailedFeedback && (
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <MessageSquare className="w-5 h-5 text-blue-600" />
                                        <span>Detailed Question Feedback</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {answers.map((answer, index) => (
                                            <Collapsible key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                                <CollapsibleTrigger className="w-full flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-semibold text-lg">Q{index + 1}</span>
                                                            <div className="flex items-center space-x-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        className={`w-4 h-4 ${
                                                                            star <= (parseInt(answer.rating) || 0)
                                                                                ? 'text-yellow-400 fill-current'
                                                                                : 'text-gray-300'
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <span className="text-muted-foreground text-sm max-w-md truncate">
                                                            {answer.question}
                                                        </span>
                                                    </div>
                                                    <ChevronsUpDown className="h-5 w-5 text-muted-foreground" />
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="p-6 space-y-6 bg-gray-50 dark:bg-gray-700/50">
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        <div className="space-y-3">
                                                            <h4 className="font-semibold text-lg flex items-center space-x-2">
                                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                                <span>Your Answer</span>
                                                            </h4>
                                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                                                <p className="text-sm">
                                                                    {answer.userAns || "No answer provided"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <h4 className="font-semibold text-lg flex items-center space-x-2">
                                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                                <span>Expected Answer</span>
                                                            </h4>
                                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                                                <p className="text-sm">{answer.correctAns}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h4 className="font-semibold text-lg flex items-center space-x-2">
                                                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                            <span>AI Feedback</span>
                                                        </h4>
                                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                                            <p className="text-sm">{answer.feedback}</p>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

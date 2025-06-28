"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import LevelSelectorDuolingo from "@/components/LevelSelectorDuolingo";
import AchievementsDisplay from "@/components/AchievementsDisplay";
import { auth } from "@clerk/nextjs/server";
import { toast } from "sonner";
import Link from "next/link";
import { Trophy, Flame, Target, Zap } from "lucide-react";
import dynamic from "next/dynamic";

const popularTechnologies = [
  "Frontend Development",
  "Backend Development", 
  "Full Stack Development",
  "Mobile Development (React Native)",
  "Mobile Development (Flutter)",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Cloud Computing (AWS)",
  "Cloud Computing (Azure)",
  "Cybersecurity",
  "Blockchain Development",
  "Game Development",
  "UI/UX Design",
  "Product Management",
  "Data Engineering",
  "Software Testing",
  "System Administration"
];

// Add icons for each path (optional, simple emoji for now)
const pathIcons: Record<string, string> = {
  "Frontend Development": "🖥️",
  "Backend Development": "🗄️",
  "Full Stack Development": "🧑‍💻",
  "Mobile Development (React Native)": "📱",
  "Mobile Development (Flutter)": "📱",
  "Data Science": "📊",
  "Machine Learning": "🤖",
  "DevOps": "⚙️",
  "Cloud Computing (AWS)": "☁️",
  "Cloud Computing (Azure)": "☁️",
  "Cybersecurity": "🔒",
  "Blockchain Development": "⛓️",
  "Game Development": "🎮",
  "UI/UX Design": "🎨",
  "Product Management": "📦",
  "Data Engineering": "🛠️",
  "Software Testing": "🧪",
  "System Administration": "🖧",
};

// Mock questions for 3 levels per path
const mockLevels = [
  {
    name: 'Level 1',
    questions: [
      { question: 'What is HTML?', options: ['A markup language', 'A database', 'A protocol', 'A browser'], answer: 'A markup language' },
      { question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style Syntax', 'Creative Style System', 'Colorful Style Sheet'], answer: 'Cascading Style Sheets' },
      { question: 'Which tag is used for images?', options: ['<img>', '<src>', '<image>', '<pic>'], answer: '<img>' },
      { question: 'What is JavaScript mainly used for?', options: ['Styling', 'Structure', 'Interactivity', 'Database'], answer: 'Interactivity' },
      { question: 'Which is a frontend framework?', options: ['React', 'Node.js', 'MongoDB', 'Express'], answer: 'React' },
    ],
  },
  {
    name: 'Level 2',
    questions: [
      { question: 'What is a CSS preprocessor?', options: ['Sass', 'HTML', 'JSX', 'SQL'], answer: 'Sass' },
      { question: 'Which is a JavaScript package manager?', options: ['npm', 'pip', 'composer', 'gem'], answer: 'npm' },
      { question: 'What does DOM stand for?', options: ['Document Object Model', 'Data Object Model', 'Desktop Oriented Model', 'Document Oriented Module'], answer: 'Document Object Model' },
      { question: 'Which is a CSS layout technique?', options: ['Flexbox', 'Redux', 'AJAX', 'REST'], answer: 'Flexbox' },
      { question: 'What is JSX?', options: ['A JavaScript extension', 'A CSS library', 'A database', 'A protocol'], answer: 'A JavaScript extension' },
    ],
  },
  {
    name: 'Level 3',
    questions: [
      { question: 'What is a React hook?', options: ['A function for state/lifecycle', 'A CSS selector', 'A database query', 'A Node.js module'], answer: 'A function for state/lifecycle' },
      { question: 'Which is a state management library?', options: ['Redux', 'Bootstrap', 'Sass', 'jQuery'], answer: 'Redux' },
      { question: 'What is SSR?', options: ['Server Side Rendering', 'Simple Style Rule', 'Single State Reducer', 'Secure Socket Relay'], answer: 'Server Side Rendering' },
      { question: 'Which is a CSS-in-JS library?', options: ['styled-components', 'Express', 'Flask', 'Django'], answer: 'styled-components' },
      { question: 'What is the virtual DOM?', options: ['A lightweight copy of the DOM', 'A database', 'A CSS property', 'A browser'], answer: 'A lightweight copy of the DOM' },
    ],
  },
];

const questionBank = {
  "Frontend Development": [
    // Level 1
    [ /* 5 questions */ ],
    // Level 2
    [ /* 5 harder questions */ ],
    // Level 3
    [ /* ... */ ],
    // Level 4
    [ /* ... */ ],
    // ...as many as you want
  ],
  "DevOps": [
    // Level 1, Level 2, ...Level N
  ],
  // ...other paths
};

const PATHS = ["frontend", "devops", "backend"];

// Dynamically import react-confetti to avoid SSR issues
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

// Add a local enum for AchievementType if needed
export enum AchievementType {
  FIRST_PERFECT_SCORE = 0,
  STREAK_5 = 1,
  STREAK_10 = 2,
  STREAK_25 = 3,
  LEVEL_10 = 4,
  LEVEL_25 = 5,
  LEVEL_50 = 6,
  LEVEL_100 = 7,
  XP_100 = 8,
  XP_500 = 9,
  XP_1000 = 10,
  MASTER_QUIZZER = 11
}

export default function QuizGenerator() {
  // All hooks at the top
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([0]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const MAX_LEVELS = 100;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [geminiRaw, setGeminiRaw] = useState<string>("");
  const [userXP, setUserXP] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalQuizzesTaken, setTotalQuizzesTaken] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  // Milestone arrays
  const streakMilestones = [5, 10, 25];
  const levelMilestones = [10, 25, 50, 100];
  
  // Calculate progress metrics
  const completionPercentage = completedLevels.length > 0 ? Math.round((completedLevels.length / MAX_LEVELS) * 100) : 0;
  const nextLevelToUnlock = Math.max(...unlockedLevels) + 1;
  const levelsUntilNextUnlock = nextLevelToUnlock - Math.max(...completedLevels);

  // Streak NFT milestones
  const isStreakMilestone = streakMilestones.includes(currentStreak);
  const isLevelMilestone = levelMilestones.includes(currentLevel + 1) && score === quiz.length && submitted && showResults;
  const claimableNFT = isStreakMilestone || isLevelMilestone;
  const milestoneText = isStreakMilestone
    ? `🎉 Streak Milestone! ${currentStreak} perfect scores in a row!`
    : isLevelMilestone
      ? `🏅 Level Milestone! Reached Level ${currentLevel + 1}!`
      : null;

  // Add state for sliding info card
  const [showInfoCard, setShowInfoCard] = useState(false);

  // Save progress to DB after perfect score
  async function saveQuizProgress() {
    if (!selectedPath) return;
    try {
      const res = await fetch(`/api/quiz-progress/${selectedPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unlockedLevels, completedLevels }),
      });
      if (!res.ok) {
        console.error('Failed to save quiz progress:', await res.text());
      }
    } catch (err) {
      console.error('Error saving quiz progress:', err);
    }
  }

  // Award XP after perfect score
  async function awardXP() {
    try {
      const res = await fetch("/api/quiz-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streak: currentStreak }),
      });
      if (res.ok) {
        const data = await res.json();
        setUserXP(data.xp);
        // Update streak for perfect score
        setCurrentStreak(prev => prev + 1);
        setTotalQuizzesTaken(prev => prev + 1);
        toast.success(`+5 XP awarded! Your total XP: ${data.xp}`);
        setTimeout(() => {
          window.dispatchEvent(new Event('xp-updated'));
        }, 300); // 300ms delay to ensure DB update and header mount
      } else {
        toast.error("Failed to award XP");
      }
    } catch (err) {
      toast.error("Error awarding XP");
    }
  }

  // Fetch user XP and streak on mount
  useEffect(() => {
    async function fetchUserStats() {
      try {
        const res = await fetch("/api/quiz-xp");
        if (res.ok) {
          const data = await res.json();
          setUserXP(data.xp);
          setCurrentStreak(data.streak || 0);
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
      }
    }
    fetchUserStats();
  }, []);

  // Save streak to DB whenever it changes (after quiz completion)
  useEffect(() => {
    async function saveStreak() {
      try {
        await fetch("/api/quiz-xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ streak: currentStreak }),
        });
      } catch (err) {
        console.error('Error saving streak:', err);
      }
    }
    if (currentStreak > 0) saveStreak();
  }, [currentStreak]);

  // Calculate score and show results when submitted
  useEffect(() => {
    if (submitted && quiz.length > 0 && userAnswers.length === quiz.length) {
      let newScore = 0;
      for (let i = 0; i < quiz.length; i++) {
        if (userAnswers[i] === quiz[i].answer) newScore++;
      }
      setScore(newScore);
      setShowResults(true);
      // If perfect score, unlock next level and save progress
      if (newScore === quiz.length) {
        if (!completedLevels.includes(currentLevel)) {
          setCompletedLevels((prev) => {
            const updated = [...prev, currentLevel];
            return updated;
          });
        }
        if (!unlockedLevels.includes(currentLevel + 1) && currentLevel + 1 < MAX_LEVELS) {
          setUnlockedLevels((prev) => {
            const updated = [...prev, currentLevel + 1];
            return updated;
          });
        }
        // Award XP for perfect score
        awardXP();
      } else {
        // Reset streak if not perfect score
        setCurrentStreak(0);
        setTotalQuizzesTaken(prev => prev + 1);
      }
    } else if (!submitted) {
      setShowResults(false);
      setScore(0);
    }
  }, [submitted, userAnswers, quiz]);

  // On mount, fetch progress
  useEffect(() => {
    async function fetchProgress() {
      const res = await fetch(`/api/quiz-progress/${selectedPath}`);
      if (!res.ok) {
        setUnlockedLevels([0]);
        setCompletedLevels([]);
        return;
      }
      const data = await res.json();
      setUnlockedLevels(data.unlockedLevels);
      setCompletedLevels(data.completedLevels);
      // Set currentLevel to next after highest completed, or highest unlocked
      if (data.completedLevels && data.completedLevels.length > 0) {
        setCurrentLevel(Math.max(...data.completedLevels) + 1);
      } else if (data.unlockedLevels && data.unlockedLevels.length > 0) {
        setCurrentLevel(Math.max(...data.unlockedLevels));
      } else {
        setCurrentLevel(0);
      }
    }
    if (selectedPath) fetchProgress();
  }, [selectedPath]);

  // When quiz is loaded, initialize userAnswers to empty strings
  useEffect(() => {
    if (quiz.length > 0) {
      setUserAnswers(Array(quiz.length).fill(""));
    }
  }, [quiz]);

  // Add this useEffect:
  useEffect(() => {
    // Only save if quiz is completed and perfect score
    if (showResults && score === quiz.length && quiz.length > 0) {
      saveQuizProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedLevels, unlockedLevels]);

  // Show confetti on perfect score
  useEffect(() => {
    if (score === quiz.length && submitted && showResults) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [score, quiz.length, submitted, showResults]);

  // Helper: shuffleArray
  function shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Helper: getMilestoneAchievementType
  function getMilestoneAchievementType() {
    if (streakMilestones.includes(currentStreak)) {
      if (currentStreak === 5) return AchievementType.STREAK_5;
      if (currentStreak === 10) return AchievementType.STREAK_10;
      if (currentStreak === 25) return AchievementType.STREAK_25;
    }
    if (levelMilestones.includes(currentLevel + 1) && score === quiz.length && submitted && showResults) {
      if (currentLevel + 1 === 10) return AchievementType.LEVEL_10;
      if (currentLevel + 1 === 25) return AchievementType.LEVEL_25;
      if (currentLevel + 1 === 50) return AchievementType.LEVEL_50;
      if (currentLevel + 1 === 100) return AchievementType.LEVEL_100;
    }
    return null;
  }

  // Progress Indicators Component (move inside so it can access state)
  const ProgressIndicators = () => (
    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl border border-blue-200 dark:border-blue-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-blue-600" />
        Your Progress
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Percentage */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completionPercentage}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {completedLevels.length} of {MAX_LEVELS} levels
          </div>
        </div>
        {/* Current Streak */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentStreak}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Perfect scores in a row
          </div>
        </div>
        {/* Total XP */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total XP</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userXP}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Experience points earned
          </div>
        </div>
        {/* Next Level */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Next Level</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{nextLevelToUnlock}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {levelsUntilNextUnlock > 0 ? `${levelsUntilNextUnlock} levels to unlock` : 'Ready to unlock!'}
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  // Path selection step
  if (!selectedPath) {
    return (
      <div className="py-12 px-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Select a Quiz Path</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-24 gap-y-16 mb-8 justify-items-center w-full">
          {popularTechnologies.map((tech) => (
            <button
              key={tech}
              className={`flex flex-row items-center gap-6 min-h-20 px-8 py-6 rounded-xl border transition-all duration-200 shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 flex-nowrap whitespace-nowrap w-full flex-1`}
              onClick={() => setSelectedPath(tech)}
            >
              <span className="text-2xl flex items-center justify-center whitespace-nowrap">{pathIcons[tech] || "📚"}</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center whitespace-nowrap">
                {tech === 'Mobile Development (React Native)'
                  ? (<span>Mobile Development<br />(React Native)</span>)
                  : tech === 'Mobile Development (Flutter)'
                    ? (<span>Mobile Development<br />(Flutter)</span>)
                    : tech === 'Cloud Computing (AWS)'
                      ? (<span>Cloud Computing<br />(AWS)</span>)
                      : tech === 'Cloud Computing (Azure)'
                        ? (<span>Cloud Computing<br />(Azure)</span>)
                        : tech}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-6">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full max-w-xs text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Or enter a custom topic (e.g., JavaScript, DSA)"
          />
          <Button onClick={() => setSelectedPath(topic)} disabled={!topic} className="h-11 px-6 text-base font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 text-white rounded-lg shadow">
            Use Custom Topic
          </Button>
        </div>
      </div>
    );
  }

  // Level selector step (after path selection, before quiz)
  if (selectedPath && quiz.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Quiz: <span className="font-normal text-blue-700 dark:text-blue-300">{selectedPath}</span></h1>
            <button className="text-sm text-blue-600 hover:underline dark:text-blue-400" onClick={() => { setSelectedPath(null); setQuiz([]); setCurrentLevel(0); setUnlockedLevels([0]); setCompletedLevels([]); }}>Change Path</button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Quiz Section */}
          <div className="lg:col-span-2">
            {/* Progress Indicators */}
            <ProgressIndicators />
            
            <h2 className="text-xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center">Choose Level</h2>
            <LevelSelectorDuolingo
              totalLevels={MAX_LEVELS}
              currentLevel={currentLevel}
              onSelectLevel={setCurrentLevel}
              unlockedLevels={unlockedLevels}
              completedLevels={completedLevels}
            />
            <div className="flex justify-center gap-4">
              <Button
                onClick={async () => {
                  setLoading(true);
                  setUserAnswers([]);
                  setShowResults(false);
                  setScore(0);
                  setGeminiRaw("");
                  let questions = [];
                  let rawText = "";
                  try {
                    const res = await fetch("/api/generate-quiz", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ topic: selectedPath, level: currentLevel, numQuestions: 5 }),
                    });
                    if (res.ok) {
                  const data = await res.json();
                      if (Array.isArray(data)) {
                        questions = data;
                      } else if (data.error) {
                        rawText = data.raw || JSON.stringify(data);
                      }
                  } else {
                      const data = await res.json();
                      rawText = data.raw || JSON.stringify(data);
                    }
                  } catch (e) {
                    rawText = String(e);
                  }
                  setQuiz(questions);
                  setGeminiRaw(rawText);
                  setLoading(false);
                }}
                disabled={!unlockedLevels.includes(currentLevel)}
                className="px-8 py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 text-white rounded-lg shadow"
              >
                {loading ? "Loading..." : `Start Level ${currentLevel + 1}`}
              </Button>
              <Link href="/ai-tools/quiz/leaderboard">
                <Button className="px-8 py-3 text-lg font-bold bg-green-600 hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900 text-white rounded-lg shadow">
                  View Leaderboard
                </Button>
              </Link>
            </div>
            {/* Show error if no questions returned */}
            {quiz.length === 0 && !loading && (
              <div className="mt-8 flex flex-col items-center">
                {/* Slideable Info Card Trigger */}
                <button
                  onClick={() => setShowInfoCard((prev) => !prev)}
                  className="mb-4 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-expanded={showInfoCard}
                  aria-controls="info-card"
                >
                  {showInfoCard ? 'Hide' : 'How Quiz Levels & NFT Rewards Work'}
                </button>
                {/* Slideable Info Card */}
                <div
                  id="info-card"
                  className={`overflow-hidden transition-all duration-500 ${showInfoCard ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} w-full`}
                  style={{ maxWidth: '600px' }}
                >
                  <div className="mb-6 p-6 rounded-xl border border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 dark:border-blue-700 text-blue-900 dark:text-blue-100 shadow-xl">
                    <h2 className="font-bold text-xl mb-3 flex items-center gap-2">
                      <span role="img" aria-label="info">🛈</span> How Quiz Levels Work & NFT Rewards
                    </h2>
                    <ul className="list-disc pl-6 text-base space-y-1 mb-4">
                      <li><b>Start at Level 1.</b></li>
                      <li>Unlock the next level by answering all questions correctly (a perfect score).</li>
                      <li>Earn XP and progress with each perfect score.</li>
                      <li>Retry any level as many times as you wish—your progress is always saved.</li>
                      <li>✔️ = Completed, <span className="inline-block">🔓</span> = Unlocked, <span className="inline-block">🔒</span> = Locked.</li>
                    </ul>
                    <div className="mt-3">
                      <h3 className="font-semibold text-purple-700 dark:text-purple-200 mb-2 flex items-center gap-2">
                        <span role="img" aria-label="trophy">🏆</span> NFT Achievement Badges
                      </h3>
                      <div className="space-y-2 text-base">
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-500 text-lg">🔥</span>
                          <span><b>Streak Milestones:</b> Achieve a perfect score <b>5, 10, or 25 times in a row</b> to earn a Streak NFT badge.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 text-lg">⭐</span>
                          <span><b>Level Milestones:</b> Reach <b>level 10, 25, 50, or 100</b> in any path to unlock a Level NFT badge.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 text-lg">⚡</span>
                          <span><b>XP Milestones:</b> Earn <b>100, 500, or 1000 XP</b> to receive an XP NFT badge.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-purple-500 text-lg">🔗</span>
                          <span>When you reach a milestone, a claim message will appear. Connect your crypto wallet (e.g., MetaMask) to mint your NFT badge. Already claimed? The app remembers your achievements.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {geminiRaw && (
                  <div className="mt-4 text-xs text-gray-500 text-left max-w-xl mx-auto break-words bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <strong>Raw output:</strong>
                    <pre className="whitespace-pre-wrap">{geminiRaw}</pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Achievements Sidebar */}
          <div className="lg:col-span-1">
            <AchievementsDisplay 
              userXP={userXP}
              streak={currentStreak}
              level={Math.max(...completedLevels, 0)}
            />
          </div>
        </div>
      </div>
    );
  }

  // Quiz step (show questions one by one, then results)
  if (selectedPath && quiz.length > 0) {
    // Show all questions at once
    if (showResults && submitted) {
      // Determine if NFT is claimable and not already claimed
      const achievementType = getMilestoneAchievementType();
      const alreadyClaimed = achievementType !== null;
      return (
        <div className="max-w-6xl mx-auto py-12 px-4">
          {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={400} />}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Quiz: <span className="font-normal text-blue-700 dark:text-blue-300">{selectedPath}</span></h1>
              <button className="text-sm text-blue-600 hover:underline dark:text-blue-400" onClick={() => { setSelectedPath(null); setQuiz([]); setCurrentLevel(0); setUnlockedLevels([0]); setCompletedLevels([]); setUserAnswers([]); setShowResults(false); setScore(0); setSubmitted(false); }}>Change Path</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Results Section */}
            <div className="lg:col-span-2">
              {/* Progress Indicators */}
              <ProgressIndicators />
              {milestoneText && !alreadyClaimed && (
                <div className="mb-6 p-4 rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 shadow text-center text-xl font-bold flex flex-col items-center">
                  <span>{milestoneText}</span>
                  <span className="mt-2 inline-block px-4 py-2 bg-green-600 text-white rounded-lg font-semibold animate-bounce">NFT Claimable! Go to Achievements to mint your NFT badge.</span>
                </div>
              )}
              {milestoneText && alreadyClaimed && (
                <div className="mb-6 p-4 rounded-lg border border-green-400 bg-green-50 dark:bg-green-900 dark:border-green-700 text-green-900 dark:text-green-100 shadow text-center text-xl font-bold flex flex-col items-center">
                  <span>{milestoneText}</span>
                  <span className="mt-2 inline-block px-4 py-2 bg-green-700 text-white rounded-lg font-semibold">NFT Already Claimed!</span>
                </div>
              )}
              <h2 className="text-xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center">Quiz Results</h2>
              <div className="text-center mb-6">
                <p className="text-lg font-semibold">Your Score: {score} / {quiz.length}</p>
                {score === quiz.length && (
                  <p className="text-green-600 font-bold mt-2">Perfect! You can go to the next level.</p>
                )}
              </div>
              <div className="mb-8">
                {quiz.map((q, idx) => (
                  <div key={idx} className="mb-6 p-4 rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold mb-2">Q{idx + 1}: {q.question}</h3>
                    <div className="flex flex-col gap-2">
                      {q.options.map((option: string) => {
                        const isCorrect = option === q.answer;
                        const isSelected = userAnswers[idx] === option;
                        return (
                          <div key={option} className={`px-4 py-2 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950' : isSelected ? 'border-red-500 bg-red-50 dark:bg-red-950' : 'border-gray-200 dark:border-gray-700'} flex items-center`}>
                            <span className="mr-2">{isSelected ? (isCorrect ? '✅' : '❌') : ''}</span>
                            <span>{option}</span>
                            {isCorrect && <span className="ml-2 text-green-600 font-bold">(Correct)</span>}
                            {isSelected && !isCorrect && <span className="ml-2 text-red-600 font-bold">(Your answer)</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={() => {
                    setUserAnswers([]);
                    setShowResults(false);
                    setScore(0);
                    setSubmitted(false);
                  }}
                  className="px-8 py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 text-white rounded-lg shadow"
                >
                  Retake Quiz
                </Button>
                {score === quiz.length && (
                  <Button
                    onClick={() => {
                      setCurrentLevel((prev) => prev + 1);
                      setQuiz([]);
                      setUserAnswers([]);
                      setShowResults(false);
                      setScore(0);
                      setSubmitted(false);
                    }}
                    className="px-8 py-3 text-lg font-bold bg-green-600 hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900 text-white rounded-lg shadow"
                  >
                    Next Level
                  </Button>
                )}
              </div>
            </div>

            {/* Achievements Sidebar */}
            <div className="lg:col-span-1">
              <AchievementsDisplay 
                userXP={userXP}
                streak={currentStreak}
                level={Math.max(...completedLevels, 0)}
              />
            </div>
          </div>
        </div>
      );
    }
    // Show all questions for answering
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Quiz: <span className="font-normal text-blue-700 dark:text-blue-300">{selectedPath}</span></h1>
            <button className="text-sm text-blue-600 hover:underline dark:text-blue-400" onClick={() => { setSelectedPath(null); setQuiz([]); setCurrentLevel(0); setUnlockedLevels([0]); setCompletedLevels([]); setUserAnswers([]); setShowResults(false); setScore(0); setSubmitted(false); }}>Change Path</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Quiz Section */}
          <div className="lg:col-span-2">
            {/* Progress Indicators */}
            <ProgressIndicators />
            
            <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
              {quiz.map((q, idx) => (
                <div key={idx} className="mb-6 p-4 rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-2">Q{idx + 1}: {q.question}</h3>
                  <div className="flex flex-col gap-2">
                    {q.options.map((option: string) => (
                      <label key={option} className={`px-4 py-2 rounded-lg border cursor-pointer ${userAnswers[idx] === option ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'border-gray-200 dark:border-gray-700'}`}> 
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          value={option}
                          checked={userAnswers[idx] === option}
                          onChange={() => {
                            const newAnswers = [...userAnswers];
                            newAnswers[idx] = option;
                            setUserAnswers(newAnswers);
                          }}
                          className="mr-2"
                          required
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            <div className="flex justify-center">
              <Button
                  type="submit"
                  disabled={userAnswers.length !== quiz.length || userAnswers.includes("")}
                className="px-8 py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 text-white rounded-lg shadow"
              >
                  Submit
              </Button>
            </div>
            </form>
          </div>

          {/* Achievements Sidebar */}
          <div className="lg:col-span-1">
            <AchievementsDisplay 
              userXP={userXP}
              streak={currentStreak}
              level={Math.max(...completedLevels, 0)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Placeholder for the quiz step */}
    </div>
  );
}

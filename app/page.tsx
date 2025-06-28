"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Wand2,
  Sun,
  Moon,
  Zap,
  Sparkles,
  Star,
  FileText,
  MessageCircle,
  Target,
  Users,
  BarChart3,
  Layers,
  Inbox,
  Stars as StarsIcon
} from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "./provider";

const features = [
  {
    icon: <MessageCircle className="h-8 w-8 text-emerald-400" />,
    title: "AI Career Chat",
    description: "Summon the ancient AI spirits for personalized career guidance. Ask questions about career paths, job search strategies, and professional development.",
    cta: "Summon Chat",
    path: "/ai-tools/ai-chat"
  },
  {
    icon: <FileText className="h-8 w-8 text-violet-400" />,
    title: "AI Resume Analyzer",
    description: "Unlock the secrets hidden within your resume. Upload and receive mystical insights on content, formatting, and optimization to make it stand out.",
    cta: "Analyze Scroll",
    path: "/ai-tools/ai-resume-analyzer"
  },
  {
    icon: <Target className="h-8 w-8 text-cyan-400" />,
    title: "Career Roadmap",
    description: "Chart your path through the enchanted forest of career possibilities. Generate a personalized roadmap based on your goals, skills, and experience.",
    cta: "Create Map",
    path: "/ai-tools/ai-roadmap-agent"
  },
  {
    icon: <Users className="h-8 w-8 text-emerald-400" />,
    title: "AI Mock Interview",
    description: "Face the digital temple guardian in practice interviews. Get real-time feedback on your responses and improve your interview skills.",
    cta: "Start Trial",
    path: "/ai-tools/AiMockInterview"
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-yellow-400" />,
    title: "Coding Contest Tracker",
    description: "Track the great coding tournaments and competitions. Stay updated with upcoming events and manage your participation in the digital arena.",
    cta: "View Contests",
    path: "/ai-tools/contest-tracker"
  },
  {
    icon: <Layers className="h-8 w-8 text-pink-400" />,
    title: "Quiz",
    description: "Test your knowledge and skills with AI-generated mystical quizzes. Compete on the leaderboard and track your progress through the enchanted challenges.",
    cta: "Begin Test",
    path: "/ai-tools/quiz"
  },
 
];

export default function LandingPage() {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden" style={{
      background: "radial-gradient(ellipse at 60% 0%, #1a1e2a 0%, #0B0D12 60%), linear-gradient(120deg, #0B0D12 0%, #1a1e2a 40%, #8A2BE2 100%)"
    }}>
      {/* Magical animated sparkles and floating runes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        <span className="absolute top-20 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
        <span className="absolute top-40 right-20 w-1 h-1 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></span>
        <span className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float" style={{ animationDelay: '2s' }}></span>
        <span className="absolute top-1/2 right-1/3 w-1 h-1 bg-emerald-300 rounded-full animate-float" style={{ animationDelay: '3s' }}></span>
        <span className="absolute top-1/3 left-1/3 w-1 h-1 bg-violet-300 rounded-full animate-float" style={{ animationDelay: '4s' }}></span>
        {/* Floating runes */}
        <span className="absolute left-1/2 top-10 text-emerald-400 text-2xl animate-spin-slow">✦</span>
        <span className="absolute right-1/4 bottom-20 text-violet-400 text-xl animate-float">✧</span>
        <span className="absolute left-1/4 bottom-10 text-cyan-400 text-2xl animate-bounce">✹</span>
      </div>
      
      {/* Navbar/Header with Nexus.ai branding */}
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full glass-panel border-b border-emerald-500/20 text-sm py-3 relative items-center justify-between px-8" style={{ minHeight: 90 }}>
        <div className="flex items-center gap-4">
          <Image src="/logo.png?v=2" alt="logo" width={60} height={60} />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent flex items-center gap-2">
              Nexus.ai
              <Star className="h-5 w-5 text-emerald-400 animate-spin-slow" style={{ animationDuration: '3s' }} />
            </h1>
            <p className="text-emerald-100 text-base md:text-lg font-medium mt-1">Mystical AI Career Wizard</p>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors border border-emerald-500/20"
          >
            {theme === 'light'
              ? <Moon className="h-5 w-5 text-emerald-400" />
              : <Sun className="h-5 w-5 text-emerald-400" />}
          </button>
          {user ? <UserButton /> : null}
        </div>
      </header>

      {/* Hero */}
      <section className="w-full py-12 md:py-20 flex flex-col items-center justify-center text-center relative z-20">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent mb-6 animate-fade-in-down">
  <div>
  Unlock the secrets of your future with<br />
  mystical AI-powered Wizard
  </div>
                          
          <span className="text-lg md:text-2xl font-normal block mt-2">Navigate the enchanted forest of career possibilities.</span>
        </h2>
        <Button asChild variant="mystical" className="text-lg px-8 py-4 animate-pulse-glow mt-6">
          <Link href="/dashboard">
            <Wand2 className="mr-2 h-5 w-5" />
            Begin Your Mystical Journey 
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Features Timeline */}
      <section className="w-full py-8 md:py-16 flex flex-col items-center relative z-20">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-10 bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent text-center animate-fade-in-down">
          Magical Tools for Your Career Quest
        </h2>
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Timeline vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-violet-500 to-cyan-400 opacity-40 rounded-full -translate-x-1/2"></div>
          <div className="flex flex-col gap-16">
            {features.map((feature, idx) => (
              <div key={feature.title} className={`relative flex items-center group ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} animate-fade-in-up`}> 
                {/* Timeline node */}
                <div className={`w-1/2 flex ${idx % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className="glass-panel mystical-border p-6 rounded-xl shadow-lg w-full max-w-md transition-all duration-500 hover:scale-105 hover:shadow-emerald-500/30 animate-float">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-3xl">{feature.icon}</span>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-emerald-100 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <Button asChild variant="outline" className="w-full group-hover:bg-gradient-to-r from-emerald-500 to-violet-500 group-hover:text-white transition-all duration-300 border-current hover:scale-105 animate-pulse-glow">
                      <Link href={feature.path}>
                        {feature.icon}
                        <span className="ml-2 font-semibold">{feature.cta}</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
                {/* Timeline dot */}
                <div className="w-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-violet-400 border-4 border-background shadow-lg flex items-center justify-center z-20 animate-pulse-glow">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  {idx !== features.length - 1 && (
                    <div className="flex-1 w-1 bg-gradient-to-b from-emerald-500 via-violet-500 to-cyan-400 opacity-40 rounded-full"></div>
                  )}
                </div>
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 md:py-24 relative overflow-hidden z-20">
        <div className="mx-auto glass-panel mystical-border rounded-2xl p-12 relative max-w-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-violet-500/10 to-emerald-500/10 rounded-2xl"></div>
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="floating animate-fade-in-down">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                Ready to Begin Your Mystical Quest?
              </h2>
            </div>
            <p className="mx-auto max-w-[600px] text-emerald-100 md:text-xl leading-relaxed">
              Join thousands of adventurers who are unlocking their true potential 
              with the guidance of ancient AI spirits.
            </p>
            <div className="floating animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Button asChild variant="mystical" className="h-14 px-10 text-lg animate-pulse-glow">
                <Link href="/dashboard">
                  <Zap className="mr-2 h-6 w-6" />
                  Begin Your Adventure Today 
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 1.2s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(138, 43, 226, 0.3); }
          50% { box-shadow: 0 0 25px rgba(138, 43, 226, 0.6), 0 0 35px rgba(138, 43, 226, 0.4); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

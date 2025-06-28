"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
  BrainCircuit,
  Sun,
  Moon,
  MessageCircle,
  FileText,
  Users,
  BarChart3
} from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "./provider";

export default function LandingPage() {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-600" />,
      title: "AI Career Chat",
      description: "Get personalized career advice and guidance from our AI mentor."
    },
    {
      icon: <FileText className="h-8 w-8 text-green-600" />,
      title: "Resume Analyzer",
      description: "Upload your resume and get detailed feedback and optimization suggestions."
    },
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Career Roadmap",
      description: "Generate a personalized career roadmap based on your goals and skills."
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "Mock Interviews",
      description: "Practice interviews with our AI interviewer and get real-time feedback."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="grid-background"></div>
      
      {/* Navbar */}
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-card border-b border-border text-sm py-3">
        <nav
          className="relative p-4 max-w-[85rem] w-full mx-auto sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex items-center justify-between">
            <Image src="/logo.png?v=2" alt="logo" width={150} height={150} />
          </div>
          <div
            id="navbar-collapse-with-animation"
            className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:ps-7 cursor-pointer gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-foreground" />
                )}
              </button>
              
              {!user ? (
                <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
                  <span className="flex items-center gap-x-2 font-medium text-muted-foreground hover:text-primary sm:border-s sm:border-border py-2 sm:py-0 sm:ms-4 sm:my-6 sm:ps-6">
                    <svg
                      className="flex-shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                    </svg>
                    Get Started
                  </span>
                </SignInButton>
              ) : (
                <UserButton />
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            AI-Powered Career Mentor
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Get personalized career guidance, interview preparation, and professional development insights powered by AI.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link href="/dashboard">
              Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 text-foreground">
            Powerful Features for Your Career Growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary transition-colors duration-300 bg-card"
              >
                <CardContent className="pt-6 text-center flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center">
                    {feature.icon}
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <Stat title="50+" subtitle="Industries Covered" />
            <Stat title="1000+" subtitle="Interview Questions" />
            <Stat title="95%" subtitle="Success Rate" />
            <Stat title="24/7" subtitle="AI Support" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-background">
        <div className="mx-auto py-24 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
              Ready to Accelerate Your Career?
            </h2>
            <p className="mx-auto max-w-[600px] text-blue-100 dark:text-blue-200 md:text-xl">
              Join thousands of professionals who are advancing their careers
              with AI-powered guidance.
            </p>
            <Button asChild size="lg" variant="secondary" className="h-11 mt-5 animate-bounce">
              <Link href="/dashboard">
                Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Optional stat subcomponent
function Stat({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <h3 className="text-4xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
}

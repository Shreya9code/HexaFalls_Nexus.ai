"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, Monitor, Mic, FileText, Star, Code } from "lucide-react";

export default function HeroSection() {
  const [displayText, setDisplayText] = useState("");
  const textVariations = [
    "NexusMentor.ai",
    "Personal Coach",
    "AI Feedback",
    ""
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animationStage, setAnimationStage] = useState(0);

  const interviewElements = [
    { icon: Mic, text: "Mock Interview", color: "text-indigo-600" },
    { icon: Code, text: "Tech Prep", color: "text-purple-600" },
    { icon: FileText, text: "AI Powered Review", color: "text-green-600" },
    { icon: Star, text: "Skill Assessment", color: "text-yellow-500" },
  ];

  useEffect(() => {
    let timeout;
    const currentText = textVariations[currentTextIndex];

    if (displayText.length < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, 100);
    } else {
      timeout = setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % textVariations.length);
        setDisplayText("");
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [displayText, currentTextIndex]);

  useEffect(() => {
    const animationTimer = setInterval(() => {
      setAnimationStage((prev) => (prev + 1) % interviewElements.length);
    }, 3000);

    return () => clearInterval(animationTimer);
  }, []);

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="container mx-auto px-4 py-24 lg:py-36 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Text Content */}
          <div className="text-left space-y-8">
            <div className="inline-flex items-center bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm space-x-2">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              <span>AI-Powered Interview Preparation</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 min-h-[100px]">
              Master Your Interviews <br />with{" "}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400"
              >
                {displayText}
                <span className="animate-blink">|</span>
              </span>
            </h1>

            {/* Added fixed margin-top to ensure consistent spacing */}
            <div className="mt-40">
              <p className="text-xl text-gray-600 max-w-xl mt-8">
                Transform your interview skills with personalized AI-driven mock
                interviews, real-time feedback, and strategic preparation
                techniques.
              </p>
            </div>

            <div className="flex space-x-4">
              <a
                href="/ai-tools/AiMockInterview"
                className="inline-flex justify-center items-center py-4 px-6 text-base font-medium text-white rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
              >
                Get Started for Free
              </a>
            </div>
          </div>

          {/* Right Side: Interview Preparation Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative w-full max-w-xl mx-auto perspective-1000">
              <div className="relative w-full h-[500px] flex items-center justify-center">
                {/* Circular Orbit Container */}
                <div className="relative w-96 h-96 rounded-full border-2 border-dashed border-indigo-200">
                  {/* Central Monitor */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Monitor
                      size={200}
                      className="text-gray-300 fill-black"
                      strokeWidth={1}
                    />
                    {/* Replace MockInterviewGPT text with robot.mp4 video */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-30 mb-10 bg-gray-800 rounded-lg overflow-hidden">
                        <video
                          autoPlay
                          loop
                          muted
                          className="w-full h-full object-cover"
                        >
                          <source src="/robot.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  </div>

                  {/* Animated Interview Elements */}
                  {interviewElements.map((element, index) => {
                    const Icon = element.icon;
                    const isActive = index === animationStage;
                    const angle = (index * Math.PI * 2) / interviewElements.length;
                    const radius = 200;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <div
                        key={element.text}
                        className={`absolute transform transition-all duration-1000 ease-in-out ${
                          isActive
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-50"
                        }`}
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: `translate(-50%, -50%) ${
                            isActive ? "scale(1)" : "scale(0.5)"
                          }`,
                        }}
                      >
                        <div className="bg-white shadow-lg rounded-xl p-4 flex items-center space-x-3">
                          <Icon
                            className={`w-6 h-6 ${element.color} ${
                              isActive ? "animate-pulse" : ""
                            }`}
                          />
                          <span className="text-gray-800">{element.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Tailwind CSS custom animation configurations
const tailwindConfig = {
  theme: {
    extend: {
      animation: {
        blink: "blink 0.7s infinite",
        pulse: "pulse 2s infinite",
        bounce: "bounce 2s infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      perspective: {
        1000: "1000px",
      },
    },
  },
};
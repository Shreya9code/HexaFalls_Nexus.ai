import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['randomuser.me'],
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT: process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT,
    NEXT_PUBLIC_INFORMATION: process.env.NEXT_PUBLIC_INFORMATION,
    NEXT_PUBLIC_QUESTION_NOTE: process.env.NEXT_PUBLIC_QUESTION_NOTE,
  },
};

export default nextConfig;

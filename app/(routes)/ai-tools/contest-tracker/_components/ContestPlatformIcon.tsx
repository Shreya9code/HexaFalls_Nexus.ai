import { ContestPlatform } from "@/types/contest";
import {
  Code2,
  Trophy,
  AlertTriangle,
  Bookmark,
  BookOpen,
  Gem,
  Shield,
  Zap,
} from "lucide-react";

interface ContestPlatformIconProps {
  platform: ContestPlatform;
  className?: string;
}

export function ContestPlatformIcon({
  platform,
  className = "h-5 w-5",
}: ContestPlatformIconProps) {
  const platformIcons = {
    codeforces: <Code2 className={`${className} text-card-foreground`} />,
    codechef: <BookOpen className={`${className} text-card-foreground`} />,
    atcoder: <Gem className={`${className} text-card-foreground`} />,
    leetcode: <Trophy className={`${className} text-card-foreground`} />,
    hackerrank: <Shield className={`${className} text-card-foreground`} />,
    hackerearth: <Bookmark className={`${className} text-card-foreground`} />,
    topcoder: <Zap className={`${className} text-card-foreground`} />,
    kickstart: <Code2 className={`${className} text-card-foreground`} />,
    other: <AlertTriangle className={`${className} text-card-foreground`} />,
  };

  return platformIcons[platform] || platformIcons.other;
}
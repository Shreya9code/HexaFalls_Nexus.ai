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
    codeforces: <Code2 className={className} />,
    codechef: <BookOpen className={className} />,
    atcoder: <Gem className={className} />,
    leetcode: <Trophy className={className} />,
    hackerrank: <Shield className={className} />,
    hackerearth: <Bookmark className={className} />,
    topcoder: <Zap className={className} />,
    kickstart: <Code2 className={className} />,
    other: <AlertTriangle className={className} />,
  };

  return platformIcons[platform] || platformIcons.other;
}
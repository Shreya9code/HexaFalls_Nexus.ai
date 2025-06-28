"use client";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TimeRemaining({ startTime }: { startTime: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const start = new Date(startTime);
      const diff = start.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Started");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(
        `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m`
      );
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Clock className="h-3 w-3" />
      <span>Starts in {timeLeft}</span>
    </Badge>
  );
}
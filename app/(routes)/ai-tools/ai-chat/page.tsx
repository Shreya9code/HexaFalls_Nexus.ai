"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export default function AiChatPage() {
  const router = useRouter();

  useEffect(() => {
    const createNewChat = async () => {
      const chatId = uuidv4();
      try {
        await axios.post("/api/history", {
          recordId: chatId,
          content: [],
          aiAgentType: "/ai-tools/ai-chat",
        });
        router.replace(`/ai-tools/ai-chat/${chatId}`);
      } catch (error) {
        console.error("Error creating chat:", error);
        router.replace(`/ai-tools/ai-chat/${chatId}`);
      }
    };

    createNewChat();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Creating new chat session...</p>
      </div>
    </div>
  );
} 
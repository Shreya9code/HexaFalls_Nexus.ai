"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Send, User, Bot, Sparkles, MessageCircle } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import EmptyState from "../_components/EmptyState";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";

type Message = {
  content: string;
  role: string;
  type: string;
};

const AiChat = () => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useUser();

  const { chatid }: any = useParams();
  console.log("chatid", chatid);
  useEffect(() => {
    chatid && getMessagesList();
  }, [chatid]);
  const getMessagesList = async () => {
    const result = await axios.get("/api/history?recordId=" + chatid);
    console.log(result.data);
    setMessageList(result.data.content);
  };
  /*useEffect(() => {
    scrollToBottom();
  }, [messageList]);*/
  useEffect(() => {
if (messageList?.length) {
    updateMessagesList();
  }  }, [messageList]);
  const updateMessagesList = async () => {
    const result = await axios.put("/api/history", {
      content: messageList,
      recordId: chatid,
    });
    console.log("result after axios put", result);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onSend = async () => {
    if (!userInput.trim() || loading) return;
    const input = userInput;
    const userMessage: Message = {
      content: input,
      role: "user",
      type: "text",
    };

    setMessageList((prev) => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);
    try {
      const response = await axios.post("/api/ai-career-chat-agent", {
        userInput: input,
      });
      console.log("Initial API result:", response); //correct coming
      const runId = response?.data?.runStatus?.data?.[0]?.run_id;
      if (!runId) throw new Error("No runId returned");
      console.log("Extracted runId:", runId); //correct coming
      // Extract the AI response directly from the initial response
      const result =
        response.data?.runStatus?.data?.[0]?.output?.result?.output;
      if (!result) throw new Error("No response data received");
      console.log("result", result);
      setMessageList((prev) => [...prev, ...result]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessageList((prev) => [
        ...prev,
        {
          content: "Error: Failed to get response",
          role: "assistant",
          type: "text",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  const [id, setId] = useState("");

  useEffect(() => {
    setId(uuidv4());
  }, []);
  const onNewChat = async () => {
    //console.log(`Navigating to: ${tool.path}/${id}`);
    const result = await axios.post("/api/history", {
      recordId: id,
      content: [],
    });
    console.log("result after axios post", result);
    router.replace(`ai-tools/ai-chat/${id}`);
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                AI Career Coach
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                Your personalized career mentor
              </p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg px-6 py-2 rounded-lg"
            onClick={onNewChat}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Chat Content Section */}
      <div className="flex-1 flex flex-col bg-card mx-4 my-4 rounded-2xl shadow-sm border border-border overflow-hidden">
        {messageList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Start Your Career Journey
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Ask me anything about your career, skills, interviews, or professional development.
            </p>
            <EmptyState
              selectedQuestion={(question: string) => {
                setUserInput(question);
                setTimeout(() => onSend(), 100);
              }}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messageList.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {message.role === "user" ? (
                    <Avatar className="w-10 h-10 border-2 border-blue-500 shadow-md">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                      <AvatarFallback className="bg-blue-500 text-white font-semibold">
                        {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="w-10 h-10 border-2 border-purple-500 shadow-md">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`max-w-[70%] rounded-2xl px-5 py-4 shadow-sm ${
                    message.role === "user"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10 border-2 border-purple-500 shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted text-foreground rounded-2xl px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Section */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your career..."
              className="flex-1 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
              disabled={loading}
            />
            <Button
              onClick={onSend}
              disabled={!userInput.trim() || loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;

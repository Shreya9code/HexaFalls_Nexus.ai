'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Card } from './card';
import { Avatar } from './avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI Career Coach. How can I help you with your career today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-career-chat-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: inputValue
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Extract the response from the Inngest result
        let assistantResponse = 'I apologize, but I couldn\'t process your request. Please try again.';
        
        if (data.runStatus?.data?.[0]?.output?.result?.output?.[0]?.content) {
          assistantResponse = data.runStatus.data[0].output.result.output[0].content;
        } else if (data.runStatus?.data?.[0]?.output?.result?.result?.output?.[0]?.content) {
          assistantResponse = data.runStatus.data[0].output.result.result.output[0].content;
        }
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: assistantResponse,
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      {/* Chat Widget */}
      {isOpen && (
        <Card 
          className="shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-300"
          style={{
            width: isMinimized ? '280px' : '500px',
            height: isMinimized ? '60px' : '600px',
            marginBottom: '1rem'
          }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary/5 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 bg-primary">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">AI Career Coach</h3>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMinimize}
                  className="h-8 w-8 p-0"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages - Only show when not minimized */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-2',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="w-6 h-6 bg-primary flex-shrink-0">
                        <Bot className="w-3 h-3 text-primary-foreground" />
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg px-3 py-2 text-sm break-words',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="w-6 h-6 bg-secondary flex-shrink-0">
                        <User className="w-3 h-3 text-secondary-foreground" />
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <Avatar className="w-6 h-6 bg-primary flex-shrink-0">
                      <Bot className="w-3 h-3 text-primary-foreground" />
                    </Avatar>
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input - Only show when not minimized */}
            {!isMinimized && (
              <div className="p-4 border-t bg-muted/20 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your career..."
                    className="flex-1 text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                    className="px-3 flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={cn(
          "w-14 h-14 rounded-full shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90",
          isOpen 
            ? "rotate-45 scale-110" 
            : "hover:scale-110 hover:shadow-primary/25"
        )}
      >
        <MessageCircle className="w-6 h-6 transition-transform duration-300" />
      </Button>
    </div>
  );
} 
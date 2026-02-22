import { useState, useEffect, useRef } from "react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FeatureLock } from "@/components/dashboard/FeatureLock";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { TypingIndicator } from "@/components/ai/TypingIndicator";
import { QuickSuggestions } from "@/components/ai/QuickSuggestions";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send, Sparkles, Trash2, Calendar } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface UsageStats {
  isPremium: boolean;
  unlimited: boolean;
  messagesUsed: number;
  messagesLimit: number | null;
  remainingMessages: number | null;
}

export default function AIAssistant() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isPremium = user?.role === "premium" || user?.role === "admin";

  useEffect(() => {
    fetchUsageStats();
    fetchSuggestions();
    loadInitialMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function fetchUsageStats() {
    try {
      const response = await fetch("/api/ai/usage", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUsageStats(data);
      }
    } catch (error) {
      console.error("Error fetching usage stats:", error);
    }
  }

  async function fetchSuggestions() {
    try {
      const response = await fetch("/api/ai/suggestions");
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }

  function loadInitialMessage() {
    setMessages([
      {
        role: "assistant",
        content: "Zdravo! 👋 Ja sam Nutri AI, tvoj personalizovani nutritionist asistent. Pitaj me bilo šta o ishrani, receptima ili zdravom životnom stilu!",
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  async function handleSend(messageText?: string) {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    // Check usage limit for free users
    if (!isPremium && usageStats && usageStats.remainingMessages !== null && usageStats.remainingMessages <= 0) {
      toast({
        title: "Limit dostignut",
        description: "Iskoristio si sve besplatne AI poruke. Upgrade na Premium za neograničen pristup!",
        variant: "destructive",
      });
      return;
    }

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      const data = await response.json();

      // Add AI response
      const aiMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Update usage stats
      if (data.remainingMessages !== undefined) {
        setUsageStats((prev) => prev ? {
          ...prev,
          messagesUsed: prev.messagesLimit! - data.remainingMessages,
          remainingMessages: data.remainingMessages,
        } : null);
      }
    } catch (error: any) {
      console.error("AI chat error:", error);
      toast({
        title: "Greška",
        description: error.message || "Nije moguće poslati poruku. Pokušaj ponovo.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  }

  async function handleClearHistory() {
    if (!isPremium) return;

    try {
      const response = await fetch("/api/ai/history", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        loadInitialMessage();
        toast({
          title: "Istorija obrisana",
          description: "Chat istorija je uspešno obrisana.",
        });
      }
    } catch (error) {
      toast({
        title: "Greška",
        description: "Nije moguće obrisati istoriju.",
        variant: "destructive",
      });
    }
  }

  if (!isPremium && usageStats && usageStats.remainingMessages !== null && usageStats.remainingMessages <= 0) {
    // Free user with no messages left
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Asistent</h1>
                <p className="text-gray-600">
                  Iskoristio si sve besplatne poruke. Upgrade za neograničen pristup!
                </p>
              </div>

              <Badge className="bg-red-500 hover:bg-red-600">
                Free Trial - Limit dostignut (2/2 iskorišćeno)
              </Badge>

              {/* Sample Chat - Blurred */}
              <Card className="filter blur-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-[#1F7A5C] rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-lg p-4">
                      <p className="text-gray-800">
                        Zdravo! Ja sam tvoj AI nutritionist asistent...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <FeatureLock
                title="Otkljucaj Neograničen AI Chat"
                description="Upgrade na Premium za neograničen pristup AI asistentu sa personalizovanim savetima."
                features={[
                  "Neograničen broj AI poruka",
                  "Personalizovani odgovori na osnovu tvojih ciljeva",
                  "Context-aware konverzacija (AI pamti razgovor)",
                  "Generisanje meal planova",
                  "Prilagođavanje recepata (zamene sastojaka)",
                  "PDF export konverzacija",
                ]}
                variant="card"
              />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-hidden p-6 lg:p-8">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Asistent</h1>
                <p className="text-gray-600">
                  {isPremium
                    ? "Postavi pitanja o ishrani i dobij personalizovane odgovore."
                    : `Probaj 2 besplatne AI poruke (${usageStats?.messagesUsed || 0}/2 iskorišćeno)`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isPremium ? (
                  <>
                    <Badge className="bg-[#1F7A5C] hover:bg-[#185A44] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Premium - Neograničeno
                    </Badge>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleClearHistory}
                      title="Obriši istoriju"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Badge className={usageStats?.remainingMessages === 0 ? "bg-red-500" : "bg-orange-500"}>
                    Preostalo: {usageStats?.remainingMessages || 0}/2
                  </Badge>
                )}
              </div>
            </div>

            {/* Chat Container */}
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#1F7A5C]" />
                  Nutri AI Asistent
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-6 overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 pr-2">
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      role={msg.role}
                      content={msg.content}
                      timestamp={msg.timestamp}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestions */}
                {messages.length <= 1 && suggestions.length > 0 && (
                  <div className="mb-4">
                    <QuickSuggestions
                      suggestions={suggestions}
                      onSelect={(suggestion) => handleSend(suggestion)}
                      disabled={isLoading || isTyping}
                    />
                  </div>
                )}

                {/* Input */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Pitaj me bilo šta o ishrani..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={isLoading || isTyping}
                    className="resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={() => handleSend()}
                    className="bg-[#1F7A5C] hover:bg-[#185A44] self-end"
                    disabled={!message.trim() || isLoading || isTyping}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Premium CTA for free users */}
                {!isPremium && usageStats && usageStats.remainingMessages !== null && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      💡 <strong>Upgrade na Premium</strong> za neograničen AI chat sa personalizovanim savetima!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

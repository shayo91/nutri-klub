import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 animate-in slide-in-from-bottom-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1F7A5C] flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-[#1F7A5C] text-white"
            : "bg-gray-100 text-gray-900"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p className={cn(
            "text-xs mt-1",
            isUser ? "text-white/70" : "text-gray-500"
          )}>
            {new Date(timestamp).toLocaleTimeString("sr-RS", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface QuickSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}

export function QuickSuggestions({
  suggestions,
  onSelect,
  disabled = false,
}: QuickSuggestionsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Sparkles className="w-4 h-4" />
        <span>Brza pitanja:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
            disabled={disabled}
            className="text-xs hover:bg-[#1F7A5C] hover:text-white transition-colors"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}

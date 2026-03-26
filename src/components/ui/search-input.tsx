"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  suggestions?: string[];
  className?: string;
  inputClassName?: string;
  minCharsForSuggestions?: number;
  maxSuggestions?: number;
};

export function SearchInput({
  value,
  onValueChange,
  placeholder,
  ariaLabel,
  suggestions = [],
  className,
  inputClassName,
  minCharsForSuggestions = 1,
  maxSuggestions = 6,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const normalizedQuery = value.trim().toLowerCase();

  const visibleSuggestions = useMemo(() => {
    if (!normalizedQuery || normalizedQuery.length < minCharsForSuggestions) {
      return [];
    }

    return suggestions
      .filter((item) => item.toLowerCase().includes(normalizedQuery))
      .filter((item) => item.toLowerCase() !== normalizedQuery)
      .slice(0, maxSuggestions);
  }, [maxSuggestions, minCharsForSuggestions, normalizedQuery, suggestions]);

  const showSuggestions = isFocused && visibleSuggestions.length > 0;

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        className={cn("h-11 pl-9", inputClassName)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />

      {showSuggestions ? (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 rounded-md border border-border bg-popover p-1 shadow-md">
          {visibleSuggestions.map((item) => (
            <button
              key={item}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onValueChange(item)}
              className="block w-full rounded-sm px-2 py-1.5 text-left text-sm text-popover-foreground hover:bg-accent"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import * as React from "react";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Mic, MicOff } from "lucide-react";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { cn } from "@/lib/utils";

interface DictationTextareaProps
  extends React.ComponentProps<typeof Textarea> {
  /** Called when the textarea value changes (same as Textarea onChange) */
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  value?: string;
}

const DictationTextarea = React.forwardRef<
  HTMLTextAreaElement,
  DictationTextareaProps
>(({ onChange, value, className, disabled, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const mergedRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const handleResult = React.useCallback(
    (finalTranscript: string) => {
      if (!onChange) return;

      const currentValue = (value ?? textareaRef.current?.value) || "";
      const separator = currentValue && !currentValue.endsWith(" ") ? " " : "";
      const newValue = currentValue + separator + finalTranscript;

      // Create a synthetic-like change event
      const nativeEvent = new Event("change", { bubbles: true });
      const syntheticEvent = {
        ...nativeEvent,
        target: { ...textareaRef.current, value: newValue },
        currentTarget: { ...textareaRef.current, value: newValue },
      } as unknown as React.ChangeEvent<HTMLTextAreaElement>;

      onChange(syntheticEvent);
    },
    [onChange, value]
  );

  const { isListening, isSupported, transcript, startListening, stopListening, error } =
    useSpeechToText(handleResult);

  // Show interim transcript as a visual hint
  const displayValue = isListening && transcript
    ? (value || "") + (value && !String(value).endsWith(" ") ? " " : "") + transcript
    : value;

  if (!isSupported) {
    return (
      <Textarea
        ref={mergedRef}
        value={value}
        onChange={onChange}
        className={className}
        disabled={disabled}
        {...props}
      />
    );
  }

  return (
    <div className="relative">
      <Textarea
        ref={mergedRef}
        value={displayValue}
        onChange={onChange}
        className={cn("pr-10", className)}
        disabled={disabled}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        className={cn(
          "absolute bottom-1.5 right-1.5 h-7 w-7 p-0 rounded-full",
          isListening && "text-red-600 hover:text-red-700 animate-pulse",
          !isListening && "text-muted-foreground hover:text-foreground"
        )}
        onClick={isListening ? stopListening : startListening}
        title={
          isListening
            ? "Stop dictation"
            : error
              ? `Mic error: ${error}`
              : "Start dictation"
        }
      >
        {isListening ? (
          <Mic className="h-4 w-4" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
});

DictationTextarea.displayName = "DictationTextarea";

export { DictationTextarea };

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  X,
  SendHorizontal,
  Loader2,
  Mic,
  Square,
  BookOpen,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SourceRef {
  slug: string;
  title: string;
  sectionTitle: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: {
    guidelines: SourceRef[];
    evidence: SourceRef[];
  };
}

export function GuidelineChatPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [open]);

  // ── Audio recording ──

  const handleRecordingComplete = useCallback(
    async (blob: Blob, mimeType: string) => {
      setIsRecording(false);
      setIsTranscribing(true);

      try {
        const formData = new FormData();
        const ext = mimeType.includes("wav")
          ? "wav"
          : mimeType.includes("mp4")
            ? "mp4"
            : "webm";
        formData.append("audio", blob, `recording.${ext}`);

        const res = await fetch("/api/cephra/transcribe", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!data.ok) {
          throw new Error(data.error || "Transcription failed.");
        }

        if (data.transcript) {
          setInput((prev) => {
            const separator = prev && !prev.endsWith(" ") ? " " : "";
            return prev + separator + data.transcript;
          });
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Transcription failed.",
        );
      } finally {
        setIsTranscribing(false);
      }
    },
    [],
  );

  const recorder = useAudioRecorder(handleRecordingComplete);

  const handleMicClick = useCallback(() => {
    if (isRecording) {
      if (!recorder.speechDetected) {
        recorder.stopRecording();
        setIsRecording(false);
        toast("No speech detected. Try again.");
        return;
      }
      recorder.stopRecording();
    } else {
      setIsRecording(true);
      recorder.startRecording();
    }
  }, [isRecording, recorder]);

  // ── Send message ──

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/cephra/guideline-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || "Chat failed.");
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Chat failed.");
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  // ── Keyboard handling ──

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // ── Auto-resize textarea ──

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
    },
    [],
  );

  if (!open) return null;

  return (
    <div className="fixed bottom-0 right-4 z-50 flex w-full max-w-lg flex-col rounded-t-xl border border-b-0 border-border bg-card shadow-lg animate-[chat-slide-up_0.25s_ease-out] md:right-8 max-h-[85vh] md:max-h-[70vh]">
      {/* ── Header ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Guideline Assistant</h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onClose}
          title="Close chat"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BookOpen className="mb-2 h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">
              Ask a clinical question
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Answers are grounded in the uploaded guideline library
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex animate-[chat-fade-in_0.2s_ease-out]",
              msg.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card",
              )}
            >
              {/* Message content */}
              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </div>

              {/* Source citations */}
              {msg.role === "assistant" && msg.sources && (
                <>
                  {/* Guideline sources */}
                  {msg.sources.guidelines.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {deduplicateBySlug(msg.sources.guidelines).map((s) => (
                        <Link
                          key={s.slug}
                          href={`/guidelines/${s.slug}`}
                          onClick={onClose}
                        >
                          <Badge
                            variant="secondary"
                            className="cursor-pointer text-[10px] hover:bg-secondary/80"
                          >
                            <BookOpen className="mr-0.5 h-2.5 w-2.5" />
                            {s.title}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Evidence sources — distinct block with disclaimer */}
                  {msg.sources.evidence.length > 0 && (
                    <div className="mt-2.5 rounded-md border-l-2 border-amber-400 bg-amber-50 px-2.5 py-2">
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                        Reference from Evidence Library — not for direct
                        management decisions
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {deduplicateBySlug(msg.sources.evidence).map((s) => (
                          <Link
                            key={s.slug}
                            href={`/guidelines/${s.slug}`}
                            onClick={onClose}
                          >
                            <Badge
                              variant="outline"
                              className="cursor-pointer border-amber-300 text-[10px] text-amber-800 hover:bg-amber-100"
                            >
                              <FlaskConical className="mr-0.5 h-2.5 w-2.5" />
                              {s.title}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start animate-[chat-fade-in_0.2s_ease-out]">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ── */}
      <div className="shrink-0 border-t border-border px-3 py-2.5">
        <div className="flex items-end gap-1.5">
          {/* Mic button */}
          {recorder.isSupported && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              disabled={isLoading || isTranscribing}
              className={cn(
                "mb-0.5 shrink-0",
                isRecording && "text-red-500 animate-pulse",
                isTranscribing && "text-blue-400",
              )}
              onClick={handleMicClick}
              title={
                isTranscribing
                  ? "Transcribing..."
                  : isRecording
                    ? "Stop recording"
                    : "Start dictation"
              }
            >
              {isTranscribing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isRecording ? (
                <Square className="h-3 w-3 fill-current" />
              ) : (
                <Mic className="h-3.5 w-3.5" />
              )}
            </Button>
          )}

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask a clinical question..."
            disabled={isLoading}
            rows={1}
            className="min-h-[32px] max-h-[96px] flex-1 resize-none rounded-md border border-input bg-background px-2.5 py-1.5 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
          />

          {/* Send button */}
          <Button
            type="button"
            variant="default"
            size="icon-xs"
            disabled={!input.trim() || isLoading}
            onClick={handleSend}
            title="Send message"
            className="mb-0.5 shrink-0"
          >
            <SendHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Deduplicate sources by slug so each guideline appears only once */
function deduplicateBySlug(
  sources: SourceRef[],
): SourceRef[] {
  const seen = new Set<string>();
  return sources.filter((s) => {
    if (seen.has(s.slug)) return false;
    seen.add(s.slug);
    return true;
  });
}

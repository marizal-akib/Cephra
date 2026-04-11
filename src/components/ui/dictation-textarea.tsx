"use client";

import * as React from "react";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Mic, MicOff, Loader2, Check, X, Square, RotateCcw, Sparkles } from "lucide-react";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DictationTextareaProps
  extends React.ComponentProps<typeof Textarea> {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  value?: string;
  /**
   * When set, the Sparkles button calls a summarization endpoint instead of
   * the default refine endpoint. Use "labs" for pasted raw lab/imaging results.
   */
  summarizeMode?: "labs" | null;
}

type OverlayState = "idle" | "recording" | "transcribing" | "reviewing" | "refining" | "refine-review";

// ── Listening animation ──
// Layer 1: Pulse ring (CSS) — slow breathing, always running
// Layer 2: Waveform bars (canvas) — real audio data, smoothed, clamped
// Layer 3: Mic glow (CSS) — volume-driven box-shadow

const BAR_COUNT = 7;
const LERP_UP = 0.25;   // rise speed
const LERP_DOWN = 0.08;  // fall speed (slow decay)
const MAX_AMP = 0.5;     // clamp — no spikes
const MIN_BAR_H = 3;
const MAX_BAR_H = 20;
const BAR_W = 3;
const BAR_GAP = 4.5;

function ListeningVis({
  analyserRef,
  onStop,
}: {
  analyserRef: React.RefObject<AnalyserNode | null>;
  onStop: () => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef<number>(0);
  const smoothedRef = React.useRef<number[]>(new Array(BAR_COUNT).fill(0));
  const volumeRef = React.useRef(0);
  const [glowIntensity, setGlowIntensity] = React.useState(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let frameCount = 0;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      frameCount++;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const analyser = analyserRef.current;
      const smoothed = smoothedRef.current;

      // ── Sample audio ──
      const rawBars = new Array(BAR_COUNT).fill(0);
      let avgVol = 0;

      if (analyser) {
        const bufLen = analyser.frequencyBinCount;
        const data = new Uint8Array(bufLen);
        analyser.getByteFrequencyData(data);

        // Speech bands: sample from low–mid frequencies
        const speechEnd = Math.floor(bufLen * 0.45);
        for (let i = 0; i < BAR_COUNT; i++) {
          const lo = Math.floor((i / BAR_COUNT) * speechEnd);
          const hi = Math.floor(((i + 1) / BAR_COUNT) * speechEnd);
          let sum = 0;
          for (let j = lo; j < hi; j++) sum += data[j];
          rawBars[i] = Math.min((sum / (hi - lo)) / 255, MAX_AMP);
        }

        // Average volume for mic glow
        let total = 0;
        for (let j = 0; j < speechEnd; j++) total += data[j];
        avgVol = (total / speechEnd) / 255;
      }

      // ── Smooth bars (lerp) ──
      for (let i = 0; i < BAR_COUNT; i++) {
        const target = rawBars[i];
        const rate = target > smoothed[i] ? LERP_UP : LERP_DOWN;
        smoothed[i] += (target - smoothed[i]) * rate;
      }

      // ── Smooth volume for glow ──
      const volTarget = Math.min(avgVol / MAX_AMP, 1);
      volumeRef.current += (volTarget - volumeRef.current) * 0.12;

      // Update glow CSS every ~4 frames to avoid excessive re-renders
      if (frameCount % 4 === 0) {
        setGlowIntensity(volumeRef.current);
      }

      // ── Draw bars ──
      const totalW = BAR_COUNT * BAR_W + (BAR_COUNT - 1) * BAR_GAP;
      const startX = (w - totalW) / 2;
      const cy = h / 2;

      for (let i = 0; i < BAR_COUNT; i++) {
        const val = smoothed[i];
        const barH = MIN_BAR_H + (val / MAX_AMP) * (MAX_BAR_H - MIN_BAR_H);
        const x = startX + i * (BAR_W + BAR_GAP);
        const y = cy - barH / 2;
        const alpha = 0.3 + (val / MAX_AMP) * 0.55;

        // Blue-400: rgb(96, 165, 250)
        ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
        ctx.beginPath();
        ctx.roundRect(x, y, BAR_W, barH, BAR_W / 2);
        ctx.fill();
      }
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyserRef]);

  // Mic glow: smooth box-shadow driven by volume
  const glowSpread = Math.round(glowIntensity * 18);
  const glowAlpha = (glowIntensity * 0.4).toFixed(2);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mic button with pulse ring + glow */}
      <div className="relative flex items-center justify-center">
        {/* Layer 1: Pulse ring — always breathing */}
        <span className="absolute h-14 w-14 rounded-full border border-blue-400/25 animate-[dictation-breathe_2s_ease-in-out_infinite]" />
        <span className="absolute h-[4.5rem] w-[4.5rem] rounded-full border border-blue-300/10 animate-[dictation-breathe_2s_ease-in-out_infinite_0.4s]" />

        {/* Layer 3: Mic button with volume-driven glow */}
        <button
          type="button"
          className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white transition-shadow duration-200 hover:scale-105 active:scale-95"
          onClick={onStop}
          title="Stop recording"
          style={{
            boxShadow: glowSpread > 1
              ? `0 0 ${glowSpread}px ${Math.round(glowSpread * 0.6)}px rgba(96, 165, 250, ${glowAlpha})`
              : "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Square className="h-3.5 w-3.5 fill-current" />
        </button>
      </div>

      {/* Layer 2: Waveform bars */}
      <canvas
        ref={canvasRef}
        className="h-7"
        style={{ display: "block", width: `${BAR_COUNT * BAR_W + (BAR_COUNT - 1) * BAR_GAP + 8}px` }}
      />
    </div>
  );
}

const DictationTextarea = React.forwardRef<
  HTMLTextAreaElement,
  DictationTextareaProps
>(({ onChange, value, className, disabled, summarizeMode = null, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [overlayState, setOverlayState] = React.useState<OverlayState>("idle");
  const [pendingTranscript, setPendingTranscript] = React.useState<string | null>(null);
  const [transcribeError, setTranscribeError] = React.useState<string | null>(null);
  const [refinedText, setRefinedText] = React.useState<string | null>(null);

  const mergedRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const insertText = React.useCallback(
    (text: string) => {
      if (!onChange) return;

      const currentValue = (value ?? textareaRef.current?.value) || "";
      const separator = currentValue && !currentValue.endsWith(" ") ? " " : "";
      const newValue = currentValue + separator + text;

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

  // ─── Upload transcription ───

  const handleRecordingComplete = React.useCallback(
    async (blob: Blob, mimeType: string) => {
      setOverlayState("transcribing");
      setTranscribeError(null);

      try {
        const formData = new FormData();
        const ext = mimeType.includes("wav") ? "wav" : mimeType.includes("mp4") ? "mp4" : "webm";
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
          setPendingTranscript(data.transcript);
          setOverlayState("reviewing");
        } else {
          setOverlayState("idle");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Transcription failed.";
        setTranscribeError(message);
        toast.error(message);
        setOverlayState("idle");
      }
    },
    []
  );

  const recorder = useAudioRecorder(handleRecordingComplete);

  // ─── Browser speech fallback ───

  const handleBrowserResult = React.useCallback(
    (finalTranscript: string) => {
      insertText(finalTranscript);
    },
    [insertText]
  );

  const browserSpeech = useSpeechToText(handleBrowserResult);

  // ─── Mode selection ───

  const useOpenAI = recorder.isSupported;
  const useBrowser = !useOpenAI && browserSpeech.isSupported;
  const hasAnySupport = useOpenAI || useBrowser;

  // ─── Handlers ───

  const handleStartRecording = React.useCallback(() => {
    setTranscribeError(null);
    if (useOpenAI) {
      setOverlayState("recording");
      recorder.startRecording();
    } else if (useBrowser) {
      browserSpeech.startListening();
    }
  }, [useOpenAI, useBrowser, recorder, browserSpeech]);

  const handleStopRecording = React.useCallback(() => {
    if (useOpenAI) {
      // If no speech was detected, go back to idle with a message
      if (!recorder.speechDetected) {
        recorder.stopRecording();
        setOverlayState("idle");
        toast("No speech detected. Try again.");
        return;
      }
      recorder.stopRecording();
    } else if (useBrowser) {
      browserSpeech.stopListening();
    }
  }, [useOpenAI, useBrowser, recorder, browserSpeech]);

  const handleInsert = React.useCallback(() => {
    if (pendingTranscript) {
      insertText(pendingTranscript);
      setPendingTranscript(null);
    }
    setOverlayState("idle");
  }, [pendingTranscript, insertText]);

  const handleDiscard = React.useCallback(() => {
    setPendingTranscript(null);
    setOverlayState("idle");
  }, []);

  // ─── Refine handlers ───

  const handleRefine = React.useCallback(async () => {
    const text = ((value ?? textareaRef.current?.value) || "").trim();
    if (!text) return;

    setOverlayState("refining");
    setRefinedText(null);

    const endpoint =
      summarizeMode === "labs"
        ? "/api/cephra/summarize-labs"
        : "/api/cephra/refine";
    const failureLabel =
      summarizeMode === "labs" ? "Summarize failed." : "Refine failed.";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || failureLabel);
      }

      const result =
        summarizeMode === "labs" ? data.summary : data.refined;

      if (result) {
        setRefinedText(result);
        setOverlayState("refine-review");
      } else {
        setOverlayState("idle");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : failureLabel);
      setOverlayState("idle");
    }
  }, [value, summarizeMode]);

  const handleRefineReplace = React.useCallback(() => {
    if (!refinedText || !onChange) return;

    const nativeEvent = new Event("change", { bubbles: true });
    const syntheticEvent = {
      ...nativeEvent,
      target: { ...textareaRef.current, value: refinedText },
      currentTarget: { ...textareaRef.current, value: refinedText },
    } as unknown as React.ChangeEvent<HTMLTextAreaElement>;

    onChange(syntheticEvent);
    setRefinedText(null);
    setOverlayState("idle");
  }, [refinedText, onChange]);

  const handleRefineInsertBelow = React.useCallback(() => {
    if (!refinedText) return;
    insertText("\n\n" + refinedText);
    setRefinedText(null);
    setOverlayState("idle");
  }, [refinedText, insertText]);

  const handleRefineDiscard = React.useCallback(() => {
    setRefinedText(null);
    setOverlayState("idle");
  }, []);

  // ─── Browser fallback display value ───

  const displayValue =
    useBrowser && browserSpeech.isListening && browserSpeech.transcript
      ? (value || "") +
        (value && !String(value).endsWith(" ") ? " " : "") +
        browserSpeech.transcript
      : value;

  const activeError = useOpenAI ? recorder.error : browserSpeech.error;

  // ─── No speech support: plain textarea ───

  if (!hasAnySupport) {
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

  const isBrowserListening = useBrowser && browserSpeech.isListening;

  return (
    <div className="relative">
      <Textarea
        ref={mergedRef}
        value={displayValue}
        onChange={onChange}
        className={cn("pr-16", className)}
        disabled={disabled}
        {...props}
      />

      {/* ── Idle: toolbar (Refine + Mic) ── */}
      {overlayState === "idle" && (
        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5">
          {/* Refine / Summarize button — only when there's text */}
          {String(value || "").trim().length > 0 && !isBrowserListening && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-foreground"
              onClick={handleRefine}
              title={
                summarizeMode === "labs"
                  ? "Summarize pasted results"
                  : "Clean up and organise this note"
              }
            >
              <Sparkles className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Mic button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            className={cn(
              "h-7 w-7 p-0 rounded-full",
              isBrowserListening && "text-red-600 hover:text-red-700 animate-pulse",
              !isBrowserListening && "text-muted-foreground hover:text-foreground"
            )}
            onClick={isBrowserListening ? handleStopRecording : handleStartRecording}
            title={
              isBrowserListening
                ? "Stop dictation"
                : activeError
                  ? `Mic error: ${activeError}`
                  : useBrowser
                    ? "Start dictation (browser)"
                    : "Start dictation"
            }
          >
            {isBrowserListening ? (
              <Mic className="h-4 w-4" />
            ) : (
              <MicOff className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* ── Recording overlay ── */}
      {overlayState === "recording" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-md bg-background/95 backdrop-blur-sm">
          <ListeningVis
            analyserRef={recorder.analyserRef}
            onStop={handleStopRecording}
          />
        </div>
      )}

      {/* ── Transcribing overlay ── */}
      {overlayState === "transcribing" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 rounded-md bg-background/95 backdrop-blur-sm">
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
          <p className="text-xs font-medium text-muted-foreground">Transcribing...</p>
        </div>
      )}

      {/* ── Review overlay (editable) ── */}
      {overlayState === "reviewing" && pendingTranscript !== null && (
        <div className="absolute left-0 right-0 top-0 z-10 flex flex-col rounded-md bg-background border border-border shadow-sm min-h-[200px] max-h-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between px-2 py-1 border-b border-border">
            <span className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">
              Review transcript
            </span>
            <span className="text-[10px] text-muted-foreground/60 tabular-nums">
              {pendingTranscript.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          {/* Editable area */}
          <textarea
            className="flex-1 min-h-0 w-full resize-none border-0 bg-transparent px-2 py-1.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none overflow-y-auto"
            value={pendingTranscript}
            onChange={(e) => setPendingTranscript(e.target.value)}
            placeholder="Transcript will appear here..."
            autoFocus
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />

          {/* Footer actions */}
          <div className="flex items-center justify-between px-2 py-1.5 border-t border-border bg-muted/30">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              onClick={() => {
                setPendingTranscript(null);
                setOverlayState("recording");
                recorder.startRecording();
              }}
            >
              <RotateCcw className="h-3 w-3" />
              Re-record
            </Button>

            <div className="flex gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-[11px] text-muted-foreground"
                onClick={handleDiscard}
              >
                Discard
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="h-7 px-3 gap-1 text-[11px]"
                onClick={handleInsert}
                disabled={!pendingTranscript.trim()}
              >
                <Check className="h-3 w-3" />
                Insert
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Refining / Summarizing overlay ── */}
      {overlayState === "refining" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 rounded-md bg-background/95 backdrop-blur-sm">
          <Sparkles className="h-5 w-5 animate-pulse text-blue-400" />
          <p className="text-xs font-medium text-muted-foreground">
            {summarizeMode === "labs" ? "Summarizing..." : "Refining..."}
          </p>
        </div>
      )}

      {/* ── Refine / Summary review card (below textarea) ── */}
      {overlayState === "refine-review" && refinedText && (
        <div className="mt-2 rounded-md border border-border bg-background shadow-sm">
          <div className="flex items-center justify-between px-2 py-1 border-b border-border">
            <span className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">
              {summarizeMode === "labs" ? "Summary" : "Refined note"}
            </span>
            <span className="text-[10px] text-muted-foreground/60 tabular-nums">
              {refinedText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <div className="max-h-[200px] overflow-y-auto px-2 py-1.5 text-sm leading-relaxed whitespace-pre-wrap">
            {refinedText}
          </div>

          <div className="flex items-center justify-end gap-1.5 px-2 py-1.5 border-t border-border bg-muted/30">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-[11px] text-muted-foreground"
              onClick={handleRefineDiscard}
            >
              Discard
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-3 text-[11px]"
              onClick={handleRefineInsertBelow}
            >
              Insert below
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="h-7 px-3 gap-1 text-[11px]"
              onClick={handleRefineReplace}
            >
              <Check className="h-3 w-3" />
              Replace
            </Button>
          </div>
        </div>
      )}

      {/* ── Inline error ── */}
      {overlayState === "idle" && (transcribeError || activeError) && (
        <div className="mt-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2">
          <p className="text-xs text-destructive">
            {transcribeError || activeError}
          </p>
        </div>
      )}
    </div>
  );
});

DictationTextarea.displayName = "DictationTextarea";

export { DictationTextarea };

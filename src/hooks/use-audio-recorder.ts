"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface UseAudioRecorderReturn {
  isRecording: boolean;
  isSupported: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: string | null;
  analyserRef: React.RefObject<AnalyserNode | null>;
  /** true if speech-level audio was detected during the last recording */
  speechDetected: boolean;
}

const SPEECH_THRESHOLD = 20;       // average frequency energy (0-255) to count as speech
const SPEECH_CHECK_INTERVAL = 200;  // ms between checks
const MIN_SPEECH_FRAMES = 4;        // consecutive above-threshold checks needed (~800ms)

/** Encode Float32 PCM samples into a 16-bit WAV Blob. */
function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (off: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

/** Decode any audio blob to PCM Float32Array via browser AudioContext. */
async function blobToWav(blob: Blob): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new OfflineAudioContext(1, 1, 44100);
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  const pcm = audioBuffer.getChannelData(0);
  return encodeWav(pcm, audioBuffer.sampleRate);
}

const PREFERRED_MIMES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
];

function getSupportedMime(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  for (const mime of PREFERRED_MIMES) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return null;
}

export function useAudioRecorder(
  onRecordingComplete: (blob: Blob, mimeType: string) => void
): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speechDetected, setSpeechDetected] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeRef = useRef<string>("");
  const onCompleteRef = useRef(onRecordingComplete);
  const speechFramesRef = useRef(0);
  const speechConfirmedRef = useRef(false);
  const speechCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    onCompleteRef.current = onRecordingComplete;
  }, [onRecordingComplete]);

  const isSupported =
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    typeof navigator?.mediaDevices?.getUserMedia === "function" &&
    getSupportedMime() !== null;

  const cleanup = useCallback(() => {
    if (speechCheckRef.current) {
      clearInterval(speechCheckRef.current);
      speechCheckRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    if (!isSupported) return;

    setError(null);
    chunksRef.current = [];
    speechFramesRef.current = 0;
    speechConfirmedRef.current = false;
    setSpeechDetected(false);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone access denied. Please enable it in browser settings."
          : "Could not access microphone.";
      setError(msg);
      return;
    }

    streamRef.current = stream;

    // AudioContext + AnalyserNode for live waveform visualization
    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    } catch {
      // Visualization won't work but recording still can
    }

    // Poll AnalyserNode to detect sustained speech (not just a single noise spike)
    if (analyserRef.current) {
      const analyser = analyserRef.current;
      const buf = new Uint8Array(analyser.frequencyBinCount);
      speechCheckRef.current = setInterval(() => {
        if (speechConfirmedRef.current) return; // already confirmed, stop checking
        analyser.getByteFrequencyData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i];
        const avg = sum / buf.length;
        if (avg > SPEECH_THRESHOLD) {
          speechFramesRef.current++;
          if (speechFramesRef.current >= MIN_SPEECH_FRAMES) {
            speechConfirmedRef.current = true;
            setSpeechDetected(true);
          }
        } else {
          // Reset — noise spikes don't sustain
          speechFramesRef.current = 0;
        }
      }, SPEECH_CHECK_INTERVAL);
    }

    // MediaRecorder for reliable audio capture (runs on its own thread)
    const mimeType = getSupportedMime()!;
    mimeRef.current = mimeType;
    const recorder = new MediaRecorder(stream, { mimeType });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      const chunks = chunksRef.current;
      chunksRef.current = [];
      mediaRecorderRef.current = null;
      const hadSpeech = speechConfirmedRef.current;

      if (!hadSpeech || chunks.length === 0) {
        // No speech detected — skip API call entirely
        cleanup();
        return;
      }

      const rawBlob = new Blob(chunks, { type: mimeRef.current });

      // Decode the webm/mp4 to clean WAV for best transcription quality
      try {
        const wavBlob = await blobToWav(rawBlob);
        cleanup();
        onCompleteRef.current(wavBlob, "audio/wav");
      } catch {
        // Fallback: send the raw blob if decoding fails
        cleanup();
        onCompleteRef.current(rawBlob, mimeRef.current);
      }
    };

    recorder.onerror = () => {
      setError("Recording failed.");
      setIsRecording(false);
      cleanup();
    };

    mediaRecorderRef.current = recorder;
    recorder.start(1000);
    setIsRecording(true);
  }, [isSupported, cleanup]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try { recorder.requestData(); } catch { /* ignore */ }
      recorder.stop();
    }
    setIsRecording(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current?.stop();
      }
      mediaRecorderRef.current = null;
      cleanup();
    };
  }, [cleanup]);

  return { isRecording, isSupported, startRecording, stopRecording, error, analyserRef, speechDetected };
}

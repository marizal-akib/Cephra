"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface UseRealtimeTranscriptionReturn {
  isConnecting: boolean;
  isListening: boolean;
  partialTranscript: string;
  finalTranscript: string;
  error: string | null;
  analyserRef: React.RefObject<AnalyserNode | null>;
  start: () => Promise<void>;
  stop: () => void;
}

export function useRealtimeTranscription(): UseRealtimeTranscriptionReturn {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [partialTranscript, setPartialTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const cleanup = useCallback(() => {
    dcRef.current?.close();
    dcRef.current = null;

    pcRef.current?.close();
    pcRef.current = null;

    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setPartialTranscript("");
    setFinalTranscript("");
    setIsConnecting(true);

    // 1. Get ephemeral token from backend
    let clientSecret: string;
    try {
      const tokenRes = await fetch("/api/cephra/realtime/session", {
        method: "POST",
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.ok) {
        throw new Error(tokenData.error || "Failed to get session token.");
      }
      clientSecret = tokenData.client_secret;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect.");
      setIsConnecting(false);
      return;
    }

    // 2. Get microphone stream
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
          ? "Microphone access denied."
          : "Could not access microphone.";
      setError(msg);
      setIsConnecting(false);
      return;
    }

    streamRef.current = stream;

    // 3. Set up AudioContext + AnalyserNode for waveform visualization
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
      // Visualization won't work but transcription still can
    }

    // 4. Create RTCPeerConnection
    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    // Add microphone audio track
    const audioTrack = stream.getAudioTracks()[0];
    pc.addTrack(audioTrack, stream);

    // 5. Create data channel for events
    const dc = pc.createDataChannel("oai-events", { ordered: true });
    dcRef.current = dc;

    dc.onopen = () => {
      setIsConnecting(false);
      setIsListening(true);
    };

    dc.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "conversation.item.input_audio_transcription.delta") {
          setPartialTranscript((prev) => prev + (msg.delta || ""));
        }

        if (msg.type === "conversation.item.input_audio_transcription.completed") {
          setFinalTranscript((prev) => {
            const separator = prev && !prev.endsWith(" ") ? " " : "";
            return prev + separator + (msg.transcript || "");
          });
          setPartialTranscript("");
        }

        if (msg.type === "error") {
          console.error("[realtime] server error:", msg.error);
          setError(msg.error?.message || "Realtime transcription error.");
        }
      } catch {
        // Ignore unparseable messages
      }
    };

    dc.onclose = () => {
      setIsListening(false);
    };

    dc.onerror = () => {
      setError("Connection lost.");
      setIsListening(false);
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "failed" || pc.iceConnectionState === "disconnected") {
        setError("Connection lost.");
        setIsListening(false);
        cleanup();
      }
    };

    // 6. Create SDP offer and connect to OpenAI Realtime
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(
        "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clientSecret}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      if (!sdpRes.ok) {
        throw new Error("Failed to establish WebRTC connection.");
      }

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: answerSdp })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed.");
      setIsConnecting(false);
      cleanup();
    }
  }, [cleanup]);

  const stop = useCallback(() => {
    setIsListening(false);
    setIsConnecting(false);
    cleanup();
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isConnecting,
    isListening,
    partialTranscript,
    finalTranscript,
    error,
    analyserRef,
    start,
    stop,
  };
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";
import { toFile } from "openai";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB (OpenAI limit)
const ALLOWED_TYPES = new Set([
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/m4a",
  "audio/ogg",
]);

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form data." },
      { status: 400 }
    );
  }

  const audioFile = formData.get("audio");

  if (!audioFile || !(audioFile instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Missing audio file." },
      { status: 400 }
    );
  }

  if (audioFile.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { ok: false, error: "Audio file too large. Maximum 25 MB." },
      { status: 400 }
    );
  }

  // Strip codec suffix (e.g. "audio/webm;codecs=opus" → "audio/webm")
  const baseType = audioFile.type.split(";")[0].trim();

  // Allow through if type is empty (some browsers omit it) or explicitly allowed
  if (baseType && !ALLOWED_TYPES.has(baseType)) {
    return NextResponse.json(
      { ok: false, error: `Unsupported audio format: ${audioFile.type}` },
      { status: 400 }
    );
  }

  try {
    // Convert to a Buffer with explicit filename so the SDK sends the
    // correct Content-Type and extension to the OpenAI API
    const arrayBuffer = await audioFile.arrayBuffer();
    const ext = audioFile.name?.split(".").pop() || (baseType === "audio/mp4" ? "mp4" : "webm");
    const uploadFile = await toFile(
      Buffer.from(arrayBuffer),
      `recording.${ext}`,
      { type: baseType || "audio/webm" }
    );

    const model = "gpt-4o-transcribe";

    const transcription = await openai.audio.transcriptions.create({
      model,
      file: uploadFile,
      language: "en",
      prompt:    "Medical clinical dictation in English for a clinician note. Transcribe accurately and preserve meaning. Use clear, natural punctuation for readability. Treat short pauses as part of the same sentence unless the speaker clearly finishes a thought."
     });

    // Filter out hallucinated text from silence (model returns ".", "...", etc.)
    const text = (transcription.text || "").trim();
    if (text.length < 3 || /^[.\s,!?]+$/.test(text)) {
      return NextResponse.json({ ok: true, transcript: "", model });
    }

    return NextResponse.json({ ok: true, transcript: text, model });
  } catch (err: unknown) {
    console.error("[transcribe] OpenAI error:", err);

    const status =
      err && typeof err === "object" && "status" in err
        ? (err as { status: number }).status
        : 500;

    let message = "Transcription failed. Please try again.";
    if (status === 429) {
      message = "OpenAI quota exceeded. Please check your billing at platform.openai.com.";
    } else if (status === 401) {
      message = "Invalid OpenAI API key. Please check server configuration.";
    }

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

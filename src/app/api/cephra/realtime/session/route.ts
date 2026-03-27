import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "OpenAI API key not configured." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview",
        modalities: ["text"],
        input_audio_transcription: {
          model: "gpt-4o-transcribe",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[realtime/session] OpenAI error:", err);
      return NextResponse.json(
        { ok: false, error: "Failed to create realtime session." },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      ok: true,
      client_secret: data.client_secret.value,
      session_id: data.id,
    });
  } catch (err) {
    console.error("[realtime/session] error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to create realtime session." },
      { status: 500 }
    );
  }
}

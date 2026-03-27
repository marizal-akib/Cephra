import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are a clinical note editor for a medical headache clinic. Your job is to clean up and organise clinician-dictated or typed notes.

Rules — follow these strictly:
- Fix grammar, spelling, and punctuation
- Remove filler words (um, uh, like, you know, repetitions)
- Improve readability and logical flow
- Organise content into clear paragraphs or sections where appropriate
- Preserve ALL original meaning, medical facts, and clinical observations exactly
- Keep uncertainty as-is — if the clinician said "possibly" or "likely", keep those qualifiers
- Do NOT add any new medical information, diagnoses, or clinical details
- Do NOT hallucinate or infer missing information
- Do NOT over-polish — keep the clinician's voice and clinical style
- Do NOT add headings, bullet points, or formatting unless the original text implies structure
- Return ONLY the refined text, no explanations or commentary`;

export async function POST(request: Request) {
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

  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json(
      { ok: false, error: "No text provided." },
      { status: 400 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
    });

    const refined = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ ok: true, refined });
  } catch (err: unknown) {
    console.error("[refine] OpenAI error:", err);

    const status =
      err && typeof err === "object" && "status" in err
        ? (err as { status: number }).status
        : 500;

    let message = "Refine failed. Please try again.";
    if (status === 429) {
      message = "OpenAI quota exceeded.";
    }

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are a clinical summarizer for a headache clinic. The clinician will paste raw lab or imaging results from an external pathology system. Your job is to produce a SHORT clinical summary (2-5 sentences) suitable for a follow-up note.

Rules — follow these strictly:
- Lead with any ABNORMAL or clinically relevant findings. State the value and its reference range if given.
- Group normal findings briefly (e.g. "FBC, U&E, LFT, CRP within normal limits").
- Preserve all numeric values that are abnormal or near-threshold.
- Do NOT invent, infer, or add findings not present in the input.
- Do NOT add diagnoses, recommendations, or management plans.
- Do NOT use markdown, bullets, or headings — plain prose only.
- If the input is empty or unparseable, return: "No results to summarize."
- Return ONLY the summary text, no preamble or commentary.`;

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

    const summary = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ ok: true, summary });
  } catch (err: unknown) {
    console.error("[summarize-labs] OpenAI error:", err);

    const status =
      err && typeof err === "object" && "status" in err
        ? (err as { status: number }).status
        : 500;

    let message = "Summarize failed. Please try again.";
    if (status === 429) {
      message = "OpenAI quota exceeded.";
    }

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

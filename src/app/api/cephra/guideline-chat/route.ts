import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";
import { retrieveContext, formatContextForPrompt } from "@/lib/guidelines/retrieval";

export const runtime = "nodejs";

const RULES = `You are the Cephra Guideline Assistant, a clinical reference tool for headache specialists. You answer questions using ONLY the guideline and evidence content provided below.

STRICT RULES — follow these exactly:
1. Answer ONLY from the provided Guideline Content. This is your primary and authoritative source. Use it freely to answer questions, suggest management approaches, and support clinical decisions.
2. If the guidelines do not contain the answer but the Evidence Content does, you may mention that relevant evidence exists. You MUST clearly label it: "Current Evidence (not for direct clinical decision-making): ..." and present it as reference material only.
3. NEVER present evidence content as a recommendation, suggestion, or management instruction. Evidence is context only, never instruction.
4. If BOTH the guidelines and the evidence lack relevant information, say so honestly. State that the question is not covered by the currently uploaded guidelines and evidence. Do NOT use general medical knowledge or fabricate an answer.
5. Always cite which guideline or evidence document your answer comes from, using the document title.
6. Do NOT access, reference, or infer any patient data. You answer general clinical questions only.
7. Keep answers concise and clinically focused.
8. Never fabricate guidelines that do not exist in the provided content.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { ok: false, error: "No messages provided." },
      { status: 400 },
    );
  }

  // Use the latest user message for retrieval
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMessage) {
    return NextResponse.json(
      { ok: false, error: "No user message found." },
      { status: 400 },
    );
  }

  try {
    // Retrieve relevant context from guidelines and evidence
    const retrieval = retrieveContext(lastUserMessage.content);
    const { guidelineBlock, evidenceBlock, guidelineSources, evidenceSources } =
      formatContextForPrompt(retrieval);

    // Assemble the system prompt with retrieved context
    const systemPrompt = `${RULES}

=== GUIDELINE CONTENT (Authoritative Clinical Source) ===

${guidelineBlock}

=== EVIDENCE CONTENT (Reference Only — NOT for direct clinical decision-making) ===

${evidenceBlock}`;

    // Keep conversation history to a reasonable size (last 20 messages)
    const conversationMessages = messages.slice(-20).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationMessages,
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({
      ok: true,
      reply,
      sources: {
        guidelines: guidelineSources,
        evidence: evidenceSources,
      },
    });
  } catch (err: unknown) {
    console.error("[guideline-chat] OpenAI error:", err);

    const status =
      err && typeof err === "object" && "status" in err
        ? (err as { status: number }).status
        : 500;

    let message = "Chat failed. Please try again.";
    if (status === 429) {
      message = "OpenAI quota exceeded. Please try again later.";
    }

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

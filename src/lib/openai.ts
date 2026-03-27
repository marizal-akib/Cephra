import OpenAI from "openai";

// Server-side only — OPENAI_API_KEY is read from process.env automatically
export const openai = new OpenAI();

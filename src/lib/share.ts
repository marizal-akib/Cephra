// Pure helpers for sharing the patient questionnaire link.
// No React imports. SSR-safe (browser-only APIs are always wrapped in functions).

// ---------------------------------------------------------------------------
// Capability detection
// ---------------------------------------------------------------------------

export function canUseWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export function canUseClipboard(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard !== "undefined" &&
    typeof navigator.clipboard.writeText === "function"
  );
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function isValidEmail(raw: string): boolean {
  if (!raw) return false;
  // Permissive: anything@anything.anything with no whitespace.
  return /^\S+@\S+\.\S+$/.test(raw.trim());
}

export type ContactKind =
  | { kind: "email"; value: string }
  | { kind: "phone"; value: string }
  | { kind: "invalid"; value: string }
  | { kind: "none" };

export function detectContactKind(contact: string | null): ContactKind {
  if (!contact) return { kind: "none" };
  const trimmed = contact.trim();
  if (!trimmed) return { kind: "none" };
  if (trimmed.includes("@")) {
    return isValidEmail(trimmed)
      ? { kind: "email", value: trimmed }
      : { kind: "invalid", value: trimmed };
  }
  if (/\d/.test(trimmed)) return { kind: "phone", value: trimmed };
  return { kind: "invalid", value: trimmed };
}

// ---------------------------------------------------------------------------
// Message templates
// ---------------------------------------------------------------------------

export function buildShareSubject(): string {
  return "Your Cephra Questionnaire Link";
}

export function buildEmailBody({
  patientName,
  url,
}: {
  patientName: string;
  url: string;
}): string {
  const firstName = patientName.split(" ")[0] || patientName;
  return [
    `Hello ${firstName},`,
    "",
    "Please complete your headache questionnaire before your appointment using this secure link:",
    "",
    url,
    "",
    "This link is single-use and expires in 72 hours. If you have any issues opening it, please contact the clinic.",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// URL builders — every value is encoded individually so special chars
// (spaces, &, =, #, etc.) cannot break the resulting URL.
// ---------------------------------------------------------------------------

const enc = encodeURIComponent;

export function buildMailtoUrl({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): string {
  const recipient = to ? enc(to) : "";
  return `mailto:${recipient}?subject=${enc(subject)}&body=${enc(body)}`;
}

export function buildGmailComposeUrl({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): string {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    su: subject,
    body,
  });
  if (to) params.set("to", to);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function buildOutlookComposeUrl({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): string {
  const params = new URLSearchParams({ subject, body });
  if (to) params.set("to", to);
  return `https://outlook.office.com/mail/deeplink/compose?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Web Share API wrapper
// ---------------------------------------------------------------------------

export type SystemShareResult = "shared" | "aborted" | "unsupported" | "error";

export async function triggerSystemShare({
  title,
  text,
  url,
}: {
  title: string;
  text: string;
  url: string;
}): Promise<SystemShareResult> {
  if (!canUseWebShare()) return "unsupported";
  try {
    await navigator.share({ title, text, url });
    return "shared";
  } catch (err) {
    // User cancelling shows up as DOMException with name "AbortError".
    if (err instanceof DOMException && err.name === "AbortError") return "aborted";
    return "error";
  }
}

// ---------------------------------------------------------------------------
// Clipboard helper with execCommand fallback for insecure contexts
// ---------------------------------------------------------------------------

export async function writeToClipboard(value: string): Promise<boolean> {
  if (canUseClipboard()) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to legacy fallback below.
    }
  }
  if (typeof document === "undefined") return false;
  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

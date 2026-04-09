"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  Mail,
  Printer,
  QrCode,
  Share2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  buildEmailBody,
  buildGmailComposeUrl,
  buildMailtoUrl,
  buildOutlookComposeUrl,
  buildShareSubject,
  canUseWebShare,
  isValidEmail,
  triggerSystemShare,
  writeToClipboard,
} from "@/lib/share";

// ---------------------------------------------------------------------------
// Shared sheet body shell — drag handle + safe-area padding + responsive width
// ---------------------------------------------------------------------------

const sheetContentClass = cn(
  "border-t-0 gap-0 p-0 rounded-t-2xl",
  "pb-[calc(env(safe-area-inset-bottom)+0.75rem)]",
  "sm:max-w-md sm:mx-auto sm:mb-6 sm:rounded-2xl sm:border sm:shadow-2xl",
);

function DragHandle() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto mt-2 mb-1 h-1.5 w-10 rounded-full bg-muted-foreground/30"
    />
  );
}

// ---------------------------------------------------------------------------
// ShareTargetTile — iOS-style icon-over-label tile
// ---------------------------------------------------------------------------

type ShareTargetTileProps = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  hint?: string;
  tone?: "default" | "primary";
};

function ShareTargetTile({
  label,
  icon: Icon,
  onClick,
  disabled,
  hint,
  tone = "default",
}: ShareTargetTileProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      title={hint ?? label}
      className={cn(
        "flex w-[76px] shrink-0 flex-col items-center gap-1.5",
        "rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-40",
      )}
    >
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl transition-transform",
          "active:scale-95",
          tone === "primary"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground",
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <span className="text-center text-[11px] font-medium leading-tight">
        {label}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// EmailShareSheet — multi-channel email picker (the actual fix for the bug)
// ---------------------------------------------------------------------------

type EmailShareSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail: string | null;
  url: string;
  patientName: string;
};

function EmailShareSheet({
  open,
  onOpenChange,
  initialEmail,
  url,
  patientName,
}: EmailShareSheetProps) {
  // Recipient is initialised from `initialEmail` once. If the parent changes
  // patient (e.g. flow restarted), it remounts this sheet via a `key` prop on
  // the JSX, which resets state cleanly without a state-in-effect.
  const [recipient, setRecipient] = useState(initialEmail ?? "");

  const subject = buildShareSubject();
  const body = buildEmailBody({ patientName, url });

  const recipientError =
    recipient.length > 0 && !isValidEmail(recipient)
      ? "That doesn't look like a valid email address."
      : null;

  function openInNewTab(href: string, channelLabel: string) {
    const win = window.open(href, "_blank", "noopener,noreferrer");
    if (!win) {
      toast.error("Pop-up blocked — please allow pop-ups for this site");
      return;
    }
    toast.info(`Opening ${channelLabel} — remember to press Send`);
  }

  function handleMailto() {
    const href = buildMailtoUrl({ to: recipient, subject, body });
    window.location.href = href;
    toast.info("Opening your mail app — remember to press Send");
  }

  function handleGmail() {
    openInNewTab(
      buildGmailComposeUrl({ to: recipient, subject, body }),
      "Gmail",
    );
  }

  function handleOutlook() {
    openInNewTab(
      buildOutlookComposeUrl({ to: recipient, subject, body }),
      "Outlook",
    );
  }

  async function handleCopyBody() {
    const lines = [
      recipient ? `To: ${recipient}` : "To: ",
      `Subject: ${subject}`,
      "",
      body,
    ];
    const ok = await writeToClipboard(lines.join("\n"));
    if (ok) toast.success("Email content copied");
    else toast.error("Could not copy — please copy manually");
  }

  const rows: Array<{
    key: string;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  }> = [
    {
      key: "mailto",
      label: "Open default mail app",
      description: "Uses whichever email app your computer is set up with.",
      icon: Mail,
      onClick: handleMailto,
    },
    {
      key: "gmail",
      label: "Open in Gmail",
      description: "Opens a prefilled draft in Gmail web.",
      icon: Mail,
      onClick: handleGmail,
    },
    {
      key: "outlook",
      label: "Open in Outlook (work)",
      description: "Opens a prefilled draft in Outlook on the web.",
      icon: Mail,
      onClick: handleOutlook,
    },
    {
      key: "copy",
      label: "Copy email body",
      description: "Paste it into any email client manually.",
      icon: Copy,
      onClick: handleCopyBody,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={sheetContentClass}
      >
        <DragHandle />

        <div className="flex items-center gap-2 px-3 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Back"
            onClick={() => onOpenChange(false)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <SheetHeader className="px-5 pt-1 pb-3 text-left">
          <SheetTitle>Send by Email</SheetTitle>
          <SheetDescription>
            Choose how you want to send this to {patientName}.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-1 px-5 pb-3">
          <Label htmlFor="share-email-recipient">To</Label>
          <Input
            id="share-email-recipient"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="patient@email.com"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            aria-invalid={!!recipientError}
            aria-describedby={
              recipientError ? "share-email-recipient-error" : undefined
            }
          />
          {recipientError && (
            <p
              id="share-email-recipient-error"
              role="alert"
              aria-live="polite"
              className="text-xs text-destructive"
            >
              {recipientError}
            </p>
          )}
        </div>

        <div className="mx-5 mb-3 overflow-hidden rounded-xl border bg-card">
          <ul className="divide-y">
            {rows.map((row) => (
              <li key={row.key}>
                <button
                  type="button"
                  onClick={row.onClick}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <row.icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">
                      {row.label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {row.description}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p className="px-5 pb-3 text-xs text-muted-foreground">
          Tip: After your mail app opens, remember to press <strong>Send</strong>.
          Some browsers open a draft but never deliver it until you click Send.
        </p>

        <div className="px-5 pb-3">
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// QrCodeSheet — in-clinic scan
// ---------------------------------------------------------------------------

type QrCodeSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  patientName: string;
};

export function QrCodeSheet({
  open,
  onOpenChange,
  url,
  patientName,
}: QrCodeSheetProps) {
  async function handleCopy() {
    const ok = await writeToClipboard(url);
    if (ok) toast.success("Link copied");
    else toast.error("Could not copy — please copy manually");
  }

  function handlePrint() {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // The existing global @media print rule hides dialogs and sheets, so the
    // QR inside the sheet wouldn't print. Instead we materialise a temporary
    // print-only node directly under <body>, flip a sentinel class so the
    // override CSS in globals.css kicks in, and clean up after the print.
    const PRINT_ID = "cephra-print-share";
    const BODY_CLASS = "cephra-printing-share";

    document.getElementById(PRINT_ID)?.remove();

    const container = document.createElement("div");
    container.id = PRINT_ID;
    container.style.padding = "48px";
    container.style.fontFamily =
      "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif";

    const heading = document.createElement("h1");
    heading.textContent = "Cephra Questionnaire";
    heading.style.fontSize = "20px";
    heading.style.margin = "0 0 4px";

    const subheading = document.createElement("p");
    subheading.textContent = patientName;
    subheading.style.margin = "0 0 24px";
    subheading.style.fontSize = "14px";
    subheading.style.color = "#444";

    const qrWrap = document.createElement("div");
    qrWrap.style.display = "flex";
    qrWrap.style.justifyContent = "center";
    qrWrap.style.padding = "24px";
    qrWrap.style.background = "#fff";

    // Clone the visible QR SVG so we don't depend on QR re-rendering.
    const liveQr = document
      .querySelector<HTMLElement>('[data-print-target]')
      ?.querySelector("svg");
    if (liveQr) {
      const clonedSvg = liveQr.cloneNode(true) as SVGElement;
      clonedSvg.setAttribute("width", "320");
      clonedSvg.setAttribute("height", "320");
      qrWrap.appendChild(clonedSvg);
    }

    const linkText = document.createElement("p");
    linkText.textContent = url;
    linkText.style.margin = "24px 0 0";
    linkText.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
    linkText.style.fontSize = "11px";
    linkText.style.wordBreak = "break-all";
    linkText.style.textAlign = "center";

    const tip = document.createElement("p");
    tip.textContent =
      "Scan with your phone camera to open the secure questionnaire. The link expires in 72 hours.";
    tip.style.marginTop = "16px";
    tip.style.fontSize = "12px";
    tip.style.color = "#555";
    tip.style.textAlign = "center";

    container.append(heading, subheading, qrWrap, linkText, tip);
    document.body.appendChild(container);
    document.body.classList.add(BODY_CLASS);

    const cleanup = () => {
      document.body.classList.remove(BODY_CLASS);
      container.remove();
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);

    // Give the browser a tick to apply the class before invoking print().
    window.setTimeout(() => window.print(), 50);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={sheetContentClass}
      >
        <DragHandle />

        <SheetHeader className="px-5 pt-1 pb-3 text-left">
          <SheetTitle>Scan to open questionnaire</SheetTitle>
          <SheetDescription>{patientName}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col items-center gap-4 px-5 pb-4">
          <div
            data-print-target
            className="rounded-2xl border bg-white p-4 shadow-sm"
          >
            <QRCodeSVG
              value={url}
              size={224}
              level="M"
              bgColor="#ffffff"
              fgColor="#1d1d1f"
              role="img"
              aria-label={`QR code linking to ${patientName}'s questionnaire`}
            />
            <p className="mt-3 max-w-[224px] break-all text-center font-mono text-[10px] text-muted-foreground">
              {url}
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Have the patient open their phone camera and point it at the code.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 px-5 pb-3">
          <Button type="button" variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>

        <div className="px-5 pb-3">
          <Button
            type="button"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// ShareQuestionnaireSheet — main bottom sheet
// ---------------------------------------------------------------------------

type ShareQuestionnaireSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionnaireUrl: string;
  patientName: string;
  patientEmail: string | null;
};

export function ShareQuestionnaireSheet({
  open,
  onOpenChange,
  questionnaireUrl,
  patientName,
  patientEmail,
}: ShareQuestionnaireSheetProps) {
  const [emailOpen, setEmailOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const webShareSupported = useMemo(() => canUseWebShare(), []);

  // Closing the parent sheet must also close any open sub-sheet. We do this
  // synchronously in the change handler instead of via useEffect so we don't
  // trigger a state-in-effect cascade.
  function handleParentOpenChange(next: boolean) {
    if (!next) {
      setEmailOpen(false);
      setQrOpen(false);
    }
    onOpenChange(next);
  }

  async function handleCopyLink() {
    const ok = await writeToClipboard(questionnaireUrl);
    if (ok) {
      toast.success("Link copied");
      onOpenChange(false);
    } else {
      toast.error("Could not copy — please copy manually");
    }
  }

  function handlePreview() {
    const win = window.open(questionnaireUrl, "_blank", "noopener,noreferrer");
    if (!win) {
      toast.error("Pop-up blocked — please allow pop-ups for this site");
      return;
    }
    onOpenChange(false);
  }

  async function handleSystemShare() {
    const result = await triggerSystemShare({
      title: "Cephra Questionnaire",
      text: `Headache questionnaire for ${patientName}`,
      url: questionnaireUrl,
    });
    if (result === "shared") {
      toast.success("Shared");
      onOpenChange(false);
    } else if (result === "error") {
      toast.error("Sharing failed");
    }
    // "aborted" and "unsupported" are silent.
  }

  return (
    <>
      <Sheet open={open} onOpenChange={handleParentOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className={sheetContentClass}
        >
          <DragHandle />

          <SheetHeader className="px-5 pt-1 pb-3 text-left">
            <SheetTitle>Share Questionnaire</SheetTitle>
            <SheetDescription>{patientName}</SheetDescription>
          </SheetHeader>

          <div className="mx-5 mb-4 rounded-xl border bg-muted/40 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Link
            </p>
            <p className="mt-1 break-all font-mono text-xs">
              {questionnaireUrl}
            </p>
          </div>

          <div className="-mx-1 overflow-x-auto px-5 pb-1">
            <div className="flex gap-3 pb-2">
              <ShareTargetTile
                label="Copy Link"
                icon={Copy}
                onClick={handleCopyLink}
              />
              <ShareTargetTile
                label="Email"
                icon={Mail}
                onClick={() => setEmailOpen(true)}
              />
              <ShareTargetTile
                label="QR Code"
                icon={QrCode}
                onClick={() => setQrOpen(true)}
              />
              <ShareTargetTile
                label="Preview"
                icon={Eye}
                onClick={handlePreview}
              />
              {webShareSupported && (
                <ShareTargetTile
                  label="Share"
                  icon={Share2}
                  tone="primary"
                  onClick={handleSystemShare}
                />
              )}
            </div>
          </div>

          <Separator className="my-3" />

          <div className="px-5 pb-3">
            <p className="mb-3 text-xs text-muted-foreground">
              The link is single-use and expires in 72 hours.
            </p>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <EmailShareSheet
        key={patientEmail ?? "no-email"}
        open={emailOpen}
        onOpenChange={setEmailOpen}
        initialEmail={patientEmail}
        url={questionnaireUrl}
        patientName={patientName}
      />

      <QrCodeSheet
        open={qrOpen}
        onOpenChange={setQrOpen}
        url={questionnaireUrl}
        patientName={patientName}
      />
    </>
  );
}

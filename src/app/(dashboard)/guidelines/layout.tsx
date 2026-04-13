"use client";

import { useState } from "react";
import { GuidelineChatButton } from "@/components/guidelines/guideline-chat-button";
import { GuidelineChatPanel } from "@/components/guidelines/guideline-chat-panel";

export default function GuidelinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      {children}
      <GuidelineChatButton
        onClick={() => setChatOpen(true)}
        isOpen={chatOpen}
      />
      <GuidelineChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
}

"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GuidelineChatButton({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  if (isOpen) return null;

  return (
    <Button
      type="button"
      variant="default"
      onClick={onClick}
      className="fixed bottom-6 right-8 z-50 h-11 gap-2 rounded-full px-5 shadow-lg transition-transform hover:scale-105 active:scale-95 md:px-5"
      title="Ask the Guideline Assistant"
    >
      <MessageCircle className="h-4.5 w-4.5" />
      <span className="hidden text-sm font-medium sm:inline">
        Ask Guidelines
      </span>
    </Button>
  );
}

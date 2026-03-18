import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cephra - Structured Headache Evaluation",
  description:
    "A clinician-focused workflow for headache intake, assessment, and note generation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cephra - Headache Evaluation Tool",
  description: "Clinician-facing headache evaluation and decision support",
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

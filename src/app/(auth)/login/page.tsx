"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, MailCheck } from "lucide-react";

const CALLBACK_ERRORS: Record<string, string> = {
  missing_code: "The sign-in link is invalid or has expired. Please try again.",
  invalid_code: "The sign-in link could not be verified. Please request a new one.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  const callbackError = searchParams.get("error");
  const callbackErrorMessage = callbackError
    ? CALLBACK_ERRORS[callbackError] ?? null
    : null;
  const activeError = error ?? callbackErrorMessage;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    let landingPath = "/dashboard";
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile?.role === "admin") {
          landingPath = "/admin";
        }
      }
    } catch {
      // Fall back to doctor dashboard when role lookup fails
    }

    router.push(landingPath);
    router.refresh();
  }

  async function handleMagicLink() {
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Enter your email to receive a magic link.");
      return;
    }

    setMagicLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });
    setMagicLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Magic link sent. Check your inbox to continue sign in.");
  }

  return (
    <Card className="w-full max-w-sm border-slate-200 shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Cephra
        </p>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Clinician Sign In
        </CardTitle>
        <CardDescription>
          Secure access to headache assessment workflows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {activeError ? (
            <p className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              {activeError}
            </p>
          ) : null}

          {message ? (
            <p className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <MailCheck className="h-4 w-4" />
              {message}
            </p>
          ) : null}

          <Button type="submit" className="h-10 w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-4 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full"
            onClick={handleMagicLink}
            disabled={magicLoading}
          >
            {magicLoading ? "Sending magic link..." : "Sign in with magic link"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Card className="w-full max-w-sm border-slate-200 shadow-sm">
        <CardHeader className="space-y-2 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Cephra</p>
          <CardTitle className="text-2xl font-semibold tracking-tight">Clinician Sign In</CardTitle>
        </CardHeader>
      </Card>
    }>
      <LoginForm />
    </Suspense>
  );
}

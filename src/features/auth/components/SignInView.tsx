"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/constants/navigation";
import { DEMO_USER_EMAIL, DEMO_USER_PASSWORD } from "@/constants/auth";
import { apiPost, ApiError } from "@/lib/api/client";
import type { PublicUser } from "@/types/user";
import { cn } from "@/lib/utils/cn";

export function SignInView() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_USER_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      await apiPost<PublicUser>("/api/auth/sign-in", { email, password });
      router.replace("/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Could not sign in.");
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-12">
      <p className="font-display text-h2 text-foreground">{APP_NAME}</p>
      <h1 className="mt-2 font-display text-h1 text-foreground">Sign in</h1>
      <p className="mt-2 text-caption text-foreground-secondary">
        Identity &amp; Access for this local workspace. Your session is stored in an httpOnly
        cookie and tied to persisted projects, content, and assets.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-caption font-medium text-foreground-secondary">Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-control border border-border bg-background px-3 py-2 text-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-caption font-medium text-foreground-secondary">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-control border border-border bg-background px-3 py-2 text-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        {error ? <p className="text-caption text-danger">{error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className={cn(
            "rounded-control bg-primary px-4 py-2.5 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover",
            pending && "cursor-not-allowed opacity-60",
          )}
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-6 rounded-control border border-border bg-surface px-4 py-3 text-caption text-foreground-secondary">
        <p className="font-medium text-foreground">Local demo account</p>
        <p className="mt-1">
          {DEMO_USER_EMAIL} · password <span className="font-mono text-foreground">{DEMO_USER_PASSWORD}</span>
        </p>
        <p className="mt-1 text-foreground-muted">
          Owns the seeded GitaVerse demo workspace. Create a new account for an empty workspace.
        </p>
      </div>

      <p className="mt-6 text-caption text-foreground-secondary">
        No account yet?{" "}
        <Link href="/sign-up" className="font-medium text-gold hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

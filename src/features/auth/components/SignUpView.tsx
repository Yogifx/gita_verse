"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/constants/navigation";
import { MIN_PASSWORD_LENGTH } from "@/constants/auth";
import { apiPost, ApiError } from "@/lib/api/client";
import type { PublicUser } from "@/types/user";
import { cn } from "@/lib/utils/cn";

export function SignUpView() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    try {
      await apiPost<PublicUser>("/api/auth/sign-up", { email, password, displayName });
      router.replace("/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Could not create the account.");
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-12">
      <p className="font-display text-h2 text-foreground">{APP_NAME}</p>
      <h1 className="mt-2 font-display text-h1 text-foreground">Create account</h1>
      <p className="mt-2 text-caption text-foreground-secondary">
        Your account is stored in the local GitaVerse workspace file. New accounts start with an
        empty project library — seed content belongs to the demo account.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-caption font-medium text-foreground-secondary">Display name</span>
          <input
            type="text"
            autoComplete="name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="How you appear in the workspace"
            className="rounded-control border border-border bg-background px-3 py-2 text-body text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

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
          <span className="text-caption font-medium text-foreground-secondary">
            Password <span className="text-foreground-muted">(min {MIN_PASSWORD_LENGTH})</span>
          </span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-control border border-border bg-background px-3 py-2 text-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-caption font-medium text-foreground-secondary">Confirm password</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
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
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-caption text-foreground-secondary">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-gold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

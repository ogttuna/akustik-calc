"use client";

import { useState } from "react";

type LoginFormProps = {
  authConfigured: boolean;
  configurationMessage: string | null;
  nextPath: string;
};

type LoginResponse = {
  error?: string;
  ok?: boolean;
  redirectTo?: string;
};

function readErrorMessage(payload: unknown) {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const candidate = payload as LoginResponse;
  return typeof candidate.error === "string" ? candidate.error : null;
}

function readRedirectTarget(payload: unknown) {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const candidate = payload as LoginResponse;
  return typeof candidate.redirectTo === "string" ? candidate.redirectTo : null;
}

export function LoginForm({ authConfigured, configurationMessage, nextPath }: LoginFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(configurationMessage);
  const [isPending, setIsPending] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authConfigured || isPending) {
      return;
    }

    setIsPending(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({
          nextPath,
          password,
          username
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      });

      const payload = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        setErrorMessage(readErrorMessage(payload) ?? "Sign-in failed.");
        return;
      }

      window.location.assign(readRedirectTarget(payload) ?? nextPath);
    } catch {
      setErrorMessage("DynEcho could not reach the sign-in route.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-[color:var(--ink)]">Username</span>
        <input
          autoComplete="username"
          className="focus-ring rounded-[1rem] border hairline bg-white px-4 py-3 text-sm text-[color:var(--ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] outline-none disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!authConfigured || isPending}
          name="username"
          onChange={(event) => setUsername(event.target.value)}
          required
          type="text"
          value={username}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-[color:var(--ink)]">Password</span>
        <input
          autoComplete="current-password"
          className="focus-ring rounded-[1rem] border hairline bg-white px-4 py-3 text-sm text-[color:var(--ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] outline-none disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!authConfigured || isPending}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>

      {errorMessage ? (
        <div className="rounded-[1rem] border border-amber-950/12 bg-amber-100/80 px-4 py-3 text-sm leading-6 text-amber-950">
          {errorMessage}
        </div>
      ) : null}

      <button
        className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-55"
        disabled={!authConfigured || isPending}
        type="submit"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

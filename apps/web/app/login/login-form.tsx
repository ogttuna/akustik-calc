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
      setErrorMessage("DAC could not reach the sign-in route.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-[color:var(--text-primary)]">Username</span>
        <input
          autoComplete="username"
          className="focus-ring ui-field min-h-11 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!authConfigured || isPending}
          name="username"
          onChange={(event) => setUsername(event.target.value)}
          required
          type="text"
          value={username}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-[color:var(--text-primary)]">Password</span>
        <input
          autoComplete="current-password"
          className="focus-ring ui-field min-h-11 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!authConfigured || isPending}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>

      {errorMessage ? (
        <div className="ui-warning-panel">{errorMessage}</div>
      ) : null}

      <button
        className="focus-ring ui-button ui-button-primary min-h-11 w-full px-5 py-3 disabled:cursor-not-allowed disabled:opacity-55"
        disabled={!authConfigured || isPending}
        type="submit"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

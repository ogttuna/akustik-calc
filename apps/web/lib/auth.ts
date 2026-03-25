import { Buffer } from "node:buffer";
import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const AUTH_COOKIE_NAME = "dynecho-auth-session";
export const PUBLIC_PREVIEW_USERNAME = "Preview mode";

const DEFAULT_SESSION_TTL_HOURS = 12;

type EnabledAuthConfig = {
  configured: true;
  password: string;
  secret: string;
  sessionTtlMs: number;
  username: string;
};

type DisabledAuthConfig = {
  configured: false;
  missingKeys: string[];
};

export type AuthConfig = EnabledAuthConfig | DisabledAuthConfig;

export type AuthSession = {
  expiresAt: number;
  username: string;
};

type SessionPayload = {
  exp: number;
  usr: string;
};

function base64UrlEncode(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const remainder = normalized.length % 4;
  const padding = remainder === 0 ? "" : "=".repeat(4 - remainder);

  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signPayload(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function parseSessionPayload(value: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(base64UrlDecode(value)) as unknown;

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const candidate = parsed as Partial<SessionPayload>;

    if (typeof candidate.usr !== "string" || typeof candidate.exp !== "number" || !Number.isFinite(candidate.exp)) {
      return null;
    }

    return {
      exp: candidate.exp,
      usr: candidate.usr
    };
  } catch {
    return null;
  }
}

function getConfiguredValue(name: string) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

function getSessionTtlMs() {
  const rawValue = process.env.DYNECHO_AUTH_SESSION_TTL_HOURS?.trim();
  const parsedHours = rawValue ? Number.parseFloat(rawValue) : DEFAULT_SESSION_TTL_HOURS;

  if (!Number.isFinite(parsedHours) || parsedHours <= 0) {
    return DEFAULT_SESSION_TTL_HOURS * 60 * 60 * 1000;
  }

  return parsedHours * 60 * 60 * 1000;
}

export function getAuthConfig(): AuthConfig {
  const username = getConfiguredValue("DYNECHO_AUTH_USERNAME");
  const password = getConfiguredValue("DYNECHO_AUTH_PASSWORD");
  const secret = getConfiguredValue("DYNECHO_AUTH_SECRET");

  if (!username || !password || !secret) {
    return {
      configured: false,
      missingKeys: [
        !username ? "DYNECHO_AUTH_USERNAME" : null,
        !password ? "DYNECHO_AUTH_PASSWORD" : null,
        !secret ? "DYNECHO_AUTH_SECRET" : null
      ].filter((value): value is string => value !== null)
    };
  }

  return {
    configured: true,
    password: password!,
    secret: secret!,
    sessionTtlMs: getSessionTtlMs(),
    username: username!
  };
}

export function buildAuthConfigurationErrorMessage(missingKeys: string[]) {
  return `Authentication is not configured. Set ${missingKeys.join(", ")}.`;
}

export function normalizeNextPath(value: string | null | undefined) {
  if (typeof value !== "string") {
    return "/workbench";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/workbench";
  }

  return value;
}

export function createSessionCookieValue(config: EnabledAuthConfig, username: string, expiresAt: number) {
  const payload = base64UrlEncode(JSON.stringify({ exp: expiresAt, usr: username }));
  const signature = signPayload(payload, config.secret);
  return `${payload}.${signature}`;
}

export function readSessionCookieValue(config: EnabledAuthConfig, cookieValue: string | undefined): AuthSession | null {
  if (!cookieValue) {
    return null;
  }

  const separatorIndex = cookieValue.lastIndexOf(".");

  if (separatorIndex <= 0 || separatorIndex === cookieValue.length - 1) {
    return null;
  }

  const encodedPayload = cookieValue.slice(0, separatorIndex);
  const signature = cookieValue.slice(separatorIndex + 1);
  const expectedSignature = signPayload(encodedPayload, config.secret);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  const payload = parseSessionPayload(encodedPayload);

  if (!payload || payload.exp <= Date.now() || !safeEqual(payload.usr, config.username)) {
    return null;
  }

  return {
    expiresAt: payload.exp,
    username: payload.usr
  };
}

export async function getAuthState(): Promise<
  | {
      configured: false;
      missingKeys: string[];
      session: AuthSession;
    }
  | {
      configured: true;
      session: AuthSession | null;
    }
> {
  const config = getAuthConfig();

  if (!config.configured) {
    return {
      configured: false,
      missingKeys: config.missingKeys,
      session: {
        expiresAt: Number.MAX_SAFE_INTEGER,
        username: PUBLIC_PREVIEW_USERNAME
      }
    };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  return {
    configured: true,
    session: readSessionCookieValue(config, sessionCookie)
  };
}

export async function requireAuthenticatedPage(nextPath: string) {
  const authState = await getAuthState();
  const normalizedNextPath = normalizeNextPath(nextPath);

  if (!authState.configured) {
    return authState.session;
  }

  if (!authState.session) {
    redirect(`/login?next=${encodeURIComponent(normalizedNextPath)}`);
  }

  return authState.session;
}

export function validateLoginCredentials(username: string, password: string) {
  const config = getAuthConfig();

  if (!config.configured) {
    return {
      configured: false,
      missingKeys: config.missingKeys,
      valid: false
    } as const;
  }

  return {
    configured: true,
    config,
    valid: safeEqual(username, config.username) && safeEqual(password, config.password)
  } as const;
}

export function applySessionCookie(response: {
  cookies: {
    set: (options: {
      expires: Date;
      httpOnly: boolean;
      name: string;
      path: string;
      sameSite: "lax";
      secure: boolean;
      value: string;
    }) => void;
  };
}, config: EnabledAuthConfig, username: string) {
  const expiresAt = Date.now() + config.sessionTtlMs;

  response.cookies.set({
    expires: new Date(expiresAt),
    httpOnly: true,
    name: AUTH_COOKIE_NAME,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    value: createSessionCookieValue(config, username, expiresAt)
  });
}

export function clearSessionCookie(response: {
  cookies: {
    set: (options: {
      expires: Date;
      httpOnly: boolean;
      name: string;
      path: string;
      sameSite: "lax";
      secure: boolean;
      value: string;
    }) => void;
  };
}) {
  response.cookies.set({
    expires: new Date(0),
    httpOnly: true,
    name: AUTH_COOKIE_NAME,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    value: ""
  });
}

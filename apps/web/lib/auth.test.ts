import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { AuthConfig } from "./auth";
import {
  AUTH_COOKIE_NAME,
  PUBLIC_PREVIEW_USERNAME,
  buildAuthConfigurationErrorMessage,
  createSessionCookieValue,
  getAuthConfig,
  getAuthState,
  normalizeNextPath,
  readSessionCookieValue,
  validateLoginCredentials
} from "./auth";

const mockSessionCookie = vi.hoisted(() => ({
  value: undefined as string | undefined
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: (name: string) => {
      if (name !== "dynecho-auth-session" || !mockSessionCookie.value) {
        return undefined;
      }

      return {
        name,
        value: mockSessionCookie.value
      };
    }
  }))
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  })
}));

type EnabledAuthConfig = Extract<AuthConfig, { configured: true }>;

const AUTH_ENV_KEYS = [
  "DYNECHO_AUTH_USERNAME",
  "DYNECHO_AUTH_PASSWORD",
  "DYNECHO_AUTH_SECRET",
  "DYNECHO_AUTH_SESSION_TTL_HOURS",
  "NODE_ENV"
] as const;

let originalEnv: Record<string, string | undefined>;

function clearAuthEnv() {
  for (const key of AUTH_ENV_KEYS) {
    delete process.env[key];
  }
}

function configureAuth(input?: {
  password?: string;
  secret?: string;
  ttlHours?: string;
  username?: string;
}) {
  process.env.DYNECHO_AUTH_USERNAME = input?.username ?? "alice@example.com";
  process.env.DYNECHO_AUTH_PASSWORD = input?.password ?? "correct-password";
  process.env.DYNECHO_AUTH_SECRET = input?.secret ?? "auth-test-secret-with-enough-entropy";

  if (input?.ttlHours !== undefined) {
    process.env.DYNECHO_AUTH_SESSION_TTL_HOURS = input.ttlHours;
  }
}

function getEnabledConfig(): EnabledAuthConfig {
  const config = getAuthConfig();

  if (!config.configured) {
    throw new Error("Expected auth to be configured.");
  }

  return config;
}

beforeEach(() => {
  originalEnv = Object.fromEntries(AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const));
  clearAuthEnv();
  mockSessionCookie.value = undefined;
});

afterEach(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  mockSessionCookie.value = undefined;
});

describe("auth session helpers", () => {
  it("detects preview-mode auth configuration and returns the preview session", async () => {
    const config = getAuthConfig();

    expect(config).toEqual({
      configured: false,
      missingKeys: ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"]
    });
    expect(buildAuthConfigurationErrorMessage(["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_SECRET"])).toBe(
      "Authentication is not configured. Set DYNECHO_AUTH_USERNAME, DYNECHO_AUTH_SECRET."
    );

    const authState = await getAuthState();

    expect(authState).toEqual({
      configured: false,
      missingKeys: ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"],
      session: {
        expiresAt: Number.MAX_SAFE_INTEGER,
        username: PUBLIC_PREVIEW_USERNAME
      }
    });
  });

  it("detects configured auth, validates credentials, and applies the configured TTL", () => {
    configureAuth({
      ttlHours: "1.5"
    });

    const config = getEnabledConfig();

    expect(config).toMatchObject({
      configured: true,
      password: "correct-password",
      secret: "auth-test-secret-with-enough-entropy",
      sessionTtlMs: 1.5 * 60 * 60 * 1000,
      username: "alice@example.com"
    });
    expect(validateLoginCredentials("alice@example.com", "correct-password")).toMatchObject({
      configured: true,
      valid: true
    });
    expect(validateLoginCredentials("alice@example.com", "wrong-password")).toMatchObject({
      configured: true,
      valid: false
    });
  });

  it("falls back to the default session TTL when the configured TTL is invalid", () => {
    configureAuth({
      ttlHours: "-4"
    });

    expect(getEnabledConfig().sessionTtlMs).toBe(12 * 60 * 60 * 1000);

    process.env.DYNECHO_AUTH_SESSION_TTL_HOURS = "not-a-number";

    expect(getEnabledConfig().sessionTtlMs).toBe(12 * 60 * 60 * 1000);
  });

  it("round-trips a valid signed session cookie and lets getAuthState read it", async () => {
    configureAuth();

    const config = getEnabledConfig();
    const expiresAt = Date.now() + 60_000;
    const cookieValue = createSessionCookieValue(config, config.username, expiresAt);

    expect(readSessionCookieValue(config, cookieValue)).toEqual({
      expiresAt,
      username: "alice@example.com"
    });

    mockSessionCookie.value = cookieValue;

    expect(await getAuthState()).toEqual({
      configured: true,
      session: {
        expiresAt,
        username: "alice@example.com"
      }
    });
  });

  it("rejects missing, malformed, tampered, expired, and wrong-user session cookies", () => {
    configureAuth();

    const config = getEnabledConfig();
    const validCookie = createSessionCookieValue(config, config.username, Date.now() + 60_000);
    const [encodedPayload, signature] = validCookie.split(".");

    expect(readSessionCookieValue(config, undefined)).toBeNull();
    expect(readSessionCookieValue(config, "not-a-cookie")).toBeNull();
    expect(readSessionCookieValue(config, `${encodedPayload}.tampered-${signature}`)).toBeNull();
    expect(readSessionCookieValue(config, createSessionCookieValue(config, config.username, Date.now() - 1))).toBeNull();
    expect(readSessionCookieValue(config, createSessionCookieValue(config, "bob@example.com", Date.now() + 60_000))).toBeNull();
  });

  it("normalizes next paths without allowing external redirects", () => {
    expect(normalizeNextPath(undefined)).toBe("/workbench");
    expect(normalizeNextPath(null)).toBe("/workbench");
    expect(normalizeNextPath("workbench")).toBe("/workbench");
    expect(normalizeNextPath("https://example.test/workbench")).toBe("/workbench");
    expect(normalizeNextPath("//example.test/workbench")).toBe("/workbench");
    expect(normalizeNextPath("/workbench?panel=projects")).toBe("/workbench?panel=projects");
    expect(normalizeNextPath("/login")).toBe("/login");
  });

  it("reads configured auth with no session cookie as an unauthenticated configured state", async () => {
    configureAuth();

    expect(await getAuthState()).toEqual({
      configured: true,
      session: null
    });
    expect(AUTH_COOKIE_NAME).toBe("dynecho-auth-session");
  });
});

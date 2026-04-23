import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  AUTH_COOKIE_NAME,
  getAuthConfig,
  readSessionCookieValue,
  type AuthConfig
} from "./auth";

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
  process.env.DYNECHO_AUTH_SECRET = input?.secret ?? "route-test-secret-with-enough-entropy";

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

function jsonRequest(url: string, payload: unknown) {
  return new Request(url, {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

function unreadableJsonRequest(url: string) {
  return new Request(url, {
    body: "{",
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

function getSetCookie(response: Response) {
  const setCookie = response.headers.get("set-cookie");

  if (!setCookie) {
    throw new Error("Expected response to set a cookie.");
  }

  return setCookie;
}

function getSetCookieValue(setCookie: string) {
  const match = setCookie.match(new RegExp(`${AUTH_COOKIE_NAME}=([^;]*)`));

  if (!match) {
    throw new Error("Expected auth session cookie value.");
  }

  return match[1];
}

beforeEach(() => {
  originalEnv = Object.fromEntries(AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const));
  clearAuthEnv();
});

afterEach(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe("auth API routes", () => {
  it("rejects unreadable login JSON payloads", async () => {
    const { POST: login } = await import("../app/api/auth/login/route");

    const response = await login(unreadableJsonRequest("http://localhost/api/auth/login"));
    const body = (await response.json()) as {
      error?: string;
      ok?: boolean;
    };

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "DynEcho could not read the login payload.",
      ok: false
    });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("keeps preview-mode login as a cookie-free pass-through with a safe next path", async () => {
    const { POST: login } = await import("../app/api/auth/login/route");

    const response = await login(
      jsonRequest("http://localhost/api/auth/login", {
        nextPath: "https://evil.example/workbench",
        password: "anything",
        username: "anything"
      })
    );
    const body = (await response.json()) as {
      ok?: boolean;
      redirectTo?: string;
    };

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      redirectTo: "/workbench"
    });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("rejects invalid configured-auth credentials without setting a session cookie", async () => {
    configureAuth();

    const { POST: login } = await import("../app/api/auth/login/route");

    const response = await login(
      jsonRequest("http://localhost/api/auth/login", {
        nextPath: "/workbench",
        password: "wrong-password",
        username: "alice@example.com"
      })
    );
    const body = (await response.json()) as {
      error?: string;
      ok?: boolean;
    };

    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "Invalid username or password.",
      ok: false
    });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("sets a signed secure session cookie on successful configured-auth login", async () => {
    configureAuth({
      ttlHours: "2"
    });
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";

    const { POST: login } = await import("../app/api/auth/login/route");

    const response = await login(
      jsonRequest("http://localhost/api/auth/login", {
        nextPath: "//evil.example/workbench",
        password: "correct-password",
        username: "alice@example.com"
      })
    );
    const body = (await response.json()) as {
      ok?: boolean;
      redirectTo?: string;
    };
    const setCookie = getSetCookie(response);
    const cookieValue = getSetCookieValue(setCookie);
    const session = readSessionCookieValue(getEnabledConfig(), cookieValue);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      redirectTo: "/workbench"
    });
    expect(setCookie).toContain(`${AUTH_COOKIE_NAME}=`);
    expect(setCookie).toContain("Path=/");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=lax");
    expect(setCookie).toContain("Secure");
    expect(session?.username).toBe("alice@example.com");
    expect(session?.expiresAt).toBeGreaterThan(Date.now() + 60 * 60 * 1000);
  });

  it("clears the session cookie and redirects to login on logout", async () => {
    const { POST: logout } = await import("../app/logout/route");

    const response = await logout(new Request("http://localhost/logout", { method: "POST" }));
    const setCookie = getSetCookie(response);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("http://localhost/login");
    expect(setCookie).toContain(`${AUTH_COOKIE_NAME}=;`);
    expect(setCookie).toContain("Path=/");
    expect(setCookie).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=lax");
  });
});

const DEFAULT_BASE_URL = "https://akustikhesap.machinity.ai";
const DEFAULT_AUTH_USERNAME = "admin";
const DEFAULT_AUTH_PASSWORD = "admin";

type PreflightResult = {
  configureHttpStatus: number;
  missingBundleStrings: string[];
  modelReady: boolean;
  mutatingToolsExposed: boolean | null;
  ok: boolean;
  researchReady: boolean;
  rootHttpStatus: number;
  statusHttpStatus: number;
};

const REQUIRED_BUNDLE_STRINGS = [
  "/api/report-assistant/assembly-alternatives",
  "Retry layer research",
  "Add guarded text replacements",
  "Report consistency blocks save/export",
  "replace_report_text_value"
] as const;

function readEnvString(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/u, "");
}

function appendCookie(current: string, setCookieHeaders: readonly string[]): string {
  const nextCookies = setCookieHeaders
    .map((entry) => entry.split(";")[0]?.trim())
    .filter((entry): entry is string => Boolean(entry));
  return [...current.split(";").map((entry) => entry.trim()).filter(Boolean), ...nextCookies].join("; ");
}

function getSetCookieHeaders(headers: Headers): string[] {
  const getSetCookie = (headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  if (typeof getSetCookie === "function") {
    return getSetCookie.call(headers);
  }

  const single = headers.get("set-cookie");
  return single ? [single] : [];
}

async function fetchText(url: string, cookie?: string): Promise<{ status: number; text: string }> {
  const response = await fetch(url, {
    headers: cookie ? { cookie } : undefined,
    redirect: "manual"
  });
  return {
    status: response.status,
    text: await response.text()
  };
}

async function login(baseUrl: string): Promise<{ cookie: string; status: number }> {
  const username = readEnvString("DYNECHO_AUTH_USERNAME", DEFAULT_AUTH_USERNAME);
  const password = readEnvString("DYNECHO_AUTH_PASSWORD", DEFAULT_AUTH_PASSWORD);
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    body: JSON.stringify({
      nextPath: "/workbench",
      password,
      username
    }),
    headers: {
      "content-type": "application/json"
    },
    method: "POST",
    redirect: "manual"
  });

  return {
    cookie: appendCookie("", getSetCookieHeaders(response.headers)),
    status: response.status
  };
}

function extractScriptSources(html: string): string[] {
  return [...html.matchAll(/<script[^>]+src="([^"]+)"/giu)]
    .map((match) => match[1])
    .filter((entry): entry is string => Boolean(entry));
}

async function fetchBundleText(baseUrl: string, html: string): Promise<string> {
  const scripts = extractScriptSources(html);
  const texts = await Promise.all(
    scripts.map(async (source) => {
      const url = source.startsWith("http") ? source : `${baseUrl}${source}`;
      const response = await fetch(url);
      return response.ok ? response.text() : "";
    })
  );
  return texts.join("\n");
}

function parseStatusPayload(text: string): { modelReady: boolean; mutatingToolsExposed: boolean | null; researchReady: boolean } {
  try {
    const payload = JSON.parse(text) as {
      status?: {
        modelProvider?: {
          configured?: unknown;
          readinessWarnings?: unknown;
        };
        mutatingToolsExposed?: unknown;
        researchProvider?: {
          configured?: unknown;
          readinessWarnings?: unknown;
        };
      };
    };
    const status = payload.status;
    const modelWarnings = status?.modelProvider?.readinessWarnings;
    const researchWarnings = status?.researchProvider?.readinessWarnings;

    return {
      modelReady: Boolean(status?.modelProvider?.configured) && Array.isArray(modelWarnings) && modelWarnings.length === 0,
      mutatingToolsExposed: typeof status?.mutatingToolsExposed === "boolean" ? status.mutatingToolsExposed : null,
      researchReady: Boolean(status?.researchProvider?.configured) && Array.isArray(researchWarnings) && researchWarnings.length === 0
    };
  } catch {
    return {
      modelReady: false,
      mutatingToolsExposed: null,
      researchReady: false
    };
  }
}

async function main() {
  const baseUrl = normalizeBaseUrl(readEnvString("AKUSTIK_SMOKE_BASE_URL", DEFAULT_BASE_URL));
  const root = await fetchText(baseUrl);
  const loginResult = await login(baseUrl);
  const status = await fetchText(`${baseUrl}/api/report-assistant/status`, loginResult.cookie);
  const configure = await fetchText(`${baseUrl}/workbench/proposal/configure?style=simple`, loginResult.cookie);
  const bundleText = configure.status === 200 ? await fetchBundleText(baseUrl, configure.text) : "";
  const statusPayload = parseStatusPayload(status.text);
  const missingBundleStrings = REQUIRED_BUNDLE_STRINGS.filter((entry) => !bundleText.includes(entry));
  const result: PreflightResult = {
    configureHttpStatus: configure.status,
    missingBundleStrings,
    modelReady: statusPayload.modelReady,
    mutatingToolsExposed: statusPayload.mutatingToolsExposed,
    ok:
      root.status === 200 &&
      loginResult.status === 200 &&
      status.status === 200 &&
      configure.status === 200 &&
      statusPayload.modelReady &&
      statusPayload.researchReady &&
      statusPayload.mutatingToolsExposed === false &&
      missingBundleStrings.length === 0,
    researchReady: statusPayload.researchReady,
    rootHttpStatus: root.status,
    statusHttpStatus: status.status
  };

  console.log(JSON.stringify({ baseUrl, loginHttpStatus: loginResult.status, result }, null, 2));
  if (!result.ok) {
    process.exit(1);
  }
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[report-assistant-production-preflight] ${message}`);
  process.exit(1);
});

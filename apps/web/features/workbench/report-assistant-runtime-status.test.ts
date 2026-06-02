import { describe, expect, it, vi } from "vitest";

import { getReportAssistantRuntimeStatus } from "./report-assistant-runtime-status";

const mockAuthState = vi.hoisted(() => ({
  value: {
    configured: false,
    missingKeys: [],
    session: {
      expiresAt: Number.MAX_SAFE_INTEGER,
      username: "Preview mode"
    }
  } as
    | {
        configured: false;
        missingKeys: string[];
        session: {
          expiresAt: number;
          username: string;
        };
      }
    | {
        configured: true;
        session: {
          expiresAt: number;
          username: string;
        } | null;
      }
}));

vi.mock("@/lib/auth", () => ({
  getAuthState: vi.fn(async () => mockAuthState.value)
}));

describe("report assistant runtime status", () => {
  it("reports disabled providers and read-only tool definitions by default", () => {
    const status = getReportAssistantRuntimeStatus({
      env: {},
      now: () => new Date("2026-06-02T10:00:00.000Z")
    });

    expect(status).toMatchObject({
      findingsQueuePath: ".dynecho/calculator-review-queue/report-assistant-findings.jsonl",
      generatedAtIso: "2026-06-02T10:00:00.000Z",
      modelProvider: {
        apiKeyConfigured: false,
        configured: false
      },
      mutatingToolsExposed: false,
      researchProvider: {
        configured: false
      }
    });
    expect(status.tools.every((tool) => tool.mutates === false)).toBe(true);
    expect(status.tools.map((tool) => tool.name)).not.toContain("apply_report_patch");
  });

  it("summarizes configured endpoints without exposing query strings or API keys", () => {
    const status = getReportAssistantRuntimeStatus({
      env: {
        DYNECHO_REPORT_ASSISTANT_MODEL: "gemini-proxy-model",
        DYNECHO_REPORT_ASSISTANT_MODEL_API_KEY: "secret-model-key",
        DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT: "http://system_llm:4000/gemini-proxy?token=secret",
        DYNECHO_REPORT_ASSISTANT_MODEL_TIMEOUT_MS: "12345",
        DYNECHO_REPORT_ASSISTANT_RESEARCH_API_KEY: "secret-research-key",
        DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT: "https://research.example.test/search?key=secret"
      },
      now: () => new Date("2026-06-02T10:00:00.000Z")
    });

    expect(status.modelProvider).toMatchObject({
      apiKeyConfigured: true,
      configured: true,
      endpoint: {
        origin: "http://system_llm:4000",
        pathname: "/gemini-proxy"
      },
      model: "gemini-proxy-model",
      timeoutMs: 12345
    });
    expect(status.researchProvider).toMatchObject({
      apiKeyConfigured: true,
      configured: true,
      endpoint: {
        origin: "https://research.example.test",
        pathname: "/search"
      }
    });
    expect(JSON.stringify(status)).not.toContain("secret");
  });

  it("returns route status behind the existing auth guard", async () => {
    const { GET } = await import("../../app/api/report-assistant/status/route");

    mockAuthState.value = {
      configured: true,
      session: null
    };
    const rejected = await GET();
    expect(rejected.status).toBe(401);

    mockAuthState.value = {
      configured: false,
      missingKeys: [],
      session: {
        expiresAt: Number.MAX_SAFE_INTEGER,
        username: "Preview mode"
      }
    };
    const accepted = await GET();
    const payload = (await accepted.json()) as {
      ok: boolean;
      status: {
        mutatingToolsExposed: boolean;
        tools: readonly {
          name: string;
        }[];
      };
    };

    expect(accepted.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      status: {
        mutatingToolsExposed: false
      }
    });
    expect(payload.status.tools.map((tool) => tool.name)).toContain("preview_report_patch");
  });
});

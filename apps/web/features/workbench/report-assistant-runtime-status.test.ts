import { describe, expect, it, vi } from "vitest";

import type { ReportAssistantResultEnvelope } from "./report-assistant-result-contract";
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
    expect(status.tools.map((tool) => tool.name)).toContain("list_common_preset_summaries");
    expect(status.tools.map((tool) => tool.name)).toContain("preview_workbench_v2_calculator_snapshot");
    expect(status.tools.map((tool) => tool.name)).toContain("preview_described_layer_configuration");
    expect(status.routes.map((route) => route.pathname)).toContain("/api/report-assistant/calculator-preview");
    expect(status.routes).toContainEqual(expect.objectContaining({
      mutates: true,
      pathname: "/api/report-assistant/findings",
      requiresConfirmation: true
    }));
    expect(status.actionProposals).toHaveLength(5);
    expect(status.actionProposals).toEqual(expect.arrayContaining([
      expect.objectContaining({
        mutates: false,
        name: "create_project_report_from_current_draft",
        previewOnly: true,
        requiresConfirmation: true
      }),
      expect.objectContaining({
        mutates: false,
        name: "create_user_preset_from_current_stack",
        previewOnly: true,
        requiresConfirmation: true
      }),
      expect.objectContaining({
        mutates: false,
        name: "restore_report_revision_as_new_draft",
        previewOnly: true,
        requiresConfirmation: true
      }),
      expect.objectContaining({
        mutates: false,
        name: "save_current_stack_as_project_assembly",
        previewOnly: true,
        requiresConfirmation: true
      }),
      expect.objectContaining({
        mutates: false,
        name: "save_project_report_revision_from_current_draft",
        previewOnly: true,
        requiresConfirmation: true
      })
    ]));
  });

  it("summarizes configured endpoints without exposing query strings or API keys", () => {
    const status = getReportAssistantRuntimeStatus({
      env: {
        DYNECHO_REPORT_ASSISTANT_MODEL: "gemini-proxy-model",
        DYNECHO_REPORT_ASSISTANT_MODEL_API_KEY: "secret-model-key",
        DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT: "http://system_llm:4000/gemini-proxy?token=secret",
        DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER: "custom_patch_provider",
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
      provider: "custom_patch_provider",
      proxyKeyConfigured: false,
      timeoutMs: 12345
    });
    expect(status.researchProvider).toMatchObject({
      apiKeyConfigured: true,
      configured: true,
      endpoint: {
        origin: "https://research.example.test",
        pathname: "/search"
      },
      provider: "research_provider"
    });
    expect(JSON.stringify(status)).not.toContain("secret");
  });

  it("reports system_llm proxy readiness without exposing the proxy key", () => {
    const status = getReportAssistantRuntimeStatus({
      env: {
        DYNECHO_REPORT_ASSISTANT_MODEL: "gemini-3-flash-preview",
        DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT: "http://system_llm:4000/gemini-proxy?token=secret",
        DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER: "system_llm_gemini_proxy",
        DYNECHO_REPORT_ASSISTANT_MODEL_PROXY_KEY: "proxy-secret"
      },
      now: () => new Date("2026-06-03T08:00:00.000Z")
    });

    expect(status.modelProvider).toMatchObject({
      apiKeyConfigured: false,
      configured: true,
      endpoint: {
        origin: "http://system_llm:4000",
        pathname: "/gemini-proxy"
      },
      model: "gemini-3-flash-preview",
      provider: "system_llm_gemini_proxy",
      proxyKeyConfigured: true,
      readinessWarnings: []
    });
    expect(JSON.stringify(status)).not.toContain("proxy-secret");
    expect(JSON.stringify(status)).not.toContain("token=secret");
  });

  it("warns when system_llm proxy endpoint path is not the expected base path", () => {
    const status = getReportAssistantRuntimeStatus({
      env: {
        DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT: "http://system_llm:4000/not-gemini",
        DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER: "system_llm_gemini_proxy"
      }
    });

    expect(status.modelProvider).toMatchObject({
      configured: true,
      model: "gemini-3-flash-preview",
      provider: "system_llm_gemini_proxy",
      readinessWarnings: ["system_llm_gemini_proxy endpoint should end with /gemini-proxy."]
    });
  });

  it("returns route status behind the existing auth guard", async () => {
    const { GET } = await import("../../app/api/report-assistant/status/route");

    mockAuthState.value = {
      configured: true,
      session: null
    };
    const rejected = await GET();
    const rejectedPayload = (await rejected.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      ok: boolean;
    };
    expect(rejected.status).toBe(401);
    expect(rejectedPayload.assistantResults?.[0]).toMatchObject({
      authority: "error",
      capabilityName: "report_assistant_status_route",
      routeStatus: "auth_failed",
      tasks: [
        {
          code: "assistant_auth_required",
          severity: "error"
        }
      ]
    });

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
      assistantResults?: ReportAssistantResultEnvelope[];
      ok: boolean;
      status: {
        actionProposals: readonly {
          name: string;
          previewOnly: boolean;
        }[];
        mutatingToolsExposed: boolean;
        routes: readonly {
          mutates: boolean;
          pathname: string;
          requiresConfirmation: boolean;
        }[];
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
    expect(payload.assistantResults?.[0]).toMatchObject({
      authority: "deterministic_read",
      capabilityName: "report_assistant_status_route",
      routeStatus: "ready",
      sourceTrace: [
        {
          kind: "deterministic",
          label: "report_assistant_runtime_status"
        }
      ]
    });
    expect(payload.status.tools.map((tool) => tool.name)).toContain("preview_report_patch");
    expect(payload.status.tools.map((tool) => tool.name)).toContain("list_user_preset_summaries");
    expect(payload.status.routes).toContainEqual(expect.objectContaining({
      mutates: true,
      pathname: "/api/report-assistant/findings",
      requiresConfirmation: true
    }));
    expect(payload.status.actionProposals.map((action) => action.name)).toContain(
      "save_project_report_revision_from_current_draft"
    );
  });
});

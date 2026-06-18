import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it, vi } from "vitest";

import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  buildWorkbenchV2ProjectSnapshot
} from "./workbench-v2-project-snapshot";
import type { ReportAssistantResultEnvelope } from "../workbench/report-assistant-result-contract";
import { POST } from "../../app/api/report-assistant/calculator-preview/route";

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

function routeRequest(payload: unknown) {
  return new Request("http://localhost/api/report-assistant/calculator-preview", {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

function previewSnapshot() {
  return buildWorkbenchV2ProjectSnapshot({
    context: WORKBENCH_V2_DEFAULT_CONTEXT,
    customMaterials: [],
    id: "route-calculator-preview-snapshot",
    layers: [
      { id: "route-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
      { id: "route-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
      { id: "route-layer-3", materialId: "concrete", role: "side_b", thicknessMm: "100" }
    ],
    materialVisualOverrides: [],
    mode: "wall",
    name: "Route calculator preview",
    savedAtIso: "2026-06-17T08:00:00.000Z",
    selectedLayerId: "route-layer-1",
    selectedOutputs: ["Rw"]
  });
}

describe("workbench v2 calculator assistant route", () => {
  it("keeps configured mode behind the existing auth guard", async () => {
    mockAuthState.value = {
      configured: true,
      session: null
    };

    const response = await POST(routeRequest({ snapshot: previewSnapshot() }));
    const body = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      error?: string;
      ok: boolean;
    };

    expect(response.status).toBe(401);
    expect(body).toMatchObject({
      error: "Authentication required.",
      ok: false
    });
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "error",
      capabilityName: "report_assistant_calculator_preview_route",
      routeStatus: "auth_failed",
      tasks: [
        {
          code: "assistant_auth_required",
          severity: "error"
        }
      ]
    });
  });

  it("runs a preview-only calculator pass from a Workbench V2 snapshot", async () => {
    mockAuthState.value = {
      configured: false,
      missingKeys: [],
      session: {
        expiresAt: Number.MAX_SAFE_INTEGER,
        username: "Preview mode"
      }
    };

    const response = await POST(
      routeRequest({
        snapshot: previewSnapshot(),
        targetOutputs: ["Rw", "STC"] satisfies RequestedOutputId[]
      })
    );
    const body = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      mutates?: boolean;
      name?: string;
      ok: boolean;
      preview?: {
        calculationSummary?: {
          selectedOutputs?: string[];
          status?: string;
        };
        outputRows?: unknown[];
      };
      previewOnly?: boolean;
    };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      mutates: false,
      name: "preview_workbench_v2_calculator_snapshot",
      ok: true,
      preview: {
        calculationSummary: {
          selectedOutputs: ["Rw", "STC"],
          status: "ready"
        }
      },
      previewOnly: true
    });
    expect(body.preview?.outputRows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "57 dB" },
      { detail: "Calculated", label: "STC", status: "live", value: "57 dB" }
    ]);
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "calculator_backed",
      basis: [
        {
          metricId: "Rw",
          routeStatus: "ready",
          unit: "dB",
          valueLabel: "57 dB"
        },
        {
          metricId: "STC",
          routeStatus: "ready",
          unit: "dB",
          valueLabel: "57 dB"
        }
      ],
      capabilityName: "preview_workbench_v2_calculator_snapshot",
      routeStatus: "ready",
      sourceTrace: [
        {
          kind: "calculator_preview",
          label: "preview_workbench_v2_calculator_snapshot"
        }
      ]
    });
  });

  it("runs a preview-only calculator pass from a described layer configuration", async () => {
    const response = await POST(
      routeRequest({
        description: "Calculate Rw and STC for 12.5 mm gypsum board + 50 mm rockwool + 100 mm concrete"
      })
    );
    const body = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      mutates?: boolean;
      name?: string;
      ok: boolean;
      preview?: {
        calculationSummary?: {
          selectedOutputs?: string[];
          status?: string;
        };
        describedConfiguration?: {
          layers?: Array<{
            materialId?: string;
          }>;
        };
        outputRows?: unknown[];
      };
      previewOnly?: boolean;
    };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      mutates: false,
      name: "preview_described_layer_configuration",
      ok: true,
      preview: {
        calculationSummary: {
          selectedOutputs: ["Rw", "STC"],
          status: "ready"
        },
        describedConfiguration: {
          layers: [
            { materialId: "gypsum_board" },
            { materialId: "rockwool" },
            { materialId: "concrete" }
          ]
        }
      },
      previewOnly: true
    });
    expect(body.preview?.outputRows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "57 dB" },
      { detail: "Calculated", label: "STC", status: "live", value: "57 dB" }
    ]);
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "calculator_backed",
      basis: [
        {
          metricId: "Rw",
          routeStatus: "ready",
          unit: "dB",
          valueLabel: "57 dB"
        },
        {
          metricId: "STC",
          routeStatus: "ready",
          unit: "dB",
          valueLabel: "57 dB"
        }
      ],
      capabilityName: "preview_described_layer_configuration",
      routeStatus: "ready",
      sourceTrace: [
        {
          kind: "calculator_preview",
          label: "preview_described_layer_configuration"
        }
      ]
    });
  });

  it("rejects malformed preview payloads without exposing a mutating shape", async () => {
    const response = await POST(routeRequest(null));
    const body = (await response.json()) as {
      code?: string;
      mutates?: boolean;
      ok: boolean;
      previewOnly?: boolean;
    };

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      code: "invalid_calculator_preview_payload",
      mutates: false,
      ok: false,
      previewOnly: true
    });
  });
});

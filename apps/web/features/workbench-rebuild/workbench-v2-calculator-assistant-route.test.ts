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

  it("fills reasonable draft inputs for broad material-family described wall stacks", async () => {
    const response = await POST(
      routeRequest({
        description:
          "gypsum board seç hangisi farketmez araya rock wool koy sonra aynı gypsumdan seç inputları makul doldur Rw ve STC hesapla"
      })
    );
    const body = (await response.json()) as {
      ok: boolean;
      preview?: {
        calculationSummary?: {
          selectedOutputs?: string[];
          status?: string;
        };
        describedConfiguration?: {
          layers?: Array<{
            materialId?: string;
            thicknessMm?: number;
          }>;
          warnings?: string[];
        };
        outputRows?: Array<{
          label?: string;
          status?: string;
        }>;
      };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.preview?.describedConfiguration?.layers).toEqual([
      { materialId: "gypsum_board", materialName: "Gypsum Board", role: "side_a", thicknessMm: 12.5 },
      { materialId: "rockwool", materialName: "Rock Wool", role: "cavity", thicknessMm: 50 },
      { materialId: "gypsum_board", materialName: "Gypsum Board", role: "side_b", thicknessMm: 12.5 }
    ]);
    expect(body.preview?.describedConfiguration?.warnings?.[0]).toContain("engineering-default draft values");
    expect(body.preview?.calculationSummary?.selectedOutputs).toEqual(["Rw", "STC"]);
    expect(body.preview?.calculationSummary?.status).toBe("ready");
    expect(body.preview?.outputRows?.map((row) => row.status)).toEqual(["live", "live"]);
  });

  it("keeps described floor and impact requests as needs-input boundaries without numeric rows", async () => {
    const response = await POST(
      routeRequest({
        description: "120 mm concrete floor + 30 mm rockwool için Ln,w ve AIIC hesapla",
        targetOutputs: ["Ln,w", "AIIC"] satisfies RequestedOutputId[]
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
            role?: string;
            thicknessMm?: number;
          }>;
          parser?: string;
        };
        layerStackDraft?: {
          draft?: {
            mode?: string;
            requestedOutputs?: string[];
          };
          validation?: {
            missingInputs?: Array<{
              code?: string;
            }>;
            ok?: boolean;
            status?: string;
          };
        };
        outputRows?: Array<{
          label?: string;
          status?: string;
          value?: string;
        }>;
        tasks?: Array<{
          id?: string;
        }>;
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
          selectedOutputs: ["Ln,w", "AIIC"],
          status: "needs_input"
        },
        describedConfiguration: {
          layers: [
            { materialId: "concrete", role: "base_structure", thicknessMm: 120 },
            { materialId: "rockwool", role: "resilient_layer", thicknessMm: 30 }
          ],
          parser: "deterministic_floor_layer_description_v1"
        },
        layerStackDraft: {
          draft: {
            mode: "floor",
            requestedOutputs: ["Ln,w", "AIIC"]
          },
          validation: {
            ok: false,
            status: "needs_input"
          }
        },
        tasks: [
          {
            id: "assistant_floor_impact_dynamic_stiffness_missing"
          },
          {
            id: "assistant_floor_impact_load_basis_missing"
          },
          {
            id: "assistant_floor_impact_target_metric_basis_missing"
          }
        ]
      },
      previewOnly: true
    });
    expect(body.preview?.outputRows).toEqual([
      { detail: "Pending until the described layer configuration is complete.", label: "Ln,w", status: "pending", value: "--" },
      { detail: "Pending until the described layer configuration is complete.", label: "AIIC", status: "pending", value: "--" }
    ]);
    expect(body.preview?.layerStackDraft?.validation?.missingInputs?.map((input) => input.code)).toEqual([
      "assistant_floor_impact_dynamic_stiffness_missing",
      "assistant_floor_impact_load_basis_missing",
      "assistant_floor_impact_target_metric_basis_missing"
    ]);
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "needs_input",
      basis: [],
      capabilityName: "preview_described_layer_configuration",
      routeStatus: "needs_input"
    });
    expect(body.assistantResults?.[0]?.tasks.map((task) => task.code)).toEqual([
      "assistant_floor_impact_dynamic_stiffness_missing",
      "assistant_floor_impact_load_basis_missing",
      "assistant_floor_impact_target_metric_basis_missing"
    ]);
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

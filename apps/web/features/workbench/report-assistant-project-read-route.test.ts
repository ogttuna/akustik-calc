import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type {
  JsonValue,
  ProjectUserVerifiedCalculatedAnchorRequestContext,
  ProjectUserVerifiedCalculatedAnchorResultBasisTrace,
  ProjectUserVerifiedCalculatedAnchorValue
} from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildProjectOwnerId } from "../../lib/project-storage-auth";
import { FileServerProjectRepository, type ProjectOwnerScope } from "../../lib/server-project-storage";
import { FileWorkbenchV2VerifiedCalculatedAnchorRepository } from "../../lib/workbench-v2-verified-calculated-anchor-storage";
import type { ReportAssistantResultEnvelope } from "./report-assistant-result-contract";

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
  PUBLIC_PREVIEW_USERNAME: "Preview mode",
  getAuthState: vi.fn(async () => mockAuthState.value)
}));

let originalStoreDir: string | undefined;
let tempDirs: string[] = [];

function routeRequest(payload: unknown) {
  return new Request("http://localhost/api/report-assistant/project-read", {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

function previewOwner(): ProjectOwnerScope {
  return {
    authMode: "preview",
    ownerId: buildProjectOwnerId("preview", "Preview mode"),
    ownerLabel: "Preview mode"
  };
}

async function makeTempStoreDir() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "dynecho-assistant-project-read-route-"));
  tempDirs.push(tempDir);
  return tempDir;
}

const ASSEMBLY_SNAPSHOT: JsonValue = {
  privateMarker: "ROUTE_PRIVATE_ASSEMBLY_SNAPSHOT",
  rows: [
    {
      materialId: "gypsum_board",
      thicknessMm: "12.5"
    }
  ]
};

const REPORT_DOCUMENT: JsonValue = {
  executiveSummary: "ROUTE_PRIVATE_REPORT_DOCUMENT_BODY",
  projectName: "Route assistant project"
};

const VERIFIED_REQUEST_CONTEXT = {
  calculator: "dynamic",
  layers: [{ materialId: "gypsum_board", thicknessMm: 12.5 }],
  materialCatalog: [],
  mode: "wall",
  targetOutputs: ["Rw"]
} as const satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;

const VERIFIED_RESULT_TRACE = {
  airborneBasis: {
    assumptions: ["assistant project read route test"],
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 2,
    kind: "airborne_physics_prediction",
    method: "test_assistant_project_read_verified_calculated_reference",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    requiredInputs: [],
    toleranceClass: "uncalibrated_prediction"
  },
  assumptions: ["user confirmed calculated package"],
  calculator: "dynamic",
  ratingAdapterBasisSet: [],
  supportedImpactOutputs: [],
  supportedTargetOutputs: ["Rw"],
  targetOutputs: ["Rw"],
  unsupportedImpactOutputs: [],
  unsupportedTargetOutputs: [],
  warnings: []
} as const satisfies ProjectUserVerifiedCalculatedAnchorResultBasisTrace;

const VERIFIED_VALUES = [
  {
    metric: "Rw",
    metricBasis: "airborne_lab",
    provenance: {
      outputStatus: "supported",
      routeId: "test_assistant_project_read_verified_calculated_reference",
      source: "calculated_live_result"
    },
    valueDb: 52
  }
] as const satisfies readonly ProjectUserVerifiedCalculatedAnchorValue[];

async function seedProject() {
  const repository = new FileServerProjectRepository();
  const owner = previewOwner();
  const project = await repository.createProject(owner, {
    clientName: "Machinity Acoustics",
    name: "Route assistant project"
  });
  const withAssembly = await repository.appendAssembly(owner, project.id, {
    calculationSummary: {
      primaryOutput: "Rw",
      primaryValueLabel: "61 dB",
      selectedOutputs: ["Rw"],
      status: "ready"
    },
    kind: "wall",
    name: "Route wall option",
    snapshot: ASSEMBLY_SNAPSHOT
  });
  const assembly = withAssembly.assemblies[0]!;
  const withReport = await repository.appendReport(owner, project.id, {
    assemblyId: assembly.id,
    name: "Route saved report",
    reportDocument: REPORT_DOCUMENT,
    sourceAssemblySnapshot: ASSEMBLY_SNAPSHOT,
    sourceCalculationOutput: {
      ok: true
    },
    sourceMaterialSnapshot: {
      customMaterials: [],
      materialVisualOverrides: []
    }
  });

  return {
    assembly: withReport.assemblies[0]!,
    project: withReport,
    report: withReport.reports[0]!
  };
}

async function seedVerifiedCalculatedReference(projectId: string, input: { thicknessMm?: number } = {}) {
  const repository = new FileWorkbenchV2VerifiedCalculatedAnchorRepository();
  const requestContext = input.thicknessMm === undefined
    ? VERIFIED_REQUEST_CONTEXT
    : {
        ...VERIFIED_REQUEST_CONTEXT,
        layers: [{ materialId: "gypsum_board", thicknessMm: input.thicknessMm }]
      } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;

  return repository.createVerifiedCalculatedAnchor(previewOwner(), {
    createdFromProjectId: projectId,
    description: "Assistant-visible verified calculated reference",
    name: `Verified reference for ${projectId}`,
    requestContext,
    resultBasisTrace: VERIFIED_RESULT_TRACE,
    values: [...VERIFIED_VALUES],
    workbenchSnapshot: {
      selectedOutputs: ["Rw"]
    }
  });
}

beforeEach(async () => {
  originalStoreDir = process.env.DYNECHO_PROJECT_STORE_DIR;
  process.env.DYNECHO_PROJECT_STORE_DIR = await makeTempStoreDir();
  mockAuthState.value = {
    configured: false,
    missingKeys: [],
    session: {
      expiresAt: Number.MAX_SAFE_INTEGER,
      username: "Preview mode"
    }
  };
});

afterEach(async () => {
  if (originalStoreDir === undefined) {
    delete process.env.DYNECHO_PROJECT_STORE_DIR;
  } else {
    process.env.DYNECHO_PROJECT_STORE_DIR = originalStoreDir;
  }
  await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })));
  tempDirs = [];
});

describe("report assistant project-read route", () => {
  it("keeps configured mode behind the existing auth guard", async () => {
    const { POST } = await import("../../app/api/report-assistant/project-read/route");

    mockAuthState.value = {
      configured: true,
      session: null
    };

    const response = await POST(routeRequest({ action: "list_projects" }));
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
      capabilityName: "report_assistant_project_read_route",
      routeStatus: "auth_failed",
      tasks: [
        {
          code: "assistant_auth_required",
          severity: "error"
        }
      ]
    });
  }, 10000);

  it("rejects unsupported actions before calling project storage", async () => {
    const { POST } = await import("../../app/api/report-assistant/project-read/route");

    const response = await POST(routeRequest({ action: "save_report" }));
    const body = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      code?: string;
      errors?: string[];
      mutates?: boolean;
      ok: boolean;
    };

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      code: "unsupported_project_read_action",
      errors: ["Unsupported assistant project read action."],
      mutates: false,
      ok: false
    });
    expect(body.assistantResults).toHaveLength(1);
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "unsupported",
      basis: [],
      capabilityName: "report_assistant_project_read_route",
      mutates: false,
      previewOnly: false,
      rendererKind: "project_read_card",
      requiresConfirmation: false,
      resultKind: "project_read",
      routeStatus: "unsupported",
      sourceTrace: [
        {
          detail: "unsupported_project_read_action",
          kind: "project_read",
          label: "report_assistant_project_read_route"
        }
      ],
      stalePolicy: "none",
      tasks: [
        {
          code: "unsupported_project_read_action",
          message: "Unsupported assistant project read action.",
          severity: "error"
        }
      ]
    });
  });

  it("returns needs-input envelopes for read tools missing required ids", async () => {
    const { POST } = await import("../../app/api/report-assistant/project-read/route");

    const response = await POST(routeRequest({ action: "read_project_summary" }));
    const body = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      code?: string;
      errors?: string[];
      mutates?: boolean;
      ok: boolean;
    };

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      action: "read_project_summary",
      code: "missing_project_id",
      errors: ["Project id is required."],
      mutates: false,
      ok: false
    });
    expect(body.assistantResults).toHaveLength(1);
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "needs_input",
      basis: [],
      capabilityName: "read_project_summary",
      mutates: false,
      previewOnly: false,
      rendererKind: "project_read_card",
      requiresConfirmation: false,
      resultKind: "project_read",
      routeStatus: "needs_input",
      sourceTrace: [
        {
          detail: "missing_project_id",
          kind: "project_read",
          label: "read_project_summary"
        }
      ],
      stalePolicy: "none",
      tasks: [
        {
          code: "missing_project_id",
          message: "Project id is required.",
          severity: "warning"
        }
      ]
    });
  });

  it("returns read-only summary payloads without full saved report or assembly bodies", async () => {
    const seeded = await seedProject();
    const { POST } = await import("../../app/api/report-assistant/project-read/route");

    const response = await POST(routeRequest({ action: "read_project_summary", projectId: seeded.project.id }));
    const body = (await response.json()) as {
      action?: string;
      assistantResults?: ReportAssistantResultEnvelope[];
      mutates?: boolean;
      ok: boolean;
      result?: {
        project?: {
          assemblyCount?: number;
          id?: string;
          reportCount?: number;
        };
      };
    };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      action: "read_project_summary",
      mutates: false,
      ok: true,
      result: {
        project: {
          assemblyCount: 1,
          id: seeded.project.id,
          reportCount: 1
        }
      }
    });
    expect(body.assistantResults).toHaveLength(1);
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "saved_project_state",
      basis: [],
      capabilityName: "read_project_summary",
      mutates: false,
      previewOnly: false,
      rendererKind: "project_read_card",
      requiresConfirmation: false,
      resultKind: "project_read",
      routeStatus: "ready",
      sourceTrace: [
        {
          detail: "Owner-scoped project read route returned a typed local payload.",
          kind: "project_read",
          label: "read_project_summary"
        }
      ],
      stalePolicy: "none"
    });
    expect(body.assistantResults?.[0]?.evidence).toEqual(expect.arrayContaining([
      {
        detail: "read_project_summary",
        label: "Project read action"
      },
      {
        detail: seeded.project.id,
        label: "Project id"
      }
    ]));
    expect(JSON.stringify(body)).not.toContain("ROUTE_PRIVATE_REPORT_DOCUMENT_BODY");
    expect(JSON.stringify(body)).not.toContain("ROUTE_PRIVATE_ASSEMBLY_SNAPSHOT");
  });

  it("lists project user-verified calculated references as read-only assistant evidence", async () => {
    const seeded = await seedProject();
    const visibleReference = await seedVerifiedCalculatedReference(seeded.project.id);
    await seedVerifiedCalculatedReference("other-project-id", { thicknessMm: 15 });
    const { POST } = await import("../../app/api/report-assistant/project-read/route");

    const response = await POST(
      routeRequest({
        action: "list_project_verified_calculated_references",
        projectId: seeded.project.id
      })
    );
    const body = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      result?: {
        verifiedCalculatedReferences?: Array<{
          anchorKind?: string;
          id?: string;
          resultBasisTrace?: {
            supportedTargetOutputs?: string[];
          };
          valueMetrics?: string[];
          values?: Array<{
            metric?: string;
            metricBasis?: string;
            valueDb?: number;
          }>;
        }>;
      };
    };

    expect(response.status).toBe(200);
    expect(body.result?.verifiedCalculatedReferences).toEqual([
      expect.objectContaining({
        anchorKind: "user_verified_calculated_result",
        id: visibleReference.id,
        resultBasisTrace: expect.objectContaining({
          supportedTargetOutputs: ["Rw"]
        }),
        valueMetrics: ["Rw"],
        values: [
          expect.objectContaining({
            metric: "Rw",
            metricBasis: "airborne_lab",
            valueDb: 52
          })
        ]
      })
    ]);
    expect(JSON.stringify(body.result)).not.toContain("other-project-id");
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "saved_project_state",
      capabilityName: "list_project_verified_calculated_references",
      mutates: false,
      routeStatus: "ready"
    });
    expect(body.assistantResults?.[0]?.evidence).toEqual(expect.arrayContaining([
      {
        detail: "1",
        label: "Verified calculated reference count"
      }
    ]));
  });

  it("returns full saved documents only for explicit child read actions", async () => {
    const seeded = await seedProject();
    const { POST } = await import("../../app/api/report-assistant/project-read/route");

    const reportResponse = await POST(
      routeRequest({
        action: "read_project_report_document",
        projectId: seeded.project.id,
        reportId: seeded.report.id
      })
    );
    const assemblyResponse = await POST(
      routeRequest({
        action: "read_project_assembly_snapshot",
        assemblyId: seeded.assembly.id,
        projectId: seeded.project.id
      })
    );

    expect(reportResponse.status).toBe(200);
    const reportBody = (await reportResponse.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      result?: {
        document?: JsonValue;
      };
    };
    expect(reportBody).toMatchObject({
      action: "read_project_report_document",
      mutates: false,
      ok: true,
      result: {
        document: {
          executiveSummary: "ROUTE_PRIVATE_REPORT_DOCUMENT_BODY"
        }
      }
    });
    expect(reportBody.assistantResults?.[0]).toMatchObject({
      authority: "saved_project_state",
      capabilityName: "read_project_report_document",
      rendererKind: "project_read_card",
      resultKind: "project_read",
      sourceTrace: [
        {
          kind: "project_read",
          label: "read_project_report_document"
        }
      ]
    });
    expect(JSON.stringify(reportBody.assistantResults)).not.toContain("ROUTE_PRIVATE_REPORT_DOCUMENT_BODY");
    expect(assemblyResponse.status).toBe(200);
    expect(await assemblyResponse.json()).toMatchObject({
      action: "read_project_assembly_snapshot",
      mutates: false,
      ok: true,
      result: {
        snapshot: {
          privateMarker: "ROUTE_PRIVATE_ASSEMBLY_SNAPSHOT"
        }
      }
    });
  });

  it("lists assistant project read tools in runtime status without exposing mutating tools", async () => {
    const { GET } = await import("../../app/api/report-assistant/status/route");

    const response = await GET();
    const body = (await response.json()) as {
      ok: boolean;
      status?: {
        mutatingToolsExposed: boolean;
        tools: Array<{
          mutates: boolean;
          name: string;
        }>;
      };
    };

    expect(response.status).toBe(200);
    expect(body.status?.mutatingToolsExposed).toBe(false);
    expect(body.status?.tools.every((tool) => tool.mutates === false)).toBe(true);
    expect(body.status?.tools.map((tool) => tool.name)).toEqual(expect.arrayContaining([
      "list_projects",
      "list_project_verified_calculated_references",
      "read_project_report_document",
      "preview_report_patch"
    ]));
    expect(body.status?.tools.map((tool) => tool.name)).not.toContain("save_report");
    expect(body.status?.tools.map((tool) => tool.name)).not.toContain("apply_report_patch");
  });
});

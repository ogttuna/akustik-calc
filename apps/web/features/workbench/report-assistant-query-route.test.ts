import { mkdtemp, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { JsonValue } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import type { ReportAssistantResultEnvelope } from "./report-assistant-result-contract";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";
import { POST } from "../../app/api/report-assistant/query/route";
import { buildProjectOwnerId } from "../../lib/project-storage-auth";
import { FileServerProjectRepository, type ProjectOwnerScope } from "../../lib/server-project-storage";
import { FileWorkbenchV2PresetRepository } from "../../lib/workbench-v2-preset-storage";

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

const RW_METRIC_ID = getReportAssistantMetricId("Rw");

function metricMetadata() {
  return {
    engineDisplayValue: "61 dB",
    metricBasis: getReportAssistantMetricBasis("Rw"),
    metricDirection: getReportAssistantMetricDirection("Rw"),
    outputId: "Rw" as const,
    reportMetricId: RW_METRIC_ID
  };
}

function documentFixture(input?: {
  executiveSummary?: string;
  primaryMetricValue?: string;
  proposalRevision?: string;
  warning?: string;
}): SimpleWorkbenchProposalDocument {
  const value = input?.primaryMetricValue ?? "61 dB";

  return {
    assemblyHeadline: `Rw ${value} is packaged.`,
    assumptionItems: [],
    approverTitle: "Lead Acoustic Consultant",
    briefNote: "Assistant query route fixture.",
    citations: [],
    clientName: "Machinity Acoustics",
    consultantAddress: "Maslak District, Istanbul",
    consultantCompany: "Machinity Acoustic Consultants",
    consultantEmail: "offers@machinity-acoustics.com",
    consultantLogoDataUrl: "",
    consultantPhone: "+90 212 000 00 00",
    consultantWordmarkLine: "Building Acoustics",
    contextLabel: "Building prediction",
    corridorDossierCards: [],
    corridorDossierHeadline: "Validation corridor packaged.",
    coverageItems: [
      {
        detail: "Weighted airborne element rating.",
        label: "Rw",
        postureDetail: "Live value.",
        postureLabel: "Live",
        postureTone: "success",
        status: "live",
        value,
        ...metricMetadata()
      }
    ],
    decisionTrailHeadline: "Scoped estimate is active.",
    decisionTrailItems: [],
    dynamicBranchDetail: "Published family estimate is active.",
    dynamicBranchLabel: "Heavy floor",
    executiveSummary: input?.executiveSummary ?? `Route fixture reads Rw ${value}.`,
    issuedOnIso: "2026-06-16T09:00:00.000Z",
    issuedOnLabel: "16 June 2026",
    issueBaseReference: "MAC-QUERY-001",
    issueCodePrefix: "MAC",
    issueNextReference: "MAC-QUERY-002",
    issueRegisterItems: [],
    layers: [
      {
        categoryLabel: "Structure",
        index: 1,
        label: "Concrete slab",
        roleLabel: "Base structure",
        surfaceMassLabel: "480 kg/m2",
        thicknessLabel: "200 mm"
      }
    ],
    methodDossierCards: [],
    methodDossierHeadline: "Solver rationale packaged.",
    methodTraceGroups: [],
    metrics: [
      {
        detail: "Weighted airborne element rating.",
        label: "Rw",
        value,
        ...metricMetadata()
      }
    ],
    preparedBy: "O. Tuna",
    primaryMetricLabel: "Rw",
    primaryMetricValue: value,
    projectName: "Query route project",
    proposalAttention: "Design Coordination Team",
    proposalIssuePurpose: "Client review",
    proposalRecipient: "Machinity Development Team",
    proposalReference: "MAC-QUERY-001",
    proposalRevision: input?.proposalRevision ?? "Rev 01",
    proposalSubject: "Query route acoustic report",
    proposalValidityNote: "Valid for 30 calendar days unless superseded.",
    recommendationItems: [],
    reportProfile: "consultant",
    reportProfileLabel: "Consultant issue",
    studyContextLabel: "Pre-tender",
    studyModeLabel: "Floor",
    validationDetail: "Read this as a supported floor estimate.",
    validationLabel: "Scoped estimate",
    warnings: input?.warning ? [input.warning] : []
  };
}

function previewOwner(): ProjectOwnerScope {
  return {
    authMode: "preview",
    ownerId: buildProjectOwnerId("preview", "Preview mode"),
    ownerLabel: "Preview mode"
  };
}

function routeRequest(payload: unknown) {
  return new Request("http://localhost/api/report-assistant/query", {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

function incompleteLayerStackDraftFixture() {
  return {
    assumptions: ["Keep the user-described layer order."],
    contextSignature: "ctx.layer-draft",
    customMaterials: [],
    draftId: "draft.layer-stack",
    layers: [
      {
        id: "layer-1",
        materialId: "gypsum_board",
        materialName: "Gypsum Board",
        originalPhrase: "12.5 mm gypsum board",
        role: "side_a",
        thicknessMm: 12.5
      },
      {
        id: "layer-2",
        originalPhrase: "mystery board",
        role: "unknown"
      }
    ],
    mode: "wall",
    originalPhrases: ["12.5 mm gypsum board", "mystery board"],
    requestedOutputs: [],
    source: "user_instruction",
    sourceInstruction: "12.5 mm gypsum board + mystery board hesapla",
    wallTopologyDraft: {
      leafMapping: "not_required",
      topology: "single_leaf"
    },
    warnings: []
  };
}

function incompleteFloorImpactLayerStackDraftFixture() {
  return {
    assumptions: ["Keep the user-described floor layer order."],
    contextSignature: "ctx.floor-draft",
    customMaterials: [],
    draftId: "draft.floor-layer-stack",
    floorImpactDraft: {
      requiredPhysicalInputs: ["dynamic_stiffness", "load_basis"]
    },
    layers: [
      {
        id: "floor-layer-1",
        materialId: "concrete",
        materialName: "Concrete",
        originalPhrase: "150 mm concrete",
        role: "base_structure",
        thicknessMm: 150
      },
      {
        id: "floor-layer-2",
        materialId: "geniemat_rst05",
        materialName: "GenieMat RST05",
        originalPhrase: "5 mm geniemat",
        role: "resilient_layer",
        thicknessMm: 5
      },
      {
        id: "floor-layer-3",
        materialId: "screed",
        materialName: "Screed",
        originalPhrase: "50 mm screed",
        role: "floating_screed",
        thicknessMm: 50
      }
    ],
    mode: "floor",
    originalPhrases: ["150 mm concrete", "5 mm geniemat", "50 mm screed"],
    requestedOutputs: ["Ln,w"],
    source: "user_instruction",
    sourceInstruction: "150 mm concrete + 5 mm geniemat + 50 mm screed için Ln,w hesapla",
    warnings: []
  };
}

async function makeTempStoreDir() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "dynecho-assistant-query-route-"));
  tempDirs.push(tempDir);
  return tempDir;
}

function createRepository() {
  let idCounter = 0;
  let nowCounter = 0;

  return new FileServerProjectRepository({
    idFactory: () => {
      idCounter += 1;
      return `00000000-0000-4000-8000-${String(idCounter).padStart(12, "0")}`;
    },
    now: () => {
      nowCounter += 1;
      return new Date(Date.UTC(2026, 5, 16, 9, nowCounter, 0));
    }
  });
}

async function seedProject(input?: {
  withSecondRevision?: boolean;
}) {
  const repository = createRepository();
  const owner = previewOwner();
  const project = await repository.createProject(owner, {
    clientName: "Machinity Acoustics",
    name: "Query route project"
  });
  const withAssembly = await repository.appendAssembly(owner, project.id, {
    calculationSummary: {
      primaryOutput: "Rw",
      primaryValueLabel: "61 dB",
      selectedOutputs: ["Rw"],
      status: "ready"
    },
    kind: "floor",
    name: "Query slab option",
    snapshot: {
      privateMarker: "QUERY_PRIVATE_ASSEMBLY_SNAPSHOT"
    }
  });
  const assembly = withAssembly.assemblies[0]!;
  const savedDocument = documentFixture({
    executiveSummary: "QUERY_PRIVATE_REPORT_DOCUMENT_BODY",
    primaryMetricValue: "61 dB",
    proposalRevision: "Rev 01"
  });
  const withReport = await repository.appendReport(owner, project.id, {
    assemblyId: assembly.id,
    name: "Query saved report",
    reportDocument: savedDocument as unknown as JsonValue,
    sourceAssemblySnapshot: {
      privateMarker: "QUERY_PRIVATE_ASSEMBLY_SNAPSHOT"
    },
    sourceCalculationOutput: {
      ok: true
    },
    sourceMaterialSnapshot: {
      customMaterials: [],
      materialVisualOverrides: []
    }
  });
  const report = withReport.reports[0]!;

  if (!input?.withSecondRevision) {
    return {
      assembly: withReport.assemblies[0]!,
      project: withReport,
      report
    };
  }

  const nextDocument = documentFixture({
    executiveSummary: "QUERY_PRIVATE_REPORT_REVISION_BODY",
    primaryMetricValue: "58 dB",
    proposalRevision: "Rev 02",
    warning: "Assistant revision changed the report-only issue value."
  });
  const withRevision = await repository.appendReportRevision(owner, project.id, report.id, {
    assistantPatchSummary: {
      appliedAtIso: "2026-06-16T09:20:00.000Z",
      operationCount: 1,
      validationStatus: "valid"
    },
    changeSummary: "Assistant-adjusted revision.",
    document: nextDocument as unknown as JsonValue,
    expectedReportUpdatedAtIso: report.updatedAtIso,
    source: "assistant"
  });

  return {
    assembly: withRevision.assemblies[0]!,
    project: withRevision,
    report: withRevision.reports[0]!
  };
}

async function seedUserPreset() {
  const repository = new FileWorkbenchV2PresetRepository();

  return repository.createPreset(previewOwner(), {
    kind: "wall",
    layerCount: 1,
    name: "Custom wall template",
    snapshot: {
      context: {},
      customMaterials: [
        {
          category: "Board",
          id: "custom_private_panel",
          label: "USER_PRESET_PRIVATE_CUSTOM_MATERIAL",
          kind: "solid",
          densityKgM3: 780
        }
      ],
      id: "user-preset-private-snapshot",
      layers: [
        {
          id: "preset-layer-1",
          materialId: "custom_private_panel",
          role: "finish",
          thicknessMm: "15"
        }
      ],
      materialVisualOverrides: [
        {
          fillColor: "#123456",
          materialId: "custom_private_panel"
        }
      ],
      mode: "wall",
      name: "USER_PRESET_PRIVATE_SNAPSHOT",
      privateMarker: "USER_PRESET_PRIVATE_SNAPSHOT",
      savedAtIso: "2026-06-16T09:45:00.000Z",
      schemaId: "dynecho.workbench-v2.snapshot.v1",
      selectedLayerId: "preset-layer-1",
      selectedOutputs: ["Rw", "STC"]
    }
  });
}

function buildQueryContext(input: Awaited<ReturnType<typeof seedProject>>, document = documentFixture()) {
  const currentRevision = input.report.revisions.find((revision) => revision.id === input.report.currentRevisionId);

  return buildReportAssistantContext({
    activeDraftState: {
      assemblyId: input.assembly.id,
      assemblyName: input.assembly.name,
      assemblyVersion: input.assembly.version,
      dirty: false,
      kind: "project_report_draft",
      projectId: input.project.id,
      projectName: input.project.name,
      reportId: input.report.id,
      reportUpdatedAtIso: input.report.updatedAtIso
    },
    createdAtIso: "2026-06-16T09:30:00.000Z",
    document,
    projectWorkspace: {
      availableReadTools: [],
      currentRevision: currentRevision
        ? {
            assistantPatchSummary: currentRevision.assistantPatchSummary,
            changeSummary: currentRevision.changeSummary,
            createdAtIso: currentRevision.createdAtIso,
            displayCode: currentRevision.displayCode,
            id: currentRevision.id,
            source: currentRevision.source
          }
        : undefined,
      linkedAssembly: {
        calculationPrimaryOutput: input.assembly.calculationSummary?.primaryOutput,
        calculationPrimaryValueLabel: input.assembly.calculationSummary?.primaryValueLabel,
        calculationStatus: input.assembly.calculationSummary?.status,
        displayCode: input.assembly.displayCode,
        id: input.assembly.id,
        kind: input.assembly.kind,
        name: input.assembly.name,
        updatedAtIso: input.assembly.updatedAtIso,
        version: input.assembly.version
      },
      project: {
        assemblyCount: input.project.assemblies.length,
        id: input.project.id,
        name: input.project.name,
        reportCount: input.project.reports.length,
        updatedAtIso: input.project.updatedAtIso
      },
      report: {
        assemblyId: input.report.assemblyId,
        currentRevisionId: input.report.currentRevisionId,
        displayCode: input.report.displayCode,
        id: input.report.id,
        name: input.report.name,
        revisionCount: input.report.revisions.length,
        status: input.report.status,
        updatedAtIso: input.report.updatedAtIso
      },
      revisionSummaries: input.report.revisions.map((revision) => ({
        assistantPatchSummary: revision.assistantPatchSummary,
        changeSummary: revision.changeSummary,
        createdAtIso: revision.createdAtIso,
        displayCode: revision.displayCode,
        id: revision.id,
        source: revision.source
      })),
      scope: "project_report"
    },
    reportId: "query-route-test"
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

describe("report assistant query route", () => {
  it("keeps configured mode behind the existing auth guard", async () => {
    mockAuthState.value = {
      configured: true,
      session: null
    };

    const response = await POST(routeRequest({
      context: buildReportAssistantContext({
        document: documentFixture()
      }),
      instruction: "Which report is selected?"
    }));
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
      capabilityName: "report_assistant_query_route",
      routeStatus: "auth_failed",
      tasks: [
        {
          code: "assistant_auth_required",
          severity: "error"
        }
      ]
    });
  });

  it("rejects mutation intents before project storage is touched", async () => {
    mockAuthState.value = {
      configured: false,
      missingKeys: [],
      session: {
        expiresAt: Number.MAX_SAFE_INTEGER,
        username: "Preview mode"
      }
    };
    const context = buildReportAssistantContext({
      document: documentFixture()
    });

    const response = await POST(routeRequest({
      context,
      instruction: "Save this report revision"
    }));
    const body = (await response.json()) as {
      code?: string;
      mutates?: boolean;
      ok: boolean;
      usedReads?: unknown[];
    };
    const storeFiles = await readdir(process.env.DYNECHO_PROJECT_STORE_DIR ?? "");

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      code: "mutation_intent_not_supported",
      mutates: false,
      ok: false,
      usedReads: []
    });
    expect(storeFiles).toEqual([]);
  });

  it("answers selected project questions with summary reads only", async () => {
    const seeded = await seedProject();
    const context = buildQueryContext(seeded);

    const response = await POST(routeRequest({
      context,
      instruction: "Which saved report am I editing in this project?"
    }));
    const body = (await response.json()) as {
      answer?: string;
      calculatorPreview?: unknown;
      mutates?: boolean;
      ok: boolean;
      usedReads?: Array<{ action: string; mutates: boolean }>;
    };
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.mutates).toBe(false);
    expect(body.calculatorPreview).toBeUndefined();
    expect(body.usedReads?.map((read) => read.action)).toEqual([
      "read_project_summary",
      "list_project_reports"
    ]);
    expect(body.usedReads?.every((read) => read.mutates === false)).toBe(true);
    expect(body.answer).toContain("Selected project: Query route project.");
    expect(body.answer).toContain("Selected report: Query saved report.");
    expect(serialized).not.toContain("QUERY_PRIVATE_REPORT_DOCUMENT_BODY");
    expect(serialized).not.toContain("QUERY_PRIVATE_ASSEMBLY_SNAPSHOT");
  });

  it("rejects unsupported allowed read actions as non-mutating query errors", async () => {
    const response = await POST(routeRequest({
      allowedReadActions: ["save_report"],
      context: buildReportAssistantContext({
        document: documentFixture()
      }),
      instruction: "Which report is selected?"
    }));
    const body = (await response.json()) as {
      code?: string;
      mutates?: boolean;
      ok: boolean;
      usedReads?: unknown[];
    };

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      code: "unsupported_report_assistant_query_read_action",
      mutates: false,
      ok: false,
      usedReads: []
    });
  });

  it("answers described layer calculator requests by running a preview-only calculator pass", async () => {
    const response = await POST(routeRequest({
      context: buildReportAssistantContext({
        document: documentFixture()
      }),
      instruction: "Calculatoru kullan: 12.5 mm alcipan + 50 mm tasyunu + 100 mm beton icin Rw ve STC hesapla"
    }));
    const body = (await response.json()) as {
      answer?: string;
      assistantResults?: Array<{
        authority?: string;
        basis?: Array<{
          basis?: string;
          metricId?: string;
          routeStatus?: string;
          valueLabel?: string;
        }>;
        capabilityName?: string;
        mutates?: boolean;
        previewOnly?: boolean;
        rendererKind?: string;
        requiresConfirmation?: boolean;
        resultKind?: string;
        routeStatus?: string;
        sourceTrace?: Array<{ kind?: string; label?: string }>;
        stalePolicy?: string;
      }>;
      calculatorPreview?: {
        mutates?: boolean;
        name?: string;
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
          outputRows?: Array<{
            label?: string;
            value?: string;
          }>;
        };
        previewOnly?: boolean;
      };
      evidence?: Array<{ source: string }>;
      mutates?: boolean;
      ok: boolean;
      usedReads?: Array<{ action: string }>;
      warnings?: string[];
    };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      mutates: false,
      ok: true,
      usedReads: []
    });
    expect(body.evidence?.map((entry) => entry.source)).toContain("calculator_preview");
    expect(body.answer).toContain("Calculator preview is ready.");
    expect(body.answer).toContain("Parsed stack: 12.5 mm Gypsum Board + 50 mm Rock Wool + 100 mm Concrete.");
    expect(body.answer).toContain("Rw: 57 dB");
    expect(body.answer).toContain("STC: 57 dB");
    expect(body.calculatorPreview).toMatchObject({
      mutates: false,
      name: "preview_described_layer_configuration",
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
    expect(body.calculatorPreview?.preview?.outputRows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "57 dB" },
      { detail: "Calculated", label: "STC", status: "live", value: "57 dB" }
    ]);
    expect(body.assistantResults).toHaveLength(1);
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "calculator_backed",
      capabilityName: "preview_described_layer_configuration",
      mutates: false,
      previewOnly: true,
      rendererKind: "calculator_preview_card",
      requiresConfirmation: false,
      resultKind: "calculator_preview",
      routeStatus: "ready",
      sourceTrace: [
        {
          kind: "calculator_preview",
          label: "preview_described_layer_configuration"
        }
      ],
      stalePolicy: "assistant_context_signature"
    });
    expect(body.assistantResults?.[0]?.basis).toEqual([
      expect.objectContaining({
        metricId: "Rw",
        routeStatus: "ready",
        valueLabel: "57 dB"
      }),
      expect.objectContaining({
        metricId: "STC",
        routeStatus: "ready",
        valueLabel: "57 dB"
      })
    ]);
    expect(body.warnings).toContain("Calculator preview is read-only and did not mutate the report or Workbench stack.");
  });

  it("answers Turkish wall candidate comparisons with a comparison result card envelope", async () => {
    const response = await POST(routeRequest({
      context: buildReportAssistantContext({
        document: documentFixture()
      }),
      instruction: "12.5 mm gypsum + 100 mm concrete ile 15 mm gypsum + 120 mm concrete karşılaştır Rw ve STC"
    }));
    const body = (await response.json()) as {
      answer?: string;
      assistantResults?: Array<{
        authority?: string;
        basis?: Array<{
          basis?: string;
          metricId?: string;
          routeStatus?: string;
          valueLabel?: string;
        }>;
        capabilityName?: string;
        mutates?: boolean;
        previewOnly?: boolean;
        rendererKind?: string;
        requiresConfirmation?: boolean;
        resultKind?: string;
        routeStatus?: string;
        tasks?: Array<{ code?: string }>;
      }>;
      calculatorPreview?: unknown;
      mutates?: boolean;
      ok: boolean;
      warnings?: string[];
    };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      mutates: false,
      ok: true
    });
    expect(body.calculatorPreview).toBeUndefined();
    expect(body.answer).toContain("Wall candidate comparison preview is ready.");
    expect(body.answer).toContain("Ranking: 1. Candidate 2");
    expect(body.assistantResults).toHaveLength(1);
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "calculator_backed",
      capabilityName: "report_assistant_wall_candidate_comparison_preview",
      mutates: false,
      previewOnly: true,
      rendererKind: "wall_candidate_comparison_card",
      requiresConfirmation: false,
      resultKind: "wall_candidate_comparison",
      routeStatus: "ready"
    });
    expect(body.assistantResults?.[0]?.basis).toEqual([
      expect.objectContaining({
        basis: "wall-candidate-1:dynamic",
        metricId: "Rw",
        routeStatus: "ready",
        valueLabel: "51 dB"
      }),
      expect.objectContaining({
        basis: "wall-candidate-1:dynamic",
        metricId: "STC",
        routeStatus: "ready",
        valueLabel: "51 dB"
      }),
      expect.objectContaining({
        basis: "wall-candidate-2:dynamic",
        metricId: "Rw",
        routeStatus: "ready",
        valueLabel: "53 dB"
      }),
      expect.objectContaining({
        basis: "wall-candidate-2:dynamic",
        metricId: "STC",
        routeStatus: "ready",
        valueLabel: "53 dB"
      })
    ]);
    expect(body.assistantResults?.[0]?.tasks ?? []).toEqual([]);
    expect(body.warnings).toContain("Wall candidate comparison preview is read-only and did not mutate the report or Workbench stack.");
  });

  it("merges structured draft clarification answers without running calculator preview", async () => {
    const response = await POST(routeRequest({
      context: buildReportAssistantContext({
        document: documentFixture()
      }),
      draftContinuation: {
        answers: [
          {
            contextSignature: "ctx.layer-draft",
            draftId: "draft.layer-stack",
            kind: "layer_material",
            layerId: "layer-2",
            materialId: "concrete",
            materialName: "Concrete"
          }
        ],
        currentContextSignature: "ctx.layer-draft",
        draft: incompleteLayerStackDraftFixture()
      },
      instruction: "Eksik malzeme cevabını drafta uygula"
    }));
    const body = (await response.json()) as {
      answer?: string;
      assistantResults?: Array<{
        authority?: string;
        routeStatus?: string;
        tasks?: Array<{
          code?: string;
          severity?: string;
        }>;
      }>;
      calculatorPreview?: unknown;
      layerStackDraft?: {
        draft?: {
          draftId?: string;
          layers?: Array<{
            materialId?: string;
          }>;
        };
        validation?: {
          missingInputs?: Array<{
            code?: string;
          }>;
          status?: string;
        };
      };
      mutates?: boolean;
      ok: boolean;
      warnings?: string[];
    };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      mutates: false,
      ok: true
    });
    expect(body.calculatorPreview).toBeUndefined();
    expect(body.answer).toContain("Draft continuation applied. Remaining inputs:");
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "needs_input",
      routeStatus: "needs_input"
    });
    expect(body.assistantResults?.[0]?.tasks?.map((task) => task.code)).toEqual([
      "assistant_layer_thickness_missing",
      "assistant_layer_role_missing",
      "assistant_target_outputs_missing"
    ]);
    expect(body.layerStackDraft).toMatchObject({
      draft: {
        draftId: "draft.layer-stack",
        layers: [
          {
            materialId: "gypsum_board"
          },
          {
            materialId: "concrete"
          }
        ]
      },
      validation: {
        status: "needs_input"
      }
    });
    expect(body.layerStackDraft?.validation?.missingInputs?.map((input) => input.code)).toEqual([
      "assistant_layer_thickness_missing",
      "assistant_layer_role_missing",
      "assistant_target_outputs_missing"
    ]);
    expect(body.warnings).toContain("Draft continuation is read-only and did not mutate Workbench or calculator state.");
  });

  it("runs calculator preview when structured draft clarification makes the draft ready", async () => {
    const response = await POST(routeRequest({
      context: buildReportAssistantContext({
        document: documentFixture()
      }),
      draftContinuation: {
        answers: [
          {
            contextSignature: "ctx.layer-draft",
            draftId: "draft.layer-stack",
            kind: "layer_material",
            layerId: "layer-2",
            materialId: "concrete",
            materialName: "Concrete"
          },
          {
            contextSignature: "ctx.layer-draft",
            draftId: "draft.layer-stack",
            kind: "layer_thickness",
            layerId: "layer-2",
            thicknessMm: 100
          },
          {
            contextSignature: "ctx.layer-draft",
            draftId: "draft.layer-stack",
            kind: "layer_role",
            layerId: "layer-2",
            role: "side_b"
          },
          {
            contextSignature: "ctx.layer-draft",
            draftId: "draft.layer-stack",
            kind: "target_outputs",
            requestedOutputs: ["Rw"]
          }
        ],
        currentContextSignature: "ctx.layer-draft",
        draft: incompleteLayerStackDraftFixture()
      },
      instruction: "Eksikleri tamamla ve calculator preview calistir"
    }));
    const body = (await response.json()) as {
      assistantResults?: Array<{
        authority?: string;
        basis?: Array<{
          metricId?: string;
          routeStatus?: string;
        }>;
        routeStatus?: string;
      }>;
      calculatorPreview?: {
        name?: string;
        preview?: {
          calculationSummary?: {
            status?: string;
          };
          outputRows?: Array<{
            label?: string;
            status?: string;
          }>;
        };
      };
      layerStackDraft?: {
        validation?: {
          ok?: boolean;
          status?: string;
        };
      };
      mutates?: boolean;
      ok: boolean;
      warnings?: string[];
    };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      mutates: false,
      ok: true
    });
    expect(body.calculatorPreview).toMatchObject({
      name: "preview_layer_stack_draft",
      preview: {
        calculationSummary: {
          status: "ready"
        }
      }
    });
    expect(body.calculatorPreview?.preview?.outputRows?.some((row) =>
      row.label === "Rw" && row.status === "live"
    )).toBe(true);
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "calculator_backed",
      routeStatus: "ready"
    });
    expect(body.assistantResults?.[0]?.basis).toEqual([
      expect.objectContaining({
        metricId: "Rw",
        routeStatus: "ready"
      })
    ]);
    expect(body.layerStackDraft).toMatchObject({
      validation: {
        ok: true,
        status: "ready"
      }
    });
    expect(body.warnings).toEqual(expect.arrayContaining([
      "Draft continuation is read-only and did not mutate Workbench or calculator state.",
      "Calculator preview is read-only and did not mutate the report or Workbench stack."
    ]));
  });

  it("runs floor impact calculator preview when structured physical-input answers make the draft ready", async () => {
    const response = await POST(routeRequest({
      context: buildReportAssistantContext({
        document: documentFixture()
      }),
      draftContinuation: {
        answers: [
          {
            contextSignature: "ctx.floor-draft",
            draftId: "draft.floor-layer-stack",
            dynamicStiffnessMNm3: 15,
            kind: "floor_impact_dynamic_stiffness"
          },
          {
            contextSignature: "ctx.floor-draft",
            draftId: "draft.floor-layer-stack",
            kind: "floor_impact_load_basis",
            loadBasisKgM2: 200
          }
        ],
        currentContextSignature: "ctx.floor-draft",
        draft: incompleteFloorImpactLayerStackDraftFixture()
      },
      instruction: "Eksik zemin inputlarını tamamla ve calculator preview calistir"
    }));
    const body = (await response.json()) as {
      assistantResults?: Array<{
        authority?: string;
        basis?: Array<{
          metricId?: string;
          routeStatus?: string;
          valueLabel?: string;
        }>;
        routeStatus?: string;
      }>;
      calculatorPreview?: {
        name?: string;
        preview?: {
          calculationSummary?: {
            primaryValueLabel?: string;
            status?: string;
          };
          describedConfiguration?: {
            parser?: string;
          };
          estimatePayload?: {
            floorImpactContext?: {
              loadBasisKgM2?: number;
              resilientLayerDynamicStiffnessMNm3?: number;
            };
          };
          outputRows?: Array<{
            label?: string;
            status?: string;
            value?: string;
          }>;
        };
      };
      layerStackDraft?: {
        validation?: {
          ok?: boolean;
          status?: string;
        };
      };
      mutates?: boolean;
      ok: boolean;
      warnings?: string[];
    };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      mutates: false,
      ok: true
    });
    expect(body.calculatorPreview).toMatchObject({
      name: "preview_layer_stack_draft",
      preview: {
        calculationSummary: {
          primaryValueLabel: "40.5 dB",
          status: "ready"
        },
        describedConfiguration: {
          parser: "deterministic_floor_layer_description_v1"
        },
        estimatePayload: {
          floorImpactContext: {
            loadBasisKgM2: 200,
            resilientLayerDynamicStiffnessMNm3: 15
          }
        }
      }
    });
    expect(body.calculatorPreview?.preview?.outputRows).toEqual([
      { detail: "Calculated", label: "Ln,w", status: "live", value: "40.5 dB" }
    ]);
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "calculator_backed",
      routeStatus: "ready"
    });
    expect(body.assistantResults?.[0]?.basis).toEqual([
      expect.objectContaining({
        metricId: "Ln,w",
        routeStatus: "ready",
        valueLabel: "40.5 dB"
      })
    ]);
    expect(body.layerStackDraft).toMatchObject({
      validation: {
        ok: true,
        status: "ready"
      }
    });
    expect(body.warnings).toEqual(expect.arrayContaining([
      "Draft continuation is read-only and did not mutate Workbench or calculator state.",
      "Calculator preview is read-only and did not mutate the report or Workbench stack."
    ]));
  });

  it("rejects stale draft clarification before calculator preview", async () => {
    const response = await POST(routeRequest({
      context: buildReportAssistantContext({
        document: documentFixture()
      }),
      draftContinuation: {
        answers: [
          {
            contextSignature: "ctx.layer-draft",
            draftId: "draft.layer-stack",
            kind: "target_outputs",
            requestedOutputs: ["Rw"]
          }
        ],
        currentContextSignature: "ctx.changed",
        draft: incompleteLayerStackDraftFixture()
      },
      instruction: "Bu eski draft cevabını uygula"
    }));
    const body = (await response.json()) as {
      assistantResults?: Array<{
        authority?: string;
        routeStatus?: string;
        tasks?: Array<{
          code?: string;
          message?: string;
          severity?: string;
        }>;
      }>;
      calculatorPreview?: unknown;
      code?: string;
      mutates?: boolean;
      ok: boolean;
    };

    expect(response.status).toBe(409);
    expect(body).toMatchObject({
      code: "stale_report_assistant_layer_stack_draft",
      mutates: false,
      ok: false
    });
    expect(body.calculatorPreview).toBeUndefined();
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "draft_only",
      routeStatus: "stale"
    });
    expect(body.assistantResults?.[0]?.tasks).toEqual([
      {
        code: "assistant_layer_stack_draft_stale",
        message: "Draft context signature is stale; restart or revalidate the draft before merging answers.",
        severity: "error"
      }
    ]);
  });

  it("summarizes an explicit saved report document comparison without returning report bodies", async () => {
    const seeded = await seedProject();
    const currentDraft = documentFixture({
      executiveSummary: `CURRENT_DRAFT_LONG_TEXT ${"summary ".repeat(240)}`,
      primaryMetricValue: "59 dB",
      proposalRevision: "Rev 02",
      warning: "Manual report-only adjustment is active."
    });
    const context = buildQueryContext(seeded, currentDraft);

    const response = await POST(routeRequest({
      allowedReadActions: ["read_project_report_document"],
      context,
      document: currentDraft,
      instruction: "Compare current draft against saved report"
    }));
    const body = (await response.json()) as {
      answer?: string;
      assistantResults?: Array<{
        authority?: string;
        capabilityName?: string;
        rendererKind?: string;
        resultKind?: string;
        routeStatus?: string;
        sourceTrace?: Array<{ kind?: string }>;
      }>;
      evidence?: Array<{ source: string }>;
      ok: boolean;
      usedReads?: Array<{ action: string }>;
    };
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.usedReads?.map((read) => read.action)).toEqual(["read_project_report_document"]);
    expect(body.evidence?.map((entry) => entry.source)).toContain("report_document");
    expect(body.answer).toContain("current_draft_vs_saved_report");
    expect(body.answer).toContain("Rw: 61 dB -> 59 dB");
    expect(body.assistantResults?.[0]).toMatchObject({
      authority: "deterministic_read",
      capabilityName: "report_assistant_query_route",
      rendererKind: "query_answer_card",
      resultKind: "query_answer",
      routeStatus: "ready"
    });
    expect(body.assistantResults?.[0]?.sourceTrace?.map((trace) => trace.kind)).toContain("project_read");
    expect(serialized).not.toContain("QUERY_PRIVATE_REPORT_DOCUMENT_BODY");
    expect(serialized).not.toContain("CURRENT_DRAFT_LONG_TEXT");
  });

  it("summarizes explicit current and previous revision documents within the three-read bound", async () => {
    const seeded = await seedProject({
      withSecondRevision: true
    });
    const context = buildQueryContext(seeded);

    const response = await POST(routeRequest({
      allowedReadActions: ["list_project_report_revisions", "read_project_report_revision"],
      context,
      instruction: "What changed since the previous revision?"
    }));
    const body = (await response.json()) as {
      answer?: string;
      ok: boolean;
      usedReads?: Array<{ action: string; mutates: boolean }>;
    };
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.usedReads?.map((read) => read.action)).toEqual([
      "list_project_report_revisions",
      "read_project_report_revision",
      "read_project_report_revision"
    ]);
    expect(body.usedReads).toHaveLength(3);
    expect(body.usedReads?.every((read) => read.mutates === false)).toBe(true);
    expect(body.answer).toContain("current_revision_vs_previous_revision");
    expect(body.answer).toContain("Rw: 61 dB -> 58 dB");
    expect(serialized).not.toContain("QUERY_PRIVATE_REPORT_DOCUMENT_BODY");
    expect(serialized).not.toContain("QUERY_PRIVATE_REPORT_REVISION_BODY");
  });

  it("keeps previous revision document bodies gated behind explicit revision read permission", async () => {
    const seeded = await seedProject({
      withSecondRevision: true
    });
    const context = buildQueryContext(seeded);

    const response = await POST(routeRequest({
      allowedReadActions: ["list_project_report_revisions"],
      context,
      instruction: "Show project report revision history"
    }));
    const body = (await response.json()) as {
      answer?: string;
      ok: boolean;
      usedReads?: Array<{ action: string; mutates: boolean }>;
    };
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.usedReads?.map((read) => read.action)).toEqual([
      "list_project_report_revisions"
    ]);
    expect(body.usedReads?.every((read) => read.mutates === false)).toBe(true);
    expect(body.answer).toContain("saved revision summaries");
    expect(body.answer).toContain("latest listed revision is");
    expect(serialized).not.toContain("read_project_report_revision");
    expect(serialized).not.toContain("QUERY_PRIVATE_REPORT_DOCUMENT_BODY");
    expect(serialized).not.toContain("QUERY_PRIVATE_REPORT_REVISION_BODY");
  });

  it("answers preset questions from user and common summaries without returning preset snapshots", async () => {
    const seeded = await seedProject();
    await seedUserPreset();
    const wallDocument = {
      ...documentFixture(),
      studyModeLabel: "Wall"
    };
    const context = buildQueryContext(seeded, wallDocument);

    const response = await POST(routeRequest({
      context,
      instruction: "Which preset looks closest to this stack?"
    }));
    const body = (await response.json()) as {
      answer?: string;
      evidence?: Array<{ source: string }>;
      ok: boolean;
      usedReads?: Array<{ action: string; mutates: boolean }>;
    };
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.usedReads?.map((read) => read.action)).toEqual([
      "list_common_preset_summaries",
      "list_user_preset_summaries"
    ]);
    expect(body.usedReads?.every((read) => read.mutates === false)).toBe(true);
    expect(body.evidence?.map((entry) => entry.source)).toContain("preset_summary");
    expect(body.answer).toContain("1 user templates");
    expect(body.answer).toContain("common templates");
    expect(body.answer).toContain("Custom wall template");
    expect(body.answer).toContain("custom materials");
    expect(body.answer).toContain("visual overrides");
    expect(serialized).not.toContain("USER_PRESET_PRIVATE_SNAPSHOT");
    expect(serialized).not.toContain("USER_PRESET_PRIVATE_CUSTOM_MATERIAL");
    expect(serialized).not.toContain("privateMarker");
  });
});

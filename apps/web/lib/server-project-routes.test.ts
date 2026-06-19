import { Buffer } from "node:buffer";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SimpleWorkbenchProposalDocument } from "../features/workbench/simple-workbench-proposal";
import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  buildWorkbenchV2ProjectSnapshot,
  parseWorkbenchV2ProjectSnapshot
} from "../features/workbench-rebuild/workbench-v2-project-snapshot";

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

vi.mock("@/features/workbench/simple-workbench-proposal-pdf-server", () => ({
  renderSimpleWorkbenchProposalPdf: vi.fn(async () => Buffer.from("%PDF-1.4\n"))
}));

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;

let originalEnv: Record<string, string | undefined>;
let tempDirs: string[] = [];

async function makeTempStoreDir() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "dynecho-project-routes-"));
  tempDirs.push(tempDir);
  return tempDir;
}

function jsonRequest(url: string, payload: unknown, method = "POST") {
  return new Request(url, {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method
  });
}

function resetMockAuthState() {
  mockAuthState.value = {
    configured: false,
    missingKeys: [],
    session: {
      expiresAt: Number.MAX_SAFE_INTEGER,
      username: "Preview mode"
    }
  };
}

function clearAuthConfiguration() {
  resetMockAuthState();
  for (const key of AUTH_ENV_KEYS) {
    process.env[key] = "";
  }
}

function configureAuth() {
  mockAuthState.value = {
    configured: true,
    session: null
  };
}

function signInConfiguredUser(username = "alice@example.com") {
  mockAuthState.value = {
    configured: true,
    session: {
      expiresAt: Date.now() + 60 * 60 * 1000,
      username
    }
  };
}

function makeLocalScenarioImportPayload(input?: {
  clientName?: string;
  projectName?: string;
}) {
  return {
    clientName: input?.clientName ?? "Acme",
    projectName: input?.projectName ?? "Acme option study",
    scenarios: [
      {
        inputSnapshot: {
          requestedOutputs: ["Rw", "Ln,w"],
          rows: [
            {
              floorRole: "base_structure",
              materialId: "concrete",
              thicknessMm: "200"
            }
          ],
          studyMode: "floor"
        },
        localScenarioId: "local-floor-1",
        name: "Heavy floor option",
        outputSnapshot: {
          impact: {
            LnW: 54
          },
          metrics: {
            estimatedRwDb: 61
          }
        },
        savedAtIso: "2026-04-23T10:00:00.000Z"
      }
    ]
  };
}

function makeWorkbenchV2MaterialSnapshot(input?: { id?: string; name?: string }) {
  const customMaterial = {
    acoustic: {
      absorberClass: "porous_absorptive" as const,
      behavior: "porous_absorber" as const,
      flowResistivityPaSM2: 12000,
      notes: [],
      propertySourceStatus: "user_supplied" as const
    },
    category: "insulation" as const,
    densityKgM3: 45,
    id: "custom_server_snapshot_wool",
    name: "Server snapshot wool",
    tags: ["custom-workbench-material", "insulation", "porous_absorber"]
  };

  return buildWorkbenchV2ProjectSnapshot({
    context: {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      wallCavity1FillCoverage: "full",
      wallTopologyMode: "double_leaf_framed"
    },
    customMaterials: [customMaterial],
    id: input?.id ?? "workbench-v2-server-snapshot",
    layers: [
      { id: "layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
      { id: "layer-2", materialId: customMaterial.id, role: "cavity", thicknessMm: "50" }
    ],
    materialVisualOverrides: [
      {
        fillColor: "#123456",
        materialId: customMaterial.id,
        updatedAtIso: "2026-06-12T10:00:00.000Z"
      }
    ],
    mode: "wall",
    name: input?.name ?? "V2 material editor server snapshot",
    savedAtIso: "2026-06-12T10:00:00.000Z",
    selectedLayerId: "layer-2",
    selectedOutputs: ["Rw", "DnT,w"]
  });
}

function makeProposalDocument(input?: {
  serverProjectId?: string;
  serverProjectScenarioId?: string;
}): SimpleWorkbenchProposalDocument {
  return {
    approverTitle: "Lead Acoustic Consultant",
    assemblyHeadline: "3 live rows, heavy floating floor estimate active.",
    assumptionItems: [],
    briefNote: "Check flanking risk before issue.",
    citations: [],
    clientName: "Machinity Acoustics",
    consultantAddress: "Maslak District, Istanbul, Turkiye",
    consultantCompany: "Machinity Acoustic Consultants",
    consultantEmail: "offers@machinity-acoustics.com",
    consultantLogoDataUrl: "",
    consultantPhone: "+90 212 000 00 00",
    consultantWordmarkLine: "Building Acoustics and Vibration Control",
    contextLabel: "Building prediction",
    corridorDossierCards: [],
    corridorDossierHeadline: "Validation corridor packaged for the server audit route.",
    coverageItems: [],
    decisionTrailHeadline: "Scoped estimate is active.",
    decisionTrailItems: [],
    dynamicBranchDetail: "Published family estimate is active through reinforced concrete.",
    dynamicBranchLabel: "Heavy floating floor",
    executiveSummary: "Riverside Residences currently reads Rw 61 dB.",
    issueBaseReference: "MAC-RR-20260321",
    issueCodePrefix: "MAC",
    issueNextReference: "MAC-RR-20260321-03",
    issueRegisterItems: [],
    issuedOnIso: "2026-03-21T09:30:00.000Z",
    issuedOnLabel: "21 March 2026",
    layers: [],
    methodDossierCards: [],
    methodDossierHeadline: "Route and validation snapshot packaged for the server audit route.",
    methodTraceGroups: [],
    metrics: [],
    preparedBy: "O. Tuna",
    primaryMetricLabel: "Rw",
    primaryMetricValue: "61 dB",
    projectName: "Riverside Residences",
    proposalAttention: "Design Coordination Team",
    proposalIssuePurpose: "Client review and acoustic coordination",
    proposalRecipient: "Riverside Development Team",
    proposalReference: "MAC-2026-014",
    proposalRevision: "Rev 01",
    proposalSubject: "Riverside Residences floor acoustic proposal",
    proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue.",
    recommendationItems: [],
    reportProfile: "consultant",
    reportProfileLabel: "Consultant issue",
    serverProjectId: input?.serverProjectId,
    serverProjectScenarioId: input?.serverProjectScenarioId,
    studyContextLabel: "Pre-tender",
    studyModeLabel: "Floor",
    validationDetail: "Read this as a supported floor estimate, not as a measured claim.",
    validationLabel: "Scoped estimate",
    warnings: []
  };
}

beforeEach(async () => {
  originalEnv = Object.fromEntries([
    ...AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const),
    ["DYNECHO_PROJECT_STORE_DIR", process.env.DYNECHO_PROJECT_STORE_DIR] as const
  ]);
  clearAuthConfiguration();
  process.env.DYNECHO_PROJECT_STORE_DIR = await makeTempStoreDir();
});

afterEach(async () => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  resetMockAuthState();
  await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })));
  tempDirs = [];
});

describe("server project API routes", () => {
  it("imports browser-local scenarios, lists summaries, and returns the stored project detail", async () => {
    const { POST: importLocalScenarios } = await import("../app/api/projects/import-local/route");
    const { GET: listProjects } = await import("../app/api/projects/route");
    const { GET: readProject } = await import("../app/api/projects/[projectId]/route");

    const importResponse = await importLocalScenarios(
      jsonRequest("http://localhost/api/projects/import-local", makeLocalScenarioImportPayload())
    );
    const importBody = (await importResponse.json()) as {
      project?: {
        id?: string;
        scenarioSnapshots?: Array<{
          calculatorInput: {
            payload: unknown;
          };
        }>;
      };
    };

    expect(importResponse.status).toBe(201);
    expect(importBody.project?.id).toMatch(/^[0-9a-f-]{36}$/u);
    expect(importBody.project?.scenarioSnapshots?.[0]?.calculatorInput.payload).toMatchObject({
      studyMode: "floor"
    });

    const listResponse = await listProjects();
    const listBody = (await listResponse.json()) as {
      projects?: Array<{
        id: string;
        scenarioCount: number;
      }>;
    };

    expect(listResponse.status).toBe(200);
    expect(listBody.projects).toEqual([
      expect.objectContaining({
        id: importBody.project!.id,
        scenarioCount: 1
      })
    ]);

    const detailResponse = await readProject(new Request(`http://localhost/api/projects/${importBody.project!.id}`), {
      params: Promise.resolve({
        projectId: importBody.project!.id!
      })
    });
    const detailBody = (await detailResponse.json()) as {
      project?: {
        id?: string;
        ownerLabel?: string;
      };
    };

    expect(detailResponse.status).toBe(200);
    expect(detailBody.project).toMatchObject({
      id: importBody.project!.id,
      ownerLabel: "Preview mode"
    });
  });

  it("round-trips workbench v2 material editor snapshots through server project detail", async () => {
    const { POST: importLocalScenarios } = await import("../app/api/projects/import-local/route");
    const { GET: readProject } = await import("../app/api/projects/[projectId]/route");
    const snapshot = makeWorkbenchV2MaterialSnapshot();

    const importResponse = await importLocalScenarios(
      jsonRequest("http://localhost/api/projects/import-local", {
        projectName: "Workbench v2 material editor",
        scenarios: [
          {
            inputSnapshot: snapshot,
            localScenarioId: snapshot.id,
            name: snapshot.name,
            outputSnapshot: {
              resultStatus: "ready"
            },
            savedAtIso: snapshot.savedAtIso
          }
        ]
      })
    );
    const importBody = (await importResponse.json()) as {
      project?: {
        id?: string;
      };
    };

    expect(importResponse.status).toBe(201);
    expect(importBody.project?.id).toMatch(/^[0-9a-f-]{36}$/u);

    const detailResponse = await readProject(new Request(`http://localhost/api/projects/${importBody.project!.id}`), {
      params: Promise.resolve({
        projectId: importBody.project!.id!
      })
    });
    const detailBody = (await detailResponse.json()) as {
      project?: {
        scenarioSnapshots?: Array<{
          calculatorInput: {
            payload: unknown;
          };
        }>;
      };
    };
    const parsed = parseWorkbenchV2ProjectSnapshot(detailBody.project?.scenarioSnapshots?.[0]?.calculatorInput.payload);

    expect(detailResponse.status).toBe(200);
    expect(parsed).toMatchObject({
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      snapshot: {
        context: {
          wallCavity1FillCoverage: "full",
          wallTopologyMode: "double_leaf_framed"
        },
        customMaterials: [
          {
            id: "custom_server_snapshot_wool",
            name: "Server snapshot wool"
          }
        ],
        materialVisualOverrides: [
          {
            fillColor: "#123456",
            materialId: "custom_server_snapshot_wool"
          }
        ],
        mode: "wall",
        selectedLayerId: "layer-2",
        selectedOutputs: ["Rw", "DnT,w"]
      }
    });
  });

  it("stores named workbench v2 assemblies, reports, and assistant report revisions under one project", async () => {
    const { POST: createProject } = await import("../app/api/projects/route");
    const { GET: listAssemblies, POST: createAssembly } = await import("../app/api/projects/[projectId]/assemblies/route");
    const { GET: readAssembly } = await import("../app/api/projects/[projectId]/assemblies/[assemblyId]/route");
    const { GET: listReports, POST: createReport } = await import("../app/api/projects/[projectId]/reports/route");
    const { GET: readReport } = await import("../app/api/projects/[projectId]/reports/[reportId]/route");
    const { POST: createReportRevision } = await import("../app/api/projects/[projectId]/reports/[reportId]/revisions/route");

    const snapshot = makeWorkbenchV2MaterialSnapshot();
    const projectResponse = await createProject(
      jsonRequest("http://localhost/api/projects", {
        clientName: "Acme Hotels",
        name: "Bilmem Ne Oteli"
      })
    );
    const projectBody = (await projectResponse.json()) as {
      project?: {
        id?: string;
      };
    };
    const projectId = projectBody.project!.id!;

    const assemblyResponse = await createAssembly(
      jsonRequest(`http://localhost/api/projects/${projectId}/assemblies`, {
        calculationSummary: {
          primaryOutput: "Rw",
          primaryValueLabel: "46 dB",
          selectedOutputs: ["Rw", "DnT,w"],
          status: "ready"
        },
        description: "Guest room party wall with project wool.",
        kind: "wall",
        name: "Guest room party wall",
        snapshot
      }),
      {
        params: Promise.resolve({
          projectId
        })
      }
    );
    const assemblyBody = (await assemblyResponse.json()) as {
      assembly?: {
        displayCode?: string;
        id?: string;
        snapshot?: unknown;
      };
    };
    const assemblyId = assemblyBody.assembly!.id!;

    expect(assemblyResponse.status).toBe(201);
    expect(assemblyBody.assembly).toMatchObject({
      displayCode: "ASM-0001",
      name: "Guest room party wall",
      version: 1
    });

    const assemblyListResponse = await listAssemblies(new Request(`http://localhost/api/projects/${projectId}/assemblies`), {
      params: Promise.resolve({
        projectId
      })
    });
    const assemblyListBody = (await assemblyListResponse.json()) as {
      assemblies?: Array<{
        id: string;
        snapshot?: unknown;
      }>;
    };

    expect(assemblyListResponse.status).toBe(200);
    expect(assemblyListBody.assemblies).toEqual([
      expect.objectContaining({
        id: assemblyId,
        name: "Guest room party wall"
      })
    ]);
    expect(assemblyListBody.assemblies?.[0]).not.toHaveProperty("snapshot");

    const assemblyDetailResponse = await readAssembly(
      new Request(`http://localhost/api/projects/${projectId}/assemblies/${assemblyId}`),
      {
        params: Promise.resolve({
          assemblyId,
          projectId
        })
      }
    );
    const assemblyDetailBody = (await assemblyDetailResponse.json()) as {
      assembly?: {
        snapshot?: unknown;
      };
    };

    expect(assemblyDetailResponse.status).toBe(200);
    expect(parseWorkbenchV2ProjectSnapshot(assemblyDetailBody.assembly?.snapshot)).toMatchObject({
      snapshot: {
        id: "workbench-v2-server-snapshot",
        mode: "wall",
        name: "V2 material editor server snapshot"
      }
    });

    const baseReportDocument = makeProposalDocument({
      serverProjectId: projectId
    });
    const reportResponse = await createReport(
      jsonRequest(`http://localhost/api/projects/${projectId}/reports`, {
        assemblyId,
        description: "Issued report draft for the guest room wall.",
        name: "Guest room party wall report",
        reportDocument: baseReportDocument,
        sourceAssemblySnapshot: snapshot,
        sourceCalculationOutput: {
          primaryMetric: "Rw 46 dB"
        },
        sourceMaterialSnapshot: {
          customMaterials: snapshot.customMaterials,
          materialVisualOverrides: snapshot.materialVisualOverrides
        }
      }),
      {
        params: Promise.resolve({
          projectId
        })
      }
    );
    const reportBody = (await reportResponse.json()) as {
      report?: {
        currentRevisionId?: string;
        displayCode?: string;
        id?: string;
        reportDocument?: unknown;
        revisions?: Array<{
          displayCode?: string;
          source?: string;
        }>;
        updatedAtIso?: string;
      };
    };
    const reportId = reportBody.report!.id!;
    const firstReportUpdatedAtIso = reportBody.report!.updatedAtIso!;

    expect(reportResponse.status).toBe(201);
    expect(reportBody.report).toMatchObject({
      assemblyId,
        displayCode: "RPT-0001",
        description: "Issued report draft for the guest room wall.",
        name: "Guest room party wall report",
      revisions: [
        expect.objectContaining({
          displayCode: "REV-0001",
          source: "generated"
        })
      ],
      status: "draft"
    });

    const reportListResponse = await listReports(new Request(`http://localhost/api/projects/${projectId}/reports`), {
      params: Promise.resolve({
        projectId
      })
    });
    const reportListBody = (await reportListResponse.json()) as {
      reports?: Array<{
        description?: string;
        id: string;
        reportDocument?: unknown;
        revisionCount: number;
      }>;
    };

    expect(reportListResponse.status).toBe(200);
    expect(reportListBody.reports).toEqual([
      expect.objectContaining({
        description: "Issued report draft for the guest room wall.",
        id: reportId,
        revisionCount: 1
      })
    ]);
    expect(reportListBody.reports?.[0]).not.toHaveProperty("reportDocument");

    const correctedDocument: SimpleWorkbenchProposalDocument = {
      ...baseReportDocument,
      primaryMetricValue: "45 dB",
      reportAdjustments: [
        {
          afterValue: "45 dB",
          appliedAtIso: "2026-06-12T12:00:00.000Z",
          beforeValue: "46 dB",
          engineValuePreserved: true,
          id: "assistant-adjustment-1",
          label: "Rw",
          metricId: "output:Rw",
          outputId: "Rw",
          reason: "Assistant-reviewed report correction.",
          scope: "saved_snapshot",
          source: "assistant"
        }
      ]
    };

    const revisionResponse = await createReportRevision(
      jsonRequest(`http://localhost/api/projects/${projectId}/reports/${reportId}/revisions`, {
        assistantPatchSummary: {
          appliedAtIso: "2026-06-12T12:00:00.000Z",
          instruction: "Set Rw to 45 dB in the report",
          operationCount: 1,
          validationStatus: "valid"
        },
        changeSummary: "Assistant-reviewed Rw display correction.",
        document: correctedDocument,
        expectedReportUpdatedAtIso: firstReportUpdatedAtIso,
        source: "assistant"
      }),
      {
        params: Promise.resolve({
          projectId,
          reportId
        })
      }
    );
    const revisionBody = (await revisionResponse.json()) as {
      report?: {
        currentRevisionId?: string;
        reportDocument?: SimpleWorkbenchProposalDocument;
        revisions?: Array<{
          assistantPatchSummary?: {
            operationCount?: number;
          };
          displayCode?: string;
          source?: string;
        }>;
        updatedAtIso?: string;
      };
      revision?: {
        id?: string;
      };
    };

    expect(revisionResponse.status).toBe(201);
    expect(revisionBody.report?.currentRevisionId).toBe(revisionBody.revision?.id);
    expect(revisionBody.report?.reportDocument).toMatchObject({
      primaryMetricValue: "45 dB",
      reportAdjustments: [
        expect.objectContaining({
          source: "assistant"
        })
      ]
    });
    expect(revisionBody.report?.revisions).toEqual([
      expect.objectContaining({
        displayCode: "REV-0001",
        source: "generated"
      }),
      expect.objectContaining({
        assistantPatchSummary: expect.objectContaining({
          operationCount: 1
        }),
        displayCode: "REV-0002",
        source: "assistant"
      })
    ]);

    const reportDetailResponse = await readReport(new Request(`http://localhost/api/projects/${projectId}/reports/${reportId}`), {
      params: Promise.resolve({
        projectId,
        reportId
      })
    });
    const reportDetailBody = (await reportDetailResponse.json()) as {
      report?: {
        reportDocument?: SimpleWorkbenchProposalDocument;
      };
    };

    expect(reportDetailResponse.status).toBe(200);
    expect(reportDetailBody.report?.reportDocument).toMatchObject({
      primaryMetricValue: "45 dB"
    });

    const staleRevisionResponse = await createReportRevision(
      jsonRequest(`http://localhost/api/projects/${projectId}/reports/${reportId}/revisions`, {
        document: correctedDocument,
        expectedReportUpdatedAtIso: firstReportUpdatedAtIso,
        source: "manual"
      }),
      {
        params: Promise.resolve({
          projectId,
          reportId
        })
      }
    );
    const staleRevisionBody = (await staleRevisionResponse.json()) as {
      code?: string;
      ok?: boolean;
    };

    expect(staleRevisionResponse.status).toBe(409);
    expect(staleRevisionBody).toMatchObject({
      code: "report_revision_conflict",
      ok: false
    });
  });

  it("renames, duplicates, archives, and deletes project child records without orphaning reports", async () => {
    const { POST: createProject } = await import("../app/api/projects/route");
    const { GET: listAssemblies, POST: createAssembly } = await import("../app/api/projects/[projectId]/assemblies/route");
    const {
      DELETE: deleteAssembly,
      PATCH: updateAssembly
    } = await import("../app/api/projects/[projectId]/assemblies/[assemblyId]/route");
    const { POST: duplicateAssembly } = await import("../app/api/projects/[projectId]/assemblies/[assemblyId]/duplicate/route");
    const { GET: listReports, POST: createReport } = await import("../app/api/projects/[projectId]/reports/route");
    const {
      DELETE: deleteReport,
      PATCH: updateReport
    } = await import("../app/api/projects/[projectId]/reports/[reportId]/route");
    const { POST: duplicateReport } = await import("../app/api/projects/[projectId]/reports/[reportId]/duplicate/route");

    const snapshot = makeWorkbenchV2MaterialSnapshot();
    const projectResponse = await createProject(
      jsonRequest("http://localhost/api/projects", {
        name: "Managed child project"
      })
    );
    const projectBody = (await projectResponse.json()) as {
      project?: {
        id?: string;
      };
    };
    const projectId = projectBody.project!.id!;

    const assemblyResponse = await createAssembly(
      jsonRequest(`http://localhost/api/projects/${projectId}/assemblies`, {
        calculationSummary: {
          selectedOutputs: ["Rw"],
          status: "ready"
        },
        kind: "wall",
        name: "Original wall",
        snapshot
      }),
      {
        params: Promise.resolve({
          projectId
        })
      }
    );
    const assemblyBody = (await assemblyResponse.json()) as {
      assembly?: {
        id?: string;
      };
    };
    const assemblyId = assemblyBody.assembly!.id!;

    const updateAssemblyResponse = await updateAssembly(
      jsonRequest(
        `http://localhost/api/projects/${projectId}/assemblies/${assemblyId}`,
        {
          name: "Renamed wall"
        },
        "PATCH"
      ),
      {
        params: Promise.resolve({
          assemblyId,
          projectId
        })
      }
    );
    await expect(updateAssemblyResponse.json()).resolves.toMatchObject({
      assembly: {
        id: assemblyId,
        name: "Renamed wall"
      },
      ok: true
    });

    const updatedSnapshot = makeWorkbenchV2MaterialSnapshot({
      id: "workbench-v2-server-snapshot-updated",
      name: "Updated V2 material editor server snapshot"
    });
    const updateAssemblySnapshotResponse = await updateAssembly(
      jsonRequest(
        `http://localhost/api/projects/${projectId}/assemblies/${assemblyId}`,
        {
          calculationSummary: {
            primaryOutput: "Rw",
            primaryValueLabel: "61 dB",
            selectedOutputs: ["Rw"],
            status: "ready"
          },
          kind: "wall",
          snapshot: updatedSnapshot
        },
        "PATCH"
      ),
      {
        params: Promise.resolve({
          assemblyId,
          projectId
        })
      }
    );
    const updateAssemblySnapshotBody = (await updateAssemblySnapshotResponse.json()) as {
      assembly?: {
        calculationSummary?: {
          primaryValueLabel?: string;
        };
        snapshot?: unknown;
        version?: number;
      };
    };

    expect(updateAssemblySnapshotResponse.status).toBe(200);
    expect(updateAssemblySnapshotBody.assembly).toMatchObject({
      calculationSummary: {
        primaryValueLabel: "61 dB"
      },
      version: 2
    });
    expect(parseWorkbenchV2ProjectSnapshot(updateAssemblySnapshotBody.assembly?.snapshot).snapshot).toMatchObject({
      id: "workbench-v2-server-snapshot-updated",
      name: "Updated V2 material editor server snapshot"
    });

    const duplicateAssemblyResponse = await duplicateAssembly(
      jsonRequest(`http://localhost/api/projects/${projectId}/assemblies/${assemblyId}/duplicate`, {}),
      {
        params: Promise.resolve({
          assemblyId,
          projectId
        })
      }
    );
    const duplicateAssemblyBody = (await duplicateAssemblyResponse.json()) as {
      assembly?: {
        displayCode?: string;
        id?: string;
        name?: string;
      };
    };
    const duplicateAssemblyId = duplicateAssemblyBody.assembly!.id!;

    expect(duplicateAssemblyResponse.status).toBe(201);
    expect(duplicateAssemblyBody.assembly).toMatchObject({
      displayCode: "ASM-0002",
      name: "Copy of Renamed wall"
    });

    const deleteDuplicateAssemblyResponse = await deleteAssembly(
      new Request(`http://localhost/api/projects/${projectId}/assemblies/${duplicateAssemblyId}`, {
        method: "DELETE"
      }),
      {
        params: Promise.resolve({
          assemblyId: duplicateAssemblyId,
          projectId
        })
      }
    );
    expect(deleteDuplicateAssemblyResponse.status).toBe(200);

    const reportResponse = await createReport(
      jsonRequest(`http://localhost/api/projects/${projectId}/reports`, {
        assemblyId,
        name: "Original report",
        reportDocument: makeProposalDocument({
          serverProjectId: projectId,
          serverProjectScenarioId: assemblyId
        }),
        sourceAssemblySnapshot: snapshot,
        sourceMaterialSnapshot: {
          customMaterials: snapshot.customMaterials,
          materialVisualOverrides: snapshot.materialVisualOverrides
        }
      }),
      {
        params: Promise.resolve({
          projectId
        })
      }
    );
    const reportBody = (await reportResponse.json()) as {
      report?: {
        id?: string;
        updatedAtIso?: string;
      };
    };
    const reportId = reportBody.report!.id!;
    const reportUpdatedAtIso = reportBody.report!.updatedAtIso!;

    const blockedAssemblyDeleteResponse = await deleteAssembly(
      new Request(`http://localhost/api/projects/${projectId}/assemblies/${assemblyId}`, {
        method: "DELETE"
      }),
      {
        params: Promise.resolve({
          assemblyId,
          projectId
        })
      }
    );
    await expect(blockedAssemblyDeleteResponse.json()).resolves.toMatchObject({
      code: "assembly_has_reports",
      ok: false
    });
    expect(blockedAssemblyDeleteResponse.status).toBe(409);

    const archiveReportResponse = await updateReport(
      jsonRequest(
        `http://localhost/api/projects/${projectId}/reports/${reportId}`,
        {
          expectedReportUpdatedAtIso: reportUpdatedAtIso,
          name: "Archived acoustic report",
          status: "archived"
        },
        "PATCH"
      ),
      {
        params: Promise.resolve({
          projectId,
          reportId
        })
      }
    );
    const archiveReportBody = (await archiveReportResponse.json()) as {
      report?: {
        name?: string;
        status?: string;
      };
    };

    expect(archiveReportResponse.status).toBe(200);
    expect(archiveReportBody.report).toMatchObject({
      name: "Archived acoustic report",
      status: "archived"
    });

    const duplicateReportResponse = await duplicateReport(
      jsonRequest(`http://localhost/api/projects/${projectId}/reports/${reportId}/duplicate`, {}),
      {
        params: Promise.resolve({
          projectId,
          reportId
        })
      }
    );
    const duplicateReportBody = (await duplicateReportResponse.json()) as {
      report?: {
        displayCode?: string;
        id?: string;
        name?: string;
        revisions?: unknown[];
        status?: string;
      };
    };
    const duplicateReportId = duplicateReportBody.report!.id!;

    expect(duplicateReportResponse.status).toBe(201);
    expect(duplicateReportBody.report).toMatchObject({
      displayCode: "RPT-0002",
      name: "Copy of Archived acoustic report",
      status: "draft"
    });
    expect(duplicateReportBody.report?.revisions).toHaveLength(1);

    const deleteDuplicateReportResponse = await deleteReport(
      new Request(`http://localhost/api/projects/${projectId}/reports/${duplicateReportId}`, {
        method: "DELETE"
      }),
      {
        params: Promise.resolve({
          projectId,
          reportId: duplicateReportId
        })
      }
    );
    expect(deleteDuplicateReportResponse.status).toBe(200);

    const assemblyListResponse = await listAssemblies(new Request(`http://localhost/api/projects/${projectId}/assemblies`), {
      params: Promise.resolve({
        projectId
      })
    });
    const reportListResponse = await listReports(new Request(`http://localhost/api/projects/${projectId}/reports`), {
      params: Promise.resolve({
        projectId
      })
    });

    await expect(assemblyListResponse.json()).resolves.toMatchObject({
      assemblies: [
        {
          id: assemblyId,
          name: "Renamed wall"
        }
      ],
      ok: true
    });
    await expect(reportListResponse.json()).resolves.toMatchObject({
      ok: true,
      reports: [
        {
          id: reportId,
          name: "Archived acoustic report",
          revisionCount: 1,
          status: "archived"
        }
      ]
    });
  });

  it("rejects invalid import payloads without creating a server project", async () => {
    const { POST: importLocalScenarios } = await import("../app/api/projects/import-local/route");
    const { GET: listProjects } = await import("../app/api/projects/route");

    const importResponse = await importLocalScenarios(
      jsonRequest("http://localhost/api/projects/import-local", {
        projectName: "Bad import",
        scenarios: []
      })
    );

    expect(importResponse.status).toBe(400);

    const listResponse = await listProjects();
    const listBody = (await listResponse.json()) as {
      projects?: unknown[];
    };

    expect(listBody.projects).toEqual([]);
  });

  it("rejects configured-auth project and proposal routes when no session cookie is present", async () => {
    configureAuth();

    const { POST: importLocalScenarios } = await import("../app/api/projects/import-local/route");
    const { GET: listProjects, POST: createProject } = await import("../app/api/projects/route");
    const { GET: readProject } = await import("../app/api/projects/[projectId]/route");
    const { POST: exportProposalPdf } = await import("../app/api/proposal-pdf/route");

    const listResponse = await listProjects();
    expect(listResponse.status).toBe(401);
    await expect(listResponse.json()).resolves.toMatchObject({
      error: "Authentication required.",
      ok: false
    });

    const createResponse = await createProject(
      jsonRequest("http://localhost/api/projects", {
        clientName: "Acme",
        name: "Configured auth project"
      })
    );
    expect(createResponse.status).toBe(401);

    const importResponse = await importLocalScenarios(
      jsonRequest("http://localhost/api/projects/import-local", makeLocalScenarioImportPayload())
    );
    expect(importResponse.status).toBe(401);

    const detailResponse = await readProject(
      new Request("http://localhost/api/projects/00000000-0000-4000-8000-000000000001"),
      {
        params: Promise.resolve({
          projectId: "00000000-0000-4000-8000-000000000001"
        })
      }
    );
    expect(detailResponse.status).toBe(401);

    const proposalResponse = await exportProposalPdf(
      jsonRequest("http://localhost/api/proposal-pdf?style=simple", makeProposalDocument())
    );
    expect(proposalResponse.status).toBe(401);
    await expect(proposalResponse.json()).resolves.toMatchObject({
      error: "Authentication required.",
      ok: false
    });
  }, 10000);

  it("allows an authenticated configured owner to create, list, and read only their project", async () => {
    signInConfiguredUser("alice@example.com");

    const { GET: listProjects, POST: createProject } = await import("../app/api/projects/route");
    const { GET: readProject } = await import("../app/api/projects/[projectId]/route");

    const createResponse = await createProject(
      jsonRequest("http://localhost/api/projects", {
        clientName: "Acme",
        description: "Configured auth smoke project",
        name: "Configured owner project"
      })
    );
    const createBody = (await createResponse.json()) as {
      project?: {
        id?: string;
        ownerLabel?: string;
      };
    };

    expect(createResponse.status).toBe(201);
    expect(createBody.project).toMatchObject({
      ownerLabel: "alice@example.com"
    });

    const listResponse = await listProjects();
    const listBody = (await listResponse.json()) as {
      projects?: Array<{
        id: string;
        ownerLabel: string;
      }>;
    };

    expect(listResponse.status).toBe(200);
    expect(listBody.projects).toEqual([
      expect.objectContaining({
        id: createBody.project!.id,
        ownerLabel: "alice@example.com"
      })
    ]);

    const detailResponse = await readProject(new Request(`http://localhost/api/projects/${createBody.project!.id}`), {
      params: Promise.resolve({
        projectId: createBody.project!.id!
      })
    });
    const detailBody = (await detailResponse.json()) as {
      project?: {
        id?: string;
        ownerLabel?: string;
      };
    };

    expect(detailResponse.status).toBe(200);
    expect(detailBody.project).toMatchObject({
      id: createBody.project!.id,
      ownerLabel: "alice@example.com"
    });
  });

  it("keeps preview projects isolated from configured-auth projects", async () => {
    const { POST: importLocalScenarios } = await import("../app/api/projects/import-local/route");
    const { GET: listProjects, POST: createProject } = await import("../app/api/projects/route");
    const { GET: readProject } = await import("../app/api/projects/[projectId]/route");

    const previewImportResponse = await importLocalScenarios(
      jsonRequest(
        "http://localhost/api/projects/import-local",
        makeLocalScenarioImportPayload({
          projectName: "Preview local import"
        })
      )
    );
    const previewImportBody = (await previewImportResponse.json()) as {
      project?: {
        id?: string;
      };
    };
    const previewProjectId = previewImportBody.project!.id!;

    signInConfiguredUser("alice@example.com");

    const configuredListResponse = await listProjects();
    const configuredListBody = (await configuredListResponse.json()) as {
      projects?: Array<{
        id: string;
      }>;
    };
    expect(configuredListBody.projects).toEqual([]);

    const previewDetailAsConfiguredResponse = await readProject(
      new Request(`http://localhost/api/projects/${previewProjectId}`),
      {
        params: Promise.resolve({
          projectId: previewProjectId
        })
      }
    );
    expect(previewDetailAsConfiguredResponse.status).toBe(404);

    const configuredCreateResponse = await createProject(
      jsonRequest("http://localhost/api/projects", {
        clientName: "Acme",
        name: "Configured isolated project"
      })
    );
    const configuredCreateBody = (await configuredCreateResponse.json()) as {
      project?: {
        id?: string;
      };
    };
    const configuredProjectId = configuredCreateBody.project!.id!;

    clearAuthConfiguration();

    const previewListResponse = await listProjects();
    const previewListBody = (await previewListResponse.json()) as {
      projects?: Array<{
        id: string;
      }>;
    };
    expect(previewListBody.projects).toEqual([
      expect.objectContaining({
        id: previewProjectId
      })
    ]);

    const configuredDetailAsPreviewResponse = await readProject(
      new Request(`http://localhost/api/projects/${configuredProjectId}`),
      {
        params: Promise.resolve({
          projectId: configuredProjectId
        })
      }
    );
    expect(configuredDetailAsPreviewResponse.status).toBe(404);
  });

  it("does not accept team-role route hints until membership storage exists", async () => {
    signInConfiguredUser("bob@example.com");

    const { POST: createProject } = await import("../app/api/projects/route");
    const { GET: readProject } = await import("../app/api/projects/[projectId]/route");

    const createResponse = await createProject(
      jsonRequest("http://localhost/api/projects", {
        clientName: "Acme",
        name: "Team-tagged owner project",
        teamId: "team_acme"
      })
    );
    const createBody = (await createResponse.json()) as {
      project?: {
        id?: string;
      };
    };
    const projectId = createBody.project!.id!;

    signInConfiguredUser("alice@example.com");

    const teamRoleReadResponse = await readProject(
      new Request(`http://localhost/api/projects/${projectId}`, {
        headers: {
          "x-dynecho-project-role": "editor",
          "x-dynecho-team-id": "team_acme"
        }
      }),
      {
        params: Promise.resolve({
          projectId
        })
      }
    );

    expect(teamRoleReadResponse.status).toBe(404);

    signInConfiguredUser("bob@example.com");

    const ownerReadResponse = await readProject(new Request(`http://localhost/api/projects/${projectId}`), {
      params: Promise.resolve({
        projectId
      })
    });
    const ownerReadBody = (await ownerReadResponse.json()) as {
      project?: {
        ownerLabel?: string;
        teamId?: string;
      };
    };

    expect(ownerReadResponse.status).toBe(200);
    expect(ownerReadBody.project).toMatchObject({
      ownerLabel: "bob@example.com",
      teamId: "team_acme"
    });
  });

  it("appends proposal audit events when a proposal export targets a server project", async () => {
    const { POST: importLocalScenarios } = await import("../app/api/projects/import-local/route");
    const { POST: exportProposalPdf } = await import("../app/api/proposal-pdf/route");
    const { GET: readProject } = await import("../app/api/projects/[projectId]/route");

    const importResponse = await importLocalScenarios(
      jsonRequest("http://localhost/api/projects/import-local", {
        clientName: "Acme",
        projectName: "Acme proposal audit",
        scenarios: [
          {
            inputSnapshot: {
              rows: [
                {
                  floorRole: "base_structure",
                  materialId: "concrete",
                  thicknessMm: "200"
                }
              ],
              schemaId: "dynecho.simple-workbench.snapshot.v1",
              studyMode: "floor"
            },
            name: "Audited floor option"
          }
        ]
      })
    );
    const importBody = (await importResponse.json()) as {
      importedScenarioIds?: string[];
      project?: {
        id?: string;
      };
    };
    const projectId = importBody.project!.id!;
    const scenarioId = importBody.importedScenarioIds![0]!;

    const exportResponse = await exportProposalPdf(
      jsonRequest(
        `http://localhost/api/proposal-pdf?style=simple&projectId=${projectId}`,
        makeProposalDocument({
          serverProjectId: projectId,
          serverProjectScenarioId: scenarioId
        })
      )
    );

    expect(exportResponse.status).toBe(200);
    expect(exportResponse.headers.get("content-type")).toBe("application/pdf");

    const detailResponse = await readProject(new Request(`http://localhost/api/projects/${projectId}`), {
      params: Promise.resolve({
        projectId
      })
    });
    const detailBody = (await detailResponse.json()) as {
      project?: {
        proposalAuditEvents?: Array<{
          format: string;
          scenarioIds: string[];
          source: string;
          style?: string;
        }>;
      };
    };

    expect(detailBody.project?.proposalAuditEvents).toEqual([
      expect.objectContaining({
        format: "pdf",
        scenarioIds: [scenarioId],
        source: "proposal_route",
        style: "simple"
      })
    ]);
  });

  it("rejects proposal audit appends against another owner project", async () => {
    const { POST: importLocalScenarios } = await import("../app/api/projects/import-local/route");
    const { POST: exportProposalPdf } = await import("../app/api/proposal-pdf/route");
    const { GET: readProject } = await import("../app/api/projects/[projectId]/route");

    const importResponse = await importLocalScenarios(
      jsonRequest(
        "http://localhost/api/projects/import-local",
        makeLocalScenarioImportPayload({
          projectName: "Preview proposal audit isolation"
        })
      )
    );
    const importBody = (await importResponse.json()) as {
      importedScenarioIds?: string[];
      project?: {
        id?: string;
      };
    };
    const projectId = importBody.project!.id!;
    const scenarioId = importBody.importedScenarioIds![0]!;

    signInConfiguredUser("alice@example.com");

    const exportResponse = await exportProposalPdf(
      jsonRequest(
        `http://localhost/api/proposal-pdf?style=simple&projectId=${projectId}`,
        makeProposalDocument({
          serverProjectId: projectId,
          serverProjectScenarioId: scenarioId
        })
      )
    );
    const exportBody = (await exportResponse.json()) as {
      code?: string;
      error?: string;
      ok?: boolean;
    };

    expect(exportResponse.status).toBe(404);
    expect(exportBody).toMatchObject({
      code: "project_not_found",
      error: "Project not found.",
      ok: false
    });

    clearAuthConfiguration();

    const detailResponse = await readProject(new Request(`http://localhost/api/projects/${projectId}`), {
      params: Promise.resolve({
        projectId
      })
    });
    const detailBody = (await detailResponse.json()) as {
      project?: {
        proposalAuditEvents?: unknown[];
      };
    };

    expect(detailResponse.status).toBe(200);
    expect(detailBody.project?.proposalAuditEvents).toEqual([]);
  });
});

import { Buffer } from "node:buffer";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SimpleWorkbenchProposalDocument } from "../features/workbench/simple-workbench-proposal";

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

function jsonRequest(url: string, payload: unknown) {
  return new Request(url, {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
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
  });

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

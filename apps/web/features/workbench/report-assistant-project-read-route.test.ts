import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { JsonValue } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildProjectOwnerId } from "../../lib/project-storage-auth";
import { FileServerProjectRepository, type ProjectOwnerScope } from "../../lib/server-project-storage";

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
      error?: string;
      ok: boolean;
    };

    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "Authentication required.",
      ok: false
    });
  });

  it("rejects unsupported actions before calling project storage", async () => {
    const { POST } = await import("../../app/api/report-assistant/project-read/route");

    const response = await POST(routeRequest({ action: "save_report" }));
    const body = (await response.json()) as {
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
  });

  it("returns read-only summary payloads without full saved report or assembly bodies", async () => {
    const seeded = await seedProject();
    const { POST } = await import("../../app/api/report-assistant/project-read/route");

    const response = await POST(routeRequest({ action: "read_project_summary", projectId: seeded.project.id }));
    const body = (await response.json()) as {
      action?: string;
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
    expect(JSON.stringify(body)).not.toContain("ROUTE_PRIVATE_REPORT_DOCUMENT_BODY");
    expect(JSON.stringify(body)).not.toContain("ROUTE_PRIVATE_ASSEMBLY_SNAPSHOT");
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
    expect(await reportResponse.json()).toMatchObject({
      action: "read_project_report_document",
      mutates: false,
      ok: true,
      result: {
        document: {
          executiveSummary: "ROUTE_PRIVATE_REPORT_DOCUMENT_BODY"
        }
      }
    });
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
      "read_project_report_document",
      "preview_report_patch"
    ]));
    expect(body.status?.tools.map((tool) => tool.name)).not.toContain("save_report");
    expect(body.status?.tools.map((tool) => tool.name)).not.toContain("apply_report_patch");
  });
});

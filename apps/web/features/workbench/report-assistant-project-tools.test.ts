import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { JsonValue } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { FileServerProjectRepository, type ProjectOwnerScope } from "../../lib/server-project-storage";
import {
  REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS,
  runReportAssistantProjectReadTool
} from "./report-assistant-project-tools";

const OWNER_A: ProjectOwnerScope = {
  authMode: "preview",
  ownerId: "preview_owner_a",
  ownerLabel: "Owner A"
};
const OWNER_B: ProjectOwnerScope = {
  authMode: "preview",
  ownerId: "preview_owner_b",
  ownerLabel: "Owner B"
};
const VALID_MISSING_PROJECT_ID = "00000000-0000-4000-8000-00000000ffff";

let tempDirs: string[] = [];

function createIdFactory() {
  let nextId = 1;

  return () => {
    const id = `00000000-0000-4000-8000-${String(nextId).padStart(12, "0")}`;
    nextId += 1;
    return id;
  };
}

async function makeRepository() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "dynecho-assistant-project-tools-"));
  tempDirs.push(tempDir);

  return new FileServerProjectRepository({
    baseDir: tempDir,
    idFactory: createIdFactory(),
    now: () => new Date("2026-06-15T09:00:00.000Z")
  });
}

const ASSEMBLY_SNAPSHOT: JsonValue = {
  layers: [
    {
      materialId: "custom_assistant_private_snapshot",
      thicknessMm: "42"
    }
  ],
  privateMarker: "PRIVATE_ASSEMBLY_SNAPSHOT"
};

const REPORT_DOCUMENT = {
  executiveSummary: "PRIVATE_REPORT_DOCUMENT_BODY",
  metrics: [
    {
      label: "Rw",
      value: "61 dB"
    }
  ],
  projectName: "Assistant visible project"
} satisfies JsonValue;

async function seedProject(repository: FileServerProjectRepository, owner: ProjectOwnerScope, name = "Assistant visible project") {
  const project = await repository.createProject(owner, {
    clientName: "Machinity Acoustics",
    name
  });
  const withAssembly = await repository.appendAssembly(owner, project.id, {
    calculationSummary: {
      primaryOutput: "Rw",
      primaryValueLabel: "61 dB",
      selectedOutputs: ["Rw", "STC"],
      status: "ready"
    },
    kind: "wall",
    name: "Wall option A",
    snapshot: ASSEMBLY_SNAPSHOT
  });
  const assembly = withAssembly.assemblies[0]!;
  const withReport = await repository.appendReport(owner, project.id, {
    assemblyId: assembly.id,
    name: "Client review report",
    reportDocument: REPORT_DOCUMENT,
    sourceAssemblySnapshot: ASSEMBLY_SNAPSHOT,
    sourceCalculationOutput: {
      ok: true,
      privateMarker: "PRIVATE_CALCULATION_OUTPUT"
    },
    sourceMaterialSnapshot: {
      customMaterials: [],
      materialVisualOverrides: []
    }
  });
  const report = withReport.reports[0]!;
  const withRevision = await repository.appendReportRevision(owner, project.id, report.id, {
    assistantPatchSummary: {
      appliedAtIso: "2026-06-15T09:15:00.000Z",
      instruction: "Clarify the executive summary.",
      operationCount: 1,
      validationStatus: "valid"
    },
    changeSummary: "Assistant clarified the executive summary.",
    document: {
      ...REPORT_DOCUMENT,
      executiveSummary: "PRIVATE_REPORT_REVISION_BODY"
    },
    expectedReportUpdatedAtIso: report.updatedAtIso,
    source: "assistant"
  });

  return {
    assembly: withRevision.assemblies[0]!,
    project: withRevision,
    report: withRevision.reports[0]!,
    revision: withRevision.reports[0]!.revisions[1]!
  };
}

beforeEach(() => {
  tempDirs = [];
});

afterEach(async () => {
  await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })));
  tempDirs = [];
});

describe("report assistant project read tools", () => {
  it("declares only read-only project visibility tools", () => {
    expect(REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS.every((tool) => tool.mutates === false)).toBe(true);
    expect(REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS.map((tool) => tool.name)).toEqual([
      "list_projects",
      "read_project_summary",
      "list_project_assemblies",
      "read_project_assembly_snapshot",
      "list_project_reports",
      "read_project_report_document",
      "list_project_report_revisions",
      "read_project_report_revision"
    ]);
    expect(REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS.map((tool) => tool.name)).not.toContain("save_report");
    expect(REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS.map((tool) => tool.name)).not.toContain("apply_report_patch");
  });

  it("lists only owner-scoped project summaries", async () => {
    const repository = await makeRepository();
    const ownerAProject = await seedProject(repository, OWNER_A, "Owner A project");
    await seedProject(repository, OWNER_B, "Owner B project");

    const result = await runReportAssistantProjectReadTool({
      name: "list_projects",
      owner: OWNER_A,
      repository
    });

    expect(result).toMatchObject({
      mutates: false,
      ok: true,
      result: {
        projects: [
          expect.objectContaining({
            assemblyCount: 1,
            id: ownerAProject.project.id,
            name: "Owner A project",
            reportCount: 1
          })
        ]
      }
    });
    expect(JSON.stringify(result)).not.toContain("Owner B project");
    expect(JSON.stringify(result)).not.toContain("PRIVATE_REPORT_DOCUMENT_BODY");
    expect(JSON.stringify(result)).not.toContain("PRIVATE_ASSEMBLY_SNAPSHOT");
  });

  it("keeps list actions summary-first and excludes full report/snapshot bodies", async () => {
    const repository = await makeRepository();
    const seeded = await seedProject(repository, OWNER_A);

    const assemblies = await runReportAssistantProjectReadTool({
      name: "list_project_assemblies",
      owner: OWNER_A,
      projectId: seeded.project.id,
      repository
    });
    const reports = await runReportAssistantProjectReadTool({
      name: "list_project_reports",
      owner: OWNER_A,
      projectId: seeded.project.id,
      repository
    });
    const revisions = await runReportAssistantProjectReadTool({
      name: "list_project_report_revisions",
      owner: OWNER_A,
      projectId: seeded.project.id,
      reportId: seeded.report.id,
      repository
    });

    expect(assemblies).toMatchObject({
      ok: true,
      result: {
        assemblies: [
          expect.objectContaining({
            calculationSummary: expect.objectContaining({
              primaryOutput: "Rw"
            }),
            displayCode: "ASM-0001",
            id: seeded.assembly.id,
            name: "Wall option A"
          })
        ]
      }
    });
    expect(reports).toMatchObject({
      ok: true,
      result: {
        reports: [
          expect.objectContaining({
            assemblyId: seeded.assembly.id,
            currentRevisionId: seeded.report.currentRevisionId,
            displayCode: "RPT-0001",
            id: seeded.report.id,
            revisionCount: 2,
            status: "draft"
          })
        ]
      }
    });
    expect(revisions).toMatchObject({
      ok: true,
      result: {
        revisions: [
          expect.objectContaining({
            displayCode: "REV-0001",
            source: "generated"
          }),
          expect.objectContaining({
            assistantPatchSummary: expect.objectContaining({
              operationCount: 1,
              validationStatus: "valid"
            }),
            changeSummary: "Assistant clarified the executive summary.",
            displayCode: "REV-0002",
            source: "assistant"
          })
        ]
      }
    });
    expect(JSON.stringify([assemblies, reports, revisions])).not.toContain("PRIVATE_REPORT_DOCUMENT_BODY");
    expect(JSON.stringify([assemblies, reports, revisions])).not.toContain("PRIVATE_REPORT_REVISION_BODY");
    expect(JSON.stringify([assemblies, reports, revisions])).not.toContain("PRIVATE_ASSEMBLY_SNAPSHOT");
  });

  it("requires project and child ids for project-bound reads", async () => {
    const repository = await makeRepository();
    const missingProject = await runReportAssistantProjectReadTool({
      name: "read_project_summary",
      owner: OWNER_A,
      repository
    });
    const missingAssembly = await runReportAssistantProjectReadTool({
      name: "read_project_assembly_snapshot",
      owner: OWNER_A,
      projectId: VALID_MISSING_PROJECT_ID,
      repository
    });
    const missingReport = await runReportAssistantProjectReadTool({
      name: "read_project_report_document",
      owner: OWNER_A,
      projectId: VALID_MISSING_PROJECT_ID,
      repository
    });

    expect(missingProject).toMatchObject({
      code: "missing_project_id",
      mutates: false,
      ok: false,
      statusCode: 400
    });
    expect(missingAssembly).toMatchObject({
      code: "missing_assembly_id",
      mutates: false,
      ok: false,
      statusCode: 400
    });
    expect(missingReport).toMatchObject({
      code: "missing_report_id",
      mutates: false,
      ok: false,
      statusCode: 400
    });
  });

  it("normalizes missing and wrong-owner project reads to the same not-found posture", async () => {
    const repository = await makeRepository();
    const ownerBProject = await seedProject(repository, OWNER_B, "Wrong owner project");

    const wrongOwner = await runReportAssistantProjectReadTool({
      name: "read_project_summary",
      owner: OWNER_A,
      projectId: ownerBProject.project.id,
      repository
    });
    const missing = await runReportAssistantProjectReadTool({
      name: "read_project_summary",
      owner: OWNER_A,
      projectId: VALID_MISSING_PROJECT_ID,
      repository
    });

    expect(wrongOwner).toMatchObject({
      code: "project_not_found",
      errors: ["Project not found."],
      mutates: false,
      ok: false,
      statusCode: 404
    });
    expect(missing).toEqual(wrongOwner);
  });

  it("returns full saved document or snapshot only for explicit child reads", async () => {
    const repository = await makeRepository();
    const seeded = await seedProject(repository, OWNER_A);

    const assembly = await runReportAssistantProjectReadTool({
      assemblyId: seeded.assembly.id,
      name: "read_project_assembly_snapshot",
      owner: OWNER_A,
      projectId: seeded.project.id,
      repository
    });
    const currentReport = await runReportAssistantProjectReadTool({
      name: "read_project_report_document",
      owner: OWNER_A,
      projectId: seeded.project.id,
      reportId: seeded.report.id,
      repository
    });
    const revision = await runReportAssistantProjectReadTool({
      name: "read_project_report_revision",
      owner: OWNER_A,
      projectId: seeded.project.id,
      reportId: seeded.report.id,
      repository,
      revisionId: seeded.revision.id
    });

    expect(assembly).toMatchObject({
      ok: true,
      result: {
        assembly: expect.objectContaining({
          id: seeded.assembly.id
        }),
        snapshot: expect.objectContaining({
          privateMarker: "PRIVATE_ASSEMBLY_SNAPSHOT"
        })
      }
    });
    expect(currentReport).toMatchObject({
      ok: true,
      result: {
        document: expect.objectContaining({
          executiveSummary: "PRIVATE_REPORT_REVISION_BODY"
        }),
        report: expect.objectContaining({
          currentRevisionId: seeded.revision.id,
          id: seeded.report.id
        }),
        revision: expect.objectContaining({
          displayCode: "REV-0002",
          id: seeded.revision.id
        })
      }
    });
    expect(revision).toMatchObject({
      ok: true,
      result: {
        document: expect.objectContaining({
          executiveSummary: "PRIVATE_REPORT_REVISION_BODY"
        }),
        revision: expect.objectContaining({
          assistantPatchSummary: expect.objectContaining({
            operationCount: 1
          }),
          id: seeded.revision.id,
          source: "assistant"
        })
      }
    });
  });
});

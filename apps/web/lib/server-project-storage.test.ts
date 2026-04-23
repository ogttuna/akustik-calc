import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { resolveProjectOwnerScope } from "./project-storage-auth";
import {
  FileServerProjectRepository,
  MAX_IMPORTED_LOCAL_SCENARIOS,
  MAX_SCENARIO_SNAPSHOT_BYTES,
  ServerProjectStorageError,
  type ProjectOwnerScope
} from "./server-project-storage";

const OWNER_A: ProjectOwnerScope = {
  authMode: "configured",
  ownerId: "configured_owner_a",
  ownerLabel: "Consultant A"
};

const OWNER_B: ProjectOwnerScope = {
  authMode: "configured",
  ownerId: "configured_owner_b",
  ownerLabel: "Consultant B"
};

const FIXED_NOW = new Date("2026-04-23T12:00:00.000Z");

let tempDirs: string[] = [];

async function makeTempStoreDir() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "dynecho-project-store-"));
  tempDirs.push(tempDir);
  return tempDir;
}

afterEach(async () => {
  await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })));
  tempDirs = [];
});

describe("server project storage", () => {
  it("imports browser-local scenarios as versioned server-backed project snapshots", async () => {
    const repository = new FileServerProjectRepository({
      baseDir: await makeTempStoreDir(),
      now: () => FIXED_NOW
    });

    const project = await repository.importLocalScenarios(OWNER_A, {
      clientName: "Acme Towers",
      projectName: "Acme party wall options",
      scenarios: [
        {
          inputSnapshot: {
            requestedOutputs: ["Rw", "DnT,w"],
            rows: [
              {
                materialId: "concrete",
                thicknessMm: "180"
              }
            ],
            studyMode: "wall"
          },
          localScenarioId: "local-wall-1",
          name: "Wall option A",
          outputSnapshot: {
            metrics: {
              estimatedDnTwDb: 54,
              estimatedRwDb: 58
            },
            warnings: []
          },
          savedAtIso: "2026-04-23T11:55:00.000Z"
        }
      ]
    });

    expect(project.schemaVersion).toBe(1);
    expect(project.name).toBe("Acme party wall options");
    expect(project.clientName).toBe("Acme Towers");
    expect(project.ownerId).toBe(OWNER_A.ownerId);
    expect(project.scenarioSnapshots).toHaveLength(1);
    expect(project.scenarioSnapshots[0]).toMatchObject({
      capturedAtIso: FIXED_NOW.toISOString(),
      importedLocalScenarioId: "local-wall-1",
      name: "Wall option A",
      savedAtIso: "2026-04-23T11:55:00.000Z",
      source: "browser_local_import",
      version: 1
    });
    expect(project.scenarioSnapshots[0]?.calculatorInput.schemaVersion).toBe(1);
    expect(project.scenarioSnapshots[0]?.calculatorOutput?.schemaVersion).toBe(1);
    expect(project.scenarioSnapshots[0]?.checksumSha256).toMatch(/^[a-f0-9]{64}$/u);

    const reloaded = await repository.readProject(OWNER_A, project.id);
    expect(reloaded?.scenarioSnapshots[0]?.calculatorInput.payload).toEqual(project.scenarioSnapshots[0]?.calculatorInput.payload);

    await repository.appendProposalAuditEvent(OWNER_A, project.id, {
      format: "pdf",
      scenarioIds: [project.scenarioSnapshots[0]!.id],
      source: "proposal_route",
      style: "branded"
    });

    const summaries = await repository.listProjects(OWNER_A);
    expect(summaries).toEqual([
      expect.objectContaining({
        id: project.id,
        latestScenarioCapturedAtIso: FIXED_NOW.toISOString(),
        name: "Acme party wall options",
        ownerLabel: OWNER_A.ownerLabel,
        proposalAuditEventCount: 1,
        scenarioCount: 1
      })
    ]);
  });

  it("keeps project reads and list results scoped to the authenticated owner", async () => {
    const repository = new FileServerProjectRepository({
      baseDir: await makeTempStoreDir(),
      now: () => FIXED_NOW
    });
    const project = await repository.createProject(OWNER_A, {
      name: "Owner A project"
    });

    expect(await repository.readProject(OWNER_A, project.id)).not.toBeNull();
    expect(await repository.readProject(OWNER_B, project.id)).toBeNull();
    expect(await repository.listProjects(OWNER_B)).toEqual([]);
  });

  it("rejects oversized or over-broad browser-local imports before writing project records", async () => {
    const repository = new FileServerProjectRepository({
      baseDir: await makeTempStoreDir(),
      now: () => FIXED_NOW
    });
    const scenario = {
      inputSnapshot: {
        rows: [],
        studyMode: "floor"
      },
      name: "Floor option",
      outputSnapshot: null
    };

    await expect(
      repository.importLocalScenarios(OWNER_A, {
        projectName: "Too many",
        scenarios: Array.from({ length: MAX_IMPORTED_LOCAL_SCENARIOS + 1 }, () => scenario)
      })
    ).rejects.toMatchObject({
      code: "too_many_scenarios",
      statusCode: 400
    });

    await expect(
      repository.importLocalScenarios(OWNER_A, {
        projectName: "Too large",
        scenarios: [
          {
            inputSnapshot: {
              note: "x".repeat(MAX_SCENARIO_SNAPSHOT_BYTES + 1)
            },
            name: "Large option"
          }
        ]
      })
    ).rejects.toMatchObject({
      code: "scenario_snapshot_too_large",
      statusCode: 413
    });
  });

  it("keeps the project owner scope explicit for configured and preview auth states", () => {
    const configured = resolveProjectOwnerScope({
      configured: true,
      session: {
        expiresAt: Date.now() + 1000,
        username: "Consultant"
      }
    });
    const preview = resolveProjectOwnerScope({
      configured: false,
      missingKeys: ["DYNECHO_AUTH_USERNAME"],
      session: {
        expiresAt: Number.MAX_SAFE_INTEGER,
        username: "Preview mode"
      }
    });
    const missingSession = resolveProjectOwnerScope({
      configured: true,
      session: null
    });

    expect(configured).toMatchObject({
      ok: true,
      scope: {
        authMode: "configured",
        ownerLabel: "Consultant"
      }
    });
    expect(preview).toMatchObject({
      ok: true,
      scope: {
        authMode: "preview",
        ownerLabel: "Preview mode"
      }
    });
    expect(configured.ok && preview.ok ? configured.scope.ownerId : "").not.toBe(preview.ok ? preview.scope.ownerId : "");
    expect(missingSession).toEqual({
      error: "Authentication required.",
      ok: false,
      status: 401
    });
  });

  it("surfaces invalid project ids as request errors instead of path traversal", async () => {
    const repository = new FileServerProjectRepository({
      baseDir: await makeTempStoreDir(),
      now: () => FIXED_NOW
    });

    await expect(repository.readProject(OWNER_A, "../not-a-project")).rejects.toBeInstanceOf(ServerProjectStorageError);
  });
});

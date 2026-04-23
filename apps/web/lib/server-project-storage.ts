import { Buffer } from "node:buffer";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  SERVER_PROJECT_CALCULATOR_SNAPSHOT_SCHEMA_VERSION,
  SERVER_PROJECT_SCHEMA_VERSION,
  ServerProjectRecordSchema,
  type ServerProjectCreateRequest,
  type ServerProjectImportLocalRequest,
  type ServerProjectLocalScenarioImport,
  type ServerProjectProposalAuditEvent,
  type ServerProjectRecord,
  type ServerProjectScenarioSnapshot
} from "@dynecho/shared";

export const DEFAULT_SERVER_PROJECT_STORE_DIR = ".dynecho/project-store";
export const MAX_IMPORTED_LOCAL_SCENARIOS = 8;
export const MAX_PROJECT_SCENARIOS = 50;
export const MAX_SCENARIO_SNAPSHOT_BYTES = 500_000;

export type ProjectOwnerScope = {
  authMode: "configured" | "preview";
  ownerId: string;
  ownerLabel: string;
};

export type ServerProjectSummary = {
  clientName?: string;
  createdAtIso: string;
  id: string;
  latestScenarioCapturedAtIso: string | null;
  name: string;
  ownerLabel: string;
  proposalAuditEventCount: number;
  scenarioCount: number;
  updatedAtIso: string;
};

export class ServerProjectStorageError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly statusCode: number
  ) {
    super(message);
    this.name = "ServerProjectStorageError";
  }
}

type FileServerProjectRepositoryOptions = {
  baseDir?: string;
  idFactory?: () => string;
  now?: () => Date;
};

export function getServerProjectStoreDir(env: NodeJS.ProcessEnv = process.env): string {
  const configuredDir = env.DYNECHO_PROJECT_STORE_DIR?.trim();
  return configuredDir && configuredDir.length > 0
    ? configuredDir
    : path.join(process.cwd(), DEFAULT_SERVER_PROJECT_STORE_DIR);
}

export function summarizeServerProject(project: ServerProjectRecord): ServerProjectSummary {
  const latestScenario = project.scenarioSnapshots.reduce<ServerProjectScenarioSnapshot | null>((latest, scenario) => {
    if (!latest || scenario.capturedAtIso > latest.capturedAtIso) {
      return scenario;
    }

    return latest;
  }, null);

  return {
    clientName: project.clientName,
    createdAtIso: project.createdAtIso,
    id: project.id,
    latestScenarioCapturedAtIso: latestScenario?.capturedAtIso ?? null,
    name: project.name,
    ownerLabel: project.ownerLabel,
    proposalAuditEventCount: project.proposalAuditEvents.length,
    scenarioCount: project.scenarioSnapshots.length,
    updatedAtIso: project.updatedAtIso
  };
}

function assertSafeProjectId(projectId: string): void {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(projectId)) {
    throw new ServerProjectStorageError("Invalid project id.", "invalid_project_id", 400);
  }
}

function encodeJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function jsonSizeBytes(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value), "utf8");
}

function checksumJson(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function mapNodeReadError(error: unknown): null {
  if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
    return null;
  }

  throw error;
}

export class FileServerProjectRepository {
  private readonly baseDir: string;
  private readonly idFactory: () => string;
  private readonly now: () => Date;

  constructor(options: FileServerProjectRepositoryOptions = {}) {
    this.baseDir = options.baseDir ?? getServerProjectStoreDir();
    this.idFactory = options.idFactory ?? randomUUID;
    this.now = options.now ?? (() => new Date());
  }

  async createProject(owner: ProjectOwnerScope, input: ServerProjectCreateRequest): Promise<ServerProjectRecord> {
    const nowIso = this.now().toISOString();
    const project: ServerProjectRecord = {
      clientName: input.clientName,
      createdAtIso: nowIso,
      description: input.description,
      id: this.idFactory(),
      name: input.name,
      ownerId: owner.ownerId,
      ownerLabel: owner.ownerLabel,
      proposalAuditEvents: [],
      scenarioSnapshots: [],
      schemaVersion: SERVER_PROJECT_SCHEMA_VERSION,
      teamId: input.teamId,
      updatedAtIso: nowIso
    };

    await this.writeProject(project);

    return project;
  }

  async importLocalScenarios(owner: ProjectOwnerScope, input: ServerProjectImportLocalRequest): Promise<ServerProjectRecord> {
    if (input.scenarios.length === 0 || input.scenarios.length > MAX_IMPORTED_LOCAL_SCENARIOS) {
      throw new ServerProjectStorageError(
        `Import accepts 1-${MAX_IMPORTED_LOCAL_SCENARIOS} local scenarios per request.`,
        "too_many_scenarios",
        400
      );
    }

    const projectName = input.projectName ?? input.scenarios[0]?.name ?? "Imported local scenarios";
    const project = await this.createProject(owner, {
      clientName: input.clientName,
      name: projectName
    });

    const capturedAtIso = this.now().toISOString();
    const scenarioSnapshots = input.scenarios.map((scenario, index) =>
      this.buildImportedScenarioSnapshot({
        capturedAtIso,
        index,
        projectId: project.id,
        scenario
      })
    );

    const updatedProject: ServerProjectRecord = {
      ...project,
      scenarioSnapshots,
      updatedAtIso: capturedAtIso
    };

    await this.writeProject(updatedProject);

    return updatedProject;
  }

  async listProjects(owner: ProjectOwnerScope): Promise<ServerProjectSummary[]> {
    const projectDir = this.ownerProjectDir(owner.ownerId);
    let entries;

    try {
      entries = await readdir(projectDir, {
        withFileTypes: true
      });
    } catch (error) {
      mapNodeReadError(error);
      return [];
    }

    const projects = await Promise.all(
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
        .map(async (entry) => this.readProjectByPath(path.join(projectDir, entry.name)))
    );

    return projects
      .filter((project): project is ServerProjectRecord => project !== null && project.ownerId === owner.ownerId)
      .map((project) => summarizeServerProject(project))
      .sort((left, right) => right.updatedAtIso.localeCompare(left.updatedAtIso));
  }

  async readProject(owner: ProjectOwnerScope, projectId: string): Promise<ServerProjectRecord | null> {
    assertSafeProjectId(projectId);

    const project = await this.readProjectByPath(this.projectPath(owner.ownerId, projectId));

    if (!project || project.ownerId !== owner.ownerId) {
      return null;
    }

    return project;
  }

  async appendProposalAuditEvent(
    owner: ProjectOwnerScope,
    projectId: string,
    input: Omit<ServerProjectProposalAuditEvent, "createdAtIso" | "id" | "projectId">
  ): Promise<ServerProjectRecord> {
    const project = await this.readProject(owner, projectId);

    if (!project) {
      throw new ServerProjectStorageError("Project not found.", "project_not_found", 404);
    }

    const nowIso = this.now().toISOString();
    const event: ServerProjectProposalAuditEvent = {
      ...input,
      createdAtIso: nowIso,
      id: this.idFactory(),
      projectId
    };
    const updatedProject: ServerProjectRecord = {
      ...project,
      proposalAuditEvents: [...project.proposalAuditEvents, event],
      updatedAtIso: nowIso
    };

    await this.writeProject(updatedProject);

    return updatedProject;
  }

  private buildImportedScenarioSnapshot(args: {
    capturedAtIso: string;
    index: number;
    projectId: string;
    scenario: ServerProjectLocalScenarioImport;
  }): ServerProjectScenarioSnapshot {
    const { capturedAtIso, index, projectId, scenario } = args;
    const payloadBytes = jsonSizeBytes({
      inputSnapshot: scenario.inputSnapshot,
      outputSnapshot: scenario.outputSnapshot ?? null
    });

    if (payloadBytes > MAX_SCENARIO_SNAPSHOT_BYTES) {
      throw new ServerProjectStorageError(
        `Scenario snapshot exceeds ${MAX_SCENARIO_SNAPSHOT_BYTES} bytes.`,
        "scenario_snapshot_too_large",
        413
      );
    }

    const name = scenario.name ?? `Imported scenario ${String(index + 1).padStart(2, "0")}`;
    const savedAtIso = scenario.savedAtIso ?? capturedAtIso;
    const calculatorInput = {
      payload: scenario.inputSnapshot,
      schemaVersion: SERVER_PROJECT_CALCULATOR_SNAPSHOT_SCHEMA_VERSION
    } as const;
    const calculatorOutput =
      scenario.outputSnapshot === undefined
        ? null
        : ({
            payload: scenario.outputSnapshot,
            schemaVersion: SERVER_PROJECT_CALCULATOR_SNAPSHOT_SCHEMA_VERSION
          } as const);

    return {
      calculatorInput,
      calculatorOutput,
      capturedAtIso,
      checksumSha256: checksumJson({
        calculatorInput,
        calculatorOutput,
        importedLocalScenarioId: scenario.localScenarioId,
        name,
        savedAtIso
      }),
      id: this.idFactory(),
      importedLocalScenarioId: scenario.localScenarioId,
      name,
      projectId,
      savedAtIso,
      source: "browser_local_import",
      version: 1
    };
  }

  private ownerProjectDir(ownerId: string): string {
    return path.join(this.baseDir, "owners", ownerId, "projects");
  }

  private projectPath(ownerId: string, projectId: string): string {
    return path.join(this.ownerProjectDir(ownerId), `${projectId}.json`);
  }

  private async readProjectByPath(projectPath: string): Promise<ServerProjectRecord | null> {
    let raw: string;

    try {
      raw = await readFile(projectPath, "utf8");
    } catch (error) {
      mapNodeReadError(error);
      return null;
    }

    const parsed = ServerProjectRecordSchema.safeParse(JSON.parse(raw) as unknown);

    if (!parsed.success) {
      throw new ServerProjectStorageError("Stored project record failed schema validation.", "invalid_stored_project", 500);
    }

    return parsed.data;
  }

  private async writeProject(project: ServerProjectRecord): Promise<void> {
    const parsed = ServerProjectRecordSchema.safeParse(project);

    if (!parsed.success) {
      throw new ServerProjectStorageError("Project record failed schema validation before write.", "invalid_project_record", 500);
    }

    const projectDir = this.ownerProjectDir(project.ownerId);
    await mkdir(projectDir, {
      recursive: true
    });

    const projectPath = this.projectPath(project.ownerId, project.id);
    const tempPath = `${projectPath}.${process.pid}.${this.idFactory()}.tmp`;
    await writeFile(tempPath, `${encodeJson(parsed.data)}\n`, "utf8");
    await rename(tempPath, projectPath);
  }
}

export function createDefaultServerProjectRepository(): FileServerProjectRepository {
  return new FileServerProjectRepository();
}

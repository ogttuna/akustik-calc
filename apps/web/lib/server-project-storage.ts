import { Buffer } from "node:buffer";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  SERVER_PROJECT_CALCULATOR_SNAPSHOT_SCHEMA_VERSION,
  SERVER_PROJECT_SCHEMA_VERSION,
  ServerProjectRecordSchema,
  type ServerProjectAssemblyRecord,
  type ServerProjectCreateAssemblyRequest,
  type ServerProjectCreateRequest,
  type ServerProjectCreateReportRequest,
  type ServerProjectCreateReportRevisionRequest,
  type ServerProjectDuplicateAssemblyRequest,
  type ServerProjectDuplicateReportRequest,
  type ServerProjectImportLocalRequest,
  type ServerProjectLocalScenarioImport,
  type ServerProjectProposalAuditEvent,
  type ServerProjectRecord,
  type ServerProjectReportRecord,
  type ServerProjectReportRevisionRecord,
  type ServerProjectScenarioSnapshot,
  type ServerProjectUpdateAssemblyRequest,
  type ServerProjectUpdateReportRequest
} from "@dynecho/shared";

export const DEFAULT_SERVER_PROJECT_STORE_DIR = ".dynecho/project-store";
export const MAX_IMPORTED_LOCAL_SCENARIOS = 8;
export const MAX_PROJECT_SCENARIOS = 50;
export const MAX_SCENARIO_SNAPSHOT_BYTES = 500_000;
export const MAX_PROJECT_ASSEMBLIES = 120;
export const MAX_PROJECT_REPORTS = 120;
export const MAX_PROJECT_REPORT_REVISIONS = 100;
export const MAX_PROJECT_ASSEMBLY_BYTES = 500_000;
export const MAX_PROJECT_REPORT_BYTES = 750_000;
const MAX_PROJECT_CHILD_NAME_LENGTH = 160;
const COPY_NAME_PREFIX = "Copy of ";

export type ProjectOwnerScope = {
  authMode: "configured" | "preview";
  ownerId: string;
  ownerLabel: string;
};

export type ServerProjectSummary = {
  clientName?: string;
  createdAtIso: string;
  id: string;
  assemblyCount: number;
  latestAssemblyUpdatedAtIso: string | null;
  latestReportUpdatedAtIso: string | null;
  latestScenarioCapturedAtIso: string | null;
  name: string;
  ownerLabel: string;
  proposalAuditEventCount: number;
  reportCount: number;
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

  const latestAssembly = project.assemblies.reduce<ServerProjectAssemblyRecord | null>((latest, assembly) => {
    if (!latest || assembly.updatedAtIso > latest.updatedAtIso) {
      return assembly;
    }

    return latest;
  }, null);
  const latestReport = project.reports.reduce<ServerProjectReportRecord | null>((latest, report) => {
    if (!latest || report.updatedAtIso > latest.updatedAtIso) {
      return report;
    }

    return latest;
  }, null);

  return {
    assemblyCount: project.assemblies.length,
    clientName: project.clientName,
    createdAtIso: project.createdAtIso,
    id: project.id,
    latestAssemblyUpdatedAtIso: latestAssembly?.updatedAtIso ?? null,
    latestReportUpdatedAtIso: latestReport?.updatedAtIso ?? null,
    latestScenarioCapturedAtIso: latestScenario?.capturedAtIso ?? null,
    name: project.name,
    ownerLabel: project.ownerLabel,
    proposalAuditEventCount: project.proposalAuditEvents.length,
    reportCount: project.reports.length,
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

function formatDisplayCode(prefix: "ASM" | "REV" | "RPT", index: number): string {
  return `${prefix}-${String(index).padStart(4, "0")}`;
}

function truncateProjectChildName(name: string): string {
  const trimmedName = name.trim();
  if (trimmedName.length <= MAX_PROJECT_CHILD_NAME_LENGTH) {
    return trimmedName;
  }

  const truncatedName = trimmedName.slice(0, MAX_PROJECT_CHILD_NAME_LENGTH);
  const lastCharCode = truncatedName.charCodeAt(truncatedName.length - 1);

  return lastCharCode >= 0xd800 && lastCharCode <= 0xdbff ? truncatedName.slice(0, -1) : truncatedName;
}

function formatDuplicateProjectChildName(name: string): string {
  return truncateProjectChildName(`${COPY_NAME_PREFIX}${name}`);
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
      assemblies: [],
      clientName: input.clientName,
      createdAtIso: nowIso,
      description: input.description,
      id: this.idFactory(),
      name: input.name,
      ownerId: owner.ownerId,
      ownerLabel: owner.ownerLabel,
      proposalAuditEvents: [],
      reports: [],
      scenarioSnapshots: [],
      schemaVersion: SERVER_PROJECT_SCHEMA_VERSION,
      teamId: input.teamId,
      updatedAtIso: nowIso
    };

    await this.writeProject(project);

    return project;
  }

  async appendAssembly(
    owner: ProjectOwnerScope,
    projectId: string,
    input: ServerProjectCreateAssemblyRequest
  ): Promise<ServerProjectRecord> {
    const project = await this.readProject(owner, projectId);

    if (!project) {
      throw new ServerProjectStorageError("Project not found.", "project_not_found", 404);
    }
    if (project.assemblies.length >= MAX_PROJECT_ASSEMBLIES) {
      throw new ServerProjectStorageError(
        `Project can store at most ${MAX_PROJECT_ASSEMBLIES} assemblies.`,
        "too_many_project_assemblies",
        400
      );
    }
    if (jsonSizeBytes(input.snapshot) > MAX_PROJECT_ASSEMBLY_BYTES) {
      throw new ServerProjectStorageError(
        `Project assembly snapshot exceeds ${MAX_PROJECT_ASSEMBLY_BYTES} bytes.`,
        "project_assembly_too_large",
        413
      );
    }

    const nowIso = this.now().toISOString();
    const assembly: ServerProjectAssemblyRecord = {
      calculationSummary: input.calculationSummary,
      createdAtIso: nowIso,
      description: input.description,
      displayCode: formatDisplayCode("ASM", project.assemblies.length + 1),
      id: this.idFactory(),
      kind: input.kind,
      name: input.name,
      projectId,
      snapshot: input.snapshot,
      source: "workbench_v2",
      updatedAtIso: nowIso,
      version: 1
    };
    const updatedProject: ServerProjectRecord = {
      ...project,
      assemblies: [...project.assemblies, assembly],
      updatedAtIso: nowIso
    };

    await this.writeProject(updatedProject);

    return updatedProject;
  }

  async updateAssembly(
    owner: ProjectOwnerScope,
    projectId: string,
    assemblyId: string,
    input: ServerProjectUpdateAssemblyRequest
  ): Promise<ServerProjectRecord> {
    const project = await this.readProject(owner, projectId);

    if (!project) {
      throw new ServerProjectStorageError("Project not found.", "project_not_found", 404);
    }

    const assembly = project.assemblies.find((entry) => entry.id === assemblyId);
    if (!assembly) {
      throw new ServerProjectStorageError("Assembly not found.", "assembly_not_found", 404);
    }

    const nowIso = this.now().toISOString();
    const updatedAssembly: ServerProjectAssemblyRecord = {
      ...assembly,
      description: input.description === undefined ? assembly.description : input.description,
      name: input.name ?? assembly.name,
      updatedAtIso: nowIso
    };
    const updatedProject: ServerProjectRecord = {
      ...project,
      assemblies: project.assemblies.map((entry) => (entry.id === assemblyId ? updatedAssembly : entry)),
      updatedAtIso: nowIso
    };

    await this.writeProject(updatedProject);

    return updatedProject;
  }

  async duplicateAssembly(
    owner: ProjectOwnerScope,
    projectId: string,
    assemblyId: string,
    input: ServerProjectDuplicateAssemblyRequest
  ): Promise<ServerProjectRecord> {
    const project = await this.readProject(owner, projectId);

    if (!project) {
      throw new ServerProjectStorageError("Project not found.", "project_not_found", 404);
    }
    if (project.assemblies.length >= MAX_PROJECT_ASSEMBLIES) {
      throw new ServerProjectStorageError(
        `Project can store at most ${MAX_PROJECT_ASSEMBLIES} assemblies.`,
        "too_many_project_assemblies",
        400
      );
    }

    const assembly = project.assemblies.find((entry) => entry.id === assemblyId);
    if (!assembly) {
      throw new ServerProjectStorageError("Assembly not found.", "assembly_not_found", 404);
    }

    const nowIso = this.now().toISOString();
    const duplicatedAssembly: ServerProjectAssemblyRecord = {
      ...assembly,
      createdAtIso: nowIso,
      displayCode: formatDisplayCode("ASM", project.assemblies.length + 1),
      id: this.idFactory(),
      name: input.name ?? formatDuplicateProjectChildName(assembly.name),
      updatedAtIso: nowIso,
      version: 1
    };
    const updatedProject: ServerProjectRecord = {
      ...project,
      assemblies: [...project.assemblies, duplicatedAssembly],
      updatedAtIso: nowIso
    };

    await this.writeProject(updatedProject);

    return updatedProject;
  }

  async deleteAssembly(owner: ProjectOwnerScope, projectId: string, assemblyId: string): Promise<ServerProjectRecord> {
    const project = await this.readProject(owner, projectId);

    if (!project) {
      throw new ServerProjectStorageError("Project not found.", "project_not_found", 404);
    }

    const assembly = project.assemblies.find((entry) => entry.id === assemblyId);
    if (!assembly) {
      throw new ServerProjectStorageError("Assembly not found.", "assembly_not_found", 404);
    }
    if (project.reports.some((report) => report.assemblyId === assemblyId)) {
      throw new ServerProjectStorageError(
        "Assembly has project reports and cannot be deleted.",
        "assembly_has_reports",
        409
      );
    }

    const nowIso = this.now().toISOString();
    const updatedProject: ServerProjectRecord = {
      ...project,
      assemblies: project.assemblies.filter((entry) => entry.id !== assemblyId),
      updatedAtIso: nowIso
    };

    await this.writeProject(updatedProject);

    return updatedProject;
  }

  async appendReport(
    owner: ProjectOwnerScope,
    projectId: string,
    input: ServerProjectCreateReportRequest
  ): Promise<ServerProjectRecord> {
    const project = await this.readProject(owner, projectId);

    if (!project) {
      throw new ServerProjectStorageError("Project not found.", "project_not_found", 404);
    }
    if (project.reports.length >= MAX_PROJECT_REPORTS) {
      throw new ServerProjectStorageError(
        `Project can store at most ${MAX_PROJECT_REPORTS} reports.`,
        "too_many_project_reports",
        400
      );
    }
    if (jsonSizeBytes(input.reportDocument) > MAX_PROJECT_REPORT_BYTES) {
      throw new ServerProjectStorageError(
        `Project report document exceeds ${MAX_PROJECT_REPORT_BYTES} bytes.`,
        "project_report_too_large",
        413
      );
    }

    const sourceAssembly = project.assemblies.find((assembly) => assembly.id === input.assemblyId);
    if (!sourceAssembly) {
      throw new ServerProjectStorageError("Assembly not found.", "assembly_not_found", 404);
    }

    const nowIso = this.now().toISOString();
    const reportId = this.idFactory();
    const revisionId = this.idFactory();
    const revision: ServerProjectReportRevisionRecord = {
      createdAtIso: nowIso,
      createdByLabel: owner.ownerLabel,
      displayCode: formatDisplayCode("REV", 1),
      document: input.reportDocument,
      id: revisionId,
      projectId,
      reportId,
      source: "generated",
      sourceAssemblyId: sourceAssembly.id,
      sourceAssemblyVersion: sourceAssembly.version
    };
    const report: ServerProjectReportRecord = {
      assemblyId: sourceAssembly.id,
      createdAtIso: nowIso,
      currentRevisionId: revisionId,
      displayCode: formatDisplayCode("RPT", project.reports.length + 1),
      id: reportId,
      name: input.name,
      projectId,
      reportDocument: input.reportDocument,
      revisions: [revision],
      sourceAssemblySnapshot: input.sourceAssemblySnapshot,
      sourceAssemblyVersion: sourceAssembly.version,
      sourceCalculationOutput: input.sourceCalculationOutput,
      sourceMaterialSnapshot: input.sourceMaterialSnapshot,
      status: "draft",
      updatedAtIso: nowIso
    };
    const updatedProject: ServerProjectRecord = {
      ...project,
      reports: [...project.reports, report],
      updatedAtIso: nowIso
    };

    await this.writeProject(updatedProject);

    return updatedProject;
  }

  async updateReport(
    owner: ProjectOwnerScope,
    projectId: string,
    reportId: string,
    input: ServerProjectUpdateReportRequest
  ): Promise<ServerProjectRecord> {
    const project = await this.readProject(owner, projectId);

    if (!project) {
      throw new ServerProjectStorageError("Project not found.", "project_not_found", 404);
    }

    const report = project.reports.find((entry) => entry.id === reportId);
    if (!report) {
      throw new ServerProjectStorageError("Report not found.", "report_not_found", 404);
    }
    if (input.expectedReportUpdatedAtIso && input.expectedReportUpdatedAtIso !== report.updatedAtIso) {
      throw new ServerProjectStorageError("Report was updated by another session.", "report_update_conflict", 409);
    }

    const nowIso = this.now().toISOString();
    const updatedReport: ServerProjectReportRecord = {
      ...report,
      name: input.name ?? report.name,
      status: input.status ?? report.status,
      updatedAtIso: nowIso
    };
    const updatedProject: ServerProjectRecord = {
      ...project,
      reports: project.reports.map((entry) => (entry.id === reportId ? updatedReport : entry)),
      updatedAtIso: nowIso
    };

    await this.writeProject(updatedProject);

    return updatedProject;
  }

  async duplicateReport(
    owner: ProjectOwnerScope,
    projectId: string,
    reportId: string,
    input: ServerProjectDuplicateReportRequest
  ): Promise<ServerProjectRecord> {
    const project = await this.readProject(owner, projectId);

    if (!project) {
      throw new ServerProjectStorageError("Project not found.", "project_not_found", 404);
    }
    if (project.reports.length >= MAX_PROJECT_REPORTS) {
      throw new ServerProjectStorageError(
        `Project can store at most ${MAX_PROJECT_REPORTS} reports.`,
        "too_many_project_reports",
        400
      );
    }

    const report = project.reports.find((entry) => entry.id === reportId);
    if (!report) {
      throw new ServerProjectStorageError("Report not found.", "report_not_found", 404);
    }

    const nowIso = this.now().toISOString();
    const duplicatedReportId = this.idFactory();
    const revisionId = this.idFactory();
    const revision: ServerProjectReportRevisionRecord = {
      createdAtIso: nowIso,
      createdByLabel: owner.ownerLabel,
      displayCode: formatDisplayCode("REV", 1),
      document: report.reportDocument,
      id: revisionId,
      projectId,
      reportId: duplicatedReportId,
      source: "import",
      sourceAssemblyId: report.assemblyId,
      sourceAssemblyVersion: report.sourceAssemblyVersion
    };
    const duplicatedReport: ServerProjectReportRecord = {
      ...report,
      createdAtIso: nowIso,
      currentRevisionId: revisionId,
      displayCode: formatDisplayCode("RPT", project.reports.length + 1),
      id: duplicatedReportId,
      name: input.name ?? formatDuplicateProjectChildName(report.name),
      revisions: [revision],
      status: "draft",
      updatedAtIso: nowIso
    };
    const updatedProject: ServerProjectRecord = {
      ...project,
      reports: [...project.reports, duplicatedReport],
      updatedAtIso: nowIso
    };

    await this.writeProject(updatedProject);

    return updatedProject;
  }

  async deleteReport(owner: ProjectOwnerScope, projectId: string, reportId: string): Promise<ServerProjectRecord> {
    const project = await this.readProject(owner, projectId);

    if (!project) {
      throw new ServerProjectStorageError("Project not found.", "project_not_found", 404);
    }
    if (!project.reports.some((entry) => entry.id === reportId)) {
      throw new ServerProjectStorageError("Report not found.", "report_not_found", 404);
    }

    const nowIso = this.now().toISOString();
    const updatedProject: ServerProjectRecord = {
      ...project,
      reports: project.reports.filter((entry) => entry.id !== reportId),
      updatedAtIso: nowIso
    };

    await this.writeProject(updatedProject);

    return updatedProject;
  }

  async appendReportRevision(
    owner: ProjectOwnerScope,
    projectId: string,
    reportId: string,
    input: ServerProjectCreateReportRevisionRequest
  ): Promise<ServerProjectRecord> {
    const project = await this.readProject(owner, projectId);

    if (!project) {
      throw new ServerProjectStorageError("Project not found.", "project_not_found", 404);
    }

    const report = project.reports.find((entry) => entry.id === reportId);
    if (!report) {
      throw new ServerProjectStorageError("Report not found.", "report_not_found", 404);
    }
    if (input.expectedReportUpdatedAtIso && input.expectedReportUpdatedAtIso !== report.updatedAtIso) {
      throw new ServerProjectStorageError("Report was updated by another session.", "report_revision_conflict", 409);
    }
    if (report.revisions.length >= MAX_PROJECT_REPORT_REVISIONS) {
      throw new ServerProjectStorageError(
        `Project report can store at most ${MAX_PROJECT_REPORT_REVISIONS} revisions.`,
        "too_many_project_report_revisions",
        400
      );
    }
    if (jsonSizeBytes(input.document) > MAX_PROJECT_REPORT_BYTES) {
      throw new ServerProjectStorageError(
        `Project report document exceeds ${MAX_PROJECT_REPORT_BYTES} bytes.`,
        "project_report_too_large",
        413
      );
    }

    const nowIso = this.now().toISOString();
    const revisionId = this.idFactory();
    const revision: ServerProjectReportRevisionRecord = {
      assistantPatchSummary: input.assistantPatchSummary,
      changeSummary: input.changeSummary,
      createdAtIso: nowIso,
      createdByLabel: owner.ownerLabel,
      displayCode: formatDisplayCode("REV", report.revisions.length + 1),
      document: input.document,
      id: revisionId,
      projectId,
      reportId,
      source: input.source,
      sourceAssemblyId: report.assemblyId,
      sourceAssemblyVersion: report.sourceAssemblyVersion
    };
    const updatedReport: ServerProjectReportRecord = {
      ...report,
      currentRevisionId: revisionId,
      reportDocument: input.document,
      revisions: [...report.revisions, revision],
      status: report.status === "issued" ? "draft" : report.status,
      updatedAtIso: nowIso
    };
    const updatedProject: ServerProjectRecord = {
      ...project,
      reports: project.reports.map((entry) => (entry.id === reportId ? updatedReport : entry)),
      updatedAtIso: nowIso
    };

    await this.writeProject(updatedProject);

    return updatedProject;
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

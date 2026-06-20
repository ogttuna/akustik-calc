import type {
  JsonValue,
  ServerProjectAssemblyRecord,
  ServerProjectRecord,
  ServerProjectReportRecord,
  ServerProjectReportRevisionRecord
} from "@dynecho/shared";

import {
  projectAccessRefFromRecord,
  resolveProjectRouteAccess
} from "../../lib/project-route-auth";
import {
  createDefaultServerProjectRepository,
  ServerProjectStorageError,
  summarizeServerProject,
  type FileServerProjectRepository,
  type ProjectOwnerScope
} from "../../lib/server-project-storage";
import type { ReportAssistantProjectReadToolName } from "./report-assistant-project-read-contract";

export {
  REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS,
  type ReportAssistantProjectReadToolDefinition,
  type ReportAssistantProjectReadToolName
} from "./report-assistant-project-read-contract";

export type ReportAssistantProjectSummary = ReturnType<typeof summarizeServerProject>;

export type ReportAssistantProjectAssemblySummary = {
  calculationSummary?: ServerProjectAssemblyRecord["calculationSummary"];
  createdAtIso: string;
  displayCode?: string;
  id: string;
  kind: ServerProjectAssemblyRecord["kind"];
  name: string;
  projectId: string;
  source: ServerProjectAssemblyRecord["source"];
  updatedAtIso: string;
  version: number;
};

export type ReportAssistantProjectReportSummary = {
  assemblyId: string;
  createdAtIso: string;
  currentRevisionId: string;
  description?: string;
  displayCode?: string;
  id: string;
  name: string;
  projectId: string;
  revisionCount: number;
  sourceAssemblyVersion: number;
  status: ServerProjectReportRecord["status"];
  updatedAtIso: string;
};

export type ReportAssistantProjectReportRevisionSummary = {
  assistantPatchSummary?: ServerProjectReportRevisionRecord["assistantPatchSummary"];
  changeSummary?: string;
  createdAtIso: string;
  createdByLabel?: string;
  displayCode?: string;
  id: string;
  projectId: string;
  reportId: string;
  source: ServerProjectReportRevisionRecord["source"];
  sourceAssemblyId: string;
  sourceAssemblyVersion: number;
};

type ReportAssistantProjectReadRepository = Pick<FileServerProjectRepository, "listProjects" | "readProject">;

type ReportAssistantProjectReadBaseInvocation = {
  owner: ProjectOwnerScope;
  repository?: ReportAssistantProjectReadRepository;
};

export type ReportAssistantProjectReadInvocation =
  | (ReportAssistantProjectReadBaseInvocation & {
      name: "list_projects";
    })
  | (ReportAssistantProjectReadBaseInvocation & {
      name: "read_project_summary" | "list_project_assemblies" | "list_project_reports";
      projectId?: string;
    })
  | (ReportAssistantProjectReadBaseInvocation & {
      assemblyId?: string;
      name: "read_project_assembly_snapshot";
      projectId?: string;
    })
  | (ReportAssistantProjectReadBaseInvocation & {
      name: "read_project_report_document" | "list_project_report_revisions";
      projectId?: string;
      reportId?: string;
    })
  | (ReportAssistantProjectReadBaseInvocation & {
      name: "read_project_report_revision";
      projectId?: string;
      reportId?: string;
      revisionId?: string;
    });

export type ReportAssistantProjectReadResult =
  | {
      mutates: false;
      name: ReportAssistantProjectReadToolName;
      ok: true;
      result: JsonValue;
    }
  | {
      code: string;
      errors: readonly string[];
      mutates: false;
      name: ReportAssistantProjectReadToolName;
      ok: false;
      statusCode: number;
    };
type ReportAssistantProjectReadFailure = Extract<ReportAssistantProjectReadResult, { ok: false }>;

function ownerResolution(owner: ProjectOwnerScope) {
  return {
    ok: true,
    scope: owner
  } as const;
}

function fail(input: {
  code: string;
  errors: readonly string[];
  name: ReportAssistantProjectReadToolName;
  statusCode: number;
}): ReportAssistantProjectReadFailure {
  return {
    code: input.code,
    errors: input.errors,
    mutates: false,
    name: input.name,
    ok: false,
    statusCode: input.statusCode
  };
}

function missingProjectId(name: ReportAssistantProjectReadToolName): ReportAssistantProjectReadFailure {
  return fail({
    code: "missing_project_id",
    errors: ["Project id is required."],
    name,
    statusCode: 400
  });
}

function missingChildId(
  name: ReportAssistantProjectReadToolName,
  child: "assembly" | "report" | "revision"
): ReportAssistantProjectReadFailure {
  return fail({
    code: `missing_${child}_id`,
    errors: [`${child[0]!.toUpperCase()}${child.slice(1)} id is required.`],
    name,
    statusCode: 400
  });
}

function projectNotFound(name: ReportAssistantProjectReadToolName): ReportAssistantProjectReadFailure {
  return fail({
    code: "project_not_found",
    errors: ["Project not found."],
    name,
    statusCode: 404
  });
}

function storageFailure(
  name: ReportAssistantProjectReadToolName,
  error: unknown
): ReportAssistantProjectReadFailure {
  if (error instanceof ServerProjectStorageError) {
    return fail({
      code: error.code,
      errors: [error.message],
      name,
      statusCode: error.statusCode
    });
  }

  return fail({
    code: "project_read_failed",
    errors: [error instanceof Error ? error.message : "Unknown project read failure."],
    name,
    statusCode: 500
  });
}

function ok(name: ReportAssistantProjectReadToolName, result: JsonValue): ReportAssistantProjectReadResult {
  return {
    mutates: false,
    name,
    ok: true,
    result
  };
}

function summarizeAssembly(assembly: ServerProjectAssemblyRecord): ReportAssistantProjectAssemblySummary {
  return {
    calculationSummary: assembly.calculationSummary,
    createdAtIso: assembly.createdAtIso,
    displayCode: assembly.displayCode,
    id: assembly.id,
    kind: assembly.kind,
    name: assembly.name,
    projectId: assembly.projectId,
    source: assembly.source,
    updatedAtIso: assembly.updatedAtIso,
    version: assembly.version
  };
}

function summarizeReport(report: ServerProjectReportRecord): ReportAssistantProjectReportSummary {
  return {
    assemblyId: report.assemblyId,
    createdAtIso: report.createdAtIso,
    currentRevisionId: report.currentRevisionId,
    description: report.description,
    displayCode: report.displayCode,
    id: report.id,
    name: report.name,
    projectId: report.projectId,
    revisionCount: report.revisions.length,
    sourceAssemblyVersion: report.sourceAssemblyVersion,
    status: report.status,
    updatedAtIso: report.updatedAtIso
  };
}

function summarizeRevision(revision: ServerProjectReportRevisionRecord): ReportAssistantProjectReportRevisionSummary {
  return {
    assistantPatchSummary: revision.assistantPatchSummary,
    changeSummary: revision.changeSummary,
    createdAtIso: revision.createdAtIso,
    createdByLabel: revision.createdByLabel,
    displayCode: revision.displayCode,
    id: revision.id,
    projectId: revision.projectId,
    reportId: revision.reportId,
    source: revision.source,
    sourceAssemblyId: revision.sourceAssemblyId,
    sourceAssemblyVersion: revision.sourceAssemblyVersion
  };
}

async function readAccessibleProject(input: {
  name: ReportAssistantProjectReadToolName;
  owner: ProjectOwnerScope;
  projectId?: string;
  repository: ReportAssistantProjectReadRepository;
}): Promise<ReportAssistantProjectReadFailure | ServerProjectRecord> {
  if (!input.projectId) {
    return missingProjectId(input.name);
  }

  try {
    const project = await input.repository.readProject(input.owner, input.projectId);

    if (!project) {
      return projectNotFound(input.name);
    }

    const access = resolveProjectRouteAccess({
      action: "read_project",
      owner: ownerResolution(input.owner),
      project: projectAccessRefFromRecord(project)
    });

    if (!access.ok) {
      return fail({
        code: access.decision.reason,
        errors: [access.error],
        name: input.name,
        statusCode: access.status
      });
    }

    return project;
  } catch (error) {
    return storageFailure(input.name, error);
  }
}

function isFailure(value: unknown): value is ReportAssistantProjectReadFailure {
  return typeof value === "object" && value !== null && "ok" in value && value.ok === false;
}

function findAssembly(
  name: ReportAssistantProjectReadToolName,
  project: ServerProjectRecord,
  assemblyId?: string
): ReportAssistantProjectReadFailure | ServerProjectAssemblyRecord {
  if (!assemblyId) {
    return missingChildId(name, "assembly");
  }

  return project.assemblies.find((assembly) => assembly.id === assemblyId) ?? fail({
    code: "assembly_not_found",
    errors: ["Assembly not found."],
    name,
    statusCode: 404
  });
}

function findReport(
  name: ReportAssistantProjectReadToolName,
  project: ServerProjectRecord,
  reportId?: string
): ReportAssistantProjectReadFailure | ServerProjectReportRecord {
  if (!reportId) {
    return missingChildId(name, "report");
  }

  return project.reports.find((report) => report.id === reportId) ?? fail({
    code: "report_not_found",
    errors: ["Report not found."],
    name,
    statusCode: 404
  });
}

function findRevision(
  name: ReportAssistantProjectReadToolName,
  report: ServerProjectReportRecord,
  revisionId?: string
): ReportAssistantProjectReadFailure | ServerProjectReportRevisionRecord {
  if (!revisionId) {
    return missingChildId(name, "revision");
  }

  return report.revisions.find((revision) => revision.id === revisionId) ?? fail({
    code: "revision_not_found",
    errors: ["Revision not found."],
    name,
    statusCode: 404
  });
}

function currentRevision(
  name: ReportAssistantProjectReadToolName,
  report: ServerProjectReportRecord
): ReportAssistantProjectReadFailure | ServerProjectReportRevisionRecord {
  return report.revisions.find((revision) => revision.id === report.currentRevisionId) ?? fail({
    code: "revision_not_found",
    errors: ["Current report revision not found."],
    name,
    statusCode: 404
  });
}

export async function runReportAssistantProjectReadTool(
  invocation: ReportAssistantProjectReadInvocation
): Promise<ReportAssistantProjectReadResult> {
  const repository = invocation.repository ?? createDefaultServerProjectRepository();

  if (invocation.name === "list_projects") {
    const access = resolveProjectRouteAccess({
      action: "list_projects",
      owner: ownerResolution(invocation.owner)
    });

    if (!access.ok) {
      return fail({
        code: access.decision.reason,
        errors: [access.error],
        name: invocation.name,
        statusCode: access.status
      });
    }

    try {
      return ok(invocation.name, {
        projects: await repository.listProjects(access.scope)
      });
    } catch (error) {
      return storageFailure(invocation.name, error);
    }
  }

  if (invocation.name === "read_project_assembly_snapshot" && !invocation.assemblyId) {
    return missingChildId(invocation.name, "assembly");
  }
  if (
    (invocation.name === "read_project_report_document" ||
      invocation.name === "list_project_report_revisions" ||
      invocation.name === "read_project_report_revision") &&
    !invocation.reportId
  ) {
    return missingChildId(invocation.name, "report");
  }
  if (invocation.name === "read_project_report_revision" && !invocation.revisionId) {
    return missingChildId(invocation.name, "revision");
  }

  const project = await readAccessibleProject({
    name: invocation.name,
    owner: invocation.owner,
    projectId: invocation.projectId,
    repository
  });

  if (isFailure(project)) {
    return project;
  }

  switch (invocation.name) {
    case "read_project_summary":
      return ok(invocation.name, {
        project: summarizeServerProject(project)
      });

    case "list_project_assemblies":
      return ok(invocation.name, {
        assemblies: project.assemblies.map((assembly) => summarizeAssembly(assembly))
      });

    case "read_project_assembly_snapshot": {
      const assembly = findAssembly(invocation.name, project, invocation.assemblyId);
      if (isFailure(assembly)) {
        return assembly;
      }

      return ok(invocation.name, {
        assembly: summarizeAssembly(assembly),
        snapshot: assembly.snapshot
      });
    }

    case "list_project_reports":
      return ok(invocation.name, {
        reports: project.reports.map((report) => summarizeReport(report))
      });

    case "read_project_report_document": {
      const report = findReport(invocation.name, project, invocation.reportId);
      if (isFailure(report)) {
        return report;
      }

      const revision = currentRevision(invocation.name, report);
      if (isFailure(revision)) {
        return revision;
      }

      return ok(invocation.name, {
        document: report.reportDocument,
        report: summarizeReport(report),
        revision: summarizeRevision(revision)
      });
    }

    case "list_project_report_revisions": {
      const report = findReport(invocation.name, project, invocation.reportId);
      if (isFailure(report)) {
        return report;
      }

      return ok(invocation.name, {
        report: summarizeReport(report),
        revisions: report.revisions.map((revision) => summarizeRevision(revision))
      });
    }

    case "read_project_report_revision": {
      const report = findReport(invocation.name, project, invocation.reportId);
      if (isFailure(report)) {
        return report;
      }

      const revision = findRevision(invocation.name, report, invocation.revisionId);
      if (isFailure(revision)) {
        return revision;
      }

      return ok(invocation.name, {
        document: revision.document,
        report: summarizeReport(report),
        revision: summarizeRevision(revision)
      });
    }
  }
}

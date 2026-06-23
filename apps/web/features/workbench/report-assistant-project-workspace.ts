import type {
  ReportAssistantProjectWorkspaceAssembly,
  ReportAssistantProjectWorkspaceProject,
  ReportAssistantProjectWorkspaceReport,
  ReportAssistantProjectWorkspaceRevision,
  ReportAssistantProjectWorkspaceSnapshot
} from "./report-assistant-context";
import { REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS } from "./report-assistant-project-read-contract";
import type { SimpleWorkbenchProposalPreviewProjectContext } from "./simple-workbench-proposal-preview-storage";

type ProjectReadAction =
  | "list_project_assemblies"
  | "list_project_report_revisions"
  | "list_project_reports"
  | "read_project_summary";

type ProjectReadRequest = {
  action: ProjectReadAction;
  projectId: string;
  reportId?: string;
};

type ProjectWorkspaceFetch = Pick<typeof globalThis, "fetch">["fetch"];

const AVAILABLE_READ_TOOLS: ReportAssistantProjectWorkspaceSnapshot["availableReadTools"] =
  REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS.map((tool) => ({
    mutates: tool.mutates,
    name: tool.name,
    requiredInputs: [...tool.requiredInputs]
  }));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getProjectReadResult(payload: unknown): unknown {
  return isRecord(payload) && payload.ok === true ? payload.result : undefined;
}

async function postProjectRead(request: ProjectReadRequest, fetchFn: ProjectWorkspaceFetch): Promise<unknown> {
  const response = await fetchFn("/api/report-assistant/project-read", {
    body: JSON.stringify(request),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
  const payload = await response.json() as unknown;

  if (!response.ok) {
    const errors = isRecord(payload) && Array.isArray(payload.errors)
      ? payload.errors.filter((entry): entry is string => typeof entry === "string")
      : [];
    throw new Error(errors[0] ?? "Project context could not be loaded.");
  }

  return payload;
}

function parseProject(payload: unknown): ReportAssistantProjectWorkspaceProject | null {
  const result = getProjectReadResult(payload);
  const project = isRecord(result) ? result.project : undefined;
  if (!isRecord(project) || typeof project.id !== "string" || typeof project.name !== "string") {
    return null;
  }

  return {
    assemblyCount: typeof project.assemblyCount === "number" ? project.assemblyCount : undefined,
    clientName: typeof project.clientName === "string" ? project.clientName : undefined,
    id: project.id,
    latestAssemblyUpdatedAtIso: typeof project.latestAssemblyUpdatedAtIso === "string" || project.latestAssemblyUpdatedAtIso === null
      ? project.latestAssemblyUpdatedAtIso
      : undefined,
    latestReportUpdatedAtIso: typeof project.latestReportUpdatedAtIso === "string" || project.latestReportUpdatedAtIso === null
      ? project.latestReportUpdatedAtIso
      : undefined,
    name: project.name,
    ownerLabel: typeof project.ownerLabel === "string" ? project.ownerLabel : undefined,
    reportCount: typeof project.reportCount === "number" ? project.reportCount : undefined,
    updatedAtIso: typeof project.updatedAtIso === "string" ? project.updatedAtIso : undefined
  };
}

function parseReports(payload: unknown): ReportAssistantProjectWorkspaceReport[] {
  const result = getProjectReadResult(payload);
  const reports = isRecord(result) && Array.isArray(result.reports) ? result.reports : [];

  return reports.flatMap((entry): ReportAssistantProjectWorkspaceReport[] => {
    if (!isRecord(entry) || typeof entry.id !== "string" || typeof entry.name !== "string") {
      return [];
    }

    return [
      {
        assemblyId: typeof entry.assemblyId === "string" ? entry.assemblyId : undefined,
        currentRevisionId: typeof entry.currentRevisionId === "string" ? entry.currentRevisionId : undefined,
        description: typeof entry.description === "string" ? entry.description : undefined,
        displayCode: typeof entry.displayCode === "string" ? entry.displayCode : undefined,
        id: entry.id,
        name: entry.name,
        revisionCount: typeof entry.revisionCount === "number" ? entry.revisionCount : undefined,
        status: entry.status === "archived" || entry.status === "draft" || entry.status === "issued" ? entry.status : undefined,
        updatedAtIso: typeof entry.updatedAtIso === "string" ? entry.updatedAtIso : undefined
      }
    ];
  });
}

function parseAssemblies(payload: unknown): ReportAssistantProjectWorkspaceAssembly[] {
  const result = getProjectReadResult(payload);
  const assemblies = isRecord(result) && Array.isArray(result.assemblies) ? result.assemblies : [];

  return assemblies.flatMap((entry): ReportAssistantProjectWorkspaceAssembly[] => {
    if (
      !isRecord(entry) ||
      typeof entry.id !== "string" ||
      (entry.kind !== "floor" && entry.kind !== "wall") ||
      typeof entry.name !== "string" ||
      typeof entry.version !== "number" ||
      !Number.isFinite(entry.version)
    ) {
      return [];
    }

    const calculationSummary = isRecord(entry.calculationSummary) ? entry.calculationSummary : undefined;
    const calculationStatus =
      calculationSummary?.status === "error" ||
      calculationSummary?.status === "needs_input" ||
      calculationSummary?.status === "ready" ||
      calculationSummary?.status === "unsupported"
        ? calculationSummary.status
        : undefined;

    return [
      {
        calculationPrimaryOutput:
          typeof calculationSummary?.primaryOutput === "string" ? calculationSummary.primaryOutput : undefined,
        // Coordination note: assistant workspace summaries can be loaded from older project records; only ready rows get numeric labels.
        calculationPrimaryValueLabel:
          calculationStatus === "ready" && typeof calculationSummary?.primaryValueLabel === "string" ? calculationSummary.primaryValueLabel : undefined,
        calculationStatus,
        displayCode: typeof entry.displayCode === "string" ? entry.displayCode : undefined,
        id: entry.id,
        kind: entry.kind,
        name: entry.name,
        updatedAtIso: typeof entry.updatedAtIso === "string" ? entry.updatedAtIso : undefined,
        version: entry.version
      }
    ];
  });
}

function parseRevision(entry: unknown): ReportAssistantProjectWorkspaceRevision | null {
  if (
    !isRecord(entry) ||
    typeof entry.createdAtIso !== "string" ||
    typeof entry.id !== "string" ||
    (entry.source !== "assistant" && entry.source !== "generated" && entry.source !== "import" && entry.source !== "manual")
  ) {
    return null;
  }

  const assistantPatchSummary = isRecord(entry.assistantPatchSummary) &&
    typeof entry.assistantPatchSummary.operationCount === "number" &&
    (entry.assistantPatchSummary.validationStatus === "valid" || entry.assistantPatchSummary.validationStatus === "warning")
    ? {
        operationCount: entry.assistantPatchSummary.operationCount,
        validationStatus: entry.assistantPatchSummary.validationStatus as "valid" | "warning"
      }
    : undefined;

  return {
    assistantPatchSummary,
    changeSummary: typeof entry.changeSummary === "string" ? entry.changeSummary : undefined,
    createdAtIso: entry.createdAtIso,
    displayCode: typeof entry.displayCode === "string" ? entry.displayCode : undefined,
    id: entry.id,
    source: entry.source
  };
}

function parseRevisions(payload: unknown): ReportAssistantProjectWorkspaceRevision[] {
  const result = getProjectReadResult(payload);
  const revisions = isRecord(result) && Array.isArray(result.revisions) ? result.revisions : [];

  return revisions.flatMap((entry): ReportAssistantProjectWorkspaceRevision[] => {
    const revision = parseRevision(entry);
    return revision ? [revision] : [];
  });
}

export async function loadReportAssistantProjectWorkspaceSnapshot(
  projectContext: SimpleWorkbenchProposalPreviewProjectContext | undefined,
  fetchFn: ProjectWorkspaceFetch = globalThis.fetch.bind(globalThis)
): Promise<ReportAssistantProjectWorkspaceSnapshot | undefined> {
  const projectId = projectContext?.serverProjectId;
  if (!projectId) {
    return undefined;
  }

  const projectPayload = await postProjectRead({
    action: "read_project_summary",
    projectId
  }, fetchFn);
  const project = parseProject(projectPayload);
  if (!project) {
    throw new Error("Project summary was not available.");
  }

  const reportId = projectContext.serverProjectReportId;
  if (!reportId) {
    return {
      availableReadTools: AVAILABLE_READ_TOOLS,
      project,
      revisionSummaries: [],
      scope: "project"
    };
  }

  const [assembliesPayload, reportsPayload, revisionsPayload] = await Promise.all([
    postProjectRead({
      action: "list_project_assemblies",
      projectId
    }, fetchFn),
    postProjectRead({
      action: "list_project_reports",
      projectId
    }, fetchFn),
    postProjectRead({
      action: "list_project_report_revisions",
      projectId,
      reportId
    }, fetchFn)
  ]);
  const report = parseReports(reportsPayload).find((entry) => entry.id === reportId);
  if (!report) {
    throw new Error("Saved report summary was not available.");
  }

  const linkedAssembly = report.assemblyId
    ? parseAssemblies(assembliesPayload).find((assembly) => assembly.id === report.assemblyId)
    : undefined;
  const revisionSummaries = parseRevisions(revisionsPayload);

  return {
    availableReadTools: AVAILABLE_READ_TOOLS,
    currentRevision: report.currentRevisionId
      ? revisionSummaries.find((revision) => revision.id === report.currentRevisionId)
      : undefined,
    linkedAssembly,
    project,
    report,
    revisionSummaries,
    scope: "project_report"
  };
}

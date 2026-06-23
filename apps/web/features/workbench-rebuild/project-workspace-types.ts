import type { WorkbenchV2StudyMode } from "./workbench-v2-project-snapshot";

export type ProjectWorkspaceStatus = "error" | "idle" | "loading" | "restoring" | "syncing";

export type ProjectWorkspaceProjectSummary = {
  assemblyCount: number;
  id: string;
  latestScenarioCapturedAtIso: string | null;
  name: string;
  ownerLabel: string;
  reportCount: number;
  scenarioCount: number;
  updatedAtIso: string;
};

export type ProjectWorkspaceAssemblySummary = {
  calculationSummary?: {
    primaryOutput?: string;
    primaryValueLabel?: string;
    selectedOutputs: string[];
    status: "error" | "needs_input" | "ready" | "unsupported";
  };
  description?: string;
  displayCode?: string;
  id: string;
  kind: WorkbenchV2StudyMode;
  name: string;
  updatedAtIso: string;
  version: number;
};

export type ProjectWorkspaceReportSummary = {
  assemblyId: string;
  currentRevisionId: string;
  description?: string;
  displayCode?: string;
  id: string;
  name: string;
  revisionCount: number;
  sourceAssemblyVersion: number;
  status: "archived" | "draft" | "issued";
  updatedAtIso: string;
};

export const PROJECT_WORKSPACE_NAME_MAX_LENGTH = 160;

export function formatProjectWorkspaceProjectOptionLabel(project: ProjectWorkspaceProjectSummary): string {
  return project.name;
}

export function formatProjectWorkspaceAssemblyOptionLabel(assembly: ProjectWorkspaceAssemblySummary): string {
  const displayCode = assembly.displayCode ? `${assembly.displayCode} - ` : "";
  const resultLabel = assembly.calculationSummary?.status === "ready" && assembly.calculationSummary.primaryValueLabel
    ? ` - ${assembly.calculationSummary.primaryOutput ?? "Result"} ${assembly.calculationSummary.primaryValueLabel}`
    : "";
  return `${displayCode}${assembly.name}${resultLabel}`;
}

export function formatProjectWorkspaceReportOptionLabel(report: ProjectWorkspaceReportSummary): string {
  const displayCode = report.displayCode ? `${report.displayCode} - ` : "";
  const revisionLabel = `${report.revisionCount} revision${report.revisionCount === 1 ? "" : "s"}`;
  const statusLabel = report.status === "archived" ? " - archived" : report.status === "issued" ? " - issued" : "";
  return `${displayCode}${report.name} - ${revisionLabel}${statusLabel}`;
}

export function formatProjectWorkspaceUpdatedDateLabel(updatedAtIso: string): string {
  const updatedAt = new Date(updatedAtIso);

  if (Number.isNaN(updatedAt.getTime())) {
    return "Updated date unavailable";
  }

  return `Updated ${new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(updatedAt)}`;
}

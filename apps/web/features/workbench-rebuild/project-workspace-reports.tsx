"use client";

import { Archive, Copy, Pencil, RotateCcw, Trash2 } from "lucide-react";

import {
  PROJECT_WORKSPACE_NAME_MAX_LENGTH,
  formatProjectWorkspaceUpdatedDateLabel,
  type ProjectWorkspaceAssemblySummary,
  type ProjectWorkspaceReportSummary,
  type ProjectWorkspaceStatus
} from "./project-workspace-types";

export type ProjectWorkspaceReportsProps = {
  assemblies: readonly ProjectWorkspaceAssemblySummary[];
  busy: boolean;
  canRenameReport: boolean;
  onDeleteReport: () => Promise<void> | void;
  onDuplicateReport: () => Promise<void> | void;
  onOpenReport: () => Promise<void> | void;
  onReportDescriptionDraftChange: (value: string) => void;
  onRenameReport: () => Promise<void> | void;
  onReportRenameDraftChange: (value: string) => void;
  onSelectReport: (reportId: string) => void;
  onSetReportArchived: (archived: boolean) => Promise<void> | void;
  projectSelected: boolean;
  reportRenameDraft: string;
  reportDescriptionDraft: string;
  reports: readonly ProjectWorkspaceReportSummary[];
  selectedReport: ProjectWorkspaceReportSummary | null;
  selectedReportId: string;
  status: ProjectWorkspaceStatus;
};

function formatProjectWorkspaceReportRevisionCount(report: ProjectWorkspaceReportSummary): string {
  return `${report.revisionCount} revision${report.revisionCount === 1 ? "" : "s"}`;
}

function formatProjectWorkspaceReportStatus(status: ProjectWorkspaceReportSummary["status"]): string {
  return status === "archived" ? "Archived" : status === "issued" ? "Issued" : "Draft";
}

function getProjectWorkspaceReportAssemblyLabel(
  report: ProjectWorkspaceReportSummary,
  assemblies: readonly ProjectWorkspaceAssemblySummary[]
): string {
  const assembly = assemblies.find((candidate) => candidate.id === report.assemblyId);

  if (assembly) {
    const displayCode = assembly.displayCode ? `${assembly.displayCode} - ` : "";
    return `${displayCode}${assembly.name}`;
  }

  return `Assembly v${report.sourceAssemblyVersion}`;
}

export function ProjectWorkspaceReports(props: ProjectWorkspaceReportsProps) {
  return (
    <>
      <div className="calc-project-list" aria-label="Saved reports">
        {props.projectSelected && props.reports.length ? (
          props.reports.map((report) => {
            const selected = report.id === props.selectedReportId;
            const archived = report.status === "archived";

            return (
              <div
                className="calc-project-row"
                data-report-id={report.id}
                data-selected={selected ? "true" : "false"}
                data-status={report.status}
                key={report.id}
              >
                <button
                  aria-pressed={selected}
                  className="focus-ring calc-project-row-main"
                  disabled={props.status === "loading"}
                  onClick={() => props.onSelectReport(report.id)}
                  type="button"
                >
                  <span className="calc-project-row-code">{report.displayCode ?? "Report"}</span>
                  <span className="calc-project-row-copy">
                    <strong>{report.name}</strong>
                    <span>
                      {formatProjectWorkspaceReportStatus(report.status)} - {formatProjectWorkspaceReportRevisionCount(report)} -{" "}
                      {formatProjectWorkspaceUpdatedDateLabel(report.updatedAtIso)}
                    </span>
                    {report.description ? <small>{report.description}</small> : null}
                  </span>
                  <span className="calc-project-row-result">{getProjectWorkspaceReportAssemblyLabel(report, props.assemblies)}</span>
                </button>
                {selected ? (
                  <div className="calc-project-row-edit">
                    <input
                      aria-label="Selected report name"
                      className="focus-ring ui-field calc-project-snapshot-select"
                      disabled={props.busy}
                      maxLength={PROJECT_WORKSPACE_NAME_MAX_LENGTH}
                      onChange={(event) => props.onReportRenameDraftChange(event.target.value)}
                      placeholder="Selected report name"
                      value={props.reportRenameDraft}
                    />
                    <input
                      aria-label="Selected report description"
                      className="focus-ring ui-field calc-project-snapshot-select"
                      disabled={props.busy}
                      maxLength={320}
                      onChange={(event) => props.onReportDescriptionDraftChange(event.target.value)}
                      placeholder="Selected report description"
                      value={props.reportDescriptionDraft}
                    />
                    <div className="calc-project-row-actions">
                      <button
                        className="focus-ring ui-button ui-button-ghost"
                        disabled={!props.projectSelected || !props.selectedReport || props.busy}
                        onClick={() => void props.onOpenReport()}
                        type="button"
                      >
                        Open saved report
                      </button>
                      <button
                        className="focus-ring ui-button ui-button-ghost"
                        disabled={!props.canRenameReport}
                        onClick={() => void props.onRenameReport()}
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                        Rename report
                      </button>
                      <button
                        className="focus-ring ui-button ui-button-ghost"
                        disabled={!props.projectSelected || props.busy}
                        onClick={() => void props.onDuplicateReport()}
                        type="button"
                      >
                        <Copy className="h-4 w-4" />
                        Duplicate report
                      </button>
                      <button
                        className="focus-ring ui-button ui-button-warning"
                        disabled={!props.projectSelected || props.busy}
                        onClick={() => void props.onSetReportArchived(!archived)}
                        type="button"
                      >
                        {archived ? <RotateCcw className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                        {archived ? "Restore report" : "Archive report"}
                      </button>
                      <button
                        className="focus-ring ui-button ui-button-danger"
                        disabled={!props.projectSelected || props.busy}
                        onClick={() => void props.onDeleteReport()}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete report
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="calc-project-list-empty">{props.projectSelected ? "No saved reports yet" : "Select a project to manage saved reports"}</div>
        )}
      </div>
    </>
  );
}

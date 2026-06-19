"use client";

import { Copy, Eye, FileText, Pencil, Trash2 } from "lucide-react";

import type { ProjectWorkspaceCombinationsProps } from "./project-workspace-combinations";
import { ProjectWorkspaceIdentity, type ProjectWorkspaceIdentityProps } from "./project-workspace-identity";
import { ProjectWorkspaceReports, type ProjectWorkspaceReportsProps } from "./project-workspace-reports";
import {
  PROJECT_WORKSPACE_NAME_MAX_LENGTH,
  formatProjectWorkspaceUpdatedDateLabel,
  type ProjectWorkspaceAssemblySummary,
  type ProjectWorkspaceStatus
} from "./project-workspace-types";

type ProjectWorkspacePanelProps = {
  busy: boolean;
  combinations: Omit<ProjectWorkspaceCombinationsProps, "busy" | "status">;
  id?: string;
  identity: Omit<ProjectWorkspaceIdentityProps, "busy">;
  message: string;
  onClose?: () => void;
  reports: Omit<ProjectWorkspaceReportsProps, "busy" | "status">;
  status: ProjectWorkspaceStatus;
};

function getProjectWorkspaceAssemblyKindLabel(kind: ProjectWorkspaceAssemblySummary["kind"]): string {
  return kind === "floor" ? "Floor" : "Wall";
}

function getProjectWorkspaceAssemblyResultLabel(assembly: ProjectWorkspaceAssemblySummary): string {
  if (assembly.calculationSummary?.primaryValueLabel) {
    return `${assembly.calculationSummary.primaryOutput ?? "Result"} ${assembly.calculationSummary.primaryValueLabel}`;
  }

  return assembly.calculationSummary?.status ? assembly.calculationSummary.status.replace(/_/gu, " ") : "No result";
}

export function ProjectWorkspacePanel(props: ProjectWorkspacePanelProps) {
  const combinationCount = props.combinations.assemblies.length;
  const reportCount = props.reports.reports.length;
  const selectedProject = props.identity.selectedProject;
  const canSaveNewCombination =
    props.combinations.projectSelected &&
    props.combinations.assemblyNameDraft.trim().length > 0 &&
    props.status !== "syncing" &&
    props.status !== "restoring";
  const selectedProjectContent = selectedProject ? (
    <div className="calc-project-combination-dropdown" aria-label="Selected project layer combinations">
      <div className="calc-project-dropdown-head">
        <span className="calc-project-dropdown-title">
          <span>Layer combinations</span>
          <span className="calc-project-dropdown-count">{combinationCount}</span>
        </span>
        <button
          aria-label="Save current stack as combination"
          aria-expanded={props.combinations.createOpen}
          className="focus-ring ui-button ui-button-ghost calc-project-heading-save-button"
          disabled={!props.combinations.projectSelected || props.busy}
          onClick={() => props.combinations.onCreateOpenChange(!props.combinations.createOpen)}
          title="Save current stack as combination"
          type="button"
        >
          <FileText className="h-4 w-4" />
          Save current
        </button>
      </div>

      {props.combinations.createOpen ? (
        <div className="calc-project-snapshot-controls">
          <input
            aria-label="New combination name"
            className="focus-ring ui-field calc-project-snapshot-select"
            disabled={!props.combinations.projectSelected || props.busy}
            maxLength={PROJECT_WORKSPACE_NAME_MAX_LENGTH}
            onChange={(event) => props.combinations.onAssemblyNameDraftChange(event.target.value)}
            placeholder="New combination name"
            value={props.combinations.assemblyNameDraft}
          />
          <input
            aria-label="New combination description"
            className="focus-ring ui-field calc-project-snapshot-select"
            disabled={!props.combinations.projectSelected || props.busy}
            maxLength={320}
            onChange={(event) => props.combinations.onAssemblyDescriptionDraftChange(event.target.value)}
            placeholder="Optional description"
            value={props.combinations.assemblyDescriptionDraft}
          />
          <button
            className="focus-ring ui-button ui-button-primary"
            disabled={!canSaveNewCombination}
            onClick={() => void props.combinations.onSaveAssembly()}
            type="button"
          >
            <FileText className="h-4 w-4" />
            Save as new combination
          </button>
        </div>
      ) : null}

      <div className="calc-project-combo-list" aria-label="Saved combinations">
        {props.combinations.assemblies.length ? (
          props.combinations.assemblies.map((assembly) => {
            const selected = assembly.id === props.combinations.selectedAssemblyId;
            const active = assembly.id === props.combinations.activeAssemblyId;

            return (
              <div className="calc-project-combo-item" data-active={active ? "true" : "false"} data-selected={selected ? "true" : "false"} key={assembly.id}>
                <div className="calc-project-combo-row">
                  <button
                    aria-pressed={selected}
                    className="focus-ring calc-project-combo-select"
                    disabled={props.status === "loading"}
                    onClick={() => props.combinations.onSelectAssembly(assembly.id)}
                    type="button"
                  >
                    <span className="calc-project-combo-copy">
                      <strong>{assembly.name}</strong>
                      <span>
                        {getProjectWorkspaceAssemblyKindLabel(assembly.kind)} - v{assembly.version} - {formatProjectWorkspaceUpdatedDateLabel(assembly.updatedAtIso)}
                      </span>
                      {assembly.description ? <small>{assembly.description}</small> : null}
                      {active ? <small>{props.combinations.activeAssemblyDirty ? "Open - modified" : "Open - saved"}</small> : null}
                    </span>
                  </button>
                  <span className="calc-project-combo-result">{getProjectWorkspaceAssemblyResultLabel(assembly)}</span>
                  <div className="calc-project-combo-actions" aria-label={`${assembly.name} actions`}>
                    <button
                      aria-label="Load combination"
                      className="focus-ring ui-icon-button calc-project-combo-icon-button"
                      disabled={!props.combinations.projectSelected || props.busy}
                      onClick={() => {
                        props.combinations.onSelectAssembly(assembly.id);
                        void (props.combinations.onLoadAssemblyById ? props.combinations.onLoadAssemblyById(assembly.id) : props.combinations.onLoadAssembly());
                      }}
                      title="Load combination"
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <details className="calc-project-combo-edit">
                      <summary aria-label="Edit combination" title="Edit combination">
                        <Pencil className="h-4 w-4" />
                      </summary>
                      <div className="calc-project-combo-edit-panel">
                        <input
                          aria-label="Selected combination name"
                          className="focus-ring ui-field calc-project-snapshot-select"
                          disabled={props.busy}
                          maxLength={PROJECT_WORKSPACE_NAME_MAX_LENGTH}
                          onChange={(event) => props.combinations.onAssemblyRenameDraftChange(event.target.value)}
                          placeholder="Selected combination name"
                          value={props.combinations.assemblyRenameDraft}
                        />
                        <input
                          aria-label="Selected combination description"
                          className="focus-ring ui-field calc-project-snapshot-select"
                          disabled={props.busy}
                          maxLength={320}
                          onChange={(event) => props.combinations.onAssemblyRenameDescriptionDraftChange(event.target.value)}
                          placeholder="Selected combination description"
                          value={props.combinations.assemblyRenameDescriptionDraft}
                        />
                        <div className="calc-project-row-actions">
                          <button className="focus-ring ui-button ui-button-ghost" disabled={!props.combinations.canRenameAssembly} onClick={() => void props.combinations.onRenameAssembly()} type="button">
                            <Pencil className="h-4 w-4" />
                            Rename combination
                          </button>
                          <button className="focus-ring ui-button ui-button-ghost" disabled={!props.combinations.projectSelected || props.busy} onClick={() => void props.combinations.onDuplicateAssembly()} type="button">
                            <Copy className="h-4 w-4" />
                            Duplicate combination
                          </button>
                          <button className="focus-ring ui-button ui-button-danger" disabled={!props.combinations.projectSelected || props.busy} onClick={() => void props.combinations.onDeleteAssembly()} type="button">
                            <Trash2 className="h-4 w-4" />
                            Delete combination
                          </button>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="calc-project-list-empty">No combinations in this project yet</div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <section className="calc-section calc-project-snapshot-section" id={props.id} aria-label="Project workspace">
      <div className="calc-project-page-head">
        <div>
          <h2>Projects</h2>
        </div>
        <div className="calc-project-panel-actions">
          <span className={props.status === "error" ? "ui-badge ui-badge-warning" : "ui-badge"}>{props.message}</span>
        </div>
      </div>

      <div className="calc-project-workspace-grid">
        <section className="calc-project-sidebar" aria-label="Project selection">
          <ProjectWorkspaceIdentity {...props.identity} busy={props.busy} selectedProjectContent={selectedProjectContent} />
        </section>

        {selectedProject ? (
          <div className="calc-project-detail">
            <details className="calc-workflow-details calc-project-reports-details">
              <summary>
                <span>Saved reports</span>
                <span className="calc-workflow-count">{reportCount}</span>
              </summary>
              <ProjectWorkspaceReports {...props.reports} busy={props.busy} status={props.status} />
            </details>
          </div>
        ) : (
          <section className="calc-project-empty-state" aria-label="Project required">
            <span>No project selected</span>
            <strong>Select a project to save combinations and reports.</strong>
          </section>
        )}
      </div>
    </section>
  );
}

"use client";

import { Copy, FileText, Pencil, Trash2 } from "lucide-react";

import {
  PROJECT_WORKSPACE_NAME_MAX_LENGTH,
  formatProjectWorkspaceUpdatedDateLabel,
  type ProjectWorkspaceAssemblySummary,
  type ProjectWorkspaceStatus
} from "./project-workspace-types";

export type ProjectWorkspaceCombinationsProps = {
  assemblyNameDraft: string;
  assemblyRenameDraft: string;
  assemblies: readonly ProjectWorkspaceAssemblySummary[];
  busy: boolean;
  canRenameAssembly: boolean;
  onAssemblyNameDraftChange: (value: string) => void;
  onAssemblyRenameDraftChange: (value: string) => void;
  onDeleteAssembly: () => Promise<void> | void;
  onDuplicateAssembly: () => Promise<void> | void;
  onLoadAssembly: () => Promise<void> | void;
  onRenameAssembly: () => Promise<void> | void;
  onSaveAssembly: () => Promise<void> | void;
  onSelectAssembly: (assemblyId: string) => void;
  projectSelected: boolean;
  selectedAssembly: ProjectWorkspaceAssemblySummary | null;
  selectedAssemblyId: string;
  selectedProjectName?: string;
  status: ProjectWorkspaceStatus;
};

function getProjectWorkspaceAssemblyKindLabel(kind: ProjectWorkspaceAssemblySummary["kind"]): string {
  return kind === "floor" ? "Floor" : "Wall";
}

function getProjectWorkspaceAssemblyResultLabel(assembly: ProjectWorkspaceAssemblySummary): string {
  if (assembly.calculationSummary?.primaryValueLabel) {
    return `${assembly.calculationSummary.primaryOutput ?? "Result"} ${assembly.calculationSummary.primaryValueLabel}`;
  }

  return assembly.calculationSummary?.status ? assembly.calculationSummary.status.replace(/_/gu, " ") : "No live result";
}

export function ProjectWorkspaceCombinations(props: ProjectWorkspaceCombinationsProps) {
  return (
    <>
      <div className="calc-project-snapshot-controls">
        <input
          aria-label="Saved combination name"
          className="focus-ring ui-field calc-project-snapshot-select"
          disabled={!props.projectSelected}
          maxLength={PROJECT_WORKSPACE_NAME_MAX_LENGTH}
          onChange={(event) => props.onAssemblyNameDraftChange(event.target.value)}
          placeholder={props.selectedProjectName ? `${props.selectedProjectName} combination name` : "Select a project first"}
          value={props.assemblyNameDraft}
        />
        <button
          className="focus-ring ui-button ui-button-primary"
          disabled={!props.projectSelected || props.status === "syncing" || props.status === "restoring"}
          onClick={() => void props.onSaveAssembly()}
          type="button"
        >
          <FileText className="h-4 w-4" />
          Save combination
        </button>
      </div>
      <div className="calc-project-list" aria-label="Saved combinations">
        {props.projectSelected && props.assemblies.length ? (
          props.assemblies.map((assembly) => {
            const selected = assembly.id === props.selectedAssemblyId;

            return (
              <div className="calc-project-row" data-assembly-id={assembly.id} data-selected={selected ? "true" : "false"} key={assembly.id}>
                <button
                  aria-pressed={selected}
                  className="focus-ring calc-project-row-main"
                  disabled={props.status === "loading"}
                  onClick={() => props.onSelectAssembly(assembly.id)}
                  type="button"
                >
                  <span className="calc-project-row-code">{assembly.displayCode ?? `v${assembly.version}`}</span>
                  <span className="calc-project-row-copy">
                    <strong>{assembly.name}</strong>
                    <span>
                      {getProjectWorkspaceAssemblyKindLabel(assembly.kind)} - v{assembly.version} -{" "}
                      {formatProjectWorkspaceUpdatedDateLabel(assembly.updatedAtIso)}
                    </span>
                  </span>
                  <span className="calc-project-row-result">{getProjectWorkspaceAssemblyResultLabel(assembly)}</span>
                </button>
                {selected ? (
                  <div className="calc-project-row-edit">
                    <input
                      aria-label="Selected combination name"
                      className="focus-ring ui-field calc-project-snapshot-select"
                      disabled={props.busy}
                      maxLength={PROJECT_WORKSPACE_NAME_MAX_LENGTH}
                      onChange={(event) => props.onAssemblyRenameDraftChange(event.target.value)}
                      placeholder="Selected combination name"
                      value={props.assemblyRenameDraft}
                    />
                    <div className="calc-project-row-actions">
                      <button
                        className="focus-ring ui-button ui-button-ghost"
                        disabled={!props.projectSelected || !props.selectedAssembly || props.busy}
                        onClick={() => void props.onLoadAssembly()}
                        type="button"
                      >
                        Load combination
                      </button>
                      <button
                        className="focus-ring ui-button ui-button-ghost"
                        disabled={!props.canRenameAssembly}
                        onClick={() => void props.onRenameAssembly()}
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                        Rename combination
                      </button>
                      <button
                        className="focus-ring ui-button ui-button-ghost"
                        disabled={!props.projectSelected || props.busy}
                        onClick={() => void props.onDuplicateAssembly()}
                        type="button"
                      >
                        <Copy className="h-4 w-4" />
                        Duplicate combination
                      </button>
                      <button
                        className="focus-ring ui-button ui-button-danger"
                        disabled={!props.projectSelected || props.busy}
                        onClick={() => void props.onDeleteAssembly()}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete combination
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="calc-project-list-empty">
            {props.projectSelected ? "No saved combinations yet" : "Select a project to manage saved combinations"}
          </div>
        )}
      </div>
    </>
  );
}

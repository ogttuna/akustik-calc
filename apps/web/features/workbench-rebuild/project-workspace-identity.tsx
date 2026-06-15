"use client";

import { Plus, RotateCcw } from "lucide-react";

import {
  PROJECT_WORKSPACE_NAME_MAX_LENGTH,
  formatProjectWorkspaceProjectOptionLabel,
  formatProjectWorkspaceUpdatedDateLabel,
  type ProjectWorkspaceProjectSummary
} from "./project-workspace-types";

export type ProjectWorkspaceIdentityProps = {
  busy: boolean;
  canCreateProject: boolean;
  onCreateProject: () => Promise<void> | void;
  onProjectNameDraftChange: (value: string) => void;
  onRefreshProjects: () => Promise<void> | void;
  onSelectProject: (projectId: string) => void;
  projectNameDraft: string;
  projects: readonly ProjectWorkspaceProjectSummary[];
  selectedProject: ProjectWorkspaceProjectSummary | null;
  selectedProjectId: string;
};

function formatProjectWorkspaceCount(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function ProjectWorkspaceIdentity(props: ProjectWorkspaceIdentityProps) {
  const createButtonClassName = props.selectedProject
    ? "focus-ring ui-button ui-button-ghost"
    : "focus-ring ui-button ui-button-primary";

  return (
    <div className="calc-project-identity" data-state={props.selectedProject ? "active" : "local"}>
      <div className="calc-project-identity-summary">
        <div className="calc-project-identity-copy">
          <span className="calc-project-identity-eyebrow">{props.selectedProject ? "Active project" : "Browser-local draft"}</span>
          <strong className="calc-project-identity-title" title={props.selectedProject?.name ?? "No project selected"}>
            {props.selectedProject?.name ?? "No project selected"}
          </strong>
          <span className="calc-project-identity-detail">
            {props.selectedProject?.ownerLabel ?? "Workbench changes are not attached to a saved project."}
          </span>
        </div>
        <div className="calc-project-identity-stats" aria-label={props.selectedProject ? "Active project summary" : "Project workspace summary"}>
          {props.selectedProject ? (
            <>
              <span className="calc-project-identity-stat">
                {formatProjectWorkspaceCount(props.selectedProject.assemblyCount, "combination")}
              </span>
              <span className="calc-project-identity-stat">{formatProjectWorkspaceCount(props.selectedProject.reportCount, "report")}</span>
              <span className="calc-project-identity-stat">{formatProjectWorkspaceUpdatedDateLabel(props.selectedProject.updatedAtIso)}</span>
            </>
          ) : (
            <>
              <span className="calc-project-identity-stat">Local only</span>
              <span className="calc-project-identity-stat">{formatProjectWorkspaceCount(props.projects.length, "saved project")}</span>
            </>
          )}
        </div>
      </div>

      <div className="calc-project-snapshot-controls calc-project-identity-controls">
        <input
          aria-label="New project name"
          className="focus-ring ui-field calc-project-snapshot-select"
          maxLength={PROJECT_WORKSPACE_NAME_MAX_LENGTH}
          onChange={(event) => props.onProjectNameDraftChange(event.target.value)}
          placeholder="New project name"
          value={props.projectNameDraft}
        />
        <button className={createButtonClassName} disabled={!props.canCreateProject} onClick={() => void props.onCreateProject()} type="button">
          <Plus className="h-4 w-4" />
          Create project
        </button>
        <select
          aria-label="Project"
          className="focus-ring ui-field calc-project-snapshot-select"
          onChange={(event) => props.onSelectProject(event.target.value)}
          value={props.selectedProjectId}
        >
          <option value="">Browser-local draft</option>
          {props.projects.map((project) => (
            <option key={project.id} value={project.id}>
              {formatProjectWorkspaceProjectOptionLabel(project)}
            </option>
          ))}
        </select>
        <button
          className="focus-ring ui-button ui-button-ghost"
          disabled={props.busy}
          onClick={() => void props.onRefreshProjects()}
          type="button"
        >
          <RotateCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>
    </div>
  );
}

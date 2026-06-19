"use client";

import { ChevronDown, Plus, RotateCcw, X } from "lucide-react";
import type { ReactNode } from "react";

import {
  PROJECT_WORKSPACE_NAME_MAX_LENGTH,
  formatProjectWorkspaceUpdatedDateLabel,
  type ProjectWorkspaceProjectSummary
} from "./project-workspace-types";

export type ProjectWorkspaceIdentityProps = {
  busy: boolean;
  canCreateProject: boolean;
  createOpen: boolean;
  expandedProjectId: string;
  onCreateProject: () => Promise<void> | void;
  onCreateOpenChange: (open: boolean) => void;
  onProjectNameDraftChange: (value: string) => void;
  onRefreshProjects: () => Promise<void> | void;
  onSelectProject: (projectId: string) => void;
  projectNameDraft: string;
  projects: readonly ProjectWorkspaceProjectSummary[];
  selectedProject: ProjectWorkspaceProjectSummary | null;
  selectedProjectContent?: ReactNode;
  selectedProjectId: string;
};

function formatProjectWorkspaceCount(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function ProjectWorkspaceIdentity(props: ProjectWorkspaceIdentityProps) {
  const createToggleClassName = props.createOpen ? "focus-ring ui-button ui-button-ghost" : "focus-ring ui-button ui-button-primary";

  return (
    <div className="calc-project-identity" data-state={props.selectedProject ? "active" : "local"}>
      <div className="calc-project-list-heading-row">
        <div className="calc-project-list-heading">Project list</div>
        <div className="calc-project-list-actions">
          <button
            aria-expanded={props.createOpen}
            className={createToggleClassName}
            disabled={props.busy}
            onClick={() => props.onCreateOpenChange(!props.createOpen)}
            type="button"
          >
            {props.createOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {props.createOpen ? "Cancel" : "New project"}
          </button>
          <button
            aria-label="Refresh projects"
            className="focus-ring ui-icon-button calc-project-refresh-button"
            disabled={props.busy}
            onClick={() => void props.onRefreshProjects()}
            title="Refresh projects"
            type="button"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {props.createOpen ? (
        <div className="calc-project-composer" aria-label="Create project">
          <input
            aria-label="New project name"
            className="focus-ring ui-field calc-project-snapshot-select"
            maxLength={PROJECT_WORKSPACE_NAME_MAX_LENGTH}
            onChange={(event) => props.onProjectNameDraftChange(event.target.value)}
            placeholder="Project name"
            value={props.projectNameDraft}
          />
          <button
            className="focus-ring ui-button ui-button-primary"
            disabled={!props.canCreateProject}
            onClick={() => void props.onCreateProject()}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Create project
          </button>
        </div>
      ) : null}

      <div className="calc-project-list" aria-label="Projects">
        <div className="calc-project-row" data-kind="local" data-selected={!props.selectedProject ? "true" : "false"}>
          <button
            aria-pressed={!props.selectedProject}
            className="focus-ring calc-project-row-main"
            disabled={props.busy}
            onClick={() => props.onSelectProject("")}
            type="button"
          >
            <span className="calc-project-row-code">Local</span>
            <span className="calc-project-row-copy">
              <strong>Browser-local draft</strong>
              <span>Not attached to a saved project</span>
            </span>
            <span className="calc-project-row-result">{props.selectedProject ? "Switch" : "Active"}</span>
          </button>
        </div>

        {props.projects.map((project) => {
          const selected = project.id === props.selectedProjectId;
          const expanded = project.id === props.expandedProjectId;

          return (
            <div className="calc-project-row" data-expanded={expanded ? "true" : "false"} data-project-id={project.id} data-selected={selected ? "true" : "false"} key={project.id}>
              <button
                aria-expanded={expanded}
                aria-pressed={selected}
                className="focus-ring calc-project-row-main"
                disabled={props.busy}
                onClick={() => props.onSelectProject(project.id)}
                type="button"
              >
                <span className="calc-project-row-code">Project</span>
                <span className="calc-project-row-copy">
                  <strong>{project.name}</strong>
                  <span>
                    {formatProjectWorkspaceCount(project.assemblyCount, "combination")} -{" "}
                    {formatProjectWorkspaceCount(project.reportCount, "report")}
                  </span>
                  <small>{project.ownerLabel}</small>
                </span>
                <span className="calc-project-row-result">
                  <span>{selected ? "Active" : formatProjectWorkspaceUpdatedDateLabel(project.updatedAtIso)}</span>
                  <ChevronDown aria-hidden="true" className="calc-project-row-chevron" />
                </span>
              </button>
              {expanded && props.selectedProjectContent ? <div className="calc-project-row-dropdown">{props.selectedProjectContent}</div> : null}
            </div>
          );
        })}

        {!props.projects.length ? <div className="calc-project-list-empty">No saved projects yet</div> : null}
      </div>
    </div>
  );
}

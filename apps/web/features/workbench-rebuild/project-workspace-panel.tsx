"use client";

import { ProjectWorkspaceCombinations, type ProjectWorkspaceCombinationsProps } from "./project-workspace-combinations";
import { ProjectWorkspaceIdentity, type ProjectWorkspaceIdentityProps } from "./project-workspace-identity";
import { ProjectWorkspaceReports, type ProjectWorkspaceReportsProps } from "./project-workspace-reports";
import type { ProjectWorkspaceStatus } from "./project-workspace-types";

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

export function ProjectWorkspacePanel(props: ProjectWorkspacePanelProps) {
  return (
    <section className="calc-section calc-project-snapshot-section" id={props.id} aria-label="Project workspace">
      <div className="calc-section-head">
        <div>
          <h2>Project workspace</h2>
        </div>
        <div className="calc-project-panel-actions">
          <span className={props.status === "error" ? "ui-badge ui-badge-warning" : "ui-badge"}>{props.message}</span>
          {props.onClose ? (
            <button className="focus-ring ui-button ui-button-ghost" onClick={props.onClose} type="button">
              Close
            </button>
          ) : null}
        </div>
      </div>
      <ProjectWorkspaceIdentity {...props.identity} busy={props.busy} />
      <ProjectWorkspaceCombinations {...props.combinations} busy={props.busy} status={props.status} />
      <ProjectWorkspaceReports {...props.reports} busy={props.busy} status={props.status} />
    </section>
  );
}

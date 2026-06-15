import { readFileSync } from "node:fs";

import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectWorkspacePanel } from "./project-workspace-panel";

const noop = () => undefined;

describe("ProjectWorkspacePanel", () => {
  beforeEach(() => {
    vi.stubGlobal("React", React);
  });

  it("renders the existing project workspace controls without changing labels", () => {
    const html = renderToStaticMarkup(
      React.createElement(ProjectWorkspacePanel, {
        busy: false,
        combinations: {
          assemblies: [
            {
              calculationSummary: {
                primaryOutput: "Rw",
                primaryValueLabel: "46 dB",
                selectedOutputs: ["Rw"],
                status: "ready"
              },
              displayCode: "ASM-0001",
              id: "assembly-1",
              kind: "wall",
              name: "Layer combination",
              updatedAtIso: "2026-06-15T08:00:00.000Z",
              version: 1
            }
          ],
          assemblyNameDraft: "Layer combination",
          assemblyRenameDraft: "Layer combination",
          canRenameAssembly: true,
          onAssemblyNameDraftChange: noop,
          onAssemblyRenameDraftChange: noop,
          onDeleteAssembly: noop,
          onDuplicateAssembly: noop,
          onLoadAssembly: noop,
          onRenameAssembly: noop,
          onSaveAssembly: noop,
          onSelectAssembly: noop,
          projectSelected: true,
          selectedAssembly: {
            displayCode: "ASM-0001",
            id: "assembly-1",
            kind: "wall",
            name: "Layer combination",
            updatedAtIso: "2026-06-15T08:00:00.000Z",
            version: 1
          },
          selectedAssemblyId: "assembly-1",
          selectedProjectName: "Hotel acoustic upgrade"
        },
        identity: {
          canCreateProject: true,
          onCreateProject: noop,
          onProjectNameDraftChange: noop,
          onRefreshProjects: noop,
          onSelectProject: noop,
          projectNameDraft: "Hotel acoustic upgrade",
          projects: [
            {
              assemblyCount: 1,
              id: "project-1",
              latestScenarioCapturedAtIso: null,
              name: "Hotel acoustic upgrade",
              ownerLabel: "local-user",
              reportCount: 1,
              scenarioCount: 0,
              updatedAtIso: "2026-06-15T08:00:00.000Z"
            }
          ],
          selectedProject: {
            assemblyCount: 1,
            id: "project-1",
            latestScenarioCapturedAtIso: null,
            name: "Hotel acoustic upgrade",
            ownerLabel: "local-user",
            reportCount: 1,
            scenarioCount: 0,
            updatedAtIso: "2026-06-15T08:00:00.000Z"
          },
          selectedProjectId: "project-1"
        },
        message: "Project ready",
        reports: {
          assemblies: [
            {
              displayCode: "ASM-0001",
              id: "assembly-1",
              kind: "wall",
              name: "Layer combination",
              updatedAtIso: "2026-06-15T08:00:00.000Z",
              version: 1
            }
          ],
          canRenameReport: true,
          onDeleteReport: noop,
          onDuplicateReport: noop,
          onOpenReport: noop,
          onRenameReport: noop,
          onReportRenameDraftChange: noop,
          onSelectReport: noop,
          onSetReportArchived: noop,
          projectSelected: true,
          reportRenameDraft: "Report draft",
          reports: [
            {
              assemblyId: "assembly-1",
              currentRevisionId: "revision-1",
              displayCode: "REP-0001",
              id: "report-1",
              name: "Report draft",
              revisionCount: 2,
              sourceAssemblyVersion: 1,
              status: "draft",
              updatedAtIso: "2026-06-15T08:30:00.000Z"
            }
          ],
          selectedReport: {
            assemblyId: "assembly-1",
            currentRevisionId: "revision-1",
            displayCode: "REP-0001",
            id: "report-1",
            name: "Report draft",
            revisionCount: 2,
            sourceAssemblyVersion: 1,
            status: "draft",
            updatedAtIso: "2026-06-15T08:30:00.000Z"
          },
          selectedReportId: "report-1"
        },
        status: "idle"
      })
    );

    expect(html).toContain("Project workspace");
    expect(html).toContain("Active project");
    expect(html).toContain("Hotel acoustic upgrade");
    expect(html).toContain("1 combination");
    expect(html).toContain("1 report");
    expect(html).toContain("New project name");
    expect(html).toContain("Create project");
    expect(html).toContain("Project ready");
    expect(html).toContain("Saved combination name");
    expect(html).toContain("Save combination");
    expect(html).toContain("Load combination");
    expect(html).toContain("Rename combination");
    expect(html).toContain("Saved reports");
    expect(html).toContain("REP-0001");
    expect(html).toContain("Open saved report");
    expect(html).toContain("Rename report");
    expect(html).toContain("Archive report");
  });

  it("keeps project route mutations out of the presentational workspace files", () => {
    const sources = [
      "./project-workspace-panel.tsx",
      "./project-workspace-identity.tsx",
      "./project-workspace-combinations.tsx",
      "./project-workspace-reports.tsx"
    ].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

    for (const source of sources) {
      expect(source).not.toContain("fetch(");
      expect(source).not.toContain("/api/projects");
    }
  });
});

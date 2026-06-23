import { describe, expect, it, vi } from "vitest";

import { loadReportAssistantProjectWorkspaceSnapshot } from "./report-assistant-project-workspace";

describe("report assistant project workspace snapshot loader", () => {
  it("loads summary-only project report context without full report document reads", async () => {
    const actions: string[] = [];
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as {
        action: string;
        projectId?: string;
        reportId?: string;
      };
      actions.push(body.action);

      if (body.action === "read_project_summary") {
        return new Response(JSON.stringify({
          ok: true,
          result: {
            project: {
              assemblyCount: 1,
              clientName: "Machinity Acoustics",
              id: body.projectId,
              name: "Hotel acoustic package",
              reportCount: 1,
              updatedAtIso: "2026-06-15T10:00:00.000Z"
            }
          }
        }));
      }

      if (body.action === "list_project_reports") {
        return new Response(JSON.stringify({
          ok: true,
          result: {
            reports: [
              {
                assemblyId: "assembly-1",
                currentRevisionId: "revision-2",
                displayCode: "RPT-0001",
                id: "report-1",
                name: "Lobby slab report",
                revisionCount: 2,
                status: "draft",
                updatedAtIso: "2026-06-15T10:05:00.000Z"
              }
            ]
          }
        }));
      }

      if (body.action === "list_project_assemblies") {
        return new Response(JSON.stringify({
          ok: true,
          result: {
            assemblies: [
              {
                calculationSummary: {
                  primaryOutput: "Rw",
                  primaryValueLabel: "58 dB",
                  selectedOutputs: ["Rw"],
                  status: "ready"
                },
                displayCode: "ASM-0001",
                id: "assembly-1",
                kind: "floor",
                name: "Lobby slab",
                updatedAtIso: "2026-06-15T10:02:00.000Z",
                version: 3
              }
            ]
          }
        }));
      }

      if (body.action === "list_project_report_revisions") {
        return new Response(JSON.stringify({
          ok: true,
          result: {
            revisions: [
              {
                changeSummary: "Generated issue.",
                createdAtIso: "2026-06-15T10:00:00.000Z",
                displayCode: "REV-0001",
                id: "revision-1",
                source: "generated"
              },
              {
                assistantPatchSummary: {
                  operationCount: 1,
                  validationStatus: "valid"
                },
                changeSummary: "Assistant-adjusted report editor draft.",
                createdAtIso: "2026-06-15T10:05:00.000Z",
                displayCode: "REV-0002",
                id: "revision-2",
                source: "assistant"
              }
            ]
          }
        }));
      }

      return new Response(JSON.stringify({
        errors: ["Unexpected action"],
        ok: false
      }), { status: 400 });
    });

    const snapshot = await loadReportAssistantProjectWorkspaceSnapshot({
      serverProjectId: "project-1",
      serverProjectReportId: "report-1"
    }, fetchMock);

    expect(actions).toEqual([
      "read_project_summary",
      "list_project_assemblies",
      "list_project_reports",
      "list_project_report_revisions"
    ]);
    expect(actions).not.toContain("read_project_report_document");
    expect(actions).not.toContain("read_project_report_revision");
    expect(snapshot).toMatchObject({
      currentRevision: {
        displayCode: "REV-0002",
        source: "assistant"
      },
      project: {
        name: "Hotel acoustic package"
      },
      linkedAssembly: {
        calculationPrimaryOutput: "Rw",
        calculationPrimaryValueLabel: "58 dB",
        calculationStatus: "ready",
        displayCode: "ASM-0001",
        id: "assembly-1",
        name: "Lobby slab",
        version: 3
      },
      report: {
        displayCode: "RPT-0001",
        revisionCount: 2
      },
      scope: "project_report"
    });
    expect(snapshot?.availableReadTools.every((tool) => tool.mutates === false)).toBe(true);
  });

  it("does not carry stale blocked assembly values into assistant project context", async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as {
        action: string;
        projectId?: string;
        reportId?: string;
      };

      if (body.action === "read_project_summary") {
        return new Response(JSON.stringify({
          ok: true,
          result: {
            project: {
              id: body.projectId,
              name: "Blocked project",
              updatedAtIso: "2026-06-15T10:00:00.000Z"
            }
          }
        }));
      }

      if (body.action === "list_project_reports") {
        return new Response(JSON.stringify({
          ok: true,
          result: {
            reports: [
              {
                assemblyId: "assembly-blocked",
                currentRevisionId: "revision-1",
                id: "report-1",
                name: "Blocked report",
                revisionCount: 1,
                status: "draft",
                updatedAtIso: "2026-06-15T10:05:00.000Z"
              }
            ]
          }
        }));
      }

      if (body.action === "list_project_assemblies") {
        return new Response(JSON.stringify({
          ok: true,
          result: {
            assemblies: [
              {
                calculationSummary: {
                  primaryOutput: "Rw",
                  primaryValueLabel: "99 dB",
                  selectedOutputs: ["Rw"],
                  status: "needs_input"
                },
                id: "assembly-blocked",
                kind: "wall",
                name: "Blocked wall",
                updatedAtIso: "2026-06-15T10:02:00.000Z",
                version: 1
              }
            ]
          }
        }));
      }

      if (body.action === "list_project_report_revisions") {
        return new Response(JSON.stringify({
          ok: true,
          result: {
            revisions: [
              {
                createdAtIso: "2026-06-15T10:00:00.000Z",
                id: "revision-1",
                source: "generated"
              }
            ]
          }
        }));
      }

      return new Response(JSON.stringify({
        errors: ["Unexpected action"],
        ok: false
      }), { status: 400 });
    });

    const snapshot = await loadReportAssistantProjectWorkspaceSnapshot({
      serverProjectId: "project-blocked",
      serverProjectReportId: "report-1"
    }, fetchMock);

    expect(snapshot?.linkedAssembly).toMatchObject({
      calculationPrimaryOutput: "Rw",
      calculationStatus: "needs_input",
      id: "assembly-blocked"
    });
    expect(snapshot?.linkedAssembly?.calculationPrimaryValueLabel).toBeUndefined();
    expect(JSON.stringify(snapshot)).not.toContain("99 dB");
  });
});

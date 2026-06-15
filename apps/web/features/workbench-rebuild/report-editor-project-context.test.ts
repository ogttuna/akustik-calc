import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const SOURCE = readFileSync(new URL("./report-editor.tsx", import.meta.url), "utf8");

describe("report editor assistant project context", () => {
  it("fetches assistant project context through read-only summary actions", () => {
    expect(SOURCE).toContain("/api/report-assistant/project-read");
    expect(SOURCE).toContain('action: "read_project_summary"');
    expect(SOURCE).toContain('action: "list_project_reports"');
    expect(SOURCE).toContain('action: "list_project_report_revisions"');
    expect(SOURCE).not.toContain('action: "read_project_report_document"');
    expect(SOURCE).not.toContain('action: "read_project_assembly_snapshot"');
    expect(SOURCE).not.toContain('action: "save_report"');
    expect(SOURCE).not.toContain('action: "apply_report_patch"');
  });

  it("keeps assistant patch proposal requests centered on the current report draft", () => {
    const assistantRequestStart = SOURCE.indexOf("async function handleAssistantRequest");
    const assistantRequestEnd = SOURCE.indexOf("function handleApplyAssistantPatch");
    const assistantRequest = SOURCE.slice(assistantRequestStart, assistantRequestEnd);

    expect(assistantRequestStart).toBeGreaterThanOrEqual(0);
    expect(assistantRequestEnd).toBeGreaterThan(assistantRequestStart);
    expect(assistantRequest).toContain("context: assistantContext");
    expect(assistantRequest).toContain("document,");
    expect(assistantRequest).toContain("instruction");
    expect(assistantRequest).toContain('url: "/api/report-assistant/patch"');
    expect(assistantRequest).not.toContain("projectContext");
    expect(assistantRequest).not.toContain("assistantProjectContext");
  });

  it("makes project/report/revision context visible without marking assistant edits saved", () => {
    expect(SOURCE).toContain("Saved report context");
    expect(SOURCE).toContain("Project context");
    expect(SOURCE).toContain("Assistant edits change only this draft until you apply them and save the project report.");
    expect(SOURCE).toContain('setProjectSaveSource("assistant")');
    expect(SOURCE).not.toContain("Project report revision saved\", {\n        description: \"Assistant patch applied");
  });
});

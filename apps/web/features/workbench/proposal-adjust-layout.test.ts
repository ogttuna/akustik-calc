import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("proposal adjust layout", () => {
  it("uses the same full-width outer spacing model as the workbench and a wider edit column", () => {
    const source = readFileSync(
      new URL("../../app/workbench/proposal/configure/proposal-adjust-client-page.tsx", import.meta.url),
      "utf8"
    );

    expect(source).toContain('px-[clamp(0.75rem,1.6vw,1.5rem)] pb-10 pt-4');
    expect(source).toContain('xl:grid-cols-[minmax(0,1.08fr)_minmax(28rem,0.92fr)] 2xl:grid-cols-[minmax(0,1.02fr)_minmax(32rem,0.98fr)]');
    expect(source).not.toContain("ui-shell flex min-h-screen");
    expect(source).not.toContain('xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)] 2xl:grid-cols-[minmax(0,1.42fr)_minmax(24rem,0.58fr)]');
  });

  it("keeps export controls inside the sticky preview rail instead of reserving a top-side card", () => {
    const source = readFileSync(
      new URL("../../app/workbench/proposal/configure/proposal-adjust-client-page.tsx", import.meta.url),
      "utf8"
    );

    expect(source).toContain('<div className="mt-5 border-t hairline pt-5">');
    expect(source).toContain('>Export target<');
    expect(source).not.toContain('grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]');
  });

  it("makes manual report edits explicit for both PDF and DOCX exports", () => {
    const source = readFileSync(
      new URL("../../app/workbench/proposal/configure/proposal-adjust-client-page.tsx", import.meta.url),
      "utf8"
    );

    expect(source).toContain("Edit the simple PDF in document order");
    expect(source).toContain("Choose one area to edit");
    expect(source).toContain("Measured / predicted indices");
    expect(source).toContain("Calculator inputs and engine outputs stay untouched");
    expect(source).toContain("Proposal note shown in PDF");
    expect(source).toContain("Download branded DOCX");
    expect(source).toContain("Download simple DOCX");
    expect(source).toContain("PDF and DOCX charts use this packaged snapshot");
    expect(source).toContain("Simple PDF hides raw warnings");
    expect(source).not.toContain("PDF chart snapshot only");
    expect(source).not.toContain("PDF only");
    expect(source).not.toContain("Simple PDF map");
  });

  it("keeps assistant report manipulation behind app validation and explicit persistence", () => {
    const source = readFileSync(
      new URL("../../app/workbench/proposal/configure/proposal-adjust-client-page.tsx", import.meta.url),
      "utf8"
    );

    expect(source).toContain("Assistant guarded report adjustments");
    expect(source).toContain("Ask assistant for a report patch");
    expect(source).toContain("Generate guarded patch");
    expect(source).toContain("/api/report-assistant/patch");
    expect(source).toContain("Review value plausibility");
    expect(source).toContain("Review plausibility");
    expect(source).toContain("Use configured source research");
    expect(source).toContain("research: plausibilityResearchRequested");
    expect(source).toContain("/api/report-assistant/plausibility");
    expect(source).toContain("Load suggested patch");
    expect(source).toContain("Log calculator review finding");
    expect(source).toContain("Log review finding");
    expect(source).toContain("/api/report-assistant/findings");
    expect(source).toContain("confirmed: true");
    expect(source).toContain("Paste assistant patch JSON");
    expect(source).toContain("Apply validated patch");
    expect(source).toContain("Engine values and calculator inputs were not changed.");
    expect(source).toContain('scope: "export_only"');
    expect(source).toContain('markReportAdjustmentScope(editableDocument, "export_only")');
    expect(source).toContain('markReportAdjustmentScope(editableDocument, "saved_snapshot")');
    expect(source).not.toContain("persistCurrentDocument({ silent: true });\n    setIsDownloadingExport");
  });
});

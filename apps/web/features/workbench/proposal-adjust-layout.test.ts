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
    expect(source).toContain("Report note shown in PDF");
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

    expect(source).toContain("Ask report assistant");
    expect(source).toContain("Ask assistant");
    expect(source).toContain("sendReportAssistantRequest");
    expect(source).toContain("createReportAssistantResearchReviewPacket");
    expect(source).toContain("getLatestReportAssistantResearchReviewPacket");
    expect(source).toContain("createReportAssistantActiveRequestRegistry");
    expect(source).toContain("isReportAssistantRequestResultActive");
    expect(source).toContain("startAssistantRequest");
    expect(source).toContain("isAssistantRequestActive");
    expect(source).toContain("readReportAssistantConversationStorage");
    expect(source).toContain("writeReportAssistantConversationStorage");
    expect(source).toContain("handleRetryLatestAssistantRequest");
    expect(source).toContain("Retry patch");
    expect(source).toContain("Retry research");
    expect(source).toContain("Retry layer research");
    expect(source).toContain('if (intent.intent === "explain")');
    expect(source).toContain("handleExplainAssistantInstruction(instruction, intentMetric);");
    expect(source).toContain("requestId: activeRequest.requestId");
    expect(source).toContain("latestAssistantContextSignatureRef");
    expect(source).toContain("documentSignature: assistantContext.assistantContextSignature");
    expect(source).toContain('"documentSignature":"${assistantContext.documentSignature}"');
    expect(source).toContain("Document signature:");
    expect(source).toContain("Assistant context signature:");
    expect(source).toContain("/api/report-assistant/patch");
    expect(source).toContain('startAssistantRequest("assembly_alternatives_research")');
    expect(source).toContain('kind: "assembly_alternatives_research"');
    expect(source).toContain('url: "/api/report-assistant/assembly-alternatives"');
    expect(source).toContain('isAssistantRequestRecordActive("assembly_alternatives_research", activeRequest)');
    expect(source).toContain('finishAssistantRequest("assembly_alternatives_research", activeRequest.requestId)');
    expect(source).toContain("Review value plausibility");
    expect(source).toContain("Review plausibility");
    expect(source).toContain("Use configured source research");
    expect(source).toContain("research: reviewResearchRequested");
    expect(source).toContain("/api/report-assistant/plausibility");
    expect(source).toContain("usePreviousResearchPacket: intent.intentClass === \"challenge_or_retry\"");
    expect(source).toContain("previousReview: previousResearchReviewPacket");
    expect(source).toContain("userChallengeText: previousResearchReviewPacket ? instruction : undefined");
    expect(source).toContain("Numeric edits cannot create unsupported or missing-input outputs.");
    expect(source).toContain("{plausibilityReview.suggestedReportPatch ? (");
    expect(source).toContain("Load suggested patch");
    expect(source).toContain("Log calculator review finding");
    expect(source).toContain("Log review finding");
    expect(source).toContain("/api/report-assistant/findings");
    expect(source).toContain("confirmed: true");
    expect(source).toContain("Paste assistant patch JSON");
    expect(source).toContain("Apply validated patch");
    expect(source).toContain("Engine values and calculator inputs were not changed.");
    expect(source).toContain("No report value was changed.");
    expect(source).toContain("Add guarded text replacements");
    expect(source).toContain("handleAddConsistencyReplacements");
    expect(source).toContain("findReportAdjustmentConsistencyMentions");
    expect(source).toContain("baseDocument: baseDocument ?? undefined");
    expect(source).toContain("reportConsistencyGateBlocked");
    expect(source).toContain("Report consistency blocks save/export");
    expect(source).toContain("Resolve report consistency findings before export");
    expect(source).toContain("qualitative metric claims");
    expect(source).toContain("disabled={isDownloadingExport || reportConsistencyGateBlocked}");
    expect(source).toContain("replace_report_text_value");
    expect(source).toContain("beforeText: mention.value");
    expect(source).toContain("afterValue: mention.afterValue");
    expect(source).toContain('scope: "export_only"');
    expect(source).toContain('markReportAdjustmentScope(editableDocument, "export_only")');
    expect(source).toContain('markReportAdjustmentScope(editableDocument, "saved_snapshot")');
    expect(source).not.toContain("persistCurrentDocument({ silent: true });\n    setIsDownloadingExport");
  });

  it("keeps explain intent local and non-mutating", () => {
    const source = readFileSync(
      new URL("../../app/workbench/proposal/configure/proposal-adjust-client-page.tsx", import.meta.url),
      "utf8"
    );
    const start = source.indexOf("function handleExplainAssistantInstruction");
    const end = source.indexOf("async function handleAssemblyAlternativeResearchInstruction");
    const explainBody = source.slice(start, end);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    expect(explainBody).toContain("buildReportAssistantContextTraceAnswer");
    expect(explainBody).toContain('source: "context"');
    expect(explainBody).toContain("No report value was changed.");
    expect(explainBody).not.toContain("sendReportAssistantRequest");
    expect(explainBody).not.toContain("setPatchDraft");
  });

  it("keeps proposal preview exports behind the same consistency gate", () => {
    const source = readFileSync(
      new URL("../../app/workbench/proposal/proposal-preview-client-page.tsx", import.meta.url),
      "utf8"
    );

    expect(source).toContain("findReportAdjustmentConsistencyMentions");
    expect(source).toContain("baseDocument: loadedPreview?.baseDocument");
    expect(source).toContain("reportConsistencyGateBlocked");
    expect(source).toContain("Report consistency blocks export");
    expect(source).toContain("qualitative metric claims");
    expect(source).toContain("showReportConsistencyBlockedToast(\"export\")");
    expect(source).toContain("showReportConsistencyBlockedToast(\"printing\")");
    expect(source).toContain("showReportConsistencyBlockedToast(\"copying\")");
    expect(source).toContain("disabled={!proposalDocument || isDownloadingPdf || reportConsistencyGateBlocked}");
    expect(source).toContain("disabled={reportConsistencyGateBlocked}");
  });
});

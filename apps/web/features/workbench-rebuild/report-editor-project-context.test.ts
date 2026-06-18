import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const SOURCE = readFileSync(new URL("./report-editor.tsx", import.meta.url), "utf8");
const RESULT_CARD_SOURCE = readFileSync(new URL("../workbench/report-assistant-result-card.tsx", import.meta.url), "utf8");

describe("report editor assistant project context", () => {
  it("fetches assistant project context through read-only summary actions", () => {
    expect(SOURCE).toContain("/api/report-assistant/project-read");
    expect(SOURCE).toContain('action: "read_project_summary"');
    expect(SOURCE).toContain('action: "list_project_assemblies"');
    expect(SOURCE).toContain('action: "list_project_reports"');
    expect(SOURCE).toContain('action: "list_project_report_revisions"');
    expect(SOURCE).toContain('action: "read_project_report_revision"');
    expect(SOURCE).not.toContain('action: "read_project_report_document"');
    expect(SOURCE).not.toContain('action: "read_project_assembly_snapshot"');
    expect(SOURCE).not.toContain('action: "save_report"');
    expect(SOURCE).not.toContain('action: "apply_report_patch"');
  });

  it("populates assistant workspace read tools without relying on an empty placeholder", () => {
    expect(SOURCE).toContain("ASSISTANT_PROJECT_READ_TOOLS");
    expect(SOURCE).toContain("REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS.map");
    expect(SOURCE).not.toContain("availableReadTools: []");
  });

  it("keeps assistant patch proposal requests centered on the current report draft", () => {
    const assistantRequestStart = SOURCE.indexOf("async function handleAssistantRequest");
    const assistantRequestEnd = SOURCE.indexOf("async function handleConfirmAssistantActionProposal");
    const assistantRequest = SOURCE.slice(assistantRequestStart, assistantRequestEnd);

    expect(assistantRequestStart).toBeGreaterThanOrEqual(0);
    expect(assistantRequestEnd).toBeGreaterThan(assistantRequestStart);
    expect(assistantRequest).toContain("context: assistantContext");
    expect(assistantRequest).toContain("document,");
    expect(assistantRequest).toContain("instruction");
    expect(assistantRequest).toContain("getAssistantPlannerEditorRequestMode(plannerDecision, instruction)");
    expect(assistantRequest).toContain('url: "/api/report-assistant/patch"');
    expect(assistantRequest).toContain('url: "/api/report-assistant/query"');
    expect(assistantRequest).toContain('url: "/api/report-assistant/action-proposal"');
    const patchRequestStart = assistantRequest.indexOf("sendReportAssistantRequest<AssistantPatchPayload>");
    const patchRequest = assistantRequest.slice(patchRequestStart);
    expect(patchRequestStart).toBeGreaterThanOrEqual(0);
    expect(patchRequest).not.toContain("projectContext");
    expect(patchRequest).not.toContain("assistantProjectContext");
  });

  it("routes query and action proposal responses through messages without applying them", () => {
    const assistantRequestStart = SOURCE.indexOf("async function handleAssistantRequest");
    const assistantRequestEnd = SOURCE.indexOf("async function handleConfirmAssistantActionProposal");
    const assistantRequest = SOURCE.slice(assistantRequestStart, assistantRequestEnd);

    expect(assistantRequest).toContain('kind: "read_only_query"');
    expect(assistantRequest).toContain('kind: "action_proposal"');
    expect(assistantRequest).toContain("startEditorAssistantRequest");
    expect(assistantRequest).toContain("finishEditorAssistantRequest(result)");
    expect(assistantRequest).toContain("requestId: activeRequest.requestId");
    expect(assistantRequest).toContain("getAssistantQueryAnswer");
    expect(assistantRequest).toContain("getAssistantQueryCalculatorPreview");
    expect(assistantRequest).toContain("getAssistantActionProposalMessage");
    expect(assistantRequest).toContain("getAssistantSelectedRevisionPayload");
    expect(assistantRequest).toContain("sourceStackAvailable: hasProjectReportSourceContext(projectContext)");
    expect(SOURCE).toContain("normalizeAssistantSelectedRevisionInstruction");
    expect(SOURCE).toContain("geri yukle");
    expect(assistantRequest).toContain('title: answer ? "Query answered" : "Query unavailable"');
    expect(assistantRequest).toContain('title: proposalMessage?.title ?? "Action preview unavailable"');
    expect(assistantRequest).not.toContain("applyValidatedReportAssistantPatch(");
    expect(assistantRequest).not.toContain("handleSaveReportToProject(");
  });

  it("preflights assistant requests through the deterministic planner before route calls", () => {
    const assistantRequestStart = SOURCE.indexOf("async function handleAssistantRequest");
    const assistantRequestEnd = SOURCE.indexOf('if (requestMode === "read_only_query")');
    const assistantRequest = SOURCE.slice(assistantRequestStart, assistantRequestEnd);

    expect(SOURCE).toContain("planReportAssistantRequest");
    expect(SOURCE).toContain("getAssistantPlannerPreflightMessage");
    expect(SOURCE).toContain("getAssistantPlannerEditorRequestMode");
    expect(SOURCE).toContain("getAssistantPlannerActionProposalName");
    expect(SOURCE).toContain("getAssistantPlannerSelectedOutputs");
    expect(SOURCE).toContain('decision.usedSignals.includes("prompt_injection_signal")');
    expect(SOURCE).toContain('decision.mode === "unsupported"');
    expect(assistantRequest).toContain("const plannerDecision = planReportAssistantRequest");
    expect(assistantRequest).toContain("documentSignature: assistantContext.documentSignature");
    expect(assistantRequest).toContain("hasProjectContext: Boolean(projectContext?.serverProjectId)");
    expect(assistantRequest).toContain("hasReportContext: Boolean(projectContext?.serverProjectReportId)");
    expect(assistantRequest).toContain("sourceStackAvailable: hasProjectReportSourceContext(projectContext)");
    expect(assistantRequest).toContain("setIsAssistantLoading(false)");
    expect(assistantRequest).toContain("plannerPreflightMessage");
  });

  it("keeps calculator preview responses structured and guarded in the assistant thread", () => {
    expect(SOURCE).toContain("getAssistantQueryCalculatorPreview");
    expect(SOURCE).toContain('envelope.name !== "preview_described_layer_configuration"');
    expect(SOURCE).toContain("envelope.previewOnly !== true");
    expect(SOURCE).toContain("envelope.mutates !== false");
    expect(SOURCE).toContain("calculatorPreview ? { calculatorPreview } : {}");
    expect(SOURCE).toContain("AssistantCalculatorPreviewBlock");
    expect(SOURCE).toContain("message.calculatorPreview");
    expect(RESULT_CARD_SOURCE).toContain("report-assistant-calculator-preview");
  });

  it("renders assistant result envelopes through registry-driven cards", () => {
    expect(SOURCE).toContain("type ReportAssistantResultEnvelope");
    expect(SOURCE).toContain("validateReportAssistantResultEnvelope");
    expect(RESULT_CARD_SOURCE).toContain("createReportAssistantResultCardModel");
    expect(SOURCE).toContain("getAssistantResultEnvelopes");
    expect(SOURCE).toContain("AssistantResultCard");
    expect(SOURCE).toContain("assistantResults?: readonly ReportAssistantResultEnvelope[]");
    expect(SOURCE).toContain("message.assistantResults");
    expect(SOURCE).toContain('result.rendererKind === "calculator_preview_card"');
    expect(RESULT_CARD_SOURCE).toContain("report-assistant-result-card");
    expect(SOURCE).toContain("report-assistant-result-cards");
    expect(SOURCE).toContain("message.calculatorPreview && !rendersCalculatorResult");
  });

  it("confirms assistant action previews through existing guarded project routes", () => {
    const confirmStart = SOURCE.indexOf("async function handleConfirmAssistantActionProposal");
    const confirmEnd = SOURCE.indexOf("function handleDismissAssistantActionProposal");
    const confirmSource = SOURCE.slice(confirmStart, confirmEnd);

    expect(confirmStart).toBeGreaterThanOrEqual(0);
    expect(confirmEnd).toBeGreaterThan(confirmStart);
    expect(confirmSource).toContain('assistantActionProposal.action === "create_project_report_from_current_draft"');
    expect(confirmSource).toContain('assistantActionProposal.action === "create_user_preset_from_current_stack"');
    expect(confirmSource).toContain('assistantActionProposal.action === "save_current_stack_as_project_assembly"');
    expect(confirmSource).toContain('assistantActionProposal.action === "save_project_report_revision_from_current_draft"');
    expect(confirmSource).toContain('assistantActionProposal.action === "restore_report_revision_as_new_draft"');
    expect(confirmSource).toContain("assistantActionProposal.documentSignature !== assistantContext.documentSignature");
    expect(confirmSource).toContain("hasProjectReportCreateContext(projectContext)");
    expect(confirmSource).toContain("hasProjectReportSourceContext(projectContext)");
    expect(confirmSource).toContain('fetch(assistantActionProposal.applyRoute.pathname');
    expect(confirmSource).toContain("snapshot: projectContext.sourceAssemblySnapshot");
    expect(confirmSource).toContain("savedPresetName");
    expect(confirmSource).toContain("projectContext.serverProjectAssemblyId !== assistantActionProposal.target.assemblyId");
    expect(confirmSource).toContain("revisionPreview.revision.id !== assistantActionProposal.target.restoreRevisionId");
    expect(confirmSource).toContain("serverProjectReportUpdatedAtIso");
    expect(confirmSource).toContain("assistantActionProposal.target.expectedReportUpdatedAtIso");
    expect(confirmSource).toContain("assistantActionProposal.applyRoute.pathname");
    expect(confirmSource).toContain("getProjectAssemblyCalculationSummary(projectContext)");
    expect(confirmSource).toContain("getProjectAssemblyKind(documentForProject, projectContext)");
    expect(confirmSource).toContain("sourceAssemblySnapshot: projectContext.sourceAssemblySnapshot");
    expect(confirmSource).toContain("sourceMaterialSnapshot: projectContext.sourceMaterialSnapshot");
    expect(confirmSource).toContain("getLatestAssistantPatchSummary(documentForProject)");
    expect(confirmSource).toContain("const sourceDocument");
    expect(confirmSource).toContain("revisionPreview?.document");
    expect(confirmSource).toContain("revisionSource");
    expect(confirmSource).toContain('assistantActionProposal.applyRoute.bodyPreview.source === "assistant"');
    expect(confirmSource).toContain("source: revisionSource");
    expect(confirmSource).toContain("storeSimpleWorkbenchProposalPreview(documentForProject");
    expect(confirmSource).not.toContain("applyValidatedReportAssistantPatch(");
    expect(confirmSource).not.toContain("handleSaveReportToProject(");
  });

  it("passes registry-backed planner action names to the action proposal route", () => {
    const actionStart = SOURCE.indexOf('if (requestMode === "action_proposal")');
    const actionEnd = SOURCE.indexOf("sendReportAssistantRequest<AssistantPatchPayload>");
    const actionRequest = SOURCE.slice(actionStart, actionEnd);

    expect(actionStart).toBeGreaterThanOrEqual(0);
    expect(actionEnd).toBeGreaterThan(actionStart);
    expect(SOURCE).toContain("isReportAssistantActionProposalName");
    expect(actionRequest).toContain("action: getAssistantPlannerActionProposalName(plannerDecision)");
    expect(actionRequest).toContain('url: "/api/report-assistant/action-proposal"');
  });

  it("makes project/report/revision context visible without marking assistant edits saved", () => {
    expect(SOURCE).toContain("Saved report context");
    expect(SOURCE).toContain("Project context");
    expect(SOURCE).toContain("Assistant edits change only this draft until you apply them and save the project report.");
    expect(SOURCE).toContain('setProjectSaveSource("assistant")');
    expect(SOURCE).not.toContain("Project report revision saved\", {\n        description: \"Assistant patch applied");
  });

  it("restores historical revisions by appending a new project report revision", () => {
    const restoreStart = SOURCE.indexOf("async function handleRestoreSelectedRevision");
    const restoreEnd = SOURCE.indexOf("async function handleSaveReportToProject");
    const restoreSource = SOURCE.slice(restoreStart, restoreEnd);

    expect(restoreStart).toBeGreaterThanOrEqual(0);
    expect(restoreEnd).toBeGreaterThan(restoreStart);
    expect(SOURCE).toContain("Revision history");
    expect(SOURCE).toContain("Read-only revision preview");
    expect(SOURCE).toContain("Restore as new revision");
    expect(restoreSource).toContain("/revisions");
    expect(restoreSource).toContain('source: "manual"');
    expect(restoreSource).toContain("Restored from");
    expect(restoreSource).toContain("expectedReportUpdatedAtIso");
    expect(restoreSource).not.toContain("currentRevisionId:");
  });
});

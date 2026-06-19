import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("workbench v2 calculator assistant ui", () => {
  const source = readFileSync(new URL("./calculator-workbench.tsx", import.meta.url), "utf8");

  it("sends the active Workbench V2 snapshot to the preview-only assistant route", () => {
    expect(source).toContain('fetch("/api/report-assistant/calculator-preview"');
    expect(source).toContain("previewCalculatorSnapshotWithAssistant(currentWorkbenchDraftSnapshot)");
    expect(source).toContain("snapshot: input.snapshot");
    expect(source).toContain("targetOutputs: [...input.snapshot.selectedOutputs]");
    expect(source).toContain("parseCalculatorAssistantPreviewPayload");
    expect(source).toContain("calc-assistant-preview-section");
    expect(source).toContain("calc-assistant-route-summary");
    expect(source).toContain("calculatorAssistantPreview.engineSummary.method");
  });

  it("keeps calculator execution outside the client component", () => {
    expect(source).toContain("WorkbenchV2CalculatorAssistantPreview");
    expect(source).toContain("WorkbenchV2CalculatorAssistantOutputRow");
    expect(source).not.toContain("@dynecho/engine");
    expect(source).not.toContain("calculateAssembly(");
  });

  it("lets explicit assistant stack commands update Workbench layer state through the undo path", () => {
    expect(source).toContain("parseWorkbenchV2AssistantLayerStackApplyCommand");
    expect(source).toContain("function applyCalculatorAssistantLayerStackCommand()");
    expect(source).toContain("currentLayers: layers");
    expect(source).toContain("currentSelectedOutputs: selectedOutputs");
    expect(source).toContain('commitLayerStackChange("assistant layer stack command"');
    expect(source).toContain("result.selectedOutputs");
    expect(source).toContain("result.previewRequested");
    expect(source).toContain("result.candidateStacks");
    expect(source).toContain("calculatorAssistantCandidateStacks");
    expect(source).toContain("calc-assistant-candidate-stack");
    expect(source).toContain("function previewCalculatorSnapshotWithAssistant(snapshot: WorkbenchV2ProjectSnapshot)");
    expect(source).toContain("function previewCalculatorAssistantCandidateStack(candidate: WorkbenchV2AssistantLayerStackCandidateStack)");
    expect(source).toContain("async function previewAllCalculatorAssistantCandidateStacks()");
    expect(source).toContain("function applyCalculatorAssistantCandidateStack(candidate: WorkbenchV2AssistantLayerStackCandidateStack)");
    expect(source).toContain("candidate.sourceLayerSignature");
    expect(source).toContain("buildCalculatorAssistantCandidateComparisonRanking");
    expect(source).toContain("calculatorAssistantCandidateComparisonState");
    expect(source).toContain("The visible layer table is unchanged.");
    expect(source).toContain("calc-assistant-candidate-comparison");
    expect(source).toContain("setContext((current) => ({");
    expect(source).toContain("calc-assistant-command");
    expect(source).toContain("Run command");
    expect(source).toContain("Preview");
    expect(source).toContain("Preview all");
    expect(source).toContain("Use");
  });

  it("lets assistant context commands update calculator inputs before preview", () => {
    expect(source).toContain('if (result.commandKind === "set_context")');
    expect(source).toContain("const nextContext = {");
    expect(source).toContain("...result.contextPatch");
    expect(source).toContain("Calculator context updated. Running the patched calculator draft through the preview route.");
    expect(source).toContain("context: nextContext");
    expect(source).toContain("Preview uses the updated inputs.");
  });

  it("confirms Workbench apply proposals before mutating the unsaved browser draft", () => {
    expect(source).toContain("confirmReportAssistantWorkbenchApplyProposal");
    expect(source).toContain("createReportAssistantWorkbenchApplyTargetSignature");
    expect(source).toContain("calculatorAssistantWorkbenchApplyProposal");
    expect(source).toContain("function confirmCalculatorAssistantWorkbenchApplyProposal(proposal: ReportAssistantWorkbenchApplyProposal)");
    expect(source).toContain('window.confirm("Apply this assistant proposal to the current unsaved Workbench draft?")');
    expect(source).toContain('commitLayerStackChange("assistant Workbench apply proposal"');
    expect(source).toContain("setSelectedOutputs([...payload.selectedOutputs])");
    expect(source).toContain("...payload.contextPatch");
    expect(source).toContain("Apply to draft");
    expect(source).toContain("Saved projects, reports, presets, and engine routes were not changed.");
  });

  it("guards preview results against stale calculator snapshots", () => {
    expect(source).toContain("calculatorAssistantPreviewSnapshotRef");
    expect(source).toContain("calculatorAssistantPreviewSnapshotRef.current === null");
    expect(source).toContain("calculatorAssistantPreviewRequestRef");
    expect(source).toContain("calculatorAssistantPreviewAbortRef");
    expect(source).toContain("const controller = new AbortController()");
    expect(source).toContain("signal: controller.signal");
    expect(source).toContain("const requestIsCurrent = () => calculatorAssistantPreviewRequestRef.current === requestId && !controller.signal.aborted");
    expect(source).toContain("calculatorAssistantPreviewAbortRef.current?.abort()");
  });
});

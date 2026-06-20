import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  buildCalculatorAssistantSourceReviewSnapshot,
  classifyCalculatorAssistantCommandRouting,
  isCalculatorAssistantSourceReviewCommand,
  resolveCalculatorAssistantSourceReviewOutputId
} from "./calculator-workbench";
import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  type WorkbenchV2ProjectSnapshot
} from "./workbench-v2-project-snapshot";

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
    expect(source).toContain("async function applyCalculatorAssistantLayerStackCommand()");
    expect(source).toContain("requestCalculatorAssistantCommandInterpretation");
    expect(source).toContain('fetch("/api/report-assistant/calculator-command-intent"');
    expect(source).toContain("decision.normalizedCommand");
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
    expect(source).toContain("Interpreting");
    expect(source).toContain("Preview");
    expect(source).toContain("Preview all");
    expect(source).toContain("Use");
  });

  it("routes source-review wording away from calculator draft mutation", () => {
    expect(isCalculatorAssistantSourceReviewCommand({
      instruction: "Ekrandaki stacke bak Rw fazla mı az mı? İnternetten araştır.",
      selectedOutputs: ["Rw"]
    })).toBe(true);
    expect(isCalculatorAssistantSourceReviewCommand({
      instruction: "Şu değer makul mu kaynaklarla karşılaştır.",
      selectedOutputs: ["Rw"]
    })).toBe(true);
    expect(isCalculatorAssistantSourceReviewCommand({
      instruction: "gypsium, rock wool, gypsum mantıklı kalınlıklarla diz",
      selectedOutputs: ["Rw"]
    })).toBe(false);
    expect(isCalculatorAssistantSourceReviewCommand({
      instruction: "ekrandaki katmanların kalınlıklarını internetten araştırıp doldur",
      selectedOutputs: ["Rw"]
    })).toBe(false);
    expect(isCalculatorAssistantSourceReviewCommand({
      instruction: "db garip geldi netten bak abi daha makul değer varsa bana sor",
      selectedOutputs: ["Rw"]
    })).toBe(true);
    expect(isCalculatorAssistantSourceReviewCommand({
      instruction: "Daha makul değer varsa bana sor, onaylarsam rapora uygula",
      selectedOutputs: ["Rw"]
    })).toBe(true);
  });

  it("blocks direct calculator value override wording before layer mutation parsing", () => {
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "Rw 52 yap",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      reason: "direct_calculator_value_override",
      status: "clarify"
    });
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "Rw 52 olmalı",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      reason: "direct_calculator_value_override",
      status: "clarify"
    });
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "Rw 52 olmalı mı",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      reason: "current_value_review",
      status: "source_review"
    });
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "sonucu 52 dB yap",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      reason: "direct_calculator_value_override",
      status: "clarify"
    });
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "Rw doğru cevap 52 olmalı, editleyim mi diye sor",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      reason: "report_override_confirmation",
      status: "report_override_request"
    });
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "gypsium, rock wool, gypsum mantıklı kalınlıklarla diz",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      status: "layer_mutation"
    });
  });

  it("selects the explicitly requested source-review output before falling back", () => {
    expect(resolveCalculatorAssistantSourceReviewOutputId({
      availableOutputs: ["Rw", "STC"],
      fallbackOutput: "Rw",
      instruction: "STC yüksek mi kaynaklarla araştır"
    })).toBe("STC");
    expect(resolveCalculatorAssistantSourceReviewOutputId({
      availableOutputs: ["Rw", "STC"],
      fallbackOutput: "Rw",
      instruction: "Bu değer makul mü?"
    })).toBe("Rw");
  });

  it("adds explicitly requested review outputs to temporary preview snapshots only", () => {
    const snapshot: WorkbenchV2ProjectSnapshot = {
      context: WORKBENCH_V2_DEFAULT_CONTEXT,
      customMaterials: [],
      id: "review-snapshot",
      layers: [
        { id: "layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" }
      ],
      materialVisualOverrides: [],
      mode: "wall",
      name: "Review snapshot",
      savedAtIso: "2026-06-19T00:00:00.000Z",
      schemaId: "dynecho.workbench-v2.snapshot.v1",
      selectedLayerId: "layer-1",
      selectedOutputs: ["Rw"]
    };

    const next = buildCalculatorAssistantSourceReviewSnapshot({
      outputId: "STC",
      snapshot
    });
    const alreadySelected = buildCalculatorAssistantSourceReviewSnapshot({
      outputId: "Rw",
      snapshot
    });

    expect(next).not.toBe(snapshot);
    expect(next.selectedOutputs).toEqual(["Rw", "STC"]);
    expect(snapshot.selectedOutputs).toEqual(["Rw"]);
    expect(alreadySelected).toBe(snapshot);
  });

  it("wires current calculator source review through the plausibility route and typed result card", () => {
    expect(source).toContain("buildReportAssistantCurrentCalculatorReviewPacketFromCalculatorPreview");
    expect(source).toContain("buildCalculatorAssistantSourceReviewSnapshot");
    expect(source).toContain('fetch("/api/report-assistant/plausibility"');
    expect(source).toContain("currentCalculatorReviewPacket");
    expect(source).toContain("suggestPatch: false");
    expect(source).toContain("isCalculatorAssistantSourceReviewCommand");
    expect(source).toContain("reviewCurrentCalculatorWithAssistantSource");
    expect(source).toContain("AssistantResultCard");
    expect(source).toContain("Source review running");
    expect(source).toContain("Calculator output was left unchanged.");
  });

  it("keeps source-review report edits separate from calculator mutation and behind confirmation", () => {
    expect(source).toContain("parseCalculatorAssistantSourceReviewReview");
    expect(source).toContain("buildReportAssistantSourceBackedReportOverridePatch");
    expect(source).toContain("validateReportAssistantPatch");
    expect(source).toContain("applyValidatedReportAssistantPatch");
    expect(source).toContain("loadSelectedCalculatorAssistantReportOverrideTarget");
    expect(source).toContain("prepareCalculatorAssistantReportOverrideProposal");
    expect(source).toContain("applyPreparedCalculatorAssistantReportOverrideProposal");
    expect(source).toContain("storeSimpleWorkbenchProposalPreviewCustomizations");
    expect(source).toContain("Open or create a report first");
    expect(source).toContain("Source-backed review required");
    expect(source).toContain("Context-only reviews stay advisory.");
    expect(source).toContain("Prepare report edit");
    expect(source).toContain("Apply to report draft");
    expect(source).toContain("Calculator values and layer stack will stay unchanged.");
    expect(source).toContain("Calculator values stay unchanged.");
    expect(source).toContain("setCalculatorAssistantReportOverrideProposalState((current) => (current.status === \"idle\" ? current : { status: \"idle\" }))");
    expect(source).not.toContain("Rw 41 yanlış, 52 yapıyorum");
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

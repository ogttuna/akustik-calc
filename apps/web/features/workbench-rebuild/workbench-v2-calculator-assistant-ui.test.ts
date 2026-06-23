import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  CALCULATOR_ASSISTANT_PROMPT_EXAMPLES,
  buildCalculatorAssistantSourceReviewSnapshot,
  classifyCalculatorAssistantCommandRouting,
  ensureCalculatorAssistantRwFirstSelectedOutputs,
  isCalculatorAssistantReportOverrideFollowupCommand,
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

  it("shows assistant prompt examples as fill-only command chips", () => {
    expect(CALCULATOR_ASSISTANT_PROMPT_EXAMPLES).toEqual([
      {
        label: "Rw kontrol et",
        prompt: "Ekrandaki stacke bak Rw fazla mı az mı? İnternetten araştır."
      },
      {
        label: "Rw artır",
        prompt: "Bu layer kombinasyonunun Rw değerini beğenmedim, birkaç layer daha ekle ki Rw artsın, en mantıklısını seç."
      },
      {
        label: "Edit planı",
        prompt: "2. layerı sil, 15 mm gypsum ekle, Rw ve STC seç, hesapla."
      },
      {
        label: "Alternatif ara",
        prompt: "Bu katman kombinasyonuna alternatif malzeme araştır."
      },
      {
        label: "Araştırmayı ayır",
        prompt: "internetten araştır sonra gypsum ekle."
      }
    ]);
    expect(new Set(CALCULATOR_ASSISTANT_PROMPT_EXAMPLES.map((example) => example.label)).size).toBe(
      CALCULATOR_ASSISTANT_PROMPT_EXAMPLES.length
    );
    expect(source).toContain("calc-assistant-prompt-examples");
    expect(source).toContain("calc-assistant-prompt-chip");
    expect(source).toContain("Use assistant prompt:");
    expect(source).toContain("setCalculatorAssistantCommand(example.prompt)");
    expect(source).toContain("calculatorAssistantCommandInputRef.current?.focus()");
    expect(source).toContain("Rw kontrol et");
    expect(source).toContain("Rw artır");
    expect(source).toContain("Edit planı");
    expect(source).toContain("Alternatif ara");
    expect(source).toContain("Araştırmayı ayır");
    expect(source).not.toContain("applyCalculatorAssistantLayerStackCommand(example.prompt)");
  });

  it("keeps every assistant prompt example routed to its intended safe assistant lane", () => {
    const expectedRoutes = [
      {
        label: "Rw kontrol et",
        reason: "explicit_source_review",
        status: "source_review"
      },
      {
        label: "Rw artır",
        reason: "wall_rw_improvement_candidate_planning",
        status: "objective_candidate_planning"
      },
      {
        label: "Edit planı",
        reason: "multi_step_edit_plan_required",
        status: "bounded_edit_plan"
      },
      {
        label: "Alternatif ara",
        reason: "source_backed_layer_alternative_research",
        status: "source_alternative_research"
      },
      {
        label: "Araştırmayı ayır",
        reason: "research_write_requires_clarification",
        status: "clarify"
      }
    ] as const;

    for (const expectedRoute of expectedRoutes) {
      const example = CALCULATOR_ASSISTANT_PROMPT_EXAMPLES.find((candidate) =>
        candidate.label === expectedRoute.label
      );

      expect(example, expectedRoute.label).toBeDefined();
      expect(classifyCalculatorAssistantCommandRouting({
        instruction: example?.prompt ?? "",
        selectedOutputs: ["Rw"]
      }), expectedRoute.label).toMatchObject({
        reason: expectedRoute.reason,
        status: expectedRoute.status
      });
    }

    for (const example of CALCULATOR_ASSISTANT_PROMPT_EXAMPLES) {
      expect(classifyCalculatorAssistantCommandRouting({
        instruction: example.prompt,
        selectedOutputs: ["Rw"]
      }).status, example.label).not.toBe("layer_mutation");
    }
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

  it("answers mixed research-and-edit wording without treating it as a draft mutation", () => {
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "internetten araştır sonra gypsum ekle",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      reason: "research_write_requires_clarification",
      status: "clarify"
    });
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "ekrandaki katmanların kalınlıklarını internetten araştırıp doldur",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      reason: "research_write_requires_clarification",
      status: "clarify"
    });
    expect(source).toContain("Research edit needs clarification");
    expect(source).toContain("Research wording was not applied");
  });

  it("routes objective-driven Rw improvement prompts to planner candidates before generic candidate generation", () => {
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "Rw'yi artirmak icin layer ekle ve alternatifleri calculator ile dene",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      reason: "wall_rw_improvement_candidate_planning",
      status: "objective_candidate_planning"
    });
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "Bu layer kombinasyonunun Rw degerini begenmedim, birkac layer daha ekle ki Rw artsin, en mantiklisini sec",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      reason: "wall_rw_improvement_candidate_planning",
      status: "objective_candidate_planning"
    });
  });

  it("routes source-backed layer alternative prompts to assembly research candidate bridging", () => {
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "Bu katman kombinasyonuna alternatif malzeme araştır",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      reason: "source_backed_layer_alternative_research",
      status: "source_alternative_research"
    });
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "SilentFX özel panel gibi bir alternatif kaynaklardan bak",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      reason: "source_backed_layer_alternative_research",
      status: "source_alternative_research"
    });
    expect(source).toContain('fetch("/api/report-assistant/assembly-alternatives"');
    expect(source).toContain("createWorkbenchV2AssistantSourceAlternativeCandidatesFromReview");
    expect(source).toContain("setCalculatorAssistantCandidateStacks(candidateBridge.candidateStacks)");
    expect(source).toContain("Source alternative candidates prepared");
    expect(source).toContain("Source alternative needs clarification");
    expect(source).toContain("calculatorAssistantSourceAlternativeState.clarificationPrompts");
    expect(source).toContain("No Workbench layer changed yet.");
  });

  it("wires objective planner output into existing candidate state without applying it", () => {
    expect(source).toContain("planWorkbenchWallRwImprovementCandidates");
    expect(source).toContain('routingDecision.status === "objective_candidate_planning"');
    expect(source).toContain("ensureCalculatorAssistantRwFirstSelectedOutputs(selectedOutputs)");
    expect(source).toContain("setCalculatorAssistantCandidateStacks(improvementPlan.candidateStacks)");
    expect(source).toContain("setCalculatorAssistantCandidateComparisonState({ status: \"idle\" })");
    expect(source).toContain("Rw improvement candidates prepared");
    expect(source).toContain("No calculator value was generated yet.");
  });

  it("routes objective candidate use through a confirmed Workbench apply proposal", () => {
    expect(source).toContain("Objective planner candidates must prepare a confirmed Workbench proposal");
    expect(source).toContain("isWorkbenchWallRwImprovementCandidateStack(candidate)");
    expect(source).toContain("createWorkbenchV2AssistantCandidateApplyProposal");
    expect(source).toContain("calculatorAssistantCandidatePreviewSummaryForApply(candidate)");
    expect(source).toContain("setCalculatorAssistantWorkbenchApplyProposal(proposalResult.proposal)");
    expect(source).toContain("No Workbench layer changed yet.");
  });

  it("keeps Rw first for objective candidate preview and ranking while preserving other outputs", () => {
    expect(ensureCalculatorAssistantRwFirstSelectedOutputs(["STC", "Rw", "DnT,w"])).toEqual(["Rw", "STC", "DnT,w"]);
    expect(ensureCalculatorAssistantRwFirstSelectedOutputs(["STC", "DnT,w"])).toEqual(["Rw", "STC", "DnT,w"]);
    expect(ensureCalculatorAssistantRwFirstSelectedOutputs(["Rw", "STC"])).toEqual(["Rw", "STC"]);
  });

  it("routes multi-step edit-plan prompts to the bounded dry-run panel before single-command parsing", () => {
    expect(classifyCalculatorAssistantCommandRouting({
      instruction: "rockwool'u cikar, iki gypsum layer ekle, iki alternatif dene",
      selectedOutputs: ["Rw"]
    })).toMatchObject({
      reason: "multi_step_edit_plan_required",
      status: "bounded_edit_plan"
    });
    expect(source).toContain("createWorkbenchV2AssistantBoundedEditPlan");
    expect(source).toContain('routingDecision.status === "bounded_edit_plan"');
    expect(source).toContain("setCalculatorAssistantBoundedEditPlanState");
    expect(source).toContain('data-kind="bounded-edit-plan-dry-run"');
    expect(source).toContain("No Workbench layer changed yet.");
    expect(source).toContain("Multi-step dry run ready");
    expect(source).toContain("Multi-step dry run blocked");
    expect(source).not.toContain("confirmCalculatorAssistantBoundedEditPlan");
  });

  it("wires bounded edit-plan dry runs into the existing confirmed Workbench apply proposal gate", () => {
    expect(source).toContain("createWorkbenchV2AssistantBoundedEditPlanApplyProposal");
    expect(source).toContain("function prepareCalculatorAssistantBoundedEditPlanApplyProposal()");
    expect(source).toContain("calculatorAssistantBoundedEditPlanState.status !== \"ready\"");
    expect(source).toContain("getWorkbenchV2AssistantLayerStackSignature(layers)");
    expect(source).toContain("calculatorAssistantBoundedEditPlanState.result.initialLayerSignature");
    expect(source).toContain("The visible layer stack changed after this dry run. Run the dry run again before preparing an apply proposal.");
    expect(source).toContain("plan: calculatorAssistantBoundedEditPlanState.result");
    expect(source).toContain("setCalculatorAssistantWorkbenchApplyProposal(proposalResult.proposal)");
    expect(source).toContain("Prepare apply proposal");
    expect(source).toContain("Apply bounded edit plan to draft");
    expect(source).toContain("confirmCalculatorAssistantWorkbenchApplyProposal(calculatorAssistantWorkbenchApplyProposal)");
    expect(source).not.toContain("confirmCalculatorAssistantBoundedEditPlan");
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

  it("routes report-apply follow-up wording to the source-review proposal gate", () => {
    expect(isCalculatorAssistantReportOverrideFollowupCommand("tamam rapora uygula")).toBe(true);
    expect(isCalculatorAssistantReportOverrideFollowupCommand("ok report apply")).toBe(true);
    expect(isCalculatorAssistantReportOverrideFollowupCommand("Rw değeri makul mü araştır")).toBe(false);
    expect(source).toContain("isCalculatorAssistantReportOverrideFollowupCommand(instruction)");
    expect(source).toContain("await prepareCalculatorAssistantReportOverrideProposal()");
    expect(source).toContain("Run a source review before preparing a report draft edit.");
    expect(source).toContain("The visible Workbench draft changed after this source review. Run source review again before preparing a report edit.");
    expect(source).toContain("The selected report target changed after this report edit was prepared.");
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
    expect(source).toContain("normalizeWorkbenchV2SelectedOutputs(payload.selectedOutputs, payload.mode)");
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

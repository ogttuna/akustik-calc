import { describe, expect, it } from "vitest";

import {
  createReportAssistantWorkbenchApplyProposal,
  createReportAssistantWorkbenchApplyTargetSignature
} from "./report-assistant-workbench-apply-proposal";
import type { ReportAssistantLayerStackDraft } from "./report-assistant-layer-stack-draft";
import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  type WorkbenchV2ContextDraft,
  type WorkbenchV2DraftLayer
} from "../workbench-rebuild/workbench-v2-project-snapshot";

function readyWallDraft(overrides: Partial<ReportAssistantLayerStackDraft> = {}): ReportAssistantLayerStackDraft {
  return {
    assumptions: [],
    contextSignature: "ctx.apply.ready",
    customMaterials: [],
    draftId: "draft.apply.ready",
    lastCalculatorPreview: {
      routeStatus: "ready",
      snapshotSignature: "preview.snapshot.ready"
    },
    layers: [
      {
        id: "assistant-layer-1",
        materialId: "gypsum_board",
        materialName: "Gypsum Board",
        originalPhrase: "12.5 mm gypsum board",
        role: "side_a",
        thicknessMm: 12.5
      },
      {
        id: "assistant-layer-2",
        materialId: "rockwool",
        materialName: "Rock Wool",
        originalPhrase: "50 mm rock wool",
        role: "cavity",
        thicknessMm: 50
      },
      {
        id: "assistant-layer-3",
        materialId: "gypsum_board",
        materialName: "Gypsum Board",
        originalPhrase: "12.5 mm gypsum board",
        role: "side_b",
        thicknessMm: 12.5
      }
    ],
    mode: "wall",
    originalPhrases: ["12.5 mm gypsum board", "50 mm rock wool", "12.5 mm gypsum board"],
    requestedOutputs: ["Rw", "STC"],
    source: "user_instruction",
    sourceInstruction: "gypsum, rock wool, gypsum diz ve Rw STC hesapla",
    wallTopologyDraft: {
      leafMapping: "explicit",
      supportSpacingMm: 600,
      supportTopology: "independent_frames",
      topology: "double_leaf_framed"
    },
    warnings: [],
    ...overrides
  };
}

function targetWorkbench(input?: {
  context?: Partial<WorkbenchV2ContextDraft>;
  layers?: readonly WorkbenchV2DraftLayer[];
}) {
  const context: WorkbenchV2ContextDraft = {
    ...WORKBENCH_V2_DEFAULT_CONTEXT,
    ...input?.context
  };
  const layers: WorkbenchV2DraftLayer[] = input?.layers
    ? input.layers.map((layer) => ({ ...layer }))
    : [
        {
          id: "current-layer-1",
          materialId: "concrete",
          role: "core",
          thicknessMm: "100"
        }
      ];
  const selectedOutputs = ["Rw"] as const;
  const mode = "wall" as const;
  const snapshotSignature = createReportAssistantWorkbenchApplyTargetSignature({
    context,
    layers,
    mode,
    selectedOutputs
  });

  return {
    context,
    layers,
    mode,
    selectedOutputs,
    snapshotSignature
  };
}

describe("report assistant Workbench apply proposal", () => {
  it("creates a non-mutating exact diff proposal from a ready layer-stack draft", () => {
    const draft = readyWallDraft();
    const target = targetWorkbench();

    const result = createReportAssistantWorkbenchApplyProposal({
      calculatorPreviewSummary: {
        basis: [
          {
            basis: "workbench_v2_calculator_preview",
            metricId: "Rw",
            routeStatus: "ready",
            unit: "dB",
            valueLabel: "46 dB"
          }
        ],
        primaryOutput: "Rw 46 dB",
        routeStatus: "ready",
        snapshotSignature: "preview.snapshot.ready"
      },
      draft,
      expectedSourceDraftContextSignature: draft.contextSignature,
      expectedTargetWorkbenchSnapshotSignature: target.snapshotSignature,
      targetWorkbench: target
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.proposal).toMatchObject({
      action: "apply_layer_stack_draft_to_workbench",
      mutates: false,
      previewOnly: true,
      requiresConfirmation: true,
      sourceDraft: {
        contextSignature: "ctx.apply.ready",
        draftId: "draft.apply.ready",
        layerCount: 3,
        mode: "wall",
        requestedOutputs: ["Rw", "STC"]
      },
      staleGuards: {
        sourceDraftContextSignature: "ctx.apply.ready",
        targetWorkbenchSnapshotSignature: target.snapshotSignature
      },
      targetWorkbench: {
        layerCount: 1,
        mode: "wall",
        selectedOutputs: ["Rw"],
        snapshotSignature: target.snapshotSignature
      }
    });
    expect(result.proposal.proposedWorkbench.layers).toEqual([
      {
        id: "assistant-layer-1",
        materialId: "gypsum_board",
        role: "side_a",
        thicknessMm: "12.5"
      },
      {
        id: "assistant-layer-2",
        materialId: "rockwool",
        role: "cavity",
        thicknessMm: "50"
      },
      {
        id: "assistant-layer-3",
        materialId: "gypsum_board",
        role: "side_b",
        thicknessMm: "12.5"
      }
    ]);
    expect(result.proposal.diff.layers.map((entry) => entry.operation)).toEqual([
      "replace",
      "add",
      "add"
    ]);
    expect(result.proposal.diff.layers[0]).toMatchObject({
      after: {
        materialId: "gypsum_board",
        materialName: "Gypsum Board",
        sourcePhrase: "12.5 mm gypsum board",
        thicknessMm: "12.5"
      },
      before: {
        materialId: "concrete",
        thicknessMm: "100"
      },
      index: 0
    });
    expect(result.proposal.diff.selectedOutputs).toEqual({
      added: ["STC"],
      after: ["Rw", "STC"],
      before: ["Rw"],
      removed: [],
      unchanged: ["Rw"]
    });
    expect(result.proposal.proposedWorkbench.contextPatch).toMatchObject({
      supportSpacingMm: "600",
      wallCavity1LayerIndices: "2",
      wallSideALeafLayerIndices: "1",
      wallSideBLeafLayerIndices: "3",
      wallSupportTopology: "independent_frames",
      wallTopologyMode: "double_leaf_framed"
    });
    expect(result.proposal.diff.context.map((entry) => entry.field)).toEqual([
      "wallTopologyMode",
      "wallSideALeafLayerIndices",
      "wallCavity1LayerIndices",
      "wallSideBLeafLayerIndices",
      "wallSupportTopology",
      "supportSpacingMm"
    ]);
    expect(result.proposal.calculatorPreviewSummary).toMatchObject({
      basis: [
        {
          metricId: "Rw",
          routeStatus: "ready",
          valueLabel: "46 dB"
        }
      ],
      primaryOutput: "Rw 46 dB",
      routeStatus: "ready",
      selectedOutputs: ["Rw", "STC"],
      snapshotSignature: "preview.snapshot.ready"
    });
    expect(result.proposal.assistantResult).toMatchObject({
      authority: "draft_only",
      capabilityName: "report_assistant_workbench_apply_proposal",
      mutates: false,
      previewOnly: true,
      rendererKind: "action_proposal_card",
      requiresConfirmation: true,
      resultKind: "action_proposal",
      routeStatus: "ready",
      stalePolicy: "target_stale_guard"
    });
    expect(JSON.stringify(result.proposal)).not.toContain("fetch(");
    expect(JSON.stringify(result.proposal)).not.toContain("projectId");
    expect(JSON.stringify(result.proposal)).not.toContain("reportId");
    expect(JSON.stringify(result.proposal)).not.toContain("preset");
  });

  it("rejects stale source draft signatures before building a proposal", () => {
    const draft = readyWallDraft();
    const target = targetWorkbench();

    expect(createReportAssistantWorkbenchApplyProposal({
      draft,
      expectedSourceDraftContextSignature: "ctx.old",
      expectedTargetWorkbenchSnapshotSignature: target.snapshotSignature,
      targetWorkbench: target
    })).toMatchObject({
      code: "stale_source_draft",
      mutates: false,
      ok: false,
      statusCode: 409
    });
  });

  it("rejects stale target Workbench signatures before building a proposal", () => {
    const draft = readyWallDraft();
    const target = targetWorkbench();

    expect(createReportAssistantWorkbenchApplyProposal({
      draft,
      expectedSourceDraftContextSignature: draft.contextSignature,
      expectedTargetWorkbenchSnapshotSignature: "workbench:old",
      targetWorkbench: target
    })).toMatchObject({
      code: "stale_target_workbench",
      mutates: false,
      ok: false,
      statusCode: 409
    });
  });

  it("rejects incomplete drafts instead of applying guessed layers", () => {
    const draft = readyWallDraft({
      layers: [
        {
          id: "assistant-layer-incomplete",
          materialId: "gypsum_board",
          materialName: "Gypsum Board",
          originalPhrase: "gypsum board",
          role: "unknown"
        }
      ],
      requestedOutputs: []
    });
    const target = targetWorkbench();

    const result = createReportAssistantWorkbenchApplyProposal({
      draft,
      expectedSourceDraftContextSignature: draft.contextSignature,
      expectedTargetWorkbenchSnapshotSignature: target.snapshotSignature,
      targetWorkbench: target
    });

    expect(result).toMatchObject({
      code: "draft_needs_input",
      mutates: false,
      ok: false,
      statusCode: 400
    });
    if (result.ok) {
      throw new Error("Expected incomplete draft proposal to be rejected.");
    }
    expect(result.errors).toEqual([
      'What is the mm thickness for "gypsum board"?',
      'What role should "gypsum board" use in the stack?',
      "Which outputs should be calculated? Example: Rw, STC, DnT,w, Ln,w."
    ]);
  });

  it("keeps proposals non-numeric when no ready calculator preview is attached", () => {
    const draft = readyWallDraft({
      lastCalculatorPreview: undefined
    });
    const target = targetWorkbench();

    const result = createReportAssistantWorkbenchApplyProposal({
      draft,
      expectedSourceDraftContextSignature: draft.contextSignature,
      expectedTargetWorkbenchSnapshotSignature: target.snapshotSignature,
      targetWorkbench: target
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.proposal.calculatorPreviewSummary).toEqual({
      basis: [],
      routeStatus: "not_run",
      selectedOutputs: ["Rw", "STC"]
    });
    expect(result.proposal.warnings).toContain(
      "No ready calculator preview is attached; this proposal can apply the typed draft but cannot claim calculator-backed numeric values."
    );
    expect(result.proposal.assistantResult.basis).toEqual([]);
  });
});

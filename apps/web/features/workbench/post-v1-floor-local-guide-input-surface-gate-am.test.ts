import { deriveImpactGuideMetrics } from "@dynecho/engine";
import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildImpactGuideFieldGuides } from "./impact-field-guides";
import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getPresetById } from "./preset-definitions";
import { buildResultAnswerChartLanes } from "./result-answer-chart-model";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import { getTargetOutputStatus } from "./target-output-status";
import type { LayerDraft } from "./workbench-store";

const TARGET_OUTPUTS = [
  "Ln,w+CI",
  "L'nT,50",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const LOCAL_GUIDE_LOOKUP_CONTEXT = {
  guideHdDb: 0,
  guideMassRatio: 2.5
} as const satisfies ImpactFieldContext;

const UBIQ_EXACT_TIMBER_ROWS = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
] as const satisfies readonly Omit<LayerDraft, "id">[];

const UBIQ_CARPET_BOUND_ROWS = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: "12" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
] as const satisfies readonly Omit<LayerDraft, "id">[];

function evaluateGateAmScenario(input: {
  fieldContext?: ImpactFieldContext;
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario {
  return evaluateScenario({
    airborneContext: {
      contextMode: "building_prediction",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      receivingRoomVolumeM3: 55
    },
    id: input.id,
    impactFieldContext: input.fieldContext ?? LOCAL_GUIDE_LOOKUP_CONTEXT,
    name: input.id,
    rows: input.rows.map((row, index) => ({ ...row, id: `${input.id}-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("ubiq_open_web_300_bound"),
    briefNote: "",
    clientName: "Gate AM Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AM Local Guide Input Surface",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "55",
    targetRwDb: ""
  });
}

describe("post-V1 floor local-guide input-surface Gate AM parity", () => {
  it("shows exact L'nT,50 from mass-ratio K lookup plus explicit Hd on cards, status, chart, and report", () => {
    const scenario = evaluateGateAmScenario({
      id: "gate-am-ubiq-exact-timber-local-guide",
      rows: UBIQ_EXACT_TIMBER_ROWS
    });

    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(scenario.result?.impact?.guideEstimateKSource).toBe("lookup_from_mass_ratio");
    expect(scenario.result?.impact?.guideEstimateHdSource).toBe("explicit_input");
    expect(scenario.result?.impact?.LPrimeNT50).toBe(52);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Ln,w+CI", "L'nT,50", "L'n,w"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["L'nT,w"]);

    const card = buildOutputCard({
      output: "L'nT,50",
      result: scenario.result,
      studyMode: "floor"
    });
    expect(card).toMatchObject({ status: "live", value: "52 dB" });

    const status = getTargetOutputStatus({
      guideResult: null,
      output: "L'nT,50",
      result: scenario.result
    });
    expect(status.kind).toBe("engine_live");

    expect(buildResultAnswerChartLanes({ result: scenario.result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([
            { label: "L'nT,50", valueLabel: "52 dB" }
          ]),
          id: "impact"
        })
      ])
    );

    expect(buildReport(scenario)).toContain("- Impact L'nT,50: 52.0 dB");
  });

  it("treats combined Ln,w+CI bounds as an active local-guide base instead of a dead guide lane", () => {
    const scenario = evaluateGateAmScenario({
      id: "gate-am-ubiq-carpet-bound-local-guide",
      rows: UBIQ_CARPET_BOUND_ROWS
    });
    const guideResult = deriveImpactGuideMetrics({
      baseConfidence: scenario.result?.lowerBoundImpact?.confidence,
      baseLnWPlusCIUpperBound: scenario.result?.lowerBoundImpact?.LnWPlusCIUpperBound,
      hdDb: LOCAL_GUIDE_LOOKUP_CONTEXT.guideHdDb,
      massRatio: LOCAL_GUIDE_LOOKUP_CONTEXT.guideMassRatio,
      source: "live_stack"
    });
    const fieldGuides = buildImpactGuideFieldGuides({
      baseImpact: null,
      baseLowerBoundImpact: scenario.result?.lowerBoundImpact ?? null,
      ci50_2500Input: "",
      ciInput: "",
      guideResult,
      hdInput: "0",
      kInput: "",
      massRatioInput: "2.5",
      receivingRoomVolumeM3: "",
      selectedSource: "live_stack",
      smallRoomEstimateEnabled: false
    });

    expect(scenario.result?.lowerBoundImpact?.basis).toBe("mixed_bound_plus_estimated_local_guide");
    expect(scenario.result?.lowerBoundImpact?.guideEstimateKSource).toBe("lookup_from_mass_ratio");
    expect(scenario.result?.lowerBoundImpact?.guideEstimateHdSource).toBe("explicit_input");
    expect(scenario.result?.lowerBoundImpact?.LPrimeNT50UpperBound).toBe(48);
    expect(guideResult).toMatchObject({
      guideProfile: "tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd",
      KSource: "lookup_from_mass_ratio",
      LPrimeNT50UpperBound: 48,
      LnWPlusCIUpperBound: 45
    });
    expect(fieldGuides.guideBase.kind).toBe("active");
    expect(fieldGuides.k.kind).toBe("anchored");
    expect(fieldGuides.hd.kind).toBe("active");

    const card = buildOutputCard({
      output: "L'nT,50",
      result: scenario.result,
      studyMode: "floor"
    });
    expect(card).toMatchObject({ status: "bound", value: "<= 48 dB" });
    expect(buildReport(scenario)).toContain("- Impact L'nT,50 upper bound: <= 48.0 dB");
  });

  it("keeps incomplete Hd input visible as needs_input with the correct alternative fields", () => {
    const scenario = evaluateGateAmScenario({
      fieldContext: {
        guideMassRatio: 2.5
      },
      id: "gate-am-ubiq-carpet-bound-missing-hd",
      rows: UBIQ_CARPET_BOUND_ROWS,
      targetOutputs: ["L'nT,50"]
    });

    const card = buildOutputCard({
      output: "L'nT,50",
      result: scenario.result,
      studyMode: "floor"
    });

    expect(scenario.result?.lowerBoundImpact?.LPrimeNT50UpperBound).toBeUndefined();
    expect(scenario.result?.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["impactFieldContext.guideHdDb_or_receivingRoomVolumeM3"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["L'nT,50"]
    });
    expect(card.status).toBe("needs_input");
    expect(card.detail).toContain("guide Hd or receiving-room volume");
    expect(card.detail).not.toContain("impactFieldContext.guideHdDb_or_receivingRoomVolumeM3");
  });
});

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
  "CI",
  "Ln,w+CI",
  "L'nT,50",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const EXPLICIT_CI_LOCAL_GUIDE_CONTEXT = {
  ciDb: -1,
  guideHdDb: 0,
  guideMassRatio: 2.5,
  receivingRoomVolumeM3: 60
} as const satisfies ImpactFieldContext;

const HEAVY_CONCRETE_ROWS = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: "8" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "50" },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: "8" },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: "150" }
] as const satisfies readonly Omit<LayerDraft, "id">[];

function evaluateGateAnScenario(input?: {
  fieldContext?: ImpactFieldContext;
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario {
  return evaluateScenario({
    airborneContext: {
      contextMode: "building_prediction",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      receivingRoomRt60S: 0.7,
      receivingRoomVolumeM3: 55
    },
    id: "gate-an-heavy-concrete-explicit-ci-local-guide",
    impactFieldContext: input?.fieldContext ?? EXPLICIT_CI_LOCAL_GUIDE_CONTEXT,
    name: "Gate AN explicit CI local guide",
    rows: HEAVY_CONCRETE_ROWS.map((row, index) => ({ ...row, id: `gate-an-heavy-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: input?.targetOutputs ?? TARGET_OUTPUTS
  });
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Gate AN Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AN Explicit CI Local Guide",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "55",
    targetRwDb: ""
  });
}

describe("post-V1 floor explicit CI local-guide Gate AN parity", () => {
  it("shows explicit CI-derived Ln,w+CI and L'nT,50 on cards, status, chart, guide fields, and report", () => {
    const scenario = evaluateGateAnScenario();

    expect(scenario.result?.impact).toMatchObject({
      CI: -1,
      LPrimeNT50: 52,
      LPrimeNTw: 50.2,
      LPrimeNW: 53,
      LnW: 50,
      LnWPlusCI: 49,
      basis: "mixed_predicted_plus_estimated_local_guide",
      guideEstimateKSource: "lookup_from_mass_ratio",
      guideEstimateHdSource: "explicit_input"
    });
    expect(scenario.result?.supportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual([]);

    expect(buildOutputCard({ output: "Ln,w+CI", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "49 dB"
    });
    expect(buildOutputCard({ output: "L'nT,50", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "52 dB"
    });

    expect(getTargetOutputStatus({
      guideResult: null,
      output: "L'nT,50",
      result: scenario.result
    }).kind).toBe("engine_live");

    expect(buildResultAnswerChartLanes({ result: scenario.result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([
            { label: "Ln,w+CI", valueLabel: "49 dB" },
            { label: "L'nT,50", valueLabel: "52 dB" }
          ]),
          id: "impact"
        })
      ])
    );

    const guideResult = deriveImpactGuideMetrics({
      baseConfidence: scenario.result?.impact?.confidence,
      baseLnW: scenario.result?.impact?.LnW,
      ciDb: EXPLICIT_CI_LOCAL_GUIDE_CONTEXT.ciDb,
      hdDb: EXPLICIT_CI_LOCAL_GUIDE_CONTEXT.guideHdDb,
      massRatio: EXPLICIT_CI_LOCAL_GUIDE_CONTEXT.guideMassRatio,
      receivingRoomVolumeM3: EXPLICIT_CI_LOCAL_GUIDE_CONTEXT.receivingRoomVolumeM3,
      source: "live_stack"
    });
    const fieldGuides = buildImpactGuideFieldGuides({
      baseImpact: scenario.result?.impact ?? null,
      baseLowerBoundImpact: null,
      ci50_2500Input: "",
      ciInput: "-1",
      guideResult,
      hdInput: "0",
      kInput: "",
      massRatioInput: "2.5",
      receivingRoomVolumeM3: "60",
      selectedSource: "live_stack",
      smallRoomEstimateEnabled: false
    });

    expect(guideResult).toMatchObject({
      CI: -1,
      KSource: "lookup_from_mass_ratio",
      LPrimeNT50: 52,
      LnWPlusCI: 49,
      guideProfile: "tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd"
    });
    expect(fieldGuides.ci.kind).toBe("active");
    expect(fieldGuides.hd.kind).toBe("active");
    expect(fieldGuides.massRatio.kind).toBe("active");

    const report = buildReport(scenario);
    expect(report).toContain("- Impact Ln,w+CI: 49.0 dB");
    expect(report).toContain("- Impact L'nT,50: 52.0 dB");
    expect(report).toContain("- Impact K correction: +3.0 dB (lookup_from_mass_ratio)");
    expect(report).toContain("- Impact Hd correction: +0.0 dB (explicit_input)");
  });

  it("keeps missing explicit CI visible when K/Hd are ready but the combined low-frequency owner is absent", () => {
    const scenario = evaluateGateAnScenario({
      fieldContext: {
        guideHdDb: 0,
        guideMassRatio: 2.5
      },
      targetOutputs: ["L'nT,50"]
    });
    const card = buildOutputCard({
      output: "L'nT,50",
      result: scenario.result,
      studyMode: "floor"
    });

    expect(scenario.result?.impact?.LPrimeNT50).toBeUndefined();
    expect(scenario.result?.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["impactFieldContext.ciDb"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["L'nT,50"]
    });
    expect(card.status).toBe("needs_input");
    expect(card.detail).toContain("CI");
    expect(card.detail).not.toContain("impactFieldContext.ciDb");
  });
});

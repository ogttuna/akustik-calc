import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getPresetById } from "./preset-definitions";
import { buildResultAnswerChartLanes } from "./result-answer-chart-model";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import { getTargetOutputStatus } from "./target-output-status";
import type { LayerDraft } from "./workbench-store";

const TARGET_OUTPUTS = [
  "CI,50-2500",
  "Ln,w",
  "CI",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const EXPLICIT_CI50_CONTEXT = {
  ci50_2500Db: 4
} as const satisfies ImpactFieldContext;

const HEAVY_CONCRETE_ROWS = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: "8" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "50" },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: "8" },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: "150" }
] as const satisfies readonly Omit<LayerDraft, "id">[];

const UBIQ_BOUND_300_ROWS = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
] as const satisfies readonly Omit<LayerDraft, "id">[];

function evaluateLiveScenario(): EvaluatedScenario {
  return evaluateScenario({
    airborneContext: {
      contextMode: "building_prediction",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      receivingRoomVolumeM3: 55
    },
    id: "gate-at-heavy-concrete-explicit-ci50-lab-companion",
    impactFieldContext: EXPLICIT_CI50_CONTEXT,
    name: "Gate AT heavy concrete explicit CI,50-2500 lab companion",
    rows: HEAVY_CONCRETE_ROWS.map((row, index) => ({ ...row, id: `gate-at-heavy-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });
}

function evaluateBoundScenario(): EvaluatedScenario {
  return evaluateScenario({
    airborneContext: {
      contextMode: "building_prediction",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      receivingRoomVolumeM3: 55
    },
    id: "gate-at-ubiq-bound-explicit-ci50-lab-companion",
    impactFieldContext: EXPLICIT_CI50_CONTEXT,
    name: "Gate AT UBIQ bound explicit CI,50-2500 lab companion",
    rows: UBIQ_BOUND_300_ROWS.map((row, index) => ({ ...row, id: `gate-at-bound-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });
}

function buildReport(input: {
  presetId: string;
  projectName: string;
  scenario: EvaluatedScenario;
}): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById(input.presetId),
    briefNote: "",
    clientName: "Gate AT Client",
    currentScenario: input.scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: input.projectName,
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "55",
    targetRwDb: ""
  });
}

describe("post-V1 floor explicit CI,50-2500 lab companion Gate AT surface parity", () => {
  it("shows live CI,50-2500 without field-guide inputs", () => {
    const scenario = evaluateLiveScenario();

    expect(scenario.result?.impact).toMatchObject({
      CI50_2500: 4,
      LnW: 50,
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate"
    });
    expect(scenario.result?.impact?.metricBasis).toMatchObject({
      CI50_2500: "explicit_user_impact_ci50_2500_input"
    });
    expect(scenario.result?.impact?.LPrimeNT50).toBeUndefined();
    expect(scenario.result?.supportedTargetOutputs).toEqual(["CI,50-2500", "Ln,w"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual([
      "CI",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50",
      "IIC",
      "AIIC"
    ]);

    expect(buildOutputCard({ output: "CI,50-2500", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "+4 dB"
    });
    expect(buildOutputCard({ output: "L'nT,50", result: scenario.result, studyMode: "floor" }).status).toBe(
      "needs_input"
    );

    expect(getTargetOutputStatus({
      guideResult: null,
      output: "CI,50-2500",
      result: scenario.result
    }).kind).toBe("engine_live");

    expect(buildResultAnswerChartLanes({ result: scenario.result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([{ label: "CI,50-2500", valueLabel: "+4 dB" }]),
          id: "impact",
          label: "Ln,w",
          valueLabel: "50 dB"
        })
      ])
    );

    const report = buildReport({
      presetId: "heavy_concrete_impact_floor",
      projectName: "Gate AT Explicit CI50 Live",
      scenario
    });
    expect(report).toContain("- Impact CI,50-2500: +4.0 dB");
    expect(report).toContain("- Impact Ln,w: 50.0 dB");
    expect(report).not.toContain("- Impact L'nT,50:");
  });

  it("shows bound CI,50-2500 without field-guide inputs", () => {
    const scenario = evaluateBoundScenario();

    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.lowerBoundImpact).toMatchObject({
      CI50_2500: 4,
      LnWUpperBound: 51,
      basis: "official_floor_system_bound_support"
    });
    expect(scenario.result?.lowerBoundImpact?.LPrimeNT50UpperBound).toBeUndefined();
    expect(scenario.result?.supportedTargetOutputs).toEqual(["CI,50-2500", "Ln,w"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual([
      "CI",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50",
      "IIC",
      "AIIC"
    ]);

    expect(buildOutputCard({ output: "CI,50-2500", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "+4 dB"
    });
    expect(buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "bound",
      value: "<= 51 dB"
    });
    expect(buildOutputCard({ output: "L'nT,50", result: scenario.result, studyMode: "floor" }).status).toBe(
      "needs_input"
    );

    expect(buildResultAnswerChartLanes({ result: scenario.result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([{ label: "CI,50-2500", valueLabel: "+4 dB" }]),
          id: "impact-bound",
          label: "Ln,w upper bound",
          valueLabel: "<= 51 dB"
        })
      ])
    );

    const report = buildReport({
      presetId: "ubiq_open_web_300_bound",
      projectName: "Gate AT Explicit CI50 Bound",
      scenario
    });
    expect(report).toContain("- Impact CI,50-2500: +4.0 dB");
    expect(report).toContain("- Impact Ln,w upper bound: <= 51.0 dB");
    expect(report).not.toContain("- Impact L'nT,50 upper bound:");
  });
});

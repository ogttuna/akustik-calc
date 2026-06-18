import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getPresetById, type PresetId } from "./preset-definitions";
import { buildResultAnswerChartLanes } from "./result-answer-chart-model";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import { getTargetOutputStatus } from "./target-output-status";
import type { LayerDraft } from "./workbench-store";

const TARGET_OUTPUTS = [
  "CI",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const EXPLICIT_CI_CONTEXT = {
  ciDb: -1
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
    id: "gate-as-heavy-concrete-explicit-ci-lab-companion",
    impactFieldContext: EXPLICIT_CI_CONTEXT,
    name: "Gate AS heavy concrete explicit CI lab companion",
    rows: HEAVY_CONCRETE_ROWS.map((row, index) => ({ ...row, id: `gate-as-heavy-${index + 1}` })),
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
    id: "gate-as-ubiq-bound-explicit-ci-lab-companion",
    impactFieldContext: EXPLICIT_CI_CONTEXT,
    name: "Gate AS UBIQ bound explicit CI lab companion",
    rows: UBIQ_BOUND_300_ROWS.map((row, index) => ({ ...row, id: `gate-as-bound-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });
}

function buildReport(input: {
  presetId: PresetId;
  projectName: string;
  scenario: EvaluatedScenario;
}): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById(input.presetId),
    briefNote: "",
    clientName: "Gate AS Client",
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

describe("post-V1 floor explicit CI lab companion Gate AS surface parity", () => {
  it("shows live CI and Ln,w+CI without field-guide inputs", () => {
    const scenario = evaluateLiveScenario();

    expect(scenario.result?.impact).toMatchObject({
      CI: -1,
      LnW: 50,
      LnWPlusCI: 49,
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate"
    });
    expect(scenario.result?.impact?.metricBasis).toMatchObject({
      CI: "explicit_user_impact_ci_input",
      LnWPlusCI: "estimated_local_guide_lnwci_from_lnw_plus_ci"
    });
    expect(scenario.result?.supportedTargetOutputs).toEqual(["CI", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50", "IIC", "AIIC"]);

    expect(buildOutputCard({ output: "CI", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "-1 dB"
    });
    expect(buildOutputCard({ output: "Ln,w+CI", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "49 dB"
    });
    expect(buildOutputCard({ output: "L'nT,50", result: scenario.result, studyMode: "floor" }).status).toBe(
      "needs_input"
    );

    expect(getTargetOutputStatus({
      guideResult: null,
      output: "Ln,w+CI",
      result: scenario.result
    }).kind).toBe("engine_live");

    expect(buildResultAnswerChartLanes({ result: scenario.result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([{ label: "CI", valueLabel: "-1 dB" }]),
          id: "impact",
          label: "Ln,w+CI",
          valueLabel: "49 dB"
        })
      ])
    );

    const report = buildReport({
      presetId: "heavy_concrete_impact_floor",
      projectName: "Gate AS Explicit CI Live",
      scenario
    });
    expect(report).toContain("- Impact CI: -1.0 dB");
    expect(report).toContain("- Impact Ln,w+CI: 49.0 dB");
    expect(report).not.toContain("- Impact L'nT,50:");
  });

  it("shows bound CI and Ln,w+CI without field-guide inputs", () => {
    const scenario = evaluateBoundScenario();

    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.lowerBoundImpact).toMatchObject({
      CI: -1,
      LnWPlusCIUpperBound: 50,
      LnWUpperBound: 51,
      basis: "official_floor_system_bound_support"
    });
    expect(scenario.result?.supportedTargetOutputs).toEqual(["CI", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50", "IIC", "AIIC"]);

    expect(buildOutputCard({ output: "CI", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "-1 dB"
    });
    expect(buildOutputCard({ output: "Ln,w+CI", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "bound",
      value: "<= 50 dB"
    });
    expect(buildOutputCard({ output: "L'n,w", result: scenario.result, studyMode: "floor" }).status).toBe(
      "needs_input"
    );

    expect(buildResultAnswerChartLanes({ result: scenario.result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([{ label: "CI", valueLabel: "-1 dB" }]),
          id: "impact-bound",
          label: "Ln,w+CI upper bound",
          valueLabel: "<= 50 dB"
        })
      ])
    );

    const report = buildReport({
      presetId: "ubiq_open_web_300_bound",
      projectName: "Gate AS Explicit CI Bound",
      scenario
    });
    expect(report).toContain("- Impact CI: -1.0 dB");
    expect(report).toContain("- Impact Ln,w+CI upper bound: <= 50.0 dB");
    expect(report).not.toContain("- Impact L'n,w upper bound:");
  });
});

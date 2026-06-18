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

const LIVE_TARGET_OUTPUTS = [
  "CI,50-2500",
  "L'nT,w",
  "L'nT,50",
  "L'n,w",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const BOUND_TARGET_OUTPUTS = [
  "Ln,w",
  "CI",
  "Ln,w+CI",
  "L'nT,w",
  "CI,50-2500",
  "L'nT,50",
  "L'n,w",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const SMALL_ROOM_CI50_LIVE_CONTEXT = {
  ci50_2500Db: 4,
  enableSmallRoomEstimate: true
} as const satisfies ImpactFieldContext;

const SMALL_ROOM_CI50_BOUND_CONTEXT = {
  ciDb: -1,
  ci50_2500Db: 4,
  enableSmallRoomEstimate: true
} as const satisfies ImpactFieldContext;

const HEAVY_CONCRETE_ROWS = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: "8" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "50" },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: "8" },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: "150" }
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

function evaluateLiveScenario(): EvaluatedScenario {
  return evaluateScenario({
    airborneContext: {
      contextMode: "building_prediction",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      receivingRoomVolumeM3: 55
    },
    id: "gate-ar-heavy-concrete-small-room-ci50",
    impactFieldContext: SMALL_ROOM_CI50_LIVE_CONTEXT,
    name: "Gate AR heavy concrete small-room CI50",
    rows: HEAVY_CONCRETE_ROWS.map((row, index) => ({ ...row, id: `gate-ar-heavy-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: LIVE_TARGET_OUTPUTS
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
    id: "gate-ar-ubiq-carpet-small-room-bound-ci50",
    impactFieldContext: SMALL_ROOM_CI50_BOUND_CONTEXT,
    name: "Gate AR UBIQ carpet small-room bound CI50",
    rows: UBIQ_CARPET_BOUND_ROWS.map((row, index) => ({ ...row, id: `gate-ar-bound-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: BOUND_TARGET_OUTPUTS
  });
}

function buildReport(input: {
  presetId: PresetId;
  projectName: string;
  requestedOutputs: readonly RequestedOutputId[];
  scenario: EvaluatedScenario;
}): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById(input.presetId),
    briefNote: "",
    clientName: "Gate AR Client",
    currentScenario: input.scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: input.projectName,
    reportProfile: "consultant",
    requestedOutputs: input.requestedOutputs,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "55",
    targetRwDb: ""
  });
}

describe("post-V1 floor small-room CI,50-2500 low-frequency Gate AR surface parity", () => {
  it("shows live small-room L'nT,50 from L'nT,w plus explicit CI,50-2500", () => {
    const scenario = evaluateLiveScenario();

    expect(scenario.result?.impact).toMatchObject({
      CI50_2500: 4,
      LPrimeNT50: 57,
      LPrimeNTw: 53,
      LnW: 50,
      basis: "mixed_predicted_plus_estimated_tr_small_room_normalization"
    });
    expect(scenario.result?.impact?.metricBasis).toMatchObject({
      CI50_2500: "explicit_user_impact_ci50_2500_input",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
      LPrimeNTw: "estimated_local_guide_tr_small_rooms_lnw_plus_3"
    });
    expect(scenario.result?.supportedTargetOutputs).toEqual(["CI,50-2500", "L'nT,w", "L'nT,50"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC", "AIIC"]);

    expect(buildOutputCard({ output: "CI,50-2500", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "+4 dB"
    });
    expect(buildOutputCard({ output: "L'nT,w", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "53 dB"
    });
    expect(buildOutputCard({ output: "L'nT,50", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "57 dB"
    });
    expect(buildOutputCard({ output: "L'n,w", result: scenario.result, studyMode: "floor" }).status).toBe(
      "unsupported"
    );

    expect(getTargetOutputStatus({
      guideResult: null,
      output: "L'nT,50",
      result: scenario.result
    }).kind).toBe("engine_live");
    expect(getTargetOutputStatus({
      guideResult: null,
      output: "CI,50-2500",
      result: scenario.result
    }).kind).toBe("engine_live");

    expect(buildResultAnswerChartLanes({ result: scenario.result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([
            { label: "CI,50-2500", valueLabel: "+4 dB" },
            { label: "L'nT,50", valueLabel: "57 dB" }
          ]),
          id: "impact",
          label: "L'nT,w",
          valueLabel: "53 dB"
        })
      ])
    );

    const report = buildReport({
      presetId: "heavy_concrete_impact_floor",
      projectName: "Gate AR Small Room CI50 Live",
      requestedOutputs: LIVE_TARGET_OUTPUTS,
      scenario
    });
    expect(report).toContain("- Impact CI,50-2500: +4.0 dB");
    expect(report).toContain("- Impact L'nT,w: 53.0 dB");
    expect(report).toContain("- Impact L'nT,50: 57.0 dB");
  });

  it("shows bound small-room L'nT,50 from L'nT,w upper bound plus explicit CI,50-2500", () => {
    const scenario = evaluateBoundScenario();

    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.lowerBoundImpact).toMatchObject({
      CI: -1,
      CI50_2500: 4,
      LPrimeNT50UpperBound: 53,
      LPrimeNTwUpperBound: 49,
      LnWPlusCIUpperBound: 45,
      LnWUpperBound: 46,
      basis: "mixed_bound_plus_estimated_tr_small_room_normalization"
    });
    expect(scenario.result?.supportedTargetOutputs).toEqual([
      "Ln,w",
      "CI",
      "Ln,w+CI",
      "L'nT,w",
      "CI,50-2500",
      "L'nT,50"
    ]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC", "AIIC"]);

    expect(buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "bound",
      value: "<= 46 dB"
    });
    expect(buildOutputCard({ output: "CI", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "-1 dB"
    });
    expect(buildOutputCard({ output: "CI,50-2500", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "+4 dB"
    });
    expect(buildOutputCard({ output: "L'nT,w", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "bound",
      value: "<= 49 dB"
    });
    expect(buildOutputCard({ output: "L'nT,50", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "bound",
      value: "<= 53 dB"
    });
    expect(buildOutputCard({ output: "L'n,w", result: scenario.result, studyMode: "floor" }).status).toBe(
      "unsupported"
    );

    expect(buildResultAnswerChartLanes({ result: scenario.result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([
            { label: "Ln,w+CI upper bound", valueLabel: "<= 45 dB" },
            { label: "L'nT,w upper bound", valueLabel: "<= 49 dB" },
            { label: "L'nT,50 upper bound", valueLabel: "<= 53 dB" },
            { label: "CI", valueLabel: "-1 dB" },
            { label: "CI,50-2500", valueLabel: "+4 dB" }
          ]),
          id: "impact-bound",
          valueLabel: "<= 46 dB"
        })
      ])
    );

    const report = buildReport({
      presetId: "ubiq_open_web_300_bound",
      projectName: "Gate AR Small Room CI50 Bound",
      requestedOutputs: BOUND_TARGET_OUTPUTS,
      scenario
    });
    expect(report).toContain("- Impact Ln,w upper bound: <= 46.0 dB");
    expect(report).toContain("- Impact CI: -1.0 dB");
    expect(report).toContain("- Impact CI,50-2500: +4.0 dB");
    expect(report).toContain("- Impact L'nT,w upper bound: <= 49.0 dB");
    expect(report).toContain("- Impact L'nT,50 upper bound: <= 53.0 dB");
  });
});

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
  "Ln,w",
  "CI",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "CI,50-2500",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const COMBINED_BOUND_EXPLICIT_CI_CONTEXT = {
  ciDb: -1,
  fieldKDb: 3,
  receivingRoomVolumeM3: 32
} as const satisfies ImpactFieldContext;

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

function evaluateGateAqScenario(input?: {
  fieldContext?: ImpactFieldContext;
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario {
  return evaluateScenario({
    airborneContext: {
      contextMode: "building_prediction",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      receivingRoomVolumeM3: 55
    },
    id: "gate-aq-ubiq-carpet-combined-bound-explicit-ci",
    impactFieldContext: input?.fieldContext ?? COMBINED_BOUND_EXPLICIT_CI_CONTEXT,
    name: "Gate AQ UBIQ carpet combined bound explicit CI",
    rows: UBIQ_CARPET_BOUND_ROWS.map((row, index) => ({ ...row, id: `gate-aq-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: input?.targetOutputs ?? TARGET_OUTPUTS
  });
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("ubiq_open_web_300_bound"),
    briefNote: "",
    clientName: "Gate AQ Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AQ Combined Bound Explicit CI Split",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "55",
    targetRwDb: ""
  });
}

describe("post-V1 floor combined-bound explicit CI split Gate AQ surface parity", () => {
  it("shows split Ln,w, CI, field, and low-frequency upper bounds on cards, status, chart, and report", () => {
    const scenario = evaluateGateAqScenario();

    expect(scenario.result?.boundFloorSystemMatch?.system.id).toBe(
      "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026"
    );
    expect(scenario.result?.lowerBoundImpact).toMatchObject({
      CI: -1,
      LPrimeNT50UpperBound: 48,
      LPrimeNTwUpperBound: 48.9,
      LPrimeNWUpperBound: 49,
      LnWPlusCIUpperBound: 45,
      LnWUpperBound: 46,
      basis: "mixed_bound_plus_estimated_local_guide"
    });
    expect(scenario.result?.supportedTargetOutputs).toEqual([
      "Ln,w",
      "CI",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["CI,50-2500", "IIC", "AIIC"]);

    expect(buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "bound",
      value: "<= 46 dB"
    });
    expect(buildOutputCard({ output: "CI", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "-1 dB"
    });
    expect(buildOutputCard({ output: "L'n,w", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "bound",
      value: "<= 49 dB"
    });
    expect(buildOutputCard({ output: "L'nT,w", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "bound",
      value: "<= 48.9 dB"
    });
    expect(buildOutputCard({ output: "L'nT,50", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "bound",
      value: "<= 48 dB"
    });

    expect(getTargetOutputStatus({
      guideResult: null,
      output: "Ln,w",
      result: scenario.result
    }).kind).toBe("engine_bound");
    expect(getTargetOutputStatus({
      guideResult: null,
      output: "L'nT,w",
      result: scenario.result
    }).kind).toBe("engine_bound");

    expect(buildResultAnswerChartLanes({ result: scenario.result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([
            { label: "L'n,w upper bound", valueLabel: "<= 49 dB" },
            { label: "L'nT,w upper bound", valueLabel: "<= 48.9 dB" },
            { label: "L'nT,50 upper bound", valueLabel: "<= 48 dB" },
            { label: "Ln,w+CI upper bound", valueLabel: "<= 45 dB" },
            { label: "CI", valueLabel: "-1 dB" }
          ]),
          id: "impact-bound",
          valueLabel: "<= 46 dB"
        })
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Impact Ln,w upper bound: <= 46.0 dB");
    expect(report).toContain("- Impact CI: -1.0 dB");
    expect(report).toContain("- Impact Ln,w+CI upper bound: <= 45.0 dB");
    expect(report).toContain("- Impact L'n,w upper bound: <= 49.0 dB");
    expect(report).toContain("- Impact L'nT,w upper bound: <= 48.9 dB");
    expect(report).toContain("- Impact L'nT,50 upper bound: <= 48.0 dB");
  });

  it("does not show CI,50-2500 or ASTM aliases as supported split outputs", () => {
    const scenario = evaluateGateAqScenario();

    expect(buildOutputCard({ output: "CI,50-2500", result: scenario.result, studyMode: "floor" }).status).toBe(
      "unsupported"
    );
    expect(buildOutputCard({ output: "IIC", result: scenario.result, studyMode: "floor" }).status).toBe(
      "unsupported"
    );
    expect(buildOutputCard({ output: "AIIC", result: scenario.result, studyMode: "floor" }).status).toBe(
      "unsupported"
    );
    expect(scenario.result?.lowerBoundImpact?.CI50_2500).toBeUndefined();
  });
});

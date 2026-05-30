import { calculateAssembly } from "@dynecho/engine";
import type { AssemblyCalculation, ImpactFieldContext, ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getPresetById } from "./preset-definitions";
import { buildResultAnswerChartLanes } from "./result-answer-chart-model";
import type { EvaluatedScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import { getTargetOutputStatus } from "./target-output-status";
import type { LayerDraft } from "./workbench-store";

const TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "CI",
  "Ln,w+CI",
  "CI,50-2500",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const EXPLICIT_DELTALW_CONTEXT = {
  ci50_2500Db: 4,
  ciDb: -1
} as const satisfies ImpactFieldContext;

const EXPLICIT_DELTALW_PREDICTOR_INPUT = {
  baseSlab: {
    densityKgM3: 2400,
    materialClass: "heavy_concrete",
    thicknessMm: 140
  },
  floorCovering: {
    deltaLwDb: 26,
    mode: "delta_lw_catalog"
  },
  floatingScreed: {
    densityKgM3: 2000,
    materialClass: "generic_screed",
    thicknessMm: 50
  },
  impactSystemType: "heavy_floating_floor",
  referenceFloorType: "heavy_standard",
  resilientLayer: {
    dynamicStiffnessMNm3: 20,
    thicknessMm: 10
  },
  structuralSupportType: "reinforced_concrete"
} as const satisfies ImpactPredictorInput;

const EXPLICIT_DELTALW_ROWS = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: "140" },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: "10" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "50" }
] as const satisfies readonly Omit<LayerDraft, "id">[];

function buildExplicitDeltaLwResult(
  targetOutputs: readonly RequestedOutputId[] = TARGET_OUTPUTS
): AssemblyCalculation {
  return calculateAssembly(
    EXPLICIT_DELTALW_ROWS.map((row) => ({
      floorRole: row.floorRole,
      materialId: row.materialId,
      thicknessMm: Number(row.thicknessMm)
    })),
    {
      impactFieldContext: EXPLICIT_DELTALW_CONTEXT,
      impactPredictorInput: EXPLICIT_DELTALW_PREDICTOR_INPUT,
      targetOutputs
    }
  );
}

function buildScenario(): EvaluatedScenario {
  return {
    id: "gate-au-explicit-deltalw-lab-companion",
    name: "Gate AU explicit DeltaLw lab companion",
    result: buildExplicitDeltaLwResult(),
    rows: EXPLICIT_DELTALW_ROWS.map((row, index) => ({ ...row, id: `gate-au-deltalw-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    warnings: []
  };
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Gate AU Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AU Explicit DeltaLw",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "55",
    targetRwDb: ""
  });
}

describe("post-V1 floor explicit DeltaLw lab companion Gate AU surface parity", () => {
  it("shows explicit DeltaLw with CI, Ln,w+CI, and CI,50-2500 lab companions", () => {
    const scenario = buildScenario();

    expect(scenario.result?.impact).toMatchObject({
      CI: -1,
      CI50_2500: 4,
      DeltaLw: 26,
      LnW: 52,
      LnWPlusCI: 51,
      basis: "predictor_explicit_delta_heavy_reference_derived"
    });
    expect(scenario.result?.impact?.metricBasis).toMatchObject({
      CI: "explicit_user_impact_ci_input",
      CI50_2500: "explicit_user_impact_ci50_2500_input",
      DeltaLw: "predictor_explicit_delta_user_input",
      LnWPlusCI: "estimated_local_guide_lnwci_from_lnw_plus_ci"
    });
    expect(scenario.result?.supportedTargetOutputs).toEqual([
      "Ln,w",
      "DeltaLw",
      "CI",
      "Ln,w+CI",
      "CI,50-2500"
    ]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50", "IIC", "AIIC"]);

    expect(buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "52 dB"
    });
    expect(buildOutputCard({ output: "DeltaLw", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "26 dB"
    });
    expect(buildOutputCard({ output: "CI", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "-1 dB"
    });
    expect(buildOutputCard({ output: "Ln,w+CI", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "51 dB"
    });
    expect(buildOutputCard({ output: "CI,50-2500", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "+4 dB"
    });
    expect(buildOutputCard({ output: "L'nT,w", result: scenario.result, studyMode: "floor" }).status).toBe(
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
          companions: expect.arrayContaining([
            { label: "DeltaLw", valueLabel: "26 dB" },
            { label: "CI", valueLabel: "-1 dB" },
            { label: "CI,50-2500", valueLabel: "+4 dB" },
            { label: "Ln,w+CI", valueLabel: "51 dB" }
          ]),
          id: "impact",
          label: "Ln,w",
          valueLabel: "52 dB"
        })
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Impact Ln,w: 52.0 dB");
    expect(report).toContain("- DeltaLw: 26.0 dB");
    expect(report).toContain("- Impact CI: -1.0 dB");
    expect(report).toContain("- Impact Ln,w+CI: 51.0 dB");
    expect(report).toContain("- Impact CI,50-2500: +4.0 dB");
    expect(report).not.toContain("- Impact L'nT,w:");
  });
});

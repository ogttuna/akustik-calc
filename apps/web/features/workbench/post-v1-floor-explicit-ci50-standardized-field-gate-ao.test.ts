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
  "L'nT,50",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const EXPLICIT_CI50_STANDARDIZED_FIELD_CONTEXT = {
  ci50_2500Db: 2,
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
} as const satisfies ImpactFieldContext;

const HEAVY_CONCRETE_ROWS = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: "8" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "50" },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: "8" },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: "150" }
] as const satisfies readonly Omit<LayerDraft, "id">[];

function evaluateGateAoScenario(input?: {
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
    id: "gate-ao-heavy-concrete-explicit-ci50-standardized-field",
    impactFieldContext: input?.fieldContext ?? EXPLICIT_CI50_STANDARDIZED_FIELD_CONTEXT,
    name: "Gate AO explicit CI,50-2500 standardized field",
    rows: HEAVY_CONCRETE_ROWS.map((row, index) => ({ ...row, id: `gate-ao-heavy-${index + 1}` })),
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
    clientName: "Gate AO Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AO Explicit CI50 Standardized Field",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "55",
    targetRwDb: ""
  });
}

describe("post-V1 floor explicit CI,50-2500 standardized-field Gate AO parity", () => {
  it("shows explicit CI,50-2500 and derived L'nT,50 on cards, status, chart, and report", () => {
    const scenario = evaluateGateAoScenario();

    expect(scenario.result?.impact).toMatchObject({
      CI50_2500: 2,
      LPrimeNT50: 52.2,
      LPrimeNTw: 50.2,
      LPrimeNW: 53,
      LnW: 50,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(scenario.result?.impact?.metricBasis).toMatchObject({
      CI50_2500: "explicit_user_impact_ci50_2500_input",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500"
    });
    expect(scenario.result?.supportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual([]);

    expect(buildOutputCard({ output: "CI,50-2500", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "+2 dB"
    });
    expect(buildOutputCard({ output: "L'nT,50", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "52.2 dB"
    });

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
            { label: "CI,50-2500", valueLabel: "+2 dB" },
            { label: "L'nT,50", valueLabel: "52.2 dB" }
          ]),
          id: "impact"
        })
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Impact CI,50-2500: +2.0 dB");
    expect(report).toContain("- Impact L'nT,50: 52.2 dB");
  });

  it("keeps missing CI,50-2500 visible when K and receiving-room volume are ready", () => {
    const scenario = evaluateGateAoScenario({
      fieldContext: {
        fieldKDb: 3,
        receivingRoomVolumeM3: 60
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
      missingPhysicalInputs: ["impactFieldContext.ci50_2500Db"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["L'nT,50"]
    });
    expect(card.status).toBe("needs_input");
    expect(card.detail).toContain("CI,50-2500");
    expect(card.detail).not.toContain("impactFieldContext.ci50_2500Db");
  });
});

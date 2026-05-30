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
  "L'nT,50",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const BOUND_EXPLICIT_CI_LOCAL_GUIDE_CONTEXT = {
  ciDb: -1,
  guideHdDb: 0,
  guideMassRatio: 2.5
} as const satisfies ImpactFieldContext;

const UBIQ_BOUND_300_ROWS = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
] as const satisfies readonly Omit<LayerDraft, "id">[];

function evaluateGateApScenario(input?: {
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
    id: "gate-ap-bound-explicit-ci-local-guide",
    impactFieldContext: input?.fieldContext ?? BOUND_EXPLICIT_CI_LOCAL_GUIDE_CONTEXT,
    name: "Gate AP bound explicit CI local guide",
    rows: UBIQ_BOUND_300_ROWS.map((row, index) => ({ ...row, id: `gate-ap-bound-${index + 1}` })),
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
    clientName: "Gate AP Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AP Bound Explicit CI Local Guide",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "55",
    targetRwDb: ""
  });
}

describe("post-V1 floor bound explicit CI local-guide Gate AP parity", () => {
  it("shows bound CI, Ln,w+CI, and L'nT,50 on cards, status, chart, and report", () => {
    const scenario = evaluateGateApScenario();

    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.lowerBoundImpact).toMatchObject({
      CI: -1,
      LPrimeNT50UpperBound: 53,
      LPrimeNWUpperBound: 54,
      LnWPlusCIUpperBound: 50,
      LnWUpperBound: 51,
      basis: "mixed_bound_plus_estimated_local_guide"
    });
    expect(scenario.result?.supportedTargetOutputs).toEqual([
      "Ln,w",
      "CI",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,50"
    ]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["L'nT,w"]);

    expect(buildOutputCard({ output: "CI", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "live",
      value: "-1 dB"
    });
    expect(buildOutputCard({ output: "Ln,w+CI", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "bound",
      value: "<= 50 dB"
    });
    expect(buildOutputCard({ output: "L'nT,50", result: scenario.result, studyMode: "floor" })).toMatchObject({
      status: "bound",
      value: "<= 53 dB"
    });

    expect(getTargetOutputStatus({
      guideResult: null,
      output: "CI",
      result: scenario.result
    }).kind).toBe("engine_live");
    expect(getTargetOutputStatus({
      guideResult: null,
      output: "Ln,w+CI",
      result: scenario.result
    }).kind).toBe("engine_bound");

    expect(buildResultAnswerChartLanes({ result: scenario.result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([
            { label: "CI", valueLabel: "-1 dB" },
            { label: "Ln,w+CI upper bound", valueLabel: "<= 50 dB" },
            { label: "L'nT,50 upper bound", valueLabel: "<= 53 dB" }
          ]),
          id: "impact-bound"
        })
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Impact CI: -1.0 dB");
    expect(report).toContain("- Impact Ln,w+CI upper bound: <= 50.0 dB");
    expect(report).toContain("- Impact L'nT,50 upper bound: <= 53.0 dB");
  });

  it("keeps missing CI visible when K and Hd are ready on the bound local-guide path", () => {
    const scenario = evaluateGateApScenario({
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

    expect(scenario.result?.lowerBoundImpact?.LPrimeNT50UpperBound).toBeUndefined();
    expect(scenario.result?.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["impactFieldContext.ciDb"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["L'nT,50"]
    });
    expect(card.status).toBe("needs_input");
    expect(card.detail).toContain("impactFieldContext.ciDb");
  });
});

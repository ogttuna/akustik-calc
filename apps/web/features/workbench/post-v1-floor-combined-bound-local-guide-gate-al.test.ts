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
  "Ln,w+CI",
  "L'nT,50",
  "Ln,w",
  "CI",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const LOCAL_GUIDE_FIELD_CONTEXT = {
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

function evaluateCombinedBoundScenario(input?: {
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
    id: "gate-al-ubiq-carpet-combined-bound",
    impactFieldContext: input?.fieldContext ?? LOCAL_GUIDE_FIELD_CONTEXT,
    name: "Gate AL UBIQ carpet combined bound",
    rows: UBIQ_CARPET_BOUND_ROWS.map((row, index) => ({ ...row, id: `gate-al-${index + 1}` })),
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
    clientName: "Gate AL Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AL Combined Bound Local Guide",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "55",
    targetRwDb: ""
  });
}

describe("post-V1 floor combined bound local-guide Gate AL surface parity", () => {
  it("shows L'nT,50 upper bounds from combined Ln,w+CI bound on cards, status, chart, and report", () => {
    const scenario = evaluateCombinedBoundScenario();

    expect(scenario.result?.boundFloorSystemMatch?.system.id).toBe(
      "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026"
    );
    expect(scenario.result?.lowerBoundImpact?.basis).toBe("mixed_bound_plus_estimated_local_guide");
    expect(scenario.result?.lowerBoundImpact?.LnWPlusCIUpperBound).toBe(45);
    expect(scenario.result?.lowerBoundImpact?.LPrimeNT50UpperBound).toBe(48);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Ln,w+CI", "L'nT,50"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ln,w", "CI", "L'n,w", "L'nT,w"]);

    const card = buildOutputCard({
      output: "L'nT,50",
      result: scenario.result,
      studyMode: "floor"
    });
    expect(card).toMatchObject({
      status: "bound",
      value: "<= 48 dB"
    });

    const status = getTargetOutputStatus({
      guideResult: null,
      output: "L'nT,50",
      result: scenario.result
    });
    expect(status).toMatchObject({
      kind: "engine_bound",
      label: "Bound support"
    });

    expect(buildResultAnswerChartLanes({ result: scenario.result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([
            { label: "L'nT,50 upper bound", valueLabel: "<= 48 dB" }
          ]),
          id: "impact-bound",
          valueLabel: "<= 45 dB"
        })
      ])
    );

    expect(buildReport(scenario)).toContain("- Impact L'nT,50 upper bound: <= 48.0 dB");
  });

  it("keeps incomplete local-guide field context visible as needs_input", () => {
    const scenario = evaluateCombinedBoundScenario({
      fieldContext: {
        receivingRoomVolumeM3: 32
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
      missingPhysicalInputs: ["impactFieldContext"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["L'nT,50"]
    });
    expect(card.status).toBe("needs_input");
    expect(card.detail).toContain("impactFieldContext");
  });
});

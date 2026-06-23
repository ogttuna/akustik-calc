import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getPresetById } from "./preset-definitions";
import { buildResultAnswerChartLanes } from "./result-answer-chart-model";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import { getTargetOutputStatus } from "./target-output-status";

const TARGET_OUTPUTS = [
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const COMPLETE_FIELD_CONTEXT = {
  ci50_2500Db: 4,
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
} as const satisfies ImpactFieldContext;

function evaluateBoundLowFrequencyScenario(input?: {
  fieldContext?: ImpactFieldContext;
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario {
  const preset = getPresetById("ubiq_open_web_300_bound");

  return evaluateScenario({
    airborneContext: {
      contextMode: "building_prediction",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      receivingRoomVolumeM3: 55
    },
    id: `${preset.id}-gate-ak-low-frequency-bound`,
    impactFieldContext: input?.fieldContext ?? COMPLETE_FIELD_CONTEXT,
    name: preset.label,
    rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
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
    clientName: "Gate AK Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AK Bound Low-Frequency Field Companion",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "55",
    targetRwDb: ""
  });
}

describe("post-V1 floor bound low-frequency field companion Gate AK surface parity", () => {
  it("shows calculated L'nT,50 upper bounds on cards, status, chart, and report", () => {
    const scenario = evaluateBoundLowFrequencyScenario();

    expect(scenario.result?.lowerBoundImpact?.LPrimeNT50UpperBound).toBe(55.2);
    expect(scenario.result?.supportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual([]);

    const card = buildOutputCard({
      output: "L'nT,50",
      result: scenario.result,
      studyMode: "floor"
    });
    expect(card).toMatchObject({
      status: "bound",
      value: "<= 55.2 dB"
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
            { label: "L'nT,50 upper bound", valueLabel: "<= 55.2 dB" }
          ]),
          id: "impact-bound"
        })
      ])
    );

    expect(buildReport(scenario)).toContain("- Impact L'nT,50 upper bound: <= 55.2 dB");
  });

  it("keeps missing CI,50-2500 visible as needs_input instead of showing a low-frequency bound", () => {
    const scenario = evaluateBoundLowFrequencyScenario({
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

    expect(scenario.result?.lowerBoundImpact?.LPrimeNT50UpperBound).toBeUndefined();
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

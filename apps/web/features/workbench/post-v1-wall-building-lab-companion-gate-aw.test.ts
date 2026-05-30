import { calculateAssembly } from "@dynecho/engine";
import type { AirborneContext, AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";
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
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const COMPLETE_BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sourceRoomVolumeM3: 42
} as const satisfies AirborneContext;

const MASONRY_ROWS = [
  { materialId: "dense_plaster", thicknessMm: "13" },
  { materialId: "porotherm_pls_100", thicknessMm: "100" },
  { materialId: "dense_plaster", thicknessMm: "13" }
] as const satisfies readonly Omit<LayerDraft, "id">[];

function buildResult(): AssemblyCalculation {
  return calculateAssembly(
    MASONRY_ROWS.map((row) => ({
      materialId: row.materialId,
      thicknessMm: Number(row.thicknessMm)
    })),
    {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    }
  );
}

function buildScenario(): EvaluatedScenario {
  return {
    id: "gate-aw-wall-building-lab-companion",
    name: "Gate AW wall building plus lab companions",
    result: buildResult(),
    rows: MASONRY_ROWS.map((row, index) => ({ ...row, id: `gate-aw-wall-${index + 1}` })),
    source: "current",
    studyMode: "wall",
    warnings: []
  };
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("masonry_brick_wall"),
    briefNote: "",
    clientName: "Gate AW Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AW Wall Building Lab Companion",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "40"
  });
}

describe("post-V1 wall building lab companion Gate AW surface parity", () => {
  it("shows mixed lab and building wall outputs across cards, status, chart, and report", () => {
    const scenario = buildScenario();
    const result = scenario.result;

    expect(result?.supportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(result?.unsupportedTargetOutputs).toEqual([]);
    expect(result?.metrics).toMatchObject({
      estimatedCDb: -0.2,
      estimatedCtrDb: -4.7,
      estimatedDnADb: 39.8,
      estimatedDnTADb: 41.3,
      estimatedDnTwDb: 42,
      estimatedDnWDb: 40,
      estimatedRwDb: 40,
      estimatedRwPrimeDb: 40,
      estimatedStc: 40
    });
    expect(result?.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "building_prediction",
      selectedCandidateId: "candidate_airborne_building_prediction_all_owner_family_physics_prediction",
      supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    });

    for (const output of TARGET_OUTPUTS) {
      expect(buildOutputCard({ output, result, studyMode: "wall" }).status).toBe("live");
    }
    expect(buildOutputCard({ output: "Dn,A", result, studyMode: "wall" }).detail).toContain(
      "Gate AR airborne building-prediction runtime is active"
    );
    expect(getTargetOutputStatus({ guideResult: null, output: "Rw", result })).toMatchObject({
      kind: "engine_live"
    });
    expect(getTargetOutputStatus({ guideResult: null, output: "DnT,A", result })).toMatchObject({
      kind: "engine_live",
      label: "Building standardized"
    });

    expect(buildResultAnswerChartLanes({ result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([
            { label: "STC", valueLabel: "40 dB" },
            { label: "C / Ctr", valueLabel: "-0.2 dB / -4.7 dB" },
            { label: "DnT,A", valueLabel: "41.3 dB" }
          ]),
          id: "airborne",
          label: "DnT,w estimate",
          valueLabel: "42 dB"
        })
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Engine-live now: Rw, STC, C, Ctr, R'w, Dn,w, Dn,A, DnT,w, DnT,A");
    expect(report).toContain(
      "- Airborne building values: R'w 40 dB, Dn,w 40 dB, Dn,A 39.8 dB, DnT,w 42 dB and DnT,A 41.3 dB; source-absent budget +/-9 dB; not measured building evidence yes."
    );
    expect(report).not.toContain("Unsupported target outputs: Rw");
  });
});

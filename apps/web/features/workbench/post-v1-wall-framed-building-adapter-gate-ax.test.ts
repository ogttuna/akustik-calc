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

const COMPLETE_FRAMED_BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  connectionType: "line_connection",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sourceRoomVolumeM3: 42,
  studSpacingMm: 600,
  studType: "light_steel_stud"
} as const satisfies AirborneContext;

const LSF_ROWS = [
  { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { materialId: "air_gap", thicknessMm: "5" },
  { materialId: "glasswool", thicknessMm: "70" },
  { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" }
] as const satisfies readonly Omit<LayerDraft, "id">[];

function buildResult(): AssemblyCalculation {
  return calculateAssembly(
    LSF_ROWS.map((row) => ({
      materialId: row.materialId,
      thicknessMm: Number(row.thicknessMm)
    })),
    {
      airborneContext: COMPLETE_FRAMED_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    }
  );
}

function buildScenario(): EvaluatedScenario {
  return {
    id: "gate-ax-wall-framed-building-adapter",
    name: "Gate AX framed wall building adapter",
    result: buildResult(),
    rows: LSF_ROWS.map((row, index) => ({ ...row, id: `gate-ax-wall-${index + 1}` })),
    source: "current",
    studyMode: "wall",
    warnings: []
  };
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("light_steel_stud_wall"),
    briefNote: "",
    clientName: "Gate AX Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AX Framed Building Adapter",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "51"
  });
}

describe("post-V1 wall framed building adapter Gate AX surface parity", () => {
  it("shows framed LSF lab and building wall outputs across cards, status, chart, and report", () => {
    const scenario = buildScenario();
    const result = scenario.result;

    expect(result?.supportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(result?.unsupportedTargetOutputs).toEqual([]);
    expect(result?.metrics).toMatchObject({
      estimatedCDb: -1.4,
      estimatedCtrDb: -6.4,
      estimatedDnADb: 49.6,
      estimatedDnTADb: 51.1,
      estimatedDnTwDb: 52,
      estimatedDnWDb: 51,
      estimatedRwDb: 51,
      estimatedRwPrimeDb: 51,
      estimatedStc: 51
    });
    expect(result?.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "building_prediction",
      selectedCandidateId: "candidate_airborne_building_prediction_all_owner_family_physics_prediction",
      supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    });

    for (const output of TARGET_OUTPUTS) {
      expect(buildOutputCard({ output, result, studyMode: "wall" }).status).toBe("live");
    }
    expect(getTargetOutputStatus({ guideResult: null, output: "R'w", result })).toMatchObject({
      kind: "engine_live",
      label: "Building apparent"
    });
    expect(getTargetOutputStatus({ guideResult: null, output: "DnT,A", result })).toMatchObject({
      kind: "engine_live",
      label: "Building standardized"
    });

    expect(buildResultAnswerChartLanes({ result })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companions: expect.arrayContaining([
            { label: "STC", valueLabel: "51 dB" },
            { label: "C / Ctr", valueLabel: "-1.4 dB / -6.4 dB" },
            { label: "DnT,A", valueLabel: "51.1 dB" }
          ]),
          id: "airborne",
          label: "DnT,w estimate",
          valueLabel: "52 dB"
        })
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Engine-live now: Rw, STC, C, Ctr, R'w, Dn,w, Dn,A, DnT,w, DnT,A");
    expect(report).toContain(
      "- Airborne building values: R'w 51 dB, Dn,w 51 dB, Dn,A 49.6 dB, DnT,w 52 dB and DnT,A 51.1 dB; source-absent budget +/-9 dB; not measured building evidence yes."
    );
    expect(report).not.toContain("Unsupported target outputs: R'w");
  });
});

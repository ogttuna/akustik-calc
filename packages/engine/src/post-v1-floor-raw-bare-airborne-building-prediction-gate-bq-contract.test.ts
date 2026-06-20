import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
  FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./floor-raw-bare-airborne-building-prediction-runtime";
import {
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_LANDED_GATE,
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTION_STATUS,
  POST_V1_GATE_BQ_AIRBORNE_BUILDING_VALUE_PINS,
  POST_V1_GATE_BQ_BUILDING_AIRBORNE_OUTPUTS,
  POST_V1_GATE_BQ_BUILDING_PREDICTION_CONTEXT,
  POST_V1_GATE_BQ_RAW_OPEN_BOX_220,
  POST_V1_GATE_BQ_RAW_OPEN_BOX_370,
  POST_V1_GATE_BQ_RAW_OPEN_WEB_300,
  summarizePostV1FloorRawBareAirborneBuildingPredictionGateBQ
} from "./post-v1-floor-raw-bare-airborne-building-prediction-gate-bq";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-bp";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_BP_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_BQ_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_PLAN_2026-06-01.md"
] as const;

const DIRECT_FLANKING_IMPACT_CONTEXT = {
  directPathOffsetDb: 1,
  flankingPaths: [
    {
      id: "gate_bq_rigid_edge_path",
      label: "Characterized raw-bare edge path",
      levelOffsetDb: -6,
      pathCount: 1
    }
  ],
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const MIXED_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "Ln,w",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const PARTIAL_BUILDING_CONTEXT = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 55
} as const satisfies AirborneContext;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor raw-bare airborne building prediction Gate BQ", () => {
  it("lands runtime coverage after Gate BP selected the raw-bare airborne building gap", () => {
    const summary = summarizePostV1FloorRawBareAirborneBuildingPredictionGateBQ();

    expect(summary).toMatchObject({
      landedGate: POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_LANDED_GATE,
      previousGateBP: {
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTION_STATUS
      },
      runtimeValueMovement: "raw_bare_floor_airborne_building_prediction_promotion",
      selectedCandidateId: "floor.raw_bare_floor_airborne_building_prediction_owner_gap",
      selectedNextAction:
        POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_LABEL,
      selectionStatus:
        POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTION_STATUS,
      traceCandidateId: FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    });
    expect(summary.valuePins).toEqual(POST_V1_GATE_BQ_AIRBORNE_BUILDING_VALUE_PINS);
  });

  it("calculates open-box 220 airborne-only building outputs from the raw-bare direct Rw owner", () => {
    const result = calculateAssembly(POST_V1_GATE_BQ_RAW_OPEN_BOX_220, {
      airborneContext: POST_V1_GATE_BQ_BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_BQ_BUILDING_AIRBORNE_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_BQ_BUILDING_AIRBORNE_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedDnADb: 35,
      estimatedDnTADb: 37.4,
      estimatedDnTwDb: 39,
      estimatedDnWDb: 36,
      estimatedRwDb: 38.1,
      estimatedRwPrimeDb: 36
    });
    expect(result.airborneBasis).toMatchObject({
      method: FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
      origin: "family_physics_prediction"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "building_prediction",
      runtimeBasisId: FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
      selectedCandidateId: FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: [...POST_V1_GATE_BQ_BUILDING_AIRBORNE_OUTPUTS],
      valuePins: [
        { metric: "R'w", value: 36 },
        { metric: "Dn,w", value: 36 },
        { metric: "Dn,A", value: 35 },
        { metric: "DnT,w", value: 39 },
        { metric: "DnT,A", value: 37.4 }
      ]
    });
    expect(result.warnings).toContain(
      "Raw-bare floor airborne building-prediction adapter active: broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor direct Rw 38.1 was used before building flanking and room normalization; the generic screening airborne curve was not used for R'w / Dn / DnT."
    );
  });

  it("keeps the raw-bare direct Rw owner live when building-prediction requests include Rw", () => {
    const openBoxRwOnly = calculateAssembly(POST_V1_GATE_BQ_RAW_OPEN_BOX_220, {
      airborneContext: POST_V1_GATE_BQ_BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const openWebRwOnly = calculateAssembly(POST_V1_GATE_BQ_RAW_OPEN_WEB_300, {
      airborneContext: POST_V1_GATE_BQ_BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const mixedWithUnownedCompanion = calculateAssembly(POST_V1_GATE_BQ_RAW_OPEN_BOX_220, {
      airborneContext: POST_V1_GATE_BQ_BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "R'w", "DnT,w", "C"]
    });

    expect(openBoxRwOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(openBoxRwOnly.unsupportedTargetOutputs).toEqual([]);
    expect(openBoxRwOnly.metrics).toMatchObject({
      estimatedRwDb: 38.1,
      estimatedRwPrimeDb: 36,
      estimatedDnTwDb: 39
    });
    expect(openBoxRwOnly.airborneBasis).toMatchObject({
      method: FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
      origin: "family_physics_prediction"
    });
    expect(openBoxRwOnly.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "building_prediction",
      selectedCandidateId: FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 38.1 }]
    });

    expect(openWebRwOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(openWebRwOnly.unsupportedTargetOutputs).toEqual([]);
    expect(openWebRwOnly.metrics.estimatedRwDb).toBe(32);
    expect(openWebRwOnly.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 32 }]
    });

    expect(mixedWithUnownedCompanion.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w"]);
    expect(mixedWithUnownedCompanion.unsupportedTargetOutputs).toEqual(["C"]);
    expect(mixedWithUnownedCompanion.metrics).toMatchObject({
      estimatedDnTwDb: 39,
      estimatedRwDb: 38.1,
      estimatedRwPrimeDb: 36
    });
  });

  it("keeps mixed impact and airborne building outputs live while lab impact and ASTM stay separate", () => {
    const result = calculateAssembly(POST_V1_GATE_BQ_RAW_OPEN_BOX_220, {
      airborneContext: POST_V1_GATE_BQ_BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: DIRECT_FLANKING_IMPACT_CONTEXT,
      targetOutputs: MIXED_BUILDING_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([
      "R'w",
      "Dn,w",
      "Dn,A",
      "DnT,w",
      "DnT,A",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "IIC", "AIIC"]);
    expect(result.metrics).toMatchObject({
      estimatedDnTwDb: 39,
      estimatedRwDb: 38.1,
      estimatedRwPrimeDb: 36
    });
    expect(result.impact).toMatchObject({
      LPrimeNT50: 93.9,
      LPrimeNTw: 90.5,
      LPrimeNW: 92.9,
      LnW: 91.1
    });
  });

  it("pins the thicker open-box and raw-bare open-web airborne building corridors", () => {
    const openBox370 = calculateAssembly(POST_V1_GATE_BQ_RAW_OPEN_BOX_370, {
      airborneContext: POST_V1_GATE_BQ_BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_BQ_BUILDING_AIRBORNE_OUTPUTS
    });
    const openWeb300 = calculateAssembly(POST_V1_GATE_BQ_RAW_OPEN_WEB_300, {
      airborneContext: POST_V1_GATE_BQ_BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_BQ_BUILDING_AIRBORNE_OUTPUTS
    });

    expect(openBox370.metrics).toMatchObject({
      estimatedDnADb: 39.8,
      estimatedDnTADb: 42.2,
      estimatedDnTwDb: 43,
      estimatedDnWDb: 41,
      estimatedRwDb: 42.3,
      estimatedRwPrimeDb: 40
    });
    expect(openWeb300.metrics).toMatchObject({
      estimatedDnADb: 28.9,
      estimatedDnTADb: 31.3,
      estimatedDnTwDb: 32,
      estimatedDnWDb: 30,
      estimatedRwDb: 32,
      estimatedRwPrimeDb: 30
    });
  });

  it("blocks incomplete building contexts instead of publishing generic screening R'w / DnT,w", () => {
    const result = calculateAssembly(POST_V1_GATE_BQ_RAW_OPEN_BOX_220, {
      airborneContext: PARTIAL_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.metrics.estimatedRwPrimeDb).toBeUndefined();
    expect(result.metrics.estimatedDnTwDb).toBeUndefined();
    expect(result.airborneBasis?.method).toBe("dynamic_calculator_route_input_contract_missing_physical_fields");
  });

  it("keeps docs and current-gate runner aligned with Gate BQ runtime closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_LANDED_GATE
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain("R'w 36");
      expect(contents, path).toContain("DnT,w 39");
      expect(contents, path).toContain("generic screening");
      expect(contents, path).toContain("ASTM `IIC` / `AIIC` remain");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-raw-bare-airborne-building-prediction-gate-bq-contract.test.ts"
    );
  });
});

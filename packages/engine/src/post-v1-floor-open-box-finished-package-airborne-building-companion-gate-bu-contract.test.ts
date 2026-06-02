import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
  FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./floor-open-box-finished-package-airborne-building-prediction-runtime";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-bt";

const LANDED_GATE = "post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan";
const SELECTION_STATUS =
  "post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_landed_selected_next_numeric_coverage_gap_gate_bv";
const SELECTED_NEXT_ACTION = "post_v1_next_numeric_coverage_gap_gate_bv_plan";
const SELECTED_NEXT_FILE = "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bv-contract.test.ts";
const SELECTED_NEXT_LABEL = "post-V1 next numeric coverage gap Gate BV";
const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BUILDING_AIRBORNE_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const MIXED_PACKAGE_BUILDING_OUTPUTS = ["Rw", "C", "Ctr", ...BUILDING_AIRBORNE_OUTPUTS] as const satisfies readonly RequestedOutputId[];
const AIRBORNE_WITH_NON_OWNED_OUTPUTS = ["R'w", "DnT,w", "IIC", "AIIC", "L'n,w"] as const satisfies readonly RequestedOutputId[];

const BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 4,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 55
} as const satisfies AirborneContext;

const PARTIAL_BUILDING_CONTEXT = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 55
} as const satisfies AirborneContext;

const DRY_GYPSUM_FIBER_SOURCE_ABSENT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 32 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 45 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const EPS_SCREED_HYBRID_VARIANT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 43 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const CURRENT_SELECTION_DOCS = [
  "docs/calculator/POST_V1_GATE_BT_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_BU_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_COMPANION_PLAN_2026-06-01.md"
] as const;

const GATE_BU_CONTRACT = {
  landedGate: LANDED_GATE,
  previousGateBTSelectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_ACTION,
  previousGateBTSelectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_FILE,
  previousGateBTSelectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTION_STATUS,
  runtimeMovementThisGate: true,
  selectedNextAction: SELECTED_NEXT_ACTION,
  selectedNextFile: SELECTED_NEXT_FILE,
  selectedNextLabel: SELECTED_NEXT_LABEL,
  selectionStatus: SELECTION_STATUS,
  traceCandidateId: FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor open-box finished-package airborne building companion Gate BU", () => {
  it("lands a value-moving runtime gate selected by Gate BT", () => {
    expect(GATE_BU_CONTRACT).toEqual({
      landedGate: "post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan",
      previousGateBTSelectedNextAction:
        "post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan",
      previousGateBTSelectedNextFile:
        "packages/engine/src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts",
      previousGateBTSelectionStatus:
        "post_v1_next_numeric_coverage_gap_gate_bt_landed_no_runtime_selected_floor_open_box_finished_package_airborne_building_companion_gate_bu",
      runtimeMovementThisGate: true,
      selectedNextAction: "post_v1_next_numeric_coverage_gap_gate_bv_plan",
      selectedNextFile: "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bv-contract.test.ts",
      selectedNextLabel: "post-V1 next numeric coverage gap Gate BV",
      selectionStatus:
        "post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_landed_selected_next_numeric_coverage_gap_gate_bv",
      traceCandidateId: FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    });
  });

  it("calculates dry package-transfer building airborne outputs from the package Rw owner", () => {
    const result = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_AIRBORNE_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...BUILDING_AIRBORNE_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 66,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(result.metrics).toMatchObject({
      estimatedDnADb: 63.7,
      estimatedDnTADb: 66.1,
      estimatedDnTwDb: 67,
      estimatedDnWDb: 65,
      estimatedRwDb: 66,
      estimatedRwPrimeDb: 64
    });
    expect(result.airborneBasis).toMatchObject({
      method: FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
      origin: "family_physics_prediction"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "building_prediction",
      runtimeBasisId: FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
      selectedCandidateId: FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: [...BUILDING_AIRBORNE_OUTPUTS],
      valuePins: [
        { metric: "R'w", value: 64 },
        { metric: "Dn,w", value: 65 },
        { metric: "Dn,A", value: 63.7 },
        { metric: "DnT,w", value: 67 },
        { metric: "DnT,A", value: 66.1 }
      ]
    });
  });

  it("calculates EPS/screed hybrid building airborne outputs from the hybrid package Rw owner", () => {
    const result = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_AIRBORNE_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...BUILDING_AIRBORNE_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.floorSystemRatings).toMatchObject({
      C: -1.3,
      Rw: 72,
      basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
    });
    expect(result.metrics).toMatchObject({
      estimatedDnADb: 69.4,
      estimatedDnTADb: 71.8,
      estimatedDnTwDb: 73,
      estimatedDnWDb: 71,
      estimatedRwDb: 72,
      estimatedRwPrimeDb: 70
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "building_prediction",
      runtimeBasisId: FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
      selectedCandidateId: FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      valuePins: [
        { metric: "R'w", value: 70 },
        { metric: "Dn,w", value: 71 },
        { metric: "Dn,A", value: 69.4 },
        { metric: "DnT,w", value: 73 },
        { metric: "DnT,A", value: 71.8 }
      ]
    });
  });

  it("keeps Gate BU building outputs stable after Gate BV opens package lab companions", () => {
    const dry = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: MIXED_PACKAGE_BUILDING_OUTPUTS
    });
    const eps = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: MIXED_PACKAGE_BUILDING_OUTPUTS
    });

    expect(dry.supportedTargetOutputs).toEqual(["Rw", "C", ...BUILDING_AIRBORNE_OUTPUTS]);
    expect(dry.unsupportedTargetOutputs).toEqual(["Ctr"]);
    expect(dry.metrics).toMatchObject({
      estimatedCDb: -3.9,
      estimatedRwDb: 66,
      estimatedRwPrimeDb: 64,
      estimatedDnTwDb: 67
    });
    expect(eps.supportedTargetOutputs).toEqual(["Rw", "C", ...BUILDING_AIRBORNE_OUTPUTS]);
    expect(eps.unsupportedTargetOutputs).toEqual(["Ctr"]);
    expect(eps.metrics).toMatchObject({
      estimatedCDb: -1.3,
      estimatedRwDb: 72,
      estimatedRwPrimeDb: 70,
      estimatedDnTwDb: 73
    });
  });

  it("keeps missing building context, impact field outputs, and ASTM aliases outside Gate BU", () => {
    const missingContext = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      airborneContext: PARTIAL_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });
    const nonOwnedOutputs = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: AIRBORNE_WITH_NON_OWNED_OUTPUTS
    });

    expect(missingContext.supportedTargetOutputs).toEqual([]);
    expect(missingContext.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(missingContext.metrics.estimatedRwPrimeDb).toBeUndefined();
    expect(missingContext.metrics.estimatedDnTwDb).toBeUndefined();
    expect(missingContext.airborneBasis?.origin).toBe("needs_input");
    expect(missingContext.airborneBasis?.missingPhysicalInputs).toEqual([
      "receivingRoomRt60S",
      "flankingJunctionClass",
      "conservativeFlankingAssumption",
      "junctionCouplingLengthM",
      "buildingPredictionOutputBasis"
    ]);

    expect(nonOwnedOutputs.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(nonOwnedOutputs.unsupportedTargetOutputs).toEqual(["IIC", "AIIC", "L'n,w"]);
    expect(nonOwnedOutputs.metrics).toMatchObject({ estimatedRwPrimeDb: 64, estimatedDnTwDb: 67 });
    expect(nonOwnedOutputs.impact?.IIC).toBeUndefined();
    expect(nonOwnedOutputs.impact?.AIIC).toBeUndefined();
    expect(nonOwnedOutputs.impact?.LPrimeNW).toBeUndefined();
  });

  it("keeps docs and current-gate runner aligned with Gate BU runtime closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(LANDED_GATE);
      expect(contents, path).toContain(SELECTION_STATUS);
      expect(contents, path).toContain("R'w 64");
      expect(contents, path).toContain("DnT,w 67");
      expect(contents, path).toContain("R'w 70");
      expect(contents, path).toContain("DnT,w 73");
      expect(contents, path).toContain("generic screening");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts"
    );
  });
});

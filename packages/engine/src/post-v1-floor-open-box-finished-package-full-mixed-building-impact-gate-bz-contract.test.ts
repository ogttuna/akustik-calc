import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS
} from "./floor-open-box-finished-package-airborne-building-prediction-runtime";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BY_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BY_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BY_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-by";

const LANDED_GATE = "post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan";
const SELECTION_STATUS =
  "post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_landed_selected_next_numeric_coverage_gap_gate_ca";
const SELECTED_NEXT_ACTION = "post_v1_next_numeric_coverage_gap_gate_ca_plan";
const SELECTED_NEXT_FILE = "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ca-contract.test.ts";
const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

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

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const FULL_MIXED_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_AIRBORNE_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

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
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_BY_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_BZ_OPEN_BOX_FINISHED_PACKAGE_FULL_MIXED_BUILDING_IMPACT_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor open-box finished-package full mixed building/impact Gate BZ", () => {
  it("lands a value-moving runtime gate selected by Gate BY", () => {
    expect({
      landedGate: LANDED_GATE,
      previousGateBYSelectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BY_SELECTED_NEXT_ACTION,
      previousGateBYSelectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BY_SELECTED_NEXT_FILE,
      previousGateBYSelectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BY_SELECTION_STATUS,
      runtimeMovementThisGate: true,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectionStatus: SELECTION_STATUS
    }).toEqual({
      landedGate: "post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan",
      previousGateBYSelectedNextAction:
        "post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan",
      previousGateBYSelectedNextFile:
        "packages/engine/src/post-v1-floor-open-box-finished-package-full-mixed-building-impact-gate-bz-contract.test.ts",
      previousGateBYSelectionStatus:
        "post_v1_next_numeric_coverage_gap_gate_by_landed_no_runtime_selected_floor_open_box_finished_package_full_mixed_building_impact_gate_bz",
      runtimeMovementThisGate: true,
      selectedNextAction: "post_v1_next_numeric_coverage_gap_gate_ca_plan",
      selectedNextFile: "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ca-contract.test.ts",
      selectionStatus:
        "post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_landed_selected_next_numeric_coverage_gap_gate_ca"
    });
  });

  it("supports complete dry package-transfer airborne building and impact outputs in one request", () => {
    const result = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FULL_MIXED_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([
      "Rw",
      "C",
      ...BUILDING_AIRBORNE_OUTPUTS,
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ctr", "IIC", "AIIC"]);
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 66,
      RwCtr: 62.1,
      RwCtrSemantic: "rw_plus_c",
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(result.metrics).toMatchObject({
      estimatedCDb: -3.9,
      estimatedDnADb: 63.7,
      estimatedDnTADb: 66.1,
      estimatedDnTwDb: 67,
      estimatedDnWDb: 65,
      estimatedRwDb: 66,
      estimatedRwPrimeDb: 64
    });
    expect(result.impact).toMatchObject({
      CI: 1.2,
      CI50_2500: 3.3,
      LPrimeNT50: 53.7,
      LPrimeNTw: 50.4,
      LPrimeNW: 52.8,
      LnW: 50.8,
      LnWPlusCI: 52,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: [...BUILDING_AIRBORNE_OUTPUTS, "L'n,w", "L'nT,w", "L'nT,50"]
    });
    expect(result.airborneBasis).toMatchObject({
      method: FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS,
      origin: "family_physics_prediction"
    });
  });

  it("supports EPS/screed hybrid lab impact and Gate CB field impact companions in one full mixed request", () => {
    const result = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FULL_MIXED_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([
      "Rw",
      "C",
      ...BUILDING_AIRBORNE_OUTPUTS,
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ctr", "IIC", "AIIC"]);
    expect(result.floorSystemRatings).toMatchObject({
      C: -1.3,
      Rw: 72,
      RwCtrSemantic: "rw_plus_c",
      basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
    });
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.3,
      estimatedDnADb: 69.4,
      estimatedDnTADb: 71.8,
      estimatedDnTwDb: 73,
      estimatedDnWDb: 71,
      estimatedRwDb: 72,
      estimatedRwPrimeDb: 70
    });
    expect(result.impact).toMatchObject({
      CI: 0,
      CI50_2500: 1,
      LPrimeNT50: 47.6,
      LPrimeNTw: 46.6,
      LPrimeNW: 49,
      LnW: 47,
      LnWPlusCI: 47,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
  });

  it("does not invent field impact outputs when impact field context is missing", () => {
    const result = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FULL_MIXED_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([
      "Rw",
      "C",
      ...BUILDING_AIRBORNE_OUTPUTS,
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ctr", "L'n,w", "L'nT,w", "L'nT,50", "IIC", "AIIC"]);
    expect(result.impact).toMatchObject({
      CI: 1.3,
      CI50_2500: 3.3,
      LnW: 50.8,
      LnWPlusCI: 52,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(result.impact?.LPrimeNW).toBeUndefined();
    expect(result.impact?.LPrimeNTw).toBeUndefined();
    expect(result.impact?.LPrimeNT50).toBeUndefined();
  });

  it("keeps Ctr and ASTM aliases unsupported because those metric owners are separate", () => {
    const result = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FULL_MIXED_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toContain("Ln,w");
    expect(result.supportedTargetOutputs).toContain("L'n,w");
    expect(result.unsupportedTargetOutputs).toEqual(["Ctr", "IIC", "AIIC"]);
    expect(result.impact).toMatchObject({
      LPrimeNW: 52.8,
      LnW: 50.8
    });
  });

  it("keeps docs and current-gate runner aligned with Gate BZ runtime closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(LANDED_GATE);
      expect(contents, path).toContain(SELECTION_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain("L'n,w 52.8 / L'nT,w 50.4 / L'nT,50 53.7");
      expect(contents, path).toContain("Ln,w 47 / CI 0 / CI,50-2500 1 / Ln,w+CI 47");
      expect(contents, path).toContain("Ctr");
      expect(contents, path).toContain("IIC");
      expect(contents, path).toContain("AIIC");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-open-box-finished-package-full-mixed-building-impact-gate-bz-contract.test.ts"
    );
  });
});

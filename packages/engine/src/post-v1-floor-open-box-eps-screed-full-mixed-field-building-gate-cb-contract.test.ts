import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ca";

const LANDED_GATE = "post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan";
const SELECTION_STATUS =
  "post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_landed_selected_next_numeric_coverage_gap_gate_cc";
const SELECTED_NEXT_ACTION = "post_v1_next_numeric_coverage_gap_gate_cc_plan";
const SELECTED_NEXT_FILE = "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cc-contract.test.ts";
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
  "docs/calculator/POST_V1_GATE_CA_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_CB_OPEN_BOX_EPS_SCREED_FULL_MIXED_FIELD_BUILDING_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor open-box EPS/screed full mixed field/building Gate CB", () => {
  it("lands a value-moving runtime gate selected by Gate CA", () => {
    expect({
      landedGate: LANDED_GATE,
      previousGateCASelectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_ACTION,
      previousGateCASelectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_FILE,
      previousGateCASelectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTION_STATUS,
      runtimeMovementThisGate: true,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectionStatus: SELECTION_STATUS
    }).toEqual({
      landedGate: "post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan",
      previousGateCASelectedNextAction:
        "post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan",
      previousGateCASelectedNextFile:
        "packages/engine/src/post-v1-floor-open-box-eps-screed-full-mixed-field-building-gate-cb-contract.test.ts",
      previousGateCASelectionStatus:
        "post_v1_next_numeric_coverage_gap_gate_ca_landed_no_runtime_selected_floor_open_box_eps_screed_full_mixed_field_building_gate_cb",
      runtimeMovementThisGate: true,
      selectedNextAction: "post_v1_next_numeric_coverage_gap_gate_cc_plan",
      selectedNextFile: "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cc-contract.test.ts",
      selectionStatus:
        "post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_landed_selected_next_numeric_coverage_gap_gate_cc"
    });
  });

  it("supports EPS/screed full mixed building outputs and field impact companions when explicit field context is present", () => {
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
      availableOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: [...BUILDING_AIRBORNE_OUTPUTS, "L'n,w", "L'nT,w", "L'nT,50"],
      valuePins: [
        { metric: "R'w", value: 70 },
        { metric: "Dn,w", value: 71 },
        { metric: "Dn,A", value: 69.4 },
        { metric: "DnT,w", value: 73 },
        { metric: "DnT,A", value: 71.8 },
        { metric: "L'n,w", value: 49 },
        { metric: "L'nT,w", value: 46.6 },
        { metric: "L'nT,50", value: 47.6 }
      ]
    });
  });

  it("does not invent EPS/screed field impact outputs when impact field context is missing", () => {
    const result = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
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
      CI: 0,
      CI50_2500: 1,
      LnW: 47,
      LnWPlusCI: 47,
      basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
    });
    expect(result.impact?.LPrimeNW).toBeUndefined();
    expect(result.impact?.LPrimeNTw).toBeUndefined();
    expect(result.impact?.LPrimeNT50).toBeUndefined();
  });

  it("keeps dry package-transfer full mixed field/building values unchanged", () => {
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
      RwCtrSemantic: "rw_plus_c",
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(result.metrics).toMatchObject({
      estimatedCDb: -3.9,
      estimatedRwDb: 66
    });
    expect(result.impact).toMatchObject({
      CI: 1.2,
      CI50_2500: 3.3,
      LPrimeNT50: 53.7,
      LPrimeNTw: 50.4,
      LPrimeNW: 52.8,
      LnW: 50.8,
      LnWPlusCI: 52
    });
  });

  it("keeps Ctr and ASTM aliases unsupported because those metric owners are separate", () => {
    const result = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FULL_MIXED_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toContain("L'n,w");
    expect(result.supportedTargetOutputs).toContain("L'nT,w");
    expect(result.supportedTargetOutputs).toContain("L'nT,50");
    expect(result.unsupportedTargetOutputs).toEqual(["Ctr", "IIC", "AIIC"]);
    expect(result.metrics?.estimatedCtrDb).toBe(-5.9);
  });

  it("keeps docs and current-gate runner aligned with Gate CB runtime closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(LANDED_GATE);
      expect(contents, path).toContain(SELECTION_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain("L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6");
      expect(contents, path).toContain("Ctr");
      expect(contents, path).toContain("IIC");
      expect(contents, path).toContain("AIIC");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-open-box-eps-screed-full-mixed-field-building-gate-cb-contract.test.ts"
    );
  });
});

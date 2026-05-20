import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberTransferOwnerContract
} from "./broad-accuracy-floor-open-box-timber-similarity-transfer-owner";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTION_STATUS
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh.ts",
  "packages/engine/src/floor-system-estimate.ts",
  "packages/engine/src/floor-system-match.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;

const R5B_EXACT_LAYERS = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const R7B_EXACT_ONLY_HYBRID_LAYERS = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const RAW_BARE_OPEN_BOX_LAYERS = [
  { materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const PARTIAL_FINISH_OPEN_BOX_LAYERS = R5B_EXACT_LAYERS.filter(
  (layer) => layer.floorRole !== "resilient_layer"
) satisfies readonly LayerInput[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy floor open-box timber similarity transfer owner contract", () => {
  it("lands the no-runtime open-box timber transfer-owner gate and selects formula corridor next", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberTransferOwnerContract();

    expect(contract).toMatchObject({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTION_STATUS
    });
    expect(contract.previousCoverageRefresh).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTION_STATUS
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("classifies the 15 TUAS open-box rows without promoting source-absent runtime", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberTransferOwnerContract();

    expect(contract.openBoxInventory).toEqual({
      carrierThicknessesMm: [370],
      exactOnlyHybridRows: [
        "tuas_r7b_open_box_timber_measured_2026",
        "tuas_r8b_open_box_timber_measured_2026",
        "tuas_r9b_open_box_timber_measured_2026",
        "tuas_r2c_open_box_timber_measured_2026",
        "tuas_r10a_open_box_timber_measured_2026"
      ],
      exactRows: 15,
      familyEstimateEligibleRows: 15,
      measuredMetricRanges: {
        CI: [-1, 2],
        CI50_2500: [0, 5],
        LnW: [39, 70],
        LnWPlusCI: [41, 70],
        Rw: [49, 75],
        RwPlusC: [44.5, 71.9]
      },
      predictorOwnedRows: 10,
      sourceType: "open_measured_dataset",
      supportMaterial: "open_box_timber_slab",
      trustTier: "peer_reviewed_open_access"
    });
    expect(contract.packagePackets.map((packet) => packet.packageId)).toEqual([
      "thin_laminate_eps_no_upper",
      "dry_gypsum_fiber_upper",
      "reinforced_ceiling_laminate",
      "eps_screed_or_hybrid_upper",
      "mixed_staged_upper"
    ]);
    expect(contract.packagePackets.find((packet) => packet.packageId === "dry_gypsum_fiber_upper")).toMatchObject({
      exactRows: [
        "tuas_r3a_open_box_timber_measured_2026",
        "tuas_r3b_open_box_timber_measured_2026",
        "tuas_r5a_open_box_timber_measured_2026",
        "tuas_r5b_open_box_timber_measured_2026"
      ],
      predictorOwnedRows: [
        "tuas_r3a_open_box_timber_measured_2026",
        "tuas_r3b_open_box_timber_measured_2026",
        "tuas_r5a_open_box_timber_measured_2026",
        "tuas_r5b_open_box_timber_measured_2026"
      ],
      ranges: {
        CI: [0, 2],
        CI50_2500: [2, 5],
        LnW: [39, 64],
        LnWPlusCI: [41, 65],
        Rw: [56, 75]
      }
    });
    expect(contract.packagePackets.find((packet) => packet.packageId === "eps_screed_or_hybrid_upper")).toMatchObject({
      exactOnlyRows: [
        "tuas_r7b_open_box_timber_measured_2026",
        "tuas_r8b_open_box_timber_measured_2026",
        "tuas_r9b_open_box_timber_measured_2026",
        "tuas_r2c_open_box_timber_measured_2026"
      ],
      lowerSupportClasses: [
        "tuas_open_box_ceiling_family_a+resilient_stud_ceiling",
        "tuas_open_box_family_a",
        "tuas_open_box_family_b"
      ],
      predictorOwnedRows: ["tuas_r7a_open_box_timber_measured_2026", "tuas_r11b_open_box_timber_measured_2026"]
    });
  });

  it("owns required physical terms and negative boundaries before any formula corridor can move values", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberTransferOwnerContract();

    expect(contract.ownerTerms.map((term) => term.id)).toEqual([
      "open_box_support_family_owner",
      "thin_laminate_eps_finish_owner",
      "upper_package_interaction_owner",
      "lower_ceiling_family_owner",
      "fragmented_package_exact_equivalence_owner",
      "impact_lnw_ci_transfer_owner",
      "airborne_rw_plus_c_owner",
      "metric_basis_owner",
      "source_absent_budget_owner",
      "exact_precedence_owner",
      "negative_boundary_owner"
    ]);
    expect(contract.runtimePromotionRequirements).toEqual([
      "exact_source_precedence_stays_first_for_all_15_tuas_open_box_rows",
      "supportFamily_open_box_timber_required_and_open_web_steel_rejected",
      "baseSlab_370mm_owner_required_until_carrier_depth_generalization_lands",
      "thin_laminate_eps_finish_pair_required_when_any_walking_finish_is_present",
      "upper_package_family_must_be_explicit_before_transfer",
      "lower_ceiling_family_or_hybrid_schedule_must_be_explicit_before_transfer",
      "fragmented_source_equivalent_packages_can_exact_match_but_disjoint_duplicate_roles_block_formula_transfer",
      "raw_bare_open_box_carriers_stay_screening_or_needs_input_for_impact",
      "lab_field_building_and_astm_outputs_stay_separate_until_metric_specific_owners_land",
      "source_absent_budget_and_holdout_residual_policy_required_before_runtime_formula_promotion"
    ]);
    expect(contract.blockedRuntimeBoundaries.map((boundary) => boundary.id)).toEqual([
      "open_web_steel_wrong_support_family",
      "raw_bare_open_box_reopening_guard",
      "disjoint_duplicate_role_boundary",
      "exact_only_hybrid_no_predictor_transfer_boundary",
      "partial_laminate_eps_finish_boundary",
      "field_building_alias_boundary",
      "astm_iic_aiic_alias_boundary"
    ]);
  });

  it("keeps exact open-box rows first, routes raw-bare through its own later corridor, and keeps partial packages out of promoted impact runtime", () => {
    const exactPredictorOwned = calculateAssembly(R5B_EXACT_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const exactOnlyHybrid = calculateAssembly(R7B_EXACT_ONLY_HYBRID_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const rawBare = calculateAssembly(RAW_BARE_OPEN_BOX_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const partialFinish = calculateAssembly(PARTIAL_FINISH_OPEN_BOX_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(exactPredictorOwned.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(exactPredictorOwned.impact).toMatchObject({
      CI: 0,
      CI50_2500: 3,
      LnW: 44,
      LnWPlusCI: 44,
      basis: "open_measured_floor_system_exact_match",
      labOrField: "lab"
    });
    expect(exactPredictorOwned.floorSystemRatings).toMatchObject({
      Rw: 75,
      RwCtr: 71.87531170772152,
      basis: "open_measured_floor_system_exact_match"
    });
    expect(exactPredictorOwned.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(exactPredictorOwned.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);

    expect(exactOnlyHybrid.floorSystemMatch?.system.id).toBe("tuas_r7b_open_box_timber_measured_2026");
    expect(exactOnlyHybrid.impact).toMatchObject({
      CI: 0,
      CI50_2500: 1,
      LnW: 47,
      LnWPlusCI: 47,
      basis: "open_measured_floor_system_exact_match"
    });
    expect(exactOnlyHybrid.floorSystemEstimate).toBeNull();

    expect(rawBare.floorSystemMatch).toBeNull();
    expect(rawBare.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(rawBare.impact).toMatchObject({
      CI: -1.1,
      CI50_2500: 3.1,
      LnW: 88.2,
      LnWPlusCI: 87.1,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(rawBare.floorSystemRatings).toMatchObject({
      Rw: 42.3,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
    });
    expect(rawBare.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(rawBare.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);

    expect(partialFinish.floorSystemMatch).toBeNull();
    expect(partialFinish.impact).toBeNull();
    expect(partialFinish.supportedTargetOutputs).toEqual(["Rw"]);
    expect(partialFinish.unsupportedTargetOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"]);
    expect(partialFinish.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");
  });

  it("keeps docs, exports, and current-gate runners aligned with the open-box transfer-owner contract", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTION_STATUS);
      expect(content, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_FILE
      );
      expect(content, path).toContain("15");
      expect(content, path).toContain("370");
      expect(normalizedContent, path).toContain("tuas");
      expect(normalizedContent, path).toContain("open-box timber");
      expect(normalizedContent, path).toContain("formula corridor");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
      expect(normalizedContent, path).toContain("raw bare");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-box-timber-similarity-transfer-owner");
    expect(runner).toContain("broad-accuracy-floor-open-box-timber-similarity-transfer-owner-contract.test.ts");
  });
});

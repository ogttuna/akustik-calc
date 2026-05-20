import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridorContract,
  evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor
} from "./broad-accuracy-floor-open-box-timber-similarity-formula-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-similarity-transfer-owner";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts",
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

const RAW_BARE_OPEN_BOX_LAYERS = [
  { materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const PARTIAL_FINISH_OPEN_BOX_LAYERS = R5B_EXACT_LAYERS.filter(
  (layer) => layer.floorRole !== "resilient_layer"
) satisfies readonly LayerInput[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy floor open-box timber similarity formula corridor contract", () => {
  it("lands the no-runtime formula corridor and selects the runtime corridor next", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridorContract();

    expect(contract).toMatchObject({
      additionalSourceRowsRequiredForRuntimeSelection: false,
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_LANDED_GATE,
      noRuntimeValueMovement: true,
      runtimePromotionAllowedInGate: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTION_STATUS,
      sourceRowsRequiredForFormulaDesign: true
    });
    expect(contract.previousTransferOwner).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTION_STATUS
    });
    expect(contract.basisAliasBlocked).toEqual({
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines open-box package transfer terms, budgets, and runtime promotion criteria", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridorContract();

    expect(contract.formulaTerms.map((term) => term.termId)).toEqual([
      "same_family_tuas_open_box_anchor_selection",
      "open_box_370mm_support_family_constraint",
      "upper_package_family_delta",
      "lower_ceiling_family_delta",
      "laminate_eps_finish_pair_delta",
      "fragmented_exact_equivalent_package_guard",
      "impact_lnw_ci_lnw_plus_ci_semantics",
      "airborne_rw_plus_c_semantics",
      "source_absent_residual_budget_decomposition"
    ]);
    expect(contract.formulaTerms.every((term) => term.runtimeOwnedInGate === false)).toBe(true);
    expect(contract.toleranceBudgets.map((budget) => [budget.metricId, budget.totalBudgetDb])).toEqual([
      ["Ln,w", 7],
      ["CI", 2],
      ["CI,50-2500", 2.5],
      ["Ln,w+CI", 7.5],
      ["Rw", 6],
      ["Rw+C", 6.5]
    ]);
    expect(contract.toleranceBudgets.flatMap((budget) => budget.terms).every(
      (term) => term.basis === "source_absent_open_box_timber_formula_design_budget"
    )).toBe(true);
    expect(contract.runtimePromotionEntryCriteria).toEqual([
      "public_runtime_must_use_same_family_tuas_open_box_rows_not_open_web_steel_rows",
      "public_runtime_must_keep_exact_tuas_rows_ahead_of_formula_rows",
      "public_runtime_must_require_complete_laminate_eps_finish_when_finish_transfer_is_requested",
      "public_runtime_must_keep_exact_only_hybrid_and_mixed_staged_packets_blocked_until_fragmented_equivalence_policy_lands",
      "formula_surface_must_show_not_measured_error_budget_for_each_metric",
      "field_building_and_astm_outputs_must_remain_unpromoted"
    ]);
  });

  it("computes no-runtime design payloads for clean predictor-owned TUAS open-box packets", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridorContract();

    expect(contract.candidateFormulaRows.map((row) => row.corridorStatus)).toEqual([
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "blocked_exact_only_hybrid_transfer",
      "blocked_mixed_staged_no_predictor_rows"
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.basisId)).toEqual([
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_BASIS,
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_BASIS,
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_BASIS,
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_BASIS,
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_BASIS
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.designMetrics)).toEqual([
      { CI: 1.3, CI50_2500: 3.3, LnW: 50.8, LnWPlusCI: 52, Rw: 66, RwPlusC: 62.1 },
      { CI: 1.5, CI50_2500: 3.5, LnW: 53.5, LnWPlusCI: 55, Rw: 55.5, RwPlusC: 52.3 },
      { CI: 0.5, CI50_2500: 2, LnW: 53.5, LnWPlusCI: 54, Rw: 63.5, RwPlusC: 61.6 },
      { CI: 0.5, CI50_2500: 1.5, LnW: 61.5, LnWPlusCI: 62, Rw: 67, RwPlusC: 64.1 },
      { CI: null, CI50_2500: null, LnW: null, LnWPlusCI: null, Rw: null, RwPlusC: null }
    ]);
    expect(contract.candidateFormulaRows[0]?.anchorSourceIds).toEqual([
      "tuas_r3a_open_box_timber_measured_2026",
      "tuas_r3b_open_box_timber_measured_2026",
      "tuas_r5a_open_box_timber_measured_2026",
      "tuas_r5b_open_box_timber_measured_2026"
    ]);
    expect(contract.candidateFormulaRows[3]?.anchorSourceIds).toEqual([
      "tuas_r7a_open_box_timber_measured_2026",
      "tuas_r11b_open_box_timber_measured_2026"
    ]);
    expect(contract.candidateFormulaRows[3]?.blockedSourceIds).toEqual([
      "tuas_r7b_open_box_timber_measured_2026",
      "tuas_r8b_open_box_timber_measured_2026",
      "tuas_r9b_open_box_timber_measured_2026",
      "tuas_r2c_open_box_timber_measured_2026"
    ]);
    expect(contract.candidateFormulaRows[4]?.blockedSourceIds).toEqual([
      "tuas_r10a_open_box_timber_measured_2026"
    ]);
  });

  it("keeps exact rows, hostile open-box inputs, wrong support family, and basis aliases outside formula promotion", () => {
    const exact = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      exactSourceId: "tuas_r5b_open_box_timber_measured_2026",
      finishPairState: "complete_laminate_eps",
      packageId: "dry_gypsum_fiber_upper",
      roleTopologyState: "source_equivalent",
      supportFamily: "open_box_timber",
      targetOutputs: TARGET_OUTPUTS
    });
    const wrongSupport = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "complete_laminate_eps",
      packageId: "dry_gypsum_fiber_upper",
      roleTopologyState: "source_equivalent",
      supportFamily: "open_web_steel",
      targetOutputs: ["Rw", "Ln,w"]
    });
    const rawBare = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "none_raw_bare",
      packageId: "thin_laminate_eps_no_upper",
      roleTopologyState: "source_equivalent",
      supportFamily: "raw_open_box_roleless",
      targetOutputs: ["Rw", "Ln,w"]
    });
    const partialFinish = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "missing_eps_or_laminate",
      packageId: "dry_gypsum_fiber_upper",
      roleTopologyState: "source_equivalent",
      supportFamily: "open_box_timber",
      targetOutputs: ["Rw", "Ln,w"]
    });
    const duplicateRoles = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "complete_laminate_eps",
      packageId: "dry_gypsum_fiber_upper",
      roleTopologyState: "disjoint_duplicate_roles",
      supportFamily: "open_box_timber",
      targetOutputs: ["Rw", "Ln,w"]
    });
    const aliases = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "complete_laminate_eps",
      packageId: "reinforced_ceiling_laminate",
      roleTopologyState: "source_equivalent",
      supportFamily: "open_box_timber",
      targetOutputs: ["L'n,w", "IIC", "R'w", "DnT,w"]
    });

    expect(exact).toMatchObject({
      corridorStatus: "blocked_exact_source_precedence",
      designMetrics: { CI: 0, CI50_2500: 3, LnW: 44, LnWPlusCI: 44, Rw: 75, RwPlusC: 71.9 },
      exactSourceId: "tuas_r5b_open_box_timber_measured_2026"
    });
    expect(exact.runtimeValues).toEqual({
      CI: null,
      CI50_2500: null,
      LnW: null,
      LnWPlusCI: null,
      Rw: null,
      RwPlusC: null
    });
    expect(wrongSupport.corridorStatus).toBe("blocked_wrong_support_family");
    expect(rawBare.corridorStatus).toBe("blocked_raw_bare_open_box");
    expect(partialFinish.corridorStatus).toBe("blocked_partial_laminate_eps_finish");
    expect(duplicateRoles.corridorStatus).toBe("blocked_disjoint_duplicate_roles");
    expect(aliases.affectedFormulaOutputs).toEqual([]);
    expect(aliases.blockedFormulaOutputs).toEqual(["L'n,w", "IIC", "R'w", "DnT,w"]);
    expect(aliases.runtimePromotionAllowedInGate).toBe(false);
  });

  it("preserves exact package precedence, lets the later raw-bare corridor own base-only runtime, and keeps partial packages blocked", () => {
    const exact = calculateAssembly(R5B_EXACT_LAYERS, {
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

    expect(exact.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(exact.impact).toMatchObject({
      CI: 0,
      CI50_2500: 3,
      LnW: 44,
      LnWPlusCI: 44,
      basis: "open_measured_floor_system_exact_match",
      labOrField: "lab"
    });
    expect(exact.floorSystemRatings).toMatchObject({
      Rw: 75,
      RwCtr: 71.87531170772152,
      basis: "open_measured_floor_system_exact_match"
    });

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

  it("keeps docs, exports, and current-gate runner aligned with the open-box formula corridor", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTION_STATUS);
      expect(content, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_FILE
      );
      expect(content, path).toContain("Ln,w 50.8");
      expect(content, path).toContain("Rw 66");
      expect(content, path).toContain("+/-7 dB");
      expect(content, path).toContain("+/-6 dB");
      expect(normalizedContent, path).toContain("open-box timber");
      expect(normalizedContent, path).toContain("formula corridor");
      expect(normalizedContent, path).toContain("runtime corridor");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
      expect(normalizedContent, path).toContain("raw bare");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-box-timber-similarity-formula-corridor");
    expect(runner).toContain("broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts");
  });
});

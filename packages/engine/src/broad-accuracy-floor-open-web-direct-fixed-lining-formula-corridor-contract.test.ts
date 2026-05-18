import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridorContract,
  evaluateBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridor
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTION_STATUS
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner";
import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "IIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor-contract.test.ts",
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

const DIRECT_FIXED_FL23_300MM_TIMBER_LAYERS = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const SOURCE_ABSENT_DIRECT_FIXED_FL23_250MM_TIMBER_LAYERS = DIRECT_FIXED_FL23_300MM_TIMBER_LAYERS.map((layer) =>
  layer.floorRole === "base_structure" ? { ...layer, thicknessMm: 250 } : layer
) satisfies readonly LayerInput[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy floor open-web direct-fixed lining formula corridor contract", () => {
  it("lands the no-runtime formula corridor and selects the runtime corridor next", () => {
    const contract = buildBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridorContract();

    expect(contract).toMatchObject({
      additionalSourceRowsRequiredForRuntimeSelection: false,
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_LANDED_GATE,
      noRuntimeValueMovement: true,
      runtimePromotionAllowedInGate: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTION_STATUS,
      sourceRowsRequiredForFormulaDesign: true
    });
    expect(contract.previousTransferOwner).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTION_STATUS
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

  it("defines direct-fixed interpolation terms, budgets, and runtime promotion criteria", () => {
    const contract = buildBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridorContract();

    expect(contract.formulaTerms.map((term) => term.termId)).toEqual([
      "exact_source_anchor_selection",
      "direct_lining_board_schedule_family",
      "carrier_depth_interpolation",
      "deck_panel_mass_delta",
      "upper_finish_lnw_delta",
      "impact_ci_semantics"
    ]);
    expect(contract.formulaTerms.every((term) => term.runtimeOwnedInGate === false)).toBe(true);
    expect(contract.toleranceBudgets.map((budget) => [budget.metricId, budget.totalBudgetDb])).toEqual([
      ["Ln,w", 4],
      ["CI", 1.5],
      ["Ln,w+CI", 4.5],
      ["Rw", 3],
      ["Rw+Ctr", 3.5]
    ]);
    expect(contract.toleranceBudgets.flatMap((budget) => budget.terms).every(
      (term) => term.basis === "source_absent_direct_fixed_formula_design_budget"
    )).toBe(true);
    expect(contract.runtimePromotionEntryCriteria).toEqual([
      "public_runtime_must_use_same_family_direct_fixed_rows_not_resilient_ceiling_rows",
      "carrier_depth_must_stay_within_200_400_mm_or_return_needs_input_unsupported",
      "exact_source_rows_must_precede_formula_rows",
      "formula_surface_must_show_not_measured_error_budget_for_each_metric",
      "field_building_and_astm_outputs_must_remain_unpromoted"
    ]);
  });

  it("computes representative source-absent direct-fixed design corridors from same-family exact rows", () => {
    const contract = buildBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridorContract();

    expect(contract.candidateFormulaRows.map((row) => row.corridorStatus)).toEqual([
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required"
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.basisId)).toEqual([
      BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_BASIS,
      BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_BASIS,
      BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_BASIS
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.designMetrics)).toEqual([
      { CI: -0.5, LnW: 71, LnWPlusCI: 70.5, Rw: 51, RwCtr: 43.5 },
      { CI: -0.5, LnW: 77, LnWPlusCI: 76.5, Rw: 51, RwCtr: 43.5 },
      { CI: -1, LnW: 63, LnWPlusCI: 62, Rw: 54.5, RwCtr: 47.5 }
    ]);
    expect(contract.candidateFormulaRows[0]?.anchorSourceIds).toEqual([
      "ubiq_fl23_open_web_steel_200_19mm_timber_underlay_exact_lab_2026",
      "ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026"
    ]);
    expect(contract.candidateFormulaRows[1]?.anchorSourceIds).toEqual([
      "ubiq_fl25_open_web_steel_200_16mm_bare_exact_lab_2026",
      "ubiq_fl25_open_web_steel_300_16mm_bare_exact_lab_2026"
    ]);
    expect(contract.candidateFormulaRows[2]?.anchorSourceIds).toEqual([
      "ubiq_fl27_open_web_steel_300_19mm_carpet_underlay_exact_lab_2026",
      "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026"
    ]);
  });

  it("keeps exact rows, out-of-band depths, and field/ASTM aliases outside the formula promotion", () => {
    const exact = evaluateBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridor({
      boardSchedule: "2x13",
      carrierDepthMm: 300,
      deckThicknessMm: 19,
      finishPackage: "engineered_timber_with_acoustic_underlay",
      targetOutputs: TARGET_OUTPUTS
    });
    const outOfBand = evaluateBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridor({
      boardSchedule: "2x13",
      carrierDepthMm: 450,
      deckThicknessMm: 19,
      finishPackage: "engineered_timber_with_acoustic_underlay",
      targetOutputs: ["Rw", "Ln,w"]
    });
    const alias = evaluateBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridor({
      boardSchedule: "3x16",
      carrierDepthMm: 350,
      deckThicknessMm: 19,
      finishPackage: "carpet_with_foam_underlay",
      targetOutputs: ["L'n,w", "IIC", "R'w", "DnT,w"]
    });

    expect(exact).toMatchObject({
      corridorStatus: "blocked_exact_source_precedence",
      designMetrics: { CI: -1, LnW: 71, LnWPlusCI: 70, Rw: 51, RwCtr: 44 },
      exactSourceId: "ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026"
    });
    expect(exact.runtimeValues).toEqual({
      CI: null,
      LnW: null,
      LnWPlusCI: null,
      Rw: null,
      RwCtr: null
    });
    expect(outOfBand).toMatchObject({
      anchorSourceIds: [],
      corridorStatus: "blocked_out_of_band_depth",
      designMetrics: { CI: null, LnW: null, LnWPlusCI: null, Rw: null, RwCtr: null }
    });
    expect(alias.affectedFormulaOutputs).toEqual([]);
    expect(alias.blockedFormulaOutputs).toEqual(["L'n,w", "IIC", "R'w", "DnT,w"]);
    expect(alias.designMetrics).toEqual({ CI: -1, LnW: 63, LnWPlusCI: 62, Rw: 54.5, RwCtr: 47.5 });
    expect(alias.runtimePromotionAllowedInGate).toBe(false);
  });

  it("keeps exact precedence while the later runtime corridor promotes source-absent direct-fixed values", () => {
    const exact = calculateAssembly(DIRECT_FIXED_FL23_300MM_TIMBER_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const sourceAbsent = calculateAssembly(SOURCE_ABSENT_DIRECT_FIXED_FL23_250MM_TIMBER_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(exact.impact).toMatchObject({
      CI: -1,
      LnW: 71,
      LnWPlusCI: 70,
      basis: "official_floor_system_exact_match"
    });
    expect(exact.floorSystemRatings).toMatchObject({
      Rw: 51,
      RwCtr: 44,
      basis: "official_floor_system_exact_match"
    });

    expect(sourceAbsent.impact).toMatchObject({
      CI: -0.5,
      LnW: 71,
      LnWPlusCI: 70.5,
      basis: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_BASIS
    });
    expect(sourceAbsent.floorSystemRatings).toMatchObject({
      Rw: 51,
      RwCtr: 43.5,
      basis: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_BASIS
    });
    expect(sourceAbsent.impact?.estimateCandidateIds).toEqual([
      "ubiq_fl23_open_web_steel_200_19mm_timber_underlay_exact_lab_2026",
      "ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026"
    ]);
    expect(sourceAbsent.impact?.errorBudgets?.find((budget) => budget.metricId === "Ln,w")).toMatchObject({
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: 4
    });
  });

  it("keeps docs, exports, and current-gate runner aligned with the direct-fixed formula corridor", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const text = readRepoFile(path);
      const normalizedText = text.toLowerCase();

      expect(text, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_LANDED_GATE);
      expect(text, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTION_STATUS);
      expect(text, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION
      );
      expect(text, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_FILE
      );
      expect(text, path).toContain("Ln,w 71");
      expect(text, path).toContain("CI -0.5");
      expect(text, path).toContain("Rw 51");
      expect(text, path).toContain("+/-4 dB");
      expect(text, path).toContain("+/-3 dB");
      expect(normalizedText, path).toContain("direct-fixed");
      expect(normalizedText, path).toContain("runtime corridor");
      expect(normalizedText, path).toContain("field/building");
      expect(normalizedText, path).toContain("astm/iic");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor");
    expect(runner).toContain("broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor-contract.test.ts");
  });
});

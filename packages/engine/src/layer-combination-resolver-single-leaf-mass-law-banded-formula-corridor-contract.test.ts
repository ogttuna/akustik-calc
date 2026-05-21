import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridorContract,
  evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-formula-corridor";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTION_STATUS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-solver-owner";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const AIRBORNE_SINGLE_LEAF_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const SINGLE_GYPSUM_BOARD = [{ materialId: "gypsum_board", thicknessMm: 12.5 }] as const satisfies readonly LayerInput[];
const DOUBLE_GYPSUM_BOARD_LAMINATED = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];
const RIGID_CONCRETE_PANEL = [{ materialId: "concrete", thicknessMm: 150 }] as const satisfies readonly LayerInput[];

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md"
] as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-solver-owner.ts",
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-solver-owner-contract.test.ts",
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-formula-corridor.ts",
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-formula-corridor-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-o-single-leaf.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  ...DOC_ALIGNMENT_SURFACES
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

const COMPLETE_GYPSUM_INPUT = {
  bendingStiffnessClass: "flexible_board",
  cavityCount: 0,
  criticalFrequencyHz: 2800,
  dampingLossFactor: 0.02,
  densityKgM3: 800,
  dynamicFamily: "single_leaf_panel",
  leafGrouping: "single_leaf",
  materialFamily: "gypsum_board",
  porousLayerCount: 0,
  route: "wall",
  sourceOrPhysicsBasis: "source_absent_physics_model",
  stcPolicy: "existing_display_compatibility",
  supportLayerCount: 0,
  surfaceMassKgM2: 10,
  targetOutputs: AIRBORNE_SINGLE_LEAF_OUTPUTS,
  thicknessMm: 12.5,
  topologyState: "source_equivalent",
  visibleLeafCount: 1
} as const;

describe("layer combination resolver single-leaf mass-law banded formula corridor contract", () => {
  it("lands the no-runtime formula corridor and selects runtime corridor next", () => {
    const contract = buildLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridorContract();

    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousSingleLeafOwner: {
        landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTION_STATUS
      },
      runtimePromotionAllowedInGate: false,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS,
      sourceRowsRequiredForFormulaDesign: false
    });
    expect(contract.basisAliasBlocked).toEqual({
      astmE413Stc: true,
      astmIicAiic: true,
      buildingPrediction: true,
      fieldAirborne: true,
      floorImpact: true
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines formula terms, budgets, and runtime promotion entry criteria", () => {
    const contract = buildLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridorContract();

    expect(contract.formulaTerms.map((term) => term.termId)).toEqual([
      "single_visible_leaf_topology_filter",
      "surface_mass_input_normalization",
      "stiffness_coincidence_delegate_selection",
      "one_third_octave_tl_curve_owner",
      "iso717_airborne_rating_adapter",
      "exact_source_precedence_and_holdouts",
      "source_absent_budget_decomposition",
      "stc_existing_display_boundary",
      "floor_airborne_impact_boundary",
      "hostile_topology_boundary",
      "field_building_and_astm_boundary"
    ]);
    expect(contract.formulaTerms.every((term) => term.runtimeOwnedInGate === false)).toBe(true);
    expect(contract.toleranceBudgets.map((budget) => [budget.metricId, budget.totalBudgetDb])).toEqual([
      ["Rw", 6],
      ["C", 2.5],
      ["Ctr", 4],
      ["STC", 6]
    ]);
    expect(contract.toleranceBudgets.every((budget) => budget.notMeasuredEvidence)).toBe(true);
    expect(contract.toleranceBudgets.flatMap((budget) => budget.terms).every(
      (term) => term.basis === "source_absent_single_leaf_mass_law_banded_formula_design_budget"
    )).toBe(true);
    expect(contract.runtimePromotionEntryCriteria).toEqual([
      "public_runtime_must_use_the_single_leaf_banded_formula_basis_not_unlabelled_mass_law_screening",
      "runtime_candidate_selection_must_preserve_exact_same_stack_source_precedence",
      "complete_material_density_thickness_surface_mass_stiffness_and_damping_inputs_must_be_finite",
      "formula_surface_must_show_not_measured_budgets_for_Rw_C_Ctr_and_STC_compatibility",
      "field_building_floor_impact_and_astm_outputs_must_remain_unpromoted",
      "hostile_cavity_framed_clt_duplicate_or_unsafe_reorder_topologies_must_fail_closed"
    ]);
  });

  it("defines source-absent design payloads for gypsum, laminated gypsum, concrete, and floor direct-airborne scope", () => {
    const contract = buildLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridorContract();

    expect(contract.candidateFormulaRows.map((row) => row.corridorStatus)).toEqual([
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "blocked_basis_alias"
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.basisId)).toEqual([
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.designMetrics)).toEqual([
      { C: -1.8, Ctr: -5.8, Rw: 31, STCCompatibility: 31 },
      { C: -2.1, Ctr: -6.3, Rw: 34, STCCompatibility: 34 },
      { C: -1.1, Ctr: -5.2, Rw: 55, STCCompatibility: 55 },
      { C: -1.1, Ctr: -5.2, Rw: 55, STCCompatibility: 55 },
      { C: -1.8, Ctr: -5.8, Rw: 31, STCCompatibility: 31 }
    ]);
    expect(contract.candidateFormulaRows[0]?.affectedFormulaOutputs).toEqual(["Rw", "C", "Ctr"]);
    expect(contract.candidateFormulaRows[0]?.compatibilityOnlyOutputs).toEqual(["STC"]);
    expect(contract.candidateFormulaRows[0]?.oneThirdOctaveCurve?.frequenciesHz).toHaveLength(21);
    expect(contract.candidateFormulaRows[0]?.oneThirdOctaveCurve?.transmissionLossDb.every(Number.isFinite)).toBe(true);
    expect(contract.candidateFormulaRows[0]?.runtimeValues).toEqual({
      C: null,
      Ctr: null,
      Rw: null,
      STCCompatibility: null
    });
  });

  it("blocks missing fields, exact precedence, impact, field/building, STC aliasing, hostile topology, and wrong families", () => {
    const missing = evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor({
      ...COMPLETE_GYPSUM_INPUT,
      criticalFrequencyHz: undefined,
      surfaceMassKgM2: undefined
    });
    const exact = evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor({
      ...COMPLETE_GYPSUM_INPUT,
      exactSourceId: "rights_safe_single_leaf_exact_lab_row"
    });
    const cavity = evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor({
      ...COMPLETE_GYPSUM_INPUT,
      cavityCount: 1,
      leafGrouping: "framed_or_cavity"
    });
    const clt = evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor({
      ...COMPLETE_GYPSUM_INPUT,
      dynamicFamily: "mass_timber",
      materialFamily: "clt_mass_timber"
    });
    const hostile = evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor({
      ...COMPLETE_GYPSUM_INPUT,
      topologyState: "unsafe_reorder"
    });
    const wrongFamily = evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor({
      ...COMPLETE_GYPSUM_INPUT,
      dynamicFamily: "unknown"
    });
    const outOfRange = evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor({
      ...COMPLETE_GYPSUM_INPUT,
      thicknessMm: 900
    });
    const missingPhysics = evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor({
      ...COMPLETE_GYPSUM_INPUT,
      sourceOrPhysicsBasis: "missing"
    });
    const impact = evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor({
      ...COMPLETE_GYPSUM_INPUT,
      route: "floor",
      targetOutputs: ["Ln,w", "CI", "IIC"]
    });
    const field = evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor({
      ...COMPLETE_GYPSUM_INPUT,
      requestedBasis: "field",
      targetOutputs: ["R'w", "DnT,w"]
    });
    const stcAlias = evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor({
      ...COMPLETE_GYPSUM_INPUT,
      stcPolicy: "rw_alias_requested",
      targetOutputs: ["STC"]
    });

    expect(missing.corridorStatus).toBe("blocked_missing_owner_fields");
    expect(missing.missingOwnerFields).toEqual(["surfaceMassKgM2", "criticalFrequencyHz"]);
    expect(exact).toMatchObject({
      corridorStatus: "blocked_exact_source_precedence",
      exactSourceId: "rights_safe_single_leaf_exact_lab_row"
    });
    expect(cavity.corridorStatus).toBe("blocked_cavity_or_framed_topology");
    expect(clt.corridorStatus).toBe("blocked_mass_timber_or_clt");
    expect(hostile.corridorStatus).toBe("blocked_hostile_topology");
    expect(wrongFamily.corridorStatus).toBe("blocked_wrong_single_leaf_family");
    expect(outOfRange.corridorStatus).toBe("blocked_nonfinite_geometry");
    expect(missingPhysics.corridorStatus).toBe("blocked_missing_source_or_physics_basis");
    expect(impact).toMatchObject({
      affectedFormulaOutputs: [],
      blockedFormulaOutputs: ["Ln,w", "CI", "IIC"],
      corridorStatus: "blocked_floor_impact_metric"
    });
    expect(field).toMatchObject({
      affectedFormulaOutputs: [],
      blockedFormulaOutputs: ["R'w", "DnT,w"],
      corridorStatus: "blocked_basis_alias"
    });
    expect(stcAlias).toMatchObject({
      affectedFormulaOutputs: [],
      blockedFormulaOutputs: ["STC"],
      corridorStatus: "blocked_stc_alias_promotion"
    });
  });

  it("keeps Gate O public values frozen after the runtime corridor promotes the formula basis", () => {
    const gypsum = calculateAssembly(SINGLE_GYPSUM_BOARD, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    const laminated = calculateAssembly(DOUBLE_GYPSUM_BOARD_LAMINATED, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    const concrete = calculateAssembly(RIGID_CONCRETE_PANEL, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    });

    expect(gypsum.metrics).toMatchObject({ estimatedRwDb: 31, estimatedStc: 31 });
    expect(gypsum.airborneBasis).toMatchObject({
      calculationStandard: "engine_mass_law",
      errorBudgetDb: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
      family: "single_leaf_panel",
      method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction"
    });
    expect(gypsum.airborneCandidateResolution).toMatchObject({
      selectedCandidateId:
        LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(laminated.metrics).toMatchObject({ estimatedRwDb: 34, estimatedStc: 34 });
    expect(laminated.airborneBasis).toMatchObject({
      calculationStandard: "engine_mass_law",
      errorBudgetDb: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
      family: "laminated_single_leaf",
      method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction"
    });
    expect(concrete.metrics).toMatchObject({ estimatedRwDb: 55, estimatedStc: 55 });
    expect(concrete.airborneBasis).toMatchObject({
      calculationStandard: "engine_mass_law",
      errorBudgetDb: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
      family: "rigid_massive_wall",
      method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction"
    });
  });

  it("keeps docs, exports, and current-gate runner aligned with the formula corridor closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS);
      expect(content, path).toContain("Rw 31");
      expect(content, path).toContain("Rw 55");
      expect(content, path).toContain("+/-6 dB");
      expect(normalized, path).toContain("single-leaf");
      expect(normalized, path).toContain("one-third-octave");
      expect(normalized, path).toContain("iso 717-1");
      expect(normalized, path).toContain("runtime corridor");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./layer-combination-resolver-single-leaf-mass-law-banded-formula-corridor";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/layer-combination-resolver-single-leaf-mass-law-banded-formula-corridor-contract.test.ts"
    );
  });
});

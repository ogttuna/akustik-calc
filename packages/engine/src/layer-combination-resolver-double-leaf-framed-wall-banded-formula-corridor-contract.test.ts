import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  buildLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridorContract,
  evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTION_STATUS
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const DOUBLE_LEAF_ABSORBED_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const INDEPENDENT_ABSORBED_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const RESILIENT_COMPLETE_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  resilientBarSideCount: "both_sides",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

const COMPLETE_INDEPENDENT_FORMULA_INPUT = {
  bridgeClass: "independent_frame",
  cavityAbsorptionClass: "porous_absorptive",
  cavityDepthMm: 90,
  cavityFillCoverage: "full",
  flowResistivitySource: "engineering_default",
  requestedBasis: "element_lab",
  route: "wall",
  sideALeafMassKgM2: 10.6,
  sideBLeafMassKgM2: 10.6,
  sourceOrPhysicsBasis: "source_absent_physics_model",
  stcPolicy: "existing_display_compatibility",
  supportSpacingMm: 600,
  targetOutputs: WALL_OUTPUTS,
  topologyMode: "double_leaf_framed",
  topologyState: "source_equivalent"
} as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
  "docs/calculator/INSUL_COMPETITOR_RESEARCH_2026-05-20.md"
] as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner.ts",
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner-contract.test.ts",
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor.ts",
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor-contract.test.ts",
  "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts",
  "packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  ...DOC_ALIGNMENT_SURFACES
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("layer combination resolver double-leaf framed wall banded formula corridor contract", () => {
  it("lands the no-runtime formula corridor and selects runtime corridor next", () => {
    const contract = buildLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridorContract();

    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousDoubleLeafOwner: {
        landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTION_STATUS
      },
      runtimePromotionAllowedInGate: false,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS,
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
    const contract = buildLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridorContract();

    expect(contract.formulaTerms.map((term) => term.termId)).toEqual([
      "double_leaf_framed_topology_filter",
      "leaf_surface_mass_partition",
      "mass_air_mass_resonance_formula",
      "bridge_coupling_formula_owner",
      "porous_absorber_damping_formula",
      "banded_tl_curve_owner",
      "iso717_airborne_rating_adapter",
      "stc_existing_display_boundary",
      "exact_source_precedence_and_holdouts",
      "source_absent_budget_decomposition",
      "hostile_topology_boundary",
      "field_building_floor_impact_and_astm_boundary"
    ]);
    expect(contract.formulaTerms.every((term) => term.runtimeOwnedInGate === false)).toBe(true);
    expect(contract.toleranceBudgets.map((budget) => [budget.metricId, budget.totalBudgetDb])).toEqual([
      ["Rw", 8],
      ["C", 2.5],
      ["Ctr", 4.5],
      ["STC", 8]
    ]);
    expect(contract.toleranceBudgets.every((budget) => budget.notMeasuredEvidence)).toBe(true);
    expect(contract.toleranceBudgets.flatMap((budget) => budget.terms).every(
      (term) => term.basis === "source_absent_double_leaf_framed_wall_banded_formula_design_budget"
    )).toBe(true);
    expect(contract.runtimePromotionEntryCriteria).toEqual([
      "public_runtime_must_use_the_double_leaf_framed_banded_formula_basis_not_the_older_gate_s_method_label",
      "runtime_candidate_selection_must_preserve_exact_same_stack_source_precedence",
      "complete_side_leaf_masses_cavity_depth_bridge_class_spacing_absorber_and_resilient_side_count_inputs_must_be_finite",
      "formula_surface_must_show_not_measured_budgets_for_Rw_C_Ctr_and_STC_compatibility",
      "field_building_floor_impact_and_astm_iic_outputs_must_remain_unpromoted",
      "direct_fixed_grouped_triple_leaf_multicavity_duplicate_or_unsafe_reorder_topologies_must_fail_closed"
    ]);
  });

  it("defines source-absent design payloads for independent and resilient double-leaf/framed walls", () => {
    const contract = buildLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridorContract();

    expect(contract.candidateFormulaRows.map((row) => row.corridorStatus)).toEqual([
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "blocked_basis_alias"
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.basisId)).toEqual([
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.designMetrics)).toEqual([
      { C: -1, Ctr: -6.1, Rw: 45, STCCompatibility: 45 },
      { C: -1.1, Ctr: -6.2, Rw: 46, STCCompatibility: 46 },
      { C: -1.1, Ctr: -6.2, Rw: 45, STCCompatibility: 45 },
      { C: -1, Ctr: -6.1, Rw: 45, STCCompatibility: 45 }
    ]);
    expect(contract.candidateFormulaRows[0]?.affectedFormulaOutputs).toEqual(["Rw", "C", "Ctr"]);
    expect(contract.candidateFormulaRows[0]?.compatibilityOnlyOutputs).toEqual(["STC"]);
    expect(contract.candidateFormulaRows[0]?.componentBreakdown).toMatchObject({
      bridgeCouplingDeltaDb: 4,
      massAirMassResonanceHz: 86.6,
      porousDampingCreditDb: 3,
      totalLeafMassKgM2: 21.2
    });
    expect(contract.candidateFormulaRows[0]?.oneThirdOctaveCurve?.frequenciesHz).toHaveLength(19);
    expect(contract.candidateFormulaRows[0]?.oneThirdOctaveCurve?.transmissionLossDb.every(Number.isFinite)).toBe(true);
    expect(contract.candidateFormulaRows[0]?.toleranceBudgets.map((budget) => [budget.metricId, budget.totalBudgetDb])).toEqual([
      ["Rw", 7],
      ["C", 2.5],
      ["Ctr", 4.5],
      ["STC", 7]
    ]);
    expect(contract.candidateFormulaRows[1]?.toleranceBudgets.map((budget) => [budget.metricId, budget.totalBudgetDb])).toEqual([
      ["Rw", 8],
      ["C", 2.5],
      ["Ctr", 4.5],
      ["STC", 8]
    ]);
    expect(contract.candidateFormulaRows[0]?.runtimeValues).toEqual({
      C: null,
      Ctr: null,
      Rw: null,
      STCCompatibility: null
    });
  });

  it("blocks missing inputs, exact precedence, direct-fixed, grouped topology, impact, field/building, STC aliasing, and hostile geometry", () => {
    const missing = evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor({
      ...COMPLETE_INDEPENDENT_FORMULA_INPUT,
      sideALeafMassKgM2: undefined,
      supportSpacingMm: undefined
    });
    const missingResilientSide = evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor({
      ...COMPLETE_INDEPENDENT_FORMULA_INPUT,
      bridgeClass: "resilient_bridge",
      cavityDepthMm: 75
    });
    const exact = evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor({
      ...COMPLETE_INDEPENDENT_FORMULA_INPUT,
      exactSourceId: "rights_safe_double_leaf_exact_lab_row"
    });
    const directFixed = evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor({
      ...COMPLETE_INDEPENDENT_FORMULA_INPUT,
      bridgeClass: "direct_fixed_bridge"
    });
    const grouped = evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor({
      ...COMPLETE_INDEPENDENT_FORMULA_INPUT,
      topologyMode: "grouped_triple_leaf"
    });
    const hostile = evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor({
      ...COMPLETE_INDEPENDENT_FORMULA_INPUT,
      topologyState: "unsafe_reorder"
    });
    const floor = evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor({
      ...COMPLETE_INDEPENDENT_FORMULA_INPUT,
      route: "floor"
    });
    const impact = evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor({
      ...COMPLETE_INDEPENDENT_FORMULA_INPUT,
      targetOutputs: ["Ln,w", "CI", "IIC"]
    });
    const field = evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor({
      ...COMPLETE_INDEPENDENT_FORMULA_INPUT,
      requestedBasis: "field",
      targetOutputs: ["R'w", "DnT,w"]
    });
    const stcAlias = evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor({
      ...COMPLETE_INDEPENDENT_FORMULA_INPUT,
      stcPolicy: "rw_alias_requested",
      targetOutputs: ["STC"]
    });
    const missingPhysics = evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor({
      ...COMPLETE_INDEPENDENT_FORMULA_INPUT,
      sourceOrPhysicsBasis: "missing"
    });
    const outOfRange = evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor({
      ...COMPLETE_INDEPENDENT_FORMULA_INPUT,
      cavityDepthMm: 900
    });

    expect(missing.corridorStatus).toBe("blocked_missing_owner_fields");
    expect(missing.missingOwnerFields).toEqual(["sideALeafMassKgM2", "supportSpacingMm"]);
    expect(missingResilientSide).toMatchObject({
      corridorStatus: "blocked_resilient_side_count",
      missingOwnerFields: ["resilientBarSideCount"]
    });
    expect(exact).toMatchObject({
      corridorStatus: "blocked_exact_source_precedence",
      exactSourceId: "rights_safe_double_leaf_exact_lab_row"
    });
    expect(directFixed.corridorStatus).toBe("blocked_direct_fixed_bridge");
    expect(grouped.corridorStatus).toBe("blocked_grouped_triple_leaf_or_multicavity");
    expect(hostile.corridorStatus).toBe("blocked_hostile_topology");
    expect(floor.corridorStatus).toBe("blocked_wrong_route_scope");
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
    expect(missingPhysics.corridorStatus).toBe("blocked_missing_source_or_physics_basis");
    expect(outOfRange.corridorStatus).toBe("blocked_nonfinite_geometry");
  });

  it("keeps existing Gate S public runtime values frozen while the formula corridor remains no-runtime", () => {
    const independent = calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
      airborneContext: INDEPENDENT_ABSORBED_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const resilient = calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
      airborneContext: RESILIENT_COMPLETE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(independent.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(independent.airborneBasis).toMatchObject({
      errorBudgetDb: 7,
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD
    });
    expect(independent.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
    });
    expect(resilient.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6.2,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(resilient.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD
    });
  });

  it("keeps docs, exports, and current-gate runner aligned with the formula corridor closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS);
      expect(content, path).toContain("Rw 45");
      expect(content, path).toContain("Rw 46");
      expect(content, path).toContain("+/-7 dB");
      expect(content, path).toContain("+/-8 dB");
      expect(content, path).toContain("resilientBarSideCount");
      expect(normalized, path).toContain("double-leaf");
      expect(normalized, path).toContain("framed");
      expect(normalized, path).toContain("mass-air-mass");
      expect(normalized, path).toContain("bridge coupling");
      expect(normalized, path).toContain("flow resistivity");
      expect(normalized, path).toContain("runtime corridor");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor-contract.test.ts"
    );
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_O_SINGLE_LEAF_MASSIVE_PANEL_PREDICTION_WARNING } from "./dynamic-airborne-gate-o-single-leaf";
import {
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTION_STATUS
} from "./layer-combination-resolver-company-internal-v0-rehearsal";
import {
  buildLayerCombinationResolverSingleLeafMassLawBandedSolverOwnerContract,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTION_STATUS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-solver-owner";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const SINGLE_GYPSUM_BOARD = [{ materialId: "gypsum_board", thicknessMm: 12.5 }] as const satisfies readonly LayerInput[];
const DOUBLE_GYPSUM_BOARD_LAMINATED = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];
const RIGID_CONCRETE_PANEL = [{ materialId: "concrete", thicknessMm: 150 }] as const satisfies readonly LayerInput[];

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-solver-owner.ts",
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-solver-owner-contract.test.ts",
  "packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal.ts",
  "packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-o-single-leaf.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md"
] as const;

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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function termById(id: string) {
  const term = buildLayerCombinationResolverSingleLeafMassLawBandedSolverOwnerContract().ownerTerms.find(
    (entry) => entry.id === id
  );
  if (!term) {
    throw new Error(`Missing single-leaf mass-law owner term ${id}.`);
  }
  return term;
}

describe("layer combination resolver single-leaf mass-law banded solver owner contract", () => {
  it("lands the no-runtime owner and selects the formula corridor next", () => {
    const contract = buildLayerCombinationResolverSingleLeafMassLawBandedSolverOwnerContract();

    expect(contract).toMatchObject({
      landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousV0Rehearsal: {
        landedGate: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTION_STATUS
      },
      selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_LABEL,
      selectedV0GapId: "wall_floor_single_leaf_mass_law_banded_solver_owner",
      selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTION_STATUS,
      sourceRowsAreEvidenceNotProduct: true
    });
    expect(contract.summary).toEqual({
      blockedActionCount: 6,
      ownerTermCount: 13,
      routeAdmissionCount: 3,
      runtimeProbeCount: 3,
      selectedFormulaScopeCount: 2,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("owns the physical fields required for a banded single-leaf formula corridor", () => {
    expect(termById("route_single_visible_leaf_topology_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining([
        "route",
        "visibleLeafCount=1",
        "cavityCount=0",
        "explicitSingleLeafOrLaminatedLeafGrouping"
      ]),
      status: "owned_for_formula_corridor"
    });
    expect(termById("material_mass_input_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining(["densityKgM3", "thicknessMm", "surfaceMassKgM2"]),
      status: "owned_for_formula_corridor"
    });
    expect(termById("banded_tl_curve_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining(["oneThirdOctaveBandSet", "transmissionLossCurve50To5000Hz"]),
      status: "runtime_blocked_until_formula_corridor"
    });
    expect(termById("iso717_airborne_rating_adapter_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining(["ISO717-1 referenceContour", "RwAdapter", "CAdapter", "CtrAdapter"]),
      status: "runtime_blocked_until_formula_corridor"
    });
    expect(termById("exact_source_precedence_holdout_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining([
        "sameStackExactSourceId",
        "rightsSafeHoldoutRows",
        "negativeNearMissRows"
      ]),
      status: "owned_for_formula_corridor"
    });
    expect(termById("stc_existing_display_policy_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining(["noRwToStcAliasPromotion", "futureAstmE413CurveOwner"]),
      status: "owned_for_negative_boundary"
    });
  });

  it("admits wall and floor direct-airborne scope while blocking impact and alias leakage", () => {
    const contract = buildLayerCombinationResolverSingleLeafMassLawBandedSolverOwnerContract();

    expect(contract.routeAdmissions).toEqual([
      expect.objectContaining({
        basis: "element_lab",
        existingCompatibilityMetrics: ["STC"],
        id: "wall.single_leaf_airborne_direct.element_lab",
        ownedMetrics: ["Rw", "C", "Ctr"],
        route: "wall",
        selectedForFormulaCorridor: true,
        status: "selected_formula_scope"
      }),
      expect.objectContaining({
        basis: "element_lab",
        id: "floor.single_leaf_airborne_direct.element_lab",
        ownedMetrics: ["Rw", "C", "Ctr"],
        route: "floor",
        selectedForFormulaCorridor: true,
        status: "selected_formula_scope"
      }),
      expect.objectContaining({
        id: "floor.single_leaf_impact.element_lab",
        ownedMetrics: [],
        route: "floor",
        selectedForFormulaCorridor: false,
        status: "blocked_boundary"
      })
    ]);
    expect(contract.blockedNextActions).toEqual([
      expect.objectContaining({ id: "broad_source_crawl", selectedNow: false }),
      expect.objectContaining({ id: "floor_impact_from_airborne_mass_law", selectedNow: false }),
      expect.objectContaining({ id: "field_building_runtime_promotion", selectedNow: false }),
      expect.objectContaining({ id: "stc_from_rw_alias_promotion", selectedNow: false }),
      expect.objectContaining({ id: "astm_iic_aiic_alias_runtime", selectedNow: false }),
      expect.objectContaining({ id: "tolerance_retune_without_holdouts", selectedNow: false })
    ]);
  });

  it("proves current Gate O single-leaf values stay frozen while the owner remains no-runtime", () => {
    const gypsum = calculateAssembly(SINGLE_GYPSUM_BOARD, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const laminated = calculateAssembly(DOUBLE_GYPSUM_BOARD_LAMINATED, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const concrete = calculateAssembly(RIGID_CONCRETE_PANEL, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(gypsum.metrics).toMatchObject({ estimatedRwDb: 31, estimatedStc: 31 });
    expect(gypsum.airborneBasis).toMatchObject({
      calculationStandard: "engine_mass_law",
      errorBudgetDb: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
      family: "single_leaf_panel",
      method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction"
    });
    expect(gypsum.warnings).toContain(GATE_O_SINGLE_LEAF_MASSIVE_PANEL_PREDICTION_WARNING);

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

    expect(buildLayerCombinationResolverSingleLeafMassLawBandedSolverOwnerContract().runtimeProbeExpectations).toEqual([
      expect.objectContaining({ currentRw: 31, currentStc: 31, id: "wall.gypsum_board_12_5_single_leaf" }),
      expect.objectContaining({ currentRw: 34, currentStc: 34, id: "wall.gypsum_board_25_laminated_single_leaf" }),
      expect.objectContaining({ currentRw: 55, currentStc: 55, id: "wall.concrete_150_single_leaf" })
    ]);
  });

  it("keeps docs, exports, and current gate runner aligned with the single-leaf owner", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE);
      expect(normalized, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_LABEL);
      expect(normalized, path).toContain("single-leaf");
      expect(normalized, path).toContain("mass-law");
      expect(normalized, path).toContain("one-third-octave");
      expect(normalized, path).toContain("iso 717-1");
      expect(normalized, path).toContain("stc");
      expect(normalized, path).toContain("impact");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const index = readRepoFile("packages/engine/src/index.ts");

    expect(runner).toContain("layer-combination-resolver-single-leaf-mass-law-banded-solver-owner-contract.test.ts");
    expect(index).toContain('export * from "./layer-combination-resolver-single-leaf-mass-law-banded-solver-owner";');
  });
});

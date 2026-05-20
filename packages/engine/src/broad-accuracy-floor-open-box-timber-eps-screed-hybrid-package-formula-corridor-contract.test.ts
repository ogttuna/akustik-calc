import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactFloorSystem,
  FloorRole,
  FloorSystemRoleCriteria,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridorContract,
  evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor,
  type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaEvaluationInput
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner";
import { evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor } from "./broad-accuracy-floor-open-box-timber-similarity-formula-corridor";
import { buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract } from "./broad-accuracy-floor-open-box-timber-similarity-runtime-corridor";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "R'w", "IIC"] as const satisfies readonly RequestedOutputId[];

const ROLE_ORDER = [
  "ceiling_board",
  "ceiling_fill",
  "ceiling_cavity",
  "floor_covering",
  "resilient_layer",
  "upper_fill",
  "floating_screed",
  "base_structure"
] as const satisfies readonly FloorRole[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts"
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function exactSystem(id: "tuas_r7b_open_box_timber_measured_2026"): ExactFloorSystem {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === id);

  if (!system) {
    throw new Error(`Missing exact system ${id}`);
  }

  return system;
}

function criteriaToLayers(role: FloorRole, criteria: FloorSystemRoleCriteria | undefined): readonly LayerInput[] {
  if (!criteria) {
    return [];
  }

  if (criteria.materialScheduleIds || criteria.thicknessScheduleMm) {
    const materialSchedule = criteria.materialScheduleIds ?? criteria.materialIds ?? [];
    const thicknessSchedule = criteria.thicknessScheduleMm ?? [];

    return thicknessSchedule.map((thicknessMm, index) => ({
      floorRole: role,
      materialId: materialSchedule[index] ?? materialSchedule[0] ?? criteria.materialIds?.[0] ?? "generic_fill",
      thicknessMm
    }));
  }

  const materialId = criteria.materialIds?.[0] ?? "generic_fill";
  const baseThicknessMm = criteria.thicknessMm ?? 1;
  const layerCount = criteria.layerCount ?? 1;

  return Array.from({ length: layerCount }).map(() => ({
    floorRole: role,
    materialId,
    thicknessMm: baseThicknessMm
  }));
}

function layersFromSystem(system: ExactFloorSystem): readonly LayerInput[] {
  return ROLE_ORDER.flatMap((role) => {
    const criteria =
      role === "base_structure"
        ? system.match.baseStructure
        : role === "ceiling_board"
          ? system.match.ceilingBoard
          : role === "ceiling_cavity"
            ? system.match.ceilingCavity
            : role === "ceiling_fill"
              ? system.match.ceilingFill
              : role === "floating_screed"
                ? system.match.floatingScreed
                : role === "floor_covering"
                  ? system.match.floorCovering
                  : role === "resilient_layer"
                    ? system.match.resilientLayer
                    : system.match.upperFill;

    return criteriaToLayers(role, criteria);
  });
}

function completeInput(): BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaEvaluationInput {
  return {
    ceilingBoardLayerCount: 2,
    ceilingBoardThicknessMm: 13,
    ceilingFillThicknessMm: 100,
    floatingScreedMassKgM2: 84,
    lowerState: "hybrid_family_a_resilient_stud",
    packageUpperState: "complete_eps_screed_laminate",
    requestedBasis: "element_lab",
    resilientLayerThicknessMm: 3,
    roleTopologyState: "source_equivalent",
    separatorThicknessMm: 1,
    supportFamily: "open_box_timber",
    supportThicknessMm: 370,
    targetOutputs: TARGET_OUTPUTS,
    upperFillThicknessMm: 35
  };
}

describe("broad accuracy floor open-box timber EPS/screed hybrid package formula corridor contract", () => {
  it("lands the no-runtime formula corridor and selects the runtime corridor next", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridorContract();

    expect(contract).toMatchObject({
      additionalSourceRowsRequiredForRuntimeSelection: false,
      exactMeasuredRowsRemainPrecedence: true,
      forbiddenBorrowedGenericPackageTransferBasis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousPackageOwner: {
        landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_LANDED_GATE,
        selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_ACTION,
        selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_FILE,
        selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTION_STATUS
      },
      runtimePromotionAllowedInGate: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTION_STATUS,
      sourceRowsRequiredForFormulaDesign: true
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

  it("defines design terms, not-measured budgets, and R7b-anchored formula design metrics", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridorContract();

    expect(contract.formulaTerms.map((term) => term.termId)).toEqual([
      "r7b_same_stack_anchor_packet",
      "open_box_370mm_support_geometry",
      "wet_eps_screed_upper_transfer",
      "hybrid_lower_treatment_transfer",
      "sibling_negative_boundary_residuals",
      "exact_source_and_generic_package_transfer_exclusion",
      "element_lab_iso717_metric_boundaries",
      "hostile_topology_and_safe_split_equivalence",
      "source_absent_budget_decomposition"
    ]);
    expect(contract.formulaTerms.every((term) => term.runtimeOwnedInGate === false)).toBe(true);
    expect(contract.toleranceBudgets.map((budget) => [budget.metricId, budget.totalBudgetDb])).toEqual([
      ["Rw", 7],
      ["C", 3],
      ["Rw+C", 7.5],
      ["Ln,w", 8],
      ["CI", 2.5],
      ["CI,50-2500", 3],
      ["Ln,w+CI", 8.5]
    ]);
    expect(contract.toleranceBudgets.flatMap((budget) => budget.terms).every(
      (term) => term.basis === "source_absent_eps_screed_hybrid_package_formula_design_budget"
    )).toBe(true);
    expect(contract.runtimePromotionEntryCriteria).toEqual([
      "public_runtime_must_keep_open_measured_floor_system_exact_match_ahead_of_eps_screed_formula_rows",
      "public_runtime_must_require_complete_eps_board_geotextile_screed_eps_underlay_laminate_and_hybrid_lower_inputs",
      "public_runtime_must_not_borrow_the_generic_dry_package_transfer_basis",
      "public_runtime_must_block_r8b_r9b_r2c_and_r10a_negative_boundaries",
      "formula_surface_must_show_not_measured_error_budget_for_each_supported_metric",
      "field_building_and_astm_outputs_must_remain_unpromoted"
    ]);

    expect(contract.candidateFormulaRows.map((row) => row.corridorStatus)).toEqual([
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "blocked_exact_source_precedence",
      "blocked_partial_finish_boundary",
      "blocked_screed_only_boundary",
      "blocked_lower_missing_mass_boundary",
      "blocked_mixed_staged_upper_boundary",
      "blocked_basis_alias"
    ]);
    expect(contract.candidateFormulaRows[0]?.basisId).toBe(
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_BASIS
    );
    expect(contract.candidateFormulaRows[0]?.designMetrics).toEqual({
      C: -1.3,
      CI: 0,
      CI50_2500: 1,
      LnW: 47,
      LnWPlusCI: 47,
      Rw: 72,
      RwPlusC: 70.7
    });
    expect(contract.candidateFormulaRows[0]?.affectedFormulaOutputs).toEqual([
      "Rw",
      "C",
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI"
    ]);
    expect(contract.candidateFormulaRows[0]?.blockedFormulaOutputs).toEqual(["R'w", "IIC"]);
    expect(contract.candidateFormulaRows[0]?.runtimeValues).toEqual({
      C: null,
      CI: null,
      CI50_2500: null,
      LnW: null,
      LnWPlusCI: null,
      Rw: null,
      RwPlusC: null
    });
  });

  it("blocks missing owners, wrong families, exact precedence, hostile topology, sibling negatives, and basis aliases", () => {
    const complete = completeInput();
    const missing = evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
      ...complete,
      ceilingBoardLayerCount: undefined,
      floatingScreedMassKgM2: undefined
    });
    const wrongFamily = evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
      ...complete,
      supportFamily: "open_web_steel"
    });
    const exact = evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
      ...complete,
      exactSourceId: "tuas_r7b_open_box_timber_measured_2026"
    });
    const hostile = evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
      ...complete,
      roleTopologyState: "disjoint_duplicate_roles"
    });
    const partial = evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
      ...complete,
      packageUpperState: "partial_laminate_eps"
    });
    const screedOnly = evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
      ...complete,
      packageUpperState: "screed_only_missing_upper_fill"
    });
    const missingLower = evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
      ...complete,
      lowerState: "missing_lower_mass"
    });
    const mixed = evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
      ...complete,
      packageUpperState: "mixed_staged_upper"
    });
    const dryPackage = evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
      ...complete,
      packageUpperState: "dry_gypsum_fiber_upper"
    });
    const aliases = evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
      ...complete,
      requestedBasis: "field",
      targetOutputs: ["R'w", "DnT,w", "L'n,w", "IIC"]
    });

    expect(missing.corridorStatus).toBe("blocked_missing_owner_fields");
    expect(missing.missingOwnerFields).toEqual(["floatingScreedMassKgM2", "ceilingBoardLayerCount=2"]);
    expect(wrongFamily.corridorStatus).toBe("blocked_wrong_support_family");
    expect(exact.corridorStatus).toBe("blocked_exact_source_precedence");
    expect(hostile.corridorStatus).toBe("blocked_disjoint_duplicate_roles");
    expect(partial.corridorStatus).toBe("blocked_partial_finish_boundary");
    expect(screedOnly.corridorStatus).toBe("blocked_screed_only_boundary");
    expect(missingLower.corridorStatus).toBe("blocked_lower_missing_mass_boundary");
    expect(mixed.corridorStatus).toBe("blocked_mixed_staged_upper_boundary");
    expect(dryPackage.corridorStatus).toBe("blocked_dry_package_route");
    expect(aliases.corridorStatus).toBe("blocked_basis_alias");
    expect(aliases.affectedFormulaOutputs).toEqual([]);
    expect(aliases.blockedFormulaOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "IIC"]);
    expect(partial.blockedSourceIds).toEqual([
      "tuas_r8b_open_box_timber_measured_2026",
      "tuas_r9b_open_box_timber_measured_2026",
      "tuas_r2c_open_box_timber_measured_2026",
      "tuas_r10a_open_box_timber_measured_2026"
    ]);
  });

  it("keeps public runtime unchanged while exact R7b and older package-transfer guards stay first", () => {
    const exact = calculateAssembly(layersFromSystem(exactSystem("tuas_r7b_open_box_timber_measured_2026")), {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const genericOldFormulaProbe = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "complete_laminate_eps",
      packageId: "eps_screed_or_hybrid_upper",
      roleTopologyState: "source_equivalent",
      supportFamily: "open_box_timber",
      targetOutputs: TARGET_OUTPUTS
    });
    const runtime = buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract();

    expect(exact.floorSystemMatch?.system.id).toBe("tuas_r7b_open_box_timber_measured_2026");
    expect(exact.impact).toMatchObject({
      CI: 0,
      CI50_2500: 1,
      LnW: 47,
      LnWPlusCI: 47,
      basis: "open_measured_floor_system_exact_match",
      labOrField: "lab"
    });
    expect(exact.floorSystemRatings).toMatchObject({
      Rw: 72,
      basis: "open_measured_floor_system_exact_match"
    });
    expect(genericOldFormulaProbe).toMatchObject({
      blockedFormulaOutputs: ["C", "R'w", "IIC"],
      blockedSourceIds: [
        "tuas_r7b_open_box_timber_measured_2026",
        "tuas_r8b_open_box_timber_measured_2026",
        "tuas_r9b_open_box_timber_measured_2026",
        "tuas_r2c_open_box_timber_measured_2026"
      ],
      corridorStatus: "blocked_exact_only_hybrid_transfer",
      runtimePromotionAllowedInGate: false
    });
    expect(runtime.supportedScenarios.flatMap((scenario) => scenario.anchorSourceIds)).not.toContain(
      "tuas_r7b_open_box_timber_measured_2026"
    );
  });

  it("keeps docs, exports, and the current-gate runner aligned with the selected next gate", () => {
    const requiredStrings = [
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_LANDED_GATE,
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTION_STATUS,
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE
    ];

    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      for (const required of requiredStrings) {
        expect(content, `${path} should mention ${required}`).toContain(required);
      }
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor-contract.test.ts"
    );
  });
});

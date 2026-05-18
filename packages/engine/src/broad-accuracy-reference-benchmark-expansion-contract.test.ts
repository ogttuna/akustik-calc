import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_LANDED_GATE,
  BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTION_STATUS,
  buildBroadAccuracyReferenceBenchmarkExpansionContract
} from "./broad-accuracy-reference-benchmark-expansion";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-reference-benchmark-expansion.ts",
  "packages/engine/src/broad-accuracy-reference-benchmark-expansion-contract.test.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy reference benchmark expansion and similarity solver contract", () => {
  it("lands the no-runtime benchmark expansion and keeps source inventory separate from readiness", () => {
    const contract = buildBroadAccuracyReferenceBenchmarkExpansionContract();

    expect(contract).toMatchObject({
      canClaimBroadAccuracyReady: false,
      landedGate: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTION_STATUS,
      sourceInventoryIsStillNotProductGoal: true
    });
    expect(contract.previousRefocus).toMatchObject({
      selectedNextAction: "broad_accuracy_reference_benchmark_expansion_and_similarity_solver_plan",
      selectedNextFile: "packages/engine/src/broad-accuracy-reference-benchmark-expansion-contract.test.ts",
      selectionStatus: "broad_accuracy_calculator_refocus_landed_selected_reference_benchmark_and_similarity_solver"
    });
    expect(contract.ledgerSummary).toEqual({
      controlledEnvelopeRows: 71,
      exactSourceRowsByGroup: 235,
      formulaRegressionAnchorRows: 36,
      holdoutResidualRows: 6,
      referenceGroups: 17,
      sourceAbsentBudgetOnlyRows: 1,
      weakLaneDebtRows: 6,
      weakLaneRowsCountedAsSupportedReadiness: 0
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ingests existing local evidence by role without letting exact rows hide residual blockers", () => {
    const contract = buildBroadAccuracyReferenceBenchmarkExpansionContract();
    const byId = new Map(contract.benchmarkLedger.map((row) => [row.id, row]));

    expect(byId.get("floor.exact_systems.open_measured_dataset")).toMatchObject({
      evidenceRole: "exact_source",
      exactSourcePrecedenceEligible: true,
      residualEligible: false,
      rowCount: 38
    });
    expect(byId.get("floor.exact_systems.official_manufacturer_system_table")).toMatchObject({
      evidenceRole: "exact_source",
      rowCount: 116
    });
    expect(byId.get("floor.exact_systems.official_open_component_library")).toMatchObject({
      evidenceRole: "exact_source",
      rowCount: 19
    });
    expect(byId.get("floor.bound_systems.compatible_nearby_anchor_pool")).toMatchObject({
      evidenceRole: "similarity_anchor",
      exactSourcePrecedenceEligible: false,
      rowCount: 23
    });
    expect(byId.get("wall.verified_airborne.lab_rw.exact_pool")).toMatchObject({
      evidenceRole: "exact_source",
      metrics: ["Rw"],
      rowCount: 43
    });
    expect(byId.get("wall.verified_airborne.field_dntak.exact_pool")).toMatchObject({
      basis: "field_apparent",
      evidenceRole: "exact_source",
      metrics: ["DnT,A,k"],
      rowCount: 13
    });
    expect(byId.get("mixed.company_internal_matrix_v6.controlled_envelope")).toMatchObject({
      evidenceRole: "controlled_envelope_guardrail",
      residualEligible: false,
      rowCount: 71
    });
  });

  it("reports family residual coverage and keeps missing DeltaLw holdouts visible", () => {
    const contract = buildBroadAccuracyReferenceBenchmarkExpansionContract();
    const byFamily = new Map(contract.residualSummaries.map((summary) => [summary.familyId, summary]));

    expect(byFamily.get("floor.lightweight_steel.lab_lnw")).toMatchObject({
      blockers: [],
      calibrationCount: 36,
      holdoutResidualCount: 3,
      maxAbsErrorDb: 0.6,
      meanAbsErrorDb: 0.4,
      metric: "Ln,w",
      sourceAbsentBudgetOnlyCount: 1
    });
    expect(byFamily.get("floor.lightweight_steel.lab_delta_lw")).toMatchObject({
      blockers: ["measured_same_stack_delta_lw_holdouts_absent"],
      holdoutResidualCount: 0,
      metric: "DeltaLw",
      sourceAbsentBudgetOnlyCount: 1
    });
    expect(byFamily.get("wall.triple_leaf_two_cavity.lab_rw")).toMatchObject({
      calibrationCount: 2,
      holdoutResidualCount: 1,
      maxAbsErrorDb: 0,
      meanAbsErrorDb: 0,
      metric: "Rw"
    });
    expect(byFamily.get("wall.timber_lightweight.lab_rw")).toMatchObject({
      blockers: ["linked_holdout_residual_runner_not_globalized_yet"],
      exactCount: 6,
      holdoutResidualCount: 2
    });
    expect(byFamily.get("floor.exact_systems")).toMatchObject({
      blockers: ["exact_inventory_not_holdout_residual_proof"],
      exactCount: 173,
      similarityAnchorCount: 23
    });
  });

  it("turns low-confidence and screening lanes into ranked calculation debt, not supported coverage", () => {
    const contract = buildBroadAccuracyReferenceBenchmarkExpansionContract();
    const byId = new Map(contract.weakLaneDebtLedger.map((row) => [row.id, row]));

    expect(contract.weakLaneDebtLedger).toHaveLength(6);
    expect(contract.weakLaneDebtLedger.every((row) => row.supportedReadinessCoverage === false)).toBe(true);
    expect(byId.get("floor.open_web_or_open_box.legacy_low_confidence_family_lane")).toMatchObject({
      currentWeakLane: "low_confidence",
      recommendedConversionPath: "similarity_anchor",
      route: "floor"
    });
    expect(byId.get("wall.multileaf_screening_blend.rockwool_split_rw41")).toMatchObject({
      currentWeakLane: "multileaf_screening_blend",
      recommendedConversionPath: "calibrated_family_solver",
      route: "wall"
    });
    expect(byId.get("wall.generic_airborne.screening_fallback_basis")).toMatchObject({
      currentWeakLane: "screening_fallback",
      recommendedConversionPath: "source_absent_family_solver"
    });
    expect(byId.get("floor.reinforced_concrete.low_confidence_cleanup_history")).toMatchObject({
      activeRuntimeRisk: "historical_contract_guard",
      recommendedConversionPath: "historical_only_after_existing_cleanup"
    });
    expect([...contract.weakLaneDebtLedger].sort((left, right) => right.priority - left.priority)[0]?.id).toBe(
      "floor.open_web_or_open_box.legacy_low_confidence_family_lane"
    );
  });

  it("defines similarity-anchor hard rejections and selects the next floor-system anchor lane", () => {
    const contract = buildBroadAccuracyReferenceBenchmarkExpansionContract();

    expect(contract.similarityAnchorPolicy.distanceDimensions).toEqual([
      "route",
      "metric_basis",
      "support_family",
      "structural_carrier",
      "leaf_or_cavity_count",
      "role_topology",
      "thickness_and_surface_mass",
      "dynamic_stiffness_and_load_basis",
      "opening_or_leak_package",
      "field_or_building_room_context"
    ]);
    expect(contract.similarityAnchorPolicy.hardRejectionRules).toEqual([
      "wrong_metric_basis",
      "lab_to_field_or_field_to_building_alias",
      "iso_to_astm_alias",
      "wrong_support_family",
      "missing_physical_owner_fields",
      "source_row_without_topology_ownership"
    ]);
    expect(contract.similarityAnchorPolicy.examples).toEqual([
      {
        anchorUse: "exact_override",
        id: "same_topology_metric_basis_rank_zero",
        rank: 0,
        reason: "same topology, same metric, and same basis remains an exact measured override"
      },
      {
        anchorUse: "anchor_only",
        id: "nearby_open_web_floor_same_metric_family",
        rank: 1,
        reason: "compatible support family and metric basis can anchor a later correction method"
      },
      {
        anchorUse: "rejected",
        id: "lab_rw_to_field_dntw_alias",
        rank: null,
        reason: "lab element Rw cannot anchor field DnT,w without a field adapter owner"
      },
      {
        anchorUse: "rejected",
        id: "iso_lnw_to_astm_iic_alias",
        rank: null,
        reason: "ISO impact metrics cannot anchor ASTM IIC/AIIC"
      },
      {
        anchorUse: "rejected",
        id: "wrong_support_family_steel_to_timber",
        rank: null,
        reason: "wrong structural support family is a negative boundary, not an anchor"
      }
    ]);
    expect(contract.nextLaneSelection.selectedCandidate).toMatchObject({
      category: "similarity_anchor_runtime",
      id: "floor_system_similarity_anchor_for_open_web_open_box_variants",
      runtimeMovementAllowedInThisSlice: false,
      score: 1.82,
      selected: true,
      sourceRowsRequiredForSelection: false,
      unlocksMetrics: ["Ln,w", "L'n,w", "L'nT,w"]
    });
    expect(contract.nextLaneSelection.candidates.at(-1)).toMatchObject({
      category: "unsupported_boundary",
      id: "astm_iic_aiic_detour",
      selected: false,
      sourceRowsRequiredForSelection: true
    });
  });

  it("keeps docs and current-gate runner aligned with the benchmark expansion closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);

      expect(content, path).toContain(BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_FILE);
      expect(content, path).toContain("weak-lane debt");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-reference-benchmark-expansion-contract.test.ts");
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type {
  PersonalUseMvpCoverageMetricValuePin,
  PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildCompanyInternalBuildingAstmBoundaryRevalidationContract,
  buildCompanyInternalCalculationGradeMainlineMatrixV6,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_LANDED_GATE,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTION_STATUS,
  rankCompanyInternalBuildingAstmBoundaryRevalidationNextLanes,
  summarizeCompanyInternalBuildingAstmBoundaryRevalidation,
  summarizeCompanyInternalCalculationGradeMainlineMatrixV6
} from "./company-internal-calculation-grade-mainline-matrix";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type ReleaseBucket =
  | "release_exact_precedence"
  | "release_hostile_refusal"
  | "release_needs_input"
  | "release_supported"
  | "release_unsupported_boundary";

const REQUIRED_FINAL_REHEARSAL_SURFACES = [
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts",
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts",
  "packages/engine/src/company-internal-building-astm-boundary-revalidation-contract.test.ts",
  "packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_FINAL_REHEARSAL_PLANNING_HANDOFF.md",
  "docs/calculator/COMPANY_INTERNAL_OPERATING_ENVELOPE.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

const CURRENT_SELECTION_DOCS = [
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_FINAL_REHEARSAL_PLANNING_HANDOFF.md",
  "docs/calculator/COMPANY_INTERNAL_OPERATING_ENVELOPE.md"
] as const;

const SURFACE_PROOF_OWNER_FILES = [
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-as-airborne-building-prediction-surface-parity-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-t-opening-leak-composite-surface-parity-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bp-reinforced-concrete-cleanup-surface-parity-contract.test.ts",
  "packages/engine/src/company-internal-opening-leak-building-surface-parity-contract.test.ts",
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.test.ts",
  "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts",
  "packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts",
  "apps/web/features/workbench/steel-floor-formula-card-report-parity.test.ts",
  "apps/web/features/workbench/company-internal-steel-suspended-ceiling-delta-lw-surface-parity.test.ts",
  "apps/web/features/workbench/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity.test.ts",
  "apps/web/features/workbench/timber-clt-delta-lw-surface-parity.test.ts",
  "apps/web/features/workbench/airborne-field-context-surface-parity.test.ts",
  "apps/web/features/workbench/airborne-building-prediction-surface-parity.test.ts",
  "apps/web/features/workbench/opening-leak-composite-surface-parity.test.ts",
  "apps/web/features/workbench/company-internal-opening-leak-building-surface-parity.test.ts",
  "apps/web/features/workbench/company-internal-opening-leak-a-weighted-surface-parity.test.ts",
  "apps/web/features/workbench/heavy-concrete-combined-impact-input-surface-acceptance.test.ts"
] as const;

const REPRESENTATIVE_SUPPORTED_VALUE_PINS = [
  { budget: 6, id: "wall.single_leaf_heavy_concrete_masonry.lab", pins: { Rw: 58, STC: 59 } },
  { budget: 6, id: "wall.aac_nonhomogeneous_masonry.lab", pins: { Rw: 44, STC: 44, Ctr: -5.2 } },
  { budget: 8, id: "wall.grouped_triple_leaf_50_50_mineral_wool.lab", pins: { Rw: 53 } },
  { budget: 6, id: "wall.lined_massive_masonry.lab", pins: { Rw: 60, STC: 60 } },
  { budget: 6, id: "wall.clt_mass_timber.lab", pins: { Rw: 42, STC: 42, Ctr: -6.1 } },
  { budget: 9, id: "wall.complete_field_context.rprime_dnt", pins: { "R'w": 39, "DnT,w": 40 } },
  { budget: 9, id: "wall.complete_building_prediction.runtime", pins: { "R'w": 58, "DnT,w": 59 } },
  { budget: 6, id: "wall.opening_leak_composite.lab", pins: { Rw: 38.2, STC: 39 } },
  { budget: 8, id: "wall.opening_leak_field_runtime.input_surface", pins: { "R'w": 36.4, "DnT,w": 36.9 } },
  { budget: 10, id: "wall.opening_leak_building_runtime.input_surface", pins: { "R'w": 31.6, "DnT,w": 32.1 } },
  { budget: 9, id: "wall.opening_leak_a_weighted_field_runtime.input_surface", pins: { "Dn,A": 35.9, "DnT,A": 36.1 } },
  { budget: 11, id: "wall.opening_leak_a_weighted_building_runtime.input_surface", pins: { "DnT,A": 31.3 } },
  { budget: 8, id: "wall.heavy_composite_complete_family_physics.lab", pins: { Rw: 63, STC: 63 } },
  { budget: 10, id: "wall.heavy_composite_complete_field_adapter.field", pins: { "R'w": 60, "DnT,w": 61, "DnT,A": 60.1 } },
  { budget: 10, id: "floor.heavy_concrete_floating_floor.lab", pins: { "Ln,w": 44.9, DeltaLw: 26.9 } },
  { budget: 4.5, id: "floor.lightweight_steel_complete_formula.lab", pins: { "Ln,w": 55.6, DeltaLw: 22.4 } },
  { budget: 7.5, id: "floor.clt_mass_timber_impact.lab", pins: { "Ln,w": 50, DeltaLw: 22.6 } },
  { budget: 5, id: "floor.complete_field_impact_context.lprime", pins: { "L'n,w": 53, "L'nT,w": 50.6 } },
  { budget: 2, id: "floor.lightweight_steel_suspended_ceiling_delta_lw.runtime", pins: { "Ln,w": 51.6, DeltaLw: 22.4 } },
  {
    budget: 7,
    id: "floor.lightweight_steel_suspended_ceiling_lnt50.runtime",
    pins: { "Ln,w": 51.6, "L'nT,50": 50.8, "L'nT,w": 51.8 }
  },
  {
    budget: 6.5,
    id: "floor.reinforced_concrete_combined_complete_formula.lab",
    pins: { "Ln,w": 58.1, DeltaLw: 13.7 }
  },
  { budget: null, id: "floor.reinforced_concrete_bare_floor_existing_corridor.lab", pins: { Rw: 58, "Ln,w": 71.8 } },
  {
    budget: 5,
    id: "floor.reinforced_concrete_combined_field_building.non_alias",
    pins: { "L'n,w": 61.1, "L'nT,w": 58.3 }
  }
] as const;

const EXACT_PRECEDENCE_VALUE_PINS = [
  { id: "floor.lightweight_steel_exact_source_precedence.lab", pins: { "Ln,w": 51 } },
  { id: "floor.timber_joist_impact.lab", pins: { "Ln,w": 51, DeltaLw: 25.2 } },
  { id: "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab", pins: { "Ln,w": 58 } },
  { id: "floor.reinforced_concrete_combined_exact_source_precedence.lab", pins: { Rw: 62, "Ln,w": 48 } },
  { id: "floor.lightweight_steel_suspended_ceiling_lnt50_exact_field_precedence.field", pins: { "L'nT,50": 55 } }
] as const;

const NEEDS_INPUT_EXPECTATIONS = [
  {
    id: "wall.flat_list_multicavity_ambiguity.needs_input",
    missing: ["sideALeafGroup", "cavity1DepthMm", "internalLeafGroup", "internalLeafCoupling", "cavity2DepthMm", "sideBLeafGroup", "supportTopology"]
  },
  { id: "wall.missing_field_context.needs_input", missing: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"] },
  { id: "floor.heavy_concrete_floating_floor_missing_load.needs_input", missing: ["loadBasisKgM2"] },
  {
    id: "floor.missing_field_impact_context.needs_input",
    missing: ["toppingOrFloatingLayer", "loadBasisKgM2", "contextMode", "partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"]
  },
  { id: "wall.opening_leak_composite_partial.needs_input", missing: ["openingElementRwDb", "openingRatingBasis", "openingSealLeakageClass"] },
  {
    id: "wall.building_prediction_partial_context.needs_input",
    missing: ["sourceRoomVolumeM3", "flankingJunctionClass", "conservativeFlankingAssumption", "junctionCouplingLengthM", "buildingPredictionOutputBasis"]
  },
  { id: "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input", missing: ["resilientLayerDynamicStiffnessMNm3"] },
  { id: "floor.lightweight_steel_formula_missing_spacing.needs_input", missing: ["steelCarrierSpacingMm"] },
  {
    id: "floor.lightweight_steel_suspended_ceiling_partial.needs_input",
    missing: ["steelCarrierSpacingMm", "lowerCeilingIsolationSupportForm"]
  },
  {
    id: "floor.reinforced_concrete_combined_visible_derived.needs_input",
    missing: ["resilientLayerDynamicStiffnessMNm3", "loadBasisKgM2"]
  },
  { id: "floor.reinforced_concrete_combined_incomplete_explicit.needs_input", missing: ["loadBasisKgM2", "ceilingOrLowerAssembly"] },
  { id: "wall.opening_leak_building_missing_owner.needs_input", missing: ["sourceRoomVolumeM3"] },
  { id: "wall.opening_leak_a_weighted_missing_frequency.needs_input", missing: ["frequencyBandSet"] }
] as const;

const UNSUPPORTED_BOUNDARY_ROW_IDS = [
  "floor.astm_iic_aiic_boundary.unsupported",
  "floor.lightweight_steel_formula_wrong_family.inactive",
  "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
  "floor.reinforced_concrete_combined_astm_iic.unsupported",
  "wall.opening_leak_a_weighted_building_dna.unsupported",
  "wall.opening_leak_a_weighted_lab_alias.unsupported",
  "wall.opening_leak_a_weighted_astm_alias.unsupported"
] as const;

const PARTIAL_SUPPORTED_BOUNDARY_ROW_IDS = [
  "floor.lightweight_steel_suspended_ceiling_field_adapter.lprime",
  "floor.reinforced_concrete_combined_field_building.non_alias",
  "floor.lightweight_steel_suspended_ceiling_lnt50_missing_ci.unsupported"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing final internal-use rehearsal row ${id}`);
  }

  return row;
}

function countBy<T>(
  rows: readonly T[],
  getKey: (row: T) => string
): Record<string, number> {
  return rows.reduce<Record<string, number>>((counts, row) => {
    const key = getKey(row);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function currentGateToken(path: string): string {
  return path
    .replace(/^packages\/engine\//, "")
    .replace(/^apps\/web\//, "");
}

function releaseBucket(row: PersonalUseMvpCoverageScenarioRow): ReleaseBucket {
  if (row.failureClass === "hostile_input_refusal") {
    return "release_hostile_refusal";
  }

  if (row.currentPosture === "exact") {
    return "release_exact_precedence";
  }

  if (row.currentPosture === "needs_input") {
    return "release_needs_input";
  }

  if (row.currentPosture === "unsupported") {
    return "release_unsupported_boundary";
  }

  return "release_supported";
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("company-internal final internal-use rehearsal", () => {
  it("lands the final rehearsal contract around the already selected boundary-revalidation handoff", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV6();
    const contract = buildCompanyInternalBuildingAstmBoundaryRevalidationContract();
    const summary = summarizeCompanyInternalBuildingAstmBoundaryRevalidation(rows);
    const selection = rankCompanyInternalBuildingAstmBoundaryRevalidationNextLanes(rows);

    expect(contract).toMatchObject({
      landedGate: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_LANDED_GATE,
      matrixRows: 71,
      newRuntimeBehaviorChangeInRevalidation: false,
      selectedNextAction: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(summary).toMatchObject({
      finalRehearsalReady: true,
      matrixRows: 71,
      matrixV6AWeightedValuePinsPreserved: true,
      selectedLane: "final_internal_use_rehearsal"
    });
    expect(selection.selectedCandidate).toMatchObject({
      id: "final_internal_use_rehearsal",
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_FINAL_REHEARSAL_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("classifies the 71-row matrix into release buckets and preserves global acceptance counts", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV6();
    const rowIds = rows.map((row) => row.id);
    const matrixSummary = summarizeCompanyInternalCalculationGradeMainlineMatrixV6(rows);

    expect(new Set(rowIds).size).toBe(71);
    expect(rows).toHaveLength(71);
    expect(countBy(rows, (row) => row.route)).toEqual({ floor: 35, wall: 36 });
    expect(countBy(rows, (row) => row.basis)).toEqual({
      astm_rating_boundary: 4,
      building_prediction: 8,
      element_lab: 44,
      field_apparent: 15
    });
    expect(countBy(rows, (row) => row.currentPosture)).toEqual({
      bounded_screening: 1,
      exact: 5,
      family_physics: 38,
      needs_input: 17,
      source_anchored_delta: 2,
      unsupported: 8
    });
    expect(matrixSummary.failureClassCounts).toEqual({
      basis_boundary: 5,
      correct_block: 15,
      coverage_gap: 0,
      hostile_input_refusal: 4,
      none: 43,
      unsupported_metric: 4
    });
    expect(countBy(rows, releaseBucket)).toEqual({
      release_exact_precedence: 5,
      release_hostile_refusal: 4,
      release_needs_input: 14,
      release_supported: 41,
      release_unsupported_boundary: 7
    });
    expect(matrixSummary.hiddenScreeningOriginRowIds).toEqual([]);
    expect(rowIds.filter((id) => id.includes("coverage_gap"))).toEqual([]);

    const supportedBoundedRows = rows.filter((row) =>
      releaseBucket(row) === "release_supported" && row.currentPosture === "bounded_screening"
    );
    const leakedScreeningRows = rows.filter((row) =>
      releaseBucket(row) === "release_supported" &&
      (row.originSupportBucket.includes("screening_fallback") ||
        row.runtime.origin === "screening_fallback")
    );
    expect(supportedBoundedRows.map((row) => row.id)).toEqual(["wall.lined_massive_masonry.lab"]);
    expect(leakedScreeningRows.map((row) => row.id)).toEqual([]);
  });

  it("pins representative supported wall/floor values, bases, origins, and budgets", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV6();

    for (const expectation of REPRESENTATIVE_SUPPORTED_VALUE_PINS) {
      const row = byId(rows, expectation.id);

      expect(releaseBucket(row), row.id).toBe("release_supported");
      expect(row.runtime.supportedTargetOutputs.length, row.id).toBeGreaterThan(0);
      expect(row.runtime.valuePins.length, row.id).toBeGreaterThan(0);
      expect(row.runtime.basisId, row.id).not.toBeNull();
      expect(row.runtime.origin, row.id).not.toBe("screening_fallback");
      expect(row.runtime.errorBudgetDb, row.id).toBe(expectation.budget);
      expect(values(row), row.id).toMatchObject(expectation.pins);
    }

    for (const expectation of EXACT_PRECEDENCE_VALUE_PINS) {
      const row = byId(rows, expectation.id);
      const exactTrace = [
        row.runtime.basisId,
        row.runtime.origin,
        row.runtime.selectedMethod
      ].filter((value): value is string => value !== null).join(" ");

      expect(releaseBucket(row), row.id).toBe("release_exact_precedence");
      expect(exactTrace, row.id).toContain("exact");
      expect(values(row), row.id).toMatchObject(expectation.pins);
    }
  });

  it("keeps missing-input, unsupported, hostile, and partial-boundary rows honest", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV6();

    for (const expectation of NEEDS_INPUT_EXPECTATIONS) {
      const row = byId(rows, expectation.id);

      expect(releaseBucket(row), row.id).toBe("release_needs_input");
      expect(row.runtime.errorBudgetDb, row.id).toBeNull();
      expect(row.runtime.missingPhysicalInputs, row.id).toEqual(expect.arrayContaining([...expectation.missing]));
      expect(row.valueOrBlockedReason.length, row.id).toBeGreaterThan(0);
    }

    for (const rowId of UNSUPPORTED_BOUNDARY_ROW_IDS) {
      const row = byId(rows, rowId);

      expect(releaseBucket(row), row.id).toBe("release_unsupported_boundary");
      expect(row.runtime.errorBudgetDb, row.id).toBeNull();
      expect(row.runtime.supportedTargetOutputs, row.id).toEqual([]);
      expect(row.runtime.valuePins, row.id).toEqual([]);
      expect(row.runtime.unsupportedTargetOutputs.length, row.id).toBeGreaterThan(0);
    }

    for (const rowId of PARTIAL_SUPPORTED_BOUNDARY_ROW_IDS) {
      const row = byId(rows, rowId);

      expect(releaseBucket(row), row.id).toBe("release_supported");
      expect(row.failureClass, row.id).toBe("basis_boundary");
      expect(row.runtime.supportedTargetOutputs.length, row.id).toBeGreaterThan(0);
      expect(row.runtime.unsupportedTargetOutputs.length, row.id).toBeGreaterThan(0);
      expect(row.runtime.valuePins.length, row.id).toBeGreaterThan(0);
      expect(row.valueOrBlockedReason, row.id).toMatch(/unsupported|blocked|not .*alias/);
    }

    const hostileRows = rows.filter((row) => releaseBucket(row) === "release_hostile_refusal");
    expect(hostileRows.map((row) => row.id)).toEqual([
      "floor.lightweight_steel_duplicate_carrier.refused",
      "hostile.invalid_thickness_zero.refused",
      "wall.opening_leak_duplicate_id.refused",
      "floor.lightweight_steel_suspended_ceiling_duplicate_carrier.refused"
    ]);
    for (const row of hostileRows) {
      expect(row.runtime.errorBudgetDb, row.id).toBeNull();
      expect(row.runtime.valuePins, row.id).toEqual([]);
    }
  });

  it("keeps visible-surface proof owners and current-gate wiring in place", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("company-internal-final-internal-use-rehearsal-contract.test.ts");

    for (const path of SURFACE_PROOF_OWNER_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      expect(runner, path).toContain(currentGateToken(path));
    }
  });

  it("keeps living docs aligned with the operating envelope instead of another broad source crawl", () => {
    const envelope = readRepoFile("docs/calculator/COMPANY_INTERNAL_OPERATING_ENVELOPE.md");

    expect(envelope).toContain("Controlled Company-Internal Ready Envelope");
    expect(envelope).toContain("47 rows");
    expect(envelope).toContain("17 `needs_input` rows");
    expect(envelope).toContain("8 unsupported rows");
    expect(envelope).toContain("No broad source crawl");
    expect(envelope).toContain("No ASTM `IIC` / `AIIC` runtime adapter");
    expect(envelope).toContain(COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION);

    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION);
      expect(content, path).toContain("company-internal-final-internal-use-rehearsal-contract.test.ts");
      expect(content, path).toContain("COMPANY_INTERNAL_OPERATING_ENVELOPE.md");
      expect(content, path).not.toContain("active next slice is boundary revalidation");
    }
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTION_STATUS
} from "./layer-combination-resolver-candidate-coverage-matrix-refresh";
import {
  buildLayerCombinationResolverCompanyInternalV0RehearsalContract,
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTION_STATUS
} from "./layer-combination-resolver-company-internal-v0-rehearsal";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal.ts",
  "packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal-contract.test.ts",
  "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh.ts",
  "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh-contract.test.ts",
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

function rowById(id: string) {
  const row = buildLayerCombinationResolverCompanyInternalV0RehearsalContract().operatingEnvelopeRows.find(
    (entry) => entry.candidateId === id
  );
  if (!row) {
    throw new Error(`Missing company-internal V0 row ${id}.`);
  }
  return row;
}

describe("layer combination resolver company-internal V0 rehearsal contract", () => {
  it("lands the no-runtime V0 rehearsal and selects the first solver-depth gap next", () => {
    const contract = buildLayerCombinationResolverCompanyInternalV0RehearsalContract();

    expect(contract).toMatchObject({
      landedGate: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousCoverageMatrix: {
        landedGate: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTION_STATUS
      },
      selectedNextAction: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_LABEL,
      selectionStatus: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTION_STATUS,
      sourceRowsAreEvidenceNotProduct: true
    });
    expect(contract.summary).toEqual({
      allowedExactRowCount: 2,
      allowedWithBudgetRowCount: 10,
      blockedActionCount: 4,
      blockedRowCount: 2,
      coverageMatrixRowCount: 15,
      companyInternalV0AllowedRowCount: 12,
      needsUserInputRowCount: 1,
      readinessBucketCount: {
        needs_input: 1,
        ready: 2,
        ready_with_budget: 10,
        research_only: 0,
        unsupported: 2
      },
      researchOnlyGapCount: 6,
      selectedGapId: "wall_floor_single_leaf_mass_law_banded_solver_owner",
      selectedNextAction: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("classifies every current coverage-matrix row into a company-internal V0 decision", () => {
    const rows = buildLayerCombinationResolverCompanyInternalV0RehearsalContract().operatingEnvelopeRows;

    expect(rows.map((row) => [row.candidateId, row.companyInternalUse])).toEqual([
      ["floor.exact_measured_floor_system.same_topology_metric_basis", "allowed_exact"],
      ["wall.exact_verified_airborne.same_leaf_schedule", "allowed_exact"],
      ["floor.open_box_timber.package_transfer_similarity", "allowed_with_budget"],
      ["floor.open_web.supported_band_similarity", "allowed_with_budget"],
      ["wall.multileaf_triple_leaf.calibrated_family_solver", "allowed_with_budget"],
      [LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID, "allowed_with_budget"],
      [LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID, "allowed_with_budget"],
      ["floor.open_box_timber.raw_bare_source_absent", "allowed_with_budget"],
      ["floor.open_web.raw_bare_source_absent", "allowed_with_budget"],
      ["floor.helper_only_timber_open_web.source_absent", "allowed_with_budget"],
      ["floor.open_web.direct_fixed_lining.source_absent", "allowed_with_budget"],
      ["floor.open_web.field_building_adapter.exact_anchor_continuation", "allowed_with_budget"],
      ["generic.required_input_owner.needs_input_boundary", "needs_user_input"],
      ["generic.lab_field_building_basis_boundary", "blocked"],
      ["generic.astm_iic_aiic.unsupported_boundary", "blocked"]
    ]);

    for (const row of rows) {
      expect(row.hasVisibleCandidateTrace, row.candidateId).toBe(true);
      expect(row.noRuntimeValueMovement, row.candidateId).toBe(true);
      expect(row.requiredUserFields.length, row.candidateId).toBeGreaterThan(0);
      expect(row.visibleReason, row.candidateId).toContain(row.candidateId);
    }
  });

  it("keeps exact, budgeted, needs-input, and blocked rows honest about basis and values", () => {
    expect(rowById("floor.exact_measured_floor_system.same_topology_metric_basis")).toMatchObject({
      budgetMetrics: [],
      companyInternalUse: "allowed_exact",
      readinessBucket: "ready",
      supportBucket: "exact",
      valuePins: []
    });
    expect(rowById("floor.open_box_timber.package_transfer_similarity")).toMatchObject({
      basis: "element_lab",
      budgetMetrics: expect.arrayContaining(["Rw", "Ln,w", "CI,50-2500"]),
      companyInternalUse: "allowed_with_budget",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 66 },
        { metric: "Ln,w", value: 50.8 }
      ])
    });
    expect(rowById("floor.open_web.field_building_adapter.exact_anchor_continuation")).toMatchObject({
      basis: "field_apparent",
      companyInternalUse: "allowed_with_budget",
      requiredUserFields: expect.arrayContaining([
        "impactFieldContext",
        "receivingRoomVolumeM3",
        "fieldKDb",
        "ownedLabAnchor"
      ]),
      supportedMetrics: expect.arrayContaining(["R'w", "DnT,w", "L'nT,w"])
    });
    expect(rowById(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "element_lab",
      budgetMetrics: expect.arrayContaining(["Rw", "STC"]),
      companyInternalUse: "allowed_with_budget",
      route: "wall",
      supportBucket: "source_absent_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 31 },
        { metric: "STC", value: 31 }
      ])
    });
    expect(rowById(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "element_lab",
      budgetMetrics: expect.arrayContaining(["Rw", "STC", "C", "Ctr"]),
      companyInternalUse: "allowed_with_budget",
      route: "wall",
      supportBucket: "source_absent_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 45 },
        { metric: "STC", value: 45 },
        { metric: "C", value: -1 },
        { metric: "Ctr", value: -6.1 }
      ])
    });
    expect(rowById("generic.required_input_owner.needs_input_boundary")).toMatchObject({
      companyInternalUse: "needs_user_input",
      readinessBucket: "needs_input",
      runtimeBasisId: null,
      valuePins: []
    });
    expect(rowById("generic.lab_field_building_basis_boundary")).toMatchObject({
      basis: "building_prediction",
      companyInternalUse: "blocked",
      supportBucket: "basis_boundary",
      valuePins: []
    });
    expect(rowById("generic.astm_iic_aiic.unsupported_boundary")).toMatchObject({
      basis: "astm_rating_boundary",
      companyInternalUse: "blocked",
      supportBucket: "unsupported",
      valuePins: []
    });
  });

  it("ranks research-only gaps without opening broad source crawl or aliases", () => {
    const contract = buildLayerCombinationResolverCompanyInternalV0RehearsalContract();
    const selected = contract.rankedResearchOnlyGaps.find((gap) => gap.selected);

    expect(selected).toMatchObject({
      basis: "element_lab",
      candidateId: "research_gap.wall_floor.single_leaf_mass_law_banded_solver_owner",
      currentReadinessBucket: "research_only",
      id: "wall_floor_single_leaf_mass_law_banded_solver_owner",
      rank: 1,
      route: "wall",
      selectedNextAction: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE
    });
    expect(selected?.requiredOwnerFields).toEqual([
      "route-specific single visible leaf topology",
      "material density and surface mass",
      "thickness and stiffness/coincidence family",
      "one-third-octave transmission-loss curve",
      "ISO 717-1 rating adapter",
      "exact-source precedence and holdout residual budget"
    ]);
    expect(contract.rankedResearchOnlyGaps.map((gap) => gap.id)).toEqual([
      "wall_floor_single_leaf_mass_law_banded_solver_owner",
      "double_leaf_framed_wall_banded_solver_owner",
      "floor_cover_delta_lw_dynamic_stiffness_owner",
      "field_building_prediction_flanking_owner",
      "astm_iic_aiic_rating_owner",
      "broad_source_crawl"
    ]);
    expect(contract.blockedNextActions).toEqual([
      expect.objectContaining({ id: "broad_source_crawl", selectedNow: false }),
      expect.objectContaining({ id: "field_building_runtime_promotion", selectedNow: false }),
      expect.objectContaining({ id: "astm_iic_aiic_alias_runtime", selectedNow: false }),
      expect.objectContaining({ id: "tolerance_retune_without_holdouts", selectedNow: false })
    ]);
  });

  it("keeps docs, exports, and current gate runner aligned with the V0 rehearsal", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE);
      expect(normalized, path).toContain(LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_LABEL);
      expect(normalized, path).toContain("company-internal v0");
      expect(normalized, path).toContain("ready");
      expect(normalized, path).toContain("ready_with_budget");
      expect(normalized, path).toContain("needs_input");
      expect(normalized, path).toContain("unsupported");
      expect(normalized, path).toContain("research-only");
      expect(normalized, path).toContain("single-leaf");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const index = readRepoFile("packages/engine/src/index.ts");

    expect(runner).toContain("layer-combination-resolver-company-internal-v0-rehearsal-contract.test.ts");
    expect(index).toContain('export * from "./layer-combination-resolver-company-internal-v0-rehearsal";');
  });
});

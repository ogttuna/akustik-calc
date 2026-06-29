import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor";
import { calculateAssembly } from "./calculate-assembly";
import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD } from "./dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated";
import {
  FLAT_LIST_MULTILEAF_GUARD_FIELD_SELECTED_CANDIDATE_ID,
  FLAT_LIST_MULTILEAF_GUARD_LAB_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-flat-list-multileaf-guard";
import {
  COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
  COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-company-internal-heavy-composite-wall";
import {
  GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
  GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-h-lined-masonry-clt";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS } from "./heavy-concrete-combined-impact-formula-corridor";
import { ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID } from "./impact-astm-e989";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import { EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS } from "./impact-exact";
import {
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTION_STATUS,
  buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract
} from "./layer-combination-resolver-candidate-coverage-matrix-refresh";
import {
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS
} from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import {
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID
} from "./post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner";
import {
  LIGHTWEIGHT_CONCRETE_DELTA_LW_SELECTED_CANDIDATE_ID
} from "./lightweight-concrete-delta-lw-runtime-corridor";
import { LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID } from "./lightweight-concrete-family-runtime-constants";
import { MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID } from "./mixed-support-floor-impact-runtime-corridor";
import { HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS } from "./heavy-concrete-published-upper-treatment-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";
import { POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID } from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const R5B_EXACT_PACKAGE = [
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

const DRY_GYPSUM_FIBER_SOURCE_ABSENT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 32 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 45 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const SUPPORTED_BAND_PACKAGE = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh.ts",
  "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh-contract.test.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts",
  "packages/engine/src/layer-combination-resolver-registry.ts",
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
  const row = buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract().coverageMatrixRows.find(
    (entry) => entry.candidateId === id
  );
  if (!row) {
    throw new Error(`Missing coverage matrix row ${id}.`);
  }
  return row;
}

function buildNrcTripleLeafCase(): { context: AirborneContext; layers: readonly LayerInput[] } {
  const board = { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 } satisfies LayerInput;
  const batt = { materialId: "nrc_glass_fiber_batt", thicknessMm: 92.1 } satisfies LayerInput;

  return {
    context: {
      contextMode: "element_lab",
      wallTopology: {
        cavity1AbsorptionClass: "porous_absorptive",
        cavity1DepthMm: 92.1,
        cavity1FillCoverage: "full",
        cavity1LayerIndices: [1],
        cavity2AbsorptionClass: "porous_absorptive",
        cavity2DepthMm: 92.1,
        cavity2FillCoverage: "full",
        cavity2LayerIndices: [3],
        internalLeafCoupling: "independent",
        internalLeafLayerIndices: [2],
        sideALeafLayerIndices: [0],
        sideBLeafLayerIndices: [4],
        supportTopology: "independent_frames",
        topologyMode: "grouped_triple_leaf"
      }
    },
    layers: [board, batt, board, batt, board]
  };
}

describe("layer combination resolver candidate coverage matrix refresh contract", () => {
  it("lands the no-runtime coverage matrix and selects company-internal V0 rehearsal next", () => {
    const contract = buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract();

    expect(contract).toMatchObject({
      landedGate: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousSurfaceParity: {
        landedGate: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS
      },
      selectedNextAction: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTION_STATUS,
      sourceRowsAreEvidenceNotProduct: true
    });
    expect(contract.summary).toEqual({
      activeRuntimeCandidateCount: 53,
      allCandidateDeclarationsCovered: true,
      boundaryCandidateCount: 3,
      candidateDeclarationCount: 56,
      coverageMatrixRowCount: 56,
      readinessBucketCount: {
        needs_input: 1,
        ready: 4,
        ready_with_budget: 49,
        research_only: 0,
        unsupported: 2
      },
      selectedNextAction: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      surfaceRowCount: 56
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("covers every resolver order kind with candidate ids, hostile cases, and visible surfaces", () => {
    const contract = buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract();

    expect(contract.kindCoverage).toEqual([
      {
        candidateIds: [
          "floor.exact_measured_floor_system.same_topology_metric_basis",
          "wall.exact_verified_airborne.same_leaf_schedule",
          "floor.exact_impact_band_source.metric_basis",
          ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID
        ],
        kind: "exact_measured_override",
        resolverOrderRank: 0
      },
      {
        candidateIds: [
          "wall.compatible_anchor_delta.extra_board_on_verified_lsf",
          "project_user_measured_wall_airborne_frequency_compatible_delta_owner",
          "floor.tuas_c11c.visible_iso_weighted_impact_tuple_guarded",
          "floor.open_box_timber.package_transfer_similarity",
          "floor.open_web.supported_band_similarity",
          "floor.heavy_concrete_floating.published_upper_treatment_anchor_owned"
        ],
        kind: "similarity_anchor",
        resolverOrderRank: 1
      },
      {
        candidateIds: ["wall.multileaf_triple_leaf.calibrated_family_solver"],
        kind: "calibrated_family_solver",
        resolverOrderRank: 2
      },
      {
        candidateIds: [
          MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID,
          POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
          "candidate_lsf_exact_rw_calculated_lab_companions",
          BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID,
          BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
          "candidate_post_v1_wall_multileaf_generalized_source_absent_family_solver",
          LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
          "ceiling.single_leaf_airborne_mass_law.source_absent",
          POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID,
          LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
          GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID,
          COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID,
          FLAT_LIST_MULTILEAF_GUARD_LAB_SELECTED_CANDIDATE_ID,
          "floor.screening_airborne.source_absent",
          "floor.open_box_timber.raw_bare_source_absent",
          "floor.open_web.raw_bare_source_absent",
          "floor.helper_only_timber_open_web.source_absent",
          "floor.open_web.direct_fixed_lining.source_absent",
          "floor.composite_panel.published_interaction_family_solver",
          "candidate_gate_ae_flat_multicavity_family_physics_prediction",
          LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID,
          LIGHTWEIGHT_CONCRETE_DELTA_LW_SELECTED_CANDIDATE_ID,
          "floor.lightweight_steel.upper_lower_mass_spring.source_absent",
          "floor.lightweight_steel.suspended_ceiling_only.source_absent",
          "floor.timber_joist.delta_lw_formula",
          "floor.mass_timber_clt.delta_lw_formula",
          "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
          "floor.heavy_concrete_floating_floor.lab_impact_formula"
        ],
        kind: "source_absent_family_solver",
        resolverOrderRank: 3
      },
      {
        candidateIds: [
          BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
          "ceiling.single_leaf_airborne_field_context_adapter",
          "ceiling.single_leaf_airborne_building_prediction_adapter",
          "ceiling.multileaf_airborne_plenum_field_context_adapter",
          "ceiling.multileaf_airborne_plenum_building_prediction_adapter",
          FLAT_LIST_MULTILEAF_GUARD_FIELD_SELECTED_CANDIDATE_ID,
          "floor.impact_field_context.field_building_adapter",
          "candidate_company_internal_opening_leak_building_family_physics_prediction",
          "candidate_company_internal_opening_leak_field_family_physics_prediction",
          "candidate_company_internal_opening_leak_a_weighted_family_physics_prediction",
          "floor.raw_bare_floor_airborne.building_prediction_adapter",
          "floor.open_box_timber_finished_package.airborne_building_prediction_adapter",
          "wall.airborne_field_context.field_apparent_adapter",
          "candidate_airborne_building_prediction_all_owner_family_physics_prediction"
        ],
        kind: "field_building_adapter",
        resolverOrderRank: 4
      },
      {
        candidateIds: ["generic.required_input_owner.needs_input_boundary"],
        kind: "needs_input_boundary",
        resolverOrderRank: 5
      },
      {
        candidateIds: ["generic.lab_field_building_basis_boundary"],
        kind: "basis_boundary",
        resolverOrderRank: 6
      },
      {
        candidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
        kind: "unsupported_boundary",
        resolverOrderRank: 7
      }
    ]);

    for (const row of contract.coverageMatrixRows) {
      expect(row.hasVisibleCandidateTrace, row.candidateId).toBe(true);
      expect(row.noRuntimeValueMovement, row.candidateId).toBe(true);
      expect(row.hardCompatibilityGates.length, row.candidateId).toBeGreaterThan(0);
      expect(row.hostileInputCases.length, row.candidateId).toBeGreaterThan(0);
      expect(row.surfaceTargets, row.candidateId).toEqual([
        "candidate_trace",
        "output_cards",
        "route_posture",
        "confidence_provenance",
        "metric_basis_rows",
        "method_dossier",
        "local_saved_replay",
        "server_snapshot_replay",
        "calculator_api_payload",
        "impact_only_api_payload",
        "markdown_report"
      ]);
    }
  });

  it("keeps representative exact, anchor, solver, source-absent, field, and boundary rows frozen", () => {
    expect(rowById("floor.exact_measured_floor_system.same_topology_metric_basis")).toMatchObject({
      candidateKind: "exact_measured_override",
      readinessBucket: "ready",
      supportBucket: "exact"
    });
    expect(rowById("floor.exact_impact_band_source.metric_basis")).toMatchObject({
      candidateKind: "exact_measured_override",
      readinessBucket: "ready",
      runtimeBasisId: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
      supportBucket: "exact",
      supportedMetrics: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "DeltaLw", "L'nT,w", "L'nT,50", "LnT,A"]
    });
    expect(rowById("wall.exact_verified_airborne.same_leaf_schedule")).toMatchObject({
      candidateKind: "exact_measured_override",
      readinessBucket: "ready",
      supportBucket: "exact"
    });
    expect(rowById("floor.open_box_timber.package_transfer_similarity")).toMatchObject({
      candidateKind: "similarity_anchor",
      readinessBucket: "ready_with_budget",
      supportBucket: "anchored_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 66 },
        { metric: "Ln,w", value: 50.8 }
      ])
    });
    expect(rowById("wall.multileaf_triple_leaf.calibrated_family_solver")).toMatchObject({
      candidateKind: "calibrated_family_solver",
      readinessBucket: "ready_with_budget",
      route: "wall",
      supportBucket: "calibrated_estimate"
    });
    expect(rowById(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      readinessBucket: "ready_with_budget",
      route: "wall",
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 50 }]
    });
    expect(rowById(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      readinessBucket: "ready_with_budget",
      route: "wall",
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"]
    });
    expect(rowById(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      readinessBucket: "ready_with_budget",
      route: "wall",
      supportBucket: "source_absent_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 31 },
        { metric: "STC", value: 31 }
      ])
    });
    expect(rowById(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      readinessBucket: "ready_with_budget",
      route: "wall",
      supportBucket: "source_absent_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 45 },
        { metric: "STC", value: 45 }
      ])
    });
    expect(rowById(GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      readinessBucket: "ready_with_budget",
      route: "wall",
      runtimeBasisId: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 57 },
        { metric: "STC", value: 57 }
      ])
    });
    expect(rowById(COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      readinessBucket: "ready_with_budget",
      route: "wall",
      runtimeBasisId: COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 63 },
        { metric: "STC", value: 63 }
      ])
    });
    expect(rowById("floor.open_web.raw_bare_source_absent")).toMatchObject({
      candidateKind: "source_absent_family_solver",
      readinessBucket: "ready_with_budget",
      supportBucket: "source_absent_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 32 },
        { metric: "Ln,w", value: 96 }
      ])
    });
    expect(rowById("floor.heavy_concrete_floating_floor.lab_impact_formula")).toMatchObject({
      candidateKind: "source_absent_family_solver",
      readinessBucket: "ready_with_budget",
      runtimeBasisId: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });
    expect(rowById("floor.heavy_concrete_floating.published_upper_treatment_anchor_owned")).toMatchObject({
      candidateKind: "similarity_anchor",
      readinessBucket: "ready_with_budget",
      runtimeBasisId: HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS,
      supportBucket: "anchored_estimate",
      supportedMetrics: ["Ln,w"],
      valuePins: [{ metric: "Ln,w", value: 50 }]
    });
    expect(rowById("floor.heavy_concrete_combined_upper_lower.lab_impact_formula")).toMatchObject({
      candidateKind: "source_absent_family_solver",
      readinessBucket: "ready_with_budget",
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });
    expect(rowById(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "field_apparent",
      candidateKind: "field_building_adapter",
      readinessBucket: "ready_with_budget",
      route: "wall",
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "DnT,w"]
    });
    expect(rowById("floor.impact_field_context.field_building_adapter")).toMatchObject({
      basis: "field_apparent",
      candidateKind: "field_building_adapter",
      readinessBucket: "ready_with_budget",
      supportBucket: "field_adapter"
    });
    expect(rowById("wall.airborne_field_context.field_apparent_adapter")).toMatchObject({
      basis: "field_apparent",
      candidateKind: "field_building_adapter",
      readinessBucket: "ready_with_budget",
      route: "wall",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "DnT,A,k"]
    });
    expect(rowById("generic.required_input_owner.needs_input_boundary")).toMatchObject({
      readinessBucket: "needs_input",
      runtimeBasisId: null,
      supportBucket: "needs_input",
      valuePins: []
    });
    expect(rowById("generic.lab_field_building_basis_boundary")).toMatchObject({
      readinessBucket: "unsupported",
      runtimeBasisId: null,
      supportBucket: "basis_boundary",
      valuePins: []
    });
    expect(rowById("generic.astm_iic_aiic.unsupported_boundary")).toMatchObject({
      readinessBucket: "unsupported",
      runtimeBasisId: null,
      supportBucket: "unsupported",
      valuePins: []
    });
  });

  it("proves live representative traces still resolve through the covered candidate matrix", () => {
    const exact = calculateAssembly(R5B_EXACT_PACKAGE, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const packageTransfer = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const rawOpenWeb = calculateAssembly(RAW_OPEN_WEB_300, { calculator: "dynamic", targetOutputs: [...LAB_OUTPUTS, "IIC"] });
    const field = calculateAssembly(SUPPORTED_BAND_PACKAGE, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const tripleLeaf = buildNrcTripleLeafCase();
    const calibratedWall = calculateAssembly(tripleLeaf.layers, {
      airborneContext: tripleLeaf.context,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(exact.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "floor.exact_measured_floor_system.same_topology_metric_basis",
      supportBucket: "exact"
    });
    expect(exact.impact).toMatchObject({ CI50_2500: 3, LnW: 44, basis: "open_measured_floor_system_exact_match" });
    expect(exact.floorSystemRatings).toMatchObject({ Rw: 75, basis: "open_measured_floor_system_exact_match" });

    expect(packageTransfer.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      selectedCandidateId: "floor.open_box_timber.package_transfer_similarity"
    });
    expect(packageTransfer.impact).toMatchObject({ CI50_2500: 3.3, LnW: 50.8, basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS });

    expect(rawOpenWeb.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      runtimeBasisId: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
      selectedCandidateId: "floor.open_web.raw_bare_source_absent"
    });
    expect(rawOpenWeb.impact).toMatchObject({ CI50_2500: 5.2, LnW: 96, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(rawOpenWeb.unsupportedTargetOutputs).toContain("IIC");

    expect(field.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      requestedBasis: "field_apparent",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportBucket: "field_adapter"
    });
    expect(field.metrics).toMatchObject({ estimatedDnTwDb: 48, estimatedRwPrimeDb: 45 });
    expect(field.impact).toMatchObject({ LPrimeNT50: 60, LPrimeNTw: 61.1, LPrimeNW: 63.5 });

    expect(calibratedWall.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
      selectedCandidateId: "wall.multileaf_triple_leaf.calibrated_family_solver",
      supportBucket: "calibrated_estimate"
    });
    expect(calibratedWall.metrics).toMatchObject({
      estimatedCDb: 1.4,
      estimatedCtrDb: -7.4,
      estimatedRwDb: 49,
      estimatedStc: 60
    });
  });

  it("keeps docs, exports, and current gate runner aligned with the coverage matrix refresh", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_FILE);
      expect(normalized, path).toContain(LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_LABEL);
      expect(normalized, path).toContain("candidate coverage matrix");
      expect(normalized, path).toContain("exact");
      expect(normalized, path).toContain("similarity");
      expect(normalized, path).toContain("calibrated");
      expect(normalized, path).toContain("source-absent");
      expect(normalized, path).toContain("needs_input");
      expect(normalized, path).toContain("unsupported");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const index = readRepoFile("packages/engine/src/index.ts");

    expect(runner).toContain("layer-combination-resolver-candidate-coverage-matrix-refresh-contract.test.ts");
    expect(index).toContain('export * from "./layer-combination-resolver-candidate-coverage-matrix-refresh";');
  });
});

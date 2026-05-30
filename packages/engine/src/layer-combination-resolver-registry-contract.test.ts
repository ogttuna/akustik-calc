import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor";
import { calculateAssembly } from "./calculate-assembly";
import {
  FLAT_LIST_MULTILEAF_GUARD_FIELD_RUNTIME_METHOD,
  FLAT_LIST_MULTILEAF_GUARD_FIELD_SELECTED_CANDIDATE_ID,
  FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD,
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
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB
} from "./heavy-concrete-combined-impact-formula-corridor";
import {
  ASTM_E989_IMPACT_RATING_BASIS,
  ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID
} from "./impact-astm-e989";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import { EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS } from "./impact-exact";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import {
  LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
  LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID
} from "./lightweight-concrete-family-runtime-constants";
import {
  buildLayerCombinationResolverRegistryContract,
  LAYER_COMBINATION_RESOLVER_REGISTRY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTION_STATUS
} from "./layer-combination-resolver-registry";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const TARGET_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "R'w",
  "DnT,w",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const HELPER_ONLY_OPEN_WEB = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_BOX_TIMBER = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
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

const SUPPORTED_BAND_PACKAGE = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-registry.ts",
  "packages/engine/src/layer-combination-resolver-registry-contract.test.ts",
  "packages/engine/src/broad-accuracy-post-helper-only-timber-open-web-impact-stack-coverage-revalidation-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh.ts",
  "packages/engine/src/helper-only-timber-open-web-impact-stack-estimate.ts",
  "packages/engine/src/open-box-timber-similarity-estimate.ts",
  "packages/engine/src/open-box-timber-raw-bare-estimate.ts",
  "packages/engine/src/open-web-raw-bare-estimate.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
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
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("layer combination resolver registry contract", () => {
  it("lands the no-runtime resolver registry and selects the runtime candidate adapter", () => {
    const contract = buildLayerCombinationResolverRegistryContract();

    expect(contract).toMatchObject({
      landedGate: "layer_combination_resolver_registry_plan",
      noRuntimeValueMovement: true,
      previousPostHelperOnlyRevalidation: {
        landedGate: "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan",
        selectedNextAction: "layer_combination_resolver_registry_plan",
        selectedNextFile: "packages/engine/src/layer-combination-resolver-registry-contract.test.ts",
        selectionStatus:
          "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_landed_no_runtime_selected_layer_combination_resolver_registry"
      },
      registryVersion: "2026-05-21.layer-combination-resolver.v1",
      selectedNextAction: "layer_combination_resolver_runtime_candidate_adapter_plan",
      selectedNextFile: "packages/engine/src/layer-combination-resolver-runtime-candidate-adapter-contract.test.ts",
      selectedNextLabel: "layer combination resolver runtime candidate adapter",
      selectionStatus: "layer_combination_resolver_registry_landed_no_runtime_selected_runtime_candidate_adapter",
      sourceRowsAreEvidenceNotProduct: true
    });
    expect(contract.summary).toEqual({
      activeRuntimeCandidateCount: 36,
      basisCount: {
        astm_rating_boundary: 2,
        building_prediction: 2,
        element_lab: 31,
        field_apparent: 4
      },
      candidateCount: 39,
      kindCount: {
        basis_boundary: 1,
        calibrated_family_solver: 1,
        exact_measured_override: 4,
        field_building_adapter: 5,
        needs_input_boundary: 1,
        similarity_anchor: 4,
        source_absent_family_solver: 22,
        unsupported_boundary: 1
      },
      routeCount: {
        floor: 23,
        wall: 16
      },
      selectedNextAction: LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("declares the global resolver order and required candidate fields", () => {
    const contract = buildLayerCombinationResolverRegistryContract();

    expect(contract.resolverOrder.map((entry) => [entry.kind, entry.rank])).toEqual([
      ["exact_measured_override", 0],
      ["similarity_anchor", 1],
      ["calibrated_family_solver", 2],
      ["source_absent_family_solver", 3],
      ["field_building_adapter", 4],
      ["needs_input_boundary", 5],
      ["basis_boundary", 6],
      ["unsupported_boundary", 7]
    ]);

    for (const candidate of contract.candidateDeclarations) {
      expect(candidate.id.length, candidate.id).toBeGreaterThan(10);
      expect(candidate.label.length, candidate.id).toBeGreaterThan(10);
      expect(candidate.requiredInputs.length, candidate.id).toBeGreaterThan(0);
      expect(candidate.hardCompatibilityGates.length, candidate.id).toBeGreaterThan(0);
      expect(candidate.exactPrecedenceRules.length, candidate.id).toBeGreaterThan(0);
      expect(candidate.similarityAnchorRules.length, candidate.id).toBeGreaterThan(0);
      expect(candidate.surfaceRequirements.length, candidate.id).toBeGreaterThan(0);
      expect(candidate.hostileInputCases.length, candidate.id).toBeGreaterThan(0);
      expect(candidate.rejectedMetricAliases, candidate.id).toEqual(
        expect.arrayContaining(["lab_to_field_alias", "iso_to_astm_iic_alias", "rw_to_stc_alias", "lnw_to_iic_alias"])
      );

      if (
        candidate.kind === "calibrated_family_solver" ||
        candidate.kind === "field_building_adapter" ||
        candidate.kind === "similarity_anchor" ||
        candidate.kind === "source_absent_family_solver"
      ) {
        expect(candidate.formulaTerms.length, candidate.id).toBeGreaterThan(0);
      }

      if (candidate.kind === "source_absent_family_solver") {
        expect(candidate.errorBudgetTerms.some((term) => term.notMeasuredEvidence), candidate.id).toBe(true);
      }

      if (candidate.kind === "needs_input_boundary" || candidate.kind === "unsupported_boundary") {
        expect(candidate.valuePins, candidate.id).toHaveLength(0);
        expect(candidate.runtimeSelectionState, candidate.id).toBe("blocked_boundary_existing");
      }
    }
  });

  it("maps existing lanes into distinct candidate declarations without merging bases", () => {
    const contract = buildLayerCombinationResolverRegistryContract();
    const byId = new Map(contract.candidateDeclarations.map((candidate) => [candidate.id, candidate]));

    expect(byId.get("floor.exact_measured_floor_system.same_topology_metric_basis")).toMatchObject({
      kind: "exact_measured_override",
      ownedRuntimeBasisId: "open_measured_floor_system_exact_match",
      priorityRank: 0
    });
    expect(byId.get("floor.exact_impact_band_source.metric_basis")).toMatchObject({
      kind: "exact_measured_override",
      ownedRuntimeBasisId: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
      priorityRank: 0,
      supportedMetrics: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "DeltaLw", "L'nT,w", "L'nT,50", "LnT,A"]
    });
    expect(byId.get("floor.open_box_timber.package_transfer_similarity")).toMatchObject({
      kind: "similarity_anchor",
      ownedRuntimeBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      priorityRank: 1
    });
    expect(byId.get("floor.open_box_timber.raw_bare_source_absent")).toMatchObject({
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      priorityRank: 3
    });
    expect(byId.get("floor.open_web.raw_bare_source_absent")).toMatchObject({
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
      priorityRank: 3
    });
    expect(byId.get("floor.helper_only_timber_open_web.source_absent")).toMatchObject({
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
      priorityRank: 3
    });
    expect(byId.get("floor.lightweight_steel.upper_lower_mass_spring.source_absent")).toMatchObject({
      basis: "element_lab",
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: STEEL_FLOOR_FORMULA_BASIS,
      priorityRank: 3,
      route: "floor",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });
    expect(byId.get("floor.lightweight_steel.suspended_ceiling_only.source_absent")).toMatchObject({
      basis: "element_lab",
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      priorityRank: 3,
      route: "floor",
      supportedMetrics: ["Ln,w"]
    });
    expect(byId.get("floor.heavy_concrete_combined_upper_lower.lab_impact_formula")).toMatchObject({
      basis: "element_lab",
      errorBudgetTerms: [
        {
          metric: "Ln,w",
          notMeasuredEvidence: true,
          toleranceDb: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB
        },
        {
          metric: "DeltaLw",
          notMeasuredEvidence: true,
          toleranceDb: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB
        }
      ],
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      priorityRank: 3,
      route: "floor",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });
    expect(byId.get("floor.heavy_concrete_floating_floor.lab_impact_formula")).toMatchObject({
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
      priorityRank: 3,
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });
    expect(byId.get(LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "element_lab",
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
      priorityRank: 3,
      route: "floor",
      supportedMetrics: ["Rw", "Ln,w"]
    });
    expect(byId.get(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "element_lab",
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
      priorityRank: 3,
      route: "wall",
      supportedMetrics: ["Rw"]
    });
    expect(byId.get(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "element_lab",
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      priorityRank: 3,
      route: "wall",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"]
    });
    expect(byId.get("candidate_post_v1_wall_multileaf_generalized_source_absent_family_solver")).toMatchObject({
      basis: "element_lab",
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: "triple_leaf_two_cavity_frequency_solver",
      priorityRank: 3,
      route: "wall",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"]
    });
    expect(byId.get(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID)).toMatchObject({
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      priorityRank: 3,
      route: "wall",
      supportedMetrics: ["Rw", "C", "Ctr", "STC"]
    });
    expect(byId.get(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID)).toMatchObject({
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      priorityRank: 3,
      route: "wall",
      supportedMetrics: ["Rw", "C", "Ctr", "STC"]
    });
    expect(byId.get(GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "element_lab",
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
      priorityRank: 3,
      route: "wall",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 57 },
        { metric: "STC", value: 57 }
      ])
    });
    expect(byId.get(COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "element_lab",
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
      priorityRank: 3,
      route: "wall",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 63 },
        { metric: "STC", value: 63 }
      ])
    });
    expect(byId.get(FLAT_LIST_MULTILEAF_GUARD_LAB_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "element_lab",
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD,
      priorityRank: 3,
      route: "wall",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"]
    });
    expect(byId.get("floor.impact_field_context.field_building_adapter")).toMatchObject({
      basis: "field_apparent",
      kind: "field_building_adapter",
      priorityRank: 4
    });
    expect(byId.get("wall.airborne_field_context.field_apparent_adapter")).toMatchObject({
      basis: "field_apparent",
      kind: "field_building_adapter",
      ownedRuntimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      priorityRank: 4,
      route: "wall",
      supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "DnT,A,k"]
    });
    expect(byId.get(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "field_apparent",
      kind: "field_building_adapter",
      ownedRuntimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
      priorityRank: 4,
      route: "wall",
      supportedMetrics: ["R'w", "DnT,w"]
    });
    expect(byId.get(FLAT_LIST_MULTILEAF_GUARD_FIELD_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "field_apparent",
      kind: "field_building_adapter",
      ownedRuntimeBasisId: FLAT_LIST_MULTILEAF_GUARD_FIELD_RUNTIME_METHOD,
      priorityRank: 4,
      route: "wall",
      supportedMetrics: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"]
    });
    expect(byId.get(GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "building_prediction",
      kind: "field_building_adapter",
      ownedRuntimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      priorityRank: 4,
      route: "wall",
      supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    });
    expect(byId.get("generic.lab_field_building_basis_boundary")).toMatchObject({
      basis: "building_prediction",
      kind: "basis_boundary",
      runtimeSelectionState: "blocked_boundary_existing"
    });
    expect(byId.get(ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "astm_rating_boundary",
      kind: "exact_measured_override",
      ownedRuntimeBasisId: ASTM_E989_IMPACT_RATING_BASIS,
      route: "floor",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: ["IIC", "AIIC"]
    });
    expect(byId.get("generic.astm_iic_aiic.unsupported_boundary")).toMatchObject({
      basis: "astm_rating_boundary",
      kind: "unsupported_boundary",
      supportedMetrics: []
    });
  });

  it("keeps current runtime values frozen while the registry is declaration-only", () => {
    const exact = calculateAssembly(R5B_EXACT_PACKAGE, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const packageTransfer = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const rawOpenBox = calculateAssembly(RAW_OPEN_BOX_TIMBER, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const rawOpenWeb = calculateAssembly(RAW_OPEN_WEB_300, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const helperOnly = calculateAssembly(HELPER_ONLY_OPEN_WEB, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const supportedBand = calculateAssembly(SUPPORTED_BAND_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });

    expect(exact.impact).toMatchObject({ CI: 0, CI50_2500: 3, LnW: 44, basis: "open_measured_floor_system_exact_match" });
    expect(exact.floorSystemRatings).toMatchObject({ Rw: 75, basis: "open_measured_floor_system_exact_match" });
    expect(packageTransfer.impact).toMatchObject({ CI50_2500: 3.3, LnW: 50.8, basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS });
    expect(packageTransfer.floorSystemRatings).toMatchObject({ Rw: 66, basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS });
    expect(rawOpenBox.impact).toMatchObject({ CI50_2500: 3.1, LnW: 88.2, basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS });
    expect(rawOpenWeb.impact).toMatchObject({ CI50_2500: 5.2, LnW: 96, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(helperOnly.impact).toMatchObject({ CI50_2500: 4, LnW: 59.6, basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS });
    expect(helperOnly.floorSystemRatings).toMatchObject({ Rw: 46.7, basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS });
    expect(supportedBand.impact).toMatchObject({ CI: -1.5, LnW: 61.5, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });
    expect(supportedBand.floorSystemRatings).toMatchObject({ Rw: 61.5, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });

    for (const result of [helperOnly, supportedBand]) {
      expect(result.unsupportedTargetOutputs).toEqual(expect.arrayContaining(["IIC", "AIIC"]));
    }
  });

  it("keeps blocked next actions behind the runtime candidate adapter", () => {
    const contract = buildLayerCombinationResolverRegistryContract();

    expect(contract.selectedNextAction).toBe(LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION);
    expect(contract.blockedNextActions.map((action) => action.id)).toEqual([
      "new_narrow_family_lane",
      "broad_source_crawl",
      "building_prediction_runtime",
      "astm_iic_aiic_alias_runtime",
      "tolerance_retune"
    ]);
    expect(contract.blockedNextActions.every((action) => action.selectedNow === false)).toBe(true);
    expect(contract.blockedNextActions.map((action) => action.reason).join(" ")).toContain("not a replacement");
  });

  it("keeps docs and current-gate runner aligned with the registry", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_REGISTRY_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_FILE);
      expect(normalized, path).toContain(LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_LABEL);
      expect(normalized, path).toContain("candidate declaration");
      expect(normalized, path).toContain("exact measured");
      expect(normalized, path).toContain("similarity anchor");
      expect(normalized, path).toContain("calibrated family solver");
      expect(normalized, path).toContain("source-absent family solver");
      expect(normalized, path).toContain("needs_input");
      expect(normalized, path).toContain("unsupported");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const index = readRepoFile("packages/engine/src/index.ts");

    expect(runner).toContain("layer-combination-resolver-registry-contract.test.ts");
    expect(index).toContain('export * from "./layer-combination-resolver-registry";');
  });
});

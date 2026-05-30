import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
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
import { calculateImpactOnly } from "./calculate-impact-only";
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
import { HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS } from "./heavy-concrete-combined-impact-formula-corridor";
import {
  ASTM_E989_IMPACT_RATING_BASIS,
  ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID
} from "./impact-astm-e989";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import { EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS } from "./impact-exact";
import {
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTION_STATUS
} from "./layer-combination-resolver-runtime-candidate-adapter";
import {
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS,
  buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract
} from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
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
  "IIC"
] as const satisfies readonly RequestedOutputId[];
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

const RAW_OPEN_BOX_TIMBER = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_WEB = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_PACKAGE = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const SUPPORTED_BAND_PACKAGE = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const LOCAL_SUBSTITUTION_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const LOCAL_SUBSTITUTION_LAB_CONTEXT = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
} as const satisfies AirborneContext;

const LOCAL_SUBSTITUTION_FIELD_CONTEXT = {
  ...LOCAL_SUBSTITUTION_LAB_CONTEXT,
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
} as const satisfies AirborneContext;

const REQUIRED_SURFACES = [
  "packages/shared/src/domain/layer-combination-resolver.ts",
  "packages/shared/src/domain/assembly.ts",
  "packages/shared/src/domain/impact-only.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity-contract.test.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/calculate-impact-only.ts",
  "packages/engine/src/index.ts",
  "apps/web/features/workbench/layer-combination-resolver-candidate-surface.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
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

describe("layer combination resolver runtime candidate surface parity contract", () => {
  it("lands surface parity and selects candidate coverage matrix refresh next", () => {
    const contract = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();

    expect(contract).toMatchObject({
      landedGate: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousAdapter: {
        landedGate: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTION_STATUS
      },
      selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS
    });
    expect(contract.surfaceTargets).toEqual([
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
    expect(contract.summary).toEqual({
      boundarySurfaceRowCount: 3,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      surfaceRowCount: 39
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("turns every adapter row into a stable visible candidate trace", () => {
    const contract = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const rowsById = new Map(contract.surfaceRows.map((row) => [row.selectedCandidateId, row]));

    expect(rowsById.get("floor.exact_measured_floor_system.same_topology_metric_basis")).toMatchObject({
      candidateKind: "exact_measured_override",
      supportBucket: "exact",
      surfaceLabel: "Exact measured resolver candidate"
    });
    expect(rowsById.get("floor.exact_impact_band_source.metric_basis")).toMatchObject({
      candidateKind: "exact_measured_override",
      runtimeBasisId: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
      supportBucket: "exact",
      supportedMetrics: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "DeltaLw", "L'nT,w", "L'nT,50", "LnT,A"]
    });
    expect(rowsById.get(ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID)).toMatchObject({
      basis: "astm_rating_boundary",
      candidateKind: "exact_measured_override",
      runtimeBasisId: ASTM_E989_IMPACT_RATING_BASIS,
      supportBucket: "exact",
      supportedMetrics: ["IIC", "AIIC"]
    });
    expect(rowsById.get("floor.open_box_timber.package_transfer_similarity")).toMatchObject({
      candidateKind: "similarity_anchor",
      supportBucket: "anchored_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Ln,w", value: 50.8 },
        { metric: "Rw", value: 66 }
      ])
    });
    expect(rowsById.get("floor.open_box_timber.raw_bare_source_absent")).toMatchObject({
      candidateKind: "source_absent_family_solver",
      supportBucket: "source_absent_estimate"
    });
    expect(rowsById.get("floor.open_web.raw_bare_source_absent")).toMatchObject({
      candidateKind: "source_absent_family_solver",
      supportBucket: "source_absent_estimate"
    });
    expect(rowsById.get("floor.helper_only_timber_open_web.source_absent")).toMatchObject({
      candidateKind: "source_absent_family_solver",
      supportBucket: "source_absent_estimate"
    });
    expect(rowsById.get("floor.open_web.direct_fixed_lining.source_absent")).toMatchObject({
      candidateKind: "source_absent_family_solver",
      supportBucket: "source_absent_estimate"
    });
    expect(rowsById.get("floor.lightweight_steel.upper_lower_mass_spring.source_absent")).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: STEEL_FLOOR_FORMULA_BASIS,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });
    expect(rowsById.get("floor.lightweight_steel.suspended_ceiling_only.source_absent")).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w"]
    });
    expect(rowsById.get("floor.heavy_concrete_combined_upper_lower.lab_impact_formula")).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });
    expect(rowsById.get("floor.heavy_concrete_floating_floor.lab_impact_formula")).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });
    expect(rowsById.get(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
      route: "wall",
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 50 }]
    });
    expect(rowsById.get(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      route: "wall",
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 50 },
        { metric: "STC", value: 61 },
        { metric: "C", value: 1.6 },
        { metric: "Ctr", value: -7.2 }
      ])
    });
    expect(rowsById.get(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      supportBucket: "source_absent_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 31 },
        { metric: "STC", value: 31 }
      ])
    });
    expect(rowsById.get(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      supportBucket: "source_absent_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 45 },
        { metric: "STC", value: 45 }
      ])
    });
    expect(rowsById.get(GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
      route: "wall",
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 57 },
        { metric: "STC", value: 57 }
      ])
    });
    expect(rowsById.get(COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
      route: "wall",
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 63 },
        { metric: "STC", value: 63 }
      ])
    });
    expect(rowsById.get(FLAT_LIST_MULTILEAF_GUARD_LAB_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD,
      route: "wall",
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 51 },
        { metric: "STC", value: 51 }
      ])
    });
    expect(rowsById.get("floor.open_web.supported_band_similarity")).toMatchObject({
      candidateKind: "similarity_anchor",
      supportBucket: "anchored_estimate"
    });
    expect(rowsById.get("floor.impact_field_context.field_building_adapter")).toMatchObject({
      candidateKind: "field_building_adapter",
      supportBucket: "field_adapter"
    });
    expect(rowsById.get("wall.airborne_field_context.field_apparent_adapter")).toMatchObject({
      candidateKind: "field_building_adapter",
      requestedBasis: "field_apparent",
      route: "wall",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "DnT,A,k"]
    });
    expect(rowsById.get(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "field_building_adapter",
      requestedBasis: "field_apparent",
      route: "wall",
      runtimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "DnT,w"],
      valuePins: []
    });
    expect(rowsById.get(FLAT_LIST_MULTILEAF_GUARD_FIELD_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "field_building_adapter",
      requestedBasis: "field_apparent",
      route: "wall",
      runtimeBasisId: FLAT_LIST_MULTILEAF_GUARD_FIELD_RUNTIME_METHOD,
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"],
      valuePins: []
    });
    expect(rowsById.get(GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID)).toMatchObject({
      boundaryCandidateIds: [],
      candidateKind: "field_building_adapter",
      requestedBasis: "building_prediction",
      route: "wall",
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      valuePins: []
    });
    expect(rowsById.get("generic.required_input_owner.needs_input_boundary")).toMatchObject({
      candidateKind: "needs_input_boundary",
      supportBucket: "needs_input"
    });
    expect(rowsById.get("generic.lab_field_building_basis_boundary")).toMatchObject({
      candidateKind: "basis_boundary",
      supportBucket: "basis_boundary"
    });
    expect(rowsById.get("generic.astm_iic_aiic.unsupported_boundary")).toMatchObject({
      candidateKind: "unsupported_boundary",
      supportBucket: "unsupported"
    });

    for (const row of contract.surfaceRows) {
      expect(row.noRuntimeValueMovement, row.selectedCandidateId).toBe(true);
      expect(row.surfaceDetail, row.selectedCandidateId).toContain(row.selectedCandidateId);
      expect(row.rejectedCount, row.selectedCandidateId).toBe(row.rejectedCandidateIds.length);
      expect(row.boundaryCount, row.selectedCandidateId).toBe(row.boundaryCandidateIds.length);
    }
  });

  it("exposes live calculator traces without moving lab runtime values", () => {
    const exact = calculateAssembly(R5B_EXACT_PACKAGE, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const packageTransfer = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const rawOpenBox = calculateAssembly(RAW_OPEN_BOX_TIMBER, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const rawOpenWeb = calculateAssembly(RAW_OPEN_WEB_300, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const helperOnly = calculateAssembly(HELPER_ONLY_OPEN_WEB, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const directFixed = calculateAssembly(DIRECT_FIXED_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const supportedBand = calculateAssembly(SUPPORTED_BAND_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });

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
    expect(packageTransfer.floorSystemRatings).toMatchObject({ Rw: 66, basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS });

    expect(rawOpenBox.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      selectedCandidateId: "floor.open_box_timber.raw_bare_source_absent"
    });
    expect(rawOpenBox.impact).toMatchObject({ CI50_2500: 3.1, LnW: 88.2, basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS });

    expect(rawOpenWeb.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      runtimeBasisId: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
      selectedCandidateId: "floor.open_web.raw_bare_source_absent"
    });
    expect(rawOpenWeb.impact).toMatchObject({ CI50_2500: 5.2, LnW: 96, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });

    expect(helperOnly.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      runtimeBasisId: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
      selectedCandidateId: "floor.helper_only_timber_open_web.source_absent"
    });
    expect(helperOnly.impact).toMatchObject({ CI50_2500: 4, LnW: 59.6, basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS });
    expect(helperOnly.floorSystemRatings).toMatchObject({ Rw: 46.7, basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS });

    expect(directFixed.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
      selectedCandidateId: "floor.open_web.direct_fixed_lining.source_absent"
    });
    expect(directFixed.impact).toMatchObject({ CI: -0.5, LnW: 77, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS });
    expect(directFixed.floorSystemRatings).toMatchObject({ Rw: 52, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS });

    expect(supportedBand.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
      selectedCandidateId: "floor.open_web.supported_band_similarity"
    });
    expect(supportedBand.impact).toMatchObject({ CI: -1.5, LnW: 61.5, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });
    expect(supportedBand.floorSystemRatings).toMatchObject({ Rw: 61.5, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });
  });

  it("exposes field adapter and impact-only payload traces without opening blocked aliases", () => {
    const field = calculateAssembly(SUPPORTED_BAND_PACKAGE, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(field.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      requestedBasis: "field_apparent",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportBucket: "field_adapter"
    });
    expect(field.metrics).toMatchObject({
      estimatedDnTwDb: 48,
      estimatedRwPrimeDb: 45
    });
    expect(field.impact).toMatchObject({
      LPrimeNT50: 60,
      LPrimeNTw: 61.1,
      LPrimeNW: 63.5
    });

    const impactOnly = calculateImpactOnly(HELPER_ONLY_OPEN_WEB, {
      sourceLayers: HELPER_ONLY_OPEN_WEB,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(impactOnly.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      selectedCandidateId: "floor.helper_only_timber_open_web.source_absent",
      supportBucket: "source_absent_estimate"
    });
    expect(impactOnly.impact).toMatchObject({
      CI50_2500: 4,
      LnW: 59.6,
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
    });
    expect(impactOnly.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "L'nT,w", "IIC"]);
    expect(impactOnly.impact?.LPrimeNW).toBeUndefined();
    expect(impactOnly.impact?.LPrimeNTw).toBeUndefined();
  });

  it("exposes local-substitution wall formula traces without hiding calculated answers", () => {
    const rwOnly = calculateAssembly(LOCAL_SUBSTITUTION_WALL, {
      airborneContext: LOCAL_SUBSTITUTION_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const labSpectrum = calculateAssembly(LOCAL_SUBSTITUTION_WALL, {
      airborneContext: LOCAL_SUBSTITUTION_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    const field = calculateAssembly(LOCAL_SUBSTITUTION_WALL, {
      airborneContext: LOCAL_SUBSTITUTION_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(rwOnly.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "source_absent_family_solver",
      requestedBasis: "element_lab",
      runtimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 53 }]
    });
    expect(rwOnly.metrics.estimatedRwDb).toBe(53);

    expect(labSpectrum.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "source_absent_family_solver",
      requestedBasis: "element_lab",
      runtimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 53 },
        { metric: "STC", value: 64 },
        { metric: "C", value: 1.6 },
        { metric: "Ctr", value: -7.2 }
      ])
    });
    expect(labSpectrum.metrics).toMatchObject({
      estimatedCDb: 1.6,
      estimatedCtrDb: -7.2,
      estimatedRwDb: 53,
      estimatedStc: 64
    });

    expect(field.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "field_building_adapter",
      requestedBasis: "field_apparent",
      runtimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "DnT,w"],
      valuePins: expect.arrayContaining([
        { metric: "R'w", value: 51 },
        { metric: "DnT,w", value: 53 }
      ])
    });
    expect(field.layerCombinationResolverTrace?.supportedMetrics).not.toContain("Rw");
    expect(field.layerCombinationResolverTrace?.supportedMetrics).not.toContain("STC");
    expect(field.metrics).toMatchObject({
      estimatedDnTwDb: 53,
      estimatedRwPrimeDb: 51
    });
  });

  it("keeps docs, exports, and current gate runner aligned with surface parity", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(normalized, path).toContain(LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_LABEL);
      expect(normalized, path).toContain("candidate trace");
      expect(normalized, path).toContain("api");
      expect(normalized, path).toContain("markdown report");
      expect(normalized, path).toContain("needs_input");
      expect(normalized, path).toContain("unsupported");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const index = readRepoFile("packages/engine/src/index.ts");
    const sharedIndex = readRepoFile("packages/shared/src/index.ts");

    expect(runner).toContain("layer-combination-resolver-runtime-candidate-surface-parity-contract.test.ts");
    expect(index).toContain('export * from "./layer-combination-resolver-runtime-candidate-surface-parity";');
    expect(sharedIndex).toContain('export * from "./domain/layer-combination-resolver";');
  });
});

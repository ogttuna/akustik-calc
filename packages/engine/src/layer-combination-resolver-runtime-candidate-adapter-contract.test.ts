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
  GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bo";
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
  adaptLayerCombinationRuntimeCandidate,
  buildLayerCombinationResolverRuntimeCandidateAdapterContract,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTION_STATUS
} from "./layer-combination-resolver-runtime-candidate-adapter";
import {
  LAYER_COMBINATION_RESOLVER_REGISTRY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTION_STATUS,
  buildLayerCombinationResolverRegistryContract,
  type LayerCombinationResolverMetricId
} from "./layer-combination-resolver-registry";
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
  "IIC",
  "AIIC"
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
const HEAVY_LAB_IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC"] as const satisfies readonly RequestedOutputId[];

const RESOLVER_METRIC_IDS = new Set<string>([
  "AIIC",
  "C",
  "CI",
  "CI,50-2500",
  "Ctr",
  "DeltaLw",
  "DnT,w",
  "IIC",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "LnT,A",
  "Ln,w",
  "Ln,w+CI",
  "R'w",
  "Rw",
  "STC"
]);

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

const HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const HEAVY_FLOATING_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const;

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

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-runtime-candidate-adapter.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-adapter-contract.test.ts",
  "packages/engine/src/layer-combination-resolver-registry.ts",
  "packages/engine/src/layer-combination-resolver-registry-contract.test.ts",
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

function toResolverMetricIds(outputs: readonly RequestedOutputId[]): LayerCombinationResolverMetricId[] {
  return outputs
    .filter((output) => RESOLVER_METRIC_IDS.has(output))
    .map((output) => output as LayerCombinationResolverMetricId);
}

function adaptFloorLabResult(result: ReturnType<typeof calculateAssembly>) {
  return adaptLayerCombinationRuntimeCandidate({
    requestedBasis: "element_lab",
    route: "floor",
    runtimeBasisId: result.impact?.basis ?? result.floorSystemRatings?.basis ?? null,
    unsupportedOutputIds: toResolverMetricIds(result.unsupportedTargetOutputs)
  });
}

describe("layer combination resolver runtime candidate adapter contract", () => {
  it("lands the adapter and selects runtime candidate surface parity next", () => {
    const contract = buildLayerCombinationResolverRuntimeCandidateAdapterContract();

    expect(contract).toMatchObject({
      adapterVersion: "2026-05-21.layer-combination-resolver-runtime-candidate-adapter.v1",
      landedGate: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousRegistry: {
        landedGate: LAYER_COMBINATION_RESOLVER_REGISTRY_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTION_STATUS
      },
      selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_LABEL,
      selectionStatus: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTION_STATUS
    });
    expect(contract.summary).toEqual({
      adaptedRuntimeBasisCount: 32,
      boundaryCandidateCount: 3,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("maps every active registry runtime basis into a selected adapter candidate", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    const contract = buildLayerCombinationResolverRuntimeCandidateAdapterContract();
    const rowsByBasis = new Map(contract.adapterRows.map((row) => [row.runtimeBasisId, row]));

    for (const candidate of registry.candidateDeclarations.filter(
      (entry) => entry.runtimeSelectionState === "active_runtime_existing" && entry.ownedRuntimeBasisId
    )) {
      expect(rowsByBasis.get(candidate.ownedRuntimeBasisId), candidate.id).toMatchObject({
        requestedBasis: candidate.basis,
        route: candidate.route,
        selectedCandidateId: candidate.id,
        selectedCandidate: {
          basis: candidate.basis,
          kind: candidate.kind,
          ownedRuntimeBasisId: candidate.ownedRuntimeBasisId,
          priorityRank: candidate.priorityRank,
          supportedMetrics: candidate.supportedMetrics,
          valuePins: candidate.valuePins
        }
      });
    }

    expect(rowsByBasis.get("open_measured_floor_system_exact_match")?.selectedCandidateId).toBe(
      "floor.exact_measured_floor_system.same_topology_metric_basis"
    );
    expect(rowsByBasis.get(EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS)?.selectedCandidateId).toBe(
      "floor.exact_impact_band_source.metric_basis"
    );
    expect(rowsByBasis.get(ASTM_E989_IMPACT_RATING_BASIS)?.selectedCandidateId).toBe(
      ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID
    );
    expect(rowsByBasis.get(OPEN_BOX_TIMBER_SIMILARITY_BASIS)?.selectedCandidateId).toBe(
      "floor.open_box_timber.package_transfer_similarity"
    );
    expect(rowsByBasis.get(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS)?.selectedCandidateId).toBe(
      "floor.open_web.supported_band_similarity"
    );
    expect(rowsByBasis.get(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS)?.selectedCandidateId).toBe(
      "floor.heavy_concrete_floating_floor.lab_impact_formula"
    );
    expect(rowsByBasis.get(HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS)?.selectedCandidateId).toBe(
      "floor.heavy_concrete_combined_upper_lower.lab_impact_formula"
    );
    expect(rowsByBasis.get(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS)?.selectedCandidateId).toBe(
      "floor.helper_only_timber_open_web.source_absent"
    );
    expect(rowsByBasis.get(STEEL_FLOOR_FORMULA_BASIS)?.selectedCandidateId).toBe(
      "floor.lightweight_steel.upper_lower_mass_spring.source_absent"
    );
    expect(rowsByBasis.get(STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS)?.selectedCandidateId).toBe(
      "floor.lightweight_steel.suspended_ceiling_only.source_absent"
    );
    expect(rowsByBasis.get(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD)).toMatchObject({
      requestedBasis: "element_lab",
      route: "wall",
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID,
      selectedCandidate: {
        basis: "element_lab",
        kind: "source_absent_family_solver",
        ownedRuntimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
        priorityRank: 3,
        supportedMetrics: ["Rw"]
      }
    });
    expect(rowsByBasis.get(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD)).toMatchObject({
      requestedBasis: "element_lab",
      route: "wall",
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
      selectedCandidate: {
        basis: "element_lab",
        kind: "source_absent_family_solver",
        ownedRuntimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
        priorityRank: 3,
        supportedMetrics: ["Rw", "STC", "C", "Ctr"]
      }
    });
    expect(rowsByBasis.get(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS)?.selectedCandidateId).toBe(
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
    expect(rowsByBasis.get(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS)?.selectedCandidateId).toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
    expect(rowsByBasis.get(GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD)).toMatchObject({
      requestedBasis: "element_lab",
      route: "wall",
      selectedCandidateId: GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID,
      selectedCandidate: {
        basis: "element_lab",
        kind: "source_absent_family_solver",
        ownedRuntimeBasisId: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
        priorityRank: 3,
        supportedMetrics: ["Rw", "STC", "C", "Ctr"]
      }
    });
    expect(rowsByBasis.get(COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD)).toMatchObject({
      requestedBasis: "element_lab",
      route: "wall",
      selectedCandidateId: COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID,
      selectedCandidate: {
        basis: "element_lab",
        kind: "source_absent_family_solver",
        ownedRuntimeBasisId: COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
        priorityRank: 3,
        supportedMetrics: ["Rw", "STC", "C", "Ctr"]
      }
    });
    expect(rowsByBasis.get(FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD)).toMatchObject({
      requestedBasis: "element_lab",
      route: "wall",
      selectedCandidateId: FLAT_LIST_MULTILEAF_GUARD_LAB_SELECTED_CANDIDATE_ID,
      selectedCandidate: {
        basis: "element_lab",
        kind: "source_absent_family_solver",
        ownedRuntimeBasisId: FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD,
        priorityRank: 3,
        supportedMetrics: ["Rw", "STC", "C", "Ctr"]
      }
    });
    expect(rowsByBasis.get(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD)).toMatchObject({
      requestedBasis: "field_apparent",
      route: "wall",
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      selectedCandidate: {
        basis: "field_apparent",
        kind: "field_building_adapter",
        ownedRuntimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        priorityRank: 4,
        supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "DnT,A,k"]
      }
    });
    expect(rowsByBasis.get(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD)).toMatchObject({
      requestedBasis: "field_apparent",
      route: "wall",
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedCandidate: {
        basis: "field_apparent",
        kind: "field_building_adapter",
        ownedRuntimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
        priorityRank: 4,
        supportedMetrics: ["R'w", "DnT,w"]
      }
    });
    expect(rowsByBasis.get(FLAT_LIST_MULTILEAF_GUARD_FIELD_RUNTIME_METHOD)).toMatchObject({
      requestedBasis: "field_apparent",
      route: "wall",
      selectedCandidateId: FLAT_LIST_MULTILEAF_GUARD_FIELD_SELECTED_CANDIDATE_ID,
      selectedCandidate: {
        basis: "field_apparent",
        kind: "field_building_adapter",
        ownedRuntimeBasisId: FLAT_LIST_MULTILEAF_GUARD_FIELD_RUNTIME_METHOD,
        priorityRank: 4,
        supportedMetrics: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"]
      }
    });
  });

  it("adapts live floor lab runtime results without changing numeric values", () => {
    const exact = calculateAssembly(R5B_EXACT_PACKAGE, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const packageTransfer = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const rawOpenBox = calculateAssembly(RAW_OPEN_BOX_TIMBER, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const rawOpenWeb = calculateAssembly(RAW_OPEN_WEB_300, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const helperOnly = calculateAssembly(HELPER_ONLY_OPEN_WEB, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const directFixed = calculateAssembly(DIRECT_FIXED_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const supportedBand = calculateAssembly(SUPPORTED_BAND_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const heavyFloating = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      calculator: "dynamic",
      floorImpactContext: HEAVY_FLOATING_FLOOR_IMPACT_CONTEXT,
      targetOutputs: HEAVY_LAB_IMPACT_OUTPUTS
    });
    const heavyCombined = calculateImpactOnly([], {
      impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw", "IIC", "AIIC"]
    });

    expect(adaptFloorLabResult(exact).selectedCandidateId).toBe(
      "floor.exact_measured_floor_system.same_topology_metric_basis"
    );
    expect(exact.impact).toMatchObject({ CI50_2500: 3, LnW: 44, basis: "open_measured_floor_system_exact_match" });
    expect(exact.floorSystemRatings).toMatchObject({ Rw: 75, basis: "open_measured_floor_system_exact_match" });

    expect(adaptFloorLabResult(packageTransfer).selectedCandidateId).toBe(
      "floor.open_box_timber.package_transfer_similarity"
    );
    expect(packageTransfer.impact).toMatchObject({ CI50_2500: 3.3, LnW: 50.8, basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS });
    expect(packageTransfer.floorSystemRatings).toMatchObject({ Rw: 66, basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS });

    expect(adaptFloorLabResult(rawOpenBox).selectedCandidateId).toBe("floor.open_box_timber.raw_bare_source_absent");
    expect(rawOpenBox.impact).toMatchObject({ CI50_2500: 3.1, LnW: 88.2, basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS });

    const rawOpenWebAdapter = adaptFloorLabResult(rawOpenWeb);
    expect(rawOpenWebAdapter).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      selectedCandidateId: "floor.open_web.raw_bare_source_absent"
    });
    expect(rawOpenWeb.impact).toMatchObject({ CI50_2500: 5.2, LnW: 96, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });

    expect(adaptFloorLabResult(helperOnly)).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      selectedCandidateId: "floor.helper_only_timber_open_web.source_absent"
    });
    expect(helperOnly.impact).toMatchObject({ CI50_2500: 4, LnW: 59.6, basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS });
    expect(helperOnly.floorSystemRatings).toMatchObject({ Rw: 46.7, basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS });

    expect(adaptFloorLabResult(directFixed).selectedCandidateId).toBe(
      "floor.open_web.direct_fixed_lining.source_absent"
    );
    expect(directFixed.impact).toMatchObject({ CI: -0.5, LnW: 77, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS });
    expect(directFixed.floorSystemRatings).toMatchObject({ Rw: 52, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS });

    expect(adaptFloorLabResult(supportedBand).selectedCandidateId).toBe("floor.open_web.supported_band_similarity");
    expect(supportedBand.impact).toMatchObject({ CI: -1.5, LnW: 61.5, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });
    expect(supportedBand.floorSystemRatings).toMatchObject({ Rw: 61.5, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });

    expect(adaptFloorLabResult(heavyFloating)).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      selectedCandidateId: "floor.heavy_concrete_floating_floor.lab_impact_formula"
    });
    expect(heavyFloating.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 50.3,
      basis: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS
    });

    expect(adaptLayerCombinationRuntimeCandidate({
      requestedBasis: "element_lab",
      requestedMetricAliases: toResolverMetricIds(heavyCombined.targetOutputs),
      route: "floor",
      runtimeBasisId: heavyCombined.impact?.basis ?? null,
      unsupportedOutputIds: toResolverMetricIds(heavyCombined.unsupportedTargetOutputs)
    })).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      selectedCandidate: {
        kind: "source_absent_family_solver",
        ownedRuntimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
        supportedMetrics: ["Ln,w", "DeltaLw"]
      },
      selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula"
    });
    expect(heavyCombined.impact).toMatchObject({
      DeltaLw: 13.7,
      LnW: 58.1,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
    });
  });

  it("adapts field adapter, missing-input, basis-boundary, and ASTM unsupported lanes explicitly", () => {
    const field = calculateAssembly(SUPPORTED_BAND_PACKAGE, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const fieldAdapter = adaptLayerCombinationRuntimeCandidate({
      requestedBasis: "field_apparent",
      route: "floor",
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      unsupportedOutputIds: toResolverMetricIds(field.unsupportedTargetOutputs)
    });

    expect(fieldAdapter).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      selectedCandidate: {
        basis: "field_apparent",
        kind: "field_building_adapter",
        priorityRank: 4
      }
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

    const needsInput = adaptLayerCombinationRuntimeCandidate({
      missingPhysicalInputIds: ["ceiling_board", "absorberThicknessDensity"],
      requestedBasis: "element_lab",
      route: "floor",
      runtimeBasisId: null
    });
    expect(needsInput).toMatchObject({
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      selectedCandidate: {
        kind: "needs_input_boundary",
        valuePins: []
      }
    });

    const buildingBoundary = adaptLayerCombinationRuntimeCandidate({
      requestedBasis: "building_prediction",
      route: "floor",
      runtimeBasisId: null,
      unsupportedOutputIds: ["L'nT,w"]
    });
    expect(buildingBoundary).toMatchObject({
      selectedCandidateId: "generic.lab_field_building_basis_boundary",
      selectedCandidate: {
        basis: "building_prediction",
        kind: "basis_boundary",
        valuePins: []
      }
    });

    const astmBoundary = adaptLayerCombinationRuntimeCandidate({
      requestedBasis: "astm_rating_boundary",
      requestedMetricAliases: ["IIC", "AIIC"],
      route: "floor",
      runtimeBasisId: null
    });
    expect(astmBoundary).toMatchObject({
      selectedCandidateId: "generic.astm_iic_aiic.unsupported_boundary",
      selectedCandidate: {
        basis: "astm_rating_boundary",
        kind: "unsupported_boundary",
        valuePins: []
      }
    });
  });

  it("keeps docs, exports, and current gate runner aligned with the adapter", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_FILE);
      expect(normalized, path).toContain(LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_LABEL);
      expect(normalized, path).toContain("runtime basis");
      expect(normalized, path).toContain("candidate id");
      expect(normalized, path).toContain("needs_input");
      expect(normalized, path).toContain("unsupported");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const index = readRepoFile("packages/engine/src/index.ts");

    expect(runner).toContain("layer-combination-resolver-runtime-candidate-adapter-contract.test.ts");
    expect(index).toContain('export * from "./layer-combination-resolver-runtime-candidate-adapter";');
  });
});

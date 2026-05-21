import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
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
      surfaceRowCount: 15
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
    expect(rowsById.get("floor.open_web.supported_band_similarity")).toMatchObject({
      candidateKind: "similarity_anchor",
      supportBucket: "anchored_estimate"
    });
    expect(rowsById.get("floor.open_web.field_building_adapter.exact_anchor_continuation")).toMatchObject({
      candidateKind: "field_building_adapter",
      supportBucket: "field_adapter"
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
      selectedCandidateId: "floor.open_web.field_building_adapter.exact_anchor_continuation",
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

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
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
      activeRuntimeCandidateCount: 12,
      basisCount: {
        astm_rating_boundary: 1,
        building_prediction: 1,
        element_lab: 12,
        field_apparent: 1
      },
      candidateCount: 15,
      kindCount: {
        basis_boundary: 1,
        calibrated_family_solver: 1,
        exact_measured_override: 2,
        field_building_adapter: 1,
        needs_input_boundary: 1,
        similarity_anchor: 2,
        source_absent_family_solver: 6,
        unsupported_boundary: 1
      },
      routeCount: {
        floor: 11,
        wall: 4
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
    expect(byId.get("floor.open_web.field_building_adapter.exact_anchor_continuation")).toMatchObject({
      basis: "field_apparent",
      kind: "field_building_adapter",
      priorityRank: 4
    });
    expect(byId.get("generic.lab_field_building_basis_boundary")).toMatchObject({
      basis: "building_prediction",
      kind: "basis_boundary",
      runtimeSelectionState: "blocked_boundary_existing"
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

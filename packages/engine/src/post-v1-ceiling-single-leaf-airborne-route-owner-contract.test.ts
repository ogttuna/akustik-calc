import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { adaptLayerCombinationRuntimeCandidate } from "./layer-combination-resolver-runtime-candidate-adapter";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_landed_no_runtime_selected_ceiling_single_leaf_airborne_route_owner";

const OWNER_ACTION =
  "post_v1_ceiling_single_leaf_airborne_route_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_OWNER_PLAN_2026-06-26.md";
const OWNER_STATUS =
  "post_v1_ceiling_single_leaf_airborne_route_owner_landed_runtime_basis_selected_coverage_refresh";
const SELECTED_NEXT_ACTION =
  "post_v1_ceiling_single_leaf_airborne_route_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const SELECTED_NEXT_LABEL =
  "post-V1 ceiling single-leaf airborne route coverage refresh";
const SELECTED_CANDIDATE_ID =
  "ceiling.single_leaf_airborne_mass_law.source_absent";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 1,
  newCalculableTargetOutputs: 4,
  requiredPhysicalInputsCaptured: 1,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 4,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 5
} as const;

const CEILING_SINGLE_LEAF_STACK = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const OITC_OUTPUTS = ["OITC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  OWNER_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateCeiling(targetOutputs: readonly RequestedOutputId[]) {
  return calculateAssembly(CEILING_SINGLE_LEAF_STACK, {
    calculator: "dynamic",
    targetOutputs
  });
}

function ownerSummary() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousRerank: {
      action: PREVIOUS_RERANK_ACTION,
      file: PREVIOUS_RERANK_FILE,
      status: PREVIOUS_RERANK_STATUS
    },
    runtimeValueMovement: true,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

describe("post-V1 ceiling single-leaf airborne route owner", () => {
  it("lands the runtime owner and selects the ceiling route coverage refresh", () => {
    expect(ownerSummary()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      runtimeValueMovement: true,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [PREVIOUS_RERANK_FILE, OWNER_FILE, OWNER_PLAN_DOC, SELECTED_NEXT_PLAN_DOC]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates ceiling-only Rw, STC, C, and Ctr on the first-class ceiling route", () => {
    const result = calculateCeiling(LAB_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toBeNull();
    expect(result.impactPredictorStatus).toBeNull();
    expect(result.metrics).toMatchObject({
      estimatedCDb: 3.7,
      estimatedCtrDb: 8,
      estimatedRwDb: 34,
      estimatedStc: 34,
      surfaceMassKgM2: 21.3,
      totalThicknessMm: 25
    });
    expect(result.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      requiredInputs: expect.arrayContaining(["route=wall_floor_or_ceiling"])
    });
    expect(result.warnings).toEqual(expect.arrayContaining([
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING
    ]));
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "element_lab",
      route: "ceiling",
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw", "C", "Ctr", "STC"],
      valuePins: [
        { metric: "Rw", value: 34 },
        { metric: "STC", value: 34 },
        { metric: "C", value: 3.7 },
        { metric: "Ctr", value: 8 }
      ]
    });
    expect(result.layerCombinationResolverTrace?.requiredInputs).toEqual(
      expect.arrayContaining([
        "route=ceiling",
        "ceilingOnlyLayerRoles",
        "visibleLeafCount",
        "surfaceMassKgM2",
        "oneThirdOctaveTransmissionLossCurve",
        "iso717AirborneRatingAdapter"
      ])
    );
  });

  it("keeps impact and OITC requests outside the ceiling airborne owner", () => {
    const impact = calculateCeiling(IMPACT_OUTPUTS);
    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.impact).toBeNull();
    expect(impact.acousticAnswerBoundary).toMatchObject({
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: [...IMPACT_OUTPUTS]
    });
    expect(impact.acousticAnswerBoundary?.missingPhysicalInputs).toEqual(
      expect.arrayContaining([
        "baseSlabOrFloor",
        "toppingOrFloatingLayer",
        "resilientLayerDynamicStiffnessMNm3",
        "loadBasisKgM2"
      ])
    );
    expect(impact.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(SELECTED_CANDIDATE_ID);

    const oitc = calculateCeiling(OITC_OUTPUTS);
    expect(oitc.supportedTargetOutputs).toEqual([]);
    expect(oitc.unsupportedTargetOutputs).toEqual([...OITC_OUTPUTS]);
    expect(oitc.impact).toBeNull();
    expect(oitc.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(SELECTED_CANDIDATE_ID);
  });

  it("keeps registry and adapter route-aware for the shared single-leaf backbone", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    expect(registry.summary.routeCount).toMatchObject({
      ceiling: 6,
      floor: 28,
      wall: 22
    });
    expect(registry.summary).toMatchObject({
      activeRuntimeCandidateCount: 53,
      candidateCount: 56
    });

    const ceilingAdapter = adaptLayerCombinationRuntimeCandidate({
      requestedBasis: "element_lab",
      route: "ceiling",
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
    });
    expect(ceilingAdapter).toMatchObject({
      requestedBasis: "element_lab",
      route: "ceiling",
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedCandidate: {
        requiredInputs: expect.arrayContaining(["route=ceiling", "ceilingOnlyLayerRoles"]),
        supportedMetrics: ["Rw", "C", "Ctr", "STC"]
      }
    });

    const wallAdapter = adaptLayerCombinationRuntimeCandidate({
      requestedBasis: "element_lab",
      route: "wall",
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
    });
    expect(wallAdapter.selectedCandidateId).toBe(
      "candidate_layer_combination_resolver_single_leaf_mass_law_banded_source_absent_family_solver"
    );
  });

  it("keeps active docs and current-gate runner aligned with the landed owner", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("newCalculableLayerTemplates: 1");
      expect(content, path).toContain("newCalculableRequestShapes: 1");
      expect(content, path).toContain("newCalculableTargetOutputs: 4");
      expect(content, path).toContain("requiredPhysicalInputsCaptured: 1");
      expect(content, path).toContain("runtimeBasisPromotions: 1");
      expect(content, path).toContain("runtimeValuesMoved 4");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("post-v1-runtime-first-route-family-rerank-after-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts");
    expect(runner).toContain("post-v1-ceiling-single-leaf-airborne-route-owner-contract.test.ts");
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
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
const OWNER_CANDIDATE_ID =
  "ceiling.single_leaf_airborne_mass_law.source_absent";

const COVERAGE_REFRESH_ACTION =
  "post_v1_ceiling_single_leaf_airborne_route_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_ceiling_single_leaf_airborne_route_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after ceiling single-leaf airborne route coverage refresh";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  requiredPhysicalInputsCaptured: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const CEILING_SINGLE_LEAF_STACK = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const PARTIAL_LAB_OUTPUTS = ["Rw", "Ctr"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const OITC_OUTPUTS = ["OITC"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const EXPECTED_LAB_VALUES = {
  C: 3.7,
  Ctr: 8,
  Rw: 34,
  STC: 34
} as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  COVERAGE_REFRESH_PLAN_DOC,
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

function metricSnapshot(result: ReturnType<typeof calculateCeiling>) {
  return {
    C: result.metrics.estimatedCDb,
    Ctr: result.metrics.estimatedCtrDb,
    Rw: result.metrics.estimatedRwDb,
    STC: result.metrics.estimatedStc
  };
}

function coverageRefreshSummary() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    ownerCandidateId: OWNER_CANDIDATE_ID,
    previousOwner: {
      action: OWNER_ACTION,
      file: OWNER_FILE,
      status: OWNER_STATUS
    },
    previousRerank: {
      action: PREVIOUS_RERANK_ACTION,
      file: PREVIOUS_RERANK_FILE,
      status: PREVIOUS_RERANK_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 ceiling single-leaf airborne route coverage refresh", () => {
  it("lands the no-runtime coverage refresh and selects the runtime-first rerank", () => {
    expect(coverageRefreshSummary()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      ownerCandidateId: OWNER_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes mixed and single-output ceiling lab requests on the ceiling route", () => {
    const mixed = calculateCeiling(LAB_OUTPUTS);

    expect(mixed.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.impact).toBeNull();
    expect(mixed.impactPredictorStatus).toBeNull();
    expect(metricSnapshot(mixed)).toMatchObject(EXPECTED_LAB_VALUES);
    expect(mixed.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction",
      requiredInputs: expect.arrayContaining(["route=wall_floor_or_ceiling"])
    });
    expect(mixed.warnings).toEqual(expect.arrayContaining([
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING
    ]));
    expect(mixed.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "element_lab",
      route: "ceiling",
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: OWNER_CANDIDATE_ID,
      valuePins: [
        { metric: "Rw", value: 34 },
        { metric: "STC", value: 34 },
        { metric: "C", value: 3.7 },
        { metric: "Ctr", value: 8 }
      ]
    });

    for (const output of LAB_OUTPUTS) {
      const single = calculateCeiling([output]);

      expect(single.supportedTargetOutputs, output).toEqual([output]);
      expect(single.unsupportedTargetOutputs, output).toEqual([]);
      expect(metricSnapshot(single), output).toMatchObject(EXPECTED_LAB_VALUES);
      expect(single.layerCombinationResolverTrace).toMatchObject({
        route: "ceiling",
        selectedCandidateId: OWNER_CANDIDATE_ID
      });
    }
  });

  it("keeps partial lab requests request-scoped without widening supported outputs", () => {
    const partial = calculateCeiling(PARTIAL_LAB_OUTPUTS);

    expect(partial.supportedTargetOutputs).toEqual([...PARTIAL_LAB_OUTPUTS]);
    expect(partial.unsupportedTargetOutputs).toEqual([]);
    expect(metricSnapshot(partial)).toMatchObject({
      Ctr: EXPECTED_LAB_VALUES.Ctr,
      Rw: EXPECTED_LAB_VALUES.Rw
    });
    expect(partial.layerCombinationResolverTrace).toMatchObject({
      route: "ceiling",
      selectedCandidateId: OWNER_CANDIDATE_ID,
      supportedMetrics: [...PARTIAL_LAB_OUTPUTS]
    });
  });

  it("keeps impact, OITC, and field/building requests outside the ceiling airborne refresh", () => {
    const impact = calculateCeiling(IMPACT_OUTPUTS);
    const oitc = calculateCeiling(OITC_OUTPUTS);
    const fieldBuilding = calculateCeiling(FIELD_BUILDING_OUTPUTS);

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.impact).toBeNull();
    expect(impact.acousticAnswerBoundary).toMatchObject({
      origin: "needs_input",
      route: "floor"
    });
    expect(impact.acousticAnswerBoundary?.unsupportedOutputs).toEqual(
      expect.arrayContaining(["Ln,w", "DeltaLw"])
    );
    expect(impact.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(OWNER_CANDIDATE_ID);

    expect(oitc.supportedTargetOutputs).toEqual([]);
    expect(oitc.unsupportedTargetOutputs).toEqual([...OITC_OUTPUTS]);
    expect(oitc.impact).toBeNull();
    expect(oitc.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(OWNER_CANDIDATE_ID);

    expect(fieldBuilding.supportedTargetOutputs).toEqual([]);
    expect(fieldBuilding.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(fieldBuilding.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(OWNER_CANDIDATE_ID);
  });

  it("keeps docs and current-gate runner aligned with the refresh closeout", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_FILE);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(OWNER_CANDIDATE_ID);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(content, path).toContain("Rw 34");
      expect(content, path).toContain("STC 34");
      expect(content, path).toContain("C 3.7");
      expect(content, path).toContain("Ctr 8");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
    expect(gateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});

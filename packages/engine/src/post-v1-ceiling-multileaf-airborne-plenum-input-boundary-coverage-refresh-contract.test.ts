import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_input_boundary_owner";

const OWNER_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_OWNER_PLAN_2026-06-29.md";
const OWNER_STATUS =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_landed_input_boundary_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "ceiling.multileaf_airborne_plenum_input_boundary_owner";
const FIELD_CANDIDATE_ID =
  "ceiling.single_leaf_airborne_field_context_adapter";
const BUILDING_CANDIDATE_ID =
  "ceiling.single_leaf_airborne_building_prediction_adapter";
const SINGLE_LEAF_CANDIDATE_ID =
  "ceiling.single_leaf_airborne_mass_law.source_absent";
const NEEDS_INPUT_TRACE_CANDIDATE_ID =
  "generic.required_input_owner.needs_input_boundary";
const OWNER_METHOD =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs";
const FIELD_BUILDING_NEEDS_INPUT_METHOD =
  "post_v1_ceiling_multileaf_airborne_plenum_field_building_context_missing_physical_inputs";

const COVERAGE_REFRESH_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after ceiling multileaf airborne plenum input-boundary coverage refresh";

const MISSING_PHYSICAL_INPUTS = [
  "ceilingLeafGrouping",
  "ceilingLeafSurfaceMassKgM2",
  "ceilingCavityOrPlenumDepthMm",
  "ceilingAbsorberThicknessAndFlowResistivity",
  "ceilingSupportCouplingOrHangerClass"
] as const;

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  requiredPhysicalInputsCaptured: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 0
} as const;

const CEILING_PLENUM_STACK = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 }
] as const satisfies readonly LayerInput[];

const CEILING_BOARD_ONLY_STACK = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  hangerOrSupportCouplingClass: "resilient_hanger",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  roofOrCeilingMountingContext: "indoor_ceiling",
  routeIntent: "ceiling_airborne",
  suspendedCeilingAirborneOrImpactIntent: "airborne_ceiling_plenum"
} as const satisfies AirborneContext;

const ELEMENT_LAB_ROUTE_CONTEXT = {
  contextMode: "element_lab",
  hangerOrSupportCouplingClass: "resilient_hanger",
  roofOrCeilingMountingContext: "indoor_ceiling",
  routeIntent: "ceiling_airborne",
  suspendedCeilingAirborneOrImpactIntent: "airborne_ceiling_plenum"
} as const satisfies AirborneContext;

const FLOOR_IMPACT_LOWER_TREATMENT_ROUTE_CONTEXT = {
  contextMode: "element_lab",
  hangerOrSupportCouplingClass: "resilient_hanger",
  roofOrCeilingMountingContext: "suspended_ceiling_below_floor",
  routeIntent: "suspended_ceiling_floor_impact_lower_treatment",
  suspendedCeilingAirborneOrImpactIntent: "floor_impact_lower_treatment"
} as const satisfies AirborneContext;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
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
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculate(
  stack: readonly LayerInput[],
  targetOutputs: readonly RequestedOutputId[],
  airborneContext?: AirborneContext
) {
  return calculateAssembly(stack, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

function coverageRefreshSummary() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
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
    reProbedCandidateId: OWNER_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 ceiling multileaf airborne plenum input-boundary coverage refresh", () => {
  it("lands the no-runtime refresh and selects the follow-up runtime-first rerank", () => {
    expect(coverageRefreshSummary()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      reProbedCandidateId: OWNER_CANDIDATE_ID,
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

  it("re-probes ceiling plenum lab outputs as route ceiling needs_input with no value pins", () => {
    const result = calculate(CEILING_PLENUM_STACK, LAB_OUTPUTS, ELEMENT_LAB_ROUTE_CONTEXT);

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.impact).toBeNull();
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: OWNER_METHOD,
      missingPhysicalInputs: [...MISSING_PHYSICAL_INPUTS],
      origin: "needs_input",
      route: "ceiling",
      unsupportedOutputs: [...LAB_OUTPUTS]
    });
    expect(result.airborneBasis).toMatchObject({
      family: "multileaf_multicavity",
      method: OWNER_METHOD,
      missingPhysicalInputs: [...MISSING_PHYSICAL_INPUTS],
      origin: "needs_input"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "needs_input_boundary",
      requestedBasis: "element_lab",
      route: "ceiling",
      runtimeBasisId: null,
      selectedCandidateId: NEEDS_INPUT_TRACE_CANDIDATE_ID,
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });
    expect(result.layerCombinationResolverTrace?.requiredInputs).toEqual([...MISSING_PHYSICAL_INPUTS]);
    expect(result.layerCombinationResolverTrace?.rejectedCandidateIds).toEqual(
      expect.arrayContaining([
        SINGLE_LEAF_CANDIDATE_ID,
        FIELD_CANDIDATE_ID,
        BUILDING_CANDIDATE_ID
      ])
    );
    expect(result.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(SINGLE_LEAF_CANDIDATE_ID);
    expect(result.warnings).not.toContain(
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING
    );
  });

  it("re-probes incomplete ceiling plenum field outputs without copying single-leaf field values", () => {
    const result = calculate(CEILING_PLENUM_STACK, FIELD_OUTPUTS, FIELD_CONTEXT);

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: FIELD_BUILDING_NEEDS_INPUT_METHOD,
      missingPhysicalInputs: [...MISSING_PHYSICAL_INPUTS],
      origin: "needs_input",
      route: "ceiling",
      unsupportedOutputs: [...FIELD_OUTPUTS]
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "needs_input_boundary",
      requestedBasis: "field_apparent",
      route: "ceiling",
      runtimeBasisId: null,
      selectedCandidateId: NEEDS_INPUT_TRACE_CANDIDATE_ID,
      supportedMetrics: [],
      valuePins: []
    });
    expect(result.layerCombinationResolverTrace?.requiredInputs).toEqual([...MISSING_PHYSICAL_INPUTS]);
    expect(result.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(FIELD_CANDIDATE_ID);
  });

  it("keeps the already owned ceiling board-only single-leaf route calculable", () => {
    const result = calculate(CEILING_BOARD_ONLY_STACK, LAB_OUTPUTS);

    expect(result.acousticAnswerBoundary).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: 3.7,
      estimatedCtrDb: 8,
      estimatedRwDb: 34,
      estimatedStc: 34
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "element_lab",
      route: "ceiling",
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: SINGLE_LEAF_CANDIDATE_ID,
      supportedMetrics: ["Rw", "C", "Ctr", "STC"]
    });
  });

  it("keeps impact and OITC outside the ceiling airborne input-boundary refresh", () => {
    const impact = calculate(
      CEILING_PLENUM_STACK,
      IMPACT_OUTPUTS,
      FLOOR_IMPACT_LOWER_TREATMENT_ROUTE_CONTEXT
    );
    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.acousticAnswerBoundary).toMatchObject({
      origin: "needs_input",
      route: "floor"
    });
    expect(impact.acousticAnswerBoundary?.method).not.toBe(OWNER_METHOD);
    expect(impact.layerCombinationResolverTrace?.route).toBe("floor");
    expect(impact.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(SINGLE_LEAF_CANDIDATE_ID);

    const oitc = calculate(CEILING_PLENUM_STACK, OITC_OUTPUTS);
    expect(oitc.supportedTargetOutputs).toEqual([]);
    expect(oitc.unsupportedTargetOutputs).toEqual([...OITC_OUTPUTS]);
    expect(oitc.acousticAnswerBoundary?.method).not.toBe(OWNER_METHOD);
    expect(oitc.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(NEEDS_INPUT_TRACE_CANDIDATE_ID);
  });

  it("keeps docs and current-gate runner aligned with the refresh handoff", () => {
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
      expect(content, path).toContain(OWNER_METHOD);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("newCalculableRequestShapes: 0");
      expect(content, path).toContain("newCalculableTargetOutputs: 0");
      expect(content, path).toContain("requiredPhysicalInputsCaptured: 0");
      expect(content, path).toContain("runtimeBasisPromotions: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(content, path).toContain("ceilingLeafGrouping");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_METHOD,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_METHOD,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner";
import {
  POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_SELECTED_CANDIDATE_ID,
  POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_WARNING,
  POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_NEEDS_INPUT_METHOD,
  POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_REQUIRED_INPUTS,
  POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_UNSUPPORTED_METHOD,
  POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_UNSUPPORTED_WARNING
} from "./post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_OWNER_PLAN_2026-06-29.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_landed_input_boundary_selected_coverage_refresh";

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_landed_no_runtime_selected_ceiling_roof_suspended_ceiling_route_split_boundary_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after ceiling roof/suspended-ceiling route split boundary coverage refresh";

const NEEDS_INPUT_TRACE_CANDIDATE_ID = "generic.required_input_owner.needs_input_boundary";
const UNSUPPORTED_TRACE_CANDIDATE_ID = "generic.astm_iic_aiic.unsupported_boundary";

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

const PROTECTED_OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  requiredPhysicalInputsCaptured: 4,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 8
} as const;

const CEILING_PLENUM_STACK = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 }
] as const satisfies readonly LayerInput[];

const COMPLETE_PLENUM = {
  absorberFlowResistivityPaSM2: 8000,
  absorberThicknessMm: 100,
  cavityOrPlenumDepthMm: 125,
  leafGrouping: "double_layer_single_leaf_below_plenum",
  leafSurfaceMassKgM2: 22.1,
  supportCouplingOrHangerClass: "resilient_hanger"
} as const;

const AMBIGUOUS_FIELD_CONTEXT = {
  ceilingPlenum: COMPLETE_PLENUM,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const FIELD_CONTEXT = {
  ...AMBIGUOUS_FIELD_CONTEXT,
  hangerOrSupportCouplingClass: "resilient_hanger",
  roofOrCeilingMountingContext: "indoor_ceiling",
  routeIntent: "ceiling_airborne",
  suspendedCeilingAirborneOrImpactIntent: "airborne_ceiling_plenum"
} as const satisfies AirborneContext;

const BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  ceilingPlenum: COMPLETE_PLENUM,
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  hangerOrSupportCouplingClass: "resilient_hanger",
  junctionCouplingLengthM: 4,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  roofOrCeilingMountingContext: "indoor_ceiling",
  routeIntent: "ceiling_airborne",
  sourceRoomVolumeM3: 55,
  suspendedCeilingAirborneOrImpactIntent: "airborne_ceiling_plenum"
} as const satisfies AirborneContext;

const ROOF_CONTEXT = {
  ...FIELD_CONTEXT,
  roofOrCeilingMountingContext: "roof_or_facade_element",
  routeIntent: "roof_airborne",
  suspendedCeilingAirborneOrImpactIntent: "not_suspended_ceiling"
} as const satisfies AirborneContext;

const FLOOR_IMPACT_LOWER_TREATMENT_CONTEXT = {
  ...FIELD_CONTEXT,
  roofOrCeilingMountingContext: "suspended_ceiling_below_floor",
  routeIntent: "suspended_ceiling_floor_impact_lower_treatment",
  suspendedCeilingAirborneOrImpactIntent: "floor_impact_lower_treatment"
} as const satisfies AirborneContext;

const FIELD_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const AMBIGUOUS_OUTPUTS = ["Rw", "STC", "R'w", "DnT,w", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const AIRBORNE_OUTPUTS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/CALCULATOR_OPENING_SEQUENCE_DRIFT_LOCK_2026-06-29.md",
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculate(
  airborneContext: AirborneContext | undefined,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(CEILING_PLENUM_STACK, {
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
      action: PREVIOUS_OWNER_ACTION,
      file: PREVIOUS_OWNER_FILE,
      status: PREVIOUS_OWNER_STATUS
    },
    previousRerank: {
      action: PREVIOUS_RERANK_ACTION,
      file: PREVIOUS_RERANK_FILE,
      status: PREVIOUS_RERANK_STATUS
    },
    protectedOwnerCounters: PROTECTED_OWNER_COUNTERS,
    reProbedCandidateId: POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 ceiling roof/suspended-ceiling route split boundary coverage refresh", () => {
  it("lands the no-runtime refresh and selects the follow-up runtime-first rerank", () => {
    expect(coverageRefreshSummary()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      protectedOwnerCounters: PROTECTED_OWNER_COUNTERS,
      reProbedCandidateId: POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      PREVIOUS_OWNER_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes ambiguous route context as precise needs_input", () => {
    const result = calculate(AMBIGUOUS_FIELD_CONTEXT, AMBIGUOUS_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...AMBIGUOUS_OUTPUTS]);
    expect(result.impact).toBeNull();
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_NEEDS_INPUT_METHOD,
      missingPhysicalInputs: [...POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_REQUIRED_INPUTS],
      origin: "needs_input",
      route: "ceiling",
      unsupportedOutputs: [...AMBIGUOUS_OUTPUTS]
    });
    expect(result.airborneBasis).toMatchObject({
      family: "multileaf_multicavity",
      method: POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_NEEDS_INPUT_METHOD,
      missingPhysicalInputs: [...POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_REQUIRED_INPUTS],
      origin: "needs_input"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "needs_input_boundary",
      route: "ceiling",
      runtimeBasisId: null,
      selectedCandidateId: NEEDS_INPUT_TRACE_CANDIDATE_ID,
      supportedMetrics: [],
      valuePins: []
    });
    expect(result.layerCombinationResolverTrace?.requiredInputs).toEqual([
      ...POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_REQUIRED_INPUTS
    ]);
    expect(result.warnings).toContain(POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_WARNING);
  });

  it("re-probes explicit ceiling-airborne field and building values without moving runtime", () => {
    const field = calculate(FIELD_CONTEXT, FIELD_OUTPUTS);
    const building = calculate(BUILDING_CONTEXT, BUILDING_OUTPUTS);

    expect(field.acousticAnswerBoundary).toBeUndefined();
    expect(field.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(field.metrics).toMatchObject({
      estimatedRwPrimeDb: 47,
      estimatedDnWDb: 44.9,
      estimatedDnADb: 43.2,
      estimatedDnTwDb: 45.7,
      estimatedDnTADb: 44
    });
    expect(field.layerCombinationResolverTrace).toMatchObject({
      route: "ceiling",
      runtimeBasisId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_METHOD,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      supportedMetrics: [...FIELD_OUTPUTS],
      valuePins: [
        { metric: "R'w", value: 47 },
        { metric: "DnT,w", value: 45.7 },
        { metric: "DnT,A", value: 44 },
        { metric: "Dn,w", value: 44.9 },
        { metric: "Dn,A", value: 43.2 }
      ]
    });

    expect(building.acousticAnswerBoundary).toBeUndefined();
    expect(building.supportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(building.metrics).toMatchObject({
      estimatedRwPrimeDb: 47,
      estimatedDnWDb: 44.9,
      estimatedDnADb: 43.2,
      estimatedDnTwDb: 45.7,
      estimatedDnTADb: 44,
      estimatedDnTAkDb: 41.1
    });
    expect(building.layerCombinationResolverTrace).toMatchObject({
      route: "ceiling",
      runtimeBasisId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_METHOD,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: [...BUILDING_OUTPUTS],
      valuePins: [
        { metric: "R'w", value: 47 },
        { metric: "DnT,w", value: 45.7 },
        { metric: "DnT,A", value: 44 },
        { metric: "DnT,A,k", value: 41.1 },
        { metric: "Dn,w", value: 44.9 },
        { metric: "Dn,A", value: 43.2 }
      ]
    });
  });

  it("re-probes wrong-family roof, impact, and airborne aliases as unsupported", () => {
    const roof = calculate(ROOF_CONTEXT, AIRBORNE_OUTPUTS);
    const ceilingImpact = calculate(FIELD_CONTEXT, IMPACT_OUTPUTS);
    const lowerTreatmentAirborne = calculate(FLOOR_IMPACT_LOWER_TREATMENT_CONTEXT, AIRBORNE_OUTPUTS);

    for (const [label, result, outputs] of [
      ["roof", roof, AIRBORNE_OUTPUTS],
      ["ceiling impact", ceilingImpact, IMPACT_OUTPUTS],
      ["lower treatment airborne", lowerTreatmentAirborne, AIRBORNE_OUTPUTS]
    ] as const) {
      expect(result.supportedTargetOutputs, label).toEqual([]);
      expect(result.unsupportedTargetOutputs, label).toEqual([...outputs]);
      expect(result.acousticAnswerBoundary, label).toMatchObject({
        method: POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_UNSUPPORTED_METHOD,
        origin: "unsupported",
        route: "ceiling",
        unsupportedOutputs: [...outputs]
      });
      expect(result.layerCombinationResolverTrace, label).toMatchObject({
        candidateKind: "unsupported_boundary",
        route: "ceiling",
        runtimeBasisId: null,
        selectedCandidateId: UNSUPPORTED_TRACE_CANDIDATE_ID,
        supportedMetrics: [],
        valuePins: []
      });
      expect(result.warnings, label).toContain(POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_UNSUPPORTED_WARNING);
    }
  });

  it("keeps current docs and the current-gate runner aligned with the landed refresh", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_NEEDS_INPUT_METHOD);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("newCalculableRequestShapes: 0");
      expect(content, path).toContain("newCalculableTargetOutputs: 0");
      expect(content, path).toContain("requiredPhysicalInputsCaptured: 0");
      expect(content, path).toContain("runtimeBasisPromotions: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts");
    expect(runner).toContain("post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts");
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_METHOD,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_REQUIRED_INPUTS,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_RUNTIME_CANDIDATE_ID,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_SELECTED_CANDIDATE_ID,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_WARNING,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_METHOD,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_REQUIRED_INPUTS,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_RUNTIME_CANDIDATE_ID
} from "./post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh";
const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_field_building_adapter_owner";

const OWNER_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-29.md";
const OWNER_STATUS =
  "post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_landed_runtime_basis_selected_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const SELECTED_NEXT_LABEL =
  "post-V1 ceiling multileaf airborne plenum field/building adapter owner coverage refresh";

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
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const OITC_OUTPUTS = ["OITC"] as const satisfies readonly RequestedOutputId[];

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 6,
  requiredPhysicalInputsCaptured: 4,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 11,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 6
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

const FIELD_CONTEXT = {
  ceilingPlenum: COMPLETE_PLENUM,
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

const INCOMPLETE_BUILDING_CONTEXT = {
  ceilingPlenum: COMPLETE_PLENUM,
  contextMode: "building_prediction",
  hangerOrSupportCouplingClass: "resilient_hanger",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomVolumeM3: 55,
  roofOrCeilingMountingContext: "indoor_ceiling",
  routeIntent: "ceiling_airborne",
  suspendedCeilingAirborneOrImpactIntent: "airborne_ceiling_plenum"
} as const satisfies AirborneContext;

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

function ownerSummary() {
  return {
    buildingCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    counters: OWNER_COUNTERS,
    fieldCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
    landedGate: OWNER_ACTION,
    previousCoverage: {
      action: PREVIOUS_COVERAGE_ACTION,
      file: PREVIOUS_COVERAGE_FILE,
      status: PREVIOUS_COVERAGE_STATUS
    },
    previousRerank: {
      action: PREVIOUS_RERANK_ACTION,
      file: PREVIOUS_RERANK_FILE,
      status: PREVIOUS_RERANK_STATUS
    },
    runtimeValueMovement: true,
    selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

describe("post-V1 ceiling multileaf airborne plenum field/building adapter owner", () => {
  it("lands the runtime owner and selects the coverage refresh", () => {
    expect(ownerSummary()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      runtimeValueMovement: true,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [PREVIOUS_COVERAGE_FILE, PREVIOUS_RERANK_FILE, OWNER_FILE, OWNER_PLAN_DOC]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("publishes complete ceiling multileaf/plenum field requests from room-normalized formula values", () => {
    const result = calculate(FIELD_CONTEXT, FIELD_OUTPUTS);

    expect(result.acousticAnswerBoundary).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedRwPrimeDb: 47,
      estimatedDnWDb: 44.9,
      estimatedDnADb: 43.2,
      estimatedDnTwDb: 45.7,
      estimatedDnTADb: 44
    });
    expect(result.metrics.estimatedRwDb).not.toBe(result.metrics.estimatedRwPrimeDb);
    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "ISO 12354-1",
      errorBudgetDb: 9,
      family: "multileaf_multicavity",
      method: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.requiredInputs).toEqual([
      ...POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_REQUIRED_INPUTS
    ]);
    expect(result.airborneCandidateResolution).toMatchObject({
      id: "resolver_post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner",
      runtimeValueMovement: true,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_RUNTIME_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "field_apparent",
      candidateKind: "field_building_adapter",
      requestedBasis: "field_apparent",
      route: "ceiling",
      runtimeBasisId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_METHOD,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      supportBucket: "field_adapter",
      supportedMetrics: [...FIELD_OUTPUTS],
      valuePins: [
        { metric: "R'w", value: 47 },
        { metric: "DnT,w", value: 45.7 },
        { metric: "DnT,A", value: 44 },
        { metric: "Dn,w", value: 44.9 },
        { metric: "Dn,A", value: 43.2 }
      ]
    });
    expect(result.warnings).toContain(POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_WARNING);
  });

  it("publishes complete ceiling multileaf/plenum building requests with characteristic DnT,A,k", () => {
    const result = calculate(BUILDING_CONTEXT, BUILDING_OUTPUTS);

    expect(result.acousticAnswerBoundary).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedRwPrimeDb: 47,
      estimatedDnWDb: 44.9,
      estimatedDnADb: 43.2,
      estimatedDnTwDb: 45.7,
      estimatedDnTADb: 44,
      estimatedDnTAkDb: 41.1
    });
    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "ISO 12354-1",
      errorBudgetDb: 9,
      family: "multileaf_multicavity",
      method: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.requiredInputs).toEqual([
      ...POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_REQUIRED_INPUTS
    ]);
    expect(result.airborneCandidateResolution).toMatchObject({
      id: "resolver_post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner",
      runtimeValueMovement: true,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_RUNTIME_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "building_prediction",
      candidateKind: "field_building_adapter",
      requestedBasis: "building_prediction",
      route: "ceiling",
      runtimeBasisId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_METHOD,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportBucket: "field_adapter",
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
    expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain("lab companions stay separate");
  });

  it("keeps missing context, lab aliases, impact, and OITC outside this owner", () => {
    const incomplete = calculate(INCOMPLETE_BUILDING_CONTEXT, BUILDING_OUTPUTS);
    const labAlias = calculate(FIELD_CONTEXT, LAB_OUTPUTS);
    const impact = calculate(FIELD_CONTEXT, IMPACT_OUTPUTS);
    const oitc = calculate(BUILDING_CONTEXT, OITC_OUTPUTS);

    expect(incomplete.supportedTargetOutputs).toEqual([]);
    expect(incomplete.unsupportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(incomplete.acousticAnswerBoundary).toMatchObject({
      method: "post_v1_ceiling_multileaf_airborne_plenum_field_building_context_missing_physical_inputs",
      origin: "needs_input",
      route: "ceiling",
      unsupportedOutputs: [...BUILDING_OUTPUTS]
    });
    expect(incomplete.acousticAnswerBoundary?.missingPhysicalInputs).toEqual(
      expect.arrayContaining([
        "airborneContext.receivingRoomRt60S",
        "airborneContext.sourceRoomVolumeM3",
        "airborneContext.flankingJunctionClass",
        "airborneContext.conservativeFlankingAssumption",
        "airborneContext.junctionCouplingLengthM"
      ])
    );
    expect(incomplete.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    );

    expect(labAlias.supportedTargetOutputs).toEqual([]);
    expect(labAlias.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.impact).toBeNull();
    expect(impact.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );

    expect(oitc.supportedTargetOutputs).toEqual([]);
    expect(oitc.unsupportedTargetOutputs).toEqual(["OITC"]);
    expect(oitc.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps docs and current-gate runner aligned with the landed owner", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("newCalculableRequestShapes: 2");
      expect(content, path).toContain("newCalculableTargetOutputs: 6");
      expect(content, path).toContain("requiredPhysicalInputsCaptured: 4");
      expect(content, path).toContain("runtimeBasisPromotions: 2");
      expect(content, path).toContain("runtimeValuesMoved 11");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts");
    expect(runner).toContain("post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts");
  });
});

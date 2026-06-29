import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_METHOD,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_REQUIRED_INPUTS,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_WARNING
} from "./post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner";
import {
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_METHOD,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_element_lab_formula_owner";

const OWNER_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_PLAN_2026-06-29.md";
const OWNER_STATUS =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_landed_runtime_basis_selected_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const SELECTED_NEXT_LABEL =
  "post-V1 ceiling multileaf airborne plenum element-lab formula owner coverage refresh";

const NEEDS_INPUT_METHOD =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs";
const NEEDS_INPUT_TRACE_CANDIDATE_ID =
  "generic.required_input_owner.needs_input_boundary";

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

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 1,
  newCalculableTargetOutputs: 4,
  requiredPhysicalInputsCaptured: 0,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 4,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 6
} as const;

const CEILING_PLENUM_STACK = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 }
] as const satisfies readonly LayerInput[];

const COMPLETE_CEILING_PLENUM_CONTEXT = {
  contextMode: "element_lab",
  hangerOrSupportCouplingClass: "resilient_hanger",
  roofOrCeilingMountingContext: "indoor_ceiling",
  routeIntent: "ceiling_airborne",
  suspendedCeilingAirborneOrImpactIntent: "airborne_ceiling_plenum",
  ceilingPlenum: {
    absorberFlowResistivityPaSM2: 8000,
    absorberThicknessMm: 100,
    cavityOrPlenumDepthMm: 125,
    leafGrouping: "double_layer_single_leaf_below_plenum",
    leafSurfaceMassKgM2: 22.1,
    supportCouplingOrHangerClass: "resilient_hanger"
  }
} as const satisfies AirborneContext;

const INCOMPLETE_CEILING_PLENUM_CONTEXT = {
  contextMode: "element_lab",
  hangerOrSupportCouplingClass: "resilient_hanger",
  roofOrCeilingMountingContext: "indoor_ceiling",
  routeIntent: "ceiling_airborne",
  suspendedCeilingAirborneOrImpactIntent: "airborne_ceiling_plenum",
  ceilingPlenum: {
    absorberThicknessMm: 100,
    cavityOrPlenumDepthMm: 125,
    leafGrouping: "double_layer_single_leaf_below_plenum",
    leafSurfaceMassKgM2: 22.1,
    supportCouplingOrHangerClass: "resilient_hanger"
  }
} as const satisfies AirborneContext;

const FIELD_CONTEXT = {
  ...COMPLETE_CEILING_PLENUM_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
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
  targetOutputs: readonly RequestedOutputId[],
  airborneContext?: AirborneContext
) {
  return calculateAssembly(CEILING_PLENUM_STACK, {
    airborneContext,
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
    selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

describe("post-V1 ceiling multileaf airborne plenum element-lab formula owner", () => {
  it("lands the runtime owner and selects the coverage refresh", () => {
    expect(ownerSummary()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      runtimeValueMovement: true,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [PREVIOUS_RERANK_FILE, OWNER_FILE, OWNER_PLAN_DOC]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates ceiling-only multileaf/plenum element-lab airborne outputs from complete physical inputs", () => {
    const result = calculate(LAB_OUTPUTS, COMPLETE_CEILING_PLENUM_CONTEXT);

    expect(result.acousticAnswerBoundary).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.7,
      estimatedCtrDb: -6.5,
      estimatedRwDb: 48,
      estimatedStc: 48,
      surfaceMassKgM2: 22.1
    });
    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "engine_double_leaf_cavity",
      curveBasis: "calculated_single_number_estimate",
      errorBudgetDb: 7,
      family: "multileaf_multicavity",
      method: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1"
    });
    expect(result.airborneBasis?.requiredInputs).toEqual([
      ...POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_REQUIRED_INPUTS
    ]);
    expect(result.airborneCandidateResolution).toMatchObject({
      id: "resolver_post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner",
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner",
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "element_lab",
      candidateKind: "source_absent_family_solver",
      errorBudgetMetrics: [...LAB_OUTPUTS],
      requestedBasis: "element_lab",
      route: "ceiling",
      runtimeBasisId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_METHOD,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: [...LAB_OUTPUTS],
      valuePins: [
        { metric: "Rw", value: 48 },
        { metric: "STC", value: 48 },
        { metric: "C", value: -1.7 },
        { metric: "Ctr", value: -6.5 }
      ]
    });
    expect(result.layerCombinationResolverTrace?.requiredInputs).toEqual([
      ...POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_REQUIRED_INPUTS
    ]);
    expect(result.warnings).toContain(
      POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_WARNING
    );
  });

  it("keeps incomplete plenum inputs on the existing needs_input boundary", () => {
    const result = calculate(LAB_OUTPUTS, INCOMPLETE_CEILING_PLENUM_CONTEXT);

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: NEEDS_INPUT_METHOD,
      origin: "needs_input",
      route: "ceiling",
      unsupportedOutputs: [...LAB_OUTPUTS]
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "needs_input_boundary",
      route: "ceiling",
      runtimeBasisId: null,
      selectedCandidateId: NEEDS_INPUT_TRACE_CANDIDATE_ID,
      supportBucket: "needs_input",
      valuePins: []
    });
  });

  it("keeps field values on the later adapter while impact, OITC, and ASTM aliases stay blocked", () => {
    const fieldResult = calculate(FIELD_OUTPUTS, FIELD_CONTEXT);
    const impactResult = calculate(IMPACT_OUTPUTS, COMPLETE_CEILING_PLENUM_CONTEXT);
    const oitcResult = calculate(OITC_OUTPUTS, COMPLETE_CEILING_PLENUM_CONTEXT);

    expect(fieldResult.acousticAnswerBoundary).toBeUndefined();
    expect(fieldResult.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(fieldResult.unsupportedTargetOutputs).toEqual([]);
    expect(fieldResult.metrics).toMatchObject({
      estimatedRwPrimeDb: 47,
      estimatedDnWDb: 44.9,
      estimatedDnADb: 43.2,
      estimatedDnTwDb: 45.7,
      estimatedDnTADb: 44
    });
    expect(fieldResult.airborneBasis).toMatchObject({
      method: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_METHOD,
      origin: "family_physics_prediction"
    });
    expect(fieldResult.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "field_building_adapter",
      requestedBasis: "field_apparent",
      route: "ceiling",
      runtimeBasisId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_METHOD,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      supportedMetrics: [...FIELD_OUTPUTS]
    });
    expect(fieldResult.airborneBasis?.method).not.toBe(
      POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_METHOD
    );

    expect(impactResult.supportedTargetOutputs).toEqual([]);
    expect(impactResult.unsupportedTargetOutputs).toEqual(expect.arrayContaining(["IIC", "AIIC"]));
    expect(impactResult.impact).toBeNull();

    expect(oitcResult.supportedTargetOutputs).toEqual([]);
    expect(oitcResult.unsupportedTargetOutputs).toEqual(["OITC"]);
    expect(oitcResult.airborneBasis?.method).not.toBe(
      POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_METHOD
    );
  });

  it("keeps active documentation synchronized with the landed runtime owner and next coverage refresh", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_LABEL);
    }
  });
});

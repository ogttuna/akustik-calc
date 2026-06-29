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

const COVERAGE_REFRESH_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after ceiling multileaf airborne plenum element-lab formula owner coverage refresh";

const NEEDS_INPUT_METHOD =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs";
const NEEDS_INPUT_TRACE_CANDIDATE_ID =
  "generic.required_input_owner.needs_input_boundary";

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const PARTIAL_LAB_OUTPUTS = ["Rw", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const OITC_OUTPUTS = ["OITC"] as const satisfies readonly RequestedOutputId[];

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
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 0
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
  COVERAGE_REFRESH_PLAN_DOC,
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

function metricSnapshot(result: ReturnType<typeof calculate>) {
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
    reProbedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 ceiling multileaf airborne plenum element-lab formula owner coverage refresh", () => {
  it("lands the no-runtime refresh and selects the follow-up runtime-first rerank", () => {
    expect(coverageRefreshSummary()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      reProbedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID,
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

  it("re-probes complete ceiling plenum element-lab outputs on the owned formula route", () => {
    const result = calculate(LAB_OUTPUTS, COMPLETE_CEILING_PLENUM_CONTEXT);

    expect(result.acousticAnswerBoundary).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(metricSnapshot(result)).toMatchObject({
      C: -1.7,
      Ctr: -6.5,
      Rw: 48,
      STC: 48
    });
    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "engine_double_leaf_cavity",
      curveBasis: "calculated_single_number_estimate",
      family: "multileaf_multicavity",
      method: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1"
    });
    expect(result.airborneBasis?.requiredInputs).toEqual([
      ...POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_REQUIRED_INPUTS
    ]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "element_lab",
      candidateKind: "source_absent_family_solver",
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
    expect(result.warnings).toContain(
      POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_WARNING
    );
  });

  it("keeps partial lab requests request-scoped without widening supported outputs", () => {
    const result = calculate(PARTIAL_LAB_OUTPUTS, COMPLETE_CEILING_PLENUM_CONTEXT);

    expect(result.supportedTargetOutputs).toEqual([...PARTIAL_LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(metricSnapshot(result)).toMatchObject({
      Ctr: -6.5,
      Rw: 48
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      route: "ceiling",
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID,
      supportedMetrics: [...PARTIAL_LAB_OUTPUTS],
      valuePins: [
        { metric: "Rw", value: 48 },
        { metric: "Ctr", value: -6.5 }
      ]
    });
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

  it("keeps field values on the later adapter while impact, OITC, and alias surfaces stay outside the refresh", () => {
    const field = calculate(FIELD_OUTPUTS, FIELD_CONTEXT);
    const impact = calculate(IMPACT_OUTPUTS, COMPLETE_CEILING_PLENUM_CONTEXT);
    const oitc = calculate(OITC_OUTPUTS, COMPLETE_CEILING_PLENUM_CONTEXT);

    expect(field.acousticAnswerBoundary).toBeUndefined();
    expect(field.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
    expect(field.metrics).toMatchObject({
      estimatedRwPrimeDb: 47,
      estimatedDnWDb: 44.9,
      estimatedDnADb: 43.2,
      estimatedDnTwDb: 45.7,
      estimatedDnTADb: 44
    });
    expect(field.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "field_building_adapter",
      requestedBasis: "field_apparent",
      route: "ceiling",
      runtimeBasisId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_METHOD,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      supportedMetrics: [...FIELD_OUTPUTS]
    });
    expect(field.layerCombinationResolverTrace?.runtimeBasisId).not.toBe(
      POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_METHOD
    );

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual(expect.arrayContaining([...IMPACT_OUTPUTS]));
    expect(impact.impact).toBeNull();
    expect(impact.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID
    );

    expect(oitc.supportedTargetOutputs).toEqual([]);
    expect(oitc.unsupportedTargetOutputs).toEqual(["OITC"]);
    expect(oitc.layerCombinationResolverTrace?.runtimeBasisId).not.toBe(
      POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_METHOD
    );
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
      expect(content, path).toContain(POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID);
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
      expect(content, path).toContain("Rw 48");
      expect(content, path).toContain("STC 48");
      expect(content, path).toContain("C -1.7");
      expect(content, path).toContain("Ctr -6.5");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});

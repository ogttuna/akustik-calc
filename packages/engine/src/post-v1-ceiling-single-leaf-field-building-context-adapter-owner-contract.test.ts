import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_landed_no_runtime_selected_ceiling_single_leaf_field_building_context_adapter_owner";

const OWNER_ACTION =
  "post_v1_ceiling_single_leaf_field_building_context_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_OWNER_PLAN_2026-06-26.md";
const OWNER_STATUS =
  "post_v1_ceiling_single_leaf_field_building_context_adapter_owner_landed_runtime_basis_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "ceiling.single_leaf_field_building_context_adapter_owner";
const FIELD_CANDIDATE_ID =
  "ceiling.single_leaf_airborne_field_context_adapter";
const BUILDING_CANDIDATE_ID =
  "ceiling.single_leaf_airborne_building_prediction_adapter";

const SELECTED_NEXT_ACTION =
  "post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const SELECTED_NEXT_LABEL =
  "post-V1 ceiling single-leaf field/building context adapter coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 6,
  requiredPhysicalInputsCaptured: 3,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 11,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 6
} as const;

const CEILING_SINGLE_LEAF_STACK = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 4,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 55
} as const satisfies AirborneContext;

const INCOMPLETE_BUILDING_CONTEXT = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3200
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
const MIXED_BUILDING_OUTPUTS = [
  ...BUILDING_OUTPUTS,
  "Rw",
  "STC"
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
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculate(
  airborneContext: AirborneContext | undefined,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(CEILING_SINGLE_LEAF_STACK, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

function ownerSummary() {
  return {
    counters: OWNER_COUNTERS,
    fieldCandidateId: FIELD_CANDIDATE_ID,
    buildingCandidateId: BUILDING_CANDIDATE_ID,
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

describe("post-V1 ceiling single-leaf field/building context adapter owner", () => {
  it("lands the runtime owner and selects the ceiling field/building coverage refresh", () => {
    expect(ownerSummary()).toMatchObject({
      counters: OWNER_COUNTERS,
      fieldCandidateId: FIELD_CANDIDATE_ID,
      buildingCandidateId: BUILDING_CANDIDATE_ID,
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

  it("publishes complete ceiling field requests on route=ceiling instead of floor or wall", () => {
    const result = calculate(FIELD_CONTEXT, FIELD_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedRwPrimeDb: 33,
      estimatedDnWDb: 33,
      estimatedDnADb: 36.5,
      estimatedDnTwDb: 36,
      estimatedDnTADb: 38.9
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "field_apparent",
      requestedBasis: "field_apparent",
      route: "ceiling",
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: FIELD_CANDIDATE_ID,
      supportedMetrics: [...FIELD_OUTPUTS],
      valuePins: [
        { metric: "R'w", value: 33 },
        { metric: "DnT,w", value: 36 },
        { metric: "DnT,A", value: 38.9 },
        { metric: "Dn,w", value: 33 },
        { metric: "Dn,A", value: 36.5 }
      ]
    });
    expect(result.layerCombinationResolverTrace?.requiredInputs).toEqual(
      expect.arrayContaining([
        "route=ceiling",
        "ceilingOnlyLayerRoles",
        "airborneContext.contextMode=field_between_rooms",
        "airborneContext.receivingRoomVolumeM3",
        "airborneContext.receivingRoomRt60S"
      ])
    );
  });

  it("publishes complete ceiling building requests on the building-prediction basis with lab companions separate", () => {
    const result = calculate(BUILDING_CONTEXT, MIXED_BUILDING_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...MIXED_BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedRwDb: 34,
      estimatedStc: 34,
      estimatedRwPrimeDb: 33,
      estimatedDnWDb: 33,
      estimatedDnADb: 36.5,
      estimatedDnTwDb: 36,
      estimatedDnTADb: 38.9,
      estimatedDnTAkDb: 36
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "building_prediction",
      requestedBasis: "building_prediction",
      route: "ceiling",
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: BUILDING_CANDIDATE_ID,
      supportedMetrics: [...BUILDING_OUTPUTS],
      valuePins: [
        { metric: "R'w", value: 33 },
        { metric: "DnT,w", value: 36 },
        { metric: "DnT,A", value: 38.9 },
        { metric: "DnT,A,k", value: 36 },
        { metric: "Dn,w", value: 33 },
        { metric: "Dn,A", value: 36.5 }
      ]
    });
    expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain(
      "lab companions stay separate"
    );
  });

  it("keeps missing context, impact, and OITC outside this ceiling owner", () => {
    const incomplete = calculate(INCOMPLETE_BUILDING_CONTEXT, BUILDING_OUTPUTS);
    const impact = calculate(FIELD_CONTEXT, IMPACT_OUTPUTS);
    const oitc = calculate(BUILDING_CONTEXT, OITC_OUTPUTS);

    expect(incomplete.supportedTargetOutputs).toEqual([]);
    expect(incomplete.unsupportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(incomplete.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(incomplete.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(BUILDING_CANDIDATE_ID);

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.acousticAnswerBoundary).toMatchObject({
      origin: "needs_input",
      route: "floor"
    });
    expect(impact.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(FIELD_CANDIDATE_ID);
    expect(impact.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(BUILDING_CANDIDATE_ID);

    expect(oitc.supportedTargetOutputs).toEqual([]);
    expect(oitc.unsupportedTargetOutputs).toEqual([...OITC_OUTPUTS]);
    expect(oitc.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(FIELD_CANDIDATE_ID);
    expect(oitc.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(BUILDING_CANDIDATE_ID);
  });

  it("keeps docs and current-gate runner aligned with the landed owner", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(FIELD_CANDIDATE_ID);
      expect(content, path).toContain(BUILDING_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("newCalculableRequestShapes: 2");
      expect(content, path).toContain("newCalculableTargetOutputs: 6");
      expect(content, path).toContain("requiredPhysicalInputsCaptured: 3");
      expect(content, path).toContain("runtimeBasisPromotions: 2");
      expect(content, path).toContain("runtimeValuesMoved 11");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts");
    expect(runner).toContain("post-v1-ceiling-single-leaf-field-building-context-adapter-owner-contract.test.ts");
  });
});

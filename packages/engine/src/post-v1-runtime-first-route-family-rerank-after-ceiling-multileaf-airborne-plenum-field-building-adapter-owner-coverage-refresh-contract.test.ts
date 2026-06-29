import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_METHOD,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_SELECTED_CANDIDATE_ID,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_WARNING,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_METHOD,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh";

const PREVIOUS_OWNER_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-29.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_landed_runtime_basis_selected_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_landed_no_runtime_selected_ceiling_roof_suspended_ceiling_route_split_boundary_owner";

const SELECTED_CANDIDATE_ID =
  "ceiling.roof_suspended_ceiling_route_split_boundary_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_OWNER_PLAN_2026-06-29.md";
const SELECTED_NEXT_LABEL =
  "post-V1 ceiling roof/suspended-ceiling route split boundary owner";

const DRIFT_LOCK_DOC =
  "docs/calculator/CALCULATOR_OPENING_SEQUENCE_DRIFT_LOCK_2026-06-29.md";

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

const SELECTED_REQUIRED_INPUTS = [
  "routeIntent",
  "roofOrCeilingMountingContext",
  "suspendedCeilingAirborneOrImpactIntent",
  "hangerOrSupportCouplingClass"
] as const;

const RERANK_COUNTERS = {
  candidateCount: 7,
  estimatedNextCalculableRequestShapes: 0,
  estimatedNextCalculableTargetOutputs: 0,
  estimatedNextRequiredPhysicalInputsCaptured: 4,
  estimatedNextRuntimeBasisPromotions: 0,
  estimatedNextRuntimeValuesMoved: 0,
  estimatedNextUnsupportedBoundariesProtected: 8,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_after_route_boundary"
  | "rejected_already_landed"
  | "rejected_no_same_basis_evidence"
  | "rejected_support_loop"
  | "rejected_unsafe_without_spectral_adapter"
  | "selected_next_route_split_boundary_owner";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly implementationEvidencePaths: readonly string[];
  readonly reason: string;
  readonly requiredPhysicalInputs: readonly string[];
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly targetOutputsToProtectOrUnlock: readonly RequestedOutputId[];
  readonly unsupportedBoundaries: readonly string[];
};

const CANDIDATES = [
  {
    decision: "selected_next_route_split_boundary_owner",
    estimatedRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    implementationEvidencePaths: [
      PREVIOUS_OWNER_FILE,
      PREVIOUS_COVERAGE_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      PREVIOUS_COVERAGE_PLAN_DOC,
      DRIFT_LOCK_DOC
    ],
    reason:
      "The ceiling multileaf/plenum lab, field, and building routes are now owned and protected. The highest-ROI next behavior is a narrow route/input boundary that prevents roof, ceiling, suspended-ceiling airborne, and suspended-ceiling impact stacks from entering the wrong family before more formula widening.",
    requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS,
    routeFamily: "ceiling.roof_suspended_ceiling.route_boundary",
    selected: true,
    targetOutputsToProtectOrUnlock: [...LAB_OUTPUTS, ...FIELD_OUTPUTS, ...IMPACT_OUTPUTS],
    unsupportedBoundaries: [
      "no route promotion by layer role or product name alone",
      "no floor impact values from ceiling airborne stacks",
      "no ceiling airborne values from floor lower-treatment impact stacks",
      "no roof or facade promotion without route-owned context",
      "no lab Rw copy into field or building outputs",
      "missing route intent remains needs_input",
      "OITC remains opening/facade spectral-only",
      "no source-row proximity or confidence fallback"
    ]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.multileaf_airborne_plenum_field_building_adapter_owner",
    implementationEvidencePaths: [PREVIOUS_OWNER_FILE, PREVIOUS_COVERAGE_FILE, PREVIOUS_OWNER_PLAN_DOC],
    reason:
      "The ceiling plenum field/building adapter already landed and its coverage refresh is now green. Re-selecting it would be a support loop rather than a fresh calculator boundary.",
    requiredPhysicalInputs: [
      "airborneContext.ceilingPlenum.*",
      "airborneContext.panelWidthHeight",
      "airborneContext.receivingRoomVolumeM3",
      "airborneContext.receivingRoomRt60S",
      "airborneContext.sourceRoomVolumeM3",
      "airborneContext.flankingJunctionClass",
      "airborneContext.conservativeFlankingAssumption",
      "airborneContext.junctionCouplingLengthM"
    ],
    routeFamily: "ceiling.multileaf_airborne.plenum_field_building_adapter",
    selected: false,
    targetOutputsToProtectOrUnlock: BUILDING_OUTPUTS,
    unsupportedBoundaries: ["no re-landing already protected runtime values"]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.multileaf_airborne_plenum_element_lab_formula_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts",
      "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts",
      DRIFT_LOCK_DOC
    ],
    reason:
      "The plenum element-lab formula route is already landed and protected. It should stay pinned while the next owner cleans route boundaries.",
    requiredPhysicalInputs: ["airborneContext.ceilingPlenum.*"],
    routeFamily: "ceiling.multileaf_airborne.plenum_element_lab_formula",
    selected: false,
    targetOutputsToProtectOrUnlock: LAB_OUTPUTS,
    unsupportedBoundaries: ["no re-landing already protected element-lab values"]
  },
  {
    decision: "rejected_after_route_boundary",
    estimatedRuntimeValuesMoved: 2,
    id: "floor.impact_iic_aiic_rating_owner",
    implementationEvidencePaths: [
      "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts",
      DRIFT_LOCK_DOC
    ],
    reason:
      "IIC/AIIC is the next market-facing impact metric family, but the drift-lock sequence puts it after the ceiling/roof/suspended-ceiling route boundary so impact ratings do not inherit ambiguous ceiling stacks.",
    requiredPhysicalInputs: ["impactSpectrumOrRatingCurve", "astmRatingProcedure", "labOrFieldImpactBasis"],
    routeFamily: "floor.impact.astm_iic_aiic_rating",
    selected: false,
    targetOutputsToProtectOrUnlock: IMPACT_OUTPUTS,
    unsupportedBoundaries: ["no IIC/AIIC alias from Ln,w or DeltaLw"]
  },
  {
    decision: "rejected_unsafe_without_spectral_adapter",
    estimatedRuntimeValuesMoved: 1,
    id: "opening.facade_outdoor_indoor_oitc_spectral_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-owner-contract.test.ts",
      DRIFT_LOCK_DOC
    ],
    reason:
      "OITC stays high value, but it needs its owned outdoor-indoor spectral adapter and follows IIC/AIIC in the documented sequence.",
    requiredPhysicalInputs: ["outdoorIndoorTransmissionLossCurve", "facadeOpeningAreaContext", "roomNormalizationContext"],
    routeFamily: "opening.facade_outdoor_indoor.oitc_spectral_runtime",
    selected: false,
    targetOutputsToProtectOrUnlock: OITC_OUTPUTS,
    unsupportedBoundaries: ["no STC-to-OITC alias", "no Rw-to-OITC alias", "no NISR/ISR-to-OITC alias"]
  },
  {
    decision: "rejected_no_same_basis_evidence",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.multileaf_airborne_plenum_formula_accuracy_calibration",
    implementationEvidencePaths: [PREVIOUS_OWNER_FILE, PREVIOUS_COVERAGE_FILE, DRIFT_LOCK_DOC],
    reason:
      "Calibration is important after the mature ceiling routes are classified. No same-family same-basis holdout packet is selected, and broad source crawling is explicitly out of scope.",
    requiredPhysicalInputs: ["sameFamilySameBasisPlenumHoldoutRows"],
    routeFamily: "ceiling.multileaf_airborne.plenum_formula_calibration",
    selected: false,
    targetOutputsToProtectOrUnlock: LAB_OUTPUTS,
    unsupportedBoundaries: ["no retune from source-absent formula outputs alone"]
  },
  {
    decision: "rejected_support_loop",
    estimatedRuntimeValuesMoved: 0,
    id: "broad_source_crawl_confidence_label_or_frontend_polish",
    implementationEvidencePaths: ["AGENTS.md", "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md", DRIFT_LOCK_DOC],
    reason:
      "This work would not open or protect a bounded calculator behavior. It is explicitly rejected by the north-star and opening-sequence drift lock.",
    requiredPhysicalInputs: [],
    routeFamily: "support.non_calculator_drift",
    selected: false,
    targetOutputsToProtectOrUnlock: [],
    unsupportedBoundaries: ["no broad support drift after this rerank"]
  }
] as const satisfies readonly Candidate[];

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

const CURRENT_AUTHORITY_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  DRIFT_LOCK_DOC,
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculate(
  airborneContext: AirborneContext,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(CEILING_PLENUM_STACK, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

describe("post-V1 runtime-first route-family rerank after ceiling multileaf airborne plenum field/building adapter owner coverage refresh", () => {
  it("lands the no-runtime rerank and selects the ceiling/roof/suspended-ceiling route boundary owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_OWNER_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_OWNER_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(CANDIDATES).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(CANDIDATES.filter((candidate) => candidate.selected)).toHaveLength(1);
    expect(CANDIDATES.find((candidate) => candidate.selected)).toMatchObject({
      decision: "selected_next_route_split_boundary_owner",
      id: SELECTED_CANDIDATE_ID,
      requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS
    });
    expect(RERANK_COUNTERS).toMatchObject({
      estimatedNextCalculableRequestShapes: 0,
      estimatedNextCalculableTargetOutputs: 0,
      estimatedNextRequiredPhysicalInputsCaptured: 4,
      estimatedNextRuntimeBasisPromotions: 0,
      estimatedNextRuntimeValuesMoved: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("keeps the just-landed ceiling plenum field and building values pinned while reranking", () => {
    const field = calculate(FIELD_CONTEXT, FIELD_OUTPUTS);
    const building = calculate(BUILDING_CONTEXT, BUILDING_OUTPUTS);

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
      route: "ceiling",
      runtimeBasisId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_METHOD,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      valuePins: [
        { metric: "R'w", value: 47 },
        { metric: "DnT,w", value: 45.7 },
        { metric: "DnT,A", value: 44 },
        { metric: "Dn,w", value: 44.9 },
        { metric: "Dn,A", value: 43.2 }
      ]
    });
    expect(field.warnings).toContain(POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_WARNING);

    expect(building.supportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(building.unsupportedTargetOutputs).toEqual([]);
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

  it("ties every candidate decision to current implementation or planning evidence", () => {
    for (const candidate of CANDIDATES) {
      expect(candidate.implementationEvidencePaths.length, candidate.id).toBeGreaterThan(0);

      for (const evidencePath of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, evidencePath)), `${candidate.id}: ${evidencePath}`).toBe(true);
      }
    }
  });

  it("rejects already-landed owners, unsafe aliases, unsupported spectral work, and support drift", () => {
    expect(CANDIDATES.find((candidate) => candidate.id === POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_SELECTED_CANDIDATE_ID)).toMatchObject({
      decision: "rejected_already_landed"
    });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("iic_aiic"))).toMatchObject({
      decision: "rejected_after_route_boundary",
      unsupportedBoundaries: ["no IIC/AIIC alias from Ln,w or DeltaLw"]
    });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("oitc"))).toMatchObject({
      decision: "rejected_unsafe_without_spectral_adapter"
    });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("calibration"))).toMatchObject({
      decision: "rejected_no_same_basis_evidence"
    });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("source_crawl"))).toMatchObject({
      decision: "rejected_support_loop"
    });
  });

  it("keeps current docs aligned with the selected route-boundary owner", () => {
    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_FILE);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("candidateCount: 7");
      expect(content, path).toContain("estimatedNextCalculableRequestShapes: 0");
      expect(content, path).toContain("estimatedNextCalculableTargetOutputs: 0");
      expect(content, path).toContain("estimatedNextRequiredPhysicalInputsCaptured: 4");
      expect(content, path).toContain("estimatedNextRuntimeBasisPromotions: 0");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 0");
      expect(content, path).toContain("estimatedNextUnsupportedBoundariesProtected: 8");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(RERANK_FILE.replace("packages/engine/", ""));
  });
});

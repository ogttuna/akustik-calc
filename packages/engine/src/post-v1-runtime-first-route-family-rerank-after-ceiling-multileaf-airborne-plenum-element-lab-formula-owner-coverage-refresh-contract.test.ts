import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_METHOD,
  POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID
} from "./post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh";

const PREVIOUS_OWNER_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_PLAN_2026-06-29.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_landed_runtime_basis_selected_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_field_building_adapter_owner";

const SELECTED_CANDIDATE_ID =
  "ceiling.multileaf_airborne_plenum_field_building_adapter_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-29.md";
const SELECTED_NEXT_LABEL =
  "post-V1 ceiling multileaf airborne plenum field/building adapter owner";

const DRIFT_LOCK_DOC =
  "docs/calculator/CALCULATOR_OPENING_SEQUENCE_DRIFT_LOCK_2026-06-29.md";

const CEILING_PLENUM_FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const CEILING_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const OITC_OUTPUTS = ["OITC"] as const satisfies readonly RequestedOutputId[];

const SELECTED_REQUIRED_INPUTS = [
  "airborneContext.ceilingPlenum.*",
  "airborneContext.panelWidthHeight",
  "airborneContext.receivingRoomVolumeM3",
  "airborneContext.receivingRoomRt60S",
  "airborneContext.sourceRoomVolumeM3",
  "airborneContext.flankingJunctionClass",
  "airborneContext.conservativeFlankingAssumption",
  "airborneContext.junctionCouplingLengthM"
] as const;

const RERANK_COUNTERS = {
  candidateCount: 7,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 6,
  estimatedNextRequiredPhysicalInputsCaptured: 4,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 11,
  estimatedNextUnsupportedBoundariesProtected: 6,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_lower_roi_after_field_building"
  | "rejected_no_same_basis_evidence"
  | "rejected_support_loop"
  | "rejected_unsafe_without_spectral_adapter"
  | "selected_next_field_building_adapter_owner";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly implementationEvidencePaths: readonly string[];
  readonly reason: string;
  readonly requiredPhysicalInputs: readonly string[];
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly targetOutputsToUnlock: readonly RequestedOutputId[];
  readonly unsupportedBoundaries: readonly string[];
};

const CANDIDATES = [
  {
    decision: "selected_next_field_building_adapter_owner",
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
      "The ceiling multileaf/plenum element-lab formula route is now owned and protected. The highest-ROI next calculator behavior is to adapt that route to field and building metrics through explicit room, reverberation, and flanking context instead of copying lab Rw into apparent or standardized outputs.",
    requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS,
    routeFamily: "ceiling.multileaf_airborne.plenum_field_building_adapter",
    selected: true,
    targetOutputsToUnlock: CEILING_PLENUM_FIELD_BUILDING_OUTPUTS,
    unsupportedBoundaries: [
      "no lab Rw copy into R'w, Dn,w, DnT,w, Dn,A, or DnT,A",
      "missing room or flanking context remains needs_input",
      "no floor-impact suspended-ceiling fallback",
      "no OITC or outdoor-indoor facade alias",
      "no ASTM IIC/AIIC alias",
      "no source-row proximity or confidence fallback"
    ]
  },
  {
    decision: "rejected_lower_roi_after_field_building",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.roof_suspended_ceiling_route_split_boundary_owner",
    implementationEvidencePaths: [DRIFT_LOCK_DOC, "AGENTS.md"],
    reason:
      "Route split boundaries are next in the drift-lock sequence, but the just-landed lab route now unlocks more user-visible calculator scope through field/building outputs first.",
    requiredPhysicalInputs: ["routeIntent", "roofOrCeilingMountingContext", "hangerOrSupportClass"],
    routeFamily: "ceiling.roof_suspended_ceiling.route_boundary",
    selected: false,
    targetOutputsToUnlock: CEILING_LAB_OUTPUTS,
    unsupportedBoundaries: ["no route promotion by layer role name alone"]
  },
  {
    decision: "rejected_no_same_basis_evidence",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.multileaf_airborne_plenum_formula_accuracy_calibration",
    implementationEvidencePaths: [PREVIOUS_OWNER_FILE, PREVIOUS_COVERAGE_FILE, DRIFT_LOCK_DOC],
    reason:
      "Calibration is useful, but no same-family same-basis holdout packet is selected. Field/building adaptation opens more calculator surface without broad source crawling.",
    requiredPhysicalInputs: ["sameFamilySameBasisPlenumHoldoutRows"],
    routeFamily: "ceiling.multileaf_airborne.plenum_formula_calibration",
    selected: false,
    targetOutputsToUnlock: CEILING_LAB_OUTPUTS,
    unsupportedBoundaries: ["no retune from source-absent formula outputs alone"]
  },
  {
    decision: "rejected_lower_roi_after_field_building",
    estimatedRuntimeValuesMoved: 2,
    id: "floor.impact_iic_aiic_rating_owner",
    implementationEvidencePaths: [
      "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts",
      DRIFT_LOCK_DOC
    ],
    reason:
      "IIC/AIIC remains high value, but the active route-family context is ceiling airborne. Impact ratings should follow after the current ceiling field/building opening sequence.",
    requiredPhysicalInputs: ["impactSpectrumOrRatingCurve", "astmRatingProcedure", "labOrFieldImpactBasis"],
    routeFamily: "floor.impact.astm_iic_aiic_rating",
    selected: false,
    targetOutputsToUnlock: IMPACT_OUTPUTS,
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
      "OITC is high value, but the active bridge intentionally keeps outdoor-indoor facade requests unsupported until the spectral rating adapter is owned. It should not interrupt the ceiling plenum field/building owner.",
    requiredPhysicalInputs: ["outdoorIndoorTransmissionLossCurve", "facadeOpeningAreaContext", "roomNormalizationContext"],
    routeFamily: "opening.facade_outdoor_indoor.oitc_spectral_runtime",
    selected: false,
    targetOutputsToUnlock: OITC_OUTPUTS,
    unsupportedBoundaries: ["no STC-to-OITC alias", "no Rw-to-OITC alias", "no NISR/ISR-to-OITC alias"]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.multileaf_airborne_plenum_element_lab_formula_owner",
    implementationEvidencePaths: [PREVIOUS_OWNER_FILE, PREVIOUS_COVERAGE_FILE, PREVIOUS_OWNER_PLAN_DOC],
    reason:
      "The plenum element-lab formula owner and coverage refresh are already landed. Re-landing them would be a support loop instead of a fresh calculator behavior.",
    requiredPhysicalInputs: ["airborneContext.ceilingPlenum.*"],
    routeFamily: "ceiling.multileaf_airborne.plenum_element_lab_formula",
    selected: false,
    targetOutputsToUnlock: CEILING_LAB_OUTPUTS,
    unsupportedBoundaries: ["no re-landing already protected runtime values"]
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
    targetOutputsToUnlock: [],
    unsupportedBoundaries: ["no broad support drift after this rerank"]
  }
] as const satisfies readonly Candidate[];

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
  targetOutputs: readonly RequestedOutputId[],
  airborneContext?: AirborneContext
) {
  return calculateAssembly(CEILING_PLENUM_STACK, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

describe("post-V1 runtime-first route-family rerank after ceiling multileaf airborne plenum element-lab formula owner coverage refresh", () => {
  it("lands the no-runtime rerank and selects the ceiling plenum field/building adapter owner", () => {
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
      decision: "selected_next_field_building_adapter_owner",
      id: SELECTED_CANDIDATE_ID,
      requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS,
      targetOutputsToUnlock: CEILING_PLENUM_FIELD_BUILDING_OUTPUTS
    });
    expect(RERANK_COUNTERS).toMatchObject({
      estimatedNextCalculableRequestShapes: 2,
      estimatedNextCalculableTargetOutputs: 6,
      estimatedNextRequiredPhysicalInputsCaptured: 4,
      estimatedNextRuntimeBasisPromotions: 2,
      estimatedNextRuntimeValuesMoved: 11,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("keeps the just-landed plenum element-lab formula pinned while reranking", () => {
    const result = calculate(CEILING_LAB_OUTPUTS, COMPLETE_CEILING_PLENUM_CONTEXT);

    expect(result.supportedTargetOutputs).toEqual([...CEILING_LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.7,
      estimatedCtrDb: -6.5,
      estimatedRwDb: 48,
      estimatedStc: 48
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      route: "ceiling",
      runtimeBasisId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_METHOD,
      selectedCandidateId: POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID,
      valuePins: [
        { metric: "Rw", value: 48 },
        { metric: "STC", value: 48 },
        { metric: "C", value: -1.7 },
        { metric: "Ctr", value: -6.5 }
      ]
    });
  });

  it("ties every candidate decision to present implementation or planning evidence", () => {
    for (const candidate of CANDIDATES) {
      expect(candidate.implementationEvidencePaths.length, candidate.id).toBeGreaterThan(0);

      for (const evidencePath of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, evidencePath)), `${candidate.id}: ${evidencePath}`).toBe(true);
      }
    }
  });

  it("rejects unsafe sequencing, metric aliases, and support drift", () => {
    expect(CANDIDATES.find((candidate) => candidate.id.includes("route_split"))).toMatchObject({
      decision: "rejected_lower_roi_after_field_building"
    });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("calibration"))).toMatchObject({
      decision: "rejected_no_same_basis_evidence"
    });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("oitc"))).toMatchObject({
      decision: "rejected_unsafe_without_spectral_adapter"
    });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("iic_aiic"))?.unsupportedBoundaries).toEqual(
      expect.arrayContaining(["no IIC/AIIC alias from Ln,w or DeltaLw"])
    );
    expect(CANDIDATES.find((candidate) => candidate.id.includes("source_crawl"))).toMatchObject({
      decision: "rejected_support_loop"
    });
  });

  it("keeps current docs aligned with the selected field/building adapter owner", () => {
    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_METHOD);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_FILE);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("candidateCount: 7");
      expect(content, path).toContain("estimatedNextCalculableRequestShapes: 2");
      expect(content, path).toContain("estimatedNextCalculableTargetOutputs: 6");
      expect(content, path).toContain("estimatedNextRequiredPhysicalInputsCaptured: 4");
      expect(content, path).toContain("estimatedNextRuntimeBasisPromotions: 2");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 11");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(RERANK_FILE.replace("packages/engine/", ""));
  });
});

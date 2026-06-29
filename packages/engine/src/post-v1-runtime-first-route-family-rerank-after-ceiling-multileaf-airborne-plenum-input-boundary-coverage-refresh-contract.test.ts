import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh";

const PREVIOUS_OWNER_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_OWNER_PLAN_2026-06-29.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_landed_input_boundary_selected_coverage_refresh";
const PROTECTED_BOUNDARY_METHOD =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_element_lab_formula_owner";

const SELECTED_CANDIDATE_ID =
  "ceiling.multileaf_airborne_plenum_element_lab_formula_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_PLAN_2026-06-29.md";
const SELECTED_NEXT_LABEL =
  "post-V1 ceiling multileaf airborne plenum element-lab formula owner";

const DRIFT_LOCK_DOC =
  "docs/calculator/CALCULATOR_OPENING_SEQUENCE_DRIFT_LOCK_2026-06-29.md";

const CEILING_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const CEILING_FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const OITC_OUTPUTS = ["OITC"] as const satisfies readonly RequestedOutputId[];

const SELECTED_REQUIRED_INPUTS = [
  "ceilingLeafGrouping",
  "ceilingLeafSurfaceMassKgM2",
  "ceilingCavityOrPlenumDepthMm",
  "ceilingAbsorberThicknessAndFlowResistivity",
  "ceilingSupportCouplingOrHangerClass"
] as const;

const RERANK_COUNTERS = {
  candidateCount: 7,
  estimatedNextCalculableRequestShapes: 1,
  estimatedNextCalculableTargetOutputs: 4,
  estimatedNextRequiredPhysicalInputsCaptured: 0,
  estimatedNextRuntimeBasisPromotions: 1,
  estimatedNextRuntimeValuesMoved: 4,
  estimatedNextUnsupportedBoundariesProtected: 6,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_after_lab_owner"
  | "rejected_lower_roi_until_formula_exists"
  | "rejected_no_same_basis_evidence"
  | "rejected_support_loop"
  | "rejected_unsafe_without_spectral_adapter"
  | "selected_next_formula_owner";

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
    decision: "selected_next_formula_owner",
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
      "The current boundary already names the physical inputs that make ceiling board plus plenum/cavity/fill stacks different from single-leaf ceilings. The highest-ROI next calculator behavior is to consume those inputs in an owned element-lab formula route and publish Rw/STC/C/Ctr only for the bounded ceiling airborne family.",
    requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS,
    routeFamily: "ceiling.multileaf_airborne.plenum_element_lab_formula",
    selected: true,
    targetOutputsToUnlock: CEILING_LAB_OUTPUTS,
    unsupportedBoundaries: [
      "keep the landed needs_input boundary when any required plenum formula input is missing",
      "no ceiling field/building adapter until the element-lab route exists",
      "no floor-impact suspended-ceiling fallback",
      "no OITC or outdoor-indoor facade alias",
      "no ASTM IIC/AIIC alias",
      "no source-row proximity or confidence fallback"
    ]
  },
  {
    decision: "rejected_after_lab_owner",
    estimatedRuntimeValuesMoved: 6,
    id: "ceiling.multileaf_airborne_plenum_field_building_adapter_owner",
    implementationEvidencePaths: [PREVIOUS_COVERAGE_FILE, DRIFT_LOCK_DOC],
    reason:
      "Field/building metrics are the next ceiling-plenum step, but they must consume an owned element-lab route and explicit room/flanking context. Selecting them before the formula owner would invite lab-to-field copying.",
    requiredPhysicalInputs: [
      ...SELECTED_REQUIRED_INPUTS,
      "elementAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "flankingOrJunctionContext"
    ],
    routeFamily: "ceiling.multileaf_airborne.plenum_field_building_adapter",
    selected: false,
    targetOutputsToUnlock: CEILING_FIELD_BUILDING_OUTPUTS,
    unsupportedBoundaries: ["no lab Rw copy into R'w/Dn,w/DnT,w", "no missing flanking defaults"]
  },
  {
    decision: "rejected_lower_roi_until_formula_exists",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.roof_suspended_ceiling_route_split_boundary_owner",
    implementationEvidencePaths: [DRIFT_LOCK_DOC, "AGENTS.md"],
    reason:
      "Route split boundaries are still important, but the selected plenum input boundary already prevents the immediate wrong single-leaf/floor-impact fallbacks. The formula owner now moves more calculator scope.",
    requiredPhysicalInputs: ["routeIntent", "roofOrCeilingMountingContext", "hangerOrSupportClass"],
    routeFamily: "ceiling.roof_suspended_ceiling.route_boundary",
    selected: false,
    targetOutputsToUnlock: CEILING_LAB_OUTPUTS,
    unsupportedBoundaries: ["no route promotion by layer role name alone"]
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
      "OITC is high value, but the active bridge intentionally keeps outdoor-indoor facade requests unsupported until the spectral rating adapter is owned. It should follow the current ceiling formula sequence.",
    requiredPhysicalInputs: ["outdoorIndoorTransmissionLossCurve", "facadeOpeningAreaContext", "roomNormalizationContext"],
    routeFamily: "opening.facade_outdoor_indoor.oitc_spectral_runtime",
    selected: false,
    targetOutputsToUnlock: OITC_OUTPUTS,
    unsupportedBoundaries: ["no STC-to-OITC alias", "no Rw-to-OITC alias", "no NISR/ISR-to-OITC alias"]
  },
  {
    decision: "rejected_lower_roi_until_formula_exists",
    estimatedRuntimeValuesMoved: 2,
    id: "floor.impact_iic_aiic_rating_owner",
    implementationEvidencePaths: [
      "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts",
      DRIFT_LOCK_DOC
    ],
    reason:
      "IIC/AIIC remains on the drift-lock sequence, but the current route-family context is ceiling airborne. ASTM impact ratings should not interrupt the first ceiling multileaf formula opening.",
    requiredPhysicalInputs: ["impactSpectrumOrRatingCurve", "astmRatingProcedure", "labOrFieldImpactBasis"],
    routeFamily: "floor.impact.astm_iic_aiic_rating",
    selected: false,
    targetOutputsToUnlock: IMPACT_OUTPUTS,
    unsupportedBoundaries: ["no IIC/AIIC alias from Ln,w or DeltaLw"]
  },
  {
    decision: "rejected_no_same_basis_evidence",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.single_leaf_airborne_calibration_holdout_packet",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-owner-contract.test.ts",
      "packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts"
    ],
    reason:
      "Calibration is useful after wider ceiling coverage exists. No selected same-family same-basis holdout packet currently outranks opening a new plenum formula family.",
    requiredPhysicalInputs: ["sameFamilySameBasisCeilingHoldoutRows"],
    routeFamily: "ceiling.single_leaf_airborne.calibration",
    selected: false,
    targetOutputsToUnlock: CEILING_LAB_OUTPUTS,
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
    targetOutputsToUnlock: [],
    unsupportedBoundaries: ["no broad support drift after this rerank"]
  }
] as const satisfies readonly Candidate[];

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

describe("post-V1 runtime-first route-family rerank after ceiling multileaf airborne plenum input-boundary coverage refresh", () => {
  it("lands the no-runtime rerank and selects the ceiling plenum element-lab formula owner", () => {
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
      decision: "selected_next_formula_owner",
      id: SELECTED_CANDIDATE_ID,
      requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS,
      targetOutputsToUnlock: CEILING_LAB_OUTPUTS
    });
    expect(RERANK_COUNTERS).toMatchObject({
      estimatedNextCalculableRequestShapes: 1,
      estimatedNextCalculableTargetOutputs: 4,
      estimatedNextRequiredPhysicalInputsCaptured: 0,
      estimatedNextRuntimeBasisPromotions: 1,
      estimatedNextRuntimeValuesMoved: 4,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
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
    expect(CANDIDATES.find((candidate) => candidate.id.includes("field_building_adapter"))).toMatchObject({
      decision: "rejected_after_lab_owner"
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

  it("keeps current docs aligned with the selected formula owner", () => {
    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(PROTECTED_BOUNDARY_METHOD);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_FILE);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("candidateCount: 7");
      expect(content, path).toContain("estimatedNextCalculableRequestShapes: 1");
      expect(content, path).toContain("estimatedNextCalculableTargetOutputs: 4");
      expect(content, path).toContain("estimatedNextRuntimeBasisPromotions: 1");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 4");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(RERANK_FILE.replace("packages/engine/", ""));
  });
});

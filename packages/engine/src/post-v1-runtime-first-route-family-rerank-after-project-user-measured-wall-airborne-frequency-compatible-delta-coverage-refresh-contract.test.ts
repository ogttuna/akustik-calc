import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
} from "./project-user-measured-wall-airborne-frequency-compatible-delta";
import {
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
} from "./project-user-measured-wall-airborne-frequency-exact-curve-bridge";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";
const PREVIOUS_RUNTIME_METHOD =
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD;

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_adapter_owner";
const SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_airborne_frequency_field_building_adapter_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 project/user measured wall airborne frequency field/building adapter owner";

const CALCULATE_ASSEMBLY_FILE = "packages/engine/src/calculate-assembly.ts";
const CURVE_RATING_FILE = "packages/engine/src/curve-rating.ts";
const SOURCE_ROW_COMPATIBLE_DELTA_FILE = "packages/engine/src/post-v1-wall-compatible-anchor-delta.ts";
const EXACT_CURVE_BRIDGE_FILE =
  "packages/engine/src/project-user-measured-wall-airborne-frequency-exact-curve-bridge.ts";
const COMPATIBLE_DELTA_FILE =
  "packages/engine/src/project-user-measured-wall-airborne-frequency-compatible-delta.ts";
const HIGH_ROI_SELECTION_PLAN_DOC = "docs/calculator/HIGH_ROI_CALCULATOR_IMPLEMENTATION_SELECTION_PLAN_2026-06-18.md";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 4,
  estimatedNextCalculableTargetOutputs: 20,
  estimatedNextRequiredPhysicalInputsCaptured: 9,
  estimatedNextRuntimeBasisPromotions: 4,
  estimatedNextRuntimeValuesMoved: 20,
  estimatedNextUnsupportedBoundariesProtected: 7,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_alias_risk"
  | "rejected_context_or_evidence_missing"
  | "rejected_frontend_first"
  | "rejected_other_agent_conflict"
  | "rejected_too_broad"
  | "selected_runtime_owner_ready";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly id: string;
  readonly reason: string;
  readonly requiredInputsOrEvidence: readonly string[];
  readonly routeFamily: string;
  readonly runtimeOwnerAuthorizedNext: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
};

const SELECTED_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_runtime_owner_ready",
    id: SELECTED_CANDIDATE_ID,
    reason:
      "Exact and compatible project/user measured wall airborne frequency routes now own a direct lab TL curve for the separating element. The highest bounded ROI is to feed that owned curve into the existing Gate I / Gate AR field-building adapters when explicit room, area, and flanking context is present, instead of leaving R'w, Dn,w, Dn,A, DnT,w, and DnT,A unsupported or calculated from a lower-priority generic wall route.",
    requiredInputsOrEvidence: [
      "airborneMeasuredFrequencySourceAnchors",
      "exactFullStackOrReducedStackMeasuredCurveFingerprint",
      "calculatedTransmissionLossCurve",
      "airborneContext.contextMode=field_between_rooms_or_building_prediction",
      "airborneContext.panelWidthHeight",
      "airborneContext.receivingRoomVolumeM3",
      "airborneContext.receivingRoomRt60S",
      "airborneContext.sourceRoomVolumeM3",
      "airborneContext.flankingJunctionClass_for_building_prediction"
    ],
    routeFamily: "wall.project_user_measured_frequency_curve.field_building_adapter",
    runtimeOwnerAuthorizedNext: true,
    targetOutputs: SELECTED_TARGET_OUTPUTS
  },
  {
    decision: "rejected_too_broad",
    id: "user_material_physical_input_coverage_owner",
    reason:
      "User-material physical input coverage remains strategically highest, but this rerank has a narrower measured-curve field/building owner that can move values immediately through already-owned curve and adapter infrastructure.",
    requiredInputsOrEvidence: [
      "leafGrouping",
      "supportTopology",
      "supportSpacing",
      "cavityDepth",
      "absorberFlowResistivity"
    ],
    routeFamily: "wall.user_material_physical_inputs",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: SELECTED_TARGET_OUTPUTS
  },
  {
    decision: "rejected_too_broad",
    id: "generic_building_prediction_flanking_runtime_owner",
    reason:
      "Building prediction and flanking are high ROI, but a generic cross-family owner is larger than this slice. The selected owner is the bounded version: exact/compatible measured wall TL curve plus explicit Gate I / Gate AR context.",
    requiredInputsOrEvidence: [
      "routeFamilyMatrix",
      "junctionCatalog",
      "flankingPathSet",
      "crossFamilyValidation"
    ],
    routeFamily: "wall.building_prediction_flanking.generic",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: SELECTED_TARGET_OUTPUTS
  },
  {
    decision: "rejected_too_broad",
    id: "frequency_band_backbone_generalization_owner",
    reason:
      "Frequency-band backbone work remains the long-term accuracy ceiling, but the exact and compatible measured-frequency wall curve routes are already live. The next value-moving step should use those curves for field/building metrics before broadening the whole backbone.",
    requiredInputsOrEvidence: [
      "routeCurveIdentity",
      "curveStorageContract",
      "ratingAdapterInventory",
      "negativeAliasTests"
    ],
    routeFamily: "frequency_band_backbone",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: SELECTED_TARGET_OUTPUTS
  },
  {
    decision: "rejected_alias_risk",
    id: "companion_metric_completeness_from_scalar_owner",
    reason:
      "Companion completeness is valid only when a spectrum or rating basis owns the metric. Scalar measured Rw anchors still cannot publish STC, C, Ctr, OITC, R'w, Dn, or DnT without a separate curve or adapter basis.",
    requiredInputsOrEvidence: [
      "ownedSpectrumRoute",
      "implementedOitcAdapter",
      "scalarOnlyNegativeBoundary"
    ],
    routeFamily: "companion_metric_completeness",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    decision: "rejected_context_or_evidence_missing",
    id: "calibration_holdout_packet_owner",
    reason:
      "Calibration remains high ROI, but this rerank has no new rights-safe same-family holdout packet that beats the measured-curve field/building runtime unlock.",
    requiredInputsOrEvidence: [
      "rightsSafeRows",
      "sameFamilyBasis",
      "beforeAfterErrorBudget"
    ],
    routeFamily: "calibration_holdout",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: []
  },
  {
    decision: "rejected_other_agent_conflict",
    id: "opening_leak_common_wall_or_open_web_residual_owner",
    reason:
      "Opening/leak, common-wall, and open-web residuals are active in nearby dirty work. This rerank should not collide with that chain, and the measured-frequency field/building owner has cleaner local runtime prerequisites.",
    requiredInputsOrEvidence: [
      "sameBasisOpeningLeakHoldout",
      "sameBasisCommonWallHoldout",
      "openWebResidualFormula"
    ],
    routeFamily: "wall.opening_leak.common_wall.open_web",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["R'w", "Dn,w", "DnT,w"]
  },
  {
    decision: "rejected_frontend_first",
    id: "broad_ui_report_source_or_cleanup_work",
    reason:
      "UI/report work, confidence copy, broad source crawling, and generic cleanup do not improve calculator route ownership or numeric accuracy in this selected slice.",
    requiredInputsOrEvidence: [],
    routeFamily: "non_calculator",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: []
  }
] as const satisfies readonly Candidate[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  HIGH_ROI_SELECTION_PLAN_DOC,
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildRerankSummary() {
  const selected = CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID);
  if (!selected) {
    throw new Error("Rerank must select one candidate.");
  }

  return {
    candidates: CANDIDATES,
    counters: RERANK_COUNTERS,
    landedGate: RERANK_ACTION,
    noRuntimeValueMovement: true,
    previousCoverageRefresh: {
      implementationFile: PREVIOUS_COVERAGE_FILE,
      planDoc: PREVIOUS_COVERAGE_PLAN_DOC,
      runtimeMethod: PREVIOUS_RUNTIME_METHOD,
      selectedGate: PREVIOUS_COVERAGE_ACTION,
      status: PREVIOUS_COVERAGE_STATUS
    },
    selectedCandidate: selected,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first rerank after project/user measured wall airborne frequency compatible-delta coverage refresh", () => {
  it("lands a no-runtime rerank and selects the measured-frequency field/building adapter owner", () => {
    const summary = buildRerankSummary();

    expect(summary).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      noRuntimeValueMovement: true,
      previousCoverageRefresh: {
        implementationFile: PREVIOUS_COVERAGE_FILE,
        planDoc: PREVIOUS_COVERAGE_PLAN_DOC,
        runtimeMethod: PREVIOUS_RUNTIME_METHOD,
        selectedGate: PREVIOUS_COVERAGE_ACTION,
        status: PREVIOUS_COVERAGE_STATUS
      },
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RERANK_STATUS
    });

    for (const path of [
      PREVIOUS_COVERAGE_FILE,
      PREVIOUS_COVERAGE_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("proves the previous compatible-delta owner is live and its frozen boundary leaves field/building for the selected owner", () => {
    const coverageContract = readRepoFile(PREVIOUS_COVERAGE_FILE);
    const coveragePlan = readRepoFile(PREVIOUS_COVERAGE_PLAN_DOC);
    const compatibleDeltaRuntime = readRepoFile(COMPATIBLE_DELTA_FILE);

    expect(coverageContract).toContain(PREVIOUS_RUNTIME_METHOD);
    expect(coverageContract).toContain("field/building, impact aliases, and cavity changes outside");
    expect(coveragePlan).toMatch(/field\/building\s+and\s+impact outside boundaries/u);
    expect(compatibleDeltaRuntime).toContain("isElementLabCurveRequest");
    expect(compatibleDeltaRuntime).toContain("field, building, impact, OITC");
  });

  it("finds local owned prerequisites for exact and compatible measured curves to feed Gate I and Gate AR", () => {
    const calculateAssembly = readRepoFile(CALCULATE_ASSEMBLY_FILE);
    const curveRating = readRepoFile(CURVE_RATING_FILE);
    const sourceRowCompatibleDelta = readRepoFile(SOURCE_ROW_COMPATIBLE_DELTA_FILE);
    const exactCurveBridge = readRepoFile(EXACT_CURVE_BRIDGE_FILE);
    const compatibleDelta = readRepoFile(COMPATIBLE_DELTA_FILE);

    expect(exactCurveBridge).toContain(POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD);
    expect(exactCurveBridge).toContain("curveBasis: \"measured_frequency_curve\"");
    expect(compatibleDelta).toContain(PREVIOUS_RUNTIME_METHOD);
    expect(compatibleDelta).toContain("curveBasis: \"calculated_frequency_curve\"");
    expect(compatibleDelta).toContain("shiftCurveToRw");
    expect(calculateAssembly).toContain("maybeBuildGateIAirborneFieldContextBasisFromBase");
    expect(calculateAssembly).toContain("maybeBuildGateARAirborneBuildingPredictionBasisFromBase");
    expect(calculateAssembly).toContain("applyAirborneContextOverlay");
    expect(curveRating).toContain("buildFieldAirborneRatings");
    expect(curveRating).toContain("DnTw");
    expect(curveRating).toContain("DnA");
    expect(sourceRowCompatibleDelta).toContain("POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_FIELD_BUILDING_ADAPTER_WARNING");
    expect(sourceRowCompatibleDelta).toContain("Lab Rw is not relabelled as R'w, Dn,w, or DnT,w");
  });

  it("rejects broader or alias-prone alternatives while keeping this slice runtime-owner ready", () => {
    const summary = buildRerankSummary();
    const byId = new Map(summary.candidates.map((candidate) => [candidate.id, candidate]));

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(summary.selectedCandidate).toMatchObject({
      decision: "selected_runtime_owner_ready",
      runtimeOwnerAuthorizedNext: true,
      routeFamily: "wall.project_user_measured_frequency_curve.field_building_adapter",
      targetOutputs: SELECTED_TARGET_OUTPUTS
    });
    expect(byId.get("user_material_physical_input_coverage_owner")).toMatchObject({
      decision: "rejected_too_broad",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("generic_building_prediction_flanking_runtime_owner")).toMatchObject({
      decision: "rejected_too_broad",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("companion_metric_completeness_from_scalar_owner")).toMatchObject({
      decision: "rejected_alias_risk",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("opening_leak_common_wall_or_open_web_residual_owner")).toMatchObject({
      decision: "rejected_other_agent_conflict",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("broad_ui_report_source_or_cleanup_work")).toMatchObject({
      decision: "rejected_frontend_first",
      runtimeOwnerAuthorizedNext: false
    });
  });

  it("keeps this rerank no-runtime while estimating the next bounded field/building movement", () => {
    const summary = buildRerankSummary();

    expect(summary.counters).toMatchObject({
      estimatedNextCalculableRequestShapes: 4,
      estimatedNextCalculableTargetOutputs: 20,
      estimatedNextRequiredPhysicalInputsCaptured: 9,
      estimatedNextRuntimeBasisPromotions: 4,
      estimatedNextRuntimeValuesMoved: 20,
      estimatedNextUnsupportedBoundariesProtected: 7,
      frontendImplementationFilesTouched: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(summary.selectedCandidate.requiredInputsOrEvidence).toEqual([
      "airborneMeasuredFrequencySourceAnchors",
      "exactFullStackOrReducedStackMeasuredCurveFingerprint",
      "calculatedTransmissionLossCurve",
      "airborneContext.contextMode=field_between_rooms_or_building_prediction",
      "airborneContext.panelWidthHeight",
      "airborneContext.receivingRoomVolumeM3",
      "airborneContext.receivingRoomRt60S",
      "airborneContext.sourceRoomVolumeM3",
      "airborneContext.flankingJunctionClass_for_building_prediction"
    ]);
  });

  it("keeps active docs aligned with the selected measured-frequency field/building adapter owner", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_FILE);
      expect(contents, path).toContain(RERANK_ACTION);
      expect(contents, path).toContain(RERANK_STATUS);
      expect(contents, path).toContain(RERANK_FILE);
      expect(contents, path).toContain(SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(contents, path).toContain("candidateCount: 8");
      expect(contents, path).toContain("roiAnalysisIterations: 4");
      expect(contents, path).toContain("estimatedNextRuntimeValuesMoved: 20");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("runtimeFormulaRetunes: 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});

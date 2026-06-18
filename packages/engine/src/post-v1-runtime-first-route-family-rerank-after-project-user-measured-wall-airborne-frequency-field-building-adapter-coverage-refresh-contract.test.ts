import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID,
  calculateGateAYAdvancedWallRuntimeCorridor
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ay";
import {
  GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT,
  GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK
} from "./calculator-personal-use-mvp-coverage-sprint-gate-az";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_advanced_wall_source_absent_field_building_adapter_owner";
const SELECTED_CANDIDATE_ID =
  "wall.advanced_wall_source_absent_field_building_adapter_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall advanced-wall source-absent field/building adapter owner";

const HIGH_ROI_SELECTION_PLAN_DOC = "docs/calculator/HIGH_ROI_CALCULATOR_IMPLEMENTATION_SELECTION_PLAN_2026-06-18.md";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 10,
  estimatedNextRequiredPhysicalInputsCaptured: 10,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 10,
  estimatedNextUnsupportedBoundariesProtected: 6,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_closed_chain"
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

const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_runtime_owner_ready",
    id: SELECTED_CANDIDATE_ID,
    reason:
      "Gate AY already owns a complete advanced-wall source-absent direct TL curve for lab Rw/STC/C/Ctr from explicit panel, cavity, absorber, opening, and frame-coupling inputs. The current calculator still parks field/building outputs for the same complete advanced-wall payload, so the bounded next owner is to feed that owned direct curve through Gate I / Gate AR only when explicit room, area, and flanking context is present.",
    requiredInputsOrEvidence: [
      "advancedWall.wallSolverIntent=advanced_source_absent_wall",
      "GateAYAdvancedWallDirectTransmissionLossCurve",
      "advancedWall.fieldBuildingAdapterBoundary",
      "advancedWall.sourceAbsentErrorBudgetOwner",
      "airborneContext.contextMode=field_between_rooms_or_building_prediction",
      "airborneContext.panelWidthHeight",
      "airborneContext.receivingRoomVolumeM3",
      "airborneContext.receivingRoomRt60S",
      "airborneContext.sourceRoomVolumeM3_for_building_prediction",
      "airborneContext.flankingJunctionClass_for_building_prediction"
    ],
    routeFamily: "wall.advanced_wall_source_absent.field_building_adapter",
    runtimeOwnerAuthorizedNext: true,
    targetOutputs: FIELD_BUILDING_OUTPUTS
  },
  {
    decision: "rejected_closed_chain",
    id: "project_user_measured_frequency_field_building_adapter_chain",
    reason:
      "Exact and compatible project/user measured wall airborne frequency field/building outputs are closed by the previous owner and coverage refresh. Reopening them would loop on a completed measured-frequency route unless a new metric basis is proven.",
    requiredInputsOrEvidence: [
      "previousCoverageRefreshGreen",
      "exactAndCompatibleMeasuredFrequencyFieldBuildingValuesFrozen"
    ],
    routeFamily: "wall.project_user_measured_frequency_curve.field_building_adapter",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: FIELD_BUILDING_OUTPUTS
  },
  {
    decision: "rejected_too_broad",
    id: "generic_building_prediction_flanking_runtime_owner",
    reason:
      "Generic building/flanking runtime across every airborne family is larger than this slice. The selected owner is the bounded Gate AY version where direct curve ownership and missing field/building adapter evidence are both local.",
    requiredInputsOrEvidence: [
      "crossFamilyDirectCurveInventory",
      "junctionCatalog",
      "flankingPathSet",
      "crossFamilyNegativeAliasTests"
    ],
    routeFamily: "building_prediction_flanking.generic",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: FIELD_BUILDING_OUTPUTS
  },
  {
    decision: "rejected_closed_chain",
    id: "frequency_band_backbone_generalization_owner",
    reason:
      "Gate AY already owns a calculated third-octave direct curve for the selected advanced-wall family. A broad frequency-backbone rewrite is unnecessary for the next move; the owner should reuse this curve through the existing adapters.",
    requiredInputsOrEvidence: [
      "ownedThirdOctaveCurve",
      "ratingAdapterInventory",
      "routeCurveIdentity",
      "negativeAliasTests"
    ],
    routeFamily: "frequency_band_backbone",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: [...LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    decision: "rejected_closed_chain",
    id: "companion_metric_completeness_from_gate_ay_lab_curve",
    reason:
      "Gate AY lab Rw, STC, C, and Ctr are already complete from the owned curve. OITC and field/building companions need separate route ownership, so companion completeness alone is not the next owner.",
    requiredInputsOrEvidence: [
      "GateAYLabCompanionCompleteness",
      "OITCAdapterOwnerMissing",
      "fieldBuildingAdapterOwnerMissing"
    ],
    routeFamily: "companion_metric_completeness",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: LAB_OUTPUTS
  },
  {
    decision: "rejected_context_or_evidence_missing",
    id: "calibration_holdout_packet_for_advanced_wall",
    reason:
      "Calibration would improve Gate AY accuracy, but no rights-safe same-family holdout packet is available in this rerank. The next runtime owner can move field/building values without source crawling or formula retuning.",
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
      "Opening/leak, common-wall, and open-box/open-web residuals remain important, but nearby dirty work already touches those chains. This rerank can avoid collision and still move calculator scope through the local Gate AY field/building gap.",
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

function cloneGateAYAdvancedWallInput(): NonNullable<AirborneContext["advancedWall"]> {
  return {
    ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
    cavities: GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.cavities.map((cavity) => ({ ...cavity })),
    frameCoupling: { ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.frameCoupling },
    panels: GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.panels.map((panel) => ({
      ...panel,
      layerIds: [...(panel.layerIds ?? [])]
    })),
    targetOutputs: [...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.targetOutputs]
  };
}

function calculateAdvancedWall(
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
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

describe("post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building adapter coverage refresh", () => {
  it("lands a no-runtime rerank and selects the bounded advanced-wall field/building adapter owner", () => {
    const summary = buildRerankSummary();

    expect(summary).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      noRuntimeValueMovement: true,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RERANK_STATUS
    });

    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);
  });

  it("proves the selected gap from live Gate AY behavior without moving runtime", () => {
    const lab = calculateAdvancedWall(GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT, LAB_OUTPUTS);
    const gateAYFieldBoundary = calculateGateAYAdvancedWallRuntimeCorridor({
      ...cloneGateAYAdvancedWallInput(),
      outputBasis: "field_between_rooms",
      targetOutputs: ["R'w", "DnT,w"]
    });
    const gateAYBuildingBoundary = calculateGateAYAdvancedWallRuntimeCorridor({
      ...cloneGateAYAdvancedWallInput(),
      outputBasis: "building_prediction",
      targetOutputs: [...FIELD_BUILDING_OUTPUTS]
    });

    expect(lab.airborneBasis?.method).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD);
    expect(lab.airborneCandidateResolution?.selectedCandidateId).toBe(
      PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID
    );
    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(lab.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6.4,
      estimatedRwDb: 65,
      estimatedStc: 65
    });
    expect(lab.warnings).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING);

    for (const result of [gateAYFieldBoundary, gateAYBuildingBoundary]) {
      expect(result.basis?.method).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD);
      expect(result.basis?.origin).toBe("unsupported");
      expect(result.status).toBe("unsupported_boundary");
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.warning).toContain("does not alias lab Rw/STC/C/Ctr to field or building outputs");
    }
    expect(gateAYFieldBoundary.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(gateAYBuildingBoundary.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
  }, 30000);

  it("subtracts closed chains and rejects broad or non-calculator work", () => {
    const summary = buildRerankSummary();
    const selected = summary.candidates.filter((candidate) => candidate.runtimeOwnerAuthorizedNext);
    const byId = new Map(summary.candidates.map((candidate) => [candidate.id, candidate]));

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(selected).toHaveLength(1);
    expect(selected[0]).toMatchObject({
      decision: "selected_runtime_owner_ready",
      id: SELECTED_CANDIDATE_ID,
      routeFamily: "wall.advanced_wall_source_absent.field_building_adapter",
      targetOutputs: [...FIELD_BUILDING_OUTPUTS]
    });
    expect(byId.get("project_user_measured_frequency_field_building_adapter_chain")).toMatchObject({
      decision: "rejected_closed_chain",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("generic_building_prediction_flanking_runtime_owner")).toMatchObject({
      decision: "rejected_too_broad",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("broad_ui_report_source_or_cleanup_work")).toMatchObject({
      decision: "rejected_frontend_first",
      runtimeOwnerAuthorizedNext: false
    });
  });

  it("keeps this rerank no-runtime while estimating the next bounded value movement", () => {
    const summary = buildRerankSummary();

    expect(summary.counters).toMatchObject({
      estimatedNextCalculableRequestShapes: 2,
      estimatedNextCalculableTargetOutputs: 10,
      estimatedNextRequiredPhysicalInputsCaptured: 10,
      estimatedNextRuntimeBasisPromotions: 2,
      estimatedNextRuntimeValuesMoved: 10,
      estimatedNextUnsupportedBoundariesProtected: 6,
      frontendImplementationFilesTouched: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(summary.selectedCandidate.requiredInputsOrEvidence).toEqual([
      "advancedWall.wallSolverIntent=advanced_source_absent_wall",
      "GateAYAdvancedWallDirectTransmissionLossCurve",
      "advancedWall.fieldBuildingAdapterBoundary",
      "advancedWall.sourceAbsentErrorBudgetOwner",
      "airborneContext.contextMode=field_between_rooms_or_building_prediction",
      "airborneContext.panelWidthHeight",
      "airborneContext.receivingRoomVolumeM3",
      "airborneContext.receivingRoomRt60S",
      "airborneContext.sourceRoomVolumeM3_for_building_prediction",
      "airborneContext.flankingJunctionClass_for_building_prediction"
    ]);
  });

  it("keeps active docs aligned with the selected advanced-wall owner", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_FILE);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_PLAN_DOC);
      expect(contents, path).toContain(RERANK_ACTION);
      expect(contents, path).toContain(RERANK_STATUS);
      expect(contents, path).toContain(RERANK_FILE);
      expect(contents, path).toContain(RERANK_PLAN_DOC);
      expect(contents, path).toContain(SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(contents, path).toContain(SELECTED_NEXT_LABEL);
      expect(contents, path).toContain("candidateCount: 8");
      expect(contents, path).toContain("roiAnalysisIterations: 4");
      expect(contents, path).toContain("estimatedNextRuntimeValuesMoved: 10");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("runtimeFormulaRetunes: 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner";
const SELECTED_CANDIDATE_ID =
  "wall.context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_CONTEXT_OWNED_POROUS_CAVITY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-19.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall context-owned porous-cavity field/building lab-companion basis integrity owner";

const HIGH_ROI_SELECTION_PLAN_DOC =
  "docs/calculator/HIGH_ROI_CALCULATOR_IMPLEMENTATION_SELECTION_PLAN_2026-06-18.md";

const RERANK_COUNTERS = {
  candidateCount: 6,
  estimatedNextAccuracyPromotedRequestShapes: 4,
  estimatedNextAccuracyPromotedTargetOutputs: 16,
  estimatedNextRuntimeBasisPromotions: 4,
  estimatedNextRuntimeValuesMoved: 16,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_closed_chain"
  | "rejected_evidence_missing"
  | "rejected_frontend_first"
  | "rejected_too_broad"
  | "selected_runtime_owner_ready";

type RerankCandidate = {
  readonly decision: CandidateDecision;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly requiredInputsOrEvidence: readonly string[];
  readonly routeFamily: string;
  readonly runtimeOwnerAuthorizedNext: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
};

const LAB_COMPANION_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_runtime_owner_ready",
    estimatedRuntimeValuesMoved: 16,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "The double-leaf/framed formula route already owns context-only absorptive cavity input when advancedWall.cavities supplies absorber flow resistivity, and Gate I/Gate AR already own the field/building adapters. The remaining bounded accuracy gap is that field/building lab-only and mixed requests publish lab companions from the field adapter instead of the owned direct lab curve.",
    requiredInputsOrEvidence: [
      "wallTopology.topologyMode=double_leaf_framed",
      "wallTopology.sideALeafLayerIndices",
      "wallTopology.sideBLeafLayerIndices",
      "wallTopology.cavity1DepthMm",
      "wallTopology.cavity1FillCoverage=full_or_partial",
      "wallTopology.cavity1AbsorptionClass=porous_absorptive",
      "advancedWall.cavities[].absorberFlowResistivityPaSM2",
      "field_between_rooms_or_building_prediction_context"
    ],
    routeFamily: "wall.double_leaf_framed.context_owned_porous_cavity.field_building_lab_companion",
    runtimeOwnerAuthorizedNext: true,
    targetOutputs: LAB_COMPANION_OUTPUTS
  },
  {
    decision: "rejected_closed_chain",
    estimatedRuntimeValuesMoved: 0,
    id: "project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_closed",
    reason:
      "Exact and compatible project/user measured-frequency field/building lab companions were the previous owner and coverage refresh; reopening them would not increase scope.",
    requiredInputsOrEvidence: ["activeMeasuredFrequencyAnchor", "fieldOrBuildingContext"],
    routeFamily: "wall.project_user_measured_frequency.field_building_lab_companion",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: LAB_COMPANION_OUTPUTS
  },
  {
    decision: "rejected_closed_chain",
    estimatedRuntimeValuesMoved: 0,
    id: "wall_user_material_visible_porous_fill_lab_companion_closed",
    reason:
      "Visible custom panel/porous-layer user-material double-leaf lab companions are already basis-correct and refreshed. The selected owner is the adjacent context-owned physical-input variant, not a replay of that chain.",
    requiredInputsOrEvidence: ["visiblePorousLayer", "userMaterialCatalog"],
    routeFamily: "wall.user_material_formula.visible_porous_layer",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: LAB_COMPANION_OUTPUTS
  },
  {
    decision: "rejected_too_broad",
    estimatedRuntimeValuesMoved: 0,
    id: "generic_building_prediction_flanking_runtime_owner",
    reason:
      "Generic building/flanking remains high ROI, but this rerank has a narrower owned adapter and physical-input gap that moves values without inventing a new junction/flanking model.",
    requiredInputsOrEvidence: ["junctionCatalog", "flankingPathSet", "sameBasisHoldouts"],
    routeFamily: "building_prediction_flanking.generic",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: FIELD_BUILDING_OUTPUTS
  },
  {
    decision: "rejected_evidence_missing",
    estimatedRuntimeValuesMoved: 0,
    id: "opening_leak_common_wall_runtime_retune_owner",
    reason:
      "Opening/leak and common-wall residuals remain strategically important, but the same-basis holdout packet found no accepted rows for a safe retune. They should not beat a locally reproducible wrong-basis calculator fix.",
    requiredInputsOrEvidence: ["acceptedSameBasisHoldoutRows", "openingAreaRatio", "leakPathClass"],
    routeFamily: "wall.opening_leak.common_wall",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: FIELD_BUILDING_OUTPUTS
  },
  {
    decision: "rejected_frontend_first",
    estimatedRuntimeValuesMoved: 0,
    id: "ui_report_source_crawl_or_process_cleanup",
    reason:
      "UI/report work, broad source crawling, confidence copy, and generic cleanup do not improve calculator route ownership or numeric accuracy in this selected slice.",
    requiredInputsOrEvidence: [],
    routeFamily: "non_calculator",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: []
  }
] as const satisfies readonly RerankCandidate[];

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
    throw new Error("Rerank must select one calculator runtime owner.");
  }

  return {
    candidates: CANDIDATES,
    counters: RERANK_COUNTERS,
    landedGate: RERANK_ACTION,
    previousCoverage: {
      implementationFile: PREVIOUS_COVERAGE_FILE,
      planDoc: PREVIOUS_COVERAGE_PLAN_DOC,
      selectedGate: PREVIOUS_COVERAGE_ACTION,
      status: PREVIOUS_COVERAGE_STATUS
    },
    runtimeValueMovement: false,
    selectedCandidate: selected,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first rerank after project/user measured wall airborne frequency field/building lab-companion target-output independence coverage refresh", () => {
  it("selects the context-owned porous cavity field/building lab-companion basis-integrity owner", () => {
    const summary = buildRerankSummary();

    expect(summary).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      runtimeValueMovement: false,
      selectedCandidate: {
        decision: "selected_runtime_owner_ready",
        estimatedRuntimeValuesMoved: 16,
        id: SELECTED_CANDIDATE_ID,
        runtimeOwnerAuthorizedNext: true,
        targetOutputs: [...LAB_COMPANION_OUTPUTS]
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RERANK_STATUS
    });

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(summary.candidates.filter((candidate) => candidate.decision === "selected_runtime_owner_ready"))
      .toHaveLength(1);
    expect(summary.candidates.every((candidate) =>
      candidate.id === SELECTED_CANDIDATE_ID || !candidate.runtimeOwnerAuthorizedNext
    )).toBe(true);

    for (const path of [
      PREVIOUS_COVERAGE_FILE,
      PREVIOUS_COVERAGE_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_FILE,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the selected rerank aligned with the north-star and high-ROI docs", () => {
    const requiredText = [
      "calculator",
      "user-material physical input coverage",
      SELECTED_CANDIDATE_ID,
      SELECTED_NEXT_ACTION
    ];

    for (const path of REQUIRED_DOCS) {
      const text = readRepoFile(path);
      expect(text.length, path).toBeGreaterThan(100);
      expect(text.toLowerCase(), path).toContain(requiredText[0]);
    }

    const highRoiPlan = readRepoFile(HIGH_ROI_SELECTION_PLAN_DOC);
    expect(highRoiPlan.toLowerCase()).toContain(requiredText[1]);
    const selectedPlan = readRepoFile(SELECTED_NEXT_PLAN_DOC);
    expect(selectedPlan).toContain(requiredText[2]);
    expect(selectedPlan).toContain(requiredText[3]);
  });
});

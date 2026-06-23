import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RECONCILIATION_ACTION =
  "post_v1_current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna_plan";
const PREVIOUS_RECONCILIATION_FILE =
  "packages/engine/src/post-v1-current-gate-stale-metric-basis-reconciliation-after-opening-leak-apparent-dna-contract.test.ts";
const PREVIOUS_RECONCILIATION_PLAN_DOC =
  "docs/calculator/POST_V1_CURRENT_GATE_STALE_METRIC_BASIS_RECONCILIATION_AFTER_OPENING_LEAK_APPARENT_DNA_PLAN_2026-06-23.md";
const PREVIOUS_RECONCILIATION_STATUS =
  "post_v1_current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna_landed_no_runtime_selected_runtime_first_rerank_after_current_gate_reconciliation";

const PREVIOUS_BOUNDARY_FIX_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_needs_input_boundary_fix_plan";
const PREVIOUS_BOUNDARY_FIX_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-needs-input-boundary-fix-contract.test.ts";
const PREVIOUS_BOUNDARY_FIX_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_NEEDS_INPUT_BOUNDARY_FIX_PLAN_2026-06-23.md";
const PREVIOUS_BOUNDARY_FIX_STATUS =
  "post_v1_wall_british_gypsum_exact_lab_needs_input_boundary_fix_landed_runtime_boundary_selected_runtime_first_rerank_after_current_gate_reconciliation";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_current_gate_stale_metric_basis_reconciliation_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-current-gate-stale-metric-basis-reconciliation-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_CURRENT_GATE_STALE_METRIC_BASIS_RECONCILIATION_PLAN_2026-06-23.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_current_gate_stale_metric_basis_reconciliation_landed_no_runtime_selected_british_gypsum_exact_lab_field_building_adapter_owner";

const SELECTED_CANDIDATE_ID =
  "wall.british_gypsum_exact_lab_field_building_adapter_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_field_building_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-field-building-adapter-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-23.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall British Gypsum exact lab field/building adapter owner";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 4,
  estimatedNextCalculableTargetOutputs: 12,
  estimatedNextRequiredPhysicalInputsCaptured: 10,
  estimatedNextRuntimeBasisPromotions: 4,
  estimatedNextRuntimeValuesMoved: 12,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_boundary_weaker_than_selected"
  | "rejected_evidence_missing"
  | "rejected_non_goal"
  | "selected_runtime_owner";

type RerankCandidate = {
  readonly decision: CandidateDecision;
  readonly estimatedNextCalculableRequestShapes: number;
  readonly estimatedNextCalculableTargetOutputs: number;
  readonly estimatedNextRuntimeValuesMoved: number;
  readonly id: string;
  readonly improvesAnswerOrderStep: 1 | 2 | 3 | 4;
  readonly reason: string;
  readonly requiredPhysicalInputs: readonly string[];
  readonly routeFamily: string;
  readonly selectedNextAction?: string;
};

const SELECTED_REQUIRED_INPUTS = [
  "British Gypsum exact source row A046005 or A046006",
  "explicit resilientBarSideCount one_side or both_sides",
  "direct element-lab Rw basis",
  "airborneContext.contextMode field_between_rooms or building_prediction",
  "panelWidthMm",
  "panelHeightMm",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "buildingPredictionOutputBasis for building_prediction",
  "flankingJunctionClass/conservativeFlankingAssumption/junctionCouplingLengthM for building_prediction"
] as const;

const RERANK_CANDIDATES = [
  {
    decision: "selected_runtime_owner",
    estimatedNextCalculableRequestShapes: 4,
    estimatedNextCalculableTargetOutputs: 12,
    estimatedNextRuntimeValuesMoved: 12,
    id: SELECTED_CANDIDATE_ID,
    improvesAnswerOrderStep: 3,
    reason:
      "After the boundary fix, A046005 and A046006 exact lab rows now keep same-basis Rw/STC/C/Ctr live. The next highest-ROI calculator move is to reuse those exact direct separating-element rows as the base curve for complete field_between_rooms and building_prediction contexts through owned Gate I / Gate AR adapters, while missing context stays needs_input.",
    requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS,
    routeFamily: "wall.british_gypsum_exact_lab.field_building_adapter",
    selectedNextAction: SELECTED_NEXT_ACTION
  },
  {
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextCalculableTargetOutputs: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "wall.british_gypsum_exact_lab_needs_input_boundary_fix",
    improvesAnswerOrderStep: 4,
    reason:
      "The prior boundary fix already protected exact element-lab Rw/STC/C/Ctr in mixed lab requests. Reselecting it would be support churn.",
    requiredPhysicalInputs: [],
    routeFamily: "wall.british_gypsum_exact_lab"
  },
  {
    decision: "rejected_boundary_weaker_than_selected",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextCalculableTargetOutputs: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "wall.british_gypsum_exact_lab_grouped_topology_input_surface_owner",
    improvesAnswerOrderStep: 4,
    reason:
      "Human-readable grouped topology prompts remain useful, but the selected runtime owner can first prove the calculation boundary using already schema-owned physical inputs.",
    requiredPhysicalInputs: ["sideALeafGroup", "cavity1DepthMm", "internalLeafGroup", "supportTopology"],
    routeFamily: "wall.route_input_surface"
  },
  {
    decision: "rejected_evidence_missing",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextCalculableTargetOutputs: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "wall.british_gypsum_nearby_row_delta_for_unmatched_variants",
    improvesAnswerOrderStep: 2,
    reason:
      "Nearby British Gypsum rows may become bounded anchors later, but this rerank has no same-family delta evidence for unmatched variants beyond A046005/A046006.",
    requiredPhysicalInputs: ["same-family delta evidence", "same metric basis proof"],
    routeFamily: "wall.british_gypsum_anchor_delta"
  },
  {
    decision: "rejected_evidence_missing",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextCalculableTargetOutputs: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "wall.british_gypsum_exact_lab_a_weighted_field_building_adapter_owner",
    improvesAnswerOrderStep: 3,
    reason:
      "A-weighted Dn,A/DnT,A publication should wait until the scalar exact-lab field/building adapter proves the direct Rw basis and the required A-weighted adapter boundary is explicit.",
    requiredPhysicalInputs: ["owned A-weighted adapter boundary", "frequency or admissible spectrum correction"],
    routeFamily: "wall.british_gypsum_exact_lab.a_weighted_adapter"
  },
  {
    decision: "rejected_boundary_weaker_than_selected",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextCalculableTargetOutputs: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "floor.open_web_or_impact_post_gate_retune",
    improvesAnswerOrderStep: 3,
    reason:
      "Floor impact retunes are still valuable, but they do not directly use the newly opened exact British Gypsum lab boundary and would skip the immediate lab-to-field/building adapter payoff.",
    requiredPhysicalInputs: ["dynamic stiffness", "load basis", "floor topology"],
    routeFamily: "floor.impact"
  },
  {
    decision: "rejected_non_goal",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextCalculableTargetOutputs: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "broad_source_crawl_or_extra_manufacturer_pack",
    improvesAnswerOrderStep: 1,
    reason:
      "Broad source crawling is not the next calculator behavior while exact A046005/A046006 rows already provide a direct runtime adapter opportunity.",
    requiredPhysicalInputs: [],
    routeFamily: "source_evidence"
  },
  {
    decision: "rejected_non_goal",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextCalculableTargetOutputs: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "assistant_or_report_copy_polish_without_runtime_owner",
    improvesAnswerOrderStep: 4,
    reason:
      "Assistant/report copy can protect user comprehension, but the selected calculator slice must now move a concrete field/building calculation boundary.",
    requiredPhysicalInputs: [],
    routeFamily: "non_calculator"
  }
] as const satisfies readonly RerankCandidate[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function summarizeRerank() {
  const selected = RERANK_CANDIDATES.filter((candidate) => candidate.id === SELECTED_CANDIDATE_ID);

  if (selected.length !== 1) {
    throw new Error("Rerank must select exactly one follow-up.");
  }

  return {
    candidates: RERANK_CANDIDATES,
    counters: RERANK_COUNTERS,
    landedGate: RERANK_ACTION,
    noRuntimeValueMovement: true,
    previousBoundaryFix: {
      landedGate: PREVIOUS_BOUNDARY_FIX_ACTION,
      planDoc: PREVIOUS_BOUNDARY_FIX_PLAN_DOC,
      selectedNextFile: PREVIOUS_BOUNDARY_FIX_FILE,
      selectionStatus: PREVIOUS_BOUNDARY_FIX_STATUS
    },
    previousReconciliation: {
      landedGate: PREVIOUS_RECONCILIATION_ACTION,
      planDoc: PREVIOUS_RECONCILIATION_PLAN_DOC,
      selectedNextFile: PREVIOUS_RECONCILIATION_FILE,
      selectionStatus: PREVIOUS_RECONCILIATION_STATUS
    },
    selectedCandidate: selected[0],
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first rerank after current-gate stale metric/basis reconciliation", () => {
  it("lands the no-runtime rerank and selects the British Gypsum exact lab field/building adapter owner", () => {
    expect(summarizeRerank()).toMatchObject({
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

    for (const path of [
      PREVIOUS_RECONCILIATION_FILE,
      PREVIOUS_RECONCILIATION_PLAN_DOC,
      PREVIOUS_BOUNDARY_FIX_FILE,
      PREVIOUS_BOUNDARY_FIX_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ranks exact lab field/building calculation above source crawling and weaker support lanes", () => {
    const summary = summarizeRerank();
    const selected = summary.selectedCandidate;
    const byId = new Map(summary.candidates.map((candidate) => [candidate.id, candidate]));

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      decision: "selected_runtime_owner",
      estimatedNextCalculableRequestShapes: 4,
      estimatedNextCalculableTargetOutputs: 12,
      estimatedNextRuntimeValuesMoved: 12,
      id: SELECTED_CANDIDATE_ID,
      improvesAnswerOrderStep: 3,
      routeFamily: "wall.british_gypsum_exact_lab.field_building_adapter",
      selectedNextAction: SELECTED_NEXT_ACTION
    });
    expect(selected.requiredPhysicalInputs).toEqual(expect.arrayContaining(SELECTED_REQUIRED_INPUTS));

    expect(byId.get("wall.british_gypsum_nearby_row_delta_for_unmatched_variants")).toMatchObject({
      decision: "rejected_evidence_missing",
      estimatedNextRuntimeValuesMoved: 0
    });
    expect(byId.get("wall.british_gypsum_exact_lab_grouped_topology_input_surface_owner")).toMatchObject({
      decision: "rejected_boundary_weaker_than_selected",
      estimatedNextCalculableRequestShapes: 0
    });
    expect(byId.get("broad_source_crawl_or_extra_manufacturer_pack")).toMatchObject({
      decision: "rejected_non_goal",
      routeFamily: "source_evidence"
    });
  });

  it("keeps live docs synchronized with the selected runtime owner and no-runtime rerank counters", () => {
    const requiredTokens = [
      RERANK_ACTION,
      RERANK_STATUS,
      SELECTED_CANDIDATE_ID,
      SELECTED_NEXT_ACTION,
      SELECTED_NEXT_FILE,
      SELECTED_NEXT_PLAN_DOC,
      "runtimeValuesMoved 0"
    ];

    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      for (const token of requiredTokens) {
        expect(content, `${path} must contain ${token}`).toContain(token);
      }
    }

    const ownerPlan = readRepoFile(SELECTED_NEXT_PLAN_DOC);
    expect(ownerPlan).toContain("newCalculableRequestShapes: 4");
    expect(ownerPlan).toContain("newCalculableTargetOutputs: 12");
    expect(ownerPlan).toContain("runtimeValuesMoved 12");
    expect(ownerPlan).toContain("lab values must not be copied into field/building outputs");
  });
});

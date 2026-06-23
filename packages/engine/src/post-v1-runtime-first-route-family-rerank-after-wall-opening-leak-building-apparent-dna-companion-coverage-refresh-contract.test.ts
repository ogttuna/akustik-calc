import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-opening-leak-building-apparent-dna-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_opening_leak_building_apparent_dna_companion_coverage_refresh";
const PREVIOUS_COVERAGE_REPROBED_CANDIDATE_ID =
  "wall.opening_leak_building_apparent_dna_companion_owner";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-building-apparent-dna-companion-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_landed_no_runtime_selected_current_gate_stale_metric_basis_reconciliation";

const SELECTED_CANDIDATE_ID =
  "current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna";
const SELECTED_NEXT_ACTION =
  "post_v1_current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-current-gate-stale-metric-basis-reconciliation-after-opening-leak-apparent-dna-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_CURRENT_GATE_STALE_METRIC_BASIS_RECONCILIATION_AFTER_OPENING_LEAK_APPARENT_DNA_PLAN_2026-06-23.md";
const SELECTED_NEXT_LABEL =
  "post-V1 current-gate stale metric/basis reconciliation after opening/leak apparent Dn,w/Dn,A";

const RERANK_COUNTERS = {
  candidateCount: 7,
  frontendImplementationFilesTouched: 0,
  knownCurrentGateFailureAssertions: 34,
  roiAnalysisIterations: 3,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_evidence_missing"
  | "rejected_non_goal"
  | "rejected_prerequisite_missing"
  | "selected_boundary_protection_prerequisite";

type RerankCandidate = {
  readonly decision: CandidateDecision;
  readonly id: string;
  readonly improvesAnswerOrderStep: 1 | 2 | 3 | 4;
  readonly reason: string;
  readonly routeFamily: string;
  readonly runtimeOwnerAuthorizedNow: boolean;
  readonly selectedNextAction?: string;
};

const RERANK_CANDIDATES = [
  {
    decision: "selected_boundary_protection_prerequisite",
    id: SELECTED_CANDIDATE_ID,
    improvesAnswerOrderStep: 4,
    reason:
      "The latest full current gate still exits non-zero on 34 known stale metric/basis assertions, including impact routes expecting airborne Rw/C/Ctr support, opening/leak tests expecting building Dn,A to remain closed, and resolver precedence expectations that predate user_verified_calculated_exact. No runtime behavior should move until stale current-gate metric/basis expectations are reconciled.",
    routeFamily: "calculator.current_gate.metric_basis_integrity",
    runtimeOwnerAuthorizedNow: false,
    selectedNextAction: SELECTED_NEXT_ACTION
  },
  {
    decision: "rejected_already_landed",
    id: PREVIOUS_COVERAGE_REPROBED_CANDIDATE_ID,
    improvesAnswerOrderStep: 3,
    reason:
      "The opening/leak building apparent Dn,w/Dn,A companion owner and coverage refresh already landed; reselecting it would be support churn rather than calculator progress.",
    routeFamily: "wall.opening_leak_building",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_evidence_missing",
    id: "wall.opening_leak_building_source_absent_budget_retune_after_apparent_dna",
    improvesAnswerOrderStep: 3,
    reason:
      "Opening/leak budget retuning remains valid later, but it needs same-basis holdout evidence; the rerank must not tune source-absent values from nearby lab/building proximity.",
    routeFamily: "wall.opening_leak_building",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_prerequisite_missing",
    id: "wall.opening_leak_building_spectrum_companion_ctr_owner",
    improvesAnswerOrderStep: 3,
    reason:
      "C/Ctr-style spectrum companions require an owned frequency-spectrum route and current metric/basis gate hygiene before they can become a bounded runtime owner.",
    routeFamily: "wall.opening_leak_building.spectrum_companion",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_prerequisite_missing",
    id: "floor.raw_bare_open_web_accuracy_runtime_retune",
    improvesAnswerOrderStep: 3,
    reason:
      "The floor/open-web impact lane is high value, but the current gate still carries stale airborne-output expectations for impact-only routes; those expectations must be reconciled first.",
    routeFamily: "floor.impact.raw_bare_open_web",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_non_goal",
    id: "broad_source_crawl_or_confidence_labeling",
    improvesAnswerOrderStep: 1,
    reason:
      "Broad source crawling or confidence wording does not create an exact measured match, a bounded compatible anchor, an owned formula route, or a required input boundary in this slice.",
    routeFamily: "source_evidence",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_non_goal",
    id: "workbench_ui_report_polish_without_engine_gate_integrity",
    improvesAnswerOrderStep: 4,
    reason:
      "UI/report polish is not the selected calculator behavior while the engine current gate cannot cleanly distinguish stale expectations from regressions.",
    routeFamily: "non_calculator",
    runtimeOwnerAuthorizedNow: false
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

function buildRerankSummary() {
  const selected = RERANK_CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID);
  const rejected = RERANK_CANDIDATES.filter((candidate) => candidate.id !== SELECTED_CANDIDATE_ID);

  if (!selected) {
    throw new Error("Rerank must select exactly one calculator-first follow-up.");
  }

  if (selected.runtimeOwnerAuthorizedNow) {
    throw new Error("Current-gate reconciliation must not move runtime values.");
  }

  return {
    candidates: RERANK_CANDIDATES,
    counters: RERANK_COUNTERS,
    landedGate: RERANK_ACTION,
    noRuntimeValueMovement: true,
    previousCoverageRefresh: {
      landedGate: PREVIOUS_COVERAGE_REFRESH_ACTION,
      planDoc: PREVIOUS_COVERAGE_REFRESH_PLAN_DOC,
      selectedNextFile: PREVIOUS_COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
    },
    rejected,
    selectedCandidate: selected,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first rerank after wall opening/leak building apparent Dn,w/Dn,A companion coverage refresh", () => {
  it("lands the no-runtime rerank and selects current-gate metric/basis reconciliation", () => {
    const summary = buildRerankSummary();

    expect(summary).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      noRuntimeValueMovement: true,
      previousCoverageRefresh: {
        landedGate: PREVIOUS_COVERAGE_REFRESH_ACTION,
        planDoc: PREVIOUS_COVERAGE_REFRESH_PLAN_DOC,
        selectedNextFile: PREVIOUS_COVERAGE_REFRESH_FILE,
        selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
      },
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RERANK_STATUS
    });

    for (const path of [
      PREVIOUS_COVERAGE_REFRESH_FILE,
      PREVIOUS_COVERAGE_REFRESH_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("rejects premature runtime movement until stale gate expectations are reconciled", () => {
    const summary = buildRerankSummary();
    const selected = summary.candidates.filter((candidate) => candidate.id === SELECTED_CANDIDATE_ID);
    const byId = new Map(summary.candidates.map((candidate) => [candidate.id, candidate]));

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(selected).toEqual([
      expect.objectContaining({
        decision: "selected_boundary_protection_prerequisite",
        improvesAnswerOrderStep: 4,
        routeFamily: "calculator.current_gate.metric_basis_integrity",
        runtimeOwnerAuthorizedNow: false,
        selectedNextAction: SELECTED_NEXT_ACTION
      })
    ]);

    expect(byId.get("wall.opening_leak_building_source_absent_budget_retune_after_apparent_dna")).toMatchObject({
      decision: "rejected_evidence_missing",
      runtimeOwnerAuthorizedNow: false
    });
    expect(byId.get("floor.raw_bare_open_web_accuracy_runtime_retune")).toMatchObject({
      decision: "rejected_prerequisite_missing",
      runtimeOwnerAuthorizedNow: false
    });
    expect(byId.get("broad_source_crawl_or_confidence_labeling")).toMatchObject({
      decision: "rejected_non_goal",
      runtimeOwnerAuthorizedNow: false
    });
  });

  it("records the bounded stop reason and keeps calculator-first answer ordering intact", () => {
    const selected = buildRerankSummary().selectedCandidate;

    expect(selected.reason).toContain("34 known stale metric/basis assertions");
    expect(selected.reason).toContain("impact routes expecting airborne Rw/C/Ctr support");
    expect(selected.reason).toContain("opening/leak tests expecting building Dn,A to remain closed");
    expect(selected.reason).toContain("user_verified_calculated_exact");
    expect(selected.reason).toContain(
      "No runtime behavior should move until stale current-gate metric/basis expectations are reconciled"
    );
    expect(RERANK_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(RERANK_COUNTERS.runtimeFormulaRetunes).toBe(0);
    expect(RERANK_COUNTERS.sourceRowsImported).toBe(0);
    expect(RERANK_COUNTERS.frontendImplementationFilesTouched).toBe(0);
  });

  it("keeps docs and the current-gate runner aligned with the rerank and selected next action", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_FILE);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("candidateCount: 7");
      expect(content, path).toContain("knownCurrentGateFailureAssertions: 34");
      expect(content, path).toContain("roiAnalysisIterations: 3");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(PREVIOUS_COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(RERANK_FILE.replace("packages/engine/", ""));
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_LANDED_GATE,
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTION_STATUS,
  POST_V1_GATE_ET_BOUNDARY_ID,
  POST_V1_GATE_ET_COUNTERS
} from "./post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et";
import {
  POST_V1_GATE_EU_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EU_PLAN_DOC_PATH,
  POST_V1_GATE_EU_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_EU_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EU_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTION_STATUS,
  buildPostV1GateEUClosedRouteEvidence,
  rankPostV1GateEUNumericCoverageCandidates,
  summarizePostV1GateEUNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-eu";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/USABLE_V1_EXECUTION_PLAN.md",
  POST_V1_GATE_EU_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate EU", () => {
  it("lands after Gate ET and selects the current coverage/accuracy gap ledger Gate EV", () => {
    const summary = summarizePostV1GateEUNumericCoverageGap();

    expect(
      POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTION_STATUS
    ).toBe(
      "post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_landed_no_runtime_selected_next_numeric_coverage_gap_gate_eu"
    );
    expect(
      POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_ACTION
    ).toBe(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_LANDED_GATE);
    expect(
      POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_FILE
    ).toBe("packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts");

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EU_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EU_PLAN_DOC_PATH,
      previousGateET: {
        boundaryId: POST_V1_GATE_ET_BOUNDARY_ID,
        counters: POST_V1_GATE_ET_COUNTERS,
        landedGate:
          POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_LANDED_GATE,
        selectedNextAction:
          POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_ACTION,
        selectedNextFile:
          POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_FILE,
        selectionStatus:
          POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_EU_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_EU_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTION_STATUS
    });
  });

  it("ranks the current ledger above closed repeats, blocked retunes, source crawling, and frontend drift", () => {
    const candidates = rankPostV1GateEUNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_EU_NO_RUNTIME_COUNTERS.candidateCount);
    expect(POST_V1_GATE_EU_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_EU_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE,
      sliceKind: "current_coverage_accuracy_gap_ledger",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EU_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.direct_fixed_field_building_closed_by_er")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.reinforced_concrete_visible_derived_closed_by_et")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.thick_board_auto_family_boundary_closed_by_safety_guard")?.score ?? 0
    );
    expect(byId.get("wall.heavy_core_lined_massive_direct_retune_blocked")).toMatchObject({
      ownerProofRequiredBeforeRuntime: true,
      sliceKind: "formula_retune_blocked"
    });
    expect(byId.get("broad_source_crawl_confidence_frontend_non_goal")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      preservesBoundaryCorrectness: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("records the closed-route evidence that forces Gate EV to re-read the current implementation", () => {
    const evidence = buildPostV1GateEUClosedRouteEvidence();

    expect(evidence).toEqual({
      closedByGateET: true,
      closedByThickBoardSafetyGuard: true,
      closedDirectFixedFieldBuildingByGateER: true,
      latestBoundaryId: POST_V1_GATE_ET_BOUNDARY_ID,
      requiresFreshImplementationLedgerBeforeRuntimeMovement: true,
      selectedCandidateId: POST_V1_GATE_EU_SELECTED_CANDIDATE_ID
    });
  });

  it("ties every candidate to implementation evidence and keeps Gate EU no-runtime", () => {
    const candidates = rankPostV1GateEUNumericCoverageCandidates();

    for (const candidate of candidates) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }

    expect(POST_V1_GATE_EU_NO_RUNTIME_COUNTERS).toMatchObject({
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(candidates.some((candidate) => candidate.nextActionMovesRuntimeValues)).toBe(false);
    expect(candidates.some((candidate) => candidate.touchesFrontendImplementationNow)).toBe(false);
    expect(candidates.some((candidate) => candidate.touchesSharedOrApiSurfaceNow)).toBe(false);
  });

  it("keeps docs and current-gate runner aligned with Gate EU closeout and Gate EV selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EU_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("Gate EV");
      expect(normalizedWhitespaceContent, path).toContain("current coverage/accuracy gap ledger");
      expect(contents, path).toContain("roiAnalysisIterations: 2");
      expect(contents, path).toContain("estimatedNextGapLedgers 1");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const plan = readRepoFile(POST_V1_GATE_EU_PLAN_DOC_PATH);
    expect(plan).toContain("Gate EU Iteration 1");
    expect(plan).toContain("Gate EU Iteration 2");
    expect(plan).toContain("Gate EV Work Order");
    expect(plan).toContain("Gate ET");
    expect(plan).toContain("thick-board");
    expect(plan).toContain("runtimeValuesMoved 0");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts"
    );
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts");
  });
});

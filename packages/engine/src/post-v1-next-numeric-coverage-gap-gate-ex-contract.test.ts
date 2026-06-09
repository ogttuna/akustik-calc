import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_EW_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EW_OWNER_DECISION_ID,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_LANDED_GATE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTION_STATUS
} from "./post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew";
import {
  POST_V1_GATE_EX_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EX_PLAN_DOC_PATH,
  POST_V1_GATE_EX_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_EX_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EX_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTION_STATUS,
  rankPostV1GateEXNumericCoverageCandidates,
  summarizePostV1GateEXNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ex";

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
  POST_V1_GATE_EX_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage/accuracy gap Gate EX", () => {
  it("lands after Gate EW and selects targeted evidence acquisition Gate EY", () => {
    const summary = summarizePostV1GateEXNumericCoverageGap();

    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTION_STATUS).toBe(
      "post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_ex"
    );
    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_LANDED_GATE
    );
    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts"
    );

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EX_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EX_PLAN_DOC_PATH,
      previousGateEW: {
        counters: POST_V1_GATE_EW_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_LANDED_GATE,
        ownerDecisionId: POST_V1_GATE_EW_OWNER_DECISION_ID,
        selectedNextAction:
          POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION,
        selectedNextFile:
          POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_EX_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_EX_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTION_STATUS
    });
  });

  it("ranks targeted evidence above runtime retune, closed repeats, and broad source crawl", () => {
    const candidates = rankPostV1GateEXNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_EX_NO_RUNTIME_COUNTERS.candidateCount);
    expect(candidates.filter((candidate) => candidate.selected)).toHaveLength(1);

    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      id: POST_V1_GATE_EX_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE,
      sliceKind: "targeted_evidence_acquisition",
      sourceRowsImportedNow: false,
      sourceRowsMayBeResearchedInNextGate: true,
      targetMetrics: POST_V1_GATE_EX_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.heavy_core_lined_massive_runtime_retune_still_blocked")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.heavy_core_lined_massive_bounded_rule_authoring_without_evidence_blocked")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.direct_fixed_field_building_closed_repeat")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("broad_source_crawl_confidence_frontend_non_goal")?.score ?? 0
    );
  });

  it("keeps Gate EX no-runtime and constrains Gate EY to named evidence", () => {
    const candidates = rankPostV1GateEXNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const broad = candidates.find((candidate) => candidate.id === "broad_source_crawl_confidence_frontend_non_goal");

    expect(selected?.requiredEvidence).toEqual([
      "wall-specific lined concrete or heavy-masonry source row with measured airborne metric, stack, topology, basis, standard, and locator",
      "or a named bounded wall lining rule with coefficient scope, local tolerance, holdouts, and negative boundaries",
      "floor-only CC60, generic manufacturer context, selector pins, confidence wording, and broad source inventories remain rejected"
    ]);
    expect(selected?.expectedBeforeAfter).toContain(
      "Gate EY should search only for that named evidence, not for a general source catalog"
    );
    expect(broad).toMatchObject({
      broadSourceCrawl: true,
      passesCalculatorAdvancementTest: false,
      preservesBoundaryCorrectness: false,
      selected: false
    });

    expect(POST_V1_GATE_EX_NO_RUNTIME_COUNTERS).toMatchObject({
      broadSourceCrawlSelected: false,
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0,
      targetedEvidenceAcquisitionSelected: true
    });
    expect(candidates.some((candidate) => candidate.nextActionMovesRuntimeValues)).toBe(false);
    expect(candidates.some((candidate) => candidate.sourceRowsImportedNow)).toBe(false);
    expect(candidates.some((candidate) => candidate.touchesFrontendImplementationNow)).toBe(false);
    expect(candidates.some((candidate) => candidate.touchesSharedOrApiSurfaceNow)).toBe(false);
  });

  it("ties every candidate to current evidence", () => {
    for (const candidate of rankPostV1GateEXNumericCoverageCandidates()) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }
  });

  it("keeps docs and current-gate runner aligned with Gate EX closeout and Gate EY selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EX_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("Gate EY");
      expect(normalizedWhitespaceContent, path).toContain("targeted evidence acquisition");
      expect(normalizedWhitespaceContent, path).toContain("not a broad source crawl");
      expect(normalizedWhitespaceContent, path).toContain(
        "wall-specific lined concrete or heavy-masonry source row"
      );
      expect(normalizedWhitespaceContent, path).toContain("bounded wall lining rule");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts"
    );
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts");
  });
});

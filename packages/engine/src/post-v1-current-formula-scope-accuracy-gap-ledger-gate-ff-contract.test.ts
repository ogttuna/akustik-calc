import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTION_STATUS
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh";
import {
  POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_LANDED_GATE,
  POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_ACTION,
  POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_FILE,
  POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_LABEL,
  POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTION_STATUS,
  POST_V1_GATE_FF_LATEST_RUNTIME_CONTEXT,
  POST_V1_GATE_FF_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_FF_PLAN_DOC_PATH,
  POST_V1_GATE_FF_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_FF_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_FF_TARGET_OUTPUTS,
  buildPostV1GateFFCurrentEvidence,
  rankPostV1GateFFFormulaScopeCandidates,
  summarizePostV1GateFFCurrentFormulaScopeAccuracyGapLedger
} from "./post-v1-current-formula-scope-accuracy-gap-ledger-gate-ff";
import {
  POST_V1_GATE_FE_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_FE_PLAN_DOC_PATH,
  POST_V1_GATE_FE_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-fe";
import {
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS
} from "./post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er";

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
  POST_V1_GATE_FE_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 current formula scope/accuracy gap ledger Gate FF", () => {
  it("lands after Gate FE and selects post double-leaf/framed coverage revalidation", () => {
    const summary = summarizePostV1GateFFCurrentFormulaScopeAccuracyGapLedger();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_fe_landed_no_runtime_selected_current_formula_scope_accuracy_gap_ledger_gate_ff"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION).toBe(
      POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-current-formula-scope-accuracy-gap-ledger-gate-ff-contract.test.ts"
    );

    expect(summary).toMatchObject({
      landedGate: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_FF_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_FF_PLAN_DOC_PATH,
      previousDoubleLeafCoverageRefresh: {
        landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE,
        selectedNextAction:
          LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
        selectedNextFile:
          LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTION_STATUS
      },
      previousGateFE: {
        counters: POST_V1_GATE_FE_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_LANDED_GATE,
        planDocPath: POST_V1_GATE_FE_PLAN_DOC_PATH,
        selectedCandidateId: POST_V1_GATE_FE_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_FF_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_FF_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_FF_TARGET_OUTPUTS
    });
  });

  it("ranks the open post-runtime revalidation above closed runtime routes and rejected owners", () => {
    const candidates = rankPostV1GateFFFormulaScopeCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_FF_NO_RUNTIME_COUNTERS.candidateCount);
    expect(candidates.map((candidate) => candidate.candidateOrder)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(POST_V1_GATE_FF_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_FF_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_FILE,
      sliceKind: "current_post_runtime_revalidation",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_FF_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.single_leaf_mass_law_runtime_already_live")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.double_leaf_framed_runtime_already_live")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.direct_fixed_double_leaf_field_building_already_live")?.score ?? 0);
    expect(byId.get("broad_source_crawl_confidence_frontend_non_goal")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      selected: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("records no runtime movement and pins the live runtime context that made revalidation necessary", () => {
    expect(buildPostV1GateFFCurrentEvidence()).toEqual({
      doubleLeafCoverageRefreshSelectedPostRevalidation: true,
      gateERDirectFixedFieldBuildingRuntimeLanded: true,
      gateFESelectedGateFF: true,
      immediateSafeRuntimeCandidateCount: 0,
      selectedCandidateId: POST_V1_GATE_FF_SELECTED_CANDIDATE_ID
    });
    expect(POST_V1_GATE_FF_LATEST_RUNTIME_CONTEXT).toEqual({
      directFixedRuntimeGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE,
      directFixedRuntimeStatus:
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS,
      doubleLeafCoverageRefreshGate:
        LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE,
      selectedOpenRevalidationAction: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_ACTION
    });
    expect(POST_V1_GATE_FF_NO_RUNTIME_COUNTERS).toMatchObject({
      broadSourceCrawlSelected: false,
      frontendImplementationFilesTouched: 0,
      immediateRuntimeCandidatesSelected: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      openHistoricalSelectedNextFilesStillMissing: 1,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(rankPostV1GateFFFormulaScopeCandidates().some((candidate) =>
      candidate.nextActionMovesRuntimeValues
    )).toBe(false);
  });

  it("ties every Gate FF candidate to existing implementation evidence", () => {
    for (const candidate of rankPostV1GateFFFormulaScopeCandidates()) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }
  });

  it("keeps docs, exports, and current-gate runner aligned with Gate FF selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_FF_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("Gate FF");
      expect(normalizedWhitespaceContent, path).toContain("post double-leaf");
      expect(contents, path).toContain("roiAnalysisIterations: 2");
      expect(contents, path).toContain("openHistoricalSelectedNextFilesStillMissing 1");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const index = readRepoFile("packages/engine/src/index.ts");

    expect(runner).toContain("src/post-v1-current-formula-scope-accuracy-gap-ledger-gate-ff-contract.test.ts");
    expect(index).toContain('export * from "./post-v1-current-formula-scope-accuracy-gap-ledger-gate-ff";');
  });
});

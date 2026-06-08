import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_ER_COUNTERS,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_FILE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS
} from "./post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er";
import {
  POST_V1_GATE_ES_BOUNDARY_ASSERTIONS,
  POST_V1_GATE_ES_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_ES_PLAN_DOC_PATH,
  POST_V1_GATE_ES_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_ES_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_ES_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTION_STATUS,
  buildPostV1GateESReinforcedConcreteBoundaryEvidence,
  rankPostV1GateESNumericCoverageCandidates,
  summarizePostV1GateESNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-es";

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
  POST_V1_GATE_ES_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate ES", () => {
  it("lands after Gate ER and selects the reinforced-concrete visible-derived boundary Gate ET", () => {
    const summary = summarizePostV1GateESNumericCoverageGap();

    expect(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS).toBe(
      "post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_landed_runtime_selected_next_numeric_coverage_gap_gate_es"
    );
    expect(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_LANDED_GATE
    );
    expect(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts"
    );

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_ES_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_ES_PLAN_DOC_PATH,
      previousGateER: {
        counters: POST_V1_GATE_ER_COUNTERS,
        landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE,
        selectedNextAction:
          POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_ACTION,
        selectedNextFile:
          POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_FILE,
        selectionStatus:
          POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_ES_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_ES_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTION_STATUS
    });
  });

  it("ranks the boundary refresh above closed, retune, source-crawl, and frontend work", () => {
    const candidates = rankPostV1GateESNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_ES_NO_RUNTIME_COUNTERS.candidateCount);
    expect(POST_V1_GATE_ES_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_ES_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE,
      sliceKind: "needs_input_boundary_accuracy",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_ES_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.direct_fixed_field_building_closed_by_er")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.reinforced_concrete_complete_formula_already_live")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.reinforced_concrete_formula_retune_without_holdouts")?.score ?? 0
    );
    expect(byId.get("floor.lower_treatment_delta_lw_cross_family_subtraction_rejected")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      sliceKind: "blocked_metric_derivation"
    });
    expect(byId.get("broad_source_crawl_frontend_confidence_non_goal")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("proves the selected boundary from current runtime evidence", () => {
    const evidence = buildPostV1GateESReinforcedConcreteBoundaryEvidence();

    expect(evidence.visibleLayerLowerAssemblyAlreadyPresent).toBe(true);
    expect(evidence.visibleDerivedOrigin).toBe("needs_input");
    expect(evidence.visibleDerivedMissingPhysicalInputs).toEqual(
      POST_V1_GATE_ES_BOUNDARY_ASSERTIONS.visibleDerivedExpectedMissingPhysicalInputs
    );
    expect(evidence.visibleDerivedMissingPhysicalInputs).not.toContain("ceilingOrLowerAssembly");
    expect(evidence.staleHistoricalVisibleDerivedMissingPhysicalInputs).toEqual(
      POST_V1_GATE_ES_BOUNDARY_ASSERTIONS.staleHistoricalVisibleDerivedMissingPhysicalInputs
    );
    expect(evidence.visibleDerivedSupportedOutputs).toEqual(
      POST_V1_GATE_ES_BOUNDARY_ASSERTIONS.visibleDerivedExpectedSupportedOutputs
    );
    expect(evidence.visibleDerivedUnsupportedOutputs).toEqual(
      POST_V1_GATE_ES_BOUNDARY_ASSERTIONS.visibleDerivedExpectedUnsupportedOutputs
    );

    expect(evidence.explicitPartialOrigin).toBe("needs_input");
    expect(evidence.explicitPartialMissingPhysicalInputs).toEqual(
      POST_V1_GATE_ES_BOUNDARY_ASSERTIONS.explicitPartialExpectedMissingPhysicalInputs
    );
    expect(evidence.completeFormulaMissingPhysicalInputs).toEqual([]);
    expect(evidence.completeFormulaValuePins).toEqual(
      POST_V1_GATE_ES_BOUNDARY_ASSERTIONS.completeFormulaExpectedValuePins
    );
  });

  it("ties every candidate to implementation evidence and keeps Gate ES no-runtime", () => {
    const candidates = rankPostV1GateESNumericCoverageCandidates();

    for (const candidate of candidates) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }

    expect(POST_V1_GATE_ES_NO_RUNTIME_COUNTERS).toMatchObject({
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

  it("keeps docs and current-gate runner aligned with Gate ES closeout and Gate ET selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_ES_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("Gate ET");
      expect(normalizedWhitespaceContent, path).toContain(
        "reinforced-concrete visible-derived missing-input boundary"
      );
      expect(contents, path).toContain("roiAnalysisIterations: 2");
      expect(contents, path).toContain("estimatedNextFrontendImplementationFilesTouched 1");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const plan = readRepoFile(POST_V1_GATE_ES_PLAN_DOC_PATH);
    expect(plan).toContain("Gate ES Iteration 1");
    expect(plan).toContain("Gate ES Iteration 2");
    expect(plan).toContain("Gate ET Work Order");
    expect(plan).toContain("resilientLayerDynamicStiffnessMNm3");
    expect(plan).toContain("loadBasisKgM2");
    expect(plan).toContain("ceilingOrLowerAssembly");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts"
    );
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts");
  });
});

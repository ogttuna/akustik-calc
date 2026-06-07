import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID
} from "./composite-panel-published-interaction-runtime-constants";
import { buildImpactPredictorInputFromLayerStack } from "./impact-predictor-input";
import {
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTION_STATUS,
  POST_V1_GATE_ED_COUNTERS
} from "./post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed";
import {
  POST_V1_GATE_EE_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EE_PLAN_DOC_PATH,
  POST_V1_GATE_EE_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_EE_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EE_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTION_STATUS,
  rankPostV1GateEENumericCoverageCandidates,
  summarizePostV1GateEENumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ee";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const COMPOSITE_SUSPENDED_CEILING_ONLY_LAYERS = [
  { floorRole: "base_structure", materialId: "steel_deck_composite", thicknessMm: 150 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 150 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
] as const satisfies readonly LayerInput[];

const COMPOSITE_ROUTE_TARGET_OUTPUTS = [
  "Rw",
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateVisibleCompositeSuspendedCeilingOnly() {
  const impactPredictorInput = buildImpactPredictorInputFromLayerStack(
    COMPOSITE_SUSPENDED_CEILING_ONLY_LAYERS,
    {},
    { contextMode: "element_lab" }
  );

  return calculateImpactOnly(COMPOSITE_SUSPENDED_CEILING_ONLY_LAYERS, {
    impactPredictorInput,
    targetOutputs: COMPOSITE_ROUTE_TARGET_OUTPUTS
  });
}

describe("post-V1 next numeric coverage gap Gate EE", () => {
  it("lands after Gate ED and selects the Gate EF composite route-boundary plan", () => {
    const summary = summarizePostV1GateEENumericCoverageGap();

    expect(POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTION_STATUS).toBe(
      "post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_runtime_gate_ed_landed_runtime_selected_next_numeric_coverage_gap_gate_ee"
    );
    expect(POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_LANDED_GATE
    );
    expect(POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ee-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EE_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EE_PLAN_DOC_PATH,
      previousGateED: {
        counters: POST_V1_GATE_ED_COUNTERS,
        selectedNextAction:
          POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION,
        selectedNextFile:
          POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_FILE,
        selectionStatus:
          POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_EE_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_EE_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTION_STATUS
    });
  });

  it("selects composite suspended-ceiling-only route boundary over lower-ROI or blocked candidates", () => {
    const candidates = rankPostV1GateEENumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const astmSurface = candidates.find((candidate) => candidate.id === "floor.astm_iic_aiic_user_band_input_surface");
    const ciSurface = candidates.find((candidate) => candidate.id === "floor.explicit_impact_ci_low_frequency_surface_gap");
    const closedEd = candidates.find((candidate) => candidate.id === "floor.heavy_concrete_resilient_channel_gap_closed_by_ed");
    const wrongMetricCandidates = candidates.filter(
      (candidate) => candidate.sliceKind === "blocked_wrong_metric_derivation"
    );

    expect(candidates).toHaveLength(POST_V1_GATE_EE_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_EE_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      score: 3.18,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE,
      sliceKind: "runtime_route_boundary",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EE_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    });
    expect(selected?.score).toBeGreaterThan(astmSurface?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(ciSurface?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(closedEd?.score ?? 0);
    expect(wrongMetricCandidates).toHaveLength(2);
    expect(wrongMetricCandidates.every((candidate) => !candidate.passesCalculatorAdvancementTest)).toBe(true);
    expect(candidates.find((candidate) => candidate.id === "broad_source_row_crawl")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      selected: false,
      sliceKind: "blocked_non_goal"
    });
    expect(candidates.find((candidate) => candidate.id === "confidence_wording_or_frontend_polish")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      selected: false,
      sliceKind: "blocked_non_goal",
      touchesFrontendImplementation: true
    });
  });

  it("documents current runtime evidence without moving Gate EE runtime values", () => {
    const result = calculateVisibleCompositeSuspendedCeilingOnly();

    expect(result.ok).toBe(true);
    expect(result.impact).toMatchObject({
      DeltaLw: 20.7,
      LnW: 63.3,
      basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(result.impact?.metricBasis).toMatchObject({
      DeltaLw: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
      LnW: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(result.floorSystemRatings?.Rw).toBe(48.6);
    expect(result.supportedTargetOutputs).toEqual(COMPOSITE_ROUTE_TARGET_OUTPUTS);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
      selectedCandidateId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: COMPOSITE_ROUTE_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_EE_NO_RUNTIME_COUNTERS).toMatchObject({
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeValuesMoved: 0
    });
  });

  it("keeps the Gate EF implementation plan explicit and bounded", () => {
    expect(existsSync(join(REPO_ROOT, POST_V1_GATE_EE_PLAN_DOC_PATH))).toBe(true);

    const contents = readRepoFile(POST_V1_GATE_EE_PLAN_DOC_PATH);

    expect(contents).toContain(POST_V1_GATE_EE_SELECTED_CANDIDATE_ID);
    expect(contents).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION);
    expect(contents).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE);
    expect(contents).toContain(COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS);
    expect(contents).toContain("Rw 48.6");
    expect(contents).toContain("Ln,w 63.3");
    expect(contents).toContain("DeltaLw 20.7");
    expect(contents).toContain("sourceRowsImported: 0");
    expect(contents).toContain("frontendImplementationFilesTouched: 0");
  });

  it("keeps EE/EF current-selection docs and current-gate runner aligned", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EE_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("roiAnalysisIterations: 2");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ee-contract.test.ts");
  });
});

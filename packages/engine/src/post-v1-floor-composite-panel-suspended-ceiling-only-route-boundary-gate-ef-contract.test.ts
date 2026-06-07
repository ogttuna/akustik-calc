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
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_LANDED_GATE,
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTION_STATUS,
  POST_V1_GATE_EF_COUNTERS,
  POST_V1_GATE_EF_NEGATIVE_BOUNDARIES,
  POST_V1_GATE_EF_ROUTE_BRANCH,
  POST_V1_GATE_EF_RUNTIME_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EF_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EF_TARGET_OUTPUTS,
  POST_V1_GATE_EF_VISIBLE_STACK_EXPECTATION,
  summarizePostV1FloorCompositePanelSuspendedCeilingOnlyRouteBoundaryGateEF
} from "./post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTION_STATUS
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

const COMPOSITE_WITH_ASTM_ALIAS_OUTPUTS = [
  "Rw",
  "Ln,w",
  "DeltaLw",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateVisibleCompositeSuspendedCeilingOnly(
  targetOutputs: readonly RequestedOutputId[] = POST_V1_GATE_EF_TARGET_OUTPUTS
) {
  const impactPredictorInput = buildImpactPredictorInputFromLayerStack(
    COMPOSITE_SUSPENDED_CEILING_ONLY_LAYERS,
    {},
    { contextMode: "element_lab" }
  );

  return calculateImpactOnly(COMPOSITE_SUSPENDED_CEILING_ONLY_LAYERS, {
    impactPredictorInput,
    targetOutputs
  });
}

describe("post-V1 floor composite-panel suspended-ceiling-only route boundary Gate EF", () => {
  it("lands after Gate EE and returns the chain to numeric coverage rerank", () => {
    const summary = summarizePostV1FloorCompositePanelSuspendedCeilingOnlyRouteBoundaryGateEF();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ee_landed_no_runtime_selected_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_EF_COUNTERS,
      landedGate: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_LANDED_GATE,
      negativeBoundaries: POST_V1_GATE_EF_NEGATIVE_BOUNDARIES,
      noNumericValueMovement: true,
      routeBranch: POST_V1_GATE_EF_ROUTE_BRANCH,
      selectedCandidateId: POST_V1_GATE_EF_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_EF_TARGET_OUTPUTS,
      visibleStackExpectation: POST_V1_GATE_EF_VISIBLE_STACK_EXPECTATION
    });
    expect(POST_V1_GATE_EF_RUNTIME_SELECTED_CANDIDATE_ID).toBe(
      COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID
    );
  });

  it("pins visible composite suspended-ceiling-only layers to the published-interaction owner", () => {
    const result = calculateVisibleCompositeSuspendedCeilingOnly();

    expect(result.ok).toBe(true);
    expect(result.impact).toMatchObject({
      DeltaLw: POST_V1_GATE_EF_VISIBLE_STACK_EXPECTATION.deltaLwDb,
      LnW: POST_V1_GATE_EF_VISIBLE_STACK_EXPECTATION.lnWDb,
      basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(result.impact?.metricBasis).toMatchObject({
      DeltaLw: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
      LnW: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(result.floorSystemRatings?.Rw).toBe(POST_V1_GATE_EF_VISIBLE_STACK_EXPECTATION.rwDb);
    expect(result.supportedTargetOutputs).toEqual(POST_V1_GATE_EF_TARGET_OUTPUTS);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
      selectedCandidateId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: POST_V1_GATE_EF_TARGET_OUTPUTS
    });
  });

  it("keeps ASTM aliases and unrelated lower-treatment DeltaLw outside the composite route", () => {
    const astmAliases = calculateVisibleCompositeSuspendedCeilingOnly(COMPOSITE_WITH_ASTM_ALIAS_OUTPUTS);

    expect(astmAliases.impact).toMatchObject({
      DeltaLw: 20.7,
      LnW: 63.3,
      basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(astmAliases.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "DeltaLw"]);
    expect(astmAliases.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(POST_V1_GATE_EF_COUNTERS).toMatchObject({
      astmAliasesPromoted: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("keeps docs and current-gate runner aligned with Gate EF closeout and Gate EG selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EF_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS);
      expect(contents, path).toContain("Rw 48.6");
      expect(contents, path).toContain("Ln,w 63.3");
      expect(contents, path).toContain("DeltaLw 20.7");
      expect(contents, path).toContain("staleLowConfidenceParityRowsCorrected: 1");
      expect(contents, path).toContain("runtimeValuesMoved: 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ee-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef-contract.test.ts"
    );
  });
});

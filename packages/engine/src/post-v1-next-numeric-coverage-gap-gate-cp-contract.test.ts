import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS } from "./heavy-concrete-published-upper-treatment-estimate";
import {
  POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTION_STATUS
} from "./post-v1-floor-visible-layer-upper-package-delta-lw-gate-co";
import {
  POST_V1_GATE_CP_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_CP_PLAN_DOC_PATH,
  POST_V1_GATE_CP_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTION_STATUS,
  rankPostV1GateCPNumericCoverageCandidates,
  summarizePostV1GateCPNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-cp";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Ln,w", "DeltaLw", "Rw", "Ctr"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const VISIBLE_WET_ELASTIC_CEILING_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 65 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 }
] as const satisfies readonly LayerInput[];

const VISIBLE_WET_RIGID_CEILING_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 130 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 }
] as const satisfies readonly LayerInput[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate CP", () => {
  it("lands the no-runtime Gate CP rerank after Gate CO and selects common floating lower-treatment anchor Gate CQ", () => {
    const summary = summarizePostV1GateCPNumericCoverageGap();

    expect(POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTION_STATUS).toBe(
      "post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_landed_runtime_selected_next_numeric_coverage_gap_gate_cp"
    );
    expect(POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_LANDED_GATE
    );
    expect(POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cp-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_CP_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_CP_PLAN_DOC_PATH,
      selectedCandidateId: "floor.common_floating_lower_treatment_published_anchor_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTION_STATUS
    });
  });

  it("selects the highest ROI calculator slice by runtime formula/anchor coverage", () => {
    const candidates = rankPostV1GateCPNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_CP_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: "floor.common_floating_lower_treatment_published_anchor_gap",
      passesCalculatorAdvancementTest: true,
      runtimeAdmissibleNext: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CP_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.common_auto_topology_second_pass_after_cj")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0
    );
    expect(byId.get("floor.visible_layer_upper_package_delta_lw_formula_routing_gap")).toMatchObject({
      selected: false,
      sliceKind: "closed_runtime_gap"
    });

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording", "frontend_ui_polish"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("records the selected runtime gap as closed by Gate CQ on visible lower-treatment stacks", () => {
    for (const layers of [VISIBLE_WET_ELASTIC_CEILING_STACK, VISIBLE_WET_RIGID_CEILING_STACK]) {
      const result = calculateAssembly(layers, {
        calculator: "dynamic",
        targetOutputs: LAB_OUTPUTS
      });

      expect(result.supportedTargetOutputs).toEqual(["Ln,w", "Rw", "Ctr"]);
      expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
      expect(result.impact).toMatchObject({
        availableOutputs: ["Ln,w"],
        basis: HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS
      });
      expect(result.acousticAnswerBoundary).toMatchObject({
        missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3", "loadBasisKgM2"],
        origin: "needs_input",
        unsupportedOutputs: ["DeltaLw"]
      });
      expect(result.layerCombinationResolverTrace).toMatchObject({
        runtimeBasisId: HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS,
        selectedCandidateId: "floor.heavy_concrete_floating.published_upper_treatment_anchor_owned"
      });
    }
  });

  it("proves complete physical inputs already route to the heavy combined formula, so Gate CQ must preserve that path", () => {
    const complete = calculateAssembly(VISIBLE_WET_ELASTIC_CEILING_STACK, {
      calculator: "dynamic",
      floorImpactContext: {
        loadBasisKgM2: 100,
        resilientLayerDynamicStiffnessMNm3: 30
      },
      targetOutputs: LAB_OUTPUTS
    });

    expect(complete.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw", "Rw", "Ctr"]);
    expect(complete.unsupportedTargetOutputs).toEqual([]);
    expect(complete.impact).toMatchObject({
      DeltaLw: 28.7,
      LnW: 45.9,
      basis: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate"
    });
    expect(complete.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate",
      selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula"
    });
  });

  it("keeps ASTM aliases unsupported while selecting an ISO anchor/formula route", () => {
    const astm = calculateAssembly(VISIBLE_WET_ELASTIC_CEILING_STACK, {
      calculator: "dynamic",
      targetOutputs: ASTM_OUTPUTS
    });

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(astm.impact?.IIC).toBeUndefined();
    expect(astm.impact?.AIIC).toBeUndefined();
    expect(POST_V1_GATE_CP_NO_RUNTIME_COUNTERS.wrongAliasOrFallbackBlocks).toContain(
      "ISO floor impact outputs still do not publish ASTM IIC or AIIC aliases"
    );
    expect(POST_V1_GATE_CP_NO_RUNTIME_COUNTERS.wrongAliasOrFallbackBlocks).toContain(
      "visible heavy-floating plus lower-treatment stacks must keep the published-family Ln,w anchor live instead of letting the combined formula needs_input guard hide every impact output"
    );
    expect(POST_V1_GATE_CP_NO_RUNTIME_COUNTERS.wrongAliasOrFallbackBlocks).toContain(
      "complete load and dynamic-stiffness inputs must stay on the heavy combined upper/lower formula corridor"
    );
    expect(HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS).toBe(
      "predictor_heavy_concrete_published_upper_treatment_estimate"
    );
  });

  it("keeps docs and current-gate runner aligned with Gate CP selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("floor.common_floating_lower_treatment_published_anchor_gap");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cp.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-cp-contract.test.ts");
  });
});

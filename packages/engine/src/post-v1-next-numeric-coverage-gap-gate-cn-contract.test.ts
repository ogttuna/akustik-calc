import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_GATE_K_MASS_TIMBER_CLT_COMPLETE_INPUT,
  POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT
} from "./post-v1-floor-timber-clt-delta-lw-resolver-gate-k";
import {
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";
import {
  GATE_B_CLT_LAYERS,
  GATE_B_TIMBER_JOIST_LAYERS
} from "./timber-clt-floor-impact-delta-lw-input-contract";
import {
  POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION,
  POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE,
  POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTION_STATUS
} from "./post-v1-required-physical-input-surface-parity-gate-cm";
import {
  POST_V1_GATE_CN_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_CN_PLAN_DOC_PATH,
  POST_V1_GATE_CN_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTION_STATUS,
  rankPostV1GateCNNumericCoverageCandidates,
  summarizePostV1GateCNNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-cn";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

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

describe("post-V1 next numeric coverage gap Gate CN", () => {
  it("lands the no-runtime Gate CN rerank after Gate CM and selects visible-layer upper-package DeltaLw Gate CO", () => {
    const summary = summarizePostV1GateCNNumericCoverageGap();

    expect(POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTION_STATUS).toBe(
      "post_v1_required_physical_input_surface_parity_gate_cm_landed_no_runtime_selected_next_numeric_coverage_gap_gate_cn"
    );
    expect(POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_LANDED_GATE
    );
    expect(POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cn-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_CN_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_CN_PLAN_DOC_PATH,
      selectedCandidateId: "floor.visible_layer_upper_package_delta_lw_formula_routing_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTION_STATUS
    });
  });

  it("selects the highest ROI calculator slice by layer-formula coverage, not source rows or confidence wording", () => {
    const candidates = rankPostV1GateCNNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_CN_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: "floor.visible_layer_upper_package_delta_lw_formula_routing_gap",
      passesCalculatorAdvancementTest: true,
      runtimeAdmissibleNext: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CN_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.common_auto_topology_second_pass_after_cj")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0
    );

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording", "frontend_ui_polish"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("records the selected gap now closed by Gate CO: visible layer input reaches the same DeltaLw formula owners", () => {
    const timberVisible = calculateAssembly(GATE_B_TIMBER_JOIST_LAYERS, {
      floorImpactContext: {
        loadBasisKgM2: POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT.loadBasisKgM2,
        resilientLayerDynamicStiffnessMNm3:
          POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT.resilientLayer.dynamicStiffnessMNm3
      },
      targetOutputs: LAB_OUTPUTS
    });
    const timberExplicit = calculateAssembly(GATE_B_TIMBER_JOIST_LAYERS, {
      impactPredictorInput: POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT,
      targetOutputs: LAB_OUTPUTS
    });
    const cltVisible = calculateAssembly(GATE_B_CLT_LAYERS, {
      floorImpactContext: {
        loadBasisKgM2: POST_V1_GATE_K_MASS_TIMBER_CLT_COMPLETE_INPUT.loadBasisKgM2,
        resilientLayerDynamicStiffnessMNm3:
          POST_V1_GATE_K_MASS_TIMBER_CLT_COMPLETE_INPUT.resilientLayer.dynamicStiffnessMNm3
      },
      targetOutputs: LAB_OUTPUTS
    });
    const cltExplicit = calculateAssembly(GATE_B_CLT_LAYERS, {
      impactPredictorInput: POST_V1_GATE_K_MASS_TIMBER_CLT_COMPLETE_INPUT,
      targetOutputs: LAB_OUTPUTS
    });

    expect(timberVisible.impact).toMatchObject({
      DeltaLw: 25.2,
      LnW: 51
    });
    expect(timberVisible.impact?.metricBasis?.DeltaLw).toBe(TIMBER_JOIST_DELTA_LW_FORMULA_BASIS);
    expect(timberVisible.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(timberVisible.unsupportedTargetOutputs).toEqual([]);

    expect(timberExplicit.impact).toMatchObject({
      DeltaLw: 25.2,
      LnW: 51,
      metricBasis: {
        DeltaLw: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
      }
    });
    expect(timberExplicit.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);

    expect(cltVisible.impact).toMatchObject({
      DeltaLw: 22.6,
      LnW: 50
    });
    expect(cltVisible.impact?.metricBasis?.DeltaLw).toBe(MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS);
    expect(cltVisible.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(cltVisible.unsupportedTargetOutputs).toEqual([]);

    expect(cltExplicit.impact).toMatchObject({
      DeltaLw: 22.6,
      LnW: 50,
      metricBasis: {
        DeltaLw: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
      }
    });
    expect(cltExplicit.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("records Gate CO boundaries explicitly: DeltaLw is not an ASTM alias and missing owner fields must become needs_input", () => {
    const astmFromVisibleTimber = calculateAssembly(GATE_B_TIMBER_JOIST_LAYERS, {
      floorImpactContext: {
        loadBasisKgM2: POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT.loadBasisKgM2,
        resilientLayerDynamicStiffnessMNm3:
          POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT.resilientLayer.dynamicStiffnessMNm3
      },
      targetOutputs: ASTM_OUTPUTS
    });
    const missingLoadBasis = calculateAssembly(GATE_B_TIMBER_JOIST_LAYERS, {
      floorImpactContext: {
        resilientLayerDynamicStiffnessMNm3:
          POST_V1_GATE_K_TIMBER_JOIST_COMPLETE_INPUT.resilientLayer.dynamicStiffnessMNm3
      },
      targetOutputs: ["DeltaLw"]
    });

    expect(astmFromVisibleTimber.supportedTargetOutputs).toEqual([]);
    expect(astmFromVisibleTimber.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(astmFromVisibleTimber.impact?.IIC).toBeUndefined();
    expect(astmFromVisibleTimber.impact?.AIIC).toBeUndefined();

    expect(missingLoadBasis.supportedTargetOutputs).toEqual([]);
    expect(missingLoadBasis.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(missingLoadBasis.impact?.DeltaLw).toBeUndefined();
    expect(POST_V1_GATE_CN_NO_RUNTIME_COUNTERS.wrongAliasOrFallbackBlocks).toContain(
      "missing load basis, missing dynamic stiffness, or missing lower assembly must remain needs_input"
    );
  });

  it("keeps docs and current-gate runner aligned with Gate CN selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("floor.visible_layer_upper_package_delta_lw_formula_routing_gap");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cn.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-cn-contract.test.ts");
  });
});

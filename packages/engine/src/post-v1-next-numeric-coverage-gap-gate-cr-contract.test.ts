import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTION_STATUS
} from "./post-v1-floor-common-floating-lower-treatment-anchor-gate-cq";
import {
  POST_V1_GATE_CR_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_CR_PLAN_DOC_PATH,
  POST_V1_GATE_CR_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTION_STATUS,
  rankPostV1GateCRNumericCoverageCandidates,
  summarizePostV1GateCRNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-cr";
import {
  POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS,
  POST_V1_GATE_CJ_BUILDING_VALUE_PINS
} from "./post-v1-wall-common-auto-topology-expansion-gate-cj";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const SIMPLE_DOUBLE_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const COMPLETE_BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 42,
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

const EXPLICIT_FLAT_LAYER_ORDER_BUILDING_CONTEXT = {
  ...COMPLETE_BUILDING_CONTEXT,
  wallTopology: {
    supportTopology: "independent_frames",
    topologyMode: "flat_layer_order"
  }
} as const satisfies AirborneContext;

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

describe("post-V1 next numeric coverage gap Gate CR", () => {
  it("lands the no-runtime Gate CR rerank after Gate CQ and selects wall auto-topology Gate CS", () => {
    const summary = summarizePostV1GateCRNumericCoverageGap();

    expect(POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTION_STATUS).toBe(
      "post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_landed_runtime_selected_next_numeric_coverage_gap_gate_cr"
    );
    expect(POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_LANDED_GATE
    );
    expect(POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cr-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_CR_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_CR_PLAN_DOC_PATH,
      selectedCandidateId: "wall.common_auto_topology_second_pass_after_cj",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTION_STATUS
    });
  });

  it("selects the highest ROI calculator slice by formula-routing scope, not source crawling or frontend work", () => {
    const candidates = rankPostV1GateCRNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_CR_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: "wall.common_auto_topology_second_pass_after_cj",
      passesCalculatorAdvancementTest: true,
      runtimeAdmissibleNext: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CR_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.common_floating_lower_treatment_direct_flanking_field_context_gap")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0
    );

    for (
      const closedId of [
        "floor.common_floating_lower_treatment_published_anchor_gap",
        "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
      ] as const
    ) {
      expect(byId.get(closedId)).toMatchObject({
        selected: false,
        sliceKind: "closed_runtime_gap"
      });
    }

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording", "frontend_ui_polish"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("records the selected Gate CS runtime gap now closed while Gate CR itself moved no values", () => {
    const gateCJImplicit = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS
    });
    const explicitFlatOrder = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: EXPLICIT_FLAT_LAYER_ORDER_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS
    });

    expect(gateCJImplicit.supportedTargetOutputs).toEqual([...POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS]);
    expect(gateCJImplicit.metrics).toMatchObject({
      estimatedDnADb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["Dn,A"],
      estimatedDnTADb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["DnT,A"],
      estimatedDnTwDb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["DnT,w"],
      estimatedDnWDb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["Dn,w"],
      estimatedRwPrimeDb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["R'w"]
    });
    expect(gateCJImplicit.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(explicitFlatOrder.supportedTargetOutputs).toEqual([...POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS]);
    expect(explicitFlatOrder.unsupportedTargetOutputs).toEqual([]);
    expect(explicitFlatOrder.metrics).toMatchObject({
      estimatedDnADb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["Dn,A"],
      estimatedDnTADb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["DnT,A"],
      estimatedDnTwDb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["DnT,w"],
      estimatedDnWDb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["Dn,w"],
      estimatedRwPrimeDb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["R'w"]
    });
    expect(explicitFlatOrder.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(explicitFlatOrder.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: "candidate_airborne_building_prediction_all_owner_family_physics_prediction"
    });
    expect(POST_V1_GATE_CR_NO_RUNTIME_COUNTERS.runtimeValuesMoved).toBe(0);
  });

  it("records the Gate CS safety boundary before any runtime widening happens", () => {
    expect(POST_V1_GATE_CR_NO_RUNTIME_COUNTERS.wrongAliasOrFallbackBlocks).toEqual([
      "explicit flat_layer_order wall requests may be admitted only when safe segmentation and required support owners are present",
      "missing supportTopology, missing studSpacingMm, and missing resilientBarSideCount must remain needs_input",
      "ambiguous multicavity flat lists with explicit grouping uncertainty must stay blocked instead of guessing leaf/cavity ownership",
      "lab Rw/STC/C/Ctr must not alias into field or building R'w/Dn,w/DnT,w outputs",
      "ISO floor impact routes still do not publish ASTM IIC or AIIC aliases"
    ]);
    expect(POST_V1_GATE_CR_NO_RUNTIME_COUNTERS.frontendImplementationFilesTouched).toBe(0);
    expect(POST_V1_GATE_CR_NO_RUNTIME_COUNTERS.estimatedNextRuntimeCorrectedLayerTemplates).toBe(5);
    expect(POST_V1_GATE_CR_NO_RUNTIME_COUNTERS.estimatedNextRuntimeCorrectedRequestShapes).toBe(25);
  });

  it("keeps docs and current-gate runner aligned with Gate CR selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("wall.common_auto_topology_second_pass_after_cj");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cr.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-cr-contract.test.ts");
  });
});

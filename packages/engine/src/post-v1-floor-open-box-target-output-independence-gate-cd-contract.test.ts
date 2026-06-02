import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cc";

const LANDED_GATE = "post_v1_floor_open_box_target_output_independence_gate_cd_plan";
const SELECTION_STATUS =
  "post_v1_floor_open_box_target_output_independence_gate_cd_landed_selected_next_numeric_coverage_gap_gate_ce";
const SELECTED_NEXT_ACTION = "post_v1_next_numeric_coverage_gap_gate_ce_plan";
const SELECTED_NEXT_FILE = "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ce-contract.test.ts";
const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 4,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 55
} as const satisfies AirborneContext;

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const DRY_GYPSUM_FIBER_SOURCE_ABSENT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 32 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 45 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const EPS_SCREED_HYBRID_VARIANT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 43 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const OPEN_BOX_SINGLE_OUTPUT_CASES = [
  { expected: 66, impactKey: null, metricKey: "estimatedRwDb", output: "Rw", stack: DRY_GYPSUM_FIBER_SOURCE_ABSENT },
  { expected: -3.9, impactKey: null, metricKey: "estimatedCDb", output: "C", stack: DRY_GYPSUM_FIBER_SOURCE_ABSENT },
  { expected: 50.8, impactKey: "LnW", metricKey: null, output: "Ln,w", stack: DRY_GYPSUM_FIBER_SOURCE_ABSENT },
  { expected: 52.8, impactKey: "LPrimeNW", metricKey: null, output: "L'n,w", stack: DRY_GYPSUM_FIBER_SOURCE_ABSENT },
  { expected: 50.4, impactKey: "LPrimeNTw", metricKey: null, output: "L'nT,w", stack: DRY_GYPSUM_FIBER_SOURCE_ABSENT },
  { expected: 53.7, impactKey: "LPrimeNT50", metricKey: null, output: "L'nT,50", stack: DRY_GYPSUM_FIBER_SOURCE_ABSENT },
  { expected: 72, impactKey: null, metricKey: "estimatedRwDb", output: "Rw", stack: EPS_SCREED_HYBRID_VARIANT },
  { expected: -1.3, impactKey: null, metricKey: "estimatedCDb", output: "C", stack: EPS_SCREED_HYBRID_VARIANT },
  { expected: 47, impactKey: "LnW", metricKey: null, output: "Ln,w", stack: EPS_SCREED_HYBRID_VARIANT },
  { expected: 49, impactKey: "LPrimeNW", metricKey: null, output: "L'n,w", stack: EPS_SCREED_HYBRID_VARIANT },
  { expected: 46.6, impactKey: "LPrimeNTw", metricKey: null, output: "L'nT,w", stack: EPS_SCREED_HYBRID_VARIANT },
  { expected: 47.6, impactKey: "LPrimeNT50", metricKey: null, output: "L'nT,50", stack: EPS_SCREED_HYBRID_VARIANT }
] as const satisfies readonly {
  readonly expected: number;
  readonly impactKey: "LnW" | "LPrimeNW" | "LPrimeNTw" | "LPrimeNT50" | null;
  readonly metricKey: "estimatedRwDb" | "estimatedCDb" | null;
  readonly output: RequestedOutputId;
  readonly stack: readonly LayerInput[];
}[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CHECKPOINT_2026-06-02_DOCS_IMPLEMENTATION_SYNC_AFTER_GATE_CD.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_CC_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_CD_OPEN_BOX_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor open-box target-output independence Gate CD", () => {
  it("lands a value-moving runtime gate selected by Gate CC", () => {
    expect({
      landedGate: LANDED_GATE,
      previousGateCCSelectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTED_NEXT_ACTION,
      previousGateCCSelectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTED_NEXT_FILE,
      previousGateCCSelectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTION_STATUS,
      runtimeMovementThisGate: true,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectionStatus: SELECTION_STATUS
    }).toEqual({
      landedGate: "post_v1_floor_open_box_target_output_independence_gate_cd_plan",
      previousGateCCSelectedNextAction: "post_v1_floor_open_box_target_output_independence_gate_cd_plan",
      previousGateCCSelectedNextFile:
        "packages/engine/src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts",
      previousGateCCSelectionStatus:
        "post_v1_next_numeric_coverage_gap_gate_cc_landed_no_runtime_selected_floor_open_box_target_output_independence_gate_cd",
      runtimeMovementThisGate: true,
      selectedNextAction: "post_v1_next_numeric_coverage_gap_gate_ce_plan",
      selectedNextFile: "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ce-contract.test.ts",
      selectionStatus:
        "post_v1_floor_open_box_target_output_independence_gate_cd_landed_selected_next_numeric_coverage_gap_gate_ce"
    });
  });

  it("supports already-owned open-box package values when each output is requested alone", () => {
    for (const probe of OPEN_BOX_SINGLE_OUTPUT_CASES) {
      const result = calculateAssembly(probe.stack, {
        airborneContext: BUILDING_CONTEXT,
        calculator: "dynamic",
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: [probe.output]
      });

      expect(result.supportedTargetOutputs, probe.output).toEqual([probe.output]);
      expect(result.unsupportedTargetOutputs, probe.output).toEqual([]);
      if (probe.metricKey) {
        expect(result.metrics[probe.metricKey]).toBe(probe.expected);
      }
      if (probe.impactKey) {
        expect(result.impact?.[probe.impactKey]).toBe(probe.expected);
      }
    }
  });

  it("keeps package basis and full mixed pins unchanged after making target outputs independent", () => {
    const dry = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: ["Rw", "C", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]
    });
    const eps = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: ["Rw", "C", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(dry.supportedTargetOutputs).toEqual(["Rw", "C", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(dry.floorSystemRatings).toMatchObject({
      Rw: 66,
      RwCtrSemantic: "rw_plus_c",
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(dry.impact).toMatchObject({
      LPrimeNT50: 53.7,
      LPrimeNTw: 50.4,
      LPrimeNW: 52.8,
      LnW: 50.8
    });

    expect(eps.supportedTargetOutputs).toEqual(["Rw", "C", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(eps.floorSystemRatings).toMatchObject({
      C: -1.3,
      Rw: 72,
      RwCtrSemantic: "rw_plus_c",
      basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
    });
    expect(eps.impact).toMatchObject({
      LPrimeNT50: 47.6,
      LPrimeNTw: 46.6,
      LPrimeNW: 49,
      LnW: 47
    });
  });

  it("preserves missing-input and metric-basis boundaries", () => {
    const missingFieldContext = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"]
    });
    const unsupportedAliases = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: ["Ctr", "IIC", "AIIC"]
    });

    expect(missingFieldContext.supportedTargetOutputs).toEqual([]);
    expect(missingFieldContext.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50"]);
    expect(missingFieldContext.impact?.LPrimeNW).toBeUndefined();
    expect(missingFieldContext.impact?.LPrimeNTw).toBeUndefined();
    expect(missingFieldContext.impact?.LPrimeNT50).toBeUndefined();

    expect(unsupportedAliases.supportedTargetOutputs).toEqual([]);
    expect(unsupportedAliases.unsupportedTargetOutputs).toEqual(["Ctr", "IIC", "AIIC"]);
    expect(unsupportedAliases.metrics?.estimatedCtrDb).toEqual(expect.any(Number));
  });

  it("keeps docs and current-gate runner aligned with Gate CD runtime closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(LANDED_GATE);
      expect(contents, path).toContain(SELECTION_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain("target-output independence");
      expect(contents, path).toContain("single-output");
      expect(contents, path).toContain("Ctr");
      expect(contents, path).toContain("IIC");
      expect(contents, path).toContain("AIIC");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts");
  });
});

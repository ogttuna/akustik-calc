import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS } from "./heavy-concrete-combined-impact-formula-corridor";
import { HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS } from "./heavy-concrete-published-upper-treatment-estimate";
import {
  POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_LANDED_GATE,
  POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTION_STATUS,
  POST_V1_GATE_CQ_COUNTERS,
  POST_V1_GATE_CQ_TARGET_OUTPUTS,
  POST_V1_GATE_CQ_VALUE_PINS,
  summarizePostV1FloorCommonFloatingLowerTreatmentAnchorGateCQ
} from "./post-v1-floor-common-floating-lower-treatment-anchor-gate-cq";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cp";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Ln,w", "DeltaLw", "Rw", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = POST_V1_GATE_CQ_TARGET_OUTPUTS;
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const FIELD_CONTEXT = {
  ci50_2500Db: 4,
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const VISIBLE_WET_ACOUSTIC_HANGER_CEILING_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 65 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 }
] as const satisfies readonly LayerInput[];

const VISIBLE_WET_RESILIENT_STUD_CEILING_STACK = [
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

describe("post-V1 floor common floating lower-treatment anchor Gate CQ", () => {
  it("lands Gate CQ after Gate CP and selects the next numeric coverage rerank", () => {
    const summary = summarizePostV1FloorCommonFloatingLowerTreatmentAnchorGateCQ();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_cp_landed_no_runtime_selected_floor_common_floating_lower_treatment_anchor_gate_cq"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_CQ_COUNTERS,
      landedGate: POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_CQ_TARGET_OUTPUTS,
      valuePins: POST_V1_GATE_CQ_VALUE_PINS
    });
  });

  it("keeps the published-family Ln,w anchor live for visible common floating lower-treatment stacks", () => {
    const cases = [
      {
        layers: VISIBLE_WET_ACOUSTIC_HANGER_CEILING_STACK,
        pin: POST_V1_GATE_CQ_VALUE_PINS.acousticHangerLowerTreatment
      },
      {
        layers: VISIBLE_WET_RESILIENT_STUD_CEILING_STACK,
        pin: POST_V1_GATE_CQ_VALUE_PINS.resilientStudLowerTreatment
      }
    ] as const;

    for (const testCase of cases) {
      const result = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        targetOutputs: LAB_OUTPUTS
      });

      expect(result.impact).toMatchObject({
        LnW: testCase.pin.metrics["Ln,w"],
        availableOutputs: ["Ln,w"],
        basis: HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS
      });
      expect(result.impact?.DeltaLw).toBeUndefined();
      expect(result.supportedTargetOutputs).toEqual(["Ln,w", "Rw", "Ctr"]);
      expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
      expect(result.acousticAnswerBoundary).toMatchObject({
        missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3", "loadBasisKgM2"],
        origin: "needs_input",
        unsupportedOutputs: ["DeltaLw"]
      });
      expect(result.layerCombinationResolverTrace).toMatchObject({
        runtimeBasisId: HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS,
        selectedCandidateId: testCase.pin.candidateId,
        supportedMetrics: expect.arrayContaining(["Ln,w"]),
        valuePins: expect.arrayContaining([
          {
            metric: "Ln,w",
            value: testCase.pin.metrics["Ln,w"]
          }
        ])
      });
    }
  });

  it("publishes field impact companions from the same lower-treatment anchor with explicit field context", () => {
    const cases = [
      {
        layers: VISIBLE_WET_ACOUSTIC_HANGER_CEILING_STACK,
        pin: POST_V1_GATE_CQ_VALUE_PINS.acousticHangerLowerTreatment
      },
      {
        layers: VISIBLE_WET_RESILIENT_STUD_CEILING_STACK,
        pin: POST_V1_GATE_CQ_VALUE_PINS.resilientStudLowerTreatment
      }
    ] as const;

    for (const testCase of cases) {
      const result = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      expect(result.impact).toMatchObject({
        LPrimeNT50: testCase.pin.metrics["L'nT,50"],
        LPrimeNTw: testCase.pin.metrics["L'nT,w"],
        LPrimeNW: testCase.pin.metrics["L'n,w"],
        LnW: testCase.pin.metrics["Ln,w"],
        basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
      });
      expect(result.impact?.metricBasis).toMatchObject({
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LnW: HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS
      });
      expect(result.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
      expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
      expect(result.acousticAnswerBoundary).toMatchObject({
        missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3", "loadBasisKgM2"],
        origin: "needs_input",
        unsupportedOutputs: ["DeltaLw"]
      });
    }
  });

  it("preserves the complete heavy combined formula path when the physical inputs are present", () => {
    const complete = calculateAssembly(VISIBLE_WET_ACOUSTIC_HANGER_CEILING_STACK, {
      calculator: "dynamic",
      floorImpactContext: {
        loadBasisKgM2: 100,
        resilientLayerDynamicStiffnessMNm3: 30
      },
      targetOutputs: LAB_OUTPUTS
    });

    expect(complete.impact).toMatchObject({
      DeltaLw: 28.7,
      LnW: 45.9,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      scope: "heavy_concrete_combined_upper_lower_formula_corridor"
    });
    expect(complete.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw", "Rw", "Ctr"]);
    expect(complete.unsupportedTargetOutputs).toEqual([]);
    expect(complete.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula"
    });
  });

  it("keeps ASTM aliases unsupported while widening the ISO impact anchor route", () => {
    const astm = calculateAssembly(VISIBLE_WET_ACOUSTIC_HANGER_CEILING_STACK, {
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: ASTM_OUTPUTS
    });

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(astm.acousticAnswerBoundary).toMatchObject({
      origin: "unsupported",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
    expect(astm.impact?.IIC).toBeUndefined();
    expect(astm.impact?.AIIC).toBeUndefined();
    expect(POST_V1_GATE_CQ_COUNTERS.wrongFallbackOrAliasBlocks).toContain(
      "ISO impact routes still do not publish ASTM IIC or AIIC aliases"
    );
  });

  it("keeps docs and current-gate runner aligned with the landed Gate CQ runtime move", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("Ln,w 43");
      expect(contents, path).toContain("Ln,w 51.5");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts");
  });
});

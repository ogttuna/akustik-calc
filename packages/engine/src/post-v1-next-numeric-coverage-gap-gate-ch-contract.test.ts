import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS } from "./heavy-concrete-published-upper-treatment-estimate";
import {
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_LANDED_GATE,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTION_STATUS
} from "./post-v1-floor-common-floating-covering-expansion-gate-cg2";
import {
  POST_V1_GATE_CH_COVERAGE_COUNTERS,
  POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTION_STATUS,
  summarizePostV1GateCHNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ch";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const HEAVY_FLOATING_UPPER_TREATMENT_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const DIRECT_FLANKING_FIELD_CONTEXT = {
  ci50_2500Db: 4,
  directPathOffsetDb: 2,
  flankingPaths: [
    {
      id: "gate_ch_rigid_wall_path",
      junctionClass: "rigid",
      label: "Gate CH explicit reinforced-concrete wall flanking path",
      levelOffsetDb: 4,
      pathCount: 1,
      pathType: "wall",
      supportingElementFamily: "reinforced_concrete"
    }
  ],
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const DIRECT_FLANKING_CONTEXT_WITHOUT_CI50 = {
  directPathOffsetDb: DIRECT_FLANKING_FIELD_CONTEXT.directPathOffsetDb,
  flankingPaths: DIRECT_FLANKING_FIELD_CONTEXT.flankingPaths,
  receivingRoomVolumeM3: DIRECT_FLANKING_FIELD_CONTEXT.receivingRoomVolumeM3
} as const satisfies ImpactFieldContext;

const FIELD_OUTPUTS = [
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const ASTM_BOUNDARY_OUTPUTS = ["IIC", "AIIC", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate CH", () => {
  it("lands the Gate CH field/building direct+flanking runtime correction after Gate CG2", () => {
    const summary = summarizePostV1GateCHNumericCoverageGap();

    expect(POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTION_STATUS).toBe(
      "post_v1_floor_common_floating_covering_expansion_gate_cg2_landed_selected_next_numeric_coverage_gap_gate_ch"
    );
    expect(POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE
    );
    expect(POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts"
    );
    expect(summary).toMatchObject({
      coverageCounters: POST_V1_GATE_CH_COVERAGE_COUNTERS,
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE,
      noRuntimeValueMovement: false,
      previousGateCG2: {
        landedGate: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_ACTION,
        selectionStatus: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTION_STATUS
      },
      runtimeMovementThisGate:
        "floor_direct_flanking_low_frequency_ci50_owner_used_for_published_upper_treatment_field_adapter",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTION_STATUS,
      valuePins: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS
    });
  });

  it("uses explicit CI,50-2500 in the direct+flanking field adapter and publishes L'nT,50", () => {
    const result = calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
      calculator: "dynamic",
      impactFieldContext: DIRECT_FLANKING_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(result.acousticAnswerBoundary).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      CI50_2500: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS["CI,50-2500"],
      LPrimeNT50: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS["L'nT,50"],
      LPrimeNTw: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS["L'nT,w"],
      LPrimeNW: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS["L'n,w"],
      LnW: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS["Ln,w"],
      basis: "mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum",
      fieldEstimateDirectOffsetDb: 2,
      fieldEstimateFlankingFamilyModels: ["reinforced_concrete"],
      fieldEstimateFlankingPathCount: 1,
      fieldEstimateMaxPathModifierDb: 2,
      fieldEstimateProfile: "direct_flanking_energy_sum"
    });
    expect(result.impact?.metricBasis).toMatchObject({
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_direct_flanking_energy_sum_plus_ci50_2500",
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume",
      LPrimeNW: "estimated_field_lprimenw_from_direct_flanking_energy_sum",
      LnW: HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
      valuePins: [
        { metric: "L'n,w", value: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS["L'n,w"] },
        { metric: "L'nT,w", value: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS["L'nT,w"] },
        { metric: "L'nT,50", value: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS["L'nT,50"] }
      ]
    });
  });

  it("keeps L'nT,50 stopped when the direct+flanking low-frequency owner is missing", () => {
    const result = calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
      calculator: "dynamic",
      impactFieldContext: DIRECT_FLANKING_CONTEXT_WITHOUT_CI50,
      targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(result.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(result.impact).toMatchObject({
      LPrimeNTw: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS["L'nT,w"],
      LPrimeNW: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS["L'n,w"],
      basis: "mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum",
      fieldEstimateProfile: "direct_flanking_energy_sum"
    });
    expect(result.impact?.LPrimeNT50).toBeUndefined();
    expect(result.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["impactFieldContext.ci50_2500Db"],
      origin: "needs_input",
      unsupportedOutputs: ["L'nT,50"]
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requiredInputs: expect.arrayContaining(["impactFieldContext.ci50_2500Db"]),
      supportedMetrics: ["L'n,w", "L'nT,w"]
    });
  });

  it("does not turn ISO direct+flanking field impact into ASTM IIC or AIIC", () => {
    const result = calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
      calculator: "dynamic",
      impactFieldContext: DIRECT_FLANKING_FIELD_CONTEXT,
      targetOutputs: ASTM_BOUNDARY_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(result.impact).toMatchObject({
      LPrimeNT50: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS["L'nT,50"]
    });
    expect(result.impact?.IIC).toBeUndefined();
    expect(result.impact?.AIIC).toBeUndefined();
    expect(result.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: ["L'nT,50"]
    });
  });

  it("keeps docs and current-gate runner aligned with Gate CH closeout and Gate CI selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("L'n,w 57.5 / L'nT,w 55.1 / L'nT,50 59.1");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts");
  });
});

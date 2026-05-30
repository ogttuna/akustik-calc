import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { RequestedOutputId } from "@dynecho/shared";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  ENGINE_MIXED_GENERATED_CASES,
  FLOOR_IMPACT_FIELD_CONTEXT
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_FILE,
  POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTION_STATUS
} from "./post-v1-wall-framed-building-adapter-gate-ax";
import {
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_LANDED_GATE,
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTION_STATUS,
  POST_V1_GATE_AY_TUAS_C11C_LAB_IMPACT_OUTPUTS,
  POST_V1_GATE_AY_TUAS_C11C_UNSUPPORTED_OUTPUTS,
  POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS
} from "./post-v1-floor-tuas-c11c-iso-impact-gate-ay";
import {
  TUAS_C11C_COMBINED_WET_SOURCE_LAYERS,
  TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_BASIS,
  TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_SELECTED_CANDIDATE_ID,
  TUAS_C11C_SOURCE_FRAME
} from "./tuas-c11c-exact-import-readiness";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "DnT,w",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "DeltaLw",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

function generatedCase(id: string) {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!testCase) {
    throw new Error(`${id} generated case is missing`);
  }

  return testCase;
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate AY", () => {
  it("opens the TUAS C11c guarded ISO weighted impact tuple without importing it as an exact source", () => {
    const result = calculateImpactOnly(TUAS_C11C_COMBINED_WET_SOURCE_LAYERS, {
      targetOutputs: [
        ...POST_V1_GATE_AY_TUAS_C11C_LAB_IMPACT_OUTPUTS,
        ...POST_V1_GATE_AY_TUAS_C11C_UNSUPPORTED_OUTPUTS
      ]
    });

    expect(EXACT_FLOOR_SYSTEMS.some((system) => system.id === TUAS_C11C_SOURCE_FRAME.exactImportCandidateId)).toBe(false);
    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate).toBeNull();
    expect(result.impact).toMatchObject({
      CI: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["CI"],
      CI50_2500: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["CI,50-2500"],
      LnW: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["Ln,w"],
      LnWPlusCI: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["Ln,w+CI"],
      basis: TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_BASIS,
      labOrField: "lab"
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_AY_TUAS_C11C_LAB_IMPACT_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([...POST_V1_GATE_AY_TUAS_C11C_UNSUPPORTED_OUTPUTS]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      route: "floor",
      runtimeBasisId: TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_BASIS,
      selectedCandidateId: TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_SELECTED_CANDIDATE_ID,
      supportBucket: "anchored_estimate",
      supportedMetrics: [...POST_V1_GATE_AY_TUAS_C11C_LAB_IMPACT_OUTPUTS],
      valuePins: expect.arrayContaining([
        { metric: "Ln,w", value: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["Ln,w"] },
        { metric: "CI", value: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["CI"] },
        { metric: "CI,50-2500", value: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["CI,50-2500"] },
        { metric: "Ln,w+CI", value: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["Ln,w+CI"] }
      ])
    });
  });

  it("calculates C11c lab, field, and screening airborne companions on the generated workbench case", () => {
    const testCase = generatedCase("floor-tuas-c11c-fail-closed");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate).toBeNull();
    expect(result.floorSystemRatings).toMatchObject({
      Rw: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.screeningAirborne["Rw"],
      basis: "screening_mass_law_curve_seed_v3"
    });
    expect(result.metrics).toMatchObject({
      estimatedCDb: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.screeningAirborne["C"],
      estimatedCtrDb: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.screeningAirborne["Ctr"],
      estimatedDnTwDb: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.screeningAirborne["DnT,w"],
      estimatedRwPrimeDb: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.screeningAirborne["R'w"],
      estimatedStc: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.screeningAirborne["STC"]
    });
    expect(result.impact).toMatchObject({
      CI: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["CI"],
      CI50_2500: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["CI,50-2500"],
      LPrimeNT50: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.field["L'nT,50"],
      LPrimeNTw: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.field["L'nT,w"],
      LPrimeNW: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.field["L'n,w"],
      LnW: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["Ln,w"],
      LnWPlusCI: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["Ln,w+CI"],
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(result.impact?.metricBasis).toMatchObject({
      LnW: TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_BASIS,
      LnWPlusCI: TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_BASIS,
      LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500"
    });
    expect(result.supportedTargetOutputs).toEqual([
      "Rw",
      "STC",
      "C",
      "Ctr",
      "R'w",
      "DnT,w",
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual([...POST_V1_GATE_AY_TUAS_C11C_UNSUPPORTED_OUTPUTS]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      route: "floor",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"],
      valuePins: expect.arrayContaining([
        { metric: "L'n,w", value: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.field["L'n,w"] },
        { metric: "L'nT,w", value: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.field["L'nT,w"] },
        { metric: "L'nT,50", value: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.field["L'nT,50"] }
      ])
    });
  });

  it("keeps drifted C11c-like stacks and unsupported metric aliases closed", () => {
    const drifted = calculateImpactOnly(
      TUAS_C11C_COMBINED_WET_SOURCE_LAYERS.filter((layer) => layer.floorRole !== "ceiling_cavity"),
      {
        impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
        targetOutputs: [
          ...POST_V1_GATE_AY_TUAS_C11C_LAB_IMPACT_OUTPUTS,
          "L'n,w",
          "L'nT,w",
          "L'nT,50",
          ...POST_V1_GATE_AY_TUAS_C11C_UNSUPPORTED_OUTPUTS
        ]
      }
    );

    expect(drifted.impact).toBeNull();
    expect(drifted.supportedTargetOutputs).toEqual([]);
    expect(drifted.unsupportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AY_TUAS_C11C_LAB_IMPACT_OUTPUTS,
      "L'n,w",
      "L'nT,w",
      "L'nT,50",
      ...POST_V1_GATE_AY_TUAS_C11C_UNSUPPORTED_OUTPUTS
    ]);
  });

  it("consumes Gate AX and selects Gate AZ without source-catalog drift", () => {
    expect(POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTION_STATUS).toBe(
      "post_v1_wall_framed_building_adapter_gate_ax_landed_selected_next_numeric_coverage_gap_gate_ay"
    );
    expect(POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ay_plan"
    );
    expect(POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ay-contract.test.ts"
    );
    expect(POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_LANDED_GATE).toBe(
      "post_v1_floor_tuas_c11c_iso_impact_gate_ay_plan"
    );
    expect(POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTION_STATUS).toBe(
      "post_v1_floor_tuas_c11c_iso_impact_gate_ay_landed_selected_next_numeric_coverage_gap_gate_az"
    );
    expect(POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_az_plan"
    );
    expect(POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-az-contract.test.ts"
    );
    expect(POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AZ"
    );

    for (const path of [
      "AGENTS.md",
      "docs/README.md",
      "docs/calculator/README.md",
      "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md"
    ]) {
      const contents = readRepoFile(path);
      expect(contents, path).toContain(POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain("floor-tuas-c11c-fail-closed");
      expect(contents, path).toContain("Ln,w 59");
      expect(contents, path).toContain("L'nT,50 60.2");
      expect(contents, path).toContain(TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_BASIS);
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-gate-ay-contract.test.ts"
    );
  });
});

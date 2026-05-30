import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_LANDED_GATE,
  POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTION_STATUS,
  POST_V1_GATE_AC_FLOOR_FIELD_A_WEIGHTED_OUTPUTS,
  POST_V1_GATE_AC_FLOOR_FIELD_A_WEIGHTED_VALUE_PINS
} from "./post-v1-floor-field-a-weighted-surface-gate-ac";
import {
  POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_ACTION,
  POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_FILE,
  POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTION_STATUS
} from "./post-v1-wall-screening-rw-field-companion-gate-ab";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FLOOR_FIELD_A_WEIGHTED_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const FLOOR_FIELD_ADAPTER_TRACE_METRICS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "L'n,w",
  "L'nT,w"
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

describe("post-V1 floor field A-weighted surface Gate AC", () => {
  it("keeps calculated floor field Dn,w, Dn,A, DnT,w, and DnT,A live on complete heavy-concrete requests", () => {
    const testCase = generatedCase("floor-heavy-concrete");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: FLOOR_FIELD_A_WEIGHTED_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedDnADb: 56.1,
      estimatedDnTADb: 58.6,
      estimatedDnTwDb: 60,
      estimatedDnWDb: 57
    });
    expect(result.supportedTargetOutputs).toEqual([...FLOOR_FIELD_A_WEIGHTED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: [...FLOOR_FIELD_ADAPTER_TRACE_METRICS],
      valuePins: expect.arrayContaining([
        { metric: "Dn,w", value: 57 },
        { metric: "Dn,A", value: 56.1 },
        { metric: "DnT,w", value: 60 },
        { metric: "DnT,A", value: 58.6 }
      ])
    });
    for (const pin of POST_V1_GATE_AC_FLOOR_FIELD_A_WEIGHTED_VALUE_PINS) {
      if (pin.caseId === testCase.id) {
        expect(result.supportedTargetOutputs).toContain(pin.metric);
      }
    }
  });

  it("keeps calculated floor field Dn,w, Dn,A, DnT,w, and DnT,A live on complete lightweight-steel requests", () => {
    const testCase = generatedCase("floor-steel-fallback");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: FLOOR_FIELD_A_WEIGHTED_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedDnADb: 68.1,
      estimatedDnTADb: 70.6,
      estimatedDnTwDb: 72,
      estimatedDnWDb: 69
    });
    expect(result.supportedTargetOutputs).toEqual([
      "Rw",
      "STC",
      "C",
      "Ctr",
      "R'w",
      ...POST_V1_GATE_AC_FLOOR_FIELD_A_WEIGHTED_OUTPUTS,
      "Ln,w",
      "L'n,w",
      "L'nT,w"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: [...FLOOR_FIELD_ADAPTER_TRACE_METRICS],
      valuePins: expect.arrayContaining([
        { metric: "Dn,w", value: 69 },
        { metric: "Dn,A", value: 68.1 },
        { metric: "DnT,w", value: 72 },
        { metric: "DnT,A", value: 70.6 }
      ])
    });
  });

  it("does not reopen blocked exact-source or bound-only floor metric aliases", () => {
    const exact = generatedCase("floor-open-box-exact");
    const bound = generatedCase("floor-open-web-bound");
    const exactResult = calculateAssembly(exact.rows, {
      ...exact.fieldOptions,
      targetOutputs: FLOOR_FIELD_A_WEIGHTED_OUTPUTS
    });
    const boundResult = calculateAssembly(bound.rows, {
      ...bound.fieldOptions,
      targetOutputs: FLOOR_FIELD_A_WEIGHTED_OUTPUTS
    });

    expect(exactResult.floorSystemRatings?.basis).toBe("open_measured_floor_system_exact_match");
    expect(exactResult.unsupportedTargetOutputs).toEqual(["STC", "Ctr", "DeltaLw"]);
    expect(exactResult.supportedTargetOutputs).toEqual([
      "Rw",
      "C",
      "R'w",
      "Dn,w",
      "Dn,A",
      "DnT,w",
      "DnT,A",
      "Ln,w",
      "L'n,w",
      "L'nT,w"
    ]);

    expect(boundResult.floorSystemRatings?.basis).toBe("official_floor_system_bound_support");
    expect(boundResult.unsupportedTargetOutputs).toEqual(["C", "DeltaLw"]);
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTION_STATUS).toBe(
      "post_v1_wall_screening_rw_field_companion_gate_ab_landed_selected_next_numeric_coverage_gap_gate_ac"
    );
    expect(POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ac_plan"
    );
    expect(POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ac-contract.test.ts"
    );
    expect(POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_LANDED_GATE).toBe(
      "post_v1_floor_field_a_weighted_surface_gate_ac_plan"
    );
    expect(POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTION_STATUS).toBe(
      "post_v1_floor_field_a_weighted_surface_gate_ac_landed_selected_next_numeric_coverage_gap_gate_ad"
    );
    expect(POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ad_plan"
    );
    expect(POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ad-contract.test.ts"
    );
    expect(POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AD"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-field-a-weighted-surface-gate-ac-contract.test.ts");
  });
});

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_OWNER_AUDIT_WARNING_PREFIX } from "./acoustic-answer-engine-v1-owner-audit";
import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_LANDED_GATE,
  POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTION_STATUS,
  POST_V1_GATE_Z_FLOOR_SCREENING_RW_OUTPUTS,
  POST_V1_GATE_Z_TUAS_C11C_SCREENING_RW_VALUE_PINS
} from "./post-v1-floor-screening-rw-companion-gate-z";
import {
  POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTION_STATUS
} from "./post-v1-floor-screening-spectrum-companion-gate-y";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FLOOR_MIXED_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "DnT,w",
  "Ln,w",
  "DeltaLw",
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

describe("post-V1 floor screening Rw companion Gate Z", () => {
  it("keeps source-absent screening floor Rw live when later C11c impact coverage is active", () => {
    const testCase = generatedCase("floor-tuas-c11c-fail-closed");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: FLOOR_MIXED_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -5.7,
      estimatedRwDb: 47.6,
      estimatedRwPrimeDb: 47,
      estimatedStc: 47
    });
    expect(result.floorSystemRatings).toMatchObject({
      basis: "screening_mass_law_curve_seed_v3",
      Rw: 47
    });
    expect(result.supportedTargetOutputs).toEqual([
      "Rw",
      "STC",
      "C",
      "Ctr",
      "R'w",
      "DnT,w",
      "Ln,w",
      "L'n,w",
      "L'nT,w"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(result.impact).toMatchObject({
      LPrimeNTw: 59.2,
      LPrimeNW: 62,
      LnW: 59
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      route: "floor",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "DnT,w", "L'n,w", "L'nT,w"],
      valuePins: expect.arrayContaining([{ metric: "L'nT,w", value: 59.2 }])
    });
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw");
    expect(result.warnings.join("\n")).not.toContain(
      ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_OWNER_AUDIT_WARNING_PREFIX
    );
    for (const pin of POST_V1_GATE_Z_TUAS_C11C_SCREENING_RW_VALUE_PINS) {
      expect(result.supportedTargetOutputs).toContain(pin.metric);
    }
  });

  it("does not reopen exact or bound metric companions while adding screening Rw", () => {
    const cltExact = generatedCase("floor-clt-dry");
    const openWebBound = generatedCase("floor-open-web-bound");
    const cltResult = calculateAssembly(cltExact.rows, {
      ...cltExact.fieldOptions,
      targetOutputs: FLOOR_MIXED_OUTPUTS
    });
    const boundResult = calculateAssembly(openWebBound.rows, {
      ...openWebBound.fieldOptions,
      targetOutputs: FLOOR_MIXED_OUTPUTS
    });

    expect(cltResult.floorSystemRatings?.basis).toBe("official_floor_system_exact_match");
    expect(cltResult.supportedTargetOutputs).toEqual([
      "Rw",
      "R'w",
      "DnT,w",
      "Ln,w",
      "L'n,w",
      "L'nT,w"
    ]);
    expect(cltResult.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr", "DeltaLw"]);

    expect(boundResult.floorSystemRatings?.basis).toBe("official_floor_system_bound_support");
    expect(boundResult.supportedTargetOutputs).toEqual([
      "Rw",
      "STC",
      "Ctr",
      "R'w",
      "DnT,w",
      "Ln,w",
      "L'n,w",
      "L'nT,w"
    ]);
    expect(boundResult.unsupportedTargetOutputs).toEqual(["C", "DeltaLw"]);
  });

  it("does not route wall requests through the floor screening companion", () => {
    const testCase = generatedCase("wall-screening-concrete");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });

    expect(result.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      route: "wall",
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter"
    });
    expect(result.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      "floor.screening_airborne.source_absent"
    );
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTION_STATUS).toBe(
      "post_v1_floor_screening_spectrum_companion_gate_y_landed_selected_next_numeric_coverage_gap_gate_z"
    );
    expect(POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_z_plan"
    );
    expect(POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-z-contract.test.ts"
    );
    expect(POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_LANDED_GATE).toBe(
      "post_v1_floor_screening_rw_companion_gate_z_plan"
    );
    expect(POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTION_STATUS).toBe(
      "post_v1_floor_screening_rw_companion_gate_z_landed_selected_next_numeric_coverage_gap_gate_aa"
    );
    expect(POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_aa_plan"
    );
    expect(POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aa-contract.test.ts"
    );
    expect(POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AA"
    );
    expect(POST_V1_GATE_Z_FLOOR_SCREENING_RW_OUTPUTS).toEqual(["Rw"]);

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-screening-rw-companion-gate-z-contract.test.ts");
  });
});

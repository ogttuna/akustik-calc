import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD } from "./dynamic-airborne-gate-h-lined-masonry-clt";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTION_STATUS
} from "./post-v1-floor-screening-rw-companion-gate-z";
import {
  POST_V1_GATE_AA_WALL_LINED_MASSIVE_RW_OUTPUTS,
  POST_V1_GATE_AA_WALL_SCREENING_CONCRETE_VALUE_PINS,
  POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_LANDED_GATE,
  POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTED_NEXT_ACTION,
  POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTED_NEXT_FILE,
  POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTED_NEXT_LABEL,
  POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTION_STATUS
} from "./post-v1-wall-lined-massive-rw-companion-gate-aa";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_PLUS_IMPACT_OUTPUTS = [
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
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const IMPACT_BOUNDARY_OUTPUTS = [
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
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

describe("post-V1 wall lined-massive Rw companion Gate AA", () => {
  it("keeps lined-massive wall Rw live when unrelated impact outputs stop", () => {
    const testCase = generatedCase("wall-screening-concrete");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: WALL_PLUS_IMPACT_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.6,
      estimatedCtrDb: -6.3,
      estimatedDnADb: 53.4,
      estimatedDnTADb: 54.9,
      estimatedDnTwDb: 56,
      estimatedDnWDb: 55,
      estimatedRwDb: 55,
      estimatedRwPrimeDb: 55,
      estimatedStc: 55
    });
    expect(result.supportedTargetOutputs).toEqual([
      "Rw",
      "STC",
      "C",
      "Ctr",
      "R'w",
      "Dn,w",
      "Dn,A",
      "DnT,w",
      "DnT,A"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual([...IMPACT_BOUNDARY_OUTPUTS]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: expect.arrayContaining(["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"])
    });
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw");
    expect(result.warnings.join("\n")).toContain(
      "DynEcho kept those outputs explicit instead of fabricating unsupported ratings"
    );
    for (const pin of POST_V1_GATE_AA_WALL_SCREENING_CONCRETE_VALUE_PINS) {
      expect(result.supportedTargetOutputs).toContain(pin.metric);
    }
  });

  it("does not reopen flat grouped-topology wall cases that still need physical inputs", () => {
    const testCase = generatedCase("wall-held-aac");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w"]);
    expect(result.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(result.airborneBasis?.missingPhysicalInputs).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology"
    ]);
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTION_STATUS).toBe(
      "post_v1_floor_screening_rw_companion_gate_z_landed_selected_next_numeric_coverage_gap_gate_aa"
    );
    expect(POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_aa_plan"
    );
    expect(POST_V1_FLOOR_SCREENING_RW_COMPANION_GATE_Z_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aa-contract.test.ts"
    );
    expect(POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_LANDED_GATE).toBe(
      "post_v1_wall_lined_massive_rw_companion_gate_aa_plan"
    );
    expect(POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTION_STATUS).toBe(
      "post_v1_wall_lined_massive_rw_companion_gate_aa_landed_selected_next_numeric_coverage_gap_gate_ab"
    );
    expect(POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ab_plan"
    );
    expect(POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ab-contract.test.ts"
    );
    expect(POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AB"
    );
    expect(POST_V1_GATE_AA_WALL_LINED_MASSIVE_RW_OUTPUTS).toEqual(["Rw"]);
    expect([
      GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD
    ]).toEqual([
      "gate_i_airborne_field_apparent_context_adapter_runtime",
      "gate_h_lined_massive_wall_cavity_aware_family_physics_runtime"
    ]);

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-lined-massive-rw-companion-gate-aa-contract.test.ts"
    );
  });
});

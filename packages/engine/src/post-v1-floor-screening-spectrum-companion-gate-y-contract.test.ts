import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_OWNER_AUDIT_WARNING_PREFIX } from "./acoustic-answer-engine-v1-owner-audit";
import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTION_STATUS
} from "./post-v1-floor-airborne-spectrum-companion-gate-x";
import {
  POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_LANDED_GATE,
  POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTION_STATUS,
  POST_V1_GATE_Y_FLOOR_SCREENING_SPECTRUM_OUTPUTS,
  POST_V1_GATE_Y_GETZNER_AFM_35_SPECTRUM_VALUE_PINS,
  POST_V1_GATE_Y_REGUPOL_CURVE_8_SPECTRUM_VALUE_PINS,
  POST_V1_GATE_Y_REGUPOL_MULTI_45_SPECTRUM_VALUE_PINS
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

describe("post-V1 floor screening spectrum companion Gate Y", () => {
  it("keeps calculated STC and C live on complete Regupol Curve 8 screening floor requests", () => {
    const testCase = generatedCase("floor-regupol-curve-8-exact");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: FLOOR_MIXED_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.4,
      estimatedCtrDb: -6.1,
      estimatedStc: 58
    });
    expect(result.supportedTargetOutputs).toEqual([...FLOOR_MIXED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.floorSystemRatings).toMatchObject({
      basis: "screening_mass_law_curve_seed_v3",
      Rw: 58
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: ["R'w", "DnT,w", "L'n,w", "L'nT,w"]
    });
    expect(result.warnings.join("\n")).not.toContain(
      ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_OWNER_AUDIT_WARNING_PREFIX
    );
    for (const pin of POST_V1_GATE_Y_REGUPOL_CURVE_8_SPECTRUM_VALUE_PINS) {
      expect(result.supportedTargetOutputs).toContain(pin.metric);
    }
  });

  it("keeps calculated STC and C live on complete Getzner and Regupol screening delta requests", () => {
    const fixtures = [
      {
        caseId: "floor-getzner-afm-35-delta",
        pins: POST_V1_GATE_Y_GETZNER_AFM_35_SPECTRUM_VALUE_PINS,
        rw: 58
      },
      {
        caseId: "floor-regupol-multi-45-porcelain-exact",
        pins: POST_V1_GATE_Y_REGUPOL_MULTI_45_SPECTRUM_VALUE_PINS,
        rw: 55
      }
    ] as const;

    for (const fixture of fixtures) {
      const testCase = generatedCase(fixture.caseId);
      const result = calculateAssembly(testCase.rows, {
        ...testCase.fieldOptions,
        targetOutputs: FLOOR_MIXED_OUTPUTS
      });

      expect(result.supportedTargetOutputs, fixture.caseId).toEqual([...FLOOR_MIXED_OUTPUTS]);
      expect(result.unsupportedTargetOutputs, fixture.caseId).toEqual([]);
      expect(result.floorSystemRatings).toMatchObject({
        basis: "screening_mass_law_curve_seed_v3",
        Rw: fixture.rw
      });
      expect(result.warnings.join("\n"), fixture.caseId).not.toContain(
        ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_OWNER_AUDIT_WARNING_PREFIX
      );
      for (const pin of fixture.pins) {
        expect(result.supportedTargetOutputs, fixture.caseId).toContain(pin.metric);
      }
    }
  });

  it("does not turn exact measured floor rows into screening STC or C aliases", () => {
    const openBox = generatedCase("floor-open-box-exact");
    const clt = generatedCase("floor-clt-dry");
    const openBoxResult = calculateAssembly(openBox.rows, {
      ...openBox.fieldOptions,
      targetOutputs: FLOOR_MIXED_OUTPUTS
    });
    const cltResult = calculateAssembly(clt.rows, {
      ...clt.fieldOptions,
      targetOutputs: FLOOR_MIXED_OUTPUTS
    });

    expect(openBoxResult.floorSystemRatings?.basis).toBe("open_measured_floor_system_exact_match");
    expect(openBoxResult.supportedTargetOutputs).toEqual([
      "Rw",
      "C",
      "R'w",
      "DnT,w",
      "Ln,w",
      "L'n,w",
      "L'nT,w"
    ]);
    expect(openBoxResult.unsupportedTargetOutputs).toEqual(["STC", "Ctr", "DeltaLw"]);

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
  });

  it("keeps C11c screening airborne live while later guarded ISO impact owns impact outputs", () => {
    const testCase = generatedCase("floor-tuas-c11c-fail-closed");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: FLOOR_MIXED_OUTPUTS
    });

    expect(result.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");
    expect(result.impact).toMatchObject({
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      LnW: 59,
      LPrimeNW: 62,
      LPrimeNTw: 59.2
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTION_STATUS).toBe(
      "post_v1_floor_airborne_spectrum_companion_gate_x_landed_selected_next_numeric_coverage_gap_gate_y"
    );
    expect(POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_y_plan"
    );
    expect(POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-y-contract.test.ts"
    );
    expect(POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_LANDED_GATE).toBe(
      "post_v1_floor_screening_spectrum_companion_gate_y_plan"
    );
    expect(POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTION_STATUS).toBe(
      "post_v1_floor_screening_spectrum_companion_gate_y_landed_selected_next_numeric_coverage_gap_gate_z"
    );
    expect(POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_z_plan"
    );
    expect(POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-z-contract.test.ts"
    );
    expect(POST_V1_FLOOR_SCREENING_SPECTRUM_COMPANION_GATE_Y_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate Z"
    );
    expect(POST_V1_GATE_Y_FLOOR_SCREENING_SPECTRUM_OUTPUTS).toEqual(["STC", "C"]);

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-screening-spectrum-companion-gate-y-contract.test.ts");
  });
});

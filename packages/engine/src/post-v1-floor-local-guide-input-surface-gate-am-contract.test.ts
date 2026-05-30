import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTION_STATUS
} from "./post-v1-floor-combined-bound-local-guide-gate-al";
import {
  POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_LANDED_GATE,
  POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTION_STATUS,
  POST_V1_GATE_AM_COMBINED_BOUND_LOCAL_GUIDE_SYSTEM_ID,
  POST_V1_GATE_AM_EXACT_LOCAL_GUIDE_SYSTEM_ID,
  POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN
} from "./post-v1-floor-local-guide-input-surface-gate-am";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const UBIQ_FL28_BASE_STACK = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const UBIQ_EXACT_TIMBER_STACK = [
  ...UBIQ_FL28_BASE_STACK.slice(0, 5),
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  ...UBIQ_FL28_BASE_STACK.slice(5)
] as const satisfies readonly LayerInput[];

const UBIQ_CARPET_BOUND_STACK = [
  ...UBIQ_FL28_BASE_STACK.slice(0, 5),
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 12 },
  ...UBIQ_FL28_BASE_STACK.slice(5)
] as const satisfies readonly LayerInput[];

const LOCAL_GUIDE_LOOKUP_CONTEXT = {
  guideHdDb: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.explicitHdDb,
  guideMassRatio: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.guideMassRatio
} as const satisfies ImpactFieldContext;

const LOCAL_GUIDE_EXPLICIT_CONTEXT = {
  fieldKDb: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.explicitKDb,
  guideHdDb: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.explicitHdDb
} as const satisfies ImpactFieldContext;

const TARGET_OUTPUTS = [
  "Ln,w+CI",
  "L'nT,50",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor local-guide input surface Gate AM", () => {
  it("calculates exact floor L'nT,50 when K is looked up from guide mass ratio and Hd is explicit", () => {
    const result = calculateAssembly(UBIQ_EXACT_TIMBER_STACK, {
      impactFieldContext: LOCAL_GUIDE_LOOKUP_CONTEXT,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(result.floorSystemMatch?.system.id).toBe(POST_V1_GATE_AM_EXACT_LOCAL_GUIDE_SYSTEM_ID);
    expect(result.impact).toMatchObject({
      basis: "mixed_exact_plus_estimated_local_guide",
      guideEstimateHdCorrectionDb: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.explicitHdDb,
      guideEstimateHdSource: "explicit_input",
      guideEstimateKCorrectionDb: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.explicitKDb,
      guideEstimateKSource: "lookup_from_mass_ratio",
      guideEstimateMassRatio: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.guideMassRatio,
      guideEstimateMassRatioBracket: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.guideMassRatioBracket,
      guideEstimateProfile: "tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd",
      LPrimeNT50: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.lPrimeNT50,
      LPrimeNW: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.lPrimeNW,
      LnW: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.lnW,
      LnWPlusCI: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.lnWPlusCI
    });
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe(
      "estimated_local_guide_tr_simple_method_lnwci_plus_k_plus_hd"
    );
    expect(result.supportedTargetOutputs).toEqual(["Ln,w+CI", "L'nT,50", "L'n,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,w"]);
  });

  it("keeps the same exact L'nT,50 value when K is supplied explicitly instead of looked up", () => {
    const result = calculateAssembly(UBIQ_EXACT_TIMBER_STACK, {
      impactFieldContext: LOCAL_GUIDE_EXPLICIT_CONTEXT,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(result.impact).toMatchObject({
      basis: "mixed_exact_plus_estimated_local_guide",
      guideEstimateHdSource: "explicit_input",
      guideEstimateKCorrectionDb: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.explicitKDb,
      guideEstimateKSource: "explicit_input",
      LPrimeNT50: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.lPrimeNT50,
      LPrimeNW: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.lPrimeNW
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w+CI", "L'nT,50", "L'n,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,w"]);
  });

  it("calculates combined-bound L'nT,50 upper bounds from mass-ratio K lookup plus explicit Hd", () => {
    const result = calculateAssembly(UBIQ_CARPET_BOUND_STACK, {
      impactFieldContext: LOCAL_GUIDE_LOOKUP_CONTEXT,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(result.boundFloorSystemMatch?.system.id).toBe(POST_V1_GATE_AM_COMBINED_BOUND_LOCAL_GUIDE_SYSTEM_ID);
    expect(result.impact).toBeNull();
    expect(result.lowerBoundImpact).toMatchObject({
      basis: "mixed_bound_plus_estimated_local_guide",
      guideEstimateHdCorrectionDb: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.explicitHdDb,
      guideEstimateHdSource: "explicit_input",
      guideEstimateKCorrectionDb: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.explicitKDb,
      guideEstimateKSource: "lookup_from_mass_ratio",
      guideEstimateMassRatio: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.guideMassRatio,
      guideEstimateMassRatioBracket: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.guideMassRatioBracket,
      guideEstimateProfile: "tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd",
      LPrimeNT50UpperBound: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.lPrimeNT50UpperBound,
      LnWPlusCIUpperBound: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.lnWPlusCIUpperBound
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w+CI", "L'nT,50"]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(result.acousticAnswerBoundary).toBeUndefined();
  });

  it("names the missing Hd owner alternative instead of demanding only room volume", () => {
    const result = calculateAssembly(UBIQ_CARPET_BOUND_STACK, {
      impactFieldContext: {
        guideMassRatio: POST_V1_GATE_AM_LOCAL_GUIDE_INPUT_PIN.guideMassRatio
      },
      targetOutputs: ["L'nT,50"]
    });

    expect(result.lowerBoundImpact?.LPrimeNT50UpperBound).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["impactFieldContext.guideHdDb_or_receivingRoomVolumeM3"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["L'nT,50"]
    });
  });

  it("consumes Gate AL and hands off to the next numeric coverage gap", () => {
    expect(POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTION_STATUS).toBe(
      "post_v1_floor_combined_bound_local_guide_gate_al_landed_selected_next_numeric_coverage_gap_gate_am"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_am_plan"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-am-contract.test.ts"
    );
    expect(POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_LANDED_GATE).toBe(
      "post_v1_floor_local_guide_input_surface_gate_am_plan"
    );
    expect(POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTION_STATUS).toBe(
      "post_v1_floor_local_guide_input_surface_gate_am_landed_selected_next_numeric_coverage_gap_gate_an"
    );
    expect(POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_an_plan"
    );
    expect(POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-an-contract.test.ts"
    );
    expect(POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AN"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-local-guide-input-surface-gate-am-contract.test.ts"
    );
  });
});

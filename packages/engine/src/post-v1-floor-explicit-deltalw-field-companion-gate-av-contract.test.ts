import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTION_STATUS
} from "./post-v1-floor-explicit-deltalw-lab-companion-gate-au";
import {
  POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_LANDED_GATE,
  POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTION_STATUS,
  POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_BLOCKED_OUTPUTS,
  POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_INPUT_PIN,
  POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_SUPPORTED_OUTPUTS,
  POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_VALUE_PIN
} from "./post-v1-floor-explicit-deltalw-field-companion-gate-av";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const EXPLICIT_DELTALW_PREDICTOR_INPUT = {
  baseSlab: {
    densityKgM3: 2400,
    materialClass: "heavy_concrete",
    thicknessMm: 140
  },
  floorCovering: {
    deltaLwDb: POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_INPUT_PIN.deltaLwDb,
    mode: "delta_lw_catalog"
  },
  floatingScreed: {
    densityKgM3: 2000,
    materialClass: "generic_screed",
    thicknessMm: 50
  },
  impactSystemType: "heavy_floating_floor",
  referenceFloorType: "heavy_standard",
  resilientLayer: {
    dynamicStiffnessMNm3: 20,
    thicknessMm: 10
  },
  structuralSupportType: "reinforced_concrete"
} as const satisfies ImpactPredictorInput;

const EXPLICIT_DELTALW_FIELD_CONTEXT = {
  ci50_2500Db: POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_INPUT_PIN.ci50_2500Db,
  ciDb: POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_INPUT_PIN.ciDb,
  fieldKDb: POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_INPUT_PIN.fieldKDb,
  receivingRoomVolumeM3: POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_INPUT_PIN.receivingRoomVolumeM3
} as const satisfies ImpactFieldContext;

const EXPLICIT_DELTALW_OUTPUTS = [
  ...POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_SUPPORTED_OUTPUTS,
  ...POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_BLOCKED_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

function calculateExplicitDeltaLw(input?: {
  impactFieldContext?: ImpactFieldContext;
  targetOutputs?: readonly RequestedOutputId[];
}) {
  return calculateAssembly(
    [
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 140 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 10 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }
    ],
    {
      impactFieldContext: input?.impactFieldContext ?? EXPLICIT_DELTALW_FIELD_CONTEXT,
      impactPredictorInput: EXPLICIT_DELTALW_PREDICTOR_INPUT,
      targetOutputs: input?.targetOutputs ?? EXPLICIT_DELTALW_OUTPUTS
    }
  );
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor explicit DeltaLw field companion Gate AV", () => {
  it("calculates L'n,w, L'nT,w, and L'nT,50 from explicit field inputs on the heavy-reference DeltaLw lane", () => {
    const result = calculateExplicitDeltaLw();
    const pin = POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_VALUE_PIN;

    expect(result.impact).toMatchObject({
      CI: pin.ci,
      CI50_2500: pin.ci50_2500,
      DeltaLw: pin.deltaLw,
      LPrimeNT50: pin.lPrimeNT50,
      LPrimeNTw: pin.lPrimeNTw,
      LPrimeNW: pin.lPrimeNW,
      LnW: pin.lnW,
      LnWPlusCI: pin.lnWPlusCI,
      basis: pin.basis
    });
    expect(result.impact?.metricBasis).toMatchObject({
      CI: "explicit_user_impact_ci_input",
      CI50_2500: "explicit_user_impact_ci50_2500_input",
      DeltaLw: "predictor_explicit_delta_user_input",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
      LnW: "predictor_explicit_delta_heavy_reference_derived",
      LnWPlusCI: "estimated_local_guide_lnwci_from_lnw_plus_ci"
    });
    expect(result.impact?.fieldEstimateKCorrectionDb).toBe(
      POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_INPUT_PIN.fieldKDb
    );
    expect(result.supportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_SUPPORTED_OUTPUTS
    ]);
    expect(result.unsupportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_BLOCKED_OUTPUTS
    ]);
    expect(result.impact?.notes).toEqual(
      expect.arrayContaining([
        "Reference-derived field-side supplement carried L'n,w = 54.0 dB from the heavy-reference quick-derive lane.",
        "Reference-derived field-side supplement carried L'nT,w = 52.0 dB using K and receiving-room volume normalization.",
        "Reference-derived field-side supplement carried L'nT,50 = 56.0 dB from the heavy-reference quick-derive lane."
      ])
    );
    expect(result.acousticAnswerBoundary).toBeUndefined();
  });

  it("opens only L'n,w when K is supplied without receiving-room volume or low-frequency field context", () => {
    const result = calculateExplicitDeltaLw({
      impactFieldContext: {
        fieldKDb: POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_INPUT_PIN.fieldKDb
      },
      targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(result.impact?.basis).toBe("mixed_predicted_plus_estimated_field_k_correction");
    expect(result.impact?.LnW).toBe(POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_VALUE_PIN.lnW);
    expect(result.impact?.LPrimeNW).toBe(POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_VALUE_PIN.lPrimeNW);
    expect(result.impact?.LPrimeNTw).toBeUndefined();
    expect(result.impact?.LPrimeNT50).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw", "L'n,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,w", "L'nT,50"]);
  });

  it("does not reinterpret lower-treatment reduction as another DeltaLw term on the explicit DeltaLw lane", () => {
    const result = calculateExplicitDeltaLw({
      impactFieldContext: {
        ...EXPLICIT_DELTALW_FIELD_CONTEXT,
        lowerTreatmentReductionDb: 6
      },
      targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(result.impact?.LnW).toBe(POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_VALUE_PIN.lnW);
    expect(result.impact?.LPrimeNW).toBe(POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_VALUE_PIN.lPrimeNW);
    expect(result.impact?.LPrimeNTw).toBe(POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_VALUE_PIN.lPrimeNTw);
    expect(result.impact?.LPrimeNT50).toBe(POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_VALUE_PIN.lPrimeNT50);
    expect(result.impact?.fieldEstimateLowerTreatmentReductionDb).toBeUndefined();
  });

  it("consumes Gate AU and hands off to the next numeric coverage gap", () => {
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTION_STATUS).toBe(
      "post_v1_floor_explicit_deltalw_lab_companion_gate_au_landed_selected_next_numeric_coverage_gap_gate_av"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_av_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-av-contract.test.ts"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_LANDED_GATE).toBe(
      "post_v1_floor_explicit_deltalw_field_companion_gate_av_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTION_STATUS).toBe(
      "post_v1_floor_explicit_deltalw_field_companion_gate_av_landed_selected_next_numeric_coverage_gap_gate_aw"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_aw_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aw-contract.test.ts"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AW"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-explicit-deltalw-field-companion-gate-av-contract.test.ts");
  });
});

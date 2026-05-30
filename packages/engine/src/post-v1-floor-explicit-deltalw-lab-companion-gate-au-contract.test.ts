import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_FLOOR_EXPLICIT_CI50_LAB_COMPANION_GATE_AT_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_EXPLICIT_CI50_LAB_COMPANION_GATE_AT_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_EXPLICIT_CI50_LAB_COMPANION_GATE_AT_SELECTION_STATUS
} from "./post-v1-floor-explicit-ci50-lab-companion-gate-at";
import {
  POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_LANDED_GATE,
  POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTION_STATUS,
  POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_BLOCKED_OUTPUTS,
  POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_INPUT_PIN,
  POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_SUPPORTED_OUTPUTS,
  POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_VALUE_PIN
} from "./post-v1-floor-explicit-deltalw-lab-companion-gate-au";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const EXPLICIT_DELTALW_PREDICTOR_INPUT = {
  baseSlab: {
    densityKgM3: 2400,
    materialClass: "heavy_concrete",
    thicknessMm: 140
  },
  floorCovering: {
    deltaLwDb: POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_INPUT_PIN.deltaLwDb,
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

const EXPLICIT_DELTALW_CONTEXT = {
  ci50_2500Db: POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_INPUT_PIN.ci50_2500Db,
  ciDb: POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_INPUT_PIN.ciDb
} as const satisfies ImpactFieldContext;

const EXPLICIT_DELTALW_OUTPUTS = [
  ...POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_SUPPORTED_OUTPUTS,
  ...POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_BLOCKED_OUTPUTS
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
      impactFieldContext: input?.impactFieldContext ?? EXPLICIT_DELTALW_CONTEXT,
      impactPredictorInput: EXPLICIT_DELTALW_PREDICTOR_INPUT,
      targetOutputs: input?.targetOutputs ?? EXPLICIT_DELTALW_OUTPUTS
    }
  );
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor explicit DeltaLw lab companion Gate AU", () => {
  it("calculates CI, Ln,w+CI, and CI,50-2500 from explicit lab companion inputs on the explicit DeltaLw lane", () => {
    const result = calculateExplicitDeltaLw();
    const pin = POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_VALUE_PIN;

    expect(result.impact).toMatchObject({
      CI: pin.ci,
      CI50_2500: pin.ci50_2500,
      DeltaLw: pin.deltaLw,
      LnW: pin.lnW,
      LnWPlusCI: pin.lnWPlusCI,
      basis: pin.basis
    });
    expect(result.impact?.metricBasis).toMatchObject({
      CI: "explicit_user_impact_ci_input",
      CI50_2500: "explicit_user_impact_ci50_2500_input",
      DeltaLw: "predictor_explicit_delta_user_input",
      LnW: "predictor_explicit_delta_heavy_reference_derived",
      LnWPlusCI: "estimated_local_guide_lnwci_from_lnw_plus_ci"
    });
    expect(result.impact?.LPrimeNW).toBeUndefined();
    expect(result.impact?.LPrimeNTw).toBeUndefined();
    expect(result.impact?.LPrimeNT50).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_SUPPORTED_OUTPUTS
    ]);
    expect(result.unsupportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_BLOCKED_OUTPUTS
    ]);
    expect(result.acousticAnswerBoundary).toBeUndefined();
  });

  it("keeps explicit DeltaLw lab companions stable when later field-guide inputs are present", () => {
    const result = calculateExplicitDeltaLw({
      impactFieldContext: {
        ...EXPLICIT_DELTALW_CONTEXT,
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["Ln,w", "DeltaLw", "CI", "Ln,w+CI", "CI,50-2500", "L'n,w", "L'nT,w"]
    });

    expect(result.impact?.metricBasis?.LnW).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_explicit_delta_user_input");
    expect(result.impact?.DeltaLw).toBe(POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_VALUE_PIN.deltaLw);
    expect(result.impact?.LnW).toBe(POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_VALUE_PIN.lnW);
    expect(result.impact?.CI).toBe(POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_VALUE_PIN.ci);
    expect(result.impact?.CI50_2500).toBe(POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_VALUE_PIN.ci50_2500);
    expect(result.impact?.LnWPlusCI).toBe(POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_VALUE_PIN.lnWPlusCI);
    expect(result.supportedImpactOutputs).toEqual(
      expect.arrayContaining(["Ln,w", "DeltaLw", "CI", "Ln,w+CI", "CI,50-2500"])
    );
  });

  it("keeps lab companions closed when only DeltaLw is supplied", () => {
    const result = calculateExplicitDeltaLw({
      impactFieldContext: {},
      targetOutputs: ["CI", "Ln,w+CI", "CI,50-2500", "L'n,w", "L'nT,w", "IIC", "AIIC"]
    });

    expect(result.impact?.DeltaLw).toBe(POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_VALUE_PIN.deltaLw);
    expect(result.impact?.CI).toBeUndefined();
    expect(result.impact?.LnWPlusCI).toBeUndefined();
    expect(result.impact?.CI50_2500).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([
      "CI",
      "Ln,w+CI",
      "CI,50-2500",
      "L'n,w",
      "L'nT,w",
      "IIC",
      "AIIC"
    ]);
  });

  it("consumes Gate AT and hands off to the next numeric coverage gap", () => {
    expect(POST_V1_FLOOR_EXPLICIT_CI50_LAB_COMPANION_GATE_AT_SELECTION_STATUS).toBe(
      "post_v1_floor_explicit_ci50_lab_companion_gate_at_landed_selected_next_numeric_coverage_gap_gate_au"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI50_LAB_COMPANION_GATE_AT_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_au_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI50_LAB_COMPANION_GATE_AT_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-au-contract.test.ts"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_LANDED_GATE).toBe(
      "post_v1_floor_explicit_deltalw_lab_companion_gate_au_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTION_STATUS).toBe(
      "post_v1_floor_explicit_deltalw_lab_companion_gate_au_landed_selected_next_numeric_coverage_gap_gate_av"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_av_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-av-contract.test.ts"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AV"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-explicit-deltalw-lab-companion-gate-au-contract.test.ts");
  });
});

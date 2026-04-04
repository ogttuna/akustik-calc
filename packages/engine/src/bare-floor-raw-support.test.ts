import { describe, expect, it } from "vitest";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

const LAB_REQUEST: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FIELD_REQUEST: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "DnT,w",
  "DnT,A",
  "Dn,w",
  "Dn,A",
  "Ln,w",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  partitionHeightM: 4,
  partitionWidthM: 4.5,
  receivingRoomVolumeM3: 55,
  separatingAreaM2: 18
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

function calculateBareFloorLab(layers: readonly LayerInput[]) {
  return calculateAssembly(layers, {
    targetOutputs: LAB_REQUEST
  });
}

function calculateBareFloorField(layers: readonly LayerInput[]) {
  return calculateAssembly(layers, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FIELD_REQUEST
  });
}

function expectWithin(
  actual: number | null | undefined,
  expected: number,
  tolerance: number,
  label: string,
  failures: string[]
) {
  if (!(typeof actual === "number" && Number.isFinite(actual))) {
    failures.push(`${label}: expected finite number near ${expected}, got ${actual ?? "null"}`);
    return;
  }

  if (Math.abs(actual - expected) > tolerance) {
    failures.push(`${label}: expected ${expected} +/- ${tolerance}, got ${actual}`);
  }
}

function resultSnapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    basis: result.impact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    supportedImpactOutputs: result.supportedImpactOutputs,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedImpactOutputs: result.unsupportedImpactOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

describe("bare raw floor support", () => {
  it("opens safe single-layer raw bare floors onto stable lab and field impact lanes", () => {
    const failures: string[] = [];
    const cases: Array<{
      expected: {
        fieldLPrimeNT50: number | null;
        fieldLPrimeNTw: number;
        fieldLPrimeNW: number;
        fieldRwPrime: number;
        fieldSupportedTargetOutputs: RequestedOutputId[];
        fieldUnsupportedTargetOutputs: RequestedOutputId[];
        labBasis: string;
        labLnW: number;
        labLnWPlusCI: number | null;
        labRw: number;
      };
      label: string;
      layers: LayerInput[];
    }> = [
      {
        label: "bare CLT",
        layers: [{ materialId: "clt_panel", thicknessMm: 140 }],
        expected: {
          fieldLPrimeNT50: 72.6,
          fieldLPrimeNTw: 72.6,
          fieldLPrimeNW: 75,
          fieldRwPrime: 33,
          fieldSupportedTargetOutputs: ["Rw", "R'w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
          fieldUnsupportedTargetOutputs: ["DnT,w", "DnT,A", "Dn,w", "Dn,A"],
          labBasis: "predictor_mass_timber_clt_bare_interpolation_estimate",
          labLnW: 73,
          labLnWPlusCI: 73,
          labRw: 35
        }
      },
      {
        label: "bare hollow-core plank",
        layers: [{ materialId: "hollow_core_plank", thicknessMm: 200 }],
        expected: {
          fieldLPrimeNT50: null,
          fieldLPrimeNTw: 57.5,
          fieldLPrimeNW: 59.9,
          fieldRwPrime: 57,
          fieldSupportedTargetOutputs: ["Rw", "R'w", "Ln,w", "L'n,w", "L'nT,w"],
          fieldUnsupportedTargetOutputs: ["DnT,w", "DnT,A", "Dn,w", "Dn,A", "Ln,w+CI", "L'nT,50"],
          labBasis: "predictor_floor_system_family_general_estimate",
          labLnW: 57.9,
          labLnWPlusCI: null,
          labRw: 55.5
        }
      },
      {
        label: "bare composite deck",
        layers: [{ materialId: "composite_steel_deck", thicknessMm: 60 }],
        expected: {
          fieldLPrimeNT50: null,
          fieldLPrimeNTw: 83.6,
          fieldLPrimeNW: 86,
          fieldRwPrime: 47,
          fieldSupportedTargetOutputs: ["Rw", "R'w", "Ln,w", "L'n,w", "L'nT,w"],
          fieldUnsupportedTargetOutputs: ["DnT,w", "DnT,A", "Dn,w", "Dn,A", "Ln,w+CI", "L'nT,50"],
          labBasis: "predictor_floor_system_family_archetype_estimate",
          labLnW: 84,
          labLnWPlusCI: null,
          labRw: 27
        }
      }
    ];

    for (const testCase of cases) {
      const lab = calculateBareFloorLab(testCase.layers);
      const field = calculateBareFloorField(testCase.layers);

      if (!lab.ok || !field.ok) {
        failures.push(`${testCase.label}: expected both lab and field calculations to stay ok`);
        continue;
      }

      if (lab.impact?.basis !== testCase.expected.labBasis) {
        failures.push(
          `${testCase.label}: expected lab basis ${testCase.expected.labBasis}, got ${lab.impact?.basis ?? "null"}`
        );
      }

      expectWithin(lab.impact?.LnW, testCase.expected.labLnW, 0.15, `${testCase.label} lab Ln,w`, failures);
      expectWithin(lab.floorSystemRatings?.Rw, testCase.expected.labRw, 0.15, `${testCase.label} lab Rw`, failures);

      if (testCase.expected.labLnWPlusCI === null) {
        if (lab.impact?.LnWPlusCI != null) {
          failures.push(`${testCase.label}: expected no lab Ln,w+CI companion, got ${lab.impact.LnWPlusCI}`);
        }
      } else {
        expectWithin(
          lab.impact?.LnWPlusCI,
          testCase.expected.labLnWPlusCI,
          0.15,
          `${testCase.label} lab Ln,w+CI`,
          failures
        );
      }

      if (field.impact?.basis !== "mixed_predicted_plus_estimated_standardized_field_volume_normalization") {
        failures.push(
          `${testCase.label}: expected field basis mixed_predicted_plus_estimated_standardized_field_volume_normalization, got ${field.impact?.basis ?? "null"}`
        );
      }

      expectWithin(
        field.impact?.LPrimeNW,
        testCase.expected.fieldLPrimeNW,
        0.15,
        `${testCase.label} field L'n,w`,
        failures
      );
      expectWithin(
        field.impact?.LPrimeNTw,
        testCase.expected.fieldLPrimeNTw,
        0.15,
        `${testCase.label} field L'nT,w`,
        failures
      );
      expectWithin(
        field.metrics.estimatedRwPrimeDb,
        testCase.expected.fieldRwPrime,
        0.15,
        `${testCase.label} field R'w`,
        failures
      );

      if (testCase.expected.fieldLPrimeNT50 === null) {
        if (field.impact?.LPrimeNT50 != null) {
          failures.push(`${testCase.label}: expected no field L'nT,50 companion, got ${field.impact.LPrimeNT50}`);
        }
      } else {
        expectWithin(
          field.impact?.LPrimeNT50,
          testCase.expected.fieldLPrimeNT50,
          0.15,
          `${testCase.label} field L'nT,50`,
          failures
        );
      }

      expect(field.supportedTargetOutputs).toEqual(testCase.expected.fieldSupportedTargetOutputs);
      expect(field.unsupportedTargetOutputs).toEqual(testCase.expected.fieldUnsupportedTargetOutputs);
    }

    expect(failures).toEqual([]);
  });

  it("keeps the steel_deck_composite alias identical to composite_steel_deck on the bare raw lane", () => {
    const canonicalLayers = [{ materialId: "composite_steel_deck", thicknessMm: 60 }] satisfies LayerInput[];
    const aliasLayers = [{ materialId: "steel_deck_composite", thicknessMm: 60 }] satisfies LayerInput[];

    expect(resultSnapshot(calculateBareFloorLab(aliasLayers))).toEqual(resultSnapshot(calculateBareFloorLab(canonicalLayers)));
    expect(resultSnapshot(calculateBareFloorField(aliasLayers))).toEqual(
      resultSnapshot(calculateBareFloorField(canonicalLayers))
    );
  });

  it("keeps unsafe bare open-box timber and open-web steel stacks fail-closed on impact", () => {
    const failures: string[] = [];
    const cases = [
      {
        expectedLabRw: 42,
        expectedFieldRwPrime: 40,
        label: "bare open-box timber",
        layers: [{ materialId: "open_box_timber_slab", thicknessMm: 370 }] satisfies LayerInput[]
      },
      {
        expectedLabRw: 72,
        expectedFieldRwPrime: 70,
        label: "bare open-web steel",
        layers: [{ materialId: "open_web_steel_joist", thicknessMm: 300 }] satisfies LayerInput[]
      }
    ];

    for (const testCase of cases) {
      const lab = calculateBareFloorLab(testCase.layers);
      const field = calculateBareFloorField(testCase.layers);

      if (lab.impact || field.impact) {
        failures.push(`${testCase.label}: expected impact lane to stay fail-closed`);
      }

      expectWithin(lab.floorSystemRatings?.Rw, testCase.expectedLabRw, 0.15, `${testCase.label} lab Rw`, failures);
      expectWithin(
        field.metrics.estimatedRwPrimeDb,
        testCase.expectedFieldRwPrime,
        0.15,
        `${testCase.label} field R'w`,
        failures
      );

      expect(lab.supportedTargetOutputs).toEqual(["Rw"]);
      expect(lab.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);
      expect(field.supportedTargetOutputs).toEqual(["R'w"]);
      expect(field.unsupportedTargetOutputs).toEqual([
        "Rw",
        "DnT,w",
        "DnT,A",
        "Dn,w",
        "Dn,A",
        "Ln,w",
        "Ln,w+CI",
        "L'n,w",
        "L'nT,w",
        "L'nT,50"
      ]);
    }

    expect(failures).toEqual([]);
  });
});

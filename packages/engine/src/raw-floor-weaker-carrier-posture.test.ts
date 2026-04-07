import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type CarrierCase = {
  expectedField: {
    basis: string | null;
    estimateKind: string | null;
    supported: readonly RequestedOutputId[];
  };
  expectedLab: {
    basis: string | null;
    estimateKind: string | null;
    supported: readonly RequestedOutputId[];
  };
  id: string;
  variants: readonly {
    id: string;
    layers: readonly LayerInput[];
  }[];
};

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const CASES: readonly CarrierCase[] = [
  {
    id: "open-box timber bare carrier stays fail-closed even when tagged",
    expectedLab: {
      basis: null,
      estimateKind: null,
      supported: ["Rw"]
    },
    expectedField: {
      basis: null,
      estimateKind: null,
      supported: ["R'w", "DnT,w"]
    },
    variants: [
      {
        id: "raw-single",
        layers: [{ materialId: "open_box_timber_slab", thicknessMm: 370 }]
      },
      {
        id: "raw-split",
        layers: [
          { materialId: "open_box_timber_slab", thicknessMm: 185 },
          { materialId: "open_box_timber_slab", thicknessMm: 185 }
        ]
      },
      {
        id: "tagged-single",
        layers: [{ floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }]
      },
      {
        id: "tagged-split",
        layers: [
          { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 },
          { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 }
        ]
      }
    ]
  },
  {
    id: "open-web steel bare carrier stays fail-closed even when tagged",
    expectedLab: {
      basis: null,
      estimateKind: null,
      supported: ["Rw"]
    },
    expectedField: {
      basis: null,
      estimateKind: null,
      supported: ["R'w", "DnT,w"]
    },
    variants: [
      {
        id: "raw-single",
        layers: [{ materialId: "open_web_steel_floor", thicknessMm: 300 }]
      },
      {
        id: "raw-split",
        layers: [
          { materialId: "open_web_steel_floor", thicknessMm: 150 },
          { materialId: "open_web_steel_floor", thicknessMm: 150 }
        ]
      },
      {
        id: "tagged-single",
        layers: [{ floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }]
      },
      {
        id: "tagged-split",
        layers: [
          { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 150 },
          { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 150 }
        ]
      }
    ]
  },
  {
    id: "lightweight steel bare carrier stays fail-closed even when tagged",
    expectedLab: {
      basis: null,
      estimateKind: null,
      supported: ["Rw"]
    },
    expectedField: {
      basis: null,
      estimateKind: null,
      supported: ["R'w", "DnT,w"]
    },
    variants: [
      {
        id: "raw-single",
        layers: [{ materialId: "lightweight_steel_floor", thicknessMm: 250 }]
      },
      {
        id: "raw-split",
        layers: [
          { materialId: "lightweight_steel_floor", thicknessMm: 125 },
          { materialId: "lightweight_steel_floor", thicknessMm: 125 }
        ]
      },
      {
        id: "tagged-single",
        layers: [{ floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 250 }]
      },
      {
        id: "tagged-split",
        layers: [
          { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 125 },
          { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 125 }
        ]
      }
    ]
  },
  {
    id: "steel joist bare carrier stays fail-closed even when tagged",
    expectedLab: {
      basis: null,
      estimateKind: null,
      supported: ["Rw"]
    },
    expectedField: {
      basis: null,
      estimateKind: null,
      supported: ["R'w", "DnT,w"]
    },
    variants: [
      {
        id: "raw-single",
        layers: [{ materialId: "steel_joist_floor", thicknessMm: 250 }]
      },
      {
        id: "raw-split",
        layers: [
          { materialId: "steel_joist_floor", thicknessMm: 125 },
          { materialId: "steel_joist_floor", thicknessMm: 125 }
        ]
      },
      {
        id: "tagged-single",
        layers: [{ floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }]
      },
      {
        id: "tagged-split",
        layers: [
          { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 125 },
          { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 125 }
        ]
      }
    ]
  },
  {
    id: "timber-frame style carriers require explicit base-structure evidence",
    expectedLab: {
      basis: null,
      estimateKind: null,
      supported: ["Rw"]
    },
    expectedField: {
      basis: null,
      estimateKind: null,
      supported: ["R'w", "DnT,w"]
    },
    variants: [
      {
        id: "timber-frame-raw-single",
        layers: [{ materialId: "timber_frame_floor", thicknessMm: 200 }]
      },
      {
        id: "timber-frame-raw-split",
        layers: [
          { materialId: "timber_frame_floor", thicknessMm: 100 },
          { materialId: "timber_frame_floor", thicknessMm: 100 }
        ]
      },
      {
        id: "timber-joist-raw-single",
        layers: [{ materialId: "timber_joist_floor", thicknessMm: 240 }]
      },
      {
        id: "timber-joist-raw-split",
        layers: [
          { materialId: "timber_joist_floor", thicknessMm: 120 },
          { materialId: "timber_joist_floor", thicknessMm: 120 }
        ]
      },
      {
        id: "engineered-raw-single",
        layers: [{ materialId: "engineered_timber_structural", thicknessMm: 240 }]
      },
      {
        id: "engineered-raw-split",
        layers: [
          { materialId: "engineered_timber_structural", thicknessMm: 120 },
          { materialId: "engineered_timber_structural", thicknessMm: 120 }
        ]
      }
    ]
  }
];

const TIMBER_TAGGED_VARIANTS: readonly CarrierCase["variants"] = [
  {
    id: "timber-frame-tagged-single",
    layers: [{ floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 200 }]
  },
  {
    id: "timber-frame-tagged-split",
    layers: [
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 100 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 100 }
    ]
  },
  {
    id: "timber-joist-tagged-single",
    layers: [{ floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }]
  },
  {
    id: "timber-joist-tagged-split",
    layers: [
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 120 },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 120 }
    ]
  },
  {
    id: "engineered-tagged-single",
    layers: [{ floorRole: "base_structure", materialId: "engineered_timber_structural", thicknessMm: 240 }]
  },
  {
    id: "engineered-tagged-split",
    layers: [
      { floorRole: "base_structure", materialId: "engineered_timber_structural", thicknessMm: 120 },
      { floorRole: "base_structure", materialId: "engineered_timber_structural", thicknessMm: 120 }
    ]
  }
];

function snapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    basis: result.impact?.basis ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    lnW: result.impact?.LnW ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

function calculateLab(layers: readonly LayerInput[]) {
  return calculateAssembly(layers, { targetOutputs: LAB_OUTPUTS });
}

function calculateField(layers: readonly LayerInput[]) {
  return calculateAssembly(layers, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });
}

describe("raw floor weaker carrier posture", () => {
  it("keeps weaker structural carriers fail-closed across raw and tagged variants on the lab bundle", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      for (const variant of testCase.variants) {
        const result = calculateLab(variant.layers);
        const resultSnapshot = snapshot(result);

        if (resultSnapshot.basis !== testCase.expectedLab.basis) {
          failures.push(`${testCase.id} ${variant.id} lab: expected basis ${testCase.expectedLab.basis ?? "null"}, got ${resultSnapshot.basis ?? "null"}`);
        }

        if (resultSnapshot.estimateKind !== testCase.expectedLab.estimateKind) {
          failures.push(
            `${testCase.id} ${variant.id} lab: expected estimate kind ${testCase.expectedLab.estimateKind ?? "null"}, got ${resultSnapshot.estimateKind ?? "null"}`
          );
        }

        if (JSON.stringify(resultSnapshot.supportedTargetOutputs) !== JSON.stringify(testCase.expectedLab.supported)) {
          failures.push(
            `${testCase.id} ${variant.id} lab: expected supported outputs ${JSON.stringify(testCase.expectedLab.supported)}, got ${JSON.stringify(resultSnapshot.supportedTargetOutputs)}`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps weaker structural carriers fail-closed across raw and tagged variants on the field bundle", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      for (const variant of testCase.variants) {
        const result = calculateField(variant.layers);
        const resultSnapshot = snapshot(result);

        if (resultSnapshot.basis !== testCase.expectedField.basis) {
          failures.push(`${testCase.id} ${variant.id} field: expected basis ${testCase.expectedField.basis ?? "null"}, got ${resultSnapshot.basis ?? "null"}`);
        }

        if (resultSnapshot.estimateKind !== testCase.expectedField.estimateKind) {
          failures.push(
            `${testCase.id} ${variant.id} field: expected estimate kind ${testCase.expectedField.estimateKind ?? "null"}, got ${resultSnapshot.estimateKind ?? "null"}`
          );
        }

        if (JSON.stringify(resultSnapshot.supportedTargetOutputs) !== JSON.stringify(testCase.expectedField.supported)) {
          failures.push(
            `${testCase.id} ${variant.id} field: expected supported outputs ${JSON.stringify(testCase.expectedField.supported)}, got ${JSON.stringify(resultSnapshot.supportedTargetOutputs)}`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps timber-style carriers explicitly gated by floor-role evidence on the field bundle", () => {
    const rawBaseline = snapshot(calculateField([{ materialId: "timber_frame_floor", thicknessMm: 200 }]));
    const failures: string[] = [];

    for (const variant of TIMBER_TAGGED_VARIANTS) {
      const resultSnapshot = snapshot(calculateField(variant.layers));

      if (resultSnapshot.basis !== "mixed_predicted_plus_estimated_standardized_field_volume_normalization") {
        failures.push(`${variant.id} field: expected tagged timber carrier to reopen the predictor/family lane`);
      }

      if (resultSnapshot.estimateKind !== "family_general") {
        failures.push(`${variant.id} field: expected tagged timber carrier estimate kind family_general`);
      }

      if (!resultSnapshot.supportedTargetOutputs.includes("Rw")) {
        failures.push(`${variant.id} field: expected tagged timber carrier to reopen companion Rw`);
      }

      if (!(typeof resultSnapshot.lnW === "number" && typeof resultSnapshot.lPrimeNTw === "number")) {
        failures.push(`${variant.id} field: expected tagged timber carrier to reopen impact outputs`);
      }
    }

    if (rawBaseline.supportedTargetOutputs.includes("Rw")) {
      failures.push("raw timber-frame baseline field: expected raw baseline to keep companion Rw closed");
    }

    if (rawBaseline.basis !== null || rawBaseline.estimateKind !== null) {
      failures.push("raw timber-frame baseline field: expected raw baseline to stay off the predictor/family lane");
    }

    expect(failures).toEqual([]);
  });
});

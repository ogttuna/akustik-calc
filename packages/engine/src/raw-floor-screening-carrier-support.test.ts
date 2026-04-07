import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type RawScreeningCase = {
  expectedField: {
    basis: string | null;
    estimateKind: string | null;
    floorSystemMatchId: string | null;
    supported: readonly RequestedOutputId[];
  };
  expectedLab: {
    basis: string | null;
    estimateKind: string | null;
    floorSystemMatchId: string | null;
    supported: readonly RequestedOutputId[];
  };
  id: string;
  layers: readonly LayerInput[];
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

const CASES: readonly RawScreeningCase[] = [
  {
    id: "raw concrete single layer",
    layers: [{ materialId: "concrete", thicknessMm: 150 }],
    expectedLab: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw", "Ln,w"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw concrete with top-side treatment",
    layers: [
      { materialId: "concrete", thicknessMm: 150 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { materialId: "screed", thicknessMm: 30 },
      { materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    expectedLab: {
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supported: ["Rw", "Ln,w"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw open-box single layer",
    layers: [{ materialId: "open_box_timber_slab", thicknessMm: 370 }],
    expectedLab: {
      basis: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw"]
    },
    expectedField: {
      basis: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w"]
    }
  },
  {
    id: "raw open-box with top-side treatment",
    layers: [
      { materialId: "ceramic_tile", thicknessMm: 8 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { materialId: "screed", thicknessMm: 30 },
      { materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expectedLab: {
      basis: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw"]
    },
    expectedField: {
      basis: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w"]
    }
  },
  {
    id: "raw hollow-core single layer",
    layers: [{ materialId: "hollow_core_plank", thicknessMm: 200 }],
    expectedLab: {
      basis: "predictor_floor_system_family_general_estimate",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supported: ["Rw", "Ln,w"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw hollow-core resilient treatment exact row",
    layers: [
      { materialId: "vinyl_flooring", thicknessMm: 5 },
      { materialId: "geniemat_rst05", thicknessMm: 5 },
      { materialId: "hollow_core_plank", thicknessMm: 200 }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      estimateKind: null,
      floorSystemMatchId: "pliteq_hcp200_rst05_vinyl_no_ceiling_lab_2026",
      supported: ["Rw", "Ln,w"]
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: "pliteq_hcp200_rst05_vinyl_no_ceiling_lab_2026",
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw wall-like heavy hybrid",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "concrete", thicknessMm: 120 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expectedLab: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw", "Ln,w"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  }
];

describe("raw floor screening-carrier support audit", () => {
  it("keeps representative raw floor cohorts explicit about which field routes may reopen Rw and which must stay closed", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const lab = calculateAssembly(testCase.layers, {
        targetOutputs: LAB_OUTPUTS
      });
      const field = calculateAssembly(testCase.layers, {
        airborneContext: AIRBORNE_FIELD_CONTEXT,
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      if ((lab.impact?.basis ?? null) !== testCase.expectedLab.basis) {
        failures.push(
          `${testCase.id} lab: expected basis ${testCase.expectedLab.basis ?? "null"}, got ${lab.impact?.basis ?? "null"}`
        );
      }

      if ((lab.floorSystemEstimate?.kind ?? null) !== testCase.expectedLab.estimateKind) {
        failures.push(
          `${testCase.id} lab: expected estimate kind ${testCase.expectedLab.estimateKind ?? "null"}, got ${lab.floorSystemEstimate?.kind ?? "null"}`
        );
      }

      if ((lab.floorSystemMatch?.system.id ?? null) !== testCase.expectedLab.floorSystemMatchId) {
        failures.push(
          `${testCase.id} lab: expected floor-system id ${testCase.expectedLab.floorSystemMatchId ?? "null"}, got ${lab.floorSystemMatch?.system.id ?? "null"}`
        );
      }

      if (JSON.stringify(lab.supportedTargetOutputs) !== JSON.stringify(testCase.expectedLab.supported)) {
        failures.push(
          `${testCase.id} lab: expected supported outputs ${JSON.stringify(testCase.expectedLab.supported)}, got ${JSON.stringify(lab.supportedTargetOutputs)}`
        );
      }

      if ((field.impact?.basis ?? null) !== testCase.expectedField.basis) {
        failures.push(
          `${testCase.id} field: expected basis ${testCase.expectedField.basis ?? "null"}, got ${field.impact?.basis ?? "null"}`
        );
      }

      if ((field.floorSystemEstimate?.kind ?? null) !== testCase.expectedField.estimateKind) {
        failures.push(
          `${testCase.id} field: expected estimate kind ${testCase.expectedField.estimateKind ?? "null"}, got ${field.floorSystemEstimate?.kind ?? "null"}`
        );
      }

      if ((field.floorSystemMatch?.system.id ?? null) !== testCase.expectedField.floorSystemMatchId) {
        failures.push(
          `${testCase.id} field: expected floor-system id ${testCase.expectedField.floorSystemMatchId ?? "null"}, got ${field.floorSystemMatch?.system.id ?? "null"}`
        );
      }

      if (JSON.stringify(field.supportedTargetOutputs) !== JSON.stringify(testCase.expectedField.supported)) {
        failures.push(
          `${testCase.id} field: expected supported outputs ${JSON.stringify(testCase.expectedField.supported)}, got ${JSON.stringify(field.supportedTargetOutputs)}`
        );
      }

      if (field.supportedTargetOutputs.includes("Rw") && !(typeof field.floorSystemRatings?.Rw === "number")) {
        failures.push(`${testCase.id} field: expected finite floor-system Rw when field support reopens Rw`);
      }

      if (!field.supportedTargetOutputs.includes("Rw") && field.floorSystemRatings?.Rw == null) {
        failures.push(`${testCase.id} field: expected finite screening floor-system Rw even when support stays closed`);
      }
    }

    expect(failures).toEqual([]);
  });
});

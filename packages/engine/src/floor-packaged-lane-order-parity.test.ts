import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type OrderParityCase = {
  canonical: readonly LayerInput[];
  id: string;
  reordered: readonly LayerInput[];
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

const CASES: readonly OrderParityCase[] = [
  {
    id: "composite lower-only non-packable board order",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 14 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ],
    reordered: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 14 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ]
  },
  {
    id: "open-web lower-only non-packable board order",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 14 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 9 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 9 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    reordered: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 9 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 14 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 9 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]
  },
  {
    id: "clt lower-only non-packable guard order",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 3 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    reordered: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 3 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]
  },
  {
    id: "open-box lower-only non-packable guard order",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 3 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    reordered: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 3 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]
  }
];

function resultSnapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    basis: result.impact?.basis ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    fitPercent: result.floorSystemEstimate?.fitPercent ?? null,
    kind: result.floorSystemEstimate?.kind ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    warnings: result.warnings
  };
}

function assertParity(
  label: string,
  canonical: ReturnType<typeof calculateAssembly>,
  reordered: ReturnType<typeof calculateAssembly>
) {
  expect(resultSnapshot(reordered), label).toEqual(resultSnapshot(canonical));
}

describe("floor packaged-lane order parity", () => {
  it("keeps contiguous mixed lower-board order stable in the lab bundle", () => {
    for (const testCase of CASES) {
      assertParity(
        `${testCase.id} lab`,
        calculateAssembly(testCase.canonical, { targetOutputs: LAB_OUTPUTS }),
        calculateAssembly(testCase.reordered, { targetOutputs: LAB_OUTPUTS })
      );
    }
  });

  it("keeps contiguous mixed lower-board order stable in the field bundle", () => {
    for (const testCase of CASES) {
      assertParity(
        `${testCase.id} field`,
        calculateAssembly(testCase.canonical, {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }),
        calculateAssembly(testCase.reordered, {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        })
      );
    }
  });
});

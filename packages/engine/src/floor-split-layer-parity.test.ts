import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type SplitParityCase = {
  canonical: readonly LayerInput[];
  id: string;
  split: readonly LayerInput[];
};

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = [
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

const CASES: readonly SplitParityCase[] = [
  {
    id: "heavy concrete split screed",
    canonical: [
      { materialId: "concrete", thicknessMm: 150 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { materialId: "screed", thicknessMm: 30 },
      { materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    split: [
      { materialId: "concrete", thicknessMm: 150 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { materialId: "screed", thicknessMm: 15 },
      { materialId: "screed", thicknessMm: 15 },
      { materialId: "ceramic_tile", thicknessMm: 8 }
    ]
  },
  {
    id: "heavy concrete split resilient underlay",
    canonical: [
      { materialId: "concrete", thicknessMm: 150 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { materialId: "screed", thicknessMm: 30 },
      { materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    split: [
      { materialId: "concrete", thicknessMm: 150 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 4 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 4 },
      { materialId: "screed", thicknessMm: 30 },
      { materialId: "ceramic_tile", thicknessMm: 8 }
    ]
  },
  {
    id: "open-box timber split upper fill and dry deck",
    canonical: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { materialId: "laminate_flooring", thicknessMm: 8 },
      { materialId: "eps_underlay", thicknessMm: 3 },
      { materialId: "generic_fill", thicknessMm: 50 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    split: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { materialId: "laminate_flooring", thicknessMm: 8 },
      { materialId: "eps_underlay", thicknessMm: 3 },
      { materialId: "generic_fill", thicknessMm: 20 },
      { materialId: "generic_fill", thicknessMm: 30 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]
  },
  {
    id: "hollow-core split resilient product layer",
    canonical: [
      { materialId: "hollow_core_plank", thicknessMm: 200 },
      { materialId: "geniemat_rst05", thicknessMm: 5 },
      { materialId: "vinyl_flooring", thicknessMm: 2.5 },
      { materialId: "genieclip_rst", thicknessMm: 16 },
      { materialId: "gypsum_board", thicknessMm: 16 }
    ],
    split: [
      { materialId: "hollow_core_plank", thicknessMm: 200 },
      { materialId: "geniemat_rst05", thicknessMm: 2.5 },
      { materialId: "geniemat_rst05", thicknessMm: 2.5 },
      { materialId: "vinyl_flooring", thicknessMm: 2.5 },
      { materialId: "genieclip_rst", thicknessMm: 16 },
      { materialId: "gypsum_board", thicknessMm: 16 }
    ]
  },
  {
    id: "open-web steel split dry deck",
    canonical: [
      { materialId: "open_web_steel_joist", thicknessMm: 300 },
      { materialId: "rubber_sheet", thicknessMm: 5 },
      { materialId: "particleboard_flooring", thicknessMm: 19 },
      { materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { materialId: "resilient_channel", thicknessMm: 65 },
      { materialId: "glasswool", thicknessMm: 145 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 }
    ],
    split: [
      { materialId: "open_web_steel_joist", thicknessMm: 300 },
      { materialId: "rubber_sheet", thicknessMm: 5 },
      { materialId: "particleboard_flooring", thicknessMm: 9.5 },
      { materialId: "particleboard_flooring", thicknessMm: 9.5 },
      { materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { materialId: "resilient_channel", thicknessMm: 65 },
      { materialId: "glasswool", thicknessMm: 145 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 }
    ]
  },
  {
    id: "open-web steel split resilient layer",
    canonical: [
      { materialId: "open_web_steel_joist", thicknessMm: 300 },
      { materialId: "rubber_sheet", thicknessMm: 5 },
      { materialId: "particleboard_flooring", thicknessMm: 19 },
      { materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { materialId: "resilient_channel", thicknessMm: 65 },
      { materialId: "glasswool", thicknessMm: 145 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 }
    ],
    split: [
      { materialId: "open_web_steel_joist", thicknessMm: 300 },
      { materialId: "rubber_sheet", thicknessMm: 2.5 },
      { materialId: "rubber_sheet", thicknessMm: 2.5 },
      { materialId: "particleboard_flooring", thicknessMm: 19 },
      { materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { materialId: "resilient_channel", thicknessMm: 65 },
      { materialId: "glasswool", thicknessMm: 145 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 }
    ]
  },
  {
    id: "open-web steel bound split INEX deck",
    canonical: [
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { materialId: "inex_floor_panel", thicknessMm: 19 },
      { materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    split: [
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { materialId: "inex_floor_panel", thicknessMm: 9.5 },
      { materialId: "inex_floor_panel", thicknessMm: 9.5 },
      { materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]
  },
  {
    id: "composite lower-only split ceiling-board schedule",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 7.5 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 7.5 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 25 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 25 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ]
  },
  {
    id: "open-web lower-only split ceiling-board schedule",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]
  },
  {
    id: "clt lower-only guard split ceiling-board schedule",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]
  },
  {
    id: "open-box lower-only guard split ceiling-board schedule",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 45 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 45 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]
  },
  {
    id: "open-web lower-only non-packable ceiling-board schedule",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 14 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 9 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 9 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]
  },
  {
    id: "open-web noncanonical continuation split board and fill schedule",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 45 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 45 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.5 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]
  },
  {
    id: "composite lower-only non-packable ceiling-board schedule",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 14 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ]
  },
  {
    id: "clt lower-only non-packable ceiling-board schedule",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 3 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]
  },
  {
    id: "open-box lower-only non-packable ceiling-board schedule",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 3 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]
  }
];

function resultSnapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    basis: result.impact?.basis ?? null,
    boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    dnA: result.metrics.estimatedDnADb ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    dnTA: result.metrics.estimatedDnTADb ?? null,
    dnW: result.metrics.estimatedDnWDb ?? null,
    floorSystemEstimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lowerBoundLnWUpperBound: result.lowerBoundImpact?.LnWUpperBound ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwCtr: result.floorSystemRatings?.RwCtr ?? null,
    rwDb: result.metrics.estimatedRwDb ?? null,
    rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
    supportedImpactOutputs: result.supportedImpactOutputs,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedImpactOutputs: result.unsupportedImpactOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

function assertParity(
  failures: string[],
  label: string,
  canonical: ReturnType<typeof calculateAssembly>,
  split: ReturnType<typeof calculateAssembly>
) {
  const canonicalSnapshot = resultSnapshot(canonical);
  const splitSnapshot = resultSnapshot(split);

  if (JSON.stringify(canonicalSnapshot) !== JSON.stringify(splitSnapshot)) {
    failures.push(
      `${label}: expected split-layer parity, canonical=${JSON.stringify(canonicalSnapshot)} split=${JSON.stringify(splitSnapshot)}`
    );
  }
}

describe("floor split-layer parity", () => {
  it("keeps representative floor families stable when merge-safe layers are split in the lab bundle", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      assertParity(
        failures,
        `${testCase.id} lab`,
        calculateAssembly(testCase.canonical, {
          targetOutputs: LAB_OUTPUTS
        }),
        calculateAssembly(testCase.split, {
          targetOutputs: LAB_OUTPUTS
        })
      );
    }

    expect(failures).toEqual([]);
  });

  it("keeps representative floor families stable when merge-safe layers are split in the field bundle", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      assertParity(
        failures,
        `${testCase.id} field`,
        calculateAssembly(testCase.canonical, {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }),
        calculateAssembly(testCase.split, {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        })
      );
    }

    expect(failures).toEqual([]);
  });
});

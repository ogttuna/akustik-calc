import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type RawAssemblyInferenceCase = {
  id: string;
  raw: readonly LayerInput[];
  tagged: readonly LayerInput[];
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
  "L'nT,w"
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

function resultSnapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    basis: result.impact?.basis ?? null,
    dnA: result.metrics.estimatedDnADb ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    dnTA: result.metrics.estimatedDnTADb ?? null,
    dnW: result.metrics.estimatedDnWDb ?? null,
    floorSystemEstimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
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

const CASES: readonly RawAssemblyInferenceCase[] = [
  {
    id: "exact Dataholz dry CLT family",
    raw: [
      { materialId: "clt_panel", thicknessMm: 140 },
      { materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
      { materialId: "elastic_bonded_fill", thicknessMm: 60 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ],
    tagged: [
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 },
      { floorRole: "resilient_layer", materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
      { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ]
  },
  {
    id: "exact TUAS open-box dry floor family",
    raw: [
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
    tagged: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]
  },
  {
    id: "preset-only Dataholz integrated dry timber row",
    raw: [
      { materialId: "gypsum_board", thicknessMm: 15 },
      { materialId: "rockwool", thicknessMm: 200 },
      { materialId: "acoustic_hanger_ceiling", thicknessMm: 60 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
      { materialId: "timber_frame_floor", thicknessMm: 200 }
    ],
    tagged: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 200 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 60 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 200 }
    ]
  },
  {
    id: "preset-only Dataholz integrated dry CLT row",
    raw: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { materialId: "non_bonded_chippings", thicknessMm: 60 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
      { materialId: "clt_panel", thicknessMm: 160 }
    ],
    tagged: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 60 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }
    ]
  },
  {
    id: "promoted heavy concrete floating floor family estimate",
    raw: [
      { materialId: "concrete", thicknessMm: 150 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { materialId: "screed", thicknessMm: 30 },
      { materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    tagged: [
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
    ]
  }
];

describe("raw floor-layer assembly inference parity", () => {
  it.each(CASES)("$id on the lab bundle", ({ raw, tagged }) => {
    const rawResult = calculateAssembly(raw, {
      targetOutputs: LAB_OUTPUTS
    });
    const taggedResult = calculateAssembly(tagged, {
      targetOutputs: LAB_OUTPUTS
    });

    expect(rawResult.ok).toBe(true);
    expect(taggedResult.ok).toBe(true);
    expect(resultSnapshot(rawResult)).toEqual(resultSnapshot(taggedResult));
  });

  it.each(CASES)("$id on the field bundle", ({ raw, tagged }) => {
    const rawResult = calculateAssembly(raw, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const taggedResult = calculateAssembly(tagged, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(rawResult.ok).toBe(true);
    expect(taggedResult.ok).toBe(true);
    expect(resultSnapshot(rawResult)).toEqual(resultSnapshot(taggedResult));
  });
});

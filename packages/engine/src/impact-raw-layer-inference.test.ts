import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";

type RawInferenceCase = {
  id: string;
  raw: readonly LayerInput[];
  tagged: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
};

function resultSnapshot(result: ReturnType<typeof calculateImpactOnly>) {
  return {
    basis: result.impact?.basis ?? null,
    ci: result.impact?.CI ?? null,
    ci50_2500: result.impact?.CI50_2500 ?? null,
    deltaLw: result.impact?.DeltaLw ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    matchedCatalogCaseId: result.impactPredictorStatus?.matchedCatalogCaseId ?? null,
    matchedFloorSystemId: result.impactPredictorStatus?.matchedFloorSystemId ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwCtr: result.floorSystemRatings?.RwCtr ?? null,
    supportedImpactOutputs: result.supportedImpactOutputs,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedImpactOutputs: result.unsupportedImpactOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

const CASES: readonly RawInferenceCase[] = [
  {
    id: "generic heavy concrete floating floor",
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
    ],
    targetOutputs: ["Ln,w", "Rw"]
  },
  {
    id: "published exact timber direct ceiling family",
    raw: [
      { materialId: "engineered_timber_structural", thicknessMm: 240 },
      { materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { materialId: "glasswool", thicknessMm: 90 },
      { materialId: "firestop_board", thicknessMm: 13 }
    ],
    tagged: [
      { floorRole: "base_structure", materialId: "engineered_timber_structural", thicknessMm: 240 },
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 90 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 }
    ],
    targetOutputs: ["Ln,w", "Rw"]
  },
  {
    id: "low-confidence timber ceramic direct ceiling family",
    raw: [
      { materialId: "timber_joist_floor", thicknessMm: 240 },
      { materialId: "ceramic_tile", thicknessMm: 8 },
      { materialId: "glasswool", thicknessMm: 90 },
      { materialId: "firestop_board", thicknessMm: 13 }
    ],
    tagged: [
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 },
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 90 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 }
    ],
    targetOutputs: ["Ln,w", "Rw"]
  },
  {
    id: "published exact hollow-core resilient underlay family",
    raw: [
      { materialId: "hollow_core_plank", thicknessMm: 200 },
      { materialId: "geniemat_rst05", thicknessMm: 5 },
      { materialId: "vinyl_flooring", thicknessMm: 2.5 },
      { materialId: "genieclip_rst", thicknessMm: 16 },
      { materialId: "gypsum_board", thicknessMm: 16 }
    ],
    tagged: [
      { floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 200 },
      { floorRole: "resilient_layer", materialId: "geniemat_rst05", thicknessMm: 5 },
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 2.5 },
      { floorRole: "ceiling_cavity", materialId: "genieclip_rst", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 16 }
    ],
    targetOutputs: ["Ln,w", "Rw"]
  },
  {
    id: "published exact dry CLT family",
    raw: [
      { materialId: "clt_panel", thicknessMm: 140 },
      { materialId: "eps_acoustic_underlay", thicknessMm: 3 },
      { materialId: "laminate_flooring", thicknessMm: 8 }
    ],
    tagged: [
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 },
      { floorRole: "resilient_layer", materialId: "eps_acoustic_underlay", thicknessMm: 3 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 }
    ],
    targetOutputs: ["Ln,w", "Ln,w+CI", "Rw"]
  },
  {
    id: "published exact composite dry floor family",
    raw: [
      { materialId: "steel_deck_composite", thicknessMm: 60 },
      { materialId: "mw_t_10_impact_layer", thicknessMm: 15 },
      { materialId: "gypsum_fiberboard", thicknessMm: 25 }
    ],
    tagged: [
      { floorRole: "base_structure", materialId: "steel_deck_composite", thicknessMm: 60 },
      { floorRole: "resilient_layer", materialId: "mw_t_10_impact_layer", thicknessMm: 15 },
      { floorRole: "floor_covering", materialId: "gypsum_fiberboard", thicknessMm: 25 }
    ],
    targetOutputs: ["Ln,w", "Rw"]
  },
  {
    id: "published exact open-web steel combined family",
    raw: [
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
    tagged: [
      { floorRole: "base_structure", materialId: "open_web_steel_joist", thicknessMm: 300 },
      { floorRole: "resilient_layer", materialId: "rubber_sheet", thicknessMm: 5 },
      { floorRole: "floating_screed", materialId: "particleboard_flooring", thicknessMm: 19 },
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 65 },
      { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 145 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
    ],
    targetOutputs: ["Ln,w", "Ln,w+CI", "Rw"]
  }
];

describe("raw floor-layer inference parity", () => {
  it.each(CASES)("$id", ({ raw, tagged, targetOutputs }) => {
    const taggedResult = calculateImpactOnly(tagged, { targetOutputs });
    const rawResult = calculateImpactOnly(raw, { targetOutputs });

    expect(taggedResult.ok).toBe(true);
    expect(rawResult.ok).toBe(true);
    expect(resultSnapshot(rawResult)).toEqual(resultSnapshot(taggedResult));
  });
});

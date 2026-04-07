import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type InferredSplitCase = {
  id: string;
  rawSingle: readonly LayerInput[];
  rawSplit: readonly LayerInput[];
  taggedSingle: readonly LayerInput[];
  taggedSplit: readonly LayerInput[];
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

const CASES: readonly InferredSplitCase[] = [
  {
    id: "exact Dataholz dry CLT family",
    rawSingle: [
      { materialId: "clt_panel", thicknessMm: 140 },
      { materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
      { materialId: "elastic_bonded_fill", thicknessMm: 60 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ],
    rawSplit: [
      { materialId: "clt_panel", thicknessMm: 70 },
      { materialId: "clt_panel", thicknessMm: 70 },
      { materialId: "mw_t_40_impact_layer", thicknessMm: 15 },
      { materialId: "mw_t_40_impact_layer", thicknessMm: 15 },
      { materialId: "elastic_bonded_fill", thicknessMm: 30 },
      { materialId: "elastic_bonded_fill", thicknessMm: 30 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ],
    taggedSingle: [
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 },
      { floorRole: "resilient_layer", materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
      { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ],
    taggedSplit: [
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 70 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 70 },
      { floorRole: "resilient_layer", materialId: "mw_t_40_impact_layer", thicknessMm: 15 },
      { floorRole: "resilient_layer", materialId: "mw_t_40_impact_layer", thicknessMm: 15 },
      { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 30 },
      { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 30 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ]
  },
  {
    id: "exact TUAS open-box dry floor family",
    rawSingle: [
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
    rawSplit: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { materialId: "laminate_flooring", thicknessMm: 8 },
      { materialId: "eps_underlay", thicknessMm: 1.5 },
      { materialId: "eps_underlay", thicknessMm: 1.5 },
      { materialId: "generic_fill", thicknessMm: 25 },
      { materialId: "generic_fill", thicknessMm: 25 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    taggedSingle: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    taggedSplit: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 25 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 25 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]
  },
  {
    id: "preset-only Dataholz integrated dry CLT row",
    rawSingle: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { materialId: "non_bonded_chippings", thicknessMm: 60 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
      { materialId: "clt_panel", thicknessMm: 160 }
    ],
    rawSplit: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 25 },
      { materialId: "rockwool", thicknessMm: 25 },
      { materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { materialId: "non_bonded_chippings", thicknessMm: 30 },
      { materialId: "non_bonded_chippings", thicknessMm: 30 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 32.5 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 32.5 },
      { materialId: "clt_panel", thicknessMm: 80 },
      { materialId: "clt_panel", thicknessMm: 80 }
    ],
    taggedSingle: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 60 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }
    ],
    taggedSplit: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 25 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 25 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 30 },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 30 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 32.5 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 32.5 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 80 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 80 }
    ]
  },
  {
    id: "promoted heavy concrete floating floor family estimate",
    rawSingle: [
      { materialId: "concrete", thicknessMm: 150 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { materialId: "screed", thicknessMm: 30 },
      { materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    rawSplit: [
      { materialId: "concrete", thicknessMm: 75 },
      { materialId: "concrete", thicknessMm: 75 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 4 },
      { materialId: "generic_resilient_underlay_s30", thicknessMm: 4 },
      { materialId: "screed", thicknessMm: 15 },
      { materialId: "screed", thicknessMm: 15 },
      { materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    taggedSingle: [
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    taggedSplit: [
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 75 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 75 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 4 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 4 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 15 },
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
    ]
  }
];

function snapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    basis: result.impact?.basis ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwDb: result.metrics.estimatedRwDb ?? null,
    rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
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

describe("raw floor inferred split parity", () => {
  it("keeps treated and inferred floor packages identical across contiguous split variants on the lab bundle", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const baseline = snapshot(calculateLab(testCase.rawSingle));
      const candidates = [
        ["raw split", calculateLab(testCase.rawSplit)],
        ["tagged single", calculateLab(testCase.taggedSingle)],
        ["tagged split", calculateLab(testCase.taggedSplit)]
      ] as const;

      for (const [label, result] of candidates) {
        if (JSON.stringify(snapshot(result)) !== JSON.stringify(baseline)) {
          failures.push(`${testCase.id} lab ${label} drifted from the defended raw-single snapshot`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps treated and inferred floor packages identical across contiguous split variants on the field bundle", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const baseline = snapshot(calculateField(testCase.rawSingle));
      const candidates = [
        ["raw split", calculateField(testCase.rawSplit)],
        ["tagged single", calculateField(testCase.taggedSingle)],
        ["tagged split", calculateField(testCase.taggedSplit)]
      ] as const;

      for (const [label, result] of candidates) {
        if (JSON.stringify(snapshot(result)) !== JSON.stringify(baseline)) {
          failures.push(`${testCase.id} field ${label} drifted from the defended raw-single snapshot`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildOutputCard } from "./simple-workbench-output-model";
import { evaluateScenario } from "./scenario-analysis";

type ScenarioRow = {
  floorRole?: string;
  id: string;
  materialId: string;
  thicknessMm: number | string;
};

type InferredSplitCase = {
  id: string;
  rawSingle: readonly ScenarioRow[];
  rawSplit: readonly ScenarioRow[];
  taggedSingle: readonly ScenarioRow[];
  taggedSplit: readonly ScenarioRow[];
};

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
    id: "exact-dataholz-dry-clt-family",
    rawSingle: [
      { id: "a", materialId: "clt_panel", thicknessMm: 140 },
      { id: "b", materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
      { id: "c", materialId: "elastic_bonded_fill", thicknessMm: 60 },
      { id: "d", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ],
    rawSplit: [
      { id: "a", materialId: "clt_panel", thicknessMm: 70 },
      { id: "b", materialId: "clt_panel", thicknessMm: 70 },
      { id: "c", materialId: "mw_t_40_impact_layer", thicknessMm: 15 },
      { id: "d", materialId: "mw_t_40_impact_layer", thicknessMm: 15 },
      { id: "e", materialId: "elastic_bonded_fill", thicknessMm: 30 },
      { id: "f", materialId: "elastic_bonded_fill", thicknessMm: 30 },
      { id: "g", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ],
    taggedSingle: [
      { floorRole: "base_structure", id: "a", materialId: "clt_panel", thicknessMm: 140 },
      { floorRole: "resilient_layer", id: "b", materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
      { floorRole: "upper_fill", id: "c", materialId: "elastic_bonded_fill", thicknessMm: 60 },
      { floorRole: "floor_covering", id: "d", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ],
    taggedSplit: [
      { floorRole: "base_structure", id: "a", materialId: "clt_panel", thicknessMm: 70 },
      { floorRole: "base_structure", id: "b", materialId: "clt_panel", thicknessMm: 70 },
      { floorRole: "resilient_layer", id: "c", materialId: "mw_t_40_impact_layer", thicknessMm: 15 },
      { floorRole: "resilient_layer", id: "d", materialId: "mw_t_40_impact_layer", thicknessMm: 15 },
      { floorRole: "upper_fill", id: "e", materialId: "elastic_bonded_fill", thicknessMm: 30 },
      { floorRole: "upper_fill", id: "f", materialId: "elastic_bonded_fill", thicknessMm: 30 },
      { floorRole: "floor_covering", id: "g", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ]
  },
  {
    id: "exact-tuas-open-box-dry-family",
    rawSingle: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "c", materialId: "rockwool", thicknessMm: 100 },
      { id: "d", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { id: "e", materialId: "laminate_flooring", thicknessMm: 8 },
      { id: "f", materialId: "eps_underlay", thicknessMm: 3 },
      { id: "g", materialId: "generic_fill", thicknessMm: 50 },
      { id: "h", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { id: "i", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    rawSplit: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "c", materialId: "rockwool", thicknessMm: 50 },
      { id: "d", materialId: "rockwool", thicknessMm: 50 },
      { id: "e", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { id: "f", materialId: "laminate_flooring", thicknessMm: 8 },
      { id: "g", materialId: "eps_underlay", thicknessMm: 1.5 },
      { id: "h", materialId: "eps_underlay", thicknessMm: 1.5 },
      { id: "i", materialId: "generic_fill", thicknessMm: 25 },
      { id: "j", materialId: "generic_fill", thicknessMm: 25 },
      { id: "k", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { id: "l", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { id: "m", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    taggedSingle: [
      { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", id: "b", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", id: "d", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", id: "e", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", id: "f", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", id: "g", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", id: "h", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", id: "i", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    taggedSplit: [
      { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", id: "b", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_fill", id: "d", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", id: "e", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", id: "f", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", id: "g", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "resilient_layer", id: "h", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "upper_fill", id: "i", materialId: "generic_fill", thicknessMm: 25 },
      { floorRole: "upper_fill", id: "j", materialId: "generic_fill", thicknessMm: 25 },
      { floorRole: "floating_screed", id: "k", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { floorRole: "floating_screed", id: "l", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { floorRole: "base_structure", id: "m", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]
  },
  {
    id: "preset-only-dataholz-integrated-dry-clt-row",
    rawSingle: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 12.5 },
      { id: "b", materialId: "rockwool", thicknessMm: 50 },
      { id: "c", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { id: "d", materialId: "non_bonded_chippings", thicknessMm: 60 },
      { id: "e", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
      { id: "f", materialId: "clt_panel", thicknessMm: 160 }
    ],
    rawSplit: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 12.5 },
      { id: "b", materialId: "rockwool", thicknessMm: 25 },
      { id: "c", materialId: "rockwool", thicknessMm: 25 },
      { id: "d", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { id: "e", materialId: "non_bonded_chippings", thicknessMm: 30 },
      { id: "f", materialId: "non_bonded_chippings", thicknessMm: 30 },
      { id: "g", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 32.5 },
      { id: "h", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 32.5 },
      { id: "i", materialId: "clt_panel", thicknessMm: 80 },
      { id: "j", materialId: "clt_panel", thicknessMm: 80 }
    ],
    taggedSingle: [
      { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { floorRole: "upper_fill", id: "d", materialId: "non_bonded_chippings", thicknessMm: 60 },
      { floorRole: "floor_covering", id: "e", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
      { floorRole: "base_structure", id: "f", materialId: "clt_panel", thicknessMm: 160 }
    ],
    taggedSplit: [
      { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 25 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 25 },
      { floorRole: "ceiling_cavity", id: "d", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { floorRole: "upper_fill", id: "e", materialId: "non_bonded_chippings", thicknessMm: 30 },
      { floorRole: "upper_fill", id: "f", materialId: "non_bonded_chippings", thicknessMm: 30 },
      { floorRole: "floor_covering", id: "g", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 32.5 },
      { floorRole: "floor_covering", id: "h", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 32.5 },
      { floorRole: "base_structure", id: "i", materialId: "clt_panel", thicknessMm: 80 },
      { floorRole: "base_structure", id: "j", materialId: "clt_panel", thicknessMm: 80 }
    ]
  },
  {
    id: "promoted-heavy-concrete-floating-floor-family-estimate",
    rawSingle: [
      { id: "a", materialId: "concrete", thicknessMm: 150 },
      { id: "b", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { id: "c", materialId: "screed", thicknessMm: 30 },
      { id: "d", materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    rawSplit: [
      { id: "a", materialId: "concrete", thicknessMm: 75 },
      { id: "b", materialId: "concrete", thicknessMm: 75 },
      { id: "c", materialId: "generic_resilient_underlay_s30", thicknessMm: 4 },
      { id: "d", materialId: "generic_resilient_underlay_s30", thicknessMm: 4 },
      { id: "e", materialId: "screed", thicknessMm: 15 },
      { id: "f", materialId: "screed", thicknessMm: 15 },
      { id: "g", materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    taggedSingle: [
      { floorRole: "base_structure", id: "a", materialId: "concrete", thicknessMm: 150 },
      { floorRole: "resilient_layer", id: "b", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", id: "c", materialId: "screed", thicknessMm: 30 },
      { floorRole: "floor_covering", id: "d", materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    taggedSplit: [
      { floorRole: "base_structure", id: "a", materialId: "concrete", thicknessMm: 75 },
      { floorRole: "base_structure", id: "b", materialId: "concrete", thicknessMm: 75 },
      { floorRole: "resilient_layer", id: "c", materialId: "generic_resilient_underlay_s30", thicknessMm: 4 },
      { floorRole: "resilient_layer", id: "d", materialId: "generic_resilient_underlay_s30", thicknessMm: 4 },
      { floorRole: "floating_screed", id: "e", materialId: "screed", thicknessMm: 15 },
      { floorRole: "floating_screed", id: "f", materialId: "screed", thicknessMm: 15 },
      { floorRole: "floor_covering", id: "g", materialId: "ceramic_tile", thicknessMm: 8 }
    ]
  }
];

function snapshot(id: string, rows: readonly ScenarioRow[]) {
  const result = evaluateScenario({
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: id,
    rows: [...rows],
    source: "current",
    studyMode: "floor",
    targetOutputs: FIELD_OUTPUTS
  }).result;

  return {
    basis: result.impact?.basis ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    outputCards: Object.fromEntries(
      FIELD_OUTPUTS.map((output) => [
        output,
        buildOutputCard({
          output,
          result,
          studyMode: "floor"
        }).status
      ])
    ),
    rw: result.floorSystemRatings?.Rw ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

describe("raw floor inferred split parity route surface", () => {
  it("keeps treated and inferred floor packages identical across contiguous split route variants", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const baseline = snapshot(`${testCase.id}-raw-single`, testCase.rawSingle);
      const candidates = [
        ["raw split", snapshot(`${testCase.id}-raw-split`, testCase.rawSplit)],
        ["tagged single", snapshot(`${testCase.id}-tagged-single`, testCase.taggedSingle)],
        ["tagged split", snapshot(`${testCase.id}-tagged-split`, testCase.taggedSplit)]
      ] as const;

      for (const [label, candidate] of candidates) {
        if (JSON.stringify(candidate) !== JSON.stringify(baseline)) {
          failures.push(`${testCase.id} route ${label} drifted from the defended raw-single surface`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});

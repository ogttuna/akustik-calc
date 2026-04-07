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

type BareCarrierCase = {
  compareTaggedVariants?: boolean;
  id: string;
  rawSingle: readonly ScenarioRow[];
  rawSplit: readonly ScenarioRow[];
  taggedSingle: readonly ScenarioRow[];
  taggedSplit: readonly ScenarioRow[];
};

type NegativeCarrierCase = {
  id: string;
  rawSingle: readonly ScenarioRow[];
  rawSplit: readonly ScenarioRow[];
  taggedSingle?: readonly ScenarioRow[];
  taggedSplit?: readonly ScenarioRow[];
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

const SAFE_BARE_CASES: readonly BareCarrierCase[] = [
  {
    compareTaggedVariants: false,
    id: "raw-concrete-bare-carrier",
    rawSingle: [{ id: "a", materialId: "concrete", thicknessMm: 150 }],
    rawSplit: [
      { id: "a", materialId: "concrete", thicknessMm: 75 },
      { id: "b", materialId: "concrete", thicknessMm: 75 }
    ],
    taggedSingle: [{ floorRole: "base_structure", id: "a", materialId: "concrete", thicknessMm: 150 }],
    taggedSplit: [
      { floorRole: "base_structure", id: "a", materialId: "concrete", thicknessMm: 75 },
      { floorRole: "base_structure", id: "b", materialId: "concrete", thicknessMm: 75 }
    ]
  },
  {
    id: "raw-hollow-core-bare-carrier",
    rawSingle: [{ id: "a", materialId: "hollow_core_plank", thicknessMm: 200 }],
    rawSplit: [
      { id: "a", materialId: "hollow_core_plank", thicknessMm: 100 },
      { id: "b", materialId: "hollow_core_plank", thicknessMm: 100 }
    ],
    taggedSingle: [{ floorRole: "base_structure", id: "a", materialId: "hollow_core_plank", thicknessMm: 200 }],
    taggedSplit: [
      { floorRole: "base_structure", id: "a", materialId: "hollow_core_plank", thicknessMm: 100 },
      { floorRole: "base_structure", id: "b", materialId: "hollow_core_plank", thicknessMm: 100 }
    ]
  },
  {
    id: "raw-bare-clt-carrier",
    rawSingle: [{ id: "a", materialId: "clt_panel", thicknessMm: 140 }],
    rawSplit: [
      { id: "a", materialId: "clt_panel", thicknessMm: 70 },
      { id: "b", materialId: "clt_panel", thicknessMm: 70 }
    ],
    taggedSingle: [{ floorRole: "base_structure", id: "a", materialId: "clt_panel", thicknessMm: 140 }],
    taggedSplit: [
      { floorRole: "base_structure", id: "a", materialId: "clt_panel", thicknessMm: 70 },
      { floorRole: "base_structure", id: "b", materialId: "clt_panel", thicknessMm: 70 }
    ]
  },
  {
    id: "raw-bare-composite-deck-carrier",
    rawSingle: [{ id: "a", materialId: "composite_steel_deck", thicknessMm: 150 }],
    rawSplit: [
      { id: "a", materialId: "composite_steel_deck", thicknessMm: 75 },
      { id: "b", materialId: "composite_steel_deck", thicknessMm: 75 }
    ],
    taggedSingle: [{ floorRole: "base_structure", id: "a", materialId: "composite_steel_deck", thicknessMm: 150 }],
    taggedSplit: [
      { floorRole: "base_structure", id: "a", materialId: "composite_steel_deck", thicknessMm: 75 },
      { floorRole: "base_structure", id: "b", materialId: "composite_steel_deck", thicknessMm: 75 }
    ]
  },
  {
    id: "raw-bare-steel-deck-composite-carrier",
    rawSingle: [{ id: "a", materialId: "steel_deck_composite", thicknessMm: 150 }],
    rawSplit: [
      { id: "a", materialId: "steel_deck_composite", thicknessMm: 75 },
      { id: "b", materialId: "steel_deck_composite", thicknessMm: 75 }
    ],
    taggedSingle: [{ floorRole: "base_structure", id: "a", materialId: "steel_deck_composite", thicknessMm: 150 }],
    taggedSplit: [
      { floorRole: "base_structure", id: "a", materialId: "steel_deck_composite", thicknessMm: 75 },
      { floorRole: "base_structure", id: "b", materialId: "steel_deck_composite", thicknessMm: 75 }
    ]
  }
];

const NEGATIVE_CASES: readonly NegativeCarrierCase[] = [
  {
    id: "raw-open-box-carrier-stays-closed",
    rawSingle: [{ id: "a", materialId: "open_box_timber_slab", thicknessMm: 370 }],
    rawSplit: [
      { id: "a", materialId: "open_box_timber_slab", thicknessMm: 185 },
      { id: "b", materialId: "open_box_timber_slab", thicknessMm: 185 }
    ],
    taggedSingle: [{ floorRole: "base_structure", id: "a", materialId: "open_box_timber_slab", thicknessMm: 370 }],
    taggedSplit: [
      { floorRole: "base_structure", id: "a", materialId: "open_box_timber_slab", thicknessMm: 185 },
      { floorRole: "base_structure", id: "b", materialId: "open_box_timber_slab", thicknessMm: 185 }
    ]
  },
  {
    id: "walllike-hybrid-stays-closed",
    rawSingle: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 12.5 },
      { id: "b", materialId: "concrete", thicknessMm: 120 },
      { id: "c", materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    rawSplit: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 6.25 },
      { id: "b", materialId: "gypsum_board", thicknessMm: 6.25 },
      { id: "c", materialId: "concrete", thicknessMm: 60 },
      { id: "d", materialId: "concrete", thicknessMm: 60 },
      { id: "e", materialId: "gypsum_board", thicknessMm: 6.25 },
      { id: "f", materialId: "gypsum_board", thicknessMm: 6.25 }
    ]
  }
];

function evaluateRows(id: string, rows: readonly ScenarioRow[]) {
  return evaluateScenario({
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: id,
    rows: [...rows],
    source: "current",
    studyMode: "floor",
    targetOutputs: FIELD_OUTPUTS
  }).result;
}

function snapshot(id: string, rows: readonly ScenarioRow[]) {
  const result = evaluateRows(id, rows);

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

describe("raw floor safe bare split parity route surface", () => {
  it("keeps safe bare raw carriers aligned with tagged variants across contiguous split route scenarios", () => {
    const failures: string[] = [];

    for (const testCase of SAFE_BARE_CASES) {
      const baseline = snapshot(`${testCase.id}-raw-single`, testCase.rawSingle);
      const candidates = [["raw split", snapshot(`${testCase.id}-raw-split`, testCase.rawSplit)]] as Array<
        readonly [string, ReturnType<typeof snapshot>]
      >;

      if (testCase.compareTaggedVariants !== false) {
        candidates.push(
          ["tagged single", snapshot(`${testCase.id}-tagged-single`, testCase.taggedSingle)],
          ["tagged split", snapshot(`${testCase.id}-tagged-split`, testCase.taggedSplit)]
        );
      }

      for (const [label, candidate] of candidates) {
        if (JSON.stringify(candidate) !== JSON.stringify(baseline)) {
          failures.push(`${testCase.id} route ${label} drifted from the defended raw-single surface`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps unsupported raw carriers explicit across contiguous split route scenarios", () => {
    const failures: string[] = [];

    for (const testCase of NEGATIVE_CASES) {
      const baseline = snapshot(`${testCase.id}-raw-single`, testCase.rawSingle);

      if (!baseline.supportedTargetOutputs.includes("R'w")) {
        failures.push(`${testCase.id} route baseline unexpectedly lost apparent airborne support`);
      }

      if (baseline.supportedTargetOutputs.includes("Rw")) {
        failures.push(`${testCase.id} route baseline unexpectedly reopened companion Rw`);
      }

      const rawSplit = snapshot(`${testCase.id}-raw-split`, testCase.rawSplit);
      if (JSON.stringify(rawSplit) !== JSON.stringify(baseline)) {
        failures.push(`${testCase.id} route raw split drifted from the defended raw-single surface`);
      }

      if (testCase.taggedSingle) {
        const taggedSingle = snapshot(`${testCase.id}-tagged-single`, testCase.taggedSingle);
        if (JSON.stringify(taggedSingle) !== JSON.stringify(baseline)) {
          failures.push(`${testCase.id} route tagged single drifted from the defended raw surface`);
        }
      }

      if (testCase.taggedSplit) {
        const taggedSplit = snapshot(`${testCase.id}-tagged-split`, testCase.taggedSplit);
        if (JSON.stringify(taggedSplit) !== JSON.stringify(baseline)) {
          failures.push(`${testCase.id} route tagged split drifted from the defended raw surface`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});

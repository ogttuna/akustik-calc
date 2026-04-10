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

type CarrierCase = {
  expectedStatuses: Record<RequestedOutputId, "live" | "needs_input" | "unsupported">;
  id: string;
  variants: readonly {
    id: string;
    rows: readonly ScenarioRow[];
  }[];
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

const FAIL_CLOSED_STATUSES: Record<RequestedOutputId, "live" | "needs_input" | "unsupported"> = {
  Rw: "unsupported",
  "R'w": "live",
  "DnT,w": "live",
  "Ln,w": "unsupported",
  "L'n,w": "needs_input",
  "L'nT,w": "needs_input"
};

const CASES: readonly CarrierCase[] = [
  {
    id: "open-box-timber-bare-carrier",
    expectedStatuses: FAIL_CLOSED_STATUSES,
    variants: [
      {
        id: "raw-single",
        rows: [{ id: "a", materialId: "open_box_timber_slab", thicknessMm: 370 }]
      },
      {
        id: "raw-split",
        rows: [
          { id: "a", materialId: "open_box_timber_slab", thicknessMm: 185 },
          { id: "b", materialId: "open_box_timber_slab", thicknessMm: 185 }
        ]
      },
      {
        id: "tagged-single",
        rows: [{ floorRole: "base_structure", id: "a", materialId: "open_box_timber_slab", thicknessMm: 370 }]
      },
      {
        id: "tagged-split",
        rows: [
          { floorRole: "base_structure", id: "a", materialId: "open_box_timber_slab", thicknessMm: 185 },
          { floorRole: "base_structure", id: "b", materialId: "open_box_timber_slab", thicknessMm: 185 }
        ]
      }
    ]
  },
  {
    id: "open-web-steel-bare-carrier",
    expectedStatuses: FAIL_CLOSED_STATUSES,
    variants: [
      {
        id: "raw-single",
        rows: [{ id: "a", materialId: "open_web_steel_floor", thicknessMm: 300 }]
      },
      {
        id: "raw-split",
        rows: [
          { id: "a", materialId: "open_web_steel_floor", thicknessMm: 150 },
          { id: "b", materialId: "open_web_steel_floor", thicknessMm: 150 }
        ]
      },
      {
        id: "tagged-single",
        rows: [{ floorRole: "base_structure", id: "a", materialId: "open_web_steel_floor", thicknessMm: 300 }]
      },
      {
        id: "tagged-split",
        rows: [
          { floorRole: "base_structure", id: "a", materialId: "open_web_steel_floor", thicknessMm: 150 },
          { floorRole: "base_structure", id: "b", materialId: "open_web_steel_floor", thicknessMm: 150 }
        ]
      }
    ]
  },
  {
    id: "lightweight-steel-bare-carrier",
    expectedStatuses: FAIL_CLOSED_STATUSES,
    variants: [
      {
        id: "raw-single",
        rows: [{ id: "a", materialId: "lightweight_steel_floor", thicknessMm: 250 }]
      },
      {
        id: "raw-split",
        rows: [
          { id: "a", materialId: "lightweight_steel_floor", thicknessMm: 125 },
          { id: "b", materialId: "lightweight_steel_floor", thicknessMm: 125 }
        ]
      },
      {
        id: "tagged-single",
        rows: [{ floorRole: "base_structure", id: "a", materialId: "lightweight_steel_floor", thicknessMm: 250 }]
      },
      {
        id: "tagged-split",
        rows: [
          { floorRole: "base_structure", id: "a", materialId: "lightweight_steel_floor", thicknessMm: 125 },
          { floorRole: "base_structure", id: "b", materialId: "lightweight_steel_floor", thicknessMm: 125 }
        ]
      }
    ]
  },
  {
    id: "steel-joist-bare-carrier",
    expectedStatuses: FAIL_CLOSED_STATUSES,
    variants: [
      {
        id: "raw-single",
        rows: [{ id: "a", materialId: "steel_joist_floor", thicknessMm: 250 }]
      },
      {
        id: "raw-split",
        rows: [
          { id: "a", materialId: "steel_joist_floor", thicknessMm: 125 },
          { id: "b", materialId: "steel_joist_floor", thicknessMm: 125 }
        ]
      },
      {
        id: "tagged-single",
        rows: [{ floorRole: "base_structure", id: "a", materialId: "steel_joist_floor", thicknessMm: 250 }]
      },
      {
        id: "tagged-split",
        rows: [
          { floorRole: "base_structure", id: "a", materialId: "steel_joist_floor", thicknessMm: 125 },
          { floorRole: "base_structure", id: "b", materialId: "steel_joist_floor", thicknessMm: 125 }
        ]
      }
    ]
  },
  {
    id: "steel-joist-helper-heavy-package",
    expectedStatuses: FAIL_CLOSED_STATUSES,
    variants: [
      {
        id: "raw-helper-fill-board-mixed",
        rows: [
          { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
          { id: "b", materialId: "rockwool", thicknessMm: 90 },
          { id: "c", materialId: "gypsum_board", thicknessMm: 13 },
          { id: "d", materialId: "steel_joist_floor", thicknessMm: 250 }
        ]
      },
      {
        id: "tagged-helper-fill-board-mixed",
        rows: [
          { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 90 },
          { floorRole: "ceiling_board", id: "c", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "base_structure", id: "d", materialId: "steel_joist_floor", thicknessMm: 250 }
        ]
      }
    ]
  },
  {
    id: "open-box-timber-non-combined-packages",
    expectedStatuses: FAIL_CLOSED_STATUSES,
    variants: [
      {
        id: "raw-lower-only",
        rows: [
          { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
          { id: "b", materialId: "rockwool", thicknessMm: 90 },
          { id: "c", materialId: "furring_channel", thicknessMm: 28 },
          { id: "d", materialId: "open_box_timber_slab", thicknessMm: 370 }
        ]
      },
      {
        id: "tagged-lower-only",
        rows: [
          { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 90 },
          { floorRole: "ceiling_cavity", id: "c", materialId: "furring_channel", thicknessMm: 28 },
          { floorRole: "base_structure", id: "d", materialId: "open_box_timber_slab", thicknessMm: 370 }
        ]
      },
      {
        id: "raw-upper-only",
        rows: [
          { id: "a", materialId: "laminate_flooring", thicknessMm: 8 },
          { id: "b", materialId: "eps_underlay", thicknessMm: 3 },
          { id: "c", materialId: "generic_fill", thicknessMm: 50 },
          { id: "d", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
          { id: "e", materialId: "open_box_timber_slab", thicknessMm: 370 }
        ]
      },
      {
        id: "tagged-upper-only",
        rows: [
          { floorRole: "floor_covering", id: "a", materialId: "laminate_flooring", thicknessMm: 8 },
          { floorRole: "resilient_layer", id: "b", materialId: "eps_underlay", thicknessMm: 3 },
          { floorRole: "upper_fill", id: "c", materialId: "generic_fill", thicknessMm: 50 },
          { floorRole: "floating_screed", id: "d", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
          { floorRole: "base_structure", id: "e", materialId: "open_box_timber_slab", thicknessMm: 370 }
        ]
      }
    ]
  }
];

const TIMBER_CASES = [
  {
    id: "timber-frame",
    rawSingle: [{ id: "a", materialId: "timber_frame_floor", thicknessMm: 200 }],
    rawSplit: [
      { id: "a", materialId: "timber_frame_floor", thicknessMm: 100 },
      { id: "b", materialId: "timber_frame_floor", thicknessMm: 100 }
    ],
    rawLowerOnly: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "rockwool", thicknessMm: 90 },
      { id: "c", materialId: "furring_channel", thicknessMm: 28 },
      { id: "d", materialId: "timber_frame_floor", thicknessMm: 200 }
    ],
    rawUpperOnly: [
      { id: "a", materialId: "laminate_flooring", thicknessMm: 8 },
      { id: "b", materialId: "timber_frame_floor", thicknessMm: 200 }
    ],
    taggedSingle: [{ floorRole: "base_structure", id: "a", materialId: "timber_frame_floor", thicknessMm: 200 }],
    taggedSplit: [
      { floorRole: "base_structure", id: "a", materialId: "timber_frame_floor", thicknessMm: 100 },
      { floorRole: "base_structure", id: "b", materialId: "timber_frame_floor", thicknessMm: 100 }
    ],
    taggedLowerOnly: [
      { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "base_structure", id: "d", materialId: "timber_frame_floor", thicknessMm: 200 }
    ],
    taggedUpperOnly: [
      { floorRole: "floor_covering", id: "a", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", id: "b", materialId: "timber_frame_floor", thicknessMm: 200 }
    ]
  },
  {
    id: "timber-joist",
    rawSingle: [{ id: "a", materialId: "timber_joist_floor", thicknessMm: 240 }],
    rawSplit: [
      { id: "a", materialId: "timber_joist_floor", thicknessMm: 120 },
      { id: "b", materialId: "timber_joist_floor", thicknessMm: 120 }
    ],
    rawLowerOnly: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "rockwool", thicknessMm: 90 },
      { id: "c", materialId: "furring_channel", thicknessMm: 28 },
      { id: "d", materialId: "timber_joist_floor", thicknessMm: 240 }
    ],
    rawUpperOnly: [
      { id: "a", materialId: "laminate_flooring", thicknessMm: 8 },
      { id: "b", materialId: "timber_joist_floor", thicknessMm: 240 }
    ],
    taggedSingle: [{ floorRole: "base_structure", id: "a", materialId: "timber_joist_floor", thicknessMm: 240 }],
    taggedSplit: [
      { floorRole: "base_structure", id: "a", materialId: "timber_joist_floor", thicknessMm: 120 },
      { floorRole: "base_structure", id: "b", materialId: "timber_joist_floor", thicknessMm: 120 }
    ],
    taggedLowerOnly: [
      { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "base_structure", id: "d", materialId: "timber_joist_floor", thicknessMm: 240 }
    ],
    taggedUpperOnly: [
      { floorRole: "floor_covering", id: "a", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", id: "b", materialId: "timber_joist_floor", thicknessMm: 240 }
    ]
  },
  {
    id: "engineered-timber-structural",
    rawSingle: [{ id: "a", materialId: "engineered_timber_structural", thicknessMm: 240 }],
    rawSplit: [
      { id: "a", materialId: "engineered_timber_structural", thicknessMm: 120 },
      { id: "b", materialId: "engineered_timber_structural", thicknessMm: 120 }
    ],
    rawLowerOnly: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "rockwool", thicknessMm: 90 },
      { id: "c", materialId: "furring_channel", thicknessMm: 28 },
      { id: "d", materialId: "engineered_timber_structural", thicknessMm: 240 }
    ],
    rawUpperOnly: [
      { id: "a", materialId: "laminate_flooring", thicknessMm: 8 },
      { id: "b", materialId: "engineered_timber_structural", thicknessMm: 240 }
    ],
    taggedSingle: [
      { floorRole: "base_structure", id: "a", materialId: "engineered_timber_structural", thicknessMm: 240 }
    ],
    taggedSplit: [
      { floorRole: "base_structure", id: "a", materialId: "engineered_timber_structural", thicknessMm: 120 },
      { floorRole: "base_structure", id: "b", materialId: "engineered_timber_structural", thicknessMm: 120 }
    ],
    taggedLowerOnly: [
      { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "base_structure", id: "d", materialId: "engineered_timber_structural", thicknessMm: 240 }
    ],
    taggedUpperOnly: [
      { floorRole: "floor_covering", id: "a", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", id: "b", materialId: "engineered_timber_structural", thicknessMm: 240 }
    ]
  }
] as const;

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
    supportedTargetOutputs: result.supportedTargetOutputs
  };
}

describe("raw floor weaker carrier route posture", () => {
  it("keeps weaker structural carriers fail-closed across raw and tagged route variants", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      for (const variant of testCase.variants) {
        const resultSnapshot = snapshot(`${testCase.id}-${variant.id}`, variant.rows);

        for (const output of FIELD_OUTPUTS) {
          if (resultSnapshot.outputCards[output] !== testCase.expectedStatuses[output]) {
            failures.push(
              `${testCase.id} ${variant.id}: expected ${output} card status ${testCase.expectedStatuses[output]}, got ${resultSnapshot.outputCards[output]}`
            );
          }
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps timber-style carriers explicitly gated by floor-role evidence on route surfaces", () => {
    const failures: string[] = [];

    for (const testCase of TIMBER_CASES) {
      const rawSingle = snapshot(`${testCase.id}-raw-single`, testCase.rawSingle);
      const rawSplit = snapshot(`${testCase.id}-raw-split`, testCase.rawSplit);
      const rawLowerOnly = snapshot(`${testCase.id}-raw-lower-only`, testCase.rawLowerOnly);
      const rawUpperOnly = snapshot(`${testCase.id}-raw-upper-only`, testCase.rawUpperOnly);
      const taggedSingle = snapshot(`${testCase.id}-tagged-single`, testCase.taggedSingle);
      const taggedSplit = snapshot(`${testCase.id}-tagged-split`, testCase.taggedSplit);
      const taggedLowerOnly = snapshot(`${testCase.id}-tagged-lower-only`, testCase.taggedLowerOnly);
      const taggedUpperOnly = snapshot(`${testCase.id}-tagged-upper-only`, testCase.taggedUpperOnly);

      if (JSON.stringify(rawSplit) !== JSON.stringify(rawSingle)) {
        failures.push(`${testCase.id}: raw split drifted from raw single fail-closed posture`);
      }

      if (
        rawSingle.outputCards.Rw !== "unsupported" ||
        rawSingle.outputCards["Ln,w"] !== "unsupported" ||
        rawSingle.outputCards["L'n,w"] !== "needs_input" ||
        rawSingle.outputCards["L'nT,w"] !== "needs_input"
      ) {
        failures.push(`${testCase.id}: raw posture no longer stays fail-closed on companion and impact outputs`);
      }

      if (
        rawLowerOnly.outputCards.Rw !== "unsupported" ||
        rawLowerOnly.outputCards["Ln,w"] !== "unsupported" ||
        rawLowerOnly.outputCards["L'n,w"] !== "needs_input" ||
        rawLowerOnly.outputCards["L'nT,w"] !== "needs_input"
      ) {
        failures.push(`${testCase.id}: raw lower-only posture no longer stays fail-closed on companion and impact outputs`);
      }

      if (
        rawUpperOnly.outputCards.Rw !== "unsupported" ||
        rawUpperOnly.outputCards["Ln,w"] !== "unsupported" ||
        rawUpperOnly.outputCards["L'n,w"] !== "needs_input" ||
        rawUpperOnly.outputCards["L'nT,w"] !== "needs_input"
      ) {
        failures.push(`${testCase.id}: raw upper-only posture no longer stays fail-closed on companion and impact outputs`);
      }

      if (taggedSingle.outputCards.Rw !== "live" || taggedSingle.outputCards["Ln,w"] !== "live") {
        failures.push(`${testCase.id}: tagged single no longer opens floor companion and impact outputs`);
      }

      if (JSON.stringify(taggedSplit) !== JSON.stringify(taggedSingle)) {
        failures.push(`${testCase.id}: tagged split drifted from tagged single live posture`);
      }

      if (taggedLowerOnly.outputCards.Rw !== "live" || taggedLowerOnly.outputCards["Ln,w"] !== "live") {
        failures.push(`${testCase.id}: tagged lower-only no longer opens floor companion and impact outputs`);
      }

      if (taggedUpperOnly.outputCards.Rw !== "live" || taggedUpperOnly.outputCards["Ln,w"] !== "live") {
        failures.push(`${testCase.id}: tagged upper-only no longer opens floor companion and impact outputs`);
      }
    }

    expect(failures).toEqual([]);
  });
});

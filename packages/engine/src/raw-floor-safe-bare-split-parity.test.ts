import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type BareCarrierCase = {
  compareTaggedVariants?: boolean;
  id: string;
  rawSingle: readonly LayerInput[];
  rawSplit: readonly LayerInput[];
  taggedSingle: readonly LayerInput[];
  taggedSplit: readonly LayerInput[];
};

type NegativeCarrierCase = {
  id: string;
  rawSingle: readonly LayerInput[];
  rawSplit: readonly LayerInput[];
  taggedSingle?: readonly LayerInput[];
  taggedSplit?: readonly LayerInput[];
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

const SAFE_BARE_CASES: readonly BareCarrierCase[] = [
  {
    compareTaggedVariants: false,
    id: "raw concrete bare carrier",
    rawSingle: [{ materialId: "concrete", thicknessMm: 150 }],
    rawSplit: [
      { materialId: "concrete", thicknessMm: 75 },
      { materialId: "concrete", thicknessMm: 75 }
    ],
    taggedSingle: [{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }],
    taggedSplit: [
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 75 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 75 }
    ]
  },
  {
    id: "raw hollow-core bare carrier",
    rawSingle: [{ materialId: "hollow_core_plank", thicknessMm: 200 }],
    rawSplit: [
      { materialId: "hollow_core_plank", thicknessMm: 100 },
      { materialId: "hollow_core_plank", thicknessMm: 100 }
    ],
    taggedSingle: [{ floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 200 }],
    taggedSplit: [
      { floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 100 },
      { floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 100 }
    ]
  },
  {
    id: "raw bare CLT carrier",
    rawSingle: [{ materialId: "clt_panel", thicknessMm: 140 }],
    rawSplit: [
      { materialId: "clt_panel", thicknessMm: 70 },
      { materialId: "clt_panel", thicknessMm: 70 }
    ],
    taggedSingle: [{ floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }],
    taggedSplit: [
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 70 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 70 }
    ]
  },
  {
    id: "raw bare composite deck carrier",
    rawSingle: [{ materialId: "composite_steel_deck", thicknessMm: 150 }],
    rawSplit: [
      { materialId: "composite_steel_deck", thicknessMm: 75 },
      { materialId: "composite_steel_deck", thicknessMm: 75 }
    ],
    taggedSingle: [{ floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }],
    taggedSplit: [
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 75 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 75 }
    ]
  },
  {
    id: "raw bare steel-deck composite carrier",
    rawSingle: [{ materialId: "steel_deck_composite", thicknessMm: 150 }],
    rawSplit: [
      { materialId: "steel_deck_composite", thicknessMm: 75 },
      { materialId: "steel_deck_composite", thicknessMm: 75 }
    ],
    taggedSingle: [{ floorRole: "base_structure", materialId: "steel_deck_composite", thicknessMm: 150 }],
    taggedSplit: [
      { floorRole: "base_structure", materialId: "steel_deck_composite", thicknessMm: 75 },
      { floorRole: "base_structure", materialId: "steel_deck_composite", thicknessMm: 75 }
    ]
  }
];

const NEGATIVE_CASES: readonly NegativeCarrierCase[] = [
  {
    id: "raw open-box timber carrier stays closed",
    rawSingle: [{ materialId: "open_box_timber_slab", thicknessMm: 370 }],
    rawSplit: [
      { materialId: "open_box_timber_slab", thicknessMm: 185 },
      { materialId: "open_box_timber_slab", thicknessMm: 185 }
    ],
    taggedSingle: [{ floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }],
    taggedSplit: [
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 }
    ]
  },
  {
    id: "wall-like heavy hybrid stays fail-closed",
    rawSingle: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "concrete", thicknessMm: 120 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    rawSplit: [
      { materialId: "gypsum_board", thicknessMm: 6.25 },
      { materialId: "gypsum_board", thicknessMm: 6.25 },
      { materialId: "concrete", thicknessMm: 60 },
      { materialId: "concrete", thicknessMm: 60 },
      { materialId: "gypsum_board", thicknessMm: 6.25 },
      { materialId: "gypsum_board", thicknessMm: 6.25 }
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

describe("raw floor safe bare split parity", () => {
  it("keeps safe bare structural carriers identical across raw and tagged contiguous split variants on the lab bundle", () => {
    const failures: string[] = [];

    for (const testCase of SAFE_BARE_CASES) {
      const baseline = snapshot(calculateLab(testCase.rawSingle));
      const candidates = [["raw split", calculateLab(testCase.rawSplit)]] as Array<
        readonly [string, ReturnType<typeof calculateAssembly>]
      >;

      if (testCase.compareTaggedVariants !== false) {
        candidates.push(
          ["tagged single", calculateLab(testCase.taggedSingle)],
          ["tagged split", calculateLab(testCase.taggedSplit)]
        );
      }

      for (const [label, result] of candidates) {
        if (JSON.stringify(snapshot(result)) !== JSON.stringify(baseline)) {
          failures.push(`${testCase.id} lab ${label} drifted from the defended single-layer snapshot`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps safe bare structural carriers identical across raw and tagged contiguous split variants on the field bundle", () => {
    const failures: string[] = [];

    for (const testCase of SAFE_BARE_CASES) {
      const baseline = snapshot(calculateField(testCase.rawSingle));
      const candidates = [["raw split", calculateField(testCase.rawSplit)]] as Array<
        readonly [string, ReturnType<typeof calculateAssembly>]
      >;

      if (testCase.compareTaggedVariants !== false) {
        candidates.push(
          ["tagged single", calculateField(testCase.taggedSingle)],
          ["tagged split", calculateField(testCase.taggedSplit)]
        );
      }

      for (const [label, result] of candidates) {
        if (JSON.stringify(snapshot(result)) !== JSON.stringify(baseline)) {
          failures.push(`${testCase.id} field ${label} drifted from the defended single-layer snapshot`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps unsupported raw carriers and wall-like heavy hybrids fail-closed on the lab bundle", () => {
    const failures: string[] = [];

    for (const testCase of NEGATIVE_CASES) {
      const baseline = snapshot(calculateLab(testCase.rawSingle));

      if (JSON.stringify(snapshot(calculateLab(testCase.rawSplit))) !== JSON.stringify(baseline)) {
        failures.push(`${testCase.id} lab raw split drifted from the defended single-layer snapshot`);
      }

      if (testCase.taggedSingle && JSON.stringify(snapshot(calculateLab(testCase.taggedSingle))) !== JSON.stringify(baseline)) {
        failures.push(`${testCase.id} lab tagged single drifted from the defended raw snapshot`);
      }

      if (testCase.taggedSplit && JSON.stringify(snapshot(calculateLab(testCase.taggedSplit))) !== JSON.stringify(baseline)) {
        failures.push(`${testCase.id} lab tagged split drifted from the defended raw snapshot`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps unsupported raw carriers and wall-like heavy hybrids fail-closed on the field bundle", () => {
    const failures: string[] = [];

    for (const testCase of NEGATIVE_CASES) {
      const baseline = snapshot(calculateField(testCase.rawSingle));

      if (!baseline.supportedTargetOutputs.includes("R'w")) {
        failures.push(`${testCase.id} field baseline unexpectedly lost apparent airborne support`);
      }

      if (baseline.supportedTargetOutputs.includes("Rw")) {
        failures.push(`${testCase.id} field baseline unexpectedly reopened companion Rw`);
      }

      if (JSON.stringify(snapshot(calculateField(testCase.rawSplit))) !== JSON.stringify(baseline)) {
        failures.push(`${testCase.id} field raw split drifted from the defended single-layer snapshot`);
      }

      if (testCase.taggedSingle && JSON.stringify(snapshot(calculateField(testCase.taggedSingle))) !== JSON.stringify(baseline)) {
        failures.push(`${testCase.id} field tagged single drifted from the defended raw snapshot`);
      }

      if (testCase.taggedSplit && JSON.stringify(snapshot(calculateField(testCase.taggedSplit))) !== JSON.stringify(baseline)) {
        failures.push(`${testCase.id} field tagged split drifted from the defended raw snapshot`);
      }
    }

    expect(failures).toEqual([]);
  });
});

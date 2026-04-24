import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type StressValues = {
  deltaLw: number | null;
  dnA: number | null;
  dnTA: number | null;
  dnTw: number | null;
  dnW: number | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  rw: number | null;
  rwDb: number | null;
  rwPrimeDb: number | null;
};

type StressSnapshot = {
  boundId: string | null;
  candidateIds: readonly string[] | null;
  estimateKind: string | null;
  impactBasis: string | null;
  layerCount: number;
  lowerBoundBasis: string | null;
  matchId: string | null;
  ratingsBasis: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
  values: StressValues;
};

type StressCase = {
  expected: StressSnapshot;
  id: string;
  layers: readonly LayerInput[];
  warningIncludes: readonly RegExp[];
};

const TARGET_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const BUILDING_IMPACT_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

function repeatLayers(count: number, layer: LayerInput): LayerInput[] {
  return Array.from({ length: count }, () => ({ ...layer }));
}

function snapshot(layers: readonly LayerInput[]): StressSnapshot {
  const result = calculateAssembly(layers, {
    airborneContext: BUILDING_CONTEXT,
    impactFieldContext: BUILDING_IMPACT_CONTEXT,
    targetOutputs: TARGET_OUTPUTS
  });

  return {
    boundId: result.boundFloorSystemMatch?.system.id ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? result.floorSystemEstimate?.candidateIds ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    impactBasis: result.impact?.basis ?? null,
    layerCount: layers.length,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    ratingsBasis: result.floorSystemRatings?.basis ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    values: {
      deltaLw: result.impact?.DeltaLw ?? result.lowerBoundImpact?.DeltaLwLowerBound ?? null,
      dnA: result.metrics.estimatedDnADb ?? null,
      dnTA: result.metrics.estimatedDnTADb ?? null,
      dnTw: result.metrics.estimatedDnTwDb ?? null,
      dnW: result.metrics.estimatedDnWDb ?? null,
      lPrimeNT50: result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound ?? null,
      lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
      lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
      lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
      lnWPlusCI: result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
      rw: result.floorSystemRatings?.Rw ?? null,
      rwDb: result.metrics.estimatedRwDb ?? null,
      rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null
    }
  };
}

function makeUbiqExactSplitLayers(): LayerInput[] {
  return [
    ...repeatLayers(12, { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 4 }),
    ...repeatLayers(10, { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 14.5 }),
    ...repeatLayers(10, {
      floorRole: "ceiling_cavity",
      materialId: "ubiq_resilient_ceiling",
      thicknessMm: 6.5
    }),
    ...repeatLayers(8, {
      floorRole: "floor_covering",
      materialId: "engineered_timber_with_acoustic_underlay",
      thicknessMm: 2.5
    }),
    ...repeatLayers(8, { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 2.375 }),
    ...repeatLayers(5, { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 40 })
  ];
}

function makeDataholzExactSplitLayers(): LayerInput[] {
  return [
    ...repeatLayers(10, {
      floorRole: "floor_covering",
      materialId: "dry_floating_gypsum_fiberboard",
      thicknessMm: 2.5
    }),
    ...repeatLayers(12, { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 5 }),
    ...repeatLayers(10, { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 3 }),
    ...repeatLayers(20, { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 7 })
  ];
}

function makeRawTerminalConcreteHelperLayers(): LayerInput[] {
  return [
    ...repeatLayers(20, { materialId: "gypsum_board", thicknessMm: 1.25 }),
    ...repeatLayers(20, { materialId: "rockwool", thicknessMm: 4.5 }),
    ...repeatLayers(12, { materialId: "furring_channel", thicknessMm: 3 }),
    { materialId: "concrete", thicknessMm: 160 }
  ];
}

function makeRawOpenWebImpactBlockedLayers(): LayerInput[] {
  return [
    ...repeatLayers(20, { materialId: "gypsum_board", thicknessMm: 1.3 }),
    ...repeatLayers(20, { materialId: "rockwool", thicknessMm: 5 }),
    ...repeatLayers(12, { materialId: "furring_channel", thicknessMm: 3.333 }),
    { materialId: "open_web_steel_floor", thicknessMm: 300 }
  ];
}

function makeReinforcedConcreteSplitLayers(): LayerInput[] {
  return [
    ...repeatLayers(12, { floorRole: "base_structure", materialId: "concrete", thicknessMm: 15 }),
    ...repeatLayers(8, { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 1 }),
    ...repeatLayers(6, { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 0.5 }),
    ...repeatLayers(12, { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 10 }),
    ...repeatLayers(10, { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 10 }),
    ...repeatLayers(4, { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 })
  ];
}

const CASES: readonly StressCase[] = [
  {
    id: "53-layer UBIQ split exact stack",
    layers: makeUbiqExactSplitLayers(),
    expected: {
      boundId: null,
      candidateIds: null,
      estimateKind: null,
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      layerCount: 53,
      lowerBoundBasis: null,
      matchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      ratingsBasis: "official_floor_system_exact_match",
      supported: [
        "Rw",
        "R'w",
        "Dn,w",
        "Dn,A",
        "DnT,w",
        "DnT,A",
        "Ln,w",
        "Ln,w+CI",
        "L'n,w",
        "L'nT,w",
        "L'nT,50",
        "Ctr"
      ],
      unsupported: ["DeltaLw"],
      values: {
        deltaLw: null,
        dnA: 66,
        dnTA: 68.5,
        dnTw: 70,
        dnW: 67,
        lPrimeNT50: 52,
        lPrimeNTw: 52.2,
        lPrimeNW: 55,
        lnW: 52,
        lnWPlusCI: 51,
        rw: 63,
        rwDb: 68.7,
        rwPrimeDb: 68
      }
    },
    warningIncludes: [/curated exact floor-system match active/i, /some requested impact sound outputs/i]
  },
  {
    id: "52-layer Dataholz CLT dry split exact stack",
    layers: makeDataholzExactSplitLayers(),
    expected: {
      boundId: null,
      candidateIds: null,
      estimateKind: null,
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      layerCount: 52,
      lowerBoundBasis: null,
      matchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
      ratingsBasis: "official_floor_system_exact_match",
      supported: [
        "Rw",
        "R'w",
        "Dn,w",
        "Dn,A",
        "DnT,w",
        "DnT,A",
        "Ln,w",
        "Ln,w+CI",
        "L'n,w",
        "L'nT,w",
        "L'nT,50"
      ],
      unsupported: ["DeltaLw", "Ctr"],
      values: {
        deltaLw: null,
        dnA: 43.7,
        dnTA: 46.2,
        dnTw: 47,
        dnW: 45,
        lPrimeNT50: 50,
        lPrimeNTw: 50.2,
        lPrimeNW: 53,
        lnW: 50,
        lnWPlusCI: 49,
        rw: 62,
        rwDb: 45.5,
        rwPrimeDb: 46
      }
    },
    warningIncludes: [/curated exact floor-system match active/i, /unsupported target outputs: Ctr/i]
  },
  {
    id: "53-layer raw terminal concrete helper stack",
    layers: makeRawTerminalConcreteHelperLayers(),
    expected: {
      boundId: null,
      candidateIds: null,
      estimateKind: null,
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      layerCount: 53,
      lowerBoundBasis: null,
      matchId: null,
      ratingsBasis: "screening_mass_law_curve_seed_v3",
      supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
      unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"],
      values: {
        deltaLw: null,
        dnA: 55.3,
        dnTA: 57.8,
        dnTw: 59,
        dnW: 56,
        lPrimeNT50: null,
        lPrimeNTw: 72.9,
        lPrimeNW: 75.7,
        lnW: 72.7,
        lnWPlusCI: null,
        rw: 57,
        rwDb: 57.1,
        rwPrimeDb: 57
      }
    },
    warningIncludes: [/no curated exact floor-system landed/i, /live field-side supplement is active/i]
  },
  {
    id: "53-layer raw open-web impact-blocked stack",
    layers: makeRawOpenWebImpactBlockedLayers(),
    expected: {
      boundId: null,
      candidateIds: null,
      estimateKind: null,
      impactBasis: null,
      layerCount: 53,
      lowerBoundBasis: null,
      matchId: null,
      ratingsBasis: "screening_mass_law_curve_seed_v3",
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ctr"],
      unsupported: ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
      values: {
        deltaLw: null,
        dnA: 69.2,
        dnTA: 71.7,
        dnTw: 73,
        dnW: 70,
        lPrimeNT50: null,
        lPrimeNTw: null,
        lPrimeNW: null,
        lnW: null,
        lnWPlusCI: null,
        rw: 71,
        rwDb: 71.7,
        rwPrimeDb: 71
      }
    },
    warningIncludes: [/impact sound outputs are not available/i, /unsupported target outputs: Rw/i]
  },
  {
    id: "52-layer reinforced-concrete low-confidence formula stack",
    layers: makeReinforcedConcreteSplitLayers(),
    expected: {
      boundId: null,
      candidateIds: null,
      estimateKind: null,
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      layerCount: 52,
      lowerBoundBasis: null,
      matchId: null,
      ratingsBasis: "screening_mass_law_curve_seed_v3",
      supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
      unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"],
      values: {
        deltaLw: null,
        dnA: 55.7,
        dnTA: 58.2,
        dnTw: 59,
        dnW: 57,
        lPrimeNT50: null,
        lPrimeNTw: 72,
        lPrimeNW: 74.8,
        lnW: 71.8,
        lnWPlusCI: null,
        rw: 58,
        rwDb: 58.3,
        rwPrimeDb: 58
      }
    },
    warningIncludes: [/no curated exact floor-system landed/i, /live field-side supplement is active/i]
  }
];

describe("floor many-layer stress Gate A matrix", () => {
  it("pins 50+ layer floor stacks to finite defended answers or explicit fail-closed support", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const result = calculateAssembly(testCase.layers, {
        airborneContext: BUILDING_CONTEXT,
        impactFieldContext: BUILDING_IMPACT_CONTEXT,
        targetOutputs: TARGET_OUTPUTS
      });
      const actual = snapshot(testCase.layers);

      if (actual.layerCount < 50) {
        failures.push(`${testCase.id}: expected a 50+ layer stress stack, got ${actual.layerCount}`);
      }

      if (JSON.stringify(actual) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }

      for (const [key, value] of Object.entries(actual.values)) {
        if (value !== null && !Number.isFinite(value)) {
          failures.push(`${testCase.id}: ${key} was not finite (${String(value)})`);
        }
      }

      for (const pattern of testCase.warningIncludes) {
        if (!result.warnings.some((warning: string) => pattern.test(warning))) {
          failures.push(`${testCase.id}: missing warning ${pattern}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type OrderEditValues = {
  ctr: number | null;
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

type OrderEditSnapshot = {
  boundId: string | null;
  candidateIds: readonly string[] | null;
  estimateKind: string | null;
  impactBasis: string | null;
  lowerBoundBasis: string | null;
  matchId: string | null;
  ratingsBasis: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
  values: OrderEditValues;
};

type OrderEditCase = {
  expected: OrderEditSnapshot;
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

function moveLastToFirst<T>(items: readonly T[]): T[] {
  return [items[items.length - 1]!, ...items.slice(0, -1)];
}

function rotateLeft<T>(items: readonly T[]): T[] {
  return [...items.slice(1), items[0]!];
}

function roundOne(value: number | undefined): number | null {
  if (typeof value !== "number") {
    return null;
  }
  return Math.round(value * 10) / 10;
}

function supportedCtrValue(result: ReturnType<typeof calculateAssembly>): number | null {
  if (!result.supportedTargetOutputs.includes("Ctr")) {
    return null;
  }

  if (typeof result.floorSystemRatings?.RwCtr === "number" && typeof result.floorSystemRatings.Rw === "number") {
    return roundOne(result.floorSystemRatings.RwCtr - result.floorSystemRatings.Rw);
  }

  return roundOne(result.metrics.estimatedCtrDb);
}

function snapshot(layers: readonly LayerInput[]): OrderEditSnapshot {
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
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    ratingsBasis: result.floorSystemRatings?.basis ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    values: {
      ctr: supportedCtrValue(result),
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

function makeUbiqExactLayers(): LayerInput[] {
  return [
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
    { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
    { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
    { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
    { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
    { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 }
  ];
}

function makeDataholzExactLayers(): LayerInput[] {
  return [
    { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
    { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 },
    { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 30 },
    { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
  ];
}

function makeRawTerminalConcreteHelperLayers(): LayerInput[] {
  return [
    { materialId: "gypsum_board", thicknessMm: 13 },
    { materialId: "rockwool", thicknessMm: 90 },
    { materialId: "furring_channel", thicknessMm: 28 },
    { materialId: "concrete", thicknessMm: 150 }
  ];
}

function makeRawOpenWebImpactBlockedLayers(): LayerInput[] {
  return [
    { materialId: "gypsum_board", thicknessMm: 13 },
    { materialId: "rockwool", thicknessMm: 90 },
    { materialId: "furring_channel", thicknessMm: 28 },
    { materialId: "open_web_steel_floor", thicknessMm: 300 }
  ];
}

const UBIQ_EXACT_EXPECTED: OrderEditSnapshot = {
  boundId: null,
  candidateIds: null,
  estimateKind: null,
  impactBasis: "mixed_exact_plus_estimated_local_guide",
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
    ctr: -6,
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
};

const DATAHOLZ_EXACT_EXPECTED: OrderEditSnapshot = {
  boundId: null,
  candidateIds: null,
  estimateKind: null,
  impactBasis: "mixed_exact_plus_estimated_local_guide",
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
    ctr: null,
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
};

const RAW_CONCRETE_BASELINE_EXPECTED: OrderEditSnapshot = {
  boundId: null,
  candidateIds: null,
  estimateKind: null,
  impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
  lowerBoundBasis: null,
  matchId: null,
  ratingsBasis: "screening_mass_law_curve_seed_v3",
  supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
  unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"],
  values: {
    ctr: -5.9,
    deltaLw: null,
    dnA: 52.8,
    dnTA: 55.3,
    dnTw: 56,
    dnW: 54,
    lPrimeNT50: null,
    lPrimeNTw: 74.3,
    lPrimeNW: 77.1,
    lnW: 74.1,
    lnWPlusCI: null,
    rw: 55,
    rwDb: 55.4,
    rwPrimeDb: 55
  }
};

const RAW_CONCRETE_BASE_FIRST_EXPECTED: OrderEditSnapshot = {
  ...RAW_CONCRETE_BASELINE_EXPECTED,
  supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
  unsupported: ["Rw", "Ln,w+CI", "DeltaLw", "L'nT,50"],
  values: {
    ...RAW_CONCRETE_BASELINE_EXPECTED.values,
    lPrimeNTw: 74.7,
    lPrimeNW: 77.5,
    lnW: 74.5
  }
};

const RAW_OPEN_WEB_BLOCKED_EXPECTED: OrderEditSnapshot = {
  boundId: null,
  candidateIds: null,
  estimateKind: null,
  impactBasis: null,
  lowerBoundBasis: null,
  matchId: null,
  ratingsBasis: "screening_mass_law_curve_seed_v3",
  supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ctr"],
  unsupported: ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
  values: {
    ctr: -5.7,
    deltaLw: null,
    dnA: 69,
    dnTA: 71.5,
    dnTw: 73,
    dnW: 70,
    lPrimeNT50: null,
    lPrimeNTw: null,
    lPrimeNW: null,
    lnW: null,
    lnWPlusCI: null,
    rw: 71,
    rwDb: 71.6,
    rwPrimeDb: 71
  }
};

const UBIQ_EXACT_LAYERS = makeUbiqExactLayers();
const DATAHOLZ_EXACT_LAYERS = makeDataholzExactLayers();
const RAW_CONCRETE_LAYERS = makeRawTerminalConcreteHelperLayers();
const RAW_OPEN_WEB_LAYERS = makeRawOpenWebImpactBlockedLayers();

const CASES: readonly OrderEditCase[] = [
  {
    id: "UBIQ exact baseline",
    layers: UBIQ_EXACT_LAYERS,
    expected: UBIQ_EXACT_EXPECTED,
    warningIncludes: [/curated exact floor-system match active/i]
  },
  {
    id: "UBIQ exact reversed order",
    layers: [...UBIQ_EXACT_LAYERS].reverse(),
    expected: UBIQ_EXACT_EXPECTED,
    warningIncludes: [/curated exact floor-system match active/i]
  },
  {
    id: "UBIQ exact base structure moved first",
    layers: moveLastToFirst(UBIQ_EXACT_LAYERS),
    expected: UBIQ_EXACT_EXPECTED,
    warningIncludes: [/curated exact floor-system match active/i]
  },
  {
    id: "Dataholz CLT exact baseline",
    layers: DATAHOLZ_EXACT_LAYERS,
    expected: DATAHOLZ_EXACT_EXPECTED,
    warningIncludes: [/curated exact floor-system match active/i, /unsupported target outputs: Ctr/i]
  },
  {
    id: "Dataholz CLT exact reversed order",
    layers: [...DATAHOLZ_EXACT_LAYERS].reverse(),
    expected: DATAHOLZ_EXACT_EXPECTED,
    warningIncludes: [/curated exact floor-system match active/i, /unsupported target outputs: Ctr/i]
  },
  {
    id: "Dataholz CLT exact rotated order",
    layers: rotateLeft(DATAHOLZ_EXACT_LAYERS),
    expected: DATAHOLZ_EXACT_EXPECTED,
    warningIncludes: [/curated exact floor-system match active/i, /unsupported target outputs: Ctr/i]
  },
  {
    id: "raw terminal concrete helper baseline",
    layers: RAW_CONCRETE_LAYERS,
    expected: RAW_CONCRETE_BASELINE_EXPECTED,
    warningIncludes: [/no curated exact floor-system landed/i, /live field-side supplement is active/i]
  },
  {
    id: "raw terminal concrete helper base moved first",
    layers: moveLastToFirst(RAW_CONCRETE_LAYERS),
    expected: RAW_CONCRETE_BASE_FIRST_EXPECTED,
    warningIncludes: [/unsupported target outputs: Rw/i, /live field-side supplement is active/i]
  },
  {
    id: "raw terminal concrete helper reversed order",
    layers: [...RAW_CONCRETE_LAYERS].reverse(),
    expected: RAW_CONCRETE_BASE_FIRST_EXPECTED,
    warningIncludes: [/unsupported target outputs: Rw/i, /live field-side supplement is active/i]
  },
  {
    id: "raw open-web impact-blocked baseline",
    layers: RAW_OPEN_WEB_LAYERS,
    expected: RAW_OPEN_WEB_BLOCKED_EXPECTED,
    warningIncludes: [/impact sound outputs are not available/i, /unsupported target outputs: Rw/i]
  },
  {
    id: "raw open-web impact-blocked base moved first",
    layers: moveLastToFirst(RAW_OPEN_WEB_LAYERS),
    expected: RAW_OPEN_WEB_BLOCKED_EXPECTED,
    warningIncludes: [/impact sound outputs are not available/i, /unsupported target outputs: Rw/i]
  },
  {
    id: "raw open-web impact-blocked reversed order",
    layers: [...RAW_OPEN_WEB_LAYERS].reverse(),
    expected: RAW_OPEN_WEB_BLOCKED_EXPECTED,
    warningIncludes: [/impact sound outputs are not available/i, /unsupported target outputs: Rw/i]
  }
];

describe("floor layer-order edit stability Gate A matrix", () => {
  it("pins explicit-role exact stability separately from raw order-sensitive fail-closed posture", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const result = calculateAssembly(testCase.layers, {
        airborneContext: BUILDING_CONTEXT,
        impactFieldContext: BUILDING_IMPACT_CONTEXT,
        targetOutputs: TARGET_OUTPUTS
      });
      const actual = snapshot(testCase.layers);

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

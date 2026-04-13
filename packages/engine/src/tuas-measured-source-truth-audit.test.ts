import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildFloorTestLayersFromCriteria,
  FLOOR_TEST_MERGE_SAFE_PACKED_ROLES
} from "./floor-system-test-layer-builders";

const TARGET_OUTPUTS = [
  "Rw",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const TUAS_COMPANION_TARGET_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
} as const;

type ExpectedTuasMeasuredRow = {
  ci: number;
  ci50: number;
  id: string;
  lnW: number;
  lnWPlusCI: number;
  manualMatch?: false;
  predictorFitPercent?: number;
  rw: number;
  rwPlusC: number;
};

const TUAS_MEASURED_ROWS: readonly ExpectedTuasMeasuredRow[] = [
  { id: "tuas_x2_clt140_measured_2026", ci: 2, ci50: 3, lnW: 61, lnWPlusCI: 63, rw: 38, rwPlusC: 37.242344245020725 },
  { id: "tuas_x3_clt140_measured_2026", ci: 0, ci50: 8, lnW: 52, lnWPlusCI: 52, rw: 49, rwPlusC: 47.10786221887914 },
  { id: "tuas_x4_clt140_measured_2026", ci: 1, ci50: 8, lnW: 50, lnWPlusCI: 51, rw: 55, rwPlusC: 53.20807486278851 },
  {
    id: "tuas_x5_clt140_measured_2026",
    ci: 0,
    ci50: 0,
    lnW: 65,
    lnWPlusCI: 65,
    manualMatch: false,
    predictorFitPercent: 94,
    rw: 55,
    rwPlusC: 53.24148704194138
  },
  { id: "tuas_c2_clt260_measured_2026", ci: 3, ci50: 4, lnW: 55, lnWPlusCI: 58, rw: 42, rwPlusC: 41.478540491108376 },
  { id: "tuas_c3_clt260_measured_2026", ci: 2, ci50: 6, lnW: 47, lnWPlusCI: 49, rw: 54, rwPlusC: 51.413639069637696 },
  { id: "tuas_c4_clt260_measured_2026", ci: 1, ci50: 6, lnW: 45, lnWPlusCI: 46, rw: 61, rwPlusC: 58.831296422168144 },
  { id: "tuas_c5_clt260_measured_2026", ci: 2, ci50: 3, lnW: 60, lnWPlusCI: 62, rw: 61, rwPlusC: 59.492301808652826 },
  { id: "tuas_c7_clt260_measured_2026", ci: 1, ci50: 3, lnW: 39, lnWPlusCI: 40, rw: 57, rwPlusC: 52.458421802887344 },
  { id: "tuas_c7c_clt260_measured_2026", ci: 5, ci50: 14, lnW: 30, lnWPlusCI: 35, rw: 75, rwPlusC: 70.92499901751341 },
  { id: "tuas_c2c_clt260_measured_2026", ci: 4, ci50: 9, lnW: 35, lnWPlusCI: 39, rw: 70, rwPlusC: 67.41490151958673 },
  { id: "tuas_c3c_clt260_measured_2026", ci: 2, ci50: 16, lnW: 27, lnWPlusCI: 29, rw: 73, rwPlusC: 67.7537144078056 },
  { id: "tuas_c4c_clt260_measured_2026", ci: 2, ci50: 16, lnW: 24, lnWPlusCI: 26, rw: 74, rwPlusC: 69.69668895954507 },
  {
    id: "tuas_c5c_clt260_measured_2026",
    ci: 4,
    ci50: 6,
    lnW: 38,
    lnWPlusCI: 42,
    manualMatch: false,
    predictorFitPercent: 92.8,
    rw: 75,
    rwPlusC: 70.46337519002095
  },
  { id: "tuas_r2a_open_box_timber_measured_2026", ci: 2, ci50: 4, lnW: 61, lnWPlusCI: 63, rw: 49, rwPlusC: 44.52764215440286 },
  { id: "tuas_r2b_open_box_timber_measured_2026", ci: 1, ci50: 3, lnW: 46, lnWPlusCI: 47, rw: 62, rwPlusC: 59.973347663855776 },
  { id: "tuas_r3a_open_box_timber_measured_2026", ci: 2, ci50: 3, lnW: 56, lnWPlusCI: 58, rw: 56, rwPlusC: 51.30566236283586 },
  { id: "tuas_r3b_open_box_timber_measured_2026", ci: 2, ci50: 5, lnW: 39, lnWPlusCI: 41, rw: 70, rwPlusC: 67.58499572159022 },
  { id: "tuas_r5a_open_box_timber_measured_2026", ci: 1, ci50: 2, lnW: 64, lnWPlusCI: 65, rw: 63, rwPlusC: 57.78202920484737 },
  { id: "tuas_r5b_open_box_timber_measured_2026", ci: 0, ci50: 3, lnW: 44, lnWPlusCI: 44, rw: 75, rwPlusC: 71.87531170772152 },
  { id: "tuas_r6a_open_box_timber_measured_2026", ci: 1, ci50: 3, lnW: 60, lnWPlusCI: 61, rw: 56, rwPlusC: 53.59725745128915 },
  { id: "tuas_r6b_open_box_timber_measured_2026", ci: 0, ci50: 1, lnW: 47, lnWPlusCI: 47, rw: 71, rwPlusC: 69.5361374042257 },
  { id: "tuas_r7a_open_box_timber_measured_2026", ci: 1, ci50: 3, lnW: 63, lnWPlusCI: 64, rw: 60, rwPlusC: 57 },
  { id: "tuas_r7b_open_box_timber_measured_2026", ci: 0, ci50: 1, lnW: 47, lnWPlusCI: 47, rw: 72, rwPlusC: 70.726430817278 },
  { id: "tuas_r8b_open_box_timber_measured_2026", ci: -1, ci50: 0, lnW: 50, lnWPlusCI: 49, rw: 72, rwPlusC: 70.60101885694094 },
  { id: "tuas_r9b_open_box_timber_measured_2026", ci: 1, ci50: 3, lnW: 45, lnWPlusCI: 46, rw: 68, rwPlusC: 67.01756572323127 },
  { id: "tuas_r2c_open_box_timber_measured_2026", ci: 0, ci50: 0, lnW: 70, lnWPlusCI: 70, rw: 54, rwPlusC: 53.34048310542768 },
  { id: "tuas_r10a_open_box_timber_measured_2026", ci: 0, ci50: 1, lnW: 55, lnWPlusCI: 55, rw: 56, rwPlusC: 50.89680103538985 },
  { id: "tuas_r11b_open_box_timber_measured_2026", ci: 0, ci50: 0, lnW: 60, lnWPlusCI: 60, rw: 74, rwPlusC: 71.15477026441121 }
];

type ExpectedRawRoute = {
  candidateIds?: readonly string[];
  estimateKind: "family_archetype" | "family_general" | null;
  fitPercent?: number;
  id: string;
  lnW: number | null;
  lnWPlusCI: number | null;
  matchId: string | null;
  rw: number;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

const RAW_DRIFT_EXPECTATIONS: readonly ExpectedRawRoute[] = [
  {
    id: "tuas_x3_clt140_measured_2026",
    estimateKind: null,
    lnW: null,
    lnWPlusCI: null,
    matchId: null,
    rw: 41,
    supported: ["Rw"],
    unsupported: ["Ln,w", "Ln,w+CI"]
  },
  {
    id: "tuas_x4_clt140_measured_2026",
    estimateKind: null,
    lnW: null,
    lnWPlusCI: null,
    matchId: null,
    rw: 41,
    supported: ["Rw"],
    unsupported: ["Ln,w", "Ln,w+CI"]
  },
  {
    id: "tuas_r7b_open_box_timber_measured_2026",
    candidateIds: [
      "tuas_r9b_open_box_timber_measured_2026",
      "tuas_r7b_open_box_timber_measured_2026",
      "tuas_r7a_open_box_timber_measured_2026"
    ],
    estimateKind: "family_general",
    fitPercent: 54,
    lnW: 49.7,
    lnWPlusCI: 50.5,
    matchId: null,
    rw: 67.1,
    supported: ["Rw", "Ln,w", "Ln,w+CI"],
    unsupported: []
  },
  {
    id: "tuas_r8b_open_box_timber_measured_2026",
    candidateIds: [
      "tuas_r8b_open_box_timber_measured_2026",
      "tuas_r9b_open_box_timber_measured_2026",
      "tuas_r7b_open_box_timber_measured_2026"
    ],
    estimateKind: "family_general",
    fitPercent: 54,
    lnW: 47.8,
    lnWPlusCI: 47.6,
    matchId: null,
    rw: 70.7,
    supported: ["Rw", "Ln,w", "Ln,w+CI"],
    unsupported: []
  },
  {
    id: "tuas_r10a_open_box_timber_measured_2026",
    candidateIds: [
      "tuas_r2a_open_box_timber_measured_2026",
      "tuas_r6b_open_box_timber_measured_2026",
      "tuas_r7a_open_box_timber_measured_2026"
    ],
    estimateKind: "family_general",
    fitPercent: 54,
    lnW: 55.8,
    lnWPlusCI: 56.8,
    matchId: null,
    rw: 60,
    supported: ["Rw", "Ln,w", "Ln,w+CI"],
    unsupported: []
  },
  {
    id: "tuas_c3_clt260_measured_2026",
    estimateKind: null,
    lnW: null,
    lnWPlusCI: null,
    matchId: null,
    rw: 45,
    supported: ["Rw"],
    unsupported: ["Ln,w", "Ln,w+CI"]
  },
  {
    id: "tuas_c4_clt260_measured_2026",
    estimateKind: null,
    lnW: null,
    lnWPlusCI: null,
    matchId: null,
    rw: 42,
    supported: ["Rw"],
    unsupported: ["Ln,w", "Ln,w+CI"]
  },
  {
    id: "tuas_c5_clt260_measured_2026",
    estimateKind: null,
    lnW: null,
    lnWPlusCI: null,
    matchId: null,
    rw: 46,
    supported: ["Rw"],
    unsupported: ["Ln,w", "Ln,w+CI"]
  },
  {
    id: "tuas_c7_clt260_measured_2026",
    candidateIds: [
      "tuas_c7_clt260_measured_2026",
      "tuas_c2_clt260_measured_2026",
      "tuas_c3_clt260_measured_2026"
    ],
    estimateKind: "family_general",
    fitPercent: 54,
    lnW: 48.2,
    lnWPlusCI: 50.3,
    matchId: null,
    rw: 49.2,
    supported: ["Rw", "Ln,w", "Ln,w+CI"],
    unsupported: []
  },
  {
    id: "tuas_c7c_clt260_measured_2026",
    estimateKind: null,
    lnW: null,
    lnWPlusCI: null,
    matchId: null,
    rw: 49,
    supported: ["Rw"],
    unsupported: ["Ln,w", "Ln,w+CI"]
  },
  {
    id: "tuas_c3c_clt260_measured_2026",
    candidateIds: [
      "tuas_c2c_clt260_measured_2026",
      "tuas_c3c_clt260_measured_2026",
      "tuas_c4c_clt260_measured_2026"
    ],
    estimateKind: "family_archetype",
    fitPercent: 78.7,
    lnW: 33.2,
    lnWPlusCI: 36.9,
    matchId: null,
    rw: 70.6,
    supported: ["Rw", "Ln,w", "Ln,w+CI"],
    unsupported: []
  },
  {
    id: "tuas_c4c_clt260_measured_2026",
    candidateIds: [
      "tuas_c2c_clt260_measured_2026",
      "tuas_c3c_clt260_measured_2026",
      "tuas_c4c_clt260_measured_2026"
    ],
    estimateKind: "family_general",
    fitPercent: 54,
    lnW: 31.9,
    lnWPlusCI: 35.2,
    matchId: null,
    rw: 71.2,
    supported: ["Rw", "Ln,w", "Ln,w+CI"],
    unsupported: []
  }
];

const RAW_OPEN_BOX_CARRIER_ATTEMPTS: readonly {
  id: string;
  layers: readonly LayerInput[];
  rw: number;
}[] = [
  {
    id: "bare-open-box",
    layers: [{ materialId: "open_box_timber_slab", thicknessMm: 370 }],
    rw: 42
  },
  {
    id: "upper-only-open-box",
    layers: [
      { materialId: "laminate_flooring", thicknessMm: 8 },
      { materialId: "eps_underlay", thicknessMm: 3 },
      { materialId: "eps_floor_insulation_board", thicknessMm: 35 },
      { materialId: "screed", thicknessMm: 40 },
      { materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    rw: 50
  },
  {
    id: "lower-only-open-box",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    rw: 43
  }
];

function getFloorSystem(id: string) {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  expect(system, id).toBeDefined();
  return system as NonNullable<typeof system>;
}

function sortedValues<T extends string>(input: readonly T[]) {
  return [...input].sort();
}

function expectNullableNumber(actual: number | null | undefined, expected: number | null, label: string) {
  if (expected === null) {
    expect(actual ?? null, label).toBeNull();
    return;
  }

  expect(actual, label).toBeCloseTo(expected, 10);
}

function splitContiguousMergeSafeLayers(layers: readonly LayerInput[]): LayerInput[] {
  return layers.flatMap((layer) => {
    if (!layer.floorRole || !FLOOR_TEST_MERGE_SAFE_PACKED_ROLES.has(layer.floorRole)) {
      return [layer];
    }

    const thicknessMm = Number(layer.thicknessMm);
    if (!Number.isFinite(thicknessMm)) {
      throw new Error(`Cannot split non-numeric TUAS test layer thickness: ${String(layer.thicknessMm)}`);
    }

    return [
      { ...layer, thicknessMm: thicknessMm / 2 },
      { ...layer, thicknessMm: thicknessMm / 2 }
    ];
  });
}

function splitUpperFillAcrossFirstFloatingScreed(layers: readonly LayerInput[]): LayerInput[] {
  const upperFillIndex = layers.findIndex((layer) => layer.floorRole === "upper_fill");

  if (upperFillIndex < 0) {
    throw new Error("Expected a TUAS source stack with upper_fill.");
  }

  const upperFill = layers[upperFillIndex]!;
  const thicknessMm = Number(upperFill.thicknessMm);
  const withoutUpperFill = layers.filter((_, index) => index !== upperFillIndex);
  const firstFloatingIndex = withoutUpperFill.findIndex((layer) => layer.floorRole === "floating_screed");

  if (firstFloatingIndex < 0 || !Number.isFinite(thicknessMm)) {
    throw new Error("Expected a numeric TUAS upper_fill and a following floating_screed.");
  }

  const firstHalf = { ...upperFill, thicknessMm: thicknessMm / 2 };
  const secondHalf = { ...upperFill, thicknessMm: thicknessMm / 2 };

  return [
    ...withoutUpperFill.slice(0, firstFloatingIndex),
    firstHalf,
    withoutUpperFill[firstFloatingIndex]!,
    secondHalf,
    ...withoutUpperFill.slice(firstFloatingIndex + 1)
  ];
}

function routeSnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, {
    impactFieldContext: FIELD_CONTEXT,
    targetOutputs: TARGET_OUTPUTS
  });

  return {
    ci: result.impact?.CI ?? null,
    ci50: result.impact?.CI50_2500 ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    warnings: result.warnings
  };
}

describe("TUAS measured source-truth audit", () => {
  it("pins the imported TUAS measured open-box and CLT corpus to explicit spreadsheet truth", () => {
    const actualIds = EXACT_FLOOR_SYSTEMS.filter(
      (entry) => entry.id.startsWith("tuas_") && (entry.id.includes("_open_box_timber_") || entry.id.includes("_clt140_") || entry.id.includes("_clt260_"))
    ).map((entry) => entry.id);

    expect(sortedValues(actualIds)).toEqual(sortedValues(TUAS_MEASURED_ROWS.map((entry) => entry.id)));

    for (const expected of TUAS_MEASURED_ROWS) {
      const system = getFloorSystem(expected.id);

      expect(system.manualMatch, `${expected.id} manualMatch`).toBe(expected.manualMatch);
      expect(system.airborneRatings.Rw, `${expected.id} catalog Rw`).toBe(expected.rw);
      expect(system.airborneRatings.RwCtr, `${expected.id} catalog Rw+C companion`).toBeCloseTo(expected.rwPlusC, 10);
      expect(system.airborneRatings.RwCtrSemantic, `${expected.id} companion semantic`).toBe("rw_plus_c");
      expect(system.impactRatings.LnW, `${expected.id} catalog Ln,w`).toBe(expected.lnW);
      expect(system.impactRatings.CI, `${expected.id} catalog CI`).toBe(expected.ci);
      expect(system.impactRatings.CI50_2500, `${expected.id} catalog CI,50-2500`).toBe(expected.ci50);
      expect(system.impactRatings.LnWPlusCI, `${expected.id} catalog Ln,w+CI`).toBe(expected.lnWPlusCI);
    }
  });

  it("measures official-id field continuations for every imported TUAS measured source row", () => {
    for (const expected of TUAS_MEASURED_ROWS) {
      const result = calculateImpactOnly([], {
        officialFloorSystemId: expected.id,
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: TUAS_COMPANION_TARGET_OUTPUTS
      });

      expect(result.sourceMode, `${expected.id} source mode`).toBe("official_floor_system");
      expect(result.floorSystemMatch?.system.id, `${expected.id} floor-system match`).toBe(expected.id);
      expect(result.impact?.basis, `${expected.id} impact basis`).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
      expect(result.floorSystemRatings?.basis, `${expected.id} floor ratings basis`).toBe("open_measured_floor_system_exact_match");
      expect(result.floorSystemRatings?.Rw, `${expected.id} Rw`).toBe(expected.rw);
      expect(result.floorSystemRatings?.RwCtr, `${expected.id} Rw+C companion`).toBeCloseTo(expected.rwPlusC, 10);
      expect(result.floorSystemRatings?.RwCtrSemantic, `${expected.id} Rw+C semantic`).toBe("rw_plus_c");
      expect(result.impact?.LnW, `${expected.id} Ln,w`).toBe(expected.lnW);
      expect(result.impact?.CI, `${expected.id} CI`).toBe(expected.ci);
      expect(result.impact?.CI50_2500, `${expected.id} CI,50-2500`).toBe(expected.ci50);
      expect(result.impact?.LnWPlusCI, `${expected.id} Ln,w+CI`).toBe(expected.lnWPlusCI);
      expect(result.impact?.LPrimeNW, `${expected.id} L'n,w`).toBe(expected.lnW + FIELD_CONTEXT.fieldKDb);
      expect(result.impact?.LPrimeNTw, `${expected.id} L'nT,w`).toBe(expected.lnW);
      expect(result.impact?.LPrimeNT50, `${expected.id} L'nT,50`).toBe(expected.lnW + expected.ci50);
      expect(result.supportedTargetOutputs, `${expected.id} supported outputs`).toEqual(
        TUAS_COMPANION_TARGET_OUTPUTS.filter((output) => output !== "Ctr")
      );
      expect(result.unsupportedTargetOutputs, `${expected.id} unsupported outputs`).toEqual(["Ctr"]);
      expect(result.impact?.metricBasis?.CI50_2500, `${expected.id} metric basis CI,50-2500`).toBe("open_measured_floor_system_exact_match");
      expect(result.impact?.metricBasis?.LPrimeNT50, `${expected.id} metric basis L'nT,50`).toBe(
        "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500"
      );
    }
  });

  it("keeps visible role-tagged TUAS routes measured against source truth", () => {
    for (const expected of TUAS_MEASURED_ROWS) {
      const system = getFloorSystem(expected.id);
      const result = calculateAssembly(buildFloorTestLayersFromCriteria(system.match, "tagged"), {
        targetOutputs: LAB_OUTPUTS
      });

      if (expected.manualMatch === false) {
        expect(result.floorSystemMatch, `${expected.id} exact match`).toBeNull();
        expect(result.floorSystemEstimate?.kind, `${expected.id} estimate kind`).toBe("family_general");
        expect(result.floorSystemEstimate?.fitPercent, `${expected.id} estimate fit`).toBe(expected.predictorFitPercent);
        expect(result.impact?.basis, `${expected.id} impact basis`).toBe("predictor_mass_timber_clt_dry_interaction_estimate");
        expect(result.impact?.estimateCandidateIds, `${expected.id} estimate candidates`).toEqual([expected.id]);
      } else {
        expect(result.floorSystemMatch?.system.id, `${expected.id} exact match`).toBe(expected.id);
        expect(result.floorSystemEstimate, `${expected.id} no estimate fallback`).toBeNull();
        expect(result.impact?.basis, `${expected.id} impact basis`).toBe("open_measured_floor_system_exact_match");
      }

      expect(result.floorSystemRatings?.Rw, `${expected.id} route Rw`).toBe(expected.rw);
      expect(result.impact?.LnW, `${expected.id} route Ln,w`).toBe(expected.lnW);
      expect(result.impact?.LnWPlusCI, `${expected.id} route Ln,w+CI`).toBe(expected.lnWPlusCI);
      expect(result.supportedTargetOutputs, `${expected.id} route supported`).toEqual(LAB_OUTPUTS);
      expect(result.unsupportedTargetOutputs, `${expected.id} route unsupported`).toEqual([]);
    }
  });

  it("keeps missing-role TUAS drift rows on their current measured fail-closed or family-estimate posture", () => {
    for (const expected of RAW_DRIFT_EXPECTATIONS) {
      const system = getFloorSystem(expected.id);
      const result = calculateAssembly(buildFloorTestLayersFromCriteria(system.match, "raw"), {
        targetOutputs: LAB_OUTPUTS
      });

      expect(result.floorSystemMatch?.system.id ?? null, `${expected.id} raw match`).toBe(expected.matchId);
      expect(result.floorSystemEstimate?.kind ?? null, `${expected.id} raw estimate kind`).toBe(expected.estimateKind);
      expect(result.floorSystemEstimate?.fitPercent, `${expected.id} raw fit`).toBe(expected.fitPercent);
      expect(result.impact?.estimateCandidateIds, `${expected.id} raw candidate ids`).toEqual(expected.candidateIds);
      expect(result.floorSystemRatings?.Rw, `${expected.id} raw Rw`).toBeCloseTo(expected.rw, 10);
      expectNullableNumber(result.impact?.LnW, expected.lnW, `${expected.id} raw Ln,w`);
      expectNullableNumber(result.impact?.LnWPlusCI, expected.lnWPlusCI, `${expected.id} raw Ln,w+CI`);
      expect(result.supportedTargetOutputs, `${expected.id} raw supported`).toEqual(expected.supported);
      expect(result.unsupportedTargetOutputs, `${expected.id} raw unsupported`).toEqual(expected.unsupported);
    }
  });

  it("keeps raw open-box carrier, upper-only, and lower-only attempts fail-closed for impact outputs", () => {
    for (const expected of RAW_OPEN_BOX_CARRIER_ATTEMPTS) {
      const result = calculateAssembly(expected.layers, {
        targetOutputs: LAB_OUTPUTS
      });

      expect(result.floorSystemMatch, `${expected.id} exact match`).toBeNull();
      expect(result.floorSystemEstimate, `${expected.id} estimate`).toBeNull();
      expect(result.impact, `${expected.id} impact`).toBeNull();
      expect(result.floorSystemRatings?.Rw, `${expected.id} Rw screening`).toBe(expected.rw);
      expect(result.supportedTargetOutputs, `${expected.id} supported`).toEqual(["Rw"]);
      expect(result.unsupportedTargetOutputs, `${expected.id} unsupported`).toEqual(["Ln,w", "Ln,w+CI"]);
      expect(
        result.warnings.some((warning: string) =>
          /Impact sound outputs are not available for the current input\/path: Ln,w, Ln,w\+CI/i.test(warning)
        ),
        `${expected.id} unsupported warning`
      ).toBe(true);
    }
  });

  it("keeps exact TUAS source answers stable when merge-safe roles are entered as many contiguous pieces", () => {
    for (const id of ["tuas_r10a_open_box_timber_measured_2026", "tuas_c2c_clt260_measured_2026"]) {
      const system = getFloorSystem(id);
      const canonical = routeSnapshot(buildFloorTestLayersFromCriteria(system.match, "tagged"));
      const manyLayer = routeSnapshot(splitContiguousMergeSafeLayers(buildFloorTestLayersFromCriteria(system.match, "tagged")));

      expect(manyLayer).toEqual(canonical);
      expect(canonical.matchId, `${id} exact match`).toBe(id);
      expect(canonical.impactBasis, `${id} basis`).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
      expect(canonical.unsupportedTargetOutputs, `${id} unsupported`).toEqual([]);
    }
  });

  it("does not preserve the exact TUAS staged package when a single-entry role is split across an intervening role", () => {
    const system = getFloorSystem("tuas_r10a_open_box_timber_measured_2026");
    const disjoint = routeSnapshot(
      splitUpperFillAcrossFirstFloatingScreed(buildFloorTestLayersFromCriteria(system.match, "tagged"))
    );

    expect(disjoint.matchId).toBeNull();
    expect(disjoint.estimateKind).toBe("family_general");
    expect(disjoint.impactBasis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(disjoint.rw).toBe(55);
    expect(disjoint.lnW).toBe(55.4);
    expect(disjoint.lPrimeNT50).toBe(59.3);
    expect(
      disjoint.warnings.some((warning: string) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: floating screed x3 .* upper fill x2/i.test(
          warning
        )
      )
    ).toBe(true);
  });
});

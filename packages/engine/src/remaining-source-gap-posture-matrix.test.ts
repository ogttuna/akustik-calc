import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";
import { TUAS_C11C_COMBINED_WET_SOURCE_LAYERS } from "./tuas-c11c-exact-import-readiness";

type SourceGapSnapshot = {
  candidateIds: readonly string[] | null;
  ci50_2500: number | null;
  estimateBasis: string | null;
  estimateKind: string | null;
  fitPercent: number | null;
  impactBasis: string | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  matchId: string | null;
  rw: number | null;
  rwPrime: number | null;
  dnTw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type SourceGapCase = {
  expected: SourceGapSnapshot;
  id: string;
  layers: readonly LayerInput[];
};

const FIELD_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
];

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

const DATAHOLZ_GDMTXA04A_VISIBLE_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 60 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }
];

const FAIL_CLOSED_IMPACT_UNSUPPORTED: readonly RequestedOutputId[] = [
  "Rw",
  "Ln,w",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
];

const CASES: readonly SourceGapCase[] = [
  {
    id: "tuas C11c wet stack remains exact-import blocked but guarded ISO impact is live",
    layers: TUAS_C11C_COMBINED_WET_SOURCE_LAYERS,
    expected: {
      candidateIds: ["tuas_c11c_visible_iso_weighted_tuple_2026"],
      ci50_2500: 1,
      estimateBasis: null,
      estimateKind: null,
      fitPercent: null,
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 59.6,
      lPrimeNTw: 58.6,
      lPrimeNW: 61,
      lnW: 59,
      lnWPlusCI: 60,
      matchId: null,
      rw: 47,
      rwPrime: 47,
      dnTw: 50,
      supported: FIELD_OUTPUTS,
      unsupported: []
    }
  },
  {
    id: "Dataholz GDMTXA04A remains estimate-only instead of exact-reopened",
    layers: DATAHOLZ_GDMTXA04A_VISIBLE_LAYERS,
    expected: {
      candidateIds: ["dataholz_gdmtxa01a_clt_lab_2026"],
      ci50_2500: 9,
      estimateBasis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      estimateKind: "family_general",
      fitPercent: 50,
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 57.6,
      lPrimeNTw: 48.6,
      lPrimeNW: 51,
      lnW: 49,
      lnWPlusCI: 53,
      matchId: null,
      rw: 65,
      rwPrime: 48,
      dnTw: 51,
      supported: FIELD_OUTPUTS,
      unsupported: []
    }
  },
  {
    id: "raw bare open-web uses source-absent raw-bare runtime with explicit field impact companions",
    layers: [{ materialId: "open_web_steel_floor", thicknessMm: 300 }],
    expected: {
      candidateIds: ["source_absent_raw_bare_open_web_formula"],
      ci50_2500: 5.2,
      estimateBasis: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
      estimateKind: "family_archetype",
      fitPercent: 100,
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 100.8,
      lPrimeNTw: 95.6,
      lPrimeNW: 98,
      lnW: 96,
      lnWPlusCI: 97.8,
      matchId: null,
      rw: 32,
      rwPrime: 70,
      dnTw: 73,
      supported: FIELD_OUTPUTS,
      unsupported: []
    }
  },
  {
    id: "raw bare open-box uses source-absent raw-bare runtime with explicit field impact companions",
    layers: [{ materialId: "open_box_timber_slab", thicknessMm: 220 }],
    expected: {
      candidateIds: ["source_absent_raw_bare_open_box_formula"],
      ci50_2500: 3.4,
      estimateBasis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      estimateKind: "family_archetype",
      fitPercent: 100,
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 94.1,
      lPrimeNTw: 90.7,
      lPrimeNW: 93.1,
      lnW: 91.1,
      lnWPlusCI: 90.2,
      matchId: null,
      rw: 38.1,
      rwPrime: 35,
      dnTw: 38,
      supported: FIELD_OUTPUTS,
      unsupported: []
    }
  },
  {
    id: "helper-only timber carrier keeps impact outputs deferred",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "timber_joist_floor", thicknessMm: 250 }
    ],
    expected: {
      candidateIds: null,
      ci50_2500: null,
      estimateBasis: null,
      estimateKind: null,
      fitPercent: null,
      impactBasis: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      lnWPlusCI: null,
      matchId: null,
      rw: 42,
      rwPrime: 42,
      dnTw: 45,
      supported: ["R'w", "DnT,w"],
      unsupported: FAIL_CLOSED_IMPACT_UNSUPPORTED
    }
  },
  {
    id: "helper-only open-web carrier keeps impact outputs deferred",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expected: {
      candidateIds: null,
      ci50_2500: null,
      estimateBasis: null,
      estimateKind: null,
      fitPercent: null,
      impactBasis: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      lnWPlusCI: null,
      matchId: null,
      rw: 71,
      rwPrime: 71,
      dnTw: 74,
      supported: ["R'w", "DnT,w"],
      unsupported: FAIL_CLOSED_IMPACT_UNSUPPORTED
    }
  }
];

function snapshot(layers: readonly LayerInput[]): SourceGapSnapshot {
  const result = calculateAssembly(layers, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });

  return {
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    ci50_2500: result.impact?.CI50_2500 ?? null,
    estimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    fitPercent: result.floorSystemEstimate?.fitPercent ?? null,
    impactBasis: result.impact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("remaining source-gap posture matrix", () => {
  it.each(CASES)("$id", ({ layers, expected }) => {
    expect(snapshot(layers)).toEqual(expected);
  });
});

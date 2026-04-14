import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type LaneSnapshot = {
  basis: string | null;
  candidateIds: readonly string[] | null;
  fitPercent: number | null;
  kind: string | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  rw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type AuditCase = {
  expectedField: LaneSnapshot;
  expectedLab: LaneSnapshot;
  id: string;
  raw: readonly LayerInput[];
  tagged: readonly LayerInput[];
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

function snapshot(
  layers: readonly LayerInput[],
  mode: "lab" | "field"
): LaneSnapshot {
  const result = calculateAssembly(
    layers,
    mode === "lab"
      ? { targetOutputs: LAB_OUTPUTS }
      : {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }
  );

  return {
    basis: result.impact?.basis ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    fitPercent: result.floorSystemEstimate?.fitPercent ?? null,
    kind: result.floorSystemEstimate?.kind ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

const CASES: readonly AuditCase[] = [
  {
    id: "open-web lower-only minimal packaged lane",
    raw: [
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    tagged: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expectedLab: {
      basis: "predictor_floor_system_family_general_estimate",
      candidateIds: [
        "ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026"
      ],
      fitPercent: 59.3,
      kind: "family_general",
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: 53.3,
      lnWPlusCI: 51.6,
      rw: 60.7,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_local_guide",
      candidateIds: [
        "ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026"
      ],
      fitPercent: 59.3,
      kind: "family_general",
      lPrimeNTw: 52.9,
      lPrimeNW: 55.3,
      lnW: 53.3,
      lnWPlusCI: 51.6,
      rw: 60.7,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "open-web lower-only ceiling-fill variant",
    raw: [
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "rockwool", thicknessMm: 145 },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    tagged: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expectedLab: {
      basis: "predictor_floor_system_family_general_estimate",
      candidateIds: [
        "ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026"
      ],
      fitPercent: 73.7,
      kind: "family_general",
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: 53.3,
      lnWPlusCI: 51.6,
      rw: 60.7,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_local_guide",
      candidateIds: [
        "ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026"
      ],
      fitPercent: 73.7,
      kind: "family_general",
      lPrimeNTw: 52.9,
      lPrimeNW: 55.3,
      lnW: 53.3,
      lnWPlusCI: 51.6,
      rw: 60.7,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "composite ceiling-only packaged lane stays conservative",
    raw: [
      { materialId: "firestop_board", thicknessMm: 15 },
      { materialId: "firestop_board", thicknessMm: 15 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { materialId: "composite_steel_deck", thicknessMm: 150 }
    ],
    tagged: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ],
    expectedLab: {
      basis: "predictor_floor_system_low_confidence_estimate",
      candidateIds: [
        "pmc_m1_bare_composite_lab_2026",
        "pmc_m1_dry_floating_plus_c2x_lab_2026",
        "pmc_m1_dry_floating_plus_c1x_lab_2026",
        "pmc_m1_dry_floating_floor_lab_2026"
      ],
      fitPercent: 28,
      kind: "low_confidence",
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: 63.3,
      lnWPlusCI: null,
      rw: 48.6,
      supported: ["Rw", "Ln,w"],
      unsupported: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: [
        "pmc_m1_bare_composite_lab_2026",
        "pmc_m1_dry_floating_plus_c2x_lab_2026",
        "pmc_m1_dry_floating_plus_c1x_lab_2026",
        "pmc_m1_dry_floating_floor_lab_2026"
      ],
      fitPercent: 28,
      kind: "low_confidence",
      lPrimeNTw: 62.9,
      lPrimeNW: 65.3,
      lnW: 63.3,
      lnWPlusCI: null,
      rw: 48.6,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "clt lower-only stays fail-closed",
    raw: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { materialId: "clt_panel", thicknessMm: 260 }
    ],
    tagged: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    expectedLab: {
      basis: null,
      candidateIds: null,
      fitPercent: null,
      kind: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      lnWPlusCI: null,
      rw: 41,
      supported: ["Rw"],
      unsupported: ["Ln,w", "Ln,w+CI"]
    },
    expectedField: {
      basis: null,
      candidateIds: null,
      fitPercent: null,
      kind: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      lnWPlusCI: null,
      rw: 38,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
    }
  }
];

describe("raw floor packaged-lane audit", () => {
  it.each(CASES)("$id", ({ raw, tagged, expectedLab, expectedField }) => {
    expect(snapshot(raw, "lab")).toEqual(snapshot(tagged, "lab"));
    expect(snapshot(raw, "field")).toEqual(snapshot(tagged, "field"));

    expect(snapshot(raw, "lab")).toEqual(expectedLab);
    expect(snapshot(raw, "field")).toEqual(expectedField);
  });
});

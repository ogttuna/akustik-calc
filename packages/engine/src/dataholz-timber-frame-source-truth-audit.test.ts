import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";

const TARGET_OUTPUTS = ["Rw", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] as const;
const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI"] as const;
const FIELD_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] as const;

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
};

type ExpectedDataholzTimberFrameRow = {
  basis: "mixed_exact_plus_estimated_local_guide" | "mixed_exact_plus_estimated_standardized_field_volume_normalization";
  ci: number;
  ci50?: number;
  estimateMatch: boolean;
  id: string;
  lnW: number;
  lnWPlusCI: number;
  lPrimeNT50: number;
  lPrimeNTw: number;
  lPrimeNW: number;
  manualMatch?: false;
  rw: number;
  rwCtr: number;
  unsupported: readonly string[];
};

const DATAHOLZ_TIMBER_FRAME_ROWS: readonly ExpectedDataholzTimberFrameRow[] = [
  {
    id: "dataholz_gdsnxn01a_timber_frame_lab_2026",
    estimateMatch: false,
    rw: 68,
    rwCtr: -6,
    lnW: 52,
    ci: 2,
    lnWPlusCI: 54,
    lPrimeNW: 54,
    lPrimeNTw: 52,
    lPrimeNT50: 54,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["CI,50-2500"]
  },
  {
    id: "dataholz_gdrnxa01a_timber_frame_lab_2026",
    estimateMatch: true,
    rw: 66,
    rwCtr: -7,
    lnW: 53,
    ci: 0,
    lnWPlusCI: 53,
    lPrimeNW: 55,
    lPrimeNTw: 53,
    lPrimeNT50: 53,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["CI,50-2500"]
  },
  {
    id: "dataholz_gdrnxa05b_timber_frame_lab_2026",
    estimateMatch: true,
    rw: 58,
    rwCtr: -7,
    lnW: 60,
    ci: 0,
    lnWPlusCI: 60,
    lPrimeNW: 62,
    lPrimeNTw: 60,
    lPrimeNT50: 60,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["CI,50-2500"]
  },
  {
    id: "dataholz_gdrnxa07a_timber_frame_lab_2026",
    estimateMatch: true,
    rw: 70,
    rwCtr: -5,
    lnW: 41,
    ci: 1,
    lnWPlusCI: 42,
    lPrimeNW: 43,
    lPrimeNTw: 41,
    lPrimeNT50: 42,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["CI,50-2500"]
  },
  {
    id: "dataholz_gdrnxa11a_timber_frame_lab_2026",
    estimateMatch: true,
    rw: 83,
    rwCtr: -17,
    lnW: 42,
    ci: 2,
    ci50: 14,
    lnWPlusCI: 44,
    lPrimeNW: 44,
    lPrimeNTw: 42,
    lPrimeNT50: 56,
    basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
    unsupported: []
  },
  {
    id: "dataholz_gdrnxa03b_timber_frame_lab_2026",
    estimateMatch: false,
    rw: 74,
    rwCtr: -12,
    lnW: 47,
    ci: 0,
    lnWPlusCI: 47,
    lPrimeNW: 49,
    lPrimeNTw: 47,
    lPrimeNT50: 47,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["CI,50-2500"]
  },
  {
    id: "dataholz_gdrtxn01a_timber_frame_dry_lab_2026",
    estimateMatch: true,
    rw: 63,
    rwCtr: -12,
    lnW: 58,
    ci: 2,
    lnWPlusCI: 60,
    lPrimeNW: 60,
    lPrimeNTw: 58,
    lPrimeNT50: 60,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["CI,50-2500"]
  },
  {
    id: "dataholz_gdrtxn02b_timber_frame_dry_lab_2026",
    estimateMatch: true,
    rw: 60,
    rwCtr: -12,
    lnW: 62,
    ci: 2,
    lnWPlusCI: 64,
    lPrimeNW: 64,
    lPrimeNTw: 62,
    lPrimeNT50: 64,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["CI,50-2500"]
  },
  {
    id: "dataholz_gdrtxa03b_timber_frame_dry_lab_2026",
    estimateMatch: true,
    rw: 65,
    rwCtr: -9,
    lnW: 51,
    ci: 2,
    lnWPlusCI: 53,
    lPrimeNW: 53,
    lPrimeNTw: 51,
    lPrimeNT50: 53,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["CI,50-2500"]
  },
  {
    id: "dataholz_gdrtxa06a_timber_frame_dry_lab_2026",
    estimateMatch: true,
    manualMatch: false,
    rw: 66,
    rwCtr: -15,
    lnW: 52,
    ci: 1,
    lnWPlusCI: 53,
    lPrimeNW: 54,
    lPrimeNTw: 52,
    lPrimeNT50: 53,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["CI,50-2500"]
  }
];

const DATAHOLZ_BONDED_FILL_TAGGED_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 60 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 60 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 240 }
];

const DATAHOLZ_BONDED_FILL_MANY_LAYER_TAGGED_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.25 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.25 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 40 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 60 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 20 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 20 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 20 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 15 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 80 },
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 80 },
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 80 }
];

const DATAHOLZ_BONDED_FILL_DISJOINT_UPPER_FILL_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 30 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 30 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 60 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 240 }
];

function getFloorSystem(id: string) {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  expect(system, id).toBeDefined();
  return system as NonNullable<typeof system>;
}

function expectVisibleRoute(
  id: string,
  mode: "raw" | "tagged",
  expected: {
    estimateBasis?: string;
    floorSystemMatchId?: string;
    lnW?: number;
    rw: number;
    supported: readonly string[];
    unsupported: readonly string[];
  }
) {
  const system = getFloorSystem(id);
  const result = calculateAssembly(buildFloorTestLayersFromCriteria(system.match, mode), {
    targetOutputs: LAB_OUTPUTS
  });

  expect(result.floorSystemMatch?.system.id, `${id} ${mode} exact match`).toBe(expected.floorSystemMatchId);
  expect(result.floorSystemEstimate?.impact.basis, `${id} ${mode} estimate basis`).toBe(expected.estimateBasis);
  expect(result.floorSystemRatings?.Rw, `${id} ${mode} Rw`).toBe(expected.rw);
  expect(result.impact?.LnW, `${id} ${mode} Ln,w`).toBe(expected.lnW);
  expect(result.supportedTargetOutputs, `${id} ${mode} supported`).toEqual(expected.supported);
  expect(result.unsupportedTargetOutputs, `${id} ${mode} unsupported`).toEqual(expected.unsupported);
}

function fieldSnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, {
    impactFieldContext: FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });

  return {
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    warnings: result.warnings
  };
}

describe("Dataholz timber-frame source-truth audit", () => {
  it("pins every imported Dataholz timber-frame source row to explicit single-number truth", () => {
    const actualIds = EXACT_FLOOR_SYSTEMS.filter((entry) => entry.id.startsWith("dataholz_") && entry.id.includes("timber_frame")).map(
      (entry) => entry.id
    );

    expect(actualIds).toEqual(DATAHOLZ_TIMBER_FRAME_ROWS.map((entry) => entry.id));

    for (const expected of DATAHOLZ_TIMBER_FRAME_ROWS) {
      const system = getFloorSystem(expected.id);

      expect(system.manualMatch, `${expected.id} manualMatch`).toBe(expected.manualMatch);
      expect(Boolean(system.estimateMatch), `${expected.id} estimateMatch`).toBe(expected.estimateMatch);
      expect(system.airborneRatings.Rw, `${expected.id} catalog Rw`).toBe(expected.rw);
      expect(system.airborneRatings.RwCtr, `${expected.id} catalog RwCtr`).toBe(expected.rwCtr);
      expect(system.impactRatings.LnW, `${expected.id} catalog Ln,w`).toBe(expected.lnW);
      expect(system.impactRatings.CI, `${expected.id} catalog CI`).toBe(expected.ci);
      expect(system.impactRatings.CI50_2500, `${expected.id} catalog CI,50-2500`).toBe(expected.ci50);
      expect(system.impactRatings.LnWPlusCI, `${expected.id} catalog Ln,w+CI`).toBe(expected.lnWPlusCI);
    }
  });

  it("measures official-id field continuations for every Dataholz timber-frame row", () => {
    for (const expected of DATAHOLZ_TIMBER_FRAME_ROWS) {
      const result = calculateImpactOnly([], {
        officialFloorSystemId: expected.id,
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        },
        targetOutputs: TARGET_OUTPUTS
      });

      expect(result.sourceMode, `${expected.id} source mode`).toBe("official_floor_system");
      expect(result.floorSystemMatch?.system.id, `${expected.id} floor-system match`).toBe(expected.id);
      expect(result.impact?.basis, `${expected.id} impact basis`).toBe(expected.basis);
      expect(result.floorSystemRatings?.basis, `${expected.id} floor ratings basis`).toBe("official_floor_system_exact_match");
      expect(result.floorSystemRatings?.Rw, `${expected.id} Rw`).toBe(expected.rw);
      expect(result.floorSystemRatings?.RwCtr, `${expected.id} RwCtr`).toBe(expected.rwCtr);
      expect(result.impact?.LnW, `${expected.id} Ln,w`).toBe(expected.lnW);
      expect(result.impact?.CI, `${expected.id} CI`).toBe(expected.ci);
      expect(result.impact?.CI50_2500, `${expected.id} CI,50-2500`).toBe(expected.ci50);
      expect(result.impact?.LnWPlusCI, `${expected.id} Ln,w+CI`).toBe(expected.lnWPlusCI);
      expect(result.impact?.LPrimeNW, `${expected.id} L'n,w`).toBe(expected.lPrimeNW);
      expect(result.impact?.LPrimeNTw, `${expected.id} L'nT,w`).toBe(expected.lPrimeNTw);
      expect(result.impact?.LPrimeNT50, `${expected.id} L'nT,50`).toBe(expected.lPrimeNT50);
      expect(result.unsupportedTargetOutputs, `${expected.id} unsupported outputs`).toEqual(expected.unsupported);
      expect(result.impact?.metricBasis?.LnW, `${expected.id} metric basis Ln,w`).toBe("official_floor_system_exact_match");
      expect(result.impact?.metricBasis?.LnWPlusCI, `${expected.id} metric basis Ln,w+CI`).toBe("official_floor_system_exact_match");
    }
  });

  it("keeps visible raw and tagged timber-frame routes measured against the source posture", () => {
    for (const expected of DATAHOLZ_TIMBER_FRAME_ROWS.filter((entry) => entry.manualMatch !== false)) {
      expectVisibleRoute(expected.id, "tagged", {
        floorSystemMatchId: expected.id,
        lnW: expected.lnW,
        rw: expected.rw,
        supported: ["Rw", "Ln,w", "Ln,w+CI"],
        unsupported: []
      });
    }

    expectVisibleRoute("dataholz_gdsnxn01a_timber_frame_lab_2026", "raw", {
      rw: 56,
      supported: ["Rw"],
      unsupported: ["Ln,w", "Ln,w+CI"]
    });

    expectVisibleRoute("dataholz_gdrtxa06a_timber_frame_dry_lab_2026", "tagged", {
      estimateBasis: "predictor_floor_system_family_general_estimate",
      lnW: 71,
      rw: 50.5,
      supported: ["Rw", "Ln,w"],
      unsupported: ["Ln,w+CI"]
    });

    expectVisibleRoute("dataholz_gdrtxa06a_timber_frame_dry_lab_2026", "raw", {
      estimateBasis: "predictor_floor_system_family_general_estimate",
      lnW: 71,
      rw: 50.5,
      supported: ["Rw", "Ln,w"],
      unsupported: ["Ln,w+CI"]
    });
  });

  it("keeps source answers stable when a Dataholz timber-frame exact row is entered as many contiguous layer pieces", () => {
    const canonical = fieldSnapshot(DATAHOLZ_BONDED_FILL_TAGGED_LAYERS);
    const manyLayer = fieldSnapshot(DATAHOLZ_BONDED_FILL_MANY_LAYER_TAGGED_LAYERS);

    expect(canonical).toEqual(
      expect.objectContaining({
        floorSystemMatchId: "dataholz_gdrnxa11a_timber_frame_lab_2026",
        impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
        lnW: 42,
        lnWPlusCI: 44,
        lPrimeNW: 44,
        lPrimeNTw: 42,
        lPrimeNT50: 56,
        rw: 83,
        unsupportedTargetOutputs: []
      })
    );
    expect(manyLayer).toEqual(canonical);
  });

  it("does not preserve the exact Dataholz timber-frame row when a single-entry role is split across an intervening role", () => {
    const disjoint = fieldSnapshot(DATAHOLZ_BONDED_FILL_DISJOINT_UPPER_FILL_LAYERS);

    expect(disjoint.floorSystemMatchId).toBeNull();
    expect(disjoint.floorSystemEstimateKind).toBe("family_general");
    expect(disjoint).toEqual(
      expect.objectContaining({
        impactBasis: "mixed_predicted_plus_estimated_local_guide",
        lnW: 48.6,
        lnWPlusCI: 48.8,
        lPrimeNW: 50.6,
        lPrimeNTw: 48.6,
        lPrimeNT50: 48.8,
        rw: 70,
        unsupportedTargetOutputs: []
      })
    );
    expect(
      disjoint.warnings.some((warning: string) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: upper fill x2/i.test(warning)
      )
    ).toBe(true);
  });
});

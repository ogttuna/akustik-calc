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

type ExpectedDataholzCltRow = {
  basis: "mixed_exact_plus_estimated_local_guide" | "mixed_exact_plus_estimated_standardized_field_volume_normalization";
  ci: number | null;
  ci50: number | null;
  estimateMatch: boolean;
  id: string;
  lnW: number;
  lnWPlusCI: number | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number;
  lPrimeNW: number;
  manualMatch?: false;
  rw: number;
  rwCtr: number | null;
  unsupported: readonly string[];
};

const DATAHOLZ_CLT_ROWS: readonly ExpectedDataholzCltRow[] = [
  {
    id: "dataholz_gdmnxn02_wet_clt_lab_2026",
    estimateMatch: true,
    rw: 54,
    rwCtr: null,
    lnW: 65,
    ci: -2,
    ci50: null,
    lnWPlusCI: 63,
    lPrimeNW: 67,
    lPrimeNTw: 65,
    lPrimeNT50: 63,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["Ctr", "CI,50-2500"]
  },
  {
    id: "dataholz_gdmnxn02_05_wet_clt_lab_2026",
    estimateMatch: true,
    rw: 74,
    rwCtr: -7,
    lnW: 47,
    ci: 2,
    ci50: 4,
    lnWPlusCI: 49,
    lPrimeNW: 49,
    lPrimeNTw: 47,
    lPrimeNT50: 51,
    basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
    unsupported: []
  },
  {
    id: "dataholz_gdmnxn05_wet_clt_lab_2026",
    estimateMatch: false,
    rw: 74,
    rwCtr: null,
    lnW: 45,
    ci: -1,
    ci50: null,
    lnWPlusCI: 44,
    lPrimeNW: 47,
    lPrimeNTw: 45,
    lPrimeNT50: 44,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["Ctr", "CI,50-2500"]
  },
  {
    id: "dataholz_gdmtxn01_dry_clt_lab_2026",
    estimateMatch: false,
    rw: 62,
    rwCtr: null,
    lnW: 50,
    ci: -1,
    ci50: null,
    lnWPlusCI: 49,
    lPrimeNW: 52,
    lPrimeNTw: 50,
    lPrimeNT50: 49,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["Ctr", "CI,50-2500"]
  },
  {
    id: "dataholz_gdmnxn06_fill_clt_lab_2026",
    estimateMatch: false,
    rw: 78,
    rwCtr: null,
    lnW: 39,
    ci: -1,
    ci50: 7,
    lnWPlusCI: 38,
    lPrimeNW: 41,
    lPrimeNTw: 39,
    lPrimeNT50: 46,
    basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
    unsupported: ["Ctr"]
  },
  {
    id: "dataholz_gdmnxa02a_00_clt_lab_2026",
    estimateMatch: false,
    manualMatch: false,
    rw: 61,
    rwCtr: -8,
    lnW: 53,
    ci: null,
    ci50: null,
    lnWPlusCI: null,
    lPrimeNW: 55,
    lPrimeNTw: 53,
    lPrimeNT50: null,
    basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
    unsupported: ["CI", "CI,50-2500", "Ln,w+CI", "L'nT,50"]
  },
  {
    id: "dataholz_gdmnxa02a_02_clt_lab_2026",
    estimateMatch: false,
    manualMatch: false,
    rw: 62,
    rwCtr: -6,
    lnW: 46,
    ci: null,
    ci50: null,
    lnWPlusCI: null,
    lPrimeNW: 48,
    lPrimeNTw: 46,
    lPrimeNT50: null,
    basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
    unsupported: ["CI", "CI,50-2500", "Ln,w+CI", "L'nT,50"]
  },
  {
    id: "dataholz_gdmtxa01a_clt_lab_2026",
    estimateMatch: true,
    rw: 65,
    rwCtr: null,
    lnW: 47,
    ci: 2,
    ci50: null,
    lnWPlusCI: 49,
    lPrimeNW: 49,
    lPrimeNTw: 47,
    lPrimeNT50: 49,
    basis: "mixed_exact_plus_estimated_local_guide",
    unsupported: ["Ctr", "CI,50-2500"]
  },
  {
    id: "dataholz_gdmtxa04a_clt_lab_2026",
    estimateMatch: false,
    manualMatch: false,
    rw: 70,
    rwCtr: -19,
    lnW: 49,
    ci: 4,
    ci50: 9,
    lnWPlusCI: 53,
    lPrimeNW: 51,
    lPrimeNTw: 49,
    lPrimeNT50: 58,
    basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
    unsupported: []
  }
];

const DATAHOLZ_DRY_CLT_TAGGED_LAYERS: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 },
  { floorRole: "resilient_layer", materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
];

const DATAHOLZ_DRY_CLT_MANY_LAYER_TAGGED_LAYERS: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 70 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 70 },
  { floorRole: "resilient_layer", materialId: "mw_t_40_impact_layer", thicknessMm: 15 },
  { floorRole: "resilient_layer", materialId: "mw_t_40_impact_layer", thicknessMm: 15 },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 20 },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 20 },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 20 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
];

const DATAHOLZ_DRY_CLT_DISJOINT_UPPER_FILL_LAYERS: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 30 },
  { floorRole: "resilient_layer", materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
];

function getFloorSystem(id: string) {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  expect(system, id).toBeDefined();
  return system as NonNullable<typeof system>;
}

function labSnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, {
    targetOutputs: LAB_OUTPUTS
  });

  return {
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    estimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    warnings: result.warnings
  };
}

function fieldSnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, {
    impactFieldContext: FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });

  return {
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    estimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
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

describe("Dataholz CLT source-truth audit", () => {
  it("pins every imported Dataholz CLT source row to explicit single-number truth", () => {
    const actualIds = EXACT_FLOOR_SYSTEMS.filter((entry) => entry.id.startsWith("dataholz_") && entry.id.includes("_clt_")).map(
      (entry) => entry.id
    );

    expect(actualIds).toEqual(DATAHOLZ_CLT_ROWS.map((entry) => entry.id));

    for (const expected of DATAHOLZ_CLT_ROWS) {
      const system = getFloorSystem(expected.id);

      expect(system.manualMatch, `${expected.id} manualMatch`).toBe(expected.manualMatch);
      expect(Boolean(system.estimateMatch), `${expected.id} estimateMatch`).toBe(expected.estimateMatch);
      expect(system.airborneRatings.Rw, `${expected.id} catalog Rw`).toBe(expected.rw);
      expect(system.airborneRatings.RwCtr ?? null, `${expected.id} catalog RwCtr`).toBe(expected.rwCtr);
      expect(system.impactRatings.LnW, `${expected.id} catalog Ln,w`).toBe(expected.lnW);
      expect(system.impactRatings.CI ?? null, `${expected.id} catalog CI`).toBe(expected.ci);
      expect(system.impactRatings.CI50_2500 ?? null, `${expected.id} catalog CI,50-2500`).toBe(expected.ci50);
      expect(system.impactRatings.LnWPlusCI ?? null, `${expected.id} catalog Ln,w+CI`).toBe(expected.lnWPlusCI);
    }
  });

  it("measures official-id field continuations for every Dataholz CLT row", () => {
    for (const expected of DATAHOLZ_CLT_ROWS) {
      const result = calculateImpactOnly([], {
        officialFloorSystemId: expected.id,
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: TARGET_OUTPUTS
      });

      expect(result.sourceMode, `${expected.id} source mode`).toBe("official_floor_system");
      expect(result.floorSystemMatch?.system.id, `${expected.id} floor-system match`).toBe(expected.id);
      expect(result.impact?.basis, `${expected.id} impact basis`).toBe(expected.basis);
      expect(result.floorSystemRatings?.basis, `${expected.id} floor ratings basis`).toBe("official_floor_system_exact_match");
      expect(result.floorSystemRatings?.Rw, `${expected.id} Rw`).toBe(expected.rw);
      expect(result.floorSystemRatings?.RwCtr ?? null, `${expected.id} RwCtr`).toBe(expected.rwCtr);
      expect(result.impact?.LnW, `${expected.id} Ln,w`).toBe(expected.lnW);
      expect(result.impact?.CI ?? null, `${expected.id} CI`).toBe(expected.ci);
      expect(result.impact?.CI50_2500 ?? null, `${expected.id} CI,50-2500`).toBe(expected.ci50);
      expect(result.impact?.LnWPlusCI ?? null, `${expected.id} Ln,w+CI`).toBe(expected.lnWPlusCI);
      expect(result.impact?.LPrimeNW, `${expected.id} L'n,w`).toBe(expected.lPrimeNW);
      expect(result.impact?.LPrimeNTw, `${expected.id} L'nT,w`).toBe(expected.lPrimeNTw);
      expect(result.impact?.LPrimeNT50 ?? null, `${expected.id} L'nT,50`).toBe(expected.lPrimeNT50);
      expect(result.unsupportedTargetOutputs, `${expected.id} unsupported outputs`).toEqual(expected.unsupported);
      expect(result.impact?.metricBasis?.LnW, `${expected.id} metric basis Ln,w`).toBe("official_floor_system_exact_match");
    }
  });

  it("keeps visible raw and tagged CLT routes measured against the source posture", () => {
    for (const expected of DATAHOLZ_CLT_ROWS) {
      const system = getFloorSystem(expected.id);
      const raw = labSnapshot(buildFloorTestLayersFromCriteria(system.match, "raw"));
      const tagged = labSnapshot(buildFloorTestLayersFromCriteria(system.match, "tagged"));

      expect(raw, `${expected.id} raw/tagged parity`).toEqual(tagged);

      if (expected.manualMatch !== false) {
        expect(raw, `${expected.id} exact visible route`).toEqual(
          expect.objectContaining({
            floorSystemMatchId: expected.id,
            impactBasis: "official_floor_system_exact_match",
            lnW: expected.lnW,
            lnWPlusCI: expected.lnWPlusCI,
            rw: expected.rw,
            supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
            unsupportedTargetOutputs: []
          })
        );
      }
    }

    expect(labSnapshot(buildFloorTestLayersFromCriteria(getFloorSystem("dataholz_gdmnxa02a_00_clt_lab_2026").match, "tagged"))).toEqual(
      expect.objectContaining({
        floorSystemMatchId: null,
        impactBasis: null,
        rw: 54,
        supportedTargetOutputs: ["Rw"],
        unsupportedTargetOutputs: ["Ln,w", "Ln,w+CI"]
      })
    );

    expect(labSnapshot(buildFloorTestLayersFromCriteria(getFloorSystem("dataholz_gdmnxa02a_02_clt_lab_2026").match, "tagged"))).toEqual(
      expect.objectContaining({
        floorSystemMatchId: null,
        impactBasis: null,
        rw: 54,
        supportedTargetOutputs: ["Rw"],
        unsupportedTargetOutputs: ["Ln,w", "Ln,w+CI"]
      })
    );

    expect(labSnapshot(buildFloorTestLayersFromCriteria(getFloorSystem("dataholz_gdmtxa04a_clt_lab_2026").match, "tagged"))).toEqual(
      expect.objectContaining({
        candidateIds: ["dataholz_gdmtxa01a_clt_lab_2026"],
        estimateBasis: "predictor_mass_timber_clt_dataholz_dry_estimate",
        estimateKind: "family_general",
        floorSystemMatchId: null,
        impactBasis: "predictor_mass_timber_clt_dataholz_dry_estimate",
        lnW: 47,
        lnWPlusCI: 49,
        rw: 65,
        supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
        unsupportedTargetOutputs: []
      })
    );
  });

  it("keeps exact dry CLT answers stable when the source stack is entered as many contiguous layer pieces", () => {
    const canonical = fieldSnapshot(DATAHOLZ_DRY_CLT_TAGGED_LAYERS);
    const manyLayer = fieldSnapshot(DATAHOLZ_DRY_CLT_MANY_LAYER_TAGGED_LAYERS);

    expect(canonical).toEqual(
      expect.objectContaining({
        floorSystemMatchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
        impactBasis: "mixed_exact_plus_estimated_local_guide",
        lnW: 50,
        lnWPlusCI: 49,
        lPrimeNW: 52,
        lPrimeNTw: 50,
        lPrimeNT50: 49,
        rw: 62,
        unsupportedTargetOutputs: []
      })
    );
    expect(manyLayer).toEqual(canonical);
  });

  it("does not preserve the exact dry CLT row when a single-entry role is split across an intervening role", () => {
    const disjoint = fieldSnapshot(DATAHOLZ_DRY_CLT_DISJOINT_UPPER_FILL_LAYERS);

    expect(disjoint.floorSystemMatchId).toBeNull();
    expect(disjoint.estimateKind).toBe("family_general");
    expect(disjoint).toEqual(
      expect.objectContaining({
        candidateIds: [
          "dataholz_gdmnxn02_wet_clt_lab_2026",
          "tuas_x2_clt140_measured_2026",
          "dataholz_gdmnxn02_05_wet_clt_lab_2026"
        ],
        estimateBasis: "predictor_floor_system_family_general_estimate",
        impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
        lnW: 58.7,
        lnWPlusCI: 59.2,
        lPrimeNW: 60.7,
        lPrimeNTw: 58.7,
        lPrimeNT50: 62.1,
        rw: 53.5,
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

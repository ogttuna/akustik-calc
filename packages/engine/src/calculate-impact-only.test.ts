import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";

const EXACT_IMPACT_SOURCE_19 = {
  frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
  labOrField: "lab" as const,
  levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
};

const EXACT_FIELD_OCTAVE_SOURCE_5 = {
  frequenciesHz: [125, 250, 500, 1000, 2000],
  labOrField: "field" as const,
  levelsDb: [60.3, 61.7, 63.1, 63.5, 59.2],
  standardMethod: "NEN 5077 / ISO 16283-2"
};

const DIRECT_FLANKING_FIELD_CONTEXT = {
  directPathOffsetDb: 1,
  flankingPaths: [
    {
      id: "f1",
      levelOffsetDb: -6,
      pathCount: 1,
      pathType: "wall" as const,
      supportingElementFamily: "reinforced_concrete" as const
    },
    {
      id: "f2",
      kijDb: 1.5,
      levelOffsetDb: -10,
      pathCount: 2,
      pathType: "ceiling" as const,
      shortCircuitRisk: "medium" as const
    }
  ],
  lowerTreatmentReductionDb: 2,
  receivingRoomVolumeM3: 50
};

describe("calculateImpactOnly", () => {
  it("resolves an exact impact band source even when the visible stack is gap-only", () => {
    const result = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
      targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "DeltaLw", "IIC"]
    });

    expect(result.partialType).toBe("impact_only");
    expect(result.sourceMode).toBe("exact_band_source");
    expect(result.impact?.basis).toBe("exact_source_band_curve_iso7172");
    expect(result.impact?.LnW).toBe(53);
    expect(result.impact?.CI).toBe(-3);
    expect(result.impact?.CI50_2500).toBe(-1);
    expect(result.impact?.LnWPlusCI).toBe(50);
    expect(result.impact?.metricBasis?.LnW).toBe("exact_source_band_curve_iso7172");
    expect(result.impact?.metricBasis?.LnWPlusCI).toBe("exact_source_band_curve_iso7172");
    expect(result.impactSupport?.formulaNotes.some((note: string) => /ISO 717-2 impact contour/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /Ln,w\+CI was computed as Ln,w \+ CI/i.test(note))).toBe(true);
    expect(result.targetOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "DeltaLw", "IIC"]);
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw", "IIC"]);
    expect(result.unsupportedImpactOutputs).toEqual(["DeltaLw", "IIC"]);
    expect(result.warnings.some((warning: string) => /Some requested impact sound outputs are still unavailable/i.test(warning))).toBe(
      true
    );
    expect(result.visibleLayers).toHaveLength(1);
    expect(result.sourceLayers).toHaveLength(1);
  });

  it("supports Dutch LnT,A only on the exact five-octave field lane", () => {
    const result = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      exactImpactSource: EXACT_FIELD_OCTAVE_SOURCE_5,
      targetOutputs: ["LnT,A", "L'nT,w", "CI"]
    });

    expect(result.sourceMode).toBe("exact_band_source");
    expect(result.impact?.LPrimeNTw).toBe(66);
    expect(result.impact?.CI).toBe(-12);
    expect(result.impact?.LnTA).toBe(53.8);
    expect(result.supportedTargetOutputs).toEqual(["LnT,A", "L'nT,w", "CI"]);
    expect(result.supportedImpactOutputs).toEqual(["LnT,A", "L'nT,w", "CI"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /Dutch LnT,A was computed/i.test(note))).toBe(true);
  });

  it("surfaces companion floor-carrier outputs without fabricating unsupported impact metrics", () => {
    const result = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      officialFloorSystemId: "knauf_ct30_1c_timber_lab_2026",
      targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw", "IIC"]
    });

    expect(result.sourceMode).toBe("official_floor_system");
    expect(result.floorSystemMatch?.system.id).toBe("knauf_ct30_1c_timber_lab_2026");
    expect(result.floorCarrier?.Rw).toBe(60);
    expect(result.floorCarrier?.RwCtr).toBe(53);
    expect(result.floorSystemRatings?.Rw).toBe(60);
    expect(result.floorSystemRatings?.basis).toBe("official_floor_system_exact_match");
    expect(result.impactPredictorStatus?.matchedFloorSystemId).toBe("knauf_ct30_1c_timber_lab_2026");
    expect(result.impactPredictorStatus?.active).toBe(true);
    expect(result.impactSupport?.notes.some((note: string) => /curated exact floor-system family/i.test(note))).toBe(true);
    expect(result.targetOutputs).toEqual(["Rw", "Ctr", "Ln,w", "DeltaLw", "IIC"]);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ctr", "Ln,w"]);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw", "IIC"]);
    expect(result.unsupportedImpactOutputs).toEqual(["DeltaLw", "IIC"]);
  });

  it("resolves an exact curated floor-system id with no visible wall stack at all", () => {
    const result = calculateImpactOnly([], {
      officialFloorSystemId: "dataholz_gdmtxn01_dry_clt_lab_2026"
    });

    expect(result.sourceMode).toBe("official_floor_system");
    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdmtxn01_dry_clt_lab_2026");
    expect(result.impact?.LnW).toBe(50);
    expect(result.impact?.metricBasis?.LnW).toBe("official_floor_system_exact_match");
    expect(result.floorCarrier?.Rw).toBe(62);
    expect(result.visibleLayers).toHaveLength(0);
    expect(result.sourceLayers).toHaveLength(0);
  });

  it("carries exact CLT dry rows into the Turkish local-guide continuation on the impact-only route", () => {
    const result = calculateImpactOnly([], {
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      officialFloorSystemId: "dataholz_gdmtxn01_dry_clt_lab_2026",
      targetOutputs: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(result.sourceMode).toBe("official_floor_system");
    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdmtxn01_dry_clt_lab_2026");
    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(result.impact?.LnW).toBe(50);
    expect(result.impact?.LnWPlusCI).toBe(49);
    expect(result.impact?.LPrimeNW).toBe(52);
    expect(result.impact?.LPrimeNTw).toBe(50);
    expect(result.impact?.LPrimeNT50).toBe(49);
    expect(result.impact?.guideEstimateProfile).toBe("tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd");
    expect(result.impact?.guideEstimateHdCorrectionDb).toBe(-2);
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe("estimated_local_guide_tr_simple_method_lnwci_plus_k_plus_hd");
  });

  it("resolves a bound-only curated floor-system id and can carry field-side upper bounds", () => {
    const result = calculateImpactOnly([], {
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w"],
      officialFloorSystemId: "ubiq_fl32_steel_200_lab_2026"
    });

    expect(result.sourceMode).toBe("official_floor_system");
    expect(result.boundFloorSystemMatch?.system.id).toBe("ubiq_fl32_steel_200_lab_2026");
    expect(result.lowerBoundImpact?.basis).toBe("mixed_bound_plus_estimated_standardized_field_volume_normalization");
    expect(result.lowerBoundImpact?.LnWUpperBound).toBe(53);
    expect(result.lowerBoundImpact?.LPrimeNWUpperBound).toBe(55);
    expect(result.lowerBoundImpact?.LPrimeNTwUpperBound).toBe(53);
    expect(result.floorCarrier?.Rw).toBe(62);
    expect(result.floorSystemRatings?.Rw).toBe(62);
    expect(result.floorSystemRatings?.basis).toBe("official_floor_system_bound_support");
    expect(result.impactPredictorStatus?.matchedFloorSystemId).toBe("ubiq_fl32_steel_200_lab_2026");
    expect(result.impactPredictorStatus?.lowerBoundImpact?.LnWUpperBound).toBe(53);
    expect(result.impactPredictorStatus?.warnings.some((warning: string) => /conservative upper-bound/i.test(warning))).toBe(true);
    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.supportedImpactOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);
    expect(result.unsupportedImpactOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);
  });

  it("collapses the lightweight-steel missing-support-form bound when both official families publish the same 200 mm support envelope", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: { thicknessMm: 200 },
        floatingScreed: {
          materialClass: "inex_floor_panel",
          thicknessMm: 19
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "engineered_timber_with_acoustic_underlay",
          thicknessMm: 20
        },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 65,
          boardLayerCount: 2,
          boardThicknessMm: 16,
          boardMaterialClass: "firestop_board"
        }
      },
      targetOutputs: ["Rw", "Ln,w"]
    });

    expect(result.boundFloorSystemMatch).toBeNull();
    expect(result.boundFloorSystemEstimate?.kind).toBe("bound_interpolation");
    expect(result.lowerBoundImpact?.basis).toBe("predictor_lightweight_steel_bound_interpolation_estimate");
    expect(result.lowerBoundImpact?.LnWUpperBound).toBe(53);
    expect(result.floorCarrier?.Rw).toBe(62);
    expect(result.floorSystemRatings?.RwCtr).toBe(56);
    expect(result.boundFloorSystemEstimate?.sourceSystems.map((system: { id: string }) => system.id)).toEqual([
      "ubiq_fl32_steel_200_lab_2026",
      "ubiq_fl33_open_web_steel_200_lab_2026"
    ]);
    expect(result.warnings.some((warning: string) => /support form was left unspecified/i.test(warning))).toBe(false);
  });

  it("resolves a direct official impact-product row without needing visible floor layers", () => {
    const result = calculateImpactOnly([], {
      officialImpactCatalogId: "regupol_sonus_curve_8_tile_match_2026"
    });

    expect(result.sourceMode).toBe("official_product_catalog");
    expect(result.impactCatalogMatch?.catalog.id).toBe("regupol_sonus_curve_8_tile_match_2026");
    expect(result.impact?.basis).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.LnW).toBe(50);
    expect(result.impact?.DeltaLw).toBe(26);
    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("regupol_sonus_curve_8_tile_match_2026");
    expect(result.impactSupport?.notes.some((note: string) => /official catalog match data/i.test(note))).toBe(true);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_exact_match_official");
  });

  it("keeps official DeltaLw catalog provenance separate from explicit heavy-reference input", () => {
    const result = calculateImpactOnly([], {
      officialImpactCatalogId: "getzner_afm29_catalog_2026",
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.sourceMode).toBe("official_product_catalog");
    expect(result.impactCatalogMatch?.catalog.id).toBe("getzner_afm29_catalog_2026");
    expect(result.impact?.basis).toBe("predictor_catalog_product_delta_official");
    expect(result.impact?.DeltaLw).toBe(29);
    expect(result.impact?.LnW).toBe(49);
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_product_delta_official");
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_catalog_product_delta_heavy_reference_derived");
  });

  it("rejects official product-delta catalog support when explicit dynamic stiffness conflicts with the matched product", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 140,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "getzner_afm_26",
          dynamicStiffnessMNm3: 35,
          thicknessMm: 10
        },
        floorCovering: {
          mode: "delta_lw_catalog"
        }
      },
      targetOutputs: ["DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId ?? "").toBe("");
    expect(Number.isFinite(Number(result.impact?.DeltaLw))).toBe(false);
    expect(result.supportedImpactOutputs).toEqual([]);
    expect(result.unsupportedImpactOutputs).toEqual(["DeltaLw"]);
  });

  it("keeps product-delta catalog support fail-closed outside explicit delta catalog mode", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 140,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "getzner_afm_29",
          dynamicStiffnessMNm3: 10,
          thicknessMm: 10
        },
        floorCovering: {
          mode: "material_layer",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId ?? "").toBe("");
    expect(Number.isFinite(Number(result.impact?.DeltaLw))).toBe(false);
    expect(result.supportedImpactOutputs).toEqual([]);
    expect(result.unsupportedImpactOutputs).toEqual(["DeltaLw"]);
  });

  it("matches official product-delta support with product identity alone when dynamic stiffness is omitted", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 140,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "getzner_afm_26",
          thicknessMm: 10
        },
        floorCovering: {
          mode: "delta_lw_catalog"
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("getzner_afm26_catalog_2026");
    expect(result.impact?.basis).toBe("predictor_catalog_product_delta_official");
    expect(result.impact?.LnW).toBe(52);
    expect(result.impact?.DeltaLw).toBe(26);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_catalog_product_delta_heavy_reference_derived");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_product_delta_official");
  });

  it("keeps exact lab Ln,w primary while filling missing DeltaLw from compatible product-delta support", () => {
    const result = calculateImpactOnly([], {
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 140,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "getzner_afm_29",
          dynamicStiffnessMNm3: 10,
          thicknessMm: 10
        },
        floorCovering: {
          mode: "delta_lw_catalog"
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("getzner_afm29_catalog_2026");
    expect(result.impact?.basis).toBe("exact_source_band_curve_iso7172");
    expect(result.impact?.LnW).toBe(53);
    expect(result.impact?.DeltaLw).toBe(29);
    expect(result.impact?.metricBasis?.LnW).toBe("exact_source_band_curve_iso7172");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_product_delta_official");
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
  });

  it("keeps exact source DeltaLw primary over product-property catalog support", () => {
    const result = calculateImpactOnly([], {
      exactImpactSource: {
        ...EXACT_IMPACT_SOURCE_19,
        companionRatings: {
          DeltaLw: 18
        }
      },
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 140,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "getzner_afm_29",
          dynamicStiffnessMNm3: 10,
          thicknessMm: 10
        },
        floorCovering: {
          mode: "delta_lw_catalog"
        }
      },
      targetOutputs: ["DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("getzner_afm29_catalog_2026");
    expect(result.impact?.basis).toBe("exact_source_band_curve_iso7172");
    expect(result.impact?.DeltaLw).toBe(18);
    expect(result.impact?.metricBasis?.DeltaLw).toBe("exact_source_rating_override");
    expect(result.supportedImpactOutputs).toEqual(["DeltaLw"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
  });

  it("matches an exact official product-system row from predictor input even when heavy concrete support is only implied by the base slab", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_curve_8",
          thicknessMm: 8
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 30,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("regupol_sonus_curve_8_tile_match_2026");
    expect(result.impact?.basis).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.LnW).toBe(50);
    expect(result.impact?.DeltaLw).toBe(26);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_exact_match_official");
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("falls back to the narrow heavy-floor estimate when the covering class is missing", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_curve_8",
          thicknessMm: 8
        },
        floorCovering: {
          mode: "material_layer",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId ?? "").toBe("");
    expect(result.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.LnW).toBe(59.1);
    expect(result.impact?.DeltaLw).toBe(15.5);
    expect(result.impactPredictorStatus?.notes.some((note: string) => /annex c style relation/i.test(note))).toBe(true);
  });

  it("falls back to the narrow heavy-floor estimate when the covering class conflicts with the official match", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_curve_8",
          thicknessMm: 8
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "vinyl_flooring",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId ?? "").toBe("");
    expect(result.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.LnW).toBe(61.1);
    expect(result.impact?.DeltaLw).toBe(13.5);
  });

  it("matches the porcelain planned-scope row only with the verified porcelain covering class", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_multi_4_5",
          thicknessMm: 4.5
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "porcelain_tile",
          thicknessMm: 10,
          densityKgM3: 2200
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("regupol_sonus_multi_45_porcelain_match_2026");
    expect(result.impact?.basis).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.LnW).toBe(61);
    expect(result.impact?.DeltaLw).toBe(17);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_exact_match_official");
  });

  it("keeps lower-bound wet-screed support visible on the impact-only route while the live metric stays on the narrow heavy-floor lane", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 140,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_curve_8",
          thicknessMm: 8,
          dynamicStiffnessMNm3: 30
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 70,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "none"
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("regupol_sonus_curve_8_wet_screed_lower_bound_2026");
    expect(result.impactPredictorStatus?.lowerBoundImpact?.DeltaLwLowerBound).toBe(22);
    expect(result.impactPredictorStatus?.lowerBoundImpact?.LnWUpperBound).toBe(56);
    expect(result.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.LnW).toBe(47.9);
    expect(result.impact?.DeltaLw).toBe(27.7);
    expect(result.impactPredictorStatus?.notes.some((note: string) => /lower-bound catalog support/i.test(note))).toBe(true);
    expect(result.impactSupport?.notes.some((note: string) => /annex c style estimate/i.test(note))).toBe(true);
  });

  it("keeps near-miss predictor input on the narrow heavy-floor estimate instead of fabricating catalog-backed outputs", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_curve_8",
          thicknessMm: 8
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 35,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId ?? "").toBe("");
    expect(result.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.LnW).toBe(49.6);
    expect(result.impact?.DeltaLw).toBe(25);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("keeps an exact predictor product-system row lab-side first while carrying field-side derivatives", () => {
    const result = calculateImpactOnly([], {
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 32
      },
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_curve_8",
          thicknessMm: 8
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 30,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("regupol_sonus_curve_8_tile_match_2026");
    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(result.impact?.LnW).toBe(50);
    expect(result.impact?.DeltaLw).toBe(26);
    expect(result.impact?.LPrimeNW).toBe(52);
    expect(result.impact?.LPrimeNTw).toBe(51.9);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_lnw_plus_k");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe("estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume");
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
    expect(result.impactPredictorStatus?.notes.some((note: string) => /lab-side first/i.test(note))).toBe(true);
  });

  it("can resolve the narrow heavy concrete formula path from dedicated source layers while preserving a gap-only visible stack", () => {
    const result = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      sourceLayers: [
        { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
        { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
      ]
    });

    expect(result.sourceMode).toBe("source_layers");
    expect(result.visibleLayers).toHaveLength(1);
    expect(result.sourceLayers).toHaveLength(4);
    expect(result.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.LnW).toBe(50.3);
    expect(result.impact?.DeltaLw).toBe(24.3);
    expect(result.floorSystemRatings?.basis).toBe("predictor_heavy_concrete_floor_airborne_companion_estimate");
    expect(result.floorSystemRatings?.Rw).toBeGreaterThan(0);
    expect(result.impactPredictorStatus?.implementedFormulaEstimate).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /Annex C style estimate/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /164 - 35 log10\(m'base\)/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /13 log10\(m'load\) - 14\.2 log10\(s'\) \+ 20\.8/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /f0 .* sqrt\(s'\/m'load\)/i.test(note))).toBe(true);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
  });

  it("promotes visible heavy floating floor-role stacks to the richer predictor family lane when it adds support", () => {
    const result = calculateImpactOnly(
      [
        { materialId: "concrete", thicknessMm: 150, floorRole: "base_structure" },
        { materialId: "generic_resilient_underlay_s30", thicknessMm: 8, floorRole: "resilient_layer" },
        { materialId: "screed", thicknessMm: 30, floorRole: "floating_screed" },
        { materialId: "ceramic_tile", thicknessMm: 8, floorRole: "floor_covering" }
      ],
      {
        targetOutputs: ["Ln,w", "Rw"]
      }
    );

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.impact?.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(result.impact?.LnW).toBe(50);
    expect(result.floorSystemRatings?.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(result.floorSystemRatings?.Rw).toBe(58);
    expect(result.impactPredictorStatus?.inputMode).toBe("derived_from_visible_layers");
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "Rw"]);
    expect(result.impactSupport?.notes.some((note: string) => /Published floor-system family estimate is active: reinforced concrete/i.test(note))).toBe(true);
  });

  it("can auto-derive predictor topology from visible floor-role layers on the impact-only route", () => {
    const result = calculateImpactOnly(
      [
        { materialId: "engineered_timber_structural", thicknessMm: 240, floorRole: "base_structure" },
        { materialId: "engineered_timber_flooring", thicknessMm: 15, floorRole: "floor_covering" },
        { materialId: "glasswool", thicknessMm: 90, floorRole: "ceiling_fill" },
        { materialId: "firestop_board", thicknessMm: 13, floorRole: "ceiling_board" }
      ],
      {
        targetOutputs: ["Ln,w", "Rw"]
      }
    );

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemMatch?.system.id).toBe("knauf_ct30_1a_timber_lab_2026");
    expect(result.impact?.basis).toBe("official_floor_system_exact_match");
    expect(result.impact?.LnW).toBe(73);
    expect(result.floorSystemRatings?.Rw).toBe(48);
    expect(result.impactPredictorStatus?.inputMode).toBe("derived_from_visible_layers");
    expect(result.impactPredictorStatus?.notes.some((note: string) => /derived from visible floor-role layers/i.test(note))).toBe(
      true
    );
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "Rw"]);
  });

  it("marks field-side guide outputs as supported only when the impact-only lane can actually derive them", () => {
    const result = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50", "IIC"]
    });

    expect(result.impact?.LPrimeNW).toBe(55);
    expect(result.impact?.LPrimeNTw).toBe(53);
    expect(result.impact?.LPrimeNT50).toBe(52);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(result.unsupportedImpactOutputs).toEqual(["IIC"]);
  });

  it("can re-rate impact-only exact bands through the direct+flanking field path branch", () => {
    const result = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
      impactFieldContext: DIRECT_FLANKING_FIELD_CONTEXT,
      targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(result.sourceMode).toBe("exact_band_source");
    expect(result.impact?.fieldEstimateProfile).toBe("direct_flanking_energy_sum");
    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_direct_flanking_energy_sum");
    expect(result.impact?.LnW).toBe(53);
    expect(result.impact?.LPrimeNW).toBe(55);
    expect(result.impact?.LPrimeNTw).toBe(53);
    expect(result.impact?.LPrimeNT50).toBe(52);
    expect(result.impact?.fieldEstimateDirectOffsetDb).toBe(1);
    expect(result.impact?.fieldEstimateFlankingPathCount).toBe(2);
    expect(result.impact?.fieldEstimateExpertPathModifierCount).toBe(2);
    expect(result.impact?.fieldEstimateFlankingFamilyModels).toEqual(["reinforced_concrete"]);
    expect(result.impact?.fieldEstimateFlankingPathModifiersDb).toEqual([0.9, 3.5]);
    expect(result.impact?.fieldEstimateLowerTreatmentReductionDb).toBe(2);
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_direct_flanking_energy_sum");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe(
      "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume"
    );
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe(
      "estimated_standardized_field_lpriment50_from_direct_flanking_energy_sum_plus_ci50_2500"
    );
    expect(result.impactSupport?.primaryCurveType).toBe("impact_curve");
    expect(result.impactSupport?.primaryCurveUnaffected).toBe(false);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /direct\+flanking path energy sum/i.test(note))).toBe(
      true
    );
    expect(result.impactSupport?.formulaNotes.some((note: string) => /Current direct-path offset is 1 dB/i.test(note))).toBe(
      true
    );
    expect(result.impactSupport?.formulaNotes.some((note: string) => /Family-aware flanking path models were applied for: reinforced concrete/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /ΔLd = 2 dB was applied to the direct path before energy summation/i.test(note))).toBe(true);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
    expect(result.warnings.some((warning: string) => /Impact-only direct\+flanking field path is active/i.test(warning))).toBe(
      true
    );
  });

  it("can infer the default supporting family from an exact floor row on the impact-only direct+flanking lane", () => {
    const result = calculateImpactOnly([{ materialId: "concrete", thicknessMm: 140 }], {
      impactFieldContext: {
        directPathOffsetDb: 1,
        flankingPaths: [
          {
            id: "edge_path",
            pathType: "edge",
            levelOffsetDb: -6,
            pathCount: 1,
            junctionLengthM: 4,
            edgeIsolationClass: "rigid",
            shortCircuitRisk: "high",
            kijDb: 2
          }
        ]
      },
      officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
      targetOutputs: ["L'n,w"]
    });

    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_direct_flanking_energy_sum");
    expect(result.impact?.LPrimeNW).toBe(44);
    expect(result.impact?.fieldEstimateFlankingFamilyModels).toEqual(["open_box_timber"]);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /Family-aware flanking path models were applied for: open box timber/i.test(note))).toBe(true);
  });

  it("applies explicit ΔLd before the impact-only guide-side K correction and field standardization", () => {
    const result = calculateImpactOnly([{ materialId: "concrete", thicknessMm: 140 }], {
      impactFieldContext: {
        fieldKDb: 2,
        lowerTreatmentReductionDb: 6,
        receivingRoomVolumeM3: 50
      },
      officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
      targetOutputs: ["L'n,w", "L'nT,w"]
    });

    expect(result.impact?.fieldEstimateProfile).toBe("explicit_field_lprimenw_from_lnw_plus_k");
    expect(result.impact?.fieldEstimateKCorrectionDb).toBe(2);
    expect(result.impact?.fieldEstimateLowerTreatmentReductionDb).toBe(6);
    expect(result.impact?.LPrimeNW).toBe(35);
    expect(result.impact?.LPrimeNTw).toBe(33);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /L'n,w = Ln,w \+ K/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /ΔLd = 6 dB was applied before the field-side K correction/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /applied before field standardization/i.test(note))).toBe(true);
  });

  it("can resolve the heavy floating-floor formula directly from predictor input with no visible stack topology", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          dynamicStiffnessMNm3: 30,
          thicknessMm: 8
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 30,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.LnW).toBe(50.3);
    expect(result.impact?.DeltaLw).toBe(24.3);
    expect(result.sourceLayers).toHaveLength(4);
    expect(result.sourceLayers.at(-1)?.material.id).toBe("concrete");
  });

  it("resolves explicit DeltaLw heavy-reference input before falling back to predictor family estimates", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 140,
          densityKgM3: 2400
        },
        resilientLayer: {
          dynamicStiffnessMNm3: 20,
          thicknessMm: 10
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 50,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "delta_lw_catalog",
          deltaLwDb: 26
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.impact?.basis).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result.impact?.LnW).toBe(52);
    expect(result.impact?.DeltaLw).toBe(26);
    expect(result.impact?.bareReferenceLnW).toBe(78);
    expect(result.impact?.treatedReferenceLnW).toBe(52);
    expect(result.impact?.referenceFloorType).toBe("heavy_standard");
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_explicit_delta_user_input");
    expect(result.floorSystemEstimate).toBeNull();
    expect(result.boundFloorSystemEstimate).toBeNull();
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
  });

  it("keeps explicit DeltaLw heavy-reference input primary when a product id would otherwise trigger product-delta catalog support", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 140,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "getzner_afm_29",
          dynamicStiffnessMNm3: 10,
          thicknessMm: 10
        },
        floorCovering: {
          mode: "delta_lw_catalog",
          deltaLwDb: 24
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId ?? "").toBe("");
    expect(result.impact?.basis).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result.impact?.LnW).toBe(54);
    expect(result.impact?.DeltaLw).toBe(24);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_explicit_delta_user_input");
  });

  it("keeps explicit DeltaLw heavy-reference input lab-side when field context is present", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 140,
          densityKgM3: 2400
        },
        resilientLayer: {
          dynamicStiffnessMNm3: 20,
          thicknessMm: 10
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 50,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "delta_lw_catalog",
          deltaLwDb: 26
        }
      },
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
    });

    expect(result.impact?.basis).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result.impact?.LnW).toBe(52);
    expect(result.impact?.DeltaLw).toBe(26);
    expect(result.impact?.LPrimeNW).toBeUndefined();
    expect(result.impact?.LPrimeNTw).toBeUndefined();
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedImpactOutputs).toEqual(["L'n,w", "L'nT,w"]);
  });

  it("can resolve the published composite-panel dry-floor interaction estimate from predictor input", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "composite_panel",
        impactSystemType: "dry_floating_floor",
        baseSlab: {
          thicknessMm: 65
        },
        resilientLayer: {
          thicknessMm: 12
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "dry_floating_gypsum_fiberboard",
          thicknessMm: 20,
          densityKgM3: 900
        }
      },
      targetOutputs: ["Ln,w"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.impact?.basis).toBe("predictor_composite_panel_published_interaction_estimate");
    expect(result.impact?.LnW).toBe(69.4);
    expect(result.floorSystemRatings?.Rw).toBe(45.1);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "pmc_m1_dry_floating_floor_lab_2026",
      "pmc_m1_bare_composite_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedFormulaEstimate).toBe(false);
  });

  it("can resolve the published heavy-concrete upper-treatment estimate when predictor input omits dynamic stiffness", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          thicknessMm: 8
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 30,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["Ln,w"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.impact?.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(result.impact?.LnW).toBe(50);
    expect(result.floorSystemRatings?.Rw).toBe(58);
    expect(result.floorSystemRatings?.RwCtr).toBe(-6.7);
    expect(result.impact?.estimateCandidateIds).toEqual(["regupol_curve8_concrete_tile_lab_2026"]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedFormulaEstimate).toBe(true);
  });

  it("can resolve curated floor-system ids through predictor input without fabricating visible source layers", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "mass_timber_clt",
        officialFloorSystemId: "dataholz_gdmtxn01_dry_clt_lab_2026"
      }
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdmtxn01_dry_clt_lab_2026");
    expect(result.impact?.LnW).toBe(50);
    expect(result.sourceLayers).toHaveLength(0);
  });

  it("can drive the open-web steel interpolation lane from predictor input", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "open_web_or_rolled",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: {
          thicknessMm: 250
        },
        floatingScreed: {
          thicknessMm: 19
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "engineered_timber_with_acoustic_underlay",
          thicknessMm: 20
        },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 75,
          cavityFillThicknessMm: 145,
          boardLayerCount: 3,
          boardThicknessMm: 16,
          boardMaterialClass: "fire_board"
        }
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.impact.basis).toBe("predictor_lightweight_steel_fl28_interpolation_estimate");
    expect(result.impact?.LnW).toBe(51.4);
    expect(result.impact?.CI).toBe(-1.6);
    expect(result.impact?.LnWPlusCI).toBe(49.8);
    expect(result.floorSystemRatings?.basis).toBe("predictor_lightweight_steel_fl28_interpolation_estimate");
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("can resolve a near-match Knauf concrete timber-underlay stack on the concrete archetype lane", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 165,
          densityKgM3: 2400
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "engineered_timber_with_acoustic_underlay",
          thicknessMm: 18,
          densityKgM3: 900
        },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 110,
          cavityFillThicknessMm: 60,
          boardLayerCount: 2,
          boardThicknessMm: 13,
          boardMaterialClass: "firestop_board"
        }
      },
      targetOutputs: ["Ln,w", "Rw", "Ctr"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(51);
    expect(result.floorSystemRatings?.Rw).toBe(63);
    expect(result.floorSystemRatings?.RwCtr).toBe(57);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("can resolve a near-match Knauf concrete tile-ceiling stack on the concrete tile archetype lane", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 205,
          densityKgM3: 2400
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 8,
          densityKgM3: 2000
        },
        lowerTreatment: {
          type: "suspended_ceiling_rigid_hanger",
          cavityDepthMm: 310,
          cavityFillThicknessMm: 50,
          boardLayerCount: 2,
          boardThicknessMm: 13,
          boardMaterialClass: "firestop_board",
          supportClass: "furred_channels"
        }
      },
      targetOutputs: ["Ln,w", "Rw", "Ctr"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(45);
    expect(result.floorSystemRatings?.Rw).toBe(69);
    expect(result.floorSystemRatings?.RwCtr).toBe(64);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("can resolve a near-match Knauf concrete tile-underlay ceiling stack on the combined concrete tile archetype lane", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 205,
          densityKgM3: 2400
        },
        resilientLayer: {
          thicknessMm: 5
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 8,
          densityKgM3: 2000
        },
        lowerTreatment: {
          type: "suspended_ceiling_rigid_hanger",
          cavityDepthMm: 310,
          cavityFillThicknessMm: 50,
          boardLayerCount: 2,
          boardThicknessMm: 13,
          boardMaterialClass: "firestop_board",
          supportClass: "furred_channels"
        }
      },
      targetOutputs: ["Ln,w", "Rw", "Ctr", "DeltaLw"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(45);
    expect(result.impact?.DeltaLw).toBeUndefined();
    expect(result.floorSystemRatings?.Rw).toBe(69);
    expect(result.floorSystemRatings?.RwCtr).toBe(64);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"
    ]);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w"]);
    expect(result.unsupportedImpactOutputs).toEqual(["DeltaLw"]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("can resolve the Knauf timber archetype predictor lane from direct-fixed predictor input", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: {
          thicknessMm: 240
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "engineered_timber"
        },
        lowerTreatment: {
          type: "direct_fixed_ceiling",
          cavityFillThicknessMm: 45,
          boardLayerCount: 1,
          boardThicknessMm: 12,
          boardMaterialClass: "impactstop_board",
          supportClass: "furred_channels"
        }
      },
      targetOutputs: ["Ln,w"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(69.6);
    expect(result.floorSystemRatings?.Rw).toBe(51.2);
    expect(result.floorSystemRatings?.RwCtr).toBe(44.9);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_ct2g_timber_nil_lab_2026",
      "knauf_ct2g_timber_r25_lab_2026",
      "knauf_ct2h_timber_nil_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("can resolve the Knauf timber broader family lane from ceramic direct-ceiling predictor input", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: {
          thicknessMm: 240
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 8,
          densityKgM3: 2000
        },
        lowerTreatment: {
          type: "direct_fixed_ceiling",
          cavityFillThicknessMm: 90,
          boardLayerCount: 1,
          boardThicknessMm: 13,
          boardMaterialClass: "firestop_board",
          supportClass: "furred_channels"
        }
      },
      targetOutputs: ["Ln,w"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.impact?.LnW).toBe(69.3);
    expect(result.floorSystemRatings?.Rw).toBe(53);
    expect(result.floorSystemRatings?.RwCtr).toBe(46);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_ct30_1b_timber_lab_2026",
      "knauf_ct30_2b_timber_lab_2026",
      "knauf_ct30_1a_timber_lab_2026",
      "knauf_ct2d_timber_r25_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("can resolve the Dataholz wet CLT family lane from heavy floating predictor input", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "mass_timber_clt",
        impactSystemType: "heavy_floating_floor",
        baseSlab: {
          thicknessMm: 155
        },
        resilientLayer: {
          thicknessMm: 35,
          dynamicStiffnessMNm3: 8
        },
        upperFill: {
          materialClass: "non_bonded_chippings",
          thicknessMm: 110,
          densityKgM3: 1800
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 65,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(41.9);
    expect(result.impact?.CI).toBe(-1);
    expect(result.impact?.LnWPlusCI).toBe(40.9);
    expect(result.floorSystemRatings?.Rw).toBe(76.1);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "dataholz_gdmnxn06_fill_clt_lab_2026",
      "dataholz_gdmnxn05_wet_clt_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("can resolve the higher-performance TUAS open-box dry-floor lane instead of collapsing to the weaker open-box estimate", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "open_box_timber",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: {
          thicknessMm: 370
        },
        resilientLayer: {
          thicknessMm: 3,
          dynamicStiffnessMNm3: 64
        },
        upperFill: {
          materialClass: "generic_fill",
          thicknessMm: 50
        },
        floatingScreed: {
          materialClass: "dry_floating_gypsum_fiberboard",
          thicknessMm: 60
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "laminate_flooring",
          thicknessMm: 8
        },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityFillThicknessMm: 100,
          boardLayerCount: 2,
          boardThicknessMm: 13
        }
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI", "Rw"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(39);
    expect(result.impact?.CI).toBe(2);
    expect(result.impact?.LnWPlusCI).toBe(41);
    expect(result.floorSystemRatings?.Rw).toBe(75);
    expect(result.floorSystemRatings?.RwCtr).toBe(66.84359068531064);
    expect(result.impact?.estimateCandidateIds).toEqual(["tuas_r5b_open_box_timber_measured_2026"]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("can resolve an under-described Dataholz dry CLT stack on the broader same-family lane", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "mass_timber_clt",
        impactSystemType: "dry_floating_floor",
        baseSlab: {
          thicknessMm: 145
        },
        resilientLayer: {
          thicknessMm: 20
        },
        upperFill: {
          materialClass: "generic_fill",
          thicknessMm: 70
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "dry_floating_gypsum_fiberboard",
          thicknessMm: 22
        }
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI", "Rw"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("predictor_mass_timber_clt_dataholz_dry_estimate");
    expect(result.impact?.LnW).toBe(50);
    expect(result.impact?.CI).toBe(-1);
    expect(result.impact?.LnWPlusCI).toBe(49);
    expect(result.floorSystemRatings?.Rw).toBe(62);
    expect(result.impact?.estimateCandidateIds).toEqual(["dataholz_gdmtxn01_dry_clt_lab_2026"]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("can resolve the broader UBIQ steel family lane from carpeted open-web predictor input", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "open_web_or_rolled",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: {
          thicknessMm: 300
        },
        floatingScreed: {
          thicknessMm: 19
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "carpet_with_foam_underlay",
          thicknessMm: 8
        },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 65,
          cavityFillThicknessMm: 145,
          boardLayerCount: 3,
          boardThicknessMm: 16
        }
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.impact?.LnW).toBe(51);
    expect(result.impact?.CI).toBe(-1.7);
    expect(result.impact?.LnWPlusCI).toBe(49.3);
    expect(result.floorSystemRatings?.Rw).toBe(63.7);
    expect(result.floorSystemRatings?.RwCtr).toBe(58.4);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      "ubiq_fl28_open_web_steel_400_exact_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("can resolve the Dataholz dry timber upper-only family lane from under-described predictor input", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "dry_floating_floor",
        baseSlab: {
          thicknessMm: 220
        },
        resilientLayer: {
          thicknessMm: 30
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "dry_floating_gypsum_fiberboard",
          thicknessMm: 25,
          densityKgM3: 1100
        }
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.impact?.LnW).toBe(60);
    expect(result.impact?.CI).toBe(2);
    expect(result.impact?.LnWPlusCI).toBe(62);
    expect(result.floorSystemRatings?.Rw).toBe(61.5);
    expect(result.floorSystemRatings?.RwCtr).toBe(-12);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "dataholz_gdrtxn01a_timber_frame_dry_lab_2026",
      "dataholz_gdrtxn02b_timber_frame_dry_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("can resolve the Dataholz dry timber integrated ceiling row as a published archetype estimate", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: {
          thicknessMm: 200
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "dry_floating_gypsum_fiberboard",
          thicknessMm: 65
        },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 60,
          cavityFillThicknessMm: 200,
          boardLayerCount: 1,
          boardThicknessMm: 15
        }
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI", "Rw", "Ctr"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(52);
    expect(result.impact?.CI).toBe(1);
    expect(result.impact?.LnWPlusCI).toBe(53);
    expect(result.floorSystemRatings?.Rw).toBe(66);
    expect(result.floorSystemRatings?.RwCtr).toBe(-15);
    expect(result.impact?.estimateCandidateIds).toEqual(["dataholz_gdrtxa06a_timber_frame_dry_lab_2026"]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("keeps open-web steel suspended-only predictor input on the narrower UBIQ family-general lane", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "open_web_or_rolled",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { thicknessMm: 250 },
        floorCovering: {
          mode: "material_layer",
          materialClass: "vinyl_flooring",
          thicknessMm: 3,
          densityKgM3: 1400
        },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 120,
          cavityFillThicknessMm: 100,
          boardLayerCount: 2,
          boardThicknessMm: 16
        }
      },
      targetOutputs: ["Ln,w"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.impact?.LnW).toBe(51);
    expect(result.impact?.CI).toBe(-1.7);
    expect(result.impact?.LnWPlusCI).toBe(49.3);
    expect(result.floorSystemRatings?.Rw).toBe(63.1);
    expect(result.floorSystemRatings?.RwCtr).toBe(57.7);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "ubiq_fl33_open_web_steel_200_lab_2026",
      "ubiq_fl33_open_web_steel_300_lab_2026",
      "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      "ubiq_fl28_open_web_steel_400_exact_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("keeps joist-or-purlin steel suspended-only predictor input on the narrower Pliteq family lane", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "joist_or_purlin",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { thicknessMm: 250, densityKgM3: 7850 },
        floorCovering: {
          mode: "material_layer",
          materialClass: "vinyl_flooring",
          thicknessMm: 3,
          densityKgM3: 1400
        },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 120,
          cavityFillThicknessMm: 100,
          boardLayerCount: 2,
          boardThicknessMm: 16,
          boardMaterialClass: "firestop_board"
        }
      },
      targetOutputs: ["Ln,w", "Rw", "Ctr"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.impact?.LnW).toBe(58);
    expect(result.floorSystemRatings?.Rw).toBe(60);
    expect(result.floorSystemRatings?.RwCtr).toBeUndefined();
    expect(result.impact?.estimateCandidateIds).toEqual([
      "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
      "pliteq_steel_joist_250_rst02_wood_lab_2026",
      "pliteq_steel_joist_250_rst12_porcelain_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ctr"]);
  });

  it("keeps bare timber laminate predictor input on the upstream low-confidence fallback lane", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "bare_floor",
        baseSlab: {
          thicknessMm: 240
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "laminate_flooring",
          thicknessMm: 9,
          densityKgM3: 850
        }
      },
      targetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(result.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(result.impact?.LnW).toBe(70.4);
    expect(result.impact?.CI).toBeUndefined();
    expect(result.impact?.LnWPlusCI).toBeUndefined();
    expect(result.floorSystemRatings).toBeNull();
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_ct2g_timber_nil_lab_2026",
      "knauf_ct2h_timber_nil_lab_2026",
      "knauf_ct3b_timber_nil_lab_2026",
      "knauf_ct2a_timber_nil_lab_2026",
      "knauf_ct2d_timber_nil_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(true);
    expect(result.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "Ctr", "CI", "Ln,w+CI"]);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w"]);
    expect(result.unsupportedImpactOutputs).toEqual(["CI", "Ln,w+CI"]);
    expect(result.warnings).toContain(
      "Low-confidence timber bare-floor predictor support is currently impact-only. DynEcho kept proxy airborne companions hidden instead of presenting nil-ceiling family rows as supported Rw / Ctr outputs."
    );
  });

  it("keeps direct-to-joists timber ceramic predictor input on the narrower Knauf family-general lane", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        supportForm: "joist_or_purlin",
        impactSystemType: "suspended_ceiling_only",
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 10
        },
        lowerTreatment: {
          type: "direct_fixed_ceiling",
          supportClass: "direct_to_joists",
          boardMaterialClass: "firestop_board"
        }
      },
      targetOutputs: ["Ln,w", "Rw", "Ctr"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.impact?.LnW).toBe(69.9);
    expect(result.floorSystemRatings?.Rw).toBe(51.8);
    expect(result.floorSystemRatings?.RwCtr).toBe(45.1);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_ct30_1a_timber_lab_2026",
      "knauf_ct30_2a_timber_lab_2026",
      "knauf_ct30_1b_timber_lab_2026",
      "knauf_ct30_2b_timber_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("keeps reinforced-concrete combined predictor input on the narrower family-general lane", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: { materialClass: "heavy_concrete", thicknessMm: 180, densityKgM3: 2400 },
        resilientLayer: { thicknessMm: 8, dynamicStiffnessMNm3: 35 },
        floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 3, densityKgM3: 1400 },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 120,
          cavityFillThicknessMm: 100,
          boardLayerCount: 2,
          boardThicknessMm: 16
        }
      },
      targetOutputs: ["Ln,w"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.impact?.LnW).toBe(50);
    expect(result.floorSystemRatings?.Rw).toBe(65.9);
    expect(result.floorSystemRatings?.RwCtr).toBe(57);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
      "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
      "euracoustics_f1_rigid_ceiling_concrete_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("promotes composite suspended-ceiling predictor input onto the published interaction lane", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "composite_panel",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { materialClass: "composite_steel_deck", thicknessMm: 150, densityKgM3: 2350 },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 150,
          cavityFillThicknessMm: 100,
          boardLayerCount: 2,
          boardThicknessMm: 16
        }
      },
      targetOutputs: ["Ln,w"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.basis).toBe("predictor_composite_panel_published_interaction_estimate");
    expect(result.impact?.LnW).toBe(63.3);
    expect(result.floorSystemRatings?.Rw).toBe(48.6);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "pmc_m1_dry_floating_plus_c2x_lab_2026",
      "pmc_m1_dry_floating_plus_c1x_lab_2026",
      "pmc_m1_bare_composite_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("promotes near-match hollow-core resilient-cover ceiling stacks onto the combined published-family lane", () => {
    const result = calculateImpactOnly([
      { materialId: "hollow_core_plank", thicknessMm: 210, floorRole: "base_structure" },
      { materialId: "geniemat_rst05", thicknessMm: 5, floorRole: "resilient_layer" },
      { materialId: "vinyl_flooring", thicknessMm: 2.5, floorRole: "floor_covering" },
      { materialId: "genieclip_rst", thicknessMm: 16, floorRole: "ceiling_cavity" },
      { materialId: "gypsum_board", thicknessMm: 16, floorRole: "ceiling_board" }
    ], {
      targetOutputs: ["Ln,w", "Rw"]
    });

    expect(result.floorSystemMatch).toBeNull();
    expect(result.sourceMode).toBe("predictor_input");
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(48);
    expect(result.floorSystemRatings?.Rw).toBe(62);
    expect(result.impact?.estimateCandidateIds).toEqual(["pliteq_hcp200_vinyl_lab_2026"]);
    expect(result.impactPredictorStatus?.inputMode).toBe("derived_from_visible_layers");
    expect(result.dynamicImpactTrace?.systemType).toBe("combined_upper_lower_system");
  });

  it("emits a dynamic impact trace for exact band sources with direct+flanking field continuation", () => {
    const result = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
      impactFieldContext: DIRECT_FLANKING_FIELD_CONTEXT,
      targetOutputs: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(result.dynamicImpactTrace?.selectionKind).toBe("exact_band_source");
    expect(result.dynamicImpactTrace?.evidenceTier).toBe("exact");
    expect(result.dynamicImpactTrace?.fieldContinuation).toBe("direct_flanking_energy_sum");
    expect(result.dynamicImpactTrace?.directFlankingActive).toBe(true);
    expect(result.dynamicImpactTrace?.standardizedFieldActive).toBe(true);
    expect(result.dynamicImpactTrace?.availableMetricLabels).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]);
  });

  it("emits a dynamic impact trace for published family estimates", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: {
          thicknessMm: 240
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 8,
          densityKgM3: 2000
        },
        lowerTreatment: {
          type: "direct_fixed_ceiling",
          cavityFillThicknessMm: 90,
          boardLayerCount: 1,
          boardThicknessMm: 13,
          boardMaterialClass: "firestop_board",
          supportClass: "furred_channels"
        }
      },
      targetOutputs: ["Ln,w"]
    });

    expect(result.dynamicImpactTrace?.selectionKind).toBe("family_estimate");
    expect(result.dynamicImpactTrace?.evidenceTier).toBe("estimate");
    expect(result.dynamicImpactTrace?.estimateTier).toBe("family_general");
    expect(result.dynamicImpactTrace?.structuralSupportType).toBe("timber_joists");
    expect(result.dynamicImpactTrace?.systemType).toBe("suspended_ceiling_only");
    expect(result.dynamicImpactTrace?.candidateRowCount).toBe(4);
    expect(result.dynamicImpactTrace?.selectedSourceIds).toEqual([
      "knauf_ct30_1b_timber_lab_2026",
      "knauf_ct30_2b_timber_lab_2026",
      "knauf_ct30_1a_timber_lab_2026",
      "knauf_ct2d_timber_r25_lab_2026"
    ]);
  });

  it("emits a dynamic impact trace for bound floor-system carry-over lanes", () => {
    const result = calculateImpactOnly([], {
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      officialFloorSystemId: "ubiq_fl32_steel_200_lab_2026",
      targetOutputs: ["Ln,w", "L'n,w", "L'nT,w"]
    });

    expect(result.dynamicImpactTrace?.selectionKind).toBe("bound_floor_system");
    expect(result.dynamicImpactTrace?.evidenceTier).toBe("bound");
    expect(result.dynamicImpactTrace?.fieldContinuation).toBe("bound_room_volume");
    expect(result.dynamicImpactTrace?.boundOnly).toBe(true);
    expect(result.dynamicImpactTrace?.matchedFloorSystemId).toBe("ubiq_fl32_steel_200_lab_2026");
    expect(result.dynamicImpactTrace?.availableMetricLabels).toEqual([
      "Ln,w upper bound",
      "L'n,w upper bound",
      "L'nT,w upper bound"
    ]);
  });
});

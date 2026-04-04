import { expect, test, type APIRequestContext } from "@playwright/test";

const TEST_USERNAME = process.env.DYNECHO_AUTH_USERNAME ?? "admin";
const TEST_PASSWORD = process.env.DYNECHO_AUTH_PASSWORD ?? "admin";

async function signIn(request: APIRequestContext) {
  const response = await request.post("/api/auth/login", {
    data: {
      nextPath: "/workbench",
      password: TEST_PASSWORD,
      username: TEST_USERNAME
    }
  });

  expect(response.ok()).toBeTruthy();
}

test("estimate api rejects unauthenticated requests", async () => {
  const baseUrl = test.info().project.use.baseURL;

  if (typeof baseUrl !== "string") {
    throw new Error("Playwright baseURL is required for the unauthenticated API check.");
  }

  const response = await fetch(`${baseUrl}/api/estimate`, {
    body: JSON.stringify({
      layers: [{ materialId: "gypsum_board", thicknessMm: 12.5 }]
    }),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });

  expect(response.status).toBe(401);

  const payload = (await response.json()) as { error?: string; ok?: boolean };

  expect(payload.ok).toBe(false);
  expect(payload.error).toBe("Authentication required.");
});

test.describe("authenticated api", () => {
  test.beforeEach(async ({ request }) => {
    await signIn(request);
  });

test("estimate api returns screening result", async ({ request }) => {
  const response = await request.post("/api/estimate", {
    data: {
      layers: [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "rockwool", thicknessMm: 50 },
        { materialId: "air_gap", thicknessMm: 50 },
        { materialId: "concrete", thicknessMm: 100 }
      ]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.metrics.method).toBe("screening_mass_law_curve_seed_v3");
  expect(payload.result.metrics.estimatedRwDb).toBeGreaterThan(30);
  expect(payload.result.metrics.estimatedStc).toBeGreaterThan(30);
  expect(typeof payload.result.metrics.estimatedCDb).toBe("number");
  expect(typeof payload.result.metrics.estimatedCtrDb).toBe("number");
  expect(payload.result.ratings.iso717.composite).toContain(String(payload.result.ratings.iso717.Rw));
  expect(payload.result.curve.frequenciesHz).toHaveLength(payload.result.curve.transmissionLossDb.length);
  expect(payload.result.layers).toHaveLength(4);
});

test("estimate api rejects invalid payload", async ({ request }) => {
  const response = await request.post("/api/estimate", {
    data: {
      layers: []
    }
  });

  expect(response.status()).toBe(400);

  const payload = await response.json();

  expect(payload.ok).toBe(false);
  expect(payload.error).toBe("Invalid estimate payload.");
});

test("estimate api exposes scoped impact metrics for supported heavy floors", async ({ request }) => {
  const response = await request.post("/api/estimate", {
    data: {
      layers: [
        { materialId: "ceramic_tile", thicknessMm: 8 },
        { materialId: "screed", thicknessMm: 50 },
        { materialId: "generic_resilient_underlay", thicknessMm: 8 },
        { materialId: "concrete", thicknessMm: 150 }
      ]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.impact).not.toBeNull();
  expect(payload.result.impact.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
  expect(payload.result.impact.LnW).toBeGreaterThan(40);
  expect(payload.result.impact.availableOutputs).toEqual(["Ln,w", "DeltaLw"]);
  expect(payload.result.impact.DeltaLw).toBe(33.4);
  expect(payload.result.impact.metricBasis).toEqual({
    DeltaLw: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
    LnW: "predictor_heavy_concrete_published_upper_treatment_estimate"
  });
  expect(payload.result.floorSystemRatings.Rw).toBe(58);
});

test("estimate api keeps official lower-bound product support alongside the live heavy-floor metric", async ({ request }) => {
  const response = await request.post("/api/estimate", {
    data: {
      layers: [
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 70 },
        { floorRole: "resilient_layer", materialId: "regupol_sonus_curve_8", thicknessMm: 8 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 140 }
      ]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.impact).not.toBeNull();
  expect(payload.result.impact.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
  expect(payload.result.impact.LnW).toBe(47.9);
  expect(payload.result.impact.DeltaLw).toBe(27.7);
  expect(payload.result.impactCatalogMatch.catalog.id).toBe("regupol_sonus_curve_8_wet_screed_lower_bound_2026");
  expect(payload.result.lowerBoundImpact.basis).toBe("predictor_catalog_lower_bound_official");
  expect(payload.result.lowerBoundImpact.LnWUpperBound).toBe(56);
  expect(payload.result.lowerBoundImpact.DeltaLwLowerBound).toBe(22);
});

test("estimate api can auto-derive predictor topology from visible floor-role layers", async ({ request }) => {
  const response = await request.post("/api/estimate", {
    data: {
      layers: [
        { materialId: "open_web_steel_joist", thicknessMm: 300, floorRole: "base_structure" },
        { materialId: "rubber_sheet", thicknessMm: 5, floorRole: "resilient_layer" },
        { materialId: "particleboard_flooring", thicknessMm: 19, floorRole: "floating_screed" },
        { materialId: "engineered_timber_flooring", thicknessMm: 15, floorRole: "floor_covering" },
        { materialId: "resilient_channel", thicknessMm: 65, floorRole: "ceiling_cavity" },
        { materialId: "glasswool", thicknessMm: 145, floorRole: "ceiling_fill" },
        { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" },
        { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" },
        { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" }
      ],
      targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.floorSystemMatch.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
  expect(payload.result.impact.LnW).toBe(51);
  expect(payload.result.impact.CI).toBe(-2);
  expect(payload.result.impact.LnWPlusCI).toBe(49);
  expect(payload.result.floorSystemRatings.Rw).toBe(64);
  expect(payload.result.floorSystemRatings.RwCtr).toBe(59);
  expect(payload.result.impactPredictorStatus.inputMode).toBe("derived_from_visible_layers");
  expect(payload.result.impactPredictorStatus.notes).toEqual(
    expect.arrayContaining([expect.stringMatching(/derived from visible floor-role layers/i)])
  );
  expect(payload.result.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
});

test("estimate api can rate an exact impact-band source without reusing the airborne lane", async ({ request }) => {
  const response = await request.post("/api/estimate", {
    data: {
      exactImpactSource: {
        frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
        labOrField: "lab",
        levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
      },
      targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "DeltaLw", "IIC"],
      layers: [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "rockwool", thicknessMm: 50 },
        { materialId: "air_gap", thicknessMm: 50 },
        { materialId: "concrete", thicknessMm: 100 }
      ]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.impact).not.toBeNull();
  expect(payload.result.impact.basis).toBe("exact_source_band_curve_iso7172");
  expect(payload.result.impact.confidence.provenance).toBe("exact_band_curve");
  expect(payload.result.impactSupport.basis).toBe("exact_source_band_curve_iso7172");
  expect(payload.result.impactSupport.primaryCurveType).toBe("airborne_tl");
  expect(payload.result.impactSupport.primaryCurveUnaffected).toBe(true);
  expect(payload.result.impactSupport.formulaNotes).toEqual(
    expect.arrayContaining([
      expect.stringMatching(/ISO 717-2 impact contour/i),
      expect.stringMatching(/Ln,w\+CI was computed as Ln,w \+ CI/i)
    ])
  );
  expect(payload.result.impact.LnW).toBe(53);
  expect(payload.result.impact.CI).toBe(-3);
  expect(payload.result.impact.CI50_2500).toBe(-1);
  expect(payload.result.impact.LnWPlusCI).toBe(50);
  expect(payload.result.impact.metricBasis.LnW).toBe("exact_source_band_curve_iso7172");
  expect(payload.result.impact.metricBasis.LnWPlusCI).toBe("exact_source_band_curve_iso7172");
  expect(payload.result.supportedTargetOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(payload.result.unsupportedTargetOutputs).toEqual(["DeltaLw", "IIC"]);
  expect(payload.result.unsupportedImpactOutputs).toEqual(["DeltaLw", "IIC"]);
  expect(payload.result.warnings.some((warning: string) => /Some requested impact sound outputs are still unavailable/i.test(warning))).toBe(true);
});

test("estimate api can re-rate exact impact bands through the direct+flanking field path lane", async ({ request }) => {
  const response = await request.post("/api/estimate", {
    data: {
      exactImpactSource: {
        frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
        labOrField: "lab",
        levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
      },
      impactFieldContext: {
        directPathOffsetDb: 1,
        flankingPaths: [
          { id: "f1", levelOffsetDb: -6, pathType: "wall", pathCount: 1, supportingElementFamily: "reinforced_concrete" },
          { id: "f2", levelOffsetDb: -10, pathType: "ceiling", pathCount: 2, kijDb: 1.5, shortCircuitRisk: "medium" }
        ],
        lowerTreatmentReductionDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      layers: [
        { materialId: "ceramic_tile", thicknessMm: 8 },
        { materialId: "screed", thicknessMm: 50 },
        { materialId: "generic_resilient_underlay", thicknessMm: 8 },
        { materialId: "concrete", thicknessMm: 150 }
      ]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.impact.fieldEstimateProfile).toBe("direct_flanking_energy_sum");
  expect(payload.result.impact.basis).toBe("mixed_exact_plus_estimated_standardized_direct_flanking_energy_sum");
  expect(payload.result.impact.LPrimeNW).toBe(55);
  expect(payload.result.impact.LPrimeNTw).toBe(53);
  expect(payload.result.impact.LPrimeNT50).toBe(52);
  expect(payload.result.impact.metricBasis.LPrimeNW).toBe("estimated_field_lprimenw_from_direct_flanking_energy_sum");
  expect(payload.result.impact.fieldEstimateFlankingPathCount).toBe(2);
  expect(payload.result.impact.fieldEstimateExpertPathModifierCount).toBe(2);
  expect(payload.result.impactSupport.primaryCurveType).toBe("impact_curve");
  expect(payload.result.impactSupport.primaryCurveUnaffected).toBe(false);
  expect(payload.result.impactSupport.formulaNotes).toEqual(
    expect.arrayContaining([
      expect.stringMatching(/direct\+flanking path energy sum/i),
      expect.stringMatching(/Current direct-path offset is 1 dB/i),
      expect.stringMatching(/L'nT,50 was computed as L'nT,w \+ CI,50-2500/i)
    ])
  );
});

test("estimate api infers the supporting family from an exact floor row on the direct+flanking lane", async ({
  request
}) => {
  const response = await request.post("/api/estimate", {
    data: {
      impactFieldContext: {
        directPathOffsetDb: 1,
        flankingPaths: [
          {
            edgeIsolationClass: "rigid",
            id: "edge_path",
            junctionLengthM: 4,
            kijDb: 2,
            levelOffsetDb: -6,
            pathType: "edge",
            shortCircuitRisk: "high"
          }
        ]
      },
      impactPredictorInput: {
        officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
        structuralSupportType: "open_box_timber"
      },
      layers: [{ materialId: "concrete", thicknessMm: 140 }],
      targetOutputs: ["L'n,w"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.impact.basis).toBe("mixed_exact_plus_estimated_direct_flanking_energy_sum");
  expect(payload.result.impact.LPrimeNW).toBe(44);
  expect(payload.result.impact.fieldEstimateFlankingFamilyModels).toEqual(["open_box_timber"]);
  expect(payload.result.impactSupport.formulaNotes).toEqual(
    expect.arrayContaining([expect.stringMatching(/Family-aware flanking path models were applied for: open box timber/i)])
  );
});

test("estimate api applies ΔLd before guide-side K correction and standardized field normalization", async ({
  request
}) => {
  const response = await request.post("/api/estimate", {
    data: {
      impactFieldContext: {
        fieldKDb: 2,
        lowerTreatmentReductionDb: 6,
        receivingRoomVolumeM3: 50
      },
      impactPredictorInput: {
        officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
        structuralSupportType: "open_box_timber"
      },
      layers: [{ materialId: "concrete", thicknessMm: 140 }],
      targetOutputs: ["L'n,w", "L'nT,w"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.impact.fieldEstimateProfile).toBe("explicit_field_lprimenw_from_lnw_plus_k");
  expect(payload.result.impact.fieldEstimateKCorrectionDb).toBe(2);
  expect(payload.result.impact.fieldEstimateLowerTreatmentReductionDb).toBe(6);
  expect(payload.result.impact.LPrimeNW).toBe(35);
  expect(payload.result.impact.LPrimeNTw).toBe(33);
  expect(payload.result.impactSupport.formulaNotes).toEqual(
    expect.arrayContaining([
      expect.stringMatching(/L'n,w = Ln,w \+ K/i),
      expect.stringMatching(/ΔLd = 6 dB was applied before the field-side K correction/i),
      expect.stringMatching(/applied before field standardization/i)
    ])
  );
});

test("impact-only api can resolve a curated floor-system id with no visible layers", async ({ request }) => {
  const response = await request.post("/api/impact-only", {
    data: {
      layers: [],
      officialFloorSystemId: "dataholz_gdmtxn01_dry_clt_lab_2026"
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.partialType).toBe("impact_only");
  expect(payload.result.sourceMode).toBe("official_floor_system");
  expect(payload.result.floorSystemMatch.system.id).toBe("dataholz_gdmtxn01_dry_clt_lab_2026");
  expect(payload.result.impactPredictorStatus.matchedFloorSystemId).toBe("dataholz_gdmtxn01_dry_clt_lab_2026");
  expect(payload.result.impact.LnW).toBe(50);
  expect(payload.result.impact.metricBasis.LnW).toBe("official_floor_system_exact_match");
  expect(payload.result.floorCarrier.Rw).toBe(62);
  expect(payload.result.floorSystemRatings.Rw).toBe(62);
  expect(payload.result.floorSystemRatings.basis).toBe("official_floor_system_exact_match");
});

test("impact-only api keeps bound-only floor-system support explicit and carries field-side upper bounds", async ({
  request
}) => {
  const response = await request.post("/api/impact-only", {
    data: {
      layers: [],
      officialFloorSystemId: "ubiq_fl32_steel_200_lab_2026",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.partialType).toBe("impact_only");
  expect(payload.result.sourceMode).toBe("official_floor_system");
  expect(payload.result.boundFloorSystemMatch.system.id).toBe("ubiq_fl32_steel_200_lab_2026");
  expect(payload.result.lowerBoundImpact.basis).toBe("mixed_bound_plus_estimated_standardized_field_volume_normalization");
  expect(payload.result.lowerBoundImpact.LnWUpperBound).toBe(53);
  expect(payload.result.lowerBoundImpact.LPrimeNWUpperBound).toBe(55);
  expect(payload.result.lowerBoundImpact.LPrimeNTwUpperBound).toBe(53);
  expect(payload.result.impactPredictorStatus.lowerBoundImpact.LPrimeNTwUpperBound).toBe(53);
  expect(payload.result.floorSystemRatings.Rw).toBe(62);
  expect(payload.result.floorSystemRatings.basis).toBe("official_floor_system_bound_support");
  expect(payload.result.supportedTargetOutputs).toEqual(["Rw"]);
  expect(payload.result.unsupportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);
});

test("impact-only api keeps requested outputs explicit while exposing companion floor-carrier metrics", async ({
  request
}) => {
  const response = await request.post("/api/impact-only", {
    data: {
      layers: [{ materialId: "air_gap", thicknessMm: 90 }],
      officialFloorSystemId: "knauf_ct30_1c_timber_lab_2026",
      targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw", "IIC"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.partialType).toBe("impact_only");
  expect(payload.result.floorSystemMatch.system.id).toBe("knauf_ct30_1c_timber_lab_2026");
  expect(payload.result.floorCarrier.Rw).toBe(60);
  expect(payload.result.floorCarrier.RwCtr).toBe(53);
  expect(payload.result.supportedTargetOutputs).toEqual(["Rw", "Ctr", "Ln,w"]);
  expect(payload.result.supportedImpactOutputs).toEqual(["Ln,w"]);
  expect(payload.result.unsupportedTargetOutputs).toEqual(["DeltaLw", "IIC"]);
  expect(payload.result.unsupportedImpactOutputs).toEqual(["DeltaLw", "IIC"]);
  expect(payload.result.warnings.some((warning: string) => /Some requested impact sound outputs are still unavailable/i.test(warning))).toBe(
    true
  );
});

test("impact-only api can re-rate exact bands through the direct+flanking field path lane", async ({ request }) => {
  const response = await request.post("/api/impact-only", {
    data: {
      layers: [{ materialId: "air_gap", thicknessMm: 90 }],
      exactImpactSource: {
        frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
        labOrField: "lab",
        levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
      },
      impactFieldContext: {
        directPathOffsetDb: 1,
        flankingPaths: [
          { id: "f1", levelOffsetDb: -6, pathType: "wall", pathCount: 1, supportingElementFamily: "reinforced_concrete" },
          { id: "f2", levelOffsetDb: -10, pathType: "ceiling", pathCount: 2, kijDb: 1.5, shortCircuitRisk: "medium" }
        ],
        lowerTreatmentReductionDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.impact.fieldEstimateProfile).toBe("direct_flanking_energy_sum");
  expect(payload.result.impact.basis).toBe("mixed_exact_plus_estimated_standardized_direct_flanking_energy_sum");
  expect(payload.result.impact.LPrimeNW).toBe(55);
  expect(payload.result.impact.LPrimeNTw).toBe(53);
  expect(payload.result.impact.LPrimeNT50).toBe(52);
  expect(payload.result.impactSupport.primaryCurveType).toBe("impact_curve");
  expect(payload.result.supportedImpactOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]);
  expect(payload.result.unsupportedImpactOutputs).toEqual([]);
  expect(payload.result.warnings).toEqual(
    expect.arrayContaining([expect.stringMatching(/Impact-only direct\+flanking field path is active/i)])
  );
});

test("impact-only api infers the supporting family from an exact floor row on the direct+flanking lane", async ({
  request
}) => {
  const response = await request.post("/api/impact-only", {
    data: {
      layers: [{ materialId: "concrete", thicknessMm: 140 }],
      officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
      impactFieldContext: {
        directPathOffsetDb: 1,
        flankingPaths: [
          {
            edgeIsolationClass: "rigid",
            id: "edge_path",
            junctionLengthM: 4,
            kijDb: 2,
            levelOffsetDb: -6,
            pathType: "edge",
            shortCircuitRisk: "high"
          }
        ]
      },
      targetOutputs: ["L'n,w"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.partialType).toBe("impact_only");
  expect(payload.result.impact.basis).toBe("mixed_exact_plus_estimated_direct_flanking_energy_sum");
  expect(payload.result.impact.LPrimeNW).toBe(44);
  expect(payload.result.impact.fieldEstimateFlankingFamilyModels).toEqual(["open_box_timber"]);
  expect(payload.result.impactSupport.formulaNotes).toEqual(
    expect.arrayContaining([expect.stringMatching(/Family-aware flanking path models were applied for: open box timber/i)])
  );
});

test("impact-only api applies ΔLd before guide-side K correction and standardization", async ({ request }) => {
  const response = await request.post("/api/impact-only", {
    data: {
      layers: [{ materialId: "concrete", thicknessMm: 140 }],
      officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
      impactFieldContext: {
        fieldKDb: 2,
        lowerTreatmentReductionDb: 6,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["L'n,w", "L'nT,w"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.partialType).toBe("impact_only");
  expect(payload.result.impact.fieldEstimateProfile).toBe("explicit_field_lprimenw_from_lnw_plus_k");
  expect(payload.result.impact.fieldEstimateKCorrectionDb).toBe(2);
  expect(payload.result.impact.fieldEstimateLowerTreatmentReductionDb).toBe(6);
  expect(payload.result.impact.LPrimeNW).toBe(35);
  expect(payload.result.impact.LPrimeNTw).toBe(33);
  expect(payload.result.impactSupport.formulaNotes).toEqual(
    expect.arrayContaining([
      expect.stringMatching(/L'n,w = Ln,w \+ K/i),
      expect.stringMatching(/ΔLd = 6 dB was applied before the field-side K correction/i),
      expect.stringMatching(/applied before field standardization/i)
    ])
  );
});

test("impact-only api can resolve a direct product row without visible floor layers", async ({ request }) => {
  const response = await request.post("/api/impact-only", {
    data: {
      layers: [],
      officialImpactCatalogId: "regupol_sonus_curve_8_tile_match_2026"
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.partialType).toBe("impact_only");
  expect(payload.result.sourceMode).toBe("official_product_catalog");
  expect(payload.result.impactCatalogMatch.catalog.id).toBe("regupol_sonus_curve_8_tile_match_2026");
  expect(payload.result.impact.LnW).toBe(50);
  expect(payload.result.impact.DeltaLw).toBe(26);
  expect(payload.result.impact.metricBasis.LnW).toBe("predictor_catalog_exact_match_official");
  expect(payload.result.impact.metricBasis.DeltaLw).toBe("predictor_catalog_exact_match_official");
});

test("impact-only api can resolve the heavy-floor formula from dedicated source layers while the visible stack stays gap-only", async ({
  request
}) => {
  const response = await request.post("/api/impact-only", {
    data: {
      layers: [{ materialId: "air_gap", thicknessMm: 90 }],
      sourceLayers: [
        { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
        { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
      ]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.partialType).toBe("impact_only");
  expect(payload.result.sourceMode).toBe("source_layers");
  expect(payload.result.visibleLayers).toHaveLength(1);
  expect(payload.result.sourceLayers).toHaveLength(4);
  expect(payload.result.impact.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
  expect(payload.result.impact.LnW).toBe(50.3);
  expect(payload.result.impact.DeltaLw).toBe(24.3);
});

test("impact-only api can resolve predictor input without visible impact layers", async ({ request }) => {
  const response = await request.post("/api/impact-only", {
    data: {
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
      layers: [],
      targetOutputs: ["Ln,w", "DeltaLw"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.sourceMode).toBe("predictor_input");
  expect(payload.result.impact.LnW).toBe(50.3);
  expect(payload.result.impact.DeltaLw).toBe(24.3);
  expect(payload.result.sourceLayers).toHaveLength(4);
});

test("impact-only api keeps explicit DeltaLw heavy-reference input on the lab-side reference lane", async ({
  request
}) => {
  const response = await request.post("/api/impact-only", {
    data: {
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
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
      layers: [],
      targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.sourceMode).toBe("predictor_input");
  expect(payload.result.impact.basis).toBe("predictor_explicit_delta_heavy_reference_derived");
  expect(payload.result.impact.LnW).toBe(52);
  expect(payload.result.impact.DeltaLw).toBe(26);
  expect(payload.result.impact.LPrimeNW).toBeUndefined();
  expect(payload.result.impact.LPrimeNTw).toBeUndefined();
  expect(payload.result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
  expect(payload.result.unsupportedImpactOutputs).toEqual(["L'n,w", "L'nT,w"]);
});

test("impact-only api can resolve the Knauf timber ceramic published family blend from explicit predictor input", async ({
  request
}) => {
  const response = await request.post("/api/impact-only", {
    data: {
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
      layers: [],
      targetOutputs: ["Ln,w"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.sourceMode).toBe("predictor_input");
  expect(payload.result.impact.basis).toBe("predictor_floor_system_family_general_estimate");
  expect(payload.result.impact.LnW).toBe(69.3);
  expect(payload.result.floorSystemRatings.Rw).toBe(53);
  expect(payload.result.floorSystemRatings.RwCtr).toBe(46);
  expect(payload.result.impact.estimateCandidateIds).toEqual([
    "knauf_ct30_1b_timber_lab_2026",
    "knauf_ct30_2b_timber_lab_2026",
    "knauf_ct30_1a_timber_lab_2026",
    "knauf_ct2d_timber_r25_lab_2026"
  ]);
  expect(payload.result.impactPredictorStatus.implementedFamilyEstimate).toBe(true);
  expect(payload.result.impactPredictorStatus.implementedLowConfidenceEstimate).toBe(false);
});

test("impact-only api can resolve the published composite-panel dry-floor interaction estimate from predictor input", async ({
  request
}) => {
  const response = await request.post("/api/impact-only", {
    data: {
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
      layers: [],
      targetOutputs: ["Ln,w"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.sourceMode).toBe("predictor_input");
  expect(payload.result.impact.basis).toBe("predictor_composite_panel_published_interaction_estimate");
  expect(payload.result.impact.LnW).toBe(69.4);
  expect(payload.result.floorSystemRatings.Rw).toBe(45.1);
  expect(payload.result.impact.estimateCandidateIds).toEqual([
    "pmc_m1_dry_floating_floor_lab_2026",
    "pmc_m1_bare_composite_lab_2026"
  ]);
});

test("impact-only api can resolve the published heavy-concrete upper-treatment estimate when dynamic stiffness is omitted", async ({
  request
}) => {
  const response = await request.post("/api/impact-only", {
    data: {
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
      layers: [],
      targetOutputs: ["Ln,w"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.sourceMode).toBe("predictor_input");
  expect(payload.result.impact.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
  expect(payload.result.impact.LnW).toBe(50);
  expect(payload.result.floorSystemRatings.Rw).toBe(58);
  expect(payload.result.floorSystemRatings.RwCtr).toBe(-6.7);
  expect(payload.result.impact.estimateCandidateIds).toEqual(["regupol_curve8_concrete_tile_lab_2026"]);
});

test("estimate api can carry predictor input while preserving the visible screening stack", async ({ request }) => {
  const response = await request.post("/api/estimate", {
    data: {
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
      layers: [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.impact.basis).toBe("predictor_lightweight_steel_fl28_interpolation_estimate");
  expect(payload.result.impact.LnW).toBe(51.4);
  expect(payload.result.impact.CI).toBe(-1.6);
  expect(payload.result.impact.LnWPlusCI).toBe(49.8);
  expect(payload.result.metrics.estimatedRwDb).toBe(26.9);
  expect(payload.result.floorSystemRatings.Rw).toBe(63.6);
  expect(payload.result.floorSystemRatings.RwCtr).toBe(58.1);
});

test("estimate api keeps explicit DeltaLw predictor input on the heavy-reference lane while airborne screening stays visible", async ({
  request
}) => {
  const response = await request.post("/api/estimate", {
    data: {
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
      layers: [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      targetOutputs: ["Ln,w", "DeltaLw"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.metrics.estimatedRwDb).toBe(26.9);
  expect(payload.result.impact.basis).toBe("predictor_explicit_delta_heavy_reference_derived");
  expect(payload.result.impact.LnW).toBe(52);
  expect(payload.result.impact.DeltaLw).toBe(26);
  expect(payload.result.floorSystemRatings.basis).toBe("predictor_heavy_concrete_floor_airborne_companion_estimate");
  expect(payload.result.floorSystemRatings.Rw).toBe(58);
  expect(payload.result.floorSystemRatings.RwCtr).toBe(-7.3);
});

test("impact-only api keeps unsupported steel suspended predictor input on the upstream low-confidence family lane", async ({
  request
}) => {
  const response = await request.post("/api/impact-only", {
    data: {
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
      layers: [],
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.sourceMode).toBe("predictor_input");
  expect(payload.result.impact.basis).toBe("predictor_floor_system_low_confidence_estimate");
  expect(payload.result.impact.LnW).toBe(51);
  expect(payload.result.impact.CI).toBe(-1.7);
  expect(payload.result.impact.LnWPlusCI).toBe(49.3);
  expect(payload.result.floorSystemRatings.Rw).toBe(63.1);
  expect(payload.result.floorSystemRatings.RwCtr).toBe(57.7);
  expect(payload.result.impactPredictorStatus.implementedLowConfidenceEstimate).toBe(true);
});

test("estimate api keeps steel joist stacks on the low-confidence family lane when predictor input is explicit", async ({
  request
}) => {
  const response = await request.post("/api/estimate", {
    data: {
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
      layers: [
        { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 },
        { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
        { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
        { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
      ],
      targetOutputs: ["Ln,w"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.impact.basis).toBe("predictor_floor_system_low_confidence_estimate");
  expect(payload.result.impact.LnW).toBe(58.3);
  expect(payload.result.floorSystemRatings.Rw).toBe(61);
  expect(payload.result.floorSystemRatings.RwCtr).toBe(57);
  expect(payload.result.impactPredictorStatus.implementedLowConfidenceEstimate).toBe(true);
});

test("estimate api keeps an explicit UBIQ carpet topology on the published family-general lane", async ({
  request
}) => {
  const response = await request.post("/api/estimate", {
    data: {
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
      layers: [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.impact.basis).toBe("predictor_floor_system_family_general_estimate");
  expect(payload.result.impact.LnW).toBe(51);
  expect(payload.result.impact.CI).toBe(-1.7);
  expect(payload.result.impact.LnWPlusCI).toBe(49.3);
  expect(payload.result.floorSystemRatings.Rw).toBe(63.7);
  expect(payload.result.floorSystemRatings.RwCtr).toBe(58.4);
  expect(payload.result.impact.estimateCandidateIds).toEqual([
    "ubiq_fl28_open_web_steel_300_exact_lab_2026",
    "ubiq_fl28_open_web_steel_200_exact_lab_2026",
    "ubiq_fl28_open_web_steel_400_exact_lab_2026"
  ]);
  expect(payload.result.impactPredictorStatus.implementedFamilyEstimate).toBe(true);
  expect(payload.result.impactPredictorStatus.implementedLowConfidenceEstimate).toBe(false);
});

test("estimate api can carry structured airborne leakage and field overlays on a wall stack", async ({
  request
}) => {
  const response = await request.post("/api/estimate", {
    data: {
      airborneContext: {
        airtightness: "poor",
        contextMode: "field_between_rooms",
        electricalBoxes: "back_to_back",
        junctionQuality: "poor",
        penetrationState: "major",
        perimeterSeal: "poor",
        sharedTrack: "shared"
      },
      layers: [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 75 },
        { materialId: "rockwool", thicknessMm: 75 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      targetOutputs: ["Rw"]
    }
  });

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();

  expect(payload.ok).toBe(true);
  expect(payload.result.airborneOverlay.contextMode).toBe("field_between_rooms");
  expect(payload.result.airborneOverlay.leakagePenaltyApplied).toBe(true);
  expect(payload.result.airborneOverlay.fieldFlankingPenaltyApplied).toBe(true);
  expect(payload.result.airborneOverlay.detectedFamily).toBe("cavity_wall_surrogate");
  expect(payload.result.airborneOverlay.junctionFlankingGraph.totalPenaltyDb).toBeGreaterThan(0);
  expect(payload.result.metrics.estimatedRwDb).toBeLessThan(30);
});
});

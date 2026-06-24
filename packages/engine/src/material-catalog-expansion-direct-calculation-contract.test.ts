import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { resolveMaterial } from "./material-catalog";

describe("public-source material catalog expansion direct calculation", () => {
  it("resolves new product-specific wall materials into dynamic airborne calculation", () => {
    const result = calculateAssembly(
      [
        { materialId: "gyproc_soundbloc_12_5", thicknessMm: 12.5 },
        { materialId: "tecsound_sy_70", thicknessMm: 3.5 },
        { materialId: "air_gap", thicknessMm: 70 },
        { materialId: "rockwool_afb_40", thicknessMm: 70 },
        { materialId: "quietrock_510", thicknessMm: 12.7 }
      ],
      {
        airborneContext: {
          airtightness: "good",
          contextMode: "element_lab"
        },
        calculator: "dynamic",
        targetOutputs: ["Rw", "STC"]
      }
    );

    expect(result.ok).toBe(true);
    expect(result.ratings.iso717.Rw).toBeGreaterThan(0);
    expect(result.metrics.estimatedStc).toBeGreaterThan(0);
    expect(result.unsupportedTargetOutputs).not.toContain("Rw");
    expect(result.layers.map((layer: { material: { id: string } }) => layer.material.id)).toEqual([
      "gyproc_soundbloc_12_5",
      "tecsound_sy_70",
      "air_gap",
      "rockwool_afb_40",
      "quietrock_510"
    ]);
    expect(Number(result.layers[0]!.surfaceMassKgM2.toFixed(1))).toBe(10.3);
    expect(Number(result.layers[1]!.surfaceMassKgM2.toFixed(1))).toBe(7);
  });

  it("uses new REGUPOL dynamic-stiffness materials directly in the heavy floating-floor impact route", () => {
    const result = calculateAssembly(
      [
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
        { floorRole: "resilient_layer", materialId: "regupol_sound_15", thicknessMm: 12 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
      ],
      {
        calculator: "dynamic",
        floorImpactContext: {
          loadBasisKgM2: 100
        },
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(result.ok).toBe(true);
    expect(result.impact?.basis).toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
    expect(result.impact?.resilientDynamicStiffnessMNm3).toBe(6);
    expect(result.impact?.DeltaLw).toBeGreaterThan(0);
    expect(result.impact?.LnW).toBeGreaterThan(0);
    expect(result.impactCatalogMatch?.catalog.id).toBe("regupol_sound_15_catalog_delta_lw_2026");
    expect(result.impactCatalogMatch?.catalog.matchMode).toBe("lower_bound_support");
    expect(result.lowerBoundImpact?.DeltaLwLowerBound).toBe(29);
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("carries REGUPOL official minimum DeltaLw product rows as lower-bound support", () => {
    const cases = [
      {
        catalogId: "regufoam_sound_10_catalog_delta_lw_2026",
        deltaLwLowerBound: 34,
        layers: [
          { floorRole: "floating_screed" as const, materialId: "screed", thicknessMm: 50 },
          { floorRole: "resilient_layer" as const, materialId: "regufoam_sound_10", thicknessMm: 17 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 180 }
        ]
      },
      {
        catalogId: "regupol_sound_12_two_layer_catalog_delta_lw_2026",
        deltaLwLowerBound: 36,
        layers: [
          { floorRole: "floating_screed" as const, materialId: "screed", thicknessMm: 50 },
          { floorRole: "resilient_layer" as const, materialId: "regupol_sound_12", thicknessMm: 17 },
          { floorRole: "resilient_layer" as const, materialId: "regupol_sound_12", thicknessMm: 17 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 180 }
        ]
      }
    ];

    for (const testCase of cases) {
      const result = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        targetOutputs: ["Ln,w", "DeltaLw"]
      });

      expect(result.ok, testCase.catalogId).toBe(true);
      expect(result.impactCatalogMatch?.catalog.id, testCase.catalogId).toBe(testCase.catalogId);
      expect(result.impactCatalogMatch?.catalog.matchMode, testCase.catalogId).toBe("lower_bound_support");
      expect(result.lowerBoundImpact?.basis, testCase.catalogId).toBe("predictor_catalog_lower_bound_official");
      expect(result.lowerBoundImpact?.DeltaLwLowerBound, testCase.catalogId).toBe(testCase.deltaLwLowerBound);
      expect(result.lowerBoundImpact?.LnWUpperBound, testCase.catalogId).toBe(78 - testCase.deltaLwLowerBound);
    }
  });

  it("matches only bounded official DeltaLw product rows that fit the encoded stack boundary", () => {
    const cases = [
      {
        catalogId: "schluter_ditra_sound_catalog_delta_lw_2026",
        deltaLw: 13,
        layers: [
          { floorRole: "floor_covering" as const, materialId: "ceramic_tile", thicknessMm: 8 },
          { floorRole: "resilient_layer" as const, materialId: "schluter_ditra_sound", thicknessMm: 3.5 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 180 }
        ]
      },
      {
        catalogId: "isolgomma_sylcer_3_catalog_delta_lw_2026",
        deltaLw: 17,
        layers: [
          { floorRole: "floor_covering" as const, materialId: "ceramic_tile", thicknessMm: 8 },
          { floorRole: "resilient_layer" as const, materialId: "isolgomma_sylcer_3", thicknessMm: 3 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 180 }
        ]
      },
      {
        catalogId: "tarkett_comfort_acoustic_19_db_catalog_delta_lw_2026",
        deltaLw: 19,
        layers: [
          { floorRole: "floor_covering" as const, materialId: "tarkett_comfort_acoustic_19_db", thicknessMm: 3.15 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 180 }
        ]
      },
      {
        catalogId: "tarkett_iq_optima_acoustic_16_db_catalog_delta_lw_2026",
        deltaLw: 16,
        layers: [
          { floorRole: "floor_covering" as const, materialId: "tarkett_iq_optima_acoustic_16_db", thicknessMm: 3.15 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 180 }
        ]
      }
    ];

    for (const testCase of cases) {
      const result = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        targetOutputs: ["Ln,w", "DeltaLw"]
      });

      expect(result.ok, testCase.catalogId).toBe(true);
      expect(result.impactCatalogMatch?.catalog.id, testCase.catalogId).toBe(testCase.catalogId);
      expect(result.impact?.basis, testCase.catalogId).toBe("predictor_catalog_product_delta_official");
      expect(result.impact?.DeltaLw, testCase.catalogId).toBe(testCase.deltaLw);
      expect(result.impact?.metricBasis?.DeltaLw, testCase.catalogId).toBe("predictor_catalog_product_delta_official");
      expect(result.impact?.metricBasis?.LnW, testCase.catalogId).toBe(
        "predictor_catalog_product_delta_heavy_reference_derived"
      );
    }
  });

  it("opens only exact Getzner AFM29 lab rows whose screed/base stack is encoded", () => {
    const cases = [
      {
        catalogId: "getzner_afm29_rc160_screed172_exact_2026",
        deltaLw: 29,
        lnw: 49,
        layers: [
          { floorRole: "floating_screed" as const, materialId: "screed", thicknessMm: 86 },
          { floorRole: "resilient_layer" as const, materialId: "getzner_afm_29", thicknessMm: 11 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 160 }
        ]
      },
      {
        catalogId: "getzner_afm29_rc160_screed197_exact_2026",
        deltaLw: 33,
        lnw: 46,
        layers: [
          { floorRole: "floating_screed" as const, materialId: "screed", thicknessMm: 98.5 },
          { floorRole: "resilient_layer" as const, materialId: "getzner_afm_29", thicknessMm: 11 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 160 }
        ]
      }
    ];

    for (const testCase of cases) {
      const result = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        targetOutputs: ["Ln,w", "DeltaLw"]
      });

      expect(result.ok, testCase.catalogId).toBe(true);
      expect(result.impactCatalogMatch?.catalog.id, testCase.catalogId).toBe(testCase.catalogId);
      expect(result.impactCatalogMatch?.catalog.matchMode, testCase.catalogId).toBe("exact_system");
      expect(result.impact?.basis, testCase.catalogId).toBe("predictor_catalog_exact_match_official");
      expect(result.impact?.LnW, testCase.catalogId).toBe(testCase.lnw);
      expect(result.impact?.DeltaLw, testCase.catalogId).toBe(testCase.deltaLw);
      expect(result.impact?.metricBasis?.LnW, testCase.catalogId).toBe("predictor_catalog_exact_match_official");
      expect(result.impact?.metricBasis?.DeltaLw, testCase.catalogId).toBe("predictor_catalog_exact_match_official");
      expect(result.impact?.referenceFloorType, testCase.catalogId).toBe(
        testCase.catalogId === "getzner_afm29_rc160_screed172_exact_2026"
          ? "getzner_afm29_rc160_screed172_lab"
          : "getzner_afm29_rc160_screed197_lab"
      );
    }
  });

  it("keeps official impact product rows fail-closed when stack-boundary details drift", () => {
    const cases = [
      {
        label: "REGUPOL lower-bound support with too-light screed",
        layers: [
          { floorRole: "floating_screed" as const, materialId: "screed", thicknessMm: 20 },
          { floorRole: "resilient_layer" as const, materialId: "regupol_sound_15", thicknessMm: 12 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 180 }
        ]
      },
      {
        label: "REGUPOL lower-bound support with too-light base",
        layers: [
          { floorRole: "floating_screed" as const, materialId: "screed", thicknessMm: 50 },
          { floorRole: "resilient_layer" as const, materialId: "regupol_sound_15", thicknessMm: 12 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 80 }
        ]
      },
      {
        label: "DITRA-SOUND product delta with too-light base",
        layers: [
          { floorRole: "floor_covering" as const, materialId: "ceramic_tile", thicknessMm: 8 },
          { floorRole: "resilient_layer" as const, materialId: "schluter_ditra_sound", thicknessMm: 3.5 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 80 }
        ]
      },
      {
        label: "DITRA-SOUND product delta on mass-timber support",
        layers: [
          { floorRole: "floor_covering" as const, materialId: "ceramic_tile", thicknessMm: 8 },
          { floorRole: "resilient_layer" as const, materialId: "schluter_ditra_sound", thicknessMm: 3.5 },
          { floorRole: "base_structure" as const, materialId: "clt_panel", thicknessMm: 140 }
        ]
      },
      {
        label: "Tarkett product delta outside row thickness tolerance",
        layers: [
          { floorRole: "floor_covering" as const, materialId: "tarkett_iq_optima_acoustic_16_db", thicknessMm: 3.35 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 180 }
        ]
      },
      {
        label: "Getzner AFM29 exact lab row with the wrong screed surface mass",
        layers: [
          { floorRole: "floating_screed" as const, materialId: "screed", thicknessMm: 50 },
          { floorRole: "resilient_layer" as const, materialId: "getzner_afm_29", thicknessMm: 11 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 160 }
        ]
      },
      {
        label: "Getzner AFM29 exact lab row with the wrong base family",
        layers: [
          { floorRole: "floating_screed" as const, materialId: "screed", thicknessMm: 86 },
          { floorRole: "resilient_layer" as const, materialId: "getzner_afm_29", thicknessMm: 11 },
          { floorRole: "base_structure" as const, materialId: "clt_panel", thicknessMm: 160 }
        ]
      },
      {
        label: "Getzner AFM29 exact lab row outside row thickness tolerance",
        layers: [
          { floorRole: "floating_screed" as const, materialId: "screed", thicknessMm: 86 },
          { floorRole: "resilient_layer" as const, materialId: "getzner_afm_29", thicknessMm: 10 },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 160 }
        ]
      }
    ];

    for (const testCase of cases) {
      const result = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        targetOutputs: ["Ln,w", "DeltaLw"]
      });

      expect(result.impactCatalogMatch, testCase.label).toBeNull();
      expect(result.lowerBoundImpact, testCase.label).toBeNull();
    }
  });

  it("parks under-screed product-page DeltaLw rows without exact screed boundaries while keeping formula calculation", () => {
    const cases = [
      {
        materialId: "isolgomma_upgrei",
        resilientDynamicStiffnessMNm3: 6,
        thicknessMm: 10
      },
      {
        materialId: "isolgomma_bifloor",
        resilientDynamicStiffnessMNm3: 10,
        thicknessMm: 28
      }
    ];

    for (const testCase of cases) {
      const result = calculateAssembly(
        [
          { floorRole: "floating_screed" as const, materialId: "screed", thicknessMm: 50 },
          { floorRole: "resilient_layer" as const, materialId: testCase.materialId, thicknessMm: testCase.thicknessMm },
          { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 180 }
        ],
        {
          calculator: "dynamic",
          floorImpactContext: {
            loadBasisKgM2: 100
          },
          targetOutputs: ["Ln,w", "DeltaLw"]
        }
      );

      expect(result.ok, testCase.materialId).toBe(true);
      expect(result.impactCatalogMatch, testCase.materialId).toBeNull();
      expect(result.impact?.basis, testCase.materialId).toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
      expect(result.impact?.resilientDynamicStiffnessMNm3, testCase.materialId).toBe(
        testCase.resilientDynamicStiffnessMNm3
      );
      expect(result.supportedTargetOutputs, testCase.materialId).toEqual(["Ln,w", "DeltaLw"]);
    }
  });

  it("does not treat a floor-covering DeltaLw product row as the full system when a separate resilient layer is present", () => {
    const result = calculateAssembly(
      [
        { floorRole: "floor_covering", materialId: "forbo_sarlon_19_db", thicknessMm: 3 },
        { floorRole: "resilient_layer", materialId: "isolgomma_upgrei", thicknessMm: 10 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
      ],
      {
        calculator: "dynamic",
        floorImpactContext: {
          loadBasisKgM2: 100
        },
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(result.impactCatalogMatch?.catalog.id).not.toBe("forbo_sarlon_19_db_catalog_delta_lw_2026");
  });

  it("does not treat a floor-covering DeltaLw product row as the full system when a floating screed is present", () => {
    const result = calculateAssembly(
      [
        { floorRole: "floor_covering", materialId: "tarkett_iq_optima_acoustic_16_db", thicknessMm: 2 },
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
      ],
      {
        calculator: "dynamic",
        floorImpactContext: {
          loadBasisKgM2: 100
        },
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(result.impactCatalogMatch?.catalog.id).not.toBe("tarkett_iq_optima_acoustic_16_db_catalog_delta_lw_2026");
  });

  it("does not activate imported product DeltaLw rows without the heavy concrete reference stack shape", () => {
    const floorCoveringOnly = calculateAssembly(
      [{ floorRole: "floor_covering", materialId: "forbo_sarlon_19_db", thicknessMm: 3 }],
      {
        calculator: "dynamic",
        floorImpactContext: {
          loadBasisKgM2: 100
        },
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );
    const underScreedWithoutScreed = calculateAssembly(
      [
        { floorRole: "resilient_layer", materialId: "regufoam_sound_10", thicknessMm: 17 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
      ],
      {
        calculator: "dynamic",
        floorImpactContext: {
          loadBasisKgM2: 100
        },
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(floorCoveringOnly.impactCatalogMatch).toBeNull();
    expect(underScreedWithoutScreed.impactCatalogMatch).toBeNull();
  });

  it("does not activate the DITRA-SOUND product row for non-tile floor coverings", () => {
    const result = calculateAssembly(
      [
        { floorRole: "floor_covering", materialId: "forbo_sarlon_19_db", thicknessMm: 3 },
        { floorRole: "resilient_layer", materialId: "schluter_ditra_sound", thicknessMm: 3.5 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
      ],
      {
        calculator: "dynamic",
        floorImpactContext: {
          loadBasisKgM2: 100
        },
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(result.impactCatalogMatch?.catalog.id).not.toBe("schluter_ditra_sound_catalog_delta_lw_2026");
  });

  it("keeps HIGHMAT 30 catalog DeltaLw parked until screed minimum boundaries can be matched while still opening formula calculation", () => {
    const result = calculateAssembly(
      [
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
        { floorRole: "resilient_layer", materialId: "isolgomma_highmat_30", thicknessMm: 30 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
      ],
      {
        calculator: "dynamic",
        floorImpactContext: {
          loadBasisKgM2: 100
        },
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(result.ok).toBe(true);
    expect(result.impactCatalogMatch).toBeNull();
    expect(result.impact?.basis).toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
    expect(result.impact?.resilientDynamicStiffnessMNm3).toBe(4);
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("does not activate the SYLCER 3 product row for non-tile floor coverings", () => {
    const result = calculateAssembly(
      [
        { floorRole: "floor_covering", materialId: "forbo_sarlon_19_db", thicknessMm: 3 },
        { floorRole: "resilient_layer", materialId: "isolgomma_sylcer_3", thicknessMm: 3 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
      ],
      {
        calculator: "dynamic",
        floorImpactContext: {
          loadBasisKgM2: 100
        },
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(result.impactCatalogMatch?.catalog.id).not.toBe("isolgomma_sylcer_3_catalog_delta_lw_2026");
  });

  it("uses DAMTEC dynamic-stiffness rows in the formula route without importing screed-dependent DeltaLw values", () => {
    const result = calculateAssembly(
      [
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 55 },
        { floorRole: "resilient_layer", materialId: "damtec_3d_17_8", thicknessMm: 17 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
      ],
      {
        calculator: "dynamic",
        floorImpactContext: {
          loadBasisKgM2: 100
        },
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(result.ok).toBe(true);
    expect(result.impactCatalogMatch).toBeNull();
    expect(result.impact?.basis).toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
    expect(result.impact?.resilientDynamicStiffnessMNm3).toBe(15);
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("keeps aliases and density-derived surface masses wired for assistant-generated stacks", () => {
    const soundbloc = resolveMaterial("gyproc_soundbloc");
    const tecsound = resolveMaterial("tecsound70");
    const regupol = resolveMaterial("regupol_sound15");
    const regufoam = resolveMaterial("regufoam_sound10");
    const upgrei = resolveMaterial("upgrei");
    const sylcer = resolveMaterial("sylcer3");
    const ditra = resolveMaterial("ditra_sound");
    const sarlon = resolveMaterial("sarlon19");
    const optima = resolveMaterial("iq_optima_acoustic");
    const damtec = resolveMaterial("damtec_17_8");
    const getznerAfm33 = resolveMaterial("getzner_afm_33");
    const currentCelcon = resolveMaterial("hh_celcon_standard");

    expect(soundbloc.id).toBe("gyproc_soundbloc_12_5");
    expect(tecsound.id).toBe("tecsound_sy_70");
    expect(regupol.impact?.dynamicStiffnessMNm3).toBe(6);
    expect(regufoam.impact?.dynamicStiffnessMNm3).toBe(6);
    expect(upgrei.id).toBe("isolgomma_upgrei");
    expect(sylcer.densityKgM3).toBe(820);
    expect(sylcer.impact?.dynamicStiffnessMNm3).toBe(180);
    expect(ditra.id).toBe("schluter_ditra_sound");
    expect(sarlon.id).toBe("forbo_sarlon_19_db");
    expect(optima.id).toBe("tarkett_iq_optima_acoustic_16_db");
    expect(damtec.impact?.dynamicStiffnessMNm3).toBe(15);
    expect(getznerAfm33.impact?.dynamicStiffnessMNm3).toBe(9);
    expect(currentCelcon.id).toBe("hh_celcon_standard_600");
    expect(Number(computeLayerSurfaceMassKgM2({ thicknessMm: 3.5 }, tecsound).toFixed(1))).toBe(7);
    expect(Number(computeLayerSurfaceMassKgM2({ thicknessMm: 100 }, currentCelcon).toFixed(1))).toBe(60);
  });
});

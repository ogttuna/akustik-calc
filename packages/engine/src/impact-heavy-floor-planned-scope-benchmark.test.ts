import { describe, expect, it } from "vitest";

import type { ImpactPredictorInput } from "@dynecho/shared";

import { calculateImpactOnly } from "./calculate-impact-only";

type PlannedScopeBenchmarkCase =
  | {
      expected: {
        deltaLwDb: number;
        lnwDb: number;
      };
      id: string;
      impactPredictorInput: ImpactPredictorInput;
      matchedCatalogCaseId: string;
      mode: "official_catalog_exact";
      source: string;
    }
  | {
      expected: {
        deltaLwDb: number;
        deltaLwLowerBoundDb: number;
        lnwDb: number;
        lnwUpperBoundDb: number;
      };
      id: string;
      impactPredictorInput: ImpactPredictorInput;
      matchedCatalogCaseId: string;
      mode: "formula_plus_lower_bound";
      source: string;
      tolerances: {
        deltaLwDb: number;
        lnwDb: number;
      };
    }
  | {
      expected: {
        deltaLwDb: number;
        lnwDb: number;
      };
      id: string;
      impactPredictorInput: ImpactPredictorInput;
      matchedCatalogCaseId: string;
      mode: "product_delta_official";
      source: string;
    };

const PLANNED_SCOPE_HEAVY_FLOOR_CASES: readonly PlannedScopeBenchmarkCase[] = [
  {
    id: "regupol_curve8_exact_catalog",
    matchedCatalogCaseId: "regupol_sonus_curve_8_tile_match_2026",
    mode: "official_catalog_exact",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/technical_data/en/regupol_sonus_curve/regupol_sonus_curve_8/REGUPOL_sonus_curve_8_-_TD-en_072024.pdf",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "heavy_floating_floor",
      referenceFloorType: "heavy_standard",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 150,
        densityKgM3: 2400
      },
      resilientLayer: {
        productId: "regupol_sonus_curve_8",
        thicknessMm: 8,
        dynamicStiffnessMNm3: 30
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
    expected: {
      lnwDb: 50,
      deltaLwDb: 26
    }
  },
  {
    id: "regupol_multi45_tile_exact_catalog",
    matchedCatalogCaseId: "regupol_sonus_multi_45_tile_match_2026",
    mode: "official_catalog_exact",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/technical_data/en/regupol_sonus_multi/regupol_sonus_multi_4-5/REGUPOL_sonus_multi_4.5_-_TD-en_092024.pdf",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
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
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 30,
        densityKgM3: 2000
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8,
        densityKgM3: 2200
      }
    },
    expected: {
      lnwDb: 60,
      deltaLwDb: 19
    }
  },
  {
    id: "regupol_multi45_porcelain_exact_catalog",
    matchedCatalogCaseId: "regupol_sonus_multi_45_porcelain_match_2026",
    mode: "official_catalog_exact",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/technical_data/en/regupol_sonus_multi/regupol_sonus_multi_4-5/REGUPOL_sonus_multi_4.5_-_TD-en_092024.pdf",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
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
        densityKgM3: 2300
      }
    },
    expected: {
      lnwDb: 61,
      deltaLwDb: 17
    }
  },
  {
    id: "regupol_curve8_lower_bound_plus_formula",
    matchedCatalogCaseId: "regupol_sonus_curve_8_wet_screed_lower_bound_2026",
    mode: "formula_plus_lower_bound",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/technical_data/en/regupol_sonus_curve/regupol_sonus_curve_8/REGUPOL_sonus_curve_8_-_TD-en_072024.pdf",
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
    expected: {
      lnwDb: 47.9,
      deltaLwDb: 27.7,
      lnwUpperBoundDb: 56,
      deltaLwLowerBoundDb: 22
    },
    tolerances: {
      lnwDb: 0.2,
      deltaLwDb: 0.2
    }
  },
  ...(["21", "23", "26", "29", "33", "35"] as const).map((suffix) => {
    const deltaLwDb = Number(suffix);
    return {
      id: `getzner_afm${suffix}_catalog_product_delta`,
      matchedCatalogCaseId: `getzner_afm${suffix}_catalog_2026`,
      mode: "product_delta_official" as const,
      source: "https://www.getzner.com/media/9347/download/hb-022_abk-020.pdf?v=5",
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
          productId: `getzner_afm_${suffix}`,
          thicknessMm: 10
        },
        floorCovering: {
          mode: "delta_lw_catalog"
        }
      } satisfies ImpactPredictorInput,
      expected: {
        deltaLwDb,
        lnwDb: 78 - deltaLwDb
      }
    };
  })
];

function numberOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

describe("impact heavy-floor planned-scope benchmark", () => {
  it("stays well-formed and official-source-backed", () => {
    const ids = new Set<string>();

    expect(PLANNED_SCOPE_HEAVY_FLOOR_CASES).toHaveLength(10);

    for (const entry of PLANNED_SCOPE_HEAVY_FLOOR_CASES) {
      expect(ids.has(entry.id)).toBe(false);
      ids.add(entry.id);
      expect(String(entry.source)).toMatch(/^https:\/\//);
      expect([
        "official_catalog_exact",
        "formula_plus_lower_bound",
        "product_delta_official"
      ]).toContain(entry.mode);
    }
  });

  it("keeps the planned-scope heavy-floor corridor inside exact and tolerated bounds", () => {
    const errors: string[] = [];

    for (const entry of PLANNED_SCOPE_HEAVY_FLOOR_CASES) {
      const result = calculateImpactOnly([], {
        impactPredictorInput: entry.impactPredictorInput,
        targetOutputs: ["Ln,w", "DeltaLw"]
      });

      const impact = result.impact;
      const lowerBound = result.lowerBoundImpact;
      const lnw = numberOrNull(impact?.LnW);
      const deltaLw = numberOrNull(impact?.DeltaLw);

      if (result.impactPredictorStatus?.matchedCatalogCaseId !== entry.matchedCatalogCaseId) {
        errors.push(
          `${entry.id}: expected catalog match ${entry.matchedCatalogCaseId}, got ${result.impactPredictorStatus?.matchedCatalogCaseId ?? "null"}`
        );
      }

      if (entry.mode === "official_catalog_exact") {
        if (impact?.basis !== "predictor_catalog_exact_match_official") {
          errors.push(`${entry.id}: expected exact official catalog basis, got ${impact?.basis ?? "null"}`);
        }

        if (lnw !== entry.expected.lnwDb) {
          errors.push(`${entry.id}: expected Ln,w ${entry.expected.lnwDb}, got ${lnw}`);
        }

        if (deltaLw !== entry.expected.deltaLwDb) {
          errors.push(`${entry.id}: expected DeltaLw ${entry.expected.deltaLwDb}, got ${deltaLw}`);
        }
      } else if (entry.mode === "formula_plus_lower_bound") {
        if (impact?.basis !== "predictor_heavy_floating_floor_iso12354_annexc_estimate") {
          errors.push(`${entry.id}: expected heavy-floor formula basis, got ${impact?.basis ?? "null"}`);
        }

        if (
          lnw === null ||
          Math.abs(lnw - entry.expected.lnwDb) > entry.tolerances.lnwDb
        ) {
          errors.push(
            `${entry.id}: Ln,w error ${lnw === null ? "null" : Math.abs(lnw - entry.expected.lnwDb).toFixed(2)} dB exceeds tolerance ${entry.tolerances.lnwDb}`
          );
        }

        if (
          deltaLw === null ||
          Math.abs(deltaLw - entry.expected.deltaLwDb) > entry.tolerances.deltaLwDb
        ) {
          errors.push(
            `${entry.id}: DeltaLw error ${deltaLw === null ? "null" : Math.abs(deltaLw - entry.expected.deltaLwDb).toFixed(2)} dB exceeds tolerance ${entry.tolerances.deltaLwDb}`
          );
        }

        if (numberOrNull(lowerBound?.LnWUpperBound) !== entry.expected.lnwUpperBoundDb) {
          errors.push(
            `${entry.id}: expected Ln,w upper bound ${entry.expected.lnwUpperBoundDb}, got ${numberOrNull(lowerBound?.LnWUpperBound)}`
          );
        }

        if (numberOrNull(lowerBound?.DeltaLwLowerBound) !== entry.expected.deltaLwLowerBoundDb) {
          errors.push(
            `${entry.id}: expected DeltaLw lower bound ${entry.expected.deltaLwLowerBoundDb}, got ${numberOrNull(lowerBound?.DeltaLwLowerBound)}`
          );
        }
      } else if (entry.mode === "product_delta_official") {
        if (impact?.basis !== "predictor_catalog_product_delta_official") {
          errors.push(`${entry.id}: expected official product-delta basis, got ${impact?.basis ?? "null"}`);
        }

        if (lnw !== entry.expected.lnwDb) {
          errors.push(`${entry.id}: expected Ln,w ${entry.expected.lnwDb}, got ${lnw}`);
        }

        if (deltaLw !== entry.expected.deltaLwDb) {
          errors.push(`${entry.id}: expected DeltaLw ${entry.expected.deltaLwDb}, got ${deltaLw}`);
        }

        if (impact?.metricBasis?.DeltaLw !== "predictor_catalog_product_delta_official") {
          errors.push(`${entry.id}: expected official DeltaLw provenance, got ${impact?.metricBasis?.DeltaLw ?? "null"}`);
        }

        if (impact?.metricBasis?.LnW !== "predictor_catalog_product_delta_heavy_reference_derived") {
          errors.push(
            `${entry.id}: expected heavy-reference-derived Ln,w provenance, got ${impact?.metricBasis?.LnW ?? "null"}`
          );
        }
      }
    }

    expect(errors).toEqual([]);
  });
});

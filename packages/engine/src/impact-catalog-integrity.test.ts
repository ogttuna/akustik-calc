import { OFFICIAL_IMPACT_PRODUCT_CATALOG } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

describe("impact catalog integrity", () => {
  it("keeps official impact catalog rows well-formed and source-backed", () => {
    const ids = new Set<string>();

    expect(OFFICIAL_IMPACT_PRODUCT_CATALOG.length).toBeGreaterThanOrEqual(10);

    for (const entry of OFFICIAL_IMPACT_PRODUCT_CATALOG) {
      expect(typeof entry.id).toBe("string");
      expect(ids.has(entry.id)).toBe(false);
      ids.add(entry.id);

      expect(String(entry.source)).toMatch(/^https:\/\//);
      expect(entry.trustTier).toBe("official_manufacturer");
      expect([
        "exact_system",
        "lower_bound_support",
        "product_property_delta"
      ]).toContain(entry.matchMode);

      const hasExactMetric =
        Number.isFinite(entry.impactRatings.LnW) || Number.isFinite(entry.impactRatings.DeltaLw);
      const hasBoundMetric =
        Number.isFinite(entry.impactRatings.LnWUpperBound) ||
        Number.isFinite(entry.impactRatings.DeltaLwLowerBound);

      expect(hasExactMetric || hasBoundMetric).toBe(true);
    }
  });

  it("requires catalog role criteria to declare layer count so multi-layer stacks do not alias single product rows", () => {
    for (const entry of OFFICIAL_IMPACT_PRODUCT_CATALOG) {
      const roleCriteria = [
        entry.match.baseStructure,
        entry.match.floatingScreed,
        entry.match.floorCovering,
        entry.match.resilientLayer
      ].filter(Boolean);

      for (const criteria of roleCriteria) {
        expect(criteria?.layerCount, `${entry.id} role criteria must declare layerCount`).toBeGreaterThan(0);
      }
    }
  });

  it("requires live rows to declare a typed reinforced-concrete support family boundary", () => {
    for (const entry of OFFICIAL_IMPACT_PRODUCT_CATALOG) {
      expect(entry.match.supportingElementFamilies, `${entry.id} must declare typed support-family criteria`).toEqual([
        "reinforced_concrete"
      ]);
    }
  });

  it("keeps small-product thickness checks tighter than the global fallback tolerance", () => {
    for (const entry of OFFICIAL_IMPACT_PRODUCT_CATALOG) {
      const roleCriteria = [
        entry.match.floatingScreed,
        entry.match.floorCovering,
        entry.match.resilientLayer
      ].filter(Boolean);

      for (const criteria of roleCriteria) {
        if (typeof criteria?.thicknessMm === "number" && criteria.thicknessMm <= 20) {
          expect(
            criteria.thicknessToleranceMm,
            `${entry.id} must not use the global thickness tolerance for ${criteria.thicknessMm} mm product layers`
          ).toBeLessThanOrEqual(0.5);
        }
      }
    }
  });

  it("requires heavy-reference product deltas and product-page lower bounds to carry surface-mass boundaries", () => {
    for (const entry of OFFICIAL_IMPACT_PRODUCT_CATALOG) {
      if (entry.matchMode === "product_property_delta") {
        expect(
          entry.match.baseStructure?.surfaceMassRangeKgM2?.min,
          `${entry.id} product delta must be gated by heavy base surface mass`
        ).toBeGreaterThanOrEqual(280);
      }

      if (entry.matchMode === "lower_bound_support" && entry.sourceType === "official_manufacturer_product_page") {
        expect(
          entry.match.baseStructure?.surfaceMassRangeKgM2?.min,
          `${entry.id} lower-bound support must be gated by heavy base surface mass`
        ).toBeGreaterThanOrEqual(280);
        expect(
          entry.match.floatingScreed?.surfaceMassRangeKgM2?.min,
          `${entry.id} lower-bound support must be gated by screed surface mass`
        ).toBeGreaterThanOrEqual(80);
      }
    }
  });

  it("keeps generic Getzner AFM product-delta rows parked while allowing encoded exact system rows", () => {
    const getznerRows = OFFICIAL_IMPACT_PRODUCT_CATALOG.filter((entry) => /^getzner_afm/i.test(entry.id));

    expect(getznerRows.map((entry) => entry.id).sort()).toEqual([
      "getzner_afm29_rc160_screed172_exact_2026",
      "getzner_afm29_rc160_screed197_exact_2026"
    ]);

    for (const entry of getznerRows) {
      expect(entry.matchMode, entry.id).toBe("exact_system");
      expect(entry.impactRatings.LnW, entry.id).toBeGreaterThan(0);
      expect(entry.match.floatingScreed?.surfaceMassKgM2, entry.id).toBeGreaterThan(0);
      expect(entry.match.baseStructure?.thicknessMm, entry.id).toBe(160);
    }
  });
});

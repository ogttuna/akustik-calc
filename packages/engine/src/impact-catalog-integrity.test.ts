import { OFFICIAL_IMPACT_PRODUCT_CATALOG } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

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

  it("keeps Getzner AFM catalog rows monotonic from higher stiffness to higher DeltaLw reduction", () => {
    const catalog = getDefaultMaterialCatalog();
    const entries = OFFICIAL_IMPACT_PRODUCT_CATALOG.filter((entry) => /^getzner_afm/i.test(entry.id))
      .map((entry) => {
        const materialId = entry.match.resilientLayer?.materialIds?.[0];
        const material = materialId ? resolveMaterial(materialId, catalog) : null;

        return {
          deltaLw: Number(entry.impactRatings.DeltaLw),
          dynamicStiffnessMNm3: Number(material?.impact?.dynamicStiffnessMNm3),
          id: entry.id
        };
      })
      .sort((left, right) => right.dynamicStiffnessMNm3 - left.dynamicStiffnessMNm3);

    expect(entries.length).toBeGreaterThanOrEqual(6);

    for (let index = 1; index < entries.length; index += 1) {
      expect(entries[index].dynamicStiffnessMNm3).toBeLessThanOrEqual(entries[index - 1].dynamicStiffnessMNm3);
      expect(entries[index].deltaLw).toBeGreaterThanOrEqual(entries[index - 1].deltaLw);
    }
  });
});

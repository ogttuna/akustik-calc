import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";

describe("exact floor companion audit", () => {
  it("keeps Ln,w+CI internally consistent wherever CI is published", () => {
    for (const row of EXACT_FLOOR_SYSTEMS) {
      const impactRatings = row.impactRatings;
      if (!impactRatings || typeof impactRatings.CI !== "number") {
        continue;
      }

      expect(typeof impactRatings.LnW, row.id).toBe("number");
      expect(typeof impactRatings.LnWPlusCI, row.id).toBe("number");
      expect(impactRatings.LnWPlusCI, row.id).toBeCloseTo(impactRatings.LnW + impactRatings.CI, 6);
    }
  });

  it("keeps CI50 companions promotable to standardized L'nT,50 on direct exact routes", () => {
    const rowsWithCi50 = EXACT_FLOOR_SYSTEMS.filter(
      (row) => typeof row.impactRatings?.CI50_2500 === "number"
    );

    expect(rowsWithCi50.length).toBeGreaterThan(0);

    for (const row of rowsWithCi50) {
      const result = calculateImpactOnly([], {
        officialFloorSystemId: row.id,
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        }
      });

      expect(result.ok, row.id).toBe(true);
      expect(result.impact?.CI50_2500, row.id).toBe(row.impactRatings?.CI50_2500);
      expect(result.impact?.LPrimeNT50, row.id).toEqual(expect.any(Number));
      expect(result.impact?.availableOutputs, row.id).toContain("L'nT,50");
      expect(result.impact?.metricBasis?.LPrimeNT50, row.id).toBe(
        "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500"
      );
      expect(result.impact?.LPrimeNT50, row.id).toBeCloseTo(
        (result.impact?.LPrimeNTw as number) + (row.impactRatings?.CI50_2500 as number),
        6
      );
    }
  });

  it("keeps exact rows without CI50 fail-closed on the local-guide L'nT,50 path", () => {
    const officialRowsWithoutCi50 = EXACT_FLOOR_SYSTEMS.filter((row) => {
      const impactRatings = row.impactRatings;
      return (
        String(row.sourceType ?? "").startsWith("official") &&
        typeof impactRatings?.CI === "number" &&
        typeof impactRatings.CI50_2500 !== "number"
      );
    });

    expect(officialRowsWithoutCi50.length).toBeGreaterThan(0);

    for (const row of officialRowsWithoutCi50) {
      const result = calculateImpactOnly([], {
        officialFloorSystemId: row.id,
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        }
      });

      if (typeof result.impact?.LPrimeNT50 !== "number") {
        continue;
      }

      expect(result.impact?.metricBasis?.LPrimeNT50, row.id).toBe(
        "estimated_local_guide_tr_simple_method_lnwci_plus_k_plus_hd"
      );
      expect(result.impact?.guideEstimateProfile, row.id).toBe(
        "tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd"
      );
    }
  });
});

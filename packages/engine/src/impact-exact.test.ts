import { describe, expect, it } from "vitest";

import { buildExactImpactFromSource } from "./impact-exact";

describe("buildExactImpactFromSource", () => {
  it("derives exact lab-side impact ratings from a nominal one-third-octave curve", () => {
    const result = buildExactImpactFromSource({
      frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
      labOrField: "lab",
      levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43],
      standardMethod: "ISO 10140-3"
    });

    expect(result).not.toBeNull();
    expect(result?.basis).toBe("exact_source_band_curve_iso7172");
    expect(result?.labOrField).toBe("lab");
    expect(result?.LnW).toBe(53);
    expect(result?.CI).toBe(-3);
    expect(result?.CI50_2500).toBe(-1);
    expect(result?.LnWPlusCI).toBe(50);
    expect(result?.bandSet).toBe("one_third_octave_100_3150");
    expect(result?.confidence.level).toBe("high");
    expect(result?.confidence.provenance).toBe("exact_band_curve");
    expect(result?.availableOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(result?.metricBasis?.LnW).toBe("exact_source_band_curve_iso7172");
    expect(result?.metricBasis?.CI).toBe("exact_source_band_curve_iso7172");
    expect(result?.metricBasis?.CI50_2500).toBe("exact_source_band_curve_iso7172");
    expect(result?.metricBasis?.LnWPlusCI).toBe("exact_source_band_curve_iso7172");
  });

  it("derives exact field-side impact ratings from a nominal one-third-octave curve", () => {
    const result = buildExactImpactFromSource({
      frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
      labOrField: "field",
      levelsDb: [63, 62, 61, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46],
      standardMethod: "ISO 16283-2"
    });

    expect(result).not.toBeNull();
    expect(result?.labOrField).toBe("field");
    expect(result?.LnW).toBeUndefined();
    expect(result?.LPrimeNTw).toBe(56);
    expect(result?.CI).toBe(-3);
    expect(result?.CI50_2500).toBe(-1);
    expect(result?.LPrimeNT50).toBe(55);
    expect(result?.availableOutputs).toEqual(["L'nT,w", "CI", "CI,50-2500", "L'nT,50"]);
    expect(result?.metricBasis?.LPrimeNTw).toBe("exact_source_band_curve_iso7172");
    expect(result?.metricBasis?.LPrimeNT50).toBe("exact_source_band_curve_iso7172");
  });

  it("fails closed for off-grid impact bands", () => {
    const result = buildExactImpactFromSource({
      frequenciesHz: [90, 130, 180, 230, 290, 360, 450, 560, 710, 900, 1120, 1400, 1800, 2240, 2800, 3550],
      labOrField: "lab",
      levelsDb: [58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
    });

    expect(result).toBeNull();
  });
});

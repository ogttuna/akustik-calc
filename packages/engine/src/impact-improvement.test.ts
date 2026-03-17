import { describe, expect, it } from "vitest";

import { buildExactImpactImprovementReference } from "./impact-improvement";

describe("buildExactImpactImprovementReference", () => {
  it("derives DeltaLw and treated heavy-reference Ln,w from an exact improvement curve", () => {
    const result = buildExactImpactImprovementReference({
      frequenciesHz: [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
      improvementDb: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
      referenceFloorType: "heavy_standard",
      standardMethod: "ISO 10140-3"
    });

    expect(result).not.toBeNull();
    expect(result?.basis).toBe("exact_source_improvement_curve_iso7172");
    expect(result?.DeltaLw).toBe(20);
    expect(result?.LnW).toBe(58);
    expect(result?.treatedReferenceLnW).toBe(58);
    expect(result?.bareReferenceLnW).toBe(78);
    expect(result?.referenceFloorType).toBe("heavy_standard");
    expect(result?.confidence.level).toBe("high");
    expect(result?.confidence.provenance).toBe("exact_band_curve");
    expect(result?.metricBasis?.LnW).toBe("exact_source_improvement_curve_iso7172");
    expect(result?.metricBasis?.DeltaLw).toBe("exact_source_improvement_curve_iso7172");
  });

  it("fails closed for non-nominal or unsupported reference inputs", () => {
    expect(
      buildExactImpactImprovementReference({
        frequenciesHz: [90, 130, 180, 230, 290, 360, 450, 560, 710, 900, 1120, 1400, 1800, 2240, 2800, 3550],
        improvementDb: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        referenceFloorType: "heavy_standard"
      })
    ).toBeNull();
  });
});

import { describe, expect, it } from "vitest";

import { deriveHeavyReferenceImpactFromDeltaLw } from "./impact-reference";

describe("deriveHeavyReferenceImpactFromDeltaLw", () => {
  it("derives a narrow heavy-reference impact result from DeltaLw", () => {
    const result = deriveHeavyReferenceImpactFromDeltaLw(24);

    expect(result).not.toBeNull();
    expect(result?.basis).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result?.bareReferenceLnW).toBe(78);
    expect(result?.treatedReferenceLnW).toBe(54);
    expect(result?.confidence.level).toBe("low");
    expect(result?.confidence.provenance).toBe("reference_derived");
    expect(result?.DeltaLw).toBe(24);
    expect(result?.LnW).toBe(54);
    expect(result?.availableOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result?.labOrField).toBe("lab");
    expect(result?.referenceFloorType).toBe("heavy_standard");
    expect(result?.metricBasis?.LnW).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result?.metricBasis?.DeltaLw).toBe("predictor_explicit_delta_user_input");
  });

  it("rejects invalid improvement values", () => {
    expect(deriveHeavyReferenceImpactFromDeltaLw(-1)).toBeNull();
    expect(deriveHeavyReferenceImpactFromDeltaLw(Number.NaN)).toBeNull();
    expect(deriveHeavyReferenceImpactFromDeltaLw(90)).toBeNull();
  });
});

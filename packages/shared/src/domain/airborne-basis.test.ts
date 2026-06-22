import { describe, expect, it } from "vitest";

import {
  AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE,
  AirborneResultBasisSchema
} from "./airborne-basis";

describe("AirborneResultBasisSchema user-verified calculated exact provenance", () => {
  it("accepts a neutral exact user-verified calculated basis without measured/source labels", () => {
    const parsed = AirborneResultBasisSchema.safeParse({
      assumptions: [
        "user-verified calculated anchor fingerprint exactly matches the current element-lab wall request"
      ],
      curveBasis: "calculated_single_number_estimate",
      exactSourceId: "verified-calculated-anchor-1",
      kind: "airborne_user_verified_calculated_exact",
      measurementStandard: "none",
      method: "post_v1_project_user_verified_calculated_exact_bridge",
      missingPhysicalInputs: [],
      missingSourceEvidence: [],
      origin: "user_verified_calculated_exact",
      propertyDefaults: [],
      ratingStandard: "none",
      requiredInputs: [
        "airborneUserVerifiedCalculatedAnchors",
        "canonicalUserVerifiedCalculatedFingerprint",
        "targetOutput:Rw"
      ],
      toleranceClass: "user_verified_calculated_exact"
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.origin).toBe("user_verified_calculated_exact");
      expect(parsed.data.kind).toBe("airborne_user_verified_calculated_exact");
      expect(parsed.data.kind).not.toBe("airborne_measured_exact");
    }
  });

  it("keeps user-verified calculated exact below measured evidence and above formula routes", () => {
    expect(AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE.indexOf("measured_exact_full_stack")).toBeLessThan(
      AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE.indexOf("user_verified_calculated_exact")
    );
    expect(
      AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE.indexOf("measured_exact_subassembly_plus_calculated_delta")
    ).toBeLessThan(AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE.indexOf("user_verified_calculated_exact"));
    expect(AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE.indexOf("user_verified_calculated_exact")).toBeLessThan(
      AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE.indexOf("family_physics_prediction")
    );
  });
});

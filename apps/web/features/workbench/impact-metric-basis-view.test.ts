import { describe, expect, it } from "vitest";

import {
  describeImpactMetricBasis,
  formatImpactMetricBasisLabel
} from "./impact-metric-basis-view";

describe("impact metric basis view", () => {
  it("keeps official catalog DeltaLw provenance separate from explicit user input", () => {
    expect(formatImpactMetricBasisLabel("predictor_catalog_product_delta_official")).toBe(
      "Official product DeltaLw row"
    );
    expect(
      describeImpactMetricBasis("DeltaLw", "predictor_catalog_product_delta_official")
    ).toContain("matched official DeltaLw catalog row");
    expect(
      describeImpactMetricBasis("LnW", "predictor_catalog_product_delta_heavy_reference_derived")
    ).toContain("fixed ISO heavy reference floor");
    expect(
      describeImpactMetricBasis("DeltaLw", "predictor_explicit_delta_user_input")
    ).toContain("supplied DeltaLw input");
    expect(
      describeImpactMetricBasis("DeltaLw", "predictor_explicit_delta_user_input")
    ).not.toContain("catalog-backed");
  });
});

import { describe, expect, it } from "vitest";

import { parseImpactBandImport } from "./impact-band-import";

describe("impact band import", () => {
  it("advertises Dutch LnT,A only for exact five-octave field imports", () => {
    const parsed = parseImpactBandImport({
      labOrField: "field",
      text: "63.5 66.5 60.1 54.4 42.1"
    });

    expect(parsed.error).toBeNull();
    expect(parsed.parsed?.detectedBandSetId).toBe("five_octave_125_2000");
    expect(parsed.parsed?.summary).toBe("L'nT,w + CI + LnT,A");
  });

  it("keeps five-octave lab imports out of the Dutch LnT,A lane", () => {
    const parsed = parseImpactBandImport({
      labOrField: "lab",
      text: "63.5 66.5 60.1 54.4 42.1"
    });

    expect(parsed.error).toBeNull();
    expect(parsed.parsed?.detectedBandSetId).toBe("five_octave_125_2000");
    expect(parsed.parsed?.summary).toBe("Ln,w + CI");
  });

  it("keeps extended field one-third-octave imports on the existing ISO 717-2 field chain", () => {
    const parsed = parseImpactBandImport({
      labOrField: "field",
      text: "63 62 61 61 60 59 58 57 56 55 54 53 52 51 50 49 48 47 46"
    });

    expect(parsed.error).toBeNull();
    expect(parsed.parsed?.detectedBandSetId).toBe("one_third_octave_50_3150");
    expect(parsed.parsed?.summary).toBe("L'nT,w + CI + CI,50-2500 + L'nT,50");
  });
});

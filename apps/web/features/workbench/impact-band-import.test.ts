import { describe, expect, it } from "vitest";

import {
  calculateImpactOnly,
  IMPACT_RATING_OFFSETS_THIRD
} from "@dynecho/engine";

import { parseImpactBandImport } from "./impact-band-import";

function astmContourLevels(baseContourPlusDeficiencyDb: number): string {
  return IMPACT_RATING_OFFSETS_THIRD.map((offset) => baseContourPlusDeficiencyDb + offset).join(" ");
}

describe("impact band import", () => {
  it("advertises Dutch LnT,A only for exact five-octave field imports", () => {
    const parsed = parseImpactBandImport({
      labOrField: "field",
      text: "63.5 66.5 60.1 54.4 42.1"
    });

    expect(parsed.error).toBeNull();
    expect(parsed.parsed?.detectedBandSetId).toBe("five_octave_125_2000");
    expect(parsed.parsed?.summary).toBe("L'nT,w + CI + LnT,A");
    expect(parsed.parsed?.source.standardMethod).toBe("ISO 16283-2");
  });

  it("keeps five-octave lab imports out of the Dutch LnT,A lane", () => {
    const parsed = parseImpactBandImport({
      labOrField: "lab",
      text: "63.5 66.5 60.1 54.4 42.1"
    });

    expect(parsed.error).toBeNull();
    expect(parsed.parsed?.detectedBandSetId).toBe("five_octave_125_2000");
    expect(parsed.parsed?.summary).toBe("Ln,w + CI");
    expect(parsed.parsed?.source.standardMethod).toBe("ISO 10140-3");
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

  it("carries an explicit ASTM E492/E989 lab method into the exact IIC owner", () => {
    const parsed = parseImpactBandImport({
      labOrField: "lab",
      standardMethod: "ASTM E492 / ASTM E989",
      text: astmContourLevels(62)
    });

    expect(parsed.error).toBeNull();
    expect(parsed.parsed?.detectedBandSetId).toBe("one_third_octave_100_3150");
    expect(parsed.parsed?.source.standardMethod).toBe("ASTM E492 / ASTM E989");

    const result = calculateImpactOnly([], {
      exactImpactSource: parsed.parsed?.source ?? null,
      targetOutputs: ["IIC"]
    });

    expect(result.impact?.IIC).toBe(50);
    expect(result.supportedTargetOutputs).toEqual(["IIC"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("detects an ASTM E1007/E989 method header without turning ISO defaults into ASTM aliases", () => {
    const parsed = parseImpactBandImport({
      labOrField: "field",
      text: `ASTM E1007 / ASTM E989\n${astmContourLevels(62)}`
    });

    expect(parsed.error).toBeNull();
    expect(parsed.parsed?.detectedBandSetId).toBe("one_third_octave_100_3150");
    expect(parsed.parsed?.source.standardMethod).toBe("ASTM E1007 / ASTM E989");

    const result = calculateImpactOnly([], {
      exactImpactSource: parsed.parsed?.source ?? null,
      targetOutputs: ["AIIC"]
    });

    expect(result.impact?.AIIC).toBe(50);
    expect(result.supportedTargetOutputs).toEqual(["AIIC"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });
});

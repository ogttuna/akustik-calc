import { describe, expect, it } from "vitest";

import { buildExactImpactFromSource } from "./impact-exact";

type BenchmarkCase = {
  expectedLnTA: number;
  id: string;
  levelsDb: readonly number[];
};

const ROTTERDAM_W143_NEN5077_REPORT_URL =
  "https://repository.officiele-overheidspublicaties.nl/Bijlagen/TerInzageLegging/2022/til-2022-1304/1/bijlage/06.W143-R01_akoestiek_metingenNEN5077.pdf";

const BENCHMARK_CASES: readonly BenchmarkCase[] = [
  {
    id: "w143_p15_werkkamer_vd3",
    levelsDb: [63.5, 66.5, 60.1, 54.4, 42.1],
    expectedLnTA: 54.1
  },
  {
    id: "w143_p16_kantoor_vd2",
    levelsDb: [71.3, 65.7, 61.5, 57.7, 48.8],
    expectedLnTA: 57.8
  },
  {
    id: "w143_p17_kantoor_vd2_links",
    levelsDb: [67.8, 63.3, 62.0, 59.6, 48.6],
    expectedLnTA: 55.3
  },
  {
    id: "w143_p18_kantoor_vd2_rechts",
    levelsDb: [60.7, 61.1, 57.3, 51.4, 39.0],
    expectedLnTA: 50.0
  }
] as const;

function computeMae(errors: readonly number[]): number {
  return errors.reduce((sum, error) => sum + error, 0) / Math.max(errors.length, 1);
}

describe("impact dutch benchmark", () => {
  it("reconstructs public NEN 5077-style LnT,A report rows tightly from exact octave field bands", () => {
    const errors = BENCHMARK_CASES.map((testCase) => {
      const result = buildExactImpactFromSource({
        frequenciesHz: [125, 250, 500, 1000, 2000],
        labOrField: "field",
        levelsDb: [...testCase.levelsDb],
        standardMethod: "NEN 5077 / ISO 16283-2"
      });

      const absoluteError = Math.abs((result?.LnTA ?? Number.NaN) - testCase.expectedLnTA);

      expect(result, testCase.id).not.toBeNull();
      expect(result?.availableOutputs.includes("LnT,A"), testCase.id).toBe(true);
      expect(result?.metricBasis?.LnTA, testCase.id).toBe("exact_source_dutch_lnta_from_octave_bands");
      expect(absoluteError, `${testCase.id} (${ROTTERDAM_W143_NEN5077_REPORT_URL})`).toBeLessThanOrEqual(0.11);

      return absoluteError;
    });

    expect(computeMae(errors)).toBeLessThanOrEqual(0.06);
    expect(Math.max(...errors)).toBeLessThanOrEqual(0.11);
  });
});

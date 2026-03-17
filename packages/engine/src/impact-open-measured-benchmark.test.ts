import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";

type OpenMeasuredCase = {
  airborneBands: {
    frequencies: number[];
    values: number[];
  };
  expected: {
    lnwDb: number;
    lnwPlusCi50Db: number;
    lnwPlusCiDb: number;
    rwDb: number;
    rwPlusCtrDb: number;
  };
  id: string;
  impactBands: {
    frequencies: number[];
    values: number[];
  };
  label: string;
  source: string;
};

type OpenMeasuredDataset = {
  cases: OpenMeasuredCase[];
  datasetId: string;
  schemaVersion: number;
  source: string;
};

function loadDataset(): OpenMeasuredDataset {
  return JSON.parse(
    readFileSync(new URL("../fixtures/reference-benchmarks-impact-open-measured-tuas-2026.json", import.meta.url), "utf8")
  ) as OpenMeasuredDataset;
}

describe("impact open measured benchmark corpus", () => {
  it("stays well-formed", () => {
    const dataset = loadDataset();

    expect(dataset.schemaVersion).toBe(1);
    expect(Array.isArray(dataset.cases)).toBe(true);
    expect(dataset.cases.length).toBeGreaterThanOrEqual(8);

    for (const entry of dataset.cases) {
      expect(typeof entry.id).toBe("string");
      expect(String(entry.source)).toMatch(/^https:\/\//);
      expect(entry.impactBands.frequencies.length).toBe(entry.impactBands.values.length);
      expect(entry.airborneBands.frequencies.length).toBe(entry.airborneBands.values.length);
    }
  });

  it("keeps exact Ln,w, Ln,w+CI, and Ln,w+CI,50-2500 alignment on open measured impact curves", () => {
    const dataset = loadDataset();
    const errors: string[] = [];

    for (const entry of dataset.cases) {
      const result = calculateImpactOnly([], {
        exactImpactSource: {
          frequenciesHz: entry.impactBands.frequencies,
          labOrField: "lab",
          levelsDb: entry.impactBands.values,
          standardMethod: "ISO 10140-3"
        },
        targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
      });

      const impact = result.impact;
      const lnw = typeof impact?.LnW === "number" ? impact.LnW : null;
      const lnwPlusCi = typeof impact?.LnWPlusCI === "number" ? impact.LnWPlusCI : null;
      const lnwPlusCi50 =
        typeof impact?.LnW === "number" && typeof impact.CI50_2500 === "number"
          ? impact.LnW + impact.CI50_2500
          : null;

      if (lnw !== entry.expected.lnwDb) {
        errors.push(`${entry.id}: expected Ln,w ${entry.expected.lnwDb}, got ${lnw}`);
      }

      if (lnwPlusCi !== entry.expected.lnwPlusCiDb) {
        errors.push(`${entry.id}: expected Ln,w+CI ${entry.expected.lnwPlusCiDb}, got ${lnwPlusCi}`);
      }

      if (lnwPlusCi50 === null || Math.abs(lnwPlusCi50 - entry.expected.lnwPlusCi50Db) > 0.11) {
        errors.push(
          `${entry.id}: expected Ln,w+CI,50-2500 ${entry.expected.lnwPlusCi50Db}, got ${lnwPlusCi50 === null ? "null" : lnwPlusCi50.toFixed(2)}`
        );
      }

      if (impact?.basis !== "exact_source_band_curve_iso7172") {
        errors.push(`${entry.id}: expected exact ISO 717-2 impact basis, got ${impact?.basis ?? "null"}`);
      }
    }

    expect(errors).toEqual([]);
  });
});

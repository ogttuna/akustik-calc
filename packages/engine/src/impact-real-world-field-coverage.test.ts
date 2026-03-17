import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import type { CalculateImpactOnlyOptions } from "./calculate-impact-only";

import { calculateImpactOnly } from "./calculate-impact-only";

type RealWorldFieldCoverageCase = {
  expected: {
    basis: string;
    lnwUpperBoundDb?: number;
    lprimeNT50Db?: number;
    lprimeNTwDb?: number;
    lprimeNTwUpperBoundDb?: number;
    lprimeNwDb?: number;
    lprimeNwUpperBoundDb?: number;
  };
  family: string;
  id: string;
  kind: "field_bound" | "field_live";
  options: CalculateImpactOnlyOptions;
  source: string;
  tolerances?: {
    lnwUpperBoundDb?: number;
    lprimeNT50Db?: number;
    lprimeNTwDb?: number;
    lprimeNTwUpperBoundDb?: number;
    lprimeNwDb?: number;
    lprimeNwUpperBoundDb?: number;
  };
  visibleLayers: Parameters<typeof calculateImpactOnly>[0];
};

type RealWorldFieldCoverageDataset = {
  cases: RealWorldFieldCoverageCase[];
  description: string;
  name: string;
  schemaVersion: number;
};

function loadDataset(): RealWorldFieldCoverageDataset {
  return JSON.parse(
    readFileSync(new URL("../fixtures/reference-benchmarks-impact-real-world-field-coverage-2026.json", import.meta.url), "utf8")
  ) as RealWorldFieldCoverageDataset;
}

function numberOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

describe("representative real-world field coverage", () => {
  it("stays well-formed and source-labeled", () => {
    const dataset = loadDataset();

    expect(dataset.schemaVersion).toBe(1);
    expect(dataset.cases.length).toBeGreaterThanOrEqual(6);

    for (const entry of dataset.cases) {
      expect(typeof entry.id).toBe("string");
      expect(typeof entry.family).toBe("string");
      expect(typeof entry.source).toBe("string");
      expect(entry.source.length).toBeGreaterThan(0);
      expect(["field_bound", "field_live"]).toContain(entry.kind);
      expect(Array.isArray(entry.visibleLayers)).toBe(true);
      expect(typeof entry.options).toBe("object");
      expect(typeof entry.expected.basis).toBe("string");
    }
  });

  it("keeps major floor families on a non-empty field-side continuation lane inside tolerance", () => {
    const dataset = loadDataset();
    const failures: string[] = [];

    for (const entry of dataset.cases) {
      const result = calculateImpactOnly(entry.visibleLayers, entry.options);

      if (entry.kind === "field_bound") {
        if (result.impact) {
          failures.push(`${entry.id}: expected the field lane to stay bound-only`);
        }

        if (result.lowerBoundImpact?.basis !== entry.expected.basis) {
          failures.push(`${entry.id}: expected lower-bound basis ${entry.expected.basis}, got ${result.lowerBoundImpact?.basis ?? "null"}`);
        }

        const metrics = [
          ["lnwUpperBoundDb", "LnWUpperBound"],
          ["lprimeNwUpperBoundDb", "LPrimeNWUpperBound"],
          ["lprimeNTwUpperBoundDb", "LPrimeNTwUpperBound"]
        ] as const;

        for (const [expectedKey, actualKey] of metrics) {
          const expectedValue = entry.expected[expectedKey];
          if (expectedValue === undefined) {
            continue;
          }
          const actualValue = numberOrNull(result.lowerBoundImpact?.[actualKey]);
          const tolerance = Number(entry.tolerances?.[expectedKey] ?? 0);

          if (actualValue === null || Math.abs(actualValue - Number(expectedValue)) > tolerance) {
            failures.push(
              `${entry.id}: ${actualKey} error ${actualValue === null ? "null" : Math.abs(actualValue - Number(expectedValue)).toFixed(2)} dB exceeds tolerance ${tolerance}`
            );
          }
        }

        continue;
      }

      if (!result.impact) {
        failures.push(`${entry.id}: missing live field impact result`);
        continue;
      }

      if (result.impact.basis !== entry.expected.basis) {
        failures.push(`${entry.id}: expected field basis ${entry.expected.basis}, got ${result.impact.basis ?? "null"}`);
      }

      const metrics = [
        ["lprimeNwDb", "LPrimeNW"],
        ["lprimeNTwDb", "LPrimeNTw"],
        ["lprimeNT50Db", "LPrimeNT50"]
      ] as const;

      for (const [expectedKey, actualKey] of metrics) {
        const expectedValue = entry.expected[expectedKey];
        if (expectedValue === undefined) {
          continue;
        }
        const actualValue = numberOrNull(result.impact[actualKey]);
        const tolerance = Number(entry.tolerances?.[expectedKey] ?? 0);

        if (actualValue === null || Math.abs(actualValue - Number(expectedValue)) > tolerance) {
          failures.push(
            `${entry.id}: ${actualKey} error ${actualValue === null ? "null" : Math.abs(actualValue - Number(expectedValue)).toFixed(2)} dB exceeds tolerance ${tolerance}`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });
});

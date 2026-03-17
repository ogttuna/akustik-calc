import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import type { LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

type RealWorldFloorCoverageCase = {
  expected: {
    floorRwDb: number;
    floorSystemId?: string;
    impactBasis?: string;
    impactMetric?: "LnW" | "LnWPlusCI";
    impactValueDb?: number;
    lowerBoundBasis?: string;
    lnwUpperBoundDb?: number;
  };
  family: string;
  id: string;
  kind: "bound_estimate" | "bound_match" | "estimate" | "exact_match";
  layers: LayerInput[];
  source: string;
  tolerances?: {
    floorRwDb?: number;
    impactValueDb?: number;
    lnwUpperBoundDb?: number;
  };
};

type RealWorldFloorCoverageDataset = {
  cases: RealWorldFloorCoverageCase[];
  description: string;
  name: string;
  schemaVersion: number;
};

function loadDataset(): RealWorldFloorCoverageDataset {
  return JSON.parse(
    readFileSync(new URL("../fixtures/reference-benchmarks-impact-real-world-floor-coverage-2026.json", import.meta.url), "utf8")
  ) as RealWorldFloorCoverageDataset;
}

function numberOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

describe("representative real-world floor coverage", () => {
  it("stays well-formed and source-labeled", () => {
    const dataset = loadDataset();

    expect(dataset.schemaVersion).toBe(1);
    expect(dataset.cases.length).toBeGreaterThanOrEqual(8);

    for (const entry of dataset.cases) {
      expect(typeof entry.id).toBe("string");
      expect(typeof entry.family).toBe("string");
      expect(typeof entry.source).toBe("string");
      expect(entry.source.length).toBeGreaterThan(0);
      expect(["bound_estimate", "bound_match", "estimate", "exact_match"]).toContain(entry.kind);
      expect(Array.isArray(entry.layers)).toBe(true);
      expect(typeof entry.expected.floorRwDb).toBe("number");
    }
  });

  it("keeps major floor families on a non-empty labeled impact lane inside tolerance", () => {
    const dataset = loadDataset();
    const failures: string[] = [];

    for (const entry of dataset.cases) {
      const result = calculateAssembly(entry.layers);
      const floorRw = numberOrNull(result.floorSystemRatings?.Rw);
      const floorRwTolerance = Number(entry.tolerances?.floorRwDb ?? 0);

      if (floorRw === null || Math.abs(floorRw - Number(entry.expected.floorRwDb)) > floorRwTolerance) {
        failures.push(
          `${entry.id}: floor Rw error ${floorRw === null ? "null" : Math.abs(floorRw - Number(entry.expected.floorRwDb)).toFixed(2)} dB exceeds tolerance ${floorRwTolerance}`
        );
        continue;
      }

      if (entry.kind === "bound_match" || entry.kind === "bound_estimate") {
        if (result.impact) {
          failures.push(`${entry.id}: expected no exact impact metric on the live lane`);
        }

        const upper = numberOrNull(result.lowerBoundImpact?.LnWUpperBound);
        const upperTolerance = Number(entry.tolerances?.lnwUpperBoundDb ?? 0);

        if (upper === null || Math.abs(upper - Number(entry.expected.lnwUpperBoundDb)) > upperTolerance) {
          failures.push(
            `${entry.id}: Ln,w upper-bound error ${upper === null ? "null" : Math.abs(upper - Number(entry.expected.lnwUpperBoundDb)).toFixed(2)} dB exceeds tolerance ${upperTolerance}`
          );
        }

        if (entry.expected.lowerBoundBasis && result.lowerBoundImpact?.basis !== entry.expected.lowerBoundBasis) {
          failures.push(
            `${entry.id}: expected lower-bound basis ${entry.expected.lowerBoundBasis}, got ${result.lowerBoundImpact?.basis ?? "null"}`
          );
        }

        if (entry.expected.floorSystemId) {
          const boundId =
            entry.kind === "bound_match"
              ? result.boundFloorSystemMatch?.system.id
              : result.boundFloorSystemEstimate?.sourceSystems[0]?.id;

          if (boundId !== entry.expected.floorSystemId) {
            failures.push(`${entry.id}: expected lead bound row ${entry.expected.floorSystemId}, got ${boundId ?? "null"}`);
          }
        }

        continue;
      }

      const impactValue = numberOrNull(result.impact?.[entry.expected.impactMetric ?? "LnW"]);
      const impactTolerance = Number(entry.tolerances?.impactValueDb ?? 0);

      if (impactValue === null || Math.abs(impactValue - Number(entry.expected.impactValueDb)) > impactTolerance) {
        failures.push(
          `${entry.id}: impact error ${impactValue === null ? "null" : Math.abs(impactValue - Number(entry.expected.impactValueDb)).toFixed(2)} dB exceeds tolerance ${impactTolerance}`
        );
      }

      if (entry.expected.impactBasis && result.impact?.basis !== entry.expected.impactBasis) {
        failures.push(`${entry.id}: expected impact basis ${entry.expected.impactBasis}, got ${result.impact?.basis ?? "null"}`);
      }

      if (entry.expected.floorSystemId) {
        const leadId = result.floorSystemMatch?.system.id ?? result.floorSystemEstimate?.sourceSystems[0]?.id;

        if (leadId !== entry.expected.floorSystemId) {
          failures.push(`${entry.id}: expected lead floor-system id ${entry.expected.floorSystemId}, got ${leadId ?? "null"}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});

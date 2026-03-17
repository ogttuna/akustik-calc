import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  formatImpactValidationTolerance,
  getImpactValidationFamilyRegimeById,
  getImpactValidationFamilyIdFromSupportFamily,
  getImpactValidationModeRegimeById,
  IMPACT_VALIDATION_MODE_MATRIX,
  IMPACT_VALIDATION_CORPUS_SUMMARY,
  IMPACT_VALIDATION_FAMILY_MATRIX
} from "./impact-validation-regime";

type FloorDatasetCase = {
  family: string;
  tolerances?: Record<string, number>;
};

type FieldDatasetCase = {
  family: string;
  tolerances?: Record<string, number>;
};

type BenchmarkDatasetCase = {
  id: string;
  impactPredictorInput: {
    structuralSupportType: string;
  };
  mode: string;
};

function loadFloorDataset(): { cases: FloorDatasetCase[] } {
  return JSON.parse(
    readFileSync(new URL("../fixtures/reference-benchmarks-impact-real-world-floor-coverage-2026.json", import.meta.url), "utf8")
  ) as { cases: FloorDatasetCase[] };
}

function loadFieldDataset(): { cases: FieldDatasetCase[] } {
  return JSON.parse(
    readFileSync(new URL("../fixtures/reference-benchmarks-impact-real-world-field-coverage-2026.json", import.meta.url), "utf8")
  ) as { cases: FieldDatasetCase[] };
}

function loadBenchmarkDataset(): { cases: BenchmarkDatasetCase[] } {
  return JSON.parse(
    readFileSync(new URL("../fixtures/reference-benchmarks-impact-validation-2026.json", import.meta.url), "utf8")
  ) as { cases: BenchmarkDatasetCase[] };
}

function getCaseTolerance(caseEntry: { tolerances?: Record<string, number> }): number {
  const values = Object.values(caseEntry.tolerances ?? {});
  return values.length > 0 ? Math.max(...values) : 0;
}

describe("impact validation regime matrix", () => {
  it("stays aligned with the fixture-backed real-world coverage corpora", () => {
    const floorDataset = loadFloorDataset();
    const fieldDataset = loadFieldDataset();
    const floorFamilies = new Set(floorDataset.cases.map((entry) => entry.family));
    const fieldFamilies = new Set(fieldDataset.cases.map((entry) => entry.family));
    const allFamilies = new Set([...floorFamilies, ...fieldFamilies]);
    const matrixFamilies = new Set(IMPACT_VALIDATION_FAMILY_MATRIX.map((entry) => entry.id));

    expect(matrixFamilies).toEqual(allFamilies);
    expect(IMPACT_VALIDATION_CORPUS_SUMMARY.floorCases).toBe(floorDataset.cases.length);
    expect(IMPACT_VALIDATION_CORPUS_SUMMARY.fieldCases).toBe(fieldDataset.cases.length);
    expect(IMPACT_VALIDATION_CORPUS_SUMMARY.familiesTracked).toBe(matrixFamilies.size);

    const maxToleranceAcrossFixtures = Math.max(
      ...floorDataset.cases.map(getCaseTolerance),
      ...fieldDataset.cases.map(getCaseTolerance)
    );

    expect(IMPACT_VALIDATION_CORPUS_SUMMARY.toleranceBandMaxDb).toBe(maxToleranceAcrossFixtures);

    for (const entry of IMPACT_VALIDATION_FAMILY_MATRIX) {
      const floorCases = floorDataset.cases.filter((caseEntry) => caseEntry.family === entry.id);
      const fieldCases = fieldDataset.cases.filter((caseEntry) => caseEntry.family === entry.id);
      const familyMaxTolerance = Math.max(0, ...floorCases.map(getCaseTolerance), ...fieldCases.map(getCaseTolerance));

      expect(entry.floorCaseCount).toBe(floorCases.length);
      expect(entry.fieldCaseCount).toBe(fieldCases.length);
      expect(entry.maxToleranceDb).toBe(familyMaxTolerance);
    }
  });

  it("maps support-family ids back to the tracked validation families", () => {
    expect(getImpactValidationFamilyIdFromSupportFamily("timber_joists")).toBe("timber_frame");
    expect(getImpactValidationFamilyIdFromSupportFamily("steel_joists")).toBe("lightweight_steel");
    expect(getImpactValidationFamilyIdFromSupportFamily("reinforced_concrete")).toBe("reinforced_concrete");
    expect(formatImpactValidationTolerance(0)).toBe("0 dB");
    expect(formatImpactValidationTolerance(0.1)).toBe("0-0.1 dB");
  });

  it("stays aligned with the benchmark mode corpus", () => {
    const benchmarkDataset = loadBenchmarkDataset();
    const modeCounts = benchmarkDataset.cases.reduce(
      (acc, entry) => {
        acc[entry.mode] = (acc[entry.mode] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const familyModeCounts = benchmarkDataset.cases.reduce(
      (acc, entry) => {
        const familyId = getImpactValidationFamilyIdFromSupportFamily(
          entry.impactPredictorInput.structuralSupportType as never
        );

        if (!familyId) {
          throw new Error(`Untracked family in benchmark fixture: ${entry.id}`);
        }

        acc[familyId] ??= {};
        acc[familyId][entry.mode] = (acc[familyId][entry.mode] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, Record<string, number>>
    );

    expect(IMPACT_VALIDATION_CORPUS_SUMMARY.benchmarkCases).toBe(benchmarkDataset.cases.length);
    expect(IMPACT_VALIDATION_CORPUS_SUMMARY.benchmarkModesTracked).toBe(IMPACT_VALIDATION_MODE_MATRIX.length);
    expect(new Set(IMPACT_VALIDATION_MODE_MATRIX.map((entry) => entry.id))).toEqual(new Set(Object.keys(modeCounts)));
    expect(
      IMPACT_VALIDATION_FAMILY_MATRIX.reduce((sum, entry) => sum + entry.benchmarkCaseCount, 0)
    ).toBe(benchmarkDataset.cases.length);

    for (const entry of IMPACT_VALIDATION_MODE_MATRIX) {
      expect(entry.caseCount).toBe(modeCounts[entry.id]);
    }

    for (const entry of IMPACT_VALIDATION_FAMILY_MATRIX) {
      const familyCounts = familyModeCounts[entry.id] ?? {};
      const totalFamilyCases = Object.values(familyCounts).reduce((sum, value) => sum + value, 0);
      const postureCounts = entry.modeDistribution.reduce(
        (acc, distribution) => {
          const modeRegime = getImpactValidationModeRegimeById(distribution.id);

          if (!modeRegime) {
            throw new Error(`Missing mode regime: ${distribution.id}`);
          }

          acc[modeRegime.posture] += distribution.caseCount;
          return acc;
        },
        {
          bound: 0,
          estimate: 0,
          exact: 0,
          field: 0,
          low_confidence: 0
        }
      );

      expect(entry.benchmarkCaseCount).toBe(totalFamilyCases);
      expect(entry.postureCaseCounts).toEqual(postureCounts);
      expect(
        entry.modeDistribution.reduce((sum, distribution) => sum + distribution.caseCount, 0)
      ).toBe(entry.benchmarkCaseCount);
      expect(getImpactValidationFamilyRegimeById(entry.id)?.benchmarkCaseCount).toBe(entry.benchmarkCaseCount);

      for (const distribution of entry.modeDistribution) {
        expect(distribution.caseCount).toBe(familyCounts[distribution.id]);
      }
    }
  });
});

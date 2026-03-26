import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { normalizeAirborneBenchmarkDataset, runAirborneBenchmark } from "./airborne-benchmark";

type DatasetExpectation = {
  caseCount: number;
  dynamicMaxAbsErrorDb: number;
  dynamicMaeDb: number;
  fileName: string;
  metricPath?: string;
};

const PRIMARY_DATASETS: readonly DatasetExpectation[] = [
  {
    caseCount: 7,
    dynamicMaxAbsErrorDb: 4,
    dynamicMaeDb: 1.5,
    fileName: "reference-benchmarks-official-primary-2026.json",
    metricPath: "rw"
  },
  {
    caseCount: 13,
    dynamicMaxAbsErrorDb: 2.5,
    dynamicMaeDb: 1,
    fileName: "reference-benchmarks-field-official-2026.json",
    metricPath: "ratings.field.DnTA"
  },
  {
    caseCount: 12,
    dynamicMaxAbsErrorDb: 2.1,
    dynamicMaeDb: 0.6,
    fileName: "reference-benchmarks-rw-generic-holdout-2026.json",
    metricPath: "ratings.iso717.Rw"
  },
  {
    caseCount: 4,
    dynamicMaxAbsErrorDb: 0.7,
    dynamicMaeDb: 0.3,
    fileName: "reference-benchmarks-field-generic-holdout-2026.json",
    metricPath: "ratings.field.DnTA"
  }
] as const;

const SECONDARY_DATASETS: readonly DatasetExpectation[] = [
  {
    caseCount: 14,
    dynamicMaxAbsErrorDb: 7.1,
    dynamicMaeDb: 3,
    fileName: "reference-benchmarks-web-rw.json",
    metricPath: "rw"
  },
  {
    caseCount: 3,
    dynamicMaxAbsErrorDb: 1.1,
    dynamicMaeDb: 1,
    fileName: "reference-benchmarks-masonry-web.json",
    metricPath: "rw"
  },
  {
    caseCount: 6,
    dynamicMaxAbsErrorDb: 12.1,
    dynamicMaeDb: 3.1,
    fileName: "reference-benchmarks-secondary-sanity-2026.json",
    metricPath: "rw"
  },
  {
    caseCount: 7,
    dynamicMaxAbsErrorDb: 8.1,
    dynamicMaeDb: 4.1,
    fileName: "reference-benchmarks-siniat-official-2026.json",
    metricPath: "rw"
  },
  {
    caseCount: 4,
    dynamicMaxAbsErrorDb: 7.1,
    dynamicMaeDb: 4.6,
    fileName: "reference-benchmarks-british-gypsum-official-2026.json",
    metricPath: "rw"
  }
] as const;

function readDataset(fileName: string) {
  const fileUrl = new URL(`../fixtures/${fileName}`, import.meta.url);
  return normalizeAirborneBenchmarkDataset(JSON.parse(readFileSync(fileUrl, "utf8")));
}

describe("airborne benchmark ranking", () => {
  it("keeps the imported dynamic benchmark datasets well-formed", () => {
    for (const datasetInfo of [...PRIMARY_DATASETS, ...SECONDARY_DATASETS]) {
      const dataset = readDataset(datasetInfo.fileName);

      expect(dataset.cases, datasetInfo.fileName).toHaveLength(datasetInfo.caseCount);
      expect(dataset.name.length, datasetInfo.fileName).toBeGreaterThan(0);

      if (datasetInfo.metricPath) {
        expect(
          dataset.cases.every((entry) => entry.metricPath === datasetInfo.metricPath),
          datasetInfo.fileName
        ).toBe(true);
      }
    }
  });

  it(
    "keeps dynamic ranked first on the imported official and holdout corpora",
    () => {
      for (const datasetInfo of PRIMARY_DATASETS) {
        const dataset = readDataset(datasetInfo.fileName);
        const report = runAirborneBenchmark(dataset.cases);
        const best = report.summary[0];
        const dynamic = report.summary.find((entry) => entry.calculatorId === "dynamic");

        expect(best?.calculatorId, datasetInfo.fileName).toBe("dynamic");
        expect(dynamic, datasetInfo.fileName).toBeDefined();
        expect(dynamic?.maeDb ?? Number.POSITIVE_INFINITY, datasetInfo.fileName).toBeLessThanOrEqual(
          datasetInfo.dynamicMaeDb
        );
        expect(dynamic?.maxAbsErrorDb ?? Number.POSITIVE_INFINITY, datasetInfo.fileName).toBeLessThanOrEqual(
          datasetInfo.dynamicMaxAbsErrorDb
        );
        expect(dynamic?.winCount ?? 0, datasetInfo.fileName).toBeGreaterThan(0);
      }
    },
    10_000
  );

  it("keeps dynamic first across the imported secondary airborne watch corpora", () => {
    for (const datasetInfo of SECONDARY_DATASETS) {
      const dataset = readDataset(datasetInfo.fileName);
      const report = runAirborneBenchmark(dataset.cases);
      const best = report.summary[0];
      const dynamic = report.summary.find((entry) => entry.calculatorId === "dynamic");

      expect(best?.calculatorId, datasetInfo.fileName).toBe("dynamic");
      expect(dynamic, datasetInfo.fileName).toBeDefined();
      expect(dynamic?.maeDb ?? Number.POSITIVE_INFINITY, datasetInfo.fileName).toBeLessThanOrEqual(
        datasetInfo.dynamicMaeDb
      );
      expect(dynamic?.maxAbsErrorDb ?? Number.POSITIVE_INFINITY, datasetInfo.fileName).toBeLessThanOrEqual(
        datasetInfo.dynamicMaxAbsErrorDb
      );
      expect(dynamic?.winCount ?? 0, datasetInfo.fileName).toBeGreaterThan(0);
    }
  });
});

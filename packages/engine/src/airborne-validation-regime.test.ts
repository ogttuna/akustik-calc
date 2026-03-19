import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  AIRBORNE_VALIDATION_CORPUS_SUMMARY,
  AIRBORNE_VALIDATION_DATASET_MATRIX,
  AIRBORNE_VALIDATION_METRIC_MATRIX,
  getAirborneValidationDatasetRegimeById,
  getAirborneValidationMetricRegimeById
} from "./airborne-validation-regime";

const ACCEPTANCE_FIXTURE_PATH = "tools/upstream/fixtures/airborne-acceptance-cases.json";
const FRAMED_BENCHMARK_PATH = "packages/engine/src/airborne-framed-wall-benchmark.test.ts";
const MASONRY_BENCHMARK_PATH = "packages/engine/src/airborne-masonry-benchmark.test.ts";
const AIRCRETE_BENCHMARK_PATH = "packages/engine/src/airborne-aircrete-benchmark.test.ts";
const CELCON_FINISHED_BENCHMARK_PATH = "packages/engine/src/airborne-celcon-finished-benchmark.test.ts";
const YTONG_MASSIEF_BENCHMARK_PATH = "packages/engine/src/airborne-ytong-massief-benchmark.test.ts";
const YTONG_CELLENBETON_BENCHMARK_PATH = "packages/engine/src/airborne-ytong-cellenbetonblokken-benchmark.test.ts";
const YTONG_SEPARATIE_BENCHMARK_PATH = "packages/engine/src/airborne-ytong-separatiepanelen-benchmark.test.ts";

function readText(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8");
}

function countBenchmarkCaseCalls(path: string): number {
  const text = readText(path);
  return Math.max(0, [...text.matchAll(/benchmarkCase\(/g)].length - 1);
}

function countFramedDatasetCases(): Record<string, number> {
  const text = readText(FRAMED_BENCHMARK_PATH);
  const counts: Record<string, number> = {};

  for (const match of text.matchAll(/benchmarkCase\(\s*\n\s*"([^"]+)"/g)) {
    counts[match[1]] = (counts[match[1]] ?? 0) + 1;
  }

  return counts;
}

function countAcceptanceCases(): number {
  const dataset = JSON.parse(readText(ACCEPTANCE_FIXTURE_PATH)) as unknown[];
  return dataset.length;
}

function countAircreteCases(): number {
  const text = readText(AIRCRETE_BENCHMARK_PATH);
  return [...text.matchAll(/layers: buildLayers\(\[\[/g)].length;
}

function countCelconFinishedCases(): number {
  const text = readText(CELCON_FINISHED_BENCHMARK_PATH);
  const start = text.indexOf("const OFFICIAL_ROWS = [");
  const end = text.indexOf("] as const;", start);

  if (start < 0 || end < 0) {
    throw new Error("Unable to locate OFFICIAL_ROWS block in Celcon finished benchmark");
  }

  const rowsBlock = text.slice(start, end);
  const rowCount = [...rowsBlock.matchAll(/thicknessMm:\s*\d+/g)].length;

  return rowCount * 6;
}

describe("airborne validation regime matrix", () => {
  it("stays aligned with the fixture-backed airborne acceptance and benchmark corpora", () => {
    const framedDatasetCounts = countFramedDatasetCases();
    const screeningAcceptanceCases = countAcceptanceCases();
    const masonryCases = countBenchmarkCaseCalls(MASONRY_BENCHMARK_PATH);
    const aircreteCases = countAircreteCases();
    const celconFinishedCases = countCelconFinishedCases();
    const ytongMassiefCases = countBenchmarkCaseCalls(YTONG_MASSIEF_BENCHMARK_PATH);
    const ytongCellenbetonCases = countBenchmarkCaseCalls(YTONG_CELLENBETON_BENCHMARK_PATH);
    const ytongSeparatieCases = countBenchmarkCaseCalls(YTONG_SEPARATIE_BENCHMARK_PATH);

    expect(getAirborneValidationDatasetRegimeById("screening_acceptance")?.caseCount).toBe(screeningAcceptanceCases);
    expect(getAirborneValidationDatasetRegimeById("framed_official_primary")?.caseCount).toBe(
      framedDatasetCounts.official_primary
    );
    expect(getAirborneValidationDatasetRegimeById("framed_official_field")?.caseCount).toBe(
      framedDatasetCounts.official_field
    );
    expect(getAirborneValidationDatasetRegimeById("framed_rw_holdout")?.caseCount).toBe(
      framedDatasetCounts.rw_holdout
    );
    expect(getAirborneValidationDatasetRegimeById("framed_field_holdout")?.caseCount).toBe(
      framedDatasetCounts.field_holdout
    );
    expect(getAirborneValidationDatasetRegimeById("framed_exact_field_proxy_anchor")?.caseCount).toBe(
      framedDatasetCounts.official_field
    );
    expect(getAirborneValidationDatasetRegimeById("masonry_exact_anchor")?.caseCount).toBe(masonryCases);
    expect(getAirborneValidationDatasetRegimeById("masonry_raw_dynamic")?.caseCount).toBe(masonryCases);
    expect(getAirborneValidationDatasetRegimeById("aircrete_unfinished_raw_dynamic")?.caseCount).toBe(aircreteCases);
    expect(getAirborneValidationDatasetRegimeById("celcon_finished_raw_dynamic")?.caseCount).toBe(celconFinishedCases);
    expect(getAirborneValidationDatasetRegimeById("celcon_finished_final")?.caseCount).toBe(celconFinishedCases);
    expect(getAirborneValidationDatasetRegimeById("ytong_massief_raw_dynamic")?.caseCount).toBe(ytongMassiefCases);
    expect(getAirborneValidationDatasetRegimeById("ytong_massief_final")?.caseCount).toBe(ytongMassiefCases);
    expect(getAirborneValidationDatasetRegimeById("ytong_massief_approx_field_companion")?.caseCount).toBe(
      ytongMassiefCases
    );
    expect(getAirborneValidationDatasetRegimeById("ytong_cellenbeton_raw_dynamic")?.caseCount).toBe(
      ytongCellenbetonCases
    );
    expect(getAirborneValidationDatasetRegimeById("ytong_cellenbeton_approx_field_companion")?.caseCount).toBe(
      ytongCellenbetonCases
    );
    expect(getAirborneValidationDatasetRegimeById("ytong_separatie_raw_dynamic")?.caseCount).toBe(ytongSeparatieCases);
    expect(getAirborneValidationDatasetRegimeById("ytong_separatie_approx_field_companion")?.caseCount).toBe(
      ytongSeparatieCases
    );

    const expectedLabCases =
      framedDatasetCounts.official_primary +
      framedDatasetCounts.rw_holdout +
      masonryCases +
      aircreteCases +
      celconFinishedCases +
      ytongMassiefCases +
      ytongCellenbetonCases +
      ytongSeparatieCases;

    expect(AIRBORNE_VALIDATION_CORPUS_SUMMARY.screeningAcceptanceCases).toBe(screeningAcceptanceCases);
    expect(AIRBORNE_VALIDATION_CORPUS_SUMMARY.fieldLiveBenchmarkCases).toBe(
      framedDatasetCounts.official_field + framedDatasetCounts.field_holdout
    );
    expect(AIRBORNE_VALIDATION_CORPUS_SUMMARY.fieldProxyAnchorCases).toBe(framedDatasetCounts.official_field);
    expect(AIRBORNE_VALIDATION_CORPUS_SUMMARY.fieldApproximateCompanionCases).toBe(
      ytongMassiefCases + ytongCellenbetonCases + ytongSeparatieCases
    );
    expect(AIRBORNE_VALIDATION_CORPUS_SUMMARY.labBenchmarkCases).toBe(expectedLabCases);
    expect(AIRBORNE_VALIDATION_CORPUS_SUMMARY.datasetsTracked).toBe(AIRBORNE_VALIDATION_DATASET_MATRIX.length);
    expect(AIRBORNE_VALIDATION_CORPUS_SUMMARY.metricsTracked).toBe(AIRBORNE_VALIDATION_METRIC_MATRIX.length);
  });

  it("keeps the tracked airborne metric coverage complete for the primary lab and field outputs", () => {
    const requiredMetrics = new Set(["Rw", "R'w", "DnT,w", "DnT,A", "DnT,A,k", "Dn,w", "Dn,A"]);
    const matrixMetrics = new Set(AIRBORNE_VALIDATION_METRIC_MATRIX.map((entry) => entry.id));
    const datasetIds = new Set(AIRBORNE_VALIDATION_DATASET_MATRIX.map((entry) => entry.id));

    expect(matrixMetrics).toEqual(requiredMetrics);

    for (const metric of AIRBORNE_VALIDATION_METRIC_MATRIX) {
      expect(metric.datasetIds.length, metric.id).toBeGreaterThan(0);
      expect(getAirborneValidationMetricRegimeById(metric.id)?.id).toBe(metric.id);

      for (const datasetId of metric.datasetIds) {
        expect(datasetIds.has(datasetId), `${metric.id} references unknown dataset ${datasetId}`).toBe(true);
      }
    }

    const dntaKDatasets = getAirborneValidationMetricRegimeById("DnT,A,k")?.datasetIds ?? [];
    const dntaKCaseCount = dntaKDatasets.reduce(
      (sum, datasetId) => sum + (getAirborneValidationDatasetRegimeById(datasetId)?.caseCount ?? 0),
      0
    );

    expect(dntaKCaseCount).toBe(
      AIRBORNE_VALIDATION_CORPUS_SUMMARY.fieldProxyAnchorCases +
        AIRBORNE_VALIDATION_CORPUS_SUMMARY.fieldApproximateCompanionCases
    );
  });

  it("keeps the major airborne tolerance bands inside the intended strict corridor", () => {
    expect(getAirborneValidationDatasetRegimeById("screening_acceptance")?.thresholdMaxDb).toBe(1);
    expect(getAirborneValidationDatasetRegimeById("screening_acceptance")?.thresholdSurfaceMassKgM2).toBe(0.5);
    expect(getAirborneValidationDatasetRegimeById("screening_acceptance")?.thresholdThicknessMm).toBe(0.1);
    expect(getAirborneValidationDatasetRegimeById("framed_field_holdout")?.thresholdMaxDb).toBeLessThanOrEqual(0.7);
    expect(getAirborneValidationDatasetRegimeById("aircrete_unfinished_raw_dynamic")?.thresholdMaxDb).toBeLessThanOrEqual(1);
    expect(getAirborneValidationDatasetRegimeById("celcon_finished_raw_dynamic")?.thresholdMaeDb).toBeLessThanOrEqual(
      0.35
    );
    expect(getAirborneValidationDatasetRegimeById("masonry_raw_dynamic")?.thresholdMaxDb).toBeLessThanOrEqual(2.5);
  });
});

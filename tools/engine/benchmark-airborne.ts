import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  AIRBORNE_CALCULATORS,
  normalizeAirborneBenchmarkDataset,
  runAirborneBenchmark,
  type AirborneBenchmarkCase,
  type AirborneBenchmarkSummaryRow
} from "@dynecho/engine";
import type { AirborneCalculatorId } from "@dynecho/shared";

type ParsedArgs = {
  calculatorIds: AirborneCalculatorId[] | null;
  caseCsvPath: string | null;
  inputPath: string;
  jsonOutPath: string | null;
  showCases: boolean;
  summaryCsvPath: string | null;
};

function parseArgs(argv: readonly string[]): ParsedArgs {
  let calculatorIds: AirborneCalculatorId[] | null = null;
  let caseCsvPath: string | null = null;
  let inputPath = "packages/engine/fixtures/reference-benchmarks-official-primary-2026.json";
  let jsonOutPath: string | null = null;
  let showCases = false;
  let summaryCsvPath: string | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--show-cases") {
      showCases = true;
      continue;
    }

    if (token === "--input") {
      inputPath = argv[index + 1] ?? inputPath;
      index += 1;
      continue;
    }

    if (token === "--calculator") {
      const raw = argv[index + 1] ?? "";
      const allowed = new Set(AIRBORNE_CALCULATORS.map((calculator) => calculator.id));
      const parsed = raw
        .split(",")
        .map((value) => value.trim())
        .filter((value): value is AirborneCalculatorId => allowed.has(value as AirborneCalculatorId));

      if (parsed.length === 0) {
        throw new Error(`Unknown calculator list: ${raw}`);
      }

      calculatorIds = parsed;
      index += 1;
      continue;
    }

    if (token === "--json-out") {
      jsonOutPath = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (token === "--summary-csv") {
      summaryCsvPath = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (token === "--case-csv") {
      caseCsvPath = argv[index + 1] ?? null;
      index += 1;
    }
  }

  return {
    calculatorIds,
    caseCsvPath,
    inputPath,
    jsonOutPath,
    showCases,
    summaryCsvPath
  };
}

function format2(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : "-";
}

function writeText(filePath: string, content: string): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

function buildSummaryCsv(summary: readonly AirborneBenchmarkSummaryRow[]): string {
  const header = [
    "calculator_id",
    "calculator_label",
    "mae_db",
    "rmse_db",
    "bias_db",
    "max_abs_error_db",
    "win_count",
    "within_tolerance_count",
    "case_count"
  ];
  const rows = summary.map((row) =>
    [
      row.calculatorId,
      row.calculatorLabel,
      row.maeDb.toFixed(6),
      row.rmseDb.toFixed(6),
      row.biasDb.toFixed(6),
      row.maxAbsErrorDb.toFixed(6),
      String(row.winCount),
      String(row.withinToleranceCount),
      String(row.caseCount)
    ].join(",")
  );

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}

function buildCaseCsv(cases: readonly AirborneBenchmarkCase[], report: ReturnType<typeof runAirborneBenchmark>): string {
  const header = [
    "case_id",
    "case_label",
    "source",
    "metric_path",
    "metric_label",
    "expected_value_db",
    "calculator_id",
    "calculator_label",
    "predicted_value_db",
    "error_db",
    "abs_error_db",
    "is_winner"
  ];

  const rows: string[] = [];

  for (const caseResult of report.caseResults) {
    const caseMeta = cases.find((entry) => entry.id === caseResult.id);
    const winners = new Set(caseResult.winners);

    for (const calculatorResult of caseResult.byCalculator) {
      rows.push([
        caseResult.id,
        caseResult.label,
        caseMeta?.source ?? caseResult.source,
        caseResult.metricPath,
        caseResult.metricLabel,
        caseResult.expectedValue.toFixed(6),
        calculatorResult.calculatorId,
        calculatorResult.calculatorLabel,
        calculatorResult.predictedValue === null ? "" : calculatorResult.predictedValue.toFixed(6),
        Number.isFinite(calculatorResult.errorDb) ? calculatorResult.errorDb.toFixed(6) : "",
        Number.isFinite(calculatorResult.absErrorDb) ? calculatorResult.absErrorDb.toFixed(6) : "",
        winners.has(calculatorResult.calculatorId) ? "1" : "0"
      ].join(","));
    }
  }

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(args.inputPath);
  const dataset = normalizeAirborneBenchmarkDataset(JSON.parse(readFileSync(inputPath, "utf8")));

  if (args.showCases) {
    console.log(`Benchmark: ${dataset.name}`);
    dataset.cases.forEach((entry, index) => {
      console.log(
        `${index + 1}. ${entry.id} | ${entry.metricLabel} ${entry.expectedValue.toFixed(1)} dB | ${entry.layers.length} layers`
      );
    });
    return;
  }

  const report = runAirborneBenchmark(dataset.cases, {
    calculatorIds: args.calculatorIds ?? undefined
  });

  console.log(`Benchmark: ${dataset.name}`);
  if (dataset.description) {
    console.log(dataset.description);
  }
  console.log(`Cases: ${dataset.cases.length}`);
  console.log("");
  console.log("Ranking:");

  report.summary.forEach((row, index) => {
    console.log(
      `${index + 1}. ${row.calculatorId.padEnd(16)} | MAE ${format2(row.maeDb)} | RMSE ${format2(row.rmseDb)} | Bias ${format2(row.biasDb)} | MaxAE ${format2(row.maxAbsErrorDb)} | Win ${row.winCount}/${row.caseCount} | Tol ${row.withinToleranceCount}/${row.caseCount}`
    );
  });

  if (args.jsonOutPath) {
    writeText(
      path.resolve(args.jsonOutPath),
      `${JSON.stringify(
        {
          generatedAtIso: new Date().toISOString(),
          dataset: {
            description: dataset.description,
            inputPath,
            name: dataset.name
          },
          ...report
        },
        null,
        2
      )}\n`
    );
  }

  if (args.summaryCsvPath) {
    writeText(path.resolve(args.summaryCsvPath), buildSummaryCsv(report.summary));
  }

  if (args.caseCsvPath) {
    writeText(path.resolve(args.caseCsvPath), buildCaseCsv(dataset.cases, report));
  }
}

main();

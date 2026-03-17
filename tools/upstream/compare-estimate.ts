import { readFileSync } from "node:fs";
import path from "node:path";

import { getStringArg, hasFlag, parseCliArgs } from "./cli";
import { compareEstimateCase, type EstimateComparison } from "./estimate-runner";

type CompareFixtureCase = {
  id: string;
  label: string;
  layers: string;
};

function readFixture(filePath: string): CompareFixtureCase[] {
  const raw = readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error(`Fixture must be an array: ${filePath}`);
  }

  return parsed.map((entry, index) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      typeof entry.id !== "string" ||
      typeof entry.label !== "string" ||
      typeof entry.layers !== "string"
    ) {
      throw new Error(`Invalid fixture row at index ${index} in ${filePath}`);
    }

    return entry;
  });
}

function printComparison(label: string, comparison: EstimateComparison) {
  console.log(label);
  console.log(`  layers: ${comparison.layerSpec}`);
  console.log(`  upstream layers: ${comparison.upstreamLayerSpec}`);

  if (comparison.aliases.length > 0) {
    console.log(`  aliases: ${comparison.aliases.map((alias) => `${alias.from}->${alias.to}`).join(", ")}`);
  }

  console.log(
    `  dynecho: ${comparison.dynecho.estimatedRwDb.toFixed(1)} dB | ${comparison.dynecho.surfaceMassKgM2.toFixed(1)} kg/m² | ${comparison.dynecho.thicknessMm.toFixed(1)} mm`
  );

  if (!comparison.upstream.ok) {
    console.log(`  upstream: failed | ${comparison.upstream.error ?? "Unknown upstream error."}`);
    return;
  }

  console.log(
    `  upstream: ${comparison.upstream.rw?.toFixed(1) ?? "n/a"} dB | ${comparison.upstream.surfaceMass?.toFixed(1) ?? "n/a"} kg/m² | ${comparison.upstream.totalThicknessMm?.toFixed(1) ?? "n/a"} mm | ${comparison.upstream.calculator}`
  );
  console.log(
    `  delta: ${comparison.delta.rwDb?.toFixed(1) ?? "n/a"} dB | ${comparison.delta.surfaceMassKgM2?.toFixed(1) ?? "n/a"} kg/m² | ${comparison.delta.thicknessMm?.toFixed(1) ?? "n/a"} mm`
  );
}

function main() {
  const args = parseCliArgs(process.argv.slice(2));
  const explicitLayers = getStringArg(args, "layers");
  const upstreamPath = getStringArg(args, "path");
  const calculator = getStringArg(args, "calculator");

  const results = explicitLayers
    ? [
        {
          id: "adhoc",
          label: "Ad-hoc comparison",
          result: compareEstimateCase(explicitLayers, { calculator, upstreamPath })
        }
      ]
    : readFixture(
        path.resolve(
          process.cwd(),
          getStringArg(args, "fixture") ?? "tools/upstream/fixtures/smoke-cases.json"
        )
      ).map((fixtureCase) => ({
        id: fixtureCase.id,
        label: fixtureCase.label,
        result: compareEstimateCase(fixtureCase.layers, { calculator, upstreamPath })
      }));

  if (hasFlag(args, "json")) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  results.forEach((entry, index) => {
    if (index > 0) {
      console.log("");
    }

    printComparison(`${entry.id}: ${entry.label}`, entry.result);
  });
}

main();

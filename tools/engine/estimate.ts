import { calculateAssembly, parseLayerSpec } from "@dynecho/engine";

type ParsedArgs = {
  calculator?: string;
  json: boolean;
  layers: string;
};

function parseArgs(argv: readonly string[]): ParsedArgs {
  let calculator: string | undefined;
  let layers = "";
  let json = false;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--json") {
      json = true;
      continue;
    }

    if (token === "--layers") {
      layers = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--calculator") {
      calculator = argv[index + 1] ?? "";
      index += 1;
    }
  }

  if (!layers) {
    throw new Error('Usage: pnpm engine:estimate --layers "concrete:100,gypsum_board:12.5" [--json]');
  }

  return { calculator, json, layers };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = calculateAssembly(parseLayerSpec(args.layers), {
    calculator: args.calculator as never
  });

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`Method: ${result.metrics.method}`);
  console.log(`Calculator: ${result.calculatorLabel ?? "Screening Seed"}`);
  console.log(`Estimated Rw: ${result.metrics.estimatedRwDb.toFixed(1)} dB`);
  console.log(`Surface Mass: ${result.metrics.surfaceMassKgM2.toFixed(1)} kg/m²`);
  console.log(`Thickness: ${result.metrics.totalThicknessMm.toFixed(1)} mm`);
  console.log(`Warnings: ${result.warnings.join(" | ")}`);
}

main();

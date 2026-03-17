import { hasFlag, parseCliArgs, requireStringArg, getStringArg } from "./cli";
import { runUpstreamEstimateFromSpec } from "./estimate-runner";

function main() {
  const args = parseCliArgs(process.argv.slice(2));
  const layerSpec = requireStringArg(
    args,
    "layers",
    'Usage: pnpm upstream:estimate --layers "gypsum_board:12.5,rockwool:50,air_gap:50,concrete:100" [--calculator ks_rw_calibrated] [--json]'
  );

  const result = runUpstreamEstimateFromSpec(layerSpec, {
    calculator: getStringArg(args, "calculator"),
    upstreamPath: getStringArg(args, "path")
  });

  if (hasFlag(args, "json")) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`Layer spec: ${result.layerSpec}`);
  console.log(`Upstream layer spec: ${result.upstreamLayerSpec}`);

  if (result.aliases.length > 0) {
    console.log(`Aliases: ${result.aliases.map((alias) => `${alias.from}->${alias.to}`).join(", ")}`);
  }

  console.log(`Upstream ok: ${result.summary.ok ? "yes" : "no"}`);

  if (!result.summary.ok) {
    console.log(`Error: ${result.summary.error ?? "Unknown upstream estimate failure."}`);
    return;
  }

  console.log(`Calculator: ${result.summary.calculator} (${result.summary.calculatorLabel})`);
  console.log(`Rw: ${result.summary.rw?.toFixed(1) ?? "n/a"} dB`);
  console.log(`Surface Mass: ${result.summary.surfaceMass?.toFixed(1) ?? "n/a"} kg/m²`);
  console.log(`Thickness: ${result.summary.totalThicknessMm?.toFixed(1) ?? "n/a"} mm`);

  if (result.summary.warnings.length > 0) {
    console.log(`Warnings: ${result.summary.warnings.join(" | ")}`);
  }
}

main();

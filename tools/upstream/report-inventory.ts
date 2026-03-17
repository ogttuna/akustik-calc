import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { execInUpstreamRepo, readUpstreamSnapshot } from "./acoustic2";
import { runUpstreamJson } from "./json";

type InventoryCoreSummary = {
  calculators: Array<{ id: string; label: string }>;
  coreExports: string[];
  materialCount: number;
};

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function main() {
  const explicitPath = process.argv[2];
  const snapshot = readUpstreamSnapshot(explicitPath);
  const trackedFiles = execInUpstreamRepo("git", ["ls-files"], explicitPath)
    .split("\n")
    .filter(Boolean);
  const coreSummary = runUpstreamJson<InventoryCoreSummary>(
    `
      const core = require("./core.js");
      console.log(JSON.stringify({
        calculators: Array.isArray(core.CALCULATORS)
          ? core.CALCULATORS.map((entry) => ({ id: entry.id, label: entry.label }))
          : [],
        coreExports: Object.keys(core).sort(),
        materialCount: Array.isArray(core.BASE_MATERIALS) ? core.BASE_MATERIALS.length : 0
      }));
    `,
    explicitPath
  );

  const report = {
    generatedAt: new Date().toISOString(),
    upstream: snapshot,
    trackedCounts: {
      all: trackedFiles.length,
      tests: trackedFiles.filter((filePath) => filePath.startsWith("tests/")).length,
      tools: trackedFiles.filter((filePath) => filePath.startsWith("tools/")).length
    },
    focusFiles: {
      benchmarkJson: trackedFiles.filter((filePath) => /^tools\/reference-benchmarks.*\.json$/.test(filePath)),
      impactOrLnwTests: trackedFiles.filter(
        (filePath) => filePath.startsWith("tests/") && /(impact|lnw|formula-notes)/i.test(filePath)
      )
    },
    core: coreSummary
  };

  const dateLabel = formatDate(new Date());
  const targetDir = path.resolve(process.cwd(), "docs/imports");
  const filePath = path.join(targetDir, `${dateLabel}-acoustic2-inventory.json`);

  mkdirSync(targetDir, { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(filePath);
}

main();

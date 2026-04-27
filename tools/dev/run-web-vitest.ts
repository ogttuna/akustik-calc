import { spawn } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

type LongRunningTestStep = {
  extraArgs?: readonly string[];
  file: string;
};

const LONG_RUNNING_TEST_STEPS: readonly LongRunningTestStep[] = [
  { file: "features/workbench/dynamic-route-deep-hybrid-swap-heavy-core.test.ts" },
  { file: "features/workbench/dynamic-route-deep-hybrid-swap-aac-g5.test.ts" },
  { file: "features/workbench/dynamic-route-deep-hybrid-swap-aac-d700-120.test.ts" },
  { file: "features/workbench/dynamic-route-deep-hybrid-swap-aac-d700-100.test.ts" },
  {
    file: "features/workbench/dynamic-route-family-boundary-scan.test.ts",
    extraArgs: ["--pool=threads"]
  },
  { file: "features/workbench/dynamic-route-deep-hybrid-scan.test.ts" }
] as const;

const BATCH_SIZE = 40;

function getPnpmCommand(): string {
  if (process.platform !== "win32") {
    return "pnpm";
  }

  return "pnpm.cmd";
}

function toRelativePosix(filePath: string): string {
  return path.relative(process.cwd(), filePath).split(path.sep).join("/");
}

function collectTestFiles(directory: string): string[] {
  const entries = readdirSync(directory).sort((left, right) => left.localeCompare(right));
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectTestFiles(fullPath));
      continue;
    }

    if (entry.endsWith(".test.ts")) {
      files.push(toRelativePosix(fullPath));
    }
  }

  return files;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function runVitest(
  label: string,
  files: string[],
  extraArgs: readonly string[] = []
): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`[web-vitest] ${label}: ${String(files.length)} file(s)`);

    const child = spawn(
      getPnpmCommand(),
      ["exec", "vitest", "run", ...files, "--maxWorkers=1", ...extraArgs],
      {
        cwd: process.cwd(),
        stdio: "inherit"
      }
    );

    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`${label} exited via signal ${signal}`));
        return;
      }

      if (code !== 0) {
        reject(new Error(`${label} failed with exit code ${String(code)}`));
        return;
      }

      resolve();
    });
  });
}

async function main() {
  const allFiles = [...collectTestFiles("features"), ...collectTestFiles("lib")];
  const longRunningFiles = new Set<string>(
    LONG_RUNNING_TEST_STEPS.map((step) => step.file)
  );
  const missingLongRunningFiles = LONG_RUNNING_TEST_STEPS.filter(
    (step) => !allFiles.includes(step.file)
  ).map((step) => step.file);

  if (missingLongRunningFiles.length > 0) {
    throw new Error(
      `Long-running web test file list is stale: ${missingLongRunningFiles.join(", ")}`
    );
  }

  const batchedFiles = allFiles.filter((file) => !longRunningFiles.has(file));

  console.log(
    `[web-vitest] running ${String(allFiles.length)} web test file(s) in ` +
      `${String(LONG_RUNNING_TEST_STEPS.length)} isolated long-running step(s) ` +
      `and ${String(Math.ceil(batchedFiles.length / BATCH_SIZE))} batch step(s)`
  );

  for (const step of LONG_RUNNING_TEST_STEPS) {
    await runVitest(`long ${step.file}`, [step.file], step.extraArgs);
  }

  const batches = chunk(batchedFiles, BATCH_SIZE);
  for (const [index, batch] of batches.entries()) {
    await runVitest(`batch ${String(index + 1)}/${String(batches.length)}`, batch);
  }
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[web-vitest] ${message}`);
  process.exit(1);
});

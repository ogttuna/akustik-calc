import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import path from "node:path";

const DEFAULT_DIST_DIR = ".next";

function getPnpmCommand(): string {
  return process.platform === "win32" ? "pnpm.cmd" : "pnpm";
}

async function main() {
  const configuredDistDir = process.env.NEXT_DIST_DIR?.trim();
  const distDir = configuredDistDir && configuredDistDir.length > 0 ? configuredDistDir : DEFAULT_DIST_DIR;

  await rm(path.resolve(process.cwd(), distDir), {
    force: true,
    recursive: true
  });

  const child = spawn(getPnpmCommand(), ["exec", "next", "build"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NEXT_DIST_DIR: distDir
    },
    stdio: "inherit"
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 1);
  });
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[build] ${message}`);
  process.exit(1);
});

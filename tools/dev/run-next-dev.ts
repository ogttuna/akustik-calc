import { spawn } from "node:child_process";

const DEFAULT_DIST_DIR = ".next-dev";
const DEFAULT_PORT = "3010";

function getPnpmCommand(): string {
  return process.platform === "win32" ? "pnpm.cmd" : "pnpm";
}

async function main() {
  const appDir = process.cwd();
  const distDir = process.env.NEXT_DIST_DIR?.trim() || DEFAULT_DIST_DIR;
  const port = process.env.PORT?.trim() || DEFAULT_PORT;

  const child = spawn(getPnpmCommand(), ["exec", "next", "dev", "-p", port], {
    cwd: appDir,
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
  console.error(`[dev] ${message}`);
  process.exit(1);
});

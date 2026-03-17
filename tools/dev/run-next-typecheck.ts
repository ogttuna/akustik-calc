import { spawn } from "node:child_process";

const TYPECHECK_DIST_DIR = ".next-typecheck";

function getPnpmCommand(): string {
  return process.platform === "win32" ? "pnpm.cmd" : "pnpm";
}

async function main() {
  const child = spawn(getPnpmCommand(), ["exec", "next", "typegen"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NEXT_DIST_DIR: TYPECHECK_DIST_DIR
    },
    stdio: "inherit"
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    if (code !== 0) {
      process.exit(code ?? 1);
      return;
    }

    const tsc = spawn(getPnpmCommand(), ["exec", "tsc", "--project", "tsconfig.json", "--incremental", "false"], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NEXT_DIST_DIR: TYPECHECK_DIST_DIR
      },
      stdio: "inherit"
    });

    tsc.on("exit", (tscCode, tscSignal) => {
      if (tscSignal) {
        process.kill(process.pid, tscSignal);
        return;
      }

      process.exit(tscCode ?? 1);
    });
  });
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[typecheck] ${message}`);
  process.exit(1);
});

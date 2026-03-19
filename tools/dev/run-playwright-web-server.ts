import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { join } from "node:path";

const HOST = "127.0.0.1";
const DEFAULT_PORT = 3100;

function getPnpmCommand(): string {
  return process.platform === "win32" ? "pnpm.cmd" : "pnpm";
}

async function main() {
  const requestedPort = Number.parseInt(process.env.PLAYWRIGHT_PORT ?? String(DEFAULT_PORT), 10);
  const port = Number.isFinite(requestedPort) ? requestedPort : DEFAULT_PORT;
  const distDir = `.next-playwright-${port}`;
  const webDistDir = join(process.cwd(), "apps", "web", distDir);

  await rm(webDistDir, { force: true, recursive: true });

  const child = spawn(
    getPnpmCommand(),
    ["--filter", "@dynecho/web", "exec", "next", "dev", "--hostname", HOST, "--port", String(port)],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NEXT_DIST_DIR: distDir,
        PLAYWRIGHT_PORT: String(port)
      },
      stdio: "inherit"
    }
  );

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
  console.error(`[playwright-web-server] ${message}`);
  process.exit(1);
});

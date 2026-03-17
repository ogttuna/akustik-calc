import { spawn } from "node:child_process";
import { createServer } from "node:net";

const DEFAULT_PORT = 3100;
const MAX_PORT_PROBES = 50;

function getPnpmCommand(): string {
  return process.platform === "win32" ? "pnpm.cmd" : "pnpm";
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", () => {
      resolve(false);
    });

    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, "127.0.0.1");
  });
}

async function findAvailablePort(preferredPort: number): Promise<number> {
  for (let candidate = preferredPort; candidate < preferredPort + MAX_PORT_PROBES; candidate += 1) {
    if (await isPortAvailable(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `No free Playwright web-server port was found in the range ${preferredPort}-${preferredPort + MAX_PORT_PROBES - 1}.`
  );
}

async function main() {
  const requestedPort = Number.parseInt(process.env.PLAYWRIGHT_PORT ?? String(DEFAULT_PORT), 10);
  const preferredPort = Number.isFinite(requestedPort) ? requestedPort : DEFAULT_PORT;
  const port = await findAvailablePort(preferredPort);
  const distDir = `.next-playwright-${port}`;

  if (port !== preferredPort) {
    console.log(`[playwright] Port ${preferredPort} is busy. Using ${port} for this run.`);
  }

  const child = spawn(getPnpmCommand(), ["exec", "playwright", "test"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NEXT_DIST_DIR: distDir,
      PLAYWRIGHT_PORT: String(port)
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
  console.error(`[playwright] ${message}`);
  process.exit(1);
});

import { rm } from "node:fs/promises";
import { createServer } from "node:net";
import { join } from "node:path";

import {
  getExitCodeForChildExit,
  spawnManagedChildProcess
} from "./managed-child-process";

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
  const webDistDir = join(process.cwd(), "apps", "web", distDir);

  if (port !== preferredPort) {
    console.log(`[playwright] Port ${preferredPort} is busy. Using ${port} for this run.`);
  }

  // Stale Next dev build output can leave route modules half-updated across interrupted runs.
  await rm(webDistDir, { force: true, recursive: true });

  const managedChild = spawnManagedChildProcess(getPnpmCommand(), ["exec", "playwright", "test"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NEXT_DIST_DIR: distDir,
      PLAYWRIGHT_PORT: String(port)
    },
    label: "playwright",
    stdio: "inherit"
  });

  managedChild.child.once("error", (error) => {
    managedChild.terminate("SIGTERM");
    console.error(`[playwright] Failed to start Playwright: ${error.message}`);
    process.exit(1);
  });

  managedChild.child.once("exit", (code, signal) => {
    managedChild.dispose();
    process.exit(typeof process.exitCode === "number" ? process.exitCode : getExitCodeForChildExit(code, signal));
  });
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[playwright] ${message}`);
  process.exit(1);
});

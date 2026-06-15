import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  getExitCodeForChildExit,
  spawnManagedChildProcess
} from "./managed-child-process";

const HOST = "127.0.0.1";
const DEFAULT_PORT = 3100;
const PLAYWRIGHT_NEXT_NODE_OPTIONS = "--max-old-space-size=4096";

function getPnpmCommand(): string {
  return process.platform === "win32" ? "pnpm.cmd" : "pnpm";
}

async function writePlaywrightTsconfig(input: { distDir: string; tsconfigPath: string }): Promise<void> {
  const tsconfig = {
    extends: "./tsconfig.json",
    compilerOptions: {
      plugins: [
        {
          name: "next"
        }
      ]
    },
    include: [
      "app/**/*.ts",
      "app/**/*.tsx",
      "components/**/*.ts",
      "components/**/*.tsx",
      "features/**/*.ts",
      "features/**/*.tsx",
      "lib/**/*.ts",
      "lib/**/*.tsx",
      "next-env.d.ts",
      "next.config.ts",
      "vitest.config.ts",
      `${input.distDir}/types/**/*.ts`
    ],
    exclude: ["node_modules"]
  };

  await writeFile(input.tsconfigPath, `${JSON.stringify(tsconfig, null, 2)}\n`);
}

async function main() {
  const requestedPort = Number.parseInt(process.env.PLAYWRIGHT_PORT ?? String(DEFAULT_PORT), 10);
  const port = Number.isFinite(requestedPort) ? requestedPort : DEFAULT_PORT;
  const distDir = `.next-playwright-${port}`;
  const webAppDir = join(process.cwd(), "apps", "web");
  const webDistDir = join(process.cwd(), "apps", "web", distDir);
  const playwrightTsconfigFileName = `.next-playwright-tsconfig-${port}.json`;
  const playwrightTsconfigPath = join(webAppDir, playwrightTsconfigFileName);

  await rm(webDistDir, { force: true, recursive: true });
  await rm(playwrightTsconfigPath, { force: true });
  await mkdir(webAppDir, { recursive: true });
  await writePlaywrightTsconfig({
    distDir,
    tsconfigPath: playwrightTsconfigPath
  });

  const managedChild = spawnManagedChildProcess(
    getPnpmCommand(),
    ["--filter", "@dynecho/web", "exec", "next", "dev", "--hostname", HOST, "--port", String(port)],
    {
      cwd: process.cwd(),
      detachedProcessGroup: false,
      env: {
        ...process.env,
        NEXT_DIST_DIR: distDir,
        NEXT_PLAYWRIGHT_TSCONFIG_PATH: `./${playwrightTsconfigFileName}`,
        NODE_OPTIONS: process.env.PLAYWRIGHT_NEXT_NODE_OPTIONS?.trim() || PLAYWRIGHT_NEXT_NODE_OPTIONS,
        PLAYWRIGHT_PORT: String(port)
      },
      label: "playwright-web-server",
      stdio: "inherit"
    }
  );

  managedChild.child.once("error", (error) => {
    managedChild.terminate("SIGTERM");
    console.error(`[playwright-web-server] Failed to start Next dev server: ${error.message}`);
    process.exit(1);
  });

  managedChild.child.once("exit", (code, signal) => {
    managedChild.dispose();
    process.exit(typeof process.exitCode === "number" ? process.exitCode : getExitCodeForChildExit(code, signal));
  });
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[playwright-web-server] ${message}`);
  process.exit(1);
});

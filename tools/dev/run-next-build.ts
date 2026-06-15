import { spawn } from "node:child_process";
import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { hasExplicitNextPlugin, wireNextPluginWarningFilter } from "./next-plugin-warning";

const DEFAULT_DIST_DIR = ".next";
const DEFAULT_NEXT_BUILD_NODE_OPTIONS = "--max-old-space-size=4096";
const NEXT_ENV_ROUTE_REFERENCE = '/// <reference path="./.next/types/routes.d.ts" />';
const NEXT_ENV_ROUTE_REFERENCE_PATTERN = /^\/\/\/ <reference path="\.\/\.next[^"]*\/types\/routes\.d\.ts" \/>$/m;
const TRANSIENT_TYPE_INCLUDE_PREFIXES = [".next-playwright-", ".next-codex-", ".next-dev-illustration"];

function getPnpmCommand(): string {
  return process.platform === "win32" ? "pnpm.cmd" : "pnpm";
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function mirrorIntoStandalone(sourcePath: string, targetPath: string): Promise<void> {
  await rm(targetPath, {
    force: true,
    recursive: true
  });
  await mkdir(path.dirname(targetPath), {
    recursive: true
  });

  await cp(sourcePath, targetPath, {
    recursive: true
  });
}

async function syncStandaloneAssets(appDir: string, distDir: string): Promise<void> {
  const standaloneAppDir = path.resolve(appDir, distDir, "standalone/apps/web");
  const standaloneServerPath = path.join(standaloneAppDir, "server.js");
  const staticSourcePath = path.resolve(appDir, distDir, "static");
  const staticTargetPath = path.join(standaloneAppDir, ".next/static");
  const publicSourcePath = path.resolve(appDir, "public");
  const publicTargetPath = path.join(standaloneAppDir, "public");

  if (!(await pathExists(standaloneServerPath)) || !(await pathExists(staticSourcePath))) {
    return;
  }

  await mirrorIntoStandalone(staticSourcePath, staticTargetPath);

  if (await pathExists(publicSourcePath)) {
    await mirrorIntoStandalone(publicSourcePath, publicTargetPath);
  }
}

async function normalizeNextGeneratedTypeReferences(appDir: string): Promise<void> {
  const nextEnvPath = path.join(appDir, "next-env.d.ts");
  const nextEnv = await readFile(nextEnvPath, "utf8");
  const normalizedNextEnv = nextEnv.replace(NEXT_ENV_ROUTE_REFERENCE_PATTERN, NEXT_ENV_ROUTE_REFERENCE);

  if (normalizedNextEnv !== nextEnv) {
    await writeFile(nextEnvPath, normalizedNextEnv);
    console.warn("[build] Restored next-env.d.ts route type reference to .next.");
  }

  const tsconfigNextPath = path.join(appDir, "tsconfig.next.json");
  const tsconfigNext = JSON.parse(await readFile(tsconfigNextPath, "utf8")) as {
    include?: unknown;
  };

  if (!Array.isArray(tsconfigNext.include)) {
    return;
  }

  const filteredInclude = tsconfigNext.include.filter((entry) => {
    return !(
      typeof entry === "string" &&
      TRANSIENT_TYPE_INCLUDE_PREFIXES.some((prefix) => entry.startsWith(`${prefix}`))
    );
  });

  if (filteredInclude.length !== tsconfigNext.include.length) {
    await writeFile(tsconfigNextPath, `${JSON.stringify({ ...tsconfigNext, include: filteredInclude }, null, 2)}\n`);
    console.warn("[build] Removed transient .next-* type includes from tsconfig.next.json.");
  }
}

async function main() {
  const appDir = process.cwd();
  const configuredDistDir = process.env.NEXT_BUILD_DIST_DIR?.trim();
  const distDir = configuredDistDir && configuredDistDir.length > 0 ? configuredDistDir : DEFAULT_DIST_DIR;
  const configuredNodeOptions = process.env.NEXT_BUILD_NODE_OPTIONS?.trim();
  const nodeOptions =
    configuredNodeOptions && configuredNodeOptions.length > 0
      ? configuredNodeOptions
      : DEFAULT_NEXT_BUILD_NODE_OPTIONS;
  const suppressNextPluginWarning = hasExplicitNextPlugin(path.join(appDir, "tsconfig.json"));

  await normalizeNextGeneratedTypeReferences(appDir);
  await rm(path.resolve(appDir, distDir), {
    force: true,
    recursive: true
  });

  const child = spawn(getPnpmCommand(), ["exec", "next", "build"], {
    cwd: appDir,
    env: {
      ...process.env,
      NODE_OPTIONS: nodeOptions,
      NEXT_DIST_DIR: distDir
    },
    stdio: ["inherit", "pipe", "pipe"]
  });
  wireNextPluginWarningFilter(child, suppressNextPluginWarning);

  const exitCode = await new Promise<number>((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
        return;
      }

      resolve(code ?? 1);
    });
  });

  if (exitCode !== 0) {
    await normalizeNextGeneratedTypeReferences(appDir);
    process.exit(exitCode);
  }

  await normalizeNextGeneratedTypeReferences(appDir);
  await syncStandaloneAssets(appDir, distDir);
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[build] ${message}`);
  process.exit(1);
});

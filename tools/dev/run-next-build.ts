import { spawn } from "node:child_process";
import { access, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { hasExplicitNextPlugin, wireNextPluginWarningFilter } from "./next-plugin-warning";

const DEFAULT_DIST_DIR = ".next";

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

async function main() {
  const appDir = process.cwd();
  const configuredDistDir = process.env.NEXT_DIST_DIR?.trim();
  const distDir = configuredDistDir && configuredDistDir.length > 0 ? configuredDistDir : DEFAULT_DIST_DIR;
  const suppressNextPluginWarning = hasExplicitNextPlugin(path.join(appDir, "tsconfig.json"));

  await rm(path.resolve(appDir, distDir), {
    force: true,
    recursive: true
  });

  const child = spawn(getPnpmCommand(), ["exec", "next", "build"], {
    cwd: appDir,
    env: {
      ...process.env,
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
    process.exit(exitCode);
  }

  await syncStandaloneAssets(appDir, distDir);
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[build] ${message}`);
  process.exit(1);
});

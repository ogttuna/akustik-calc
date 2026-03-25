import { spawn } from "node:child_process";
import { access, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const DEFAULT_PORT = "3010";

function getPnpmNodeCommand(): string {
  return process.execPath;
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

async function main() {
  const appDir = process.cwd();
  const standaloneAppDir = path.resolve(appDir, ".next/standalone/apps/web");
  const standaloneServerPath = path.join(standaloneAppDir, "server.js");
  const staticSourcePath = path.resolve(appDir, ".next/static");
  const staticTargetPath = path.join(standaloneAppDir, ".next/static");
  const publicSourcePath = path.resolve(appDir, "public");
  const publicTargetPath = path.join(standaloneAppDir, "public");

  if (!(await pathExists(standaloneServerPath))) {
    throw new Error(`Standalone server was not found at ${standaloneServerPath}. Run the web build first.`);
  }

  if (!(await pathExists(staticSourcePath))) {
    throw new Error(`Static asset directory was not found at ${staticSourcePath}. Run the web build first.`);
  }

  await mirrorIntoStandalone(staticSourcePath, staticTargetPath);

  if (await pathExists(publicSourcePath)) {
    await mirrorIntoStandalone(publicSourcePath, publicTargetPath);
  }

  const child = spawn(getPnpmNodeCommand(), [standaloneServerPath], {
    cwd: appDir,
    env: {
      ...process.env,
      HOSTNAME: process.env.HOSTNAME ?? "0.0.0.0",
      PORT: process.env.PORT ?? DEFAULT_PORT
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
  console.error(`[standalone-start] ${message}`);
  process.exit(1);
});

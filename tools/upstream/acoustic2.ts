import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

export const DEFAULT_UPSTREAM_PATH = "/home/ogttuna/Dev/Machinity/Acoustic2";

export type UpstreamSnapshot = {
  branch: string;
  head: string;
  path: string;
  statusLines: string[];
};

export function resolveUpstreamPath(explicitPath?: string): string {
  const upstreamPath = explicitPath || process.env.DYNECHO_UPSTREAM_PATH || DEFAULT_UPSTREAM_PATH;

  if (!existsSync(upstreamPath)) {
    throw new Error(`Upstream path does not exist: ${upstreamPath}`);
  }

  return path.resolve(upstreamPath);
}

export function execInUpstreamRepo(command: string, args: readonly string[], explicitPath?: string): string {
  const repoPath = resolveUpstreamPath(explicitPath);

  return execFileSync(command, args, {
    cwd: repoPath,
    encoding: "utf8"
  }).trim();
}

function gitOutput(repoPath: string, args: string[]): string {
  return execFileSync("git", args, {
    cwd: repoPath,
    encoding: "utf8"
  }).trim();
}

export function readUpstreamSnapshot(explicitPath?: string): UpstreamSnapshot {
  const repoPath = resolveUpstreamPath(explicitPath);

  return {
    branch: gitOutput(repoPath, ["rev-parse", "--abbrev-ref", "HEAD"]),
    head: gitOutput(repoPath, ["rev-parse", "HEAD"]),
    path: repoPath,
    statusLines: gitOutput(repoPath, ["status", "--short"])
      .split("\n")
      .map((line) => line.trimEnd())
      .filter(Boolean)
  };
}

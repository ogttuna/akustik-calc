import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const DEFAULT_UPSTREAM_PATH = "/home/ogttuna/Dev/Machinity/Acoustic2";
const UPSTREAM_PATH = process.env.DYNECHO_UPSTREAM_PATH ?? DEFAULT_UPSTREAM_PATH;

type ParityResult = {
  id?: string;
  mismatches?: unknown[];
  ok?: boolean;
};

function runParityScript(scriptPath: string): ParityResult[] {
  const result = spawnSync(
    "pnpm",
    ["exec", "tsx", scriptPath, "--path", UPSTREAM_PATH, "--json"],
    {
      cwd: REPO_ROOT,
      encoding: "utf8",
      env: {
        ...process.env,
        FORCE_COLOR: "0"
      }
    }
  );

  if (result.error) {
    throw result.error;
  }

  const stdout = typeof result.stdout === "string" ? result.stdout.trim() : "";
  if (!stdout) {
    const stderr = typeof result.stderr === "string" ? result.stderr.trim() : "";
    throw new Error(
      `Parity script did not return JSON output for ${scriptPath}.${stderr ? `\n${stderr}` : ""}`
    );
  }

  try {
    return JSON.parse(stdout) as ParityResult[];
  } catch (error) {
    const stderr = typeof result.stderr === "string" ? result.stderr.trim() : "";
    throw new Error(
      `Failed to parse parity JSON for ${scriptPath}.${stderr ? `\n${stderr}` : ""}\n${stdout}`,
      { cause: error }
    );
  }
}

describe.skipIf(!existsSync(UPSTREAM_PATH))("impact upstream parity acceptance", () => {
  it(
    "keeps the assembly impact parity fixture set green against Acoustic2",
    () => {
      const results = runParityScript("tools/upstream/compare-impact-parity.ts");

      expect(results.length).toBeGreaterThan(0);
      expect(
        results.filter((result) => !result.ok).map((result) => ({
          id: result.id,
          mismatches: result.mismatches ?? []
        }))
      ).toEqual([]);
    },
    120_000
  );

  it(
    "keeps the impact-only parity fixture set green against Acoustic2",
    () => {
      const results = runParityScript("tools/upstream/compare-impact-only-parity.ts");

      expect(results.length).toBeGreaterThan(0);
      expect(
        results.filter((result) => !result.ok).map((result) => ({
          id: result.id,
          mismatches: result.mismatches ?? []
        }))
      ).toEqual([]);
    },
    120_000
  );
});

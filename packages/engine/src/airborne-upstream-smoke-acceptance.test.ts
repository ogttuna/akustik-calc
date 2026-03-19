import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const DEFAULT_UPSTREAM_PATH = "/home/ogttuna/Dev/Machinity/Acoustic2";
const UPSTREAM_PATH = process.env.DYNECHO_UPSTREAM_PATH ?? DEFAULT_UPSTREAM_PATH;
const FIXTURE_PATH = "tools/upstream/fixtures/airborne-acceptance-cases.json";
const RW_TOLERANCE_DB = 1.0;
const SURFACE_MASS_TOLERANCE_KGM2 = 0.5;
const THICKNESS_TOLERANCE_MM = 0.1;

type SmokeComparison = {
  id: string;
  result: {
    delta: {
      rwDb: number | null;
      surfaceMassKgM2: number | null;
      thicknessMm: number | null;
    };
    upstream: {
      error: string | null;
      ok: boolean;
    };
  };
};

function runAcceptanceCompare(): SmokeComparison[] {
  const stdout = execFileSync(
    "pnpm",
    ["exec", "tsx", "tools/upstream/compare-estimate.ts", "--path", UPSTREAM_PATH, "--fixture", FIXTURE_PATH, "--json"],
    {
      cwd: REPO_ROOT,
      encoding: "utf8",
      env: {
        ...process.env,
        FORCE_COLOR: "0"
      }
    }
  );

  return JSON.parse(stdout) as SmokeComparison[];
}

describe.skipIf(!existsSync(UPSTREAM_PATH))("airborne upstream screening acceptance", () => {
  it(
    "keeps the accepted airborne screening fixture set inside the upstream corridor",
    () => {
      const results = runAcceptanceCompare();

      expect(results).toHaveLength(63);
      expect(
        results.map((result) => ({
          id: result.id,
          rwDb: result.result.delta.rwDb,
          surfaceMassKgM2: result.result.delta.surfaceMassKgM2,
          thicknessMm: result.result.delta.thicknessMm,
          upstreamOk: result.result.upstream.ok,
          upstreamError: result.result.upstream.error
        }))
          .filter((result) => {
            if (!result.upstreamOk) {
              return true;
            }

            return (
              Math.abs(result.rwDb ?? 0) > RW_TOLERANCE_DB ||
              Math.abs(result.surfaceMassKgM2 ?? 0) > SURFACE_MASS_TOLERANCE_KGM2 ||
              Math.abs(result.thicknessMm ?? 0) > THICKNESS_TOLERANCE_MM
            );
          })
      ).toEqual([]);
    },
    120_000
  );
});

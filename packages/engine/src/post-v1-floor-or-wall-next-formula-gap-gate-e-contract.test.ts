import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_LANDED_GATE,
  POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_FILE,
  buildPostV1FormulaGapGateEContract
} from "./post-v1-floor-or-wall-next-formula-gap-gate-e";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 Gate E next formula-gap selection", () => {
  it("selects the ASTM IIC/AIIC exact-band contour runtime as the next high-ROI calculator move", () => {
    const contract = buildPostV1FormulaGapGateEContract();
    const selected = contract.rankedCandidates.filter((candidate) => candidate.selected);

    expect(contract).toMatchObject({
      landedGate: POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_FILE,
      selectionStatus:
        "post_v1_floor_or_wall_next_formula_gap_gate_e_landed_selected_gate_f_floor_astm_iic_aiic_contour_runtime"
    });
    expect(selected).toHaveLength(1);
    expect(selected[0]).toMatchObject({
      broadSourceCrawl: false,
      directCalculationCapacityGain: true,
      id: "astm_iic_aiic_exact_band_contour_runtime",
      score: 4.6
    });
    expect(contract.rankedCandidates.find((candidate) => candidate.id === "ui_ergonomics_only")).toMatchObject({
      directCalculationCapacityGain: false,
      selected: false
    });
  });

  it("keeps docs and the current gate runner aligned on Gate E closeout and Gate F selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records Gate E`).toContain(POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_LANDED_GATE);
      expect(contents, `${relativePath} records selected Gate F`).toContain(
        POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_ACTION
      );
      expect(contents, `${relativePath} records selected Gate F file`).toContain(
        POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_FILE
      );
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-or-wall-next-formula-gap-gate-e-contract.test.ts");
  });
});

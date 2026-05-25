import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bo";
import { HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS } from "./heavy-concrete-combined-impact-formula-corridor";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import {
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE,
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTION_STATUS,
  buildPostV1FloorFormulaGapRefreshGateIContract
} from "./post-v1-floor-formula-gap-refresh-gate-i";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_H_ACTION = "post_v1_floor_formula_expansion_gate_h_plan";
const GATE_H_FILE = "packages/engine/src/post-v1-floor-formula-expansion-gate-h-contract.test.ts";
const GATE_H_SELECTION_STATUS =
  "post_v1_floor_formula_expansion_gate_h_landed_selected_gate_i_floor_formula_gap_refresh";

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

describe("post-V1 floor formula gap refresh Gate I", () => {
  it("selects reinforced-concrete combined upper/lower resolver integration as the next high-ROI calculator move", () => {
    const contract = buildPostV1FloorFormulaGapRefreshGateIContract();
    const selected = contract.rankedCandidates.filter((candidate) => candidate.selected);

    expect(contract).toMatchObject({
      landedGate: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateH: {
        landedGate: GATE_H_ACTION,
        selectedNextAction: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE,
        selectedNextFile: "packages/engine/src/post-v1-floor-formula-gap-refresh-gate-i-contract.test.ts",
        selectionStatus: GATE_H_SELECTION_STATUS,
        steelRuntimeBasisIds: [STEEL_FLOOR_FORMULA_BASIS, STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS]
      },
      selectedNextAction: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selected).toHaveLength(1);
    expect(selected[0]).toMatchObject({
      basis: "element_lab",
      broadSourceCrawl: false,
      directCalculationCapacityGain: true,
      expectedValuePins: [
        { metric: "Ln,w", value: 58.1 },
        { metric: "DeltaLw", value: 13.7 }
      ],
      id: "reinforced_concrete_combined_upper_lower_resolver_import",
      ownedMetrics: ["Ln,w", "DeltaLw"],
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      score: 4.8,
      sourceRowsRequiredForSelection: false
    });
    expect(contract.rejectedDefaultMoves).toEqual([
      "broad_source_crawl",
      "confidence_wording_pass",
      "docs_only_cleanup",
      "finite_scenario_pack",
      "tolerance_retune_without_holdouts"
    ]);
    expect(contract.rankedCandidates.at(-1)).toMatchObject({
      broadSourceCrawl: true,
      directCalculationCapacityGain: false,
      id: "broad_floor_source_crawl",
      selected: false
    });
  });

  it("grounds Gate J in an existing calculable floor formula instead of selecting a docs-only or source-crawl step", () => {
    const runtime = calculateImpactOnly([], {
      impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw", "IIC", "AIIC"]
    });
    const registry = buildLayerCombinationResolverRegistryContract();

    expect(runtime.impact).toMatchObject({
      DeltaLw: 13.7,
      LnW: 58.1,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(runtime.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(runtime.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);

    expect(registry.summary.candidateCount).toBeGreaterThanOrEqual(30);
    expect(registry.summary.activeRuntimeCandidateCount).toBeGreaterThanOrEqual(27);
    expect(registry.candidateDeclarations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "floor.lightweight_steel.upper_lower_mass_spring.source_absent",
        ownedRuntimeBasisId: STEEL_FLOOR_FORMULA_BASIS,
        supportedMetrics: ["Ln,w", "DeltaLw"]
      }),
      expect.objectContaining({
        id: "floor.lightweight_steel.suspended_ceiling_only.source_absent",
        ownedRuntimeBasisId: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
        supportedMetrics: ["Ln,w"]
      })
    ]));
  });

  it("keeps docs and the current gate runner aligned on Gate I closeout and Gate J selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records Gate H`).toContain(GATE_H_ACTION);
      expect(contents, `${relativePath} records Gate H file`).toContain(GATE_H_FILE);
      expect(contents, `${relativePath} records Gate H status`).toContain(GATE_H_SELECTION_STATUS);
      expect(contents, `${relativePath} records landed Gate I`).toContain(
        POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_LANDED_GATE
      );
      expect(contents, `${relativePath} records Gate I status`).toContain(
        POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTION_STATUS
      );
      expect(contents, `${relativePath} records selected Gate J`).toContain(
        POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_ACTION
      );
      expect(contents, `${relativePath} records selected Gate J file`).toContain(
        POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_FILE
      );
      expect(contents, `${relativePath} records selected Gate J label`).toContain(
        POST_V1_FLOOR_FORMULA_GAP_REFRESH_GATE_I_SELECTED_NEXT_LABEL
      );
      expect(contents, `${relativePath} records reinforced-concrete values`).toContain("Ln,w 58.1");
      expect(contents, `${relativePath} records reinforced-concrete DeltaLw`).toContain("DeltaLw 13.7");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-formula-gap-refresh-gate-i-contract.test.ts");
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_DD_LIVE_ROUTE_PINS,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTION_STATUS
} from "./post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd";
import {
  POST_V1_GATE_DE_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DE_PLAN_DOC_PATH,
  POST_V1_GATE_DE_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DE_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTION_STATUS,
  rankPostV1GateDENumericCoverageCandidates,
  summarizePostV1GateDENumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-de";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

describe("post-V1 next numeric coverage gap Gate DE", () => {
  it("lands the no-runtime Gate DE rerank after Gate DD and selects bounded-rule Gate DF", () => {
    const summary = summarizePostV1GateDENumericCoverageGap();

    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTION_STATUS).toBe(
      "post_v1_wall_heavy_core_lined_massive_accuracy_gate_dd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_de"
    );
    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_LANDED_GATE
    );
    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-de-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DE_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_DE_PLAN_DOC_PATH,
      selectedCandidateId: POST_V1_GATE_DE_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTION_STATUS
    });
  });

  it("selects the bounded lined-massive owner contract and rejects fake scope moves", () => {
    const candidates = rankPostV1GateDENumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_DE_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_DE_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE,
      sliceKind: "accuracy_owner_contract",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DE_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0);

    expect(byId.get("wall.heavy_core_lined_massive_direct_retune")).toMatchObject({
      selected: false,
      sliceKind: "blocked_without_source_or_rule"
    });
    expect(byId.get("wall.heavy_core_lined_massive_readiness_gap")).toMatchObject({
      selected: false,
      sliceKind: "closed_readiness_gap"
    });
    expect(byId.get("floor.astm_iic_aiic_user_band_input_surface")).toMatchObject({
      selected: false,
      sliceKind: "metric_basis_input_surface",
      touchesFrontendOrSharedSurface: true
    });
    expect(byId.get("floor.steel_fallback_low_frequency_field_context_gap")).toMatchObject({
      selected: false,
      sliceKind: "already_runtime_capable"
    });

    for (
      const closedId of [
        "floor.lightweight_concrete_delta_lw_runtime_corridor_gap",
        "floor.composite_panel_delta_lw_published_interaction_owner_gap",
        "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
      ] as const
    ) {
      expect(byId.get(closedId)).toMatchObject({
        selected: false,
        sliceKind: "closed_runtime_gap"
      });
    }

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording", "frontend_ui_polish"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("keeps heavy-core / lined-massive runtime values frozen while selecting the bounded-rule owner", () => {
    const testCase = generatedCase(POST_V1_GATE_DD_LIVE_ROUTE_PINS.generatedCaseId);
    const lab = resultSnapshot(calculateAssembly(testCase.rows, testCase.labOptions));
    const field = resultSnapshot(calculateAssembly(testCase.rows, testCase.fieldOptions));

    expect(lab).toMatchObject({
      c: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.C,
      ctr: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.Ctr,
      dynamicFamily: POST_V1_GATE_DD_LIVE_ROUTE_PINS.dynamicFamily,
      rw: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.Rw,
      stc: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.STC,
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    expect(field).toMatchObject({
      c: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.C,
      ctr: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.Ctr,
      dnTA: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.DnTADb,
      dnTw: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.DnTwDb,
      dnW: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.DnWDb,
      dynamicFamily: POST_V1_GATE_DD_LIVE_ROUTE_PINS.dynamicFamily,
      rw: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.RwPrimeDb,
      supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      unsupportedTargetOutputs: []
    });
    expect(POST_V1_GATE_DE_NO_RUNTIME_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(POST_V1_GATE_DE_NO_RUNTIME_COUNTERS.frontendImplementationFilesTouched).toBe(0);
  });

  it("proves the steel low-frequency field candidate is already live with explicit CI50 input", () => {
    const testCase = generatedCase("floor-steel-fallback");
    const withoutCi50 = resultSnapshot(calculateAssembly(testCase.rows, testCase.fieldOptions));
    const withCi50 = resultSnapshot(
      calculateAssembly(testCase.rows, {
        ...testCase.fieldOptions,
        impactFieldContext: {
          ...testCase.fieldOptions?.impactFieldContext,
          ci50_2500Db: 4
        }
      })
    );

    expect(withoutCi50).toMatchObject({
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: ["L'nT,50"]
    });
    expect(withCi50).toMatchObject({
      lPrimeNT50: 62.2,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupportedTargetOutputs: []
    });
  });

  it("records the exact ASTM-band boundary as already owned and keeps ISO aliases out of Gate DE", () => {
    const byId = new Map(rankPostV1GateDENumericCoverageCandidates().map((candidate) => [candidate.id, candidate]));
    const astm = byId.get("floor.astm_iic_aiic_user_band_input_surface");

    expect(astm).toMatchObject({
      selected: false,
      sliceKind: "metric_basis_input_surface",
      targetMetrics: ["IIC", "AIIC"],
      touchesFrontendOrSharedSurface: true
    });
    for (const path of astm?.implementationEvidencePaths ?? []) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
    expect(POST_V1_GATE_DE_NO_RUNTIME_COUNTERS.wrongAliasOrFallbackBlocks).toContain(
      "floor ASTM IIC/AIIC user-band work is not the next engine-only layer-formula slice because exact ASTM band ownership already exists and broader surfaces cross shared/frontend boundaries"
    );
  });

  it("keeps docs and current-gate runner aligned with Gate DE closeout and Gate DF selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DE_SELECTED_CANDIDATE_ID);
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-de.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-de-contract.test.ts");
  });
});

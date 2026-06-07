import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  findVerifiedAirborneAssemblyMatch,
  findVerifiedAirborneAssemblyMatchWithLabFallback
} from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTION_STATUS
} from "./post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk";
import {
  POST_V1_GATE_DL_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DL_PLAN_DOC_PATH,
  POST_V1_GATE_DL_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DL_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTION_STATUS,
  rankPostV1GateDLNumericCoverageCandidates,
  summarizePostV1GateDLNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-dl";
import {
  WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS,
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS,
  type WallTimberLightweightLinkedHoldoutRow,
  type WallTimberLightweightOfficialSourceRow
} from "./wall-timber-lightweight-source-corpus";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const TIMBER_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const TIMBER_FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];

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

function context(options: Parameters<typeof calculateAssembly>[1], label: string): AirborneContext {
  const value = options?.airborneContext;

  if (!value) {
    throw new Error(`${label} airborne context missing`);
  }

  return value;
}

function hasExactLayerSignature(left: readonly LayerInput[], right: readonly LayerInput[]): boolean {
  return (
    left.length === right.length &&
    left.every(
      (layer, index) =>
        layer.materialId === right[index]?.materialId &&
        layer.thicknessMm === right[index]?.thicknessMm
    )
  );
}

function hasExactContextSignature(left: AirborneContext, right: Partial<AirborneContext>): boolean {
  return (
    left.contextMode === right.contextMode &&
    left.connectionType === right.connectionType &&
    left.studType === right.studType &&
    left.studSpacingMm === right.studSpacingMm &&
    left.resilientBarSideCount === right.resilientBarSideCount
  );
}

function officialTimberRows(): WallTimberLightweightOfficialSourceRow[] {
  return WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
    (entry): entry is WallTimberLightweightOfficialSourceRow => entry.kind === "official_row"
  );
}

function linkedTimberHoldoutRows(): WallTimberLightweightLinkedHoldoutRow[] {
  return WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
    (entry): entry is WallTimberLightweightLinkedHoldoutRow => entry.kind === "linked_holdout"
  );
}

describe("post-V1 next numeric coverage gap Gate DL", () => {
  it("lands the no-runtime Gate DL rerank after Gate DK and selects timber-stud bounded-rule Gate DM", () => {
    const summary = summarizePostV1GateDLNumericCoverageGap();

    expect(POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTION_STATUS).toBe(
      "post_v1_floor_steel_visible_formula_input_surface_parity_gate_dk_landed_surface_parity_selected_next_numeric_coverage_gap_gate_dl"
    );
    expect(POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_LANDED_GATE
    );
    expect(POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dl-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DL_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_DL_PLAN_DOC_PATH,
      previousGateDK: {
        landedGate: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTION_STATUS
      },
      selectedCandidateId: POST_V1_GATE_DL_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTION_STATUS
    });
  });

  it("selects the highest ROI engine-only timber-stud bounded owner and rejects stale or surface-only moves", () => {
    const candidates = rankPostV1GateDLNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_DL_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_DL_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE,
      sliceKind: "accuracy_owner_contract",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DL_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.clt_laminated_leaf_bounded_rule_owner_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.heavy_core_lined_massive_direct_retune")?.score ?? 0);

    expect(byId.get("floor.steel_visible_formula_input_surface_parity_gap")).toMatchObject({
      selected: false,
      sliceKind: "closed_runtime_gap"
    });
    expect(byId.get("floor.steel_visible_formula_runtime_bridge_gap")).toMatchObject({
      selected: false,
      sliceKind: "closed_runtime_gap"
    });
    expect(byId.get("wall.held_aac_board_fill_gap_multicavity_gap")).toMatchObject({
      selected: false,
      sliceKind: "already_runtime_capable"
    });

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording", "frontend_ui_polish"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("proves the selected timber-stud route is live formula work, not exact-source promotion or direct retune", () => {
    const testCase = generatedCase("wall-timber-stud");
    const labContext = context(testCase.labOptions, testCase.id);
    const fieldContext = context(testCase.fieldOptions, testCase.id);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);
    const exactTopologyMatches = WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.filter(
      (row) =>
        hasExactLayerSignature(testCase.rows, row.layers) &&
        (
          hasExactContextSignature(labContext, row.airborneContext) ||
          hasExactContextSignature(fieldContext, row.airborneContext)
        )
    );
    const secondaryDirectDoubleBoardRows = officialTimberRows().filter(
      (row) =>
        row.classification === "secondary_benchmark" &&
        row.topology === "timber_direct_double_board"
    );
    const linkedHoldouts = linkedTimberHoldoutRows();

    expect(labSnapshot.supportedTargetOutputs).toEqual([...TIMBER_LAB_OUTPUTS]);
    expect(fieldSnapshot.supportedTargetOutputs).toEqual([...TIMBER_FIELD_OUTPUTS]);
    expect(fieldSnapshot.unsupportedTargetOutputs).toEqual([]);
    expect(labSnapshot).toMatchObject({
      c: 0.5,
      ctr: -4.2,
      dynamicFamily: "stud_wall_system",
      rw: 50,
      rwDb: 50,
      stc: 50
    });
    expect(fieldSnapshot).toMatchObject({
      dnTA: 43.9,
      dnTw: 43,
      dnW: 42,
      dynamicFamily: "stud_wall_system",
      rwPrimeDb: 42
    });
    expect(field.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "stud_wall_system",
      familyDecisionClass: "ambiguous",
      runnerUpFamily: "double_leaf",
      selectedMethod: "mass_law",
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(findVerifiedAirborneAssemblyMatch(lab.layers, labContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, fieldContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, fieldContext)).toBeNull();
    expect(exactTopologyMatches).toEqual([]);
    expect(secondaryDirectDoubleBoardRows).toHaveLength(1);
    expect(hasExactLayerSignature(testCase.rows, secondaryDirectDoubleBoardRows[0]?.layers ?? []))
      .toBe(false);
    expect(linkedHoldouts.map((row) => row.topology)).toEqual([
      "lightweight_steel_single_board_holdout",
      "lightweight_steel_double_board_holdout"
    ]);
    expect(POST_V1_GATE_DL_NO_RUNTIME_COUNTERS).toMatchObject({
      boundedOwnerLedgersEstimated: 1,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeValuesMoved: 0
    });
  });

  it("keeps exact ASTM bands live but does not select ASTM surface work as the next engine formula slice", () => {
    const astmCandidate = rankPostV1GateDLNumericCoverageCandidates().find(
      (candidate) => candidate.id === "floor.astm_iic_aiic_user_band_input_surface"
    );
    const astmGateF = readRepoFile("packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts");
    const astmGateG = readRepoFile("packages/engine/src/post-v1-floor-astm-iic-aiic-surface-parity-gate-g-contract.test.ts");

    expect(astmCandidate).toMatchObject({
      selected: false,
      sliceKind: "metric_basis_input_surface",
      targetMetrics: ["IIC", "AIIC"],
      touchesSharedOrApiSurface: true
    });
    expect(astmGateF).toContain("calculates lab IIC from an exact ASTM E492 one-third-octave source");
    expect(astmGateF).toContain("calculates field AIIC from an exact ASTM E1007 source");
    expect(astmGateG).toContain("keeps live IIC and AIIC on the ASTM candidate trace");
  });

  it("keeps docs and current-gate runner aligned with Gate DL closeout and Gate DM selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DL_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("timber-stud");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dl.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-dl-contract.test.ts");
  });
});

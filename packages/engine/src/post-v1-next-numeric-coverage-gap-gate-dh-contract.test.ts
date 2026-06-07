import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_DH_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DH_PLAN_DOC_PATH,
  POST_V1_GATE_DH_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DH_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTION_STATUS,
  rankPostV1GateDHNumericCoverageCandidates,
  summarizePostV1GateDHNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-dh";
import {
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTION_STATUS
} from "./post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg";
import {
  STEEL_FLOOR_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";
import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS
} from "./steel-floor-formula-input-surface";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const CURRENTLY_PROTECTED_STEEL_DELTA_LW_GAPS = [
  "floor-open-web-bound",
  "floor-ubiq-steel-300-unspecified-bound",
  "floor-ubiq-steel-200-unspecified-bound",
  "floor-ubiq-steel-250-bound",
  "floor-steel-fallback"
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

describe("post-V1 next numeric coverage gap Gate DH", () => {
  it("lands the no-runtime Gate DH rerank after Gate DG and selects steel visible formula input bridge Gate DI", () => {
    const summary = summarizePostV1GateDHNumericCoverageGap();

    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTION_STATUS).toBe(
      "post_v1_wall_heavy_core_lined_massive_bounded_runtime_basis_gate_dg_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_dh"
    );
    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_LANDED_GATE
    );
    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dh-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DH_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_DH_PLAN_DOC_PATH,
      selectedCandidateId: POST_V1_GATE_DH_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTION_STATUS
    });
  });

  it("selects the highest ROI engine-only steel input bridge and rejects stale or unsafe moves", () => {
    const candidates = rankPostV1GateDHNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_DH_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_DH_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: true,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE,
      sliceKind: "formula_input_bridge",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DH_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.heavy_core_lined_massive_direct_retune")?.score ?? 0);

    expect(byId.get("floor.steel_bound_delta_lw_from_family_row")).toMatchObject({
      selected: false,
      sliceKind: "wrong_alias_or_fallback"
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

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("keeps current visible steel/open-web generated rows from fabricating DeltaLw", () => {
    for (const id of CURRENTLY_PROTECTED_STEEL_DELTA_LW_GAPS) {
      const testCase = generatedCase(id);
      const result = resultSnapshot(
        calculateAssembly(testCase.rows, {
          ...testCase.labOptions,
          targetOutputs: ["Ln,w", "DeltaLw"]
        })
      );

      expect(result.supportedTargetOutputs, id).toEqual(["Ln,w"]);
      expect(result.unsupportedTargetOutputs, id).toEqual(["DeltaLw"]);
      expect(result.lnW, id).toEqual(expect.any(Number));
      expect(result.deltaLw, id).toBeUndefined();
    }
    expect(POST_V1_GATE_DH_NO_RUNTIME_COUNTERS.protectedCurrentlyUnsupportedRequestShapes).toBe(
      CURRENTLY_PROTECTED_STEEL_DELTA_LW_GAPS.length
    );
    expect(POST_V1_GATE_DH_NO_RUNTIME_COUNTERS.runtimeValuesMoved).toBe(0);
  });

  it("proves the selected Gate DI target is a formula bridge, not a new formula or source-row catalog", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
      surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
      targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS
    });
    const result = calculateAssembly(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS
    });

    expect(surface).toMatchObject({
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor"
    });
    expect(result.impact).toMatchObject({
      DeltaLw: 22.4,
      LnW: 51.6,
      basis: STEEL_FLOOR_FORMULA_BASIS
    });
    expect(POST_V1_GATE_DH_NO_RUNTIME_COUNTERS.selectedRequiredPhysicalInputs).toEqual(
      STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS
    );
    expect(POST_V1_GATE_DH_NO_RUNTIME_COUNTERS.wrongAliasOrFallbackBlocks).toEqual([
      "Gate DI may route visible steel/open-web floors to the existing steel formula only when the steel formula owner inputs are present",
      "bound-only UBIQ/open-web Ln,w rows and generic steel family archetypes must not publish DeltaLw by proximity",
      "missing steelSupportForm, steelCarrierDepthMm, steelCarrierSpacingMm, toppingOrFloatingLayer, resilientLayerDynamicStiffnessMNm3, loadBasisKgM2, or lowerCeilingIsolationSupportForm remains needs_input",
      "suspended-ceiling-only steel floors keep Ln,w only until upper-package DeltaLw owner inputs are present",
      "ISO DeltaLw still does not publish ASTM IIC or AIIC aliases"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate DH closeout and Gate DI selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DH_SELECTED_CANDIDATE_ID);
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dh.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-dh-contract.test.ts");
  });
});

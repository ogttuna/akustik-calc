import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTION_STATUS
} from "./post-v1-floor-steel-visible-formula-input-bridge-gate-di";
import {
  POST_V1_GATE_DJ_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DJ_PLAN_DOC_PATH,
  POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DJ_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTION_STATUS,
  rankPostV1GateDJNumericCoverageCandidates,
  summarizePostV1GateDJNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-dj";
import { STEEL_FLOOR_FORMULA_BASIS } from "./steel-floor-impact-formula-corridor";
import { STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS } from "./steel-floor-formula-input-surface";

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

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

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

function contextWithSupportTopology(
  context: AirborneContext | null | undefined,
  contextMode: Extract<AirborneContext["contextMode"], "element_lab" | "field_between_rooms">
): AirborneContext {
  return {
    ...(context ?? {}),
    contextMode,
    panelHeightMm: 2800,
    panelWidthMm: 3600,
    receivingRoomRt60S: 0.6,
    receivingRoomVolumeM3: 45,
    wallTopology: {
      ...(context?.wallTopology ?? {}),
      supportTopology: "independent_frames"
    }
  };
}

describe("post-V1 next numeric coverage gap Gate DJ", () => {
  it("lands the no-runtime Gate DJ rerank after Gate DI and selects steel surface parity Gate DK", () => {
    const summary = summarizePostV1GateDJNumericCoverageGap();

    expect(POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTION_STATUS).toBe(
      "post_v1_floor_steel_visible_formula_input_bridge_gate_di_landed_runtime_selected_next_numeric_coverage_gap_gate_dj"
    );
    expect(POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_LANDED_GATE
    );
    expect(POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dj-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DJ_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_DJ_PLAN_DOC_PATH,
      previousGateDI: {
        landedGate: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTION_STATUS
      },
      selectedCandidateId: POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTION_STATUS
    });
  });

  it("selects steel visible formula input surface parity and rejects stale or fake scope moves", () => {
    const candidates = rankPostV1GateDJNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_DJ_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: true,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE,
      sliceKind: "calculator_surface_parity",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DJ_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: true
    });
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.held_aac_board_fill_gap_multicavity_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.heavy_core_lined_massive_direct_retune")?.score ?? 0);

    expect(byId.get("floor.steel_visible_formula_runtime_bridge_gap")).toMatchObject({
      selected: false,
      sliceKind: "closed_runtime_gap"
    });
    expect(byId.get("wall.held_aac_board_fill_gap_multicavity_gap")).toMatchObject({
      selected: false,
      sliceKind: "already_runtime_capable"
    });
    expect(byId.get("floor.astm_iic_aiic_user_band_input_surface")).toMatchObject({
      selected: false,
      sliceKind: "metric_basis_input_surface",
      touchesSharedOrApiSurface: true
    });

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("proves Gate DK is surface parity for the existing Gate DI steel formula, not a new formula", () => {
    const complete = calculateAssembly(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS, {
      steelFloorFormulaSurface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
      targetOutputs: POST_V1_GATE_DJ_SELECTED_TARGET_OUTPUTS
    });

    expect(complete.impact).toMatchObject({
      DeltaLw: 22.4,
      LnW: 51.6,
      basis: STEEL_FLOOR_FORMULA_BASIS
    });
    expect(complete.supportedTargetOutputs).toEqual([...POST_V1_GATE_DJ_SELECTED_TARGET_OUTPUTS]);
    expect(POST_V1_GATE_DJ_NO_RUNTIME_COUNTERS.selectedRequiredPhysicalInputs).toEqual(
      STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS
    );

    for (const id of CURRENTLY_PROTECTED_STEEL_DELTA_LW_GAPS) {
      const testCase = generatedCase(id);
      const protectedResult = resultSnapshot(
        calculateAssembly(testCase.rows, {
          ...testCase.labOptions,
          targetOutputs: POST_V1_GATE_DJ_SELECTED_TARGET_OUTPUTS
        })
      );

      expect(protectedResult.supportedTargetOutputs, id).toEqual(["Ln,w"]);
      expect(protectedResult.unsupportedTargetOutputs, id).toEqual(["DeltaLw"]);
      expect(protectedResult.deltaLw, id).toBeUndefined();
    }

    expect(POST_V1_GATE_DJ_NO_RUNTIME_COUNTERS).toMatchObject({
      estimatedNextSurfaceRequestShapes: 4,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeValuesMoved: 0,
      selectedCalculatorSurfaceParityRequired: true
    });
  });

  it("does not select wall-held AAC because support-backed visible topology already calculates", () => {
    const heldAac = generatedCase("wall-held-aac");
    const missingSupport = calculateAssembly(heldAac.rows, {
      ...heldAac.labOptions,
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const supportBackedLab = calculateAssembly(heldAac.rows, {
      ...heldAac.labOptions,
      airborneContext: contextWithSupportTopology(heldAac.labOptions.airborneContext, "element_lab"),
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const supportBackedField = calculateAssembly(heldAac.rows, {
      ...heldAac.fieldOptions,
      airborneContext: contextWithSupportTopology(heldAac.fieldOptions.airborneContext, "field_between_rooms"),
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(missingSupport.supportedTargetOutputs).toEqual([]);
    expect(missingSupport.unsupportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(missingSupport.airborneBasis).toMatchObject({
      missingPhysicalInputs: expect.arrayContaining(["supportTopology"]),
      origin: "needs_input"
    });

    expect(supportBackedLab.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(supportBackedLab.unsupportedTargetOutputs).toEqual([]);
    expect(supportBackedLab.airborneBasis).toMatchObject({
      family: "multileaf_multicavity",
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });

    expect(supportBackedField.supportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
    expect(supportBackedField.unsupportedTargetOutputs).toEqual([]);
    expect(supportBackedField.airborneBasis).toMatchObject({
      family: "multileaf_multicavity",
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate DJ closeout and Gate DK selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID);
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dj.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-dj-contract.test.ts");
  });
});

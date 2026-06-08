import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import {
  ENGINE_MIXED_GENERATED_CASES
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTION_STATUS,
  POST_V1_GATE_DI_COUNTERS,
  POST_V1_GATE_DI_NEGATIVE_BOUNDARIES,
  POST_V1_GATE_DI_NEWLY_CALCULABLE_LAYER_TEMPLATES,
  POST_V1_GATE_DI_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DI_TARGET_OUTPUTS,
  summarizePostV1FloorSteelVisibleFormulaInputBridgeGateDI
} from "./post-v1-floor-steel-visible-formula-input-bridge-gate-di";
import {
  POST_V1_GATE_DH_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-dh";
import {
  STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS,
  type SteelFloorFormulaInputSurface
} from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";

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

const OPEN_WEB_STEEL_VISIBLE_FORMULA_LAYERS = COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS.map(
  (layer): LayerInput =>
    layer.floorRole === "base_structure"
      ? {
          ...layer,
          materialId: "open_web_steel_floor",
          thicknessMm: 300
        }
      : layer
);

const OPEN_WEB_STEEL_VISIBLE_FORMULA_SURFACE = {
  ...COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
  steelCarrierDepthMm: 300,
  steelSupportForm: "open_web_or_rolled"
} as const satisfies SteelFloorFormulaInputSurface;

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

describe("post-V1 floor steel visible formula input bridge Gate DI", () => {
  it("lands after Gate DH and selects the next numeric coverage/accuracy rerank Gate DJ", () => {
    const summary = summarizePostV1FloorSteelVisibleFormulaInputBridgeGateDI();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_dh_landed_no_runtime_selected_floor_steel_visible_formula_input_bridge_gate_di"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-steel-visible-formula-input-bridge-gate-di-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_DI_COUNTERS,
      landedGate: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE,
      negativeBoundaries: POST_V1_GATE_DI_NEGATIVE_BOUNDARIES,
      newCalculableLayerTemplates: POST_V1_GATE_DI_NEWLY_CALCULABLE_LAYER_TEMPLATES,
      runtimeFormulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      selectedCandidateId: POST_V1_GATE_DI_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      targetOutputs: POST_V1_GATE_DI_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_DI_SELECTED_CANDIDATE_ID).toBe(POST_V1_GATE_DH_SELECTED_CANDIDATE_ID);
  });

  it("routes complete visible steel joist and open-web stacks through the existing steel formula corridor", () => {
    const steelJoistResult = calculateAssembly(
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
      {
        steelFloorFormulaSurface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
        targetOutputs: POST_V1_GATE_DI_TARGET_OUTPUTS
      }
    );
    const openWebResult = calculateAssembly(OPEN_WEB_STEEL_VISIBLE_FORMULA_LAYERS, {
      steelFloorFormulaSurface: OPEN_WEB_STEEL_VISIBLE_FORMULA_SURFACE,
      targetOutputs: POST_V1_GATE_DI_TARGET_OUTPUTS
    });

    expect(steelJoistResult.impact).toMatchObject({
      DeltaLw: 22.4,
      LnW: 51.6,
      basis: STEEL_FLOOR_FORMULA_BASIS
    });
    expect(steelJoistResult.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(steelJoistResult.unsupportedTargetOutputs).toEqual([]);

    expect(openWebResult.impact).toMatchObject({
      DeltaLw: 22.4,
      LnW: 52.2,
      basis: STEEL_FLOOR_FORMULA_BASIS
    });
    expect(openWebResult.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(openWebResult.unsupportedTargetOutputs).toEqual([]);
    expect(POST_V1_GATE_DI_COUNTERS.newCalculableLayerTemplates).toBe(2);
  });

  it("supports already-owned single-output shapes without requiring a companion request", () => {
    const shapes = [
      {
        expectedLnW: 51.6,
        layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
        surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
        targetOutputs: ["Ln,w"] as const
      },
      {
        expectedLnW: 51.6,
        layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
        surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
        targetOutputs: ["DeltaLw"] as const
      },
      {
        expectedLnW: 52.2,
        layers: OPEN_WEB_STEEL_VISIBLE_FORMULA_LAYERS,
        surface: OPEN_WEB_STEEL_VISIBLE_FORMULA_SURFACE,
        targetOutputs: ["Ln,w"] as const
      },
      {
        expectedLnW: 52.2,
        layers: OPEN_WEB_STEEL_VISIBLE_FORMULA_LAYERS,
        surface: OPEN_WEB_STEEL_VISIBLE_FORMULA_SURFACE,
        targetOutputs: ["DeltaLw"] as const
      }
    ];

    for (const shape of shapes) {
      const result = calculateAssembly(shape.layers, {
        steelFloorFormulaSurface: shape.surface,
        targetOutputs: shape.targetOutputs
      });

      expect(result.impact, shape.targetOutputs.join(",")).toMatchObject({
        DeltaLw: 22.4,
        LnW: shape.expectedLnW,
        basis: STEEL_FLOOR_FORMULA_BASIS
      });
      expect(result.supportedTargetOutputs, shape.targetOutputs.join(",")).toEqual([...shape.targetOutputs]);
      expect(result.unsupportedTargetOutputs, shape.targetOutputs.join(",")).toEqual([]);
    }
    expect(POST_V1_GATE_DI_COUNTERS.newCalculableRequestShapes).toBe(4);
  });

  it("keeps selected steel owner fields as needs_input instead of falling back to family estimates", () => {
    const { steelSupportForm: _missingSupportForm, ...missingSupportForm } =
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE;
    const { steelCarrierSpacingMm: _missingCarrierSpacing, ...missingCarrierSpacing } =
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE;
    const { loadBasisKgM2: _missingLoadBasis, ...missingLoadBasis } =
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE;
    void _missingSupportForm;
    void _missingCarrierSpacing;
    void _missingLoadBasis;

    for (
      const [surface, missingField] of [
        [missingSupportForm, "steelSupportForm"],
        [missingCarrierSpacing, "steelCarrierSpacingMm"],
        [missingLoadBasis, "loadBasisKgM2"]
      ] as const
    ) {
      const result = calculateAssembly(
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
        {
          steelFloorFormulaSurface: surface,
          targetOutputs: POST_V1_GATE_DI_TARGET_OUTPUTS
        }
      );

      expect(result.impact, missingField).toBeNull();
      expect(result.supportedTargetOutputs, missingField).toEqual([]);
      expect(result.unsupportedTargetOutputs, missingField).toEqual(["Ln,w", "DeltaLw"]);
      expect(result.acousticAnswerBoundary, missingField).toMatchObject({
        method: "acoustic_calculator_answer_engine_v1_floor_impact_missing_physical_inputs",
        missingPhysicalInputs: [missingField],
        origin: "needs_input",
        unsupportedOutputs: ["Ln,w", "DeltaLw"]
      });
    }
    expect(POST_V1_GATE_DI_COUNTERS.requiredPhysicalInputs).toEqual(STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS);
  });

  it("keeps surface-absent steel generated rows and ASTM aliases out of the formula bridge", () => {
    for (const id of CURRENTLY_PROTECTED_STEEL_DELTA_LW_GAPS) {
      const testCase = generatedCase(id);
      const result = calculateAssembly(testCase.rows, {
        ...testCase.labOptions,
        targetOutputs: POST_V1_GATE_DI_TARGET_OUTPUTS
      });

      expect(result.supportedTargetOutputs, id).toEqual(["Ln,w"]);
      expect(result.unsupportedTargetOutputs, id).toEqual(["DeltaLw"]);
      expect(result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound, id).toEqual(expect.any(Number));
      expect(result.impact?.DeltaLw, id).toBeUndefined();
    }

    const astmAliasResult = calculateAssembly(
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
      {
        steelFloorFormulaSurface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
        targetOutputs: ["DeltaLw", "IIC", "AIIC"]
      }
    );

    expect(astmAliasResult.impact).toMatchObject({
      DeltaLw: 22.4,
      basis: STEEL_FLOOR_FORMULA_BASIS
    });
    expect(astmAliasResult.supportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(astmAliasResult.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(POST_V1_GATE_DI_COUNTERS.protectedNoSurfaceGeneratedRequestShapes).toBe(
      CURRENTLY_PROTECTED_STEEL_DELTA_LW_GAPS.length
    );
    expect(POST_V1_GATE_DI_COUNTERS.astmAliasRequestShapesKeptUnsupported).toBe(2);
  });

  it("keeps docs and current-gate runner aligned with Gate DI closeout and Gate DJ selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DI_SELECTED_CANDIDATE_ID);
    }

    expect(
      existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-floor-steel-visible-formula-input-bridge-gate-di.ts"))
    ).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-floor-steel-visible-formula-input-bridge-gate-di-contract.test.ts");
  });
});

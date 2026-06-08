import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EstimateRequestSchema,
  ImpactOnlyRequestSchema,
  type LayerInput
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import {
  ENGINE_MIXED_GENERATED_CASES
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTION_STATUS,
  POST_V1_GATE_DK_COUNTERS,
  POST_V1_GATE_DK_NEGATIVE_BOUNDARIES,
  POST_V1_GATE_DK_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DK_SURFACE_TARGETS,
  POST_V1_GATE_DK_TARGET_OUTPUTS,
  summarizePostV1FloorSteelVisibleFormulaInputSurfaceParityGateDK
} from "./post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTION_STATUS,
  POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID
} from "./post-v1-next-numeric-coverage-gap-gate-dj";
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

const REQUIRED_GATE_DK_SURFACES = [
  "packages/shared/src/domain/steel-floor-formula-input-surface.ts",
  "packages/shared/src/api/estimate.ts",
  "packages/shared/src/api/impact-only.ts",
  "apps/web/app/api/estimate/route.ts",
  "apps/web/app/api/impact-only/route.ts",
  "packages/engine/src/calculate-impact-only.ts",
  "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk.ts",
  "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
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

describe("post-V1 floor steel visible formula input surface parity Gate DK", () => {
  it("lands after Gate DJ and selects the next numeric coverage/accuracy rerank Gate DL", () => {
    const summary = summarizePostV1FloorSteelVisibleFormulaInputSurfaceParityGateDK();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_dj_landed_no_runtime_selected_floor_steel_visible_formula_input_surface_parity_gate_dk"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_DK_COUNTERS,
      landedGate: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE,
      negativeBoundaries: POST_V1_GATE_DK_NEGATIVE_BOUNDARIES,
      runtimeFormulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      selectedCandidateId: POST_V1_GATE_DK_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      surfaceTargets: POST_V1_GATE_DK_SURFACE_TARGETS,
      targetOutputs: POST_V1_GATE_DK_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_DK_SELECTED_CANDIDATE_ID).toBe(POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID);
  });

  it("carries the Gate DI steel formula owner through estimate and impact-only API-equivalent surfaces", () => {
    const estimatePayload = EstimateRequestSchema.parse({
      layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
      steelFloorFormulaSurface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
      targetOutputs: POST_V1_GATE_DK_TARGET_OUTPUTS
    });
    const impactOnlyPayload = ImpactOnlyRequestSchema.parse({
      layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
      steelFloorFormulaSurface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
      targetOutputs: POST_V1_GATE_DK_TARGET_OUTPUTS
    });

    const estimate = calculateAssembly(estimatePayload.layers, {
      steelFloorFormulaSurface: estimatePayload.steelFloorFormulaSurface,
      targetOutputs: estimatePayload.targetOutputs
    });
    const impactOnly = calculateImpactOnly(impactOnlyPayload.layers, {
      steelFloorFormulaSurface: impactOnlyPayload.steelFloorFormulaSurface,
      targetOutputs: impactOnlyPayload.targetOutputs
    });
    const openWebImpactOnly = calculateImpactOnly(OPEN_WEB_STEEL_VISIBLE_FORMULA_LAYERS, {
      steelFloorFormulaSurface: OPEN_WEB_STEEL_VISIBLE_FORMULA_SURFACE,
      targetOutputs: POST_V1_GATE_DK_TARGET_OUTPUTS
    });

    expect(estimate.impact).toMatchObject({
      DeltaLw: 22.4,
      LnW: 51.6,
      basis: STEEL_FLOOR_FORMULA_BASIS
    });
    expect(impactOnly.impact).toMatchObject({
      DeltaLw: 22.4,
      LnW: 51.6,
      basis: STEEL_FLOOR_FORMULA_BASIS
    });
    expect(openWebImpactOnly.impact).toMatchObject({
      DeltaLw: 22.4,
      LnW: 52.2,
      basis: STEEL_FLOOR_FORMULA_BASIS
    });
    expect(impactOnly.sourceMode).toBe("predictor_input");
    expect(impactOnly.supportedTargetOutputs).toEqual([...POST_V1_GATE_DK_TARGET_OUTPUTS]);
    expect(impactOnly.unsupportedTargetOutputs).toEqual([]);
    expect(openWebImpactOnly.supportedTargetOutputs).toEqual([...POST_V1_GATE_DK_TARGET_OUTPUTS]);
    expect(openWebImpactOnly.unsupportedTargetOutputs).toEqual([]);
  });

  it("supports impact-only single-output steel surface shapes without requiring a companion request", () => {
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
      const result = calculateImpactOnly(shape.layers, {
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
    expect(POST_V1_GATE_DK_COUNTERS.newCalculableRequestShapes).toBe(4);
  });

  it("keeps selected steel owner fields as impact-only needs_input instead of falling back to family estimates", () => {
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
      const result = calculateImpactOnly(
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
        {
          steelFloorFormulaSurface: surface,
          targetOutputs: POST_V1_GATE_DK_TARGET_OUTPUTS
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
    expect(POST_V1_GATE_DK_COUNTERS.requiredPhysicalInputs).toEqual(STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS);
  });

  it("keeps surface-absent steel generated rows and ASTM aliases out of the impact-only surface bridge", () => {
    for (const id of CURRENTLY_PROTECTED_STEEL_DELTA_LW_GAPS) {
      const testCase = generatedCase(id);
      const result = calculateAssembly(testCase.rows, {
        ...testCase.labOptions,
        targetOutputs: POST_V1_GATE_DK_TARGET_OUTPUTS
      });

      expect(result.supportedTargetOutputs, id).toEqual(["Ln,w"]);
      expect(result.unsupportedTargetOutputs, id).toEqual(["DeltaLw"]);
      expect(result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound, id).toEqual(expect.any(Number));
      expect(result.impact?.DeltaLw, id).toBeUndefined();
    }

    const astmAliasResult = calculateImpactOnly(
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
    expect(POST_V1_GATE_DK_COUNTERS.protectedNoSurfaceGeneratedRequestShapes).toBe(
      CURRENTLY_PROTECTED_STEEL_DELTA_LW_GAPS.length
    );
    expect(POST_V1_GATE_DK_COUNTERS.astmAliasRequestShapesKeptUnsupported).toBe(2);
  });

  it("keeps docs, shared surfaces, API routes, and current-gate runner aligned with Gate DK closeout", () => {
    for (const path of REQUIRED_GATE_DK_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        path === "packages/shared/src/domain/steel-floor-formula-input-surface.ts"
          ? "SteelFloorFormulaInputSurfaceSchema"
          : "steelFloorFormulaSurface"
      );
    }

    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTION_STATUS);
      expect(contents, path).toContain(
        POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_DK_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("impact-only");
      expect(contents, path).toContain("Ln,w 51.6 / DeltaLw 22.4");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts");
  });
});

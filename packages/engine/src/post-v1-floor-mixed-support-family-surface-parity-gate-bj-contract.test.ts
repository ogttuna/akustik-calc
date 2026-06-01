import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
  MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID
} from "./mixed-support-floor-impact-runtime-corridor";
import {
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTION_STATUS,
  POST_V1_GATE_BI_FIELD_CONTEXT,
  POST_V1_GATE_BI_MIXED_OUTPUTS,
  POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT
} from "./post-v1-floor-mixed-support-family-runtime-corridor-gate-bi";
import {
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_LANDED_GATE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTION_STATUS,
  POST_V1_GATE_BJ_VISIBLE_MIXED_SUPPORT_LAYERS,
  summarizePostV1FloorMixedSupportFamilySurfaceParityGateBJ
} from "./post-v1-floor-mixed-support-family-surface-parity-gate-bj";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BJ_SURFACES = [
  "packages/engine/src/post-v1-floor-mixed-support-family-surface-parity-gate-bj.ts",
  "packages/engine/src/post-v1-floor-mixed-support-family-surface-parity-gate-bj-contract.test.ts",
  "apps/web/features/workbench/mixed-support-floor-impact-corridor-view.ts",
  "apps/web/features/workbench/post-v1-floor-mixed-support-family-surface-parity-gate-bj.test.ts",
  "apps/web/app/api/estimate/route.ts",
  "apps/web/app/api/impact-only/route.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/impact-lane-view.ts",
  "apps/web/features/workbench/impact-metric-basis-view.ts",
  "apps/web/features/workbench/impact-confidence-view.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
  "packages/engine/src/dynamic-impact.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_BG_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_BG_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function expectMixedSupportSurfaceAnswer(
  result: ReturnType<typeof calculateAssembly> | ReturnType<typeof calculateImpactOnly> | null | undefined
) {
  expect(result?.impact).toMatchObject({
    DeltaLw: 29.9,
    LPrimeNT50: 47.8,
    LPrimeNTw: 43.8,
    LPrimeNW: 46.6,
    LnW: 44.6
  });
  expect(result?.impact?.metricBasis).toMatchObject({
    DeltaLw: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
    LnW: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS
  });
  expect(result?.supportedTargetOutputs).toEqual([...POST_V1_GATE_BI_MIXED_OUTPUTS]);
  expect(result?.unsupportedTargetOutputs).toEqual([]);
}

describe("post-V1 floor mixed-support family surface parity Gate BJ", () => {
  it("lands Gate BJ after Gate BI and selects the next numeric coverage gap Gate BK", () => {
    const summary = summarizePostV1FloorMixedSupportFamilySurfaceParityGateBJ();

    expect(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_LANDED_GATE
    );
    expect(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-mixed-support-family-surface-parity-gate-bj-contract.test.ts"
    );
    expect(summary).toMatchObject({
      fieldContext: POST_V1_GATE_BI_FIELD_CONTEXT,
      landedGate: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_LANDED_GATE,
      previousGateBI: {
        landedGate: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTION_STATUS
      },
      runtimeMovedAtGateBJ: false,
      selectedNextAction: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTION_STATUS
    });
    expect(summary.surfaceSnapshots.map((snapshot) => snapshot.id)).toEqual([
      "workbench_cards",
      "markdown_report",
      "saved_replay",
      "estimate_api_payload",
      "impact_only_api_payload",
      "resolver_trace",
      "dynamic_impact_trace"
    ]);
    expect(summary.surfaceSnapshots.every((snapshot) => snapshot.lnWDb === 44.6)).toBe(true);
    expect(summary.surfaceSnapshots.every((snapshot) => snapshot.deltaLwDb === 29.9)).toBe(true);
    expect(summary.surfaceSnapshots.every((snapshot) => snapshot.lPrimeNTwDb === 43.8)).toBe(true);

    for (const path of REQUIRED_GATE_BJ_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps estimate and impact-only API-equivalent payloads on the same mixed-support values and trace labels", () => {
    const estimate = calculateAssembly(POST_V1_GATE_BJ_VISIBLE_MIXED_SUPPORT_LAYERS, {
      calculator: "dynamic",
      impactFieldContext: POST_V1_GATE_BI_FIELD_CONTEXT,
      impactPredictorInput: POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
      targetOutputs: POST_V1_GATE_BI_MIXED_OUTPUTS
    });
    const impactOnly = calculateImpactOnly(POST_V1_GATE_BJ_VISIBLE_MIXED_SUPPORT_LAYERS, {
      impactFieldContext: POST_V1_GATE_BI_FIELD_CONTEXT,
      impactPredictorInput: POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
      targetOutputs: POST_V1_GATE_BI_MIXED_OUTPUTS
    });

    for (const result of [estimate, impactOnly]) {
      expectMixedSupportSurfaceAnswer(result);
      expect(result.dynamicImpactTrace).toMatchObject({
        detectedSupportFamily: "reinforced_concrete",
        fieldContinuation: "standardized_room_volume",
        impactBasisLabel: "Standardized field-volume carry-over",
        selectedLabel: "Mixed-support single-primary carrier formula corridor",
        selectionKindLabel: "Scoped formula estimate"
      });
      expect(result.dynamicImpactTrace?.notes.join("\n")).toContain(
        "Mixed-support corridor stayed inside the explicit Gate BI single-primary-carrier owner guard"
      );
      expect(result.layerCombinationResolverTrace).toMatchObject({
        basis: "field_apparent",
        runtimeBasisId: "source_absent_field_building_adapter_error_budget",
        selectedCandidateId: "floor.impact_field_context.field_building_adapter",
        supportedMetrics: ["L'n,w", "L'nT,w", "L'nT,50"]
      });
    }
  });

  it("keeps the lab resolver trace pinned to the mixed-support candidate when field context is not requested", () => {
    const result = calculateImpactOnly(POST_V1_GATE_BJ_VISIBLE_MIXED_SUPPORT_LAYERS, {
      impactPredictorInput: POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impact).toMatchObject({
      basis: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
      DeltaLw: 29.9,
      LnW: 44.6
    });
    expect(result.dynamicImpactTrace).toMatchObject({
      impactBasisLabel: "Mixed-support single-primary carrier formula corridor",
      selectedLabel: "Mixed-support single-primary carrier formula corridor",
      selectionKindLabel: "Scoped formula estimate"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "element_lab",
      runtimeBasisId: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
      selectedCandidateId: MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Ln,w", "DeltaLw"],
      valuePins: [
        {
          metric: "Ln,w",
          value: 44.6
        },
        {
          metric: "DeltaLw",
          value: 29.9
        }
      ]
    });
  });

  it("keeps docs and current-gate runner aligned with Gate BJ closeout and Gate BK selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_LANDED_GATE
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_SURFACE_PARITY_GATE_BJ_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain("workbench cards");
      expect(contents, path).toContain("impact-only API");
      expect(contents, path).toContain("Ln,w 44.6");
      expect(contents, path).toContain("L'nT,w 43.8");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-mixed-support-family-surface-parity-gate-bj-contract.test.ts"
    );
    expect(runner).toContain(
      "features/workbench/post-v1-floor-mixed-support-family-surface-parity-gate-bj.test.ts"
    );
  });
});

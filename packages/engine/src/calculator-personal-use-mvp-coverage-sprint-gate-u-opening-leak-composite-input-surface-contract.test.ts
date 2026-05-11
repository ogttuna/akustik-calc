import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_U_OPENING_LEAK_COMPOSITE_INPUT_SURFACE_PLAN =
  "gate_u_personal_use_mvp_opening_leak_composite_input_surface_plan";

const GATE_U_OPENING_LEAK_COMPOSITE_INPUT_SURFACE_STATUS =
  "gate_u_personal_use_mvp_opening_leak_composite_input_surface_landed_selected_revalidation_gate_v";

const GATE_U_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION =
  "gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_plan";

const GATE_U_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-v-post-opening-leak-input-surface-revalidation-contract.test.ts";

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_U = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: GATE_U_OPENING_LEAK_COMPOSITE_INPUT_SURFACE_PLAN,
  numericRuntimeBehaviorChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_U_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_U_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
  selectionStatus: GATE_U_OPENING_LEAK_COMPOSITE_INPUT_SURFACE_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: true
} as const;

const REQUIRED_GATE_U_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-u-opening-leak-composite-input-surface-contract.test.ts",
  "apps/web/features/workbench/opening-leak-composite-input-surface.ts",
  "apps/web/features/workbench/opening-leak-composite-input-surface-acceptance.test.ts",
  "apps/web/features/workbench/scenario-analysis.ts",
  "apps/web/features/workbench/simple-workbench-route-panel.tsx",
  "apps/web/features/workbench/simple-workbench-shell.tsx",
  "apps/web/features/workbench/workbench-store.ts",
  "apps/web/features/workbench/server-project-workbench-snapshot.ts",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"
] as const;

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const UI_DERIVED_OPENING_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  hostWallAreaM2: 12,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ]
};

const OPENING_TARGETS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate U opening/leak composite input surface", () => {
  it("lands Gate U as workbench input surfacing only and selects revalidation next", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_U).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_u_personal_use_mvp_opening_leak_composite_input_surface_plan",
      numericRuntimeBehaviorChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-v-post-opening-leak-input-surface-revalidation-contract.test.ts",
      selectionStatus:
        "gate_u_personal_use_mvp_opening_leak_composite_input_surface_landed_selected_revalidation_gate_v",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: true
    });

    for (const path of REQUIRED_GATE_U_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps UI-derived complete opening fields on the Gate S runtime value and basis", () => {
    const result = calculateAssembly(HOST_WALL, {
      airborneContext: UI_DERIVED_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });

    expect(result.metrics.estimatedRwDb).toBe(38.2);
    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["STC", "R'w", "DnT,w"]);
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.warnings).toContain(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING);
  });

  it("keeps docs and the current-gate runner aligned with Gate U closeout and Gate V selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain(GATE_U_OPENING_LEAK_COMPOSITE_INPUT_SURFACE_PLAN);
      expect(content).toContain(GATE_U_OPENING_LEAK_COMPOSITE_INPUT_SURFACE_STATUS);
      expect(content).toContain(GATE_U_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION);
      expect(content).toContain("opening/leak composite");
      expect(content).toContain("input surface");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-u-opening-leak-composite-input-surface-contract.test.ts"
    );
    expect(runner).toContain("opening-leak-composite-input-surface-acceptance.test.ts");
  });
});

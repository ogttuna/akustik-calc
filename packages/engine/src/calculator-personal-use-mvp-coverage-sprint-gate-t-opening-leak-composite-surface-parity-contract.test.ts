import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_PLAN,
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_STATUS,
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import { GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING } from "./dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_T_OPENING_LEAK_COMPOSITE_SURFACE_PARITY_PLAN =
  "gate_t_personal_use_mvp_opening_leak_composite_surface_parity_plan";

const GATE_T_OPENING_LEAK_COMPOSITE_SURFACE_PARITY_STATUS =
  "gate_t_personal_use_mvp_opening_leak_composite_surface_parity_landed_selected_input_surface_gate_u";

const GATE_T_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION =
  "gate_u_personal_use_mvp_opening_leak_composite_input_surface_plan";

const GATE_T_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-u-opening-leak-composite-input-surface-contract.test.ts";

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_T = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: GATE_T_OPENING_LEAK_COMPOSITE_SURFACE_PARITY_PLAN,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_PLAN,
  previousSelectionStatus: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_T_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_T_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
  selectionStatus: GATE_T_OPENING_LEAK_COMPOSITE_SURFACE_PARITY_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_T_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-t-opening-leak-composite-surface-parity-contract.test.ts",
  "apps/web/features/workbench/opening-leak-composite-surface.ts",
  "apps/web/features/workbench/opening-leak-composite-surface-parity.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
  "apps/web/features/workbench/simple-workbench-method-dossier.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/dynamic-calc-branch.ts",
  "apps/web/features/workbench/target-output-status.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_T_HANDOFF.md",
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

const COMPLETE_OPENING_CONTEXT: AirborneContext = {
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

describe("Personal-Use MVP Coverage Sprint Gate T opening/leak composite surface parity", () => {
  it("lands Gate T as surface parity only and selects the first-class input surface next", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_T).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_t_personal_use_mvp_opening_leak_composite_surface_parity_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate:
        "gate_s_personal_use_mvp_opening_leak_composite_transmission_loss_runtime_corridor_plan",
      previousSelectionStatus:
        "gate_s_personal_use_mvp_opening_leak_composite_runtime_corridor_landed_selected_surface_parity_gate_t",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_u_personal_use_mvp_opening_leak_composite_input_surface_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-u-opening-leak-composite-input-surface-contract.test.ts",
      selectionStatus:
        "gate_t_personal_use_mvp_opening_leak_composite_surface_parity_landed_selected_input_surface_gate_u",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_T_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps Gate S runtime values unchanged while requiring visible surfaces to carry method, origin, budget, and unsupported outputs", () => {
    const result = calculateAssembly(HOST_WALL, {
      airborneContext: COMPLETE_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });

    expect(result.metrics.estimatedRwDb).toBe(38.2);
    expect(result.metrics.estimatedStc).toBe(39);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.warnings).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);
  });

  it("keeps docs and the current-gate runner aligned with Gate T closeout and Gate U selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain(GATE_T_OPENING_LEAK_COMPOSITE_SURFACE_PARITY_PLAN);
      expect(content).toContain(GATE_T_OPENING_LEAK_COMPOSITE_SURFACE_PARITY_STATUS);
      expect(content).toContain(GATE_T_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION);
      expect(content).toContain("opening/leak composite");
      expect(content).toContain("surface parity");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-t-opening-leak-composite-surface-parity-contract.test.ts"
    );
    expect(runner).toContain("opening-leak-composite-surface-parity.test.ts");
  });
});

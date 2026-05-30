import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE,
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTION_STATUS,
  POST_V1_GATE_BA_HEAVY_FLOATING_DYNAMIC_LOAD_INPUT,
  POST_V1_GATE_BA_HEAVY_FLOATING_MISSING_DYNAMIC_STIFFNESS_INPUT,
  POST_V1_GATE_BA_HEAVY_FLOATING_MISSING_LOAD_BASIS_INPUT,
  POST_V1_GATE_BA_LAB_IMPACT_OUTPUTS,
  summarizePostV1FloorDynamicStiffnessLoadBasisOwnerGateBA
} from "./post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-az";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BA_SURFACES = [
  "packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba.ts",
  "packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts",
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-az-contract.test.ts",
  "packages/engine/src/impact-estimate.ts",
  "packages/engine/src/impact-predictor-status.ts",
  "packages/shared/src/domain/impact-predictor-input.ts",
  "packages/shared/src/domain/input-completeness.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "docs/calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor dynamic stiffness/load basis owner Gate BA", () => {
  it("lands Gate BA as a no-runtime owner contract and selects lower-treatment Gate BB", () => {
    const summary = summarizePostV1FloorDynamicStiffnessLoadBasisOwnerGateBA();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_az_landed_no_runtime_selected_floor_dynamic_stiffness_load_basis_owner_gate_ba"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateAZ: {
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS
      },
      selectedNextAction: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTION_STATUS,
      sourceRowsRequiredForSelection: false
    });

    for (const path of REQUIRED_GATE_BA_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins dynamic stiffness and load basis as no-default physical owner fields", () => {
    const summary = summarizePostV1FloorDynamicStiffnessLoadBasisOwnerGateBA();

    expect(summary.physicalOwnerFields).toEqual([
      {
        defaultPolicy: "no_default",
        fieldId: "resilientLayerDynamicStiffnessMNm3",
        missingBehavior: "needs_input",
        ownerId: "floorImpactDynamicStiffnessOrProductCurveOwner",
        runtimeDefaultAllowed: false
      },
      {
        defaultPolicy: "no_default",
        fieldId: "loadBasisKgM2",
        missingBehavior: "needs_input",
        ownerId: "floorImpactLoadBasisOwner",
        runtimeDefaultAllowed: false
      }
    ]);
    expect(summary.companionOutputsDeferredToExistingAdapters).toEqual([
      "CI",
      "CI,50-2500",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
  });

  it("preserves the existing complete dynamic-stiffness/load-basis runtime without moving values", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: POST_V1_GATE_BA_HEAVY_FLOATING_DYNAMIC_LOAD_INPUT,
      targetOutputs: POST_V1_GATE_BA_LAB_IMPACT_OUTPUTS
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 25.8,
      LnW: 48.7,
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      floatingLoadSurfaceMassKgM2: 100,
      resilientDynamicStiffnessMNm3: 30
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impactPredictorStatus).toMatchObject({
      implementedFormulaEstimate: true,
      readyForPlannedSolver: true
    });
  });

  it("keeps missing dynamic stiffness and missing load basis from becoming guessed DeltaLw", () => {
    const missingDynamic = calculateImpactOnly([], {
      impactPredictorInput: POST_V1_GATE_BA_HEAVY_FLOATING_MISSING_DYNAMIC_STIFFNESS_INPUT,
      targetOutputs: POST_V1_GATE_BA_LAB_IMPACT_OUTPUTS
    });
    const missingLoad = calculateImpactOnly([], {
      impactPredictorInput: POST_V1_GATE_BA_HEAVY_FLOATING_MISSING_LOAD_BASIS_INPUT,
      targetOutputs: POST_V1_GATE_BA_LAB_IMPACT_OUTPUTS
    });

    expect(missingDynamic.impact).toMatchObject({
      LnW: 50,
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate"
    });
    expect(missingDynamic.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(missingDynamic.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(missingDynamic.impact?.DeltaLw).toBeUndefined();
    expect(missingDynamic.impactPredictorStatus?.readyForPlannedSolver).toBe(false);

    expect(missingLoad.impact).toMatchObject({
      LnW: 47,
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate"
    });
    expect(missingLoad.impact?.DeltaLw).toBeUndefined();
    expect(missingLoad.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(missingLoad.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(missingLoad.impactPredictorStatus?.readyForPlannedSolver).toBe(false);
  });

  it("keeps docs and current-gate runner aligned with Gate BA closeout and Gate BB selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("resilientLayerDynamicStiffnessMNm3");
      expect(contents, path).toContain("loadBasisKgM2");
      expect(contents, path).toContain("no-runtime");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts"
    );
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildPersonalUseMvpCoverageSprintGateBOContract,
  evaluateGateBOCompleteFormulaRuntime,
  evaluateGateBOIncompleteExplicitRuntime,
  evaluateGateBOVisibleDerivedNeedsInputRuntime,
  GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
  GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bo";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bn";
import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
} from "./heavy-concrete-combined-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BO_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo-reinforced-concrete-low-confidence-cleanup-contract.test.ts",
  "packages/engine/src/heavy-concrete-combined-impact-formula-corridor.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/calculate-impact-only.ts",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BO_REINFORCED_CONCRETE_LOW_CONFIDENCE_CLEANUP_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate BO reinforced-concrete low-confidence cleanup", () => {
  it("lands Gate BO and selects surface parity next", () => {
    expect(buildPersonalUseMvpCoverageSprintGateBOContract()).toEqual({
      apiShapeChange: false,
      exactSourceRowsRemainFirst: true,
      formulaBasis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_LANDED_GATE,
      lowConfidenceFinalAnswerRemoved: true,
      numericRuntimeBehaviorChange: true,
      previousGateBN: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTION_STATUS
      },
      requiredPhysicalInputs: [
        "baseSlabOrFloor",
        "resilientLayerDynamicStiffnessMNm3",
        "loadBasisKgM2",
        "ceilingOrLowerAssembly"
      ],
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bn_reinforced_concrete_low_confidence_cleanup",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      toleranceDb: {
        "DeltaLw": 5.5,
        "Ln,w": 6.5
      }
    });

    for (const path of REQUIRED_GATE_BO_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("blocks the old incomplete explicit predictor route instead of returning low-confidence values", () => {
    expect(evaluateGateBOIncompleteExplicitRuntime()).toEqual({
      basisId: null,
      errorBudgetDb: null,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      inputMode: "explicit_predictor_input",
      missingPhysicalInputs: ["loadBasisKgM2", "ceilingOrLowerAssembly"],
      origin: "needs_input",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"],
      valuePins: {
        "DeltaLw": null,
        "Ln,w": null
      },
      warningMentionsMissingInputs: true
    });
  });

  it("promotes complete reinforced-concrete owner input to the named formula corridor", () => {
    const runtime = evaluateGateBOCompleteFormulaRuntime();

    expect(runtime).toEqual({
      basisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      errorBudgetDb: 6.5,
      implementedFormulaEstimate: true,
      implementedLowConfidenceEstimate: false,
      inputMode: "explicit_predictor_input",
      missingPhysicalInputs: [],
      origin: "formula_corridor",
      supportedTargetOutputs: ["Ln,w", "DeltaLw"],
      unsupportedTargetOutputs: ["Rw", "Ctr"],
      valuePins: {
        "DeltaLw": 13.7,
        "Ln,w": 58.1
      },
      warningMentionsMissingInputs: false
    });

    const result = calculateImpactOnly([], {
      impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
      targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
    });
    expect(result.impact?.errorBudgets?.map((budget: ImpactErrorBudget) => [budget.metricId, budget.toleranceDb])).toEqual([
      ["Ln,w", 6.5],
      ["DeltaLw", 5.5]
    ]);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("keeps visible-derived reinforced concrete honest: airborne Rw/Ctr can remain, impact needs the physical owners", () => {
    expect(evaluateGateBOVisibleDerivedNeedsInputRuntime()).toEqual({
      basisId: null,
      errorBudgetDb: null,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      inputMode: "derived_from_visible_layers",
      missingPhysicalInputs: [
        "resilientLayerDynamicStiffnessMNm3",
        "loadBasisKgM2"
      ],
      origin: "needs_input",
      supportedTargetOutputs: ["Rw", "Ctr"],
      unsupportedTargetOutputs: ["Ln,w", "DeltaLw"],
      valuePins: {
        "DeltaLw": null,
        "Ln,w": null
      },
      warningMentionsMissingInputs: true
    });
  });

  it("leaves exact rows, bare heavy floors, and upper-only floating formulas on their existing lanes", () => {
    const exact = calculateImpactOnly([], {
      officialFloorSystemId: "pliteq_hcp200_vinyl_lab_2026",
      targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
    });
    expect(exact.impact?.basis).toBe("official_floor_system_exact_match");
    expect(exact.impact?.LnW).toBe(48);
    expect(exact.floorSystemRatings?.Rw).toBe(62);
    expect(exact.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);

    const bare = calculateAssembly(
      [{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }] as never,
      { targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS }
    );
    expect(bare.impact?.basis).toBe("predictor_heavy_bare_floor_iso12354_annexc_estimate");
    expect(bare.impact?.LnW).toBe(71.8);
    expect(bare.supportedTargetOutputs).toEqual(["Rw", "Ctr", "Ln,w"]);

    const floating = calculateImpactOnly([], {
      impactPredictorInput: {
        baseSlab: { densityKgM3: 2400, materialClass: "heavy_concrete", thicknessMm: 180 },
        floorCovering: { densityKgM3: 1400, materialClass: "vinyl_flooring", mode: "material_layer", thicknessMm: 3 },
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        resilientLayer: { dynamicStiffnessMNm3: 35, thicknessMm: 8 },
        structuralSupportType: "reinforced_concrete"
      } as never,
      targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
    });
    expect(floating.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(floating.impact?.LnW).toBe(64.8);
    expect(floating.impact?.DeltaLw).toBe(7);
  });

  it("updates docs and the current-gate runner to make Gate BP the next clean step", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_LANDED_GATE);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTION_STATUS);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_ACTION);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_FILE);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-bo-reinforced-concrete-low-confidence-cleanup-contract.test.ts"
    );
  });
});

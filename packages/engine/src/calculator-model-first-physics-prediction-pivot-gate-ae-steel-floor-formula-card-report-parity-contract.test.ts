import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  getImpactValidationFamilyRegimeById,
  getImpactValidationModeRegimeById,
  IMPACT_VALIDATION_CORPUS_SUMMARY
} from "./impact-validation-regime";
import { buildGateAESteelFloorFormulaCardReportParityContract } from "./steel-floor-formula-card-report-parity";
import { STEEL_FLOOR_FORMULA_BASIS } from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_AE = buildGateAESteelFloorFormulaCardReportParityContract();

const REQUIRED_GATE_AE_SURFACES = [
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts",
  "packages/engine/src/steel-floor-formula-card-report-parity.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/impact-support.ts",
  "packages/engine/src/impact-validation-regime.ts",
  "apps/web/features/workbench/steel-floor-formula-corridor-view.ts",
  "apps/web/features/workbench/impact-lane-view.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/validation-regime.ts",
  "apps/web/features/workbench/steel-floor-formula-card-report-parity.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AE_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AE_HANDOFF.md"
] as const;

const TARGET_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const COMPLETE_OPEN_WEB_STEEL_INPUT = {
  baseSlab: {
    materialClass: "lightweight_steel_carrier",
    thicknessMm: 200
  },
  carrierSpacingMm: 600,
  floatingScreed: {
    densityKgM3: 1250,
    materialClass: "cement_board",
    thicknessMm: 18
  },
  floorCovering: {
    materialClass: "ceramic_tile",
    mode: "material_layer",
    thicknessMm: 10
  },
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 64,
  lowerTreatment: {
    boardLayerCount: 1,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: 12.5,
    cavityDepthMm: 200,
    cavityFillThicknessMm: 100,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 35,
    thicknessMm: 4.5
  },
  structuralSupportType: "steel_joists",
  supportForm: "open_web_or_rolled"
} as const satisfies ImpactPredictorInput;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate AE", () => {
  it("lands steel-floor formula card/report parity and selects Gate AF input surface work", () => {
    expect(MODEL_FIRST_GATE_AE).toMatchObject({
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      landedGate: "gate_ae_steel_floor_formula_card_and_report_parity_plan",
      previousLandedGate: "gate_ad_steel_floor_impact_formula_numeric_corridor_plan",
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_af_steel_floor_formula_input_surface_plan",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts",
      selectionStatus: "gate_ae_steel_formula_card_report_parity_landed_selected_input_surface_gate_af",
      sourceRowsRequiredForRuntimeSelection: false,
      tolerance: {
        DeltaLwDb: 2,
        LnWDb: 4.5
      }
    });

    expect(MODEL_FIRST_GATE_AE.cardOutputs).toEqual(["Ln,w", "DeltaLw"]);

    for (const path of REQUIRED_GATE_AE_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("carries the steel formula basis through dynamic trace and impact-support formula notes", () => {
    const runtime = calculateImpactOnly([], {
      impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(runtime.impact).toMatchObject({
      basis: STEEL_FLOOR_FORMULA_BASIS,
      DeltaLw: 22.4,
      LnW: 55.6,
      labOrField: "lab",
      scope: "steel_floor_formula_corridor"
    });
    expect(runtime.dynamicImpactTrace).toMatchObject({
      candidateRowCount: 1,
      detectedSupportFamily: "steel_joists",
      evidenceTier: "estimate",
      impactBasisLabel: "Lightweight-steel formula corridor",
      selectedLabel: "Lightweight-steel formula corridor",
      selectionKind: "formula_estimate",
      selectionKindLabel: "Scoped formula estimate",
      supportFormLabel: "Open-web or rolled",
      systemTypeLabel: "Combined upper and lower system"
    });
    expect(runtime.impactSupport?.notes).toContain(
      "Steel-floor formula corridor is active; exact measured rows still outrank it when a source truly matches."
    );
    expect(runtime.impactSupport?.formulaNotes).toEqual([
      "Gate AD steel-floor mass-spring formula corridor remains a source-absent lab estimate, not a measured row.",
      "Steel DeltaLw uses 13 log10(m'load) - 14.2 log10(s') + 20.8 before steel carrier-transfer correction.",
      "Gate AN error budgets are structured: Ln,w 55.6 dB [51.1..60.1] +/-4.5 dB; DeltaLw 22.4 dB [20.4..24.4] +/-2 dB; origin source_absent_formula_error_budget; not measured evidence.",
      "Corridor tolerance remains +/-4.5 dB for Ln,w and +/-2 dB for DeltaLw."
    ]);
    expect(runtime.impactPredictorStatus).toMatchObject({
      implementedFormulaEstimate: true,
      implementedLowConfidenceEstimate: false
    });
  });

  it("adds a dedicated steel formula validation mode instead of hiding inside broad family estimates", () => {
    const mode = getImpactValidationModeRegimeById("steel_formula_corridor_estimate");
    const family = getImpactValidationFamilyRegimeById("lightweight_steel");

    expect(mode).toMatchObject({
      caseCount: 1,
      id: "steel_formula_corridor_estimate",
      label: "Lightweight-steel formula corridor",
      posture: "estimate"
    });
    expect(mode?.note).toContain("explicit carrier geometry, load mass, dynamic stiffness, and lower isolation inputs");
    expect(family).toMatchObject({
      fieldCoverage: "bound",
      floorCoverage: "estimate",
      maxToleranceDb: 4.5
    });
    expect(family?.modeDistribution).toContainEqual({ caseCount: 1, id: "steel_formula_corridor_estimate" });
    expect(IMPACT_VALIDATION_CORPUS_SUMMARY.toleranceBandMaxDb).toBe(4.5);
  });

  it("keeps current docs and runner pointed at Gate AE after landing", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain("gate_ae_steel_floor_formula_card_and_report_parity_plan");
      expect(content).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts"
      );
      expect(content).toContain("gate_af_steel_floor_formula_input_surface_plan");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts"
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "features/workbench/steel-floor-formula-card-report-parity.test.ts"
    );
  });
});

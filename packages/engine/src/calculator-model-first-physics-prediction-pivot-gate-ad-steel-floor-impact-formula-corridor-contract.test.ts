import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildGateADSteelFloorImpactFormulaCorridorContract,
  buildGateADSteelFloorImpactFormulaScenarioPack
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_AD = {
  apiShapeChange: true,
  evidencePromotion: false,
  landedGate: "gate_ad_steel_floor_impact_formula_numeric_corridor_plan",
  numericRuntimeBehaviorChange: true,
  outputCardStatusChange: false,
  outputSupportChange: true,
  previousLandedGate: "gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan",
  proposalReportCopyChange: false,
  routeCardValueChange: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_ae_steel_floor_formula_card_and_report_parity_plan",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts",
  selectionStatus:
    "gate_ad_steel_floor_impact_formula_corridor_landed_selected_card_report_parity_gate_ae",
  sourceRowsRequiredForRuntimeSelection: false
} as const;

const REQUIRED_GATE_AD_SURFACES = [
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts",
  "packages/engine/src/steel-floor-impact-formula-corridor.ts",
  "packages/engine/src/impact-estimate.ts",
  "packages/shared/src/domain/impact.ts",
  "packages/engine/src/impact-confidence.ts",
  "packages/engine/src/impact-predictor-status.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AD_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AD_HANDOFF.md"
] as const;

const TARGET_OUTPUTS = ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

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

describe("calculator model-first physics prediction pivot Gate AD", () => {
  it("lands the steel-floor impact formula corridor and selects Gate AE", () => {
    expect(MODEL_FIRST_GATE_AD).toEqual({
      apiShapeChange: true,
      evidencePromotion: false,
      landedGate: "gate_ad_steel_floor_impact_formula_numeric_corridor_plan",
      numericRuntimeBehaviorChange: true,
      outputCardStatusChange: false,
      outputSupportChange: true,
      previousLandedGate: "gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan",
      proposalReportCopyChange: false,
      routeCardValueChange: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ae_steel_floor_formula_card_and_report_parity_plan",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts",
      selectionStatus:
        "gate_ad_steel_floor_impact_formula_corridor_landed_selected_card_report_parity_gate_ae",
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_AD_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("moves complete source-absent steel predictor input from family blend to formula-backed Ln,w and DeltaLw", () => {
    const contract = buildGateADSteelFloorImpactFormulaCorridorContract({
      impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
      targetOutputs: TARGET_OUTPUTS
    });
    const runtime = calculateImpactOnly([], {
      impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw"] satisfies RequestedOutputId[]
    });

    expect(contract.status).toBe("formula_corridor_ready");
    expect(contract.sourceRowsRequiredForRuntimeSelection).toBe(false);
    expect(contract.impact).toMatchObject({
      basis: "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate",
      DeltaLw: 22.4,
      LnW: 55.6,
      labOrField: "lab",
      scope: "steel_floor_formula_corridor"
    });
    expect(contract.corridor).toEqual({
      DeltaLw: { estimate: 22.4, max: 24.4, min: 20.4, toleranceDb: 2 },
      LnW: { estimate: 55.6, max: 60.1, min: 51.1, toleranceDb: 4.5 }
    });
    expect(contract.basisBoundaries).toEqual([
      "lab_element_impact_Ln_w_DeltaLw",
      "field_impact_Lprime_nw_Lprime_nT_w_requires_Gate_Z_context"
    ]);

    expect(runtime.floorSystemEstimate).toBeNull();
    expect(runtime.impact?.basis).toBe("predictor_lightweight_steel_mass_spring_holdout_corridor_estimate");
    expect(runtime.impact?.LnW).toBe(55.6);
    expect(runtime.impact?.DeltaLw).toBe(22.4);
    expect(runtime.impactPredictorStatus).toMatchObject({
      implementedFamilyEstimate: false,
      implementedFormulaEstimate: true,
      implementedLowConfidenceEstimate: false
    });
    expect(runtime.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(runtime.unsupportedImpactOutputs).toEqual([]);
  });

  it("does not fall through to broad steel-family blending when formula-critical inputs are missing", () => {
    const contract = buildGateADSteelFloorImpactFormulaCorridorContract({
      impactPredictorInput: {
        ...COMPLETE_OPEN_WEB_STEEL_INPUT,
        carrierSpacingMm: undefined
      },
      targetOutputs: TARGET_OUTPUTS
    });
    const runtime = calculateImpactOnly([], {
      impactPredictorInput: {
        ...COMPLETE_OPEN_WEB_STEEL_INPUT,
        carrierSpacingMm: undefined
      },
      targetOutputs: ["Ln,w", "DeltaLw"] satisfies RequestedOutputId[]
    });

    expect(contract.status).toBe("needs_input");
    expect(contract.missingPhysicalInputs).toEqual(["steelCarrierSpacingMm"]);
    expect(contract.impact).toBeNull();
    expect(runtime.impact).toBeNull();
    expect(runtime.floorSystemEstimate).toBeNull();
    expect(runtime.impactPredictorStatus?.implementedFamilyEstimate).toBe(false);
    expect(runtime.impactPredictorStatus?.implementedFormulaEstimate).toBe(false);
    expect(runtime.unsupportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("keeps exact measured source rows above the formula corridor", () => {
    const runtime = calculateImpactOnly([], {
      officialFloorSystemId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      targetOutputs: ["Ln,w", "DeltaLw"] satisfies RequestedOutputId[]
    });

    expect(runtime.sourceMode).toBe("official_floor_system");
    expect(runtime.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(runtime.impact?.basis).toBe("official_floor_system_exact_match");
    expect(runtime.impact?.LnW).toBe(51);
    expect(runtime.impact?.DeltaLw).toBeUndefined();
    expect(runtime.impactPredictorStatus?.implementedFormulaEstimate).toBe(false);
  });

  it("benchmarks the numeric corridor against same-family holdouts without requiring source rows for new combinations", () => {
    const scenarioPack = buildGateADSteelFloorImpactFormulaScenarioPack();

    expect(scenarioPack.map((scenario) => scenario.id)).toEqual([
      "gate_ad_complete_open_web_steel_formula_runtime",
      "gate_ad_pliteq_steel_joist_vinyl_holdout",
      "gate_ad_pliteq_steel_joist_porcelain_holdout",
      "gate_ad_missing_carrier_spacing_blocks_family_blend",
      "gate_ad_exact_source_stays_precedence"
    ]);
    expect(scenarioPack.map((scenario) => scenario.contract.status)).toEqual([
      "formula_corridor_ready",
      "formula_corridor_ready",
      "formula_corridor_ready",
      "needs_input",
      "exact_source_precedence"
    ]);

    const holdoutComparisons = scenarioPack.flatMap((scenario) => scenario.contract.holdoutComparisons);

    expect(holdoutComparisons.map((comparison) => comparison.sourceId)).toEqual([
      "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
      "pliteq_steel_joist_250_rst12_porcelain_lab_2026"
    ]);
    expect(holdoutComparisons.every((comparison) => comparison.withinCorridor)).toBe(true);
    expect(Math.max(...holdoutComparisons.map((comparison) => comparison.absoluteErrorDb))).toBeLessThanOrEqual(2.5);
  });

  it("keeps current docs and runner pointed at Gate AD after landing", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain("gate_ad_steel_floor_impact_formula_numeric_corridor_plan");
      expect(content).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts"
      );
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts"
    );
  });
});

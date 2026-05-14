import type {
  AcousticInputFieldId,
  ImpactCalculation,
  ImpactPredictorInput,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bn";
import {
  collectHeavyConcreteCombinedImpactFormulaMissingPhysicalInputs,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_REQUIRED_FIELDS
} from "./heavy-concrete-combined-impact-formula-corridor";
import {
  maybeBuildImpactPredictorInputFromLayerStack
} from "./impact-predictor-input";
import { getDefaultMaterialCatalog } from "./material-catalog";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_LANDED_GATE =
  "gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTION_STATUS =
  "gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_landed_selected_surface_parity_gate_bp";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_ACTION =
  "gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bp-reinforced-concrete-cleanup-surface-parity-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_LABEL =
  "reinforced-concrete cleanup surface parity";

export const GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS = [
  "Rw",
  "Ctr",
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const GATE_BO_REINFORCED_CONCRETE_INCOMPLETE_INPUT = {
  baseSlab: { densityKgM3: 2400, materialClass: "heavy_concrete", thicknessMm: 180 },
  floorCovering: { densityKgM3: 1400, materialClass: "vinyl_flooring", mode: "material_layer", thicknessMm: 3 },
  impactSystemType: "combined_upper_lower_system",
  lowerTreatment: {
    boardLayerCount: 2,
    boardThicknessMm: 16,
    cavityDepthMm: 120,
    cavityFillThicknessMm: 100,
    type: "suspended_ceiling_elastic_hanger"
  },
  resilientLayer: { dynamicStiffnessMNm3: 35, thicknessMm: 8 },
  structuralSupportType: "reinforced_concrete"
} as const satisfies ImpactPredictorInput;

export const GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT = {
  ...GATE_BO_REINFORCED_CONCRETE_INCOMPLETE_INPUT,
  loadBasisKgM2: 4.2,
  lowerTreatment: {
    ...GATE_BO_REINFORCED_CONCRETE_INCOMPLETE_INPUT.lowerTreatment,
    supportClass: "furred_channels"
  }
} as const satisfies ImpactPredictorInput;

export const GATE_BO_REINFORCED_CONCRETE_VISIBLE_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
] as const satisfies readonly LayerInput[];

export type GateBOReinforcedConcreteRuntimeSnapshot = {
  basisId: string | null;
  errorBudgetDb: number | null;
  implementedFormulaEstimate: boolean;
  implementedLowConfidenceEstimate: boolean;
  inputMode: string | null;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  origin: "formula_corridor" | "needs_input";
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
  valuePins: Readonly<Record<"DeltaLw" | "Ln,w", number | null>>;
  warningMentionsMissingInputs: boolean;
};

export type GateBOReinforcedConcreteCleanupContract = {
  apiShapeChange: false;
  exactSourceRowsRemainFirst: true;
  formulaBasis: typeof HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_LANDED_GATE;
  lowConfidenceFinalAnswerRemoved: true;
  numericRuntimeBehaviorChange: true;
  previousGateBN: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTION_STATUS;
  };
  requiredPhysicalInputs: typeof HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_REQUIRED_FIELDS;
  selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_bn_reinforced_concrete_low_confidence_cleanup";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  toleranceDb: Readonly<Record<"DeltaLw" | "Ln,w", number>>;
};

function impactBudgetTolerance(impact: ImpactCalculation | null | undefined, metricId: "DeltaLw" | "Ln,w"): number | null {
  return impact?.errorBudgets?.find((budget) => budget.metricId === metricId)?.toleranceDb ?? null;
}

function hasMissingInputWarning(warnings: readonly string[] | undefined): boolean {
  return Boolean(warnings?.some((warning) =>
    /reinforced-concrete combined upper\/lower impact runtime is waiting/i.test(warning)
  ));
}

function valuePins(impact: ImpactCalculation | null | undefined): GateBOReinforcedConcreteRuntimeSnapshot["valuePins"] {
  return {
    "DeltaLw": impact?.DeltaLw ?? null,
    "Ln,w": impact?.LnW ?? null
  };
}

export function buildPersonalUseMvpCoverageSprintGateBOContract(): GateBOReinforcedConcreteCleanupContract {
  return {
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
    requiredPhysicalInputs: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_REQUIRED_FIELDS,
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bn_reinforced_concrete_low_confidence_cleanup",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    toleranceDb: {
      "DeltaLw": HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
      "Ln,w": HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB
    }
  };
}

export function evaluateGateBOIncompleteExplicitRuntime(): GateBOReinforcedConcreteRuntimeSnapshot {
  const result = calculateImpactOnly([], {
    impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_INCOMPLETE_INPUT,
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });

  return {
    basisId: result.impact?.basis ?? null,
    errorBudgetDb: null,
    implementedFormulaEstimate: result.impactPredictorStatus?.implementedFormulaEstimate ?? false,
    implementedLowConfidenceEstimate: result.impactPredictorStatus?.implementedLowConfidenceEstimate ?? false,
    inputMode: result.impactPredictorStatus?.inputMode ?? null,
    missingPhysicalInputs: collectHeavyConcreteCombinedImpactFormulaMissingPhysicalInputs(
      GATE_BO_REINFORCED_CONCRETE_INCOMPLETE_INPUT
    ),
    origin: "needs_input",
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    valuePins: valuePins(result.impact),
    warningMentionsMissingInputs: hasMissingInputWarning(result.warnings)
  };
}

export function evaluateGateBOCompleteFormulaRuntime(): GateBOReinforcedConcreteRuntimeSnapshot {
  const result = calculateImpactOnly([], {
    impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });

  return {
    basisId: result.impact?.basis ?? null,
    errorBudgetDb: impactBudgetTolerance(result.impact, "Ln,w"),
    implementedFormulaEstimate: result.impactPredictorStatus?.implementedFormulaEstimate ?? false,
    implementedLowConfidenceEstimate: result.impactPredictorStatus?.implementedLowConfidenceEstimate ?? false,
    inputMode: result.impactPredictorStatus?.inputMode ?? null,
    missingPhysicalInputs: collectHeavyConcreteCombinedImpactFormulaMissingPhysicalInputs(
      GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT
    ),
    origin: "formula_corridor",
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    valuePins: valuePins(result.impact),
    warningMentionsMissingInputs: hasMissingInputWarning(result.warnings)
  };
}

export function evaluateGateBOVisibleDerivedNeedsInputRuntime(): GateBOReinforcedConcreteRuntimeSnapshot {
  const predictorInput = maybeBuildImpactPredictorInputFromLayerStack(
    GATE_BO_REINFORCED_CONCRETE_VISIBLE_STACK,
    {},
    undefined,
    getDefaultMaterialCatalog()
  );
  const result = calculateAssembly(GATE_BO_REINFORCED_CONCRETE_VISIBLE_STACK, {
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });

  return {
    basisId: result.impact?.basis ?? null,
    errorBudgetDb: null,
    implementedFormulaEstimate: result.impactPredictorStatus?.implementedFormulaEstimate ?? false,
    implementedLowConfidenceEstimate: result.impactPredictorStatus?.implementedLowConfidenceEstimate ?? false,
    inputMode: result.impactPredictorStatus?.inputMode ?? null,
    missingPhysicalInputs: collectHeavyConcreteCombinedImpactFormulaMissingPhysicalInputs(predictorInput),
    origin: "needs_input",
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    valuePins: valuePins(result.impact),
    warningMentionsMissingInputs: hasMissingInputWarning(result.warnings)
  };
}

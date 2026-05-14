import type {
  AcousticInputFieldId,
  ImpactCalculation,
  ImpactPredictorInput,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bk";
import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  type SteelFloorFormulaInputSurface,
  type SteelFloorFormulaInputSurfaceBasis,
  type SteelFloorFormulaInputSurfaceStatus
} from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_LANDED_GATE =
  "gate_bl_personal_use_mvp_steel_floor_suspended_ceiling_input_surface_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTION_STATUS =
  "gate_bl_personal_use_mvp_steel_floor_suspended_ceiling_input_surface_landed_selected_post_input_surface_revalidation_gate_bm";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_ACTION =
  "gate_bm_personal_use_mvp_post_steel_suspended_ceiling_input_surface_revalidation_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bm-post-steel-suspended-ceiling-input-surface-revalidation-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_LABEL =
  "post steel suspended-ceiling input surface revalidation";

export const GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "IIC",
  "AIIC",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS = [
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 120 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
] as const satisfies readonly LayerInput[];

export const GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE = {
  lowerCeilingIsolationSupportForm: "elastic_furred_channels",
  steelCarrierDepthMm: 250,
  steelCarrierSpacingMm: 600,
  steelSupportForm: "joist_or_purlin"
} as const satisfies SteelFloorFormulaInputSurface;

export const GATE_BL_PARTIAL_STEEL_SUSPENDED_CEILING_SURFACE = {
  lowerCeilingIsolationSupportForm: undefined,
  steelCarrierDepthMm: 250,
  steelCarrierSpacingMm: undefined,
  steelSupportForm: "joist_or_purlin"
} as const satisfies SteelFloorFormulaInputSurface;

export type PersonalUseMvpCoverageSprintGateBLSurfaceScenario = {
  formulaBasis: SteelFloorFormulaInputSurfaceBasis;
  id: string;
  impactSystemType: ImpactPredictorInput["impactSystemType"] | null;
  lowConfidenceFallbackActive: boolean;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  status: SteelFloorFormulaInputSurfaceStatus | "exact_source_precedence";
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
  valuePins: readonly {
    metric: RequestedOutputId;
    value: number;
  }[];
};

export type PersonalUseMvpCoverageSprintGateBLContract = {
  completeSurfaceValueRetune: false;
  exactMeasuredRowsRemainPrecedence: true;
  fieldBuildingAndAstmAliasesRemainBlocked: true;
  firstClassSurfaceFields: readonly AcousticInputFieldId[];
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_LANDED_GATE;
  previousGateBK: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_FILE;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTION_STATUS;
  };
  scenarioPack: readonly PersonalUseMvpCoverageSprintGateBLSurfaceScenario[];
  selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_bk_steel_suspended_ceiling_input_surface";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTION_STATUS;
  suspendedCeilingFormulaBasis: typeof STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS;
  suspendedCeilingLnWToleranceDb: typeof STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB;
  upperLowerFormulaBasisFrozen: typeof STEEL_FLOOR_FORMULA_BASIS;
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function valuePinsFromImpact(impact: ImpactCalculation | null | undefined): PersonalUseMvpCoverageSprintGateBLSurfaceScenario["valuePins"] {
  return typeof impact?.LnW === "number"
    ? [{ metric: "Ln,w", value: round1(impact.LnW) }]
    : [];
}

function scenarioFromSurface(input: {
  id: string;
  layers: readonly LayerInput[];
  surface: SteelFloorFormulaInputSurface;
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageSprintGateBLSurfaceScenario {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface(input);
  const result = calculateAssembly(input.layers, {
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs: input.targetOutputs
  });

  return {
    formulaBasis: surface.formulaBasis,
    id: input.id,
    impactSystemType: surface.impactPredictorInput?.impactSystemType ?? null,
    lowConfidenceFallbackActive: result.floorSystemEstimate?.kind === "low_confidence",
    missingPhysicalInputs: surface.missingPhysicalInputs,
    status: surface.status,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    valuePins: valuePinsFromImpact(result.impact)
  };
}

export function buildPersonalUseMvpCoverageSprintGateBLScenarioPack(): readonly PersonalUseMvpCoverageSprintGateBLSurfaceScenario[] {
  return [
    scenarioFromSurface({
      id: "gate_bl_complete_ui_steel_suspended_ceiling_formula_corridor",
      layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    }),
    scenarioFromSurface({
      id: "gate_bl_partial_ui_steel_suspended_ceiling_needs_input",
      layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      surface: GATE_BL_PARTIAL_STEEL_SUSPENDED_CEILING_SURFACE,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    })
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBLContract(): PersonalUseMvpCoverageSprintGateBLContract {
  return {
    completeSurfaceValueRetune: false,
    exactMeasuredRowsRemainPrecedence: true,
    fieldBuildingAndAstmAliasesRemainBlocked: true,
    firstClassSurfaceFields: [
      "steelSupportForm",
      "steelCarrierDepthMm",
      "steelCarrierSpacingMm",
      "lowerCeilingIsolationSupportForm"
    ],
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_LANDED_GATE,
    previousGateBK: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTION_STATUS
    },
    scenarioPack: buildPersonalUseMvpCoverageSprintGateBLScenarioPack(),
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bk_steel_suspended_ceiling_input_surface",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTION_STATUS,
    suspendedCeilingFormulaBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
    suspendedCeilingLnWToleranceDb: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB,
    upperLowerFormulaBasisFrozen: STEEL_FLOOR_FORMULA_BASIS
  };
}

export function gateBLCompleteSurfaceMatchesGateBKPredictorInput(
  input: ImpactPredictorInput | null
): boolean {
  return Boolean(
    input &&
      input.impactSystemType === GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT.impactSystemType &&
      input.structuralSupportType === GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT.structuralSupportType &&
      input.supportForm === GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT.supportForm &&
      input.baseSlab?.thicknessMm === GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT.baseSlab.thicknessMm &&
      input.carrierSpacingMm === GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT.carrierSpacingMm &&
      input.lowerTreatment?.type === GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT.lowerTreatment.type &&
      input.lowerTreatment?.supportClass === GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT.lowerTreatment.supportClass &&
      input.lowerTreatment?.boardLayerCount === GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT.lowerTreatment.boardLayerCount &&
      input.lowerTreatment?.boardThicknessMm === GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT.lowerTreatment.boardThicknessMm &&
      input.lowerTreatment?.cavityDepthMm === GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT.lowerTreatment.cavityDepthMm &&
      input.lowerTreatment?.cavityFillThicknessMm === GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT.lowerTreatment.cavityFillThicknessMm
  );
}

import type {
  AcousticInputFieldId,
  ImpactCalculation,
  ImpactPredictorInput,
  ImpactPredictorLowerTreatmentSupportClass,
  ImpactPredictorLowerTreatmentType,
  ImpactPredictorSupportForm,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";
import {
  ImpactPredictorInputSchema,
  LayerInputSchema
} from "@dynecho/shared";

import {
  maybeBuildImpactPredictorInputFromLayerStack
} from "./impact-predictor-input";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  estimateSteelFloorImpactFromPredictorInput,
  STEEL_FLOOR_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";

export type SteelFloorLowerCeilingIsolationSupportForm =
  | "direct_to_joists"
  | "elastic_furred_channels"
  | "rigid_furred_channels";

export type SteelFloorFormulaInputSurface = {
  loadBasisKgM2?: number;
  lowerCeilingIsolationSupportForm?: SteelFloorLowerCeilingIsolationSupportForm;
  resilientLayerDynamicStiffnessMNm3?: number;
  steelCarrierDepthMm?: number;
  steelCarrierSpacingMm?: number;
  steelSupportForm?: ImpactPredictorSupportForm;
};

export type SteelFloorFormulaInputSurfaceStatus =
  | "inactive"
  | "needs_input"
  | "ready_for_formula_corridor"
  | "unsafe_topology";

export type SteelFloorFormulaInputSurfaceResult = {
  formulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  formulaTargetOutputRequested: boolean;
  impactPredictorInput: ImpactPredictorInput | null;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  status: SteelFloorFormulaInputSurfaceStatus;
  steelFloorStackDetected: boolean;
};

export type GateAFSteelFloorFormulaInputSurfaceContractInput = {
  catalog?: readonly MaterialDefinition[];
  exactSourceRowAvailable?: boolean;
  layers: readonly LayerInput[];
  surface?: SteelFloorFormulaInputSurface;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateAFSteelFloorFormulaInputSurfaceContract = {
  exactMeasuredRowsRemainPrecedence: true;
  formulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  landedGate: "gate_af_steel_floor_formula_input_surface_plan";
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  previousLandedGate: "gate_ae_steel_floor_formula_card_and_report_parity_plan";
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  runtimeFormulaImpact: ImpactCalculation | null;
  runtimeValueMovement: boolean;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts";
  selectionStatus: "gate_af_steel_floor_formula_input_surface_landed_selected_acceptance_revalidation_gate_ag";
  sourceRowsRequiredForRuntimeSelection: false;
  status: SteelFloorFormulaInputSurfaceStatus | "exact_source_precedence";
  surfaceResult: SteelFloorFormulaInputSurfaceResult;
  targetOutputs: readonly RequestedOutputId[];
};

export const STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS = [
  "steelSupportForm",
  "steelCarrierDepthMm",
  "steelCarrierSpacingMm",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2",
  "lowerCeilingIsolationSupportForm"
] as const satisfies readonly AcousticInputFieldId[];

const STEEL_FLOOR_BASE_MATERIAL_IDS = new Set([
  "lightweight_steel_floor",
  "open_web_steel_floor",
  "open_web_steel_joist",
  "steel_joist_floor"
]);

const STEEL_FLOOR_FORMULA_TARGET_OUTPUTS = new Set<RequestedOutputId>([
  "DeltaLw",
  "Ln,w",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
]);

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function normalizeLayers(layers: readonly LayerInput[]): LayerInput[] {
  return layers.map((layer) => LayerInputSchema.parse(layer));
}

export function hasSteelFloorFormulaInputSurfaceRoute(input: {
  layers: readonly LayerInput[];
  targetOutputs?: readonly RequestedOutputId[];
}): boolean {
  const formulaTargetOutputRequested =
    !input.targetOutputs || input.targetOutputs.length === 0 ||
    input.targetOutputs.some((output) => STEEL_FLOOR_FORMULA_TARGET_OUTPUTS.has(output));

  return (
    formulaTargetOutputRequested &&
    input.layers.some(
      (layer) =>
        layer.floorRole === "base_structure" &&
        STEEL_FLOOR_BASE_MATERIAL_IDS.has(layer.materialId)
    )
  );
}

function lowerTreatmentPatch(
  supportForm: SteelFloorLowerCeilingIsolationSupportForm | undefined
): Pick<NonNullable<ImpactPredictorInput["lowerTreatment"]>, "supportClass" | "type"> | undefined {
  const map: Record<
    SteelFloorLowerCeilingIsolationSupportForm,
    {
      supportClass: ImpactPredictorLowerTreatmentSupportClass;
      type: ImpactPredictorLowerTreatmentType;
    }
  > = {
    direct_to_joists: {
      supportClass: "direct_to_joists",
      type: "direct_fixed_ceiling"
    },
    elastic_furred_channels: {
      supportClass: "furred_channels",
      type: "suspended_ceiling_elastic_hanger"
    },
    rigid_furred_channels: {
      supportClass: "furred_channels",
      type: "suspended_ceiling_rigid_hanger"
    }
  };

  return supportForm ? map[supportForm] : undefined;
}

function buildExplicitPredictorSeed(
  surface: SteelFloorFormulaInputSurface | undefined
): ImpactPredictorInput {
  const lowerTreatment = lowerTreatmentPatch(surface?.lowerCeilingIsolationSupportForm);

  return ImpactPredictorInputSchema.parse({
    baseSlab: hasPositiveNumber(surface?.steelCarrierDepthMm)
      ? {
          materialClass: "lightweight_steel_carrier",
          thicknessMm: surface?.steelCarrierDepthMm
        }
      : undefined,
    carrierSpacingMm: surface?.steelCarrierSpacingMm,
    impactSystemType: "combined_upper_lower_system",
    loadBasisKgM2: surface?.loadBasisKgM2,
    lowerTreatment,
    resilientLayer: hasPositiveNumber(surface?.resilientLayerDynamicStiffnessMNm3)
      ? {
          dynamicStiffnessMNm3: surface?.resilientLayerDynamicStiffnessMNm3
        }
      : undefined,
    structuralSupportType: "steel_joists",
    supportForm: surface?.steelSupportForm
  });
}

function buildFallbackSteelPredictorInput(input: {
  layers: readonly LayerInput[];
  seed: ImpactPredictorInput;
}): ImpactPredictorInput | null {
  const baseLayers = input.layers.filter(
    (layer) => layer.floorRole === "base_structure" && STEEL_FLOOR_BASE_MATERIAL_IDS.has(layer.materialId)
  );
  const baseLayer = baseLayers[0];

  if (!baseLayer || baseLayers.length !== 1) {
    return null;
  }

  return ImpactPredictorInputSchema.parse({
    ...input.seed,
    baseSlab: {
      thicknessMm: baseLayer.thicknessMm,
      ...input.seed.baseSlab
    },
    structuralSupportType: "steel_joists"
  });
}

function collectMissingPhysicalInputs(input: ImpactPredictorInput | null): AcousticInputFieldId[] {
  if (!input || input.structuralSupportType !== "steel_joists") {
    return [];
  }

  const missing: AcousticInputFieldId[] = [];
  const lower = input.lowerTreatment;

  if (!input.supportForm) {
    missing.push("steelSupportForm");
  }

  if (!hasPositiveNumber(input.baseSlab?.thicknessMm)) {
    missing.push("steelCarrierDepthMm");
  }

  if (!hasPositiveNumber(input.carrierSpacingMm)) {
    missing.push("steelCarrierSpacingMm");
  }

  if (!hasPositiveNumber(input.resilientLayer?.dynamicStiffnessMNm3)) {
    missing.push("resilientLayerDynamicStiffnessMNm3");
  }

  if (!hasPositiveNumber(input.loadBasisKgM2)) {
    missing.push("loadBasisKgM2");
  }

  if (
    !lower ||
    lower.type === "none" ||
    !lower.supportClass ||
    !hasPositiveNumber(lower.cavityDepthMm) ||
    (
      !hasPositiveNumber(lower.boardThicknessMm) &&
      !(Array.isArray(lower.boardThicknessScheduleMm) && lower.boardThicknessScheduleMm.length > 0)
    )
  ) {
    missing.push("lowerCeilingIsolationSupportForm");
  }

  return missing;
}

export function buildSteelFloorFormulaPredictorInputFromSurface(input: {
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  surface?: SteelFloorFormulaInputSurface;
  targetOutputs?: readonly RequestedOutputId[];
}): SteelFloorFormulaInputSurfaceResult {
  const layers = normalizeLayers(input.layers);
  const formulaTargetOutputRequested =
    !input.targetOutputs || input.targetOutputs.length === 0 ||
    input.targetOutputs.some((output) => STEEL_FLOOR_FORMULA_TARGET_OUTPUTS.has(output));
  const steelFloorStackDetected = layers.some(
    (layer) => layer.floorRole === "base_structure" && STEEL_FLOOR_BASE_MATERIAL_IDS.has(layer.materialId)
  );

  if (!formulaTargetOutputRequested || !steelFloorStackDetected) {
    return {
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      formulaTargetOutputRequested,
      impactPredictorInput: null,
      missingPhysicalInputs: [],
      status: "inactive",
      steelFloorStackDetected
    };
  }

  const seed = buildExplicitPredictorSeed(input.surface);
  const catalog = input.catalog ?? getDefaultMaterialCatalog();
  const derivedInput = maybeBuildImpactPredictorInputFromLayerStack(layers, seed, undefined, catalog);
  const predictorInput = derivedInput ?? buildFallbackSteelPredictorInput({ layers, seed });

  if (!predictorInput) {
    return {
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      formulaTargetOutputRequested,
      impactPredictorInput: null,
      missingPhysicalInputs: [...STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS],
      status: "unsafe_topology",
      steelFloorStackDetected
    };
  }

  const missingPhysicalInputs = collectMissingPhysicalInputs(predictorInput);

  return {
    formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    formulaTargetOutputRequested,
    impactPredictorInput: predictorInput,
    missingPhysicalInputs,
    status: missingPhysicalInputs.length > 0 ? "needs_input" : "ready_for_formula_corridor",
    steelFloorStackDetected
  };
}

export function buildGateAFSteelFloorFormulaInputSurfaceContract(
  input: GateAFSteelFloorFormulaInputSurfaceContractInput
): GateAFSteelFloorFormulaInputSurfaceContract {
  const surfaceResult = buildSteelFloorFormulaPredictorInputFromSurface({
    catalog: input.catalog,
    layers: input.layers,
    surface: input.surface,
    targetOutputs: input.targetOutputs
  });
  const status = input.exactSourceRowAvailable === true
    ? "exact_source_precedence"
    : surfaceResult.status;
  const runtimeFormulaImpact =
    status === "ready_for_formula_corridor" && surfaceResult.impactPredictorInput
      ? estimateSteelFloorImpactFromPredictorInput(surfaceResult.impactPredictorInput)
      : null;

  return {
    exactMeasuredRowsRemainPrecedence: true,
    formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    landedGate: "gate_af_steel_floor_formula_input_surface_plan",
    missingPhysicalInputs: surfaceResult.missingPhysicalInputs,
    previousLandedGate: "gate_ae_steel_floor_formula_card_and_report_parity_plan",
    requiredPhysicalInputs: STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS,
    runtimeFormulaImpact,
    runtimeValueMovement: true,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts",
    selectionStatus:
      "gate_af_steel_floor_formula_input_surface_landed_selected_acceptance_revalidation_gate_ag",
    sourceRowsRequiredForRuntimeSelection: false,
    status,
    surfaceResult,
    targetOutputs: input.targetOutputs
  };
}

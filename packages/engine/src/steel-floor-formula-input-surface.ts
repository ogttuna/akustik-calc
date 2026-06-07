import type {
  AcousticInputFieldId,
  ImpactCalculation,
  ImpactPredictorInput,
  ImpactPredictorLowerTreatmentSupportClass,
  ImpactPredictorLowerTreatmentType,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId,
  SteelFloorFormulaInputSurface as SharedSteelFloorFormulaInputSurface,
  SteelFloorLowerCeilingIsolationSupportForm as SharedSteelFloorLowerCeilingIsolationSupportForm
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
  estimateSteelFloorSuspendedCeilingOnlyImpactFromPredictorInput,
  getMissingSteelFloorSuspendedCeilingFormulaInputs,
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";

export type SteelFloorLowerCeilingIsolationSupportForm = SharedSteelFloorLowerCeilingIsolationSupportForm;
export type SteelFloorFormulaInputSurface = SharedSteelFloorFormulaInputSurface;

export type SteelFloorFormulaInputSurfaceStatus =
  | "inactive"
  | "needs_input"
  | "ready_for_formula_corridor"
  | "unsafe_topology";

export type SteelFloorFormulaInputSurfaceBasis =
  | typeof STEEL_FLOOR_FORMULA_BASIS
  | typeof STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS;

export type SteelFloorFormulaInputSurfaceResult = {
  formulaBasis: SteelFloorFormulaInputSurfaceBasis;
  formulaTargetOutputRequested: boolean;
  impactPredictorInput: ImpactPredictorInput | null;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  status: SteelFloorFormulaInputSurfaceStatus;
  steelFloorStackDetected: boolean;
  targetOutputMissingPhysicalInputs: Partial<Record<RequestedOutputId, readonly AcousticInputFieldId[]>>;
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
  "toppingOrFloatingLayer",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2",
  "lowerCeilingIsolationSupportForm"
] as const satisfies readonly AcousticInputFieldId[];

export const STEEL_FLOOR_FORMULA_INPUT_SURFACE_LABELS = {
  loadBasisKgM2: "Resilient-layer load basis (kg/m2)",
  lowerCeilingIsolationSupportForm: "Lower ceiling isolation support form",
  resilientLayerDynamicStiffnessMNm3: "Upper resilient dynamic stiffness (MN/m3)",
  steelCarrierDepthMm: "Steel carrier depth (mm)",
  steelCarrierSpacingMm: "Steel carrier spacing (mm)",
  steelSupportForm: "Steel support form",
  toppingOrFloatingLayer: "Topping or floating layer"
} as const satisfies Partial<Record<AcousticInputFieldId, string>>;

export const STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS = [
  "toppingOrFloatingLayer",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2"
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

function hasUpperToppingOrFloatingLayer(input: ImpactPredictorInput): boolean {
  return [input.floatingScreed, input.upperFill].some((layer) =>
    hasPositiveNumber(layer?.thicknessMm) &&
      (
        hasPositiveNumber(layer?.densityKgM3) ||
        typeof layer?.materialClass === "string" ||
        typeof layer?.productId === "string"
      )
  );
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

function hasUpperFormulaIntent(surface: SteelFloorFormulaInputSurface | undefined): boolean {
  return (
    hasPositiveNumber(surface?.loadBasisKgM2) ||
    hasPositiveNumber(surface?.resilientLayerDynamicStiffnessMNm3)
  );
}

function buildExplicitPredictorSeed(
  surface: SteelFloorFormulaInputSurface | undefined,
  input: {
    hasVisibleUpperPackage: boolean;
  }
): ImpactPredictorInput {
  const lowerTreatment = lowerTreatmentPatch(surface?.lowerCeilingIsolationSupportForm);
  const impactSystemType = hasUpperFormulaIntent(surface) || input.hasVisibleUpperPackage
    ? "combined_upper_lower_system"
    : "suspended_ceiling_only";

  return ImpactPredictorInputSchema.parse({
    baseSlab: hasPositiveNumber(surface?.steelCarrierDepthMm)
      ? {
          materialClass: "lightweight_steel_carrier",
          thicknessMm: surface?.steelCarrierDepthMm
        }
      : undefined,
    carrierSpacingMm: surface?.steelCarrierSpacingMm,
    impactSystemType,
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

function resolveFormulaBasisForPredictorInput(
  input: ImpactPredictorInput | null
): SteelFloorFormulaInputSurfaceBasis {
  return input?.impactSystemType === "suspended_ceiling_only"
    ? STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
    : STEEL_FLOOR_FORMULA_BASIS;
}

function estimateSteelFloorFormulaSurfaceImpact(input: ImpactPredictorInput): ImpactCalculation | null {
  return input.impactSystemType === "suspended_ceiling_only"
    ? estimateSteelFloorSuspendedCeilingOnlyImpactFromPredictorInput(input)
    : estimateSteelFloorImpactFromPredictorInput(input);
}

function collectMissingPhysicalInputs(input: ImpactPredictorInput | null): AcousticInputFieldId[] {
  if (!input || input.structuralSupportType !== "steel_joists") {
    return [];
  }

  if (input.impactSystemType === "suspended_ceiling_only") {
    return getMissingSteelFloorSuspendedCeilingFormulaInputs(input);
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

  if (!hasUpperToppingOrFloatingLayer(input)) {
    missing.push("toppingOrFloatingLayer");
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

function collectTargetOutputMissingPhysicalInputs(input: {
  predictorInput: ImpactPredictorInput | null;
  targetOutputs?: readonly RequestedOutputId[];
}): Partial<Record<RequestedOutputId, readonly AcousticInputFieldId[]>> {
  if (
    !input.targetOutputs?.includes("DeltaLw") ||
    input.predictorInput?.structuralSupportType !== "steel_joists" ||
    input.predictorInput.impactSystemType !== "suspended_ceiling_only"
  ) {
    return {};
  }

  return {
    DeltaLw: STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS
  };
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
      steelFloorStackDetected,
      targetOutputMissingPhysicalInputs: {}
    };
  }

  const hasVisibleUpperPackage = layers.some((layer) =>
    layer.floorRole === "floating_screed" ||
      layer.floorRole === "resilient_layer" ||
      layer.floorRole === "upper_fill"
  );
  const seed = buildExplicitPredictorSeed(input.surface, { hasVisibleUpperPackage });
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
      steelFloorStackDetected,
      targetOutputMissingPhysicalInputs: {}
    };
  }

  const missingPhysicalInputs = collectMissingPhysicalInputs(predictorInput);
  const formulaBasis = resolveFormulaBasisForPredictorInput(predictorInput);
  const targetOutputMissingPhysicalInputs = collectTargetOutputMissingPhysicalInputs({
    predictorInput,
    targetOutputs: input.targetOutputs
  });

  return {
    formulaBasis,
    formulaTargetOutputRequested,
    impactPredictorInput: predictorInput,
    missingPhysicalInputs,
    status: missingPhysicalInputs.length > 0 ? "needs_input" : "ready_for_formula_corridor",
    steelFloorStackDetected,
    targetOutputMissingPhysicalInputs
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
      ? estimateSteelFloorFormulaSurfaceImpact(surfaceResult.impactPredictorInput)
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

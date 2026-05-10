import type {
  AcousticInputFieldId,
  ImpactCalculation,
  ImpactPredictorInput,
  ImpactPredictorLowerTreatmentSupportClass,
  ImpactPredictorLowerTreatmentType,
  ImpactPredictorStructuralSupportType,
  ImpactPredictorSystemType,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import {
  ImpactPredictorInputSchema,
  LayerInputSchema
} from "@dynecho/shared";

import {
  canEstimateTimberCltDeltaLwFromPredictorInput,
  estimateTimberCltDeltaLwFromPredictorInput,
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";

export type TimberCltDeltaLwStructuralSupportType = Extract<
  ImpactPredictorStructuralSupportType,
  "mass_timber_clt" | "timber_joists"
>;

export type TimberCltDeltaLwImpactSystemType = Extract<
  ImpactPredictorSystemType,
  "combined_upper_lower_system" | "dry_floating_floor"
>;

export type TimberCltDeltaLwLowerAssemblyType = ImpactPredictorLowerTreatmentType;
export type TimberCltDeltaLwLowerSupportClass = ImpactPredictorLowerTreatmentSupportClass;

export type TimberCltDeltaLwInputSurface = {
  baseFloorDensityKgM3?: number;
  baseFloorThicknessMm?: number;
  impactSystemType?: TimberCltDeltaLwImpactSystemType;
  loadBasisKgM2?: number;
  lowerAssemblyType?: TimberCltDeltaLwLowerAssemblyType;
  lowerBoardLayerCount?: number;
  lowerBoardThicknessMm?: number;
  lowerCavityDepthMm?: number;
  lowerCavityFillThicknessMm?: number;
  lowerSupportClass?: TimberCltDeltaLwLowerSupportClass;
  resilientLayerDynamicStiffnessMNm3?: number;
  resilientLayerThicknessMm?: number;
  structuralSupportType?: TimberCltDeltaLwStructuralSupportType;
  upperFillDensityKgM3?: number;
  upperFillThicknessMm?: number;
  upperTreatmentDensityKgM3?: number;
  upperTreatmentThicknessMm?: number;
};

export type TimberCltDeltaLwInputSurfaceStatus =
  | "inactive"
  | "needs_input"
  | "ready_for_formula_corridor"
  | "unsafe_topology";

export type TimberCltDeltaLwFormulaBasis =
  | typeof MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
  | typeof TIMBER_JOIST_DELTA_LW_FORMULA_BASIS;

export type TimberCltDeltaLwInputSurfaceResult = {
  detectedStructuralSupportType: TimberCltDeltaLwStructuralSupportType | null;
  formulaBasis: TimberCltDeltaLwFormulaBasis | null;
  formulaTargetOutputRequested: boolean;
  impactPredictorInput: ImpactPredictorInput | null;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  status: TimberCltDeltaLwInputSurfaceStatus;
  timberCltStackDetected: boolean;
};

export type GateFTimberCltDeltaLwInputSurfaceContractInput = {
  exactSourceRowAvailable?: boolean;
  layers: readonly LayerInput[];
  surface?: TimberCltDeltaLwInputSurface;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateFTimberCltDeltaLwInputSurfaceContract = {
  exactMeasuredRowsRemainPrecedence: true;
  formulaBasis: TimberCltDeltaLwFormulaBasis | null;
  landedGate: "gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan";
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  previousLandedGate: "gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan";
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  runtimeFormulaImpact: ImpactCalculation | null;
  runtimeValueMovement: boolean;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan";
  selectedNextFile: "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts";
  selectionStatus: "gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_landed_selected_wall_multicavity_gate_g";
  sourceRowsRequiredForRuntimeSelection: false;
  status: TimberCltDeltaLwInputSurfaceStatus | "exact_source_precedence";
  surfaceResult: TimberCltDeltaLwInputSurfaceResult;
  targetOutputs: readonly RequestedOutputId[];
};

export const TIMBER_CLT_DELTA_LW_INPUT_SURFACE_FIELDS = [
  "baseSlabOrFloor",
  "toppingOrFloatingLayer",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2",
  "ceilingOrLowerAssembly"
] as const satisfies readonly AcousticInputFieldId[];

export const TIMBER_CLT_DELTA_LW_BASE_MATERIAL_IDS = new Set([
  "clt_panel",
  "timber_frame_floor",
  "timber_joist_floor"
]);

const LAB_FORMULA_TARGET_OUTPUTS = new Set<RequestedOutputId>(["DeltaLw", "Ln,w"]);

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function normalizeLayers(layers: readonly LayerInput[]): LayerInput[] {
  return layers.map((layer) => LayerInputSchema.parse(layer));
}

function supportTypeForBaseMaterialId(materialId: string): TimberCltDeltaLwStructuralSupportType | null {
  switch (materialId) {
    case "clt_panel":
      return "mass_timber_clt";
    case "timber_frame_floor":
    case "timber_joist_floor":
      return "timber_joists";
    default:
      return null;
  }
}

function formulaBasisFor(
  structuralSupportType: TimberCltDeltaLwStructuralSupportType | null | undefined
): TimberCltDeltaLwFormulaBasis | null {
  switch (structuralSupportType) {
    case "mass_timber_clt":
      return MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS;
    case "timber_joists":
      return TIMBER_JOIST_DELTA_LW_FORMULA_BASIS;
    default:
      return null;
  }
}

function defaultImpactSystemType(
  structuralSupportType: TimberCltDeltaLwStructuralSupportType | null | undefined
): TimberCltDeltaLwImpactSystemType | undefined {
  switch (structuralSupportType) {
    case "mass_timber_clt":
      return "dry_floating_floor";
    case "timber_joists":
      return "combined_upper_lower_system";
    default:
      return undefined;
  }
}

function hasMassDefinedLayer(
  layer: NonNullable<ImpactPredictorInput["floorCovering" | "floatingScreed" | "upperFill"]>
): boolean {
  return Boolean(hasPositiveNumber(layer.thicknessMm) && hasPositiveNumber(layer.densityKgM3));
}

function hasToppingOrFloatingMass(input: ImpactPredictorInput): boolean {
  if (input.floorCovering?.mode === "delta_lw_catalog") {
    return false;
  }

  return Boolean(
    (input.floatingScreed && hasMassDefinedLayer(input.floatingScreed)) ||
      (input.upperFill && hasMassDefinedLayer(input.upperFill)) ||
      (input.floorCovering && hasMassDefinedLayer(input.floorCovering))
  );
}

function hasExplicitLowerAssembly(input: ImpactPredictorInput): boolean {
  const lower = input.lowerTreatment;

  if (!lower?.type) {
    return false;
  }

  if (lower.type === "none") {
    return input.impactSystemType === "dry_floating_floor";
  }

  return Boolean(
    lower.supportClass &&
      hasPositiveNumber(lower.cavityDepthMm) &&
      (
        hasPositiveNumber(lower.boardThicknessMm) ||
        (Array.isArray(lower.boardThicknessScheduleMm) && lower.boardThicknessScheduleMm.length > 0)
      )
  );
}

function buildLowerTreatment(
  surface: TimberCltDeltaLwInputSurface | undefined
): ImpactPredictorInput["lowerTreatment"] | undefined {
  if (!surface?.lowerAssemblyType) {
    return undefined;
  }

  if (surface.lowerAssemblyType === "none") {
    return { type: "none" };
  }

  return {
    boardLayerCount: hasPositiveNumber(surface.lowerBoardLayerCount)
      ? Math.round(surface.lowerBoardLayerCount)
      : undefined,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: surface.lowerBoardThicknessMm,
    cavityDepthMm: surface.lowerCavityDepthMm,
    cavityFillThicknessMm: surface.lowerCavityFillThicknessMm,
    supportClass: surface.lowerSupportClass,
    type: surface.lowerAssemblyType
  };
}

function buildPredictorInputFromSurface(input: {
  baseLayer: LayerInput;
  detectedStructuralSupportType: TimberCltDeltaLwStructuralSupportType;
  surface?: TimberCltDeltaLwInputSurface;
}): ImpactPredictorInput | null {
  const surfaceType = input.surface?.structuralSupportType;
  const structuralSupportType = surfaceType ?? input.detectedStructuralSupportType;

  if (surfaceType && surfaceType !== input.detectedStructuralSupportType) {
    return null;
  }

  const baseMaterialClass = structuralSupportType === "mass_timber_clt"
    ? "clt_panel"
    : "timber_joist_floor";
  const baseDensity = input.surface?.baseFloorDensityKgM3;
  const baseThickness = input.surface?.baseFloorThicknessMm ?? input.baseLayer.thicknessMm;
  const impactSystemType = input.surface?.impactSystemType ?? defaultImpactSystemType(structuralSupportType);

  return ImpactPredictorInputSchema.parse({
    baseSlab: hasPositiveNumber(baseThickness)
      ? {
          densityKgM3: baseDensity,
          materialClass: baseMaterialClass,
          thicknessMm: baseThickness
        }
      : undefined,
    floorCovering:
      hasPositiveNumber(input.surface?.upperTreatmentThicknessMm) &&
      hasPositiveNumber(input.surface?.upperTreatmentDensityKgM3)
        ? {
            densityKgM3: input.surface?.upperTreatmentDensityKgM3,
            materialClass: "dry_floating_gypsum_fiberboard",
            mode: "material_layer",
            thicknessMm: input.surface?.upperTreatmentThicknessMm
          }
        : undefined,
    impactSystemType,
    loadBasisKgM2: input.surface?.loadBasisKgM2,
    lowerTreatment: buildLowerTreatment(input.surface),
    resilientLayer: hasPositiveNumber(input.surface?.resilientLayerDynamicStiffnessMNm3)
      ? {
          dynamicStiffnessMNm3: input.surface?.resilientLayerDynamicStiffnessMNm3,
          thicknessMm: input.surface?.resilientLayerThicknessMm
        }
      : undefined,
    structuralSupportType,
    upperFill:
      hasPositiveNumber(input.surface?.upperFillThicknessMm) &&
      hasPositiveNumber(input.surface?.upperFillDensityKgM3)
        ? {
            densityKgM3: input.surface?.upperFillDensityKgM3,
            materialClass: "dry_granular_fill",
            thicknessMm: input.surface?.upperFillThicknessMm
          }
        : undefined
  });
}

function collectBaseLayers(layers: readonly LayerInput[]): Array<LayerInput & {
  structuralSupportType: TimberCltDeltaLwStructuralSupportType;
}> {
  return layers.flatMap((layer) => {
    if (layer.floorRole !== "base_structure") {
      return [];
    }

    const structuralSupportType = supportTypeForBaseMaterialId(layer.materialId);

    return structuralSupportType ? [{ ...layer, structuralSupportType }] : [];
  });
}

export function hasTimberCltDeltaLwInputSurfaceRoute(input: {
  layers: readonly LayerInput[];
  targetOutputs?: readonly RequestedOutputId[];
}): boolean {
  const formulaTargetOutputRequested =
    !input.targetOutputs || input.targetOutputs.length === 0 ||
    input.targetOutputs.some((output) => LAB_FORMULA_TARGET_OUTPUTS.has(output));

  return formulaTargetOutputRequested && collectBaseLayers(input.layers).length > 0;
}

function collectMissingPhysicalInputs(input: ImpactPredictorInput | null): AcousticInputFieldId[] {
  if (!input) {
    return [...TIMBER_CLT_DELTA_LW_INPUT_SURFACE_FIELDS];
  }

  const missing: AcousticInputFieldId[] = [];
  const family = input.structuralSupportType;

  if (
    (family !== "mass_timber_clt" && family !== "timber_joists") ||
    !hasPositiveNumber(input.baseSlab?.thicknessMm)
  ) {
    missing.push("baseSlabOrFloor");
  }

  if (!hasToppingOrFloatingMass(input)) {
    missing.push("toppingOrFloatingLayer");
  }

  if (!hasPositiveNumber(input.resilientLayer?.dynamicStiffnessMNm3)) {
    missing.push("resilientLayerDynamicStiffnessMNm3");
  }

  if (!hasPositiveNumber(input.loadBasisKgM2)) {
    missing.push("loadBasisKgM2");
  }

  if (!hasExplicitLowerAssembly(input)) {
    missing.push("ceilingOrLowerAssembly");
  }

  return missing;
}

export function buildTimberCltDeltaLwPredictorInputFromSurface(input: {
  layers: readonly LayerInput[];
  surface?: TimberCltDeltaLwInputSurface;
  targetOutputs?: readonly RequestedOutputId[];
}): TimberCltDeltaLwInputSurfaceResult {
  const layers = normalizeLayers(input.layers);
  const formulaTargetOutputRequested =
    !input.targetOutputs || input.targetOutputs.length === 0 ||
    input.targetOutputs.some((output) => LAB_FORMULA_TARGET_OUTPUTS.has(output));
  const baseLayers = collectBaseLayers(layers);
  const timberCltStackDetected = baseLayers.length > 0;
  const detectedStructuralSupportType =
    baseLayers.length === 1 ? baseLayers[0]?.structuralSupportType ?? null : null;
  const formulaBasis = formulaBasisFor(detectedStructuralSupportType);

  if (!formulaTargetOutputRequested || !timberCltStackDetected) {
    return {
      detectedStructuralSupportType,
      formulaBasis,
      formulaTargetOutputRequested,
      impactPredictorInput: null,
      missingPhysicalInputs: [],
      status: "inactive",
      timberCltStackDetected
    };
  }

  if (baseLayers.length !== 1 || !baseLayers[0]) {
    return {
      detectedStructuralSupportType,
      formulaBasis,
      formulaTargetOutputRequested,
      impactPredictorInput: null,
      missingPhysicalInputs: [...TIMBER_CLT_DELTA_LW_INPUT_SURFACE_FIELDS],
      status: "unsafe_topology",
      timberCltStackDetected
    };
  }

  const predictorInput = buildPredictorInputFromSurface({
    baseLayer: baseLayers[0],
    detectedStructuralSupportType: baseLayers[0].structuralSupportType,
    surface: input.surface
  });

  if (!predictorInput) {
    return {
      detectedStructuralSupportType,
      formulaBasis,
      formulaTargetOutputRequested,
      impactPredictorInput: null,
      missingPhysicalInputs: [...TIMBER_CLT_DELTA_LW_INPUT_SURFACE_FIELDS],
      status: "unsafe_topology",
      timberCltStackDetected
    };
  }

  const missingPhysicalInputs = collectMissingPhysicalInputs(predictorInput);

  return {
    detectedStructuralSupportType,
    formulaBasis,
    formulaTargetOutputRequested,
    impactPredictorInput: predictorInput,
    missingPhysicalInputs,
    status:
      missingPhysicalInputs.length === 0 && canEstimateTimberCltDeltaLwFromPredictorInput(predictorInput)
        ? "ready_for_formula_corridor"
        : "needs_input",
    timberCltStackDetected
  };
}

export function buildGateFTimberCltDeltaLwInputSurfaceContract(
  input: GateFTimberCltDeltaLwInputSurfaceContractInput
): GateFTimberCltDeltaLwInputSurfaceContract {
  const surfaceResult = buildTimberCltDeltaLwPredictorInputFromSurface({
    layers: input.layers,
    surface: input.surface,
    targetOutputs: input.targetOutputs
  });
  const status = input.exactSourceRowAvailable === true
    ? "exact_source_precedence"
    : surfaceResult.status;
  const runtimeFormulaImpact =
    status === "ready_for_formula_corridor" && surfaceResult.impactPredictorInput
      ? estimateTimberCltDeltaLwFromPredictorInput(surfaceResult.impactPredictorInput)
      : null;

  return {
    exactMeasuredRowsRemainPrecedence: true,
    formulaBasis: surfaceResult.formulaBasis,
    landedGate: "gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan",
    missingPhysicalInputs: surfaceResult.missingPhysicalInputs,
    previousLandedGate: "gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan",
    requiredPhysicalInputs: TIMBER_CLT_DELTA_LW_INPUT_SURFACE_FIELDS,
    runtimeFormulaImpact,
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan",
    selectedNextFile:
      "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts",
    selectionStatus:
      "gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_landed_selected_wall_multicavity_gate_g",
    sourceRowsRequiredForRuntimeSelection: false,
    status,
    surfaceResult,
    targetOutputs: input.targetOutputs
  };
}

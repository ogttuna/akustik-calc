import type {
  AcousticInputFieldId,
  ImpactCalculation,
  ImpactPredictorInput,
  ImpactPredictorLowerTreatmentSupportClass,
  ImpactPredictorLowerTreatmentType,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";
import {
  ImpactPredictorInputSchema,
  LayerInputSchema
} from "@dynecho/shared";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-be";
import {
  estimateHeavyConcreteCombinedImpactFromPredictorInput,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
} from "./heavy-concrete-combined-impact-formula-corridor";
import {
  maybeBuildImpactPredictorInputFromLayerStack
} from "./impact-predictor-input";
import { getDefaultMaterialCatalog } from "./material-catalog";

export type HeavyConcreteCombinedImpactInputSurface = {
  baseSlabDensityKgM3?: number;
  baseSlabThicknessMm?: number;
  loadBasisKgM2?: number;
  lowerAssemblyType?: ImpactPredictorLowerTreatmentType;
  lowerBoardLayerCount?: number;
  lowerBoardThicknessMm?: number;
  lowerCavityDepthMm?: number;
  lowerCavityFillThicknessMm?: number;
  lowerSupportClass?: ImpactPredictorLowerTreatmentSupportClass;
  resilientLayerDynamicStiffnessMNm3?: number;
  resilientLayerThicknessMm?: number;
};

export type HeavyConcreteCombinedImpactInputSurfaceStatus =
  | "inactive"
  | "needs_input"
  | "ready_for_formula_corridor"
  | "unsafe_topology";

export type HeavyConcreteCombinedImpactInputSurfaceResult = {
  formulaBasis: typeof HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS;
  formulaTargetOutputRequested: boolean;
  heavyConcreteStackDetected: boolean;
  impactPredictorInput: ImpactPredictorInput | null;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  status: HeavyConcreteCombinedImpactInputSurfaceStatus;
};

export type GateBFHeavyConcreteCombinedImpactInputSurfaceContractInput = {
  catalog?: readonly MaterialDefinition[];
  exactSourceRowAvailable?: boolean;
  layers: readonly LayerInput[];
  surface?: HeavyConcreteCombinedImpactInputSurface;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateBFHeavyConcreteCombinedImpactInputSurfaceContract = {
  exactMeasuredRowsRemainPrecedence: true;
  formulaBasis: typeof HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_LANDED_GATE;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  previousGateBE: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_FILE;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTION_STATUS;
  };
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE;
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  runtimeFormulaImpact: ImpactCalculation | null;
  runtimeValueMovement: false;
  selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_be_floor_impact_source_absent_input_surface";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  status: HeavyConcreteCombinedImpactInputSurfaceStatus | "exact_source_precedence";
  surfaceResult: HeavyConcreteCombinedImpactInputSurfaceResult;
  targetOutputs: readonly RequestedOutputId[];
};

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_LANDED_GATE =
  "gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTION_STATUS =
  "gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_landed_selected_revalidation_gate_bg";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_ACTION =
  "gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bg-floor-impact-source-absent-post-input-surface-revalidation-contract.test.ts";

export const HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_FIELDS = [
  "baseSlabOrFloor",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2",
  "ceilingOrLowerAssembly"
] as const satisfies readonly AcousticInputFieldId[];

export const HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_LABELS = {
  baseSlabOrFloor: "Heavy concrete base slab density and thickness",
  ceilingOrLowerAssembly: "Lower ceiling assembly",
  loadBasisKgM2: "Loaded upper treatment mass basis (kg/m2)",
  resilientLayerDynamicStiffnessMNm3: "Upper resilient dynamic stiffness (MN/m3)"
} as const satisfies Partial<Record<AcousticInputFieldId, string>>;

export const HEAVY_CONCRETE_COMBINED_IMPACT_BASE_MATERIAL_IDS = new Set([
  "concrete",
  "heavy_concrete"
]);

const LAB_FORMULA_TARGET_OUTPUTS = new Set<RequestedOutputId>(["DeltaLw", "Ln,w", "Ln,w+CI"]);

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function normalizeLayers(layers: readonly LayerInput[]): LayerInput[] {
  return layers.map((layer) => LayerInputSchema.parse(layer));
}

function collectBaseLayers(layers: readonly LayerInput[]): LayerInput[] {
  return layers.filter(
    (layer) =>
      layer.floorRole === "base_structure" &&
      HEAVY_CONCRETE_COMBINED_IMPACT_BASE_MATERIAL_IDS.has(layer.materialId)
  );
}

function buildLowerTreatment(
  surface: HeavyConcreteCombinedImpactInputSurface | undefined
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

function buildExplicitPredictorSeed(
  surface: HeavyConcreteCombinedImpactInputSurface | undefined
): ImpactPredictorInput {
  return ImpactPredictorInputSchema.parse({
    baseSlab:
      hasPositiveNumber(surface?.baseSlabDensityKgM3) || hasPositiveNumber(surface?.baseSlabThicknessMm)
        ? {
            densityKgM3: surface?.baseSlabDensityKgM3,
            materialClass: "heavy_concrete",
            thicknessMm: surface?.baseSlabThicknessMm
          }
        : undefined,
    impactSystemType: "combined_upper_lower_system",
    loadBasisKgM2: surface?.loadBasisKgM2,
    lowerTreatment: buildLowerTreatment(surface),
    resilientLayer: hasPositiveNumber(surface?.resilientLayerDynamicStiffnessMNm3)
      ? {
          dynamicStiffnessMNm3: surface?.resilientLayerDynamicStiffnessMNm3,
          thicknessMm: surface?.resilientLayerThicknessMm
        }
      : undefined,
    structuralSupportType: "reinforced_concrete"
  });
}

function buildFallbackPredictorInput(input: {
  baseLayer: LayerInput;
  seed: ImpactPredictorInput;
}): ImpactPredictorInput {
  return ImpactPredictorInputSchema.parse({
    ...input.seed,
    baseSlab: {
      materialClass: "heavy_concrete",
      thicknessMm: input.baseLayer.thicknessMm,
      ...input.seed.baseSlab
    },
    structuralSupportType: "reinforced_concrete"
  });
}

function buildUnsafeTopologyBlockerPredictorInput(
  surface: HeavyConcreteCombinedImpactInputSurface | undefined
): ImpactPredictorInput {
  return ImpactPredictorInputSchema.parse({
    impactSystemType: "combined_upper_lower_system",
    loadBasisKgM2: surface?.loadBasisKgM2 ?? 1,
    structuralSupportType: "reinforced_concrete"
  });
}

function hasCompleteLowerTreatment(input: ImpactPredictorInput): boolean {
  const lower = input.lowerTreatment;
  const supportProductId = lower?.supportProductId?.trim().toLowerCase();
  const hasOwnedVisibleSupportProduct =
    supportProductId === "acoustic_hanger_ceiling" ||
    supportProductId === "resilient_stud_ceiling";

  return Boolean(
    lower &&
      lower.type &&
      lower.type !== "none" &&
      (lower.supportClass || hasOwnedVisibleSupportProduct) &&
      hasPositiveNumber(lower.cavityDepthMm) &&
      (
        hasPositiveNumber(lower.boardThicknessMm) ||
        (Array.isArray(lower.boardThicknessScheduleMm) && lower.boardThicknessScheduleMm.length > 0)
      )
  );
}

function collectMissingPhysicalInputs(input: ImpactPredictorInput | null): AcousticInputFieldId[] {
  if (!input) {
    return [...HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_FIELDS];
  }

  const missing: AcousticInputFieldId[] = [];
  const baseDensity = input.baseSlab?.densityKgM3;
  const baseThickness = input.baseSlab?.thicknessMm;

  if (
    input.structuralSupportType !== "reinforced_concrete" ||
    !hasPositiveNumber(baseDensity) ||
    !hasPositiveNumber(baseThickness) ||
    baseDensity * (baseThickness / 1000) < 120
  ) {
    missing.push("baseSlabOrFloor");
  }

  if (!hasPositiveNumber(input.resilientLayer?.dynamicStiffnessMNm3)) {
    missing.push("resilientLayerDynamicStiffnessMNm3");
  }

  if (!hasPositiveNumber(input.loadBasisKgM2)) {
    missing.push("loadBasisKgM2");
  }

  if (!hasCompleteLowerTreatment(input)) {
    missing.push("ceilingOrLowerAssembly");
  }

  return missing;
}

export function hasHeavyConcreteCombinedImpactInputSurfaceRoute(input: {
  layers: readonly LayerInput[];
  targetOutputs?: readonly RequestedOutputId[];
}): boolean {
  const formulaTargetOutputRequested =
    !input.targetOutputs || input.targetOutputs.length === 0 ||
    input.targetOutputs.some((output) => LAB_FORMULA_TARGET_OUTPUTS.has(output));

  return formulaTargetOutputRequested && collectBaseLayers(input.layers).length > 0;
}

export function buildHeavyConcreteCombinedImpactPredictorInputFromSurface(input: {
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  surface?: HeavyConcreteCombinedImpactInputSurface;
  targetOutputs?: readonly RequestedOutputId[];
}): HeavyConcreteCombinedImpactInputSurfaceResult {
  const layers = normalizeLayers(input.layers);
  const formulaTargetOutputRequested =
    !input.targetOutputs || input.targetOutputs.length === 0 ||
    input.targetOutputs.some((output) => LAB_FORMULA_TARGET_OUTPUTS.has(output));
  const baseLayers = collectBaseLayers(layers);
  const heavyConcreteStackDetected = baseLayers.length > 0;

  if (!formulaTargetOutputRequested || !heavyConcreteStackDetected) {
    return {
      formulaBasis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      formulaTargetOutputRequested,
      heavyConcreteStackDetected,
      impactPredictorInput: null,
      missingPhysicalInputs: [],
      status: "inactive"
    };
  }

  if (baseLayers.length !== 1 || !baseLayers[0]) {
    return {
      formulaBasis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      formulaTargetOutputRequested,
      heavyConcreteStackDetected,
      impactPredictorInput: buildUnsafeTopologyBlockerPredictorInput(input.surface),
      missingPhysicalInputs: [...HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_FIELDS],
      status: "unsafe_topology"
    };
  }

  const seed = buildExplicitPredictorSeed(input.surface);
  const catalog = input.catalog ?? getDefaultMaterialCatalog();
  const predictorInput =
    maybeBuildImpactPredictorInputFromLayerStack(layers, seed, undefined, catalog) ??
    buildFallbackPredictorInput({
      baseLayer: baseLayers[0],
      seed
    });
  const missingPhysicalInputs = collectMissingPhysicalInputs(predictorInput);

  return {
    formulaBasis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
    formulaTargetOutputRequested,
    heavyConcreteStackDetected,
    impactPredictorInput: predictorInput,
    missingPhysicalInputs,
    status:
      missingPhysicalInputs.length === 0 &&
      estimateHeavyConcreteCombinedImpactFromPredictorInput(predictorInput)
        ? "ready_for_formula_corridor"
        : "needs_input"
  };
}

export function buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract(
  input: GateBFHeavyConcreteCombinedImpactInputSurfaceContractInput
): GateBFHeavyConcreteCombinedImpactInputSurfaceContract {
  const surfaceResult = buildHeavyConcreteCombinedImpactPredictorInputFromSurface({
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
      ? estimateHeavyConcreteCombinedImpactFromPredictorInput(surfaceResult.impactPredictorInput)
      : null;

  return {
    exactMeasuredRowsRemainPrecedence: true,
    formulaBasis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_LANDED_GATE,
    missingPhysicalInputs: surfaceResult.missingPhysicalInputs,
    previousGateBE: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTION_STATUS
    },
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE,
    requiredPhysicalInputs: HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_FIELDS,
    runtimeFormulaImpact,
    runtimeValueMovement: false,
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_be_floor_impact_source_absent_input_surface",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    status,
    surfaceResult,
    targetOutputs: input.targetOutputs
  };
}

export const GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE = {
  baseSlabDensityKgM3: 2400,
  baseSlabThicknessMm: 150,
  loadBasisKgM2: 100,
  lowerAssemblyType: "suspended_ceiling_elastic_hanger",
  lowerBoardLayerCount: 2,
  lowerBoardThicknessMm: 12.5,
  lowerCavityDepthMm: 120,
  lowerCavityFillThicknessMm: 80,
  lowerSupportClass: "furred_channels",
  resilientLayerDynamicStiffnessMNm3: 30,
  resilientLayerThicknessMm: 8
} as const satisfies HeavyConcreteCombinedImpactInputSurface;

export const GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK = [
  {
    floorRole: "floor_covering",
    materialId: "ceramic_tile",
    thicknessMm: 8
  },
  {
    floorRole: "floating_screed",
    materialId: "screed",
    thicknessMm: 30
  },
  {
    floorRole: "resilient_layer",
    materialId: "generic_resilient_underlay_s30",
    thicknessMm: 8
  },
  {
    floorRole: "base_structure",
    materialId: "concrete",
    thicknessMm: 150
  }
] as const satisfies readonly LayerInput[];

export const GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS =
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS;

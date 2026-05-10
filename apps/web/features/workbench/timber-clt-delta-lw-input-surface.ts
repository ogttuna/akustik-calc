import {
  buildTimberCltDeltaLwPredictorInputFromSurface,
  hasTimberCltDeltaLwInputSurfaceRoute,
  type TimberCltDeltaLwImpactSystemType,
  type TimberCltDeltaLwInputSurface,
  type TimberCltDeltaLwInputSurfaceResult,
  type TimberCltDeltaLwLowerAssemblyType,
  type TimberCltDeltaLwLowerSupportClass,
  type TimberCltDeltaLwStructuralSupportType
} from "@dynecho/engine";
import type {
  AcousticInputFieldId,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { parsePositiveWorkbenchNumber } from "./parse-number";

export type WorkbenchTimberCltDeltaLwStructuralSupportType = "" | TimberCltDeltaLwStructuralSupportType;
export type WorkbenchTimberCltDeltaLwImpactSystemType = "" | TimberCltDeltaLwImpactSystemType;
export type WorkbenchTimberCltDeltaLwLowerAssemblyType = "" | TimberCltDeltaLwLowerAssemblyType;
export type WorkbenchTimberCltDeltaLwLowerSupportClass = "" | TimberCltDeltaLwLowerSupportClass;

export type WorkbenchTimberCltDeltaLwInputSurfaceDraft = {
  impactTimberCltBaseFloorDensityKgM3: string;
  impactTimberCltBaseFloorThicknessMm: string;
  impactTimberCltImpactSystemType: WorkbenchTimberCltDeltaLwImpactSystemType;
  impactTimberCltLoadBasisKgM2: string;
  impactTimberCltLowerAssemblyType: WorkbenchTimberCltDeltaLwLowerAssemblyType;
  impactTimberCltLowerBoardLayerCount: string;
  impactTimberCltLowerBoardThicknessMm: string;
  impactTimberCltLowerCavityDepthMm: string;
  impactTimberCltLowerCavityFillThicknessMm: string;
  impactTimberCltLowerSupportClass: WorkbenchTimberCltDeltaLwLowerSupportClass;
  impactTimberCltResilientLayerDynamicStiffnessMNm3: string;
  impactTimberCltResilientLayerThicknessMm: string;
  impactTimberCltStructuralSupportType: WorkbenchTimberCltDeltaLwStructuralSupportType;
  impactTimberCltUpperFillDensityKgM3: string;
  impactTimberCltUpperFillThicknessMm: string;
  impactTimberCltUpperTreatmentDensityKgM3: string;
  impactTimberCltUpperTreatmentThicknessMm: string;
};

export const WORKBENCH_TIMBER_CLT_DELTA_LW_INPUT_LABELS: Partial<Record<AcousticInputFieldId, string>> = {
  baseSlabOrFloor: "Timber/CLT support family",
  ceilingOrLowerAssembly: "Lower assembly",
  loadBasisKgM2: "Load basis (kg/m2)",
  resilientLayerDynamicStiffnessMNm3: "Dynamic stiffness (MN/m3)",
  toppingOrFloatingLayer: "Upper floating/topping mass"
};

export function normalizeWorkbenchTimberCltDeltaLwInputSurface(
  draft: WorkbenchTimberCltDeltaLwInputSurfaceDraft
): TimberCltDeltaLwInputSurface {
  return {
    baseFloorDensityKgM3: parsePositiveWorkbenchNumber(draft.impactTimberCltBaseFloorDensityKgM3),
    baseFloorThicknessMm: parsePositiveWorkbenchNumber(draft.impactTimberCltBaseFloorThicknessMm),
    impactSystemType: draft.impactTimberCltImpactSystemType || undefined,
    loadBasisKgM2: parsePositiveWorkbenchNumber(draft.impactTimberCltLoadBasisKgM2),
    lowerAssemblyType: draft.impactTimberCltLowerAssemblyType || undefined,
    lowerBoardLayerCount: parsePositiveWorkbenchNumber(draft.impactTimberCltLowerBoardLayerCount),
    lowerBoardThicknessMm: parsePositiveWorkbenchNumber(draft.impactTimberCltLowerBoardThicknessMm),
    lowerCavityDepthMm: parsePositiveWorkbenchNumber(draft.impactTimberCltLowerCavityDepthMm),
    lowerCavityFillThicknessMm: parsePositiveWorkbenchNumber(draft.impactTimberCltLowerCavityFillThicknessMm),
    lowerSupportClass: draft.impactTimberCltLowerSupportClass || undefined,
    resilientLayerDynamicStiffnessMNm3:
      parsePositiveWorkbenchNumber(draft.impactTimberCltResilientLayerDynamicStiffnessMNm3),
    resilientLayerThicknessMm: parsePositiveWorkbenchNumber(draft.impactTimberCltResilientLayerThicknessMm),
    structuralSupportType: draft.impactTimberCltStructuralSupportType || undefined,
    upperFillDensityKgM3: parsePositiveWorkbenchNumber(draft.impactTimberCltUpperFillDensityKgM3),
    upperFillThicknessMm: parsePositiveWorkbenchNumber(draft.impactTimberCltUpperFillThicknessMm),
    upperTreatmentDensityKgM3: parsePositiveWorkbenchNumber(draft.impactTimberCltUpperTreatmentDensityKgM3),
    upperTreatmentThicknessMm: parsePositiveWorkbenchNumber(draft.impactTimberCltUpperTreatmentThicknessMm)
  };
}

export function buildWorkbenchTimberCltDeltaLwInputSurface(input: {
  layers: readonly LayerInput[];
  surface: WorkbenchTimberCltDeltaLwInputSurfaceDraft;
  targetOutputs: readonly RequestedOutputId[];
}): TimberCltDeltaLwInputSurfaceResult {
  return buildTimberCltDeltaLwPredictorInputFromSurface({
    layers: input.layers,
    surface: normalizeWorkbenchTimberCltDeltaLwInputSurface(input.surface),
    targetOutputs: input.targetOutputs
  });
}

export function formatWorkbenchTimberCltDeltaLwMissingInputWarning(
  result: TimberCltDeltaLwInputSurfaceResult
): string | null {
  if (result.status !== "needs_input" || result.missingPhysicalInputs.length === 0) {
    return null;
  }

  const missingLabels = result.missingPhysicalInputs.map(
    (field) => WORKBENCH_TIMBER_CLT_DELTA_LW_INPUT_LABELS[field] ?? field
  );

  return `Timber/CLT DeltaLw formula lane needs these physical inputs before calculating DeltaLw: ${missingLabels.join(", ")}.`;
}

export function hasWorkbenchTimberCltDeltaLwInputSurfaceRoute(input: {
  layers: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}): boolean {
  return hasTimberCltDeltaLwInputSurfaceRoute(input);
}

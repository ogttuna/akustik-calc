import {
  buildHeavyConcreteCombinedImpactPredictorInputFromSurface,
  hasHeavyConcreteCombinedImpactInputSurfaceRoute,
  HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_LABELS,
  type HeavyConcreteCombinedImpactInputSurface,
  type HeavyConcreteCombinedImpactInputSurfaceResult
} from "@dynecho/engine";
import type {
  AcousticInputFieldId,
  ImpactPredictorLowerTreatmentSupportClass,
  ImpactPredictorLowerTreatmentType,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";

import { parsePositiveWorkbenchNumber } from "./parse-number";

export type WorkbenchHeavyConcreteCombinedLowerAssemblyType = "" | ImpactPredictorLowerTreatmentType;
export type WorkbenchHeavyConcreteCombinedLowerSupportClass = "" | ImpactPredictorLowerTreatmentSupportClass;

export type WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft = {
  impactHeavyConcreteBaseSlabDensityKgM3: string;
  impactHeavyConcreteBaseSlabThicknessMm: string;
  impactHeavyConcreteLoadBasisKgM2: string;
  impactHeavyConcreteLowerAssemblyType: WorkbenchHeavyConcreteCombinedLowerAssemblyType;
  impactHeavyConcreteLowerBoardLayerCount: string;
  impactHeavyConcreteLowerBoardThicknessMm: string;
  impactHeavyConcreteLowerCavityDepthMm: string;
  impactHeavyConcreteLowerCavityFillThicknessMm: string;
  impactHeavyConcreteLowerSupportClass: WorkbenchHeavyConcreteCombinedLowerSupportClass;
  impactHeavyConcreteResilientLayerDynamicStiffnessMNm3: string;
  impactHeavyConcreteResilientLayerThicknessMm: string;
};

export const WORKBENCH_HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_LABELS:
  Partial<Record<AcousticInputFieldId, string>> = HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_LABELS;

export function normalizeWorkbenchHeavyConcreteCombinedImpactInputSurface(
  draft: WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft
): HeavyConcreteCombinedImpactInputSurface {
  return {
    baseSlabDensityKgM3: parsePositiveWorkbenchNumber(draft.impactHeavyConcreteBaseSlabDensityKgM3),
    baseSlabThicknessMm: parsePositiveWorkbenchNumber(draft.impactHeavyConcreteBaseSlabThicknessMm),
    loadBasisKgM2: parsePositiveWorkbenchNumber(draft.impactHeavyConcreteLoadBasisKgM2),
    lowerAssemblyType: draft.impactHeavyConcreteLowerAssemblyType || undefined,
    lowerBoardLayerCount: parsePositiveWorkbenchNumber(draft.impactHeavyConcreteLowerBoardLayerCount),
    lowerBoardThicknessMm: parsePositiveWorkbenchNumber(draft.impactHeavyConcreteLowerBoardThicknessMm),
    lowerCavityDepthMm: parsePositiveWorkbenchNumber(draft.impactHeavyConcreteLowerCavityDepthMm),
    lowerCavityFillThicknessMm: parsePositiveWorkbenchNumber(draft.impactHeavyConcreteLowerCavityFillThicknessMm),
    lowerSupportClass: draft.impactHeavyConcreteLowerSupportClass || undefined,
    resilientLayerDynamicStiffnessMNm3:
      parsePositiveWorkbenchNumber(draft.impactHeavyConcreteResilientLayerDynamicStiffnessMNm3),
    resilientLayerThicknessMm: parsePositiveWorkbenchNumber(draft.impactHeavyConcreteResilientLayerThicknessMm)
  };
}

export function buildWorkbenchHeavyConcreteCombinedImpactInputSurface(input: {
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  surface: WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft;
  targetOutputs: readonly RequestedOutputId[];
}): HeavyConcreteCombinedImpactInputSurfaceResult {
  return buildHeavyConcreteCombinedImpactPredictorInputFromSurface({
    catalog: input.catalog,
    layers: input.layers,
    surface: normalizeWorkbenchHeavyConcreteCombinedImpactInputSurface(input.surface),
    targetOutputs: input.targetOutputs
  });
}

export function formatWorkbenchHeavyConcreteCombinedImpactMissingInputWarning(
  result: HeavyConcreteCombinedImpactInputSurfaceResult
): string | null {
  if (result.status !== "needs_input" || result.missingPhysicalInputs.length === 0) {
    return null;
  }

  const missingLabels = result.missingPhysicalInputs.map(
    (field) => WORKBENCH_HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_LABELS[field] ?? field
  );

  return `Heavy concrete combined formula lane needs these physical inputs before calculating Ln,w / DeltaLw: ${missingLabels.join(", ")}.`;
}

export function hasWorkbenchHeavyConcreteCombinedImpactInputSurfaceRoute(input: {
  layers: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}): boolean {
  return hasHeavyConcreteCombinedImpactInputSurfaceRoute(input);
}

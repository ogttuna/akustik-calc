import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  hasSteelFloorFormulaInputSurfaceRoute,
  STEEL_FLOOR_FORMULA_INPUT_SURFACE_LABELS,
  type SteelFloorFormulaInputSurface,
  type SteelFloorFormulaInputSurfaceResult,
  type SteelFloorLowerCeilingIsolationSupportForm
} from "@dynecho/engine";
import type {
  AcousticInputFieldId,
  ImpactPredictorSupportForm,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";

import { parsePositiveWorkbenchNumber } from "./parse-number";

export type WorkbenchSteelFloorFormulaLowerCeilingIsolationSupportForm =
  "" | SteelFloorLowerCeilingIsolationSupportForm;

export type WorkbenchSteelFloorFormulaInputSurfaceDraft = {
  impactSteelCarrierDepthMm: string;
  impactSteelCarrierSpacingMm: string;
  impactSteelLoadBasisKgM2: string;
  impactSteelLowerCeilingIsolationSupportForm: WorkbenchSteelFloorFormulaLowerCeilingIsolationSupportForm;
  impactSteelResilientLayerDynamicStiffnessMNm3: string;
  impactSteelSupportForm: "" | ImpactPredictorSupportForm;
};

export const WORKBENCH_STEEL_FLOOR_FORMULA_INPUT_LABELS:
  Partial<Record<AcousticInputFieldId, string>> = STEEL_FLOOR_FORMULA_INPUT_SURFACE_LABELS;

export function normalizeWorkbenchSteelFloorFormulaInputSurface(
  draft: WorkbenchSteelFloorFormulaInputSurfaceDraft
): SteelFloorFormulaInputSurface {
  return {
    loadBasisKgM2: parsePositiveWorkbenchNumber(draft.impactSteelLoadBasisKgM2),
    lowerCeilingIsolationSupportForm:
      draft.impactSteelLowerCeilingIsolationSupportForm || undefined,
    resilientLayerDynamicStiffnessMNm3:
      parsePositiveWorkbenchNumber(draft.impactSteelResilientLayerDynamicStiffnessMNm3),
    steelCarrierDepthMm: parsePositiveWorkbenchNumber(draft.impactSteelCarrierDepthMm),
    steelCarrierSpacingMm: parsePositiveWorkbenchNumber(draft.impactSteelCarrierSpacingMm),
    steelSupportForm: draft.impactSteelSupportForm || undefined
  };
}

export function buildWorkbenchSteelFloorFormulaInputSurface(input: {
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  surface: WorkbenchSteelFloorFormulaInputSurfaceDraft;
  targetOutputs: readonly RequestedOutputId[];
}): SteelFloorFormulaInputSurfaceResult {
  return buildSteelFloorFormulaPredictorInputFromSurface({
    catalog: input.catalog,
    layers: input.layers,
    surface: normalizeWorkbenchSteelFloorFormulaInputSurface(input.surface),
    targetOutputs: input.targetOutputs
  });
}

export function formatWorkbenchSteelFloorFormulaMissingInputWarning(
  result: SteelFloorFormulaInputSurfaceResult
): string | null {
  if (result.status !== "needs_input" || result.missingPhysicalInputs.length === 0) {
    return null;
  }

  const missingLabels = result.missingPhysicalInputs.map(
    (field) => WORKBENCH_STEEL_FLOOR_FORMULA_INPUT_LABELS[field] ?? field
  );

  return `Steel-floor formula lane needs these physical inputs before calculating Ln,w / DeltaLw: ${missingLabels.join(", ")}.`;
}

export function hasWorkbenchSteelFloorFormulaInputSurfaceRoute(input: {
  layers: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}): boolean {
  return hasSteelFloorFormulaInputSurfaceRoute(input);
}

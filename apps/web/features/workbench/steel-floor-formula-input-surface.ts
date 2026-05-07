import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  hasSteelFloorFormulaInputSurfaceRoute,
  type SteelFloorFormulaInputSurface,
  type SteelFloorFormulaInputSurfaceResult,
  type SteelFloorLowerCeilingIsolationSupportForm
} from "@dynecho/engine";
import type {
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

export function hasWorkbenchSteelFloorFormulaInputSurfaceRoute(input: {
  layers: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}): boolean {
  return hasSteelFloorFormulaInputSurfaceRoute(input);
}

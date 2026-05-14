import type {
  AirborneContext,
  AirborneContextMode,
  RequestedOutputId
} from "@dynecho/shared";

import type { StudyMode } from "./preset-definitions";
import type {
  WorkbenchOpeningLeakCompositeInputSurfaceResult
} from "./opening-leak-composite-input-surface";

export const WORKBENCH_OPENING_LEAK_FIELD_BUILDING_INPUT_SURFACE_ID =
  "company_internal_opening_leak_field_building_input_surface";

const OPENING_LEAK_FIELD_BUILDING_OUTPUTS = new Set<RequestedOutputId>([
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w"
]);

export type WorkbenchOpeningLeakFieldBuildingInputSurfaceResult = {
  airborneContextPatch: Pick<AirborneContext, "openingLeakFieldBuildingAdapterBoundary">;
  id: typeof WORKBENCH_OPENING_LEAK_FIELD_BUILDING_INPUT_SURFACE_ID;
  status: "complete" | "inactive";
};

function hasOpeningLeakFieldBuildingOutputs(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.some((output) => OPENING_LEAK_FIELD_BUILDING_OUTPUTS.has(output));
}

function isFieldOrBuildingContext(contextMode: AirborneContextMode | undefined): boolean {
  return contextMode === "field_between_rooms" || contextMode === "building_prediction";
}

export function buildWorkbenchOpeningLeakFieldBuildingInputSurface(input: {
  contextMode?: AirborneContextMode;
  openingLeakCompositeInputSurface: WorkbenchOpeningLeakCompositeInputSurfaceResult | null;
  studyMode: StudyMode;
  targetOutputs: readonly RequestedOutputId[];
}): WorkbenchOpeningLeakFieldBuildingInputSurfaceResult {
  const active =
    input.studyMode === "wall" &&
    input.openingLeakCompositeInputSurface !== null &&
    input.openingLeakCompositeInputSurface.status !== "inactive" &&
    isFieldOrBuildingContext(input.contextMode) &&
    hasOpeningLeakFieldBuildingOutputs(input.targetOutputs);

  return {
    airborneContextPatch: active ? { openingLeakFieldBuildingAdapterBoundary: true } : {},
    id: WORKBENCH_OPENING_LEAK_FIELD_BUILDING_INPUT_SURFACE_ID,
    status: active ? "complete" : "inactive"
  };
}

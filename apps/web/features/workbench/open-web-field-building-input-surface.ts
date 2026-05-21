import type { AirborneContext, AirborneContextMode, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { parsePositiveWorkbenchNumber, parseWorkbenchNumber } from "./parse-number";
import type { StudyMode } from "./preset-definitions";

export const WORKBENCH_OPEN_WEB_FIELD_BUILDING_INPUT_SURFACE_ID =
  "broad_accuracy_floor_open_web_field_building_input_surface";

type OpenWebFieldBuildingInputFieldId =
  | "contextMode"
  | "fieldKDb"
  | "impactReceivingRoomVolumeM3"
  | "partitionAreaM2"
  | "receivingRoomRt60S"
  | "receivingRoomVolumeM3";

export const WORKBENCH_OPEN_WEB_FIELD_BUILDING_INPUT_LABELS: Record<OpenWebFieldBuildingInputFieldId, string> = {
  contextMode: "Field/building context mode",
  fieldKDb: "Impact field K correction (dB)",
  impactReceivingRoomVolumeM3: "Impact receiving-room volume (m3)",
  partitionAreaM2: "Floor/partition width and height",
  receivingRoomRt60S: "Receiving-room RT60 (s)",
  receivingRoomVolumeM3: "Receiving-room volume (m3)"
};

const FIELD_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "DnT,A,k"]);
const STANDARDIZED_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["DnT,w", "DnT,A", "DnT,A,k"]);
const FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'n,w", "L'nT,w", "L'nT,50", "LnT,A"]);
const STANDARDIZED_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'nT,w", "L'nT,50", "LnT,A"]);

export type WorkbenchOpenWebFieldBuildingInputSurfaceDraft = {
  baseAirborneContext?: Omit<
    AirborneContext,
    "contextMode" | "panelHeightMm" | "panelWidthMm" | "receivingRoomRt60S" | "receivingRoomVolumeM3"
  >;
  baseImpactFieldContext?: Omit<ImpactFieldContext, "fieldKDb" | "receivingRoomVolumeM3">;
  contextMode: AirborneContextMode;
  fieldKDb?: string;
  impactReceivingRoomVolumeM3?: string;
  panelHeightMm: string;
  panelWidthMm: string;
  receivingRoomRt60S: string;
  receivingRoomVolumeM3: string;
};

export type WorkbenchOpenWebFieldBuildingInputSurfaceResult = {
  airborneContext: AirborneContext;
  id: typeof WORKBENCH_OPEN_WEB_FIELD_BUILDING_INPUT_SURFACE_ID;
  impactFieldContext: ImpactFieldContext;
  missingPhysicalInputs: readonly OpenWebFieldBuildingInputFieldId[];
  status: "complete" | "inactive" | "needs_input" | "unsupported";
  unsupportedBoundaries: readonly string[];
};

function hasOpenWebSteelCarrier(layers: readonly LayerInput[]): boolean {
  return layers.some((layer) => layer.materialId === "open_web_steel_floor");
}

function hasAnyTarget(targetOutputs: readonly RequestedOutputId[], targets: ReadonlySet<RequestedOutputId>): boolean {
  return targetOutputs.some((output) => targets.has(output));
}

export function buildWorkbenchOpenWebFieldBuildingInputSurface(input: {
  layers: readonly LayerInput[];
  studyMode: StudyMode;
  surface: WorkbenchOpenWebFieldBuildingInputSurfaceDraft;
  targetOutputs: readonly RequestedOutputId[];
}): WorkbenchOpenWebFieldBuildingInputSurfaceResult {
  const fieldAirborneRequested = hasAnyTarget(input.targetOutputs, FIELD_AIRBORNE_OUTPUTS);
  const standardizedAirborneRequested = hasAnyTarget(input.targetOutputs, STANDARDIZED_AIRBORNE_OUTPUTS);
  const fieldImpactRequested = hasAnyTarget(input.targetOutputs, FIELD_IMPACT_OUTPUTS);
  const standardizedImpactRequested = hasAnyTarget(input.targetOutputs, STANDARDIZED_IMPACT_OUTPUTS);
  const panelHeightMm = parsePositiveWorkbenchNumber(input.surface.panelHeightMm);
  const panelWidthMm = parsePositiveWorkbenchNumber(input.surface.panelWidthMm);
  const receivingRoomRt60S = parsePositiveWorkbenchNumber(input.surface.receivingRoomRt60S);
  const receivingRoomVolumeM3 = parsePositiveWorkbenchNumber(input.surface.receivingRoomVolumeM3);
  const fieldKDb = parseWorkbenchNumber(input.surface.fieldKDb ?? "");
  const impactReceivingRoomVolumeM3 = parsePositiveWorkbenchNumber(input.surface.impactReceivingRoomVolumeM3 ?? "");
  const airborneContext: AirborneContext = {
    ...(input.surface.baseAirborneContext ?? {}),
    contextMode: input.surface.contextMode,
    panelHeightMm,
    panelWidthMm,
    receivingRoomRt60S,
    receivingRoomVolumeM3
  };
  const impactFieldContext: ImpactFieldContext = {
    ...(input.surface.baseImpactFieldContext ?? {}),
    fieldKDb,
    receivingRoomVolumeM3: impactReceivingRoomVolumeM3
  };

  if (
    input.studyMode !== "floor" ||
    !hasOpenWebSteelCarrier(input.layers) ||
    (!fieldAirborneRequested && !fieldImpactRequested)
  ) {
    return {
      airborneContext,
      id: WORKBENCH_OPEN_WEB_FIELD_BUILDING_INPUT_SURFACE_ID,
      impactFieldContext,
      missingPhysicalInputs: [],
      status: "inactive",
      unsupportedBoundaries: []
    };
  }

  const missingPhysicalInputs: OpenWebFieldBuildingInputFieldId[] = [];

  if (input.surface.contextMode !== "field_between_rooms" && input.surface.contextMode !== "building_prediction") {
    missingPhysicalInputs.push("contextMode");
  }

  if (fieldAirborneRequested) {
    if (typeof panelWidthMm !== "number" || typeof panelHeightMm !== "number") {
      missingPhysicalInputs.push("partitionAreaM2");
    }
    if (standardizedAirborneRequested && typeof receivingRoomVolumeM3 !== "number") {
      missingPhysicalInputs.push("receivingRoomVolumeM3");
    }
    if (standardizedAirborneRequested && typeof receivingRoomRt60S !== "number") {
      missingPhysicalInputs.push("receivingRoomRt60S");
    }
  }

  if (fieldImpactRequested && typeof fieldKDb !== "number") {
    missingPhysicalInputs.push("fieldKDb");
  }
  if (standardizedImpactRequested && typeof impactReceivingRoomVolumeM3 !== "number") {
    missingPhysicalInputs.push("impactReceivingRoomVolumeM3");
  }

  if (missingPhysicalInputs.length > 0) {
    return {
      airborneContext,
      id: WORKBENCH_OPEN_WEB_FIELD_BUILDING_INPUT_SURFACE_ID,
      impactFieldContext,
      missingPhysicalInputs,
      status: "needs_input",
      unsupportedBoundaries: []
    };
  }

  if (input.surface.contextMode === "building_prediction") {
    return {
      airborneContext,
      id: WORKBENCH_OPEN_WEB_FIELD_BUILDING_INPUT_SURFACE_ID,
      impactFieldContext,
      missingPhysicalInputs: [],
      status: "unsupported",
      unsupportedBoundaries: ["floor_open_web_building_prediction_runtime_owner_missing"]
    };
  }

  return {
    airborneContext,
    id: WORKBENCH_OPEN_WEB_FIELD_BUILDING_INPUT_SURFACE_ID,
    impactFieldContext,
    missingPhysicalInputs: [],
    status: "complete",
    unsupportedBoundaries: []
  };
}

export function formatWorkbenchOpenWebFieldBuildingMissingInputWarning(
  result: WorkbenchOpenWebFieldBuildingInputSurfaceResult
): string | null {
  if (result.status !== "needs_input" || result.missingPhysicalInputs.length === 0) {
    return null;
  }

  const missingLabels = result.missingPhysicalInputs.map(
    (field) => WORKBENCH_OPEN_WEB_FIELD_BUILDING_INPUT_LABELS[field]
  );

  return `Floor open-web field/building input surface needs these physical inputs before calculating R'w / DnT,w / L'n,w: ${missingLabels.join(", ")}.`;
}

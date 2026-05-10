import type {
  AcousticInputFieldId,
  AirborneContext,
  AirborneContextMode,
  AirtightnessClass,
  RequestedOutputId
} from "@dynecho/shared";

import { parsePositiveWorkbenchNumber } from "./parse-number";
import type { StudyMode } from "./preset-definitions";

export const WORKBENCH_AIRBORNE_FIELD_CONTEXT_INPUT_SURFACE_ID =
  "gate_k_personal_use_mvp_airborne_field_context_input_surface";

export const WORKBENCH_AIRBORNE_FIELD_CONTEXT_INPUT_LABELS: Partial<Record<AcousticInputFieldId, string>> = {
  buildingPredictionOutputBasis: "Building output basis",
  conservativeFlankingAssumption: "Conservative flanking assumption",
  contextMode: "Context mode",
  flankingJunctionClass: "Flanking/junction class",
  junctionCouplingLengthM: "Junction coupling length",
  partitionAreaM2: "Partition width and height",
  receivingRoomRt60S: "Receiving-room RT60 (s)",
  receivingRoomVolumeM3: "Receiving-room volume (m3)",
  sourceRoomVolumeM3: "Source-room volume (m3)"
};

const AIRBORNE_FIELD_OUTPUTS = new Set<RequestedOutputId>(["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "DnT,A,k"]);

export type WorkbenchAirborneFieldContextInputSurfaceDraft = {
  airtightness?: AirtightnessClass;
  baseContext?: Omit<
    AirborneContext,
    "airtightness" | "contextMode" | "panelHeightMm" | "panelWidthMm" | "receivingRoomRt60S" | "receivingRoomVolumeM3"
  >;
  contextMode: AirborneContextMode;
  panelHeightMm: string;
  panelWidthMm: string;
  receivingRoomRt60S: string;
  receivingRoomVolumeM3: string;
};

export type WorkbenchAirborneFieldContextInputSurfaceResult = {
  airborneContext: AirborneContext;
  id: typeof WORKBENCH_AIRBORNE_FIELD_CONTEXT_INPUT_SURFACE_ID;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  status: "complete" | "inactive" | "needs_input" | "unsupported";
};

function hasFieldAirborneOutputs(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.some((output) => AIRBORNE_FIELD_OUTPUTS.has(output));
}

export function buildWorkbenchAirborneFieldContextInputSurface(input: {
  studyMode: StudyMode;
  surface: WorkbenchAirborneFieldContextInputSurfaceDraft;
  targetOutputs: readonly RequestedOutputId[];
}): WorkbenchAirborneFieldContextInputSurfaceResult {
  const panelHeightMm = parsePositiveWorkbenchNumber(input.surface.panelHeightMm);
  const panelWidthMm = parsePositiveWorkbenchNumber(input.surface.panelWidthMm);
  const receivingRoomRt60S = parsePositiveWorkbenchNumber(input.surface.receivingRoomRt60S);
  const receivingRoomVolumeM3 = parsePositiveWorkbenchNumber(input.surface.receivingRoomVolumeM3);
  const airborneContext: AirborneContext = {
    ...(input.surface.baseContext ?? {}),
    airtightness: input.surface.airtightness,
    contextMode: input.surface.contextMode,
    panelHeightMm,
    panelWidthMm,
    receivingRoomRt60S,
    receivingRoomVolumeM3
  };

  if (input.studyMode !== "wall" || !hasFieldAirborneOutputs(input.targetOutputs)) {
    return {
      airborneContext,
      id: WORKBENCH_AIRBORNE_FIELD_CONTEXT_INPUT_SURFACE_ID,
      missingPhysicalInputs: [],
      status: "inactive"
    };
  }

  if (input.surface.contextMode === "building_prediction") {
    const missingPhysicalInputs: AcousticInputFieldId[] = [];

    if (typeof panelWidthMm !== "number" || typeof panelHeightMm !== "number") {
      missingPhysicalInputs.push("partitionAreaM2");
    }
    if (typeof receivingRoomVolumeM3 !== "number") {
      missingPhysicalInputs.push("receivingRoomVolumeM3");
    }
    if (typeof receivingRoomRt60S !== "number") {
      missingPhysicalInputs.push("receivingRoomRt60S");
    }
    missingPhysicalInputs.push(
      "sourceRoomVolumeM3",
      "flankingJunctionClass",
      "conservativeFlankingAssumption",
      "junctionCouplingLengthM",
      "buildingPredictionOutputBasis"
    );

    return {
      airborneContext,
      id: WORKBENCH_AIRBORNE_FIELD_CONTEXT_INPUT_SURFACE_ID,
      missingPhysicalInputs,
      status: "needs_input"
    };
  }

  const missingPhysicalInputs: AcousticInputFieldId[] = [];

  if (input.surface.contextMode !== "field_between_rooms") {
    missingPhysicalInputs.push("contextMode");
  }

  if (typeof panelWidthMm !== "number" || typeof panelHeightMm !== "number") {
    missingPhysicalInputs.push("partitionAreaM2");
  }

  if (typeof receivingRoomVolumeM3 !== "number") {
    missingPhysicalInputs.push("receivingRoomVolumeM3");
  }

  if (typeof receivingRoomRt60S !== "number") {
    missingPhysicalInputs.push("receivingRoomRt60S");
  }

  return {
    airborneContext,
    id: WORKBENCH_AIRBORNE_FIELD_CONTEXT_INPUT_SURFACE_ID,
    missingPhysicalInputs,
    status: missingPhysicalInputs.length > 0 ? "needs_input" : "complete"
  };
}

export function formatWorkbenchAirborneFieldContextMissingInputWarning(
  result: WorkbenchAirborneFieldContextInputSurfaceResult
): string | null {
  if (result.status !== "needs_input" || result.missingPhysicalInputs.length === 0) {
    return null;
  }

  const missingLabels = result.missingPhysicalInputs.map(
    (field) => WORKBENCH_AIRBORNE_FIELD_CONTEXT_INPUT_LABELS[field] ?? field
  );

  return `Airborne field/building-context route needs these physical inputs before calculating R'w / DnT,w: ${missingLabels.join(", ")}.`;
}

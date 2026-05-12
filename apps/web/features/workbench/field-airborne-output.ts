import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

import { getGateARAirborneBuildingPredictionSurface } from "./airborne-building-prediction-surface";
import { getGateIAirborneFieldContextSurface } from "./airborne-field-context-surface";
import { getDnTAkDetail, getDnTAkLiveLabel } from "./dntak-source-mode";
import { FIELD_OUTPUT_CONTINUATION_BASIS_GUARD as FIELD_CONTINUATION_BASIS_GUARD } from "./field-output-owner-policy-copy";
import { getRockwoolTripleLeafScreeningPolicyCopy } from "./rockwool-triple-leaf-screening-policy-copy";

export const FIELD_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "DnT,A,k"]);
export const STANDARDIZED_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["DnT,w", "DnT,A"]);

const AREA_NORMALIZED_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["Dn,w", "Dn,A"]);

type FieldAirborneBlockingRequirement =
  | "building_prediction_owner"
  | "curated_field_source"
  | "field_mode"
  | "partition_geometry"
  | "room_volume"
  | "rt60";

function hasFieldAirborneMode(result: AssemblyCalculation | null): boolean {
  return (
    result?.airborneOverlay?.contextMode === "field_between_rooms" ||
    result?.airborneOverlay?.contextMode === "building_prediction" ||
    result?.ratings.iso717.descriptor === "R'w"
  );
}

function hasPartitionGeometry(result: AssemblyCalculation | null): boolean {
  return (
    typeof result?.ratings.field?.partitionAreaM2 === "number" ||
    typeof result?.metrics.estimatedDnWDb === "number" ||
    typeof result?.metrics.estimatedDnADb === "number"
  );
}

function hasReceivingRoomVolume(result: AssemblyCalculation | null): boolean {
  return (
    typeof result?.ratings.field?.receivingRoomVolumeM3 === "number" ||
    typeof result?.metrics.estimatedDnTwDb === "number" ||
    typeof result?.metrics.estimatedDnTADb === "number"
  );
}

function hasReceivingRoomRt60(result: AssemblyCalculation | null): boolean {
  return typeof result?.ratings.field?.receivingRoomRt60S === "number";
}

function getSelectedMissingPhysicalInputs(result: AssemblyCalculation | null): readonly string[] {
  if (result?.airborneCandidateResolution?.selectedOrigin !== "needs_input") {
    return [];
  }

  return result.airborneBasis?.missingPhysicalInputs ?? [];
}

function getApparentCurveLabel(result: AssemblyCalculation | null): string {
  if (result?.airborneOverlay?.leakagePenaltyApplied || result?.airborneOverlay?.fieldFlankingPenaltyApplied) {
    return "final apparent curve after the active leakage and flanking overlays";
  }

  return "final apparent airborne curve";
}

export function isFieldAirborneOutput(output: RequestedOutputId): boolean {
  return FIELD_AIRBORNE_OUTPUTS.has(output);
}

export function getFieldAirborneRouteLabel(result: AssemblyCalculation | null): string {
  switch (result?.airborneOverlay?.contextMode) {
    case "field_between_rooms":
      return "Room-to-room field route";
    case "building_prediction":
      return "Building prediction route";
    default:
      return "Field/building airborne route";
  }
}

export function getFieldAirborneModeLabel(result: AssemblyCalculation | null): string {
  switch (result?.airborneOverlay?.contextMode) {
    case "field_between_rooms":
      return "Room-to-room field";
    case "building_prediction":
      return "Building prediction";
    default:
      return "Field/building route";
  }
}

export function getFieldAirborneBlockingRequirement(
  output: RequestedOutputId,
  result: AssemblyCalculation | null
): FieldAirborneBlockingRequirement | null {
  if (!isFieldAirborneOutput(output)) {
    return null;
  }

  if (output === "DnT,A,k") {
    return typeof result?.ratings.field?.DnTAk === "number" || typeof result?.metrics.estimatedDnTAkDb === "number"
      ? null
      : "curated_field_source";
  }

  if (!hasFieldAirborneMode(result)) {
    return "field_mode";
  }

  if (
    result?.airborneOverlay?.contextMode === "building_prediction" &&
    result.airborneCandidateResolution?.selectedOrigin === "unsupported"
  ) {
    return "building_prediction_owner";
  }

  const selectedMissingInputs = getSelectedMissingPhysicalInputs(result);
  if (selectedMissingInputs.includes("contextMode")) {
    return "field_mode";
  }
  if (
    selectedMissingInputs.includes("partitionAreaM2") ||
    selectedMissingInputs.includes("panelWidthMm") ||
    selectedMissingInputs.includes("panelHeightMm")
  ) {
    return "partition_geometry";
  }
  if (selectedMissingInputs.includes("receivingRoomVolumeM3")) {
    return "room_volume";
  }
  if (selectedMissingInputs.includes("receivingRoomRt60S")) {
    return "rt60";
  }
  if (
    selectedMissingInputs.includes("sourceRoomVolumeM3") ||
    selectedMissingInputs.includes("flankingJunctionClass") ||
    selectedMissingInputs.includes("conservativeFlankingAssumption") ||
    selectedMissingInputs.includes("junctionCouplingLengthM") ||
    selectedMissingInputs.includes("buildingPredictionOutputBasis")
  ) {
    return "building_prediction_owner";
  }

  if (output === "R'w") {
    return null;
  }

  if (AREA_NORMALIZED_AIRBORNE_OUTPUTS.has(output)) {
    return hasPartitionGeometry(result) ? null : "partition_geometry";
  }

  if (STANDARDIZED_AIRBORNE_OUTPUTS.has(output)) {
    if (hasReceivingRoomVolume(result) && hasReceivingRoomRt60(result)) {
      return null;
    }

    if (!hasPartitionGeometry(result)) {
      return "partition_geometry";
    }

    return hasReceivingRoomVolume(result) ? "rt60" : "room_volume";
  }

  return null;
}

export function getFieldAirbornePendingLabel(
  output: RequestedOutputId,
  result: AssemblyCalculation | null
): string {
  switch (getFieldAirborneBlockingRequirement(output, result)) {
    case "building_prediction_owner":
      return "Need flanking owner";
    case "curated_field_source":
      return "Need curated field source";
    case "field_mode":
      return "Need field/building mode";
    case "partition_geometry":
      return "Need partition geometry";
    case "room_volume":
      return "Need room volume";
    case "rt60":
      return "Need RT60";
    default:
      return "Pending";
  }
}

export function getFieldAirbornePendingDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null
): string {
  const routeLabel = getFieldAirborneRouteLabel(result);

  switch (getFieldAirborneBlockingRequirement(output, result)) {
    case "building_prediction_owner":
      return `Building prediction route is active, but ${output} stays parked until source-room volume, flanking/junction class, conservative flanking assumption, junction coupling length, and building output basis are owned. DAC will not reuse Gate I field budgets or lab values as building-prediction evidence.`;
    case "curated_field_source":
      return `${output} stays unavailable until a curated official field source publishes it for the current airborne assembly.`;
    case "field_mode":
      return `DAC keeps ${output} parked until the airborne lane leaves lab mode and becomes an apparent field or building route.`;
    case "partition_geometry":
      return `${routeLabel} is active, but ${output} still needs partition width and height before DAC can derive it from the apparent field curve.`;
    case "room_volume":
      return `${routeLabel} is active, but ${output} still needs the receiving-room volume before DAC can standardize the apparent field curve.`;
    case "rt60":
      return `${routeLabel} is active, but ${output} still needs receiving-room RT60 before the Gate I field-context adapter can defend this output.`;
    default:
      return "";
  }
}

export function getFieldAirborneStatusLabel(
  output: RequestedOutputId,
  result: AssemblyCalculation | null
): string {
  if (getGateARAirborneBuildingPredictionSurface(result)) {
    return output === "R'w" ? "Building apparent" : "Building standardized";
  }

  if (output === "DnT,A,k") {
    return getDnTAkLiveLabel(result);
  }

  if (output === "R'w") {
    return "Apparent field";
  }

  if (AREA_NORMALIZED_AIRBORNE_OUTPUTS.has(output)) {
    return "Area-normalized";
  }

  if (STANDARDIZED_AIRBORNE_OUTPUTS.has(output)) {
    return "Room-standardized";
  }

  return "Field live";
}

export function getFieldAirborneLiveDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null
): string {
  const routeLabel = getFieldAirborneRouteLabel(result);
  const curveLabel = getApparentCurveLabel(result);
  const rockwoolPolicy = getRockwoolTripleLeafScreeningPolicyCopy(result);
  const rockwoolScreeningBridge = rockwoolPolicy ? `${rockwoolPolicy.fieldDetail} ` : "";
  const gateARSurface = getGateARAirborneBuildingPredictionSurface(result);
  const gateISurface = getGateIAirborneFieldContextSurface(result);
  const basisGuard = gateARSurface
    ? `${FIELD_CONTINUATION_BASIS_GUARD} ${gateARSurface.detail}`
    : gateISurface
      ? `${FIELD_CONTINUATION_BASIS_GUARD} ${gateISurface.detail}`
      : FIELD_CONTINUATION_BASIS_GUARD;

  if (output === "R'w") {
    return `${routeLabel} is active. R'w is being read as the apparent on-site airborne single number from the ${curveLabel}. ${rockwoolScreeningBridge}${basisGuard}`;
  }

  if (output === "Dn,w") {
    return `${routeLabel} is active. Dn,w is being derived from the same apparent field curve using the current partition area only. ${rockwoolScreeningBridge}${basisGuard}`;
  }

  if (output === "Dn,A") {
    return `${routeLabel} is active. Dn,A is being carried as Dn,w + C from the same apparent field curve and partition area. ${rockwoolScreeningBridge}${basisGuard}`;
  }

  if (output === "DnT,w") {
    return `${routeLabel} is active. DnT,w is being standardized from the same apparent field curve using the current partition area and receiving-room volume. ${rockwoolScreeningBridge}${basisGuard}`;
  }

  if (output === "DnT,A") {
    return `${routeLabel} is active. DnT,A is being carried as DnT,w + C on the standardized field lane. ${rockwoolScreeningBridge}${basisGuard}`;
  }

  if (output === "DnT,A,k") {
    return `${routeLabel} is active. ${getDnTAkDetail(result)}. ${rockwoolScreeningBridge}${basisGuard}`;
  }

  return `${routeLabel} is active for ${output}.`;
}

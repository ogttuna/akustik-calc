import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

import { getDnTAkDetail, getDnTAkLiveLabel } from "./dntak-source-mode";

export const FIELD_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "DnT,A,k"]);
export const STANDARDIZED_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["DnT,w", "DnT,A"]);

const AREA_NORMALIZED_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["Dn,w", "Dn,A"]);

type FieldAirborneBlockingRequirement =
  | "curated_field_source"
  | "field_mode"
  | "partition_geometry"
  | "room_volume";

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

  if (output === "R'w") {
    return null;
  }

  if (AREA_NORMALIZED_AIRBORNE_OUTPUTS.has(output)) {
    return hasPartitionGeometry(result) ? null : "partition_geometry";
  }

  if (STANDARDIZED_AIRBORNE_OUTPUTS.has(output)) {
    if (hasReceivingRoomVolume(result)) {
      return null;
    }

    return hasPartitionGeometry(result) ? "room_volume" : "partition_geometry";
  }

  return null;
}

export function getFieldAirbornePendingLabel(
  output: RequestedOutputId,
  result: AssemblyCalculation | null
): string {
  switch (getFieldAirborneBlockingRequirement(output, result)) {
    case "curated_field_source":
      return "Need curated field source";
    case "field_mode":
      return "Need field/building mode";
    case "partition_geometry":
      return "Need partition geometry";
    case "room_volume":
      return "Need room volume";
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
    case "curated_field_source":
      return `${output} stays unavailable until a curated official field source publishes it for the current airborne assembly.`;
    case "field_mode":
      return `DynEcho keeps ${output} parked until the airborne lane leaves lab mode and becomes an apparent field or building route.`;
    case "partition_geometry":
      return `${routeLabel} is active, but ${output} still needs partition width and height before DynEcho can derive it from the apparent field curve.`;
    case "room_volume":
      return `${routeLabel} is active, but ${output} still needs the receiving-room volume before DynEcho can standardize the apparent field curve.`;
    default:
      return "";
  }
}

export function getFieldAirborneStatusLabel(
  output: RequestedOutputId,
  result: AssemblyCalculation | null
): string {
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

  if (output === "R'w") {
    return `${routeLabel} is active. R'w is being read as the apparent on-site airborne single number from the ${curveLabel}.`;
  }

  if (output === "Dn,w") {
    return `${routeLabel} is active. Dn,w is being derived from the same apparent field curve using the current partition area only.`;
  }

  if (output === "Dn,A") {
    return `${routeLabel} is active. Dn,A is being carried as Dn,w + C from the same apparent field curve and partition area.`;
  }

  if (output === "DnT,w") {
    return `${routeLabel} is active. DnT,w is being standardized from the same apparent field curve using the current partition area and receiving-room volume.`;
  }

  if (output === "DnT,A") {
    return `${routeLabel} is active. DnT,A is being carried as DnT,w + C on the standardized field lane.`;
  }

  if (output === "DnT,A,k") {
    return `${routeLabel} is active. ${getDnTAkDetail(result)}.`;
  }

  return `${routeLabel} is active for ${output}.`;
}

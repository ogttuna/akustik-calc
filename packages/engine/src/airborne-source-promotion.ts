import type {
  AirborneCandidateRejectionReason,
  AirborneResultOrigin,
  DynamicAirborneFamily,
  RequestedOutputId
} from "@dynecho/shared";

export type AirborneSourcePromotionMode = "exact_full_stack" | "calibrated_family" | "anchored_delta";

export type AirborneSourceMetricScope = "element_lab" | "building_prediction" | "field_measurement";

export type AirborneSourceCalibrationMetadata = {
  calibrationSetId?: string;
  failureCaseIds: readonly string[];
  holdoutSetId?: string;
  holdoutTestIds: readonly string[];
  holdoutToleranceDb?: number;
  rightsSafeCalibrationCurves: boolean;
};

export type AirborneSourceAnchorMetadata = {
  anchorSourceId?: string;
  deltaLayerSetId?: string;
  deltaMethod?: string;
};

export type AirborneSourcePromotionInput = {
  anchor?: AirborneSourceAnchorMetadata;
  calibration?: AirborneSourceCalibrationMetadata;
  candidateId: string;
  mode: AirborneSourcePromotionMode;
  requested: {
    family: DynamicAirborneFamily;
    materialFingerprint?: string;
    metricIds: readonly RequestedOutputId[];
    metricScope: AirborneSourceMetricScope;
    topologyFingerprint?: string;
  };
  source: {
    family: DynamicAirborneFamily;
    materialFingerprint?: string;
    materialOwner: boolean;
    metricContextOwner: boolean;
    metricIds: readonly RequestedOutputId[];
    metricScope: AirborneSourceMetricScope;
    negativeBoundaryTestIds: readonly string[];
    positiveTestIds: readonly string[];
    rightsSafeSourceOwnedCurvePayload: boolean;
    sourceId: string;
    toleranceOwner: boolean;
    topologyFingerprint?: string;
    topologyOwner: boolean;
  };
};

export type AirborneSourcePromotionDecision = {
  candidateId: string;
  eligible: boolean;
  evidenceIds: readonly string[];
  origin: AirborneResultOrigin;
  rejectionReasons: readonly AirborneCandidateRejectionReason[];
  sourceId: string;
};

function hasText(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function pushReason(
  reasons: AirborneCandidateRejectionReason[],
  code: string,
  detail: string
): void {
  reasons.push({ code, detail });
}

function originForMode(mode: AirborneSourcePromotionMode): AirborneResultOrigin {
  switch (mode) {
    case "exact_full_stack":
      return "measured_exact_full_stack";
    case "calibrated_family":
      return "calibrated_family_physics";
    case "anchored_delta":
      return "measured_exact_subassembly_plus_calculated_delta";
  }
}

function pushCommonSourceOwnerReasons(input: AirborneSourcePromotionInput, reasons: AirborneCandidateRejectionReason[]): void {
  if (!input.source.rightsSafeSourceOwnedCurvePayload) {
    pushReason(
      reasons,
      "source_rights_missing",
      "Source promotion requires a rights-safe source-owned curve or rating payload."
    );
  }

  if (!input.source.metricContextOwner) {
    pushReason(reasons, "metric_context_owner_missing", "Source row must own the lab/field/building metric context.");
  }

  if (!input.source.toleranceOwner) {
    pushReason(reasons, "tolerance_owner_missing", "Source row must own the tolerance used by exact or calibration promotion.");
  }

  if (input.source.metricScope !== input.requested.metricScope) {
    pushReason(
      reasons,
      "metric_scope_mismatch",
      `Source metric scope ${input.source.metricScope} cannot promote requested scope ${input.requested.metricScope}.`
    );
  }

  const missingMetrics = input.requested.metricIds.filter((metricId) => !input.source.metricIds.includes(metricId));
  if (missingMetrics.length > 0) {
    pushReason(reasons, "metric_ownership_missing", `Source row does not own requested metric(s): ${missingMetrics.join(", ")}.`);
  }

  if (input.source.positiveTestIds.length === 0 || input.source.negativeBoundaryTestIds.length === 0) {
    pushReason(
      reasons,
      "paired_tests_missing",
      "Source promotion requires paired positive and negative boundary tests."
    );
  }
}

function pushExactOwnerReasons(input: AirborneSourcePromotionInput, reasons: AirborneCandidateRejectionReason[]): void {
  if (!input.source.topologyOwner) {
    pushReason(reasons, "topology_owner_missing", "Exact source promotion requires topology ownership.");
  }

  if (!input.source.materialOwner) {
    pushReason(reasons, "material_owner_missing", "Exact source promotion requires material ownership.");
  }

  if (input.source.topologyFingerprint !== input.requested.topologyFingerprint) {
    pushReason(
      reasons,
      "topology_scope_mismatch",
      "Exact source promotion is limited to the owned topology fingerprint."
    );
  }

  if (input.source.materialFingerprint !== input.requested.materialFingerprint) {
    pushReason(
      reasons,
      "material_scope_mismatch",
      "Exact source promotion is limited to the owned material fingerprint."
    );
  }
}

function pushCalibrationReasons(input: AirborneSourcePromotionInput, reasons: AirborneCandidateRejectionReason[]): void {
  if (input.source.family !== input.requested.family) {
    pushReason(reasons, "family_scope_mismatch", "Calibration rows can calibrate only their owned family.");
  }

  if (!input.calibration?.rightsSafeCalibrationCurves) {
    pushReason(
      reasons,
      "calibration_curve_rights_missing",
      "Family calibration requires rights-safe calibration curves."
    );
  }

  if (!hasText(input.calibration?.calibrationSetId) || !hasText(input.calibration?.holdoutSetId)) {
    pushReason(reasons, "calibration_metadata_missing", "Family calibration requires calibration and holdout set ids.");
  }

  if (!input.calibration?.holdoutToleranceDb || input.calibration.holdoutToleranceDb <= 0) {
    pushReason(reasons, "holdout_tolerance_missing", "Family calibration requires a positive holdout tolerance.");
  }

  if ((input.calibration?.holdoutTestIds.length ?? 0) === 0 || (input.calibration?.failureCaseIds.length ?? 0) === 0) {
    pushReason(
      reasons,
      "holdout_tests_missing",
      "Family calibration requires holdout tests and documented failure cases."
    );
  }
}

function pushAnchorReasons(input: AirborneSourcePromotionInput, reasons: AirborneCandidateRejectionReason[]): void {
  if (!hasText(input.anchor?.anchorSourceId)) {
    pushReason(reasons, "anchor_source_missing", "Anchored delta promotion requires an exact subassembly anchor source id.");
  }

  if (!hasText(input.anchor?.deltaMethod) || !hasText(input.anchor?.deltaLayerSetId)) {
    pushReason(reasons, "delta_method_missing", "Anchored delta promotion requires a named delta method and delta layer set.");
  }
}

export function evaluateAirborneSourcePromotionReadiness(
  input: AirborneSourcePromotionInput
): AirborneSourcePromotionDecision {
  const rejectionReasons: AirborneCandidateRejectionReason[] = [];

  pushCommonSourceOwnerReasons(input, rejectionReasons);

  if (input.mode === "exact_full_stack") {
    pushExactOwnerReasons(input, rejectionReasons);
  }

  if (input.mode === "calibrated_family") {
    // Calibration is family-scoped; it may improve the physics lane but it
    // cannot become measured exact for a different full-stack fingerprint.
    pushCalibrationReasons(input, rejectionReasons);
  }

  if (input.mode === "anchored_delta") {
    pushAnchorReasons(input, rejectionReasons);
  }

  const evidenceIds = [
    input.source.sourceId,
    ...input.source.positiveTestIds,
    ...input.source.negativeBoundaryTestIds,
    input.calibration?.calibrationSetId,
    input.calibration?.holdoutSetId,
    ...(input.calibration?.holdoutTestIds ?? []),
    ...(input.calibration?.failureCaseIds ?? []),
    input.anchor?.anchorSourceId,
    input.anchor?.deltaLayerSetId
  ].filter(hasText);

  return {
    candidateId: input.candidateId,
    eligible: rejectionReasons.length === 0,
    evidenceIds,
    origin: originForMode(input.mode),
    rejectionReasons,
    sourceId: input.source.sourceId
  };
}

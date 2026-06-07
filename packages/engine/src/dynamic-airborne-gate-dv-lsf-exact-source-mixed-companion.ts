import type {
  AirborneContext,
  AirborneResultBasis,
  DynamicAirborneFamily,
  RequestedOutputId,
  TransmissionLossCurve
} from "@dynecho/shared";

export const GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD =
  "gate_dv_lsf_exact_rw_calculated_lab_companion_runtime";

export const GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID =
  "candidate_lsf_exact_rw_calculated_lab_companions";

export const GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_EXACT_SOURCE_ID =
  "knauf_lab_416889_primary_2026";

export const GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_WARNING =
  "LSF mixed lab request uses an exact Rw source anchor and calculated STC/C/Ctr companions; the source row is not treated as owning unreported companion metrics.";

type VerifiedAirborneCatalogMatchLike = {
  readonly id: string;
  readonly label: string;
  readonly metricLabel: string;
  readonly metricValue?: number;
  readonly sourceMode: "field" | "lab";
};

const MIXED_LAB_COMPANION_OUTPUTS = new Set<RequestedOutputId>(["Rw", "STC", "C", "Ctr"]);
const MIXED_LAB_SPECTRUM_COMPANIONS = new Set<RequestedOutputId>(["STC", "C", "Ctr"]);

function isElementLabContext(context: AirborneContext | null | undefined): boolean {
  return !context?.contextMode || context.contextMode === "element_lab";
}

function isExactRwPlusCalculatedCompanionRequest(targetOutputs: readonly RequestedOutputId[]): boolean {
  if (targetOutputs.length === 0 || !targetOutputs.includes("Rw")) {
    return false;
  }

  if (!targetOutputs.some((output) => MIXED_LAB_SPECTRUM_COMPANIONS.has(output))) {
    return false;
  }

  return targetOutputs.every((output) => MIXED_LAB_COMPANION_OUTPUTS.has(output));
}

export function maybeBuildGateDVLsfExactRwCalculatedCompanionBasis(input: {
  readonly airborneContext?: AirborneContext | null;
  readonly dynamicFamily?: DynamicAirborneFamily | null;
  readonly sourceMatch?: VerifiedAirborneCatalogMatchLike | null;
  readonly strategy?: string | null;
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly transmissionLossCurve?: TransmissionLossCurve | null;
}): AirborneResultBasis | null {
  if (
    input.dynamicFamily !== "stud_wall_system" ||
    !isElementLabContext(input.airborneContext) ||
    !isExactRwPlusCalculatedCompanionRequest(input.targetOutputs) ||
    input.sourceMatch?.id !== GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_EXACT_SOURCE_ID ||
    input.sourceMatch.sourceMode !== "lab" ||
    input.sourceMatch.metricLabel !== "Rw" ||
    typeof input.sourceMatch.metricValue !== "number" ||
    !Number.isFinite(input.sourceMatch.metricValue)
  ) {
    return null;
  }

  return {
    assumptions: [
      `Exact full-stack source ${input.sourceMatch.id} owns Rw ${input.sourceMatch.metricValue.toFixed(1)} dB for this lab LSF stack.`,
      "STC, C, and Ctr remain calculated from the selected dynamic transmission-loss curve and rating adapters.",
      "The mixed answer is not promoted to measured_exact_full_stack because the source row does not report every requested companion metric.",
      "Field and building outputs remain separate route owners; lab Rw is not relabelled as R'w, Dn,w, or DnT,w.",
      `current dynamic strategy remains ${input.strategy ?? "stud_surrogate_blend+framed_wall_calibration"}`
    ],
    calculationStandard: "engine_double_leaf_cavity",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 6,
    exactSourceId: input.sourceMatch.id,
    family: "stud_wall_system",
    frequencyBands:
      input.transmissionLossCurve && input.transmissionLossCurve.frequenciesHz.length > 0
        ? {
            bandSet: "dynamic_airborne_delegate_grid",
            frequenciesHz: [...input.transmissionLossCurve.frequenciesHz]
          }
        : undefined,
    kind: "airborne_physics_prediction",
    measurementStandard: "source_report",
    method: GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "exactFullStackSource:Rw",
      "calculatedTransmissionLossCurve",
      "ISO717-1 C/Ctr rating adapter",
      "ASTM E413 STC rating adapter"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}

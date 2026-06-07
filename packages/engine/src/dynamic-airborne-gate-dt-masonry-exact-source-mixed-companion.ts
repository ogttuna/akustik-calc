import type {
  AirborneContext,
  AirborneResultBasis,
  DynamicAirborneFamily,
  RequestedOutputId,
  TransmissionLossCurve
} from "@dynecho/shared";

export const GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD =
  "gate_dt_masonry_exact_rw_calculated_lab_companion_runtime";

export const GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID =
  "candidate_masonry_exact_rw_calculated_lab_companions";

export const GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_WARNING =
  "Masonry mixed lab request uses an exact Rw source anchor and calculated STC/C/Ctr companions; the source row is not treated as owning unreported companion metrics.";

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

export function maybeBuildGateDTMasonryExactRwCalculatedCompanionBasis(input: {
  readonly airborneContext?: AirborneContext | null;
  readonly dynamicFamily?: DynamicAirborneFamily | null;
  readonly sourceMatch?: VerifiedAirborneCatalogMatchLike | null;
  readonly strategy?: string | null;
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly transmissionLossCurve?: TransmissionLossCurve | null;
}): AirborneResultBasis | null {
  if (
    input.dynamicFamily !== "masonry_nonhomogeneous" ||
    !isElementLabContext(input.airborneContext) ||
    !isExactRwPlusCalculatedCompanionRequest(input.targetOutputs) ||
    input.sourceMatch?.sourceMode !== "lab" ||
    input.sourceMatch.metricLabel !== "Rw" ||
    typeof input.sourceMatch.metricValue !== "number" ||
    !Number.isFinite(input.sourceMatch.metricValue)
  ) {
    return null;
  }

  return {
    assumptions: [
      `Exact full-stack source ${input.sourceMatch.id} owns Rw ${input.sourceMatch.metricValue.toFixed(1)} dB for this lab masonry stack.`,
      "STC, C, and Ctr remain calculated from the selected dynamic transmission-loss curve and rating adapters.",
      "The mixed answer is not promoted to measured_exact_full_stack because the source row does not report every requested companion metric.",
      "Field and building outputs remain separate route owners; lab Rw is not relabelled as R'w, Dn,w, or DnT,w.",
      `current dynamic strategy remains ${input.strategy ?? "masonry_nonhomogeneous_blend"}`
    ],
    calculationStandard: "engine_mass_law",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 6,
    exactSourceId: input.sourceMatch.id,
    family: "masonry_nonhomogeneous",
    frequencyBands:
      input.transmissionLossCurve && input.transmissionLossCurve.frequenciesHz.length > 0
        ? {
            bandSet: "dynamic_airborne_delegate_grid",
            frequenciesHz: [...input.transmissionLossCurve.frequenciesHz]
          }
        : undefined,
    kind: "airborne_physics_prediction",
    measurementStandard: "source_report",
    method: GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
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

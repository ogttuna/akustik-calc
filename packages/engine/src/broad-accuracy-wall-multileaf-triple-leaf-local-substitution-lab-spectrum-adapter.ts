import {
  RatingAdapterBasisSchema,
  type AirborneContext,
  type AirborneResultBasis,
  type RatingAdapterBasis,
  type RequestedOutputId
} from "@dynecho/shared";

import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTION_STATUS
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-coverage-refresh";
import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD } from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_LANDED_GATE =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTION_STATUS =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_landed_selected_surface_parity";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity-contract.test.ts";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_LABEL =
  "wall triple-leaf local substitution lab spectrum adapter surface parity";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD =
  "broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_runtime";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID =
  "candidate_broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_family_physics_prediction";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING =
  "Wall triple-leaf local substitution lab spectrum adapter is active: STC, C, and Ctr are rated from the calculated local-substitution transmission-loss curve. It is source-absent, keeps the parent not-measured budget, and does not alias field or building outputs.";

const LAB_SPECTRUM_OUTPUTS = new Set<RequestedOutputId>(["C", "Ctr", "STC"]);

export type BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterResult = {
  basis: AirborneResultBasis;
  ratingAdapterBasisSet: readonly RatingAdapterBasis[];
  supportedOutputs: readonly RequestedOutputId[];
  warning: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING;
};

export type BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterContract = {
  landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_LANDED_GATE;
  previousCoverageRefresh: {
    landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTION_STATUS;
  };
  ratingAdapterBasisIds: readonly [
    "astm_e413_stc_from_airborne_transmission_loss_curve",
    "iso_717_1_c_from_airborne_transmission_loss_curve",
    "iso_717_1_ctr_from_airborne_transmission_loss_curve"
  ];
  runtimeMethod: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD;
  runtimeValueMovement: true;
  selectedCandidateId: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID;
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTION_STATUS;
  supportedRuntimeOutputs: readonly ["STC", "C", "Ctr"];
};

function isElementLabContext(context?: AirborneContext | null): boolean {
  return !context?.contextMode || context.contextMode === "element_lab";
}

function requestedLabSpectrumOutputs(targetOutputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return targetOutputs.filter((output) => LAB_SPECTRUM_OUTPUTS.has(output));
}

function buildRatingAdapterBasis(metricId: "C" | "Ctr" | "STC"): RatingAdapterBasis {
  if (metricId === "STC") {
    return RatingAdapterBasisSchema.parse({
      adapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
      aliasBlocks: [
        {
          fromMetricId: "Rw",
          reason:
            "The local-substitution adapter does not copy Rw into STC; it rates the calculated transmission-loss curve with ASTM E413.",
          toMetricId: "STC"
        },
        {
          fromMetricId: "DnT,w",
          reason:
            "The local-substitution lab adapter owns only element-lab STC. Field and building metrics require separate context owners.",
          toMetricId: "STC"
        }
      ],
      contextBasis: "element_lab",
      implementationStatus: "runtime_adapter",
      inputBasis: "airborne_transmission_loss_curve",
      metricFamily: "airborne",
      metricId,
      notes: [
        "The parent local-substitution Rw corridor supplies the calculated transmission-loss curve.",
        "STC is re-rated with ASTM E413 from that curve and keeps the parent source-absent budget.",
        "No measured source row, field metric, or building prediction metric is promoted by this adapter."
      ],
      ratingStandard: "ASTM E413",
      requiredContextInputs: [
        "completeGroupedTripleLeafTopology",
        "localSubstitutionCalculatedTransmissionLossCurve",
        "ASTM E413 contour owner"
      ],
      sourceMetricIds: ["Rw"]
    });
  }

  return RatingAdapterBasisSchema.parse({
    adapterId: "iso_717_1_rw_from_airborne_transmission_loss_curve",
    aliasBlocks: [
      {
        fromMetricId: "Rw",
        reason:
          `The local-substitution adapter does not copy Rw into ${metricId}; it evaluates the ISO 717-1 spectrum-adaptation term from the calculated curve.`,
        toMetricId: metricId
      }
    ],
    contextBasis: "element_lab",
    implementationStatus: "runtime_adapter",
    inputBasis: "airborne_transmission_loss_curve",
    metricFamily: "airborne",
    metricId,
    notes: [
      "The parent local-substitution Rw corridor supplies the calculated transmission-loss curve.",
      `${metricId} is calculated as an ISO 717-1 spectrum-adaptation term from that curve.`,
      "No measured source row, field metric, or building prediction metric is promoted by this adapter."
    ],
    ratingStandard: "ISO 717-1",
    requiredContextInputs: [
      "completeGroupedTripleLeafTopology",
      "localSubstitutionCalculatedTransmissionLossCurve",
      "ISO 717-1 spectrum term owner"
    ],
    sourceMetricIds: ["Rw"]
  });
}

export function maybeBuildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapter(input: {
  airborneContext?: AirborneContext | null;
  basis?: AirborneResultBasis | null;
  sourceAnchorApplied: boolean;
  targetOutputs: readonly RequestedOutputId[];
}): BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterResult | null {
  const supportedOutputs = requestedLabSpectrumOutputs(input.targetOutputs);

  if (
    supportedOutputs.length === 0 ||
    input.sourceAnchorApplied ||
    !isElementLabContext(input.airborneContext) ||
    !input.basis
  ) {
    return null;
  }

  const basis = input.basis;
  const frequenciesHz = basis.frequencyBands?.frequenciesHz;

  if (
    basis.method !== BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD ||
    basis.origin !== "family_physics_prediction" ||
    basis.curveBasis !== "calculated_frequency_curve" ||
    basis.ratingStandard !== "ISO 717-1" ||
    basis.missingPhysicalInputs.length > 0 ||
    !frequenciesHz?.length
  ) {
    return null;
  }

  const hasStc = supportedOutputs.includes("STC");
  const hasIsoSpectrumTerms = supportedOutputs.some((output) => output === "C" || output === "Ctr");
  const adapterRequiredInputs = [
    ...(hasStc
      ? ["BroadAccuracyLocalSubstitutionLabSpectrumAdapter:ASTM E413 STC from calculated TL curve"]
      : []),
    ...(hasIsoSpectrumTerms
      ? ["BroadAccuracyLocalSubstitutionLabSpectrumAdapter:ISO 717-1 C/Ctr from calculated TL curve"]
      : [])
  ];

  return {
    basis: {
      ...basis,
      assumptions: [
        ...basis.assumptions.filter(
          (assumption) => !/STC, C, Ctr, field, and building outputs remain unsupported/i.test(assumption)
        ),
        "the local-substitution lab spectrum adapter promotes only STC, C, and Ctr from the calculated element-lab transmission-loss curve",
        "STC is rated with ASTM E413 and C/Ctr are rated as ISO 717-1 spectrum-adaptation terms; none are copied from Rw",
        "field and building outputs remain unsupported until separately owned context adapters exist"
      ],
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      missingSourceEvidence: [
        ...basis.missingSourceEvidence.filter((evidence) => evidence !== "stc_c_ctr_adapter_owner_absent"),
        "source_owned_same_stack_stc_c_ctr_holdout_absent"
      ],
      requiredInputs: [...basis.requiredInputs, ...adapterRequiredInputs]
    },
    ratingAdapterBasisSet: supportedOutputs.map((output) =>
      buildRatingAdapterBasis(output as "C" | "Ctr" | "STC")
    ),
    supportedOutputs,
    warning: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING
  };
}

export function buildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterContract():
  BroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterContract {
  return {
    landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_LANDED_GATE,
    previousCoverageRefresh: {
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTION_STATUS
    },
    ratingAdapterBasisIds: [
      "astm_e413_stc_from_airborne_transmission_loss_curve",
      "iso_717_1_c_from_airborne_transmission_loss_curve",
      "iso_717_1_ctr_from_airborne_transmission_loss_curve"
    ],
    runtimeMethod: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
    runtimeValueMovement: true,
    selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
    selectedNextAction:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION,
    selectedNextFile:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE,
    selectedNextLabel:
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTION_STATUS,
    supportedRuntimeOutputs: ["STC", "C", "Ctr"]
  };
}

import type { FloorSystemEstimateResult, ImpactPredictorInput } from "@dynecho/shared";

import {
  buildPredictorFamilyEstimateCase,
  normalizePredictorToken
} from "./predictor-family-estimate-shared";

function thicknessNear(value: number | undefined, target: number, tolerance = 3): boolean {
  return typeof value === "number" && Math.abs(value - target) <= tolerance;
}

function deriveConcreteCombinedLowConfidenceEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "reinforced_concrete" ||
    input.impactSystemType !== "combined_upper_lower_system" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "vinyl_flooring" ||
    input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger"
  ) {
    return null;
  }

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 65.9,
      RwCtr: 57,
      RwCtrSemantic: "rw_plus_ctr"
    },
    candidateIds: [
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
      "knauf_cc60_1a_concrete150_carpet_lab_2026",
      "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
      "euracoustics_f0_bare_concrete_lab_2026",
      "euracoustics_f1_rigid_ceiling_concrete_lab_2026"
    ],
    candidateScores: [5, 5, 5.5, 7, 7.2],
    impactRatings: {
      LnW: 50
    },
    kind: "low_confidence",
    noteLabel: "Reinforced-concrete combined low-confidence fallback",
    structuralFamily: "reinforced concrete"
  });
}

function deriveSteelSuspendedLowConfidenceEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "steel_joists" ||
    input.impactSystemType !== "suspended_ceiling_only" ||
    input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "vinyl_flooring"
  ) {
    return null;
  }

  const supportForm = normalizePredictorToken(input.supportForm);

  if (supportForm === "open_web_or_rolled") {
    return buildPredictorFamilyEstimateCase({
      airborneRatings: {
        Rw: 63.1,
        RwCtr: 57.7,
        RwCtrSemantic: "rw_plus_ctr"
      },
      candidateIds: [
        "ubiq_fl33_open_web_steel_200_lab_2026",
        "ubiq_fl33_open_web_steel_300_lab_2026",
        "ubiq_fl28_open_web_steel_200_exact_lab_2026",
        "ubiq_fl28_open_web_steel_300_exact_lab_2026",
        "ubiq_fl28_open_web_steel_400_exact_lab_2026"
      ],
      candidateScores: [5.8, 5.8, 6.7, 6.7, 7.3],
      impactRatings: {
        CI: -1.7,
        LnW: 51,
        LnWPlusCI: 49.3
      },
      kind: "low_confidence",
      noteLabel: "Open-web steel suspended-ceiling low-confidence fallback",
      sourceSystemIds: [
        "ubiq_fl28_open_web_steel_200_exact_lab_2026",
        "ubiq_fl28_open_web_steel_300_exact_lab_2026",
        "ubiq_fl28_open_web_steel_400_exact_lab_2026"
      ],
      structuralFamily: "lightweight steel"
    });
  }

  if (supportForm === "joist_or_purlin") {
    return buildPredictorFamilyEstimateCase({
      airborneRatings: {
        Rw: 61,
        RwCtr: 57,
        RwCtrSemantic: "rw_plus_ctr"
      },
      candidateIds: [
        "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
        "ubiq_fl32_steel_200_lab_2026",
        "ubiq_fl32_steel_300_lab_2026",
        "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
        "pliteq_steel_joist_250_rst02_wood_lab_2026"
      ],
      candidateScores: [5.2, 6.4, 6.4, 7.1, 7.6],
      impactRatings: {
        LnW: 58.3
      },
      kind: "low_confidence",
      noteLabel: "Steel joist suspended-ceiling low-confidence fallback",
      sourceSystemIds: [
        "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
        "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
        "pliteq_steel_joist_250_rst02_wood_lab_2026"
      ],
      structuralFamily: "lightweight steel"
    });
  }

  return null;
}

function deriveTimberDirectCeilingLowConfidenceEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "timber_joists" ||
    normalizePredictorToken(input.supportForm) !== "joist_or_purlin" ||
    input.impactSystemType !== "suspended_ceiling_only" ||
    input.lowerTreatment?.type !== "direct_fixed_ceiling" ||
    normalizePredictorToken(input.lowerTreatment?.supportClass) !== "direct_to_joists" ||
    normalizePredictorToken(input.lowerTreatment?.boardMaterialClass) !== "firestop_board" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "ceramic_tile"
  ) {
    return null;
  }

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 51.8,
      RwCtr: 45.1,
      RwCtrSemantic: "rw_plus_ctr"
    },
    candidateIds: [
      "knauf_ct30_1a_timber_lab_2026",
      "knauf_ct30_2a_timber_lab_2026",
      "knauf_ct30_1b_timber_lab_2026",
      "knauf_ct30_2b_timber_lab_2026",
      "knauf_ct2d_timber_r25_lab_2026"
    ],
    candidateScores: [2.5, 2.9, 3.3, 3.7, 4.1],
    impactRatings: {
      LnW: 69.9
    },
    kind: "low_confidence",
    noteLabel: "Timber direct-ceiling joist-tagged low-confidence fallback",
    structuralFamily: "timber frame / joist"
  });
}

function deriveTimberBareLowConfidenceEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "timber_joists" ||
    input.impactSystemType !== "bare_floor" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "laminate_flooring"
  ) {
    return null;
  }

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 51.6,
      RwCtr: 31.1
    },
    candidateIds: [
      "dataholz_gdsnxn01a_timber_frame_lab_2026",
      "knauf_ct3b_timber_nil_lab_2026",
      "knauf_ct2a_timber_nil_lab_2026",
      "knauf_ct2a_carpet_nil_lab_2026",
      "knauf_ct2d_timber_nil_lab_2026"
    ],
    candidateScores: [4.8, 5.1, 5.5, 5.9, 6.1],
    impactRatings: {
      CI: 2,
      LnW: 61.3,
      LnWPlusCI: 63.3
    },
    kind: "low_confidence",
    noteLabel: "Timber bare-floor nil-ceiling low-confidence fallback",
    structuralFamily: "timber frame / joist"
  });
}

function deriveCompositeCeilingOnlyLowConfidenceEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "composite_panel" ||
    input.impactSystemType !== "suspended_ceiling_only" ||
    input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger"
  ) {
    return null;
  }

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 48.6
    },
    candidateIds: [
      "pmc_m1_bare_composite_lab_2026",
      "pmc_m1_dry_floating_plus_c2x_lab_2026",
      "pmc_m1_dry_floating_plus_c1x_lab_2026",
      "pmc_m1_dry_floating_floor_lab_2026"
    ],
    candidateScores: [5.5, 5.7, 6.2, 6.7],
    impactRatings: {
      LnW: 63.3
    },
    kind: "low_confidence",
    noteLabel: "Composite suspended-ceiling low-confidence fallback",
    structuralFamily: "composite panel"
  });
}

export function derivePredictorLowConfidenceFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  return (
    deriveConcreteCombinedLowConfidenceEstimate(input) ??
    deriveSteelSuspendedLowConfidenceEstimate(input) ??
    deriveTimberDirectCeilingLowConfidenceEstimate(input) ??
    deriveTimberBareLowConfidenceEstimate(input) ??
    deriveCompositeCeilingOnlyLowConfidenceEstimate(input) ??
    null
  );
}

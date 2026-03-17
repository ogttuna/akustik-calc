import type {
  FloorSystemEstimateResult,
  ImpactPredictorInput
} from "@dynecho/shared";

import { buildPredictorFamilyEstimateCase, normalizePredictorToken } from "./predictor-family-estimate-shared";

function thicknessNear(value: number | undefined, target: number, tolerance = 3): boolean {
  return typeof value === "number" && Math.abs(value - target) <= tolerance;
}

function deriveOpenBoxPublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "open_box_timber" ||
    input.impactSystemType !== "combined_upper_lower_system" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "laminate_flooring" ||
    input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger" ||
    input.lowerTreatment.boardLayerCount !== 2 ||
    !thicknessNear(input.lowerTreatment.boardThicknessMm, 13, 1) ||
    !thicknessNear(input.lowerTreatment.cavityFillThicknessMm, 100, 5)
  ) {
    return null;
  }

  if (
    normalizePredictorToken(input.upperFill?.materialClass) === "generic_fill" &&
    thicknessNear(input.upperFill?.thicknessMm, 50, 8) &&
    normalizePredictorToken(input.floatingScreed?.materialClass) === "dry_floating_gypsum_fiberboard" &&
    thicknessNear(input.floatingScreed?.thicknessMm, 60, 8) &&
    thicknessNear(input.resilientLayer?.thicknessMm, 3, 1)
  ) {
    return buildPredictorFamilyEstimateCase({
      airborneRatings: {
        Rw: 75,
        RwCtr: 66.84359068531064
      },
      candidateIds: ["tuas_r5b_open_box_timber_measured_2026"],
      candidateScores: [0.3],
      impactRatings: {
        CI: 2,
        CI50_2500: 5,
        LnW: 39,
        LnWPlusCI: 41
      },
      kind: "family_archetype",
      noteLabel: "TUAS open-box dry-floor archetype estimate",
      structuralFamily: "open-box timber"
    });
  }

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 49,
      RwCtr: 37.465233062145899
    },
    candidateIds: ["tuas_r2a_open_box_timber_measured_2026"],
    candidateScores: [0.4],
    impactRatings: {
      CI: 2,
      CI50_2500: 2,
      LnW: 72,
      LnWPlusCI: 74
    },
    kind: "family_archetype",
    noteLabel: "TUAS open-box archetype estimate",
    structuralFamily: "open-box timber"
  });
}

function deriveCltDryPublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "mass_timber_clt" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "laminate_flooring" ||
    normalizePredictorToken(input.upperFill?.materialClass) !== "generic_fill"
  ) {
    return null;
  }

  if (
    input.impactSystemType === "dry_floating_floor" &&
    !input.lowerTreatment?.type &&
    thicknessNear(input.upperFill?.thicknessMm, 50, 8)
  ) {
    return buildPredictorFamilyEstimateCase({
      airborneRatings: {
        Rw: 55,
        RwCtr: 48.36814613192648
      },
      basisOverride: "predictor_mass_timber_clt_dry_interaction_estimate",
      candidateIds: ["tuas_x5_clt140_measured_2026"],
      candidateScores: [0.5],
      impactRatings: {
        CI: 1,
        CI50_2500: 8,
        LnW: 50,
        LnWPlusCI: 51
      },
      kind: "family_general",
      noteLabel: "TUAS CLT dry published interaction estimate",
      structuralFamily: "mass-timber CLT"
    });
  }

  if (
    input.impactSystemType === "combined_upper_lower_system" &&
    input.lowerTreatment?.type === "suspended_ceiling_rigid_hanger" &&
    input.lowerTreatment.boardLayerCount === 2 &&
    thicknessNear(input.lowerTreatment.boardThicknessMm, 13, 1) &&
    thicknessNear(input.lowerTreatment.cavityFillThicknessMm, 100, 8) &&
    thicknessNear(input.upperFill?.thicknessMm, 50, 8)
  ) {
    return buildPredictorFamilyEstimateCase({
      airborneRatings: {
        Rw: 75,
        RwCtr: 64.4365251312953
      },
      basisOverride: "predictor_mass_timber_clt_dry_interaction_estimate",
      candidateIds: ["tuas_c5c_clt260_measured_2026"],
      candidateScores: [0.6],
      impactRatings: {
        CI: 2,
        CI50_2500: 16,
        LnW: 24.5,
        LnWPlusCI: 26.5
      },
      kind: "family_general",
      noteLabel: "TUAS CLT dry combined published interaction estimate",
      structuralFamily: "mass-timber CLT"
    });
  }

  return null;
}

function deriveDataholzCltDryPublishedEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "mass_timber_clt" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "dry_floating_gypsum_fiberboard"
  ) {
    return null;
  }

  if (
    input.impactSystemType === "dry_floating_floor" &&
    normalizePredictorToken(input.upperFill?.materialClass) === "elastic_bonded_fill"
  ) {
    return buildPredictorFamilyEstimateCase({
      airborneRatings: {
        Rw: 62.1
      },
      basisOverride: "predictor_mass_timber_clt_dataholz_dry_estimate",
      candidateIds: ["dataholz_gdmtxn01_dry_clt_lab_2026"],
      candidateScores: [0.7],
      impactRatings: {
        LnW: 50.2
      },
      kind: "family_general",
      noteLabel: "Dataholz dry CLT published estimate",
      structuralFamily: "mass-timber CLT"
    });
  }

  if (
    input.impactSystemType === "combined_upper_lower_system" &&
    normalizePredictorToken(input.upperFill?.materialClass) === "bonded_chippings" &&
    input.lowerTreatment?.type === "suspended_ceiling_elastic_hanger"
  ) {
    return buildPredictorFamilyEstimateCase({
      airborneRatings: {
        Rw: 66
      },
      basisOverride: "predictor_mass_timber_clt_dataholz_dry_estimate",
      candidateIds: ["dataholz_gdmtxa01a_clt_lab_2026"],
      candidateScores: [0.8],
      impactRatings: {
        LnW: 45.8
      },
      kind: "family_general",
      noteLabel: "Dataholz dry CLT combined published estimate",
      structuralFamily: "mass-timber CLT"
    });
  }

  return null;
}

function derivePliteqHollowCorePublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "hollow_core" ||
    input.impactSystemType !== "combined_upper_lower_system" ||
    normalizePredictorToken(input.resilientLayer?.productId) !== "geniemat_rst05" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "vinyl_flooring" ||
    input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger" ||
    input.lowerTreatment.boardLayerCount !== 1 ||
    !thicknessNear(input.lowerTreatment.boardThicknessMm, 16, 1)
  ) {
    return null;
  }

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 62
    },
    candidateIds: ["pliteq_hcp200_vinyl_lab_2026"],
    candidateScores: [0.6],
    impactRatings: {
      LnW: 48
    },
    kind: "family_archetype",
    noteLabel: "Pliteq hollow-core archetype estimate",
    structuralFamily: "hollow-core / precast concrete"
  });
}

function hasFurredTimberCeiling(input: ImpactPredictorInput): boolean {
  return (
    input.structuralSupportType === "timber_joists" &&
    input.impactSystemType === "suspended_ceiling_only" &&
    input.lowerTreatment?.type === "direct_fixed_ceiling" &&
    normalizePredictorToken(input.lowerTreatment?.supportClass) === "furred_channels"
  );
}

function deriveKnaufTimberPublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (!hasFurredTimberCeiling(input)) {
    if (
      input.structuralSupportType !== "timber_joists" ||
      input.impactSystemType !== "suspended_ceiling_only" ||
      input.lowerTreatment?.type !== "direct_fixed_ceiling" ||
      normalizePredictorToken(input.lowerTreatment?.supportClass) !== "direct_to_joists"
    ) {
      return null;
    }
  }

  const floorMaterial = normalizePredictorToken(input.floorCovering?.materialClass);
  const boardMaterial = normalizePredictorToken(input.lowerTreatment?.boardMaterialClass);

  if (boardMaterial === "firestop_board" && floorMaterial === "ceramic_tile") {
    const supportClass = normalizePredictorToken(input.lowerTreatment?.supportClass);

    if (
      supportClass === "direct_to_joists" &&
      normalizePredictorToken(input.supportForm) !== "joist_or_purlin"
    ) {
      return buildPredictorFamilyEstimateCase({
        airborneRatings: {
          Rw: 51.5,
          RwCtr: 45,
          RwCtrSemantic: "rw_plus_ctr"
        },
        candidateIds: [
          "knauf_ct30_1a_timber_lab_2026",
          "knauf_ct30_2a_timber_lab_2026",
          "knauf_ct30_1b_timber_lab_2026",
          "knauf_ct30_2b_timber_lab_2026"
        ],
        candidateScores: [2.5, 2.9, 3.3, 3.7],
        impactRatings: {
          LnW: 69.9
        },
        kind: "family_general",
        noteLabel: "Knauf timber direct-to-joists family blend",
        structuralFamily: "timber frame / joist"
      });
    }

    if (supportClass === "direct_to_joists") {
      return null;
    }

    return buildPredictorFamilyEstimateCase({
      airborneRatings: {
        Rw: 53,
        RwCtr: 46,
        RwCtrSemantic: "rw_plus_ctr"
      },
      candidateIds: [
        "knauf_ct30_1b_timber_lab_2026",
        "knauf_ct30_2b_timber_lab_2026",
        "knauf_ct30_1a_timber_lab_2026",
        "knauf_ct2d_timber_r25_lab_2026"
      ],
      candidateScores: [2.1, 2.5, 2.9, 3],
      impactRatings: {
        LnW: 69.3
      },
      kind: "family_general",
      noteLabel: "Knauf timber family-wide estimate",
      structuralFamily: "timber frame / joist"
    });
  }

  if (boardMaterial === "impactstop_board" && floorMaterial === "engineered_timber") {
    return buildPredictorFamilyEstimateCase({
      airborneRatings: {
        Rw: 51.2,
        RwCtr: 44.9,
        RwCtrSemantic: "rw_plus_ctr"
      },
      candidateIds: [
        "knauf_ct2g_timber_nil_lab_2026",
        "knauf_ct2g_timber_r25_lab_2026",
        "knauf_ct2h_timber_nil_lab_2026"
      ],
      candidateScores: [0.6, 0.9, 1.6],
      impactRatings: {
        LnW: 69.6
      },
      kind: "family_archetype",
      noteLabel: "Knauf timber archetype estimate",
        structuralFamily: "timber frame / joist"
      });
  }

  return null;
}

function deriveDataholzTimberDryPublishedEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "timber_joists" ||
    input.impactSystemType !== "combined_upper_lower_system" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "dry_floating_gypsum_fiberboard" ||
    input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger" ||
    input.lowerTreatment.boardLayerCount !== 1 ||
    !thicknessNear(input.baseSlab?.thicknessMm, 200, 5) ||
    !thicknessNear(input.floorCovering?.thicknessMm, 65, 5) ||
    !thicknessNear(input.lowerTreatment.boardThicknessMm, 15, 2) ||
    !thicknessNear(input.lowerTreatment.cavityDepthMm, 60, 5) ||
    !thicknessNear(input.lowerTreatment.cavityFillThicknessMm, 200, 10)
  ) {
    return null;
  }

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 66,
      RwCtr: -15,
      RwCtrSemantic: "ctr_term"
    },
    candidateIds: ["dataholz_gdrtxa06a_timber_frame_dry_lab_2026"],
    candidateScores: [0.8],
    impactRatings: {
      CI: 1,
      LnW: 52,
      LnWPlusCI: 53
    },
    kind: "family_archetype",
    noteLabel: "Dataholz dry timber integrated-row estimate",
    structuralFamily: "timber frame / joist"
  });
}

function deriveCltWetPublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "mass_timber_clt" ||
    input.impactSystemType !== "heavy_floating_floor" ||
    normalizePredictorToken(input.upperFill?.materialClass) !== "non_bonded_chippings" ||
    normalizePredictorToken(input.floatingScreed?.materialClass) !== "generic_screed"
  ) {
    return null;
  }

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 76.1
    },
    candidateIds: [
      "dataholz_gdmnxn06_fill_clt_lab_2026",
      "dataholz_gdmnxn05_wet_clt_lab_2026"
    ],
    candidateScores: [1.6, 1.6],
    impactRatings: {
      CI: -1,
      LnW: 41.9,
      LnWPlusCI: 40.9
    },
    kind: "family_archetype",
    noteLabel: "Dataholz wet CLT family estimate",
    structuralFamily: "mass-timber CLT"
  });
}

function deriveSteelPublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "steel_joists" ||
    normalizePredictorToken(input.supportForm) !== "open_web_or_rolled" ||
    input.impactSystemType !== "combined_upper_lower_system" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "carpet_with_foam_underlay"
  ) {
    return null;
  }

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 63.7,
      RwCtr: 58.4,
      RwCtrSemantic: "rw_plus_ctr"
    },
    candidateIds: [
      "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      "ubiq_fl28_open_web_steel_400_exact_lab_2026"
    ],
    candidateScores: [1.9, 2.6, 2.6],
    impactRatings: {
      CI: -1.7,
      LnW: 51,
      LnWPlusCI: 49.3
    },
    kind: "family_general",
    noteLabel: "UBIQ open-web steel family estimate",
    structuralFamily: "lightweight steel"
  });
}

export function derivePredictorPublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  return (
    deriveOpenBoxPublishedFamilyEstimate(input) ??
    deriveCltDryPublishedFamilyEstimate(input) ??
    deriveDataholzCltDryPublishedEstimate(input) ??
    derivePliteqHollowCorePublishedFamilyEstimate(input) ??
    deriveDataholzTimberDryPublishedEstimate(input) ??
    deriveKnaufTimberPublishedFamilyEstimate(input) ??
    deriveCltWetPublishedFamilyEstimate(input) ??
    deriveSteelPublishedFamilyEstimate(input) ??
    null
  );
}

import type {
  FloorSystemEstimateResult,
  ImpactPredictorInput
} from "@dynecho/shared";

import { buildPredictorFamilyEstimateCase, normalizePredictorToken } from "./predictor-family-estimate-shared";
import { clamp } from "./math";

function thicknessNear(value: number | undefined, target: number, tolerance = 3): boolean {
  return typeof value === "number" && Math.abs(value - target) <= tolerance;
}

function calculateCandidateScore(value: number, target: number, scale: number): number {
  return Math.abs(value - target) / scale;
}

function hasUpperPackageContent(input: ImpactPredictorInput): boolean {
  return Boolean(
    input.resilientLayer?.productId ||
      typeof input.resilientLayer?.thicknessMm === "number" ||
      typeof input.resilientLayer?.dynamicStiffnessMNm3 === "number" ||
      input.upperFill?.materialClass ||
      typeof input.upperFill?.thicknessMm === "number" ||
      input.floatingScreed?.materialClass ||
      typeof input.floatingScreed?.thicknessMm === "number"
  );
}

function hasOnlyGenericResilientUnderlay(input: ImpactPredictorInput): boolean {
  return Boolean(
    typeof input.resilientLayer?.thicknessMm === "number" &&
      !input.resilientLayer?.productId &&
      typeof input.resilientLayer?.dynamicStiffnessMNm3 !== "number" &&
      !input.upperFill?.materialClass &&
      typeof input.upperFill?.thicknessMm !== "number" &&
      !input.floatingScreed?.materialClass &&
      typeof input.floatingScreed?.thicknessMm !== "number"
  );
}

function deriveKnaufConcreteCombinedPublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "reinforced_concrete" ||
    input.impactSystemType !== "combined_upper_lower_system" ||
    !(
      input.lowerTreatment?.type === "suspended_ceiling_elastic_hanger" ||
      input.lowerTreatment?.type === "suspended_ceiling_rigid_hanger"
    ) ||
    input.lowerTreatment.boardLayerCount !== 2 ||
    hasUpperPackageContent(input)
  ) {
    return null;
  }

  const boardMaterialClass = normalizePredictorToken(input.lowerTreatment.boardMaterialClass);
  if (boardMaterialClass && boardMaterialClass !== "firestop_board") {
    return null;
  }

  const baseThicknessMm = input.baseSlab?.thicknessMm;
  const cavityDepthMm = input.lowerTreatment.cavityDepthMm;
  const cavityFillThicknessMm = input.lowerTreatment.cavityFillThicknessMm;
  const boardThicknessMm = input.lowerTreatment.boardThicknessMm;

  if (
    !thicknessNear(baseThicknessMm, 150, 25) ||
    !thicknessNear(cavityDepthMm, 100, 25) ||
    !thicknessNear(cavityFillThicknessMm, 50, 20) ||
    !thicknessNear(boardThicknessMm, 13, 2)
  ) {
    return null;
  }

  const candidateScore =
    0.7 +
    calculateCandidateScore(baseThicknessMm ?? 150, 150, 25) +
    calculateCandidateScore(cavityDepthMm ?? 100, 100, 25) +
    calculateCandidateScore(cavityFillThicknessMm ?? 50, 50, 20) +
    calculateCandidateScore(boardThicknessMm ?? 13, 13, 4);

  const floorMaterial = normalizePredictorToken(input.floorCovering?.materialClass);

  if (floorMaterial === "engineered_timber_with_acoustic_underlay") {
    return buildPredictorFamilyEstimateCase({
      airborneRatings: {
        Rw: 63,
        RwCtr: 57,
        RwCtrSemantic: "rw_plus_ctr"
      },
      candidateIds: ["knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"],
      candidateScores: [candidateScore],
      impactRatings: {
        LnW: 51
      },
      kind: "family_archetype",
      noteLabel: "Knauf concrete timber-underlay archetype estimate",
      structuralFamily: "reinforced concrete"
    });
  }

  if (floorMaterial === "carpet_with_foam_underlay") {
    return buildPredictorFamilyEstimateCase({
      airborneRatings: {
        Rw: 63,
        RwCtr: 57,
        RwCtrSemantic: "rw_plus_ctr"
      },
      candidateIds: ["knauf_cc60_1a_concrete150_carpet_lab_2026"],
      candidateScores: [candidateScore],
      impactRatings: {
        LnW: 31
      },
      kind: "family_archetype",
      noteLabel: "Knauf concrete carpet archetype estimate",
      structuralFamily: "reinforced concrete"
    });
  }

  return null;
}

function deriveKnaufConcreteCombinedTilePublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "reinforced_concrete" ||
    input.impactSystemType !== "combined_upper_lower_system" ||
    !(
      input.lowerTreatment?.type === "suspended_ceiling_elastic_hanger" ||
      input.lowerTreatment?.type === "suspended_ceiling_rigid_hanger"
    ) ||
    input.lowerTreatment.boardLayerCount !== 2 ||
    !hasOnlyGenericResilientUnderlay(input)
  ) {
    return null;
  }

  const floorMaterial = normalizePredictorToken(input.floorCovering?.materialClass);
  const boardMaterialClass = normalizePredictorToken(input.lowerTreatment.boardMaterialClass);
  const resilientThicknessMm = input.resilientLayer?.thicknessMm;

  if (floorMaterial !== "ceramic_tile") {
    return null;
  }

  if (boardMaterialClass && boardMaterialClass !== "firestop_board") {
    return null;
  }

  const baseThicknessMm = input.baseSlab?.thicknessMm;
  const cavityDepthMm = input.lowerTreatment.cavityDepthMm;
  const cavityFillThicknessMm = input.lowerTreatment.cavityFillThicknessMm;
  const boardThicknessMm = input.lowerTreatment.boardThicknessMm;

  if (
    !thicknessNear(baseThicknessMm, 200, 30) ||
    !thicknessNear(resilientThicknessMm, 5, 4) ||
    !thicknessNear(cavityDepthMm, 300, 40) ||
    !thicknessNear(cavityFillThicknessMm, 50, 20) ||
    !thicknessNear(boardThicknessMm, 13, 2)
  ) {
    return null;
  }

  const candidateScore =
    0.8 +
    calculateCandidateScore(baseThicknessMm ?? 200, 200, 30) +
    calculateCandidateScore(resilientThicknessMm ?? 5, 5, 4) +
    calculateCandidateScore(cavityDepthMm ?? 300, 300, 40) +
    calculateCandidateScore(cavityFillThicknessMm ?? 50, 50, 20) +
    calculateCandidateScore(boardThicknessMm ?? 13, 13, 4);

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 69,
      RwCtr: 64,
      RwCtrSemantic: "rw_plus_ctr"
    },
    candidateIds: ["knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"],
    candidateScores: [candidateScore],
    impactRatings: {
      LnW: 45
    },
    kind: "family_archetype",
    noteLabel: "Knauf concrete tile-underlay combined archetype estimate",
    structuralFamily: "reinforced concrete"
  });
}

function deriveKnaufConcreteSuspendedTilePublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "reinforced_concrete" ||
    input.impactSystemType !== "suspended_ceiling_only" ||
    !(
      input.lowerTreatment?.type === "suspended_ceiling_elastic_hanger" ||
      input.lowerTreatment?.type === "suspended_ceiling_rigid_hanger"
    ) ||
    input.lowerTreatment.boardLayerCount !== 2 ||
    hasUpperPackageContent(input)
  ) {
    return null;
  }

  const floorMaterial = normalizePredictorToken(input.floorCovering?.materialClass);
  const boardMaterialClass = normalizePredictorToken(input.lowerTreatment.boardMaterialClass);

  if (floorMaterial !== "ceramic_tile") {
    return null;
  }

  if (boardMaterialClass && boardMaterialClass !== "firestop_board") {
    return null;
  }

  const baseThicknessMm = input.baseSlab?.thicknessMm;
  const cavityDepthMm = input.lowerTreatment.cavityDepthMm;
  const cavityFillThicknessMm = input.lowerTreatment.cavityFillThicknessMm;
  const boardThicknessMm = input.lowerTreatment.boardThicknessMm;

  if (
    !thicknessNear(baseThicknessMm, 200, 30) ||
    !thicknessNear(cavityDepthMm, 300, 40) ||
    !thicknessNear(cavityFillThicknessMm, 50, 20) ||
    !thicknessNear(boardThicknessMm, 13, 2)
  ) {
    return null;
  }

  const candidateScore =
    0.9 +
    calculateCandidateScore(baseThicknessMm ?? 200, 200, 30) +
    calculateCandidateScore(cavityDepthMm ?? 300, 300, 40) +
    calculateCandidateScore(cavityFillThicknessMm ?? 50, 50, 20) +
    calculateCandidateScore(boardThicknessMm ?? 13, 13, 4);

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 69,
      RwCtr: 64,
      RwCtrSemantic: "rw_plus_ctr"
    },
    candidateIds: ["knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"],
    candidateScores: [candidateScore],
    impactRatings: {
      LnW: 45
    },
    kind: "family_archetype",
    noteLabel: "Knauf concrete tile-underlay archetype estimate",
    structuralFamily: "reinforced concrete"
  });
}

function deriveConcreteCombinedVinylElasticCeilingEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "reinforced_concrete" ||
    input.impactSystemType !== "combined_upper_lower_system" ||
    input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "vinyl_flooring"
  ) {
    return null;
  }

  const baseThicknessMm = input.baseSlab?.thicknessMm;
  const resilientThicknessMm = input.resilientLayer?.thicknessMm;
  const floorCoveringThicknessMm = input.floorCovering?.thicknessMm;
  const cavityDepthMm = input.lowerTreatment.cavityDepthMm;
  const cavityFillThicknessMm = input.lowerTreatment.cavityFillThicknessMm;
  const boardThicknessMm = input.lowerTreatment.boardThicknessMm;
  const boardLayerCount = input.lowerTreatment.boardLayerCount;

  if (
    !(typeof baseThicknessMm === "number" && baseThicknessMm >= 140 && baseThicknessMm <= 190) ||
    !(typeof resilientThicknessMm === "number" && resilientThicknessMm > 0) ||
    !(typeof floorCoveringThicknessMm === "number" && floorCoveringThicknessMm > 0) ||
    !(typeof cavityDepthMm === "number" && cavityDepthMm > 0) ||
    !(typeof cavityFillThicknessMm === "number" && cavityFillThicknessMm >= 0) ||
    !(typeof boardThicknessMm === "number" && boardThicknessMm > 0) ||
    boardLayerCount !== 2
  ) {
    return null;
  }

  if (input.floatingScreed?.materialClass || input.upperFill?.materialClass) {
    return null;
  }

  const boardMaterialClass = normalizePredictorToken(input.lowerTreatment.boardMaterialClass);
  if (boardMaterialClass && boardMaterialClass !== "firestop_board") {
    return null;
  }

  if (
    !thicknessNear(resilientThicknessMm, 8, 4) ||
    !thicknessNear(floorCoveringThicknessMm, 3, 2) ||
    !thicknessNear(cavityDepthMm, 120, 30) ||
    !thicknessNear(cavityFillThicknessMm, 100, 35) ||
    !thicknessNear(boardThicknessMm, 16, 3)
  ) {
    return null;
  }

  const baseThicknessDelta = clamp((baseThicknessMm - 150) / 30, -1, 1);
  const upperPackageFactor = clamp(((resilientThicknessMm / 8) + (floorCoveringThicknessMm / 3)) / 2, 0.75, 1.3);
  const ceilingFactor = clamp(
    ((cavityDepthMm / 120) + (Math.min(cavityFillThicknessMm, cavityDepthMm) / 100) + (boardThicknessMm / 16)) / 3,
    0.75,
    1.25
  );
  const lnW = 50.6 - (0.6 * baseThicknessDelta) - (0.8 * (upperPackageFactor - 1)) - (0.8 * (ceilingFactor - 1));
  const rw = 64.9 + baseThicknessDelta + (0.6 * (ceilingFactor - 1)) - (0.2 * (upperPackageFactor - 1));
  const candidateScore =
    1.5 +
    calculateCandidateScore(baseThicknessMm, 150, 30) +
    calculateCandidateScore(resilientThicknessMm, 8, 4) +
    calculateCandidateScore(floorCoveringThicknessMm, 3, 2) +
    calculateCandidateScore(cavityDepthMm, 120, 30) +
    calculateCandidateScore(cavityFillThicknessMm, 100, 35) +
    calculateCandidateScore(boardThicknessMm, 16, 3);

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: Number(rw.toFixed(1)),
      RwCtr: 57,
      RwCtrSemantic: "rw_plus_ctr"
    },
    candidateIds: [
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
      "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
      "euracoustics_f1_rigid_ceiling_concrete_lab_2026"
    ],
    candidateScores: [candidateScore, candidateScore + 0.4, candidateScore + 1.2],
    impactRatings: {
      LnW: Number(lnW.toFixed(1))
    },
    kind: "family_general",
    noteLabel: "Reinforced-concrete vinyl plus elastic-ceiling family estimate",
    structuralFamily: "reinforced concrete"
  });
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
    const supportForm = normalizePredictorToken(input.supportForm);

    if (supportClass === "direct_to_joists") {
      return buildPredictorFamilyEstimateCase({
        airborneRatings: {
          Rw: supportForm === "joist_or_purlin" ? 51.8 : 51.5,
          RwCtr: supportForm === "joist_or_purlin" ? 45.1 : 45,
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

function derivePliteqSteelJoistSuspendedVinylEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "steel_joists" ||
    normalizePredictorToken(input.supportForm) !== "joist_or_purlin" ||
    input.impactSystemType !== "suspended_ceiling_only" ||
    input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger" ||
    input.lowerTreatment.boardLayerCount !== 2 ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "vinyl_flooring"
  ) {
    return null;
  }

  const boardMaterialClass = normalizePredictorToken(input.lowerTreatment.boardMaterialClass);

  if (boardMaterialClass && boardMaterialClass !== "firestop_board") {
    return null;
  }

  const baseThicknessMm = input.baseSlab?.thicknessMm;
  const cavityDepthMm = input.lowerTreatment.cavityDepthMm;
  const cavityFillThicknessMm = input.lowerTreatment.cavityFillThicknessMm;
  const boardThicknessMm = input.lowerTreatment.boardThicknessMm;
  const floorCoveringThicknessMm = input.floorCovering?.thicknessMm;

  if (
    !thicknessNear(baseThicknessMm, 250, 35) ||
    !thicknessNear(cavityDepthMm, 120, 25) ||
    !thicknessNear(cavityFillThicknessMm, 100, 25) ||
    !thicknessNear(boardThicknessMm, 16, 2) ||
    !thicknessNear(floorCoveringThicknessMm, 2.5, 1.5)
  ) {
    return null;
  }

  const candidateScores = [
    0.8 +
      calculateCandidateScore(baseThicknessMm ?? 250, 250, 35) +
      calculateCandidateScore(cavityDepthMm ?? 120, 120, 25) +
      calculateCandidateScore(cavityFillThicknessMm ?? 100, 100, 25) +
      calculateCandidateScore(boardThicknessMm ?? 16, 16, 3) +
      calculateCandidateScore(floorCoveringThicknessMm ?? 2.5, 2.5, 2),
    2.2,
    3.1
  ] as const;

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 60
    },
    candidateIds: [
      "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
      "pliteq_steel_joist_250_rst02_wood_lab_2026",
      "pliteq_steel_joist_250_rst12_porcelain_lab_2026"
    ],
    candidateScores,
    impactRatings: {
      LnW: 58
    },
    kind: "family_general",
    noteLabel: "Pliteq steel-joist vinyl suspended family estimate",
    structuralFamily: "lightweight steel"
  });
}

function deriveUbiqOpenWebSuspendedVinylEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "steel_joists" ||
    normalizePredictorToken(input.supportForm) !== "open_web_or_rolled" ||
    input.impactSystemType !== "suspended_ceiling_only" ||
    input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "vinyl_flooring"
  ) {
    return null;
  }

  if (
    !thicknessNear(input.baseSlab?.thicknessMm, 250, 60) ||
    !thicknessNear(input.lowerTreatment?.cavityDepthMm, 120, 35) ||
    !thicknessNear(input.lowerTreatment?.cavityFillThicknessMm, 100, 45) ||
    !thicknessNear(input.lowerTreatment?.boardLayerCount, 2, 0) ||
    !thicknessNear(input.lowerTreatment?.boardThicknessMm, 16, 2) ||
    !thicknessNear(input.floorCovering?.thicknessMm, 3, 2)
  ) {
    return null;
  }

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
    candidateScores: [2.1, 2.1, 2.9, 2.9, 3.4],
    impactRatings: {
      CI: -1.7,
      LnW: 51,
      LnWPlusCI: 49.3
    },
    kind: "family_general",
    noteLabel: "UBIQ open-web steel suspended-vinyl family estimate",
    sourceSystemIds: [
      "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      "ubiq_fl28_open_web_steel_400_exact_lab_2026"
    ],
    structuralFamily: "lightweight steel"
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
    deriveKnaufConcreteCombinedPublishedFamilyEstimate(input) ??
    deriveKnaufConcreteCombinedTilePublishedFamilyEstimate(input) ??
    deriveKnaufConcreteSuspendedTilePublishedFamilyEstimate(input) ??
    deriveConcreteCombinedVinylElasticCeilingEstimate(input) ??
    derivePliteqSteelJoistSuspendedVinylEstimate(input) ??
    deriveUbiqOpenWebSuspendedVinylEstimate(input) ??
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

import type {
  FloorSystemEstimateResult,
  ImpactPredictorInput
} from "@dynecho/shared";

import {
  buildPredictorFamilyEstimateCase,
  normalizePredictorToken,
  type PredictorFamilyEstimateCase
} from "./predictor-family-estimate-shared";
import { clamp } from "./math";

type PublishedFamilyRule = {
  derive: (input: ImpactPredictorInput) => FloorSystemEstimateResult | null;
  id: string;
  implementationKind: "computed_metrics" | "fixed_output" | "scored_candidates";
  priority: number;
};

type TableSafeFixedOutputPublishedFamilyRule = {
  estimateCase: PredictorFamilyEstimateCase;
  id: string;
  matches: (input: ImpactPredictorInput) => boolean;
};

type OpenBoxPublishedFamilyEstimateCaseKey = "basic" | "dry";

const TUAS_CLT_BARE_X2_RW = 38;
const TUAS_CLT_BARE_X2_RW_CTR = 37.242344245020725;
const TUAS_CLT_BARE_X2_LNW = 61;
const TUAS_CLT_BARE_C2_RW = 42;
const TUAS_CLT_BARE_C2_RW_CTR = 41.478540491108376;
const TUAS_CLT_BARE_C2_LNW = 55;
const TUAS_CLT_BARE_REFERENCE_MIN_THICKNESS_MM = 140;
const TUAS_CLT_BARE_REFERENCE_MAX_THICKNESS_MM = 260;
const TUAS_CLT_BARE_RAW_SLAB_RW_PENALTY_DB = 3;
const TUAS_CLT_BARE_RAW_SLAB_LNW_PENALTY_DB = 3;

function thicknessNear(value: number | undefined, target: number, tolerance = 3): boolean {
  return typeof value === "number" && Math.abs(value - target) <= tolerance;
}

function calculateCandidateScore(value: number, target: number, scale: number): number {
  return Math.abs(value - target) / scale;
}

function interpolateLinear(value: number, startValue: number, endValue: number, startTarget: number, endTarget: number): number {
  if (endTarget === startTarget) {
    return startValue;
  }

  const factor = clamp((value - startTarget) / (endTarget - startTarget), 0, 1);
  return startValue + ((endValue - startValue) * factor);
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

function hasBareCltRawSlabOnly(input: ImpactPredictorInput): boolean {
  return !input.floorCovering?.materialClass &&
    typeof input.floorCovering?.thicknessMm !== "number" &&
    !input.resilientLayer?.productId &&
    typeof input.resilientLayer?.dynamicStiffnessMNm3 !== "number" &&
    typeof input.resilientLayer?.thicknessMm !== "number" &&
    !input.upperFill?.materialClass &&
    typeof input.upperFill?.thicknessMm !== "number" &&
    !input.floatingScreed?.materialClass &&
    typeof input.floatingScreed?.thicknessMm !== "number" &&
    !input.lowerTreatment?.type;
}

function hasOutOfBandCltLaminateUnderlayFinish(input: ImpactPredictorInput): boolean {
  return (
    (
      normalizePredictorToken(input.floorCovering?.materialClass) === "laminate_flooring" &&
      typeof input.floorCovering?.thicknessMm === "number" &&
      !thicknessNear(input.floorCovering.thicknessMm, 8, 4)
    ) ||
    (
      typeof input.resilientLayer?.thicknessMm === "number" &&
      !thicknessNear(input.resilientLayer.thicknessMm, 3, 2)
    )
  );
}

function hasSourceBackedOpenBoxLaminateUnderlayFinish(input: ImpactPredictorInput): boolean {
  const resilientProductId = normalizePredictorToken(input.resilientLayer?.productId);

  // Keep open-box published rows aligned with exact-match tolerance. The wider
  // CLT interpolation band is not safe for R2/R5/R9 same-family impact fallback.
  return (
    normalizePredictorToken(input.floorCovering?.materialClass) === "laminate_flooring" &&
    thicknessNear(input.floorCovering?.thicknessMm, 8, 2) &&
    (!resilientProductId || resilientProductId === "eps_underlay") &&
    thicknessNear(input.resilientLayer?.thicknessMm, 3, 2)
  );
}

function deriveTableSafeFixedOutputPublishedFamilyEstimate(
  input: ImpactPredictorInput,
  rule: TableSafeFixedOutputPublishedFamilyRule
): FloorSystemEstimateResult | null {
  if (!rule.matches(input)) {
    return null;
  }

  return buildPredictorFamilyEstimateCase(rule.estimateCase);
}

const PLITEQ_HOLLOW_CORE_PUBLISHED_RULE: TableSafeFixedOutputPublishedFamilyRule = {
  id: "pliteq_hollow_core_combined_vinyl",
  matches: (input) =>
    input.structuralSupportType === "hollow_core" &&
    input.impactSystemType === "combined_upper_lower_system" &&
    normalizePredictorToken(input.resilientLayer?.productId) === "geniemat_rst05" &&
    normalizePredictorToken(input.floorCovering?.materialClass) === "vinyl_flooring" &&
    input.lowerTreatment?.type === "suspended_ceiling_elastic_hanger" &&
    input.lowerTreatment.boardLayerCount === 1 &&
    thicknessNear(input.lowerTreatment.boardThicknessMm, 16, 1),
  estimateCase: {
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
  }
};

const DATAHOLZ_TIMBER_DRY_PUBLISHED_RULE: TableSafeFixedOutputPublishedFamilyRule = {
  id: "dataholz_timber_dry_combined",
  matches: (input) =>
    input.structuralSupportType === "timber_joists" &&
    input.impactSystemType === "combined_upper_lower_system" &&
    normalizePredictorToken(input.floorCovering?.materialClass) === "dry_floating_gypsum_fiberboard" &&
    input.lowerTreatment?.type === "suspended_ceiling_elastic_hanger" &&
    input.lowerTreatment.boardLayerCount === 1 &&
    thicknessNear(input.baseSlab?.thicknessMm, 200, 5) &&
    thicknessNear(input.floorCovering?.thicknessMm, 65, 5) &&
    thicknessNear(input.lowerTreatment.boardThicknessMm, 15, 2) &&
    thicknessNear(input.lowerTreatment.cavityDepthMm, 60, 5) &&
    thicknessNear(input.lowerTreatment.cavityFillThicknessMm, 200, 10),
  estimateCase: {
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
  }
};

const CLT_WET_PUBLISHED_RULE: TableSafeFixedOutputPublishedFamilyRule = {
  id: "clt_wet_heavy_floating",
  matches: (input) =>
    input.structuralSupportType === "mass_timber_clt" &&
    input.impactSystemType === "heavy_floating_floor" &&
    normalizePredictorToken(input.upperFill?.materialClass) === "non_bonded_chippings" &&
    normalizePredictorToken(input.floatingScreed?.materialClass) === "generic_screed",
  estimateCase: {
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
  }
};

function deriveDataholzCltWetSuspendedPublishedEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (input.structuralSupportType !== "mass_timber_clt") {
    return null;
  }

  if (
    input.impactSystemType !== "dry_floating_floor" &&
    input.impactSystemType !== "combined_upper_lower_system"
  ) {
    return null;
  }

  if (input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger") {
    return null;
  }

  if (
    input.lowerTreatment.boardLayerCount !== 2 ||
    !thicknessNear(input.lowerTreatment.boardThicknessMm, 13, 3) ||
    !thicknessNear(input.lowerTreatment.cavityDepthMm, 45, 30) ||
    !thicknessNear(input.lowerTreatment.cavityFillThicknessMm, 80, 30)
  ) {
    return null;
  }

  if (
    !thicknessNear(input.baseSlab?.thicknessMm, 140, 12) ||
    normalizePredictorToken(input.floatingScreed?.materialClass) !== "generic_screed" ||
    !thicknessNear(input.floatingScreed?.thicknessMm, 45, 20) ||
    (
      normalizePredictorToken(input.floorCovering?.materialClass) !== "ceramic_tile" &&
      normalizePredictorToken(input.floorCovering?.materialClass) !== "vinyl_flooring"
    )
  ) {
    return null;
  }

  if (
    input.upperFill?.materialClass ||
    typeof input.upperFill?.thicknessMm === "number" ||
    input.resilientLayer?.productId ||
    typeof input.resilientLayer?.dynamicStiffnessMNm3 === "number" ||
    !thicknessNear(input.resilientLayer?.thicknessMm, 8, 4)
  ) {
    return null;
  }

  const candidateScores = [
    2.6 +
      calculateCandidateScore(input.lowerTreatment.cavityDepthMm ?? 45, 70, 45) +
      calculateCandidateScore(input.lowerTreatment.cavityFillThicknessMm ?? 80, 60, 40) +
      calculateCandidateScore(input.floatingScreed?.thicknessMm ?? 45, 60, 25),
    3.0 +
      calculateCandidateScore(input.lowerTreatment.cavityDepthMm ?? 45, 70, 45) +
      calculateCandidateScore(input.lowerTreatment.cavityFillThicknessMm ?? 80, 60, 40) +
      calculateCandidateScore(input.floatingScreed?.thicknessMm ?? 45, 60, 25)
  ] as const;

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 61.5,
      RwCtr: -7,
      RwCtrSemantic: "ctr_term"
    },
    candidateIds: [
      "dataholz_gdmnxa02a_00_clt_lab_2026",
      "dataholz_gdmnxa02a_02_clt_lab_2026"
    ],
    candidateScores,
    impactRatings: {
      LnW: 49.5
    },
    kind: "family_general",
    noteLabel: "Dataholz wet CLT suspended-family estimate",
    structuralFamily: "mass-timber CLT"
  });
}

const UBIQ_OPEN_WEB_SUSPENDED_VINYL_RULE: TableSafeFixedOutputPublishedFamilyRule = {
  id: "ubiq_open_web_suspended_vinyl",
  matches: (input) =>
    input.structuralSupportType === "steel_joists" &&
    normalizePredictorToken(input.supportForm) === "open_web_or_rolled" &&
    input.impactSystemType === "suspended_ceiling_only" &&
    input.lowerTreatment?.type === "suspended_ceiling_elastic_hanger" &&
    normalizePredictorToken(input.floorCovering?.materialClass) === "vinyl_flooring" &&
    thicknessNear(input.baseSlab?.thicknessMm, 250, 60) &&
    thicknessNear(input.lowerTreatment?.cavityDepthMm, 120, 35) &&
    thicknessNear(input.lowerTreatment?.cavityFillThicknessMm, 100, 45) &&
    thicknessNear(input.lowerTreatment?.boardLayerCount, 2, 0) &&
    thicknessNear(input.lowerTreatment?.boardThicknessMm, 16, 2) &&
    thicknessNear(input.floorCovering?.thicknessMm, 3, 2),
  estimateCase: {
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
  }
};

const STEEL_OPEN_WEB_CARPET_PUBLISHED_RULE: TableSafeFixedOutputPublishedFamilyRule = {
  id: "steel_open_web_carpet_combined",
  matches: (input) =>
    input.structuralSupportType === "steel_joists" &&
    normalizePredictorToken(input.supportForm) === "open_web_or_rolled" &&
    input.impactSystemType === "combined_upper_lower_system" &&
    normalizePredictorToken(input.floorCovering?.materialClass) === "carpet_with_foam_underlay",
  estimateCase: {
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
  }
};

const OPEN_BOX_PUBLISHED_ESTIMATE_CASES: Record<
  OpenBoxPublishedFamilyEstimateCaseKey,
  PredictorFamilyEstimateCase
> = {
  basic: {
    airborneRatings: {
      Rw: 62,
      RwCtr: 59.973347663855776
    },
    candidateIds: ["tuas_r2b_open_box_timber_measured_2026"],
    candidateScores: [0.4],
    impactRatings: {
      CI: 1,
      CI50_2500: 3,
      LnW: 46,
      LnWPlusCI: 47
    },
    kind: "family_archetype",
    noteLabel: "TUAS open-box archetype estimate",
    structuralFamily: "open-box timber"
  },
  dry: {
    airborneRatings: {
      Rw: 75,
      RwCtr: 71.87531170772152
    },
    candidateIds: ["tuas_r5b_open_box_timber_measured_2026"],
    candidateScores: [0.3],
    impactRatings: {
      CI: 0,
      CI50_2500: 3,
      LnW: 44,
      LnWPlusCI: 44
    },
    kind: "family_archetype",
    noteLabel: "TUAS open-box dry-floor archetype estimate",
    structuralFamily: "open-box timber"
  }
};

function selectOpenBoxPublishedEstimateCase(
  input: ImpactPredictorInput
): OpenBoxPublishedFamilyEstimateCaseKey | null {
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

  // TUAS open-box published rows that carry walking finishes all use the thin
  // laminate/EPS pair. Incomplete or out-of-band finish input should not borrow
  // the basic, dry, or hybrid measured family lane after exact matching falls off.
  if (!hasSourceBackedOpenBoxLaminateUnderlayFinish(input)) {
    return null;
  }

  if (
    normalizePredictorToken(input.upperFill?.materialClass) === "generic_fill" &&
    thicknessNear(input.upperFill?.thicknessMm, 50, 8) &&
    normalizePredictorToken(input.floatingScreed?.materialClass) === "dry_floating_gypsum_fiberboard" &&
    thicknessNear(input.floatingScreed?.thicknessMm, 60, 8) &&
    thicknessNear(input.resilientLayer?.thicknessMm, 3, 1)
  ) {
    return "dry";
  }

  if (
    input.upperFill?.materialClass ||
    typeof input.upperFill?.thicknessMm === "number" ||
    input.floatingScreed?.materialClass ||
    typeof input.floatingScreed?.thicknessMm === "number"
  ) {
    return null;
  }

  return "basic";
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
  const estimateCaseKey = selectOpenBoxPublishedEstimateCase(input);
  if (!estimateCaseKey) {
    return null;
  }

  return buildPredictorFamilyEstimateCase(OPEN_BOX_PUBLISHED_ESTIMATE_CASES[estimateCaseKey]);
}

function deriveCltBarePublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (
    input.structuralSupportType !== "mass_timber_clt" ||
    input.impactSystemType !== "bare_floor" ||
    input.lowerTreatment?.type ||
    input.upperFill?.materialClass ||
    typeof input.upperFill?.thicknessMm === "number" ||
    input.floatingScreed?.materialClass ||
    typeof input.floatingScreed?.thicknessMm === "number"
  ) {
    return null;
  }

  const floorCoveringMaterialClass = normalizePredictorToken(input.floorCovering?.materialClass);
  const resilientLayerThicknessMm = input.resilientLayer?.thicknessMm;
  const hasFinishPackageInput =
    Boolean(floorCoveringMaterialClass) ||
    typeof input.floorCovering?.thicknessMm === "number" ||
    input.resilientLayer?.productId ||
    typeof input.resilientLayer?.dynamicStiffnessMNm3 === "number" ||
    typeof resilientLayerThicknessMm === "number";

  if (
    floorCoveringMaterialClass &&
    floorCoveringMaterialClass !== "laminate_flooring"
  ) {
    return null;
  }

  // TUAS X2/C2 anchors are laminate on a thin EPS underlay. A partial finish
  // package would otherwise inherit the full measured improvement silently.
  if (
    hasFinishPackageInput &&
    (
      floorCoveringMaterialClass !== "laminate_flooring" ||
      !thicknessNear(input.floorCovering?.thicknessMm, 8, 4) ||
      input.resilientLayer?.productId ||
      typeof input.resilientLayer?.dynamicStiffnessMNm3 === "number" ||
      !thicknessNear(resilientLayerThicknessMm, 3, 2)
    )
  ) {
    return null;
  }

  const baseThicknessMm = input.baseSlab?.thicknessMm;
  if (!(typeof baseThicknessMm === "number" && baseThicknessMm >= 120 && baseThicknessMm <= 300)) {
    return null;
  }

  const rawSlabOnly = hasBareCltRawSlabOnly(input);
  const rawRw = interpolateLinear(
    baseThicknessMm,
    TUAS_CLT_BARE_X2_RW,
    TUAS_CLT_BARE_C2_RW,
    TUAS_CLT_BARE_REFERENCE_MIN_THICKNESS_MM,
    TUAS_CLT_BARE_REFERENCE_MAX_THICKNESS_MM
  );
  const rawRwCtr = interpolateLinear(
    baseThicknessMm,
    TUAS_CLT_BARE_X2_RW_CTR,
    TUAS_CLT_BARE_C2_RW_CTR,
    TUAS_CLT_BARE_REFERENCE_MIN_THICKNESS_MM,
    TUAS_CLT_BARE_REFERENCE_MAX_THICKNESS_MM
  );
  const rawLnW = interpolateLinear(
    baseThicknessMm,
    TUAS_CLT_BARE_X2_LNW,
    TUAS_CLT_BARE_C2_LNW,
    TUAS_CLT_BARE_REFERENCE_MIN_THICKNESS_MM,
    TUAS_CLT_BARE_REFERENCE_MAX_THICKNESS_MM
  );
  const rwPenaltyDb = rawSlabOnly ? TUAS_CLT_BARE_RAW_SLAB_RW_PENALTY_DB : 0;
  const lnWPenaltyDb = rawSlabOnly ? TUAS_CLT_BARE_RAW_SLAB_LNW_PENALTY_DB : 0;

  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: Number((rawRw - rwPenaltyDb).toFixed(1)),
      RwCtr: Number((rawRwCtr - rwPenaltyDb).toFixed(1))
    },
    basisOverride: "predictor_mass_timber_clt_bare_interpolation_estimate",
    candidateIds: ["tuas_x2_clt140_measured_2026", "tuas_c2_clt260_measured_2026"],
    candidateScores: [
      Number((0.5 + calculateCandidateScore(baseThicknessMm, 140, 120) + (rawSlabOnly ? 0.6 : 0)).toFixed(2)),
      Number((0.5 + calculateCandidateScore(baseThicknessMm, 260, 120) + (rawSlabOnly ? 0.6 : 0)).toFixed(2))
    ],
    impactRatings: {
      CI: 0,
      CI50_2500: 0,
      LnW: Number((rawLnW + lnWPenaltyDb).toFixed(1)),
      LnWPlusCI: Number((rawLnW + lnWPenaltyDb).toFixed(1))
    },
    kind: "family_general",
    noteLabel: rawSlabOnly
      ? "Measured CLT bare interpolation with conservative raw-slab penalty"
      : "Measured CLT bare-floor interpolation estimate",
    structuralFamily: "mass-timber CLT"
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

  // TUAS X5/C5c dry rows still carry the thin laminate/EPS walking finish.
  // Explicitly out-of-band finish values should not borrow that measured lane.
  if (hasOutOfBandCltLaminateUnderlayFinish(input)) {
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
        RwCtr: 53.24148704194138
      },
      basisOverride: "predictor_mass_timber_clt_dry_interaction_estimate",
      candidateIds: ["tuas_x5_clt140_measured_2026"],
      candidateScores: [0.5],
      impactRatings: {
        CI: 0,
        CI50_2500: 0,
        LnW: 65,
        LnWPlusCI: 65
      },
      kind: "family_general",
      noteLabel: "TUAS CLT dry published interaction estimate",
      structuralFamily: "mass-timber CLT"
    });
  }

  if (
    input.impactSystemType === "combined_upper_lower_system" &&
    thicknessNear(input.baseSlab?.thicknessMm, 260, 8) &&
    input.lowerTreatment?.type === "suspended_ceiling_rigid_hanger" &&
    input.lowerTreatment.boardLayerCount === 2 &&
    thicknessNear(input.lowerTreatment.boardThicknessMm, 13, 1) &&
    thicknessNear(input.lowerTreatment.cavityFillThicknessMm, 100, 8) &&
    thicknessNear(input.resilientLayer?.thicknessMm, 3, 1) &&
    thicknessNear(input.upperFill?.thicknessMm, 50, 8) &&
    normalizePredictorToken(input.floatingScreed?.materialClass) === "dry_floating_gypsum_fiberboard" &&
    thicknessNear(input.floatingScreed?.thicknessMm, 60, 8) &&
    thicknessNear(input.floorCovering?.thicknessMm, 8, 2)
  ) {
    return buildPredictorFamilyEstimateCase({
      airborneRatings: {
        Rw: 75,
        RwCtr: 70.46337519002095
      },
      basisOverride: "predictor_mass_timber_clt_dry_interaction_estimate",
      candidateIds: ["tuas_c5c_clt260_measured_2026"],
      candidateScores: [0.6],
      impactRatings: {
        CI: 4,
        CI50_2500: 6,
        LnW: 38,
        LnWPlusCI: 42
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
  return deriveTableSafeFixedOutputPublishedFamilyEstimate(input, PLITEQ_HOLLOW_CORE_PUBLISHED_RULE);
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
  return deriveTableSafeFixedOutputPublishedFamilyEstimate(input, DATAHOLZ_TIMBER_DRY_PUBLISHED_RULE);
}

function deriveCltWetPublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  return deriveTableSafeFixedOutputPublishedFamilyEstimate(input, CLT_WET_PUBLISHED_RULE);
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
  return deriveTableSafeFixedOutputPublishedFamilyEstimate(input, UBIQ_OPEN_WEB_SUSPENDED_VINYL_RULE);
}

function deriveSteelPublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  return deriveTableSafeFixedOutputPublishedFamilyEstimate(input, STEEL_OPEN_WEB_CARPET_PUBLISHED_RULE);
}

export function derivePredictorPublishedFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  for (const rule of PREDICTOR_PUBLISHED_FAMILY_RULES) {
    const estimate = rule.derive(input);
    if (estimate) {
      return estimate;
    }
  }

  return null;
}

// Fixed-output rules are the safest candidates for future table-driven extraction.
// Computed and scored rules stay code-backed until their formulas are modeled explicitly.
const PREDICTOR_PUBLISHED_FAMILY_RULES_RAW = [
  {
    id: "knauf_concrete_combined",
    implementationKind: "scored_candidates",
    priority: 10,
    derive: deriveKnaufConcreteCombinedPublishedFamilyEstimate
  },
  {
    id: "knauf_concrete_combined_tile",
    implementationKind: "scored_candidates",
    priority: 20,
    derive: deriveKnaufConcreteCombinedTilePublishedFamilyEstimate
  },
  {
    id: "knauf_concrete_suspended_tile",
    implementationKind: "scored_candidates",
    priority: 30,
    derive: deriveKnaufConcreteSuspendedTilePublishedFamilyEstimate
  },
  {
    id: "concrete_combined_vinyl_elastic_ceiling",
    implementationKind: "computed_metrics",
    priority: 40,
    derive: deriveConcreteCombinedVinylElasticCeilingEstimate
  },
  {
    id: "pliteq_steel_joist_suspended_vinyl",
    implementationKind: "scored_candidates",
    priority: 50,
    derive: derivePliteqSteelJoistSuspendedVinylEstimate
  },
  {
    id: "ubiq_open_web_suspended_vinyl",
    implementationKind: "fixed_output",
    priority: 60,
    derive: deriveUbiqOpenWebSuspendedVinylEstimate
  },
  {
    id: "open_box",
    implementationKind: "fixed_output",
    priority: 70,
    derive: deriveOpenBoxPublishedFamilyEstimate
  },
  {
    id: "clt_bare",
    implementationKind: "computed_metrics",
    priority: 75,
    derive: deriveCltBarePublishedFamilyEstimate
  },
  {
    id: "clt_dry",
    implementationKind: "fixed_output",
    priority: 80,
    derive: deriveCltDryPublishedFamilyEstimate
  },
  {
    id: "dataholz_clt_dry",
    implementationKind: "fixed_output",
    priority: 90,
    derive: deriveDataholzCltDryPublishedEstimate
  },
  {
    id: "pliteq_hollow_core",
    implementationKind: "fixed_output",
    priority: 100,
    derive: derivePliteqHollowCorePublishedFamilyEstimate
  },
  {
    id: "dataholz_timber_dry",
    implementationKind: "fixed_output",
    priority: 110,
    derive: deriveDataholzTimberDryPublishedEstimate
  },
  {
    id: "knauf_timber",
    implementationKind: "fixed_output",
    priority: 120,
    derive: deriveKnaufTimberPublishedFamilyEstimate
  },
  {
    id: "clt_wet",
    implementationKind: "fixed_output",
    priority: 130,
    derive: deriveCltWetPublishedFamilyEstimate
  },
  {
    id: "dataholz_clt_wet_suspended",
    implementationKind: "fixed_output",
    priority: 135,
    derive: deriveDataholzCltWetSuspendedPublishedEstimate
  },
  {
    id: "steel_open_web_carpet",
    implementationKind: "fixed_output",
    priority: 140,
    derive: deriveSteelPublishedFamilyEstimate
  }
] satisfies readonly PublishedFamilyRule[];

export const PREDICTOR_PUBLISHED_FAMILY_RULES: readonly PublishedFamilyRule[] = [
  ...PREDICTOR_PUBLISHED_FAMILY_RULES_RAW
].sort((left, right) => left.priority - right.priority);

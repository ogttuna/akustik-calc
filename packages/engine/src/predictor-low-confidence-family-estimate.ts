import type { FloorSystemEstimateResult, ImpactPredictorInput } from "@dynecho/shared";

import {
  buildPredictorFamilyEstimateCase,
  type PredictorFamilyEstimateCase,
  normalizePredictorToken
} from "./predictor-family-estimate-shared";

type TokenExpectation = string | readonly string[];

type LowConfidenceRule = {
  estimate: PredictorFamilyEstimateCase;
  id: string;
  match: {
    floorCoveringMaterialClass?: TokenExpectation;
    impactSystemType?: TokenExpectation;
    lowerTreatmentBoardMaterialClass?: TokenExpectation;
    lowerTreatmentSupportClass?: TokenExpectation;
    lowerTreatmentType?: TokenExpectation;
    structuralSupportType?: TokenExpectation;
    supportForm?: TokenExpectation;
  };
};

function matchesToken(expectation: TokenExpectation | undefined, actual: string | null | undefined): boolean {
  if (!expectation) {
    return true;
  }

  const expectedValues = Array.isArray(expectation) ? expectation : [expectation];
  const normalizedActual = normalizePredictorToken(actual);

  return expectedValues.some((value) => normalizePredictorToken(value) === normalizedActual);
}

function matchesLowConfidenceRule(input: ImpactPredictorInput, rule: LowConfidenceRule): boolean {
  return (
    matchesToken(rule.match.structuralSupportType, input.structuralSupportType) &&
    matchesToken(rule.match.supportForm, input.supportForm) &&
    matchesToken(rule.match.impactSystemType, input.impactSystemType) &&
    matchesToken(rule.match.floorCoveringMaterialClass, input.floorCovering?.materialClass) &&
    matchesToken(rule.match.lowerTreatmentType, input.lowerTreatment?.type) &&
    matchesToken(rule.match.lowerTreatmentSupportClass, input.lowerTreatment?.supportClass) &&
    matchesToken(rule.match.lowerTreatmentBoardMaterialClass, input.lowerTreatment?.boardMaterialClass)
  );
}

const LOW_CONFIDENCE_RULES: readonly LowConfidenceRule[] = [
  {
    id: "reinforced_concrete_combined_vinyl",
    match: {
      floorCoveringMaterialClass: "vinyl_flooring",
      impactSystemType: "combined_upper_lower_system",
      lowerTreatmentType: "suspended_ceiling_elastic_hanger",
      structuralSupportType: "reinforced_concrete"
    },
    estimate: {
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
    }
  },
  {
    id: "open_web_steel_suspended_vinyl",
    match: {
      floorCoveringMaterialClass: "vinyl_flooring",
      impactSystemType: "suspended_ceiling_only",
      lowerTreatmentType: "suspended_ceiling_elastic_hanger",
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled"
    },
    estimate: {
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
    }
  },
  {
    id: "steel_joist_suspended_vinyl",
    match: {
      floorCoveringMaterialClass: "vinyl_flooring",
      impactSystemType: "suspended_ceiling_only",
      lowerTreatmentType: "suspended_ceiling_elastic_hanger",
      structuralSupportType: "steel_joists",
      supportForm: "joist_or_purlin"
    },
    estimate: {
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
    }
  },
  {
    id: "timber_direct_ceiling_ceramic",
    match: {
      floorCoveringMaterialClass: "ceramic_tile",
      impactSystemType: "suspended_ceiling_only",
      lowerTreatmentBoardMaterialClass: "firestop_board",
      lowerTreatmentSupportClass: "direct_to_joists",
      lowerTreatmentType: "direct_fixed_ceiling",
      structuralSupportType: "timber_joists",
      supportForm: "joist_or_purlin"
    },
    estimate: {
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
    }
  },
  {
    id: "timber_bare_laminate",
    match: {
      floorCoveringMaterialClass: "laminate_flooring",
      impactSystemType: "bare_floor",
      structuralSupportType: "timber_joists"
    },
    estimate: {
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
    }
  },
  {
    id: "composite_suspended_ceiling",
    match: {
      impactSystemType: "suspended_ceiling_only",
      lowerTreatmentType: "suspended_ceiling_elastic_hanger",
      structuralSupportType: "composite_panel"
    },
    estimate: {
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
    }
  }
];

export function derivePredictorLowConfidenceFamilyEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  for (const rule of LOW_CONFIDENCE_RULES) {
    if (matchesLowConfidenceRule(input, rule)) {
      return buildPredictorFamilyEstimateCase(rule.estimate);
    }
  }

  return null;
}

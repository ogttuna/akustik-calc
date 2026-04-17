import type { ExactFloorSystem, FloorSystemEstimateResult, ImpactPredictorInput } from "@dynecho/shared";

import { isPredictorHeavyConcreteCarrierEligible } from "./heavy-concrete-carrier-eligibility";
import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { clamp, ksRound1, round1 } from "./math";
import { buildPredictorFamilyEstimateCase } from "./predictor-family-estimate-shared";

const REGUPOL_CURVE8_CONCRETE_TILE_SUPPORT: ExactFloorSystem = {
  id: "regupol_curve8_concrete_tile_lab_2026",
  label: "REGUPOL curve 8 | 150 mm concrete | 30 mm screed | 8 mm ceramic tile",
  sourceLabel: "REGUPOL official technical-data row",
  sourceType: "official_manufacturer_system_table",
  trustTier: "official_manufacturer",
  match: {
    absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "upper_fill"],
    baseStructure: {
      materialIds: ["concrete"],
      thicknessMm: 150
    },
    resilientLayer: {
      materialIds: ["regupol_sonus_curve_8"],
      thicknessMm: 8
    },
    floatingScreed: {
      materialIds: ["screed"],
      thicknessMm: 30
    },
    floorCovering: {
      materialIds: ["ceramic_tile"],
      thicknessMm: 8
    }
  },
  systemSummary: {
    carrier: "150 mm reinforced-concrete slab",
    floorBuildUp: "8 mm REGUPOL sonus curve 8 resilient layer + 30 mm screed + 8 mm ceramic tile",
    ceiling: "No dedicated lower treatment"
  },
  impactRatings: {
    LnW: 50
  },
  airborneRatings: {
    Rw: 58,
    RwCtr: -6.7,
    RwCtrSemantic: "ctr_term"
  }
};

const EURACOUSTICS_ELASTIC_CEILING_CONCRETE_SUPPORT: ExactFloorSystem = {
  id: "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
  label: "140 mm concrete slab | elastic hanger ceiling | 2 x 13 mm boards",
  sourceLabel: "Euracoustics published concrete ceiling row",
  sourceType: "official_manufacturer_system_table",
  trustTier: "official_manufacturer",
  match: {
    absentRoles: ["floor_covering", "floating_screed", "resilient_layer", "upper_fill"],
    baseStructure: {
      materialIds: ["concrete"],
      thicknessMm: 140
    },
    ceilingCavity: {
      materialIds: ["resilient_channel"],
      thicknessMm: 130
    },
    ceilingFill: {
      materialIds: ["rockwool"],
      thicknessMm: 100
    },
    ceilingBoard: {
      layerCount: 2,
      materialIds: ["gypsum_board"],
      thicknessMm: 13
    }
  },
  systemSummary: {
    carrier: "140 mm reinforced-concrete slab",
    floorBuildUp: "No dedicated published upper package on the source row",
    ceiling: "Elastic hangers, 130 mm cavity including 100 mm mineral wool, metal frame, 2 x 13 mm plasterboards"
  },
  impactRatings: {
    LnW: 43
  },
  airborneRatings: {
    Rw: 77
  }
};

function thicknessNear(value: number | undefined, target: number, tolerance: number): boolean {
  return typeof value === "number" && Math.abs(value - target) <= tolerance;
}

function calculateCandidateOffset(value: number | undefined, target: number, scale: number): number {
  return typeof value === "number" ? Math.abs(value - target) / scale : 1;
}

function isHeavyConcreteGypsumBoardClass(value: string | undefined): boolean {
  const normalized = String(value ?? "").trim().toLowerCase();

  return normalized === "" || normalized === "gypsum_board" || normalized === "generic_gypsum_board";
}

function appendPublishedHeavyConcreteNotes(
  estimate: FloorSystemEstimateResult,
  notes: readonly string[]
): FloorSystemEstimateResult {
  return {
    ...estimate,
    impact: {
      ...estimate.impact,
      notes: [...estimate.impact.notes, ...notes]
    },
    notes: [...estimate.notes, ...notes]
  };
}

export function deriveHeavyConcretePublishedUpperTreatmentEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (input.structuralSupportType !== "reinforced_concrete" || input.officialFloorSystemId) {
    return null;
  }

  if (
    input.impactSystemType !== "heavy_floating_floor" &&
    input.impactSystemType !== "combined_upper_lower_system"
  ) {
    return null;
  }

  if (!isPredictorHeavyConcreteCarrierEligible(input.baseSlab)) {
    return null;
  }

  if (typeof input.resilientLayer?.dynamicStiffnessMNm3 === "number" || input.resilientLayer?.productId) {
    return null;
  }

  if (input.floorCovering?.mode !== "material_layer" || input.floorCovering.materialClass !== "ceramic_tile") {
    return null;
  }

  if (input.floatingScreed?.materialClass && input.floatingScreed.materialClass !== "generic_screed") {
    return null;
  }

  const baseThicknessMm = input.baseSlab?.thicknessMm;
  const resilientThicknessMm = input.resilientLayer?.thicknessMm;
  const floatingScreedThicknessMm = input.floatingScreed?.thicknessMm;
  const floorCoveringThicknessMm = input.floorCovering.thicknessMm;

  if (
    !(typeof baseThicknessMm === "number" && baseThicknessMm > 0) ||
    !(typeof resilientThicknessMm === "number" && resilientThicknessMm > 0) ||
    !(typeof floatingScreedThicknessMm === "number" && floatingScreedThicknessMm > 0) ||
    !(typeof floorCoveringThicknessMm === "number" && floorCoveringThicknessMm > 0)
  ) {
    return null;
  }

  const basis = "predictor_heavy_concrete_published_upper_treatment_estimate";

  if (input.impactSystemType === "heavy_floating_floor" && !input.lowerTreatment?.type) {
    const fitPercent = round1(
      clamp(
        100 -
          Math.abs(baseThicknessMm - 150) * 0.6 -
          Math.abs(resilientThicknessMm - 8) * 2.5 -
          Math.abs(floatingScreedThicknessMm - 30) * 0.9 -
          Math.abs(floorCoveringThicknessMm - 8) * 2,
        64,
        96
      )
    );

    const notes = [
      "Published heavy-concrete upper-treatment estimate is active because the resilient layer stayed generic and no explicit dynamic stiffness was declared.",
      "The impact lane is anchored to the curated REGUPOL curve 8 ceramic-tile wet-screed row instead of forcing the narrow Annex C floating-floor formula.",
      `Reference carrier remained the 150 mm reinforced-concrete slab with ${ksRound1(floatingScreedThicknessMm)} mm screed and ${ksRound1(floorCoveringThicknessMm)} mm ceramic tile.`
    ];

    return {
      airborneRatings: {
        Rw: REGUPOL_CURVE8_CONCRETE_TILE_SUPPORT.airborneRatings.Rw,
        RwCtr: REGUPOL_CURVE8_CONCRETE_TILE_SUPPORT.airborneRatings.RwCtr,
        RwCtrSemantic: REGUPOL_CURVE8_CONCRETE_TILE_SUPPORT.airborneRatings.RwCtrSemantic
      },
      fitPercent,
      impact: {
        LnW: REGUPOL_CURVE8_CONCRETE_TILE_SUPPORT.impactRatings.LnW,
        availableOutputs: ["Ln,w"],
        basis,
        confidence: getImpactConfidenceForBasis(basis),
        estimateCandidateIds: [REGUPOL_CURVE8_CONCRETE_TILE_SUPPORT.id],
        labOrField: "lab",
        metricBasis: buildUniformImpactMetricBasis(
          {
            LnW: REGUPOL_CURVE8_CONCRETE_TILE_SUPPORT.impactRatings.LnW
          },
          basis
        ),
        notes,
        scope: "family_estimate"
      },
      kind: "family_general",
      notes,
      sourceSystems: [REGUPOL_CURVE8_CONCRETE_TILE_SUPPORT],
      structuralFamily: "reinforced concrete"
    };
  }

  const boardMaterialClass = input.lowerTreatment?.boardMaterialClass;
  const cavityDepthMm = input.lowerTreatment?.cavityDepthMm;
  const cavityFillThicknessMm = input.lowerTreatment?.cavityFillThicknessMm;
  const boardThicknessMm = input.lowerTreatment?.boardThicknessMm;

  // Keep the combined wet+ceiling widening narrow. This corridor is only
  // source-backed today while the wet package stays generic; branch-specific
  // checks below decide whether the ceiling stays inside the defended elastic
  // or rigid reinforced-concrete family rows. Visible-layer derivation currently
  // emits `generic_gypsum_board` for plain gypsum ceilings, so keep that alias
  // inside the same defended gypsum corridor.
  if (
    input.impactSystemType !== "combined_upper_lower_system" ||
    input.upperFill?.materialClass ||
    typeof input.upperFill?.thicknessMm === "number" ||
    input.lowerTreatment?.boardLayerCount !== 2 ||
    !isHeavyConcreteGypsumBoardClass(boardMaterialClass) ||
    !thicknessNear(baseThicknessMm, 140, 25) ||
    !thicknessNear(resilientThicknessMm, 8, 4) ||
    !thicknessNear(floatingScreedThicknessMm, 50, 20) ||
    !thicknessNear(floorCoveringThicknessMm, 8, 2)
  ) {
    return null;
  }

  const fitPercent = round1(
    clamp(
      100 -
        Math.abs(baseThicknessMm - 140) * 0.5 -
        Math.abs(resilientThicknessMm - 8) * 2.5 -
        Math.abs(floatingScreedThicknessMm - 50) * 0.6 -
        Math.abs(floorCoveringThicknessMm - 8) * 2 -
        Math.abs((cavityDepthMm ?? 65) - 65) * 0.8 -
        Math.abs((cavityFillThicknessMm ?? 100) - 100) * 0.25 -
        Math.abs((boardThicknessMm ?? 13) - 13) * 3,
      42,
      82
    )
  );

  if (
    input.lowerTreatment?.type === "suspended_ceiling_elastic_hanger" &&
    thicknessNear(cavityDepthMm, 65, 20) &&
    thicknessNear(cavityFillThicknessMm, 100, 25) &&
    thicknessNear(boardThicknessMm, 13, 2)
  ) {
    const notes = [
      "Published heavy-concrete upper-treatment estimate is active because the resilient layer stayed generic and no explicit dynamic stiffness was declared.",
      "The combined wet-plus-ceiling corridor stayed on the curated elastic-hanger concrete family row instead of falling back to the narrow bare-slab formula proxy.",
      `Reference carrier stayed near the 140 mm reinforced-concrete slab with ${ksRound1(floatingScreedThicknessMm)} mm screed, ${ksRound1(floorCoveringThicknessMm)} mm ceramic tile, and an elastic ceiling with ${ksRound1(cavityFillThicknessMm ?? 100)} mm mineral wool.`
    ];

    return {
      airborneRatings: {
        Rw: EURACOUSTICS_ELASTIC_CEILING_CONCRETE_SUPPORT.airborneRatings.Rw
      },
      fitPercent,
      impact: {
        LnW: EURACOUSTICS_ELASTIC_CEILING_CONCRETE_SUPPORT.impactRatings.LnW,
        availableOutputs: ["Ln,w"],
        basis,
        confidence: getImpactConfidenceForBasis(basis),
        estimateCandidateIds: [EURACOUSTICS_ELASTIC_CEILING_CONCRETE_SUPPORT.id],
        labOrField: "lab",
        metricBasis: buildUniformImpactMetricBasis(
          {
            LnW: EURACOUSTICS_ELASTIC_CEILING_CONCRETE_SUPPORT.impactRatings.LnW
          },
          basis
        ),
        notes,
        scope: "family_estimate"
      },
      kind: "family_general",
      notes,
      sourceSystems: [EURACOUSTICS_ELASTIC_CEILING_CONCRETE_SUPPORT],
      structuralFamily: "reinforced concrete"
    };
  }

  // Keep the rigid-hanger widening equally narrow. Firestop-board concrete
  // ceilings already fall onto a different visible-layer lane, so this
  // predictor branch only mirrors the current gypsum/no-tag corridor.
  if (
    input.lowerTreatment?.type !== "suspended_ceiling_rigid_hanger" ||
    !isHeavyConcreteGypsumBoardClass(boardMaterialClass) ||
    !thicknessNear(cavityDepthMm, 130, 25) ||
    !thicknessNear(cavityFillThicknessMm, 100, 25) ||
    !thicknessNear(boardThicknessMm, 13, 2)
  ) {
    return null;
  }

  const rigidCandidateScoreBase =
    calculateCandidateOffset(baseThicknessMm, 150, 25) +
    calculateCandidateOffset(resilientThicknessMm, 8, 4) +
    calculateCandidateOffset(floatingScreedThicknessMm, 50, 20) +
    calculateCandidateOffset(floorCoveringThicknessMm, 8, 2) +
    calculateCandidateOffset(cavityDepthMm, 130, 25) +
    calculateCandidateOffset(cavityFillThicknessMm, 100, 25) +
    calculateCandidateOffset(boardThicknessMm, 13, 4);
  const rigidEstimate = buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 70,
      RwCtr: 57
    },
    basisOverride: basis,
    candidateIds: [
      "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
      "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
    ],
    candidateScores: [
      1.4 + rigidCandidateScoreBase,
      2.1 + rigidCandidateScoreBase,
      2.8 + rigidCandidateScoreBase
    ],
    impactRatings: {
      LnW: 51.5
    },
    kind: "family_general",
    noteLabel: "Published heavy-concrete rigid-ceiling family estimate",
    structuralFamily: "reinforced concrete"
  });

  if (!rigidEstimate) {
    return null;
  }

  return appendPublishedHeavyConcreteNotes(rigidEstimate, [
    "Published heavy-concrete upper-treatment estimate is active because the resilient layer stayed generic and no explicit dynamic stiffness was declared.",
    "The combined wet-plus-rigid-ceiling corridor stayed on the defended rigid-hanger concrete family blend instead of falling back to the narrow bare-slab formula proxy.",
    `Reference carrier stayed near the 150 mm reinforced-concrete slab with ${ksRound1(floatingScreedThicknessMm)} mm screed, ${ksRound1(floorCoveringThicknessMm)} mm ceramic tile, and a rigid ceiling with ${ksRound1(cavityFillThicknessMm ?? 100)} mm mineral wool.`
  ]);
}

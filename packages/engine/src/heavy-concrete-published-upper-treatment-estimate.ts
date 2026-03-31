import type { ExactFloorSystem, FloorSystemEstimateResult, ImpactPredictorInput } from "@dynecho/shared";

import { isPredictorHeavyConcreteCarrierEligible } from "./heavy-concrete-carrier-eligibility";
import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { clamp, ksRound1, round1 } from "./math";

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

export function deriveHeavyConcretePublishedUpperTreatmentEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (input.structuralSupportType !== "reinforced_concrete" || input.officialFloorSystemId) {
    return null;
  }

  if (input.lowerTreatment?.type || input.impactSystemType !== "heavy_floating_floor") {
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
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      confidence: getImpactConfidenceForBasis("predictor_heavy_concrete_published_upper_treatment_estimate"),
      estimateCandidateIds: [REGUPOL_CURVE8_CONCRETE_TILE_SUPPORT.id],
      labOrField: "lab",
      metricBasis: buildUniformImpactMetricBasis(
        {
          LnW: REGUPOL_CURVE8_CONCRETE_TILE_SUPPORT.impactRatings.LnW
        },
        "predictor_heavy_concrete_published_upper_treatment_estimate"
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

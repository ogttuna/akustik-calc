import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { ExactFloorSystem, FloorSystemEstimateResult, ImpactPredictorInput } from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { clamp, ksRound1, round1 } from "./math";

const PMC_BARE_ID = "pmc_m1_bare_composite_lab_2026";
const PMC_DRY_ID = "pmc_m1_dry_floating_floor_lab_2026";
const PMC_C1_ID = "pmc_m1_dry_floating_plus_c1x_lab_2026";
const PMC_C2_ID = "pmc_m1_dry_floating_plus_c2x_lab_2026";

function getExactFloorSystem(id: string): ExactFloorSystem | null {
  return EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id) ?? null;
}

function surfaceMassKgM2(thicknessMm: number | undefined, densityKgM3: number | undefined, fallbackDensityKgM3: number): number {
  if (!(typeof thicknessMm === "number" && thicknessMm > 0)) {
    return Number.NaN;
  }

  const density = typeof densityKgM3 === "number" && densityKgM3 > 0 ? densityKgM3 : fallbackDensityKgM3;
  return (thicknessMm * density) / 1000;
}

export function deriveCompositePanelPublishedInteractionEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  if (input.structuralSupportType !== "composite_panel" || input.officialFloorSystemId) {
    return null;
  }

  if (input.impactSystemType !== "dry_floating_floor" && input.impactSystemType !== "combined_upper_lower_system") {
    return null;
  }

  if (input.floorCovering?.mode !== "material_layer" || input.floorCovering.materialClass !== "dry_floating_gypsum_fiberboard") {
    return null;
  }

  const baseThicknessMm = input.baseSlab?.thicknessMm;
  const resilientThicknessMm = input.resilientLayer?.thicknessMm;
  const upperSurfaceMassKgM2 = surfaceMassKgM2(
    input.floorCovering.thicknessMm,
    input.floorCovering.densityKgM3,
    900
  );

  if (
    !(typeof baseThicknessMm === "number" && baseThicknessMm >= 40 && baseThicknessMm <= 90) ||
    !(typeof resilientThicknessMm === "number" && resilientThicknessMm > 0) ||
    !Number.isFinite(upperSurfaceMassKgM2)
  ) {
    return null;
  }

  const bareRow = getExactFloorSystem(PMC_BARE_ID);
  const dryRow = getExactFloorSystem(PMC_DRY_ID);
  if (!bareRow || !dryRow) {
    return null;
  }

  const bareLnW = bareRow.impactRatings.LnW;
  const dryLnW = dryRow.impactRatings.LnW;
  const bareRw = bareRow.airborneRatings.Rw;
  const dryRw = dryRow.airborneRatings.Rw;
  const referenceUpperSurfaceMassKgM2 = surfaceMassKgM2(25, 900, 900);
  const resilientFactor = clamp(resilientThicknessMm / 15, 0.55, 1.45);
  const upperMassFactor = clamp(upperSurfaceMassKgM2 / referenceUpperSurfaceMassKgM2, 0.55, 1.6);
  const upperEffectFactor = clamp(
    (0.55 * Math.sqrt(resilientFactor)) + (0.45 * Math.sqrt(upperMassFactor)),
    0.55,
    1.35
  );
  const baseThicknessDelta = clamp((baseThicknessMm - 60) / 20, -1.5, 1.5);

  let lnW = bareLnW - ((bareLnW - dryLnW) * upperEffectFactor) - (1.2 * baseThicknessDelta);
  let rw = bareRw + ((dryRw - bareRw) * upperEffectFactor) + (1.0 * baseThicknessDelta);

  const sourceSystems: ExactFloorSystem[] = [dryRow, bareRow];
  const estimateCandidateIds = [dryRow.id, bareRow.id];
  const notes = [
    "Published composite-panel interaction estimate stayed inside the peer-reviewed PMC M1 family.",
    `Upper-treatment scaling used resilient-layer thickness ${ksRound1(resilientThicknessMm)} mm and upper surface mass ${ksRound1(upperSurfaceMassKgM2)} kg/m².`,
    `Base-thickness adjustment was anchored around the 60 mm M1 reference carrier and the dry floating row.`
  ];

  if (input.impactSystemType === "combined_upper_lower_system") {
    if (input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger") {
      return null;
    }

    const c1Row = getExactFloorSystem(PMC_C1_ID);
    const c2Row = getExactFloorSystem(PMC_C2_ID);
    const boardLayerCount = input.lowerTreatment.boardLayerCount;
    const boardThicknessMm = input.lowerTreatment.boardThicknessMm;
    const cavityDepthMm = input.lowerTreatment.cavityDepthMm;
    const cavityFillThicknessMm = input.lowerTreatment.cavityFillThicknessMm ?? 0;

    if (
      !c1Row ||
      !c2Row ||
      !(typeof boardLayerCount === "number" && boardLayerCount > 0) ||
      !(typeof boardThicknessMm === "number" && boardThicknessMm > 0) ||
      !(typeof cavityDepthMm === "number" && cavityDepthMm > 0)
    ) {
      return null;
    }

    const boardCountBlend = clamp(boardLayerCount - 1, 0, 1);
    const referenceLnImprovement =
      (dryLnW - c1Row.impactRatings.LnW) +
      ((dryLnW - c2Row.impactRatings.LnW) - (dryLnW - c1Row.impactRatings.LnW)) * boardCountBlend;
    const referenceRwImprovement =
      (c1Row.airborneRatings.Rw - dryRw) +
      ((c2Row.airborneRatings.Rw - dryRw) - (c1Row.airborneRatings.Rw - dryRw)) * boardCountBlend;
    const boardThicknessFactor = clamp(boardThicknessMm / 12.5, 0.7, 1.35);
    const cavityFactor = clamp(
      ((cavityDepthMm / 150) + (Math.min(cavityFillThicknessMm, cavityDepthMm) / 150)) / 2,
      0.55,
      1.15
    );
    const lowerEffectFactor = clamp((0.6 * boardThicknessFactor) + (0.4 * cavityFactor), 0.65, 1.25);

    lnW -= referenceLnImprovement * lowerEffectFactor;
    rw += referenceRwImprovement * lowerEffectFactor;
    sourceSystems.unshift(c2Row, c1Row);
    estimateCandidateIds.unshift(c2Row.id, c1Row.id);
    notes.push(
      `Lower-treatment scaling used ${boardLayerCount} board layer(s), ${ksRound1(boardThicknessMm)} mm boards, and ${ksRound1(cavityDepthMm)} mm cavity depth.`
    );
  }

  const fitPercent = round1(
    clamp(
      100 -
        (Math.abs(baseThicknessDelta) * 14) -
        (Math.abs(upperEffectFactor - 1) * 28) -
        (input.impactSystemType === "combined_upper_lower_system" ? 8 : 0),
      58,
      94
    )
  );

  return {
    airborneRatings: {
      Rw: ksRound1(rw)
    },
    fitPercent,
    impact: {
      LnW: ksRound1(lnW),
      availableOutputs: ["Ln,w"],
      basis: "predictor_composite_panel_published_interaction_estimate",
      confidence: getImpactConfidenceForBasis("predictor_composite_panel_published_interaction_estimate"),
      estimateCandidateIds,
      labOrField: "lab",
      metricBasis: buildUniformImpactMetricBasis(
        {
          LnW: ksRound1(lnW)
        },
        "predictor_composite_panel_published_interaction_estimate"
      ),
      notes,
      scope: "family_estimate"
    },
    kind: "family_general",
    notes,
    sourceSystems,
    structuralFamily: "composite panel"
  };
}

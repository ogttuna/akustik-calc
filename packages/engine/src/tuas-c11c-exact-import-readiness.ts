import type { ImpactCalculation, LayerInput, ResolvedLayer } from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { round1 } from "./math";

export const TUAS_C11C_SOURCE_FRAME = {
  id: "C11c",
  datasetUrl: "https://data.mendeley.com/datasets/y83p8mpryd/2",
  measurementBandHz: [20, 5000],
  standardSupportedBandHz: [50, 5000],
  uncertainLowBandHz: [20, 40],
  exactImportCandidateId: "tuas_c11c_clt260_measured_2026",
  visibleSchedule: {
    lowerCeiling: {
      boardsMm: [13, 13],
      cavityMm: 70,
      cavityMaterialId: "acoustic_hanger_ceiling",
      fillMm: 100,
      fillMaterialId: "rockwool"
    },
    upperPackage: {
      floorCoveringMm: 8,
      floorCoveringMaterialId: "laminate_flooring",
      resilientLayerMm: 3,
      resilientLayerMaterialId: "eps_underlay",
      upperFillMm: 30,
      upperFillMaterialId: "glasswool_board",
      floatingScreedLayers: [
        { materialId: "geotextile", thicknessMm: 1 },
        { materialId: "screed", thicknessMm: 40 }
      ]
    },
    baseStructure: {
      materialId: "clt_panel",
      thicknessMm: 260
    }
  }
} as const;

export const TUAS_C11C_SOURCE_TUPLE = {
  id: "C11c",
  importEligible: false,
  lnW: 59,
  lnWPlusCI: 60,
  lnWPlusCI50_2500: 60,
  rw: 74
} as const;

export const TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_BASIS =
  "tuas_c11c_visible_iso_weighted_impact_tuple_guarded" as const;

export const TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_SELECTED_CANDIDATE_ID =
  "floor.tuas_c11c.visible_iso_weighted_impact_tuple_guarded" as const;

export const TUAS_C11C_NEARBY_COMBINED_EXACT_ANCHOR_IDS = [
  "tuas_c2c_clt260_measured_2026",
  "tuas_c3c_clt260_measured_2026",
  "tuas_c4c_clt260_measured_2026",
  "tuas_c5c_clt260_measured_2026",
  "tuas_c7c_clt260_measured_2026"
] as const;

export const TUAS_C11C_COMBINED_WET_SOURCE_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 30 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
] as const;

export const TUAS_C11C_EXACT_IMPORT_READINESS_DECISION = {
  exactImportEligible: false,
  reason: "weighted_impact_tuple_is_not_explained_by_low_frequency_companion_terms",
  visibleRoutePosture: {
    route: "screening_airborne_plus_guarded_iso_weighted_impact_tuple",
    closestFamilyCandidateId: "tuas_c7c_clt260_measured_2026",
    predictorMatchingStatus: "parked_by_duplicated_single_entry_floating_screed_surface"
  },
  requiredEvidenceBeforeImport: [
    "raw_c11c_one_third_octave_impact_spectrum",
    "source_correction_or_lab_note_explaining_the_weak_weighted_tuple"
  ],
  runtimeBehaviorChange: true,
  selectedFollowUpIfEvidenceExists: "tuas_c11c_exact_import_candidate_v1"
} as const;

function thicknessNear(value: number | undefined, target: number, tolerance = 3): boolean {
  return typeof value === "number" && Math.abs(value - target) <= tolerance;
}

export function isTuasC11cCombinedWetVisibleBoundary(layers: readonly ResolvedLayer[]): boolean {
  const baseStructure = layers.find((layer) => layer.floorRole === "base_structure");
  const floorCovering = layers.find((layer) => layer.floorRole === "floor_covering");
  const resilientLayer = layers.find((layer) => layer.floorRole === "resilient_layer");
  const upperFill = layers.find((layer) => layer.floorRole === "upper_fill");
  const floatingScreeds = layers.filter((layer) => layer.floorRole === "floating_screed");
  const ceilingBoards = layers.filter((layer) => layer.floorRole === "ceiling_board");
  const ceilingCavity = layers.find((layer) => layer.floorRole === "ceiling_cavity");
  const ceilingFill = layers.find((layer) => layer.floorRole === "ceiling_fill");

  // The duplicated floating-screed schedule is a known visible/source shape.
  // It may publish only the weighted ISO impact tuple below; exact raw-band
  // import still requires the missing C11c spectrum or source correction note.
  return (
    baseStructure?.material.id === TUAS_C11C_SOURCE_FRAME.visibleSchedule.baseStructure.materialId &&
    thicknessNear(baseStructure.thicknessMm, TUAS_C11C_SOURCE_FRAME.visibleSchedule.baseStructure.thicknessMm, 12) &&
    floorCovering?.material.id === TUAS_C11C_SOURCE_FRAME.visibleSchedule.upperPackage.floorCoveringMaterialId &&
    thicknessNear(floorCovering.thicknessMm, TUAS_C11C_SOURCE_FRAME.visibleSchedule.upperPackage.floorCoveringMm, 4) &&
    resilientLayer?.material.id === TUAS_C11C_SOURCE_FRAME.visibleSchedule.upperPackage.resilientLayerMaterialId &&
    thicknessNear(
      resilientLayer.thicknessMm,
      TUAS_C11C_SOURCE_FRAME.visibleSchedule.upperPackage.resilientLayerMm,
      2
    ) &&
    upperFill?.material.id === TUAS_C11C_SOURCE_FRAME.visibleSchedule.upperPackage.upperFillMaterialId &&
    thicknessNear(upperFill.thicknessMm, TUAS_C11C_SOURCE_FRAME.visibleSchedule.upperPackage.upperFillMm, 8) &&
    floatingScreeds.length === 2 &&
    floatingScreeds.some(
      (layer) =>
        layer.material.id === TUAS_C11C_SOURCE_FRAME.visibleSchedule.upperPackage.floatingScreedLayers[0].materialId &&
        thicknessNear(
          layer.thicknessMm,
          TUAS_C11C_SOURCE_FRAME.visibleSchedule.upperPackage.floatingScreedLayers[0].thicknessMm,
          1
        )
    ) &&
    floatingScreeds.some(
      (layer) =>
        layer.material.id === TUAS_C11C_SOURCE_FRAME.visibleSchedule.upperPackage.floatingScreedLayers[1].materialId &&
        thicknessNear(
          layer.thicknessMm,
          TUAS_C11C_SOURCE_FRAME.visibleSchedule.upperPackage.floatingScreedLayers[1].thicknessMm,
          6
        )
    ) &&
    ceilingBoards.length === 2 &&
    ceilingBoards.every(
      (layer) =>
        layer.material.id === "gypsum_board" &&
        thicknessNear(layer.thicknessMm, TUAS_C11C_SOURCE_FRAME.visibleSchedule.lowerCeiling.boardsMm[0], 3)
    ) &&
    ceilingCavity?.material.id === TUAS_C11C_SOURCE_FRAME.visibleSchedule.lowerCeiling.cavityMaterialId &&
    thicknessNear(ceilingCavity.thicknessMm, TUAS_C11C_SOURCE_FRAME.visibleSchedule.lowerCeiling.cavityMm, 30) &&
    ceilingFill?.material.id === TUAS_C11C_SOURCE_FRAME.visibleSchedule.lowerCeiling.fillMaterialId &&
    thicknessNear(ceilingFill.thicknessMm, TUAS_C11C_SOURCE_FRAME.visibleSchedule.lowerCeiling.fillMm, 30)
  );
}

export function buildTuasC11cGuardedIsoWeightedImpact(
  layers: readonly ResolvedLayer[]
): ImpactCalculation | null {
  if (!isTuasC11cCombinedWetVisibleBoundary(layers)) {
    return null;
  }

  const ci = round1(TUAS_C11C_SOURCE_TUPLE.lnWPlusCI - TUAS_C11C_SOURCE_TUPLE.lnW);
  const ci50 = round1(TUAS_C11C_SOURCE_TUPLE.lnWPlusCI50_2500 - TUAS_C11C_SOURCE_TUPLE.lnW);

  return {
    CI: ci,
    CI50_2500: ci50,
    LnW: TUAS_C11C_SOURCE_TUPLE.lnW,
    LnWPlusCI: TUAS_C11C_SOURCE_TUPLE.lnWPlusCI,
    availableOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    basis: TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_BASIS,
    confidence: getImpactConfidenceForBasis(TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_BASIS),
    estimateCandidateIds: ["tuas_c11c_visible_iso_weighted_tuple_2026"],
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(
      {
        CI: ci,
        CI50_2500: ci50,
        LnW: TUAS_C11C_SOURCE_TUPLE.lnW,
        LnWPlusCI: TUAS_C11C_SOURCE_TUPLE.lnWPlusCI
      },
      TUAS_C11C_GUARDED_ISO_WEIGHTED_IMPACT_BASIS
    ),
    notes: [
      "TUAS C11c visible weighted ISO 717-2 tuple is guarded as a metric-scoped lab impact anchor; exact raw-band import remains blocked until the C11c spectrum or a source correction note exists.",
      "Only ISO weighted impact metrics are published from this guarded tuple; DeltaLw and ASTM/IIC aliases stay unsupported."
    ],
    scope: "family_estimate"
  };
}

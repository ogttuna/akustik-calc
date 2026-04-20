import type { LayerInput, ResolvedLayer } from "@dynecho/shared";

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
    route: "screening_only_rw_support_with_impact_fail_closed",
    closestFamilyCandidateId: "tuas_c7c_clt260_measured_2026",
    predictorMatchingStatus: "parked_by_duplicated_single_entry_floating_screed_surface"
  },
  requiredEvidenceBeforeImport: [
    "raw_c11c_one_third_octave_impact_spectrum",
    "source_correction_or_lab_note_explaining_the_weak_weighted_tuple"
  ],
  runtimeBehaviorChange: false,
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

  // This boundary intentionally stays descriptive only. The duplicated
  // floating-screed schedule is a known visible/source shape, but the weighted
  // tuple remains too anomalous to reopen an exact import from shape alone.
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

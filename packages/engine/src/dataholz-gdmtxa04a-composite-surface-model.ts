import type { FloorSystemRecommendation, ImpactCalculation, ResolvedLayer } from "@dynecho/shared";

export const GDMTXA04A_VISIBLE_ESTIMATE_IMPACT_CAP = {
  CI: 4,
  CI50_2500: 9,
  LnW: 49,
  LnWPlusCI: 53
} as const;

export const GDMTXA04A_SOURCE_FRAME = {
  id: "gdmtxa04a-00",
  englishComponentUrl: "https://www.dataholz.eu/en/components/intermediate-floor/detail/kz/gdmtxa04a.htm",
  englishPdfUrl: "https://www.dataholz.eu/en/index/download/en/gdmtxa04a-0.pdf",
  germanComponentUrl: "https://www.dataholz.eu/bauteile/geschossdecke/detail/kz/gdmtxa04a.htm",
  sourceTopLayer: {
    thicknessMm: 65,
    englishWording: "m' approx. 37 kg/m2",
    germanWording: "Trockenestrichelement (2x12.5 GF mit 40 MW), m' ca. 37 kg/m2",
    compositeInterpretation: {
      gypsumFiberSheetsMm: [12.5, 12.5],
      mineralWoolCoreMm: 40
    }
  },
  localCatalogSurface: {
    materialId: "dry_floating_gypsum_fiberboard",
    floorRole: "floor_covering",
    isConvenienceSurfaceForDirectOfficialIdOnly: true,
    representsSourceCompositeSurface: false
  }
} as const;

export const GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION = {
  exactVisibleReopenEligible: false,
  reason: "source_surface_is_composite_dry_screed_with_mineral_wool_core_not_a_single_local_surface_material",
  currentVisibleProxy: {
    materialId: "dry_floating_gypsum_fiberboard",
    floorRole: "floor_covering",
    route: "predictor_mass_timber_clt_dataholz_dry_estimate",
    sourceCandidateId: "dataholz_gdmtxa01a_clt_lab_2026",
    representsSourceCompositeSurface: false
  },
  requiredEvidenceBeforeReopen: [
    "catalog_material_or_role_for_65mm_dry_screed_element_with_2x12_5mm_gf_and_40mm_mw",
    "source_backed_visible_match_rule_that_keeps_composite_surface_semantics"
  ],
  runtimeBehaviorChange: false,
  selectedFollowUpIfEvidenceExists: "dataholz_gdmtxa04a_exact_visible_reopen_candidate_v1"
} as const;

function thicknessNear(value: number | undefined, target: number, tolerance = 3): boolean {
  return typeof value === "number" && Math.abs(value - target) <= tolerance;
}

export function isDataholzGdmtxa04aVisibleEstimateBoundary(
  layers: readonly ResolvedLayer[],
  basis: ImpactCalculation["basis"],
  sources: readonly FloorSystemRecommendation[]
): boolean {
  // The visible proxy deliberately stays tied to the nearby GDMTXA01A estimate
  // lane until the 65 mm dry-screed element can be represented as a composite
  // source surface rather than collapsed into a single convenience material.
  if (
    basis !== GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION.currentVisibleProxy.route ||
    sources.length !== 1 ||
    sources[0]?.system.id !== GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION.currentVisibleProxy.sourceCandidateId
  ) {
    return false;
  }

  const baseStructure = layers.find((layer) => layer.floorRole === "base_structure");
  const floorCovering = layers.find((layer) => layer.floorRole === "floor_covering");
  const upperFill = layers.find((layer) => layer.floorRole === "upper_fill");
  const ceilingBoards = layers.filter((layer) => layer.floorRole === "ceiling_board");
  const ceilingCavity = layers.find((layer) => layer.floorRole === "ceiling_cavity");
  const ceilingFill = layers.find((layer) => layer.floorRole === "ceiling_fill");
  const resilientLayer = layers.find((layer) => layer.floorRole === "resilient_layer");
  const floatingScreed = layers.find((layer) => layer.floorRole === "floating_screed");

  return (
    baseStructure?.material.id === "clt_panel" &&
    thicknessNear(baseStructure.thicknessMm, 160, 12) &&
    floorCovering?.material.id === GDMTXA04A_SOURCE_FRAME.localCatalogSurface.materialId &&
    thicknessNear(floorCovering.thicknessMm, GDMTXA04A_SOURCE_FRAME.sourceTopLayer.thicknessMm, 8) &&
    (upperFill?.material.id === "non_bonded_chippings" || upperFill?.material.id === "bonded_chippings") &&
    thicknessNear(upperFill.thicknessMm, 60, 8) &&
    !resilientLayer &&
    !floatingScreed &&
    ceilingBoards.length === 1 &&
    ceilingBoards[0]?.material.id === "gypsum_board" &&
    thicknessNear(ceilingBoards[0]?.thicknessMm, 12.5, 3) &&
    ceilingCavity?.material.id === "acoustic_hanger_ceiling" &&
    thicknessNear(ceilingCavity.thicknessMm, 70, 30) &&
    ceilingFill?.material.id === "rockwool" &&
    thicknessNear(ceilingFill.thicknessMm, 50, 30)
  );
}

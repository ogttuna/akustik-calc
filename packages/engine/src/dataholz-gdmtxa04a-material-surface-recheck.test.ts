import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  GDMTXA04A_SOURCE_FRAME,
  GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION
} from "./dataholz-gdmtxa04a-composite-surface-model";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";

const TARGET_OUTPUTS = ["Rw", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const;

function getGdmtxa04a() {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === "dataholz_gdmtxa04a_clt_lab_2026");

  if (!system) {
    throw new Error("Missing expected Dataholz GDMTXA04A exact floor system");
  }

  return system;
}

describe("Dataholz GDMTXA04A material-surface recheck", () => {
  it("records the source-language surface frame before any visible exact reopen is considered", () => {
    expect(GDMTXA04A_SOURCE_FRAME).toEqual({
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
    });
  });

  it("keeps the exact catalog row as direct-official-id truth, not a manual visible matcher", () => {
    const system = getGdmtxa04a();

    expect(system.sourceUrl).toBe(GDMTXA04A_SOURCE_FRAME.englishPdfUrl);
    expect(system.manualMatch).toBe(false);
    expect(system.estimateMatch).toBeUndefined();
    expect(system.match.floorCovering?.materialIds).toEqual(["dry_floating_gypsum_fiberboard"]);
    expect(system.match.floorCovering?.thicknessMm).toBe(65);
    expect(system.match.resilientLayer).toBeUndefined();

    expect(system.airborneRatings.Rw).toBe(70);
    expect(system.airborneRatings.RwCtr).toBe(-19);
    expect(system.impactRatings.LnW).toBe(49);
    expect(system.impactRatings.CI).toBe(4);
    expect(system.impactRatings.CI50_2500).toBe(9);
    expect(system.impactRatings.LnWPlusCI).toBe(53);

    const directOfficialIdResult = calculateImpactOnly([], {
      officialFloorSystemId: system.id,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(directOfficialIdResult.sourceMode).toBe("official_floor_system");
    expect(directOfficialIdResult.floorSystemMatch?.system.id).toBe(system.id);
    expect(directOfficialIdResult.impact?.basis).toBe("official_floor_system_exact_match");
    expect(directOfficialIdResult.floorSystemRatings?.basis).toBe("official_floor_system_exact_match");
    expect(directOfficialIdResult.impact?.LnW).toBe(49);
    expect(directOfficialIdResult.impact?.LnWPlusCI).toBe(53);
  });

  it("keeps visible GDMTXA04A-shaped layers on the defended estimate route", () => {
    const system = getGdmtxa04a();
    const result = calculateAssembly(buildFloorTestLayersFromCriteria(system.match, "tagged"), {
      targetOutputs: TARGET_OUTPUTS
    });

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.floorSystemEstimate?.impact.basis).toBe("predictor_mass_timber_clt_dataholz_dry_estimate");
    expect(result.impact?.estimateCandidateIds).toEqual(["dataholz_gdmtxa01a_clt_lab_2026"]);
    expect(result.floorSystemRatings?.Rw).toBe(65);
    expect(result.impact?.basis).toBe("predictor_mass_timber_clt_dataholz_dry_estimate");
    expect(result.impact?.LnW).toBe(49);
    expect(result.impact?.CI).toBe(4);
    expect(result.impact?.CI50_2500).toBe(9);
    expect(result.impact?.LnWPlusCI).toBe(53);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ctr"]);
  });

  it("defers exact visible reopen until the source composite surface can be modeled explicitly", () => {
    expect(GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION).toEqual({
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
    });
  });
});

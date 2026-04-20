import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { ExactFloorSystem, FloorSystemRecommendation, LayerInput, ResolvedLayer } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GDMTXA04A_SOURCE_FRAME,
  GDMTXA04A_VISIBLE_ESTIMATE_IMPACT_CAP,
  GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION,
  isDataholzGdmtxa04aVisibleEstimateBoundary
} from "./dataholz-gdmtxa04a-composite-surface-model";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const;
const MATERIAL_CATALOG = getDefaultMaterialCatalog();

function getFloorSystem(systemId: string): ExactFloorSystem {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === systemId);

  if (!system) {
    throw new Error(`Missing expected floor system ${systemId}`);
  }

  return system;
}

function resolveLayers(layers: readonly LayerInput[]): ResolvedLayer[] {
  return layers.map((layer) => {
    const material = resolveMaterial(layer.materialId, MATERIAL_CATALOG);

    return {
      ...layer,
      material,
      surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
    };
  });
}

function buildRecommendation(system: ExactFloorSystem): FloorSystemRecommendation {
  return {
    fitPercent: 100,
    matchedSignalCount: 1,
    missingSignals: ["design_contract_probe_only"],
    score: 1,
    system,
    totalSignalCount: 1
  };
}

describe("Dataholz GDMTXA04A composite surface model design", () => {
  it("keeps the visible proxy explicit as a convenience surface rather than a composite-source equivalence", () => {
    expect(GDMTXA04A_SOURCE_FRAME.localCatalogSurface).toEqual({
      materialId: "dry_floating_gypsum_fiberboard",
      floorRole: "floor_covering",
      isConvenienceSurfaceForDirectOfficialIdOnly: true,
      representsSourceCompositeSurface: false
    });

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

  it("pins the current visible boundary as an estimate-only proxy shape backed by the nearby GDMTXA01A source row", () => {
    const visibleLayers = buildFloorTestLayersFromCriteria(
      getFloorSystem("dataholz_gdmtxa04a_clt_lab_2026").match,
      "tagged"
    );
    const resolvedVisibleLayers = resolveLayers(visibleLayers);

    expect(
      isDataholzGdmtxa04aVisibleEstimateBoundary(
        resolvedVisibleLayers,
        GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION.currentVisibleProxy.route,
        [buildRecommendation(getFloorSystem(GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION.currentVisibleProxy.sourceCandidateId))]
      )
    ).toBe(true);

    const result = calculateAssembly(visibleLayers, {
      targetOutputs: TARGET_OUTPUTS
    });

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.basis).toBe(GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION.currentVisibleProxy.route);
    expect(result.impact?.estimateCandidateIds).toEqual([
      GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION.currentVisibleProxy.sourceCandidateId
    ]);
    expect(result.impact?.LnW).toBe(GDMTXA04A_VISIBLE_ESTIMATE_IMPACT_CAP.LnW);
    expect(result.impact?.CI).toBe(GDMTXA04A_VISIBLE_ESTIMATE_IMPACT_CAP.CI);
    expect(result.impact?.CI50_2500).toBe(GDMTXA04A_VISIBLE_ESTIMATE_IMPACT_CAP.CI50_2500);
    expect(result.impact?.LnWPlusCI).toBe(GDMTXA04A_VISIBLE_ESTIMATE_IMPACT_CAP.LnWPlusCI);
  });

  it("fails closed once the visible stack stops matching the proxy boundary or tries to masquerade as the direct exact row", () => {
    const visibleLayers = buildFloorTestLayersFromCriteria(
      getFloorSystem("dataholz_gdmtxa04a_clt_lab_2026").match,
      "tagged"
    );
    const resolvedVisibleLayers = resolveLayers(visibleLayers);
    const visibleLayersWithResilientBreak = resolveLayers([
      ...visibleLayers,
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 }
    ]);

    expect(
      isDataholzGdmtxa04aVisibleEstimateBoundary(
        resolvedVisibleLayers,
        GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION.currentVisibleProxy.route,
        [buildRecommendation(getFloorSystem("dataholz_gdmtxa04a_clt_lab_2026"))]
      )
    ).toBe(false);

    expect(
      isDataholzGdmtxa04aVisibleEstimateBoundary(
        visibleLayersWithResilientBreak,
        GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION.currentVisibleProxy.route,
        [buildRecommendation(getFloorSystem(GDMTXA04A_VISIBLE_SURFACE_MODEL_DECISION.currentVisibleProxy.sourceCandidateId))]
      )
    ).toBe(false);
  });
});

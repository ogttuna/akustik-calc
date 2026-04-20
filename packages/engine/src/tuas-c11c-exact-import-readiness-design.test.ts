import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, ResolvedLayer } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
import {
  TUAS_C11C_COMBINED_WET_SOURCE_LAYERS,
  TUAS_C11C_EXACT_IMPORT_READINESS_DECISION,
  TUAS_C11C_SOURCE_FRAME,
  TUAS_C11C_SOURCE_TUPLE,
  isTuasC11cCombinedWetVisibleBoundary
} from "./tuas-c11c-exact-import-readiness";

const MATERIAL_CATALOG = getDefaultMaterialCatalog();
const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI"] as const;
const FIELD_OUTPUTS = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"] as const;
const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
} as const;

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

describe("TUAS C11c exact import readiness design", () => {
  it("records the visible source frame and the current readiness decision before any exact import reopen", () => {
    expect(TUAS_C11C_SOURCE_FRAME).toEqual({
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
    });

    expect(TUAS_C11C_SOURCE_TUPLE).toEqual({
      id: "C11c",
      importEligible: false,
      lnW: 59,
      lnWPlusCI: 60,
      lnWPlusCI50_2500: 60,
      rw: 74
    });

    expect(TUAS_C11C_EXACT_IMPORT_READINESS_DECISION).toEqual({
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
    });
  });

  it("pins the known visible C11c boundary while the runtime route stays screening-only and impact-fail-closed", () => {
    const resolvedVisibleLayers = resolveLayers(TUAS_C11C_COMBINED_WET_SOURCE_LAYERS);
    const lab = calculateAssembly(TUAS_C11C_COMBINED_WET_SOURCE_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(TUAS_C11C_COMBINED_WET_SOURCE_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const impactOnlyLab = calculateImpactOnly(TUAS_C11C_COMBINED_WET_SOURCE_LAYERS, {
      targetOutputs: ["Ln,w", "Ln,w+CI"]
    });

    expect(EXACT_FLOOR_SYSTEMS.some((system) => system.id === TUAS_C11C_SOURCE_FRAME.exactImportCandidateId)).toBe(false);
    expect(isTuasC11cCombinedWetVisibleBoundary(resolvedVisibleLayers)).toBe(true);

    expect(lab.floorSystemMatch).toBeNull();
    expect(lab.floorSystemEstimate).toBeNull();
    expect(lab.impact).toBeNull();
    expect(lab.floorSystemRatings?.Rw).toBe(49);
    expect(lab.supportedTargetOutputs).toEqual(["Rw"]);
    expect(lab.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);
    expect(
      lab.warnings.some((warning: string) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: floating screed x2/i.test(warning)
      )
    ).toBe(true);
    expect(
      lab.warnings.some((warning: string) =>
        /Closest family candidate is TUAS C7c \| CLT 260 mm \| EPS board \+ geotextile \+ screed/i.test(warning)
      )
    ).toBe(true);

    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate).toBeNull();
    expect(field.impact).toBeNull();
    expect(field.supportedTargetOutputs).toEqual([]);
    expect(field.unsupportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);

    expect(impactOnlyLab.floorSystemMatch).toBeNull();
    expect(impactOnlyLab.floorSystemEstimate).toBeNull();
    expect(impactOnlyLab.impact).toBeNull();
    expect(impactOnlyLab.supportedTargetOutputs).toEqual([]);
    expect(impactOnlyLab.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);
  });

  it("fails closed once the visible stack drifts away from the known C11c boundary", () => {
    const withoutCeilingCavity = resolveLayers(
      TUAS_C11C_COMBINED_WET_SOURCE_LAYERS.filter((layer) => layer.floorRole !== "ceiling_cavity")
    );
    const shiftedUpperFill = resolveLayers(
      TUAS_C11C_COMBINED_WET_SOURCE_LAYERS.map((layer) =>
        layer.floorRole === "upper_fill" ? { ...layer, thicknessMm: 50 } : layer
      )
    );

    expect(isTuasC11cCombinedWetVisibleBoundary(withoutCeilingCavity)).toBe(false);
    expect(isTuasC11cCombinedWetVisibleBoundary(shiftedUpperFill)).toBe(false);
  });
});

import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import { buildImpactPredictorInputFromLayerStack } from "./impact-predictor-input";

function calculateFloorLayers(
  floorLayers: Parameters<typeof buildImpactPredictorInputFromLayerStack>[0],
  targetOutputs: readonly string[] = ["Ln,w"]
) {
  const impactPredictorInput = buildImpactPredictorInputFromLayerStack(floorLayers, {}, { contextMode: "element_lab" });

  return calculateImpactOnly(floorLayers, {
    impactPredictorInput,
    targetOutputs: targetOutputs as never
  });
}

describe("layer-driven impact parity", () => {
  it("exact-matches the published Knauf CT30.1A timber row without manual predictor selectors", () => {
    const result = calculateFloorLayers([
      { materialId: "engineered_timber_structural", thicknessMm: 240, floorRole: "base_structure" },
      { materialId: "engineered_timber_flooring", thicknessMm: 15, floorRole: "floor_covering" },
      { materialId: "glasswool", thicknessMm: 90, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: 13, floorRole: "ceiling_board" }
    ]);

    expect(result.ok).toBe(true);
    expect(result.impact?.LnW).toBe(73);
    expect(result.floorSystemRatings?.Rw).toBe(48);
    expect(result.floorSystemRatings?.RwCtr).toBe(42);
    expect(result.impactPredictorStatus?.matchedFloorSystemId).toBe("knauf_ct30_1a_timber_lab_2026");
  });

  it("keeps generic joist-tagged Knauf timber ceramic direct ceiling on the published family-general lane", () => {
    const result = calculateFloorLayers([
      { materialId: "timber_joist_floor", thicknessMm: 240, floorRole: "base_structure" },
      { materialId: "ceramic_tile", thicknessMm: 8, floorRole: "floor_covering" },
      { materialId: "glasswool", thicknessMm: 90, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: 13, floorRole: "ceiling_board" }
    ]);

    expect(result.ok).toBe(true);
    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.impact?.LnW).toBe(69.9);
    expect(result.floorSystemRatings?.Rw).toBe(51.8);
    expect(result.floorSystemRatings?.RwCtr).toBe(45.1);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_ct30_1a_timber_lab_2026",
      "knauf_ct30_2a_timber_lab_2026",
      "knauf_ct30_1b_timber_lab_2026",
      "knauf_ct30_2b_timber_lab_2026"
    ]);
  });

  it("keeps engineered timber structural ceramic direct ceiling on the published family blend lane", () => {
    const result = calculateFloorLayers([
      { materialId: "engineered_timber_structural", thicknessMm: 240, floorRole: "base_structure" },
      { materialId: "ceramic_tile", thicknessMm: 8, floorRole: "floor_covering" },
      { materialId: "glasswool", thicknessMm: 90, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: 13, floorRole: "ceiling_board" }
    ]);

    expect(result.ok).toBe(true);
    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.impact?.LnW).toBe(69.9);
    expect(result.floorSystemRatings?.Rw).toBe(51.8);
    expect(result.floorSystemRatings?.RwCtr).toBe(45.1);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_ct30_1a_timber_lab_2026",
      "knauf_ct30_2a_timber_lab_2026",
      "knauf_ct30_1b_timber_lab_2026",
      "knauf_ct30_2b_timber_lab_2026"
    ]);
  });

  it("exact-matches the published UBIQ FL-28 open-web steel row from raw layer roles", () => {
    const result = calculateFloorLayers(
      [
        { materialId: "open_web_steel_joist", thicknessMm: 300, floorRole: "base_structure" },
        { materialId: "rubber_sheet", thicknessMm: 5, floorRole: "resilient_layer" },
        { materialId: "particleboard_flooring", thicknessMm: 19, floorRole: "floating_screed" },
        { materialId: "engineered_timber_flooring", thicknessMm: 15, floorRole: "floor_covering" },
        { materialId: "resilient_channel", thicknessMm: 65, floorRole: "ceiling_cavity" },
        { materialId: "glasswool", thicknessMm: 145, floorRole: "ceiling_fill" },
        { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" },
        { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" },
        { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" }
      ],
      ["Ln,w", "Ln,w+CI"]
    );

    expect(result.ok).toBe(true);
    expect(result.impact?.LnW).toBe(51);
    expect(result.impact?.CI).toBe(-2);
    expect(result.impact?.LnWPlusCI).toBe(49);
    expect(result.floorSystemRatings?.Rw).toBe(64);
    expect(result.floorSystemRatings?.RwCtr).toBe(59);
    expect(result.impactPredictorStatus?.matchedFloorSystemId).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
  });

  it("exact-matches the published Pliteq hollow-core vinyl row when the product underlayment is modeled as a layer", () => {
    const result = calculateFloorLayers([
      { materialId: "hollow_core_plank", thicknessMm: 200, floorRole: "base_structure" },
      { materialId: "geniemat_rst05", thicknessMm: 5, floorRole: "resilient_layer" },
      { materialId: "vinyl_flooring", thicknessMm: 2.5, floorRole: "floor_covering" },
      { materialId: "genieclip_rst", thicknessMm: 16, floorRole: "ceiling_cavity" },
      { materialId: "gypsum_board", thicknessMm: 16, floorRole: "ceiling_board" }
    ]);

    expect(result.ok).toBe(true);
    expect(result.impact?.LnW).toBe(48);
    expect(result.floorSystemRatings?.Rw).toBe(62);
    expect(result.impactPredictorStatus?.matchedFloorSystemId).toBe("pliteq_hcp200_vinyl_lab_2026");
  });

  it("exact-matches the measured TUAS CLT row when EPS underlay is modeled as a layer", () => {
    const result = calculateFloorLayers(
      [
        { materialId: "clt_panel", thicknessMm: 140, floorRole: "base_structure" },
        { materialId: "eps_acoustic_underlay", thicknessMm: 3, floorRole: "resilient_layer" },
        { materialId: "laminate_flooring", thicknessMm: 8, floorRole: "floor_covering" }
      ],
      ["Ln,w", "Ln,w+CI"]
    );

    expect(result.ok).toBe(true);
    expect(result.impact?.LnW).toBe(70);
    expect(result.impact?.CI).toBe(0);
    expect(result.impact?.LnWPlusCI).toBe(70);
    expect(result.floorSystemRatings?.Rw).toBe(38);
    expect(result.impactPredictorStatus?.matchedFloorSystemId).toBe("tuas_x2_clt140_measured_2026");
  });

  it("exact-matches the published composite dry floor row from layer roles", () => {
    const result = calculateFloorLayers([
      { materialId: "steel_deck_composite", thicknessMm: 60, floorRole: "base_structure" },
      { materialId: "mw_t_10_impact_layer", thicknessMm: 15, floorRole: "resilient_layer" },
      { materialId: "gypsum_fiberboard", thicknessMm: 25, floorRole: "floor_covering" }
    ]);

    expect(result.ok).toBe(true);
    expect(result.impact?.LnW).toBe(68);
    expect(result.floorSystemRatings?.Rw).toBe(47);
    expect(result.impactPredictorStatus?.matchedFloorSystemId).toBe("pmc_m1_dry_floating_floor_lab_2026");
  });

  it("keeps composite suspended-ceiling-only layer stacks on the published interaction lane", () => {
    const result = calculateFloorLayers([
      { materialId: "steel_deck_composite", thicknessMm: 150, floorRole: "base_structure" },
      { materialId: "resilient_channel", thicknessMm: 150, floorRole: "ceiling_cavity" },
      { materialId: "rockwool", thicknessMm: 100, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" }
    ]);

    expect(result.ok).toBe(true);
    expect(result.impact?.basis).toBe("predictor_composite_panel_published_interaction_estimate");
    expect(result.impact?.LnW).toBe(63.3);
    expect(result.floorSystemRatings?.Rw).toBe(48.6);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "pmc_m1_dry_floating_plus_c2x_lab_2026",
      "pmc_m1_dry_floating_plus_c1x_lab_2026",
      "pmc_m1_bare_composite_lab_2026"
    ]);
  });
});

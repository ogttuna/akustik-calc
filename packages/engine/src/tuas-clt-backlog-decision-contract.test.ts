import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"];
const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
} as const;

const X3_STAGED_UPPER_PROXY_LAYERS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
];

const C3_STAGED_UPPER_PROXY_LAYERS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const X4_HEAVY_DRY_PROXY_LAYERS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
];

const X4_HEAVY_DRY_SHORTHAND_LAYERS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
];

const C4_HEAVY_DRY_PROXY_LAYERS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const C4_HEAVY_DRY_PACKED_LAYERS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 30 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const C4_HEAVY_DRY_SHORTHAND_LAYERS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const C5_HEAVY_DRY_PROXY_LAYERS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const C5_HEAVY_DRY_PACKED_LAYERS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 60 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const C5_HEAVY_DRY_SHORTHAND_LAYERS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const C7_WET_GEOTEXTILE_PROXY_LAYERS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const C7C_COMBINED_WET_PROXY_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const C5C_VISIBLE_COMBINED_PROXY_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const C3C_COMBINED_STAGED_SOURCE_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const C4C_COMBINED_HEAVY_DRY_SOURCE_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const C11C_COMBINED_SOURCE_LAYERS: readonly LayerInput[] = [
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
];

const C2C_COMBINED_BASIC_SOURCE_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const C2C_COMBINED_BASIC_PACKED_CEILING_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 26 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const LANDED_TUAS_CLT_STAGED_UPPER_TIER = ["X3", "C3"] as const;
const LANDED_TUAS_CLT_HEAVY_DRY_TOP_TIER = ["X4", "C4", "C5"] as const;
const LANDED_TUAS_CLT_WET_GEOTEXTILE_TIER = ["C7"] as const;
const LANDED_TUAS_CLT_COMBINED_BASIC_TIER = ["C2c"] as const;
const LANDED_TUAS_CLT_COMBINED_WET_TIER = ["C7c"] as const;
const LANDED_TUAS_CLT_COMBINED_STAGED_TIER = ["C3c"] as const;
const LANDED_TUAS_CLT_COMBINED_HEAVY_DRY_TIER = ["C4c"] as const;
const NEXT_TUAS_CLT_HEAVY_DRY_TOP_CANDIDATE = [] as const;
const DEFERRED_TUAS_CLT_HEAVY_DRY_TOP_TIER = [] as const;
const DEFERRED_TUAS_CLT_COMBINED_SCREENING_TIER = ["C11c"] as const;
const DEFERRED_TUAS_CLT_WET_GEOTEXTILE_TIER = [] as const;

describe("TUAS CLT backlog decision contract", () => {
  it("keeps the X3 staged upper CLT row exact once the dedicated schedule-backed surface lands", () => {
    const lab = calculateAssembly(X3_STAGED_UPPER_PROXY_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(X3_STAGED_UPPER_PROXY_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_x3_clt140_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(52);
    expect(lab.impact?.CI).toBe(0);
    expect(lab.impact?.CI50_2500).toBe(8);
    expect(lab.impact?.LnWPlusCI).toBe(52);
    expect(lab.floorSystemRatings?.Rw).toBe(49);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning: string) =>
        /single-entry floor roles are duplicated: floating screed x3 \(Gypsum Board, Mineral Screed\)/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_x3_clt140_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(52);
    expect(field.impact?.LPrimeNW).toBe(54);
    expect(field.impact?.LPrimeNTw).toBe(52);
    expect(field.impact?.LPrimeNT50).toBe(60);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the C3 staged upper CLT row exact once the thicker same-surface follow-on lands", () => {
    const lab = calculateAssembly(C3_STAGED_UPPER_PROXY_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(C3_STAGED_UPPER_PROXY_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_c3_clt260_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(47);
    expect(lab.impact?.CI).toBe(2);
    expect(lab.impact?.CI50_2500).toBe(6);
    expect(lab.impact?.LnWPlusCI).toBe(49);
    expect(lab.floorSystemRatings?.Rw).toBe(54);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning: string) =>
        /single-entry floor roles are duplicated: floating screed x3 \(Gypsum Board, Mineral Screed\)/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_c3_clt260_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(47);
    expect(field.impact?.LPrimeNW).toBe(49);
    expect(field.impact?.LPrimeNTw).toBe(47);
    expect(field.impact?.LPrimeNT50).toBe(53);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the X4 heavy dry-top CLT row exact once the dedicated same-surface row lands", () => {
    const lab = calculateAssembly(X4_HEAVY_DRY_PROXY_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(X4_HEAVY_DRY_PROXY_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_x4_clt140_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(50);
    expect(lab.impact?.CI).toBe(1);
    expect(lab.impact?.CI50_2500).toBe(8);
    expect(lab.impact?.LnWPlusCI).toBe(51);
    expect(lab.floorSystemRatings?.Rw).toBe(55);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning: string) =>
        /single-entry floor roles are duplicated: floating screed x2 \(Gypsum Board\)/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_x4_clt140_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(50);
    expect(field.impact?.LPrimeNW).toBe(52);
    expect(field.impact?.LPrimeNTw).toBe(50);
    expect(field.impact?.LPrimeNT50).toBe(58);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the over-abstracted X4 heavy dry-top shorthand off the exact lane even after the visible-layer row lands", () => {
    const lab = calculateAssembly(X4_HEAVY_DRY_SHORTHAND_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });

    expect(lab.floorSystemMatch).toBeNull();
    expect(lab.floorSystemEstimate?.kind).toBe("family_general");
    expect(lab.floorSystemEstimate?.fitPercent).toBe(94);
    expect(lab.impact?.basis).toBe("predictor_mass_timber_clt_dry_interaction_estimate");
    expect(lab.impact?.estimateCandidateIds).toEqual(["tuas_x5_clt140_measured_2026"]);
    expect(lab.impact?.LnW).toBe(65);
    expect(lab.impact?.LnWPlusCI).toBe(65);
    expect(lab.floorSystemRatings?.Rw).toBe(55);
  });

  it("keeps the C4 heavy dry-top sibling exact once the thicker same-surface row lands", () => {
    const lab = calculateAssembly(C4_HEAVY_DRY_PROXY_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(C4_HEAVY_DRY_PROXY_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const packed = calculateAssembly(C4_HEAVY_DRY_PACKED_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_c4_clt260_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(45);
    expect(lab.impact?.CI).toBe(1);
    expect(lab.impact?.CI50_2500).toBe(6);
    expect(lab.impact?.LnWPlusCI).toBe(46);
    expect(lab.floorSystemRatings?.Rw).toBe(61);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning: string) =>
        /single-entry floor roles are duplicated: floating screed x2 \(Gypsum Board\)/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_c4_clt260_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(45);
    expect(field.impact?.LPrimeNW).toBe(47);
    expect(field.impact?.LPrimeNTw).toBe(45);
    expect(field.impact?.LPrimeNT50).toBe(51);
    expect(field.floorSystemRatings?.Rw).toBe(61);

    expect(packed.floorSystemMatch?.system.id).toBe("tuas_c4_clt260_measured_2026");
    expect(packed.impact?.LnW).toBe(45);
    expect(packed.floorSystemRatings?.Rw).toBe(61);
  });

  it("keeps the over-abstracted C4 heavy dry-top shorthand off the exact lane even after the thicker carrier row lands", () => {
    const lab = calculateAssembly(C4_HEAVY_DRY_SHORTHAND_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });

    expect(lab.floorSystemMatch).toBeNull();
    expect(lab.floorSystemEstimate?.kind).toBe("family_general");
    expect(lab.floorSystemEstimate?.fitPercent).toBe(94);
    expect(lab.impact?.basis).toBe("predictor_mass_timber_clt_dry_interaction_estimate");
    expect(lab.impact?.estimateCandidateIds).toEqual(["tuas_x5_clt140_measured_2026"]);
    expect(lab.impact?.LnW).toBe(65);
    expect(lab.impact?.LnWPlusCI).toBe(65);
    expect(lab.floorSystemRatings?.Rw).toBe(55);
  });

  it("keeps the C5 heavy dry-top sibling exact once the heavier same-surface row lands", () => {
    const lab = calculateAssembly(C5_HEAVY_DRY_PROXY_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(C5_HEAVY_DRY_PROXY_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const packed = calculateAssembly(C5_HEAVY_DRY_PACKED_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_c5_clt260_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(60);
    expect(lab.impact?.CI).toBe(2);
    expect(lab.impact?.CI50_2500).toBe(3);
    expect(lab.impact?.LnWPlusCI).toBe(62);
    expect(lab.floorSystemRatings?.Rw).toBe(61);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning: string) =>
        /single-entry floor roles are duplicated: floating screed x4 \(Gypsum Board\)/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_c5_clt260_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(60);
    expect(field.impact?.LPrimeNW).toBe(62);
    expect(field.impact?.LPrimeNTw).toBe(60);
    expect(field.impact?.LPrimeNT50).toBe(63);
    expect(field.floorSystemRatings?.Rw).toBe(61);

    expect(packed.floorSystemMatch?.system.id).toBe("tuas_c5_clt260_measured_2026");
    expect(packed.impact?.LnW).toBe(60);
    expect(packed.floorSystemRatings?.Rw).toBe(61);
  });

  it("keeps the over-abstracted C5 heavy dry-top shorthand off the exact lane even after the heavier row lands", () => {
    const lab = calculateAssembly(C5_HEAVY_DRY_SHORTHAND_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(C5_HEAVY_DRY_SHORTHAND_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch).toBeNull();
    expect(lab.floorSystemEstimate?.kind).toBe("family_general");
    expect(lab.floorSystemEstimate?.fitPercent).toBe(94);
    expect(lab.impact?.basis).toBe("predictor_mass_timber_clt_dry_interaction_estimate");
    expect(lab.impact?.estimateCandidateIds).toEqual(["tuas_x5_clt140_measured_2026"]);
    expect(lab.impact?.LnW).toBe(65);
    expect(lab.impact?.LnWPlusCI).toBe(65);
    expect(lab.floorSystemRatings?.Rw).toBe(55);

    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate?.kind).toBe("family_general");
    expect(field.floorSystemEstimate?.fitPercent).toBe(94);
    expect(field.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.estimateCandidateIds).toEqual(["tuas_x5_clt140_measured_2026"]);
    expect(field.impact?.LnW).toBe(65);
    expect(field.impact?.LPrimeNW).toBe(67);
    expect(field.impact?.LPrimeNTw).toBe(65);
    expect(field.impact?.LPrimeNT50).toBe(65);
    expect(field.floorSystemRatings?.Rw).toBe(55);
  });

  it("keeps the C7 wet geotextile CLT row exact once the dedicated same-surface source stack lands", () => {
    const lab = calculateAssembly(C7_WET_GEOTEXTILE_PROXY_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(C7_WET_GEOTEXTILE_PROXY_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_c7_clt260_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(39);
    expect(lab.impact?.CI).toBe(1);
    expect(lab.impact?.CI50_2500).toBe(3);
    expect(lab.impact?.LnWPlusCI).toBe(40);
    expect(lab.floorSystemRatings?.Rw).toBe(57);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning: string) =>
        /single-entry floor roles are duplicated: floating screed x2 \(Geotextile, Mineral Screed\)/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_c7_clt260_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(39);
    expect(field.impact?.LPrimeNW).toBe(41);
    expect(field.impact?.LPrimeNTw).toBe(39);
    expect(field.impact?.LPrimeNT50).toBe(42);
    expect(field.floorSystemRatings?.Rw).toBe(57);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the combined C7c wet geotextile CLT row exact once the explicit lower-ceiling sibling lands", () => {
    const lab = calculateAssembly(C7C_COMBINED_WET_PROXY_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(C7C_COMBINED_WET_PROXY_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_c7c_clt260_measured_2026");
    expect(lab.floorSystemEstimate).toBeNull();
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(30);
    expect(lab.impact?.CI).toBe(5);
    expect(lab.impact?.CI50_2500).toBe(14);
    expect(lab.impact?.LnWPlusCI).toBe(35);
    expect(lab.floorSystemRatings?.Rw).toBe(75);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning: string) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: floating screed x2/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_c7c_clt260_measured_2026");
    expect(field.floorSystemEstimate).toBeNull();
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(30);
    expect(field.impact?.LPrimeNW).toBe(32);
    expect(field.impact?.LPrimeNTw).toBe(30);
    expect(field.impact?.LPrimeNT50).toBe(44);
    expect(field.floorSystemRatings?.Rw).toBe(75);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("carries the visible C5c dry combined CLT surface onto the explicit combined predictor lane", () => {
    const lab = calculateAssembly(C5C_VISIBLE_COMBINED_PROXY_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(C5C_VISIBLE_COMBINED_PROXY_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch).toBeNull();
    expect(lab.floorSystemEstimate?.kind).toBe("family_general");
    expect(lab.floorSystemEstimate?.fitPercent).toBe(92.8);
    expect(lab.impact?.basis).toBe("predictor_mass_timber_clt_dry_interaction_estimate");
    expect(lab.impact?.estimateCandidateIds).toEqual(["tuas_c5c_clt260_measured_2026"]);
    expect(lab.impact?.LnW).toBe(38);
    expect(lab.impact?.CI).toBe(4);
    expect(lab.impact?.CI50_2500).toBe(6);
    expect(lab.impact?.LnWPlusCI).toBe(42);
    expect(lab.floorSystemRatings?.Rw).toBe(75);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning: string) => /Published family estimate active: mass-timber CLT family general at 92\.8% fit/i.test(warning))
    ).toBe(true);

    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate?.kind).toBe("family_general");
    expect(field.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(38);
    expect(field.impact?.CI).toBe(4);
    expect(field.impact?.CI50_2500).toBe(6);
    expect(field.impact?.LnWPlusCI).toBe(42);
    expect(field.impact?.LPrimeNW).toBe(40);
    expect(field.impact?.LPrimeNTw).toBe(38);
    expect(field.impact?.LPrimeNT50).toBe(44);
    expect(field.floorSystemRatings?.Rw).toBe(75);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("lands the source-backed C3c staged combined CLT row as the first exact decision-matrix import", () => {
    const lab = calculateAssembly(C3C_COMBINED_STAGED_SOURCE_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(C3C_COMBINED_STAGED_SOURCE_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_c3c_clt260_measured_2026");
    expect(lab.floorSystemEstimate).toBeNull();
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(27);
    expect(lab.impact?.CI).toBe(2);
    expect(lab.impact?.CI50_2500).toBe(16);
    expect(lab.impact?.LnWPlusCI).toBe(29);
    expect(lab.floorSystemRatings?.Rw).toBe(73);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_c3c_clt260_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(27);
    expect(field.impact?.LPrimeNW).toBe(29);
    expect(field.impact?.LPrimeNTw).toBe(27);
    expect(field.impact?.LPrimeNT50).toBe(43);
    expect(field.floorSystemRatings?.Rw).toBe(73);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("lands the source-backed C4c heavy dry combined CLT row as a pure exact candidate without collapsing onto the upper-only C4 neighbor", () => {
    const lab = calculateAssembly(C4C_COMBINED_HEAVY_DRY_SOURCE_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(C4C_COMBINED_HEAVY_DRY_SOURCE_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_c4c_clt260_measured_2026");
    expect(lab.floorSystemEstimate).toBeNull();
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(24);
    expect(lab.impact?.CI).toBe(2);
    expect(lab.impact?.CI50_2500).toBe(16);
    expect(lab.impact?.LnWPlusCI).toBe(26);
    expect(lab.floorSystemRatings?.Rw).toBe(74);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_c4c_clt260_measured_2026");
    expect(field.floorSystemEstimate).toBeNull();
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(24);
    expect(field.impact?.LPrimeNW).toBe(26);
    expect(field.impact?.LPrimeNTw).toBe(24);
    expect(field.impact?.LPrimeNT50).toBe(40);
    expect(field.floorSystemRatings?.Rw).toBe(74);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the source-backed C11c combined wet CLT row screening-only until its own wet-stack anomaly audit lands", () => {
    const lab = calculateAssembly(C11C_COMBINED_SOURCE_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });

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
  });

  it("keeps the C2c combined CLT row exact once the source-backed lower-ceiling surface lands", () => {
    const lab = calculateAssembly(C2C_COMBINED_BASIC_SOURCE_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(C2C_COMBINED_BASIC_SOURCE_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const packed = calculateAssembly(C2C_COMBINED_BASIC_PACKED_CEILING_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_c2c_clt260_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(35);
    expect(lab.impact?.CI).toBe(4);
    expect(lab.impact?.CI50_2500).toBe(9);
    expect(lab.impact?.LnWPlusCI).toBe(39);
    expect(lab.floorSystemRatings?.Rw).toBe(70);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_c2c_clt260_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(35);
    expect(field.impact?.LPrimeNW).toBe(37);
    expect(field.impact?.LPrimeNTw).toBe(35);
    expect(field.impact?.LPrimeNT50).toBe(44);
    expect(field.floorSystemRatings?.Rw).toBe(70);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);

    expect(packed.floorSystemMatch?.system.id).toBe("tuas_c2c_clt260_measured_2026");
    expect(packed.impact?.LnW).toBe(35);
    expect(packed.floorSystemRatings?.Rw).toBe(70);
  });

  it("keeps the post-rerank TUAS CLT queue explicit", () => {
    expect(LANDED_TUAS_CLT_STAGED_UPPER_TIER).toEqual(["X3", "C3"]);
    expect(LANDED_TUAS_CLT_HEAVY_DRY_TOP_TIER).toEqual(["X4", "C4", "C5"]);
    expect(LANDED_TUAS_CLT_WET_GEOTEXTILE_TIER).toEqual(["C7"]);
    expect(LANDED_TUAS_CLT_COMBINED_BASIC_TIER).toEqual(["C2c"]);
    expect(LANDED_TUAS_CLT_COMBINED_WET_TIER).toEqual(["C7c"]);
    expect(LANDED_TUAS_CLT_COMBINED_STAGED_TIER).toEqual(["C3c"]);
    expect(LANDED_TUAS_CLT_COMBINED_HEAVY_DRY_TIER).toEqual(["C4c"]);
    expect(NEXT_TUAS_CLT_HEAVY_DRY_TOP_CANDIDATE).toEqual([]);
    expect(DEFERRED_TUAS_CLT_HEAVY_DRY_TOP_TIER).toEqual([]);
    expect(DEFERRED_TUAS_CLT_COMBINED_SCREENING_TIER).toEqual(["C11c"]);
    expect(DEFERRED_TUAS_CLT_WET_GEOTEXTILE_TIER).toEqual([]);
  });
});

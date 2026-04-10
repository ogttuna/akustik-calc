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

const C2C_COMBINED_BASIC_PROXY_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const LANDED_TUAS_CLT_STAGED_UPPER_TIER = ["X3", "C3"] as const;
const LANDED_TUAS_CLT_HEAVY_DRY_TOP_TIER = ["X4", "C4", "C5"] as const;
const NEXT_TUAS_CLT_HEAVY_DRY_TOP_CANDIDATE = [] as const;
const DEFERRED_TUAS_CLT_HEAVY_DRY_TOP_TIER = [] as const;
const DEFERRED_TUAS_CLT_COMBINED_SCREENING_TIER = ["C2c", "C3c", "C4c", "C7c", "C11c"] as const;
const DEFERRED_TUAS_CLT_WET_GEOTEXTILE_TIER = ["C7"] as const;

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
    expect(lab.impact?.LnW).toBe(61);
    expect(lab.impact?.CI).toBe(2);
    expect(lab.impact?.CI50_2500).toBe(3);
    expect(lab.impact?.LnWPlusCI).toBe(63);
    expect(lab.floorSystemRatings?.Rw).toBe(49);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x3 \(Gypsum Board, Mineral Screed\)/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_x3_clt140_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(61);
    expect(field.impact?.LPrimeNW).toBe(63);
    expect(field.impact?.LPrimeNTw).toBe(61);
    expect(field.impact?.LPrimeNT50).toBe(64);
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
    expect(lab.impact?.LnW).toBe(55);
    expect(lab.impact?.CI).toBe(3);
    expect(lab.impact?.CI50_2500).toBe(4);
    expect(lab.impact?.LnWPlusCI).toBe(58);
    expect(lab.floorSystemRatings?.Rw).toBe(54);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x3 \(Gypsum Board, Mineral Screed\)/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_c3_clt260_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(55);
    expect(field.impact?.LPrimeNW).toBe(57);
    expect(field.impact?.LPrimeNTw).toBe(55);
    expect(field.impact?.LPrimeNT50).toBe(59);
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
    expect(lab.impact?.LnW).toBe(52);
    expect(lab.impact?.CI).toBe(0);
    expect(lab.impact?.CI50_2500).toBe(8);
    expect(lab.impact?.LnWPlusCI).toBe(52);
    expect(lab.floorSystemRatings?.Rw).toBe(55);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x2 \(Gypsum Board\)/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_x4_clt140_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(52);
    expect(field.impact?.LPrimeNW).toBe(54);
    expect(field.impact?.LPrimeNTw).toBe(52);
    expect(field.impact?.LPrimeNT50).toBe(60);
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
    expect(lab.impact?.LnW).toBe(50);
    expect(lab.impact?.LnWPlusCI).toBe(51);
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
    expect(lab.impact?.LnW).toBe(47);
    expect(lab.impact?.CI).toBe(2);
    expect(lab.impact?.CI50_2500).toBe(6);
    expect(lab.impact?.LnWPlusCI).toBe(49);
    expect(lab.floorSystemRatings?.Rw).toBe(61);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x2 \(Gypsum Board\)/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_c4_clt260_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(47);
    expect(field.impact?.LPrimeNW).toBe(49);
    expect(field.impact?.LPrimeNTw).toBe(47);
    expect(field.impact?.LPrimeNT50).toBe(53);
    expect(field.floorSystemRatings?.Rw).toBe(61);

    expect(packed.floorSystemMatch?.system.id).toBe("tuas_c4_clt260_measured_2026");
    expect(packed.impact?.LnW).toBe(47);
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
    expect(lab.impact?.LnW).toBe(50);
    expect(lab.impact?.LnWPlusCI).toBe(51);
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
    expect(lab.impact?.LnW).toBe(45);
    expect(lab.impact?.CI).toBe(1);
    expect(lab.impact?.CI50_2500).toBe(6);
    expect(lab.impact?.LnWPlusCI).toBe(46);
    expect(lab.floorSystemRatings?.Rw).toBe(61);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x4 \(Gypsum Board\)/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_c5_clt260_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(45);
    expect(field.impact?.LPrimeNW).toBe(47);
    expect(field.impact?.LPrimeNTw).toBe(45);
    expect(field.impact?.LPrimeNT50).toBe(51);
    expect(field.floorSystemRatings?.Rw).toBe(61);

    expect(packed.floorSystemMatch?.system.id).toBe("tuas_c5_clt260_measured_2026");
    expect(packed.impact?.LnW).toBe(45);
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
    expect(lab.impact?.LnW).toBe(50);
    expect(lab.impact?.LnWPlusCI).toBe(51);
    expect(lab.floorSystemRatings?.Rw).toBe(55);

    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate?.kind).toBe("family_general");
    expect(field.floorSystemEstimate?.fitPercent).toBe(94);
    expect(field.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.estimateCandidateIds).toEqual(["tuas_x5_clt140_measured_2026"]);
    expect(field.impact?.LnW).toBe(50);
    expect(field.impact?.LPrimeNW).toBe(52);
    expect(field.impact?.LPrimeNTw).toBe(50);
    expect(field.impact?.LPrimeNT50).toBe(58);
    expect(field.floorSystemRatings?.Rw).toBe(55);
  });

  it("keeps the basic combined C2c proxy screening-only until a dedicated CLT lower-ceiling interaction surface exists", () => {
    const lab = calculateAssembly(C2C_COMBINED_BASIC_PROXY_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });

    expect(lab.floorSystemMatch).toBeNull();
    expect(lab.floorSystemEstimate).toBeNull();
    expect(lab.impact).toBeNull();
    expect(lab.floorSystemRatings?.Rw).toBe(42);
    expect(lab.supportedTargetOutputs).toEqual(["Rw"]);
    expect(lab.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);
    expect(
      lab.warnings.some((warning) =>
        /Impact sound outputs are not available for the current input\/path: Ln,w, Ln,w\+CI/i.test(warning)
      )
    ).toBe(true);
  });

  it("keeps the post-rerank TUAS CLT queue explicit", () => {
    expect(LANDED_TUAS_CLT_STAGED_UPPER_TIER).toEqual(["X3", "C3"]);
    expect(LANDED_TUAS_CLT_HEAVY_DRY_TOP_TIER).toEqual(["X4", "C4", "C5"]);
    expect(NEXT_TUAS_CLT_HEAVY_DRY_TOP_CANDIDATE).toEqual([]);
    expect(DEFERRED_TUAS_CLT_HEAVY_DRY_TOP_TIER).toEqual([]);
    expect(DEFERRED_TUAS_CLT_COMBINED_SCREENING_TIER).toEqual(["C2c", "C3c", "C4c", "C7c", "C11c"]);
    expect(DEFERRED_TUAS_CLT_WET_GEOTEXTILE_TIER).toEqual(["C7"]);
  });
});

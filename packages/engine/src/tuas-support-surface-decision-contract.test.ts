import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"];

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const R6A_MIXED_BOARD_PROXY_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const HYBRID_LOWER_TREATMENT_PROXY_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const R7B_HYBRID_LOWER_SOURCE_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const R8B_HYBRID_LOWER_SOURCE_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const R9B_HYBRID_LOWER_SOURCE_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const R2C_HYBRID_LOWER_PROXY_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const R10A_STAGED_UPPER_PACKAGE_SPLIT_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const R10A_STAGED_UPPER_PACKAGE_SHORTHAND_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 13 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 33 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const LANDED_TUAS_STAGED_UPPER_PACKAGE_TIER = ["R10a"] as const;
const LANDED_TUAS_HYBRID_LOWER_TREATMENT_TIER = ["R7b", "R8b", "R9b", "R2c"] as const;
const REMAINING_TUAS_SUPPORT_SURFACE_TIER = [] as const;
const NEXT_TUAS_HYBRID_LOWER_TREATMENT_ANCHOR = [] as const;
const NEXT_TUAS_HYBRID_LOWER_TREATMENT_GEOTEXTILE_SIBLING = [] as const;
const LATER_TUAS_HYBRID_LOWER_TREATMENT_VARIANT_TIER = [] as const;

describe("TUAS support-surface decision contract", () => {
  it("keeps the R6a mixed-board family-a corridor explicit once the dedicated lower-schedule surface lands", () => {
    const lab = calculateAssembly(R6A_MIXED_BOARD_PROXY_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(R6A_MIXED_BOARD_PROXY_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_r6a_open_box_timber_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(60);
    expect(lab.impact?.LnWPlusCI).toBe(61);
    expect(lab.floorSystemRatings?.Rw).toBe(56);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning) =>
        /single-entry floor roles are duplicated: ceiling board x6 \(Gypsum Board\)/i.test(warning)
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_r6a_open_box_timber_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(60);
    expect(field.impact?.LPrimeNW).toBe(62);
    expect(field.impact?.LPrimeNTw).toBe(59.6);
    expect(field.impact?.LPrimeNT50).toBe(62.6);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the R7b-shaped proxy without the separator layer on the broader family-general lane even after the exact anchor lands", () => {
    const lab = calculateAssembly(HYBRID_LOWER_TREATMENT_PROXY_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(HYBRID_LOWER_TREATMENT_PROXY_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch).toBeNull();
    expect(lab.floorSystemEstimate?.kind).toBe("family_general");
    expect(lab.floorSystemEstimate?.fitPercent).toBe(54);
    expect(lab.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(lab.impact?.estimateCandidateIds).toEqual([
      "tuas_r9b_open_box_timber_measured_2026",
      "tuas_r7b_open_box_timber_measured_2026",
      "tuas_r7a_open_box_timber_measured_2026"
    ]);
    expect(lab.impact?.LnW).toBe(48.3);
    expect(lab.impact?.LnWPlusCI).toBe(49.2);
    expect(lab.floorSystemRatings?.Rw).toBe(67.3);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(
      lab.warnings.some((warning) =>
        /single-entry floor roles are duplicated: ceiling cavity x2 \(TUAS Open-box Ceiling Family A, Resilient Stud Ceiling\)/i.test(
          warning
        )
      )
    ).toBe(true);
    expect(lab.warnings.some((warning) => /family general at 54% fit/i.test(warning))).toBe(true);

    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate?.kind).toBe("family_general");
    expect(field.floorSystemEstimate?.fitPercent).toBe(54);
    expect(field.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.estimateCandidateIds).toEqual([
      "tuas_r9b_open_box_timber_measured_2026",
      "tuas_r7b_open_box_timber_measured_2026",
      "tuas_r7a_open_box_timber_measured_2026"
    ]);
    expect(field.impact?.LnW).toBe(48.3);
    expect(field.impact?.LPrimeNW).toBe(50.3);
    expect(field.impact?.LPrimeNTw).toBe(47.9);
    expect(field.impact?.LPrimeNT50).toBe(50.6);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
  });

  it("lands the true R7b source stack on the exact route once the geotextile-backed hybrid surface exists", () => {
    const lab = calculateAssembly(R7B_HYBRID_LOWER_SOURCE_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(R7B_HYBRID_LOWER_SOURCE_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_r7b_open_box_timber_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(47);
    expect(lab.impact?.LnWPlusCI).toBe(47);
    expect(lab.floorSystemRatings?.Rw).toBe(72);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.warnings.some((warning) => /single-entry floor roles are duplicated: ceiling cavity x2/i.test(warning))).toBe(false);
    expect(lab.warnings.some((warning) => /single-entry floor roles are duplicated: floating screed x2/i.test(warning))).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_r7b_open_box_timber_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(47);
    expect(field.impact?.LPrimeNW).toBe(49);
    expect(field.impact?.LPrimeNTw).toBe(46.6);
    expect(field.impact?.LPrimeNT50).toBe(47.6);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("lands the true R8b finishless sibling on the exact route once the no-finish follow-on surface exists", () => {
    const lab = calculateAssembly(R8B_HYBRID_LOWER_SOURCE_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(R8B_HYBRID_LOWER_SOURCE_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_r8b_open_box_timber_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(50);
    expect(lab.impact?.LnWPlusCI).toBe(49);
    expect(lab.floorSystemRatings?.Rw).toBe(72);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning) =>
        /single-entry floor roles are duplicated: ceiling cavity x2 \(TUAS Open-box Ceiling Family A, Resilient Stud Ceiling\); floating screed x2 \(Geotextile Separator Layer, Mineral Screed\)/i.test(
          warning
        )
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_r8b_open_box_timber_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(50);
    expect(field.impact?.LPrimeNW).toBe(52);
    expect(field.impact?.LPrimeNTw).toBe(49.6);
    expect(field.impact?.LPrimeNT50).toBe(49.6);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("lands the true R9b hybrid lower-treatment wet-top sibling on the exact route once the source stack is frozen correctly", () => {
    const lab = calculateAssembly(R9B_HYBRID_LOWER_SOURCE_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(R9B_HYBRID_LOWER_SOURCE_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_r9b_open_box_timber_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(45);
    expect(lab.impact?.CI).toBe(1);
    expect(lab.impact?.CI50_2500).toBe(3);
    expect(lab.impact?.LnWPlusCI).toBe(46);
    expect(lab.floorSystemRatings?.Rw).toBe(68);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.warnings.some((warning) => /single-entry floor roles are duplicated: ceiling cavity x2/i.test(warning))).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_r9b_open_box_timber_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(45);
    expect(field.impact?.LPrimeNW).toBe(47);
    expect(field.impact?.LPrimeNTw).toBe(44.6);
    expect(field.impact?.LPrimeNT50).toBe(47.6);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("lands the true R2c no-fill hybrid lower-treatment variant on the exact route once the source stack is frozen correctly", () => {
    const lab = calculateAssembly(R2C_HYBRID_LOWER_PROXY_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(R2C_HYBRID_LOWER_PROXY_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_r2c_open_box_timber_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(70);
    expect(lab.impact?.LnWPlusCI).toBe(70);
    expect(lab.floorSystemRatings?.Rw).toBe(54);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.warnings.some((warning) => /single-entry floor roles are duplicated: ceiling cavity x2/i.test(warning))).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_r2c_open_box_timber_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(70);
    expect(field.impact?.LPrimeNW).toBe(72);
    expect(field.impact?.LPrimeNTw).toBe(69.6);
    expect(field.impact?.LPrimeNT50).toBe(69.6);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the source-backed R10a staged upper package exact once the floating-screed schedule surface lands", () => {
    const lab = calculateAssembly(R10A_STAGED_UPPER_PACKAGE_SPLIT_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(R10A_STAGED_UPPER_PACKAGE_SPLIT_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch?.system.id).toBe("tuas_r10a_open_box_timber_measured_2026");
    expect(lab.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(lab.impact?.LnW).toBe(55);
    expect(lab.impact?.LnWPlusCI).toBe(55);
    expect(lab.floorSystemRatings?.Rw).toBe(56);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(
      lab.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x3 \(Gypsum Board, Mineral Screed\)/i.test(
          warning
        )
      )
    ).toBe(false);

    expect(field.floorSystemMatch?.system.id).toBe("tuas_r10a_open_box_timber_measured_2026");
    expect(field.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.LnW).toBe(55);
    expect(field.impact?.LPrimeNW).toBe(57);
    expect(field.impact?.LPrimeNTw).toBe(54.6);
    expect(field.impact?.LPrimeNT50).toBe(55.6);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the over-abstracted R10a shorthand off the exact lane so it cannot silently collapse onto the existing dry family-a corridor", () => {
    const lab = calculateAssembly(R10A_STAGED_UPPER_PACKAGE_SHORTHAND_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(R10A_STAGED_UPPER_PACKAGE_SHORTHAND_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch).toBeNull();
    expect(lab.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(lab.floorSystemEstimate?.fitPercent).toBe(90);
    expect(lab.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(lab.impact?.estimateCandidateIds).toEqual([
      "tuas_r3a_open_box_timber_measured_2026",
      "tuas_r3b_open_box_timber_measured_2026",
      "tuas_r5a_open_box_timber_measured_2026"
    ]);
    expect(lab.impact?.LnW).toBe(53.9);
    expect(lab.floorSystemRatings?.Rw).toBe(60.9);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.warnings.some((warning) => /family archetype at 90% fit/i.test(warning))).toBe(true);

    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(field.floorSystemEstimate?.fitPercent).toBe(90);
    expect(field.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(field.impact?.estimateCandidateIds).toEqual([
      "tuas_r3a_open_box_timber_measured_2026",
      "tuas_r3b_open_box_timber_measured_2026",
      "tuas_r5a_open_box_timber_measured_2026"
    ]);
    expect(field.impact?.LnW).toBe(53.9);
    expect(field.impact?.LPrimeNW).toBe(55.9);
    expect(field.impact?.LPrimeNTw).toBe(53.5);
    expect(field.impact?.LPrimeNT50).toBe(56.7);
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
  });

  it("keeps the post-R2c TUAS hybrid support-surface queue explicit once the no-fill sibling lands", () => {
    expect(LANDED_TUAS_STAGED_UPPER_PACKAGE_TIER).toEqual(["R10a"]);
    expect(LANDED_TUAS_HYBRID_LOWER_TREATMENT_TIER).toEqual(["R7b", "R8b", "R9b", "R2c"]);
    expect(REMAINING_TUAS_SUPPORT_SURFACE_TIER).toEqual([]);
    expect(NEXT_TUAS_HYBRID_LOWER_TREATMENT_ANCHOR).toEqual([]);
    expect(NEXT_TUAS_HYBRID_LOWER_TREATMENT_GEOTEXTILE_SIBLING).toEqual([]);
    expect(LATER_TUAS_HYBRID_LOWER_TREATMENT_VARIANT_TIER).toEqual([]);
  });
});

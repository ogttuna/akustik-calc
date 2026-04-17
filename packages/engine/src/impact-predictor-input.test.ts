import type { MaterialDefinition } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  adaptImpactPredictorInput,
  buildImpactPredictorInputFromLayerStack,
  getVisibleLayerPredictorBlockerWarning,
  maybeBuildImpactPredictorInputFromLayerStack,
  maybeInferFloorRoleLayerStack
} from "./impact-predictor-input";
import { getDefaultMaterialCatalog } from "./material-catalog";

describe("buildImpactPredictorInputFromLayerStack", () => {
  it("infers missing roles from an untagged heavy floating floor stack", () => {
    const input = buildImpactPredictorInputFromLayerStack(
      [
        { materialId: "concrete", thicknessMm: 150 },
        { materialId: "generic_resilient_underlay", thicknessMm: 8 },
        { materialId: "screed", thicknessMm: 30 },
        { materialId: "ceramic_tile", thicknessMm: 8 }
      ],
      {
        referenceFloorType: "heavy_standard"
      },
      {
        contextMode: "element_lab"
      }
    );

    expect(input.structuralSupportType).toBe("reinforced_concrete");
    expect(input.impactSystemType).toBe("heavy_floating_floor");
    expect(input.referenceFloorType).toBe("heavy_standard");
    expect(input.baseSlab).toEqual({
      densityKgM3: 2400,
      materialClass: "heavy_concrete",
      thicknessMm: 150
    });
    expect(input.resilientLayer).toEqual({
      dynamicStiffnessMNm3: undefined,
      productId: undefined,
      thicknessMm: 8
    });
    expect(input.floatingScreed).toEqual({
      densityKgM3: 2000,
      materialClass: "generic_screed",
      thicknessMm: 30
    });
    expect(input.floorCovering).toEqual({
      densityKgM3: 2000,
      materialClass: "ceramic_tile",
      mode: "material_layer",
      thicknessMm: 8
    });
  });

  it("derives a heavy floating-floor predictor schema from floor roles", () => {
    const input = buildImpactPredictorInputFromLayerStack(
      [
        { materialId: "concrete", thicknessMm: 150, floorRole: "base_structure" },
        { materialId: "generic_resilient_underlay", thicknessMm: 8, floorRole: "resilient_layer" },
        { materialId: "screed", thicknessMm: 30, floorRole: "floating_screed" },
        { materialId: "ceramic_tile", thicknessMm: 8, floorRole: "floor_covering" }
      ],
      {
        referenceFloorType: "heavy_standard"
      },
      {
        contextMode: "element_lab"
      }
    );

    expect(input.structuralSupportType).toBe("reinforced_concrete");
    expect(input.impactSystemType).toBe("heavy_floating_floor");
    expect(input.referenceFloorType).toBe("heavy_standard");
    expect(input.baseSlab).toEqual({
      densityKgM3: 2400,
      materialClass: "heavy_concrete",
      thicknessMm: 150
    });
    expect(input.resilientLayer).toEqual({
      dynamicStiffnessMNm3: undefined,
      productId: undefined,
      thicknessMm: 8
    });
    expect(input.floatingScreed).toEqual({
      densityKgM3: 2000,
      materialClass: "generic_screed",
      thicknessMm: 30
    });
    expect(input.floorCovering).toEqual({
      densityKgM3: 2000,
      materialClass: "ceramic_tile",
      mode: "material_layer",
      thicknessMm: 8
    });
  });

  it("derives a suspended-ceiling-only predictor schema from lower-treatment roles", () => {
    const input = buildImpactPredictorInputFromLayerStack(
      [
        { materialId: "solid_wood", thicknessMm: 220, floorRole: "base_structure" },
        { materialId: "air_gap", thicknessMm: 150, floorRole: "ceiling_cavity" },
        { materialId: "rockwool", thicknessMm: 100, floorRole: "ceiling_fill" },
        { materialId: "gypsum_board", thicknessMm: 12.5, floorRole: "ceiling_board" },
        { materialId: "gypsum_board", thicknessMm: 12.5, floorRole: "ceiling_board" }
      ]
    );

    expect(input.structuralSupportType).toBe("timber_joists");
    expect(input.impactSystemType).toBe("suspended_ceiling_only");
    expect(input.lowerTreatment).toEqual({
      boardLayerCount: 2,
      boardMaterialClass: "generic_gypsum_board",
      boardThicknessMm: 12.5,
      cavityDepthMm: 150,
      cavityFillThicknessMm: 100,
      supportClass: undefined,
      type: "suspended_ceiling_rigid_hanger"
    });
  });

  it("derives direct-fixed timber ceiling semantics when no separate ceiling cavity exists", () => {
    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "solid_wood", thicknessMm: 240, floorRole: "base_structure" },
      { materialId: "glasswool", thicknessMm: 90, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: 13, floorRole: "ceiling_board" }
    ]);

    expect(input.structuralSupportType).toBe("timber_joists");
    expect(input.impactSystemType).toBe("suspended_ceiling_only");
    expect(input.lowerTreatment).toEqual({
      boardLayerCount: 1,
      boardMaterialClass: "firestop_board",
      boardThicknessMm: 13,
      cavityDepthMm: undefined,
      cavityFillThicknessMm: 90,
      supportClass: "direct_to_joists",
      type: "direct_fixed_ceiling"
    });
  });

  it("treats concrete acoustic-underlay finish stacks as dry floating floors instead of bare slabs", () => {
    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "concrete", thicknessMm: 150, floorRole: "base_structure" },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20, floorRole: "floor_covering" }
    ]);

    expect(input.structuralSupportType).toBe("reinforced_concrete");
    expect(input.impactSystemType).toBe("dry_floating_floor");
    expect(input.floorCovering?.materialClass).toBe("engineered_timber_with_acoustic_underlay");
  });

  it("treats hollow-core resilient-cover plus ceiling stacks as combined upper and lower systems", () => {
    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "hollow_core_plank", thicknessMm: 200, floorRole: "base_structure" },
      { materialId: "geniemat_rst05", thicknessMm: 5, floorRole: "resilient_layer" },
      { materialId: "vinyl_flooring", thicknessMm: 2.5, floorRole: "floor_covering" },
      { materialId: "genieclip_rst", thicknessMm: 16, floorRole: "ceiling_cavity" },
      { materialId: "gypsum_board", thicknessMm: 16, floorRole: "ceiling_board" }
    ]);

    expect(input.structuralSupportType).toBe("hollow_core");
    expect(input.impactSystemType).toBe("combined_upper_lower_system");
    expect(input.resilientLayer?.productId).toBe("geniemat_rst05");
    expect(input.floorCovering?.materialClass).toBe("vinyl_flooring");
    expect(input.lowerTreatment?.type).toBe("suspended_ceiling_elastic_hanger");
  });

  it("treats concrete acoustic-underlay plus ceiling stacks as combined upper and lower systems", () => {
    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "concrete", thicknessMm: 150, floorRole: "base_structure" },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20, floorRole: "floor_covering" },
      { materialId: "resilient_channel", thicknessMm: 130, floorRole: "ceiling_cavity" },
      { materialId: "rockwool", thicknessMm: 100, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: 13, floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: 13, floorRole: "ceiling_board" }
    ]);

    expect(input.structuralSupportType).toBe("reinforced_concrete");
    expect(input.impactSystemType).toBe("combined_upper_lower_system");
    expect(input.floorCovering?.materialClass).toBe("engineered_timber_with_acoustic_underlay");
    expect(input.lowerTreatment?.type).toBe("suspended_ceiling_elastic_hanger");
  });

  it("treats visible TUAS C5c-style CLT dry packages with a suspended ceiling as combined systems", () => {
    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "gypsum_board", thicknessMm: 13, floorRole: "ceiling_board" },
      { materialId: "gypsum_board", thicknessMm: 13, floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: 100, floorRole: "ceiling_fill" },
      { materialId: "acoustic_hanger_ceiling", thicknessMm: 70, floorRole: "ceiling_cavity" },
      { materialId: "laminate_flooring", thicknessMm: 8, floorRole: "floor_covering" },
      { materialId: "eps_underlay", thicknessMm: 3, floorRole: "resilient_layer" },
      { materialId: "generic_fill", thicknessMm: 50, floorRole: "upper_fill" },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60, floorRole: "floating_screed" },
      { materialId: "clt_panel", thicknessMm: 260, floorRole: "base_structure" }
    ]);

    expect(input.structuralSupportType).toBe("mass_timber_clt");
    expect(input.impactSystemType).toBe("combined_upper_lower_system");
    expect(input.floatingScreed).toEqual({
      densityKgM3: 900,
      materialClass: "dry_floating_gypsum_fiberboard",
      thicknessMm: 60
    });
    expect(input.lowerTreatment?.type).toBe("suspended_ceiling_rigid_hanger");
    expect(input.lowerTreatment?.boardLayerCount).toBe(2);
    expect(input.lowerTreatment?.boardThicknessMm).toBe(13);
  });

  it("can infer the TUAS C2c combined CLT exact id from an explicit rigid-hanger predictor input", () => {
    const adaptation = adaptImpactPredictorInput({
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 260
      },
      resilientLayer: {
        thicknessMm: 3,
        dynamicStiffnessMNm3: 64
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityDepthMm: 70,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13
      }
    });

    expect(adaptation.officialFloorSystemId).toBe("tuas_c2c_clt260_measured_2026");
    expect(adaptation.sourceLayers).toEqual([]);
  });

  it("recognizes custom concrete base materials as reinforced-concrete support", () => {
    const customConcrete: MaterialDefinition = {
      category: "mass",
      densityKgM3: 1800,
      id: "custom_concrete_qa",
      name: "Custom Concrete QA",
      tags: ["custom-workbench-material", "mass", "concrete", "structural"]
    };

    const input = buildImpactPredictorInputFromLayerStack(
      [
        { materialId: customConcrete.id, thicknessMm: 150, floorRole: "base_structure" },
        { materialId: "generic_resilient_underlay", thicknessMm: 8, floorRole: "resilient_layer" },
        { materialId: "screed", thicknessMm: 30, floorRole: "floating_screed" },
        { materialId: "ceramic_tile", thicknessMm: 8, floorRole: "floor_covering" }
      ],
      {
        referenceFloorType: "heavy_standard"
      },
      {
        contextMode: "element_lab"
      },
      [customConcrete, ...getDefaultMaterialCatalog()]
    );

    expect(input.structuralSupportType).toBe("reinforced_concrete");
    expect(input.impactSystemType).toBe("heavy_floating_floor");
    expect(input.baseSlab).toEqual({
      densityKgM3: 1800,
      materialClass: "heavy_concrete",
      thicknessMm: 150
    });
  });

  it("rejects non-structural base_structure layers instead of forcing them through predictor input", () => {
    expect(() =>
      buildImpactPredictorInputFromLayerStack([{ materialId: "gypsum_board", thicknessMm: 100, floorRole: "base_structure" }])
    ).toThrow(/recognized structural floor carrier/i);

    expect(
      maybeBuildImpactPredictorInputFromLayerStack([
        { materialId: "gypsum_board", thicknessMm: 100, floorRole: "base_structure" }
      ])
    ).toBeNull();

    expect(
      maybeBuildImpactPredictorInputFromLayerStack([
        { materialId: "air_gap", thicknessMm: 100, floorRole: "base_structure" }
      ])
    ).toBeNull();
  });

  it("maps low-density reinforced-concrete predictor bases onto lightweight-concrete source layers", () => {
    const adaptation = adaptImpactPredictorInput({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "heavy_floating_floor",
      baseSlab: {
        densityKgM3: 1800,
        materialClass: "heavy_concrete",
        thicknessMm: 150
      },
      resilientLayer: {
        thicknessMm: 8
      },
      floatingScreed: {
        densityKgM3: 2000,
        materialClass: "generic_screed",
        thicknessMm: 30
      },
      floorCovering: {
        densityKgM3: 2000,
        materialClass: "ceramic_tile",
        mode: "material_layer",
        thicknessMm: 8
      }
    });

    expect(adaptation.sourceLayers.at(-1)).toEqual({
      floorRole: "base_structure",
      materialId: "lightweight_concrete",
      thicknessMm: 150
    });
  });

  it("keeps TUAS open-box exact predictor ids gated behind the explicit suspended-ceiling family split", () => {
    const ungatedBasic = adaptImpactPredictorInput({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13
      }
    });

    expect(ungatedBasic.officialFloorSystemId).toBeNull();

    const familyABasic = adaptImpactPredictorInput({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_a",
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13
      }
    });

    expect(familyABasic.officialFloorSystemId).toBe("tuas_r2a_open_box_timber_measured_2026");
    expect(familyABasic.sourceLayers).toEqual([]);
  });

  it("can infer TUAS b-family exact ids from explicit predictor support-class input", () => {
    const basic = adaptImpactPredictorInput({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_b",
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13
      }
    });

    const stagedDry = adaptImpactPredictorInput({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 13
      },
      floatingScreed: {
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 30
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_b",
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13
      }
    });

    const wetScreed = adaptImpactPredictorInput({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 40
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 40
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_b",
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13
      }
    });

    const reinforcedCeiling = adaptImpactPredictorInput({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_b",
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100,
        boardLayerCount: 4,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 15
      }
    });

    expect(basic.officialFloorSystemId).toBe("tuas_r2b_open_box_timber_measured_2026");
    expect(stagedDry.officialFloorSystemId).toBe("tuas_r3b_open_box_timber_measured_2026");
    expect(wetScreed.officialFloorSystemId).toBe("tuas_r11b_open_box_timber_measured_2026");
    expect(reinforcedCeiling.officialFloorSystemId).toBe("tuas_r6b_open_box_timber_measured_2026");
  });

  it("can infer the TUAS mixed-board family-a exact id from an explicit lower-board schedule", () => {
    const mixedBoardA = adaptImpactPredictorInput({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_a",
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessScheduleMm: [13, 13, 15, 15, 15, 15]
      }
    });

    expect(mixedBoardA.officialFloorSystemId).toBe("tuas_r6a_open_box_timber_measured_2026");
    expect(mixedBoardA.sourceLayers).toEqual([]);
  });

  it("infers the new rigid EPS board as upper fill instead of ceiling fill on untagged R7a-like stacks", () => {
    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
      { materialId: "laminate_flooring", thicknessMm: 8 },
      { materialId: "eps_underlay", thicknessMm: 3 },
      { materialId: "eps_floor_insulation_board", thicknessMm: 50 },
      { materialId: "screed", thicknessMm: 40 },
      { materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(input.structuralSupportType).toBe("open_box_timber");
    expect(input.impactSystemType).toBe("combined_upper_lower_system");
    expect(input.upperFill).toEqual({
      densityKgM3: 15,
      materialClass: "eps_floor_insulation_board",
      thicknessMm: 50
    });
    expect(input.floatingScreed).toEqual({
      densityKgM3: 2000,
      materialClass: "generic_screed",
      thicknessMm: 40
    });
    expect(input.lowerTreatment?.supportClass).toBe("tuas_open_box_family_a");
  });

  it("maps the TUAS open-box R7a branch onto a predictor exact id once the upper EPS board surface exists", () => {
    const adaptation = adaptImpactPredictorInput({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        productId: "eps_underlay",
        thicknessMm: 3
      },
      upperFill: {
        materialClass: "eps_floor_insulation_board",
        thicknessMm: 50
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 40
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_a",
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13
      }
    });

    expect(adaptation.officialFloorSystemId).toBe("tuas_r7a_open_box_timber_measured_2026");
  });

  it("maps the explicit TUAS family-a ceiling material back onto the predictor support-class split", () => {
    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "gypsum_board", thicknessMm: 13, floorRole: "ceiling_board" },
      { materialId: "gypsum_board", thicknessMm: 13, floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: 100, floorRole: "ceiling_fill" },
      { materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25, floorRole: "ceiling_cavity" },
      { materialId: "laminate_flooring", thicknessMm: 8, floorRole: "floor_covering" },
      { materialId: "eps_underlay", thicknessMm: 3, floorRole: "resilient_layer" },
      { materialId: "generic_fill", thicknessMm: 13, floorRole: "upper_fill" },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30, floorRole: "floating_screed" },
      { materialId: "open_box_timber_slab", thicknessMm: 370, floorRole: "base_structure" }
    ]);

    expect(input.structuralSupportType).toBe("open_box_timber");
    expect(input.impactSystemType).toBe("combined_upper_lower_system");
    expect(input.lowerTreatment?.type).toBe("suspended_ceiling_elastic_hanger");
    expect(input.lowerTreatment?.supportClass).toBe("tuas_open_box_family_a");
  });

  it("derives the TUAS mixed-board lower schedule from visible layers without surfacing a blocker warning", () => {
    const layers = [
      { materialId: "gypsum_board", thicknessMm: 26, floorRole: "ceiling_board" as const },
      { materialId: "gypsum_board", thicknessMm: 60, floorRole: "ceiling_board" as const },
      { materialId: "rockwool", thicknessMm: 100, floorRole: "ceiling_fill" as const },
      { materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25, floorRole: "ceiling_cavity" as const },
      { materialId: "laminate_flooring", thicknessMm: 8, floorRole: "floor_covering" as const },
      { materialId: "eps_underlay", thicknessMm: 3, floorRole: "resilient_layer" as const },
      { materialId: "open_box_timber_slab", thicknessMm: 370, floorRole: "base_structure" as const }
    ];

    const input = maybeBuildImpactPredictorInputFromLayerStack(layers);

    expect(getVisibleLayerPredictorBlockerWarning(layers)).toBeNull();
    expect(input?.lowerTreatment?.boardLayerCount).toBeUndefined();
    expect(input?.lowerTreatment?.boardThicknessMm).toBeUndefined();
    expect(input?.lowerTreatment?.boardThicknessScheduleMm).toEqual([26, 60]);
  });

  it("keeps the TUAS staged mixed upper package fail-closed on the predictor surface even after the exact visible-layer row lands", () => {
    const layers = [
      { materialId: "gypsum_board", thicknessMm: 13, floorRole: "ceiling_board" as const },
      { materialId: "gypsum_board", thicknessMm: 13, floorRole: "ceiling_board" as const },
      { materialId: "rockwool", thicknessMm: 100, floorRole: "ceiling_fill" as const },
      { materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25, floorRole: "ceiling_cavity" as const },
      { materialId: "laminate_flooring", thicknessMm: 8, floorRole: "floor_covering" as const },
      { materialId: "eps_underlay", thicknessMm: 3, floorRole: "resilient_layer" as const },
      { materialId: "glasswool_board", thicknessMm: 13, floorRole: "upper_fill" as const },
      { materialId: "gypsum_board", thicknessMm: 15, floorRole: "floating_screed" as const },
      { materialId: "screed", thicknessMm: 3, floorRole: "floating_screed" as const },
      { materialId: "gypsum_board", thicknessMm: 15, floorRole: "floating_screed" as const },
      { materialId: "open_box_timber_slab", thicknessMm: 370, floorRole: "base_structure" as const }
    ];

    expect(maybeBuildImpactPredictorInputFromLayerStack(layers)).toBeNull();
    expect(getVisibleLayerPredictorBlockerWarning(layers)).toMatch(
      /single-entry floor roles are duplicated: floating screed x3 \(Gypsum Board, Mineral Screed\)/i
    );
  });

  it("infers steel support form, product id, engineered-timber-underlay covering, and elastic ceiling semantics", () => {
    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "open_web_steel_joist", thicknessMm: 300, floorRole: "base_structure" },
      { materialId: "geniemat_rst05", thicknessMm: 5, floorRole: "resilient_layer" },
      { materialId: "particleboard_flooring", thicknessMm: 19, floorRole: "floating_screed" },
      { materialId: "engineered_timber_flooring", thicknessMm: 15, floorRole: "floor_covering" },
      { materialId: "resilient_channel", thicknessMm: 65, floorRole: "ceiling_cavity" },
      { materialId: "glasswool", thicknessMm: 145, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" }
    ]);

    expect(input.structuralSupportType).toBe("steel_joists");
    expect(input.supportForm).toBe("open_web_or_rolled");
    expect(input.baseSlab?.materialClass).toBeUndefined();
    expect(input.floorCovering?.materialClass).toBe("engineered_timber_with_acoustic_underlay");
    expect(input.resilientLayer?.productId).toBe("geniemat_rst05");
    expect(input.lowerTreatment?.type).toBe("suspended_ceiling_elastic_hanger");
    expect(input.lowerTreatment?.cavityDepthMm).toBe(65);
  });

  it("infers dry CLT upper-fill semantics and MW-T dynamic stiffness", () => {
    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "clt_panel", thicknessMm: 145, floorRole: "base_structure" },
      { materialId: "mw_t_40_impact_layer", thicknessMm: 20, floorRole: "resilient_layer" },
      { materialId: "elastic_bonded_fill", thicknessMm: 70, floorRole: "upper_fill" },
      { materialId: "gypsum_fiberboard", thicknessMm: 22, floorRole: "floor_covering" }
    ]);

    expect(input.structuralSupportType).toBe("mass_timber_clt");
    expect(input.impactSystemType).toBe("dry_floating_floor");
    expect(input.resilientLayer?.dynamicStiffnessMNm3).toBe(40);
    expect(input.upperFill?.materialClass).toBe("elastic_bonded_fill");
    expect(input.upperFill?.thicknessMm).toBe(70);
    expect(input.floorCovering?.materialClass).toBe("dry_floating_gypsum_fiberboard");
  });

  it("keeps explicit predictor fields over derived defaults while preserving derived densities", () => {
    const input = buildImpactPredictorInputFromLayerStack(
      [
        { materialId: "concrete", thicknessMm: 200, floorRole: "base_structure" },
        { materialId: "porcelain_tile", thicknessMm: 10, floorRole: "floor_covering" }
      ],
      {
        structuralSupportType: "hollow_core",
        supportForm: "open_web_or_rolled",
        impactSystemType: "combined_upper_lower_system",
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger"
        },
        floorCovering: {
          materialClass: "vinyl_flooring",
          thicknessMm: 6
        }
      }
    );

    expect(input.structuralSupportType).toBe("hollow_core");
    expect(input.supportForm).toBe("open_web_or_rolled");
    expect(input.impactSystemType).toBe("combined_upper_lower_system");
    expect(input.lowerTreatment?.type).toBe("suspended_ceiling_elastic_hanger");
    expect(input.floorCovering?.materialClass).toBe("vinyl_flooring");
    expect(input.floorCovering?.thicknessMm).toBe(6);
    expect(input.floorCovering?.densityKgM3).toBe(2200);
  });

  it("backfills missing floor roles from aliases while preserving explicit lower-treatment semantics", () => {
    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "open_web_steel_joist", thicknessMm: 300 },
      { materialId: "rubber_sheet", thicknessMm: 5 },
      { materialId: "particleboard_flooring", thicknessMm: 19 },
      { materialId: "engineered_timber_flooring", thicknessMm: 15, floorRole: "floor_covering" },
      { materialId: "resilient_channel", thicknessMm: 65 },
      { materialId: "glasswool", thicknessMm: 145 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 }
    ]);

    expect(input.structuralSupportType).toBe("steel_joists");
    expect(input.supportForm).toBe("open_web_or_rolled");
    expect(input.impactSystemType).toBe("combined_upper_lower_system");
    expect(input.resilientLayer?.thicknessMm).toBe(5);
    expect(input.floatingScreed?.materialClass).toBe("lightweight_dry_deck");
    expect(input.floorCovering?.materialClass).toBe("engineered_timber_with_acoustic_underlay");
    expect(input.lowerTreatment).toEqual({
      boardLayerCount: 3,
      boardMaterialClass: "firestop_board",
      boardThicknessMm: 16,
      cavityDepthMm: 65,
      cavityFillThicknessMm: 145,
      supportClass: undefined,
      type: "suspended_ceiling_elastic_hanger"
    });
  });

  it("accepts inex floor panel as an explicit steel predictor floating deck alias", () => {
    const adaptation = adaptImpactPredictorInput({
      structuralSupportType: "steel_joists",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: { thicknessMm: 200 },
      floatingScreed: {
        materialClass: "inex_floor_panel",
        thicknessMm: 19
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay",
        thicknessMm: 20
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 65,
        boardLayerCount: 2,
        boardThicknessMm: 16,
        boardMaterialClass: "firestop_board"
      }
    });

    expect(adaptation.sourceLayers).toEqual(
      expect.arrayContaining([
        { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
        { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 }
      ])
    );
  });

  it("keeps the generic resilient separator in reinforced-concrete combined wet predictor stacks", () => {
    const adaptation = adaptImpactPredictorInput({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 150,
        densityKgM3: 2400
      },
      resilientLayer: {
        thicknessMm: 8
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 50,
        densityKgM3: 2000
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8,
        densityKgM3: 2000
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 65,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "gypsum_board"
      }
    });

    expect(adaptation.sourceLayers).toEqual(
      expect.arrayContaining([
        { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
        { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
      ])
    );
  });

  it("treats thick gypsum-fiber dry decks as floating screeds when a separate top finish is present", () => {
    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { materialId: "laminate_flooring", thicknessMm: 8 },
      { materialId: "eps_underlay", thicknessMm: 3 },
      { materialId: "generic_fill", thicknessMm: 50 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(input.structuralSupportType).toBe("open_box_timber");
    expect(input.impactSystemType).toBe("combined_upper_lower_system");
    expect(input.floorCovering?.materialClass).toBe("laminate_flooring");
    expect(input.floatingScreed?.materialClass).toBe("dry_floating_gypsum_fiberboard");
    expect(input.floatingScreed?.thicknessMm).toBe(60);
    expect(input.upperFill?.materialClass).toBe("generic_fill");
  });

  it("keeps thin gypsum-fiber dry-float layers as floor coverings when no separate finish exists", () => {
    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "clt_panel", thicknessMm: 140 },
      { materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
      { materialId: "elastic_bonded_fill", thicknessMm: 60 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ]);

    expect(input.structuralSupportType).toBe("mass_timber_clt");
    expect(input.impactSystemType).toBe("dry_floating_floor");
    expect(input.floorCovering?.materialClass).toBe("dry_floating_gypsum_fiberboard");
    expect(input.floorCovering?.thicknessMm).toBe(25);
    expect(input.floatingScreed?.materialClass).toBeUndefined();
    expect(input.floatingScreed?.thicknessMm).toBeUndefined();
  });

  it("keeps thick integrated dry-floor gypsum-fiber elements as floor coverings when no separate finish exists", () => {
    const normalized = maybeInferFloorRoleLayerStack([
      { materialId: "gypsum_board", thicknessMm: 15 },
      { materialId: "rockwool", thicknessMm: 200 },
      { materialId: "acoustic_hanger_ceiling", thicknessMm: 60 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
      { materialId: "timber_frame_floor", thicknessMm: 200 }
    ]);

    expect(normalized).toEqual([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 200 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 60 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 200 }
    ]);

    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "gypsum_board", thicknessMm: 15 },
      { materialId: "rockwool", thicknessMm: 200 },
      { materialId: "acoustic_hanger_ceiling", thicknessMm: 60 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
      { materialId: "timber_frame_floor", thicknessMm: 200 }
    ]);

    expect(input.impactSystemType).toBe("combined_upper_lower_system");
    expect(input.floorCovering?.materialClass).toBe("dry_floating_gypsum_fiberboard");
    expect(input.floorCovering?.thicknessMm).toBe(65);
    expect(input.floatingScreed?.materialClass).toBeUndefined();
  });

  it("coalesces merge-safe split upper-fill and floating-screed layers before deriving predictor topology", () => {
    const normalized = maybeInferFloorRoleLayerStack([
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { materialId: "laminate_flooring", thicknessMm: 8 },
      { materialId: "eps_underlay", thicknessMm: 3 },
      { materialId: "generic_fill", thicknessMm: 20 },
      { materialId: "generic_fill", thicknessMm: 30 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(normalized).toEqual([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { materialId: "laminate_flooring", thicknessMm: 8 },
      { materialId: "eps_underlay", thicknessMm: 3 },
      { materialId: "generic_fill", thicknessMm: 20 },
      { materialId: "generic_fill", thicknessMm: 30 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(input.upperFill?.thicknessMm).toBe(50);
    expect(input.floatingScreed?.thicknessMm).toBe(60);
  });

  it("coalesces contiguous identical resilient layers before deriving predictor topology", () => {
    const normalized = maybeInferFloorRoleLayerStack([
      { materialId: "hollow_core_plank", thicknessMm: 200 },
      { materialId: "geniemat_rst05", thicknessMm: 2.5 },
      { materialId: "geniemat_rst05", thicknessMm: 2.5 },
      { materialId: "vinyl_flooring", thicknessMm: 2.5 },
      { materialId: "genieclip_rst", thicknessMm: 16 },
      { materialId: "gypsum_board", thicknessMm: 16 }
    ]);

    expect(normalized).toEqual([
      { floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 200 },
      { floorRole: "resilient_layer", materialId: "geniemat_rst05", thicknessMm: 5 },
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 2.5 },
      { floorRole: "ceiling_cavity", materialId: "genieclip_rst", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 16 }
    ]);

    const input = buildImpactPredictorInputFromLayerStack([
      { materialId: "hollow_core_plank", thicknessMm: 200 },
      { materialId: "geniemat_rst05", thicknessMm: 2.5 },
      { materialId: "geniemat_rst05", thicknessMm: 2.5 },
      { materialId: "vinyl_flooring", thicknessMm: 2.5 },
      { materialId: "genieclip_rst", thicknessMm: 16 },
      { materialId: "gypsum_board", thicknessMm: 16 }
    ]);

    expect(input.resilientLayer?.productId).toBe("geniemat_rst05");
    expect(input.resilientLayer?.thicknessMm).toBe(5);
  });

  it("backfills lower-treatment roles for raw ceiling-only concrete floor stacks", () => {
    const normalized = maybeInferFloorRoleLayerStack([
      { materialId: "firestop_board", thicknessMm: 13 },
      { materialId: "firestop_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "furring_channel", thicknessMm: 130 },
      { materialId: "concrete", thicknessMm: 140 }
    ]);

    expect(normalized).toEqual([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 130 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 140 }
    ]);
  });

  it("backfills the defended safe-bare heavy slab carrier role when the visible stack is a single raw concrete base", () => {
    expect(
      maybeInferFloorRoleLayerStack([
        { materialId: "concrete", thicknessMm: 140 }
      ])
    ).toEqual([
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 140 }
    ]);
  });

  it("derives bare-floor predictor inputs for safe single-layer raw base stacks", () => {
    expect(
      maybeBuildImpactPredictorInputFromLayerStack([
        { materialId: "concrete", thicknessMm: 140 }
      ])
    ).toEqual({
      baseSlab: {
        densityKgM3: 2400,
        materialClass: "heavy_concrete",
        thicknessMm: 140
      },
      floorCovering: {},
      floatingScreed: {},
      impactSystemType: "bare_floor",
      lowerTreatment: {},
      resilientLayer: {},
      structuralSupportType: "reinforced_concrete",
      upperFill: {}
    });

    expect(
      maybeBuildImpactPredictorInputFromLayerStack([
        { materialId: "clt_panel", thicknessMm: 140 }
      ])
    ).toEqual({
      baseSlab: {
        densityKgM3: 470,
        materialClass: "clt_panel",
        thicknessMm: 140
      },
      floorCovering: {},
      floatingScreed: {},
      impactSystemType: "bare_floor",
      lowerTreatment: {},
      resilientLayer: {},
      structuralSupportType: "mass_timber_clt",
      upperFill: {}
    });

    expect(
      maybeBuildImpactPredictorInputFromLayerStack([
        { materialId: "composite_steel_deck", thicknessMm: 60 }
      ])
    ).toEqual({
      baseSlab: {
        densityKgM3: 2350,
        materialClass: "composite_panel",
        thicknessMm: 60
      },
      floorCovering: {},
      floatingScreed: {},
      impactSystemType: "bare_floor",
      lowerTreatment: {},
      resilientLayer: {},
      structuralSupportType: "composite_panel",
      upperFill: {}
    });

    expect(
      maybeBuildImpactPredictorInputFromLayerStack([
        { materialId: "hollow_core_plank", thicknessMm: 200 }
      ])
    ).toEqual({
      baseSlab: {
        densityKgM3: 2400,
        materialClass: "hollow_core_plank",
        thicknessMm: 200
      },
      floorCovering: {},
      floatingScreed: {},
      impactSystemType: "bare_floor",
      lowerTreatment: {},
      resilientLayer: {},
      structuralSupportType: "hollow_core",
      upperFill: {}
    });
  });

  it("keeps unsafe single-layer bare base stacks fail-closed for auto predictor derivation", () => {
    expect(
      maybeBuildImpactPredictorInputFromLayerStack([
        { materialId: "open_box_timber_slab", thicknessMm: 370 }
      ])
    ).toBeNull();

    expect(
      maybeBuildImpactPredictorInputFromLayerStack([
        { materialId: "open_web_steel_joist", thicknessMm: 300 }
      ])
    ).toBeNull();
  });

  it("keeps ambiguous duplicate predictor roles fail-closed for auto predictor derivation", () => {
    const cases = [
      {
        id: "clt dual finish",
        layers: [
          { materialId: "clt_panel", thicknessMm: 140 },
          { materialId: "vinyl_flooring", thicknessMm: 2.5 },
          { materialId: "engineered_timber_flooring", thicknessMm: 15 },
          { materialId: "genieclip_rst", thicknessMm: 16 },
          { materialId: "gypsum_board", thicknessMm: 16 }
        ]
      },
      {
        id: "hollow-core dual resilient layer",
        layers: [
          { materialId: "hollow_core_plank", thicknessMm: 200 },
          { materialId: "geniemat_rst05", thicknessMm: 5 },
          { materialId: "rubber_sheet", thicknessMm: 5 },
          { materialId: "vinyl_flooring", thicknessMm: 2.5 },
          { materialId: "genieclip_rst", thicknessMm: 16 },
          { materialId: "gypsum_board", thicknessMm: 16 }
        ]
      },
      {
        id: "open-box dual upper fill",
        layers: [
          { materialId: "gypsum_board", thicknessMm: 13 },
          { materialId: "gypsum_board", thicknessMm: 13 },
          { materialId: "rockwool", thicknessMm: 100 },
          { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
          { materialId: "laminate_flooring", thicknessMm: 8 },
          { materialId: "eps_underlay", thicknessMm: 3 },
          { materialId: "generic_fill", thicknessMm: 30 },
          { materialId: "bonded_chippings", thicknessMm: 20 },
          { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
          { materialId: "open_box_timber_slab", thicknessMm: 370 }
        ]
      },
      {
        id: "heavy dual floating screed",
        layers: [
          { materialId: "concrete", thicknessMm: 150 },
          { materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
          { materialId: "screed", thicknessMm: 30 },
          { materialId: "inex_floor_panel", thicknessMm: 19 },
          { materialId: "ceramic_tile", thicknessMm: 8 }
        ]
      }
    ];

    for (const testCase of cases) {
      expect(maybeBuildImpactPredictorInputFromLayerStack(testCase.layers), testCase.id).toBeNull();
    }
  });

  it("keeps raw role-gated timber and open-box non-combined stacks fail-closed for auto role inference and predictor derivation", () => {
    const cases = [
      {
        id: "open-box lower-only helper package",
        layers: [
          { materialId: "gypsum_board", thicknessMm: 13 },
          { materialId: "rockwool", thicknessMm: 90 },
          { materialId: "furring_channel", thicknessMm: 28 },
          { materialId: "open_box_timber_slab", thicknessMm: 370 }
        ]
      },
      {
        id: "open-box upper-only dry package",
        layers: [
          { materialId: "laminate_flooring", thicknessMm: 8 },
          { materialId: "eps_underlay", thicknessMm: 3 },
          { materialId: "generic_fill", thicknessMm: 50 },
          { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
          { materialId: "open_box_timber_slab", thicknessMm: 370 }
        ]
      },
      {
        id: "timber lower-only helper package",
        layers: [
          { materialId: "gypsum_board", thicknessMm: 13 },
          { materialId: "rockwool", thicknessMm: 90 },
          { materialId: "furring_channel", thicknessMm: 28 },
          { materialId: "timber_joist_floor", thicknessMm: 240 }
        ]
      },
      {
        id: "timber upper-only finish package",
        layers: [
          { materialId: "laminate_flooring", thicknessMm: 8 },
          { materialId: "timber_joist_floor", thicknessMm: 240 }
        ]
      }
    ] as const;

    for (const testCase of cases) {
      expect(maybeInferFloorRoleLayerStack(testCase.layers), testCase.id).toBeNull();
      expect(maybeBuildImpactPredictorInputFromLayerStack(testCase.layers), testCase.id).toBeNull();
    }
  });

  it("keeps combined CLT visible stacks with multi-entry floating screed fail-closed for auto inference and predictor derivation", () => {
    const cases = [
      {
        id: "staged combined CLT surface",
        layers: [
          { floorRole: "ceiling_board" as const, materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_board" as const, materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_fill" as const, materialId: "rockwool", thicknessMm: 100 },
          { floorRole: "ceiling_cavity" as const, materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
          { floorRole: "floor_covering" as const, materialId: "laminate_flooring", thicknessMm: 8 },
          { floorRole: "resilient_layer" as const, materialId: "eps_underlay", thicknessMm: 3 },
          { floorRole: "upper_fill" as const, materialId: "glasswool_board", thicknessMm: 13 },
          { floorRole: "floating_screed" as const, materialId: "gypsum_board", thicknessMm: 15 },
          { floorRole: "floating_screed" as const, materialId: "gypsum_board", thicknessMm: 15 },
          { floorRole: "base_structure" as const, materialId: "clt_panel", thicknessMm: 260 }
        ]
      },
      {
        id: "heavy dry combined CLT surface",
        layers: [
          { floorRole: "ceiling_board" as const, materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_board" as const, materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_fill" as const, materialId: "rockwool", thicknessMm: 100 },
          { floorRole: "ceiling_cavity" as const, materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
          { floorRole: "floor_covering" as const, materialId: "laminate_flooring", thicknessMm: 8 },
          { floorRole: "resilient_layer" as const, materialId: "eps_underlay", thicknessMm: 3 },
          { floorRole: "upper_fill" as const, materialId: "glasswool_board", thicknessMm: 50 },
          { floorRole: "floating_screed" as const, materialId: "gypsum_board", thicknessMm: 15 },
          { floorRole: "floating_screed" as const, materialId: "gypsum_board", thicknessMm: 15 },
          { floorRole: "base_structure" as const, materialId: "clt_panel", thicknessMm: 260 }
        ]
      }
    ] as const;

    for (const testCase of cases) {
      expect(maybeInferFloorRoleLayerStack(testCase.layers), testCase.id).toBeNull();
      expect(maybeBuildImpactPredictorInputFromLayerStack(testCase.layers), testCase.id).toBeNull();
    }
  });

  it("keeps disjoint same-material single-entry roles fail-closed and surfaces the blocker warning", () => {
    const layers = [
      { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 150 },
      { floorRole: "floor_covering" as const, materialId: "ceramic_tile", thicknessMm: 4 },
      { floorRole: "resilient_layer" as const, materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floor_covering" as const, materialId: "ceramic_tile", thicknessMm: 4 }
    ];

    expect(maybeBuildImpactPredictorInputFromLayerStack(layers)).toBeNull();
    expect(getVisibleLayerPredictorBlockerWarning(layers)).toMatch(
      /single-entry floor roles are duplicated: floor covering x2 \(Ceramic Tile\)/i
    );
  });

  it("still derives predictor input when a merge-safe role is only split contiguously into the same material package", () => {
    const layers = [
      { floorRole: "base_structure" as const, materialId: "concrete", thicknessMm: 150 },
      { floorRole: "resilient_layer" as const, materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed" as const, materialId: "screed", thicknessMm: 15 },
      { floorRole: "floating_screed" as const, materialId: "screed", thicknessMm: 15 },
      { floorRole: "floor_covering" as const, materialId: "ceramic_tile", thicknessMm: 8 }
    ];

    expect(getVisibleLayerPredictorBlockerWarning(layers)).toBeNull();
    expect(maybeBuildImpactPredictorInputFromLayerStack(layers)).toEqual({
      baseSlab: {
        densityKgM3: 2400,
        materialClass: "heavy_concrete",
        thicknessMm: 150
      },
      floorCovering: {
        densityKgM3: 2000,
        materialClass: "ceramic_tile",
        mode: "material_layer",
        thicknessMm: 8
      },
      floatingScreed: {
        densityKgM3: 2000,
        materialClass: "generic_screed",
        thicknessMm: 30
      },
      impactSystemType: "heavy_floating_floor",
      lowerTreatment: {},
      resilientLayer: {
        dynamicStiffnessMNm3: undefined,
        productId: undefined,
        thicknessMm: 8
      },
      structuralSupportType: "reinforced_concrete",
      upperFill: {}
    });
  });

  it("normalizes schedule-equivalent contiguous ceiling-board splits before deriving predictor input", () => {
    const canonical = [
      { floorRole: "ceiling_board" as const, materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_board" as const, materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill" as const, materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity" as const, materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure" as const, materialId: "composite_steel_deck", thicknessMm: 150 }
    ];
    const split = [
      { floorRole: "ceiling_board" as const, materialId: "firestop_board", thicknessMm: 7.5 },
      { floorRole: "ceiling_board" as const, materialId: "firestop_board", thicknessMm: 7.5 },
      { floorRole: "ceiling_board" as const, materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill" as const, materialId: "rockwool", thicknessMm: 25 },
      { floorRole: "ceiling_fill" as const, materialId: "rockwool", thicknessMm: 25 },
      { floorRole: "ceiling_cavity" as const, materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure" as const, materialId: "composite_steel_deck", thicknessMm: 150 }
    ];

    expect(getVisibleLayerPredictorBlockerWarning(canonical)).toBeNull();
    expect(getVisibleLayerPredictorBlockerWarning(split)).toBeNull();
    expect(maybeBuildImpactPredictorInputFromLayerStack(split)).toEqual(
      maybeBuildImpactPredictorInputFromLayerStack(canonical)
    );
  });

  it("keeps non-packable mixed-thickness ceiling-board schedules fail-closed", () => {
    const layers = [
      { floorRole: "ceiling_board" as const, materialId: "firestop_board", thicknessMm: 10 },
      { floorRole: "ceiling_board" as const, materialId: "firestop_board", thicknessMm: 20 },
      { floorRole: "ceiling_cavity" as const, materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure" as const, materialId: "composite_steel_deck", thicknessMm: 150 }
    ];

    expect(maybeBuildImpactPredictorInputFromLayerStack(layers)).toBeNull();
    expect(getVisibleLayerPredictorBlockerWarning(layers)).toMatch(
      /single-entry floor roles are duplicated: ceiling board x2 \(Firestop Board\)/i
    );
  });

  it("keeps disjoint identical ceiling-board topologies fail-closed", () => {
    const layers = [
      { floorRole: "ceiling_board" as const, materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity" as const, materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "ceiling_board" as const, materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "base_structure" as const, materialId: "open_web_steel_floor", thicknessMm: 300 }
    ];

    expect(maybeBuildImpactPredictorInputFromLayerStack(layers)).toBeNull();
    expect(getVisibleLayerPredictorBlockerWarning(layers)).toMatch(
      /single-entry floor roles are duplicated: ceiling board x2 \(Firestop Board\)/i
    );
  });
});

import { describe, expect, it } from "vitest";

import { buildImpactPredictorInputFromLayerStack } from "./impact-predictor-input";

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
    expect(input.floatingScreed).toBeUndefined();
  });
});

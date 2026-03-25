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

  it("avoids floor-role backfill for ambiguous bare heavy slabs without floor evidence", () => {
    expect(
      maybeInferFloorRoleLayerStack([
        { materialId: "concrete", thicknessMm: 140 }
      ])
    ).toBeNull();
  });

  it("derives bare-floor predictor inputs for safe single-layer raw base stacks", () => {
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
        { materialId: "concrete", thicknessMm: 140 }
      ])
    ).toBeNull();

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
});

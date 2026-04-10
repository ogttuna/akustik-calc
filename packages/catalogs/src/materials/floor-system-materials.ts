import type { MaterialDefinition } from "@dynecho/shared";

export const FLOOR_SYSTEM_MATERIALS: readonly MaterialDefinition[] = [
  {
    id: "hollow_core_plank",
    name: "Hollow-core Plank",
    category: "mass",
    densityKgM3: 2400,
    notes: "Precast hollow-core slab lane for curated Pliteq floor-system matches.",
    tags: ["structural", "hollow-core", "precast", "floor-system"]
  },
  {
    id: "steel_joist_floor",
    name: "Steel Joist Floor",
    category: "mass",
    densityKgM3: 7850,
    notes: "Generic steel-joist carrier used for broader lightweight-steel family fallback.",
    tags: ["structural", "steel", "joist", "floor-system"]
  },
  {
    id: "lightweight_steel_floor",
    name: "Lightweight Steel Floor",
    category: "mass",
    densityKgM3: 7850,
    notes: "Ambiguous lightweight-steel carrier used when the support form is not yet fixed between open-web and joist / purlin families.",
    tags: ["structural", "steel", "lightweight", "unspecified-support", "floor-system"]
  },
  {
    id: "composite_steel_deck",
    name: "Composite Steel Deck",
    category: "mass",
    densityKgM3: 2350,
    notes: "Composite panel carrier used for peer-reviewed exact and fallback floor-system lanes.",
    tags: ["structural", "composite", "steel-deck", "floor-system"]
  },
  {
    id: "timber_joist_floor",
    name: "Timber Joist Floor",
    category: "mass",
    densityKgM3: 500,
    notes: "Seed structural base for curated Knauf timber floor-system matches.",
    tags: ["structural", "timber-joists", "floor-system"]
  },
  {
    id: "timber_frame_floor",
    name: "Timber Frame Floor",
    category: "mass",
    densityKgM3: 450,
    notes: "Seed structural base for curated Dataholz timber-frame floor-system matches.",
    tags: ["structural", "timber-joists", "floor-system"]
  },
  {
    id: "open_box_timber_slab",
    name: "Open-box Timber Slab",
    category: "mass",
    densityKgM3: 430,
    notes: "Seed structural base for curated TUAS open-box measured floor-system matches.",
    tags: ["structural", "open-box", "timber", "floor-system"]
  },
  {
    id: "open_web_steel_floor",
    name: "Open-web Steel Floor",
    category: "mass",
    densityKgM3: 7850,
    notes: "Seed structural base for curated UBIQ open-web steel floor-system matches.",
    tags: ["structural", "steel", "open-web", "floor-system"]
  },
  {
    id: "mw_t_impact_layer",
    name: "MW-T Impact Layer",
    category: "support",
    densityKgM3: 140,
    impact: {
      dynamicStiffnessMNm3: 10
    },
    notes: "Mineral-wool impact subflooring layer used in curated exact timber-floor family matches.",
    tags: ["resilient", "impact", "floor-system"]
  },
  {
    id: "generic_fill",
    name: "Generic Fill",
    category: "mass",
    densityKgM3: 1800,
    notes: "Loose or bonded fill placeholder for curated floor-system import lanes.",
    tags: ["fill", "floor-system"]
  },
  {
    id: "eps_floor_insulation_board",
    name: "EPS Floor Insulation Board",
    category: "insulation",
    densityKgM3: 15,
    notes:
      "Rigid EPS floor insulation board used under screed in the narrow TUAS open-box R7a exact branch. This is not a thin resilient underlay and should not be aliased through the generic loose/bonded fill placeholder.",
    tags: ["upper-fill", "eps", "rigid-board", "floor-system"]
  },
  {
    id: "resilient_channel",
    name: "Resilient Channel",
    category: "support",
    densityKgM3: 0,
    notes: "Ceiling support element for resilient-channel exact family matching.",
    tags: ["ceiling-support", "floor-system"]
  },
  {
    id: "tuas_open_box_ceiling_family_a",
    name: "TUAS Open-box Ceiling Family A",
    category: "support",
    densityKgM3: 0,
    notes:
      "Explicit TUAS suspended-ceiling family A support used to distinguish the R2a / R3a / R5a open-box exact corridor from the current family B lane.",
    tags: ["ceiling-support", "stud", "measured", "tuas-family-a", "floor-system"]
  },
  {
    id: "ubiq_resilient_ceiling",
    name: "UBIQ Resilient Ceiling",
    category: "support",
    densityKgM3: 0,
    notes: "Curated resilient ceiling support lane for UBIQ open-web steel floor-system matches.",
    tags: ["ceiling-support", "steel", "floor-system"]
  },
  {
    id: "genieclip_rst",
    name: "GenieClip RST Ceiling",
    category: "support",
    densityKgM3: 0,
    notes: "Official Pliteq resilient ceiling lane for hollow-core floor-system matches.",
    tags: ["ceiling-support", "pliteq", "hollow-core", "floor-system"]
  },
  {
    id: "geniemat_rst02",
    name: "GenieMat RST02",
    category: "support",
    densityKgM3: 760,
    impact: {
      dynamicStiffnessMNm3: 157
    },
    notes: "Official Pliteq resilient underlayment lane for lighter-finish steel-joist floor variants. Average dynamic stiffness follows the Pliteq GenieMat RST brochure.",
    tags: ["resilient", "pliteq", "steel", "floor-system"]
  },
  {
    id: "geniemat_rst05",
    name: "GenieMat RST05",
    category: "support",
    densityKgM3: 760,
    impact: {
      dynamicStiffnessMNm3: 105
    },
    notes: "Official Pliteq resilient underlayment lane for hollow-core floor variants. Average dynamic stiffness follows the Pliteq GenieMat RST brochure.",
    tags: ["resilient", "pliteq", "hollow-core", "floor-system"]
  },
  {
    id: "geniemat_rst12",
    name: "GenieMat RST12",
    category: "support",
    densityKgM3: 760,
    impact: {
      dynamicStiffnessMNm3: 60
    },
    notes: "Official Pliteq resilient underlayment lane for harder-finish hollow-core floor variants. Average dynamic stiffness follows the Pliteq GenieMat RST brochure.",
    tags: ["resilient", "pliteq", "hollow-core", "floor-system"]
  },
  {
    id: "regupol_sonus_curve_8",
    name: "REGUPOL sonus curve 8",
    category: "support",
    densityKgM3: 760,
    impact: {
      dynamicStiffnessMNm3: 30
    },
    notes: "Official resilient layer from REGUPOL technical data used in exact-system and product-delta impact catalog matches.",
    tags: ["resilient", "official-product", "regupol", "impact"]
  },
  {
    id: "regupol_sonus_multi_4_5",
    name: "REGUPOL sonus multi 4.5",
    category: "support",
    densityKgM3: 720,
    notes: "Official resilient layer from REGUPOL technical data used in exact-system impact catalog matches.",
    tags: ["resilient", "official-product", "regupol", "impact"]
  },
  {
    id: "getzner_afm_21",
    name: "Getzner AFM 21",
    category: "support",
    densityKgM3: 760,
    impact: {
      dynamicStiffnessMNm3: 40
    },
    notes: "Official Getzner AFM catalog lane for DeltaLw-backed heavy-reference product matching.",
    tags: ["resilient", "official-product", "getzner", "impact"]
  },
  {
    id: "getzner_afm_23",
    name: "Getzner AFM 23",
    category: "support",
    densityKgM3: 760,
    impact: {
      dynamicStiffnessMNm3: 35
    },
    notes: "Official Getzner AFM catalog lane for DeltaLw-backed heavy-reference product matching.",
    tags: ["resilient", "official-product", "getzner", "impact"]
  },
  {
    id: "getzner_afm_26",
    name: "Getzner AFM 26",
    category: "support",
    densityKgM3: 760,
    impact: {
      dynamicStiffnessMNm3: 20
    },
    notes: "Official Getzner AFM catalog lane for DeltaLw-backed heavy-reference product matching.",
    tags: ["resilient", "official-product", "getzner", "impact"]
  },
  {
    id: "getzner_afm_29",
    name: "Getzner AFM 29",
    category: "support",
    densityKgM3: 760,
    impact: {
      dynamicStiffnessMNm3: 10
    },
    notes: "Official Getzner AFM catalog lane for DeltaLw-backed heavy-reference product matching.",
    tags: ["resilient", "official-product", "getzner", "impact"]
  },
  {
    id: "getzner_afm_33",
    name: "Getzner AFM 33",
    category: "support",
    densityKgM3: 760,
    impact: {
      dynamicStiffnessMNm3: 7
    },
    notes: "Official Getzner AFM catalog lane for DeltaLw-backed heavy-reference product matching.",
    tags: ["resilient", "official-product", "getzner", "impact"]
  },
  {
    id: "getzner_afm_35",
    name: "Getzner AFM 35",
    category: "support",
    densityKgM3: 760,
    impact: {
      dynamicStiffnessMNm3: 5
    },
    notes: "Official Getzner AFM catalog lane for DeltaLw-backed heavy-reference product matching.",
    tags: ["resilient", "official-product", "getzner", "impact"]
  },
  {
    id: "laminate_flooring",
    name: "Laminate Flooring",
    category: "finish",
    densityKgM3: 850,
    notes: "Seed finish for curated measured CLT floor families.",
    tags: ["floor-finish", "floor-system"]
  },
  {
    id: "eps_underlay",
    name: "EPS Underlay",
    category: "support",
    densityKgM3: 35,
    impact: {
      dynamicStiffnessMNm3: 64
    },
    notes: "Thin resilient underlay used in curated measured CLT floor families.",
    tags: ["resilient", "underlay", "floor-system"]
  },
  {
    id: "glasswool",
    name: "Glass Wool",
    category: "insulation",
    densityKgM3: 16,
    notes: "Generic lightweight cavity fill used in hollow-core and composite floor-system rows.",
    tags: ["cavity-fill", "porous", "floor-system"]
  },
  {
    id: "mw_t_impact_layer_s35",
    name: "MW-T Impact Layer S35",
    category: "support",
    densityKgM3: 140,
    impact: {
      dynamicStiffnessMNm3: 35
    },
    notes: "Curated CLT impact layer with s'=35 MN/m3 used in exact Dataholz wet CLT families.",
    tags: ["resilient", "impact", "clt", "floor-system"]
  },
  {
    id: "mw_t_impact_layer_s40",
    name: "MW-T Impact Layer S40",
    category: "support",
    densityKgM3: 140,
    impact: {
      dynamicStiffnessMNm3: 40
    },
    notes: "Curated CLT impact layer with s'=40 MN/m3 used in exact Dataholz dry CLT families.",
    tags: ["resilient", "impact", "clt", "floor-system"]
  },
  {
    id: "mw_t_impact_layer_s6",
    name: "MW-T Impact Layer S6",
    category: "support",
    densityKgM3: 140,
    impact: {
      dynamicStiffnessMNm3: 6
    },
    notes: "Curated CLT impact layer with s'=6 MN/m3 used in high-performance wet CLT families.",
    tags: ["resilient", "impact", "clt", "floor-system"]
  },
  {
    id: "wf_t_impact_layer_s102",
    name: "WF-T Impact Layer S102",
    category: "support",
    densityKgM3: 140,
    impact: {
      dynamicStiffnessMNm3: 102
    },
    notes: "Curated high-stiffness resilient layer used in suspended Dataholz CLT families.",
    tags: ["resilient", "impact", "clt", "floor-system"]
  },
  {
    id: "bonded_chippings",
    name: "Bonded Chippings",
    category: "mass",
    densityKgM3: 1800,
    notes: "Bonded mineral fill used in curated exact CLT floor families.",
    tags: ["fill", "clt", "floor-system"]
  },
  {
    id: "non_bonded_chippings",
    name: "Non-bonded Chippings",
    category: "mass",
    densityKgM3: 1800,
    notes: "Loose resilient fill used in curated high-performance CLT families.",
    tags: ["fill", "clt", "floor-system"]
  },
  {
    id: "elastic_bonded_fill",
    name: "Elastic Bonded Fill",
    category: "mass",
    densityKgM3: 1500,
    notes: "Elastic bonded fill used in curated dry CLT families.",
    tags: ["fill", "clt", "floor-system"]
  },
  {
    id: "acoustic_hanger_ceiling",
    name: "Acoustic Hanger Ceiling",
    category: "support",
    densityKgM3: 0,
    notes: "Curated suspended ceiling support for exact CLT family matching.",
    tags: ["ceiling-support", "clt", "floor-system"]
  },
  {
    id: "resilient_stud_ceiling",
    name: "Resilient Stud Ceiling",
    category: "support",
    densityKgM3: 0,
    notes: "Curated lower support lane for measured TUAS open-box timber families.",
    tags: ["ceiling-support", "stud", "measured", "floor-system"]
  },
  {
    id: "dry_floating_gypsum_fiberboard",
    name: "Dry Floating Gypsum Fiberboard",
    category: "finish",
    densityKgM3: 900,
    notes: "Dry floating floor element used in curated Dataholz dry-floor family matches.",
    tags: ["floor-finish", "dry-floor", "gypsum-fiber", "floor-system"]
  },
  {
    id: "inex_floor_panel",
    name: "INEX FLOOR 19",
    category: "mass",
    densityKgM3: 1250,
    notes: "Curated structural floor deck lane for UBIQ steel floor-system exact matches.",
    tags: ["steel", "deck", "floor-system"]
  },
  {
    id: "engineered_timber_flooring",
    name: "Engineered Timber Flooring",
    category: "finish",
    densityKgM3: 750,
    notes: "Curated finish used in official timber floor-system matches.",
    tags: ["floor-finish", "engineered-timber", "floor-system"]
  },
  {
    id: "engineered_timber_with_acoustic_underlay",
    name: "Engineered Timber + Acoustic Underlay",
    category: "finish",
    densityKgM3: 780,
    notes: "Composite finish lane for curated official timber floor-system matches with acoustic underlay.",
    tags: ["floor-finish", "engineered-timber", "acoustic-underlay", "floor-system"]
  },
  {
    id: "carpet_with_foam_underlay",
    name: "Carpet + Foam Underlay",
    category: "finish",
    densityKgM3: 320,
    notes: "Composite soft-floor finish used in curated official timber floor-system matches.",
    tags: ["floor-finish", "carpet", "underlay", "floor-system"]
  },
  {
    id: "porcelain_tile",
    name: "Porcelain Tile",
    category: "finish",
    densityKgM3: 2200,
    notes: "Official hard-floor finish used in REGUPOL technical-data exact-system rows.",
    tags: ["floor-finish", "tile", "official-product", "impact"]
  },
  {
    id: "impactstop_board",
    name: "Impactstop Board",
    category: "finish",
    densityKgM3: 820,
    notes: "Curated lower board layer for exact Knauf timber family matching.",
    tags: ["ceiling-board", "knauf", "floor-system"]
  },
  {
    id: "firestop_board",
    name: "Firestop Board",
    category: "finish",
    densityKgM3: 820,
    notes: "Curated lower board layer for exact Knauf timber family matching.",
    tags: ["ceiling-board", "knauf", "floor-system"]
  },
  {
    id: "furring_channel",
    name: "Furring Channel",
    category: "support",
    densityKgM3: 0,
    notes: "Ceiling support element for curated direct-fixed and acoustically mounted timber floor-system matches.",
    tags: ["ceiling-support", "knauf", "floor-system"]
  }
];

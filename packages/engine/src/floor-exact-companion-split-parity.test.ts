import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type ExactCompanionSplitParityCase = {
  canonical: readonly LayerInput[];
  id: string;
  split: readonly LayerInput[];
};

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "DnT,w",
  "DnT,A",
  "Dn,w",
  "Dn,A",
  "Ln,w",
  "DeltaLw",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  partitionHeightM: 4,
  partitionWidthM: 4.5,
  receivingRoomVolumeM3: 55,
  separatingAreaM2: 18
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const CASES: readonly ExactCompanionSplitParityCase[] = [
  {
    id: "knauf concrete exact split board and carrier",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 100 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 6.5 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 6.5 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 100 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 75 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 75 }
    ]
  },
  {
    id: "hollow-core exact split board and carrier control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "genieclip_rst", thicknessMm: 16 },
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 5 },
      { floorRole: "resilient_layer", materialId: "geniemat_rst05", thicknessMm: 5 },
      { floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 200 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 8 },
      { floorRole: "ceiling_cavity", materialId: "genieclip_rst", thicknessMm: 16 },
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 5 },
      { floorRole: "resilient_layer", materialId: "geniemat_rst05", thicknessMm: 5 },
      { floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 100 },
      { floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 100 }
    ]
  },
  {
    id: "open-box dry exact split upper build-up control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 20 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 30 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]
  },
  {
    id: "open-web exact split board and carrier control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 100 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 100 }
    ]
  },
  {
    id: "knauf acoustic timber exact split board and carrier control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 120 },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 120 }
    ]
  },
  {
    id: "dataholz dry rc exact split board and carrier control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 240 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.25 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.25 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 120 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 120 }
    ]
  },
  {
    id: "tuas concrete dry exact split upper fill and carrier control",
    canonical: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 160 }
    ],
    split: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 20 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 30 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 80 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 80 }
    ]
  },
  {
    id: "knauf direct timber exact split board and floor-covering control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "impactstop_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "impactstop_board", thicknessMm: 6.5 },
      { floorRole: "ceiling_board", materialId: "impactstop_board", thicknessMm: 6.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 7.5 },
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 7.5 },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
    ]
  },
  {
    id: "open-web 400 exact split board and carrier control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 }
    ]
  },
  {
    id: "tuas open-box exact split floor-covering and resilient-layer control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 4 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 4 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]
  },
  {
    id: "knauf timber mount exact split fill and floor-covering control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 70 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 75 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 7.5 },
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 7.5 },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
    ]
  },
  {
    id: "tuas clt exact split floor-covering and resilient-layer control",
    canonical: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ],
    split: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 4 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 4 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ]
  },
  {
    id: "dataholz dry floor exact split board and upper-fill control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 40 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.25 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.25 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 20 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 20 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
    ]
  },
  {
    id: "dataholz timber-frame exact split board and carrier control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 120 },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 40 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.25 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6.25 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 120 },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 40 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 110 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 110 }
    ]
  },
  {
    id: "tuas clt 260 exact split floor-covering and resilient-layer control",
    canonical: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    split: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 4 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 4 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]
  },
  {
    id: "regupol curve 8 product-exact split screed and slab control",
    canonical: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
      { floorRole: "resilient_layer", materialId: "regupol_sonus_curve_8", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ],
    split: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 15 },
      { floorRole: "resilient_layer", materialId: "regupol_sonus_curve_8", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 75 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 75 }
    ]
  },
  {
    id: "getzner afm 33 product-delta split screed and slab control",
    canonical: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "resilient_layer", materialId: "getzner_afm_33", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ],
    split: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 25 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 25 },
      { floorRole: "resilient_layer", materialId: "getzner_afm_33", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 75 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 75 }
    ]
  },
  {
    id: "ubiq steel 200 unspecified bound split board and floor-covering control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 10 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 10 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 }
    ]
  },
  {
    id: "ubiq steel 300 unspecified bound split board and floor-covering control",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 300 }
    ],
    split: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 10 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 10 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 300 }
    ]
  }
];

function resultSnapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    c: result.metrics.estimatedCDb ?? null,
    ctr: result.metrics.estimatedCtrDb ?? null,
    dnA: result.metrics.estimatedDnADb ?? null,
    dnTA: result.metrics.estimatedDnTADb ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    dnW: result.metrics.estimatedDnWDb ?? null,
    deltaLw: result.impact?.DeltaLw ?? result.lowerBoundImpact?.DeltaLwLowerBound ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwCtr: result.floorSystemRatings?.RwCtr ?? null,
    rwDb: result.metrics.estimatedRwDb ?? null,
    rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

function assertParity(
  failures: string[],
  label: string,
  canonical: ReturnType<typeof calculateAssembly>,
  split: ReturnType<typeof calculateAssembly>
) {
  const canonicalSnapshot = resultSnapshot(canonical);
  const splitSnapshot = resultSnapshot(split);

  if (JSON.stringify(canonicalSnapshot) !== JSON.stringify(splitSnapshot)) {
    failures.push(
      `${label}: expected exact companion split parity, canonical=${JSON.stringify(canonicalSnapshot)} split=${JSON.stringify(splitSnapshot)}`
    );
  }
}

describe("floor exact companion split parity", () => {
  it("keeps exact floor-system companion metrics stable across contiguous same-material split variants in the lab bundle", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      assertParity(
        failures,
        `${testCase.id} lab`,
        calculateAssembly(testCase.canonical, { targetOutputs: LAB_OUTPUTS }),
        calculateAssembly(testCase.split, { targetOutputs: LAB_OUTPUTS })
      );
    }

    expect(failures).toEqual([]);
  });

  it("keeps exact floor-system companion metrics stable across contiguous same-material split variants in the field bundle", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      assertParity(
        failures,
        `${testCase.id} field`,
        calculateAssembly(testCase.canonical, {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }),
        calculateAssembly(testCase.split, {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        })
      );
    }

    expect(failures).toEqual([]);
  });
});

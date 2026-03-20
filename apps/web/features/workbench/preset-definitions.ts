import type { FloorRole } from "@dynecho/shared";

export type StudyMode = "wall" | "floor";
export type PresetId =
  | "concrete_wall"
  | "clt_floor"
  | "heavy_concrete_impact_floor"
  | "dataholz_timber_frame_exact"
  | "dataholz_dry_floor_exact"
  | "dataholz_dry_rc_exact"
  | "knauf_direct_timber_exact"
  | "knauf_acoustic_mount_exact"
  | "knauf_timber_mount_exact"
  | "knauf_concrete_exact"
  | "hollow_core_vinyl_exact"
  | "composite_bare_exact"
  | "dataholz_clt_wet_fill_exact"
  | "dataholz_clt_dry_exact"
  | "dataholz_clt_fill_exact"
  | "tuas_open_box_exact"
  | "tuas_open_box_dry_exact"
  | "tuas_concrete_dry_exact"
  | "ubiq_open_web_200_exact"
  | "ubiq_open_web_400_exact"
  | "ubiq_open_web_300_bound"
  | "steel_suspended_fallback"
  | "timber_bare_impact_only_fallback"
  | "ubiq_steel_250_bound"
  | "ubiq_steel_200_unspecified_bound"
  | "ubiq_steel_300_unspecified_bound"
  | "regupol_curve_8_exact"
  | "regupol_curve_8_wet_bound"
  | "getzner_afm_33_delta"
  | "tuas_clt_260_exact"
  | "tuas_clt_exact";

export type PresetDefinition = {
  id: PresetId;
  label: string;
  note: string;
  summary: string;
  studyMode: StudyMode;
  rows: Array<{ materialId: string; thicknessMm: string; floorRole?: FloorRole }>;
};

export const WORKBENCH_PRESETS: readonly PresetDefinition[] = [
  {
    id: "concrete_wall",
    label: "Wall Study",
    note: "dense base + split cavity + lining",
    summary: "A migration-safe wall composition used to prove stack editing and result narration.",
    studyMode: "wall",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "50" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "concrete", thicknessMm: "100" }
    ]
  },
  {
    id: "clt_floor",
    label: "Floor Study",
    note: "finish + topping + cavity + timber mass",
    summary: "A lightweight floor readout that keeps future desktop and SaaS workflows aligned around the same engine API.",
    studyMode: "floor",
    rows: [
      { materialId: "vinyl_flooring", thicknessMm: "4", floorRole: "floor_covering" },
      { materialId: "screed", thicknessMm: "50", floorRole: "upper_fill" },
      { materialId: "air_gap", thicknessMm: "45", floorRole: "ceiling_cavity" },
      { materialId: "clt_panel", thicknessMm: "120", floorRole: "base_structure" }
    ]
  },
  {
    id: "heavy_concrete_impact_floor",
    label: "Impact Floor",
    note: "tile + screed + resilient layer + heavy concrete",
    summary: "A narrow heavy-concrete floor study that exposes live Ln,w and DeltaLw through the new impact estimator lane.",
    studyMode: "floor",
    rows: [
      { materialId: "ceramic_tile", thicknessMm: "8", floorRole: "floor_covering" },
      { materialId: "screed", thicknessMm: "50", floorRole: "floating_screed" },
      { materialId: "generic_resilient_underlay", thicknessMm: "8", floorRole: "resilient_layer" },
      { materialId: "concrete", thicknessMm: "150", floorRole: "base_structure" }
    ]
  },
  {
    id: "dataholz_timber_frame_exact",
    label: "Dataholz Exact",
    note: "timber frame + MW-T + resilient channel ceiling",
    summary: "A curated exact floor-family preset mapped to Dataholz GDRNXA07A so the exact family lane, guide lane, and report export stay aligned.",
    studyMode: "floor",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5", floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: "120", floorRole: "ceiling_fill" },
      { materialId: "resilient_channel", thicknessMm: "27", floorRole: "ceiling_cavity" },
      { materialId: "generic_fill", thicknessMm: "40", floorRole: "upper_fill" },
      { materialId: "screed", thicknessMm: "50", floorRole: "floating_screed" },
      { materialId: "mw_t_impact_layer", thicknessMm: "30", floorRole: "resilient_layer" },
      { materialId: "timber_frame_floor", thicknessMm: "220", floorRole: "base_structure" }
    ]
  },
  {
    id: "dataholz_dry_floor_exact",
    label: "Dataholz Dry",
    note: "timber frame + dry floor + direct lining",
    summary: "A curated exact dry-floor preset mapped to Dataholz GDRTXN02B so direct-lined dry assemblies can be compared against wet screed families in the same desk.",
    studyMode: "floor",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5", floorRole: "ceiling_board" },
      { materialId: "gypsum_board", thicknessMm: "12.5", floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: "100", floorRole: "ceiling_fill" },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25", floorRole: "floor_covering" },
      { materialId: "generic_fill", thicknessMm: "40", floorRole: "upper_fill" },
      { materialId: "mw_t_impact_layer", thicknessMm: "30", floorRole: "resilient_layer" },
      { materialId: "timber_frame_floor", thicknessMm: "220", floorRole: "base_structure" }
    ]
  },
  {
    id: "dataholz_dry_rc_exact",
    label: "Dataholz Dry RC",
    note: "dry floor + resilient channel lining",
    summary: "A curated exact dry-floor preset mapped to Dataholz GDRTXA03B so suspended dry timber assemblies can be reviewed beside direct-lined dry families.",
    studyMode: "floor",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5", floorRole: "ceiling_board" },
      { materialId: "gypsum_board", thicknessMm: "12.5", floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: "100", floorRole: "ceiling_fill" },
      { materialId: "resilient_channel", thicknessMm: "27", floorRole: "ceiling_cavity" },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25", floorRole: "floor_covering" },
      { materialId: "mw_t_impact_layer", thicknessMm: "30", floorRole: "resilient_layer" },
      { materialId: "timber_frame_floor", thicknessMm: "240", floorRole: "base_structure" }
    ]
  },
  {
    id: "knauf_direct_timber_exact",
    label: "Knauf Direct",
    note: "timber flooring + direct-fixed Impactstop ceiling",
    summary: "A curated exact floor-family preset mapped to Knauf CT.2G so direct-fixed timber floor evidence can sit beside the screening stack.",
    studyMode: "floor",
    rows: [
      { materialId: "impactstop_board", thicknessMm: "13", floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: "90", floorRole: "ceiling_fill" },
      { materialId: "engineered_timber_flooring", thicknessMm: "15", floorRole: "floor_covering" },
      { materialId: "timber_joist_floor", thicknessMm: "240", floorRole: "base_structure" }
    ]
  },
  {
    id: "knauf_acoustic_mount_exact",
    label: "Knauf Acoustic",
    note: "timber + acoustic underlay + mounted ceiling",
    summary: "A curated exact floor-family preset mapped to Knauf CT120.1C so mounted ceiling timber families can be reviewed without leaving the operator deck.",
    studyMode: "floor",
    rows: [
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: "145", floorRole: "ceiling_fill" },
      { materialId: "furring_channel", thicknessMm: "28", floorRole: "ceiling_cavity" },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20", floorRole: "floor_covering" },
      { materialId: "timber_joist_floor", thicknessMm: "240", floorRole: "base_structure" }
    ]
  },
  {
    id: "knauf_timber_mount_exact",
    label: "Knauf Timber Mount",
    note: "timber flooring + single firestop ceiling",
    summary: "A curated exact timber preset mapped to Knauf CT30.1C so the lighter mounted timber row sits beside the heavier CT120.1C family.",
    studyMode: "floor",
    rows: [
      { materialId: "firestop_board", thicknessMm: "13", floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: "145", floorRole: "ceiling_fill" },
      { materialId: "furring_channel", thicknessMm: "28", floorRole: "ceiling_cavity" },
      { materialId: "engineered_timber_flooring", thicknessMm: "15", floorRole: "floor_covering" },
      { materialId: "timber_joist_floor", thicknessMm: "240", floorRole: "base_structure" }
    ]
  },
  {
    id: "knauf_concrete_exact",
    label: "Knauf Concrete",
    note: "150 mm slab + timber acoustic underlay",
    summary: "A curated exact concrete family preset mapped to Knauf CC60.1A so concrete slab evidence can sit beside the lighter timber and CLT families.",
    studyMode: "floor",
    rows: [
      { materialId: "firestop_board", thicknessMm: "13", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "13", floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: "50", floorRole: "ceiling_fill" },
      { materialId: "furring_channel", thicknessMm: "100", floorRole: "ceiling_cavity" },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20", floorRole: "floor_covering" },
      { materialId: "concrete", thicknessMm: "150", floorRole: "base_structure" }
    ]
  },
  {
    id: "hollow_core_vinyl_exact",
    label: "Hollow Core Vinyl",
    note: "HCP 200 + RST05 + GenieClip ceiling",
    summary: "An official Pliteq hollow-core preset so precast plank floor families can be reviewed beside concrete, timber, and steel rows.",
    studyMode: "floor",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "genieclip_rst", thicknessMm: "16", floorRole: "ceiling_cavity" },
      { materialId: "vinyl_flooring", thicknessMm: "5", floorRole: "floor_covering" },
      { materialId: "geniemat_rst05", thicknessMm: "5", floorRole: "resilient_layer" },
      { materialId: "hollow_core_plank", thicknessMm: "200", floorRole: "base_structure" }
    ]
  },
  {
    id: "steel_suspended_fallback",
    label: "Steel Suspended Family",
    note: "vinyl + suspended ceiling + joist floor family-general lane",
    summary: "A narrow lightweight-steel sample so the guided shell can show how DynEcho behaves when the stack lands on a supported suspended-ceiling family lane without an exact floor-system match.",
    studyMode: "floor",
    rows: [
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: "100", floorRole: "ceiling_fill" },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: "120", floorRole: "ceiling_cavity" },
      { materialId: "vinyl_flooring", thicknessMm: "3", floorRole: "floor_covering" },
      { materialId: "steel_joist_floor", thicknessMm: "250", floorRole: "base_structure" }
    ]
  },
  {
    id: "timber_bare_impact_only_fallback",
    label: "Timber Bare Impact-Only",
    note: "laminate + joist low-confidence impact-only lane",
    summary: "A deliberate low-confidence timber bare-floor sample so the guided shell can show that Ln,w stays on the impact fallback while Rw / Ctr remain on the separate airborne screening lane.",
    studyMode: "floor",
    rows: [
      { materialId: "laminate_flooring", thicknessMm: "9", floorRole: "floor_covering" },
      { materialId: "timber_joist_floor", thicknessMm: "240", floorRole: "base_structure" }
    ]
  },
  {
    id: "composite_bare_exact",
    label: "Composite Bare",
    note: "bare composite panel reference row",
    summary: "A peer-reviewed composite panel archetype so bare modular floor carriers no longer disappear from the local exact-family library.",
    studyMode: "floor",
    rows: [{ materialId: "composite_steel_deck", thicknessMm: "150", floorRole: "base_structure" }]
  },
  {
    id: "dataholz_clt_wet_fill_exact",
    label: "Dataholz CLT Wet",
    note: "wet screed + non-bonded fill",
    summary: "A curated exact CLT preset mapped to Dataholz GDMNXN05 so the filled wet CLT row can be compared against the lighter and higher-performance CLT families.",
    studyMode: "floor",
    rows: [
      { materialId: "screed", thicknessMm: "70", floorRole: "floating_screed" },
      { materialId: "non_bonded_chippings", thicknessMm: "100", floorRole: "upper_fill" },
      { materialId: "mw_t_impact_layer", thicknessMm: "30", floorRole: "resilient_layer" },
      { materialId: "clt_panel", thicknessMm: "150", floorRole: "base_structure" }
    ]
  },
  {
    id: "dataholz_clt_dry_exact",
    label: "Dataholz CLT Dry",
    note: "dry screed + elastic bonded fill",
    summary: "A curated exact CLT preset mapped to Dataholz GDMTXN01 so dry floating CLT families can be reviewed next to timber-frame and concrete rows.",
    studyMode: "floor",
    rows: [
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25", floorRole: "floor_covering" },
      { materialId: "elastic_bonded_fill", thicknessMm: "60", floorRole: "upper_fill" },
      { materialId: "mw_t_impact_layer_s40", thicknessMm: "30", floorRole: "resilient_layer" },
      { materialId: "clt_panel", thicknessMm: "140", floorRole: "base_structure" }
    ]
  },
  {
    id: "dataholz_clt_fill_exact",
    label: "Dataholz CLT Fill",
    note: "wet screed + resilient fill",
    summary: "A curated exact CLT preset mapped to Dataholz GDMNXN06 so high-performance wet CLT families can be compared against lighter bare CLT rows.",
    studyMode: "floor",
    rows: [
      { materialId: "screed", thicknessMm: "60", floorRole: "floating_screed" },
      { materialId: "non_bonded_chippings", thicknessMm: "120", floorRole: "upper_fill" },
      { materialId: "mw_t_impact_layer_s6", thicknessMm: "40", floorRole: "resilient_layer" },
      { materialId: "clt_panel", thicknessMm: "160", floorRole: "base_structure" }
    ]
  },
  {
    id: "tuas_clt_260_exact",
    label: "Measured CLT 260",
    note: "CLT 260 + EPS + laminate",
    summary: "A measured CLT preset that lands on the TUAS C2 exact row so the heavier bare CLT family is available beside TUAS X2.",
    studyMode: "floor",
    rows: [
      { materialId: "laminate_flooring", thicknessMm: "8", floorRole: "floor_covering" },
      { materialId: "eps_underlay", thicknessMm: "3", floorRole: "resilient_layer" },
      { materialId: "clt_panel", thicknessMm: "260", floorRole: "base_structure" }
    ]
  },
  {
    id: "tuas_open_box_exact",
    label: "Measured Open Box",
    note: "open-box timber + EPS + resilient stud ceiling",
    summary: "A measured open-box timber preset mapped to TUAS R2a so lower-treatment driven timber slabs are available beside CLT and concrete measured rows.",
    studyMode: "floor",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13", floorRole: "ceiling_board" },
      { materialId: "gypsum_board", thicknessMm: "13", floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: "100", floorRole: "ceiling_fill" },
      { materialId: "resilient_stud_ceiling", thicknessMm: "25", floorRole: "ceiling_cavity" },
      { materialId: "laminate_flooring", thicknessMm: "8", floorRole: "floor_covering" },
      { materialId: "eps_underlay", thicknessMm: "3", floorRole: "resilient_layer" },
      { materialId: "open_box_timber_slab", thicknessMm: "370", floorRole: "base_structure" }
    ]
  },
  {
    id: "tuas_open_box_dry_exact",
    label: "Open Box Dry",
    note: "open-box timber + dry floor + resilient stud ceiling",
    summary: "A measured open-box dry-floor preset mapped to TUAS R5b so upper and lower treatment driven timber slabs can be reviewed in the same desk.",
    studyMode: "floor",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13", floorRole: "ceiling_board" },
      { materialId: "gypsum_board", thicknessMm: "13", floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: "100", floorRole: "ceiling_fill" },
      { materialId: "resilient_stud_ceiling", thicknessMm: "25", floorRole: "ceiling_cavity" },
      { materialId: "laminate_flooring", thicknessMm: "8", floorRole: "floor_covering" },
      { materialId: "eps_underlay", thicknessMm: "3", floorRole: "resilient_layer" },
      { materialId: "generic_fill", thicknessMm: "50", floorRole: "upper_fill" },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60", floorRole: "floating_screed" },
      { materialId: "open_box_timber_slab", thicknessMm: "370", floorRole: "base_structure" }
    ]
  },
  {
    id: "tuas_concrete_dry_exact",
    label: "Measured Concrete Dry",
    note: "160 mm slab + dry floor + laminate",
    summary: "A measured concrete dry-floor preset mapped to TUAS H5 so the higher-performing concrete dry-floor row sits beside H2 and the Knauf concrete slice.",
    studyMode: "floor",
    rows: [
      { materialId: "laminate_flooring", thicknessMm: "8", floorRole: "floor_covering" },
      { materialId: "eps_underlay", thicknessMm: "3", floorRole: "resilient_layer" },
      { materialId: "generic_fill", thicknessMm: "50", floorRole: "upper_fill" },
      { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60", floorRole: "floating_screed" },
      { materialId: "concrete", thicknessMm: "160", floorRole: "base_structure" }
    ]
  },
  {
    id: "ubiq_open_web_200_exact",
    label: "UBIQ Steel 200",
    note: "open-web steel + INEX 19 + resilient ceiling",
    summary: "A curated steel exact preset mapped to UBIQ FL-28 200 so open-web steel rows now sit beside timber, CLT, and concrete family lanes.",
    studyMode: "floor",
    rows: [
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: "145", floorRole: "ceiling_fill" },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: "65", floorRole: "ceiling_cavity" },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20", floorRole: "floor_covering" },
      { materialId: "inex_floor_panel", thicknessMm: "19", floorRole: "floating_screed" },
      { materialId: "open_web_steel_floor", thicknessMm: "200", floorRole: "base_structure" }
    ]
  },
  {
    id: "ubiq_open_web_400_exact",
    label: "UBIQ Steel 400",
    note: "deeper open-web steel + INEX 19 + resilient ceiling",
    summary: "A curated steel exact preset mapped to UBIQ FL-28 400 so the deeper open-web steel row can be compared against the 200 mm steel and concrete dry-floor families.",
    studyMode: "floor",
    rows: [
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "rockwool", thicknessMm: "145", floorRole: "ceiling_fill" },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: "65", floorRole: "ceiling_cavity" },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20", floorRole: "floor_covering" },
      { materialId: "inex_floor_panel", thicknessMm: "19", floorRole: "floating_screed" },
      { materialId: "open_web_steel_floor", thicknessMm: "400", floorRole: "base_structure" }
    ]
  },
  {
    id: "ubiq_open_web_300_bound",
    label: "UBIQ Bound 300",
    note: "open-web steel + INEX 19 + 2 x 16 mm ceiling bound row",
    summary: "An official bound-only UBIQ preset that keeps airborne values exact while carrying Ln,w as a conservative upper bound.",
    studyMode: "floor",
    rows: [
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: "65", floorRole: "ceiling_cavity" },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20", floorRole: "floor_covering" },
      { materialId: "inex_floor_panel", thicknessMm: "19", floorRole: "floating_screed" },
      { materialId: "open_web_steel_floor", thicknessMm: "300", floorRole: "base_structure" }
    ]
  },
  {
    id: "ubiq_steel_250_bound",
    label: "UBIQ Bound 250",
    note: "steel joist / purlin family interpolation with conservative impact support",
    summary: "A bound-interpolation preset that demonstrates how DynEcho carries Ln,w <= ... instead of fabricating a steel family exact metric.",
    studyMode: "floor",
    rows: [
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: "65", floorRole: "ceiling_cavity" },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20", floorRole: "floor_covering" },
      { materialId: "inex_floor_panel", thicknessMm: "19", floorRole: "floating_screed" },
      { materialId: "steel_joist_floor", thicknessMm: "250", floorRole: "base_structure" }
    ]
  },
  {
    id: "ubiq_steel_200_unspecified_bound",
    label: "UBIQ Bound Unified 200",
    note: "lightweight steel + INEX 19 + 2 x 16 mm ceiling where both support families converge",
    summary:
      "A lightweight-steel bound preset with the carrier still left as generic lightweight steel, but at 200 mm both official UBIQ bound families publish the same support envelope so DynEcho does not need the conservative crossover warning.",
    studyMode: "floor",
    rows: [
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: "65", floorRole: "ceiling_cavity" },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20", floorRole: "floor_covering" },
      { materialId: "inex_floor_panel", thicknessMm: "19", floorRole: "floating_screed" },
      { materialId: "lightweight_steel_floor", thicknessMm: "200", floorRole: "base_structure" }
    ]
  },
  {
    id: "ubiq_steel_300_unspecified_bound",
    label: "UBIQ Bound Unspecified",
    note: "lightweight steel + INEX 19 + 2 x 16 mm ceiling with support form left open",
    summary: "A conservative crossover preset that keeps Ln,w as an upper bound while the carrier is still only known as lightweight steel and not yet fixed to joist / purlin versus open-web.",
    studyMode: "floor",
    rows: [
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: "65", floorRole: "ceiling_cavity" },
      { materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20", floorRole: "floor_covering" },
      { materialId: "inex_floor_panel", thicknessMm: "19", floorRole: "floating_screed" },
      { materialId: "lightweight_steel_floor", thicknessMm: "300", floorRole: "base_structure" }
    ]
  },
  {
    id: "regupol_curve_8_exact",
    label: "REGUPOL Curve 8",
    note: "tile + screed + curve 8 + 150 slab",
    summary: "An official technical-data exact-system preset so manufacturer product rows sit between curated family matches and generic formula outputs.",
    studyMode: "floor",
    rows: [
      { materialId: "ceramic_tile", thicknessMm: "8", floorRole: "floor_covering" },
      { materialId: "screed", thicknessMm: "30", floorRole: "floating_screed" },
      { materialId: "regupol_sonus_curve_8", thicknessMm: "8", floorRole: "resilient_layer" },
      { materialId: "concrete", thicknessMm: "150", floorRole: "base_structure" }
    ]
  },
  {
    id: "regupol_curve_8_wet_bound",
    label: "REGUPOL Wet Bound",
    note: "70 mm wet screed + curve 8 + 140 slab",
    summary: "An official lower-bound support preset that keeps the live heavy-floor metric visible while surfacing conservative product-sheet support alongside it.",
    studyMode: "floor",
    rows: [
      { materialId: "screed", thicknessMm: "70", floorRole: "floating_screed" },
      { materialId: "regupol_sonus_curve_8", thicknessMm: "8", floorRole: "resilient_layer" },
      { materialId: "concrete", thicknessMm: "140", floorRole: "base_structure" }
    ]
  },
  {
    id: "getzner_afm_33_delta",
    label: "Getzner AFM 33",
    note: "official DeltaLw lane on heavy slab reference",
    summary: "A product-property preset that carries the official AFM 33 DeltaLw row without pretending the live stack was solved exactly.",
    studyMode: "floor",
    rows: [
      { materialId: "ceramic_tile", thicknessMm: "8", floorRole: "floor_covering" },
      { materialId: "screed", thicknessMm: "50", floorRole: "floating_screed" },
      { materialId: "getzner_afm_33", thicknessMm: "8", floorRole: "resilient_layer" },
      { materialId: "concrete", thicknessMm: "150", floorRole: "base_structure" }
    ]
  },
  {
    id: "tuas_clt_exact",
    label: "Measured CLT",
    note: "CLT + EPS underlay + laminate",
    summary: "A measured CLT family preset that lands on the TUAS X2 exact-match lane and carries CI companions into the guide surface.",
    studyMode: "floor",
    rows: [
      { materialId: "laminate_flooring", thicknessMm: "8", floorRole: "floor_covering" },
      { materialId: "eps_underlay", thicknessMm: "3", floorRole: "resilient_layer" },
      { materialId: "clt_panel", thicknessMm: "140", floorRole: "base_structure" }
    ]
  }
];

export const DEFAULT_PRESET_ID: PresetId = "concrete_wall";

export function getPresetById(presetId: PresetId): PresetDefinition {
  const preset = WORKBENCH_PRESETS.find((entry) => entry.id === presetId);
  if (!preset) {
    throw new Error(`Unknown preset: ${presetId}`);
  }

  return preset;
}

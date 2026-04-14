import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"];

const DATAHOLZ_DRY_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25" },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: "60" },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" }
];

const DATAHOLZ_DRY_FALLBACK_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: "20" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "70" },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "22" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "145" }
];

const DATAHOLZ_WET_FILL_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "60" },
  { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: "120" },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s6", thicknessMm: "40" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "160" }
];

const DATAHOLZ_WET_NO_LINING_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "70" },
  { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: "100" },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "150" }
];

const DATAHOLZ_TIMBER_FRAME_BONDED_FILL_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "12.5" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: "27" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "60" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "60" },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: "240" }
];

const DATAHOLZ_TIMBER_FRAME_ELASTIC_FILL_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "25" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: "27" },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: "60" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "60" },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: "240" }
];

const CLT_UPPER_ONLY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "4" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "10" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "180" }
];

const CLT_UPPER_AND_LOWER_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: "100" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "4" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "220" }
];

const OPEN_BOX_DRY_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_B_STAGED_DRY_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "13" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_A_STAGED_DRY_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "13" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_BASIC_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_A_BASIC_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_A_DRY_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_B_WET_SCREED_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "40" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_B_REINFORCED_CEILING_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_A_EPS_SCREED_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_A_EPS_SCREED_SPLIT_UPPER_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: "25" },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: "25" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_A_MIXED_CEILING_SCHEDULE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_A_MIXED_CEILING_PACKED_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "26" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "60" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_HYBRID_LOWER_WET_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "45" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: "35" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_R7B_HYBRID_LOWER_SOURCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "45" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: "35" },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: "1" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_R7B_HYBRID_LOWER_DISJOINT_UPPER_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "45" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: "1" },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: "35" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_R8B_HYBRID_LOWER_SOURCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "45" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: "35" },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: "1" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_R9B_HYBRID_LOWER_SOURCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "45" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_BASIC_THICK_LAMINATE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "30" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_BASIC_OUTSIDE_EXACT_LAMINATE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "12" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_DRY_THICK_UNDERLAY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "12" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_DRY_OUTSIDE_EXACT_LAMINATE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "12" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_HYBRID_THICK_LAMINATE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "45" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_HYBRID_OUTSIDE_EXACT_LAMINATE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "45" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "12" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_HYBRID_LOWER_NO_FILL_DRY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "45" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_A_STAGED_UPPER_PACKAGE_SPLIT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "13" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "3" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_A_STAGED_UPPER_PACKAGE_SHORTHAND_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "13" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "33" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const CLT_X3_STAGED_UPPER_PROXY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "13" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "3" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" }
];

const CLT_C3_STAGED_UPPER_PROXY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "13" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "3" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_X4_HEAVY_DRY_PROXY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" }
];

const CLT_X4_HEAVY_DRY_PACKED_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" }
];

const CLT_X4_HEAVY_DRY_SHORTHAND_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" }
];

const CLT_C4_HEAVY_DRY_PROXY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C4_HEAVY_DRY_PACKED_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C4_HEAVY_DRY_SHORTHAND_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C5_HEAVY_DRY_PROXY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C5_HEAVY_DRY_PACKED_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "60" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C5_HEAVY_DRY_SHORTHAND_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C7_WET_GEOTEXTILE_SOURCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: "1" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: "35" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C7_WET_GEOTEXTILE_SPLIT_UPPER_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: "15" },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: "20" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: "1" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C7C_COMBINED_WET_PROXY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: "1" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: "35" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C5C_VISIBLE_COMBINED_PROXY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C3C_COMBINED_STAGED_SOURCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C4C_COMBINED_HEAVY_DRY_SOURCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C11C_COMBINED_SOURCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "30" },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: "1" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C2C_COMBINED_BASIC_SOURCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const OPEN_BOX_BASIC_MERGED_BOARD_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "26" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_B_REINFORCED_CEILING_MERGED_BOARD_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "60" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_DRY_SPLIT_UPPER_FILL_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "30" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_DRY_CONTIGUOUS_RESILIENT_SPLIT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "1.5" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "1.5" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const TIMBER_FRAME_DRY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "12.5" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25" },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: "220" }
];

const UBIQ_STEEL_300_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const UBIQ_FL23_STEEL_300_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const UBIQ_FL23_STEEL_300_16MM_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "16" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const UBIQ_FL24_STEEL_300_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const UBIQ_FL24_STEEL_300_16MM_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "16" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const UBIQ_FL26_STEEL_300_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const UBIQ_FL26_STEEL_300_16MM_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "16" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const UBIQ_STEEL_300_16MM_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "16" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const UBIQ_FL28_STEEL_400_BARE_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "400" }
];

const UBIQ_FL28_STEEL_300_CARPET_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: "12" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const UBIQ_STEEL_300_BOUND_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const UBIQ_STEEL_400_BOUND_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "400" }
];

const STEEL_JOIST_250_BOUND_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: "250" }
];

const LIGHTWEIGHT_STEEL_300_AMBIGUOUS_BOUND_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: "300" }
];

const LIGHTWEIGHT_STEEL_200_CONVERGED_BOUND_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: "200" }
];

const STEEL_JOIST_250_BOUND_DUPLICATE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: "250" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" }
];

const TIMBER_CERAMIC_LOW_CONFIDENCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: "240" },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: "8" },
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: "90" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" }
];

const COMPOSITE_LOW_CONFIDENCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: "150" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "150" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "15" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "15" }
];

function evaluateFloorScenario(input: {
  id: string;
  impactFieldContext?: Parameters<typeof evaluateScenario>[0]["impactFieldContext"];
  rows: readonly Omit<LayerDraft, "id">[];
  targetOutputs: readonly RequestedOutputId[];
}) {
  return evaluateScenario({
    id: input.id,
    name: input.id,
    rows: input.rows.map((row, index) => ({ ...row, id: `${input.id}-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    impactFieldContext: input.impactFieldContext,
    targetOutputs: input.targetOutputs
  });
}

function resultSnapshot(result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>) {
  return {
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

describe("floor family regressions", () => {
  it("keeps the curated Dataholz dry CLT row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "dataholz-dry-clt-exact",
      rows: DATAHOLZ_DRY_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("dataholz_gdmtxn01_dry_clt_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(50);
    expect(scenario.result?.impact?.CI).toBe(-1);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(62);
  });

  it("carries the curated Dataholz dry CLT row into local-guide field outputs on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "dataholz-dry-clt-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: DATAHOLZ_DRY_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(scenario.result?.impact?.LnW).toBe(50);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(49);
    expect(scenario.result?.impact?.LPrimeNW).toBe(52);
    expect(scenario.result?.impact?.LPrimeNTw).toBe(50);
    expect(scenario.result?.impact?.LPrimeNT50).toBe(49);
  });

  it("keeps under-described CLT dry stacks on the published dry-family fallback lane", () => {
    const scenario = evaluateFloorScenario({
      id: "dataholz-dry-clt-fallback",
      rows: DATAHOLZ_DRY_FALLBACK_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.impact?.basis).toBe("predictor_mass_timber_clt_dataholz_dry_estimate");
    expect(scenario.result?.impact?.LnW).toBe(50);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(62);
    expect(scenario.result?.impact?.estimateCandidateIds).toEqual(["dataholz_gdmtxn01_dry_clt_lab_2026"]);
  });

  it("keeps malformed CLT laminate-only entries off the TUAS X2/C2 impact interpolation lane", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-laminate-without-underlay",
      rows: [
        { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
        { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "180" }
      ],
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate).toBeNull();
    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI", "DeltaLw"]);
  });

  it("keeps malformed CLT dry finishes off the TUAS X5 dry interaction web route", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-dry-thick-laminate",
      rows: [
        { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "30" },
        { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
        { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
        { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
        { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" }
      ],
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate).toBeNull();
    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI", "DeltaLw"]);
  });

  it("keeps malformed combined CLT dry finishes off the generic CLT fallback web route", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-combined-dry-thick-laminate",
      rows: [
        { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "30" },
        { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
        { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
        { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
        { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
        { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
        { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
      ],
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate).toBeNull();
    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI", "DeltaLw"]);
  });

  it("keeps the curated Dataholz wet CLT fill row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "dataholz-wet-clt-fill-exact",
      rows: DATAHOLZ_WET_FILL_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("dataholz_gdmnxn06_fill_clt_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(39);
    expect(scenario.result?.impact?.CI).toBe(-1);
    expect(scenario.result?.impact?.CI50_2500).toBe(7);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(78);
  });

  it("carries the curated Dataholz wet CLT fill row into standardized field outputs on the web scenario route once CI50 is published", () => {
    const scenario = evaluateFloorScenario({
      id: "dataholz-wet-clt-fill-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: DATAHOLZ_WET_FILL_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("dataholz_gdmnxn06_fill_clt_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(scenario.result?.impact?.LPrimeNW).toBe(41);
    expect(scenario.result?.impact?.LPrimeNTw).toBe(39);
    expect(scenario.result?.impact?.LPrimeNT50).toBe(46);
  });

  it("keeps the curated Dataholz wet CLT no-lining row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "dataholz-wet-clt-no-lining-exact",
      rows: DATAHOLZ_WET_NO_LINING_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("dataholz_gdmnxn05_wet_clt_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(45);
    expect(scenario.result?.impact?.CI).toBe(-1);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(74);
  });

  it("keeps the curated Dataholz wet CLT 05 row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "dataholz-wet-clt-05-exact",
      rows: [
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: "60" },
        { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: "60" },
        { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: "30" },
        { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "160" }
      ],
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("dataholz_gdmnxn02_05_wet_clt_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(47);
    expect(scenario.result?.impact?.CI).toBe(2);
    expect(scenario.result?.impact?.CI50_2500).toBe(4);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(49);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(74);
    expect(scenario.result?.floorSystemRatings?.RwCtr).toBe(-7);
  });

  it("carries the curated Dataholz wet CLT 05 row into standardized field outputs on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "dataholz-wet-clt-05-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: [
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: "60" },
        { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: "60" },
        { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: "30" },
        { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "160" }
      ],
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("dataholz_gdmnxn02_05_wet_clt_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(scenario.result?.impact?.LPrimeNW).toBe(49);
    expect(scenario.result?.impact?.LPrimeNTw).toBe(47);
    expect(scenario.result?.impact?.LPrimeNT50).toBe(51);
  });

  it("keeps CLT upper-only stacks on the bare interpolation fallback lane", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-upper-only-fallback",
      rows: CLT_UPPER_ONLY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.impact?.basis).toBe("predictor_mass_timber_clt_bare_interpolation_estimate");
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(scenario.result?.floorSystemEstimate?.fitPercent).toBe(79.7);
    expect(scenario.result?.impact?.LnW).toBe(57.7);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(40.6);
    expect(scenario.result?.impact?.estimateCandidateIds).toEqual([
      "tuas_x2_clt140_measured_2026",
      "tuas_c2_clt260_measured_2026",
      "tuas_x4_clt140_measured_2026"
    ]);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(scenario.warnings.some((warning) => /family archetype at 79.7% fit/i.test(warning))).toBe(true);
  });

  it("keeps under-described CLT upper-plus-lower direct-fixed stacks on the fail-closed screening lane", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-upper-lower-fallback",
      rows: CLT_UPPER_AND_LOWER_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate).toBeNull();
    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(49);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI", "DeltaLw"]);
    expect(scenario.result?.floorSystemRecommendations).toHaveLength(8);
    expect(
      scenario.result?.warnings.some((warning: string) =>
        /No curated exact floor-system landed\. Closest family candidate is TUAS C2c \| CLT 260 mm \| EPS underlay \+ laminate \+ suspended ceiling\./i.test(
          warning
        )
      )
    ).toBe(true);
  });

  it("keeps the measured TUAS open-box dry-floor row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-dry-exact",
      rows: OPEN_BOX_DRY_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.LnW).toBe(44);
    expect(scenario.result?.impact?.CI50_2500).toBe(3);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(75);
  });

  it("keeps the measured TUAS open-box staged dry row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-b-staged-dry-exact",
      rows: OPEN_BOX_B_STAGED_DRY_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r3b_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.LnW).toBe(39);
    expect(scenario.result?.impact?.CI50_2500).toBe(5);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(70);
  });

  it("keeps the measured TUAS open-box family-a staged dry row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-a-staged-dry-exact",
      rows: OPEN_BOX_A_STAGED_DRY_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r3a_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.LnW).toBe(56);
    expect(scenario.result?.impact?.CI50_2500).toBe(3);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(56);
  });

  it("keeps the measured TUAS open-box family-b basic row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-basic-exact",
      rows: OPEN_BOX_BASIC_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r2b_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.LnW).toBe(46);
    expect(scenario.result?.impact?.CI50_2500).toBe(3);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(62);
  });

  it("keeps the measured TUAS open-box family-a basic row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-a-basic-exact",
      rows: OPEN_BOX_A_BASIC_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r2a_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.LnW).toBe(61);
    expect(scenario.result?.impact?.CI50_2500).toBe(4);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(49);
  });

  it("keeps the measured TUAS open-box family-a dry row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-a-dry-exact",
      rows: OPEN_BOX_A_DRY_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r5a_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.LnW).toBe(64);
    expect(scenario.result?.impact?.CI50_2500).toBe(2);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(63);
  });

  it("keeps the measured TUAS open-box wet screed row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-b-wet-screed-exact",
      rows: OPEN_BOX_B_WET_SCREED_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r11b_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.LnW).toBe(60);
    expect(scenario.result?.impact?.CI50_2500).toBe(0);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(74);
  });

  it("keeps the measured TUAS open-box reinforced ceiling row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-b-reinforced-ceiling-exact",
      rows: OPEN_BOX_B_REINFORCED_CEILING_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r6b_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.LnW).toBe(47);
    expect(scenario.result?.impact?.CI50_2500).toBe(1);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(71);
  });

  it("keeps the measured TUAS open-box EPS board plus screed branch exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-a-eps-screed-exact",
      rows: OPEN_BOX_A_EPS_SCREED_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r7a_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.LnW).toBe(63);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(60);
  });

  it("keeps the TUAS mixed-board family-a route exact on the web scenario surface", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-a-mixed-ceiling-schedule",
      rows: OPEN_BOX_A_MIXED_CEILING_SCHEDULE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r6a_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.LnW).toBe(60);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(56);
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: ceiling board x6 \(Gypsum Board\)/i.test(warning)
      )
    ).toBe(false);
  });

  it("keeps the TUAS mixed-board family-a packed shorthand exact on the web scenario surface", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-a-mixed-ceiling-packed",
      rows: OPEN_BOX_A_MIXED_CEILING_PACKED_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r6a_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.LnW).toBe(60);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(56);
  });

  it("keeps the TUAS separator-backed hybrid lower-treatment anchor exact on the web scenario surface", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-r7b-hybrid-lower-source",
      rows: OPEN_BOX_R7B_HYBRID_LOWER_SOURCE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r7b_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.LnW).toBe(47);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(47);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(72);
    expect(scenario.warnings.some((warning) => /Geotextile Separator Layer in the floating screed role/i.test(warning))).toBe(false);
  });

  it("keeps disjoint TUAS hybrid upper packages off the open-box generic fallback web route", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-r7b-disjoint-upper-package",
      rows: OPEN_BOX_R7B_HYBRID_LOWER_DISJOINT_UPPER_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate).toBeNull();
    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI", "DeltaLw"]);
    expect(
      scenario.warnings.some((warning) =>
        /floating screed x2 \(Geotextile Separator Layer, Mineral Screed\)/i.test(warning)
      )
    ).toBe(true);
  });

  it("keeps malformed open-box laminate/EPS walking finishes off TUAS same-family impact fallbacks", () => {
    const cases = [
      ["open-box-basic-thick-laminate", OPEN_BOX_BASIC_THICK_LAMINATE_ROWS],
      ["open-box-basic-outside-exact-laminate", OPEN_BOX_BASIC_OUTSIDE_EXACT_LAMINATE_ROWS],
      ["open-box-dry-thick-underlay", OPEN_BOX_DRY_THICK_UNDERLAY_ROWS],
      ["open-box-dry-outside-exact-laminate", OPEN_BOX_DRY_OUTSIDE_EXACT_LAMINATE_ROWS],
      ["open-box-hybrid-thick-laminate", OPEN_BOX_HYBRID_THICK_LAMINATE_ROWS],
      ["open-box-hybrid-outside-exact-laminate", OPEN_BOX_HYBRID_OUTSIDE_EXACT_LAMINATE_ROWS]
    ] as const;

    for (const [id, rows] of cases) {
      const scenario = evaluateFloorScenario({
        id,
        rows,
        targetOutputs: LAB_OUTPUTS
      });

      expect(scenario.result?.floorSystemMatch).toBeNull();
      expect(scenario.result?.floorSystemEstimate).toBeNull();
      expect(scenario.result?.impact).toBeNull();
      expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw"]);
      expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI", "DeltaLw"]);
    }
  });

  it("keeps the TUAS hybrid lower-treatment proxy without the separator off the exact web route", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-hybrid-lower-wet",
      rows: OPEN_BOX_HYBRID_LOWER_WET_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(scenario.result?.floorSystemEstimate?.fitPercent).toBe(54);
    expect(scenario.result?.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(scenario.result?.impact?.estimateCandidateIds).toEqual([
      "tuas_r9b_open_box_timber_measured_2026",
      "tuas_r7b_open_box_timber_measured_2026",
      "tuas_r7a_open_box_timber_measured_2026"
    ]);
    expect(scenario.result?.impact?.LnW).toBe(48.3);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(49.2);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(67.3);
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: ceiling cavity x2 \(TUAS Open-box Ceiling Family A, Resilient Stud Ceiling\)/i.test(
          warning
        )
      )
    ).toBe(true);
  });

  it("keeps the TUAS R8b finishless sibling exact on the web lane once the no-finish follow-on surface lands", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-r8b-hybrid-lower-source",
      rows: OPEN_BOX_R8B_HYBRID_LOWER_SOURCE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "open-box-r8b-hybrid-lower-source-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 55
      },
      rows: OPEN_BOX_R8B_HYBRID_LOWER_SOURCE_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r8b_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(50);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(49);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(72);
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: ceiling cavity x2 \(TUAS Open-box Ceiling Family A, Resilient Stud Ceiling\); floating screed x2 \(Geotextile Separator Layer, Mineral Screed\)/i.test(
          warning
        )
      )
    ).toBe(false);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_r8b_open_box_timber_measured_2026");
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(50);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(52);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(49.6);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(49.6);
  });

  it("keeps the TUAS R9b hybrid lower-treatment wet-top sibling exact on the web lane once the source stack is frozen correctly", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-r9b-hybrid-lower-source",
      rows: OPEN_BOX_R9B_HYBRID_LOWER_SOURCE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "open-box-r9b-hybrid-lower-source-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 55
      },
      rows: OPEN_BOX_R9B_HYBRID_LOWER_SOURCE_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r9b_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(45);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(46);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(68);
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: ceiling cavity x2 \(TUAS Open-box Ceiling Family A, Resilient Stud Ceiling\)/i.test(
          warning
        )
      )
    ).toBe(false);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_r9b_open_box_timber_measured_2026");
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(45);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(47);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(44.6);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(47.6);
  });

  it("keeps the TUAS R2c no-fill hybrid lower-treatment sibling exact on the web lane once the source stack is frozen correctly", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-r2c-hybrid-lower-source",
      rows: OPEN_BOX_HYBRID_LOWER_NO_FILL_DRY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "open-box-r2c-hybrid-lower-source-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 55
      },
      rows: OPEN_BOX_HYBRID_LOWER_NO_FILL_DRY_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r2c_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(70);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(70);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(54);
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: ceiling cavity x2 \(TUAS Open-box Ceiling Family A, Resilient Stud Ceiling\)/i.test(
          warning
        )
      )
    ).toBe(false);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_r2c_open_box_timber_measured_2026");
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(70);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(72);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(69.6);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(69.6);
  });

  it("keeps the source-backed TUAS staged upper package exact on the web scenario surface once the floating-screed schedule lands", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-a-staged-upper-package-split",
      rows: OPEN_BOX_A_STAGED_UPPER_PACKAGE_SPLIT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "open-box-a-staged-upper-package-split-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 55
      },
      rows: OPEN_BOX_A_STAGED_UPPER_PACKAGE_SPLIT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r10a_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(55);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(55);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(56);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x3 \(Gypsum Board, Mineral Screed\)/i.test(
          warning
        )
      )
    ).toBe(false);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_r10a_open_box_timber_measured_2026");
    expect(fieldScenario.result?.impact?.basis).toBe(
      "mixed_exact_plus_estimated_standardized_field_volume_normalization"
    );
    expect(fieldScenario.result?.impact?.LnW).toBe(55);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(57);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(54.6);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(55.6);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the over-abstracted TUAS staged shorthand off the exact web route so it cannot silently collapse onto the dry family-a corridor", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-a-staged-upper-package-shorthand",
      rows: OPEN_BOX_A_STAGED_UPPER_PACKAGE_SHORTHAND_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "open-box-a-staged-upper-package-shorthand-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 55
      },
      rows: OPEN_BOX_A_STAGED_UPPER_PACKAGE_SHORTHAND_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(scenario.result?.floorSystemEstimate?.fitPercent).toBe(90);
    expect(scenario.result?.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(scenario.result?.impact?.estimateCandidateIds).toEqual([
      "tuas_r3a_open_box_timber_measured_2026",
      "tuas_r3b_open_box_timber_measured_2026",
      "tuas_r5a_open_box_timber_measured_2026"
    ]);
    expect(scenario.result?.impact?.LnW).toBe(53.9);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(60.9);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(scenario.warnings.some((warning) => /family archetype at 90% fit/i.test(warning))).toBe(true);

    expect(fieldScenario.result?.floorSystemMatch).toBeNull();
    expect(fieldScenario.result?.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(fieldScenario.result?.floorSystemEstimate?.fitPercent).toBe(90);
    expect(fieldScenario.result?.impact?.basis).toBe(
      "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    );
    expect(fieldScenario.result?.impact?.estimateCandidateIds).toEqual([
      "tuas_r3a_open_box_timber_measured_2026",
      "tuas_r3b_open_box_timber_measured_2026",
      "tuas_r5a_open_box_timber_measured_2026"
    ]);
    expect(fieldScenario.result?.impact?.LnW).toBe(53.9);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(55.9);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(53.5);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(56.7);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the TUAS X3 staged-upper CLT stack exact on the web route once the dedicated schedule-backed row lands", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-x3-staged-upper-proxy",
      rows: CLT_X3_STAGED_UPPER_PROXY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "clt-x3-staged-upper-proxy-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: CLT_X3_STAGED_UPPER_PROXY_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_x3_clt140_measured_2026");
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(52);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(52);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(49);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x3 \(Gypsum Board, Mineral Screed\)/i.test(warning)
      )
    ).toBe(false);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_x3_clt140_measured_2026");
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(52);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(54);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(52);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(60);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the TUAS C3 staged-upper CLT stack exact on the web route once the thicker same-surface row lands", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-c3-staged-upper-proxy",
      rows: CLT_C3_STAGED_UPPER_PROXY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "clt-c3-staged-upper-proxy-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: CLT_C3_STAGED_UPPER_PROXY_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_c3_clt260_measured_2026");
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(47);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(49);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(54);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x3 \(Gypsum Board, Mineral Screed\)/i.test(warning)
      )
    ).toBe(false);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_c3_clt260_measured_2026");
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(47);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(49);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(47);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(53);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the TUAS X4 heavy dry-top CLT stack exact on the web route once the dedicated same-surface row lands", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-x4-heavy-dry-exact",
      rows: CLT_X4_HEAVY_DRY_PROXY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "clt-x4-heavy-dry-exact-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: CLT_X4_HEAVY_DRY_PROXY_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_x4_clt140_measured_2026");
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(50);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(51);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(55);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x2 \(Gypsum Board\)/i.test(warning)
      )
    ).toBe(false);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_x4_clt140_measured_2026");
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(50);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(52);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(50);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(58);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the packed TUAS X4 heavy dry-top row exact on the web route when the gypsum boards are entered as one row", () => {
    const baselineScenario = evaluateFloorScenario({
      id: "clt-x4-heavy-dry-baseline",
      rows: CLT_X4_HEAVY_DRY_PROXY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const packedScenario = evaluateFloorScenario({
      id: "clt-x4-heavy-dry-packed",
      rows: CLT_X4_HEAVY_DRY_PACKED_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(baselineScenario.result).not.toBeNull();
    expect(packedScenario.result).not.toBeNull();
    expect(resultSnapshot(packedScenario.result!)).toEqual(resultSnapshot(baselineScenario.result!));
  });

  it("keeps the over-abstracted TUAS X4 heavy dry-top shorthand off the exact web route", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-x4-heavy-dry-shorthand",
      rows: CLT_X4_HEAVY_DRY_SHORTHAND_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(scenario.result?.floorSystemEstimate?.fitPercent).toBe(94);
    expect(scenario.result?.impact?.basis).toBe("predictor_mass_timber_clt_dry_interaction_estimate");
    expect(scenario.result?.impact?.estimateCandidateIds).toEqual(["tuas_x5_clt140_measured_2026"]);
    expect(scenario.result?.impact?.LnW).toBe(65);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(65);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(55);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(scenario.warnings.some((warning) => /family general at 94% fit/i.test(warning))).toBe(true);
  });

  it("keeps the TUAS C4 heavy dry-top CLT stack exact on the web route once the thicker same-surface row lands", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-c4-heavy-dry-exact",
      rows: CLT_C4_HEAVY_DRY_PROXY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "clt-c4-heavy-dry-exact-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: CLT_C4_HEAVY_DRY_PROXY_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_c4_clt260_measured_2026");
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(45);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(46);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(61);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x2 \(Gypsum Board\)/i.test(warning)
      )
    ).toBe(false);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_c4_clt260_measured_2026");
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(45);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(47);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(45);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(51);
    expect(fieldScenario.result?.floorSystemRatings?.Rw).toBe(61);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the packed TUAS C4 heavy dry-top row exact on the web route when the gypsum boards are entered as one row", () => {
    const baselineScenario = evaluateFloorScenario({
      id: "clt-c4-heavy-dry-baseline",
      rows: CLT_C4_HEAVY_DRY_PROXY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const packedScenario = evaluateFloorScenario({
      id: "clt-c4-heavy-dry-packed",
      rows: CLT_C4_HEAVY_DRY_PACKED_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(baselineScenario.result).not.toBeNull();
    expect(packedScenario.result).not.toBeNull();
    expect(resultSnapshot(packedScenario.result!)).toEqual(resultSnapshot(baselineScenario.result!));
  });

  it("keeps the over-abstracted TUAS C4 heavy dry-top shorthand off the exact web route", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-c4-heavy-dry-shorthand",
      rows: CLT_C4_HEAVY_DRY_SHORTHAND_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(scenario.result?.floorSystemEstimate?.fitPercent).toBe(94);
    expect(scenario.result?.impact?.basis).toBe("predictor_mass_timber_clt_dry_interaction_estimate");
    expect(scenario.result?.impact?.estimateCandidateIds).toEqual(["tuas_x5_clt140_measured_2026"]);
    expect(scenario.result?.impact?.LnW).toBe(65);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(65);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(55);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(scenario.warnings.some((warning) => /family general at 94% fit/i.test(warning))).toBe(true);
  });

  it("keeps the TUAS C5 heavy dry-top CLT stack exact on the web route once the heavier same-surface row lands", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-c5-heavy-dry-exact",
      rows: CLT_C5_HEAVY_DRY_PROXY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "clt-c5-heavy-dry-exact-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: CLT_C5_HEAVY_DRY_PROXY_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_c5_clt260_measured_2026");
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(60);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(62);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(61);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x4 \(Gypsum Board\)/i.test(warning)
      )
    ).toBe(false);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_c5_clt260_measured_2026");
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(60);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(62);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(60);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(63);
    expect(fieldScenario.result?.floorSystemRatings?.Rw).toBe(61);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the packed TUAS C5 heavy dry-top row exact on the web route when the gypsum boards are entered as one row", () => {
    const baselineScenario = evaluateFloorScenario({
      id: "clt-c5-heavy-dry-baseline",
      rows: CLT_C5_HEAVY_DRY_PROXY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const packedScenario = evaluateFloorScenario({
      id: "clt-c5-heavy-dry-packed",
      rows: CLT_C5_HEAVY_DRY_PACKED_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(baselineScenario.result).not.toBeNull();
    expect(packedScenario.result).not.toBeNull();
    expect(resultSnapshot(packedScenario.result!)).toEqual(resultSnapshot(baselineScenario.result!));
  });

  it("keeps the over-abstracted TUAS C5 heavy dry-top shorthand off the exact web route", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-c5-heavy-dry-shorthand",
      rows: CLT_C5_HEAVY_DRY_SHORTHAND_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "clt-c5-heavy-dry-shorthand-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: CLT_C5_HEAVY_DRY_SHORTHAND_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(scenario.result?.floorSystemEstimate?.fitPercent).toBe(94);
    expect(scenario.result?.impact?.basis).toBe("predictor_mass_timber_clt_dry_interaction_estimate");
    expect(scenario.result?.impact?.estimateCandidateIds).toEqual(["tuas_x5_clt140_measured_2026"]);
    expect(scenario.result?.impact?.LnW).toBe(65);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(65);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(55);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(scenario.warnings.some((warning) => /family general at 94% fit/i.test(warning))).toBe(true);

    expect(fieldScenario.result?.floorSystemMatch).toBeNull();
    expect(fieldScenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(fieldScenario.result?.floorSystemEstimate?.fitPercent).toBe(94);
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.estimateCandidateIds).toEqual(["tuas_x5_clt140_measured_2026"]);
    expect(fieldScenario.result?.impact?.LnW).toBe(65);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(67);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(65);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(65);
    expect(fieldScenario.result?.floorSystemRatings?.Rw).toBe(55);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the TUAS C7 wet geotextile CLT stack exact on the web route once the source-backed surface lands", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-c7-wet-geotextile-exact",
      rows: CLT_C7_WET_GEOTEXTILE_SOURCE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "clt-c7-wet-geotextile-exact-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: CLT_C7_WET_GEOTEXTILE_SOURCE_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_c7_clt260_measured_2026");
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(39);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(40);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(57);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floating screed x2 \(Geotextile, Mineral Screed\)/i.test(warning)
      )
    ).toBe(false);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_c7_clt260_measured_2026");
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(39);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(41);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(39);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(42);
    expect(fieldScenario.result?.floorSystemRatings?.Rw).toBe(57);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the TUAS C7 wet geotextile exact route stable when the EPS board is entered as contiguous split rows ahead of the walking surface", () => {
    const baselineScenario = evaluateFloorScenario({
      id: "clt-c7-wet-geotextile-baseline",
      rows: CLT_C7_WET_GEOTEXTILE_SOURCE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const splitScenario = evaluateFloorScenario({
      id: "clt-c7-wet-geotextile-split-upper",
      rows: CLT_C7_WET_GEOTEXTILE_SPLIT_UPPER_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(baselineScenario.result).not.toBeNull();
    expect(splitScenario.result).not.toBeNull();
    expect(resultSnapshot(splitScenario.result!)).toEqual(resultSnapshot(baselineScenario.result!));
  });

  it("keeps the TUAS C7c combined wet CLT row exact on the web route once the lower-ceiling sibling lands", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-c7c-combined-wet-proxy",
      rows: CLT_C7C_COMBINED_WET_PROXY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "clt-c7c-combined-wet-proxy-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: CLT_C7C_COMBINED_WET_PROXY_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_c7c_clt260_measured_2026");
    expect(scenario.result?.floorSystemEstimate).toBeNull();
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(30);
    expect(scenario.result?.impact?.CI).toBe(5);
    expect(scenario.result?.impact?.CI50_2500).toBe(14);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(35);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(75);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(
      scenario.warnings.some((warning) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: floating screed x2/i.test(warning)
      )
    ).toBe(false);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_c7c_clt260_measured_2026");
    expect(fieldScenario.result?.floorSystemEstimate).toBeNull();
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(30);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(32);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(30);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(44);
    expect(fieldScenario.result?.floorSystemRatings?.Rw).toBe(75);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("carries the visible TUAS C5c dry combined CLT surface onto the predictor-backed combined lane on the web route", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-c5c-visible-combined-proxy",
      rows: CLT_C5C_VISIBLE_COMBINED_PROXY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "clt-c5c-visible-combined-proxy-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: CLT_C5C_VISIBLE_COMBINED_PROXY_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(scenario.result?.floorSystemEstimate?.fitPercent).toBe(92.8);
    expect(scenario.result?.impact?.basis).toBe("predictor_mass_timber_clt_dry_interaction_estimate");
    expect(scenario.result?.impact?.estimateCandidateIds).toEqual(["tuas_c5c_clt260_measured_2026"]);
    expect(scenario.result?.impact?.LnW).toBe(38);
    expect(scenario.result?.impact?.CI).toBe(4);
    expect(scenario.result?.impact?.CI50_2500).toBe(6);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(42);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(75);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);

    expect(fieldScenario.result?.floorSystemMatch).toBeNull();
    expect(fieldScenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(38);
    expect(fieldScenario.result?.impact?.CI).toBe(4);
    expect(fieldScenario.result?.impact?.CI50_2500).toBe(6);
    expect(fieldScenario.result?.impact?.LnWPlusCI).toBe(42);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(40);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(38);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(44);
    expect(fieldScenario.result?.floorSystemRatings?.Rw).toBe(75);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("lands the source-backed TUAS C3c staged combined CLT row exact on the web route once the decision matrix selects it", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-c3c-combined-staged-proxy",
      rows: CLT_C3C_COMBINED_STAGED_SOURCE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "clt-c3c-combined-staged-proxy-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: CLT_C3C_COMBINED_STAGED_SOURCE_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_c3c_clt260_measured_2026");
    expect(scenario.result?.floorSystemEstimate).toBeNull();
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(27);
    expect(scenario.result?.impact?.CI).toBe(2);
    expect(scenario.result?.impact?.CI50_2500).toBe(16);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(29);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(73);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_c3c_clt260_measured_2026");
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(27);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(29);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(27);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(43);
    expect(fieldScenario.result?.floorSystemRatings?.Rw).toBe(73);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("lands the source-backed TUAS C4c heavy dry combined CLT row exact on the web route without collapsing onto the upper-only C4 neighbor", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-c4c-combined-heavy-dry-proxy",
      rows: CLT_C4C_COMBINED_HEAVY_DRY_SOURCE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "clt-c4c-combined-heavy-dry-proxy-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: CLT_C4C_COMBINED_HEAVY_DRY_SOURCE_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_c4c_clt260_measured_2026");
    expect(scenario.result?.floorSystemEstimate).toBeNull();
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(24);
    expect(scenario.result?.impact?.CI).toBe(2);
    expect(scenario.result?.impact?.CI50_2500).toBe(16);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(26);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(74);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_c4c_clt260_measured_2026");
    expect(fieldScenario.result?.floorSystemEstimate).toBeNull();
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(24);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(26);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(24);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(40);
    expect(fieldScenario.result?.floorSystemRatings?.Rw).toBe(74);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the source-backed TUAS C11c combined wet CLT row screening-only on the web route until its own wet-stack anomaly audit lands", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-c11c-heavier-combined-guess",
      rows: CLT_C11C_COMBINED_SOURCE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate).toBeNull();
    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(49);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI", "DeltaLw"]);
    expect(
      scenario.warnings.some((warning) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: floating screed x2/i.test(warning)
      )
    ).toBe(true);
  });

  it("keeps the TUAS C2c combined CLT row exact on the web route once the source-backed lower-ceiling surface lands", () => {
    const scenario = evaluateFloorScenario({
      id: "clt-c2c-combined-basic-proxy",
      rows: CLT_C2C_COMBINED_BASIC_SOURCE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldScenario = evaluateFloorScenario({
      id: "clt-c2c-combined-basic-proxy-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: CLT_C2C_COMBINED_BASIC_SOURCE_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_c2c_clt260_measured_2026");
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(35);
    expect(scenario.result?.impact?.CI).toBe(4);
    expect(scenario.result?.impact?.CI50_2500).toBe(9);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(39);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(70);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["DeltaLw"]);

    expect(fieldScenario.result?.floorSystemMatch?.system.id).toBe("tuas_c2c_clt260_measured_2026");
    expect(fieldScenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(fieldScenario.result?.impact?.LnW).toBe(35);
    expect(fieldScenario.result?.impact?.LPrimeNW).toBe(37);
    expect(fieldScenario.result?.impact?.LPrimeNTw).toBe(35);
    expect(fieldScenario.result?.impact?.LPrimeNT50).toBe(44);
    expect(fieldScenario.result?.floorSystemRatings?.Rw).toBe(70);
    expect(fieldScenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(fieldScenario.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the measured TUAS open-box timber row exact when two gypsum boards are merged into one row", () => {
    const baselineScenario = evaluateFloorScenario({
      id: "open-box-basic-baseline",
      rows: OPEN_BOX_BASIC_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const mergedScenario = evaluateFloorScenario({
      id: "open-box-basic-merged-board",
      rows: OPEN_BOX_BASIC_MERGED_BOARD_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(baselineScenario.result).not.toBeNull();
    expect(mergedScenario.result).not.toBeNull();
    expect(resultSnapshot(mergedScenario.result!)).toEqual(resultSnapshot(baselineScenario.result!));
  });

  it("keeps the measured TUAS open-box reinforced ceiling row exact when four 15 mm gypsum boards are merged into one row", () => {
    const baselineScenario = evaluateFloorScenario({
      id: "open-box-reinforced-ceiling-baseline",
      rows: OPEN_BOX_B_REINFORCED_CEILING_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const mergedScenario = evaluateFloorScenario({
      id: "open-box-reinforced-ceiling-merged-board",
      rows: OPEN_BOX_B_REINFORCED_CEILING_MERGED_BOARD_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(baselineScenario.result).not.toBeNull();
    expect(mergedScenario.result).not.toBeNull();
    expect(resultSnapshot(mergedScenario.result!)).toEqual(resultSnapshot(baselineScenario.result!));
  });

  it("keeps the TUAS open-box EPS board branch stable when the upper EPS board is entered as contiguous split rows", () => {
    const baselineScenario = evaluateFloorScenario({
      id: "open-box-a-eps-screed-baseline",
      rows: OPEN_BOX_A_EPS_SCREED_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const splitScenario = evaluateFloorScenario({
      id: "open-box-a-eps-screed-split-upper",
      rows: OPEN_BOX_A_EPS_SCREED_SPLIT_UPPER_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(baselineScenario.result).not.toBeNull();
    expect(splitScenario.result).not.toBeNull();
    expect(resultSnapshot(splitScenario.result!)).toEqual(resultSnapshot(baselineScenario.result!));
  });

  it("carries the measured TUAS open-box dry-floor row into standardized field outputs on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-dry-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: OPEN_BOX_DRY_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(scenario.result?.impact?.LPrimeNW).toBe(46);
    expect(scenario.result?.impact?.LPrimeNTw).toBe(44);
    expect(scenario.result?.impact?.LPrimeNT50).toBe(47);
  });

  it("carries the exact Dataholz bonded-fill timber frame row into standardized field outputs on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "dataholz-timber-frame-bonded-fill-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: DATAHOLZ_TIMBER_FRAME_BONDED_FILL_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("dataholz_gdrnxa11a_timber_frame_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(scenario.result?.impact?.CI50_2500).toBe(14);
    expect(scenario.result?.impact?.LPrimeNW).toBe(44);
    expect(scenario.result?.impact?.LPrimeNTw).toBe(42);
    expect(scenario.result?.impact?.LPrimeNT50).toBe(56);
  });

  it("keeps the curated Dataholz elastic-fill timber frame row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "dataholz-timber-frame-elastic-fill-exact",
      rows: DATAHOLZ_TIMBER_FRAME_ELASTIC_FILL_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("dataholz_gdrnxa03b_timber_frame_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(47);
    expect(scenario.result?.impact?.CI).toBe(0);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(47);
    expect(scenario.result?.impact?.CI50_2500).toBeUndefined();
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(74);
    expect(scenario.result?.floorSystemRatings?.RwCtr).toBe(-12);
  });

  it("carries the exact Dataholz elastic-fill timber frame row into local-guide field outputs on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "dataholz-timber-frame-elastic-fill-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: DATAHOLZ_TIMBER_FRAME_ELASTIC_FILL_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("dataholz_gdrnxa03b_timber_frame_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(scenario.result?.impact?.LPrimeNW).toBe(49);
    expect(scenario.result?.impact?.LPrimeNTw).toBe(47);
    expect(scenario.result?.impact?.LPrimeNT50).toBe(47);
  });

  it("withholds the open-box dry-floor archetype lane when upper fill is split across disjoint rows", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-dry-disjoint-upper-fill",
      rows: OPEN_BOX_DRY_SPLIT_UPPER_FILL_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(scenario.result?.floorSystemEstimate?.fitPercent).toBe(54);
    expect(
      scenario.warnings.some((warning) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: upper fill x2 \(Generic Fill\)/i.test(
          warning
        )
      )
    ).toBe(true);
  });

  it("keeps the open-box dry-floor exact row stable when the resilient layer is split contiguously", () => {
    const baselineScenario = evaluateFloorScenario({
      id: "open-box-dry-baseline",
      rows: OPEN_BOX_DRY_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const splitScenario = evaluateFloorScenario({
      id: "open-box-dry-contiguous-resilient-split",
      rows: OPEN_BOX_DRY_CONTIGUOUS_RESILIENT_SPLIT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(baselineScenario.result).not.toBeNull();
    expect(splitScenario.result).not.toBeNull();
    expect(resultSnapshot(splitScenario.result!)).toEqual(resultSnapshot(baselineScenario.result!));
  });

  it("keeps the open-box dry-floor exact row pinned through the 372 mm tolerance edge", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-dry-372-still-exact",
      rows: OPEN_BOX_DRY_EXACT_ROWS.map((row) =>
        row.floorRole === "base_structure" ? { ...row, thicknessMm: "372" } : row
      ),
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(scenario.result?.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(44);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(75);
  });

  it("drops the open-box dry-floor row onto the published family lane once the slab depth reaches 375 mm", () => {
    const scenario = evaluateFloorScenario({
      id: "open-box-dry-375-fallback",
      rows: OPEN_BOX_DRY_EXACT_ROWS.map((row) =>
        row.floorRole === "base_structure" ? { ...row, thicknessMm: "375" } : row
      ),
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(scenario.result?.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(scenario.result?.impact?.LnW).toBe(44);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(75);
    expect(scenario.warnings).toContain(
      "Layer 9 thickness 375 mm is outside the guided sanity band of 120 to 350 mm for Open-box Timber Slab in the base structure role. Check units, role assignment, or split the build-up into separate layers if needed."
    );
  });

  it("keeps near-match timber-frame dry stacks on the family-archetype lane on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "timber-frame-dry-family",
      rows: TIMBER_FRAME_DRY_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(scenario.result?.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(scenario.result?.impact?.LnW).toBe(57.9);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(62.5);
    expect(
      scenario.warnings.some((warning) => /published family estimate active: timber frame \/ joist family archetype/i.test(warning))
    ).toBe(true);
  });

  it("carries timber-frame dry family estimates into local-guide field outputs on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "timber-frame-dry-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: TIMBER_FRAME_DRY_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(scenario.result?.impact?.basis).toBe("mixed_predicted_plus_estimated_local_guide");
    expect(scenario.result?.impact?.LnW).toBe(57.9);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(59.9);
    expect(scenario.result?.impact?.LPrimeNW).toBe(59.9);
    expect(scenario.result?.impact?.LPrimeNTw).toBe(57.9);
    expect(scenario.result?.impact?.LPrimeNT50).toBe(59.9);
  });

  it("keeps the curated UBIQ open-web steel 300 row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-exact",
      rows: UBIQ_STEEL_300_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(51);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(49);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(64);
  });

  it("keeps the curated UBIQ FL-23 direct open-web steel 300 row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-fl23-steel-300-exact",
      rows: UBIQ_FL23_STEEL_300_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(71);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(70);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(51);
  });

  it("keeps the curated UBIQ FL-23 direct open-web steel 300 16 mm row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-fl23-steel-300-16mm-exact",
      rows: UBIQ_FL23_STEEL_300_16MM_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl23_open_web_steel_300_16mm_timber_underlay_exact_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(71);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(70);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(50);
  });

  it("keeps the curated UBIQ FL-24 resilient open-web steel 300 row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-fl24-resilient-steel-300-exact",
      rows: UBIQ_FL24_STEEL_300_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl24_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(54);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(52);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(61);
  });

  it("keeps the curated UBIQ FL-24 resilient open-web steel 300 16 mm row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-fl24-resilient-steel-300-16mm-exact",
      rows: UBIQ_FL24_STEEL_300_16MM_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl24_open_web_steel_300_16mm_exact_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(54);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(52);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(60);
  });

  it("keeps the curated UBIQ FL-26 open-web steel 300 row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-fl26-steel-300-exact",
      rows: UBIQ_FL26_STEEL_300_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl26_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(53);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(51);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(62);
  });

  it("keeps the curated UBIQ FL-26 open-web steel 300 16 mm row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-fl26-steel-300-16mm-exact",
      rows: UBIQ_FL26_STEEL_300_16MM_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(53);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(51);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(61);
  });

  it("keeps the curated UBIQ open-web steel 300 16 mm row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-16mm-exact",
      rows: UBIQ_STEEL_300_16MM_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_16mm_exact_lab_2026");
    expect(scenario.result?.impact?.LnW).toBe(51);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(49);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(63);
  });

  it("keeps the official UBIQ FL-28 bare INEX supported-band row exact on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-fl28-steel-400-bare-exact",
      rows: UBIQ_FL28_STEEL_400_BARE_EXACT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_400_19mm_bare_exact_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("official_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(58);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(56);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(64);
  });

  it("routes the UBIQ supported-band carpet lane to explicit Ln,w+CI bound support on the web route", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-fl28-steel-300-carpet-source-gap",
      rows: UBIQ_FL28_STEEL_300_CARPET_ROWS,
      targetOutputs: LAB_OUTPUTS
    });
    const lnWCard = buildOutputCard({
      output: "Ln,w",
      result: scenario.result ?? null,
      studyMode: "floor"
    });
    const lnWPlusCiCard = buildOutputCard({
      output: "Ln,w+CI",
      result: scenario.result ?? null,
      studyMode: "floor"
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.boundFloorSystemMatch?.system.id).toBe(
      "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026"
    );
    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.lowerBoundImpact?.basis).toBe("official_floor_system_bound_support");
    expect(scenario.result?.lowerBoundImpact?.LnWPlusCIUpperBound).toBe(45);
    expect(scenario.result?.lowerBoundImpact?.LnWUpperBound).toBeUndefined();
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(lnWCard.status).toBe("unsupported");
    expect(lnWPlusCiCard.status).toBe("bound");
    expect(lnWPlusCiCard.value).toBe("<= 45 dB");
  });

  it("carries the curated UBIQ open-web steel 300 row into local-guide field outputs on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-field",
      impactFieldContext: {
        guideMassRatio: 3.4,
        receivingRoomVolumeM3: 32
      },
      rows: UBIQ_STEEL_300_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(scenario.result?.impact?.LnW).toBe(51);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(49);
    expect(scenario.result?.impact?.LPrimeNW).toBe(55);
    expect(scenario.result?.impact?.LPrimeNT50).toBe(53);
  });

  it("keeps the UBIQ open-web steel local-guide result stable on the exact r=3 and V=30 brackets", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-guide-r3-v30",
      impactFieldContext: {
        guideMassRatio: 3,
        receivingRoomVolumeM3: 30
      },
      rows: UBIQ_STEEL_300_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(scenario.result?.impact?.guideEstimateKCorrectionDb).toBe(3);
    expect(scenario.result?.impact?.guideEstimateHdCorrectionDb).toBe(0);
    expect(scenario.result?.impact?.guideEstimateMassRatioBracket).toBe("2 < r <= 3");
    expect(scenario.result?.impact?.guideEstimateReceivingRoomVolumeBracket).toBe("30 <= V < 50");
    expect(scenario.result?.impact?.LPrimeNT50).toBe(52);
  });

  it("keeps the UBIQ open-web steel local-guide result stable just below the r=3 and V=30 crossover", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-guide-r299-v299",
      impactFieldContext: {
        guideMassRatio: 2.99,
        receivingRoomVolumeM3: 29.9
      },
      rows: UBIQ_STEEL_300_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(scenario.result?.impact?.guideEstimateKCorrectionDb).toBe(3);
    expect(scenario.result?.impact?.guideEstimateHdCorrectionDb).toBe(3);
    expect(scenario.result?.impact?.guideEstimateMassRatioBracket).toBe("2 < r <= 3");
    expect(scenario.result?.impact?.guideEstimateReceivingRoomVolumeBracket).toBe("15 <= V < 30");
    expect(scenario.result?.impact?.LPrimeNT50).toBe(55);
  });

  it("keeps the UBIQ open-web steel local-guide result stable on the exact r=5 and V=50 brackets", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-guide-r5-v50",
      impactFieldContext: {
        guideMassRatio: 5,
        receivingRoomVolumeM3: 50
      },
      rows: UBIQ_STEEL_300_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(scenario.result?.impact?.guideEstimateKCorrectionDb).toBe(4);
    expect(scenario.result?.impact?.guideEstimateHdCorrectionDb).toBe(-2);
    expect(scenario.result?.impact?.guideEstimateMassRatioBracket).toBe("3 < r <= 5");
    expect(scenario.result?.impact?.guideEstimateReceivingRoomVolumeBracket).toBe("50 <= V < 100");
    expect(scenario.result?.impact?.LPrimeNT50).toBe(51);
  });

  it("keeps the UBIQ open-web steel local-guide result stable just above the r=5 and V=50 crossover", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-guide-r501-v501",
      impactFieldContext: {
        guideMassRatio: 5.01,
        receivingRoomVolumeM3: 50.1
      },
      rows: UBIQ_STEEL_300_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(scenario.result?.impact?.guideEstimateKCorrectionDb).toBe(5);
    expect(scenario.result?.impact?.guideEstimateHdCorrectionDb).toBe(-2);
    expect(scenario.result?.impact?.guideEstimateMassRatioBracket).toBe("5 < r <= 7");
    expect(scenario.result?.impact?.guideEstimateReceivingRoomVolumeBracket).toBe("50 <= V < 100");
    expect(scenario.result?.impact?.LPrimeNT50).toBe(52);
  });

  it("keeps the UBIQ open-web steel local-guide result stable on the exact r=7 and V=100 brackets", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-guide-r7-v100",
      impactFieldContext: {
        guideMassRatio: 7,
        receivingRoomVolumeM3: 100
      },
      rows: UBIQ_STEEL_300_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(scenario.result?.impact?.guideEstimateKCorrectionDb).toBe(5);
    expect(scenario.result?.impact?.guideEstimateHdCorrectionDb).toBe(-5);
    expect(scenario.result?.impact?.guideEstimateMassRatioBracket).toBe("5 < r <= 7");
    expect(scenario.result?.impact?.guideEstimateReceivingRoomVolumeBracket).toBe("100 <= V < 200");
    expect(scenario.result?.impact?.LPrimeNT50).toBe(49);
  });

  it("keeps the UBIQ open-web steel local-guide result stable just above the r=7 and V=100 crossover", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-guide-r701-v1001",
      impactFieldContext: {
        guideMassRatio: 7.01,
        receivingRoomVolumeM3: 100.1
      },
      rows: UBIQ_STEEL_300_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(scenario.result?.impact?.guideEstimateKCorrectionDb).toBe(6);
    expect(scenario.result?.impact?.guideEstimateHdCorrectionDb).toBe(-5);
    expect(scenario.result?.impact?.guideEstimateMassRatioBracket).toBe("r > 7");
    expect(scenario.result?.impact?.guideEstimateReceivingRoomVolumeBracket).toBe("100 <= V < 200");
    expect(scenario.result?.impact?.LPrimeNT50).toBe(50);
  });

  it("keeps the UBIQ open-web steel local-guide result stable just below the V=15 and r=2 crossover", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-guide-r199-v149",
      impactFieldContext: {
        guideMassRatio: 1.99,
        receivingRoomVolumeM3: 14.9
      },
      rows: UBIQ_STEEL_300_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(scenario.result?.impact?.guideEstimateKCorrectionDb).toBe(2);
    expect(scenario.result?.impact?.guideEstimateHdCorrectionDb).toBe(5);
    expect(scenario.result?.impact?.guideEstimateMassRatioBracket).toBe("1 < r <= 2");
    expect(scenario.result?.impact?.guideEstimateReceivingRoomVolumeBracket).toBe("10 <= V < 15");
    expect(scenario.result?.impact?.LPrimeNT50).toBe(56);
  });

  it("keeps the UBIQ open-web steel local-guide result stable on the exact V=15 and r=2 brackets", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-guide-r2-v15",
      impactFieldContext: {
        guideMassRatio: 2,
        receivingRoomVolumeM3: 15
      },
      rows: UBIQ_STEEL_300_EXACT_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(scenario.result?.impact?.guideEstimateKCorrectionDb).toBe(2);
    expect(scenario.result?.impact?.guideEstimateHdCorrectionDb).toBe(3);
    expect(scenario.result?.impact?.guideEstimateMassRatioBracket).toBe("1 < r <= 2");
    expect(scenario.result?.impact?.guideEstimateReceivingRoomVolumeBracket).toBe("15 <= V < 30");
    expect(scenario.result?.impact?.LPrimeNT50).toBe(54);
  });

  it("keeps the UBIQ open-web steel exact row pinned even when the slab depth is entered as 301 mm", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-301-still-exact",
      rows: UBIQ_STEEL_300_EXACT_ROWS.map((row) =>
        row.floorRole === "base_structure" ? { ...row, thicknessMm: "301" } : row
      ),
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("official_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(51);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(64);
  });

  it("keeps the UBIQ open-web steel exact row pinned through the 302 mm tolerance edge", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-302-still-exact",
      rows: UBIQ_STEEL_300_EXACT_ROWS.map((row) =>
        row.floorRole === "base_structure" ? { ...row, thicknessMm: "302" } : row
      ),
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(scenario.result?.impact?.basis).toBe("official_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(51);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(64);
  });

  it("drops the UBIQ open-web steel row onto the published lightweight-steel family lane once the slab depth reaches 305 mm", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-305-fallback",
      rows: UBIQ_STEEL_300_EXACT_ROWS.map((row) =>
        row.floorRole === "base_structure" ? { ...row, thicknessMm: "305" } : row
      ),
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(scenario.result?.impact?.basis).toBe("predictor_lightweight_steel_fl28_interpolation_estimate");
    expect(scenario.result?.impact?.LnW).toBe(51);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(64);
    expect(scenario.warnings).toContain("Screening estimate only. This result is coming from the local calibrated seed lane.");
  });

  it("keeps the curated UBIQ open-web steel bound-only row on the bound-support lane", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-bound",
      rows: UBIQ_STEEL_300_BOUND_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.boundFloorSystemMatch?.system.id).toBe("ubiq_fl33_open_web_steel_300_lab_2026");
    expect(scenario.result?.lowerBoundImpact?.basis).toBe("official_floor_system_bound_support");
    expect(scenario.result?.lowerBoundImpact?.LnWUpperBound).toBe(51);
    expect(scenario.result?.boundFloorSystemMatch?.system.airborneRatings.Rw).toBe(63);
  });

  it("keeps the curated UBIQ open-web steel 400 bound-only sibling on the bound-support lane", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-400-bound",
      rows: UBIQ_STEEL_400_BOUND_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.boundFloorSystemMatch?.system.id).toBe("ubiq_fl33_open_web_steel_400_lab_2026");
    expect(scenario.result?.lowerBoundImpact?.basis).toBe("official_floor_system_bound_support");
    expect(scenario.result?.lowerBoundImpact?.LnWUpperBound).toBe(51);
    expect(scenario.result?.boundFloorSystemMatch?.system.airborneRatings.Rw).toBe(63);
  });

  it("carries bound-only UBIQ open-web steel rows into conservative field-side upper bounds on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "ubiq-steel-300-bound-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: UBIQ_STEEL_300_BOUND_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.lowerBoundImpact?.basis).toBe("mixed_bound_plus_estimated_standardized_field_volume_normalization");
    expect(scenario.result?.lowerBoundImpact?.LnWUpperBound).toBe(51);
    expect(scenario.result?.lowerBoundImpact?.LPrimeNWUpperBound).toBe(53);
    expect(scenario.result?.lowerBoundImpact?.LPrimeNTwUpperBound).toBe(51);
  });

  it("keeps steel-joist bound interpolation visible on the web scenario route instead of fabricating an exact Ln,w", () => {
    const scenario = evaluateFloorScenario({
      id: "steel-joist-250-bound",
      rows: STEEL_JOIST_250_BOUND_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.boundFloorSystemMatch).toBeNull();
    expect(scenario.result?.boundFloorSystemEstimate?.kind).toBe("bound_interpolation");
    expect(scenario.result?.lowerBoundImpact?.basis).toBe("predictor_lightweight_steel_bound_interpolation_estimate");
    expect(scenario.result?.lowerBoundImpact?.LnWUpperBound).toBe(52);
    expect(scenario.result?.boundFloorSystemEstimate?.airborneRatings.Rw).toBe(62);
    expect(scenario.result?.boundFloorSystemEstimate?.airborneRatings.RwCtr).toBe(57);
  });

  it("keeps support-form ambiguity on the conservative lightweight-steel crossover bound lane", () => {
    const scenario = evaluateFloorScenario({
      id: "lightweight-steel-300-ambiguous-bound",
      rows: LIGHTWEIGHT_STEEL_300_AMBIGUOUS_BOUND_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.boundFloorSystemMatch).toBeNull();
    expect(scenario.result?.boundFloorSystemEstimate?.kind).toBe("missing_support_form_bound");
    expect(scenario.result?.lowerBoundImpact?.basis).toBe("predictor_lightweight_steel_missing_support_form_bound_estimate");
    expect(scenario.result?.lowerBoundImpact?.LnWUpperBound).toBe(51);
    expect(
      scenario.warnings.some((warning) => /published bound-only family estimate active/i.test(warning))
    ).toBe(true);
  });

  it("collapses lightweight-steel support-form ambiguity when both bound families converge at 200 mm", () => {
    const scenario = evaluateFloorScenario({
      id: "lightweight-steel-200-converged-bound",
      rows: LIGHTWEIGHT_STEEL_200_CONVERGED_BOUND_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.boundFloorSystemMatch).toBeNull();
    expect(scenario.result?.boundFloorSystemEstimate?.kind).toBe("bound_interpolation");
    expect(scenario.result?.lowerBoundImpact?.basis).toBe("predictor_lightweight_steel_bound_interpolation_estimate");
    expect(scenario.result?.lowerBoundImpact?.LnWUpperBound).toBe(53);
    expect(scenario.result?.boundFloorSystemEstimate?.airborneRatings.Rw).toBe(62);
    expect(scenario.result?.boundFloorSystemEstimate?.airborneRatings.RwCtr).toBe(56);
  });

  it("withholds steel-joist bound interpolation when duplicate single-entry roles make the visible stack ambiguous", () => {
    const scenario = evaluateFloorScenario({
      id: "steel-joist-250-bound-duplicate",
      rows: STEEL_JOIST_250_BOUND_DUPLICATE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.boundFloorSystemMatch).toBeNull();
    expect(scenario.result?.boundFloorSystemEstimate).toBeNull();
    expect(scenario.result?.lowerBoundImpact).toBeNull();
    expect(
      scenario.warnings.some((warning) =>
        /single-entry floor roles are duplicated: floor covering x2 \(Engineered Timber \+ Acoustic Underlay\)/i.test(
          warning
        )
      )
    ).toBe(true);
  });

  it("keeps generic joist-tagged timber ceramic stacks on the low-confidence lane on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "timber-ceramic-low-confidence",
      rows: TIMBER_CERAMIC_LOW_CONFIDENCE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(scenario.result?.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(scenario.result?.impact?.LnW).toBe(69.9);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(51.8);
    expect(scenario.result?.floorSystemRatings?.RwCtr).toBe(45.1);
  });

  it("carries composite ceiling-only low-confidence rows into standardized field outputs on the web scenario route", () => {
    const scenario = evaluateFloorScenario({
      id: "composite-low-confidence-field",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rows: COMPOSITE_LOW_CONFIDENCE_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(scenario.result?.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(scenario.result?.impact?.LnW).toBe(63.3);
    expect(scenario.result?.impact?.LPrimeNW).toBe(65.3);
    expect(scenario.result?.impact?.LPrimeNTw).toBe(63.3);
    expect(scenario.result?.impact?.LPrimeNT50).toBeUndefined();
  });
});

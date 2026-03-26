import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import type { LayerDraft } from "./workbench-store";

type SupportedLabOutput = "DeltaLw" | "Ln,w" | "Rw";

type NumericRange = {
  max: number;
  min: number;
};

type LabExpectation = {
  basis: string;
  deltaLw?: NumericRange;
  floorSystemMatchId?: string;
  lnw: NumericRange;
  rw: NumericRange;
  supportedTargetOutputs: readonly SupportedLabOutput[];
};

type BaselineCase = {
  allowedGuidedSanityWarningSubstrings?: readonly string[];
  expectedLab: LabExpectation;
  expectedFieldBasis?: string;
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
  source: string;
};

type CommonFloorCase = {
  allowedGuidedSanityWarningSubstrings?: readonly string[];
  compareToBaselineId?: BaselineCase["id"];
  expectedLab: LabExpectation;
  expectedFieldBasis?: string;
  id: string;
  maxDeviationFromBaselineDb?: number;
  minImprovementVsBaselineDb?: number;
  rows: readonly Omit<LayerDraft, "id">[];
  source: string;
};

const INSUL_SEMINAR_URL = "https://www.insul.co.nz/media/29394/Seminar-3.pdf";
const DATAHOLZ_DRY_CLT_URL = "https://www.dataholz.eu/en/index/download/en/gdmtxn01-0.pdf";
const DATAHOLZ_WET_CLT_URL = "https://www.dataholz.eu/en/index/download/en/gdmnxn06-0.pdf";
const KNAUF_AU_URL = "https://www.marketing.knaufapac.com/AU-Web-Forms_01b-Digital-Download-Request.html";
const PLITEQ_HOLLOW_CORE_URL = "https://pliteq.com.au/wp-content/uploads/sites/7/AUS-GenieClip-Brochure_Digital.pdf";
const PLITEQ_STEEL_JOIST_URL =
  "https://pliteq.com.au/wp-content/uploads/sites/7/AUS-Pliteq-GenieClip-RST-Product-Spec-Guide.pdf";
const TUAS_DATASET_URL = "https://data.mendeley.com/datasets/y83p8mpryd/2";

const FLOOR_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Ln,w", "DeltaLw", "Ln,w+CI", "Rw"];
const FLOOR_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Ln,w", "L'n,w", "L'nT,w"];

const FLOOR_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const COMMON_BASELINES: readonly BaselineCase[] = [
  {
    id: "bare_concrete_150",
    source: INSUL_SEMINAR_URL,
    rows: [{ floorRole: "base_structure", materialId: "concrete", thicknessMm: "150" }],
    expectedLab: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      lnw: { min: 72, max: 77 },
      rw: { min: 57, max: 57 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "bare_concrete_180",
    source: INSUL_SEMINAR_URL,
    rows: [{ floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }],
    expectedLab: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      lnw: { min: 69, max: 74 },
      rw: { min: 58, max: 58 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "bare_concrete_200",
    source: INSUL_SEMINAR_URL,
    rows: [{ floorRole: "base_structure", materialId: "concrete", thicknessMm: "200" }],
    expectedLab: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      lnw: { min: 69, max: 72 },
      rw: { min: 59, max: 59 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "bare_hollow_core_200",
    source: PLITEQ_HOLLOW_CORE_URL,
    rows: [{ floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: "200" }],
    expectedLab: {
      basis: "predictor_floor_system_family_general_estimate",
      lnw: { min: 55, max: 60 },
      rw: { min: 55.5, max: 55.5 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "timber_direct_no_insulation_exact",
    source: KNAUF_AU_URL,
    rows: [
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: "15" },
      { floorRole: "ceiling_board", materialId: "impactstop_board", thicknessMm: "13" },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: "240" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "knauf_ct2g_timber_nil_lab_2026",
      lnw: { min: 71, max: 71 },
      rw: { min: 49, max: 49 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  }
];

const COMMON_FLOOR_CASES: readonly CommonFloorCase[] = [
  {
    id: "vinyl_direct_on_concrete",
    source: "https://acc.shawcontract.com/SiteFiles/ACC/DealerContent/PDF/ACCLVP3-1_ACC31-Product-Specifications.pdf",
    compareToBaselineId: "bare_concrete_180",
    maxDeviationFromBaselineDb: 1,
    rows: [
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: "4" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }
    ],
    expectedLab: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      lnw: { min: 70, max: 73 },
      rw: { min: 60, max: 60 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "vinyl_acoustic_underlay_on_concrete",
    source: "https://www.forbo.com/media/document/308ec089-29ec-4ec7-aadb-6e87e2bb933f",
    compareToBaselineId: "bare_concrete_180",
    minImprovementVsBaselineDb: 7,
    rows: [
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: "4" },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: "8" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }
    ],
    expectedLab: {
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      lnw: { min: 59, max: 66 },
      rw: { min: 60, max: 60 },
      deltaLw: { min: 7, max: 13 },
      supportedTargetOutputs: ["Ln,w", "DeltaLw", "Rw"]
    }
  },
  {
    id: "laminate_eps_underlay_on_concrete",
    source: "https://int.quick-step.com/en/accessories/qsudlsw7_quick-step-silent-walk-underlay",
    compareToBaselineId: "bare_concrete_180",
    minImprovementVsBaselineDb: 4,
    rows: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }
    ],
    expectedLab: {
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      lnw: { min: 62, max: 69 },
      rw: { min: 60, max: 60 },
      deltaLw: { min: 4, max: 12 },
      supportedTargetOutputs: ["Ln,w", "DeltaLw", "Rw"]
    }
  },
  {
    id: "engineered_timber_combo_underlay_on_concrete",
    source: "https://www.kahrs.com/globalassets/kahrs/consumer/documents/technical-specifications/us/sound-ratings/kahrs_soundratings_15mm_combo.pdf",
    compareToBaselineId: "bare_concrete_180",
    minImprovementVsBaselineDb: 7,
    rows: [
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: "15" },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }
    ],
    expectedLab: {
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      lnw: { min: 60, max: 66 },
      rw: { min: 60, max: 60 },
      deltaLw: { min: 7, max: 11 },
      supportedTargetOutputs: ["Ln,w", "DeltaLw", "Rw"]
    }
  },
  {
    id: "engineered_timber_direct_on_concrete",
    source:
      "https://cdn2.quick-step.com/-/media/Imported%20Assets/Flooring/0/E/1/QSInstallationInstructionParquetGLUEDuniclicENpdf33241.ashx?filename=Installation+Instructions.pdf&type=original&v=b8cb8099dfe84c98a4dedb9b2976b2bb",
    compareToBaselineId: "bare_concrete_180",
    maxDeviationFromBaselineDb: 1,
    rows: [
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: "15" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }
    ],
    expectedLab: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      lnw: { min: 70, max: 73 },
      rw: { min: 60, max: 60 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "engineered_timber_resilient_underlay_on_concrete",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/test_reports/us/regupol_sonus_core_3/E1552-01-113-11-R0.pdf",
    compareToBaselineId: "bare_concrete_180",
    minImprovementVsBaselineDb: 15,
    rows: [
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: "15" },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: "8" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }
    ],
    expectedLab: {
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      lnw: { min: 48, max: 56 },
      rw: { min: 60, max: 60 },
      deltaLw: { min: 16, max: 24 },
      supportedTargetOutputs: ["Ln,w", "DeltaLw", "Rw"]
    }
  },
  {
    id: "tile_acoustic_underlay_on_concrete",
    source: "https://www.mapei.com/us/en-us/products-and-solutions/products/detail/mapesonic-rm",
    compareToBaselineId: "bare_concrete_180",
    minImprovementVsBaselineDb: 12,
    rows: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: "8" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }
    ],
    expectedLab: {
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      lnw: { min: 54, max: 59 },
      rw: { min: 60, max: 60 },
      deltaLw: { min: 13, max: 18 },
      supportedTargetOutputs: ["Ln,w", "DeltaLw", "Rw"]
    }
  },
  {
    id: "tile_direct_on_concrete",
    source: "https://digitalassets.daltile.com/content/dam/Daltile/website/resources/xteriors/DAL_Xteriors_Floors_ModerateClimate_DirectBond_15YrWarranty.PDF",
    compareToBaselineId: "bare_concrete_180",
    maxDeviationFromBaselineDb: 1,
    rows: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }
    ],
    expectedLab: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      lnw: { min: 70, max: 73 },
      rw: { min: 60, max: 60 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "tile_screed_acoustic_underlay_on_concrete",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/test_reports/en/regupol_sonus_curve/regupol_sonus_curve_8/under_bonded_screed_and_ceramic_tiles/RG096_REGUPOL_sonus_curve_8_Tile_Screed_Acoustic_Test_Normalized_Floor_Lnw_01.pdf",
    compareToBaselineId: "bare_concrete_150",
    minImprovementVsBaselineDb: 20,
    rows: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: "30" },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: "8" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "150" }
    ],
    expectedLab: {
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      lnw: { min: 48, max: 53 },
      rw: { min: 58, max: 58 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "dataholz_dry_clt_exact",
    source: DATAHOLZ_DRY_CLT_URL,
    expectedFieldBasis: "mixed_exact_plus_estimated_local_guide",
    rows: [
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25" },
      { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: "60" },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: "30" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
      lnw: { min: 50, max: 50 },
      rw: { min: 62, max: 62 },
      supportedTargetOutputs: ["Ln,w", "Ln,w+CI", "Rw"]
    }
  },
  {
    id: "dataholz_wet_fill_clt_exact",
    source: DATAHOLZ_WET_CLT_URL,
    expectedFieldBasis: "mixed_exact_plus_estimated_local_guide",
    rows: [
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: "60" },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: "120" },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s6", thicknessMm: "40" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "160" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "dataholz_gdmnxn06_fill_clt_lab_2026",
      lnw: { min: 39, max: 39 },
      rw: { min: 78, max: 78 },
      supportedTargetOutputs: ["Ln,w", "Ln,w+CI", "Rw"]
    }
  },
  {
    id: "open_box_dry_exact",
    source: TUAS_DATASET_URL,
    allowedGuidedSanityWarningSubstrings: [
      "Layer 8 thickness 60 mm is outside the guided sanity band",
      "Layer 9 thickness 370 mm is outside the guided sanity band"
    ],
    rows: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      floorSystemMatchId: "tuas_r5b_open_box_timber_measured_2026",
      lnw: { min: 39, max: 39 },
      rw: { min: 75, max: 75 },
      supportedTargetOutputs: ["Ln,w", "Ln,w+CI", "Rw"]
    }
  },
  {
    id: "hollow_core_vinyl_rst05_exact",
    source: PLITEQ_HOLLOW_CORE_URL,
    compareToBaselineId: "bare_hollow_core_200",
    minImprovementVsBaselineDb: 8,
    rows: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "16" },
      { floorRole: "ceiling_cavity", materialId: "genieclip_rst", thicknessMm: "16" },
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: "5" },
      { floorRole: "resilient_layer", materialId: "geniemat_rst05", thicknessMm: "5" },
      { floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: "200" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "pliteq_hcp200_vinyl_lab_2026",
      lnw: { min: 48, max: 48 },
      rw: { min: 62, max: 62 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "timber_direct_fixed_exact",
    source: KNAUF_AU_URL,
    compareToBaselineId: "timber_direct_no_insulation_exact",
    minImprovementVsBaselineDb: 1,
    rows: [
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: "15" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "90" },
      { floorRole: "ceiling_board", materialId: "impactstop_board", thicknessMm: "13" },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: "240" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "knauf_ct2g_timber_r25_lab_2026",
      lnw: { min: 69, max: 69 },
      rw: { min: 54, max: 54 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "timber_suspended_exact",
    source: KNAUF_AU_URL,
    compareToBaselineId: "timber_direct_no_insulation_exact",
    minImprovementVsBaselineDb: 3,
    rows: [
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: "15" },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "28" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: "240" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "knauf_ct30_1c_timber_lab_2026",
      lnw: { min: 67, max: 67 },
      rw: { min: 60, max: 60 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "timber_acoustic_mount_exact",
    source: KNAUF_AU_URL,
    compareToBaselineId: "timber_direct_no_insulation_exact",
    minImprovementVsBaselineDb: 8,
    rows: [
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "28" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: "240" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "knauf_ct120_1c_timber_lab_2026",
      lnw: { min: 61, max: 61 },
      rw: { min: 60, max: 60 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "timber_carpet_exact",
    source: KNAUF_AU_URL,
    compareToBaselineId: "timber_direct_no_insulation_exact",
    minImprovementVsBaselineDb: 25,
    rows: [
      { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: "11" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "90" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: "240" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "knauf_ct30_2b_carpet_lab_2026",
      lnw: { min: 38, max: 38 },
      rw: { min: 55, max: 55 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "concrete_timber_acoustic_exact",
    source: KNAUF_AU_URL,
    compareToBaselineId: "bare_concrete_150",
    minImprovementVsBaselineDb: 20,
    rows: [
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "100" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "150" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
      lnw: { min: 51, max: 51 },
      rw: { min: 63, max: 63 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "concrete_carpet_exact",
    source: KNAUF_AU_URL,
    compareToBaselineId: "bare_concrete_150",
    minImprovementVsBaselineDb: 40,
    rows: [
      { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: "11" },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "100" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "150" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "knauf_cc60_1a_concrete150_carpet_lab_2026",
      lnw: { min: 31, max: 31 },
      rw: { min: 63, max: 63 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "concrete_tile_ceiling_exact",
    source: KNAUF_AU_URL,
    allowedGuidedSanityWarningSubstrings: ["Layer 2 thickness 300 mm is outside the guided sanity band"],
    compareToBaselineId: "bare_concrete_200",
    minImprovementVsBaselineDb: 20,
    rows: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "300" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "200" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026",
      lnw: { min: 45, max: 45 },
      rw: { min: 69, max: 69 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "steel_joist_vinyl_exact",
    source: PLITEQ_STEEL_JOIST_URL,
    rows: [
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: "2.5" },
      { floorRole: "resilient_layer", materialId: "geniemat_rst02", thicknessMm: "2" },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: "120" },
      { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: "100" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: "250" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
      lnw: { min: 58, max: 58 },
      rw: { min: 60, max: 60 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "steel_joist_porcelain_exact",
    source: PLITEQ_STEEL_JOIST_URL,
    rows: [
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
      { floorRole: "floor_covering", materialId: "porcelain_tile", thicknessMm: "8" },
      { floorRole: "resilient_layer", materialId: "geniemat_rst12", thicknessMm: "12" },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: "120" },
      { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: "100" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: "250" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
      lnw: { min: 60, max: 60 },
      rw: { min: 62, max: 62 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  },
  {
    id: "steel_joist_wood_exact",
    source: PLITEQ_STEEL_JOIST_URL,
    rows: [
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "15" },
      { floorRole: "resilient_layer", materialId: "geniemat_rst02", thicknessMm: "2" },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: "120" },
      { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: "100" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: "250" }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      floorSystemMatchId: "pliteq_steel_joist_250_rst02_wood_lab_2026",
      lnw: { min: 57, max: 57 },
      rw: { min: 59, max: 59 },
      supportedTargetOutputs: ["Ln,w", "Rw"]
    }
  }
] as const;

function buildRows(id: string, rows: readonly Omit<LayerDraft, "id">[]): LayerDraft[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${id}-${index + 1}`
  }));
}

function numberOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function evaluateFloorCase(
  id: string,
  rows: readonly Omit<LayerDraft, "id">[],
  targetOutputs: readonly RequestedOutputId[],
  withFieldContext = false
) {
  return evaluateScenario({
    id,
    impactFieldContext: withFieldContext ? FLOOR_FIELD_CONTEXT : undefined,
    name: id,
    rows: buildRows(id, rows),
    source: "current",
    studyMode: "floor",
    targetOutputs
  });
}

function assertNoGuidedInputSanityDrift(
  warnings: readonly string[],
  label: string,
  failures: string[],
  allowedSubstrings: readonly string[] = []
) {
  const sanityWarnings = warnings.filter((warning) => {
    if (!/outside the guided sanity band|missing a valid thickness/i.test(warning)) {
      return false;
    }

    return !allowedSubstrings.some((substring) => warning.includes(substring));
  });

  if (sanityWarnings.length > 0) {
    failures.push(`${label}: representative guided case should not trip input sanity warnings: ${sanityWarnings.join(" | ")}`);
  }
}

function assertRequestedPartition(
  supportedTargetOutputs: readonly RequestedOutputId[],
  unsupportedTargetOutputs: readonly RequestedOutputId[],
  requestedOutputs: readonly RequestedOutputId[],
  label: string,
  failures: string[]
) {
  const supported = new Set(supportedTargetOutputs);
  const unsupported = new Set(unsupportedTargetOutputs);

  for (const output of requestedOutputs) {
    if (supported.has(output) === unsupported.has(output)) {
      failures.push(
        `${label}: output ${output} should belong to exactly one support bucket, supported=${JSON.stringify(supportedTargetOutputs)} unsupported=${JSON.stringify(unsupportedTargetOutputs)}`
      );
    }
  }
}

describe("common floor combinations", () => {
  it("keeps internet-backed common-use floor cases declared with unique ids and HTTPS sources", () => {
    const ids = new Set<string>();

    for (const entry of [...COMMON_BASELINES, ...COMMON_FLOOR_CASES]) {
      expect(ids.has(entry.id)).toBe(false);
      ids.add(entry.id);
      expect(entry.source).toMatch(/^https:\/\//);
    }
  });

  it.each(COMMON_BASELINES)("keeps guided lab baseline $id inside its corridor", (entry) => {
    const scenario = evaluateFloorCase(entry.id, entry.rows, FLOOR_LAB_OUTPUTS);
    expect(scenario.result).not.toBeNull();
    const sanityFailures: string[] = [];
    assertNoGuidedInputSanityDrift(scenario.warnings, `${entry.id} lab`, sanityFailures, entry.allowedGuidedSanityWarningSubstrings);
    expect(sanityFailures).toEqual([]);

    const failures: string[] = [];
    assertRequestedPartition(
      scenario.result!.supportedTargetOutputs,
      scenario.result!.unsupportedTargetOutputs,
      FLOOR_LAB_OUTPUTS,
      `${entry.id} lab`,
      failures
    );
    expect(failures).toEqual([]);

    const lnw = numberOrNull(scenario.result!.impact?.LnW ?? scenario.result!.lowerBoundImpact?.LnWUpperBound);
    const rw = numberOrNull(scenario.result!.floorSystemRatings?.Rw);

    expect(scenario.result!.supportedTargetOutputs).toEqual(entry.expectedLab.supportedTargetOutputs);
    expect(scenario.result!.impact?.basis ?? scenario.result!.lowerBoundImpact?.basis).toBe(entry.expectedLab.basis);
    expect(lnw).not.toBeNull();
    expect(lnw!).toBeGreaterThanOrEqual(entry.expectedLab.lnw.min);
    expect(lnw!).toBeLessThanOrEqual(entry.expectedLab.lnw.max);
    expect(rw).not.toBeNull();
    expect(rw!).toBeGreaterThanOrEqual(entry.expectedLab.rw.min);
    expect(rw!).toBeLessThanOrEqual(entry.expectedLab.rw.max);
    expect(numberOrNull(scenario.result!.impact?.DeltaLw ?? scenario.result!.lowerBoundImpact?.DeltaLwLowerBound)).toBeNull();

    if (entry.expectedLab.floorSystemMatchId) {
      expect(scenario.result!.floorSystemMatch?.system.id).toBe(entry.expectedLab.floorSystemMatchId);
    }
  });

  it.each(COMMON_FLOOR_CASES)("keeps guided lab case $id on its expected lane and corridor", (entry) => {
    const scenario = evaluateFloorCase(entry.id, entry.rows, FLOOR_LAB_OUTPUTS);
    expect(scenario.result).not.toBeNull();

    const sanityFailures: string[] = [];
    assertNoGuidedInputSanityDrift(scenario.warnings, `${entry.id} lab`, sanityFailures, entry.allowedGuidedSanityWarningSubstrings);
    expect(sanityFailures).toEqual([]);

    const partitionFailures: string[] = [];
    assertRequestedPartition(
      scenario.result!.supportedTargetOutputs,
      scenario.result!.unsupportedTargetOutputs,
      FLOOR_LAB_OUTPUTS,
      `${entry.id} lab`,
      partitionFailures
    );
    expect(partitionFailures).toEqual([]);

    const lnw = numberOrNull(scenario.result!.impact?.LnW ?? scenario.result!.lowerBoundImpact?.LnWUpperBound);
    const deltaLw = numberOrNull(scenario.result!.impact?.DeltaLw ?? scenario.result!.lowerBoundImpact?.DeltaLwLowerBound);
    const rw = numberOrNull(scenario.result!.floorSystemRatings?.Rw);

    expect(scenario.result!.supportedTargetOutputs).toEqual(entry.expectedLab.supportedTargetOutputs);
    expect(scenario.result!.impact?.basis ?? scenario.result!.lowerBoundImpact?.basis).toBe(entry.expectedLab.basis);
    expect(lnw).not.toBeNull();
    expect(lnw!).toBeGreaterThanOrEqual(entry.expectedLab.lnw.min);
    expect(lnw!).toBeLessThanOrEqual(entry.expectedLab.lnw.max);
    expect(rw).not.toBeNull();
    expect(rw!).toBeGreaterThanOrEqual(entry.expectedLab.rw.min);
    expect(rw!).toBeLessThanOrEqual(entry.expectedLab.rw.max);

    if (entry.expectedLab.deltaLw) {
      expect(deltaLw).not.toBeNull();
      expect(deltaLw!).toBeGreaterThanOrEqual(entry.expectedLab.deltaLw.min);
      expect(deltaLw!).toBeLessThanOrEqual(entry.expectedLab.deltaLw.max);
    } else {
      expect(deltaLw).toBeNull();
    }

    if (entry.expectedLab.floorSystemMatchId) {
      expect(scenario.result!.floorSystemMatch?.system.id).toBe(entry.expectedLab.floorSystemMatchId);
    }
  });

  it.each([...COMMON_BASELINES, ...COMMON_FLOOR_CASES])("keeps guided field continuation sane for $id", (entry) => {
    const scenario = evaluateFloorCase(entry.id, entry.rows, FLOOR_FIELD_OUTPUTS, true);
    expect(scenario.result).not.toBeNull();

    const sanityFailures: string[] = [];
    assertNoGuidedInputSanityDrift(scenario.warnings, `${entry.id} field`, sanityFailures, entry.allowedGuidedSanityWarningSubstrings);
    expect(sanityFailures).toEqual([]);

    const partitionFailures: string[] = [];
    assertRequestedPartition(
      scenario.result!.supportedTargetOutputs,
      scenario.result!.unsupportedTargetOutputs,
      FLOOR_FIELD_OUTPUTS,
      `${entry.id} field`,
      partitionFailures
    );
    expect(partitionFailures).toEqual([]);

    const lnw = numberOrNull(scenario.result!.impact?.LnW ?? scenario.result!.lowerBoundImpact?.LnWUpperBound);
    const lPrimeNW = numberOrNull(scenario.result!.impact?.LPrimeNW ?? scenario.result!.lowerBoundImpact?.LPrimeNWUpperBound);
    const lPrimeNTw = numberOrNull(scenario.result!.impact?.LPrimeNTw ?? scenario.result!.lowerBoundImpact?.LPrimeNTwUpperBound);

    expect(scenario.result!.supportedTargetOutputs).toEqual(FLOOR_FIELD_OUTPUTS);
    const expectedBasis =
      entry.expectedFieldBasis ??
      (entry.expectedLab.floorSystemMatchId
        ? "mixed_exact_plus_estimated_standardized_field_volume_normalization"
        : "mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(scenario.result!.impact?.basis ?? scenario.result!.lowerBoundImpact?.basis).toBe(expectedBasis);
    expect(typeof lnw).toBe("number");
    expect(typeof lPrimeNW).toBe("number");
    expect(typeof lPrimeNTw).toBe("number");
    expect(Math.abs(lPrimeNW! - (lnw! + FLOOR_FIELD_CONTEXT.fieldKDb))).toBeLessThanOrEqual(0.2);
    expect(lPrimeNTw!).toBeLessThanOrEqual(lPrimeNW! + 0.2);
  });

  const baselineById = new Map(
    COMMON_BASELINES.map((entry) => {
      const scenario = evaluateFloorCase(entry.id, entry.rows, FLOOR_LAB_OUTPUTS);
      return [entry.id, numberOrNull(scenario.result?.impact?.LnW ?? scenario.result?.lowerBoundImpact?.LnWUpperBound)];
    })
  );

  it.each(
    COMMON_FLOOR_CASES.filter(
      (entry): entry is CommonFloorCase & { compareToBaselineId: BaselineCase["id"]; maxDeviationFromBaselineDb: number } =>
        typeof entry.maxDeviationFromBaselineDb === "number" && typeof entry.compareToBaselineId === "string"
    )
  )("keeps guided direct/bare-like case $id close to baseline", (entry) => {
    const baselineLnw = baselineById.get(entry.compareToBaselineId);
    const scenario = evaluateFloorCase(entry.id, entry.rows, FLOOR_LAB_OUTPUTS);
    const lnw = numberOrNull(scenario.result?.impact?.LnW ?? scenario.result?.lowerBoundImpact?.LnWUpperBound);

    expect(baselineLnw).not.toBeNull();
    expect(lnw).not.toBeNull();
    expect(Math.abs(baselineLnw! - lnw!)).toBeLessThanOrEqual(entry.maxDeviationFromBaselineDb);
  });

  it.each(
    COMMON_FLOOR_CASES.filter(
      (entry): entry is CommonFloorCase & { compareToBaselineId: BaselineCase["id"]; minImprovementVsBaselineDb: number } =>
        typeof entry.minImprovementVsBaselineDb === "number" && typeof entry.compareToBaselineId === "string"
    )
  )("keeps guided resilient/exact case $id better than baseline", (entry) => {
    const baselineLnw = baselineById.get(entry.compareToBaselineId);
    const scenario = evaluateFloorCase(entry.id, entry.rows, FLOOR_LAB_OUTPUTS);
    const lnw = numberOrNull(scenario.result?.impact?.LnW ?? scenario.result?.lowerBoundImpact?.LnWUpperBound);

    expect(baselineLnw).not.toBeNull();
    expect(lnw).not.toBeNull();
    expect(baselineLnw! - lnw!).toBeGreaterThanOrEqual(entry.minImprovementVsBaselineDb);
  });
});

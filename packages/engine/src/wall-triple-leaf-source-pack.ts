export type WallTripleLeafSourcePackPriority = "P0" | "P1" | "P2";

export type WallTripleLeafSourcePackClassification =
  | "graph_digitization_candidate"
  | "baseline_corpus_and_negative_boundary_candidate"
  | "qualitative_only"
  | "solver_model_only"
  | "adjacent_negative_boundary";

export type WallTripleLeafBandDataStatus =
  | "numeric_one_third_octave_rows_extracted"
  | "plotted_curve_requires_digitization"
  | "abstract_or_metadata_only"
  | "model_equations_only"
  | "guidance_figures_only";

export type WallTripleLeafMetricOwner =
  | "lab_stc_with_plotted_transmission_loss"
  | "lab_stc_with_numeric_one_third_octave_transmission_loss"
  | "weighted_sound_reduction_index_abstract_only"
  | "solver_model_no_measured_metric"
  | "stc_guidance_and_resonance_context_only";

export type WallTripleLeafTopologyExtraction = {
  cavity1: string;
  cavity2: string;
  internalLeaf: string;
  internalLeafCoupling: string;
  localMaterialMappingStatus: string;
  sideALeaf: string;
  sideBLeaf: string;
  supportTopology: string;
};

export type WallTripleLeafRepresentativeBandRow = {
  bandGridHz: readonly number[];
  locator: string;
  stc: number;
  testId: string;
  tlDb: readonly number[];
};

export type WallTripleLeafSourcePackCandidate = {
  availableBandGridHz: readonly number[];
  bandDataStatus: WallTripleLeafBandDataStatus;
  classification: WallTripleLeafSourcePackClassification;
  directPdfStatus:
    | "download_available_text_extractable"
    | "downloaded_text_extracted_in_research_iteration"
    | "publisher_page_only"
    | "source_pdf_available_model_only"
    | "download_available_guidance_only";
  directRuntimeReadyNow: false;
  firstMissingBlocker: string;
  hasNumericBandCurve: boolean;
  id: string;
  locator: string;
  metricOwner: WallTripleLeafMetricOwner;
  pairedEngineTestsBeforeRuntime: readonly string[];
  pairedWebTestsBeforeVisibleMovement: readonly string[];
  priority: WallTripleLeafSourcePackPriority;
  protectedBoundary: string;
  publicationIdentity: string;
  reportedMetrics: readonly string[];
  representativeBandRows?: readonly WallTripleLeafRepresentativeBandRow[];
  retrievalDate: "2026-04-30";
  sourceLabel: string;
  sourceUrl: string;
  topology: WallTripleLeafTopologyExtraction;
};

export const WALL_TRIPLE_LEAF_BAND_GRID_50_TO_6300_HZ = [
  50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300
] as const;

export const WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ = [
  50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000
] as const;

const EMPTY_TRIPLE_LEAF_TOPOLOGY: WallTripleLeafTopologyExtraction = {
  cavity1: "not_a_triple_leaf_source_row",
  cavity2: "not_a_triple_leaf_source_row",
  internalLeaf: "none",
  internalLeafCoupling: "not_applicable",
  localMaterialMappingStatus: "not_applicable_until_classifier_gate",
  sideALeaf: "not_a_triple_leaf_source_row",
  sideBLeaf: "not_a_triple_leaf_source_row",
  supportTopology: "not_a_triple_leaf_source_row"
};

// Gate D is deliberately corpus-only. These rows are source extraction
// targets and boundaries; none is allowed to change live calculator
// support, confidence, or numeric output before later calibration gates.
export const WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES: readonly WallTripleLeafSourcePackCandidate[] = [
  {
    availableBandGridHz: WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ,
    bandDataStatus: "plotted_curve_requires_digitization",
    classification: "graph_digitization_candidate",
    directPdfStatus: "download_available_text_extractable",
    directRuntimeReadyNow: false,
    firstMissingBlocker:
      "published_transmission_loss_curves_are_plotted_not_tabular_and_internal_leaf_coupling_needs_local_mapping",
    hasNumericBandCurve: false,
    id: "nrc_2024_internal_gypsum_double_stud",
    locator: "Table 1 assemblies A-D, Figure 4/5 transmission-loss plots, Table 2 resonance estimates",
    metricOwner: "lab_stc_with_plotted_transmission_loss",
    pairedEngineTestsBeforeRuntime: [
      "engine_nrc_2024_graph_digitized_rows_stay_calibration_only_until_holdout_passes",
      "engine_internal_gypsum_double_stud_rejects_fixed_penalty_runtime_promotion"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_triple_leaf_route_card_shows_graph_digitization_source_status",
      "web_triple_leaf_report_keeps_exact_outputs_blocked_without_numeric_curve_owner"
    ],
    priority: "P0",
    protectedBoundary:
      "nrc_2024_internal_board_stc_rows_do_not_authorize_a_fixed_7_to_17_db_penalty_or_exact_rw_for_user_stack",
    publicationIdentity:
      "Mahn, Skoda, Cunha 2024, The transmission loss of double stud walls with layers of gypsum board installed inside the wall cavity",
    reportedMetrics: [
      "Base double-stud wall STC 64",
      "Assembly A STC 64",
      "Assembly B STC 60",
      "Assembly C STC 57",
      "Assembly D STC 65",
      "mass-air-mass resonance estimates around 51-105 Hz",
      "reported low-frequency transmission-loss decrease on the order of 14-17 dB"
    ],
    retrievalDate: "2026-04-30",
    sourceLabel: "NRC 2024 internal gypsum double-stud triple-leaf paper",
    sourceUrl: "https://nrc-publications.canada.ca/eng/view/accepted/?id=768bf32f-8313-435f-ab85-8680efba61b2",
    topology: {
      cavity1:
        "92.1 mm steel-stud cavity with 92.1 mm glass-fiber insulation in most variants; Assembly C has one-side insulation",
      cavity2:
        "second 92.1 mm steel-stud cavity with glass-fiber insulation in most variants and a 25.4 mm spacing to the internal board",
      internalLeaf: "12.7 mm Type C gypsum board installed inside the cavity between stud rows",
      internalLeafCoupling:
        "source-specific internal board attachment shown by assembly drawings; local independent/bridged mapping still unresolved",
      localMaterialMappingStatus:
        "needs Type C gypsum, glass fiber batt, 18 gauge 92.1 mm steel stud, and internal-board coupling mapping",
      sideALeaf: "one or more 12.7 mm Type C gypsum board layers on outside face",
      sideBLeaf: "one or two 12.7 mm Type C gypsum board layers on outside face depending on assembly A-D",
      supportTopology: "double 18 gauge 92.1 mm steel studs at 610 mm centres"
    }
  },
  {
    availableBandGridHz: WALL_TRIPLE_LEAF_BAND_GRID_50_TO_6300_HZ,
    bandDataStatus: "numeric_one_third_octave_rows_extracted",
    classification: "baseline_corpus_and_negative_boundary_candidate",
    directPdfStatus: "downloaded_text_extracted_in_research_iteration",
    directRuntimeReadyNow: false,
    firstMissingBlocker:
      "representative_rows_are_ordinary_gypsum_board_walls_without_internal_leaf_so_they_are_baseline_or_negative_boundary_only",
    hasNumericBandCurve: true,
    id: "nrc_1998_gypsum_board_walls_tl_data",
    locator: "Appendix row blocks with TestID, STC, TL bands, material properties Tables 2-4",
    metricOwner: "lab_stc_with_numeric_one_third_octave_transmission_loss",
    pairedEngineTestsBeforeRuntime: [
      "engine_nrc_1998_rows_feed_baseline_corpus_without_triple_leaf_promotion",
      "engine_numeric_band_parser_requires_internal_leaf_before_triple_leaf_solver_calibration"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_nrc_1998_context_stays_hidden_from_exact_triple_leaf_route_until_classifier_gate",
      "web_report_does_not_show_baseline_rows_as_user_stack_evidence"
    ],
    priority: "P0",
    protectedBoundary:
      "parser_ready_ordinary_gypsum_wall_rows_must_not_be_used_as_internal_board_triple_leaf_runtime_truth",
    publicationIdentity: "Halliwell, Nightingale, Warnock, Birta 1998, Gypsum Board Walls: Transmission Loss Data",
    reportedMetrics: [
      "numeric one-third-octave TL rows from 50 Hz to 6300 Hz",
      "representative TL-93-176 STC 32",
      "representative TL-93-185 STC 45",
      "material density and airflow-resistivity tables for absorptive materials"
    ],
    representativeBandRows: [
      {
        bandGridHz: WALL_TRIPLE_LEAF_BAND_GRID_50_TO_6300_HZ,
        locator: "Page 19, G13_WS90(406)_CFL90_G13",
        stc: 32,
        testId: "TL-93-176",
        tlDb: [
          21.5, 19.5, 21.8, 16.3, 12.5, 11.4, 22.6, 32.7, 36.7, 42.0, 44.2, 48.4, 53.4, 56.1, 57.3,
          57.4, 55.4, 45.5, 43.0, 47.4, 53.0, 57.4
        ]
      },
      {
        bandGridHz: WALL_TRIPLE_LEAF_BAND_GRID_50_TO_6300_HZ,
        locator: "Page 164, G13_WS90(406)_MFB90_RC13(610)_G13",
        stc: 45,
        testId: "TL-93-185",
        tlDb: [
          18.9, 13.5, 17.7, 15.7, 20.5, 28.6, 36.4, 43.7, 48.5, 54.0, 57.2, 61.0, 64.0, 67.0, 69.4,
          70.0, 66.8, 55.4, 52.7, 56.0, 61.0, 65.1
        ]
      }
    ],
    retrievalDate: "2026-04-30",
    sourceLabel: "NRC 1998 gypsum board walls transmission-loss data",
    sourceUrl: "https://nrc-publications.canada.ca/eng/view/object/?id=04ac8069-a5d2-4038-8787-da064b073e7f",
    topology: {
      ...EMPTY_TRIPLE_LEAF_TOPOLOGY,
      localMaterialMappingStatus:
        "useful for gypsum board, stud, resilient channel, and absorptive material baseline mapping after classifier gate",
      sideALeaf: "ordinary gypsum board leaf from representative source rows",
      sideBLeaf: "ordinary gypsum board leaf from representative source rows",
      supportTopology: "wood or steel stud / resilient-channel row-specific support, not internal-board triple-leaf"
    }
  },
  {
    availableBandGridHz: [],
    bandDataStatus: "abstract_or_metadata_only",
    classification: "qualitative_only",
    directPdfStatus: "publisher_page_only",
    directRuntimeReadyNow: false,
    firstMissingBlocker:
      "full_numeric_curves_and_exact_test_specimens_are_not_in_local_corpus_so_abstract_weighted_index_delta_cannot_be_imported",
    hasNumericBandCurve: false,
    id: "uris_2006_internal_gypsum_double_frame",
    locator: "Applied Acoustics 67(9), 918-925, publisher page and abstract",
    metricOwner: "weighted_sound_reduction_index_abstract_only",
    pairedEngineTestsBeforeRuntime: [
      "engine_uris_2006_stays_qualitative_until_full_curves_are_available",
      "engine_uris_weighted_delta_does_not_become_fixed_runtime_penalty"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_uris_source_not_shown_as_exact_without_full_curve",
      "web_triple_leaf_report_keeps_abstract_only_sources_out_of_evidence_tier"
    ],
    priority: "P1",
    protectedBoundary:
      "reported_7_to_8_db_weighted_decrease_is_not_a_substitute_for_local_rw_or_band_curve_ownership",
    publicationIdentity:
      "Uris, Bravo, Gomez-Lozano, Ramirez, Llinares 2006, Sound insulation of double frame partitions with an internal gypsum board layer",
    reportedMetrics: [
      "measured sound reduction index data reported in paper",
      "weighted sound reduction index decrease reported as 7-8 dB",
      "low-frequency decrease around the resonance region described by publisher abstract"
    ],
    retrievalDate: "2026-04-30",
    sourceLabel: "Applied Acoustics 2006 internal gypsum board layer paper",
    sourceUrl: "https://www.sciencedirect.com/science/article/pii/S0003682X05001799",
    topology: {
      cavity1: "double-frame cavity split by internal gypsum board; exact dimensions must be extracted from full paper",
      cavity2: "double-frame cavity split by internal gypsum board; exact dimensions must be extracted from full paper",
      internalLeaf: "gypsum board layer inserted in the middle of a double-frame partition",
      internalLeafCoupling: "unknown until full specimen diagrams are extracted",
      localMaterialMappingStatus: "blocked until full paper rows expose board, frame, cavity, and absorber details",
      sideALeaf: "double-frame partition outside leaf, exact layer count blocked",
      sideBLeaf: "double-frame partition outside leaf, exact layer count blocked",
      supportTopology: "double frame, exact material and spacing blocked"
    }
  },
  {
    availableBandGridHz: [],
    bandDataStatus: "model_equations_only",
    classification: "solver_model_only",
    directPdfStatus: "source_pdf_available_model_only",
    directRuntimeReadyNow: false,
    firstMissingBlocker:
      "three_mass_two_spring_model_lacks_source_calibrated_damping_coupling_and_mid_high_frequency_policy",
    hasNumericBandCurve: false,
    id: "ballagh_2013_triple_panel_low_frequency_model",
    locator: "Sound Transmission through Triple Panel Walls - Low Frequency Model",
    metricOwner: "solver_model_no_measured_metric",
    pairedEngineTestsBeforeRuntime: [
      "engine_ballagh_equations_feed_gate_f_solver_skeleton_only",
      "engine_solver_model_rejects_runtime_rw_without_calibration_holdout"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_solver_model_not_displayed_as_measured_evidence",
      "web_triple_leaf_route_card_waits_for_calibrated_source_rows"
    ],
    priority: "P1",
    protectedBoundary:
      "published_solver_shape_does_not_authorize_runtime_rw_without_measured_row_calibration",
    publicationIdentity: "Ballagh 2013, Sound Transmission through Triple Panel Walls - Low Frequency Model",
    reportedMetrics: [
      "three panel masses separated by two air gaps",
      "low-frequency lumped-parameter solver shape",
      "no local measured Rw row"
    ],
    retrievalDate: "2026-04-30",
    sourceLabel: "Ballagh triple-panel low-frequency model",
    sourceUrl: "https://new.acoustics.org.nz/wp-content/uploads/Ballagh_K_NZA2013.pdf",
    topology: {
      cavity1: "model air spring 1",
      cavity2: "model air spring 2",
      internalLeaf: "model middle mass",
      internalLeafCoupling: "idealized lumped-parameter coupling",
      localMaterialMappingStatus: "not a material row; equations only",
      sideALeaf: "model source-side mass",
      sideBLeaf: "model receiving-side mass",
      supportTopology: "idealized low-frequency model, not a source construction"
    }
  },
  {
    availableBandGridHz: [],
    bandDataStatus: "guidance_figures_only",
    classification: "adjacent_negative_boundary",
    directPdfStatus: "download_available_guidance_only",
    directRuntimeReadyNow: false,
    firstMissingBlocker:
      "masonry_attached_drywall_resonance_guidance_is_not_a_steel_stud_internal_board_source_row",
    hasNumericBandCurve: false,
    id: "warnock_1998_concrete_block_attached_drywall",
    locator: "Construction Technology Update No. 13, Figures 2-3 and concrete block wall guidance",
    metricOwner: "stc_guidance_and_resonance_context_only",
    pairedEngineTestsBeforeRuntime: [
      "engine_warnock_masonry_lining_stays_adjacent_negative_boundary",
      "engine_attached_drywall_resonance_does_not_calibrate_steel_stud_triple_leaf"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_lined_masonry_route_card_keeps_attached_drywall_warning_separate",
      "web_triple_leaf_report_does_not_quote_masonry_guidance_as_exact_wall_row"
    ],
    priority: "P2",
    protectedBoundary:
      "attached_drywall_on_masonry_is_lined_masonry_boundary_context_not_internal_gypsum_double_stud_runtime_truth",
    publicationIdentity: "Warnock 1998, Controlling sound transmission through concrete block walls",
    reportedMetrics: [
      "STC guidance for concrete block walls",
      "mass-air-mass resonance warning around low frequencies",
      "cavity depth and gypsum board mass guidance"
    ],
    retrievalDate: "2026-04-30",
    sourceLabel: "NRC 1998 concrete block walls with attached drywall guidance",
    sourceUrl: "https://nrc-publications.canada.ca/eng/view/object/?id=8fe95aff-adf1-4a91-bc2e-f150870a5aee",
    topology: {
      cavity1: "furring or stud cavity between concrete block and gypsum board",
      cavity2: "only present for both-side linings; not a steel-stud double-frame cavity",
      internalLeaf: "concrete block substrate or attached lining context, not an internal gypsum board leaf",
      internalLeafCoupling: "attached drywall / furring coupling around masonry substrate",
      localMaterialMappingStatus:
        "use only to protect lined masonry / attached drywall boundaries before any triple-leaf solver lane",
      sideALeaf: "concrete block wall and/or gypsum board lining",
      sideBLeaf: "gypsum board lining when both sides are attached",
      supportTopology: "masonry substrate with furring, resilient channel, or independent stud variants"
    }
  }
] as const;

export const WALL_TRIPLE_LEAF_SOURCE_PACK_GATE_D = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_d_extract_triple_leaf_source_pack_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_e_source_corpus_classifier_and_negative_boundaries",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-source-corpus-contract.test.ts",
  selectionStatus:
    "gate_d_extracted_triple_leaf_source_pack_no_runtime_and_selected_source_corpus_classifier_gate_e",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

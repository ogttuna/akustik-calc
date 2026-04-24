import type { AirborneContext, LayerInput } from "@dynecho/shared";

export type WallTimberLightweightSourceCorpusClassification =
  | "exact_import_landed"
  | "secondary_benchmark"
  | "holdout_only";

export type WallTimberLightweightSourceCorpusReasonCode =
  | "direct_timber_generic_board_topology_exactly_representable"
  | "resilient_bar_side_count_topology_exactly_representable"
  | "resilient_bar_side_count_not_explicitly_modeled"
  | "proprietary_fire_board_mapping_not_exact"
  | "existing_lightweight_holdout_companion";

export type WallTimberLightweightSourceCorpusTopology =
  | "timber_direct_single_board"
  | "timber_direct_double_board"
  | "timber_resilient_bar_one_side_double_board"
  | "timber_resilient_bar_both_sides_double_board"
  | "lightweight_steel_single_board_holdout"
  | "lightweight_steel_double_board_holdout";

type WallTimberLightweightSourceCorpusEntryBase = {
  classification: WallTimberLightweightSourceCorpusClassification;
  classificationReasonCode: WallTimberLightweightSourceCorpusReasonCode;
  expectedRw: number;
  id: string;
  label: string;
  retrievedAt: string;
  sourceLabel: string;
  sourceUrl: string;
  topology: WallTimberLightweightSourceCorpusTopology;
};

export type WallTimberLightweightOfficialSourceRow = WallTimberLightweightSourceCorpusEntryBase & {
  airborneContext: Partial<AirborneContext>;
  kind: "official_row";
  layers: LayerInput[];
  metricPath: "ratings.iso717.Rw";
  sourceNote: string;
  toleranceDb: number;
};

export type WallTimberLightweightLinkedHoldoutRow = WallTimberLightweightSourceCorpusEntryBase & {
  kind: "linked_holdout";
  linkedCaseId: string;
  linkedDatasetFile: string;
  sourceNote: string;
};

export type WallTimberLightweightSourceCorpusEntry =
  | WallTimberLightweightOfficialSourceRow
  | WallTimberLightweightLinkedHoldoutRow;

export const KNAUF_GB_DRYWALL_SYSTEMS_PERFORMANCE_GUIDE_2026_URL =
  "https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB";
export const BRITISH_GYPSUM_A046005_URL =
  "https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a046005-en.pdf";
export const BRITISH_GYPSUM_A046006_URL =
  "https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a046006-en.pdf";
export const GYPROC_IRELAND_A026025_URL =
  "https://www.gyproc.ie/documents/system-specifications/a026025.pdf";
export const KNAUF_NL_SYSTEM_TABLES_URL =
  "https://knauf.com/api/download-center/v1/assets/8b5d23c5-a182-4ac8-81f7-2a6d7c289d12?country=nl&download=true";

export const WALL_TIMBER_LIGHTWEIGHT_LINKED_HOLDOUT_DATASET =
  "reference-benchmarks-rw-generic-holdout-2026.json";

const DIRECT_TIMBER_CONTEXT = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "wood_stud"
} satisfies Partial<AirborneContext>;

const RESILIENT_TIMBER_BENCHMARK_CONTEXT = {
  airtightness: "good",
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "resilient_stud"
} satisfies Partial<AirborneContext>;

const RESILIENT_TIMBER_ONE_SIDE_CONTEXT = {
  ...RESILIENT_TIMBER_BENCHMARK_CONTEXT,
  resilientBarSideCount: "one_side"
} satisfies Partial<AirborneContext>;

const RESILIENT_TIMBER_BOTH_SIDES_CONTEXT = {
  ...RESILIENT_TIMBER_BENCHMARK_CONTEXT,
  resilientBarSideCount: "both_sides"
} satisfies Partial<AirborneContext>;

function buildLayers(entries: readonly (readonly [string, number])[]): LayerInput[] {
  return entries.map(([materialId, thicknessMm]) => ({
    materialId,
    thicknessMm
  }));
}

function officialRow(
  id: string,
  label: string,
  classification: Extract<WallTimberLightweightSourceCorpusClassification, "exact_import_landed" | "secondary_benchmark">,
  classificationReasonCode: Exclude<WallTimberLightweightSourceCorpusReasonCode, "existing_lightweight_holdout_companion">,
  topology: Exclude<
    WallTimberLightweightSourceCorpusTopology,
    "lightweight_steel_single_board_holdout" | "lightweight_steel_double_board_holdout"
  >,
  sourceLabel: string,
  sourceUrl: string,
  sourceNote: string,
  expectedRw: number,
  toleranceDb: number,
  airborneContext: Partial<AirborneContext>,
  layers: readonly (readonly [string, number])[],
  retrievedAt = "2026-04-23"
): WallTimberLightweightOfficialSourceRow {
  return {
    airborneContext,
    classification,
    classificationReasonCode,
    expectedRw,
    id,
    kind: "official_row",
    label,
    layers: buildLayers(layers),
    metricPath: "ratings.iso717.Rw",
    retrievedAt,
    sourceLabel,
    sourceNote,
    sourceUrl,
    toleranceDb,
    topology
  };
}

function linkedHoldout(
  id: string,
  label: string,
  topology: "lightweight_steel_single_board_holdout" | "lightweight_steel_double_board_holdout",
  expectedRw: number,
  sourceNote: string
): WallTimberLightweightLinkedHoldoutRow {
  return {
    classification: "holdout_only",
    classificationReasonCode: "existing_lightweight_holdout_companion",
    expectedRw,
    id,
    kind: "linked_holdout",
    label,
    linkedCaseId: id,
    linkedDatasetFile: WALL_TIMBER_LIGHTWEIGHT_LINKED_HOLDOUT_DATASET,
    retrievedAt: "2026-03-10",
    sourceLabel: "Knauf Netherlands system tables PDF",
    sourceNote,
    sourceUrl: KNAUF_NL_SYSTEM_TABLES_URL,
    topology
  };
}

// This corpus is classification-first: direct timber rows that the
// current wall vocabulary can represent exactly are marked as landed
// exact imports. Gate C also promotes the side-count-specific resilient
// timber rows once the explicit one-side/both-sides context exists.
// Secondary benchmarks keep approximation notes explicit, and
// lightweight steel companions remain linked to the existing holdout
// dataset instead of being duplicated here.
export const WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS: readonly WallTimberLightweightSourceCorpusEntry[] = [
  officialRow(
    "knauf_gb_en_tp_63_38_1x12p5_wb_direct_uninsulated_lab_2026",
    "Knauf GB EN timber partition 63x38, 1x12.5 Wallboard each side, no insulation",
    "exact_import_landed",
    "direct_timber_generic_board_topology_exactly_representable",
    "timber_direct_single_board",
    "Knauf Drywall Systems Performance Guide 2026",
    KNAUF_GB_DRYWALL_SYSTEMS_PERFORMANCE_GUIDE_2026_URL,
    "EN Compliance p37, row EN-TP-63-38-6-1-12.5-WB-0, Rw 35 dB.",
    35,
    2,
    DIRECT_TIMBER_CONTEXT,
    [["gypsum", 12.5], ["air_gap", 63], ["gypsum", 12.5]]
  ),
  officialRow(
    "knauf_gb_en_tp_63_38_1x12p5_wb_50_acoustic_roll_lab_2026",
    "Knauf GB EN timber partition 63x38, 1x12.5 Wallboard each side, 50 mm cavity insulation",
    "exact_import_landed",
    "direct_timber_generic_board_topology_exactly_representable",
    "timber_direct_single_board",
    "Knauf Drywall Systems Performance Guide 2026",
    KNAUF_GB_DRYWALL_SYSTEMS_PERFORMANCE_GUIDE_2026_URL,
    "EN Compliance p37, row EN-TP-63-38-6-1-12.5-WB-50, Rw 42 dB.",
    42,
    2,
    DIRECT_TIMBER_CONTEXT,
    [["gypsum", 12.5], ["air_gap", 13], ["glasswool", 50], ["gypsum", 12.5]]
  ),
  officialRow(
    "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
    "Knauf GB EN timber partition 89x38, RB1 one side, 2x15 Soundshield Plus each side, 90 mm cavity insulation",
    "exact_import_landed",
    "resilient_bar_side_count_topology_exactly_representable",
    "timber_resilient_bar_one_side_double_board",
    "Knauf Drywall Systems Performance Guide 2026",
    KNAUF_GB_DRYWALL_SYSTEMS_PERFORMANCE_GUIDE_2026_URL,
    "EN Compliance p37, row EN-TP-RB1-89-38-6-2-15-SSP-90, Rw 56 dB.",
    56,
    3,
    RESILIENT_TIMBER_ONE_SIDE_CONTEXT,
    [
      ["acoustic_gypsum_board", 15],
      ["acoustic_gypsum_board", 15],
      ["glasswool", 90],
      ["acoustic_gypsum_board", 15],
      ["acoustic_gypsum_board", 15]
    ]
  ),
  officialRow(
    "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
    "Knauf GB EN timber partition 89x38, RB2 both sides, 2x15 Soundshield Plus each side, 90 mm cavity insulation",
    "exact_import_landed",
    "resilient_bar_side_count_topology_exactly_representable",
    "timber_resilient_bar_both_sides_double_board",
    "Knauf Drywall Systems Performance Guide 2026",
    KNAUF_GB_DRYWALL_SYSTEMS_PERFORMANCE_GUIDE_2026_URL,
    "EN Compliance p37, row EN-TP-RB2-89-38-6-2-15-SSP-60, published alongside the 90 mm FrameTherm 40 cavity-insulation column, Rw 59 dB.",
    59,
    3,
    RESILIENT_TIMBER_BOTH_SIDES_CONTEXT,
    [
      ["acoustic_gypsum_board", 15],
      ["acoustic_gypsum_board", 15],
      ["glasswool", 90],
      ["acoustic_gypsum_board", 15],
      ["acoustic_gypsum_board", 15]
    ]
  ),
  officialRow(
    "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
    "British Gypsum A046005 timber partition, RB1 one side, 2x12.5 SoundBloc each side, 50 mm APR",
    "exact_import_landed",
    "resilient_bar_side_count_topology_exactly_representable",
    "timber_resilient_bar_one_side_double_board",
    "British Gypsum Technical Specification A046005",
    BRITISH_GYPSUM_A046005_URL,
    "A046005 (02 May 2024), 75x38 timber stud at 600 mm centres, one-side RB1 resilient bar, Rw 55 dB.",
    55,
    3,
    RESILIENT_TIMBER_ONE_SIDE_CONTEXT,
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 25],
      ["glasswool", 50],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  officialRow(
    "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026",
    "British Gypsum A046006 timber partition, RB2 both sides, 2x12.5 SoundBloc each side, 50 mm APR",
    "exact_import_landed",
    "resilient_bar_side_count_topology_exactly_representable",
    "timber_resilient_bar_both_sides_double_board",
    "British Gypsum Technical Specification A046006",
    BRITISH_GYPSUM_A046006_URL,
    "A046006 (02 May 2024), 75x38 timber stud at 600 mm centres, both-side RB2 resilient bars, Rw 58 dB.",
    58,
    3,
    RESILIENT_TIMBER_BOTH_SIDES_CONTEXT,
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 25],
      ["glasswool", 50],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  officialRow(
    "gyproc_ie_a026025_timber_2x15_fireline_uninsulated_lab_2026",
    "Gyproc Ireland A026025 timber partition, 2x15 FireLine each side, uninsulated cavity",
    "secondary_benchmark",
    "proprietary_fire_board_mapping_not_exact",
    "timber_direct_double_board",
    "Gyproc Ireland Product Substantiation Report A026025",
    GYPROC_IRELAND_A026025_URL,
    "A026025, 100x50 timber stud at 600 mm centres, 2x15 FireLine each side, no cavity insulation, 41 RwdB.",
    41,
    3,
    DIRECT_TIMBER_CONTEXT,
    [["gypsum", 15], ["gypsum", 15], ["air_gap", 100], ["gypsum", 15], ["gypsum", 15]]
  ),
  linkedHoldout(
    "knauf_w111_75_100_60mw_a_rw_holdout_2026",
    "Existing Knauf W111 75/100 60 MW single-board lightweight steel holdout companion",
    "lightweight_steel_single_board_holdout",
    43,
    "Linked from the existing generic Rw holdout dataset so the new corpus keeps a lightweight steel companion lane without duplicating the active holdout source of truth."
  ),
  linkedHoldout(
    "knauf_w112_75_125_60mw_a_rw_holdout_2026",
    "Existing Knauf W112 75/125 60 MW double-board lightweight steel holdout companion",
    "lightweight_steel_double_board_holdout",
    51,
    "Linked from the existing generic Rw holdout dataset so the new corpus keeps a lightweight steel companion lane without duplicating the active holdout source of truth."
  )
] as const;

export const WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
  (entry): entry is WallTimberLightweightOfficialSourceRow & {
    classification: "exact_import_landed";
  } => entry.kind === "official_row" && entry.classification === "exact_import_landed"
);

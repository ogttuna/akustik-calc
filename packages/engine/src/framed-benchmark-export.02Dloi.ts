import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

type BenchmarkDatasetId = "official_primary" | "official_field" | "rw_holdout" | "field_holdout";
type BenchmarkMetricPath = "ratings.iso717.Rw" | "ratings.field.DnTA";

type BenchmarkCase = {
  airborneContext: AirborneContext;
  datasetId: BenchmarkDatasetId;
  expectedValue: number;
  id: string;
  layers: LayerInput[];
  metricPath: BenchmarkMetricPath;
  source: string;
  toleranceDb: number;
};

const KNAUF_QUIETSTUD_URL =
  "https://knauf.com/api/download-center/v1/assets/844d89d6-948a-408d-9da3-f6f1a238cf45?download=true";
const KNAUF_LAB_416702_URL =
  "https://knauf.com/api/download-center/v1/assets/8a433020-0f2e-45f0-a84c-3f5f315ea0ff?download=true";
const KNAUF_LAB_416889_URL =
  "https://knauf.com/api/download-center/v1/assets/cfb8a2df-f402-4ef8-baef-acdecc69f641?download=true";
const KNAUF_SYSTEM_TABLES_URL =
  "https://knauf.com/api/download-center/v1/assets/8b5d23c5-a182-4ac8-81f7-2a6d7c289d12?country=nl&download=true";

const DATASET_THRESHOLDS: Record<
  BenchmarkDatasetId,
  { caseCount: number; thresholdMaeDb: number; thresholdMaxDb: number }
> = {
  official_primary: {
    caseCount: 6,
    thresholdMaeDb: 1.5,
    thresholdMaxDb: 4
  },
  official_field: {
    caseCount: 13,
    thresholdMaeDb: 1,
    thresholdMaxDb: 2.5
  },
  rw_holdout: {
    caseCount: 12,
    thresholdMaeDb: 0.6,
    thresholdMaxDb: 2.1
  },
  field_holdout: {
    caseCount: 4,
    thresholdMaeDb: 0.3,
    thresholdMaxDb: 0.7
  }
};

const TARGET_OUTPUTS = ["Rw", "R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"] as const;

function buildLayers(entries: readonly (readonly [string, number])[]): LayerInput[] {
  return entries.map(([materialId, thicknessMm]) => ({
    materialId,
    thicknessMm
  }));
}

function benchmarkCase(
  datasetId: BenchmarkDatasetId,
  id: string,
  source: string,
  metricPath: BenchmarkMetricPath,
  expectedValue: number,
  toleranceDb: number,
  airborneContext: AirborneContext,
  layers: readonly (readonly [string, number])[]
): BenchmarkCase {
  return {
    airborneContext,
    datasetId,
    expectedValue,
    id,
    layers: buildLayers(layers),
    metricPath,
    source,
    toleranceDb
  };
}

function getMetricValue(result: unknown, metricPath: BenchmarkMetricPath): number | null {
  const value = metricPath
    .split(".")
    .reduce((current: unknown, key: string) => (current == null ? undefined : (current as Record<string, unknown>)[key]), result);

  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

const BENCHMARK_CASES: BenchmarkCase[] = [
  benchmarkCase(
    "official_primary",
    "knauf_sqp2a_nil_92_primary_2026",
    KNAUF_QUIETSTUD_URL,
    "ratings.iso717.Rw",
    49,
    4,
    {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 92], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "official_primary",
    "knauf_sqp2a_ki50_92_primary_2026",
    KNAUF_QUIETSTUD_URL,
    "ratings.iso717.Rw",
    55,
    4,
    {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 42], ["glasswool", 50], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "official_primary",
    "knauf_sqp2a_ki75_92_primary_2026",
    KNAUF_QUIETSTUD_URL,
    "ratings.iso717.Rw",
    56,
    4,
    {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 17], ["glasswool", 75], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "official_primary",
    "knauf_sqp2a_ki90_92_primary_2026",
    KNAUF_QUIETSTUD_URL,
    "ratings.iso717.Rw",
    57,
    4,
    {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 2], ["glasswool", 90], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "official_primary",
    "knauf_lab_416702_primary_2026",
    KNAUF_LAB_416702_URL,
    "ratings.iso717.Rw",
    50,
    4,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 5], ["glasswool", 70], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "official_primary",
    "knauf_lab_416889_primary_2026",
    KNAUF_LAB_416889_URL,
    "ratings.iso717.Rw",
    55,
    4,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 5],
      ["glasswool", 70],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w111_50_75_a_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    27,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [["gypsum", 12.5], ["air_gap", 75], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w111_50_75_40mw_a_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    34,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [["gypsum", 12.5], ["air_gap", 35], ["glasswool", 40], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w112_50_100_a_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    35,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 100], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w112_50_100_40mw_a_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    43,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 60], ["glasswool", 40], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w112_75_125_60mw_a_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    44,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 65], ["glasswool", 60], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w112_100_150_80mw_a_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    44,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 70], ["glasswool", 80], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w112_50_100_db_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    35,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 100],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w112_50_100_40mw_db_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    50,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 60],
      ["glasswool", 40],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w112_75_125_60mw_db_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    52,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 65],
      ["glasswool", 60],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w112_100_150_80mw_db_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    53,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 70],
      ["glasswool", 80],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w113_50_125_40mw_a_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    49,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 85],
      ["glasswool", 40],
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w113_75_150_60mw_db_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    57,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 90],
      ["glasswool", 60],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  benchmarkCase(
    "official_field",
    "knauf_w118_wk2_1_0_50_101_40gw_a_field_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    43,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 61], ["glasswool", 40], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "rw_holdout",
    "knauf_w111_50_75_a_rw_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.iso717.Rw",
    34,
    3,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["air_gap", 75], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "rw_holdout",
    "knauf_w111_50_75_40mw_a_rw_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.iso717.Rw",
    42,
    3,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["air_gap", 35], ["glasswool", 40], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "rw_holdout",
    "knauf_w111_75_100_60mw_a_rw_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.iso717.Rw",
    43,
    3,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["air_gap", 40], ["glasswool", 60], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "rw_holdout",
    "knauf_w111_100_125_80mw_a_rw_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.iso717.Rw",
    46,
    3,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["air_gap", 45], ["glasswool", 80], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "rw_holdout",
    "knauf_w112_50_100_a_rw_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.iso717.Rw",
    42,
    3,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 100], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "rw_holdout",
    "knauf_w112_50_100_40mw_a_rw_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.iso717.Rw",
    50,
    3,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 60], ["glasswool", 40], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "rw_holdout",
    "knauf_w112_75_125_60mw_a_rw_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.iso717.Rw",
    51,
    3,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 65], ["glasswool", 60], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "rw_holdout",
    "knauf_w112_100_150_80mw_a_rw_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.iso717.Rw",
    52,
    3,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 70], ["glasswool", 80], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "rw_holdout",
    "knauf_w113_50_125_40mw_a_rw_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.iso717.Rw",
    56,
    3,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 85],
      ["glasswool", 40],
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]
  ),
  benchmarkCase(
    "rw_holdout",
    "knauf_w113_75_150_60mw_db_rw_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.iso717.Rw",
    66,
    5,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    },
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 90],
      ["glasswool", 60],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  benchmarkCase(
    "rw_holdout",
    "knauf_w115_2x75_205_60gw_rw_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.iso717.Rw",
    61,
    4,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      sharedTrack: "independent"
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 75], ["glasswool", 60], ["air_gap", 70], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "rw_holdout",
    "knauf_w119_75_75_206_60gw_rw_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.iso717.Rw",
    61,
    4,
    {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      sharedTrack: "independent"
    },
    [["security_board", 12.5], ["gypsum", 12.5], ["air_gap", 73], ["glasswool", 60], ["air_gap", 73], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "field_holdout",
    "knauf_w111_75_100_60mw_a_field_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    34,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    },
    [["gypsum", 12.5], ["air_gap", 40], ["glasswool", 60], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "field_holdout",
    "knauf_w111_100_125_80mw_a_field_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    38,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    },
    [["gypsum", 12.5], ["air_gap", 45], ["glasswool", 80], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "field_holdout",
    "knauf_w115_2x75_205_60gw_field_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    52,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    },
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 75], ["glasswool", 60], ["air_gap", 70], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  benchmarkCase(
    "field_holdout",
    "knauf_w119_75_75_206_60gw_field_holdout_2026",
    KNAUF_SYSTEM_TABLES_URL,
    "ratings.field.DnTA",
    52,
    3,
    {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    },
    [["security_board", 12.5], ["gypsum", 12.5], ["air_gap", 73], ["glasswool", 60], ["air_gap", 73], ["gypsum", 12.5], ["gypsum", 12.5]]
  )
];

describe("airborne framed-wall benchmark corpus", () => {
  it("stays well-formed and keeps the upstream benchmark mix intact", () => {
    expect(BENCHMARK_CASES.length).toBe(35);

    for (const [datasetId, threshold] of Object.entries(DATASET_THRESHOLDS) as Array<
      [BenchmarkDatasetId, (typeof DATASET_THRESHOLDS)[BenchmarkDatasetId]]
    >) {
      const cases = BENCHMARK_CASES.filter((entry) => entry.datasetId === datasetId);

      expect(cases.length).toBe(threshold.caseCount);
    }

    for (const entry of BENCHMARK_CASES) {
      expect(entry.id).toMatch(/_2026$/);
      expect(entry.source).toMatch(/^https:\/\//);
      expect(entry.layers.length).toBeGreaterThanOrEqual(3);
      expect(entry.expectedValue).toBeGreaterThan(0);
      expect(entry.toleranceDb).toBeGreaterThan(0);
    }
  });

  it("keeps dynamic airborne framed-wall predictions inside the curated lab and field corridors", () => {
    for (const [datasetId, threshold] of Object.entries(DATASET_THRESHOLDS) as Array<
      [BenchmarkDatasetId, (typeof DATASET_THRESHOLDS)[BenchmarkDatasetId]]
    >) {
      const cases = BENCHMARK_CASES.filter((entry) => entry.datasetId === datasetId);
      const errors: string[] = [];
      let totalError = 0;
      let maxError = 0;

      for (const entry of cases) {
        const result = calculateAssembly(entry.layers, {
          airborneContext: entry.airborneContext,
          calculator: "dynamic",
          targetOutputs: TARGET_OUTPUTS
        });
        const actual = getMetricValue(result, entry.metricPath);

        if (actual === null) {
          errors.push(`${entry.id}: ${entry.metricPath} returned null`);
          continue;
        }

        const error = Math.abs(actual - entry.expectedValue);
        totalError += error;
        maxError = Math.max(maxError, error);

        if (error > entry.toleranceDb) {
          errors.push(
            `${entry.id}: expected ${entry.expectedValue.toFixed(1)} got ${actual.toFixed(1)} | error ${error.toFixed(2)} dB > tolerance ${entry.toleranceDb.toFixed(1)} dB`
          );
        }
      }

      const mae = totalError / Math.max(cases.length, 1);

      expect(errors).toEqual([]);
      expect(mae).toBeLessThanOrEqual(threshold.thresholdMaeDb);
      expect(maxError).toBeLessThanOrEqual(threshold.thresholdMaxDb);
    }
  });

  it("keeps exact official field rows on the published DnT,A,k proxy-anchor lane", () => {
    const officialFieldCases = BENCHMARK_CASES.filter((entry) => entry.datasetId === "official_field");

    for (const entry of officialFieldCases) {
      const result = calculateAssembly(entry.layers, {
        airborneContext: entry.airborneContext,
        calculator: "dynamic",
        targetOutputs: TARGET_OUTPUTS
      });

      expect(result.ratings.field?.DnTAk, entry.id).toBe(entry.expectedValue);
      expect(result.ratings.field?.basis ?? "", entry.id).toContain("exact_verified_field_proxy_anchor");
      expect(result.ratings.field?.basis ?? "", entry.id).not.toContain("official_approximate_field_companion");
      expect(
        result.warnings.some((warning: string) => /official DnT,A,k .* through the local DnT,A proxy lane/i.test(warning)),
        entry.id
      ).toBe(true);
    }
  });

  it("promotes deep independent split-cavity framed holdouts onto the double-stud family without moving their corridor fit", () => {
    const doubleStudIds = new Set([
      "knauf_w115_2x75_205_60gw_rw_holdout_2026",
      "knauf_w119_75_75_206_60gw_rw_holdout_2026",
      "knauf_w115_2x75_205_60gw_field_holdout_2026",
      "knauf_w119_75_75_206_60gw_field_holdout_2026"
    ]);
    const promotedCases = BENCHMARK_CASES.filter((entry) => doubleStudIds.has(entry.id));

    expect(promotedCases).toHaveLength(4);

    for (const entry of promotedCases) {
      const result = calculateAssembly(entry.layers, {
        airborneContext: entry.airborneContext,
        calculator: "dynamic",
        targetOutputs: TARGET_OUTPUTS
      });

      expect(result.dynamicAirborneTrace?.detectedFamily, entry.id).toBe("double_stud_system");
      expect(result.dynamicAirborneTrace?.detectedFamilyLabel, entry.id).toBe("Double Frame / Double Stud");
      expect(result.dynamicAirborneTrace?.strategy ?? "", entry.id).toContain("double_stud");
      expect(result.dynamicAirborneTrace?.confidenceClass, entry.id).toBe("medium");
      expect(
        result.dynamicAirborneTrace?.notes.some((note: string) => /deep split-cavity framed wall|double-stud lane/i.test(note)),
        entry.id
      ).toBe(true);
      expect(
        result.warnings.some((warning: string) => /calibrated double-stud corridor/i.test(warning)),
        entry.id
      ).toBe(true);
    }

    const singleFrameReference = BENCHMARK_CASES.find(
      (entry) => entry.id === "knauf_w113_75_150_60mw_db_rw_holdout_2026"
    );

    expect(singleFrameReference).toBeDefined();

    if (!singleFrameReference) {
      return;
    }

    const singleFrameResult = calculateAssembly(singleFrameReference.layers, {
      airborneContext: singleFrameReference.airborneContext,
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(singleFrameResult.dynamicAirborneTrace?.detectedFamily).toBe("stud_wall_system");
  });
});

export { BENCHMARK_CASES };

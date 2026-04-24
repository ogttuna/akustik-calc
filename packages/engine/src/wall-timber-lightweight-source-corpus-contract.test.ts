import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  BRITISH_GYPSUM_A046005_URL,
  BRITISH_GYPSUM_A046006_URL,
  GYPROC_IRELAND_A026025_URL,
  KNAUF_GB_DRYWALL_SYSTEMS_PERFORMANCE_GUIDE_2026_URL,
  KNAUF_NL_SYSTEM_TABLES_URL,
  WALL_TIMBER_LIGHTWEIGHT_LINKED_HOLDOUT_DATASET,
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS
} from "./wall-timber-lightweight-source-corpus";

type GenericHoldoutDataset = {
  cases: Array<{
    expectedValue: number;
    id: string;
    source: string;
  }>;
};

const EXPECTED_CORPUS_IDS = [
  "knauf_gb_en_tp_63_38_1x12p5_wb_direct_uninsulated_lab_2026",
  "knauf_gb_en_tp_63_38_1x12p5_wb_50_acoustic_roll_lab_2026",
  "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
  "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
  "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
  "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026",
  "gyproc_ie_a026025_timber_2x15_fireline_uninsulated_lab_2026",
  "knauf_w111_75_100_60mw_a_rw_holdout_2026",
  "knauf_w112_75_125_60mw_a_rw_holdout_2026"
] as const;

const EXPECTED_EXACT_IMPORT_IDS = [
  "knauf_gb_en_tp_63_38_1x12p5_wb_direct_uninsulated_lab_2026",
  "knauf_gb_en_tp_63_38_1x12p5_wb_50_acoustic_roll_lab_2026"
] as const;

const EXPECTED_SECONDARY_BENCHMARK_IDS = [
  "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
  "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
  "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
  "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026",
  "gyproc_ie_a026025_timber_2x15_fireline_uninsulated_lab_2026"
] as const;

const EXPECTED_HOLDOUT_IDS = [
  "knauf_w111_75_100_60mw_a_rw_holdout_2026",
  "knauf_w112_75_125_60mw_a_rw_holdout_2026"
] as const;

function sorted<T extends string | number>(values: readonly T[]) {
  return [...values].sort();
}

function readLinkedHoldoutDataset(): GenericHoldoutDataset {
  const raw = readFileSync(new URL(`../fixtures/${WALL_TIMBER_LIGHTWEIGHT_LINKED_HOLDOUT_DATASET}`, import.meta.url), "utf8");
  return JSON.parse(raw) as GenericHoldoutDataset;
}

describe("wall timber/lightweight source corpus contract", () => {
  it("keeps the current corpus row ids stable", () => {
    expect(sorted(WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.map((entry) => entry.id))).toEqual(sorted(EXPECTED_CORPUS_IDS));
  });

  it("keeps the classification posture explicit: direct timber exact, resilient/proprietary rows secondary, lightweight steel links holdout-only", () => {
    const exactIds = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
      (entry) => entry.classification === "exact_import_landed"
    ).map((entry) => entry.id);
    const secondaryIds = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
      (entry) => entry.classification === "secondary_benchmark"
    ).map((entry) => entry.id);
    const holdoutIds = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter((entry) => entry.classification === "holdout_only").map(
      (entry) => entry.id
    );

    expect(sorted(exactIds)).toEqual(sorted(EXPECTED_EXACT_IMPORT_IDS));
    expect(sorted(secondaryIds)).toEqual(sorted(EXPECTED_SECONDARY_BENCHMARK_IDS));
    expect(sorted(holdoutIds)).toEqual(sorted(EXPECTED_HOLDOUT_IDS));
  });

  it("keeps source URLs and retrieval dates pinned to the defended official documents", () => {
    const sourceUrls = new Set(WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.map((entry) => entry.sourceUrl));
    const officialRetrievedAt = new Set(
      WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter((entry) => entry.kind === "official_row").map((entry) => entry.retrievedAt)
    );
    const holdoutRetrievedAt = new Set(
      WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter((entry) => entry.kind === "linked_holdout").map((entry) => entry.retrievedAt)
    );

    expect(sourceUrls).toEqual(
      new Set([
        KNAUF_GB_DRYWALL_SYSTEMS_PERFORMANCE_GUIDE_2026_URL,
        BRITISH_GYPSUM_A046005_URL,
        BRITISH_GYPSUM_A046006_URL,
        GYPROC_IRELAND_A026025_URL,
        KNAUF_NL_SYSTEM_TABLES_URL
      ])
    );
    expect(officialRetrievedAt).toEqual(new Set(["2026-04-23"]));
    expect(holdoutRetrievedAt).toEqual(new Set(["2026-03-10"]));
  });

  it("limits landed exact imports to direct timber rows the current wall vocabulary can represent exactly", () => {
    const exactRows = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter((entry) => entry.classification === "exact_import_landed");

    expect(exactRows.every((entry) => entry.kind === "official_row")).toBe(true);
    expect(
      exactRows.every(
        (entry) =>
          entry.kind === "official_row" &&
          entry.classificationReasonCode === "direct_timber_generic_board_topology_exactly_representable" &&
          entry.airborneContext.connectionType === "line_connection" &&
          entry.airborneContext.studType === "wood_stud"
      )
    ).toBe(true);
  });

  it("keeps resilient-bar and proprietary-fire-board rows out of exact-import posture until topology/material ambiguity is resolved", () => {
    const secondaryRows = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter((entry) => entry.classification === "secondary_benchmark");

    expect(
      secondaryRows.every(
        (entry) =>
          entry.kind === "official_row" &&
          (entry.classificationReasonCode === "resilient_bar_side_count_not_explicitly_modeled" ||
            entry.classificationReasonCode === "proprietary_fire_board_mapping_not_exact")
      )
    ).toBe(true);
  });

  it("keeps the linked lightweight steel companions attached to live holdout dataset rows", () => {
    const holdoutDataset = readLinkedHoldoutDataset();
    const linkedRows = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter((entry) => entry.kind === "linked_holdout");

    expect(sorted(linkedRows.map((entry) => entry.linkedCaseId))).toEqual(sorted(EXPECTED_HOLDOUT_IDS));

    const holdoutMap = new Map(holdoutDataset.cases.map((entry) => [entry.id, entry] as const));

    expect(holdoutMap.get("knauf_w111_75_100_60mw_a_rw_holdout_2026")?.expectedValue).toBe(43);
    expect(holdoutMap.get("knauf_w112_75_125_60mw_a_rw_holdout_2026")?.expectedValue).toBe(51);
    expect(holdoutMap.get("knauf_w111_75_100_60mw_a_rw_holdout_2026")?.source).toContain(KNAUF_NL_SYSTEM_TABLES_URL);
    expect(holdoutMap.get("knauf_w112_75_125_60mw_a_rw_holdout_2026")?.source).toContain(KNAUF_NL_SYSTEM_TABLES_URL);
  });
});

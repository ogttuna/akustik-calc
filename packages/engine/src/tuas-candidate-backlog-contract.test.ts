import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

type TuasBacklogCandidate = {
  readonly id: string;
  readonly lnW: number;
  readonly rw: number;
};

const TUAS_OPEN_BOX_SOURCE_UNIVERSE = [
  "R2a",
  "R3a",
  "R5a",
  "R6a",
  "R7a",
  "R10a",
  "R2b",
  "R3b",
  "R5b",
  "R6b",
  "R7b",
  "R8b",
  "R9b",
  "R11b",
  "R2c"
] as const;

const TUAS_CLT_SOURCE_UNIVERSE = [
  "X2",
  "X3",
  "X4",
  "X5",
  "C2",
  "C3",
  "C4",
  "C5",
  "C7",
  "C2c",
  "C3c",
  "C4c",
  "C5c",
  "C7c",
  "C11c"
] as const;

const IMPORTED_TUAS_OPEN_BOX_IDS = [
  "tuas_r2a_open_box_timber_measured_2026",
  "tuas_r2b_open_box_timber_measured_2026",
  "tuas_r3a_open_box_timber_measured_2026",
  "tuas_r3b_open_box_timber_measured_2026",
  "tuas_r5a_open_box_timber_measured_2026",
  "tuas_r5b_open_box_timber_measured_2026",
  "tuas_r6a_open_box_timber_measured_2026",
  "tuas_r6b_open_box_timber_measured_2026",
  "tuas_r7a_open_box_timber_measured_2026",
  "tuas_r7b_open_box_timber_measured_2026",
  "tuas_r8b_open_box_timber_measured_2026",
  "tuas_r9b_open_box_timber_measured_2026",
  "tuas_r2c_open_box_timber_measured_2026",
  "tuas_r10a_open_box_timber_measured_2026",
  "tuas_r11b_open_box_timber_measured_2026"
] as const;

const IMPORTED_TUAS_CLT_IDS = [
  "tuas_x2_clt140_measured_2026",
  "tuas_x3_clt140_measured_2026",
  "tuas_x4_clt140_measured_2026",
  "tuas_x5_clt140_measured_2026",
  "tuas_c2_clt260_measured_2026",
  "tuas_c3_clt260_measured_2026",
  "tuas_c4_clt260_measured_2026",
  "tuas_c5_clt260_measured_2026",
  "tuas_c7_clt260_measured_2026",
  "tuas_c7c_clt260_measured_2026",
  "tuas_c2c_clt260_measured_2026",
  "tuas_c3c_clt260_measured_2026",
  "tuas_c4c_clt260_measured_2026",
  "tuas_c5c_clt260_measured_2026"
] as const;

const IMPORTED_TUAS_SOURCE_TRUTH_BY_SYSTEM_ID = {
  tuas_x2_clt140_measured_2026: { ci: 2, ci50: 3, lnW: 61, lnWPlusCI: 63, rw: 38, rwCompanion: 37.242344245020725 },
  tuas_x3_clt140_measured_2026: { ci: 0, ci50: 8, lnW: 52, lnWPlusCI: 52, rw: 49, rwCompanion: 47.10786221887914 },
  tuas_x4_clt140_measured_2026: { ci: 1, ci50: 8, lnW: 50, lnWPlusCI: 51, rw: 55, rwCompanion: 53.20807486278851 },
  tuas_x5_clt140_measured_2026: { ci: 0, ci50: 0, lnW: 65, lnWPlusCI: 65, rw: 55, rwCompanion: 53.24148704194138 },
  tuas_c2_clt260_measured_2026: { ci: 3, ci50: 4, lnW: 55, lnWPlusCI: 58, rw: 42, rwCompanion: 41.478540491108376 },
  tuas_c3_clt260_measured_2026: { ci: 2, ci50: 6, lnW: 47, lnWPlusCI: 49, rw: 54, rwCompanion: 51.413639069637696 },
  tuas_c4_clt260_measured_2026: { ci: 1, ci50: 6, lnW: 45, lnWPlusCI: 46, rw: 61, rwCompanion: 58.831296422168144 },
  tuas_c5_clt260_measured_2026: { ci: 2, ci50: 3, lnW: 60, lnWPlusCI: 62, rw: 61, rwCompanion: 59.492301808652826 },
  tuas_c7_clt260_measured_2026: { ci: 1, ci50: 3, lnW: 39, lnWPlusCI: 40, rw: 57, rwCompanion: 52.458421802887344 },
  tuas_c7c_clt260_measured_2026: { ci: 5, ci50: 14, lnW: 30, lnWPlusCI: 35, rw: 75, rwCompanion: 70.92499901751341 },
  tuas_c2c_clt260_measured_2026: { ci: 4, ci50: 9, lnW: 35, lnWPlusCI: 39, rw: 70, rwCompanion: 67.41490151958673 },
  tuas_c3c_clt260_measured_2026: { ci: 2, ci50: 16, lnW: 27, lnWPlusCI: 29, rw: 73, rwCompanion: 67.7537144078056 },
  tuas_c4c_clt260_measured_2026: { ci: 2, ci50: 16, lnW: 24, lnWPlusCI: 26, rw: 74, rwCompanion: 69.69668895954507 },
  tuas_c5c_clt260_measured_2026: { ci: 4, ci50: 6, lnW: 38, lnWPlusCI: 42, rw: 75, rwCompanion: 70.46337519002095 },
  tuas_r2a_open_box_timber_measured_2026: { ci: 2, ci50: 4, lnW: 61, lnWPlusCI: 63, rw: 49, rwCompanion: 44.52764215440286 },
  tuas_r2b_open_box_timber_measured_2026: { ci: 1, ci50: 3, lnW: 46, lnWPlusCI: 47, rw: 62, rwCompanion: 59.973347663855776 },
  tuas_r3a_open_box_timber_measured_2026: { ci: 2, ci50: 3, lnW: 56, lnWPlusCI: 58, rw: 56, rwCompanion: 51.30566236283586 },
  tuas_r3b_open_box_timber_measured_2026: { ci: 2, ci50: 5, lnW: 39, lnWPlusCI: 41, rw: 70, rwCompanion: 67.58499572159022 },
  tuas_r5a_open_box_timber_measured_2026: { ci: 1, ci50: 2, lnW: 64, lnWPlusCI: 65, rw: 63, rwCompanion: 57.78202920484737 },
  tuas_r5b_open_box_timber_measured_2026: { ci: 0, ci50: 3, lnW: 44, lnWPlusCI: 44, rw: 75, rwCompanion: 71.87531170772152 },
  tuas_r6a_open_box_timber_measured_2026: { ci: 1, ci50: 3, lnW: 60, lnWPlusCI: 61, rw: 56, rwCompanion: 53.59725745128915 },
  tuas_r6b_open_box_timber_measured_2026: { ci: 0, ci50: 1, lnW: 47, lnWPlusCI: 47, rw: 71, rwCompanion: 69.5361374042257 },
  tuas_r7a_open_box_timber_measured_2026: { ci: 1, ci50: 3, lnW: 63, lnWPlusCI: 64, rw: 60, rwCompanion: 57 },
  tuas_r7b_open_box_timber_measured_2026: { ci: 0, ci50: 1, lnW: 47, lnWPlusCI: 47, rw: 72, rwCompanion: 70.726430817278 },
  tuas_r8b_open_box_timber_measured_2026: { ci: -1, ci50: 0, lnW: 50, lnWPlusCI: 49, rw: 72, rwCompanion: 70.60101885694094 },
  tuas_r9b_open_box_timber_measured_2026: { ci: 1, ci50: 3, lnW: 45, lnWPlusCI: 46, rw: 68, rwCompanion: 67.01756572323127 },
  tuas_r2c_open_box_timber_measured_2026: { ci: 0, ci50: 0, lnW: 70, lnWPlusCI: 70, rw: 54, rwCompanion: 53.34048310542768 },
  tuas_r10a_open_box_timber_measured_2026: { ci: 0, ci50: 1, lnW: 55, lnWPlusCI: 55, rw: 56, rwCompanion: 50.89680103538985 },
  tuas_r11b_open_box_timber_measured_2026: { ci: 0, ci50: 0, lnW: 60, lnWPlusCI: 60, rw: 74, rwCompanion: 71.15477026441121 }
} as const;

const IMPORTED_TUAS_OPEN_BOX_SAFE_B_TIER = [
  { id: "R2b", lnW: 46, rw: 62 },
  { id: "R3b", lnW: 39, rw: 70 },
  { id: "R11b", lnW: 60, rw: 74 }
] as const;

const IMPORTED_TUAS_OPEN_BOX_FAMILY_A_TIER = [
  { id: "R3a", lnW: 56, rw: 56 },
  { id: "R5a", lnW: 64, rw: 63 },
  { id: "R6a", lnW: 60, rw: 56 }
] as const;

const IMPORTED_TUAS_OPEN_BOX_REINFORCED_B_TIER = [
  { id: "R6b", lnW: 47, rw: 71 }
] as const;

const IMPORTED_TUAS_OPEN_BOX_HEAVY_A_TIER = [
  { id: "R7a", lnW: 63, rw: 60 }
] as const;

const IMPORTED_TUAS_OPEN_BOX_STAGED_UPPER_PACKAGE_TIER = [
  { id: "R10a", lnW: 55, rw: 56 }
] as const;

const AUDITED_TUAS_OPEN_BOX_STAGED_UPPER_PACKAGE_DEFERRED_SET: readonly string[] = [];

const IMPORTED_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_TIER = [
  { id: "R7b", lnW: 47, rw: 72 },
  { id: "R8b", lnW: 50, rw: 72 },
  { id: "R9b", lnW: 45, rw: 68 },
  { id: "R2c", lnW: 70, rw: 54 }
] as const;

const AUDITED_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_DEFERRED_SET: readonly string[] = [];

const NEXT_TUAS_OPEN_BOX_SUPPORT_SURFACE_ANCHOR_TIER: readonly string[] = [];
const NEXT_TUAS_OPEN_BOX_SUPPORT_SURFACE_SIBLING_TIER: readonly string[] = [];
const DEFERRED_TUAS_OPEN_BOX_SUPPORT_SURFACE_VARIANT_TIER: readonly string[] = [];

const LANDED_TUAS_CLT_STAGED_UPPER_TIER = [
  { id: "X3", lnW: 52, rw: 49 },
  { id: "C3", lnW: 47, rw: 54 }
] as const;

const LANDED_TUAS_CLT_HEAVY_DRY_TOP_TIER = [
  { id: "X4", lnW: 50, rw: 55 },
  { id: "C4", lnW: 45, rw: 61 },
  { id: "C5", lnW: 60, rw: 61 }
] as const;

const LANDED_TUAS_CLT_WET_TOP_TIER = [
  { id: "C7", lnW: 39, rw: 57 }
] as const;

const DEFERRED_TUAS_CLT_IMPORT_TIER = [
  "C11c"
] as const;

const LANDED_TUAS_CLT_COMBINED_BASIC_TIER = [
  { id: "C2c", lnW: 35, rw: 70 }
] as const;

const LANDED_TUAS_CLT_COMBINED_WET_TIER = [
  { id: "C7c", lnW: 30, rw: 75 }
] as const;

const LANDED_TUAS_CLT_COMBINED_STAGED_TIER = [
  { id: "C3c", lnW: 27, rw: 73 }
] as const;

const LANDED_TUAS_CLT_COMBINED_HEAVY_DRY_TIER = [
  { id: "C4c", lnW: 24, rw: 74 }
] as const;

const NEXT_TUAS_CLT_HEAVY_DRY_TOP_TIER: readonly TuasBacklogCandidate[] = [];

const DEFERRED_TUAS_CLT_HEAVY_DRY_TOP_TIER: readonly TuasBacklogCandidate[] = [];

const DEFERRED_TUAS_CLT_WET_TOP_TIER: readonly TuasBacklogCandidate[] = [];

const DEFERRED_TUAS_CLT_COMBINED_SCREENING_TIER = [
  { id: "C11c", lnW: 59, rw: 74 }
] as const;

function sortedValues<T extends string>(input: readonly T[]) {
  return [...input].sort();
}

describe("TUAS candidate backlog contract", () => {
  it("keeps the researched TUAS source universe and current imported subset explicit", () => {
    const importedTuasIds = EXACT_FLOOR_SYSTEMS
      .filter((system) => system.id.startsWith("tuas_"))
      .map((system) => system.id);

    const importedOpenBoxIds = importedTuasIds.filter((id) => id.includes("_open_box_timber_"));
    const importedCltIds = importedTuasIds.filter((id) => id.includes("_clt140_") || id.includes("_clt260_"));

    expect(TUAS_OPEN_BOX_SOURCE_UNIVERSE).toHaveLength(15);
    expect(TUAS_CLT_SOURCE_UNIVERSE).toHaveLength(15);
    expect(sortedValues(importedOpenBoxIds)).toEqual(sortedValues(IMPORTED_TUAS_OPEN_BOX_IDS));
    expect(sortedValues(importedCltIds)).toEqual(sortedValues(IMPORTED_TUAS_CLT_IDS));
  });

  it("keeps imported TUAS floor rows aligned with the SoundInsulation spreadsheet single-number truth", () => {
    for (const [systemId, expected] of Object.entries(IMPORTED_TUAS_SOURCE_TRUTH_BY_SYSTEM_ID)) {
      const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === systemId);

      expect(system?.impactRatings.CI).toBe(expected.ci);
      expect(system?.impactRatings.CI50_2500).toBe(expected.ci50);
      expect(system?.impactRatings.LnW).toBe(expected.lnW);
      expect(system?.impactRatings.LnWPlusCI).toBe(expected.lnWPlusCI);
      expect(system?.airborneRatings.Rw).toBe(expected.rw);
      expect(system?.airborneRatings.RwCtr).toBeCloseTo(expected.rwCompanion, 10);
    }
  });

  it("keeps the safe TUAS open-box resilient-stud tier explicitly imported", () => {
    const importedOpenBoxShortIds = new Set(
      IMPORTED_TUAS_OPEN_BOX_IDS.map((id) =>
        id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    for (const candidate of IMPORTED_TUAS_OPEN_BOX_SAFE_B_TIER) {
      expect(TUAS_OPEN_BOX_SOURCE_UNIVERSE).toContain(candidate.id);
      expect(importedOpenBoxShortIds.has(candidate.id.toLowerCase())).toBe(true);
    }

    expect(IMPORTED_TUAS_OPEN_BOX_SAFE_B_TIER.map((candidate) => candidate.id)).toEqual(["R2b", "R3b", "R11b"]);
    expect(IMPORTED_TUAS_OPEN_BOX_SAFE_B_TIER.map((candidate) => candidate.lnW)).toEqual([46, 39, 60]);
    expect(IMPORTED_TUAS_OPEN_BOX_SAFE_B_TIER.map((candidate) => candidate.rw)).toEqual([62, 70, 74]);
  });

  it("keeps the TUAS open-box family-a exact tier explicitly imported now that the ceiling split is surfaced", () => {
    const importedOpenBoxShortIds = new Set(
      IMPORTED_TUAS_OPEN_BOX_IDS.map((id) =>
        id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    for (const candidate of IMPORTED_TUAS_OPEN_BOX_FAMILY_A_TIER) {
      expect(TUAS_OPEN_BOX_SOURCE_UNIVERSE).toContain(candidate.id);
      expect(importedOpenBoxShortIds.has(candidate.id.toLowerCase())).toBe(true);
    }

    const ladder = IMPORTED_TUAS_OPEN_BOX_FAMILY_A_TIER.map((candidate) => candidate.id);
    expect(ladder).toEqual(["R3a", "R5a", "R6a"]);

    const lnWs = IMPORTED_TUAS_OPEN_BOX_FAMILY_A_TIER.map((candidate) => candidate.lnW);
    const rws = IMPORTED_TUAS_OPEN_BOX_FAMILY_A_TIER.map((candidate) => candidate.rw);

    expect(lnWs).toEqual([56, 64, 60]);
    expect(rws).toEqual([56, 63, 56]);
  });

  it("keeps the TUAS open-box reinforced b-branch explicit once drawing-backed lower-treatment semantics are imported", () => {
    const importedOpenBoxShortIds = new Set(
      IMPORTED_TUAS_OPEN_BOX_IDS.map((id) =>
        id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    for (const candidate of IMPORTED_TUAS_OPEN_BOX_REINFORCED_B_TIER) {
      expect(TUAS_OPEN_BOX_SOURCE_UNIVERSE).toContain(candidate.id);
      expect(importedOpenBoxShortIds.has(candidate.id.toLowerCase())).toBe(true);
    }

    expect(IMPORTED_TUAS_OPEN_BOX_REINFORCED_B_TIER.map((candidate) => candidate.id)).toEqual(["R6b"]);
    expect(IMPORTED_TUAS_OPEN_BOX_REINFORCED_B_TIER.map((candidate) => candidate.lnW)).toEqual([47]);
    expect(IMPORTED_TUAS_OPEN_BOX_REINFORCED_B_TIER.map((candidate) => candidate.rw)).toEqual([71]);
  });

  it("keeps the TUAS open-box heavy a-branch explicit once the upper EPS board surface is introduced honestly", () => {
    const importedOpenBoxShortIds = new Set(
      IMPORTED_TUAS_OPEN_BOX_IDS.map((id) =>
        id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    for (const candidate of IMPORTED_TUAS_OPEN_BOX_HEAVY_A_TIER) {
      expect(TUAS_OPEN_BOX_SOURCE_UNIVERSE).toContain(candidate.id);
      expect(importedOpenBoxShortIds.has(candidate.id.toLowerCase())).toBe(true);
    }

    expect(IMPORTED_TUAS_OPEN_BOX_HEAVY_A_TIER.map((candidate) => candidate.id)).toEqual(["R7a"]);
    expect(IMPORTED_TUAS_OPEN_BOX_HEAVY_A_TIER.map((candidate) => candidate.lnW)).toEqual([63]);
    expect(IMPORTED_TUAS_OPEN_BOX_HEAVY_A_TIER.map((candidate) => candidate.rw)).toEqual([60]);
  });

  it("keeps the TUAS staged upper-package tier explicit once the dedicated floating-screed schedule is imported", () => {
    const importedOpenBoxShortIds = new Set(
      IMPORTED_TUAS_OPEN_BOX_IDS.map((id) =>
        id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    for (const candidate of IMPORTED_TUAS_OPEN_BOX_STAGED_UPPER_PACKAGE_TIER) {
      expect(TUAS_OPEN_BOX_SOURCE_UNIVERSE).toContain(candidate.id);
      expect(importedOpenBoxShortIds.has(candidate.id.toLowerCase())).toBe(true);
    }

    expect(IMPORTED_TUAS_OPEN_BOX_STAGED_UPPER_PACKAGE_TIER.map((candidate) => candidate.id)).toEqual(["R10a"]);
    expect(IMPORTED_TUAS_OPEN_BOX_STAGED_UPPER_PACKAGE_TIER.map((candidate) => candidate.lnW)).toEqual([55]);
    expect(IMPORTED_TUAS_OPEN_BOX_STAGED_UPPER_PACKAGE_TIER.map((candidate) => candidate.rw)).toEqual([56]);
  });

  it("keeps the TUAS hybrid lower-treatment tier explicit once the no-fill sibling also lands", () => {
    const importedOpenBoxShortIds = new Set(
      IMPORTED_TUAS_OPEN_BOX_IDS.map((id) =>
        id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    for (const candidate of IMPORTED_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_TIER) {
      expect(TUAS_OPEN_BOX_SOURCE_UNIVERSE).toContain(candidate.id);
      expect(importedOpenBoxShortIds.has(candidate.id.toLowerCase())).toBe(true);
    }

    expect(IMPORTED_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_TIER.map((candidate) => candidate.id)).toEqual(["R7b", "R8b", "R9b", "R2c"]);
    expect(IMPORTED_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_TIER.map((candidate) => candidate.lnW)).toEqual([47, 50, 45, 70]);
    expect(IMPORTED_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_TIER.map((candidate) => candidate.rw)).toEqual([72, 72, 68, 54]);
  });

  it("keeps the post-R2c TUAS deferred groups explicit once the no-fill sibling is imported", () => {
    const importedOpenBoxShortIds = new Set(
      IMPORTED_TUAS_OPEN_BOX_IDS.map((id) =>
        id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    expect(AUDITED_TUAS_OPEN_BOX_STAGED_UPPER_PACKAGE_DEFERRED_SET).toEqual([]);
    expect(AUDITED_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_DEFERRED_SET).toEqual([]);

    for (const candidate of [
      ...AUDITED_TUAS_OPEN_BOX_STAGED_UPPER_PACKAGE_DEFERRED_SET,
      ...AUDITED_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_DEFERRED_SET
    ]) {
      expect(TUAS_OPEN_BOX_SOURCE_UNIVERSE).toContain(candidate);
      expect(importedOpenBoxShortIds.has(candidate.toLowerCase())).toBe(false);
    }
  });

  it("keeps the next TUAS open-box support-surface tier empty once the hybrid lower branch closes", () => {
    const importedOpenBoxShortIds = new Set(
      IMPORTED_TUAS_OPEN_BOX_IDS.map((id) =>
        id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    expect(NEXT_TUAS_OPEN_BOX_SUPPORT_SURFACE_ANCHOR_TIER).toEqual([]);
    expect(NEXT_TUAS_OPEN_BOX_SUPPORT_SURFACE_SIBLING_TIER).toEqual([]);
    expect(DEFERRED_TUAS_OPEN_BOX_SUPPORT_SURFACE_VARIANT_TIER).toEqual([]);

    for (const candidate of [
      ...NEXT_TUAS_OPEN_BOX_SUPPORT_SURFACE_ANCHOR_TIER,
      ...NEXT_TUAS_OPEN_BOX_SUPPORT_SURFACE_SIBLING_TIER,
      ...DEFERRED_TUAS_OPEN_BOX_SUPPORT_SURFACE_VARIANT_TIER
    ]) {
      expect(TUAS_OPEN_BOX_SOURCE_UNIVERSE).toContain(candidate);
      expect(importedOpenBoxShortIds.has(candidate.toLowerCase())).toBe(false);
    }
  });

  it("keeps the deferred TUAS CLT universe explicit after the open-box staged-package debt closes", () => {
    const importedCltShortIds = new Set(
      IMPORTED_TUAS_CLT_IDS.map((id) =>
        id.replace(/^tuas_/, "").replace(/_(clt140|clt260)_measured_2026$/, "")
      )
    );

    for (const candidate of DEFERRED_TUAS_CLT_IMPORT_TIER) {
      expect(TUAS_CLT_SOURCE_UNIVERSE).toContain(candidate);
      expect(importedCltShortIds.has(candidate.toLowerCase())).toBe(false);
    }
  });

  it("keeps the landed TUAS staged-upper and heavy dry-top CLT rows explicit once the same-surface carrier debt closes", () => {
    expect(LANDED_TUAS_CLT_STAGED_UPPER_TIER).toEqual([
      { id: "X3", lnW: 52, rw: 49 },
      { id: "C3", lnW: 47, rw: 54 }
    ]);

    for (const candidate of LANDED_TUAS_CLT_STAGED_UPPER_TIER) {
      expect(TUAS_CLT_SOURCE_UNIVERSE).toContain(candidate.id);
      expect(DEFERRED_TUAS_CLT_IMPORT_TIER).not.toContain(candidate.id);
      expect(IMPORTED_TUAS_CLT_IDS.map((id) => id.replace(/^tuas_/, "").replace(/_(clt140|clt260)_measured_2026$/, ""))).toContain(
        candidate.id.toLowerCase()
      );
    }

    expect(LANDED_TUAS_CLT_HEAVY_DRY_TOP_TIER).toEqual([
      { id: "X4", lnW: 50, rw: 55 },
      { id: "C4", lnW: 45, rw: 61 },
      { id: "C5", lnW: 60, rw: 61 }
    ]);
    expect(LANDED_TUAS_CLT_WET_TOP_TIER).toEqual([{ id: "C7", lnW: 39, rw: 57 }]);
    expect(NEXT_TUAS_CLT_HEAVY_DRY_TOP_TIER).toEqual([]);
  });

  it("keeps the first source-backed TUAS combined basic CLT row explicit once the schedule research closes", () => {
    expect(LANDED_TUAS_CLT_COMBINED_BASIC_TIER).toEqual([{ id: "C2c", lnW: 35, rw: 70 }]);

    for (const candidate of LANDED_TUAS_CLT_COMBINED_BASIC_TIER) {
      expect(TUAS_CLT_SOURCE_UNIVERSE).toContain(candidate.id);
      expect(DEFERRED_TUAS_CLT_IMPORT_TIER).not.toContain(candidate.id);
      expect(IMPORTED_TUAS_CLT_IDS.map((id) => id.replace(/^tuas_/, "").replace(/_(clt140|clt260)_measured_2026$/, ""))).toContain(
        candidate.id.toLowerCase()
      );
    }
  });

  it("keeps the first wet combined TUAS CLT row explicit once the drawing-backed visible schedule is landed narrowly", () => {
    expect(LANDED_TUAS_CLT_COMBINED_WET_TIER).toEqual([{ id: "C7c", lnW: 30, rw: 75 }]);

    for (const candidate of LANDED_TUAS_CLT_COMBINED_WET_TIER) {
      expect(TUAS_CLT_SOURCE_UNIVERSE).toContain(candidate.id);
      expect(DEFERRED_TUAS_CLT_IMPORT_TIER).not.toContain(candidate.id);
      expect(IMPORTED_TUAS_CLT_IDS.map((id) => id.replace(/^tuas_/, "").replace(/_(clt140|clt260)_measured_2026$/, ""))).toContain(
        candidate.id.toLowerCase()
      );
    }
  });

  it("keeps the first staged combined TUAS CLT row explicit once the decision matrix selects it", () => {
    expect(LANDED_TUAS_CLT_COMBINED_STAGED_TIER).toEqual([{ id: "C3c", lnW: 27, rw: 73 }]);

    for (const candidate of LANDED_TUAS_CLT_COMBINED_STAGED_TIER) {
      expect(TUAS_CLT_SOURCE_UNIVERSE).toContain(candidate.id);
      expect(DEFERRED_TUAS_CLT_IMPORT_TIER).not.toContain(candidate.id);
      expect(IMPORTED_TUAS_CLT_IDS.map((id) => id.replace(/^tuas_/, "").replace(/_(clt140|clt260)_measured_2026$/, ""))).toContain(
        candidate.id.toLowerCase()
      );
    }
  });

  it("keeps the first heavy-dry combined TUAS CLT row explicit once the C4c candidate lands", () => {
    expect(LANDED_TUAS_CLT_COMBINED_HEAVY_DRY_TIER).toEqual([{ id: "C4c", lnW: 24, rw: 74 }]);

    for (const candidate of LANDED_TUAS_CLT_COMBINED_HEAVY_DRY_TIER) {
      expect(TUAS_CLT_SOURCE_UNIVERSE).toContain(candidate.id);
      expect(DEFERRED_TUAS_CLT_IMPORT_TIER).not.toContain(candidate.id);
      expect(IMPORTED_TUAS_CLT_IDS.map((id) => id.replace(/^tuas_/, "").replace(/_(clt140|clt260)_measured_2026$/, ""))).toContain(
        candidate.id.toLowerCase()
      );
    }
  });

  it("keeps the remaining TUAS CLT backlog grouped by the broader surface debt still blocking them", () => {
    expect(LANDED_TUAS_CLT_HEAVY_DRY_TOP_TIER.map((candidate) => candidate.id)).toEqual(["X4", "C4", "C5"]);
    expect(LANDED_TUAS_CLT_WET_TOP_TIER.map((candidate) => candidate.id)).toEqual(["C7"]);
    expect(LANDED_TUAS_CLT_COMBINED_BASIC_TIER.map((candidate) => candidate.id)).toEqual(["C2c"]);
    expect(LANDED_TUAS_CLT_COMBINED_WET_TIER.map((candidate) => candidate.id)).toEqual(["C7c"]);
    expect(LANDED_TUAS_CLT_COMBINED_STAGED_TIER.map((candidate) => candidate.id)).toEqual(["C3c"]);
    expect(LANDED_TUAS_CLT_COMBINED_HEAVY_DRY_TIER.map((candidate) => candidate.id)).toEqual(["C4c"]);
    expect(NEXT_TUAS_CLT_HEAVY_DRY_TOP_TIER.map((candidate) => candidate.id)).toEqual([]);
    expect(DEFERRED_TUAS_CLT_HEAVY_DRY_TOP_TIER.map((candidate) => candidate.id)).toEqual([]);
    expect(DEFERRED_TUAS_CLT_WET_TOP_TIER.map((candidate) => candidate.id)).toEqual([]);
    expect(DEFERRED_TUAS_CLT_COMBINED_SCREENING_TIER.map((candidate) => candidate.id)).toEqual(["C11c"]);

    const groupedDeferredIds = [
      ...NEXT_TUAS_CLT_HEAVY_DRY_TOP_TIER.map((candidate) => candidate.id),
      ...DEFERRED_TUAS_CLT_HEAVY_DRY_TOP_TIER.map((candidate) => candidate.id),
      ...DEFERRED_TUAS_CLT_WET_TOP_TIER.map((candidate) => candidate.id),
      ...DEFERRED_TUAS_CLT_COMBINED_SCREENING_TIER.map((candidate) => candidate.id)
    ];

    expect(sortedValues(groupedDeferredIds)).toEqual(sortedValues(DEFERRED_TUAS_CLT_IMPORT_TIER));
  });
});

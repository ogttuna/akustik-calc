import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

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
  "tuas_c5c_clt260_measured_2026"
] as const;

const IMPORTED_TUAS_OPEN_BOX_SAFE_B_TIER = [
  { id: "R2b", lnW: 55, rw: 62 },
  { id: "R3b", lnW: 46, rw: 70 },
  { id: "R11b", lnW: 45, rw: 74 }
] as const;

const IMPORTED_TUAS_OPEN_BOX_FAMILY_A_TIER = [
  { id: "R3a", lnW: 61, rw: 56 },
  { id: "R5a", lnW: 56, rw: 63 },
  { id: "R6a", lnW: 64, rw: 56 }
] as const;

const IMPORTED_TUAS_OPEN_BOX_REINFORCED_B_TIER = [
  { id: "R6b", lnW: 44, rw: 71 }
] as const;

const IMPORTED_TUAS_OPEN_BOX_HEAVY_A_TIER = [
  { id: "R7a", lnW: 60, rw: 60 }
] as const;

const IMPORTED_TUAS_OPEN_BOX_STAGED_UPPER_PACKAGE_TIER = [
  { id: "R10a", lnW: 63, rw: 56 }
] as const;

const AUDITED_TUAS_OPEN_BOX_STAGED_UPPER_PACKAGE_DEFERRED_SET = [] as const;

const IMPORTED_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_TIER = [
  { id: "R7b", lnW: 47, rw: 72 },
  { id: "R8b", lnW: 50, rw: 72 },
  { id: "R9b", lnW: 46, rw: 68 },
  { id: "R2c", lnW: 60, rw: 54 }
] as const;

const AUDITED_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_DEFERRED_SET = [] as const;

const NEXT_TUAS_OPEN_BOX_SUPPORT_SURFACE_ANCHOR_TIER = [] as const;
const NEXT_TUAS_OPEN_BOX_SUPPORT_SURFACE_SIBLING_TIER = [] as const;
const DEFERRED_TUAS_OPEN_BOX_SUPPORT_SURFACE_VARIANT_TIER = [] as const;

const LANDED_TUAS_CLT_STAGED_UPPER_TIER = [
  { id: "X3", lnW: 61, rw: 49 },
  { id: "C3", lnW: 55, rw: 54 }
] as const;

const LANDED_TUAS_CLT_HEAVY_DRY_TOP_TIER = [
  { id: "X4", lnW: 52, rw: 55 },
  { id: "C4", lnW: 47, rw: 61 },
  { id: "C5", lnW: 45, rw: 61 }
] as const;

const DEFERRED_TUAS_CLT_IMPORT_TIER = [
  "C7",
  "C2c",
  "C3c",
  "C4c",
  "C7c",
  "C11c"
] as const;

const NEXT_TUAS_CLT_HEAVY_DRY_TOP_TIER = [] as const;

const DEFERRED_TUAS_CLT_HEAVY_DRY_TOP_TIER = [] as const;

const DEFERRED_TUAS_CLT_WET_TOP_TIER = [
  { id: "C7", lnW: 60, rw: 57 }
] as const;

const DEFERRED_TUAS_CLT_COMBINED_SCREENING_TIER = [
  { id: "C2c", lnW: 39, rw: 70 },
  { id: "C3c", lnW: 35, rw: 73 },
  { id: "C4c", lnW: 27, rw: 74 },
  { id: "C7c", lnW: 38, rw: 75 },
  { id: "C11c", lnW: 30, rw: 74 }
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
    expect(IMPORTED_TUAS_OPEN_BOX_SAFE_B_TIER.map((candidate) => candidate.lnW)).toEqual([55, 46, 45]);
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

    expect(lnWs).toEqual([61, 56, 64]);
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
    expect(IMPORTED_TUAS_OPEN_BOX_REINFORCED_B_TIER.map((candidate) => candidate.lnW)).toEqual([44]);
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
    expect(IMPORTED_TUAS_OPEN_BOX_HEAVY_A_TIER.map((candidate) => candidate.lnW)).toEqual([60]);
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
    expect(IMPORTED_TUAS_OPEN_BOX_STAGED_UPPER_PACKAGE_TIER.map((candidate) => candidate.lnW)).toEqual([63]);
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
    expect(IMPORTED_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_TIER.map((candidate) => candidate.lnW)).toEqual([47, 50, 46, 60]);
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
      { id: "X3", lnW: 61, rw: 49 },
      { id: "C3", lnW: 55, rw: 54 }
    ]);

    for (const candidate of LANDED_TUAS_CLT_STAGED_UPPER_TIER) {
      expect(TUAS_CLT_SOURCE_UNIVERSE).toContain(candidate.id);
      expect(DEFERRED_TUAS_CLT_IMPORT_TIER).not.toContain(candidate.id);
      expect(IMPORTED_TUAS_CLT_IDS.map((id) => id.replace(/^tuas_/, "").replace(/_(clt140|clt260)_measured_2026$/, ""))).toContain(
        candidate.id.toLowerCase()
      );
    }

    expect(LANDED_TUAS_CLT_HEAVY_DRY_TOP_TIER).toEqual([
      { id: "X4", lnW: 52, rw: 55 },
      { id: "C4", lnW: 47, rw: 61 },
      { id: "C5", lnW: 45, rw: 61 }
    ]);
    expect(NEXT_TUAS_CLT_HEAVY_DRY_TOP_TIER).toEqual([]);
  });

  it("keeps the remaining TUAS CLT backlog grouped by the broader surface debt still blocking them", () => {
    expect(LANDED_TUAS_CLT_HEAVY_DRY_TOP_TIER.map((candidate) => candidate.id)).toEqual(["X4", "C4", "C5"]);
    expect(NEXT_TUAS_CLT_HEAVY_DRY_TOP_TIER.map((candidate) => candidate.id)).toEqual([]);
    expect(DEFERRED_TUAS_CLT_HEAVY_DRY_TOP_TIER.map((candidate) => candidate.id)).toEqual([]);
    expect(DEFERRED_TUAS_CLT_WET_TOP_TIER.map((candidate) => candidate.id)).toEqual(["C7"]);
    expect(DEFERRED_TUAS_CLT_COMBINED_SCREENING_TIER.map((candidate) => candidate.id)).toEqual([
      "C2c",
      "C3c",
      "C4c",
      "C7c",
      "C11c"
    ]);

    const groupedDeferredIds = [
      ...NEXT_TUAS_CLT_HEAVY_DRY_TOP_TIER.map((candidate) => candidate.id),
      ...DEFERRED_TUAS_CLT_HEAVY_DRY_TOP_TIER.map((candidate) => candidate.id),
      ...DEFERRED_TUAS_CLT_WET_TOP_TIER.map((candidate) => candidate.id),
      ...DEFERRED_TUAS_CLT_COMBINED_SCREENING_TIER.map((candidate) => candidate.id)
    ];

    expect(sortedValues(groupedDeferredIds)).toEqual(sortedValues(DEFERRED_TUAS_CLT_IMPORT_TIER));
  });
});

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
  "tuas_r11b_open_box_timber_measured_2026"
] as const;

const IMPORTED_TUAS_CLT_IDS = [
  "tuas_x2_clt140_measured_2026",
  "tuas_x5_clt140_measured_2026",
  "tuas_c2_clt260_measured_2026",
  "tuas_c5c_clt260_measured_2026"
] as const;

const IMPORTED_TUAS_OPEN_BOX_SAFE_B_TIER = [
  { id: "R2b", lnW: 55, rw: 62 },
  { id: "R3b", lnW: 46, rw: 70 },
  { id: "R11b", lnW: 45, rw: 74 }
] as const;

const IMPORTED_TUAS_OPEN_BOX_FAMILY_A_TIER = [
  { id: "R3a", lnW: 61, rw: 56 },
  { id: "R5a", lnW: 56, rw: 63 }
] as const;

const DEFERRED_TUAS_CLT_IMPORT_TIER = [
  "X3",
  "X4",
  "C3",
  "C4",
  "C5",
  "C7",
  "C2c",
  "C3c",
  "C4c",
  "C7c",
  "C11c"
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
    expect(ladder).toEqual(["R3a", "R5a"]);

    const lnWs = IMPORTED_TUAS_OPEN_BOX_FAMILY_A_TIER.map((candidate) => candidate.lnW);
    const rws = IMPORTED_TUAS_OPEN_BOX_FAMILY_A_TIER.map((candidate) => candidate.rw);

    expect(lnWs).toEqual([61, 56]);
    expect(rws).toEqual([56, 63]);
  });

  it("keeps deferred TUAS CLT candidates explicit while Dataholz CLT dormant slack stays higher priority", () => {
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
});

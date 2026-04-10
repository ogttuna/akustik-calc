import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

const GEOMETRY_CLEARED_TUAS_OPEN_BOX_IMPORTS = [
  { id: "R2b", lnW: 55, rw: 62 }
] as const;

const BRANCH_AUDIT_RESOLVED_TUAS_OPEN_BOX_IMPORTS = [
  { id: "R6b", lnW: 44, rw: 71 },
  { id: "R7a", lnW: 60, rw: 60 }
] as const;

const POST_CORRIDOR_TUAS_OPEN_BOX_GEOMETRY_AUDIT_TIER = [] as const;

const POST_CORRIDOR_TUAS_OPEN_BOX_MIXED_SCHEDULE_DEFERRED_SET = [
  { id: "R6a", lnW: 64, rw: 56 },
  { id: "R10a", lnW: 63, rw: 56 }
] as const;

const POST_CORRIDOR_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_DEFERRED_SET = [
  { id: "R7b", lnW: 47, rw: 72 },
  { id: "R8b", lnW: 50, rw: 72 },
  { id: "R9b", lnW: 46, rw: 68 },
  { id: "R2c", lnW: 60, rw: 54 }
] as const;

describe("TUAS post-corridor screening contract", () => {
  it("keeps the geometry-cleared TUAS basic b-anchor explicit once drawing audit confirms it", () => {
    const importedOpenBoxShortIds = new Set(
      EXACT_FLOOR_SYSTEMS.filter((system) => system.id.includes("_open_box_timber_")).map((system) =>
        system.id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    expect(GEOMETRY_CLEARED_TUAS_OPEN_BOX_IMPORTS.map((candidate) => candidate.id)).toEqual(["R2b"]);
    expect(GEOMETRY_CLEARED_TUAS_OPEN_BOX_IMPORTS.map((candidate) => candidate.lnW)).toEqual([55]);
    expect(GEOMETRY_CLEARED_TUAS_OPEN_BOX_IMPORTS.map((candidate) => candidate.rw)).toEqual([62]);

    for (const candidate of GEOMETRY_CLEARED_TUAS_OPEN_BOX_IMPORTS) {
      expect(importedOpenBoxShortIds.has(candidate.id.toLowerCase())).toBe(true);
    }
  });

  it("keeps the remaining geometry-audit shortlist explicit after the basic b-anchor is imported", () => {
    const importedOpenBoxShortIds = new Set(
      EXACT_FLOOR_SYSTEMS.filter((system) => system.id.includes("_open_box_timber_")).map((system) =>
        system.id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    expect(POST_CORRIDOR_TUAS_OPEN_BOX_GEOMETRY_AUDIT_TIER).toEqual([]);

    for (const candidate of POST_CORRIDOR_TUAS_OPEN_BOX_GEOMETRY_AUDIT_TIER) {
      expect(importedOpenBoxShortIds.has(candidate.id.toLowerCase())).toBe(false);
    }
  });

  it("keeps the branch-audit-resolved reinforced b-row explicit once it lands as an honest exact import", () => {
    const importedOpenBoxShortIds = new Set(
      EXACT_FLOOR_SYSTEMS.filter((system) => system.id.includes("_open_box_timber_")).map((system) =>
        system.id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    expect(BRANCH_AUDIT_RESOLVED_TUAS_OPEN_BOX_IMPORTS.map((candidate) => candidate.id)).toEqual(["R6b", "R7a"]);
    expect(BRANCH_AUDIT_RESOLVED_TUAS_OPEN_BOX_IMPORTS.map((candidate) => candidate.lnW)).toEqual([44, 60]);
    expect(BRANCH_AUDIT_RESOLVED_TUAS_OPEN_BOX_IMPORTS.map((candidate) => candidate.rw)).toEqual([71, 60]);

    for (const candidate of BRANCH_AUDIT_RESOLVED_TUAS_OPEN_BOX_IMPORTS) {
      expect(importedOpenBoxShortIds.has(candidate.id.toLowerCase())).toBe(true);
    }
  });

  it("keeps the mixed-schedule TUAS family-a outliers deferred after drawing audit shows they need new exact surfaces", () => {
    const importedOpenBoxShortIds = new Set(
      EXACT_FLOOR_SYSTEMS.filter((system) => system.id.includes("_open_box_timber_")).map((system) =>
        system.id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    expect(POST_CORRIDOR_TUAS_OPEN_BOX_MIXED_SCHEDULE_DEFERRED_SET.map((candidate) => candidate.id)).toEqual([
      "R6a",
      "R10a"
    ]);
    expect(POST_CORRIDOR_TUAS_OPEN_BOX_MIXED_SCHEDULE_DEFERRED_SET.map((candidate) => candidate.lnW)).toEqual([
      64,
      63
    ]);
    expect(POST_CORRIDOR_TUAS_OPEN_BOX_MIXED_SCHEDULE_DEFERRED_SET.map((candidate) => candidate.rw)).toEqual([
      56,
      56
    ]);

    for (const candidate of POST_CORRIDOR_TUAS_OPEN_BOX_MIXED_SCHEDULE_DEFERRED_SET) {
      expect(importedOpenBoxShortIds.has(candidate.id.toLowerCase())).toBe(false);
    }
  });

  it("keeps the hybrid lower-treatment TUAS outliers deferred after drawing audit shows they need a new support surface", () => {
    const importedOpenBoxShortIds = new Set(
      EXACT_FLOOR_SYSTEMS.filter((system) => system.id.includes("_open_box_timber_")).map((system) =>
        system.id.replace(/^tuas_/, "").replace(/_open_box_timber_measured_2026$/, "")
      )
    );

    expect(POST_CORRIDOR_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_DEFERRED_SET.map((candidate) => candidate.id)).toEqual([
      "R7b",
      "R8b",
      "R9b",
      "R2c"
    ]);
    expect(POST_CORRIDOR_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_DEFERRED_SET.map((candidate) => candidate.lnW)).toEqual([
      47,
      50,
      46,
      60
    ]);
    expect(POST_CORRIDOR_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_DEFERRED_SET.map((candidate) => candidate.rw)).toEqual([
      72,
      72,
      68,
      54
    ]);

    for (const candidate of POST_CORRIDOR_TUAS_OPEN_BOX_HYBRID_LOWER_TREATMENT_DEFERRED_SET) {
      expect(importedOpenBoxShortIds.has(candidate.id.toLowerCase())).toBe(false);
    }
  });
});

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

const GEOMETRY_CLEARED_TUAS_OPEN_BOX_IMPORTS = [
  { id: "R2b", lnW: 55, rw: 62 }
] as const;

const POST_CORRIDOR_TUAS_OPEN_BOX_GEOMETRY_AUDIT_TIER = [
  { id: "R7a", lnW: 60, rw: 60 },
  { id: "R6b", lnW: 44, rw: 71 }
] as const;

const POST_CORRIDOR_TUAS_OPEN_BOX_NUMERIC_DEFERRED_SET = [
  { id: "R6a", lnW: 64, rw: 56 },
  { id: "R10a", lnW: 63, rw: 56 },
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

    expect(POST_CORRIDOR_TUAS_OPEN_BOX_GEOMETRY_AUDIT_TIER.map((candidate) => candidate.id)).toEqual(["R7a", "R6b"]);
    expect(POST_CORRIDOR_TUAS_OPEN_BOX_GEOMETRY_AUDIT_TIER.map((candidate) => candidate.lnW)).toEqual([60, 44]);
    expect(POST_CORRIDOR_TUAS_OPEN_BOX_GEOMETRY_AUDIT_TIER.map((candidate) => candidate.rw)).toEqual([60, 71]);

    for (const candidate of POST_CORRIDOR_TUAS_OPEN_BOX_GEOMETRY_AUDIT_TIER) {
      expect(importedOpenBoxShortIds.has(candidate.id.toLowerCase())).toBe(false);
    }
  });

  it("keeps the currently deferred TUAS open-box numeric outliers explicit until geometry proves they are worth importing", () => {
    expect(POST_CORRIDOR_TUAS_OPEN_BOX_NUMERIC_DEFERRED_SET.map((candidate) => candidate.id)).toEqual([
      "R6a",
      "R10a",
      "R7b",
      "R8b",
      "R9b",
      "R2c"
    ]);
    expect(POST_CORRIDOR_TUAS_OPEN_BOX_NUMERIC_DEFERRED_SET.map((candidate) => candidate.lnW)).toEqual([
      64,
      63,
      47,
      50,
      46,
      60
    ]);
    expect(POST_CORRIDOR_TUAS_OPEN_BOX_NUMERIC_DEFERRED_SET.map((candidate) => candidate.rw)).toEqual([
      56,
      56,
      72,
      72,
      68,
      54
    ]);
  });
});

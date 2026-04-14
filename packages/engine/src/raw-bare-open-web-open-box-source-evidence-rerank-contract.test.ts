import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { BoundFloorSystem, ExactFloorSystem, FloorSystemMatchCriteria } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const RAW_BARE_SOURCE_EVIDENCE_RERANK = {
  sliceId: "raw_bare_open_web_open_box_source_evidence_re_rank_v1",
  outcome: "continue_fail_closed_until_bare_carrier_impact_source_exists",
  runtimeBehaviorChange: false,
  sourceReferences: [
    {
      id: "tuas_mendeley_floor_dataset_v2",
      finding: "open_box_rows_are_measured_packaged_systems_not_bare_carrier_tests",
      url: "https://data.mendeley.com/datasets/y83p8mpryd/2"
    },
    {
      id: "ubiq_inex_floor_fire_acoustic_pdf",
      finding: "open_web_rows_are_inex_finish_and_resilient_ceiling_system_tables_not_bare_carrier_tests",
      url: "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf"
    }
  ],
  candidates: [
    {
      id: "raw_bare_open_box_impact",
      posture: "continue_fail_closed_measured_rows_are_packaged",
      strongestFollowUp: "tuas_open_box_same_package_fragmentation_design_v1"
    },
    {
      id: "raw_bare_open_web_impact",
      posture: "continue_fail_closed_ubiq_rows_are_inex_ceiling_packages",
      strongestFollowUp: "ubiq_open_web_packaged_finish_family_design_v1"
    }
  ],
  selectedNextSlice: "tuas_open_box_same_package_fragmentation_design_v1"
} as const;

const PACKAGE_ROLE_KEYS = [
  "floorCovering",
  "resilientLayer",
  "upperFill",
  "floatingScreed",
  "ceilingCavity",
  "ceilingFill",
  "ceilingBoard"
] as const satisfies readonly (keyof FloorSystemMatchCriteria)[];

function hasAnyPackagedRole(match: FloorSystemMatchCriteria): boolean {
  return PACKAGE_ROLE_KEYS.some((role) => match[role] !== undefined);
}

function isCarrierOnly(match: FloorSystemMatchCriteria): boolean {
  return match.baseStructure !== undefined && !hasAnyPackagedRole(match);
}

function hasMaterial(criteria: FloorSystemMatchCriteria[keyof FloorSystemMatchCriteria], materialId: string): boolean {
  if (!criteria || Array.isArray(criteria)) {
    return false;
  }

  return (
    criteria.materialIds?.includes(materialId) === true ||
    criteria.materialScheduleIds?.includes(materialId) === true
  );
}

function systemIds(systems: readonly (BoundFloorSystem | ExactFloorSystem)[]): readonly string[] {
  return systems.map((system) => system.id).sort();
}

describe("raw bare open-web/open-box source evidence re-rank contract", () => {
  it("records the no-widening source decision before any raw bare impact support is opened", () => {
    expect(RAW_BARE_SOURCE_EVIDENCE_RERANK).toEqual({
      sliceId: "raw_bare_open_web_open_box_source_evidence_re_rank_v1",
      outcome: "continue_fail_closed_until_bare_carrier_impact_source_exists",
      runtimeBehaviorChange: false,
      sourceReferences: [
        {
          id: "tuas_mendeley_floor_dataset_v2",
          finding: "open_box_rows_are_measured_packaged_systems_not_bare_carrier_tests",
          url: "https://data.mendeley.com/datasets/y83p8mpryd/2"
        },
        {
          id: "ubiq_inex_floor_fire_acoustic_pdf",
          finding: "open_web_rows_are_inex_finish_and_resilient_ceiling_system_tables_not_bare_carrier_tests",
          url: "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf"
        }
      ],
      candidates: [
        {
          id: "raw_bare_open_box_impact",
          posture: "continue_fail_closed_measured_rows_are_packaged",
          strongestFollowUp: "tuas_open_box_same_package_fragmentation_design_v1"
        },
        {
          id: "raw_bare_open_web_impact",
          posture: "continue_fail_closed_ubiq_rows_are_inex_ceiling_packages",
          strongestFollowUp: "ubiq_open_web_packaged_finish_family_design_v1"
        }
      ],
      selectedNextSlice: "tuas_open_box_same_package_fragmentation_design_v1"
    });
  });

  it("keeps all TUAS open-box impact rows framed as packaged measured systems, not raw bare carrier evidence", () => {
    const tuasOpenBoxRows = EXACT_FLOOR_SYSTEMS.filter(
      (system) =>
        system.id.startsWith("tuas_") &&
        system.id.includes("_open_box_") &&
        system.match.baseStructure?.materialIds?.includes("open_box_timber_slab") === true
    );

    expect(tuasOpenBoxRows).toHaveLength(15);
    expect(new Set(tuasOpenBoxRows.map((system) => system.sourceLabel))).toEqual(new Set(["TUAS open measured dataset"]));
    expect(systemIds(tuasOpenBoxRows.filter((system) => isCarrierOnly(system.match)))).toEqual([]);
    expect(tuasOpenBoxRows.every((system) => hasAnyPackagedRole(system.match))).toBe(true);
  });

  it("keeps UBIQ open-web impact rows tied to INEX deck and lower-system packages instead of bare joist carriers", () => {
    const ubiqOpenWebExactRows = EXACT_FLOOR_SYSTEMS.filter(
      (system) =>
        system.id.startsWith("ubiq_") &&
        system.id.includes("_open_web_steel_") &&
        system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true
    );
    const ubiqOpenWebBoundRows = BOUND_FLOOR_SYSTEMS.filter(
      (system) =>
        system.id.startsWith("ubiq_") &&
        system.id.includes("_open_web_steel_") &&
        system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true
    );
    const ubiqOpenWebRows = [...ubiqOpenWebExactRows, ...ubiqOpenWebBoundRows];

    expect(ubiqOpenWebExactRows.length).toBeGreaterThan(0);
    expect(ubiqOpenWebBoundRows.length).toBeGreaterThan(0);
    expect(new Set(ubiqOpenWebRows.map((system) => system.sourceLabel))).toEqual(new Set(["UBIQ official system table PDF"]));
    expect(systemIds(ubiqOpenWebRows.filter((system) => isCarrierOnly(system.match)))).toEqual([]);
    expect(ubiqOpenWebRows.every((system) => hasMaterial(system.match.floatingScreed, "inex_floor_panel"))).toBe(true);
    expect(ubiqOpenWebRows.every((system) => system.match.ceilingBoard !== undefined)).toBe(true);
    expect(ubiqOpenWebRows.every((system) => hasMaterial(system.match.ceilingBoard, "firestop_board"))).toBe(true);
  });
});

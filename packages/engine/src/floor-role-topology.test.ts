import type { FloorRole } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  collectCeilingBoardScheduleConflict,
  collectCeilingBoardTopologyConflict,
  collectSingleEntryRoleConflicts,
  hasAmbiguousSingleEntryRoleTopology
} from "./floor-role-topology";

type TestLayer = {
  floorRole?: FloorRole;
  material: {
    id: string;
    name: string;
  };
  thicknessMm?: number;
};

function layer(
  floorRole: TestLayer["floorRole"],
  materialId: string,
  materialName: string,
  thicknessMm: number
): TestLayer {
  return {
    floorRole,
    material: {
      id: materialId,
      name: materialName
    },
    thicknessMm
  };
}

describe("floor-role topology", () => {
  it("treats contiguous same-material single-entry splits as safe", () => {
    const layers = [
      layer("base_structure", "concrete", "Concrete", 150),
      layer("resilient_layer", "generic_resilient_underlay_s30", "Generic Resilient Underlay S30", 8),
      layer("floating_screed", "screed", "Screed", 15),
      layer("floating_screed", "screed", "Screed", 15),
      layer("floor_covering", "ceramic_tile", "Ceramic Tile", 8)
    ];

    expect(collectSingleEntryRoleConflicts(layers)).toEqual([]);
    expect(hasAmbiguousSingleEntryRoleTopology(layers)).toBe(false);
  });

  it("keeps disjoint same-material single-entry splits ambiguous", () => {
    const layers = [
      layer("base_structure", "concrete", "Concrete", 150),
      layer("floor_covering", "ceramic_tile", "Ceramic Tile", 4),
      layer("resilient_layer", "generic_resilient_underlay_s30", "Generic Resilient Underlay S30", 8),
      layer("floor_covering", "ceramic_tile", "Ceramic Tile", 4)
    ];

    expect(collectSingleEntryRoleConflicts(layers)).toEqual([
      {
        count: 2,
        materialLabels: ["Ceramic Tile"],
        role: "floor_covering"
      }
    ]);
    expect(hasAmbiguousSingleEntryRoleTopology(layers)).toBe(true);
  });

  it("keeps mixed-material single-entry duplicates ambiguous", () => {
    const layers = [
      layer("base_structure", "open_box_timber_slab", "Open Box Timber Slab", 370),
      layer("upper_fill", "generic_fill", "Generic Fill", 30),
      layer("upper_fill", "bonded_chippings", "Bonded Chippings", 20),
      layer("floating_screed", "dry_floating_gypsum_fiberboard", "Dry Floating Gypsum Fiberboard", 60)
    ];

    expect(collectSingleEntryRoleConflicts(layers)).toEqual([
      {
        count: 2,
        materialLabels: ["Generic Fill", "Bonded Chippings"],
        role: "upper_fill"
      }
    ]);
    expect(hasAmbiguousSingleEntryRoleTopology(layers)).toBe(true);
  });

  it("ignores uniform ceiling-board schedules but flags mixed ceiling-board schedules", () => {
    const uniformBoards = [
      layer("ceiling_board", "gypsum_board", "Gypsum Board", 13),
      layer("ceiling_board", "gypsum_board", "Gypsum Board", 13)
    ];
    const mixedBoards = [
      layer("ceiling_board", "gypsum_board", "Gypsum Board", 13),
      layer("ceiling_board", "firestop_board", "Firestop Board", 16)
    ];

    expect(collectCeilingBoardScheduleConflict(uniformBoards)).toBeNull();
    expect(collectCeilingBoardScheduleConflict(mixedBoards)).toEqual({
      count: 2,
      materialLabels: ["Gypsum Board", "Firestop Board"],
      role: "ceiling_board"
    });
  });

  it("flags disjoint identical ceiling-board segments as a topology conflict without calling them mixed", () => {
    const disjointBoards = [
      layer("ceiling_board", "firestop_board", "Firestop Board", 16),
      layer("ceiling_cavity", "ubiq_resilient_ceiling", "UBIQ Resilient Ceiling", 65),
      layer("ceiling_board", "firestop_board", "Firestop Board", 16)
    ];

    expect(collectCeilingBoardScheduleConflict(disjointBoards)).toBeNull();
    expect(collectCeilingBoardTopologyConflict(disjointBoards)).toEqual({
      count: 2,
      materialLabels: ["Firestop Board"],
      mixedSchedule: false,
      role: "ceiling_board",
      scheduleSegments: 2
    });
  });

  it("treats contiguous schedule-equivalent ceiling-board splits as safe", () => {
    const splitBoards = [
      layer("ceiling_board", "firestop_board", "Firestop Board", 8),
      layer("ceiling_board", "firestop_board", "Firestop Board", 8),
      layer("ceiling_board", "firestop_board", "Firestop Board", 16)
    ];

    expect(collectCeilingBoardScheduleConflict(splitBoards)).toBeNull();
    expect(collectCeilingBoardTopologyConflict(splitBoards)).toBeNull();
  });
});

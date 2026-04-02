import { describe, expect, it } from "vitest";

import {
  describeSimpleWorkbenchSingleEntryFloorRoleConflict,
  findSimpleWorkbenchSingleEntryFloorRoleConflict
} from "./simple-workbench-floor-role-conflicts";

describe("simple workbench floor-role conflicts", () => {
  it("flags duplicate single-entry floor roles while ignoring multi-board ceiling schedules", () => {
    expect(
      findSimpleWorkbenchSingleEntryFloorRoleConflict(
        [
          { floorRole: "resilient_layer", id: "a" },
          { floorRole: "resilient_layer", id: "b" }
        ],
        "resilient_layer"
      )
    ).toMatchObject({
      count: 2,
      role: "resilient_layer",
      roleLabel: "Resilient layer"
    });

    expect(
      findSimpleWorkbenchSingleEntryFloorRoleConflict(
        [
          { floorRole: "ceiling_board", id: "a" },
          { floorRole: "ceiling_board", id: "b" }
        ],
        "ceiling_board"
      )
    ).toBeNull();
  });

  it("ignores the currently edited row when checking for duplicate single-entry roles", () => {
    expect(
      findSimpleWorkbenchSingleEntryFloorRoleConflict(
        [
          { floorRole: "resilient_layer", id: "a" },
          { floorRole: "resilient_layer", id: "b" }
        ],
        "resilient_layer",
        { ignoreRowId: "a" }
      )
    ).toMatchObject({
      count: 1,
      role: "resilient_layer"
    });

    expect(
      findSimpleWorkbenchSingleEntryFloorRoleConflict([{ floorRole: "resilient_layer", id: "a" }], "resilient_layer", {
        ignoreRowId: "a"
      })
    ).toBeNull();
  });

  it("describes composer and editor conflicts without implying the stack is invalid", () => {
    const conflict = findSimpleWorkbenchSingleEntryFloorRoleConflict([{ floorRole: "base_structure", id: "a" }], "base_structure");
    expect(conflict).not.toBeNull();

    expect(
      describeSimpleWorkbenchSingleEntryFloorRoleConflict(conflict!, {
        context: "composer",
        replaceBaseAvailable: true
      })
    ).toContain("Use Replace base");

    expect(
      describeSimpleWorkbenchSingleEntryFloorRoleConflict(conflict!, {
        context: "editor"
      })
    ).toContain("Keeping this duplicate role is allowed");
  });
});

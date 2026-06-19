import { describe, expect, it } from "vitest";

import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  buildWorkbenchV2ProjectSnapshot
} from "./workbench-v2-project-snapshot";
import {
  formatWorkbenchV2PresetLayerCount,
  formatWorkbenchV2PresetLibraryTriggerStatus,
  formatWorkbenchV2PresetTriggerStatus,
  parseWorkbenchV2PresetRecord,
  parseWorkbenchV2PresetSummaries,
  workbenchV2SnapshotsRepresentSameDraft
} from "./workbench-v2-presets";

function makeSnapshot(input?: { id?: string; selectedLayerId?: string | null; thicknessMm?: string; wallCavity1DepthMm?: string }) {
  const layers = [
    {
      id: "layer-a",
      materialId: "gypsum_board",
      role: "side_a",
      thicknessMm: input?.thicknessMm ?? "12.5"
    },
    {
      id: "layer-b",
      materialId: "concrete",
      role: "side_b",
      thicknessMm: "100"
    }
  ];

  return buildWorkbenchV2ProjectSnapshot({
    context: {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      wallCavity1DepthMm: input?.wallCavity1DepthMm ?? ""
    },
    customMaterials: [],
    id: input?.id ?? "snapshot-a",
    layers,
    materialVisualOverrides: [],
    mode: "wall",
    name: input?.id ?? "Snapshot",
    savedAtIso: input?.id === "snapshot-b" ? "2026-06-15T11:00:00.000Z" : "2026-06-15T10:00:00.000Z",
    selectedLayerId: input?.selectedLayerId ?? "layer-a",
    selectedOutputs: ["Rw", "STC"]
  });
}

describe("workbench v2 preset helpers", () => {
  it("parses list summaries defensively", () => {
    const summaries = parseWorkbenchV2PresetSummaries({
      presets: [
        {
          createdAtIso: "2026-06-15T10:00:00.000Z",
          hasCustomMaterials: true,
          hasVisualOverrides: true,
          id: "preset-1",
          kind: "wall",
          layerCount: 2,
          name: "Wall preset",
          selectedOutputCount: 2,
          updatedAtIso: "2026-06-15T10:05:00.000Z"
        },
        {
          id: "broken",
          kind: "ceiling",
          name: "Broken preset"
        }
      ]
    });

    expect(summaries).toEqual([
      {
        createdAtIso: "2026-06-15T10:00:00.000Z",
        hasCustomMaterials: true,
        hasVisualOverrides: true,
        id: "preset-1",
        kind: "wall",
        layerCount: 2,
        name: "Wall preset",
        selectedOutputCount: 2,
        updatedAtIso: "2026-06-15T10:05:00.000Z"
      }
    ]);
    expect(parseWorkbenchV2PresetSummaries({ presets: "not-array" })).toEqual([]);
  });

  it("requires a full snapshot on detail records", () => {
    expect(
      parseWorkbenchV2PresetRecord({
        preset: {
          createdAtIso: "2026-06-15T10:00:00.000Z",
          id: "preset-1",
          kind: "floor",
          layerCount: 1,
          name: "Floor preset",
          snapshot: {
            schemaId: "dynecho.workbench-v2.snapshot.v1"
          },
          updatedAtIso: "2026-06-15T10:05:00.000Z"
        }
      })
    ).toMatchObject({
      kind: "floor",
      name: "Floor preset",
      snapshot: {
        schemaId: "dynecho.workbench-v2.snapshot.v1"
      }
    });
    expect(
      parseWorkbenchV2PresetRecord({
        preset: {
          createdAtIso: "2026-06-15T10:00:00.000Z",
          id: "preset-1",
          kind: "floor",
          layerCount: 1,
          name: "Floor preset",
          updatedAtIso: "2026-06-15T10:05:00.000Z"
        }
      })
    ).toBeNull();
  });

  it("formats compact status labels", () => {
    expect(formatWorkbenchV2PresetLayerCount(1)).toBe("1 layer");
    expect(formatWorkbenchV2PresetLayerCount(3)).toBe("3 layers");
    expect(formatWorkbenchV2PresetTriggerStatus(0)).toBe("No templates");
    expect(formatWorkbenchV2PresetTriggerStatus(2)).toBe("2 saved");
    expect(formatWorkbenchV2PresetLibraryTriggerStatus(0, 4)).toBe("4 common");
    expect(formatWorkbenchV2PresetLibraryTriggerStatus(2, 4)).toBe("2 saved, 4 common");
    expect(formatWorkbenchV2PresetLibraryTriggerStatus(2, 0)).toBe("2 saved");
  });

  it("compares preset draft content without metadata noise", () => {
    expect(
      workbenchV2SnapshotsRepresentSameDraft(
        makeSnapshot({
          id: "snapshot-a",
          selectedLayerId: "layer-a"
        }),
        makeSnapshot({
          id: "snapshot-b",
          selectedLayerId: "layer-b"
        })
      )
    ).toBe(true);

    expect(
      workbenchV2SnapshotsRepresentSameDraft(
        makeSnapshot({
          thicknessMm: "12.5"
        }),
        makeSnapshot({
          thicknessMm: "15"
        })
      )
    ).toBe(false);
    expect(
      workbenchV2SnapshotsRepresentSameDraft(
        makeSnapshot({
          wallCavity1DepthMm: ""
        }),
        makeSnapshot({
          wallCavity1DepthMm: "50"
        })
      )
    ).toBe(false);
  });
});

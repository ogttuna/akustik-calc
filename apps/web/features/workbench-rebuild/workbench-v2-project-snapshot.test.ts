import { describe, expect, it } from "vitest";

import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  WORKBENCH_V2_PROJECT_SNAPSHOT_SCHEMA_ID,
  buildWorkbenchV2ProjectSnapshot,
  parseWorkbenchV2ProjectSnapshot
} from "./workbench-v2-project-snapshot";

const customMaterial = {
  acoustic: {
    absorberClass: "porous_absorptive" as const,
    behavior: "porous_absorber" as const,
    flowResistivityPaSM2: 12000,
    notes: [],
    propertySourceStatus: "user_supplied" as const
  },
  category: "insulation" as const,
  densityKgM3: 45,
  id: "custom_snapshot_wool",
  name: "Snapshot wool",
  tags: ["custom-workbench-material", "insulation", "porous_absorber"]
};

describe("workbench v2 project snapshot", () => {
  it("builds and parses a material-aware project snapshot", () => {
    const snapshot = buildWorkbenchV2ProjectSnapshot({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        wallTopologyMode: "double_leaf_framed",
        wallCavity1FillCoverage: "full"
      },
      customMaterials: [customMaterial],
      id: "snapshot-1",
      layers: [
        { id: "layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
        { id: "layer-2", materialId: customMaterial.id, role: "cavity", thicknessMm: "50" }
      ],
      materialVisualOverrides: [
        {
          fillColor: "#123456",
          materialId: customMaterial.id,
          updatedAtIso: "2026-06-12T10:00:00.000Z"
        }
      ],
      mode: "wall",
      name: "Material editor server replay",
      savedAtIso: "2026-06-12T10:00:00.000Z",
      selectedLayerId: "layer-2",
      selectedOutputs: ["Rw", "DnT,w"]
    });
    const parsed = parseWorkbenchV2ProjectSnapshot(snapshot);

    expect(snapshot.schemaId).toBe(WORKBENCH_V2_PROJECT_SNAPSHOT_SCHEMA_ID);
    expect(parsed).toMatchObject({
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      snapshot: {
        context: {
          wallCavity1FillCoverage: "full",
          wallTopologyMode: "double_leaf_framed"
        },
        customMaterials: [customMaterial],
        materialVisualOverrides: [
          {
            fillColor: "#123456",
            materialId: customMaterial.id
          }
        ],
        mode: "wall",
        selectedLayerId: "layer-2",
        selectedOutputs: ["Rw", "DnT,w"]
      }
    });
  });

  it("rejects unmarked snapshots and sanitizes invalid material editor state", () => {
    expect(parseWorkbenchV2ProjectSnapshot({ id: "snapshot-1" }).snapshot).toBeNull();

    const parsed = parseWorkbenchV2ProjectSnapshot({
      context: {
        airborneMode: "invalid",
        wallSupportTopology: "direct_fixed"
      },
      customMaterials: [
        customMaterial,
        { ...customMaterial, name: "Duplicate snapshot wool" },
        { ...customMaterial, id: "gypsum_board", name: "Seed collision" },
        { id: "broken" }
      ],
      id: "snapshot-2",
      layers: [
        { id: "layer-1", materialId: "custom_missing", role: "side_a", thicknessMm: "12.5" },
        { id: "", materialId: "broken", role: "side_b", thicknessMm: "10" }
      ],
      materialVisualOverrides: [
        { fillColor: "#abc", materialId: customMaterial.id, updatedAtIso: "2026-06-12T10:00:00.000Z" },
        { fillColor: "white", materialId: "custom_invalid", updatedAtIso: "2026-06-12T10:01:00.000Z" }
      ],
      mode: "wall",
      name: "Material editor sanitized replay",
      savedAtIso: "2026-06-12T10:00:00.000Z",
      schemaId: WORKBENCH_V2_PROJECT_SNAPSHOT_SCHEMA_ID,
      selectedLayerId: "missing-layer",
      selectedOutputs: ["Rw", "invalid"]
    });

    expect(parsed.droppedCustomMaterials).toBe(3);
    expect(parsed.droppedVisualOverrides).toBe(1);
    expect(parsed.snapshot).toMatchObject({
      context: {
        airborneMode: "element_lab",
        wallSupportTopology: "direct_fixed"
      },
      customMaterials: [customMaterial],
      layers: [
        {
          id: "layer-1",
          materialId: "custom_missing"
        }
      ],
      materialVisualOverrides: [
        {
          fillColor: "#aabbcc",
          materialId: customMaterial.id
        }
      ],
      selectedLayerId: "layer-1",
      selectedOutputs: ["Rw"]
    });

    const fallbackOutputs = parseWorkbenchV2ProjectSnapshot({
      context: {},
      customMaterials: [],
      id: "snapshot-3",
      layers: [{ id: "floor-layer-1", materialId: "concrete", role: "base", thicknessMm: "150" }],
      materialVisualOverrides: [],
      mode: "floor",
      name: "Fallback floor replay",
      savedAtIso: "2026-06-12T10:00:00.000Z",
      schemaId: WORKBENCH_V2_PROJECT_SNAPSHOT_SCHEMA_ID,
      selectedLayerId: "floor-layer-1",
      selectedOutputs: ["invalid"]
    });

    expect(fallbackOutputs.snapshot?.selectedOutputs).toEqual(["Ln,w"]);
  });
});

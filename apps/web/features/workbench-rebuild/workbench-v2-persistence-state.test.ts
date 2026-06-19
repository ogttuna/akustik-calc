import { describe, expect, it } from "vitest";

import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  buildWorkbenchV2ProjectSnapshot,
  type WorkbenchV2ProjectSnapshot
} from "./workbench-v2-project-snapshot";
import {
  deriveWorkbenchV2PersistenceState,
  getWorkbenchV2DraftDirtyState
} from "./workbench-v2-persistence-state";

function makeSnapshot(patch: Partial<WorkbenchV2ProjectSnapshot> = {}): WorkbenchV2ProjectSnapshot {
  return buildWorkbenchV2ProjectSnapshot({
    context: {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      wallCavity1DepthMm: patch.context?.wallCavity1DepthMm ?? ""
    },
    customMaterials: patch.customMaterials ?? [],
    id: patch.id ?? "snapshot-a",
    layers: patch.layers ?? [{ id: "layer-a", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" }],
    materialVisualOverrides: patch.materialVisualOverrides ?? [],
    mode: patch.mode ?? "wall",
    name: patch.name ?? "Stack",
    savedAtIso: patch.savedAtIso ?? "2026-06-16T09:00:00.000Z",
    selectedLayerId: patch.selectedLayerId ?? "layer-a",
    selectedOutputs: patch.selectedOutputs ?? ["Rw"]
  });
}

describe("Workbench V2 persistence state", () => {
  it("ignores snapshot metadata and focus-only changes when checking dirty state", () => {
    expect(
      getWorkbenchV2DraftDirtyState(
        makeSnapshot({
          id: "snapshot-b",
          name: "Renamed draft",
          savedAtIso: "2026-06-16T10:00:00.000Z",
          selectedLayerId: "missing-layer"
        }),
        makeSnapshot()
      )
    ).toBe(false);

    expect(
      getWorkbenchV2DraftDirtyState(
        makeSnapshot({
          layers: [{ id: "layer-a", materialId: "gypsum_board", role: "side_a", thicknessMm: "15" }]
        }),
        makeSnapshot()
      )
    ).toBe(true);
  });

  it("derives local, project draft, clean combination, dirty combination, and template states", () => {
    expect(
      deriveWorkbenchV2PersistenceState({
        activeAssembly: null,
        activeAssemblyDirty: false,
        activeAssemblyHasBaseline: false,
        project: null
      })
    ).toMatchObject({ kind: "localDraft", primaryActionLabel: "Choose project", title: "Local draft" });

    expect(
      deriveWorkbenchV2PersistenceState({
        activeAssembly: null,
        activeAssemblyDirty: false,
        activeAssemblyHasBaseline: false,
        project: { id: "project-a", name: "Hotel" }
      })
    ).toMatchObject({ kind: "projectDraft", primaryActionLabel: "Save as new combination", title: "Hotel / Unsaved stack" });

    expect(
      deriveWorkbenchV2PersistenceState({
        activeAssembly: { id: "assembly-a", name: "Wall A", version: 3 },
        activeAssemblyDirty: false,
        activeAssemblyHasBaseline: true,
        project: { id: "project-a", name: "Hotel" }
      })
    ).toMatchObject({ kind: "combinationClean", primaryActionLabel: "Saved", statusLabel: "Saved / v3" });

    expect(
      deriveWorkbenchV2PersistenceState({
        activeAssembly: { id: "assembly-a", name: "Wall A", version: 3 },
        activeAssemblyDirty: true,
        activeAssemblyHasBaseline: true,
        project: { id: "project-a", name: "Hotel" }
      })
    ).toMatchObject({ kind: "combinationDirty", primaryActionLabel: "Update combination", statusLabel: "Modified / v3" });

    expect(
      deriveWorkbenchV2PersistenceState({
        activeAssembly: null,
        activeAssemblyDirty: false,
        activeAssemblyHasBaseline: false,
        project: { id: "project-a", name: "Hotel" },
        templateName: "W112 template"
      })
    ).toMatchObject({ kind: "templateDraft", primaryActionLabel: "Save as new combination", title: "Hotel / W112 template / Unsaved stack" });
  });
});

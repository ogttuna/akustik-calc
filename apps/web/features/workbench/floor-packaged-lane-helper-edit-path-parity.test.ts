import type { FloorRole, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

type ScenarioRow = {
  floorRole?: FloorRole;
  materialId: string;
  thicknessMm: string;
};

type StoreRow = ScenarioRow & { id: string };

type StoreHandle = {
  getState: () => {
    addRow: () => void;
    appendRows: (rows: readonly ScenarioRow[]) => void;
    duplicateRow: (id: string) => void;
    moveRow: (id: string, direction: "up" | "down") => void;
    removeRow: (id: string) => void;
    reset: () => void;
    rows: StoreRow[];
    startStudyMode: (studyMode: "floor" | "wall") => void;
    updateFloorRole: (id: string, floorRole?: FloorRole) => void;
    updateMaterial: (id: string, materialId: string) => void;
    updateThickness: (id: string, thicknessMm: string) => void;
  };
};

type EditPathParityCase = {
  applyEdits: (store: StoreHandle) => void;
  canonical: readonly ScenarioRow[];
  directFinal: readonly ScenarioRow[];
  id: string;
};

const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();

  return {
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.has(key) ? values.get(key)! : null;
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null;
    },
    get length() {
      return values.size;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    }
  };
}

function normalizeRows(rows: readonly StoreRow[]) {
  return rows.map((row) => ({
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function moveCurrentRowToIndex(store: StoreHandle, rowId: string, targetIndex: number) {
  while (true) {
    const currentIndex = store.getState().rows.findIndex((row) => row.id === rowId);

    expect(currentIndex).toBeGreaterThanOrEqual(0);

    if (currentIndex === targetIndex) {
      return;
    }

    store.getState().moveRow(rowId, currentIndex > targetIndex ? "up" : "down");
  }
}

function rebuildRowAtIndex(
  store: StoreHandle,
  row: ScenarioRow,
  targetIndex: number
) {
  store.getState().addRow();

  const rebuilt = store.getState().rows.at(-1)!;
  store.getState().updateMaterial(rebuilt.id, row.materialId);
  store.getState().updateFloorRole(rebuilt.id, row.floorRole);
  store.getState().updateThickness(rebuilt.id, row.thicknessMm);
  moveCurrentRowToIndex(store, rebuilt.id, targetIndex);
}

function snapshot(id: string, rows: readonly StoreRow[]) {
  const scenario = evaluateScenario({
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: id,
    rows,
    source: "current",
    studyMode: "floor",
    targetOutputs: FIELD_OUTPUTS
  });

  return {
    basis: scenario.result?.impact?.basis ?? null,
    candidateIds: scenario.result?.impact?.estimateCandidateIds ?? null,
    kind: scenario.result?.floorSystemEstimate?.kind ?? null,
    statuses: scenario.result
      ? (Object.fromEntries(
          FIELD_OUTPUTS.map((output) => [
            output,
            buildOutputCard({
              output,
              result: scenario.result!,
              studyMode: "floor"
            }).status
          ])
        ) as Record<RequestedOutputId, "live" | "needs_input" | "unsupported">)
      : null,
    supported: scenario.result?.supportedTargetOutputs ?? null,
    unsupported: scenario.result?.unsupportedTargetOutputs ?? null,
    warnings: scenario.warnings
  };
}

const CASES: readonly EditPathParityCase[] = [
  {
    id: "open-web fill-disjoint helper edit path",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
    ],
    directFinal: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "70" },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "75" },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
    ],
    applyEdits(store) {
      const state = store.getState();
      const fill = state.rows[2]!;

      state.duplicateRow(fill.id);
      const duplicate = store.getState().rows[3]!;

      state.updateThickness(fill.id, "70");
      state.updateThickness(duplicate.id, "75");
      moveCurrentRowToIndex(store, duplicate.id, 4);

      state.removeRow(fill.id);
      rebuildRowAtIndex(store, { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "70" }, 2);
    }
  },
  {
    id: "open-web cavity-disjoint helper edit path",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
    ],
    directFinal: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "30" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "35" },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
    ],
    applyEdits(store) {
      const state = store.getState();
      const cavity = state.rows[3]!;

      state.duplicateRow(cavity.id);
      const duplicate = store.getState().rows[4]!;

      state.updateThickness(cavity.id, "30");
      state.updateThickness(duplicate.id, "35");
      moveCurrentRowToIndex(store, cavity.id, 2);
    }
  },
  {
    id: "composite fill-disjoint helper edit path",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "15" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "15" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "150" },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: "150" }
    ],
    directFinal: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "15" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "15" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "25" },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "150" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "25" },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: "150" }
    ],
    applyEdits(store) {
      const state = store.getState();
      const fill = state.rows[2]!;

      state.duplicateRow(fill.id);
      const duplicate = store.getState().rows[3]!;

      state.updateThickness(fill.id, "25");
      state.updateThickness(duplicate.id, "25");
      moveCurrentRowToIndex(store, duplicate.id, 4);

      state.removeRow(fill.id);
      rebuildRowAtIndex(store, { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "25" }, 2);
    }
  },
  {
    id: "composite cavity-disjoint helper edit path",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "15" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "15" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "150" },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: "150" }
    ],
    directFinal: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "15" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "15" },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "75" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "75" },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: "150" }
    ],
    applyEdits(store) {
      const state = store.getState();
      const cavity = state.rows[3]!;

      state.duplicateRow(cavity.id);
      const duplicate = store.getState().rows[4]!;

      state.updateThickness(cavity.id, "75");
      state.updateThickness(duplicate.id, "75");
      moveCurrentRowToIndex(store, cavity.id, 2);
    }
  },
  {
    id: "CLT fill-disjoint helper fail-closed edit path",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
    ],
    directFinal: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
    ],
    applyEdits(store) {
      const state = store.getState();
      const fill = state.rows[1]!;

      state.duplicateRow(fill.id);
      const duplicate = store.getState().rows[2]!;

      state.updateThickness(fill.id, "50");
      state.updateThickness(duplicate.id, "50");
      moveCurrentRowToIndex(store, duplicate.id, 3);
    }
  },
  {
    id: "open-box cavity-disjoint helper fail-closed edit path",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "90" },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "28" },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
    ],
    directFinal: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "14" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "90" },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "14" },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
    ],
    applyEdits(store) {
      const state = store.getState();
      const cavity = state.rows[2]!;

      state.duplicateRow(cavity.id);
      const duplicate = store.getState().rows[3]!;

      state.updateThickness(cavity.id, "14");
      state.updateThickness(duplicate.id, "14");
      moveCurrentRowToIndex(store, cavity.id, 1);
    }
  }
];

describe("floor packaged-lane helper edit-path parity", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps lower-only helper detours stable after duplicate, swap, remove, and rebuild store edits", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    for (const testCase of CASES) {
      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(testCase.directFinal);
      const directSnapshot = snapshot(`${testCase.id}-direct`, useWorkbenchStore.getState().rows);

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(testCase.canonical);
      testCase.applyEdits(useWorkbenchStore as unknown as StoreHandle);

      expect(normalizeRows(useWorkbenchStore.getState().rows), `${testCase.id} final rows`).toEqual(testCase.directFinal);
      expect(snapshot(`${testCase.id}-edited`, useWorkbenchStore.getState().rows), `${testCase.id} final snapshot`).toEqual(
        directSnapshot
      );
    }
  });
});

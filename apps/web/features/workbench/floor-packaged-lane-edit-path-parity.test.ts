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
    id: "composite lower-only non-packable edit path",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "15" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "15" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "150" },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: "150" }
    ],
    directFinal: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "14" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "8" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "8" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "150" },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: "150" }
    ],
    applyEdits(store) {
      const state = store.getState();
      const first = state.rows[0]!;
      const second = state.rows[1]!;

      state.duplicateRow(first.id);

      const duplicate = store.getState().rows[1]!;
      state.updateThickness(first.id, "8");
      state.updateThickness(duplicate.id, "14");
      state.updateThickness(second.id, "8");
      moveCurrentRowToIndex(store, duplicate.id, 0);

      state.removeRow(second.id);
      state.addRow();

      const rebuilt = store.getState().rows.at(-1)!;
      state.updateMaterial(rebuilt.id, "firestop_board");
      state.updateFloorRole(rebuilt.id, "ceiling_board");
      state.updateThickness(rebuilt.id, "8");
      moveCurrentRowToIndex(store, rebuilt.id, 2);
    }
  },
  {
    id: "open-web lower-only non-packable edit path",
    canonical: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
    ],
    directFinal: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "14" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "9" },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "9" },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
    ],
    applyEdits(store) {
      const state = store.getState();
      const first = state.rows[0]!;
      const second = state.rows[1]!;

      state.duplicateRow(first.id);

      const duplicate = store.getState().rows[1]!;
      state.updateThickness(first.id, "9");
      state.updateThickness(duplicate.id, "14");
      state.updateThickness(second.id, "9");
      moveCurrentRowToIndex(store, duplicate.id, 0);

      state.removeRow(second.id);
      state.addRow();

      const rebuilt = store.getState().rows.at(-1)!;
      state.updateMaterial(rebuilt.id, "firestop_board");
      state.updateFloorRole(rebuilt.id, "ceiling_board");
      state.updateThickness(rebuilt.id, "9");
      moveCurrentRowToIndex(store, rebuilt.id, 2);
    }
  },
  {
    id: "clt lower-only fail-closed edit path",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
    ],
    directFinal: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "5" },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "5" },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "3" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
    ],
    applyEdits(store) {
      const state = store.getState();
      const first = state.rows[0]!;

      state.duplicateRow(first.id);
      const secondPiece = store.getState().rows[1]!;
      state.duplicateRow(first.id);
      const thirdPiece = store.getState().rows[1]!;

      state.updateThickness(first.id, "5");
      state.updateThickness(secondPiece.id, "5");
      state.updateThickness(thirdPiece.id, "3");
      moveCurrentRowToIndex(store, thirdPiece.id, 2);

      state.removeRow(secondPiece.id);
      state.addRow();

      const rebuilt = store.getState().rows.at(-1)!;
      state.updateMaterial(rebuilt.id, "gypsum_board");
      state.updateFloorRole(rebuilt.id, "ceiling_board");
      state.updateThickness(rebuilt.id, "5");
      moveCurrentRowToIndex(store, rebuilt.id, 1);
    }
  },
  {
    id: "open-box lower-only fail-closed edit path",
    canonical: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "90" },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "28" },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
    ],
    directFinal: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "5" },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "5" },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "3" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "90" },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "28" },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
    ],
    applyEdits(store) {
      const state = store.getState();
      const first = state.rows[0]!;

      state.duplicateRow(first.id);
      const secondPiece = store.getState().rows[1]!;
      state.duplicateRow(first.id);
      const thirdPiece = store.getState().rows[1]!;

      state.updateThickness(first.id, "5");
      state.updateThickness(secondPiece.id, "5");
      state.updateThickness(thirdPiece.id, "3");
      moveCurrentRowToIndex(store, thirdPiece.id, 2);

      state.removeRow(secondPiece.id);
      state.addRow();

      const rebuilt = store.getState().rows.at(-1)!;
      state.updateMaterial(rebuilt.id, "gypsum_board");
      state.updateFloorRole(rebuilt.id, "ceiling_board");
      state.updateThickness(rebuilt.id, "5");
      moveCurrentRowToIndex(store, rebuilt.id, 1);
    }
  }
];

describe("floor packaged-lane edit-path parity", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps lower-only packaged and guarded lanes stable after duplicate, swap, remove, and rebuild detours", async () => {
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

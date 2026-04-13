import type { RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type AppendableRow = Omit<LayerDraft, "id">;

type StoreHandle = {
  getState: () => {
    appendRows: (rows: readonly AppendableRow[]) => void;
    duplicateRow: (id: string) => void;
    loadSavedScenario: (scenarioId: string) => void;
    moveRow: (id: string, direction: "up" | "down") => void;
    reset: () => void;
    rows: LayerDraft[];
    saveCurrentScenario: () => void;
    savedScenarios: Array<{ id: string }>;
    startStudyMode: (studyMode: "floor" | "wall") => void;
    updateThickness: (id: string, thicknessMm: string) => void;
  };
};

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type RouteSnapshot = {
  basis: string | null;
  cards: Record<FieldOutput, CardSnapshot>;
  exactMatchId: string | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  rw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type BoundaryCase = {
  expected: RouteSnapshot;
  id: string;
  laminateParts: readonly [string, string];
  warningIncludes: readonly RegExp[];
};

const FIELD_OUTPUTS = ["Rw", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
type FieldOutput = (typeof FIELD_OUTPUTS)[number];

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const OPEN_BOX_BASIC_ROWS: readonly AppendableRow[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "10" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const WALL_DETOUR_ROWS: readonly AppendableRow[] = [
  { materialId: "security_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "security_board", thicknessMm: "12.5" },
  { materialId: "ytong_aac_d700", thicknessMm: "100" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "rockwool", thicknessMm: "40" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const EXPECTED_VALID_SOURCE_BAND: RouteSnapshot = {
  basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
  cards: {
    Rw: { status: "live", value: "62 dB" },
    "Ln,w": { status: "live", value: "46 dB" },
    "L'n,w": { status: "live", value: "48 dB" },
    "L'nT,w": { status: "live", value: "45.6 dB" }
  },
  exactMatchId: "tuas_r2b_open_box_timber_measured_2026",
  lPrimeNTw: 45.6,
  lPrimeNW: 48,
  lnW: 46,
  rw: 62,
  supported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"],
  unsupported: []
};

const EXPECTED_OUTSIDE_SOURCE_BAND: RouteSnapshot = {
  basis: null,
  cards: {
    Rw: { status: "live", value: "44 dB" },
    "Ln,w": { status: "unsupported", value: "Not ready" },
    "L'n,w": { status: "needs_input", value: "Not ready" },
    "L'nT,w": { status: "needs_input", value: "Not ready" }
  },
  exactMatchId: null,
  lPrimeNTw: null,
  lPrimeNW: null,
  lnW: null,
  rw: 44,
  supported: ["Rw"],
  unsupported: ["Ln,w", "L'n,w", "L'nT,w"]
};

const CASES: readonly BoundaryCase[] = [
  {
    id: "open-box-source-band-10mm-laminate-split",
    laminateParts: ["4", "6"],
    expected: EXPECTED_VALID_SOURCE_BAND,
    warningIncludes: [/curated exact floor-system match active: TUAS R2b/i]
  },
  {
    id: "open-box-outside-source-band-12mm-laminate-split",
    laminateParts: ["6", "6"],
    expected: EXPECTED_OUTSIDE_SOURCE_BAND,
    warningIncludes: [/impact sound outputs are not available/i, /closest family candidate is TUAS R2b/i]
  }
];

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

function normalizeRows(rows: readonly LayerDraft[]) {
  return rows.map((row) => ({
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function buildExpectedRows(parts: readonly [string, string]): readonly AppendableRow[] {
  return [
    ...OPEN_BOX_BASIC_ROWS.slice(0, 4),
    { ...OPEN_BOX_BASIC_ROWS[4]!, thicknessMm: parts[0] },
    { ...OPEN_BOX_BASIC_ROWS[4]!, thicknessMm: parts[1] },
    ...OPEN_BOX_BASIC_ROWS.slice(5)
  ];
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

function splitLaminateThroughEditHistory(store: StoreHandle, parts: readonly [string, string]) {
  const targetIndex = store.getState().rows.findIndex((row) => row.floorRole === "floor_covering");

  expect(targetIndex).toBeGreaterThanOrEqual(0);

  const targetId = store.getState().rows[targetIndex]!.id;
  store.getState().duplicateRow(targetId);

  const rowsAfterDuplicate = store.getState().rows;
  const firstId = rowsAfterDuplicate[targetIndex]!.id;
  const secondId = rowsAfterDuplicate[targetIndex + 1]!.id;

  store.getState().updateThickness(firstId, parts[0]);
  store.getState().updateThickness(secondId, parts[1]);

  // Bounce the duplicate away and back to catch store-history order drift while
  // preserving the final contiguous source-band package.
  moveCurrentRowToIndex(store, secondId, targetIndex + 2);
  moveCurrentRowToIndex(store, secondId, targetIndex + 1);
}

function roundTripThroughMixedMode(store: StoreHandle) {
  store.getState().saveCurrentScenario();

  const floorScenarioId = store.getState().savedScenarios.at(-1)?.id;
  if (!floorScenarioId) {
    throw new Error("Expected a saved floor scenario id.");
  }

  store.getState().startStudyMode("wall");
  store.getState().appendRows(WALL_DETOUR_ROWS);
  store.getState().saveCurrentScenario();
  store.getState().startStudyMode("floor");
  store.getState().loadSavedScenario(floorScenarioId);
}

function snapshot(id: string, rows: readonly LayerDraft[]): {
  route: RouteSnapshot;
  warnings: readonly string[];
} {
  const evaluated = evaluateScenario({
    id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: id,
    rows,
    source: "current",
    studyMode: "floor",
    targetOutputs: FIELD_OUTPUTS
  });

  expect(evaluated.result, `${id} should evaluate`).not.toBeNull();
  if (!evaluated.result) {
    throw new Error(`${id} did not evaluate.`);
  }

  const result = evaluated.result;

  return {
    route: {
      basis: result.impact?.basis ?? null,
      cards: Object.fromEntries(
        FIELD_OUTPUTS.map((output) => {
          const card = buildOutputCard({
            output,
            result,
            studyMode: "floor"
          });

          return [output, { status: card.status, value: card.value }];
        })
      ) as RouteSnapshot["cards"],
      exactMatchId: result.floorSystemMatch?.system.id ?? null,
      lPrimeNTw: result.impact?.LPrimeNTw ?? null,
      lPrimeNW: result.impact?.LPrimeNW ?? null,
      lnW: result.impact?.LnW ?? null,
      rw: result.floorSystemRatings?.Rw ?? null,
      supported: result.supportedTargetOutputs,
      unsupported: result.unsupportedTargetOutputs
    },
    warnings: evaluated.warnings
  };
}

describe("open-box finish tolerance mixed-history boundary", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps the 10 mm source-band split exact and the 12 mm outside-band split fail-closed through save/load and mode switches", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");
    const failures: string[] = [];

    for (const testCase of CASES) {
      const store = useWorkbenchStore as unknown as StoreHandle;

      store.getState().reset();
      store.getState().startStudyMode("floor");
      store.getState().appendRows(OPEN_BOX_BASIC_ROWS);
      splitLaminateThroughEditHistory(store, testCase.laminateParts);
      roundTripThroughMixedMode(store);

      const expectedRows = buildExpectedRows(testCase.laminateParts);
      const actualRows = normalizeRows(store.getState().rows);

      if (JSON.stringify(actualRows) !== JSON.stringify(expectedRows)) {
        failures.push(`${testCase.id}: expected rows ${JSON.stringify(expectedRows)}, got ${JSON.stringify(actualRows)}`);
      }

      const actual = snapshot(testCase.id, store.getState().rows);

      if (JSON.stringify(actual.route) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual.route)}`);
      }

      for (const pattern of testCase.warningIncludes) {
        if (!actual.warnings.some((warning: string) => pattern.test(warning))) {
          failures.push(`${testCase.id}: missing warning ${pattern}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});

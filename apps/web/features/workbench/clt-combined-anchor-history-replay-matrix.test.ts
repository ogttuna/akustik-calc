import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
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

type TargetOutput = (typeof TARGET_OUTPUTS)[number];

type RouteSnapshot = {
  cards: Record<TargetOutput, CardSnapshot>;
  exactMatchId: string | null;
  estimateKind: string | null;
  impactBasis: string | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  rw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

const IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
};

const CLT_C4C_COMBINED_EXACT_ROWS: readonly AppendableRow[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const CLT_C5C_VISIBLE_COMBINED_ROWS: readonly AppendableRow[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
];

const UNDER_DESCRIBED_CLT_COMBINED_ROWS: readonly AppendableRow[] = [
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: "100" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "4" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "220" }
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

const IMPACT_CARDS_FAIL_CLOSED = {
  "Ln,w": { status: "unsupported", value: "Not ready" },
  CI: { status: "unsupported", value: "Not ready" },
  "Ln,w+CI": { status: "unsupported", value: "Not ready" },
  "L'n,w": { status: "needs_input", value: "Not ready" },
  "L'nT,w": { status: "needs_input", value: "Not ready" },
  "L'nT,50": { status: "needs_input", value: "Not ready" }
} as const satisfies Omit<Record<TargetOutput, CardSnapshot>, "Rw">;

const EXPECTED_C4C_EXACT: RouteSnapshot = {
  cards: {
    Rw: { status: "live", value: "74 dB" },
    "Ln,w": { status: "live", value: "24 dB" },
    CI: { status: "live", value: "+2 dB" },
    "Ln,w+CI": { status: "live", value: "26 dB" },
    "L'n,w": { status: "live", value: "26 dB" },
    "L'nT,w": { status: "live", value: "24 dB" },
    "L'nT,50": { status: "live", value: "40 dB" }
  },
  exactMatchId: "tuas_c4c_clt260_measured_2026",
  estimateKind: null,
  impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
  lPrimeNT50: 40,
  lPrimeNTw: 24,
  lPrimeNW: 26,
  lnW: 24,
  lnWPlusCI: 26,
  rw: 74,
  supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
  unsupported: []
};

const EXPECTED_C5C_PREDICTOR: RouteSnapshot = {
  cards: {
    Rw: { status: "live", value: "75 dB" },
    "Ln,w": { status: "live", value: "38 dB" },
    CI: { status: "live", value: "+4 dB" },
    "Ln,w+CI": { status: "live", value: "42 dB" },
    "L'n,w": { status: "live", value: "40 dB" },
    "L'nT,w": { status: "live", value: "38 dB" },
    "L'nT,50": { status: "live", value: "44 dB" }
  },
  exactMatchId: null,
  estimateKind: "family_general",
  impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
  lPrimeNT50: 44,
  lPrimeNTw: 38,
  lPrimeNW: 40,
  lnW: 38,
  lnWPlusCI: 42,
  rw: 75,
  supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
  unsupported: []
};

const EXPECTED_UNDER_DESCRIBED_FAIL_CLOSED: RouteSnapshot = {
  cards: {
    Rw: { status: "live", value: "49 dB" },
    ...IMPACT_CARDS_FAIL_CLOSED
  },
  exactMatchId: null,
  estimateKind: null,
  impactBasis: null,
  lPrimeNT50: null,
  lPrimeNTw: null,
  lPrimeNW: null,
  lnW: null,
  lnWPlusCI: null,
  rw: 49,
  supported: ["Rw"],
  unsupported: ["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
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

function splitFirstMatchingRowThroughHistory(
  store: StoreHandle,
  match: (row: LayerDraft) => boolean,
  parts: readonly [string, string]
) {
  const targetIndex = store.getState().rows.findIndex(match);

  expect(targetIndex).toBeGreaterThanOrEqual(0);

  const targetId = store.getState().rows[targetIndex]!.id;
  store.getState().duplicateRow(targetId);

  const rowsAfterDuplicate = store.getState().rows;
  const firstId = rowsAfterDuplicate[targetIndex]!.id;
  const secondId = rowsAfterDuplicate[targetIndex + 1]!.id;

  store.getState().updateThickness(firstId, parts[0]);
  store.getState().updateThickness(secondId, parts[1]);

  if (targetIndex + 2 < rowsAfterDuplicate.length) {
    moveCurrentRowToIndex(store, secondId, targetIndex + 2);
    moveCurrentRowToIndex(store, secondId, targetIndex + 1);
  }
}

function splitCombinedCltRowsThroughHistory(store: StoreHandle) {
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "upper_fill", ["20", "30"]);
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "floor_covering", ["3", "5"]);
}

function roundTripThroughMixedMode(store: StoreHandle) {
  store.getState().saveCurrentScenario();

  const floorScenarioId = store.getState().savedScenarios.at(0)?.id;
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
    targetOutputs: TARGET_OUTPUTS
  });

  expect(evaluated.result, `${id} should evaluate`).not.toBeNull();
  if (!evaluated.result) {
    throw new Error(`${id} did not evaluate.`);
  }

  const result = evaluated.result;

  return {
    route: {
      cards: Object.fromEntries(
        TARGET_OUTPUTS.map((output) => {
          const card = buildOutputCard({
            output,
            result,
            studyMode: "floor"
          });

          return [output, { status: card.status, value: card.value }];
        })
      ) as RouteSnapshot["cards"],
      exactMatchId: result.floorSystemMatch?.system.id ?? null,
      estimateKind: result.floorSystemEstimate?.kind ?? null,
      impactBasis: result.impact?.basis ?? null,
      lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
      lPrimeNTw: result.impact?.LPrimeNTw ?? null,
      lPrimeNW: result.impact?.LPrimeNW ?? null,
      lnW: result.impact?.LnW ?? null,
      lnWPlusCI: result.impact?.LnWPlusCI ?? null,
      rw: result.floorSystemRatings?.Rw ?? null,
      supported: result.supportedTargetOutputs,
      unsupported: result.unsupportedTargetOutputs
    },
    warnings: evaluated.warnings
  };
}

async function setupFloorStore(rows: readonly AppendableRow[]): Promise<StoreHandle> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore as unknown as StoreHandle;

  store.getState().reset();
  store.getState().startStudyMode("floor");
  store.getState().appendRows(rows);

  return store;
}

describe("CLT combined anchor history replay matrix", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps exact, predictor-backed, and under-described combined CLT routes stable after workbench history", async () => {
    const cases: Array<{
      expected: RouteSnapshot;
      id: string;
      rows: readonly AppendableRow[];
      warning: RegExp;
    }> = [
      {
        id: "c4c-exact-source-equivalent-split-history",
        rows: CLT_C4C_COMBINED_EXACT_ROWS,
        expected: EXPECTED_C4C_EXACT,
        warning: /Curated exact floor-system match active: TUAS C4c/i
      },
      {
        id: "c5c-predictor-source-equivalent-split-history",
        rows: CLT_C5C_VISIBLE_COMBINED_ROWS,
        expected: EXPECTED_C5C_PREDICTOR,
        warning: /Published family estimate active: mass-timber CLT family general/i
      },
      {
        id: "under-described-combined-clt-fail-closed-history",
        rows: UNDER_DESCRIBED_CLT_COMBINED_ROWS,
        expected: EXPECTED_UNDER_DESCRIBED_FAIL_CLOSED,
        warning: /Impact sound outputs are not available/i
      }
    ];

    const failures: string[] = [];

    for (const testCase of cases) {
      const store = await setupFloorStore(testCase.rows);

      splitCombinedCltRowsThroughHistory(store);
      roundTripThroughMixedMode(store);

      const actual = snapshot(testCase.id, store.getState().rows);

      if (JSON.stringify(actual.route) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual.route)}`);
      }

      if (!actual.warnings.some((warning) => testCase.warning.test(warning))) {
        failures.push(`${testCase.id}: missing warning ${testCase.warning}`);
      }
    }

    expect(failures).toEqual([]);
  });
});

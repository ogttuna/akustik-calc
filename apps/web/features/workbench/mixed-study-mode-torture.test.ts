import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getPresetById } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

const FLOOR_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "DeltaLw",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
];

const WALL_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "STC", "C", "Ctr"];
const WALL_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["R'w", "Dn,w", "DnT,w", "DnT,A"];

const FLOOR_AIRBORNE_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const FLOOR_IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const DEFAULT_FLOOR_REQUESTED_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"];
const DEFAULT_WALL_REQUESTED_OUTPUTS = ["Rw", "STC", "C", "Ctr"];

const WALL_DEEP_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "security_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "security_board", thicknessMm: "12.5" },
  { materialId: "ytong_aac_d700", thicknessMm: "100" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "rockwool", thicknessMm: "40" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const WALL_CHAIN_APPEND_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "rockwool", thicknessMm: "30" },
  { materialId: "air_gap", thicknessMm: "25" }
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

function formatThicknessMm(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(/\.0$/u, "");
}

function moveCurrentRowToIndex(useWorkbenchStore: {
  getState: () => {
    moveRow: (id: string, direction: "up" | "down") => void;
    rows: Array<{ id: string }>;
  };
}, rowId: string, targetIndex: number) {
  while (true) {
    const currentIndex = useWorkbenchStore.getState().rows.findIndex((row) => row.id === rowId);

    expect(currentIndex).toBeGreaterThanOrEqual(0);

    if (currentIndex === targetIndex) {
      return;
    }

    useWorkbenchStore.getState().moveRow(rowId, currentIndex > targetIndex ? "up" : "down");
  }
}

function getFloorValue(
  result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>,
  output: RequestedOutputId
): number | null | undefined {
  switch (output) {
    case "Rw":
      return result.floorSystemRatings?.Rw ?? result.metrics.estimatedRwDb;
    case "R'w":
      return result.metrics.estimatedRwPrimeDb;
    case "DnT,w":
      return result.metrics.estimatedDnTwDb;
    case "Ln,w":
      return result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound;
    case "DeltaLw":
      return result.impact?.DeltaLw ?? result.lowerBoundImpact?.DeltaLwLowerBound;
    case "Ln,w+CI":
      return result.impact?.LnWPlusCI;
    case "L'n,w":
      return result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound;
    case "L'nT,w":
      return result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound;
    case "L'nT,50":
      return result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound;
    default:
      return undefined;
  }
}

function getWallValue(
  result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>,
  output: RequestedOutputId
): number | null | undefined {
  switch (output) {
    case "Rw":
      return result.metrics.estimatedRwDb;
    case "STC":
      return result.metrics.estimatedStc;
    case "C":
      return result.metrics.estimatedCDb;
    case "Ctr":
      return result.metrics.estimatedCtrDb;
    case "R'w":
      return result.metrics.estimatedRwPrimeDb;
    case "Dn,w":
      return result.metrics.estimatedDnWDb;
    case "DnT,w":
      return result.metrics.estimatedDnTwDb;
    case "DnT,A":
      return result.metrics.estimatedDnTADb;
    default:
      return undefined;
  }
}

function isInsideFloorCorridor(output: RequestedOutputId, value: number) {
  switch (output) {
    case "Rw":
    case "R'w":
    case "DnT,w":
      return value >= 15 && value <= 95;
    case "DeltaLw":
      return value >= 0 && value <= 50;
    case "Ln,w":
    case "Ln,w+CI":
    case "L'n,w":
    case "L'nT,w":
    case "L'nT,50":
      return value >= 20 && value <= 100;
    default:
      return false;
  }
}

function isInsideWallCorridor(output: RequestedOutputId, value: number) {
  switch (output) {
    case "Rw":
    case "STC":
    case "R'w":
    case "Dn,w":
    case "DnT,w":
    case "DnT,A":
      return value >= 15 && value <= 95;
    case "C":
    case "Ctr":
      return value >= -25 && value <= 10;
    default:
      return false;
  }
}

function scenarioSnapshot(
  scenario: ReturnType<typeof evaluateScenario>,
  studyMode: "floor" | "wall"
) {
  const result = scenario.result;

  return {
    boundFloorSystemMatchId: result?.boundFloorSystemMatch?.system.id ?? null,
    floorSystemEstimateKind: result?.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result?.floorSystemMatch?.system.id ?? null,
    impactBasis: result?.impact?.basis ?? result?.lowerBoundImpact?.basis ?? null,
    lPrimeNT50: result?.impact?.LPrimeNT50 ?? result?.lowerBoundImpact?.LPrimeNT50UpperBound ?? null,
    lPrimeNTw: result?.impact?.LPrimeNTw ?? result?.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
    lPrimeNW: result?.impact?.LPrimeNW ?? result?.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
    lnW: result?.impact?.LnW ?? result?.lowerBoundImpact?.LnWUpperBound ?? null,
    lnWPlusCI: result?.impact?.LnWPlusCI ?? null,
    mode: studyMode,
    rw: result?.floorSystemRatings?.Rw ?? result?.metrics.estimatedRwDb ?? null,
    rwPrime: result?.metrics.estimatedRwPrimeDb ?? null,
    stc: result?.metrics.estimatedStc ?? null,
    supportedTargetOutputs: result?.supportedTargetOutputs ?? null,
    unsupportedTargetOutputs: result?.unsupportedTargetOutputs ?? null
  };
}

function scenarioEnvelope(
  scenario: ReturnType<typeof evaluateScenario>,
  studyMode: "floor" | "wall"
) {
  return {
    snapshot: scenarioSnapshot(scenario, studyMode),
    warnings: [...scenario.warnings]
  };
}

function normalizeRowsForRoundtrip(rows: readonly LayerDraft[]) {
  return rows.map((row) => ({
    densityKgM3: row.densityKgM3,
    dynamicStiffnessMNm3: row.dynamicStiffnessMNm3,
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

describe("mixed study-mode torture", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps neutral deep floor and wall split-detours exact across alternating study-mode switches", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");
    const floorPreset = getPresetById("tuas_open_box_dry_exact");
    const failures: string[] = [];

    const evaluateFloor = (id: string, rows: readonly LayerDraft[]) => ({
      field: evaluateScenario({
        airborneContext: FLOOR_AIRBORNE_CONTEXT,
        id: `${id}-field`,
        impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
        name: id,
        rows,
        source: "current",
        studyMode: "floor",
        targetOutputs: FLOOR_OUTPUTS
      }),
      lab: evaluateScenario({
        id: `${id}-lab`,
        name: id,
        rows,
        source: "current",
        studyMode: "floor",
        targetOutputs: FLOOR_OUTPUTS
      })
    });

    const evaluateWall = (id: string, rows: readonly LayerDraft[]) => ({
      field: evaluateScenario({
        airborneContext: WALL_FIELD_CONTEXT,
        id: `${id}-field`,
        name: id,
        rows,
        source: "current",
        studyMode: "wall",
        targetOutputs: WALL_FIELD_OUTPUTS
      }),
      lab: evaluateScenario({
        id: `${id}-lab`,
        name: id,
        rows,
        source: "current",
        studyMode: "wall",
        targetOutputs: WALL_LAB_OUTPUTS
      })
    });

    const baselineFloor = evaluateFloor(
      "floor-baseline",
      floorPreset.rows.map((row, index) => ({ ...row, id: `floor-baseline-${index}` }))
    );
    const baselineWall = evaluateWall(
      "wall-baseline",
      WALL_DEEP_ROWS.map((row, index) => ({ ...row, id: `wall-baseline-${index}` }))
    );

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().startStudyMode("floor");
    expect(useWorkbenchStore.getState().rows).toEqual([]);
    expect(useWorkbenchStore.getState().requestedOutputs).toEqual(DEFAULT_FLOOR_REQUESTED_OUTPUTS);
    useWorkbenchStore.getState().appendRows(floorPreset.rows);

    const upperFillRow = useWorkbenchStore.getState().rows.find(
      (row) => row.floorRole === "upper_fill" && row.materialId === "generic_fill"
    );
    const floatingRow = useWorkbenchStore.getState().rows.find(
      (row) => row.floorRole === "floating_screed" && row.materialId === "dry_floating_gypsum_fiberboard"
    );
    expect(upperFillRow).toBeTruthy();
    expect(floatingRow).toBeTruthy();

    useWorkbenchStore.getState().duplicateRow(upperFillRow!.id);
    useWorkbenchStore.getState().duplicateRow(floatingRow!.id);

    let currentRows = useWorkbenchStore.getState().rows;
    const duplicatedUpperFill = currentRows[currentRows.findIndex((row) => row.id === upperFillRow!.id) + 1];
    const duplicatedFloating = currentRows[currentRows.findIndex((row) => row.id === floatingRow!.id) + 1];
    expect(duplicatedUpperFill).toBeTruthy();
    expect(duplicatedFloating).toBeTruthy();

    useWorkbenchStore.getState().updateThickness(upperFillRow!.id, "20");
    useWorkbenchStore.getState().updateThickness(duplicatedUpperFill!.id, "30");
    useWorkbenchStore.getState().updateThickness(floatingRow!.id, "25");
    useWorkbenchStore.getState().updateThickness(duplicatedFloating!.id, "35");

    const floorDetour = evaluateFloor("floor-detour", useWorkbenchStore.getState().rows);
    if (JSON.stringify(scenarioSnapshot(floorDetour.lab, "floor")) !== JSON.stringify(scenarioSnapshot(baselineFloor.lab, "floor"))) {
      failures.push("floor lab neutral detour should keep the same snapshot");
    }
    if (JSON.stringify(scenarioSnapshot(floorDetour.field, "floor")) !== JSON.stringify(scenarioSnapshot(baselineFloor.field, "floor"))) {
      failures.push("floor field neutral detour should keep the same snapshot");
    }

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().startStudyMode("wall");
    expect(useWorkbenchStore.getState().rows).toEqual([]);
    expect(useWorkbenchStore.getState().requestedOutputs).toEqual(DEFAULT_WALL_REQUESTED_OUTPUTS);
    useWorkbenchStore.getState().appendRows(WALL_DEEP_ROWS);

    const firstWool = useWorkbenchStore.getState().rows.find((row) => row.materialId === "rockwool" && row.thicknessMm === "50");
    expect(firstWool).toBeTruthy();

    useWorkbenchStore.getState().duplicateRow(firstWool!.id);

    currentRows = useWorkbenchStore.getState().rows;
    const duplicatedWool = currentRows[currentRows.findIndex((row) => row.id === firstWool!.id) + 1];
    expect(duplicatedWool).toBeTruthy();

    useWorkbenchStore.getState().updateThickness(firstWool!.id, "15");
    useWorkbenchStore.getState().updateThickness(duplicatedWool!.id, "35");

    const wallDetour = evaluateWall("wall-detour", useWorkbenchStore.getState().rows);
    if (JSON.stringify(scenarioSnapshot(wallDetour.lab, "wall")) !== JSON.stringify(scenarioSnapshot(baselineWall.lab, "wall"))) {
      failures.push("wall lab neutral detour should keep the same snapshot");
    }
    if (JSON.stringify(scenarioSnapshot(wallDetour.field, "wall")) !== JSON.stringify(scenarioSnapshot(baselineWall.field, "wall"))) {
      failures.push("wall field neutral detour should keep the same snapshot");
    }

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().startStudyMode("floor");
    useWorkbenchStore.getState().appendRows(floorPreset.rows);
    const restoredFloor = evaluateFloor("floor-restored", useWorkbenchStore.getState().rows);

    if (JSON.stringify(scenarioSnapshot(restoredFloor.lab, "floor")) !== JSON.stringify(scenarioSnapshot(baselineFloor.lab, "floor"))) {
      failures.push("floor lab should restore cleanly after wall detour");
    }
    if (JSON.stringify(scenarioSnapshot(restoredFloor.field, "floor")) !== JSON.stringify(scenarioSnapshot(baselineFloor.field, "floor"))) {
      failures.push("floor field should restore cleanly after wall detour");
    }

    expect(failures).toEqual([]);
  });

  it("keeps alternating mixed floor and wall edit chains numerically sane and support-honest", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");
    const failures: string[] = [];

    const evaluateCurrentFloor = (id: string) => ({
      field: evaluateScenario({
        airborneContext: FLOOR_AIRBORNE_CONTEXT,
        id: `${id}-field`,
        impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
        name: id,
        rows: useWorkbenchStore.getState().rows,
        source: "current",
        studyMode: "floor",
        targetOutputs: FLOOR_OUTPUTS
      }),
      lab: evaluateScenario({
        id: `${id}-lab`,
        name: id,
        rows: useWorkbenchStore.getState().rows,
        source: "current",
        studyMode: "floor",
        targetOutputs: FLOOR_OUTPUTS
      })
    });

    const evaluateCurrentWall = (id: string) => ({
      field: evaluateScenario({
        airborneContext: WALL_FIELD_CONTEXT,
        id: `${id}-field`,
        name: id,
        rows: useWorkbenchStore.getState().rows,
        source: "current",
        studyMode: "wall",
        targetOutputs: WALL_FIELD_OUTPUTS
      }),
      lab: evaluateScenario({
        id: `${id}-lab`,
        name: id,
        rows: useWorkbenchStore.getState().rows,
        source: "current",
        studyMode: "wall",
        targetOutputs: WALL_LAB_OUTPUTS
      })
    });

    const assertFloorScenario = (
      label: string,
      scenario: ReturnType<typeof evaluateScenario>,
      outputs: readonly RequestedOutputId[]
    ) => {
      if (!scenario.result) {
        failures.push(`${label}: scenario result should stay available`);
        return;
      }

      if (!scenario.result.ok) {
        failures.push(`${label}: result should remain ok`);
      }

      const supported = new Set(scenario.result.supportedTargetOutputs);
      const unsupported = new Set(scenario.result.unsupportedTargetOutputs);

      for (const output of outputs) {
        if (supported.has(output) === unsupported.has(output)) {
          failures.push(`${label}: ${output} should belong to exactly one support bucket`);
        }

        const card = buildOutputCard({
          output,
          result: scenario.result,
          studyMode: "floor"
        });

        if (supported.has(output)) {
          const value = getFloorValue(scenario.result, output);
          if (!(typeof value === "number" && Number.isFinite(value) && isInsideFloorCorridor(output, value))) {
            failures.push(`${label}: supported floor output ${output} should stay finite and sane, got ${String(value)}`);
          }

          if (card.status === "unsupported" || card.status === "needs_input") {
            failures.push(`${label}: supported floor output ${output} should not render as ${card.status}`);
          }
        } else if (card.status === "live" || card.status === "bound") {
          failures.push(`${label}: unsupported floor output ${output} should not render live/bound`);
        }
      }
    };

    const assertWallScenario = (
      label: string,
      scenario: ReturnType<typeof evaluateScenario>,
      outputs: readonly RequestedOutputId[]
    ) => {
      if (!scenario.result) {
        failures.push(`${label}: scenario result should stay available`);
        return;
      }

      if (!scenario.result.ok) {
        failures.push(`${label}: result should remain ok`);
      }

      const supported = new Set(scenario.result.supportedTargetOutputs);
      const unsupported = new Set(scenario.result.unsupportedTargetOutputs);

      for (const output of outputs) {
        if (supported.has(output) === unsupported.has(output)) {
          failures.push(`${label}: ${output} should belong to exactly one support bucket`);
        }

        const card = buildOutputCard({
          output,
          result: scenario.result,
          studyMode: "wall"
        });

        if (supported.has(output)) {
          const value = getWallValue(scenario.result, output);
          if (!(typeof value === "number" && Number.isFinite(value) && isInsideWallCorridor(output, value))) {
            failures.push(`${label}: supported wall output ${output} should stay finite and sane, got ${String(value)}`);
          }

          if (card.status === "unsupported" || card.status === "needs_input") {
            failures.push(`${label}: supported wall output ${output} should not render as ${card.status}`);
          }
        } else if (card.status === "live" || card.status === "bound") {
          failures.push(`${label}: unsupported wall output ${output} should not render live/bound`);
        }
      }
    };

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().startStudyMode("floor");
    useWorkbenchStore.getState().appendRows(getPresetById("heavy_concrete_impact_floor").rows);

    const floorScreed = useWorkbenchStore.getState().rows.find((row) => row.floorRole === "floating_screed");
    const floorResilient = useWorkbenchStore.getState().rows.find((row) => row.floorRole === "resilient_layer");
    expect(floorScreed).toBeTruthy();
    expect(floorResilient).toBeTruthy();

    useWorkbenchStore.getState().duplicateRow(floorScreed!.id);
    const duplicatedScreed = useWorkbenchStore.getState().rows.find(
      (row) => row.id !== floorScreed!.id && row.materialId === floorScreed!.materialId && row.floorRole === floorScreed!.floorRole
    );
    expect(duplicatedScreed).toBeTruthy();
    useWorkbenchStore.getState().updateThickness(floorScreed!.id, "20");
    useWorkbenchStore.getState().updateThickness(duplicatedScreed!.id, "30");
    moveCurrentRowToIndex(useWorkbenchStore, duplicatedScreed!.id, 1);
    useWorkbenchStore.getState().updateDynamicStiffness(floorResilient!.id, "35");
    useWorkbenchStore.getState().appendRows([{ materialId: "gypsum_board", thicknessMm: "13", floorRole: "ceiling_board" }]);

    let floorScenarios = evaluateCurrentFloor("mixed-floor-phase");
    assertFloorScenario("mixed-floor-phase lab", floorScenarios.lab, FLOOR_OUTPUTS);
    assertFloorScenario("mixed-floor-phase field", floorScenarios.field, FLOOR_OUTPUTS);

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().startStudyMode("wall");
    expect(useWorkbenchStore.getState().requestedOutputs).toEqual(DEFAULT_WALL_REQUESTED_OUTPUTS);
    useWorkbenchStore.getState().appendRows(WALL_DEEP_ROWS);

    const securityBoard = useWorkbenchStore.getState().rows.find((row) => row.materialId === "security_board");
    const firstRockwool = useWorkbenchStore.getState().rows.find((row) => row.materialId === "rockwool" && row.thicknessMm === "50");
    expect(securityBoard).toBeTruthy();
    expect(firstRockwool).toBeTruthy();

    useWorkbenchStore.getState().duplicateRow(firstRockwool!.id);
    const duplicatedWallWool = useWorkbenchStore.getState().rows.find(
      (row) => row.id !== firstRockwool!.id && row.materialId === "rockwool" && row.thicknessMm === "50"
    );
    expect(duplicatedWallWool).toBeTruthy();
    useWorkbenchStore.getState().updateThickness(firstRockwool!.id, "20");
    useWorkbenchStore.getState().updateThickness(duplicatedWallWool!.id, "30");
    moveCurrentRowToIndex(useWorkbenchStore, duplicatedWallWool!.id, 2);
    useWorkbenchStore.getState().updateMaterial(securityBoard!.id, "diamond_board");
    useWorkbenchStore.getState().appendRows(WALL_CHAIN_APPEND_ROWS);
    const removableWallRow = useWorkbenchStore.getState().rows.find((row) => row.materialId === "air_gap" && row.thicknessMm === "25");
    expect(removableWallRow).toBeTruthy();
    useWorkbenchStore.getState().removeRow(removableWallRow!.id);

    const wallScenarios = evaluateCurrentWall("mixed-wall-phase");
    assertWallScenario("mixed-wall-phase lab", wallScenarios.lab, WALL_LAB_OUTPUTS);
    assertWallScenario("mixed-wall-phase field", wallScenarios.field, WALL_FIELD_OUTPUTS);

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().startStudyMode("floor");
    expect(useWorkbenchStore.getState().requestedOutputs).toEqual(DEFAULT_FLOOR_REQUESTED_OUTPUTS);
    useWorkbenchStore.getState().appendRows(getPresetById("ubiq_open_web_300_bound").rows);

    const ceilingBoard = useWorkbenchStore.getState().rows.find((row) => row.floorRole === "ceiling_board" && row.materialId === "firestop_board");
    const baseStructure = useWorkbenchStore.getState().rows.find((row) => row.floorRole === "base_structure");
    expect(ceilingBoard).toBeTruthy();
    expect(baseStructure).toBeTruthy();

    useWorkbenchStore.getState().duplicateRow(ceilingBoard!.id);
    const duplicatedBoard = useWorkbenchStore.getState().rows.find(
      (row) => row.id !== ceilingBoard!.id && row.floorRole === "ceiling_board" && row.materialId === "firestop_board" && row.thicknessMm === "16"
    );
    expect(duplicatedBoard).toBeTruthy();
    useWorkbenchStore.getState().updateThickness(ceilingBoard!.id, "8");
    useWorkbenchStore.getState().updateThickness(duplicatedBoard!.id, "8");
    useWorkbenchStore.getState().replaceSingleBaseStructure("open_web_steel_floor", "250");
    useWorkbenchStore.getState().appendRows([{ materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" }]);

    floorScenarios = evaluateCurrentFloor("mixed-floor-bound-phase");
    assertFloorScenario("mixed-floor-bound-phase lab", floorScenarios.lab, FLOOR_OUTPUTS);
    assertFloorScenario("mixed-floor-bound-phase field", floorScenarios.field, FLOOR_OUTPUTS);

    expect(failures).toEqual([]);
  }, 20000);

  it("preserves representative mixed floor and wall detour states through save-load roundtrips after alternating mode switches", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");
    const failures: string[] = [];

    const evaluateCurrentFloor = (id: string) => ({
      field: evaluateScenario({
        airborneContext: FLOOR_AIRBORNE_CONTEXT,
        id: `${id}-field`,
        impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
        name: id,
        rows: useWorkbenchStore.getState().rows,
        source: "current",
        studyMode: "floor",
        targetOutputs: FLOOR_OUTPUTS
      }),
      lab: evaluateScenario({
        id: `${id}-lab`,
        name: id,
        rows: useWorkbenchStore.getState().rows,
        source: "current",
        studyMode: "floor",
        targetOutputs: FLOOR_OUTPUTS
      })
    });

    const evaluateCurrentWall = (id: string) => ({
      field: evaluateScenario({
        airborneContext: WALL_FIELD_CONTEXT,
        id: `${id}-field`,
        name: id,
        rows: useWorkbenchStore.getState().rows,
        source: "current",
        studyMode: "wall",
        targetOutputs: WALL_FIELD_OUTPUTS
      }),
      lab: evaluateScenario({
        id: `${id}-lab`,
        name: id,
        rows: useWorkbenchStore.getState().rows,
        source: "current",
        studyMode: "wall",
        targetOutputs: WALL_LAB_OUTPUTS
      })
    });

    const assertFloorScenario = (
      label: string,
      scenario: ReturnType<typeof evaluateScenario>,
      outputs: readonly RequestedOutputId[]
    ) => {
      if (!scenario.result) {
        failures.push(`${label}: scenario result should stay available`);
        return;
      }

      if (!scenario.result.ok) {
        failures.push(`${label}: result should remain ok`);
      }

      const supported = new Set(scenario.result.supportedTargetOutputs);
      const unsupported = new Set(scenario.result.unsupportedTargetOutputs);

      for (const output of outputs) {
        if (supported.has(output) === unsupported.has(output)) {
          failures.push(`${label}: ${output} should belong to exactly one support bucket`);
        }

        const card = buildOutputCard({
          output,
          result: scenario.result,
          studyMode: "floor"
        });

        if (supported.has(output)) {
          const value = getFloorValue(scenario.result, output);
          if (!(typeof value === "number" && Number.isFinite(value) && isInsideFloorCorridor(output, value))) {
            failures.push(`${label}: supported floor output ${output} should stay finite and sane, got ${String(value)}`);
          }

          if (card.status === "unsupported" || card.status === "needs_input") {
            failures.push(`${label}: supported floor output ${output} should not render as ${card.status}`);
          }
        } else if (card.status === "live" || card.status === "bound") {
          failures.push(`${label}: unsupported floor output ${output} should not render live/bound`);
        }
      }
    };

    const assertWallScenario = (
      label: string,
      scenario: ReturnType<typeof evaluateScenario>,
      outputs: readonly RequestedOutputId[]
    ) => {
      if (!scenario.result) {
        failures.push(`${label}: scenario result should stay available`);
        return;
      }

      if (!scenario.result.ok) {
        failures.push(`${label}: result should remain ok`);
      }

      const supported = new Set(scenario.result.supportedTargetOutputs);
      const unsupported = new Set(scenario.result.unsupportedTargetOutputs);

      for (const output of outputs) {
        if (supported.has(output) === unsupported.has(output)) {
          failures.push(`${label}: ${output} should belong to exactly one support bucket`);
        }

        const card = buildOutputCard({
          output,
          result: scenario.result,
          studyMode: "wall"
        });

        if (supported.has(output)) {
          const value = getWallValue(scenario.result, output);
          if (!(typeof value === "number" && Number.isFinite(value) && isInsideWallCorridor(output, value))) {
            failures.push(`${label}: supported wall output ${output} should stay finite and sane, got ${String(value)}`);
          }

          if (card.status === "unsupported" || card.status === "needs_input") {
            failures.push(`${label}: supported wall output ${output} should not render as ${card.status}`);
          }
        } else if (card.status === "live" || card.status === "bound") {
          failures.push(`${label}: unsupported wall output ${output} should not render live/bound`);
        }
      }
    };

    const buildHeavyConcreteFloorDetour = () => {
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(getPresetById("heavy_concrete_impact_floor").rows);

      const floorScreed = useWorkbenchStore.getState().rows.find((row) => row.floorRole === "floating_screed");
      const floorResilient = useWorkbenchStore.getState().rows.find((row) => row.floorRole === "resilient_layer");
      expect(floorScreed).toBeTruthy();
      expect(floorResilient).toBeTruthy();

      useWorkbenchStore.getState().duplicateRow(floorScreed!.id);
      const duplicatedScreed = useWorkbenchStore.getState().rows.find(
        (row) =>
          row.id !== floorScreed!.id &&
          row.materialId === floorScreed!.materialId &&
          row.floorRole === floorScreed!.floorRole
      );
      expect(duplicatedScreed).toBeTruthy();

      useWorkbenchStore.getState().updateThickness(floorScreed!.id, "20");
      useWorkbenchStore.getState().updateThickness(duplicatedScreed!.id, "30");
      moveCurrentRowToIndex(useWorkbenchStore, duplicatedScreed!.id, 1);
      useWorkbenchStore.getState().updateDynamicStiffness(floorResilient!.id, "35");
      useWorkbenchStore.getState().appendRows([
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" }
      ]);

      const scenarios = evaluateCurrentFloor("save-load-heavy-floor-detour");
      assertFloorScenario("save-load-heavy-floor-detour lab", scenarios.lab, FLOOR_OUTPUTS);
      assertFloorScenario("save-load-heavy-floor-detour field", scenarios.field, FLOOR_OUTPUTS);

      return {
        field: scenarioEnvelope(scenarios.field, "floor"),
        lab: scenarioEnvelope(scenarios.lab, "floor"),
        requestedOutputs: [...useWorkbenchStore.getState().requestedOutputs],
        rows: normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows),
        savedScenarioId: (() => {
          useWorkbenchStore.getState().saveCurrentScenario();
          return useWorkbenchStore.getState().savedScenarios[0]?.id ?? null;
        })(),
        studyMode: useWorkbenchStore.getState().studyMode
      };
    };

    const buildWallDetour = () => {
      useWorkbenchStore.getState().startStudyMode("wall");
      useWorkbenchStore.getState().appendRows(WALL_DEEP_ROWS);

      const securityBoard = useWorkbenchStore.getState().rows.find((row) => row.materialId === "security_board");
      const firstRockwool = useWorkbenchStore.getState().rows.find(
        (row) => row.materialId === "rockwool" && row.thicknessMm === "50"
      );
      expect(securityBoard).toBeTruthy();
      expect(firstRockwool).toBeTruthy();

      useWorkbenchStore.getState().duplicateRow(firstRockwool!.id);
      const duplicatedWallWool = useWorkbenchStore.getState().rows.find(
        (row) => row.id !== firstRockwool!.id && row.materialId === "rockwool" && row.thicknessMm === "50"
      );
      expect(duplicatedWallWool).toBeTruthy();

      useWorkbenchStore.getState().updateThickness(firstRockwool!.id, "20");
      useWorkbenchStore.getState().updateThickness(duplicatedWallWool!.id, "30");
      moveCurrentRowToIndex(useWorkbenchStore, duplicatedWallWool!.id, 2);
      useWorkbenchStore.getState().updateMaterial(securityBoard!.id, "diamond_board");
      useWorkbenchStore.getState().appendRows(WALL_CHAIN_APPEND_ROWS);
      const removableWallRow = useWorkbenchStore.getState().rows.find(
        (row) => row.materialId === "air_gap" && row.thicknessMm === "25"
      );
      expect(removableWallRow).toBeTruthy();
      useWorkbenchStore.getState().removeRow(removableWallRow!.id);

      const scenarios = evaluateCurrentWall("save-load-wall-detour");
      assertWallScenario("save-load-wall-detour lab", scenarios.lab, WALL_LAB_OUTPUTS);
      assertWallScenario("save-load-wall-detour field", scenarios.field, WALL_FIELD_OUTPUTS);

      return {
        field: scenarioEnvelope(scenarios.field, "wall"),
        lab: scenarioEnvelope(scenarios.lab, "wall"),
        requestedOutputs: [...useWorkbenchStore.getState().requestedOutputs],
        rows: normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows),
        savedScenarioId: (() => {
          useWorkbenchStore.getState().saveCurrentScenario();
          return useWorkbenchStore.getState().savedScenarios[0]?.id ?? null;
        })(),
        studyMode: useWorkbenchStore.getState().studyMode
      };
    };

    const buildBoundFloorDetour = () => {
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(getPresetById("ubiq_open_web_300_bound").rows);

      const ceilingBoard = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "ceiling_board" && row.materialId === "firestop_board"
      );
      const baseStructure = useWorkbenchStore.getState().rows.find((row) => row.floorRole === "base_structure");
      expect(ceilingBoard).toBeTruthy();
      expect(baseStructure).toBeTruthy();

      useWorkbenchStore.getState().duplicateRow(ceilingBoard!.id);
      const duplicatedBoard = useWorkbenchStore.getState().rows.find(
        (row) =>
          row.id !== ceilingBoard!.id &&
          row.floorRole === "ceiling_board" &&
          row.materialId === "firestop_board" &&
          row.thicknessMm === "16"
      );
      expect(duplicatedBoard).toBeTruthy();

      useWorkbenchStore.getState().updateThickness(ceilingBoard!.id, "8");
      useWorkbenchStore.getState().updateThickness(duplicatedBoard!.id, "8");
      useWorkbenchStore.getState().replaceSingleBaseStructure("open_web_steel_floor", "250");
      useWorkbenchStore.getState().appendRows([
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" }
      ]);

      const scenarios = evaluateCurrentFloor("save-load-bound-floor-detour");
      assertFloorScenario("save-load-bound-floor-detour lab", scenarios.lab, FLOOR_OUTPUTS);
      assertFloorScenario("save-load-bound-floor-detour field", scenarios.field, FLOOR_OUTPUTS);

      return {
        field: scenarioEnvelope(scenarios.field, "floor"),
        lab: scenarioEnvelope(scenarios.lab, "floor"),
        requestedOutputs: [...useWorkbenchStore.getState().requestedOutputs],
        rows: normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows),
        savedScenarioId: (() => {
          useWorkbenchStore.getState().saveCurrentScenario();
          return useWorkbenchStore.getState().savedScenarios[0]?.id ?? null;
        })(),
        studyMode: useWorkbenchStore.getState().studyMode
      };
    };

    const buildWetBoundFloorDetour = () => {
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(getPresetById("regupol_curve_8_wet_bound").rows);

      const floatingScreed = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "floating_screed" && row.materialId === "screed"
      );
      const concreteBase = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "base_structure" && row.materialId === "concrete"
      );
      expect(floatingScreed).toBeTruthy();
      expect(concreteBase).toBeTruthy();

      useWorkbenchStore.getState().duplicateRow(floatingScreed!.id);
      useWorkbenchStore.getState().duplicateRow(concreteBase!.id);

      let currentRows = useWorkbenchStore.getState().rows;
      const duplicatedScreed = currentRows[currentRows.findIndex((row) => row.id === floatingScreed!.id) + 1];
      const duplicatedConcrete = currentRows[currentRows.findIndex((row) => row.id === concreteBase!.id) + 1];
      expect(duplicatedScreed).toBeTruthy();
      expect(duplicatedConcrete).toBeTruthy();

      useWorkbenchStore.getState().updateThickness(floatingScreed!.id, "30");
      useWorkbenchStore.getState().updateThickness(duplicatedScreed!.id, "40");
      useWorkbenchStore.getState().updateThickness(concreteBase!.id, "60");
      useWorkbenchStore.getState().updateThickness(duplicatedConcrete!.id, "80");
      moveCurrentRowToIndex(useWorkbenchStore, duplicatedScreed!.id, 1);
      moveCurrentRowToIndex(useWorkbenchStore, duplicatedConcrete!.id, useWorkbenchStore.getState().rows.length - 1);

      const scenarios = evaluateCurrentFloor("save-load-wet-bound-floor-detour");
      assertFloorScenario("save-load-wet-bound-floor-detour lab", scenarios.lab, FLOOR_OUTPUTS);
      assertFloorScenario("save-load-wet-bound-floor-detour field", scenarios.field, FLOOR_OUTPUTS);

      return {
        field: scenarioEnvelope(scenarios.field, "floor"),
        lab: scenarioEnvelope(scenarios.lab, "floor"),
        requestedOutputs: [...useWorkbenchStore.getState().requestedOutputs],
        rows: normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows),
        savedScenarioId: (() => {
          useWorkbenchStore.getState().saveCurrentScenario();
          return useWorkbenchStore.getState().savedScenarios[0]?.id ?? null;
        })(),
        studyMode: useWorkbenchStore.getState().studyMode
      };
    };

    const buildProductExactFloorDetour = () => {
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(getPresetById("regupol_curve_8_exact").rows);

      const floatingScreed = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "floating_screed" && row.materialId === "screed"
      );
      const concreteBase = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "base_structure" && row.materialId === "concrete"
      );
      expect(floatingScreed).toBeTruthy();
      expect(concreteBase).toBeTruthy();

      useWorkbenchStore.getState().duplicateRow(floatingScreed!.id);
      useWorkbenchStore.getState().duplicateRow(concreteBase!.id);

      let currentRows = useWorkbenchStore.getState().rows;
      const duplicatedScreed = currentRows[currentRows.findIndex((row) => row.id === floatingScreed!.id) + 1];
      const duplicatedConcrete = currentRows[currentRows.findIndex((row) => row.id === concreteBase!.id) + 1];
      expect(duplicatedScreed).toBeTruthy();
      expect(duplicatedConcrete).toBeTruthy();

      useWorkbenchStore.getState().updateThickness(floatingScreed!.id, "15");
      useWorkbenchStore.getState().updateThickness(duplicatedScreed!.id, "15");
      useWorkbenchStore.getState().updateThickness(concreteBase!.id, "75");
      useWorkbenchStore.getState().updateThickness(duplicatedConcrete!.id, "75");

      const scenarios = evaluateCurrentFloor("save-load-product-exact-floor-detour");
      assertFloorScenario("save-load-product-exact-floor-detour lab", scenarios.lab, FLOOR_OUTPUTS);
      assertFloorScenario("save-load-product-exact-floor-detour field", scenarios.field, FLOOR_OUTPUTS);

      return {
        field: scenarioEnvelope(scenarios.field, "floor"),
        lab: scenarioEnvelope(scenarios.lab, "floor"),
        requestedOutputs: [...useWorkbenchStore.getState().requestedOutputs],
        rows: normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows),
        savedScenarioId: (() => {
          useWorkbenchStore.getState().saveCurrentScenario();
          return useWorkbenchStore.getState().savedScenarios[0]?.id ?? null;
        })(),
        studyMode: useWorkbenchStore.getState().studyMode
      };
    };

    const buildNoScreedProductExactFloorDetour = () => {
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(getPresetById("regupol_multi_45_porcelain_exact").rows);

      const floorCovering = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "floor_covering" && row.materialId === "porcelain_tile" && row.thicknessMm === "10"
      );
      const concreteBase = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "base_structure" && row.materialId === "concrete" && row.thicknessMm === "150"
      );
      expect(floorCovering).toBeTruthy();
      expect(concreteBase).toBeTruthy();

      useWorkbenchStore.getState().duplicateRow(floorCovering!.id);
      useWorkbenchStore.getState().duplicateRow(concreteBase!.id);

      const currentRows = useWorkbenchStore.getState().rows;
      const duplicatedCovering = currentRows[currentRows.findIndex((row) => row.id === floorCovering!.id) + 1];
      const duplicatedConcrete = currentRows[currentRows.findIndex((row) => row.id === concreteBase!.id) + 1];
      expect(duplicatedCovering).toBeTruthy();
      expect(duplicatedConcrete).toBeTruthy();

      useWorkbenchStore.getState().updateThickness(floorCovering!.id, "5");
      useWorkbenchStore.getState().updateThickness(duplicatedCovering!.id, "5");
      useWorkbenchStore.getState().updateThickness(concreteBase!.id, "75");
      useWorkbenchStore.getState().updateThickness(duplicatedConcrete!.id, "75");

      const scenarios = evaluateCurrentFloor("save-load-no-screed-product-exact-floor-detour");
      assertFloorScenario("save-load-no-screed-product-exact-floor-detour lab", scenarios.lab, FLOOR_OUTPUTS);
      assertFloorScenario("save-load-no-screed-product-exact-floor-detour field", scenarios.field, FLOOR_OUTPUTS);

      return {
        field: scenarioEnvelope(scenarios.field, "floor"),
        lab: scenarioEnvelope(scenarios.lab, "floor"),
        requestedOutputs: [...useWorkbenchStore.getState().requestedOutputs],
        rows: normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows),
        savedScenarioId: (() => {
          useWorkbenchStore.getState().saveCurrentScenario();
          return useWorkbenchStore.getState().savedScenarios[0]?.id ?? null;
        })(),
        studyMode: useWorkbenchStore.getState().studyMode
      };
    };

    const buildExactFamilyFloorDetour = () => {
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(getPresetById("dataholz_timber_frame_exact").rows);

      const ceilingBoard = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "ceiling_board" && row.materialId === "gypsum_board" && row.thicknessMm === "12.5"
      );
      const baseStructure = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "base_structure" && row.materialId === "timber_frame_floor" && row.thicknessMm === "220"
      );
      expect(ceilingBoard).toBeTruthy();
      expect(baseStructure).toBeTruthy();

      useWorkbenchStore.getState().duplicateRow(ceilingBoard!.id);
      useWorkbenchStore.getState().duplicateRow(baseStructure!.id);

      let currentRows = useWorkbenchStore.getState().rows;
      const duplicatedBoard = currentRows[currentRows.findIndex((row) => row.id === ceilingBoard!.id) + 1];
      const duplicatedBase = currentRows[currentRows.findIndex((row) => row.id === baseStructure!.id) + 1];
      expect(duplicatedBoard).toBeTruthy();
      expect(duplicatedBase).toBeTruthy();

      useWorkbenchStore.getState().updateThickness(ceilingBoard!.id, "6.25");
      useWorkbenchStore.getState().updateThickness(duplicatedBoard!.id, "6.25");
      useWorkbenchStore.getState().updateThickness(baseStructure!.id, "110");
      useWorkbenchStore.getState().updateThickness(duplicatedBase!.id, "110");

      const scenarios = evaluateCurrentFloor("save-load-exact-family-floor-detour");
      assertFloorScenario("save-load-exact-family-floor-detour lab", scenarios.lab, FLOOR_OUTPUTS);
      assertFloorScenario("save-load-exact-family-floor-detour field", scenarios.field, FLOOR_OUTPUTS);

      return {
        field: scenarioEnvelope(scenarios.field, "floor"),
        lab: scenarioEnvelope(scenarios.lab, "floor"),
        requestedOutputs: [...useWorkbenchStore.getState().requestedOutputs],
        rows: normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows),
        savedScenarioId: (() => {
          useWorkbenchStore.getState().saveCurrentScenario();
          return useWorkbenchStore.getState().savedScenarios[0]?.id ?? null;
        })(),
        studyMode: useWorkbenchStore.getState().studyMode
      };
    };

    const buildHollowCoreExactFloorDetour = () => {
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(getPresetById("hollow_core_vinyl_exact").rows);

      const ceilingBoard = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "ceiling_board" && row.materialId === "gypsum_board" && row.thicknessMm === "16"
      );
      const baseStructure = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "base_structure" && row.materialId === "hollow_core_plank" && row.thicknessMm === "200"
      );
      expect(ceilingBoard).toBeTruthy();
      expect(baseStructure).toBeTruthy();

      useWorkbenchStore.getState().duplicateRow(ceilingBoard!.id);
      useWorkbenchStore.getState().duplicateRow(baseStructure!.id);

      let currentRows = useWorkbenchStore.getState().rows;
      const duplicatedBoard = currentRows[currentRows.findIndex((row) => row.id === ceilingBoard!.id) + 1];
      const duplicatedBase = currentRows[currentRows.findIndex((row) => row.id === baseStructure!.id) + 1];
      expect(duplicatedBoard).toBeTruthy();
      expect(duplicatedBase).toBeTruthy();

      useWorkbenchStore.getState().updateThickness(ceilingBoard!.id, "8");
      useWorkbenchStore.getState().updateThickness(duplicatedBoard!.id, "8");
      useWorkbenchStore.getState().updateThickness(baseStructure!.id, "100");
      useWorkbenchStore.getState().updateThickness(duplicatedBase!.id, "100");

      const scenarios = evaluateCurrentFloor("save-load-hollow-core-exact-floor-detour");
      assertFloorScenario("save-load-hollow-core-exact-floor-detour lab", scenarios.lab, FLOOR_OUTPUTS);
      assertFloorScenario("save-load-hollow-core-exact-floor-detour field", scenarios.field, FLOOR_OUTPUTS);

      return {
        field: scenarioEnvelope(scenarios.field, "floor"),
        lab: scenarioEnvelope(scenarios.lab, "floor"),
        requestedOutputs: [...useWorkbenchStore.getState().requestedOutputs],
        rows: normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows),
        savedScenarioId: (() => {
          useWorkbenchStore.getState().saveCurrentScenario();
          return useWorkbenchStore.getState().savedScenarios[0]?.id ?? null;
        })(),
        studyMode: useWorkbenchStore.getState().studyMode
      };
    };

    const buildDeltaFloorDetour = () => {
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(getPresetById("getzner_afm_33_delta").rows);

      const floatingScreed = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "floating_screed" && row.materialId === "screed"
      );
      const concreteBase = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "base_structure" && row.materialId === "concrete"
      );
      expect(floatingScreed).toBeTruthy();
      expect(concreteBase).toBeTruthy();

      useWorkbenchStore.getState().duplicateRow(floatingScreed!.id);
      useWorkbenchStore.getState().duplicateRow(concreteBase!.id);

      let currentRows = useWorkbenchStore.getState().rows;
      const duplicatedScreed = currentRows[currentRows.findIndex((row) => row.id === floatingScreed!.id) + 1];
      const duplicatedConcrete = currentRows[currentRows.findIndex((row) => row.id === concreteBase!.id) + 1];
      expect(duplicatedScreed).toBeTruthy();
      expect(duplicatedConcrete).toBeTruthy();

      useWorkbenchStore.getState().updateThickness(floatingScreed!.id, "25");
      useWorkbenchStore.getState().updateThickness(duplicatedScreed!.id, "25");
      useWorkbenchStore.getState().updateThickness(concreteBase!.id, "75");
      useWorkbenchStore.getState().updateThickness(duplicatedConcrete!.id, "75");
      moveCurrentRowToIndex(useWorkbenchStore, duplicatedConcrete!.id, useWorkbenchStore.getState().rows.length - 1);

      const scenarios = evaluateCurrentFloor("save-load-delta-floor-detour");
      assertFloorScenario("save-load-delta-floor-detour lab", scenarios.lab, FLOOR_OUTPUTS);
      assertFloorScenario("save-load-delta-floor-detour field", scenarios.field, FLOOR_OUTPUTS);

      return {
        field: scenarioEnvelope(scenarios.field, "floor"),
        lab: scenarioEnvelope(scenarios.lab, "floor"),
        requestedOutputs: [...useWorkbenchStore.getState().requestedOutputs],
        rows: normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows),
        savedScenarioId: (() => {
          useWorkbenchStore.getState().saveCurrentScenario();
          return useWorkbenchStore.getState().savedScenarios[0]?.id ?? null;
        })(),
        studyMode: useWorkbenchStore.getState().studyMode
      };
    };

    const buildSteel300UnspecifiedDetour = () => {
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(getPresetById("ubiq_steel_300_unspecified_bound").rows);

      const ceilingBoard = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "ceiling_board" && row.materialId === "firestop_board" && row.thicknessMm === "16"
      );
      const floorCovering = useWorkbenchStore.getState().rows.find(
        (row) =>
          row.floorRole === "floor_covering" &&
          row.materialId === "engineered_timber_with_acoustic_underlay" &&
          row.thicknessMm === "20"
      );
      expect(ceilingBoard).toBeTruthy();
      expect(floorCovering).toBeTruthy();

      useWorkbenchStore.getState().duplicateRow(ceilingBoard!.id);
      useWorkbenchStore.getState().duplicateRow(floorCovering!.id);

      let currentRows = useWorkbenchStore.getState().rows;
      const duplicatedBoard = currentRows[currentRows.findIndex((row) => row.id === ceilingBoard!.id) + 1];
      const duplicatedCovering = currentRows[currentRows.findIndex((row) => row.id === floorCovering!.id) + 1];
      expect(duplicatedBoard).toBeTruthy();
      expect(duplicatedCovering).toBeTruthy();

      useWorkbenchStore.getState().updateThickness(ceilingBoard!.id, "8");
      useWorkbenchStore.getState().updateThickness(duplicatedBoard!.id, "8");
      useWorkbenchStore.getState().updateThickness(floorCovering!.id, "10");
      useWorkbenchStore.getState().updateThickness(duplicatedCovering!.id, "10");
      moveCurrentRowToIndex(useWorkbenchStore, duplicatedBoard!.id, 0);

      const scenarios = evaluateCurrentFloor("save-load-steel-300-detour");
      assertFloorScenario("save-load-steel-300-detour lab", scenarios.lab, FLOOR_OUTPUTS);
      assertFloorScenario("save-load-steel-300-detour field", scenarios.field, FLOOR_OUTPUTS);

      return {
        field: scenarioEnvelope(scenarios.field, "floor"),
        lab: scenarioEnvelope(scenarios.lab, "floor"),
        requestedOutputs: [...useWorkbenchStore.getState().requestedOutputs],
        rows: normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows),
        savedScenarioId: (() => {
          useWorkbenchStore.getState().saveCurrentScenario();
          return useWorkbenchStore.getState().savedScenarios[0]?.id ?? null;
        })(),
        studyMode: useWorkbenchStore.getState().studyMode
      };
    };

    const buildSteel200UnspecifiedDetour = () => {
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(getPresetById("ubiq_steel_200_unspecified_bound").rows);

      const ceilingBoard = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "ceiling_board" && row.materialId === "firestop_board" && row.thicknessMm === "16"
      );
      const floorCovering = useWorkbenchStore.getState().rows.find(
        (row) =>
          row.floorRole === "floor_covering" &&
          row.materialId === "engineered_timber_with_acoustic_underlay" &&
          row.thicknessMm === "20"
      );
      expect(ceilingBoard).toBeTruthy();
      expect(floorCovering).toBeTruthy();

      useWorkbenchStore.getState().duplicateRow(ceilingBoard!.id);
      useWorkbenchStore.getState().duplicateRow(floorCovering!.id);

      let currentRows = useWorkbenchStore.getState().rows;
      const duplicatedBoard = currentRows[currentRows.findIndex((row) => row.id === ceilingBoard!.id) + 1];
      const duplicatedCovering = currentRows[currentRows.findIndex((row) => row.id === floorCovering!.id) + 1];
      expect(duplicatedBoard).toBeTruthy();
      expect(duplicatedCovering).toBeTruthy();

      useWorkbenchStore.getState().updateThickness(ceilingBoard!.id, "8");
      useWorkbenchStore.getState().updateThickness(duplicatedBoard!.id, "8");
      useWorkbenchStore.getState().updateThickness(floorCovering!.id, "10");
      useWorkbenchStore.getState().updateThickness(duplicatedCovering!.id, "10");
      moveCurrentRowToIndex(useWorkbenchStore, duplicatedBoard!.id, 0);

      const scenarios = evaluateCurrentFloor("save-load-steel-200-detour");
      assertFloorScenario("save-load-steel-200-detour lab", scenarios.lab, FLOOR_OUTPUTS);
      assertFloorScenario("save-load-steel-200-detour field", scenarios.field, FLOOR_OUTPUTS);

      return {
        field: scenarioEnvelope(scenarios.field, "floor"),
        lab: scenarioEnvelope(scenarios.lab, "floor"),
        requestedOutputs: [...useWorkbenchStore.getState().requestedOutputs],
        rows: normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows),
        savedScenarioId: (() => {
          useWorkbenchStore.getState().saveCurrentScenario();
          return useWorkbenchStore.getState().savedScenarios[0]?.id ?? null;
        })(),
        studyMode: useWorkbenchStore.getState().studyMode
      };
    };

    const buildSteel250BoundDetour = () => {
      useWorkbenchStore.getState().startStudyMode("floor");
      useWorkbenchStore.getState().appendRows(getPresetById("ubiq_steel_250_bound").rows);

      const ceilingBoard = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "ceiling_board" && row.materialId === "firestop_board" && row.thicknessMm === "16"
      );
      const baseStructure = useWorkbenchStore.getState().rows.find(
        (row) => row.floorRole === "base_structure" && row.materialId === "steel_joist_floor" && row.thicknessMm === "250"
      );
      expect(ceilingBoard).toBeTruthy();
      expect(baseStructure).toBeTruthy();

      useWorkbenchStore.getState().duplicateRow(ceilingBoard!.id);
      useWorkbenchStore.getState().duplicateRow(baseStructure!.id);

      let currentRows = useWorkbenchStore.getState().rows;
      const duplicatedBoard = currentRows[currentRows.findIndex((row) => row.id === ceilingBoard!.id) + 1];
      const duplicatedBase = currentRows[currentRows.findIndex((row) => row.id === baseStructure!.id) + 1];
      expect(duplicatedBoard).toBeTruthy();
      expect(duplicatedBase).toBeTruthy();

      useWorkbenchStore.getState().updateThickness(ceilingBoard!.id, "8");
      useWorkbenchStore.getState().updateThickness(duplicatedBoard!.id, "8");
      useWorkbenchStore.getState().updateThickness(baseStructure!.id, "125");
      useWorkbenchStore.getState().updateThickness(duplicatedBase!.id, "125");
      moveCurrentRowToIndex(useWorkbenchStore, duplicatedBoard!.id, 0);
      moveCurrentRowToIndex(useWorkbenchStore, duplicatedBase!.id, useWorkbenchStore.getState().rows.length - 1);

      const scenarios = evaluateCurrentFloor("save-load-steel-250-detour");
      assertFloorScenario("save-load-steel-250-detour lab", scenarios.lab, FLOOR_OUTPUTS);
      assertFloorScenario("save-load-steel-250-detour field", scenarios.field, FLOOR_OUTPUTS);

      return {
        field: scenarioEnvelope(scenarios.field, "floor"),
        lab: scenarioEnvelope(scenarios.lab, "floor"),
        requestedOutputs: [...useWorkbenchStore.getState().requestedOutputs],
        rows: normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows),
        savedScenarioId: (() => {
          useWorkbenchStore.getState().saveCurrentScenario();
          return useWorkbenchStore.getState().savedScenarios[0]?.id ?? null;
        })(),
        studyMode: useWorkbenchStore.getState().studyMode
      };
    };

    const assertReloadMatches = (args: {
      directField: ReturnType<typeof scenarioEnvelope>;
      directLab: ReturnType<typeof scenarioEnvelope>;
      expectedRequestedOutputs: readonly string[];
      expectedRows: ReturnType<typeof normalizeRowsForRoundtrip>;
      expectedStudyMode: "floor" | "wall";
      label: string;
      savedScenarioId: string | null;
    }) => {
      const {
        directField,
        directLab,
        expectedRequestedOutputs,
        expectedRows,
        expectedStudyMode,
        label,
        savedScenarioId
      } = args;

      if (!savedScenarioId) {
        failures.push(`${label}: expected a saved scenario id`);
        return;
      }

      useWorkbenchStore.getState().loadSavedScenario(savedScenarioId);

      if (useWorkbenchStore.getState().studyMode !== expectedStudyMode) {
        failures.push(`${label}: expected study mode ${expectedStudyMode} after reload`);
      }

      if (
        JSON.stringify(useWorkbenchStore.getState().requestedOutputs) !==
        JSON.stringify(expectedRequestedOutputs)
      ) {
        failures.push(`${label}: requested outputs changed after reload`);
      }

      if (
        JSON.stringify(normalizeRowsForRoundtrip(useWorkbenchStore.getState().rows)) !==
        JSON.stringify(expectedRows)
      ) {
        failures.push(`${label}: rows changed after reload`);
      }

      const restoredScenarios =
        expectedStudyMode === "floor"
          ? evaluateCurrentFloor(`${label}-restored`)
          : evaluateCurrentWall(`${label}-restored`);

      if (JSON.stringify(scenarioEnvelope(restoredScenarios.lab, expectedStudyMode)) !== JSON.stringify(directLab)) {
        failures.push(`${label}: lab snapshot or warnings changed after reload`);
      }

      if (JSON.stringify(scenarioEnvelope(restoredScenarios.field, expectedStudyMode)) !== JSON.stringify(directField)) {
        failures.push(`${label}: field snapshot or warnings changed after reload`);
      }

      if (expectedStudyMode === "floor") {
        assertFloorScenario(`${label} lab`, restoredScenarios.lab, FLOOR_OUTPUTS);
        assertFloorScenario(`${label} field`, restoredScenarios.field, FLOOR_OUTPUTS);
      } else {
        assertWallScenario(`${label} lab`, restoredScenarios.lab, WALL_LAB_OUTPUTS);
        assertWallScenario(`${label} field`, restoredScenarios.field, WALL_FIELD_OUTPUTS);
      }
    };

    const representativeSeededFloorCases = [
      {
        build: buildHeavyConcreteFloorDetour,
        label: "heavy floor detour"
      },
      {
        build: buildBoundFloorDetour,
        label: "bound floor detour"
      },
      {
        build: buildWetBoundFloorDetour,
        label: "wet bound floor detour"
      },
      {
        build: buildProductExactFloorDetour,
        label: "product exact floor detour"
      },
      {
        build: buildNoScreedProductExactFloorDetour,
        label: "official no-screed exact floor detour"
      },
      {
        build: buildExactFamilyFloorDetour,
        label: "exact family floor detour"
      },
      {
        build: buildHollowCoreExactFloorDetour,
        label: "hollow-core exact floor detour"
      },
      {
        build: buildDeltaFloorDetour,
        label: "delta floor detour"
      },
      {
        build: buildSteel300UnspecifiedDetour,
        label: "steel 300 unspecified detour"
      },
      {
        build: buildSteel200UnspecifiedDetour,
        label: "steel 200 unspecified detour"
      },
      {
        build: buildSteel250BoundDetour,
        label: "steel 250 interpolation detour"
      }
    ] as const;

    const wallDirect = buildWallDetour();
    const productExactBoundary = buildProductExactFloorDetour();
    buildWallDetour();
    const exactFamilyBoundary = buildExactFamilyFloorDetour();
    buildWallDetour();
    buildDeltaFloorDetour();
    buildWallDetour();
    const steel300Boundary = buildSteel300UnspecifiedDetour();

    const retainedIds = new Set(useWorkbenchStore.getState().savedScenarios.map((scenario) => scenario.id));
    expect(useWorkbenchStore.getState().savedScenarios).toHaveLength(8);
    for (const savedScenarioId of [
      wallDirect.savedScenarioId,
      productExactBoundary.savedScenarioId,
      exactFamilyBoundary.savedScenarioId,
      steel300Boundary.savedScenarioId
    ]) {
      expect(savedScenarioId).toBeTruthy();
      expect(retainedIds.has(savedScenarioId!)).toBe(true);
    }

    assertReloadMatches({
      directField: wallDirect.field,
      directLab: wallDirect.lab,
      expectedRequestedOutputs: wallDirect.requestedOutputs,
      expectedRows: wallDirect.rows,
      expectedStudyMode: wallDirect.studyMode,
      label: "oldest wall detour at saved-scenario retention boundary",
      savedScenarioId: wallDirect.savedScenarioId
    });
    assertReloadMatches({
      directField: exactFamilyBoundary.field,
      directLab: exactFamilyBoundary.lab,
      expectedRequestedOutputs: exactFamilyBoundary.requestedOutputs,
      expectedRows: exactFamilyBoundary.rows,
      expectedStudyMode: exactFamilyBoundary.studyMode,
      label: "mid-window exact family detour at saved-scenario retention boundary",
      savedScenarioId: exactFamilyBoundary.savedScenarioId
    });
    assertReloadMatches({
      directField: steel300Boundary.field,
      directLab: steel300Boundary.lab,
      expectedRequestedOutputs: steel300Boundary.requestedOutputs,
      expectedRows: steel300Boundary.rows,
      expectedStudyMode: steel300Boundary.studyMode,
      label: "newest warning-heavy steel detour at saved-scenario retention boundary",
      savedScenarioId: steel300Boundary.savedScenarioId
    });

    for (const [index, currentCase] of representativeSeededFloorCases.entries()) {
      const partnerCase =
        representativeSeededFloorCases[(index + 1) % representativeSeededFloorCases.length]!;
      const secondaryPartnerCase =
        representativeSeededFloorCases[(index + 2) % representativeSeededFloorCases.length]!;
      const tertiaryPartnerCase =
        representativeSeededFloorCases[(index + 3) % representativeSeededFloorCases.length]!;

      const direct = currentCase.build();
      buildWallDetour();
      partnerCase.build();
      buildWallDetour();
      secondaryPartnerCase.build();
      buildWallDetour();
      tertiaryPartnerCase.build();
      buildWallDetour();

      assertReloadMatches({
        directField: direct.field,
        directLab: direct.lab,
        expectedRequestedOutputs: direct.requestedOutputs,
        expectedRows: direct.rows,
        expectedStudyMode: direct.studyMode,
        label: `${currentCase.label} at saved-scenario retention boundary after ${partnerCase.label}, ${secondaryPartnerCase.label}, and ${tertiaryPartnerCase.label}`,
        savedScenarioId: direct.savedScenarioId
      });
    }

    expect(failures).toEqual([]);
  }, 30_000);
});

import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";

import { getPresetById } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

export const FLOOR_OUTPUTS: readonly RequestedOutputId[] = [
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

export const WALL_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "STC", "C", "Ctr"];
export const WALL_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["R'w", "Dn,w", "DnT,w", "DnT,A"];

export const FLOOR_AIRBORNE_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

export const FLOOR_IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

export const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

export const DEFAULT_FLOOR_REQUESTED_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"];
export const DEFAULT_WALL_REQUESTED_OUTPUTS = ["Rw", "STC", "C", "Ctr"];

export type SplitPlan = {
  parts: readonly string[];
  rowIndex: number;
};

export type RouteMixedGeneratedCase = {
  id: string;
  label: string;
  requestedOutputs: readonly string[];
  rows: readonly Omit<LayerDraft, "id">[];
  splitPlans: readonly SplitPlan[];
  studyMode: "floor" | "wall";
};

export const WALL_DETOUR_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "security_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "security_board", thicknessMm: "12.5" },
  { materialId: "ytong_aac_d700", thicknessMm: "100" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "rockwool", thicknessMm: "40" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
] as const;

export const FLOOR_DETOUR_ROWS: readonly Omit<LayerDraft, "id">[] = getPresetById("tuas_open_box_dry_exact").rows;

function buildRows(rows: readonly Omit<LayerDraft, "id">[], id: string): LayerDraft[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${id}-${index + 1}`
  }));
}

export function createMemoryStorage(): Storage {
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

export function evaluateFloorScenario(id: string, rows: readonly LayerDraft[]) {
  return {
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
  };
}

export function evaluateWallScenario(id: string, rows: readonly LayerDraft[]) {
  return {
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
  };
}

export function scenarioSnapshot(
  scenario: ReturnType<typeof evaluateScenario>,
  studyMode: "floor" | "wall"
) {
  const result = scenario.result;

  return {
    boundFloorSystemMatchId: result?.boundFloorSystemMatch?.system.id ?? null,
    c: result?.metrics.estimatedCDb ?? null,
    ctr: result?.metrics.estimatedCtrDb ?? null,
    dnTA: result?.metrics.estimatedDnTADb ?? null,
    dnTw: result?.metrics.estimatedDnTwDb ?? null,
    dnW: result?.metrics.estimatedDnWDb ?? null,
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
    unsupportedTargetOutputs: result?.unsupportedTargetOutputs ?? null,
    warnings: result?.warnings ?? null
  };
}

export function getFloorValue(
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

export function getWallValue(
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

export function isInsideFloorCorridor(output: RequestedOutputId, value: number) {
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

export function isInsideWallCorridor(output: RequestedOutputId, value: number) {
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

export function assertScenarioSupportSurface(input: {
  failures: string[];
  label: string;
  outputs: readonly RequestedOutputId[];
  scenario: ReturnType<typeof evaluateScenario>;
  studyMode: "floor" | "wall";
}) {
  if (!input.scenario.result) {
    input.failures.push(`${input.label}: scenario result should stay available`);
    return;
  }

  if (!input.scenario.result.ok) {
    input.failures.push(`${input.label}: result should remain ok`);
  }

  const supported = new Set(input.scenario.result.supportedTargetOutputs);
  const unsupported = new Set(input.scenario.result.unsupportedTargetOutputs);

  for (const output of input.outputs) {
    if (supported.has(output) === unsupported.has(output)) {
      input.failures.push(`${input.label}: ${output} should belong to exactly one support bucket`);
    }

    const card = buildOutputCard({
      output,
      result: input.scenario.result,
      studyMode: input.studyMode
    });

    if (supported.has(output)) {
      const value =
        input.studyMode === "floor"
          ? getFloorValue(input.scenario.result, output)
          : getWallValue(input.scenario.result, output);

      const sane =
        typeof value === "number" &&
        Number.isFinite(value) &&
        (input.studyMode === "floor"
          ? isInsideFloorCorridor(output, value)
          : isInsideWallCorridor(output, value));

      if (!sane) {
        input.failures.push(`${input.label}: supported ${input.studyMode} output ${output} should stay finite and sane, got ${String(value)}`);
      }

      if (card.status === "unsupported" || card.status === "needs_input") {
        input.failures.push(`${input.label}: supported ${input.studyMode} output ${output} should not render as ${card.status}`);
      }
    } else if (card.status === "live" || card.status === "bound") {
      input.failures.push(`${input.label}: unsupported ${input.studyMode} output ${output} should not render live/bound`);
    }
  }
}

export function buildGeneratedRows(testCase: RouteMixedGeneratedCase) {
  return buildRows(testCase.rows, testCase.id);
}

export function applySplitPlansToStore(
  useWorkbenchStore: {
    getState: () => {
      duplicateRow: (id: string) => void;
      rows: LayerDraft[];
      updateThickness: (id: string, thicknessMm: string) => void;
    };
  },
  plans: readonly SplitPlan[]
) {
  const baselineRows = [...useWorkbenchStore.getState().rows];
  const sorted = [...plans].sort((left, right) => right.rowIndex - left.rowIndex);

  for (const plan of sorted) {
    const target = baselineRows[plan.rowIndex];

    if (!target) {
      throw new Error(`Cannot split missing route row at index ${plan.rowIndex}.`);
    }

    useWorkbenchStore.getState().duplicateRow(target.id);

    const currentRows = useWorkbenchStore.getState().rows;
    const targetIndex = currentRows.findIndex((row) => row.id === target.id);
    const duplicates = currentRows.slice(targetIndex, targetIndex + plan.parts.length).map((row) => row.id);

    if (duplicates.length !== plan.parts.length) {
      throw new Error(`Expected ${plan.parts.length} rows after splitting ${target.id}, found ${duplicates.length}.`);
    }

    duplicates.forEach((id, index) => {
      useWorkbenchStore.getState().updateThickness(id, plan.parts[index]!);
    });
  }
}

export const ROUTE_MIXED_GENERATED_CASES: readonly RouteMixedGeneratedCase[] = [
  {
    id: "route-heavy-concrete",
    label: "Heavy concrete floor",
    requestedOutputs: DEFAULT_FLOOR_REQUESTED_OUTPUTS,
    rows: getPresetById("heavy_concrete_impact_floor").rows,
    splitPlans: [
      { parts: ["20", "30"], rowIndex: 1 },
      { parts: ["60", "90"], rowIndex: 3 }
    ],
    studyMode: "floor"
  },
  {
    id: "route-open-box-dry",
    label: "Open-box dry exact floor",
    requestedOutputs: DEFAULT_FLOOR_REQUESTED_OUTPUTS,
    rows: getPresetById("tuas_open_box_dry_exact").rows,
    splitPlans: [
      { parts: ["20", "30"], rowIndex: 6 },
      { parts: ["25", "35"], rowIndex: 7 }
    ],
    studyMode: "floor"
  },
  {
    id: "route-open-web-bound",
    label: "Open-web bound floor",
    requestedOutputs: DEFAULT_FLOOR_REQUESTED_OUTPUTS,
    rows: getPresetById("ubiq_open_web_300_bound").rows,
    splitPlans: [
      { parts: ["8", "8"], rowIndex: 0 },
      { parts: ["120", "180"], rowIndex: 5 }
    ],
    studyMode: "floor"
  },
  {
    id: "route-steel-fallback",
    label: "Steel fallback floor",
    requestedOutputs: DEFAULT_FLOOR_REQUESTED_OUTPUTS,
    rows: getPresetById("steel_suspended_fallback").rows,
    splitPlans: [
      { parts: ["40", "60"], rowIndex: 2 },
      { parts: ["50", "70"], rowIndex: 3 }
    ],
    studyMode: "floor"
  },
  {
    id: "route-wall-screening",
    label: "Concrete screening wall",
    requestedOutputs: DEFAULT_WALL_REQUESTED_OUTPUTS,
    rows: getPresetById("concrete_wall").rows,
    splitPlans: [
      { parts: ["20", "30"], rowIndex: 1 },
      { parts: ["40", "60"], rowIndex: 3 }
    ],
    studyMode: "wall"
  },
  {
    id: "route-wall-held-aac",
    label: "Held AAC wall",
    requestedOutputs: DEFAULT_WALL_REQUESTED_OUTPUTS,
    rows: WALL_DETOUR_ROWS,
    splitPlans: [
      { parts: ["15", "35"], rowIndex: 1 },
      { parts: ["6", "6.5"], rowIndex: 6 }
    ],
    studyMode: "wall"
  }
] as const;

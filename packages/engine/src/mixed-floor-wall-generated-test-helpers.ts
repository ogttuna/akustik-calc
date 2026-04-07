import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

export const FLOOR_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"];
export const FLOOR_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"];
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

export type SplitPlan = {
  parts: readonly number[];
  rowIndex: number;
};

export type EngineMixedGeneratedCase = {
  fieldOptions: Parameters<typeof calculateAssembly>[1];
  id: string;
  label: string;
  labOptions: Parameters<typeof calculateAssembly>[1];
  rows: readonly LayerInput[];
  splitPlans: readonly SplitPlan[];
  studyMode: "floor" | "wall";
};

function splitRow(rows: readonly LayerInput[], rowIndex: number, parts: readonly number[]): LayerInput[] {
  const row = rows[rowIndex];

  if (!row) {
    throw new Error(`Cannot split missing row at index ${rowIndex}.`);
  }

  return [
    ...rows.slice(0, rowIndex),
    ...parts.map((thicknessMm) => ({ ...row, thicknessMm })),
    ...rows.slice(rowIndex + 1)
  ];
}

export function applySplitPlans(rows: readonly LayerInput[], plans: readonly SplitPlan[]): LayerInput[] {
  const sorted = [...plans].sort((left, right) => right.rowIndex - left.rowIndex);
  let current = [...rows];

  for (const plan of sorted) {
    current = splitRow(current, plan.rowIndex, plan.parts);
  }

  return current;
}

export function buildGeneratedVariants(testCase: EngineMixedGeneratedCase) {
  const individual = testCase.splitPlans.map((plan, index) => ({
    id: `${testCase.id}:split-${index + 1}:${plan.parts.join("+")}`,
    rows: applySplitPlans(testCase.rows, [plan])
  }));

  const combined =
    testCase.splitPlans.length > 1
      ? [
          {
            id: `${testCase.id}:combined`,
            rows: applySplitPlans(testCase.rows, testCase.splitPlans)
          }
        ]
      : [];

  return [...individual, ...combined];
}

export function resultSnapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    boundFloorSystemEstimateKind: result.boundFloorSystemEstimate?.kind ?? null,
    boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    c: result.metrics.estimatedCDb ?? null,
    ctr: result.metrics.estimatedCtrDb ?? null,
    dnTA: result.metrics.estimatedDnTADb ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    dnW: result.metrics.estimatedDnWDb ?? null,
    dynamicFamily: result.dynamicAirborneTrace?.detectedFamily ?? null,
    floorSystemEstimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
    lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? result.metrics.estimatedRwDb ?? null,
    rwDb: result.metrics.estimatedRwDb ?? null,
    rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    warnings: result.warnings
  };
}

const HEAVY_CONCRETE_ROWS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
];

const CLT_DRY_ROWS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 30 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
];

const STEEL_BOUND_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
];

const STEEL_FALLBACK_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 120 },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
];

const SCREENING_WALL_ROWS: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "concrete", thicknessMm: 100 }
];

const HELD_WALL_ROWS: readonly LayerInput[] = [
  { materialId: "security_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "security_board", thicknessMm: 12.5 },
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

export const ENGINE_MIXED_GENERATED_CASES: readonly EngineMixedGeneratedCase[] = [
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-heavy-concrete",
    label: "Heavy concrete floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: HEAVY_CONCRETE_ROWS,
    splitPlans: [
      { parts: [20, 30], rowIndex: 1 },
      { parts: [60, 90], rowIndex: 3 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-clt-dry",
    label: "CLT dry exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: CLT_DRY_ROWS,
    splitPlans: [
      { parts: [20, 40], rowIndex: 1 },
      { parts: [60, 80], rowIndex: 3 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-open-web-bound",
    label: "Open-web bound floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: STEEL_BOUND_ROWS,
    splitPlans: [
      { parts: [8, 8], rowIndex: 0 },
      { parts: [120, 180], rowIndex: 5 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-steel-fallback",
    label: "Steel suspended fallback floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: STEEL_FALLBACK_ROWS,
    splitPlans: [
      { parts: [40, 60], rowIndex: 2 },
      { parts: [50, 70], rowIndex: 3 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    },
    id: "wall-screening-concrete",
    label: "Concrete screening wall",
    labOptions: { calculator: "dynamic", targetOutputs: WALL_LAB_OUTPUTS },
    rows: SCREENING_WALL_ROWS,
    splitPlans: [
      { parts: [20, 30], rowIndex: 1 },
      { parts: [40, 60], rowIndex: 3 }
    ],
    studyMode: "wall"
  },
  {
    fieldOptions: {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    },
    id: "wall-held-aac",
    label: "Held AAC wall",
    labOptions: { calculator: "dynamic", targetOutputs: WALL_LAB_OUTPUTS },
    rows: HELD_WALL_ROWS,
    splitPlans: [
      { parts: [15, 35], rowIndex: 1 },
      { parts: [6, 6.5], rowIndex: 6 }
    ],
    studyMode: "wall"
  }
] as const;

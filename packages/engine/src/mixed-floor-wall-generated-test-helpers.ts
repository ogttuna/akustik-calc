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

export const SELECTED_ENGINE_MIXED_GENERATED_ROUTE_CASES = [
  {
    engineCaseId: "wall-held-aac",
    routeId: "route-wall-held-aac"
  },
  {
    engineCaseId: "wall-heavy-composite-hint-suppression",
    routeId: "route-wall-heavy-composite-hint-suppression"
  },
  {
    engineCaseId: "floor-dataholz-gdmtxa04a-boundary",
    routeId: "route-dataholz-gdmtxa04a-boundary"
  },
  {
    engineCaseId: "floor-tuas-c11c-fail-closed",
    routeId: "route-tuas-c11c-fail-closed"
  },
  {
    engineCaseId: "floor-open-box-exact",
    routeId: "route-open-box-exact"
  },
  {
    engineCaseId: "floor-open-web-bound",
    routeId: "route-open-web-bound"
  }
] as const;

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

const DATAHOLZ_GDMTXA04A_BOUNDARY_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 60 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }
];

const TUAS_C11C_COMBINED_WET_FAIL_CLOSED_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 30 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const OPEN_BOX_DRY_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const HOLLOW_CORE_VINYL_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "genieclip_rst", thicknessMm: 16 },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 5 },
  { floorRole: "resilient_layer", materialId: "geniemat_rst05", thicknessMm: 5 },
  { floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 200 }
];

const KNAUF_CONCRETE_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
  { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 100 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
];

const OPEN_WEB_200_EXACT_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 }
];

const KNAUF_ACOUSTIC_TIMBER_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
];

const DATAHOLZ_TIMBER_FRAME_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 120 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 40 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
];

const DATAHOLZ_DRY_FLOOR_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 40 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
];

const DATAHOLZ_DRY_RC_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 240 }
];

const TUAS_CONCRETE_DRY_ROWS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 160 }
];

const KNAUF_DIRECT_TIMBER_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "impactstop_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
  { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
];

const OPEN_WEB_400_EXACT_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 }
];

const TUAS_OPEN_BOX_EXACT_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const KNAUF_TIMBER_MOUNT_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
  { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
];

const TUAS_CLT_EXACT_ROWS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
];

const TUAS_CLT_260_EXACT_ROWS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

const REGUPOL_CURVE_8_EXACT_ROWS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "resilient_layer", materialId: "regupol_sonus_curve_8", thicknessMm: 8 },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
];

const REGUPOL_MULTI_45_PORCELAIN_ROWS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "porcelain_tile", thicknessMm: 10 },
  { floorRole: "resilient_layer", materialId: "regupol_sonus_multi_4_5", thicknessMm: 4.5 },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
];

const REGUPOL_CURVE_8_WET_BOUND_ROWS: readonly LayerInput[] = [
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 70 },
  { floorRole: "resilient_layer", materialId: "regupol_sonus_curve_8", thicknessMm: 8 },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 140 }
];

const GETZNER_AFM_33_DELTA_ROWS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
  { floorRole: "resilient_layer", materialId: "getzner_afm_33", thicknessMm: 8 },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
];

const GETZNER_AFM_35_DELTA_ROWS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
  { floorRole: "resilient_layer", materialId: "getzner_afm_35", thicknessMm: 8 },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
];

const STEEL_BOUND_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
];

const UBIQ_STEEL_250_BOUND_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
];

const UBIQ_STEEL_200_UNSPECIFIED_BOUND_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 }
];

const UBIQ_STEEL_300_UNSPECIFIED_BOUND_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 300 }
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

const HEAVY_COMPOSITE_WALL_ROWS: readonly LayerInput[] = [
  { materialId: "concrete", thicknessMm: 80 },
  { materialId: "pumice_block", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "concrete", thicknessMm: 80 }
];

// Step-7 gap-close: mirrors the `masonry_brick_wall` preset
// (apps/web/features/workbench/preset-definitions.ts:120-123).
// Exercises the 2026-04-21 lab-fallback anchor path that caught
// the ISO 140-4 R'w ≤ Rw violation on Wienerberger Porotherm
// assemblies — `applyVerifiedAirborneCatalogAnchor` falls back
// to the lab-mode catalog row for field/building contexts.
const MASONRY_BRICK_WALL_ROWS: readonly LayerInput[] = [
  { materialId: "dense_plaster", thicknessMm: 13 },
  { materialId: "porotherm_pls_100", thicknessMm: 100 },
  { materialId: "dense_plaster", thicknessMm: 13 }
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
    id: "floor-dataholz-gdmtxa04a-boundary",
    label: "Dataholz GDMTXA04A manual-match boundary floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: DATAHOLZ_GDMTXA04A_BOUNDARY_ROWS,
    splitPlans: [
      { parts: [25, 35], rowIndex: 3 },
      { parts: [32.5, 32.5], rowIndex: 4 },
      { parts: [80, 80], rowIndex: 5 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-tuas-c11c-fail-closed",
    label: "TUAS C11c fail-closed combined wet floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: TUAS_C11C_COMBINED_WET_FAIL_CLOSED_ROWS,
    splitPlans: [
      { parts: [12, 18], rowIndex: 6 },
      { parts: [130, 130], rowIndex: 9 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-regupol-multi-45-porcelain-exact",
    label: "REGUPOL Multi 4.5 porcelain exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: REGUPOL_MULTI_45_PORCELAIN_ROWS,
    splitPlans: [
      { parts: [5, 5], rowIndex: 0 },
      { parts: [75, 75], rowIndex: 2 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-ubiq-steel-300-unspecified-bound",
    label: "UBIQ steel 300 unspecified bound floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: UBIQ_STEEL_300_UNSPECIFIED_BOUND_ROWS,
    splitPlans: [
      { parts: [8, 8], rowIndex: 0 },
      { parts: [10, 10], rowIndex: 3 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-getzner-afm-35-delta",
    label: "Getzner AFM 35 Delta floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: GETZNER_AFM_35_DELTA_ROWS,
    splitPlans: [
      { parts: [25, 25], rowIndex: 1 },
      { parts: [75, 75], rowIndex: 3 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-ubiq-steel-200-unspecified-bound",
    label: "UBIQ steel 200 unspecified bound floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: UBIQ_STEEL_200_UNSPECIFIED_BOUND_ROWS,
    splitPlans: [
      { parts: [8, 8], rowIndex: 0 },
      { parts: [10, 10], rowIndex: 3 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-getzner-afm-33-delta",
    label: "Getzner AFM 33 Delta floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: GETZNER_AFM_33_DELTA_ROWS,
    splitPlans: [
      { parts: [25, 25], rowIndex: 1 },
      { parts: [75, 75], rowIndex: 3 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-ubiq-steel-250-bound",
    label: "UBIQ steel 250 bound floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: UBIQ_STEEL_250_BOUND_ROWS,
    splitPlans: [
      { parts: [8, 8], rowIndex: 0 },
      { parts: [125, 125], rowIndex: 5 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-regupol-curve-8-wet-bound",
    label: "REGUPOL wet bound floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: REGUPOL_CURVE_8_WET_BOUND_ROWS,
    splitPlans: [
      { parts: [35, 35], rowIndex: 0 },
      { parts: [70, 70], rowIndex: 2 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-regupol-curve-8-exact",
    label: "REGUPOL Curve 8 exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: REGUPOL_CURVE_8_EXACT_ROWS,
    splitPlans: [
      { parts: [15, 15], rowIndex: 1 },
      { parts: [75, 75], rowIndex: 3 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-open-box-dry",
    label: "Open-box dry exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: OPEN_BOX_DRY_ROWS,
    splitPlans: [
      { parts: [20, 30], rowIndex: 6 },
      { parts: [25, 35], rowIndex: 7 }
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
    id: "floor-hollow-core-vinyl",
    label: "Hollow-core vinyl exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: HOLLOW_CORE_VINYL_ROWS,
    splitPlans: [
      { parts: [8, 8], rowIndex: 0 },
      { parts: [100, 100], rowIndex: 4 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-knauf-concrete",
    label: "Knauf concrete exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: KNAUF_CONCRETE_ROWS,
    splitPlans: [
      { parts: [6.5, 6.5], rowIndex: 0 },
      { parts: [75, 75], rowIndex: 5 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-open-web-200-exact",
    label: "Open-web 200 exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: OPEN_WEB_200_EXACT_ROWS,
    splitPlans: [
      { parts: [8, 8], rowIndex: 0 },
      { parts: [100, 100], rowIndex: 7 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-knauf-acoustic-timber",
    label: "Knauf acoustic timber exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: KNAUF_ACOUSTIC_TIMBER_ROWS,
    splitPlans: [
      { parts: [8, 8], rowIndex: 0 },
      { parts: [120, 120], rowIndex: 6 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-tuas-concrete-dry",
    label: "TUAS concrete dry exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: TUAS_CONCRETE_DRY_ROWS,
    splitPlans: [
      { parts: [20, 30], rowIndex: 2 },
      { parts: [80, 80], rowIndex: 4 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-knauf-direct-timber",
    label: "Knauf direct timber exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: KNAUF_DIRECT_TIMBER_ROWS,
    splitPlans: [
      { parts: [6.5, 6.5], rowIndex: 0 },
      { parts: [7.5, 7.5], rowIndex: 2 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-open-web-400-exact",
    label: "Open-web 400 exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: OPEN_WEB_400_EXACT_ROWS,
    splitPlans: [
      { parts: [8, 8], rowIndex: 0 },
      { parts: [200, 200], rowIndex: 7 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-open-box-exact",
    label: "TUAS open-box exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: TUAS_OPEN_BOX_EXACT_ROWS,
    splitPlans: [
      { parts: [4, 4], rowIndex: 4 },
      { parts: [1.5, 1.5], rowIndex: 5 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-knauf-timber-mount",
    label: "Knauf timber mount exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: KNAUF_TIMBER_MOUNT_ROWS,
    splitPlans: [
      { parts: [70, 75], rowIndex: 1 },
      { parts: [7.5, 7.5], rowIndex: 3 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-tuas-clt-exact",
    label: "TUAS CLT exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: TUAS_CLT_EXACT_ROWS,
    splitPlans: [
      { parts: [4, 4], rowIndex: 0 },
      { parts: [1.5, 1.5], rowIndex: 1 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-tuas-clt-260-exact",
    label: "TUAS CLT 260 exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: TUAS_CLT_260_EXACT_ROWS,
    splitPlans: [
      { parts: [4, 4], rowIndex: 0 },
      { parts: [1.5, 1.5], rowIndex: 1 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-dataholz-timber-frame",
    label: "Dataholz timber-frame exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: DATAHOLZ_TIMBER_FRAME_ROWS,
    splitPlans: [
      { parts: [6.25, 6.25], rowIndex: 0 },
      { parts: [110, 110], rowIndex: 6 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-dataholz-dry",
    label: "Dataholz dry exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: DATAHOLZ_DRY_FLOOR_ROWS,
    splitPlans: [
      { parts: [6.25, 6.25], rowIndex: 0 },
      { parts: [20, 20], rowIndex: 4 }
    ],
    studyMode: "floor"
  },
  {
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    id: "floor-dataholz-dry-rc",
    label: "Dataholz Dry RC exact floor",
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    rows: DATAHOLZ_DRY_RC_ROWS,
    splitPlans: [
      { parts: [6.25, 6.25], rowIndex: 0 },
      { parts: [120, 120], rowIndex: 6 }
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
  },
  {
    fieldOptions: {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    },
    id: "wall-heavy-composite-hint-suppression",
    label: "Heavy composite hint-suppression wall",
    labOptions: { calculator: "dynamic", targetOutputs: WALL_LAB_OUTPUTS },
    rows: HEAVY_COMPOSITE_WALL_ROWS,
    splitPlans: [
      { parts: [40, 40], rowIndex: 0 },
      { parts: [50, 50], rowIndex: 1 }
    ],
    studyMode: "wall"
  },
  {
    fieldOptions: {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    },
    id: "wall-masonry-brick",
    label: "Masonry brick wall (lab-fallback anchor exercise)",
    labOptions: { calculator: "dynamic", targetOutputs: WALL_LAB_OUTPUTS },
    rows: MASONRY_BRICK_WALL_ROWS,
    // Split the 100 mm porotherm core into two 50 mm halves —
    // ensures the duplicate-swap grid exercises the core row
    // while keeping symmetric plaster facings intact.
    splitPlans: [
      { parts: [50, 50], rowIndex: 1 }
    ],
    studyMode: "wall"
  }
] as const;

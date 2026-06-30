import type {
  AcousticInputFieldId,
  AcousticInputRouteFamily,
  AirborneContext,
  ExactImpactSource,
  RequestedOutputId
} from "@dynecho/shared";

import { IMPACT_RATING_FREQS_THIRD } from "./impact-iso717";
import {
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_STATUS,
  buildPostV1RouteInputFamilyFirstClassSurface
} from "./post-v1-route-input-family-first-class-surface-v1";

export const POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN =
  "post_v1_industry_grade_golden_scenario_matrix_v1_plan";

export const POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_STATUS =
  "post_v1_industry_grade_golden_scenario_matrix_v1_landed_no_runtime_selected_post_v1_route_required_input_question_engine_v1";

export const POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_CANDIDATE_ID =
  "post_v1_industry_grade_golden_scenario_matrix_v1";

export const POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_ACTION =
  "post_v1_route_required_input_question_engine_v1_plan";

export const POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-route-required-input-question-engine-v1-contract.test.ts";

export const POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PLAN_2026-06-30.md";

export const POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_LABEL =
  "post-V1 route-required input question engine V1";

export const POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  goldenScenarioRows: 40,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  rankedGapLedgerRows: 8,
  requiredPhysicalInputsCaptured: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  selectedNextValueOrBoundaryOwner: 1,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 12
} as const;

export type GoldenScenarioFamily =
  | "wall_airborne"
  | "floor_impact"
  | "ceiling_airborne"
  | "roof_airborne"
  | "opening_facade"
  | "oitc"
  | "field_building"
  | "metric_boundary";

export type GoldenScenarioStatus = "calculable" | "needs_input" | "unsupported";

export type GoldenScenarioEvidenceTier =
  | "exact_measured_row"
  | "same_family_bounded_delta"
  | "owned_formula_route"
  | "route_input_surface"
  | "unsupported_boundary";

export type GoldenScenarioBasisPosture =
  | "same_metric_same_basis"
  | "formula_owned_basis"
  | "field_building_adapter_basis"
  | "missing_route_physics"
  | "unsupported_alias_blocked";

export type GoldenScenarioRoute = "wall" | "floor" | "ceiling" | "roof" | "opening" | "facade";

export type GoldenScenarioRow = {
  readonly basisPosture: GoldenScenarioBasisPosture;
  readonly evidenceTier: GoldenScenarioEvidenceTier;
  readonly family: GoldenScenarioFamily;
  readonly id: string;
  readonly missingPhysicalInputs: readonly AcousticInputFieldId[];
  readonly notes: readonly string[];
  readonly protects: readonly string[];
  readonly route: GoldenScenarioRoute;
  readonly routeFamilies: readonly AcousticInputRouteFamily[];
  readonly runtimeValueMovement: false;
  readonly status: GoldenScenarioStatus;
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly unsupportedOutputs: readonly RequestedOutputId[];
};

export type GoldenGapLedgerRow = {
  readonly blockedBy: readonly string[];
  readonly expectedNextMovement: {
    readonly newCalculableRequestShapes: number;
    readonly newCalculableTargetOutputs: number;
    readonly requiredPhysicalInputsCaptured: number;
    readonly runtimeValuesMoved: number;
  };
  readonly gapType:
    | "input_surface_owner"
    | "value_moving_owner"
    | "accuracy_owner"
    | "boundary_owner";
  readonly id: string;
  readonly label: string;
  readonly rank: number;
  readonly reason: string;
  readonly rejectedWrongPaths: readonly string[];
  readonly scenarioIds: readonly string[];
  readonly selected: boolean;
};

export type PostV1IndustryGradeGoldenScenarioMatrixV1Result = {
  readonly counters: typeof POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_COUNTERS;
  readonly previousAction: typeof POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN;
  readonly previousStatus: typeof POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_STATUS;
  readonly rankedGapLedgerRows: readonly GoldenGapLedgerRow[];
  readonly runtimeValueMovement: false;
  readonly scenarioRows: readonly GoldenScenarioRow[];
  readonly selectedCandidateId: typeof POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_CANDIDATE_ID;
  readonly selectedNext: {
    readonly action: typeof POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_ACTION;
    readonly file: typeof POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_FILE;
    readonly label: typeof POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_LABEL;
    readonly plan: typeof POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_PLAN_DOC;
  };
  readonly status: typeof POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_STATUS;
};

const COMPLETE_FIELD_BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "single_conservative_path",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  hostWallAreaM2: 12,
  junctionCouplingLengthM: 4,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 45,
  sourceRoomVolumeM3: 52
} as const satisfies AirborneContext;

const COMPLETE_OITC_CONTEXT = {
  facadeOutdoorContext: "outdoor_indoor_facade",
  frequencyBandSet: "one_third_octave_80_4000",
  hostWallAreaM2: 12,
  openingLeakElements: [
    {
      areaM2: 2.4,
      count: 1,
      elementTransmissionLossCurve: {
        frequenciesHz: [
          80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250,
          1600, 2000, 2500, 3150, 4000
        ],
        transmissionLossDb: [
          19, 21, 23, 25, 28, 30, 32, 34, 35, 37, 39, 41, 43, 44, 45, 46,
          47, 48
        ]
      },
      elementType: "facade_element",
      frequencyBandSet: "one_third_octave_80_4000",
      sealLeakageClass: "sealed"
    }
  ]
} as const satisfies AirborneContext;

const COMPLETE_CEILING_PLENUM_CONTEXT = {
  ceilingPlenum: {
    absorberFlowResistivityPaSM2: 9000,
    absorberThicknessMm: 80,
    cavityOrPlenumDepthMm: 240,
    leafGrouping: "double_leaf_decoupled_plenum",
    leafSurfaceMassKgM2: 18,
    supportCouplingOrHangerClass: "resilient_hanger"
  },
  hangerOrSupportCouplingClass: "resilient_hanger",
  roofOrCeilingMountingContext: "suspended_ceiling_below_floor",
  routeIntent: "suspended_ceiling_airborne_lining",
  suspendedCeilingAirborneOrImpactIntent: "airborne_ceiling_plenum"
} as const satisfies AirborneContext;

const ASTM_FIELD_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "field",
  levelsDb: IMPACT_RATING_FREQS_THIRD.map((_, index) => 57 + (index % 4)),
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

const ISO_LAB_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "lab",
  levelsDb: IMPACT_RATING_FREQS_THIRD.map((_, index) => 60 + (index % 3)),
  standardMethod: "ISO 10140-3"
} as const satisfies ExactImpactSource;

function staticScenario(input: Omit<GoldenScenarioRow, "runtimeValueMovement">): GoldenScenarioRow {
  return {
    ...input,
    runtimeValueMovement: false
  };
}

function rowFromRouteInputSurface(input: {
  readonly airborneContext?: AirborneContext;
  readonly basisPosture: GoldenScenarioBasisPosture;
  readonly evidenceTier: GoldenScenarioEvidenceTier;
  readonly exactImpactSource?: ExactImpactSource;
  readonly family: GoldenScenarioFamily;
  readonly id: string;
  readonly notes: readonly string[];
  readonly protects: readonly string[];
  readonly route: GoldenScenarioRoute;
  readonly targetOutputs: readonly RequestedOutputId[];
}): GoldenScenarioRow {
  const result = buildPostV1RouteInputFamilyFirstClassSurface({
    airborneContext: input.airborneContext,
    exactImpactSource: input.exactImpactSource,
    targetOutputs: input.targetOutputs
  });
  const routeInputStatus: GoldenScenarioStatus =
    result.status === "complete" ? "calculable" : result.status;

  return {
    basisPosture: input.basisPosture,
    evidenceTier: input.evidenceTier,
    family: input.family,
    id: input.id,
    missingPhysicalInputs: result.missingPhysicalInputs,
    notes: input.notes,
    protects: input.protects,
    route: input.route,
    routeFamilies: result.routeFamilies,
    runtimeValueMovement: false,
    status: routeInputStatus,
    targetOutputs: input.targetOutputs,
    unsupportedOutputs: result.unsupportedOutputs
  };
}

function buildGoldenScenarioRows(): readonly GoldenScenarioRow[] {
  return [
    staticScenario({
      basisPosture: "formula_owned_basis",
      evidenceTier: "owned_formula_route",
      family: "wall_airborne",
      id: "wall.single_leaf_heavy_masonry_element_lab_owned_mass_law",
      missingPhysicalInputs: [],
      notes: ["Single-leaf wall mass-law corridor remains a core owned formula route."],
      protects: ["no measured-row dependency for source-absent single-leaf wall"],
      route: "wall",
      routeFamilies: ["single_leaf_airborne"],
      status: "calculable",
      targetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedOutputs: []
    }),
    staticScenario({
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "wall_airborne",
      id: "wall.double_leaf_framed_user_stack_missing_cavity_and_bridge",
      missingPhysicalInputs: [
        "leafGrouping",
        "cavityDepthMm",
        "supportTopology",
        "frameBridgeClass",
        "supportSpacingMm",
        "absorberFlowResistivityPaSM2"
      ],
      notes: ["Double-leaf framed requests must ask for topology and bridge/cavity physics."],
      protects: ["no generic double-leaf alias from a nearby catalog row"],
      route: "wall",
      routeFamilies: ["double_leaf_framed_airborne", "porous_fill_cavity_modifier"],
      status: "needs_input",
      targetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedOutputs: []
    }),
    staticScenario({
      basisPosture: "missing_route_physics",
      evidenceTier: "unsupported_boundary",
      family: "wall_airborne",
      id: "wall.triple_leaf_multicavity_runtime_before_holdout",
      missingPhysicalInputs: ["cavity1DepthMm", "internalLeafGroup", "cavity2DepthMm", "sourceAbsentErrorBudgetOwner"],
      notes: ["Triple-leaf runtime promotion remains blocked until holdout/calibration ownership closes."],
      protects: ["no triple-leaf runtime guess before source-family holdout"],
      route: "wall",
      routeFamilies: ["triple_leaf_multicavity_airborne"],
      status: "needs_input",
      targetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedOutputs: []
    }),
    staticScenario({
      basisPosture: "same_metric_same_basis",
      evidenceTier: "same_family_bounded_delta",
      family: "wall_airborne",
      id: "wall.same_family_gypsum_extra_layer_bounded_delta",
      missingPhysicalInputs: [],
      notes: ["Same-family, same-basis bounded gypsum delta is allowed only when the boundary is explicit."],
      protects: ["no unbounded source-row proximity substitution"],
      route: "wall",
      routeFamilies: ["single_leaf_airborne"],
      status: "calculable",
      targetOutputs: ["Rw", "STC"],
      unsupportedOutputs: []
    }),
    rowFromRouteInputSurface({
      airborneContext: {},
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "field_building",
      id: "wall.field_building_missing_room_and_flanking_context",
      notes: ["Lab wall values cannot promote to field/building outputs without room/flanking inputs."],
      protects: ["no lab Rw copied into R'w or DnT,w"],
      route: "wall",
      targetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"]
    }),
    staticScenario({
      basisPosture: "same_metric_same_basis",
      evidenceTier: "exact_measured_row",
      family: "floor_impact",
      id: "floor.exact_ubiq_airborne_impact_row_same_basis",
      missingPhysicalInputs: [],
      notes: ["Exact measured/source floor rows remain admissible when construction and basis truly match."],
      protects: ["no replacement of exact rows with generic formula estimates"],
      route: "floor",
      routeFamilies: ["floating_floor_impact"],
      status: "calculable",
      targetOutputs: ["Rw", "Ln,w", "DeltaLw"],
      unsupportedOutputs: []
    }),
    staticScenario({
      basisPosture: "formula_owned_basis",
      evidenceTier: "owned_formula_route",
      family: "floor_impact",
      id: "floor.heavy_combined_upper_lower_user_material_owned_iso_route",
      missingPhysicalInputs: [],
      notes: ["Heavy combined upper/lower user-material impact stack stays on its owned ISO estimate route."],
      protects: ["no ASTM IIC/AIIC alias from ISO impact result"],
      route: "floor",
      routeFamilies: ["floating_floor_impact"],
      status: "calculable",
      targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
      unsupportedOutputs: []
    }),
    staticScenario({
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "floor_impact",
      id: "floor.user_material_missing_dynamic_stiffness",
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNPerM3", "loadBasisKgM2"],
      notes: ["Floating-floor impact route requires dynamic stiffness and load basis before publishing."],
      protects: ["no default dynamic stiffness without route-owned assumption"],
      route: "floor",
      routeFamilies: ["floating_floor_impact"],
      status: "needs_input",
      targetOutputs: ["Ln,w", "DeltaLw"],
      unsupportedOutputs: []
    }),
    rowFromRouteInputSurface({
      basisPosture: "same_metric_same_basis",
      evidenceTier: "route_input_surface",
      exactImpactSource: ASTM_FIELD_SOURCE,
      family: "floor_impact",
      id: "floor.astm_field_aiic_exact_band_basis_complete",
      notes: ["ASTM E1007/E989 field band source is complete input surface for AIIC."],
      protects: ["no AIIC from ISO source bands"],
      route: "floor",
      targetOutputs: ["AIIC"]
    }),
    rowFromRouteInputSurface({
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      exactImpactSource: {
        ...ASTM_FIELD_SOURCE,
        frequenciesHz: ASTM_FIELD_SOURCE.frequenciesHz.slice(0, -1),
        levelsDb: ASTM_FIELD_SOURCE.levelsDb.slice(0, -1)
      },
      family: "floor_impact",
      id: "floor.astm_iic_missing_exact_frequency_band",
      notes: ["ASTM impact requests need complete E989 band coverage."],
      protects: ["no partial ASTM band rating"],
      route: "floor",
      targetOutputs: ["IIC"]
    }),
    rowFromRouteInputSurface({
      basisPosture: "unsupported_alias_blocked",
      evidenceTier: "unsupported_boundary",
      exactImpactSource: ISO_LAB_SOURCE,
      family: "metric_boundary",
      id: "floor.iso_lnw_delta_lw_to_iic_aiic_alias_blocked",
      notes: ["ISO impact bands do not become ASTM IIC/AIIC."],
      protects: ["no IIC/AIIC from ISO Ln,w or DeltaLw"],
      route: "floor",
      targetOutputs: ["IIC", "AIIC"]
    }),
    staticScenario({
      basisPosture: "formula_owned_basis",
      evidenceTier: "owned_formula_route",
      family: "ceiling_airborne",
      id: "ceiling.single_leaf_gypsum_board_element_lab_mass_law",
      missingPhysicalInputs: [],
      notes: ["Standalone ceiling single-leaf gypsum-board element-lab route remains calculable."],
      protects: ["no implicit floor-impact estimate from airborne boards"],
      route: "ceiling",
      routeFamilies: ["single_leaf_airborne"],
      status: "calculable",
      targetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedOutputs: []
    }),
    staticScenario({
      basisPosture: "field_building_adapter_basis",
      evidenceTier: "owned_formula_route",
      family: "ceiling_airborne",
      id: "ceiling.single_leaf_field_building_complete_context",
      missingPhysicalInputs: [],
      notes: ["Complete field/building context can promote ceiling airborne lab anchor to field companions."],
      protects: ["no missing-room field/building promotion"],
      route: "ceiling",
      routeFamilies: ["field_building_flanking_context"],
      status: "calculable",
      targetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "DnT,A,k"],
      unsupportedOutputs: []
    }),
    staticScenario({
      basisPosture: "formula_owned_basis",
      evidenceTier: "owned_formula_route",
      family: "ceiling_airborne",
      id: "ceiling.multileaf_plenum_element_lab_complete_inputs",
      missingPhysicalInputs: [],
      notes: ["Ceiling plenum input surface is complete when leaf, plenum, absorber, and support coupling are explicit."],
      protects: ["no ceiling plenum formula without hanger/support coupling"],
      route: "ceiling",
      routeFamilies: ["ceiling_airborne_plenum"],
      status: "calculable",
      targetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedOutputs: []
    }),
    rowFromRouteInputSurface({
      airborneContext: {
        ...COMPLETE_CEILING_PLENUM_CONTEXT,
        ceilingPlenum: {
          absorberThicknessMm: 80,
          cavityOrPlenumDepthMm: 240,
          leafGrouping: "double_leaf_decoupled_plenum",
          leafSurfaceMassKgM2: 18,
          supportCouplingOrHangerClass: "resilient_hanger"
        }
      },
      basisPosture: "field_building_adapter_basis",
      evidenceTier: "route_input_surface",
      family: "ceiling_airborne",
      id: "ceiling.multileaf_plenum_field_building_missing_room_context",
      notes: ["Plenum airborne and field/building requests need both plenum physics and room/flanking context."],
      protects: ["no lab ceiling curve copied into DnT,w"],
      route: "ceiling",
      targetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"]
    }),
    rowFromRouteInputSurface({
      airborneContext: {
        routeIntent: "unknown",
        roofOrCeilingMountingContext: "unknown",
        suspendedCeilingAirborneOrImpactIntent: "unknown"
      },
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "ceiling_airborne",
      id: "ceiling.roof_suspended_ceiling_ambiguous_route_intent",
      notes: ["Ceiling, roof, and suspended ceiling must separate route intent before formulas run."],
      protects: ["no roof/floor/ceiling route blending"],
      route: "ceiling",
      targetOutputs: ["Rw", "Ln,w"]
    }),
    staticScenario({
      basisPosture: "unsupported_alias_blocked",
      evidenceTier: "unsupported_boundary",
      family: "metric_boundary",
      id: "ceiling.airborne_board_to_impact_alias_blocked",
      missingPhysicalInputs: [],
      notes: ["Airborne ceiling board evidence cannot publish impact metrics."],
      protects: ["no ceiling impact inferred from airborne ceiling boards"],
      route: "ceiling",
      routeFamilies: ["ceiling_roof_suspended_ceiling_route_boundary"],
      status: "unsupported",
      targetOutputs: ["Ln,w", "DeltaLw"],
      unsupportedOutputs: ["Ln,w", "DeltaLw"]
    }),
    rowFromRouteInputSurface({
      airborneContext: {},
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "roof_airborne",
      id: "roof.airborne_missing_roof_mounting_and_mass",
      notes: ["Roof airborne requests need route intent, mounting context, band set, mass, and cavity depth."],
      protects: ["no indoor ceiling route used for roof/facade"],
      route: "roof",
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    }),
    staticScenario({
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "roof_airborne",
      id: "roof.airborne_complete_first_class_input_surface",
      missingPhysicalInputs: [],
      notes: ["Complete roof inputs are now first-class enough for the next roof formula owner to consume."],
      protects: ["no hidden roof surface-mass assumption"],
      route: "roof",
      routeFamilies: ["roof_airborne"],
      status: "unsupported",
      targetOutputs: ["Rw", "STC"],
      unsupportedOutputs: ["Rw", "STC"]
    }),
    staticScenario({
      basisPosture: "unsupported_alias_blocked",
      evidenceTier: "unsupported_boundary",
      family: "metric_boundary",
      id: "roof.facade_from_indoor_partition_context_blocked",
      missingPhysicalInputs: [],
      notes: ["Indoor partition context must not be reinterpreted as roof/facade outdoor route."],
      protects: ["no roof/facade route from indoor partition context"],
      route: "roof",
      routeFamilies: ["roof_airborne"],
      status: "unsupported",
      targetOutputs: ["OITC", "Rw"],
      unsupportedOutputs: ["OITC"]
    }),
    staticScenario({
      basisPosture: "formula_owned_basis",
      evidenceTier: "owned_formula_route",
      family: "opening_facade",
      id: "opening.indoor_door_window_scalar_area_energy_route_complete",
      missingPhysicalInputs: [],
      notes: ["Indoor opening area-energy inputs stay separate from outdoor OITC."],
      protects: ["no OITC from indoor opening route"],
      route: "opening",
      routeFamilies: ["opening_facade_indoor"],
      status: "calculable",
      targetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedOutputs: []
    }),
    staticScenario({
      basisPosture: "field_building_adapter_basis",
      evidenceTier: "owned_formula_route",
      family: "opening_facade",
      id: "opening.indoor_spectral_field_building_complete_context",
      missingPhysicalInputs: [],
      notes: ["Indoor opening field/building outputs require area-energy and room/flanking context."],
      protects: ["no scalar STC shortcut for field/building companions"],
      route: "opening",
      routeFamilies: ["opening_facade_indoor", "field_building_flanking_context"],
      status: "calculable",
      targetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      unsupportedOutputs: []
    }),
    rowFromRouteInputSurface({
      airborneContext: { facadeOutdoorContext: "indoor_partition" },
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "opening_facade",
      id: "opening.indoor_missing_area_count_seal_basis",
      notes: ["Opening route must ask area/count/type/rating/seal before using an element value."],
      protects: ["no hidden default leakage class"],
      route: "opening",
      targetOutputs: ["Rw", "STC"]
    }),
    rowFromRouteInputSurface({
      airborneContext: COMPLETE_OITC_CONTEXT,
      basisPosture: "formula_owned_basis",
      evidenceTier: "route_input_surface",
      family: "oitc",
      id: "facade.oitc_complete_outdoor_indoor_curve_route",
      notes: ["Outdoor-indoor facade OITC complete context stays on ASTM E1332 band basis."],
      protects: ["no OITC from scalar Rw/STC"],
      route: "facade",
      targetOutputs: ["OITC"]
    }),
    rowFromRouteInputSurface({
      airborneContext: {
        ...COMPLETE_OITC_CONTEXT,
        frequencyBandSet: "third_octave_100_3150"
      },
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "oitc",
      id: "facade.oitc_missing_e1332_80_4000_band_basis",
      notes: ["OITC requires the ASTM outdoor-indoor 80-4000 Hz band set."],
      protects: ["no ISO 100-3150 curve reused for OITC"],
      route: "facade",
      targetOutputs: ["OITC"]
    }),
    rowFromRouteInputSurface({
      airborneContext: { facadeOutdoorContext: "indoor_partition" },
      basisPosture: "unsupported_alias_blocked",
      evidenceTier: "unsupported_boundary",
      family: "metric_boundary",
      id: "facade.oitc_from_rw_stc_scalar_alias_blocked",
      notes: ["Scalar indoor airborne ratings do not publish outdoor-indoor OITC."],
      protects: ["no OITC from Rw or STC"],
      route: "facade",
      targetOutputs: ["OITC"]
    }),
    rowFromRouteInputSurface({
      airborneContext: COMPLETE_OITC_CONTEXT,
      basisPosture: "unsupported_alias_blocked",
      evidenceTier: "unsupported_boundary",
      family: "metric_boundary",
      id: "facade.oitc_nisr_isr_source_report_alias_blocked",
      notes: ["Source-report NISR/ISR labels do not become OITC without same outdoor-indoor basis."],
      protects: ["no OITC from NISR/ISR source-report aliases"],
      route: "facade",
      targetOutputs: ["NISR", "ISR"]
    }),
    staticScenario({
      basisPosture: "field_building_adapter_basis",
      evidenceTier: "owned_formula_route",
      family: "field_building",
      id: "field_building.complete_wall_room_flanking_adapter_surface",
      missingPhysicalInputs: [],
      notes: ["Complete area/room/RT60/flanking context is the correct field/building adapter basis."],
      protects: ["no field value without receiving room normalization"],
      route: "wall",
      routeFamilies: ["field_building_flanking_context"],
      status: "calculable",
      targetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "DnT,A,k"],
      unsupportedOutputs: []
    }),
    rowFromRouteInputSurface({
      airborneContext: {
        ...COMPLETE_FIELD_BUILDING_CONTEXT,
        receivingRoomRt60S: undefined
      },
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "field_building",
      id: "field_building.missing_rt60_or_normalization_basis",
      notes: ["Standardized field outputs must ask RT60 or an owned normalization basis."],
      protects: ["no DnT,w without reverberation/normalization context"],
      route: "wall",
      targetOutputs: ["DnT,w", "DnT,A"]
    }),
    staticScenario({
      basisPosture: "unsupported_alias_blocked",
      evidenceTier: "unsupported_boundary",
      family: "metric_boundary",
      id: "field_building.lab_curve_direct_copy_to_building_blocked",
      missingPhysicalInputs: [],
      notes: ["Lab curves are anchors for adapters, not direct field/building outputs."],
      protects: ["no direct lab-to-building copy"],
      route: "wall",
      routeFamilies: ["field_building_flanking_context"],
      status: "unsupported",
      targetOutputs: ["R'w", "DnT,w", "DnT,A,k"],
      unsupportedOutputs: ["R'w", "DnT,w", "DnT,A,k"]
    }),
    rowFromRouteInputSurface({
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "field_building",
      id: "field_building.missing_partition_area_and_room_volumes",
      notes: ["Room-normalized outputs need partition area and source/receiving room volumes."],
      protects: ["no field/building adapter without element area"],
      route: "wall",
      targetOutputs: ["R'w", "Dn,w", "DnT,w"]
    }),
    rowFromRouteInputSurface({
      exactImpactSource: {
        ...ASTM_FIELD_SOURCE,
        labOrField: "lab"
      },
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "floor_impact",
      id: "astm.aiic_from_lab_source_missing_field_context",
      notes: ["AIIC needs field source or explicit impact field context."],
      protects: ["no AIIC from lab-only ASTM source"],
      route: "floor",
      targetOutputs: ["AIIC"]
    }),
    staticScenario({
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "floor_impact",
      id: "impact.dynamic_stiffness_default_not_owned",
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNPerM3"],
      notes: ["Dynamic stiffness defaults must be owned before impact values can use them."],
      protects: ["no silent resilient-layer dynamic stiffness default"],
      route: "floor",
      routeFamilies: ["floating_floor_impact"],
      status: "needs_input",
      targetOutputs: ["Ln,w", "DeltaLw"],
      unsupportedOutputs: []
    }),
    staticScenario({
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "floor_impact",
      id: "impact.load_basis_missing_for_floating_floor",
      missingPhysicalInputs: ["loadBasisKgM2"],
      notes: ["Floating-floor improvements need the load basis to stay physically bounded."],
      protects: ["no generic floating-floor delta without load basis"],
      route: "floor",
      routeFamilies: ["floating_floor_impact"],
      status: "needs_input",
      targetOutputs: ["Ln,w", "DeltaLw"],
      unsupportedOutputs: []
    }),
    rowFromRouteInputSurface({
      airborneContext: {
        frequencyBandSet: "one_third_octave_80_4000",
        hostWallAreaM2: 12
      },
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "oitc",
      id: "facade.outdoor_indoor_context_missing_for_opening",
      notes: ["Facade/OITC route must ask the outdoor-indoor context before using bands."],
      protects: ["no outdoor-indoor assumption from frequency bands alone"],
      route: "facade",
      targetOutputs: ["OITC"]
    }),
    rowFromRouteInputSurface({
      airborneContext: {
        roofOrCeilingMountingContext: "suspended_ceiling_below_floor"
      },
      basisPosture: "missing_route_physics",
      evidenceTier: "route_input_surface",
      family: "ceiling_airborne",
      id: "route_intent.missing_for_ceiling_roof_boundary",
      notes: ["A mounted horizontal assembly needs explicit route intent before ceiling/roof split."],
      protects: ["no route selected from shape alone"],
      route: "ceiling",
      targetOutputs: ["Rw", "STC"]
    }),
    staticScenario({
      basisPosture: "unsupported_alias_blocked",
      evidenceTier: "unsupported_boundary",
      family: "metric_boundary",
      id: "source_row.proximity_substitution_without_boundary_blocked",
      missingPhysicalInputs: [],
      notes: ["Nearby source rows are not aliases unless same-family/same-basis and bounded."],
      protects: ["no source-row proximity substitution"],
      route: "wall",
      routeFamilies: ["single_leaf_airborne"],
      status: "unsupported",
      targetOutputs: ["Rw", "STC"],
      unsupportedOutputs: ["Rw", "STC"]
    }),
    staticScenario({
      basisPosture: "same_metric_same_basis",
      evidenceTier: "exact_measured_row",
      family: "wall_airborne",
      id: "source_row.exact_measured_wall_row_true_identity",
      missingPhysicalInputs: [],
      notes: ["Exact measured wall row can be used when construction identity and metric basis match."],
      protects: ["exact source precedence over lower-quality estimate"],
      route: "wall",
      routeFamilies: ["single_leaf_airborne"],
      status: "calculable",
      targetOutputs: ["Rw", "STC"],
      unsupportedOutputs: []
    }),
    staticScenario({
      basisPosture: "same_metric_same_basis",
      evidenceTier: "same_family_bounded_delta",
      family: "floor_impact",
      id: "anchor.same_family_floor_delta_bounded_by_owned_rule",
      missingPhysicalInputs: [],
      notes: ["Same-family floor deltas are allowed only when the route owns the delta rule."],
      protects: ["no unbounded product-family transfer"],
      route: "floor",
      routeFamilies: ["floating_floor_impact"],
      status: "calculable",
      targetOutputs: ["Ln,w", "DeltaLw"],
      unsupportedOutputs: []
    }),
    staticScenario({
      basisPosture: "unsupported_alias_blocked",
      evidenceTier: "unsupported_boundary",
      family: "metric_boundary",
      id: "source_crawl.broad_library_expansion_not_calculator_progress",
      missingPhysicalInputs: [],
      notes: ["Broad source crawling is not a substitute for owned calculator routes."],
      protects: ["calculator-first north star"],
      route: "wall",
      routeFamilies: ["advanced_wall_source_absent_airborne"],
      status: "unsupported",
      targetOutputs: ["Rw", "STC", "OITC", "IIC"],
      unsupportedOutputs: ["OITC", "IIC"]
    })
  ];
}

function scenarioIdsByStatus(rows: readonly GoldenScenarioRow[], status: GoldenScenarioStatus): readonly string[] {
  return rows.filter((row) => row.status === status).map((row) => row.id);
}

function buildRankedGapLedgerRows(rows: readonly GoldenScenarioRow[]): readonly GoldenGapLedgerRow[] {
  const needsInputScenarioIds = scenarioIdsByStatus(rows, "needs_input");

  return [
    {
      blockedBy: [
        "needs_input rows expose typed missing fields but no ordered minimum unblocker question payload",
        "arbitrary user stacks will stall unless route-required inputs are asked route-by-route"
      ],
      expectedNextMovement: {
        newCalculableRequestShapes: 0,
        newCalculableTargetOutputs: 0,
        requiredPhysicalInputsCaptured: 9,
        runtimeValuesMoved: 0
      },
      gapType: "input_surface_owner",
      id: "post_v1_route_required_input_question_engine_v1",
      label: POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_LABEL,
      rank: 1,
      reason: "The matrix shows the broadest current blocker is missing-physics collection, not another source row.",
      rejectedWrongPaths: [
        "broad source crawl",
        "cosmetic UI polish",
        "confidence-label loop",
        "metric aliasing"
      ],
      scenarioIds: needsInputScenarioIds,
      selected: true
    },
    {
      blockedBy: ["complete roof input surface exists, but roof airborne formula owner is not the broadest blocker yet"],
      expectedNextMovement: {
        newCalculableRequestShapes: 1,
        newCalculableTargetOutputs: 4,
        requiredPhysicalInputsCaptured: 0,
        runtimeValuesMoved: 4
      },
      gapType: "value_moving_owner",
      id: "post_v1_roof_airborne_formula_owner_after_input_surface_v1",
      label: "post-V1 roof airborne formula owner after input surface V1",
      rank: 2,
      reason: "High-value runtime owner, but it depends on users reaching complete roof inputs consistently.",
      rejectedWrongPaths: ["reuse indoor ceiling route for roof", "copy facade OITC rows into roof Rw"],
      scenarioIds: [
        "roof.airborne_missing_roof_mounting_and_mass",
        "roof.airborne_complete_first_class_input_surface"
      ],
      selected: false
    },
    {
      blockedBy: ["triple-leaf calibration and holdout tolerance are not closed"],
      expectedNextMovement: {
        newCalculableRequestShapes: 1,
        newCalculableTargetOutputs: 4,
        requiredPhysicalInputsCaptured: 0,
        runtimeValuesMoved: 4
      },
      gapType: "accuracy_owner",
      id: "post_v1_wall_triple_leaf_multicavity_runtime_promotion_after_holdout_v1",
      label: "post-V1 wall triple-leaf multicavity runtime promotion after holdout V1",
      rank: 3,
      reason: "Important real-world scope, but unsafe before calibration/holdout evidence is executable.",
      rejectedWrongPaths: ["promote research solver as runtime without holdout", "generic triple-leaf mass-law alias"],
      scenarioIds: ["wall.triple_leaf_multicavity_runtime_before_holdout"],
      selected: false
    },
    {
      blockedBy: ["field/building adapter inputs are complete in some routes but not yet unified as user questions"],
      expectedNextMovement: {
        newCalculableRequestShapes: 2,
        newCalculableTargetOutputs: 6,
        requiredPhysicalInputsCaptured: 0,
        runtimeValuesMoved: 11
      },
      gapType: "value_moving_owner",
      id: "post_v1_field_building_adapter_generalization_v1",
      label: "post-V1 field/building adapter generalization V1",
      rank: 4,
      reason: "Large output movement, but question ordering must first make missing room/flanking context reachable.",
      rejectedWrongPaths: ["copy lab value directly into field outputs"],
      scenarioIds: [
        "wall.field_building_missing_room_and_flanking_context",
        "field_building.complete_wall_room_flanking_adapter_surface",
        "field_building.missing_rt60_or_normalization_basis"
      ],
      selected: false
    },
    {
      blockedBy: ["ASTM impact exact bands and field context must stay separate from ISO impact routes"],
      expectedNextMovement: {
        newCalculableRequestShapes: 1,
        newCalculableTargetOutputs: 2,
        requiredPhysicalInputsCaptured: 1,
        runtimeValuesMoved: 2
      },
      gapType: "boundary_owner",
      id: "post_v1_floor_iic_aiic_runtime_bridge_after_astm_input_surface_v1",
      label: "post-V1 floor IIC/AIIC runtime bridge after ASTM input surface V1",
      rank: 5,
      reason: "Useful metric expansion, but lower aggregate blocker than route-required questions.",
      rejectedWrongPaths: ["IIC/AIIC from ISO Ln,w", "AIIC from lab-only source"],
      scenarioIds: [
        "floor.astm_field_aiic_exact_band_basis_complete",
        "floor.iso_lnw_delta_lw_to_iic_aiic_alias_blocked",
        "astm.aiic_from_lab_source_missing_field_context"
      ],
      selected: false
    },
    {
      blockedBy: ["complete OITC route is already calculable; remaining gaps are mostly alias protection and input clarity"],
      expectedNextMovement: {
        newCalculableRequestShapes: 0,
        newCalculableTargetOutputs: 0,
        requiredPhysicalInputsCaptured: 1,
        runtimeValuesMoved: 0
      },
      gapType: "boundary_owner",
      id: "post_v1_oitc_alias_and_band_boundary_refresh_v1",
      label: "post-V1 OITC alias and band boundary refresh V1",
      rank: 6,
      reason: "Protects correctness but is less valuable than making all route blockers actionable.",
      rejectedWrongPaths: ["OITC from Rw/STC", "OITC from NISR/ISR"],
      scenarioIds: [
        "facade.oitc_complete_outdoor_indoor_curve_route",
        "facade.oitc_missing_e1332_80_4000_band_basis",
        "facade.oitc_from_rw_stc_scalar_alias_blocked",
        "facade.oitc_nisr_isr_source_report_alias_blocked"
      ],
      selected: false
    },
    {
      blockedBy: ["opening field/building path exists for complete contexts but not all facade/opening variants"],
      expectedNextMovement: {
        newCalculableRequestShapes: 1,
        newCalculableTargetOutputs: 4,
        requiredPhysicalInputsCaptured: 0,
        runtimeValuesMoved: 5
      },
      gapType: "value_moving_owner",
      id: "post_v1_opening_facade_field_building_variant_owner_v1",
      label: "post-V1 opening/facade field-building variant owner V1",
      rank: 7,
      reason: "Useful after the question engine can obtain area/count/seal/basis consistently.",
      rejectedWrongPaths: ["scalar STC shortcut for DnT,w"],
      scenarioIds: [
        "opening.indoor_spectral_field_building_complete_context",
        "opening.indoor_missing_area_count_seal_basis"
      ],
      selected: false
    },
    {
      blockedBy: ["same-family anchor/delta boundaries exist but broad measured-row acquisition is not the bottleneck"],
      expectedNextMovement: {
        newCalculableRequestShapes: 0,
        newCalculableTargetOutputs: 0,
        requiredPhysicalInputsCaptured: 0,
        runtimeValuesMoved: 0
      },
      gapType: "boundary_owner",
      id: "post_v1_same_family_anchor_delta_boundary_refresh_v1",
      label: "post-V1 same-family anchor/delta boundary refresh V1",
      rank: 8,
      reason: "Keeps evidence semantics honest, but does not beat input-question ROI.",
      rejectedWrongPaths: ["broad source crawl", "nearby-row aliasing"],
      scenarioIds: [
        "wall.same_family_gypsum_extra_layer_bounded_delta",
        "source_row.proximity_substitution_without_boundary_blocked",
        "anchor.same_family_floor_delta_bounded_by_owned_rule"
      ],
      selected: false
    }
  ];
}

export function buildPostV1IndustryGradeGoldenScenarioMatrixV1():
  PostV1IndustryGradeGoldenScenarioMatrixV1Result {
  const scenarioRows = buildGoldenScenarioRows();
  const rankedGapLedgerRows = buildRankedGapLedgerRows(scenarioRows);

  return {
    counters: POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_COUNTERS,
    previousAction: POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN,
    previousStatus: POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_STATUS,
    rankedGapLedgerRows,
    runtimeValueMovement: false,
    scenarioRows,
    selectedCandidateId: POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_CANDIDATE_ID,
    selectedNext: {
      action: POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_ACTION,
      file: POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_FILE,
      label: POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_LABEL,
      plan: POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_PLAN_DOC
    },
    status: POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_STATUS
  };
}

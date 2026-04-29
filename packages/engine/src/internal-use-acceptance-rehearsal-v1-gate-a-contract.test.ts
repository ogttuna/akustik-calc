import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import { analyzeTargetOutputSupport } from "./target-output-support";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const ACCEPTANCE_REHEARSAL_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_company_internal_acceptance_rehearsal_matrix_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  previousClosedSlice: "clt_mass_timber_wall_source_pack_extraction_v1",
  reportCopyChange: false,
  routeCardValueChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "internal_use_acceptance_rehearsal_v1_gate_c_pilot_readiness_closeout",
  selectedNextFile: "packages/engine/src/post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts",
  sliceId: "internal_use_acceptance_rehearsal_v1",
  supportPromotion: false
} as const;

const ACCEPTANCE_BUCKETS = [
  "pilot_ready_with_standard_caveat",
  "pilot_allowed_with_visible_caveat",
  "not_defended_fail_closed_or_source_gated",
  "hostile_many_layer_reorder_and_missing_input_edges"
] as const;

const ACCEPTANCE_SCENARIOS = [
  { bucket: "pilot_ready_with_standard_caveat", id: "wall_lsf_exact_preset", runtimePromotionAllowed: false },
  { bucket: "pilot_ready_with_standard_caveat", id: "wall_aac_single_leaf_benchmark", runtimePromotionAllowed: false },
  { bucket: "pilot_ready_with_standard_caveat", id: "wall_masonry_single_leaf_benchmark", runtimePromotionAllowed: false },
  { bucket: "pilot_ready_with_standard_caveat", id: "floor_pliteq_exact_source_corridor", runtimePromotionAllowed: false },
  { bucket: "pilot_ready_with_standard_caveat", id: "floor_ubiq_bound_source_corridor", runtimePromotionAllowed: false },
  { bucket: "pilot_allowed_with_visible_caveat", id: "wall_timber_double_board_generated", runtimePromotionAllowed: false },
  { bucket: "pilot_allowed_with_visible_caveat", id: "wall_clt_local_generated", runtimePromotionAllowed: false },
  { bucket: "pilot_allowed_with_visible_caveat", id: "wall_lined_heavy_core_screening", runtimePromotionAllowed: false },
  { bucket: "pilot_allowed_with_visible_caveat", id: "floor_steel_fallback_generated", runtimePromotionAllowed: false },
  {
    bucket: "hostile_many_layer_reorder_and_missing_input_edges",
    id: "floor_many_layer_exact_split_stack",
    runtimePromotionAllowed: false
  },
  {
    bucket: "hostile_many_layer_reorder_and_missing_input_edges",
    id: "floor_many_layer_raw_fail_or_screening_stack",
    runtimePromotionAllowed: false
  },
  {
    bucket: "hostile_many_layer_reorder_and_missing_input_edges",
    id: "floor_role_defined_reorder_exact_stack",
    runtimePromotionAllowed: false
  },
  {
    bucket: "hostile_many_layer_reorder_and_missing_input_edges",
    id: "floor_raw_reorder_support_boundary",
    runtimePromotionAllowed: false
  },
  {
    bucket: "hostile_many_layer_reorder_and_missing_input_edges",
    id: "wall_field_missing_geometry_needs_input",
    runtimePromotionAllowed: false
  },
  {
    bucket: "not_defended_fail_closed_or_source_gated",
    id: "invalid_thickness_all_callers_fail_closed",
    runtimePromotionAllowed: false
  },
  {
    bucket: "not_defended_fail_closed_or_source_gated",
    id: "api_missing_layers_next_field",
    runtimePromotionAllowed: false
  },
  {
    bucket: "not_defended_fail_closed_or_source_gated",
    id: "unsupported_target_output_partition",
    runtimePromotionAllowed: false
  },
  {
    bucket: "not_defended_fail_closed_or_source_gated",
    id: "wall_no_stud_double_leaf_source_gated",
    runtimePromotionAllowed: false
  },
  {
    bucket: "not_defended_fail_closed_or_source_gated",
    id: "historical_blocked_floor_families",
    runtimePromotionAllowed: false
  },
  {
    bucket: "hostile_many_layer_reorder_and_missing_input_edges",
    id: "mixed_study_mode_save_load_replay_owner",
    runtimePromotionAllowed: false
  }
] as const;

const PROOF_OWNERS = [
  "apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts",
  "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts",
  "apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts",
  "apps/web/features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts",
  "apps/web/lib/calculator-api-validation.test.ts",
  "apps/web/features/workbench/mixed-study-mode-torture.test.ts",
  "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
  "packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts",
  "packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts",
  "packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts",
  "packages/engine/src/target-output-support-contract.test.ts",
  "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts",
  "packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
  "packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts",
  "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts"
] as const;

const WALL_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

const FLOOR_IMPACT_OUTPUTS = [
  "Rw",
  "Ln,w",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const FLOOR_FULL_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const WALL_BUILDING_CONTEXT: AirborneContext = {
  ...WALL_FIELD_CONTEXT,
  contextMode: "building_prediction",
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const LSF_AIRBORNE_DEFAULTS: Partial<AirborneContext> = {
  connectionType: "line_connection",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

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

const READY_WALL_CASES = [
  {
    expected: {
      buildingDnTw: 49,
      buildingRwPrime: 48,
      fieldRwPrime: 48,
      labRw: 55
    },
    id: "wall_lsf_exact_preset",
    labWarningPattern: /Curated exact airborne lab match active/i,
    rows: [
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 5 },
      { materialId: "glasswool", thicknessMm: 70 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
    ],
    contextDefaults: LSF_AIRBORNE_DEFAULTS
  },
  {
    expected: {
      buildingDnTw: 46,
      buildingRwPrime: 45,
      fieldRwPrime: 45,
      labRw: 47
    },
    id: "wall_aac_single_leaf_benchmark",
    labWarningPattern: null,
    rows: [
      { materialId: "cement_plaster", thicknessMm: 10 },
      { materialId: "ytong_aac_d700", thicknessMm: 150 },
      { materialId: "cement_plaster", thicknessMm: 10 }
    ],
    contextDefaults: {}
  },
  {
    expected: {
      buildingDnTw: 43,
      buildingRwPrime: 41,
      fieldRwPrime: 41,
      labRw: 43
    },
    id: "wall_masonry_single_leaf_benchmark",
    labWarningPattern: null,
    rows: [
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 100 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ],
    contextDefaults: {}
  }
] as const;

const PLITEQ_EXACT_SOURCE_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 2.5 },
  { floorRole: "resilient_layer", materialId: "geniemat_rst02", thicknessMm: 2 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
];

const UBIQ_FL32_BOUND_SOURCE_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
];

const RAW_TERMINAL_CONCRETE_HELPER_ROWS: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 13 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "furring_channel", thicknessMm: 28 },
  { materialId: "concrete", thicknessMm: 150 }
];

function readPilotUsageNote(): string {
  return readFileSync(join(REPO_ROOT, "docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md"), "utf8");
}

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

function wallContext(base: AirborneContext, defaults: Partial<AirborneContext>): AirborneContext {
  return { ...base, ...defaults };
}

function wallValueSnapshot(rows: readonly LayerInput[], context: AirborneContext) {
  const result = calculateAssembly(rows, {
    airborneContext: context,
    targetOutputs: WALL_OUTPUTS
  });

  return {
    dnTw: result.ratings.field?.DnTw ?? null,
    result,
    rw: result.ratings.iso717.Rw ?? null,
    rwPrime: result.ratings.field?.RwPrime ?? result.ratings.iso717.RwPrime ?? null
  };
}

function calculateFloor(rows: readonly LayerInput[], targetOutputs: readonly RequestedOutputId[] = FLOOR_FULL_OUTPUTS) {
  return calculateAssembly(rows, {
    airborneContext: FLOOR_AIRBORNE_CONTEXT,
    impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
    targetOutputs
  });
}

function calculateImpactSourceStack(rows: readonly LayerInput[]) {
  return calculateAssembly(rows, {
    impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
    targetOutputs: FLOOR_IMPACT_OUTPUTS
  });
}

function expectSupportPartition(
  id: string,
  actual: {
    supportedTargetOutputs?: readonly RequestedOutputId[];
    unsupportedTargetOutputs?: readonly RequestedOutputId[];
  },
  requestedOutputs: readonly RequestedOutputId[]
): void {
  expect(actual.supportedTargetOutputs, `${id}: supportedTargetOutputs must be present`).toBeDefined();
  expect(actual.unsupportedTargetOutputs, `${id}: unsupportedTargetOutputs must be present`).toBeDefined();

  const seen = [...(actual.supportedTargetOutputs ?? []), ...(actual.unsupportedTargetOutputs ?? [])].sort();

  expect(seen, `${id}: supported + unsupported must partition requested outputs`).toEqual([...requestedOutputs].sort());
  expect(new Set(seen).size, `${id}: output buckets must not contain duplicates`).toBe(requestedOutputs.length);
}

function expectFiniteSnapshot(id: string, snapshot: ReturnType<typeof resultSnapshot>): void {
  for (const [key, value] of Object.entries(snapshot)) {
    if (typeof value === "number") {
      expect(Number.isFinite(value), `${id}: ${key} must be finite`).toBe(true);
    }
  }
}

function repeatLayers(count: number, layer: LayerInput): LayerInput[] {
  return Array.from({ length: count }, () => ({ ...layer }));
}

function makeUbiqExactSplitLayers(): LayerInput[] {
  return [
    ...repeatLayers(12, { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 4 }),
    ...repeatLayers(10, { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 14.5 }),
    ...repeatLayers(10, { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 6.5 }),
    ...repeatLayers(8, {
      floorRole: "floor_covering",
      materialId: "engineered_timber_with_acoustic_underlay",
      thicknessMm: 2.5
    }),
    ...repeatLayers(8, { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 2.375 }),
    ...repeatLayers(5, { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 40 })
  ];
}

function makeRawManyLayerRows(): LayerInput[] {
  return [
    ...repeatLayers(20, { materialId: "gypsum_board", thicknessMm: 1.3 }),
    ...repeatLayers(20, { materialId: "rockwool", thicknessMm: 5 }),
    ...repeatLayers(12, { materialId: "furring_channel", thicknessMm: 3.333 }),
    { materialId: "open_web_steel_floor", thicknessMm: 300 }
  ];
}

function moveLastToFirst<T>(items: readonly T[]): T[] {
  return [items[items.length - 1]!, ...items.slice(0, -1)];
}

describe("internal use acceptance rehearsal v1 Gate A contract", () => {
  it("lands Gate A as a no-runtime acceptance rehearsal with 20 named scenarios", () => {
    expect(ACCEPTANCE_REHEARSAL_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_company_internal_acceptance_rehearsal_matrix_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      previousClosedSlice: "clt_mass_timber_wall_source_pack_extraction_v1",
      reportCopyChange: false,
      routeCardValueChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "internal_use_acceptance_rehearsal_v1_gate_c_pilot_readiness_closeout",
      selectedNextFile: "packages/engine/src/post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts",
      sliceId: "internal_use_acceptance_rehearsal_v1",
      supportPromotion: false
    });
    expect(ACCEPTANCE_SCENARIOS).toHaveLength(20);
    expect(new Set(ACCEPTANCE_SCENARIOS.map((scenario) => scenario.id)).size).toBe(20);

    for (const bucket of ACCEPTANCE_BUCKETS) {
      expect(
        ACCEPTANCE_SCENARIOS.some((scenario) => scenario.bucket === bucket),
        `bucket ${bucket} should have coverage`
      ).toBe(true);
    }
    expect(ACCEPTANCE_SCENARIOS.every((scenario) => scenario.runtimePromotionAllowed === false)).toBe(true);

    const note = readPilotUsageNote();
    for (const bucket of ACCEPTANCE_BUCKETS.slice(0, 3)) {
      expect(note, `pilot note includes ${bucket}`).toContain(bucket);
    }
  });

  it("pins ready wall benchmark corridors to current user-visible values and output partitions", () => {
    for (const testCase of READY_WALL_CASES) {
      const lab = wallValueSnapshot(testCase.rows, wallContext(WALL_LAB_CONTEXT, testCase.contextDefaults));
      const field = wallValueSnapshot(testCase.rows, wallContext(WALL_FIELD_CONTEXT, testCase.contextDefaults));
      const building = wallValueSnapshot(testCase.rows, wallContext(WALL_BUILDING_CONTEXT, testCase.contextDefaults));

      expect(lab.rw, `${testCase.id}: lab Rw`).toBe(testCase.expected.labRw);
      expect(field.rwPrime, `${testCase.id}: field R'w`).toBe(testCase.expected.fieldRwPrime);
      expect(building.rwPrime, `${testCase.id}: building R'w`).toBe(testCase.expected.buildingRwPrime);
      expect(building.dnTw, `${testCase.id}: building DnT,w`).toBe(testCase.expected.buildingDnTw);
      expect(field.rwPrime ?? Number.POSITIVE_INFINITY, `${testCase.id}: field R'w must not exceed lab Rw`).toBeLessThanOrEqual(
        testCase.expected.labRw + 0.5
      );
      expect(
        building.rwPrime ?? Number.POSITIVE_INFINITY,
        `${testCase.id}: building R'w must not exceed lab Rw`
      ).toBeLessThanOrEqual(testCase.expected.labRw + 0.5);

      expectSupportPartition(`${testCase.id}/lab`, lab.result, WALL_OUTPUTS);
      expectSupportPartition(`${testCase.id}/field`, field.result, WALL_OUTPUTS);
      expectSupportPartition(`${testCase.id}/building`, building.result, WALL_OUTPUTS);
      expect(lab.result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
      expect(field.result.unsupportedTargetOutputs).toContain("DnT,w");
      expect(building.result.supportedTargetOutputs).toContain("DnT,w");

      if (testCase.labWarningPattern) {
        expect(lab.result.warnings.some((warning: string) => testCase.labWarningPattern?.test(warning))).toBe(true);
      }
    }
  });

  it("pins exact and bound floor source corridors without collapsing them into one source truth", () => {
    const exact = calculateImpactSourceStack(PLITEQ_EXACT_SOURCE_STACK);
    const bound = calculateImpactSourceStack(UBIQ_FL32_BOUND_SOURCE_STACK);

    expect(exact.floorSystemMatch?.system.id).toBe("pliteq_steel_joist_250_rst02_vinyl_lab_2026");
    expect(exact.floorSystemEstimate).toBeNull();
    expect(exact.boundFloorSystemEstimate).toBeNull();
    expect(resultSnapshot(exact)).toMatchObject({
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      lPrimeNTw: 58.2,
      lPrimeNW: 61,
      lnW: 58,
      rw: 60,
      unsupportedTargetOutputs: ["Ln,w+CI", "DeltaLw", "L'nT,50"]
    });

    expect(bound.floorSystemMatch).toBeNull();
    expect(bound.floorSystemEstimate).toBeNull();
    expect(bound.boundFloorSystemEstimate).toMatchObject({
      kind: "bound_interpolation",
      sourceSystems: [{ id: "ubiq_fl32_steel_200_lab_2026" }, { id: "ubiq_fl32_steel_300_lab_2026" }]
    });
    expect(resultSnapshot(bound)).toMatchObject({
      boundFloorSystemEstimateKind: "bound_interpolation",
      impactBasis: "mixed_bound_plus_estimated_standardized_field_volume_normalization",
      lPrimeNTw: 52.2,
      lPrimeNW: 55,
      lnW: 52,
      rw: 62,
      unsupportedTargetOutputs: ["Ln,w+CI", "DeltaLw", "L'nT,50"]
    });
  });

  it("pins caveated generated wall and floor scenarios without confidence or evidence promotion", () => {
    const timber = generatedCase("wall-timber-stud");
    const clt = generatedCase("wall-clt-local");
    const screening = generatedCase("wall-screening-concrete");
    const steelFallback = generatedCase("floor-steel-fallback");
    const timberLab = calculateAssembly(timber.rows, timber.labOptions);
    const timberField = calculateAssembly(timber.rows, timber.fieldOptions);
    const cltLab = calculateAssembly(clt.rows, clt.labOptions);
    const cltField = calculateAssembly(clt.rows, clt.fieldOptions);
    const screeningLab = calculateAssembly(screening.rows, screening.labOptions);
    const screeningField = calculateAssembly(screening.rows, screening.fieldOptions);
    const steelField = calculateAssembly(steelFallback.rows, steelFallback.fieldOptions);

    expect(resultSnapshot(timberLab)).toMatchObject({
      dynamicFamily: "stud_wall_system",
      rw: 50,
      rwDb: 50
    });
    expect(resultSnapshot(timberField)).toMatchObject({
      dnTw: 43,
      dynamicFamily: "stud_wall_system",
      rw: 42,
      rwPrimeDb: 42
    });
    expect(timberLab.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });

    expect(resultSnapshot(cltLab)).toMatchObject({
      dynamicFamily: "laminated_single_leaf",
      rw: 42,
      rwDb: 42
    });
    expect(resultSnapshot(cltField)).toMatchObject({
      dnTw: 42,
      dynamicFamily: "laminated_single_leaf",
      rw: 41,
      rwPrimeDb: 41
    });
    expect(cltField.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      strategy: "laminated_leaf_sharp_delegate"
    });

    expect(resultSnapshot(screeningLab)).toMatchObject({
      dynamicFamily: "lined_massive_wall",
      rw: 57,
      rwDb: 57
    });
    expect(resultSnapshot(screeningField)).toMatchObject({
      dnTA: 54.9,
      dnTw: 56,
      dynamicFamily: "lined_massive_wall",
      rw: 55,
      rwPrimeDb: 55
    });
    expect(screeningField.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      strategy: "lined_massive_blend"
    });

    expect(resultSnapshot(steelField)).toMatchObject({
      floorSystemEstimateBasis: "predictor_floor_system_low_confidence_estimate",
      floorSystemEstimateKind: "low_confidence",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: null,
      lPrimeNTw: 58.5,
      lPrimeNW: 61.3,
      lnW: 58.3,
      rw: 61,
      rwPrimeDb: 70,
      unsupportedTargetOutputs: ["L'nT,50"]
    });
    expect(steelField.dynamicImpactTrace).toMatchObject({
      estimateTier: "low_confidence",
      evidenceTier: "estimate",
      fitPercent: 28
    });
    expect(steelField.warnings.some((warning: string) => /Published low-confidence fallback active/i.test(warning))).toBe(
      true
    );

    for (const scenario of ACCEPTANCE_SCENARIOS.filter((entry) => entry.bucket !== "pilot_ready_with_standard_caveat")) {
      expect(scenario.runtimePromotionAllowed, `${scenario.id} runtime promotion`).toBe(false);
    }
  });

  it("keeps many-layer, reorder, and raw-order boundaries finite without fabricating exact support", () => {
    const manyLayerExact = calculateFloor(makeUbiqExactSplitLayers());
    const manyLayerRaw = calculateFloor(makeRawManyLayerRows());
    const exactReorderCase = generatedCase("floor-open-web-200-exact");
    const exactBaseline = calculateAssembly(exactReorderCase.rows, exactReorderCase.fieldOptions);
    const exactReversed = calculateAssembly([...exactReorderCase.rows].reverse(), exactReorderCase.fieldOptions);
    const rawBaseline = calculateFloor(RAW_TERMINAL_CONCRETE_HELPER_ROWS);
    const rawMoved = calculateFloor(moveLastToFirst(RAW_TERMINAL_CONCRETE_HELPER_ROWS));

    expect(resultSnapshot(manyLayerExact)).toMatchObject({
      floorSystemMatchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lPrimeNT50: 52,
      lnW: 52,
      rw: 63
    });
    expectSupportPartition("many-layer exact", manyLayerExact, FLOOR_FULL_OUTPUTS);
    expectFiniteSnapshot("many-layer exact", resultSnapshot(manyLayerExact));

    expect(resultSnapshot(manyLayerRaw)).toMatchObject({
      floorSystemMatchId: null,
      floorSystemEstimateKind: null,
      impactBasis: null,
      rw: 71,
      unsupportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    });
    expectSupportPartition("many-layer raw", manyLayerRaw, FLOOR_FULL_OUTPUTS);
    expectFiniteSnapshot("many-layer raw", resultSnapshot(manyLayerRaw));

    expect(resultSnapshot(exactReversed)).toMatchObject({
      floorSystemMatchId: resultSnapshot(exactBaseline).floorSystemMatchId,
      impactBasis: resultSnapshot(exactBaseline).impactBasis,
      lPrimeNT50: resultSnapshot(exactBaseline).lPrimeNT50,
      lnW: resultSnapshot(exactBaseline).lnW,
      rw: resultSnapshot(exactBaseline).rw
    });

    expect(rawBaseline.supportedTargetOutputs).toContain("Rw");
    expect(rawMoved.supportedTargetOutputs).not.toContain("Rw");
    expect(rawMoved.unsupportedTargetOutputs).toContain("Rw");
    expectSupportPartition("raw baseline", rawBaseline, FLOOR_FULL_OUTPUTS);
    expectSupportPartition("raw moved", rawMoved, FLOOR_FULL_OUTPUTS);
  });

  it("keeps invalid inputs and unsupported outputs fail-closed instead of inventing values", () => {
    const invalid = calculateAssembly(
      [
        {
          materialId: "concrete",
          thicknessMm: 0
        }
      ],
      {
        airborneContext: WALL_LAB_CONTEXT,
        calculator: "dynamic",
        targetOutputs: WALL_OUTPUTS
      }
    );
    const unsupported = analyzeTargetOutputSupport({
      impact: null,
      lowerBoundImpact: null,
      metrics: {
        airborneIsoDescriptor: "R'w",
        estimatedRwDb: 55
      },
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });

    expect(invalid.supportedTargetOutputs).toEqual([]);
    expect(invalid.unsupportedTargetOutputs).toEqual(WALL_OUTPUTS);
    expect(invalid.impact).toBeNull();
    expect(invalid.floorSystemMatch ?? null).toBeNull();
    expect(invalid.floorSystemEstimate ?? null).toBeNull();
    expect(invalid.warnings.some((warning: string) => /invalid thickness: 0/i.test(warning))).toBe(true);
    expectSupportPartition("invalid wall thickness", invalid, WALL_OUTPUTS);

    expect(unsupported.supportedTargetOutputs).toEqual(["R'w"]);
    expect(unsupported.unsupportedTargetOutputs).toEqual(["Rw", "DnT,w"]);
  });

  it("keeps cross-package visibility, missing-input, source-gated, and save/load proof owners available", () => {
    for (const owner of PROOF_OWNERS) {
      expect(existsSync(join(REPO_ROOT, owner)), owner).toBe(true);
    }

    const nonReady = ACCEPTANCE_SCENARIOS.filter(
      (scenario) =>
        scenario.bucket === "pilot_allowed_with_visible_caveat" ||
        scenario.bucket === "not_defended_fail_closed_or_source_gated" ||
        scenario.bucket === "hostile_many_layer_reorder_and_missing_input_edges"
    );

    expect(nonReady.map((scenario) => scenario.id)).toEqual([
      "wall_timber_double_board_generated",
      "wall_clt_local_generated",
      "wall_lined_heavy_core_screening",
      "floor_steel_fallback_generated",
      "floor_many_layer_exact_split_stack",
      "floor_many_layer_raw_fail_or_screening_stack",
      "floor_role_defined_reorder_exact_stack",
      "floor_raw_reorder_support_boundary",
      "wall_field_missing_geometry_needs_input",
      "invalid_thickness_all_callers_fail_closed",
      "api_missing_layers_next_field",
      "unsupported_target_output_partition",
      "wall_no_stud_double_leaf_source_gated",
      "historical_blocked_floor_families",
      "mixed_study_mode_save_load_replay_owner"
    ]);
    for (const scenario of nonReady) {
      expect(scenario.bucket, `${scenario.id} must not be ordinary ready`).not.toBe("pilot_ready_with_standard_caveat");
      expect(scenario.runtimePromotionAllowed, `${scenario.id} no promotion`).toBe(false);
    }
  });
});

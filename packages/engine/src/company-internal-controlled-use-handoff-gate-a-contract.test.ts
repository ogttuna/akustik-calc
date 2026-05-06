import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EstimateRequestSchema,
  ImpactOnlyRequestSchema,
  type AirborneContext,
  type ImpactFieldContext,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";
import { ENGINE_MIXED_GENERATED_CASES, resultSnapshot } from "./mixed-floor-wall-generated-test-helpers";
import { analyzeTargetOutputSupport } from "./target-output-support";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  controlledUseHighAccuracyLabelAllowed: false,
  evidencePromotion: false,
  landedArtifacts: [
    "current_operator_workflow",
    "current_acceptance_bucket_table",
    "ready_values_snapshot",
    "caveated_blocked_stop_rules",
    "validation_command_log",
    "rockwool_screening_only_notice",
    "selected_closeout_or_source_gap_followup"
  ],
  landedGate: "gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  previousClosedSlice: "company_internal_high_accuracy_opening_rehearsal_v1",
  proposalReportValueChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_closeout_company_internal_controlled_use_handoff_and_next_slice_selection",
  selectedNextFile: "packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts",
  selectedNextStatus: "gate_a_prepared_company_internal_controlled_use_handoff_no_runtime_selected_closeout",
  sliceId: "company_internal_controlled_use_handoff_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_HANDOFF_SURFACES = [
  "packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts",
  "packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts",
  "docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const ACCEPTANCE_BUCKETS = [
  "ready_with_current_source_or_benchmark_owner",
  "caveated_screening_or_field_continuation",
  "blocked_source_owner_missing_or_needs_input",
  "hostile_many_layer_reorder_and_import_edges"
] as const;

const ACCEPTANCE_SCENARIOS = [
  "wall_lsf_exact_preset",
  "wall_aac_single_leaf_benchmark",
  "wall_masonry_single_leaf_benchmark",
  "floor_pliteq_exact_source_corridor",
  "floor_ubiq_bound_source_corridor",
  "rockwool_grouped_triple_leaf_screening_only",
  "rockwool_flat_list_swap_screening_guard",
  "rockwool_field_continuation_screening_bridge",
  "wall_timber_double_board_generated",
  "wall_lined_heavy_core_screening",
  "floor_steel_fallback_generated",
  "near_source_rows_context_only_until_owner_set_exists",
  "wall_no_stud_double_leaf_source_gated",
  "unsupported_target_output_partition",
  "uris_2006_rights_safe_source_packet_absent",
  "estimate_and_impact_json_1e309_rejected",
  "hostile_unknown_material_engine_fail_closed",
  "floor_many_layer_exact_split_stack",
  "floor_many_layer_raw_fail_or_screening_stack",
  "floor_role_defined_reorder_exact_stack",
  "floor_raw_reorder_support_boundary"
] as const;

const OPERATOR_WORKFLOW_MARKERS = [
  "Select `wall` or `floor` first",
  "Fill the inputs opened by that selection",
  "Add layers with material and thickness",
  "Read value, support, confidence, evidence, route, warnings, and unsupported outputs",
  "Copy the caveat",
  "`needs_input`, unsupported, fail-closed, source-gated, or screening-only",
  "Do not infer broad arbitrary layer-order invariance"
] as const;

const READY_VALUE_MARKERS = [
  "`Rw=55`, `R'w=48`, building `DnT,w=50`",
  "`Rw=47`, `R'w=45`, building `DnT,w=47`",
  "`Rw=43`, `R'w=41`, building `DnT,w=43`",
  "`Rw=60`, `Ln,w=58`, `L'n,w=61`, `L'nT,w=58.2`",
  "`Rw=62`, `Ln,w=52`, `L'n,w=55`, `L'nT,w=52.2`"
] as const;

const CAVEAT_MARKERS = [
  "Rockwool remains screening-only",
  "grouped `Rw 41`",
  "flat-list `Rw 51` numeric hold",
  "field `R'w 34` and `DnT,w 36`",
  "not exact/source-validated",
  "field outputs are continuations from active lab/screening/apparent/bound basis",
  "not independent design-grade field measurements",
  "source promotion requires source provenance, topology owner, material mapping owner, metric context owner, tolerance owner, negative boundaries, paired engine tests, and paired visible tests"
] as const;

const REQUIRED_VALIDATION_COMMANDS = [
  "pnpm --filter @dynecho/engine exec vitest run src/company-internal-controlled-use-handoff-gate-a-contract.test.ts --maxWorkers=1",
  "pnpm --filter @dynecho/engine exec vitest run src/company-internal-controlled-use-handoff-gate-a-contract.test.ts src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts --maxWorkers=1",
  "pnpm calculator:gate:current",
  "git diff --check"
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

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

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

const LSF_EXACT_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
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

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT: AirborneContext = {
  ...GROUPED_SPLIT_ROCKWOOL_CONTEXT,
  connectionType: "line_connection",
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const READY_WALL_CASES = [
  {
    contextDefaults: {
      connectionType: "line_connection",
      studSpacingMm: 600,
      studType: "light_steel_stud"
    },
    expected: {
      buildingDnTw: 50,
      buildingRwPrime: 48,
      fieldRwPrime: 48,
      labRw: 55
    },
    id: "wall_lsf_exact_preset",
    rows: [
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 5 },
      { materialId: "glasswool", thicknessMm: 70 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
    ]
  },
  {
    contextDefaults: {},
    expected: {
      buildingDnTw: 47,
      buildingRwPrime: 45,
      fieldRwPrime: 45,
      labRw: 47
    },
    id: "wall_aac_single_leaf_benchmark",
    rows: [
      { materialId: "cement_plaster", thicknessMm: 10 },
      { materialId: "ytong_aac_d700", thicknessMm: 150 },
      { materialId: "cement_plaster", thicknessMm: 10 }
    ]
  },
  {
    contextDefaults: {},
    expected: {
      buildingDnTw: 43,
      buildingRwPrime: 41,
      fieldRwPrime: 41,
      labRw: 43
    },
    id: "wall_masonry_single_leaf_benchmark",
    rows: [
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 100 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ]
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

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const LSF_EXACT_SOURCE_STACK: readonly LayerInput[] = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
];

const LSF_NEAR_SOURCE_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "rockwool", thicknessMm: 70 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const RAW_TERMINAL_CONCRETE_HELPER_ROWS: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 13 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "furring_channel", thicknessMm: 28 },
  { materialId: "concrete", thicknessMm: 150 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
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
    calculator: "dynamic",
    targetOutputs: WALL_OUTPUTS
  });

  return {
    dnTw: result.ratings.field?.DnTw ?? null,
    result,
    rw: result.ratings.iso717.Rw ?? null,
    rwPrime: result.ratings.field?.RwPrime ?? result.ratings.iso717.RwPrime ?? null
  };
}

function wallSnapshot(input: {
  airborneContext: AirborneContext;
  layers: readonly LayerInput[];
  outputs: readonly RequestedOutputId[];
}) {
  const result = calculateAssembly(input.layers, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.outputs
  });

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    family: result.dynamicAirborneTrace?.detectedFamily ?? null,
    result,
    rw: result.metrics.estimatedRwDb ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    strategy: result.dynamicAirborneTrace?.strategy ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

function calculateImpactSourceStack(rows: readonly LayerInput[]) {
  return calculateAssembly(rows, {
    impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
    targetOutputs: FLOOR_IMPACT_OUTPUTS
  });
}

function calculateFloor(rows: readonly LayerInput[], targetOutputs: readonly RequestedOutputId[] = FLOOR_FULL_OUTPUTS) {
  return calculateAssembly(rows, {
    airborneContext: FLOOR_AIRBORNE_CONTEXT,
    impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
    targetOutputs
  });
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

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function issuePaths(parseResult: { success: false; error: { issues: Array<{ path: Array<number | string> }> } }) {
  return parseResult.error.issues.map((issue) => issue.path.map(String).join("."));
}

describe("company-internal controlled-use handoff v1 Gate A contract", () => {
  it("lands the current controlled-use handoff pack without runtime or visible-surface movement", () => {
    expect(COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      controlledUseHighAccuracyLabelAllowed: false,
      evidencePromotion: false,
      landedArtifacts: [
        "current_operator_workflow",
        "current_acceptance_bucket_table",
        "ready_values_snapshot",
        "caveated_blocked_stop_rules",
        "validation_command_log",
        "rockwool_screening_only_notice",
        "selected_closeout_or_source_gap_followup"
      ],
      landedGate: "gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      previousClosedSlice: "company_internal_high_accuracy_opening_rehearsal_v1",
      proposalReportValueChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_closeout_company_internal_controlled_use_handoff_and_next_slice_selection",
      selectedNextFile:
        "packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts",
      selectedNextStatus: "gate_a_prepared_company_internal_controlled_use_handoff_no_runtime_selected_closeout",
      sliceId: "company_internal_controlled_use_handoff_v1",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_HANDOFF_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("documents the operator workflow, all buckets, and all current acceptance scenarios", () => {
    const handoff = readRepoFile("docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md");
    const slicePlan = readRepoFile("docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md");

    for (const marker of OPERATOR_WORKFLOW_MARKERS) {
      expect(handoff).toContain(marker);
    }

    for (const bucket of ACCEPTANCE_BUCKETS) {
      expect(handoff).toContain(bucket);
      expect(slicePlan).toContain(bucket);
    }

    for (const scenarioId of ACCEPTANCE_SCENARIOS) {
      expect(handoff).toContain(scenarioId);
    }

    for (const artifact of COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_A.landedArtifacts) {
      expect(handoff).toContain(artifact);
    }
  });

  it("pins the ready value snapshot to current source and benchmark corridors", () => {
    const handoff = readRepoFile("docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md");

    for (const testCase of READY_WALL_CASES) {
      const lab = wallValueSnapshot(testCase.rows, wallContext(WALL_LAB_CONTEXT, testCase.contextDefaults));
      const field = wallValueSnapshot(testCase.rows, wallContext(WALL_FIELD_CONTEXT, testCase.contextDefaults));
      const building = wallValueSnapshot(testCase.rows, wallContext(WALL_BUILDING_CONTEXT, testCase.contextDefaults));

      expect(lab.rw, `${testCase.id}: lab Rw`).toBe(testCase.expected.labRw);
      expect(field.rwPrime, `${testCase.id}: field R'w`).toBe(testCase.expected.fieldRwPrime);
      expect(building.rwPrime, `${testCase.id}: building R'w`).toBe(testCase.expected.buildingRwPrime);
      expect(building.dnTw, `${testCase.id}: building DnT,w`).toBe(testCase.expected.buildingDnTw);
    }

    const pliteq = calculateImpactSourceStack(PLITEQ_EXACT_SOURCE_STACK);
    const ubiq = calculateImpactSourceStack(UBIQ_FL32_BOUND_SOURCE_STACK);

    expect(resultSnapshot(pliteq)).toMatchObject({
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      lPrimeNTw: 58.2,
      lPrimeNW: 61,
      lnW: 58,
      rw: 60,
      unsupportedTargetOutputs: ["Ln,w+CI", "DeltaLw", "L'nT,50"]
    });
    expect(resultSnapshot(ubiq)).toMatchObject({
      boundFloorSystemEstimateKind: "bound_interpolation",
      impactBasis: "mixed_bound_plus_estimated_standardized_field_volume_normalization",
      lPrimeNTw: 52.2,
      lPrimeNW: 55,
      lnW: 52,
      rw: 62,
      unsupportedTargetOutputs: ["Ln,w+CI", "DeltaLw", "L'nT,50"]
    });

    for (const marker of READY_VALUE_MARKERS) {
      expect(handoff).toContain(marker);
    }
  });

  it("keeps caveated, Rockwool, field-continuation, and source-promotion stop rules visible", () => {
    const handoff = readRepoFile("docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md");
    const grouped = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const flatSwap = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: swap(SPLIT_ROCKWOOL_STACK, 3, 4),
      outputs: WALL_LAB_OUTPUTS
    });
    const field = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });
    const exactSource = wallSnapshot({
      airborneContext: LSF_EXACT_CONTEXT,
      layers: LSF_EXACT_SOURCE_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const nearSource = wallSnapshot({
      airborneContext: LSF_EXACT_CONTEXT,
      layers: LSF_NEAR_SOURCE_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const timber = generatedCase("wall-timber-stud");
    const linedHeavy = generatedCase("wall-screening-concrete");
    const steelFallback = generatedCase("floor-steel-fallback");

    expect(grouped).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 50,
      stc: 55,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    });
    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(field).toMatchObject({
      confidence: "medium",
      dnTw: 50,
      family: "multileaf_multicavity",
      rwPrime: 49,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    });
    expect(exactSource).toMatchObject({ confidence: "low", family: "stud_wall_system", rw: 55 });
    expect(exactSource.warnings).toMatch(/Curated exact airborne lab match active/i);
    expect(nearSource).toMatchObject({ confidence: "low", family: "stud_wall_system", rw: 53 });
    expect(nearSource.warnings).not.toMatch(/Curated exact airborne lab match active/i);

    expect(resultSnapshot(calculateAssembly(timber.rows, timber.fieldOptions))).toMatchObject({
      dnTw: 43,
      dynamicFamily: "stud_wall_system",
      rw: 42,
      rwPrimeDb: 42
    });
    expect(resultSnapshot(calculateAssembly(linedHeavy.rows, linedHeavy.fieldOptions))).toMatchObject({
      dnTA: 54.9,
      dnTw: 56,
      dynamicFamily: "lined_massive_wall",
      rw: 55,
      rwPrimeDb: 55
    });
    expect(resultSnapshot(calculateAssembly(steelFallback.rows, steelFallback.fieldOptions))).toMatchObject({
      floorSystemEstimateKind: "low_confidence",
      lPrimeNTw: 58.5,
      lPrimeNW: 61.3,
      lnW: 58.3,
      rw: 61,
      unsupportedTargetOutputs: ["L'nT,50"]
    });

    for (const marker of CAVEAT_MARKERS) {
      expect(handoff).toContain(marker);
    }
  });

  it("keeps hostile input, unsupported output, many-layer, and reorder stop rules backed by executable values", () => {
    const handoff = readRepoFile("docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md");
    const parsedEstimateHugeJson = JSON.parse(
      '{"layers":[{"materialId":"gypsum_board","thicknessMm":1e309}],"targetOutputs":["Rw"]}'
    ) as unknown;
    const parsedImpactHugeJson = JSON.parse(
      '{"layers":[{"materialId":"concrete","thicknessMm":1e309}],"targetOutputs":["Ln,w"]}'
    ) as unknown;
    const estimateNonFinite = EstimateRequestSchema.safeParse(parsedEstimateHugeJson);
    const impactNonFinite = ImpactOnlyRequestSchema.safeParse(parsedImpactHugeJson);
    const unsupported = analyzeTargetOutputSupport({
      impact: null,
      lowerBoundImpact: null,
      metrics: {
        airborneIsoDescriptor: "R'w",
        estimatedRwDb: 55
      },
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });
    const manyLayerExact = calculateFloor(makeUbiqExactSplitLayers());
    const manyLayerRaw = calculateFloor(makeRawManyLayerRows());
    const exactReorderCase = generatedCase("floor-open-web-200-exact");
    const exactBaseline = calculateAssembly(exactReorderCase.rows, exactReorderCase.fieldOptions);
    const exactReversed = calculateAssembly([...exactReorderCase.rows].reverse(), exactReorderCase.fieldOptions);
    const rawBaseline = calculateFloor(RAW_TERMINAL_CONCRETE_HELPER_ROWS);
    const rawMoved = calculateFloor(moveLastToFirst(RAW_TERMINAL_CONCRETE_HELPER_ROWS));

    expect(estimateNonFinite.success).toBe(false);
    if (!estimateNonFinite.success) {
      expect(issuePaths(estimateNonFinite)).toContain("layers.0.thicknessMm");
    }
    expect(impactNonFinite.success).toBe(false);
    if (!impactNonFinite.success) {
      expect(issuePaths(impactNonFinite)).toContain("layers.0.thicknessMm");
    }

    expect(unsupported.supportedTargetOutputs).toEqual(["R'w"]);
    expect(unsupported.unsupportedTargetOutputs).toEqual(["Rw", "DnT,w"]);
    expect(resultSnapshot(manyLayerExact)).toMatchObject({
      floorSystemMatchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      lPrimeNT50: 52,
      lnW: 52,
      rw: 63
    });
    expect(resultSnapshot(manyLayerRaw)).toMatchObject({
      floorSystemMatchId: null,
      impactBasis: null,
      rw: 71,
      unsupportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    });
    expect(resultSnapshot(exactReversed)).toMatchObject({
      floorSystemMatchId: resultSnapshot(exactBaseline).floorSystemMatchId,
      impactBasis: resultSnapshot(exactBaseline).impactBasis,
      lnW: resultSnapshot(exactBaseline).lnW,
      rw: resultSnapshot(exactBaseline).rw
    });
    expect(rawBaseline.supportedTargetOutputs).toContain("Rw");
    expect(rawMoved.supportedTargetOutputs).not.toContain("Rw");

    for (const marker of [
      "finite schema validation",
      "`layers.0.thicknessMm`",
      "unsupported companions remain unsupported",
      "50+ exact split stacks remain finite",
      "raw moved support may drop `Rw`",
      "broad arbitrary reorder invariance is not claimed"
    ]) {
      expect(handoff).toContain(marker);
    }
  });

  it("keeps docs, validation commands, and next closeout selection aligned", () => {
    const docs = REQUIRED_HANDOFF_SURFACES.filter((path) => path.endsWith(".md") || path === "AGENTS.md")
      .map((relativePath) => readRepoFile(relativePath))
      .join("\n\n");

    for (const artifact of COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_A.landedArtifacts) {
      expect(docs).toContain(artifact);
    }
    for (const command of REQUIRED_VALIDATION_COMMANDS) {
      expect(docs).toContain(command);
    }
    expect(docs).toContain(COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_A.selectedNextFile);
    expect(docs).toContain(COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_A.selectedNextAction);
    expect(docs).toContain("high-accuracy label remains forbidden");
    expect(docs).toContain("No runtime/support/confidence/evidence/API/route-card/output-card");
    expect(docs).toContain("proposal/report/workbench-input behavior is allowed to move");

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/company-internal-controlled-use-handoff-gate-a-contract.test.ts");
  });
});

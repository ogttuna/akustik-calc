import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EstimateRequestSchema,
  ImpactOnlyRequestSchema,
  ServerProjectImportLocalRequestSchema,
  type AirborneContext,
  type ImpactFieldContext,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import { analyzeTargetOutputSupport } from "./target-output-support";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  highAccuracyOpeningAllowedByGateAAlone: false,
  landedGate: "gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportValueChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_closeout_company_internal_opening_rehearsal_and_next_slice_selection",
  selectedNextFile:
    "packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts",
  selectedNextStatus:
    "gate_a_rehearsed_company_internal_high_accuracy_opening_no_runtime_selected_closeout",
  sliceId: "company_internal_high_accuracy_opening_rehearsal_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const ACCEPTANCE_BUCKETS = [
  "ready_with_source_or_benchmark_owner",
  "caveated_screening_or_field_continuation",
  "blocked_source_owner_missing_or_needs_input",
  "hostile_or_stability_guarded"
] as const;

type AcceptanceBucket = (typeof ACCEPTANCE_BUCKETS)[number];

const COMPANY_INTERNAL_OPENING_ACCEPTANCE_MATRIX: ReadonlyArray<{
  bucket: AcceptanceBucket;
  highAccuracyLabelAllowedNow: boolean;
  id: string;
  runtimePromotionAllowed: boolean;
}> = [
  {
    bucket: "ready_with_source_or_benchmark_owner",
    highAccuracyLabelAllowedNow: true,
    id: "wall_lsf_exact_preset",
    runtimePromotionAllowed: false
  },
  {
    bucket: "ready_with_source_or_benchmark_owner",
    highAccuracyLabelAllowedNow: true,
    id: "wall_aac_single_leaf_benchmark",
    runtimePromotionAllowed: false
  },
  {
    bucket: "ready_with_source_or_benchmark_owner",
    highAccuracyLabelAllowedNow: true,
    id: "wall_masonry_single_leaf_benchmark",
    runtimePromotionAllowed: false
  },
  {
    bucket: "ready_with_source_or_benchmark_owner",
    highAccuracyLabelAllowedNow: true,
    id: "floor_pliteq_exact_source_corridor",
    runtimePromotionAllowed: false
  },
  {
    bucket: "ready_with_source_or_benchmark_owner",
    highAccuracyLabelAllowedNow: true,
    id: "floor_ubiq_bound_source_corridor",
    runtimePromotionAllowed: false
  },
  {
    bucket: "caveated_screening_or_field_continuation",
    highAccuracyLabelAllowedNow: false,
    id: "rockwool_grouped_triple_leaf_screening_only",
    runtimePromotionAllowed: false
  },
  {
    bucket: "caveated_screening_or_field_continuation",
    highAccuracyLabelAllowedNow: false,
    id: "rockwool_flat_list_swap_screening_guard",
    runtimePromotionAllowed: false
  },
  {
    bucket: "caveated_screening_or_field_continuation",
    highAccuracyLabelAllowedNow: false,
    id: "rockwool_field_continuation_screening_bridge",
    runtimePromotionAllowed: false
  },
  {
    bucket: "caveated_screening_or_field_continuation",
    highAccuracyLabelAllowedNow: false,
    id: "wall_timber_double_board_generated",
    runtimePromotionAllowed: false
  },
  {
    bucket: "caveated_screening_or_field_continuation",
    highAccuracyLabelAllowedNow: false,
    id: "wall_lined_heavy_core_screening",
    runtimePromotionAllowed: false
  },
  {
    bucket: "caveated_screening_or_field_continuation",
    highAccuracyLabelAllowedNow: false,
    id: "floor_steel_fallback_generated",
    runtimePromotionAllowed: false
  },
  {
    bucket: "blocked_source_owner_missing_or_needs_input",
    highAccuracyLabelAllowedNow: false,
    id: "near_source_rows_context_only_until_owner_set_exists",
    runtimePromotionAllowed: false
  },
  {
    bucket: "blocked_source_owner_missing_or_needs_input",
    highAccuracyLabelAllowedNow: false,
    id: "wall_no_stud_double_leaf_source_gated",
    runtimePromotionAllowed: false
  },
  {
    bucket: "blocked_source_owner_missing_or_needs_input",
    highAccuracyLabelAllowedNow: false,
    id: "unsupported_target_output_partition",
    runtimePromotionAllowed: false
  },
  {
    bucket: "blocked_source_owner_missing_or_needs_input",
    highAccuracyLabelAllowedNow: false,
    id: "uris_2006_rights_safe_source_packet_absent",
    runtimePromotionAllowed: false
  },
  {
    bucket: "hostile_or_stability_guarded",
    highAccuracyLabelAllowedNow: false,
    id: "estimate_and_impact_json_1e309_rejected",
    runtimePromotionAllowed: false
  },
  {
    bucket: "hostile_or_stability_guarded",
    highAccuracyLabelAllowedNow: false,
    id: "hostile_unknown_material_engine_fail_closed",
    runtimePromotionAllowed: false
  },
  {
    bucket: "hostile_or_stability_guarded",
    highAccuracyLabelAllowedNow: false,
    id: "floor_many_layer_exact_split_stack",
    runtimePromotionAllowed: false
  },
  {
    bucket: "hostile_or_stability_guarded",
    highAccuracyLabelAllowedNow: false,
    id: "floor_many_layer_raw_fail_or_screening_stack",
    runtimePromotionAllowed: false
  },
  {
    bucket: "hostile_or_stability_guarded",
    highAccuracyLabelAllowedNow: false,
    id: "floor_role_defined_reorder_exact_stack",
    runtimePromotionAllowed: false
  },
  {
    bucket: "hostile_or_stability_guarded",
    highAccuracyLabelAllowedNow: false,
    id: "floor_raw_reorder_support_boundary",
    runtimePromotionAllowed: false
  }
] as const;

const FINAL_VALIDATION_EVIDENCE_MAP = {
  artifact: "final_validation_evidence_map",
  broadCheckRequiredBeforeOpeningHandoff: true,
  currentGateRequiredBeforeOpeningHandoff: true,
  focusedGateACommand:
    "pnpm --filter @dynecho/engine exec vitest run src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts --maxWorkers=1",
  gitDiffCheckRequiredBeforeOpeningHandoff: true,
  latestFullCheckEvidenceCarriedForwardFromSourceHostileCloseout: true,
  openingHandoffAllowedByGateAAlone: false
} as const;

const ROCKWOOL_SCREENING_AND_SOURCE_BLOCKER_REGISTRY = {
  artifact: "rockwool_screening_and_source_blocker_registry",
  exactRuntimeFixedNow: false,
  fieldDnTwDb: 36,
  fieldRwPrimeDb: 34,
  flatListRwDb: 51,
  flatListStrategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
  groupedRwDb: 41,
  groupedStrategy: "multileaf_screening_blend",
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const SOURCE_PROMOTION_NO_RUNTIME_BOUNDARY_REGISTER = {
  artifact: "source_promotion_no_runtime_boundary_register",
  exactRowsMayPromoteOnlyWith: [
    "source_provenance",
    "topology_owner",
    "material_mapping_owner",
    "metric_context_owner",
    "tolerance_owner",
    "negative_boundaries",
    "paired_engine_tests",
    "paired_visible_tests"
  ],
  importSnapshotCanPromoteRuntime: false,
  nearSourceRowsContextOnly: true,
  runtimeImportSelectedNow: false
} as const;

const HOSTILE_API_IMPORT_FAIL_CLOSED_EVIDENCE = {
  artifact: "hostile_api_import_fail_closed_evidence",
  estimateJson1e309RejectedByFiniteLayerSchema: true,
  hostileUnknownMaterialEngineFailClosed: true,
  impactOnlyJson1e309RejectedByFiniteLayerSchema: true,
  importOutputSnapshotNonFiniteRejected: true,
  invalidThicknessAllCallersGuardActive: true
} as const;

const OPERATOR_CAVEAT_AND_USAGE_HANDOFF_PACK = {
  artifact: "operator_caveat_and_usage_handoff_pack",
  caveatedBucketsMustStayVisible: true,
  fieldOutputsNotIndependentDesignGrade: true,
  highAccuracyOpeningCopyAllowedNow: false,
  readyBucketsMayBeUsedWithCurrentSourceOrBenchmarkCaveat: true,
  rockwoolMustSayScreeningOnly: true
} as const;

const SELECTED_OPENING_HANDOFF_OR_BACKLOG_FOLLOWUP = {
  artifact: "selected_opening_handoff_or_backlog_followup",
  reason:
    "gate_a_rehearsal_created_the_current_acceptance_matrix_but_still_requires_closeout_validation_evidence_before_any_company_internal_high_accuracy_handoff_label",
  selectedNextAction: "gate_c_closeout_company_internal_opening_rehearsal_and_next_slice_selection",
  selectedNextFile:
    "packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts",
  selectedNextStatus:
    "gate_a_rehearsed_company_internal_high_accuracy_opening_no_runtime_selected_closeout"
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts",
  "packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts",
  "packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/company-internal-misclassification-readiness-blocker-contract.test.ts",
  "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
  "packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts",
  "packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts",
  "apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts",
  "apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts",
  "apps/web/lib/calculator-api-validation.test.ts",
  "docs/calculator/SLICE_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_A_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_DOC_TOKENS = [
  COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_A.landedGate,
  COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_A.selectedNextStatus,
  COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_A.selectedNextAction,
  COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_A.selectedNextFile,
  "company_internal_opening_acceptance_matrix",
  "final_validation_evidence_map",
  "rockwool_screening_and_source_blocker_registry",
  "source_promotion_no_runtime_boundary_register",
  "hostile_api_import_fail_closed_evidence",
  "operator_caveat_and_usage_handoff_pack",
  "selected_opening_handoff_or_backlog_followup"
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
  contextMode: "field_between_rooms",
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const STUD_EXACT_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const FLOOR_AIRBORNE_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
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
  contextMode: "field_between_rooms",
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
    labWarningPattern: /Curated exact airborne lab match active/i,
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
    labWarningPattern: null,
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
    labWarningPattern: null,
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

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function issuePaths(parseResult: { success: false; error: { issues: Array<{ path: Array<number | string> }> } }) {
  return parseResult.error.issues.map((issue) => issue.path.map(String).join("."));
}

describe("company-internal high-accuracy opening rehearsal v1 Gate A contract", () => {
  it("lands Gate A as a no-runtime company-internal opening rehearsal", () => {
    expect(COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      highAccuracyOpeningAllowedByGateAAlone: false,
      landedGate: "gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportValueChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_closeout_company_internal_opening_rehearsal_and_next_slice_selection",
      selectedNextFile:
        "packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts",
      selectedNextStatus:
        "gate_a_rehearsed_company_internal_high_accuracy_opening_no_runtime_selected_closeout",
      sliceId: "company_internal_high_accuracy_opening_rehearsal_v1",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("builds the company-internal opening acceptance matrix without allowing a Gate A-only opening label", () => {
    expect(COMPANY_INTERNAL_OPENING_ACCEPTANCE_MATRIX).toHaveLength(21);
    expect(new Set(COMPANY_INTERNAL_OPENING_ACCEPTANCE_MATRIX.map((scenario) => scenario.id)).size).toBe(21);

    for (const bucket of ACCEPTANCE_BUCKETS) {
      expect(
        COMPANY_INTERNAL_OPENING_ACCEPTANCE_MATRIX.some((scenario) => scenario.bucket === bucket),
        `bucket ${bucket} should be represented`
      ).toBe(true);
    }

    expect(COMPANY_INTERNAL_OPENING_ACCEPTANCE_MATRIX.every((scenario) => scenario.runtimePromotionAllowed === false)).toBe(
      true
    );
    expect(
      COMPANY_INTERNAL_OPENING_ACCEPTANCE_MATRIX.filter((scenario) => scenario.highAccuracyLabelAllowedNow).map(
        (scenario) => scenario.id
      )
    ).toEqual([
      "wall_lsf_exact_preset",
      "wall_aac_single_leaf_benchmark",
      "wall_masonry_single_leaf_benchmark",
      "floor_pliteq_exact_source_corridor",
      "floor_ubiq_bound_source_corridor"
    ]);

    expect(FINAL_VALIDATION_EVIDENCE_MAP).toEqual({
      artifact: "final_validation_evidence_map",
      broadCheckRequiredBeforeOpeningHandoff: true,
      currentGateRequiredBeforeOpeningHandoff: true,
      focusedGateACommand:
        "pnpm --filter @dynecho/engine exec vitest run src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts --maxWorkers=1",
      gitDiffCheckRequiredBeforeOpeningHandoff: true,
      latestFullCheckEvidenceCarriedForwardFromSourceHostileCloseout: true,
      openingHandoffAllowedByGateAAlone: false
    });
    expect(OPERATOR_CAVEAT_AND_USAGE_HANDOFF_PACK).toMatchObject({
      fieldOutputsNotIndependentDesignGrade: true,
      highAccuracyOpeningCopyAllowedNow: false,
      rockwoolMustSayScreeningOnly: true
    });
  });

  it("pins current ready wall and floor corridors to their defended calculation values", () => {
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

      if (testCase.labWarningPattern) {
        expect(lab.result.warnings.some((warning: string) => testCase.labWarningPattern?.test(warning))).toBe(true);
      }
    }

    const pliteq = calculateImpactSourceStack(PLITEQ_EXACT_SOURCE_STACK);
    const ubiq = calculateImpactSourceStack(UBIQ_FL32_BOUND_SOURCE_STACK);

    expect(pliteq.floorSystemMatch?.system.id).toBe("pliteq_steel_joist_250_rst02_vinyl_lab_2026");
    expect(resultSnapshot(pliteq)).toMatchObject({
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      lPrimeNTw: 58.2,
      lPrimeNW: 61,
      lnW: 58,
      rw: 60,
      unsupportedTargetOutputs: ["Ln,w+CI", "DeltaLw", "L'nT,50"]
    });

    expect(ubiq.boundFloorSystemEstimate).toMatchObject({
      kind: "bound_interpolation",
      sourceSystems: [{ id: "ubiq_fl32_steel_200_lab_2026" }, { id: "ubiq_fl32_steel_300_lab_2026" }]
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
  });

  it("keeps Rockwool, generated, and near-source lanes caveated or blocked without promotion", () => {
    const groupedRockwool = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const flatSwapRockwool = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: swap(SPLIT_ROCKWOOL_STACK, 3, 4),
      outputs: WALL_LAB_OUTPUTS
    });
    const fieldRockwool = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });
    const exactSource = wallSnapshot({
      airborneContext: STUD_EXACT_CONTEXT,
      layers: LSF_EXACT_SOURCE_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const nearSource = wallSnapshot({
      airborneContext: STUD_EXACT_CONTEXT,
      layers: LSF_NEAR_SOURCE_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const timber = generatedCase("wall-timber-stud");
    const linedHeavy = generatedCase("wall-screening-concrete");
    const steelFallback = generatedCase("floor-steel-fallback");
    const timberField = calculateAssembly(timber.rows, timber.fieldOptions);
    const linedHeavyField = calculateAssembly(linedHeavy.rows, linedHeavy.fieldOptions);
    const steelFallbackField = calculateAssembly(steelFallback.rows, steelFallback.fieldOptions);

    expect(ROCKWOOL_SCREENING_AND_SOURCE_BLOCKER_REGISTRY).toEqual({
      artifact: "rockwool_screening_and_source_blocker_registry",
      exactRuntimeFixedNow: false,
      fieldDnTwDb: 36,
      fieldRwPrimeDb: 34,
      flatListRwDb: 51,
      flatListStrategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      groupedRwDb: 41,
      groupedStrategy: "multileaf_screening_blend",
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
    });
    expect(SOURCE_PROMOTION_NO_RUNTIME_BOUNDARY_REGISTER).toMatchObject({
      artifact: "source_promotion_no_runtime_boundary_register",
      importSnapshotCanPromoteRuntime: false,
      nearSourceRowsContextOnly: true,
      runtimeImportSelectedNow: false
    });

    expect(groupedRockwool).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 53,
      stc: 64,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(groupedRockwool.warnings).toContain("lab spectrum adapter is active");
    expect(groupedRockwool.warnings).toContain("keeps the parent not-measured budget");

    expect(flatSwapRockwool).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(fieldRockwool).toMatchObject({
      confidence: "medium",
      dnTw: 53,
      family: "multileaf_multicavity",
      rwPrime: 51,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["R'w", "DnT,w"]
    });

    expect(exactSource).toMatchObject({ confidence: "low", family: "stud_wall_system", rw: 55 });
    expect(exactSource.warnings).toMatch(/Curated exact airborne lab match active/i);
    expect(nearSource).toMatchObject({ confidence: "low", family: "stud_wall_system", rw: 53 });
    expect(nearSource.warnings).not.toMatch(/Curated exact airborne lab match active/i);

    expect(resultSnapshot(timberField)).toMatchObject({
      dnTw: 43,
      dynamicFamily: "stud_wall_system",
      rw: 42,
      rwPrimeDb: 42
    });
    expect(timberField.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(resultSnapshot(linedHeavyField)).toMatchObject({
      dnTA: 54.9,
      dnTw: 56,
      dynamicFamily: "lined_massive_wall",
      rw: 55,
      rwPrimeDb: 55
    });
    expect(linedHeavyField.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      strategy: "lined_massive_blend"
    });
    expect(resultSnapshot(steelFallbackField)).toMatchObject({
      floorSystemEstimateKind: "family_archetype",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNTw: 58.2,
      lPrimeNW: 61,
      lnW: 58,
      rw: 60,
      unsupportedTargetOutputs: ["L'nT,50"]
    });
  });

  it("keeps hostile input, unsupported output, many-layer, and reorder boundaries fail-closed or finite", () => {
    const parsedEstimateHugeJson = JSON.parse(
      '{"layers":[{"materialId":"gypsum_board","thicknessMm":1e309}],"targetOutputs":["Rw"]}'
    ) as unknown;
    const parsedImpactHugeJson = JSON.parse(
      '{"layers":[{"materialId":"concrete","thicknessMm":1e309}],"targetOutputs":["Ln,w"]}'
    ) as unknown;
    const estimateNonFinite = EstimateRequestSchema.safeParse(parsedEstimateHugeJson);
    const impactNonFinite = ImpactOnlyRequestSchema.safeParse(parsedImpactHugeJson);
    const nonFiniteOutputImport = ServerProjectImportLocalRequestSchema.safeParse({
      projectName: "Company internal opening hostile output import",
      scenarios: [
        {
          inputSnapshot: {
            rows: [{ materialId: "gypsum_board", thicknessMm: "12.5" }],
            schemaId: "dynecho.simple-workbench.snapshot.v1",
            studyMode: "wall"
          },
          name: "Hostile output",
          outputSnapshot: JSON.parse('{"result":{"metrics":{"estimatedRwDb":1e309}}}')
        }
      ]
    });
    const unknownEstimate = EstimateRequestSchema.safeParse({
      layers: [{ materialId: "__company_internal_opening_unknown_material", thicknessMm: 12.5 }],
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const invalid = calculateAssembly([{ materialId: "concrete", thicknessMm: 0 }], {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
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

    expect(HOSTILE_API_IMPORT_FAIL_CLOSED_EVIDENCE).toEqual({
      artifact: "hostile_api_import_fail_closed_evidence",
      estimateJson1e309RejectedByFiniteLayerSchema: true,
      hostileUnknownMaterialEngineFailClosed: true,
      impactOnlyJson1e309RejectedByFiniteLayerSchema: true,
      importOutputSnapshotNonFiniteRejected: true,
      invalidThicknessAllCallersGuardActive: true
    });

    expect(estimateNonFinite.success).toBe(false);
    if (!estimateNonFinite.success) {
      expect(issuePaths(estimateNonFinite)).toContain("layers.0.thicknessMm");
    }
    expect(impactNonFinite.success).toBe(false);
    if (!impactNonFinite.success) {
      expect(issuePaths(impactNonFinite)).toContain("layers.0.thicknessMm");
    }
    expect(nonFiniteOutputImport.success).toBe(false);
    if (!nonFiniteOutputImport.success) {
      expect(issuePaths(nonFiniteOutputImport).some((path) => path.startsWith("scenarios.0.outputSnapshot"))).toBe(
        true
      );
    }

    expect(unknownEstimate.success).toBe(true);
    if (!unknownEstimate.success) {
      throw new Error("Unknown material should reach the engine fail-closed guard.");
    }
    const unknown = calculateAssembly(unknownEstimate.data.layers, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    expect(unknown.supportedTargetOutputs).toEqual([]);
    expect(unknown.unsupportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
    expect(unknown.warnings.join("\n")).toMatch(/unknown material/i);

    expect(invalid.supportedTargetOutputs).toEqual([]);
    expect(invalid.unsupportedTargetOutputs).toEqual(WALL_OUTPUTS);
    expect(invalid.warnings.some((warning: string) => /invalid thickness: 0/i.test(warning))).toBe(true);
    expectSupportPartition("invalid wall thickness", invalid, WALL_OUTPUTS);

    expect(unsupported.supportedTargetOutputs).toEqual(["R'w"]);
    expect(unsupported.unsupportedTargetOutputs).toEqual(["Rw", "DnT,w"]);

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

  it("keeps docs and current-gate runner aligned with the Gate A rehearsal outputs", () => {
    const docs = REQUIRED_SURFACES.filter((path) => path.endsWith(".md") || path === "AGENTS.md")
      .map((relativePath) => readRepoFile(relativePath))
      .join("\n\n");

    for (const token of REQUIRED_DOC_TOKENS) {
      expect(docs, token).toContain(token);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts");

    expect(SELECTED_OPENING_HANDOFF_OR_BACKLOG_FOLLOWUP).toEqual({
      artifact: "selected_opening_handoff_or_backlog_followup",
      reason:
        "gate_a_rehearsal_created_the_current_acceptance_matrix_but_still_requires_closeout_validation_evidence_before_any_company_internal_high_accuracy_handoff_label",
      selectedNextAction: "gate_c_closeout_company_internal_opening_rehearsal_and_next_slice_selection",
      selectedNextFile:
        "packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts",
      selectedNextStatus:
        "gate_a_rehearsed_company_internal_high_accuracy_opening_no_runtime_selected_closeout"
    });
  });
});

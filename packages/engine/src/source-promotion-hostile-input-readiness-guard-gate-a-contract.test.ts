import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EstimateRequestSchema,
  ImpactOnlyRequestSchema,
  ServerProjectImportLocalRequestSchema,
  type AirborneContext,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GATE_A = {
  apiRouteContractChange: false,
  calculatorNumericRuntimeBehaviorChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_inventory_source_promotion_and_hostile_input_readiness_after_rockwool_policy_closeout",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportValueChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  schemaValidationTightening: true,
  selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  selectedNextFile:
    "packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts",
  selectedNextStatus:
    "gate_a_inventoried_source_promotion_hostile_input_readiness_landed_finite_schema_tightening_selected_closeout",
  sharedLayerSchemaFiniteThickness: true,
  sliceId: "source_promotion_hostile_input_readiness_guard_v1",
  supportPromotion: false,
  thisGateFile:
    "packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/shared/src/domain/layer.ts",
  "apps/web/lib/calculator-api-validation.test.ts",
  "apps/web/app/api/estimate/route.ts",
  "apps/web/app/api/impact-only/route.ts",
  "apps/web/app/api/projects/import-local/route.ts",
  "apps/web/lib/server-project-storage.ts",
  "apps/web/features/workbench/simple-workbench-shell.tsx",
  "apps/web/features/workbench/server-project-workbench-snapshot.ts",
  "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
  "packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts",
  "packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts",
  "packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts",
  "apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts",
  "apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts",
  "apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts",
  "packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_GATE_A_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_DOC_TOKENS = [
  SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GATE_A.selectedNextStatus,
  SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GATE_A.selectedNextAction,
  SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GATE_A.selectedNextFile,
  "source_promotion_surface_inventory",
  "hostile_api_import_fail_closed_surface_inventory",
  "estimate_json_1e309_rejected_by_finite_layer_schema",
  "server_import_snapshot_not_runtime_promotion_surface",
  "near_source_rows_context_only_until_owner_set_exists",
  "rockwool_gate_c_policy_freeze_carry_forward",
  "selected_source_promotion_hostile_closeout_with_target_file"
] as const;

const SOURCE_PROMOTION_SURFACE_INVENTORY = {
  artifact: "source_promotion_surface_inventory",
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
  exactSourceControlsStillActive: true,
  nearSourceRowsContextOnly: true,
  sourcePromotionRuntimeReadyNow: false
} as const;

const HOSTILE_API_IMPORT_FAIL_CLOSED_SURFACE_INVENTORY = {
  artifact: "hostile_api_import_fail_closed_surface_inventory",
  allCallerInvalidThicknessGuardActive: true,
  estimateJson1e309RejectedByFiniteLayerSchema: true,
  hostileUnknownMaterialSchemaPassesButEngineFailCloses: true,
  impactOnlyJson1e309RejectedByFiniteLayerSchema: true,
  importLocalStoresSnapshotsAndDoesNotCalculate: true,
  rawFloorHostileMatrixActive: true,
  rawWallHostileMatrixActive: true
} as const;

const SERVER_IMPORT_SNAPSHOT_NOT_RUNTIME_PROMOTION_SURFACE = {
  artifact: "server_import_snapshot_not_runtime_promotion_surface",
  calculatorOutputRestoredIntoWorkbench: false,
  importRouteRunsCalculator: false,
  inputSnapshotParsedBeforeRestore: true,
  nonFiniteJsonSnapshotRejected: true,
  storedOutputSnapshotCannotSeedLiveExactRuntime: true
} as const;

const ROCKWOOL_GATE_C_POLICY_FREEZE_CARRY_FORWARD = {
  artifact: "rockwool_gate_c_policy_freeze_carry_forward",
  exactRuntimeFixedNow: false,
  fieldDnTwDb: 36,
  fieldRwPrimeDb: 34,
  flatListRwDb: 51,
  flatListStrategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
  groupedRwDb: 41,
  groupedStrategy: "multileaf_screening_blend",
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const SELECTED_SOURCE_PROMOTION_HOSTILE_CLOSEOUT_WITH_TARGET_FILE = {
  artifact: "selected_source_promotion_hostile_closeout_with_target_file",
  reason:
    "finite_layer_schema_tightening_closed_the_only_named_hostile_api_gap_and_no_source_row_or_import_path_is_runtime_ready_for_promotion",
  selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  selectedNextFile:
    "packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts",
  selectedNextStatus:
    "gate_a_inventoried_source_promotion_hostile_input_readiness_landed_finite_schema_tightening_selected_closeout"
} as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const STUD_EXACT_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
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
] as const;

const LSF_EXACT_SOURCE_STACK: readonly LayerInput[] = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const;

const LSF_NEAR_SOURCE_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "rockwool", thicknessMm: 70 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const NEAR_SOURCE_ALIAS_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum", thicknessMm: 12.5 },
  { materialId: "firestop_board", thicknessMm: 15 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
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
    rw: result.metrics.estimatedRwDb ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    strategy: result.dynamicAirborneTrace?.strategy ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

function issuePaths(parseResult: { success: false; error: { issues: Array<{ path: Array<number | string> }> } }) {
  return parseResult.error.issues.map((issue) => issue.path.map(String).join("."));
}

describe("source-promotion hostile-input readiness guard Gate A", () => {
  it("lands Gate A with finite layer-schema tightening and selects closeout", () => {
    expect(SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GATE_A).toMatchObject({
      apiRouteContractChange: false,
      calculatorNumericRuntimeBehaviorChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_inventory_source_promotion_and_hostile_input_readiness_after_rockwool_policy_closeout",
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportValueChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      schemaValidationTightening: true,
      selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
      sharedLayerSchemaFiniteThickness: true,
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("keeps exact source controls and near-source aliases separated before any source promotion", () => {
    const exact = wallSnapshot({
      airborneContext: STUD_EXACT_CONTEXT,
      layers: LSF_EXACT_SOURCE_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const near = wallSnapshot({
      airborneContext: STUD_EXACT_CONTEXT,
      layers: LSF_NEAR_SOURCE_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const alias = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: NEAR_SOURCE_ALIAS_STACK,
      outputs: WALL_LAB_OUTPUTS
    });

    expect(SOURCE_PROMOTION_SURFACE_INVENTORY).toEqual({
      artifact: "source_promotion_surface_inventory",
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
      exactSourceControlsStillActive: true,
      nearSourceRowsContextOnly: true,
      sourcePromotionRuntimeReadyNow: false
    });

    expect(exact).toMatchObject({
      confidence: "low",
      family: "stud_wall_system",
      rw: 55,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(exact.warnings).toMatch(/Curated exact airborne lab match active/i);

    expect(near).toMatchObject({
      confidence: "low",
      family: "stud_wall_system",
      rw: 53
    });
    expect(near.warnings).not.toMatch(/Curated exact airborne lab match active/i);

    expect(alias).toMatchObject({
      confidence: "medium",
      family: "laminated_single_leaf",
      rw: 37,
      strategy: "laminated_leaf_sharp_delegate"
    });
    expect(alias.warnings).not.toMatch(/Curated exact airborne lab match active/i);
  });

  it("rejects non-finite API layer thickness and keeps hostile unknown materials fail-closed", () => {
    const parsedEstimateHugeJson = JSON.parse(
      '{"layers":[{"materialId":"gypsum_board","thicknessMm":1e309}],"targetOutputs":["Rw"]}'
    ) as unknown;
    const parsedImpactHugeJson = JSON.parse(
      '{"layers":[{"materialId":"concrete","thicknessMm":1e309}],"targetOutputs":["Ln,w"]}'
    ) as unknown;
    const estimateNonFinite = EstimateRequestSchema.safeParse(parsedEstimateHugeJson);
    const impactNonFinite = ImpactOnlyRequestSchema.safeParse(parsedImpactHugeJson);
    const unknownEstimate = EstimateRequestSchema.safeParse({
      layers: [{ materialId: "__source_hostile_unknown_import", thicknessMm: 12.5 }],
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(HOSTILE_API_IMPORT_FAIL_CLOSED_SURFACE_INVENTORY).toEqual({
      artifact: "hostile_api_import_fail_closed_surface_inventory",
      allCallerInvalidThicknessGuardActive: true,
      estimateJson1e309RejectedByFiniteLayerSchema: true,
      hostileUnknownMaterialSchemaPassesButEngineFailCloses: true,
      impactOnlyJson1e309RejectedByFiniteLayerSchema: true,
      importLocalStoresSnapshotsAndDoesNotCalculate: true,
      rawFloorHostileMatrixActive: true,
      rawWallHostileMatrixActive: true
    });

    expect((parsedEstimateHugeJson as { layers: Array<{ thicknessMm: number }> }).layers[0]?.thicknessMm).toBe(
      Number.POSITIVE_INFINITY
    );
    expect(estimateNonFinite.success).toBe(false);
    if (!estimateNonFinite.success) {
      expect(issuePaths(estimateNonFinite)).toContain("layers.0.thicknessMm");
    }

    expect(impactNonFinite.success).toBe(false);
    if (!impactNonFinite.success) {
      expect(issuePaths(impactNonFinite)).toContain("layers.0.thicknessMm");
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
  });

  it("keeps server import as snapshot persistence rather than a runtime promotion path", () => {
    const nonFiniteOutputImport = ServerProjectImportLocalRequestSchema.safeParse({
      projectName: "Hostile output import",
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
    const storage = readRepoFile("apps/web/lib/server-project-storage.ts");
    const simpleShell = readRepoFile("apps/web/features/workbench/simple-workbench-shell.tsx");
    const legacyShell = readRepoFile("apps/web/features/workbench/workbench-shell.tsx");

    expect(SERVER_IMPORT_SNAPSHOT_NOT_RUNTIME_PROMOTION_SURFACE).toEqual({
      artifact: "server_import_snapshot_not_runtime_promotion_surface",
      calculatorOutputRestoredIntoWorkbench: false,
      importRouteRunsCalculator: false,
      inputSnapshotParsedBeforeRestore: true,
      nonFiniteJsonSnapshotRejected: true,
      storedOutputSnapshotCannotSeedLiveExactRuntime: true
    });

    expect(nonFiniteOutputImport.success).toBe(false);
    if (!nonFiniteOutputImport.success) {
      expect(issuePaths(nonFiniteOutputImport).some((path) => path.startsWith("scenarios.0.outputSnapshot"))).toBe(
        true
      );
    }
    expect(storage).toContain("calculatorInput");
    expect(storage).toContain("calculatorOutput");
    expect(storage).toContain("MAX_SCENARIO_SNAPSHOT_BYTES");
    expect(simpleShell).toContain("parseServerProjectWorkbenchSnapshot(latestScenario.calculatorInput.payload)");
    expect(simpleShell).not.toContain("calculatorOutput.payload");
    expect(legacyShell).toContain("outputSnapshot: evaluatedScenario");
    expect(legacyShell).not.toContain("calculatorOutput.payload");
  });

  it("keeps the Rockwool Gate C policy frozen while source and hostile surfaces are audited", () => {
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

    expect(ROCKWOOL_GATE_C_POLICY_FREEZE_CARRY_FORWARD).toEqual({
      artifact: "rockwool_gate_c_policy_freeze_carry_forward",
      exactRuntimeFixedNow: false,
      fieldDnTwDb: 36,
      fieldRwPrimeDb: 34,
      flatListRwDb: 51,
      flatListStrategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      groupedRwDb: 41,
      groupedStrategy: "multileaf_screening_blend",
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
    });

    expect(grouped).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 53,
      stc: 64,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(grouped.warnings).toContain("lab spectrum adapter is active");
    expect(grouped.warnings).toContain("keeps the parent not-measured budget");

    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(flatSwap.warnings).toContain("Flat-list adjacent-swap sensitivity guard");

    expect(field).toMatchObject({
      confidence: "medium",
      dnTw: 53,
      family: "multileaf_multicavity",
      rwPrime: 51,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["R'w", "DnT,w"]
    });
  });

  it("keeps docs and current-gate runner aligned with Gate A and the selected closeout", () => {
    const docs = REQUIRED_SURFACES.filter((path) => path.endsWith(".md") || path === "AGENTS.md")
      .map((relativePath) => readRepoFile(relativePath))
      .join("\n\n");

    for (const token of REQUIRED_DOC_TOKENS) {
      expect(docs, token).toContain(token);
    }

    const layerSchema = readRepoFile("packages/shared/src/domain/layer.ts");
    expect(layerSchema).toContain("thicknessMm: z.number().finite().positive()");

    const apiValidationTest = readRepoFile("apps/web/lib/calculator-api-validation.test.ts");
    expect(apiValidationTest).toContain("1e309");
    expect(apiValidationTest).toContain("rejects non-finite JSON layer thickness");

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts");

    expect(SELECTED_SOURCE_PROMOTION_HOSTILE_CLOSEOUT_WITH_TARGET_FILE).toEqual({
      artifact: "selected_source_promotion_hostile_closeout_with_target_file",
      reason:
        "finite_layer_schema_tightening_closed_the_only_named_hostile_api_gap_and_no_source_row_or_import_path_is_runtime_ready_for_promotion",
      selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
      selectedNextFile:
        "packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts",
      selectedNextStatus:
        "gate_a_inventoried_source_promotion_hostile_input_readiness_landed_finite_schema_tightening_selected_closeout"
    });
  });
});

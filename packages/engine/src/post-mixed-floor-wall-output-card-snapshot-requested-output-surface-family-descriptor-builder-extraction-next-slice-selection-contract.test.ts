import { describe, expect, it } from "vitest";

const POST_MIXED_FLOOR_WALL_OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_SURFACE_FAMILY_DESCRIPTOR_BUILDER_EXTRACTION_NEXT_SLICE_SELECTION = {
  sliceId:
    "post_mixed_floor_wall_output_card_snapshot_requested_output_surface_family_descriptor_builder_extraction_next_slice_selection_v1",
  selectedImplementationSlice:
    "mixed_floor_wall_output_card_snapshot_requested_output_surface_message_bundle_extraction_v1",
  selectedOutputSurface: "workbench_output_card_snapshot_requested_output_surface_message_bundle_harness",
  selectedRouteFamily: "mixed_floor_wall_route_matrix",
  selectionStatus: "selected_no_runtime_harness_hardening",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction:
    "mixed_floor_wall_output_card_snapshot_requested_output_surface_message_bundle_extraction_v1",
  followUpPlanningAction:
    "post_mixed_floor_wall_output_card_snapshot_requested_output_surface_message_bundle_extraction_next_slice_selection_v1",
} as const;

const OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_SURFACE_MESSAGE_BUNDLE_SCOPE = {
  currentRequestedOutputSurfaceFamilyDescriptorExtractionGreen: true,
  currentBroadRequestedOutputReplayGridGreen: true,
  currentBroadRequestedOutputRestoreGridGreen: true,
  currentBroadRequestedOutputEditHistoryRestoreGridGreen: true,
  currentBroadRequestedOutputPartialRestoreGridGreen: true,
  currentSelectedRequestedOutputGeneratedRestoreGridGreen: true,
  currentSelectedRequestedOutputEditHistoryRestoreGridGreen: true,
  currentSelectedRequestedOutputPartialRestoreGridGreen: true,
  currentRepresentativeRequestedOutputRestoreGridGreen: true,
  currentRepresentativeRequestedOutputEditHistoryRestoreGridGreen: true,
  currentRepresentativeRequestedOutputPartialRestoreGridGreen: true,
  keepRepresentativeDefaultRestoreGridGreen: true,
  snapshotGridFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
  snapshotGridLineCountAtSelection: 315,
  requestedOutputRunnerFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts",
  requestedOutputRunnerFileLineCountAtSelection: 53,
  requestedOutputSurfaceDescriptorFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.ts",
  requestedOutputSurfaceDescriptorFileLineCountAtSelection: 242,
  requestedOutputSurfaceFamilyDescriptorBuilderFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-family-descriptor-builders.ts",
  requestedOutputSurfaceFamilyDescriptorBuilderFileLineCountAtSelection: 192,
  requestedOutputSurfaceRunnerLoopFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-runner-loop.ts",
  requestedOutputSurfaceRunnerLoopFileLineCountAtSelection: 325,
  requestedOutputVariantDriverFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts",
  requestedOutputVariantDriverFileLineCountAtSelection: 212,
  requestedOutputSurfaceMessageBundleExtractionTargets: [
    "requested_output_surface_direct_message_bundle_factory",
    "requested_output_surface_replay_message_bundle_factory",
    "requested_output_surface_restore_message_bundle_factory",
    "requested_output_surface_wrapper_message_templates",
  ],
  targetedEngineTest: "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
  targetedWebTests: [
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
  ],
} as const;

const DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES = [
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    reason: "requested_output_surface_message_bundle_extraction_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    reason: "requested_output_surface_message_bundle_extraction_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "tuas_c11c_exact_import",
    reason: "requested_output_surface_message_bundle_extraction_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "broad_heavy_concrete_formula_family_widening",
    reason: "requested_output_surface_message_bundle_extraction_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "wall_selector_behavior_widening",
    reason: "requested_output_surface_message_bundle_extraction_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
] as const;

describe("post mixed floor/wall output-card snapshot requested-output surface family descriptor builder extraction next slice selection contract", () => {
  it("selects message bundle extraction before any runtime widening", () => {
    expect(
      POST_MIXED_FLOOR_WALL_OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_SURFACE_FAMILY_DESCRIPTOR_BUILDER_EXTRACTION_NEXT_SLICE_SELECTION,
    ).toEqual({
      sliceId:
        "post_mixed_floor_wall_output_card_snapshot_requested_output_surface_family_descriptor_builder_extraction_next_slice_selection_v1",
      selectedImplementationSlice:
        "mixed_floor_wall_output_card_snapshot_requested_output_surface_message_bundle_extraction_v1",
      selectedOutputSurface: "workbench_output_card_snapshot_requested_output_surface_message_bundle_harness",
      selectedRouteFamily: "mixed_floor_wall_route_matrix",
      selectionStatus: "selected_no_runtime_harness_hardening",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction:
        "mixed_floor_wall_output_card_snapshot_requested_output_surface_message_bundle_extraction_v1",
      followUpPlanningAction:
        "post_mixed_floor_wall_output_card_snapshot_requested_output_surface_message_bundle_extraction_next_slice_selection_v1",
    });
    expect(
      DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES.filter((candidate) => candidate.runtimeWideningEligible),
    ).toEqual([]);
  });

  it("keeps the next scope on message bundle extraction while preserving shared family builders", () => {
    expect(OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_SURFACE_MESSAGE_BUNDLE_SCOPE).toEqual({
      currentRequestedOutputSurfaceFamilyDescriptorExtractionGreen: true,
      currentBroadRequestedOutputReplayGridGreen: true,
      currentBroadRequestedOutputRestoreGridGreen: true,
      currentBroadRequestedOutputEditHistoryRestoreGridGreen: true,
      currentBroadRequestedOutputPartialRestoreGridGreen: true,
      currentSelectedRequestedOutputGeneratedRestoreGridGreen: true,
      currentSelectedRequestedOutputEditHistoryRestoreGridGreen: true,
      currentSelectedRequestedOutputPartialRestoreGridGreen: true,
      currentRepresentativeRequestedOutputRestoreGridGreen: true,
      currentRepresentativeRequestedOutputEditHistoryRestoreGridGreen: true,
      currentRepresentativeRequestedOutputPartialRestoreGridGreen: true,
      keepRepresentativeDefaultRestoreGridGreen: true,
      snapshotGridFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
      snapshotGridLineCountAtSelection: 315,
      requestedOutputRunnerFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts",
      requestedOutputRunnerFileLineCountAtSelection: 53,
      requestedOutputSurfaceDescriptorFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.ts",
      requestedOutputSurfaceDescriptorFileLineCountAtSelection: 242,
      requestedOutputSurfaceFamilyDescriptorBuilderFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-family-descriptor-builders.ts",
      requestedOutputSurfaceFamilyDescriptorBuilderFileLineCountAtSelection: 192,
      requestedOutputSurfaceRunnerLoopFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-runner-loop.ts",
      requestedOutputSurfaceRunnerLoopFileLineCountAtSelection: 325,
      requestedOutputVariantDriverFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts",
      requestedOutputVariantDriverFileLineCountAtSelection: 212,
      requestedOutputSurfaceMessageBundleExtractionTargets: [
        "requested_output_surface_direct_message_bundle_factory",
        "requested_output_surface_replay_message_bundle_factory",
        "requested_output_surface_restore_message_bundle_factory",
        "requested_output_surface_wrapper_message_templates",
      ],
      targetedEngineTest: "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
      targetedWebTests: [
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
      ],
    });
  });
});

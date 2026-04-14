import { describe, expect, it } from "vitest";

const POST_HEAVY_CONCRETE_FORMULA_HISTORY_NEXT_SLICE_SELECTION = {
  sliceId: "post_heavy_concrete_formula_history_next_slice_selection_v1",
  selectedImplementationSlice: "heavy_concrete_formula_field_provenance_surface_v1",
  selectedOutputSurface: "workbench_trace_and_report_formula_notes",
  selectedRouteFamily: "heavy_concrete_formula_floor_lane",
  selectionStatus: "implemented_runtime_metadata_only",
  numericRuntimeBehaviorChange: false,
  metadataBehaviorChange: true,
  nextPlanningAction: "post_formula_provenance_report_next_slice_selection_v1"
} as const;

const SELECTED_FORMULA_PROVENANCE_SCOPE = {
  fieldCarriedFormulaMetricBases: [
    "predictor_bare_massive_floor_iso12354_annexc_estimate",
    "predictor_heavy_floating_floor_iso12354_annexc_estimate"
  ],
  guardedSurfaces: [
    "impactPredictorStatus.implementedFormulaEstimate",
    "impactSupport.formulaNotes",
    "dynamicImpactTrace.selectedLabel",
    "workbenchImpactTracePanel",
    "workbenchMarkdownReport"
  ],
  webGuard: "apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts",
  engineGuard: "packages/engine/src/calculate-assembly.test.ts"
} as const;

const REJECTED_IMMEDIATE_RUNTIME_WIDENING = [
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    reason: "still_no_bare_carrier_impact_source",
    runtimeWideningEligible: false
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    reason: "composite_dry_screed_surface_model_still_missing",
    runtimeWideningEligible: false
  },
  {
    id: "tuas_c11c_exact_import",
    reason: "weak_weighted_tuple_still_unexplained_by_available_source_fields",
    runtimeWideningEligible: false
  },
  {
    id: "broad_heavy_concrete_formula_family_widening",
    reason: "provenance_surface_guard_does_not_add_new_formula_scope",
    runtimeWideningEligible: false
  },
  {
    id: "wall_selector_behavior_widening",
    reason: "no_new_classified_wall_selector_solver_bug_since_trace_checkpoint",
    runtimeWideningEligible: false
  }
] as const;

describe("post-heavy concrete formula history next slice selection contract", () => {
  it("selects formula provenance surfaces before any new runtime widening", () => {
    expect(POST_HEAVY_CONCRETE_FORMULA_HISTORY_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_heavy_concrete_formula_history_next_slice_selection_v1",
      selectedImplementationSlice: "heavy_concrete_formula_field_provenance_surface_v1",
      selectedOutputSurface: "workbench_trace_and_report_formula_notes",
      selectedRouteFamily: "heavy_concrete_formula_floor_lane",
      selectionStatus: "implemented_runtime_metadata_only",
      numericRuntimeBehaviorChange: false,
      metadataBehaviorChange: true,
      nextPlanningAction: "post_formula_provenance_report_next_slice_selection_v1"
    });
    expect(REJECTED_IMMEDIATE_RUNTIME_WIDENING.filter((candidate) => candidate.runtimeWideningEligible)).toEqual([]);
  });

  it("keeps the selected guard on formula provenance rather than new source-row coverage", () => {
    expect(SELECTED_FORMULA_PROVENANCE_SCOPE).toEqual({
      fieldCarriedFormulaMetricBases: [
        "predictor_bare_massive_floor_iso12354_annexc_estimate",
        "predictor_heavy_floating_floor_iso12354_annexc_estimate"
      ],
      guardedSurfaces: [
        "impactPredictorStatus.implementedFormulaEstimate",
        "impactSupport.formulaNotes",
        "dynamicImpactTrace.selectedLabel",
        "workbenchImpactTracePanel",
        "workbenchMarkdownReport"
      ],
      webGuard: "apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts",
      engineGuard: "packages/engine/src/calculate-assembly.test.ts"
    });
  });
});

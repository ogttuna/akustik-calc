import { describe, expect, it } from "vitest";

const POST_FORMULA_PROVENANCE_REPORT_NEXT_SLICE_SELECTION = {
  sliceId: "post_formula_provenance_report_next_slice_selection_v1",
  selectedImplementationSlice: "formula_provenance_method_evidence_dossier_v1",
  selectedOutputSurface: "method_dossier_and_evidence_packet",
  selectedRouteFamily: "heavy_concrete_formula_floor_lane",
  selectionStatus: "implemented_no_numeric_runtime",
  numericRuntimeBehaviorChange: false,
  uiDocumentationBehaviorChange: true,
  nextPlanningAction: "post_method_evidence_formula_provenance_next_slice_selection_v1"
} as const;

const SELECTED_METHOD_EVIDENCE_FORMULA_SCOPE = {
  carriedFormulaRoute: "heavy_floating_floor_formula_with_standardized_field_volume",
  guardedInputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
  guardedSurfaces: ["simpleWorkbenchMethodDossier.traceGroups", "simpleWorkbenchEvidencePacket.citations"],
  webGuards: [
    "apps/web/features/workbench/simple-workbench-method-dossier.test.ts",
    "apps/web/features/workbench/simple-workbench-evidence.test.ts"
  ],
  numericEngineRuntimeGuardedElsewhere: "packages/engine/src/calculate-assembly.test.ts"
} as const;

const DEFERRED_RUNTIME_WIDENING_AFTER_REPORT_PROVENANCE = [
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
    reason: "method_evidence_surface_guard_does_not_add_new_formula_scope",
    runtimeWideningEligible: false
  },
  {
    id: "wall_selector_behavior_widening",
    reason: "no_new_classified_wall_selector_solver_bug_since_trace_checkpoint",
    runtimeWideningEligible: false
  }
] as const;

describe("post-formula provenance report next slice selection contract", () => {
  it("selects method and evidence dossier provenance before runtime widening", () => {
    expect(POST_FORMULA_PROVENANCE_REPORT_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_formula_provenance_report_next_slice_selection_v1",
      selectedImplementationSlice: "formula_provenance_method_evidence_dossier_v1",
      selectedOutputSurface: "method_dossier_and_evidence_packet",
      selectedRouteFamily: "heavy_concrete_formula_floor_lane",
      selectionStatus: "implemented_no_numeric_runtime",
      numericRuntimeBehaviorChange: false,
      uiDocumentationBehaviorChange: true,
      nextPlanningAction: "post_method_evidence_formula_provenance_next_slice_selection_v1"
    });
    expect(DEFERRED_RUNTIME_WIDENING_AFTER_REPORT_PROVENANCE.filter((candidate) => candidate.runtimeWideningEligible)).toEqual([]);
  });

  it("keeps the selected scope on user-facing provenance surfaces", () => {
    expect(SELECTED_METHOD_EVIDENCE_FORMULA_SCOPE).toEqual({
      carriedFormulaRoute: "heavy_floating_floor_formula_with_standardized_field_volume",
      guardedInputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
      guardedSurfaces: ["simpleWorkbenchMethodDossier.traceGroups", "simpleWorkbenchEvidencePacket.citations"],
      webGuards: [
        "apps/web/features/workbench/simple-workbench-method-dossier.test.ts",
        "apps/web/features/workbench/simple-workbench-evidence.test.ts"
      ],
      numericEngineRuntimeGuardedElsewhere: "packages/engine/src/calculate-assembly.test.ts"
    });
  });
});

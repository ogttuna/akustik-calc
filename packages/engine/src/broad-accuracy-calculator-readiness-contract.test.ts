import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTION_STATUS,
  buildBroadAccuracyCalculatorReadinessContract
} from "./broad-accuracy-calculator-readiness";

describe("broad accuracy calculator readiness refocus", () => {
  it("separates measured/source inventory from the actual broad-accuracy finish line", () => {
    const contract = buildBroadAccuracyCalculatorReadinessContract();

    expect(contract.canClaimBroadAccuracyReady).toBe(false);
    expect(contract.sourceInventoryIsProductInputNotProductGoal).toBe(true);
    expect(contract.controlledEnvelopeRows).toBe(71);
    expect(contract.floorSourceInventory).toMatchObject({
      boundRows: 23,
      exactRows: 173,
      exactRowsBySourceType: {
        open_measured_dataset: 38,
        official_manufacturer_system_table: 116,
        official_open_component_library: 19
      }
    });
    expect(contract.wallSourceInventory.verifiedAirborneCatalog).toMatchObject({
      approximateFieldCompanionEntries: 13,
      fieldEntries: 13,
      labEntries: 43,
      metricCounts: {
        "DnT,A,k": 13,
        Rw: 43
      },
      verifiedEntries: 56
    });
  });

  it("makes residual coverage the next calculator-grade bottleneck, not another source-library count", () => {
    const contract = buildBroadAccuracyCalculatorReadinessContract();

    expect(contract.resolverOrder).toEqual([
      "exact_measured_same_topology_metric_basis",
      "nearby_measured_similarity_anchor",
      "calibrated_family_solver",
      "source_absent_family_solver_with_budget",
      "needs_input_or_unsupported_boundary"
    ]);
    expect(contract.measuredResidualCoverage).toMatchObject({
      steelDeltaLwResidualRows: 0,
      steelLnWResidualRows: 3,
      steelMaxAbsLnWResidualDb: 0.6,
      steelMeanAbsLnWResidualDb: 0.4,
      tripleLeafCalibrationRows: 2,
      tripleLeafHoldoutRows: 1,
      tripleLeafMeanAbsHoldoutDb: 0,
      wallTimberExactImportRows: 6,
      wallTimberLinkedHoldoutRows: 2
    });
    expect(contract.currentBlockers).toEqual([
      "global_reference_benchmark_not_yet_driving_every_solver_family",
      "nearby_source_similarity_anchor_is_not_first_class_across_wall_and_floor_routes",
      "formula_corridors_are_not_backtested_across_the_full_measured_floor_wall_corpus",
      "company_internal_controlled_envelope_is_a_guardrail_not_the_broad_accuracy_finish_line"
    ]);
    expect(contract.selectedNextAction).toBe(BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_ACTION);
    expect(contract.selectedNextFile).toBe(BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_FILE);
    expect(contract.selectionStatus).toBe(BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTION_STATUS);
  });
});

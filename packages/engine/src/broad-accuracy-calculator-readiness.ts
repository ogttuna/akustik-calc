import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";

import { getVerifiedAirborneCatalogStats, type VerifiedAirborneCatalogStats } from "./airborne-verified-catalog";
import { buildCompanyInternalCalculationGradeMainlineMatrixV6Contract } from "./company-internal-calculation-grade-mainline-matrix";
import { buildGateAHSteelFloorFormulaAccuracyBenchmarkContract } from "./steel-floor-formula-accuracy-benchmark";
import {
  WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS,
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS
} from "./wall-timber-lightweight-source-corpus";
import { evaluateWallTripleLeafCalibrationFit } from "./wall-triple-leaf-calibration-fit";

export const BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTION_STATUS =
  "broad_accuracy_calculator_refocus_landed_selected_reference_benchmark_and_similarity_solver";

export const BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_ACTION =
  "broad_accuracy_reference_benchmark_expansion_and_similarity_solver_plan";

export const BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-reference-benchmark-expansion-contract.test.ts";

export type BroadAccuracyResolverStage =
  | "exact_measured_same_topology_metric_basis"
  | "nearby_measured_similarity_anchor"
  | "calibrated_family_solver"
  | "source_absent_family_solver_with_budget"
  | "needs_input_or_unsupported_boundary";

export type BroadAccuracyCalculatorReadinessContract = {
  canClaimBroadAccuracyReady: false;
  controlledEnvelopeRows: number;
  currentBlockers: readonly string[];
  floorSourceInventory: {
    boundRows: number;
    exactRows: number;
    exactRowsBySourceType: Record<string, number>;
  };
  measuredResidualCoverage: {
    steelDeltaLwResidualRows: number;
    steelLnWResidualRows: number;
    steelMaxAbsLnWResidualDb: number;
    steelMeanAbsLnWResidualDb: number;
    tripleLeafCalibrationRows: number;
    tripleLeafHoldoutRows: number;
    tripleLeafMeanAbsHoldoutDb: number | null;
    wallTimberExactImportRows: number;
    wallTimberLinkedHoldoutRows: number;
  };
  resolverOrder: readonly BroadAccuracyResolverStage[];
  selectedNextAction: typeof BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_FILE;
  selectionStatus: typeof BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTION_STATUS;
  sourceInventoryIsProductInputNotProductGoal: true;
  wallSourceInventory: {
    verifiedAirborneCatalog: VerifiedAirborneCatalogStats;
    wallTimberLightweightCorpusRows: number;
  };
};

function countBySourceType(): Record<string, number> {
  return EXACT_FLOOR_SYSTEMS.reduce<Record<string, number>>((counts, system) => {
    counts[system.sourceType] = (counts[system.sourceType] ?? 0) + 1;
    return counts;
  }, {});
}

export function buildBroadAccuracyCalculatorReadinessContract(): BroadAccuracyCalculatorReadinessContract {
  const companyInternalMatrix = buildCompanyInternalCalculationGradeMainlineMatrixV6Contract();
  const steelAccuracy = buildGateAHSteelFloorFormulaAccuracyBenchmarkContract();
  const tripleLeafAccuracy = evaluateWallTripleLeafCalibrationFit();
  const wallTimberLinkedHoldoutRows = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
    (entry) => entry.kind === "linked_holdout"
  ).length;

  return {
    canClaimBroadAccuracyReady: false,
    controlledEnvelopeRows: companyInternalMatrix.matrixRows,
    currentBlockers: [
      "global_reference_benchmark_not_yet_driving_every_solver_family",
      "nearby_source_similarity_anchor_is_not_first_class_across_wall_and_floor_routes",
      "formula_corridors_are_not_backtested_across_the_full_measured_floor_wall_corpus",
      "company_internal_controlled_envelope_is_a_guardrail_not_the_broad_accuracy_finish_line"
    ],
    floorSourceInventory: {
      boundRows: BOUND_FLOOR_SYSTEMS.length,
      exactRows: EXACT_FLOOR_SYSTEMS.length,
      exactRowsBySourceType: countBySourceType()
    },
    measuredResidualCoverage: {
      steelDeltaLwResidualRows: steelAccuracy.deltaLwResidualCaseCount,
      steelLnWResidualRows: steelAccuracy.lnWResidualCaseCount,
      steelMaxAbsLnWResidualDb: steelAccuracy.maxAbsoluteLnWResidualDb,
      steelMeanAbsLnWResidualDb: steelAccuracy.meanAbsoluteLnWResidualDb,
      tripleLeafCalibrationRows: tripleLeafAccuracy.calibrationAccuracy.rowCount,
      tripleLeafHoldoutRows: tripleLeafAccuracy.holdoutAccuracy.rowCount,
      tripleLeafMeanAbsHoldoutDb: tripleLeafAccuracy.holdoutAccuracy.meanAbsErrorDb,
      wallTimberExactImportRows: WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.length,
      wallTimberLinkedHoldoutRows
    },
    resolverOrder: [
      "exact_measured_same_topology_metric_basis",
      "nearby_measured_similarity_anchor",
      "calibrated_family_solver",
      "source_absent_family_solver_with_budget",
      "needs_input_or_unsupported_boundary"
    ],
    selectedNextAction: BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_FILE,
    selectionStatus: BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTION_STATUS,
    sourceInventoryIsProductInputNotProductGoal: true,
    wallSourceInventory: {
      verifiedAirborneCatalog: getVerifiedAirborneCatalogStats(),
      wallTimberLightweightCorpusRows: WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.length
    }
  };
}

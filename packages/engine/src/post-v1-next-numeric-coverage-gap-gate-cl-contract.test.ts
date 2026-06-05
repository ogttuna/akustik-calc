import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT
} from "./company-internal-opening-leak-building-runtime-corridor-contract";
import {
  POST_V1_GATE_CJ_BUILDING_VALUE_PINS,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION
} from "./post-v1-wall-common-auto-topology-expansion-gate-cj";
import {
  POST_V1_GATE_CK_BUILDING_TARGET_OUTPUTS,
  POST_V1_GATE_CK_FIELD_TARGET_OUTPUTS,
  POST_V1_GATE_CK_VALUE_PINS,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_FILE,
  POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTION_STATUS
} from "./post-v1-opening-leak-composite-wall-adapters-gate-ck";
import {
  POST_V1_GATE_CL_NO_RUNTIME_COUNTERS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTION_STATUS,
  evaluatePostV1GateCLResidualLedgers,
  rankPostV1GateCLNumericCoverageCandidates,
  summarizePostV1GateCLNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-cl";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const HOST_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const satisfies readonly LayerInput[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate CL", () => {
  it("lands a no-runtime residual accuracy/holdout gate after Gate CK and selects Gate CM", () => {
    const summary = summarizePostV1GateCLNumericCoverageGap();

    expect(POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTION_STATUS).toBe(
      "post_v1_opening_leak_composite_wall_adapters_gate_ck_landed_runtime_selected_next_numeric_coverage_gap_gate_cl"
    );
    expect(POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_LANDED_GATE
    );
    expect(POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
    );
    expect(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION).toBe(
      POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE
    );

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_CL_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      previousGateCK: {
        landedGate: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE,
        selectedNextAction: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTION_STATUS
      },
      selectedCandidateId: "required_physical_input_surface_parity_after_residual_ledgers",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTION_STATUS
    });
  });

  it("creates residual ledgers without tightening budgets or promoting near-source rows", () => {
    const ledgers = evaluatePostV1GateCLResidualLedgers();

    expect(ledgers).toHaveLength(POST_V1_GATE_CL_NO_RUNTIME_COUNTERS.residualLedgers);
    expect(ledgers.filter((ledger) => ledger.budgetDecision === "hold_wide_budget")).toHaveLength(
      POST_V1_GATE_CL_NO_RUNTIME_COUNTERS.budgetsHeldWide
    );
    expect(ledgers.filter((ledger) => ledger.budgetTighteningAdmitted)).toHaveLength(0);
    expect(ledgers.filter((ledger) => ledger.runtimePromotionAdmitted)).toHaveLength(0);
    expect(ledgers.filter((ledger) => ledger.sourceProximityRowsPresent && !ledger.runtimePromotionAdmitted).length).toBeGreaterThanOrEqual(2);

    for (const ledger of ledgers) {
      const overlap = ledger.calibrationRowIds.filter((rowId) => ledger.holdoutRowIds.includes(rowId));

      expect(overlap, ledger.id).toEqual([]);
      expect(ledger.noRuntimeValueMovement, ledger.id).toBe(true);
      expect(ledger.blockers.length, ledger.id).toBeGreaterThan(0);
      expect(ledger.metricBasis, ledger.id).not.toBe("mixed_or_unspecified");
    }

    expect(ledgers.map((ledger) => ledger.id)).toEqual([
      "wall.common_flat_double_leaf.building_prediction_gate_cj",
      "wall.opening_leak_composite.field_building_gate_ck",
      "floor.open_box_timber.raw_bare_lab_impact",
      "floor.open_web_steel.raw_bare_lab_impact",
      "floor.heavy_floating_upper_treatment.field_companion_gate_ch"
    ]);
  });

  it("ranks residual and input-surface candidates without selecting source crawling or budget tightening", () => {
    const candidates = rankPostV1GateCLNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(candidates.map((candidate) => candidate.candidateOrder)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(selected).toMatchObject({
      id: "required_physical_input_surface_parity_after_residual_ledgers",
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE,
      sliceKind: "input_surface_unlock",
      sourceRowsRequiredForSelection: false
    });
    expect(candidates.filter((candidate) => candidate.sliceKind === "blocked_non_goal").map((candidate) => candidate.id)).toEqual([
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface"
    ]);
    expect(candidates.find((candidate) => candidate.id === "source_absent_budget_tightening_without_holdouts")).toMatchObject({
      selected: false,
      sliceKind: "blocked_wrong_number_risk",
      sourceRowsRequiredForSelection: true
    });
  });

  it("keeps Gate CK opening/leak runtime values frozen while Gate CL moves no values", () => {
    const field = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
        openingLeakFieldBuildingAdapterBoundary: undefined
      },
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CK_FIELD_TARGET_OUTPUTS
    });
    const building = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
        openingLeakFieldBuildingAdapterBoundary: undefined
      },
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CK_BUILDING_TARGET_OUTPUTS
    });

    expect(field.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w"]);
    expect(field.metrics).toMatchObject({
      estimatedDnTwDb: POST_V1_GATE_CK_VALUE_PINS.field.metrics["DnT,w"],
      estimatedDnWDb: POST_V1_GATE_CK_VALUE_PINS.field.metrics["Dn,w"],
      estimatedRwPrimeDb: POST_V1_GATE_CK_VALUE_PINS.field.metrics["R'w"]
    });
    expect(building.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(building.metrics).toMatchObject({
      estimatedDnTwDb: POST_V1_GATE_CK_VALUE_PINS.building.metrics["DnT,w"],
      estimatedRwPrimeDb: POST_V1_GATE_CK_VALUE_PINS.building.metrics["R'w"]
    });
    expect(summarizePostV1GateCLNumericCoverageGap().frozenRuntimePins).toMatchObject({
      gateCJBuildingValuePins: POST_V1_GATE_CJ_BUILDING_VALUE_PINS,
      gateCKOpeningLeakValuePins: POST_V1_GATE_CK_VALUE_PINS
    });
  });

  it("keeps docs and current-gate runner aligned with Gate CL", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("residual");
      expect(contents, path).toContain("holdout");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts");
  });
});

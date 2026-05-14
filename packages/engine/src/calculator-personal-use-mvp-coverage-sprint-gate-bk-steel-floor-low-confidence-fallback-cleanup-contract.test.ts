import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildPersonalUseMvpCoverageSprintGateBKContract,
  buildPersonalUseMvpCoverageSprintGateBKScenarioPack,
  GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT,
  GATE_BK_STEEL_FLOOR_BASIS_REGISTRY,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTION_STATUS,
  type PersonalUseMvpCoverageSprintGateBKRuntimeScenario
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bk";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bj";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BK_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts",
  "packages/engine/src/steel-floor-impact-formula-corridor.ts",
  "packages/engine/src/impact-estimate.ts",
  "packages/engine/src/impact-confidence.ts",
  "packages/engine/src/impact-predictor-status.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/impact-support.ts",
  "packages/shared/src/domain/impact.ts",
  "apps/web/features/workbench/steel-floor-formula-corridor-view.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_HANDOFF.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BK_STEEL_FLOOR_LOW_CONFIDENCE_FALLBACK_CLEANUP_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function scenario(id: string): PersonalUseMvpCoverageSprintGateBKRuntimeScenario {
  const found = buildPersonalUseMvpCoverageSprintGateBKScenarioPack().find((entry) => entry.id === id);

  if (!found) {
    throw new Error(`Missing Gate BK scenario ${id}`);
  }

  return found;
}

describe("Personal-Use MVP Coverage Sprint Gate BK steel-floor low-confidence fallback cleanup", () => {
  it("lands Gate BK and selects the steel suspended-ceiling input surface next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBKContract();

    expect(contract).toMatchObject({
      completeSteelSuspendedCeilingLowConfidenceRemoved: true,
      existingGateADRuntimeFrozen: true,
      generatedFallbackStillRequiresInputSurface: true,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE,
      noAstmOrFieldAliasAdded: true,
      previousGateBJ: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_FILE,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTION_STATUS
      },
      runtimeValueRetune: false,
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bj_steel_floor_low_confidence_cleanup",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTION_STATUS,
      sourceRowsRequiredForSuspendedCeilingRuntime: false,
      tolerancePins: {
        existingGateADDeltaLw: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
        existingGateADLnW: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
        suspendedCeilingLnW: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB
      }
    });

    expect(GATE_BK_STEEL_FLOOR_BASIS_REGISTRY).toEqual({
      existingUpperLowerBasis: STEEL_FLOOR_FORMULA_BASIS,
      suspendedCeilingOnlyBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
    });

    for (const path of REQUIRED_GATE_BK_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("moves complete steel suspended-ceiling-only predictor input off the low-confidence fallback", () => {
    const row = scenario("gate_bk_complete_suspended_ceiling_steel_formula_corridor");
    const runtime = calculateImpactOnly([], {
      impactPredictorInput: GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw", "Rw", "Ctr", "IIC", "AIIC", "L'nT,50"]
    });

    expect(row).toMatchObject({
      basisId: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      confidenceLevel: "medium",
      floorSystemEstimateKind: null,
      lowConfidenceFallbackActive: false,
      missingPhysicalInputs: [],
      publicEntryPoint: "calculateImpactOnly",
      status: "ready_with_suspended_ceiling_formula",
      supportedTargetOutputs: ["Ln,w"],
      targetOutputs: ["Ln,w", "DeltaLw", "Rw", "Ctr", "IIC", "AIIC", "L'nT,50"],
      unsupportedTargetOutputs: ["DeltaLw", "Rw", "Ctr", "IIC", "AIIC", "L'nT,50"],
      valuePins: [{ metric: "Ln,w", value: 62.2 }]
    });
    expect(row.budgetPins).toEqual([
      {
        estimate: 62.2,
        metricId: "Ln,w",
        origin: "source_absent_formula_error_budget",
        termIds: [
          "source_owned_suspended_only_holdout_absence",
          "source_absent_bare_steel_reference_model",
          "support_form_transfer_efficiency",
          "lower_support_class_simplification",
          "carrier_spacing_precision"
        ],
        toleranceDb: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB,
        totalBudgetDb: 5.4
      }
    ]);
    expect(runtime.floorSystemEstimate).toBeNull();
    expect(runtime.impactPredictorStatus).toMatchObject({
      implementedFamilyEstimate: false,
      implementedFormulaEstimate: true,
      implementedLowConfidenceEstimate: false
    });
    expect(runtime.warnings.some((warning: string) => /low-confidence fallback/i.test(warning))).toBe(false);
  });

  it("keeps the existing Gate AD upper/lower steel formula corridor frozen", () => {
    const row = scenario("gate_bk_existing_gate_ad_upper_lower_formula_stays_frozen");

    expect(row).toMatchObject({
      basisId: STEEL_FLOOR_FORMULA_BASIS,
      confidenceLevel: "medium",
      lowConfidenceFallbackActive: false,
      missingPhysicalInputs: [],
      status: "ready_with_existing_upper_lower_formula",
      supportedTargetOutputs: ["Ln,w", "DeltaLw"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Ln,w", value: 55.6 },
        { metric: "DeltaLw", value: 22.4 }
      ]
    });
    expect(row.budgetPins.map((budget) => [budget.metricId, budget.toleranceDb])).toEqual([
      ["Ln,w", STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB],
      ["DeltaLw", STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB]
    ]);
  });

  it("keeps exact steel source rows above the new formula corridor", () => {
    const row = scenario("gate_bk_exact_source_precedence_stays_first");

    expect(row).toMatchObject({
      basisId: "official_floor_system_exact_match",
      confidenceLevel: "high",
      lowConfidenceFallbackActive: false,
      missingPhysicalInputs: [],
      status: "exact_source_precedence",
      supportedTargetOutputs: ["Ln,w", "Rw"],
      unsupportedTargetOutputs: ["DeltaLw", "Ctr", "IIC", "AIIC", "L'nT,50"],
      valuePins: [{ metric: "Ln,w", value: 58 }]
    });
  });

  it("keeps the generated steel fallback classified as incomplete rather than promoting mixed nearby rows", () => {
    const row = scenario("gate_bk_generated_steel_fallback_missing_owner_set");

    expect(row).toMatchObject({
      basisId: null,
      confidenceLevel: null,
      floorSystemEstimateKind: null,
      lowConfidenceFallbackActive: false,
      missingPhysicalInputs: ["steelCarrierSpacingMm", "lowerCeilingIsolationSupportForm"],
      publicEntryPoint: "calculateAssembly",
      status: "needs_input_before_cleanup",
      supportedTargetOutputs: ["Rw", "Ctr"],
      unsupportedTargetOutputs: ["Ln,w", "DeltaLw", "IIC", "AIIC", "L'nT,50"],
      valuePins: []
    });
    expect(
      row.warnings.some((warning) =>
        /needs steelCarrierSpacingMm, lowerCeilingIsolationSupportForm before calculating lab Ln,w/i.test(warning)
      )
    ).toBe(true);
    expect(row.warnings.some((warning) => /low-confidence fallback/i.test(warning))).toBe(false);
  });

  it("keeps docs and the current-gate runner pointed at Gate BK", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_FILE);
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts"
    );
  });
});

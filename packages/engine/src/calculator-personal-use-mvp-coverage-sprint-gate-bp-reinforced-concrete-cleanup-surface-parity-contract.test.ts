import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildPersonalUseMvpCoverageSprintGateBPContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS,
  summarizePersonalUseMvpCoverageSprintGateBP
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bp";
import {
  GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
  GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS,
  GATE_BO_REINFORCED_CONCRETE_VISIBLE_STACK,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bo";
import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
} from "./heavy-concrete-combined-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BP_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bp.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bp-reinforced-concrete-cleanup-surface-parity-contract.test.ts",
  "apps/web/features/workbench/reinforced-concrete-cleanup-surface-parity.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/heavy-concrete-combined-impact-corridor-view.ts",
  "apps/web/features/workbench/impact-trace-panel.tsx",
  "apps/web/features/workbench/compose-workbench-report.ts",
  "apps/web/app/api/estimate/route.ts",
  "apps/web/app/api/impact-only/route.ts",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BP_REINFORCED_CONCRETE_CLEANUP_SURFACE_PARITY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate BP reinforced-concrete cleanup surface parity", () => {
  it("lands Gate BP as no-retune surface parity and selects the matrix refresh next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBPContract();

    expect(contract).toMatchObject({
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE,
      previousGateBO: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_FILE,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTION_STATUS
      },
      runtimeMovedAtGateBP: false,
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bo_reinforced_concrete_cleanup_surface_parity",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS
    });

    expect(contract.completeFormulaSurfaces.map((surface) => surface.id)).toEqual([
      "output_cards",
      "route_card",
      "impact_trace",
      "diagnostics_dossier",
      "method_dossier",
      "saved_replay",
      "calculator_api_payload",
      "impact_only_api_payload",
      "markdown_report"
    ]);

    for (const path of REQUIRED_GATE_BP_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps needs-input surfaces budget-free with the precise Gate BO physical blockers", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBPContract();

    for (const surface of contract.explicitNeedsInputSurfaces) {
      expect(surface).toMatchObject({
        budgetFree: true,
        cardStatus: "needs_input",
        impactBasis: null,
        missingPhysicalInputs: ["loadBasisKgM2", "ceilingOrLowerAssembly"],
        origin: "needs_input",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
      });
    }

    for (const surface of contract.visibleDerivedNeedsInputSurfaces) {
      expect(surface).toMatchObject({
        budgetFree: true,
        cardStatus: "needs_input",
        impactBasis: null,
        missingPhysicalInputs: [
          "resilientLayerDynamicStiffnessMNm3",
          "loadBasisKgM2",
          "ceilingOrLowerAssembly"
        ],
        origin: "needs_input",
        supportedTargetOutputs: ["Rw", "Ctr"],
        unsupportedTargetOutputs: ["Ln,w", "DeltaLw"]
      });
    }

    const visibleRuntime = calculateAssembly(GATE_BO_REINFORCED_CONCRETE_VISIBLE_STACK, {
      targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
    });
    expect(visibleRuntime.impact).toBeNull();
    expect(visibleRuntime.warnings.join("\n")).toContain(
      "resilientLayerDynamicStiffnessMNm3, loadBasisKgM2, ceilingOrLowerAssembly"
    );
  });

  it("keeps formula surfaces on the Gate BO values, basis, and source-absent budgets", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBPContract();

    for (const surface of contract.completeFormulaSurfaces) {
      expect(surface).toEqual({
        basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
        budgetMetricIds: ["Ln,w", "DeltaLw"],
        cardStatus: "live",
        deltaLwDb: 13.7,
        deltaLwToleranceDb: 5.5,
        id: surface.id,
        lnWDb: 58.1,
        lnWToleranceDb: 6.5,
        origin: "formula_corridor",
        sourceAbsentNotMeasuredEvidence: true
      });
    }

    const runtime = calculateImpactOnly([], {
      impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
      targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
    });
    expect(runtime.impact).toMatchObject({
      DeltaLw: 13.7,
      LnW: 58.1,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      labOrField: "lab",
      metricBasis: {
        DeltaLw: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
        LnW: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
      }
    });
    expect(runtime.impact?.errorBudgets).toEqual([
      expect.objectContaining({
        metricId: "Ln,w",
        notMeasuredEvidence: true,
        origin: "source_absent_formula_error_budget",
        toleranceDb: 6.5
      }),
      expect.objectContaining({
        metricId: "DeltaLw",
        notMeasuredEvidence: true,
        origin: "source_absent_formula_error_budget",
        toleranceDb: 5.5
      })
    ]);
  });

  it("keeps exact rows, bare floors, upper-only formulas, and field/building outputs outside the Gate BP surface budget", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBPContract();

    expect(contract.boundaryGuards.map((guard) => guard.id)).toEqual([
      "exact_source_precedence",
      "bare_heavy_floor_existing_corridor",
      "upper_only_floating_floor_existing_corridor",
      "field_building_non_alias"
    ]);
    expect(contract.boundaryGuards.every((guard) => guard.budgetFree)).toBe(true);
    expect(contract.boundaryGuards.find((guard) => guard.id === "field_building_non_alias")?.reason).toContain(
      "L'n,w"
    );
  });

  it("keeps docs and the current-gate runner aligned with Gate BP closeout and Gate BQ selection", () => {
    const summary = summarizePersonalUseMvpCoverageSprintGateBP();

    expect(summary).toEqual({
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_LANDED_GATE,
      runtimeBasis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      runtimeDeltaLwDb: 13.7,
      runtimeLnWDb: 58.1,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS,
      surfaceParityLandedBeforeMatrixRefresh: true
    });

    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE);
      expect(content, path).toContain("Ln,w 58.1");
      expect(content, path).toContain("DeltaLw 13.7");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bp-reinforced-concrete-cleanup-surface-parity-contract.test.ts"
    );
    expect(runner).toContain("reinforced-concrete-cleanup-surface-parity.test.ts");
  });
});

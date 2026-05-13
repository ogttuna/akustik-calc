import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bd";
import {
  buildPersonalUseMvpCoverageSprintGateBESurfaceParityContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTION_STATUS,
  summarizePersonalUseMvpCoverageSprintGateBE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-be";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BE_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-be.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-be-floor-impact-source-absent-surface-parity-contract.test.ts",
  "apps/web/features/workbench/heavy-concrete-combined-impact-corridor-view.ts",
  "apps/web/features/workbench/heavy-concrete-combined-impact-surface-parity.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/simple-workbench-method-dossier.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
  "apps/web/features/workbench/impact-metric-basis-view.ts",
  "apps/web/app/api/estimate/route.ts",
  "apps/web/app/api/impact-only/route.ts",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate BE floor-impact source-absent surface parity", () => {
  it("lands Gate BE as no-runtime surface parity and selects Gate BF input surface", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBESurfaceParityContract();

    expect(contract).toMatchObject({
      landedGate: "gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan",
      previousGateBD: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS
      },
      runtimeMovedAtGateBE: false,
      selectedNextAction: "gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bf-floor-impact-source-absent-input-surface-contract.test.ts",
      selectionStatus:
        "gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_landed_selected_input_surface_gate_bf"
    });
    expect(contract.runtimeSnapshot).toEqual({
      basis: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
      budgetMetricIds: ["Ln,w", "DeltaLw"],
      deltaLwDb: 30.1,
      deltaLwToleranceDb: 5.5,
      id: "support_trace",
      lnWDb: 44.4,
      lnWToleranceDb: 6.5,
      sourceAbsentNotMeasuredEvidence: true
    });
    expect(contract.visibleSurfaceSnapshots.map((snapshot) => snapshot.id)).toEqual([
      "cards_and_posture",
      "impact_metric_basis_copy",
      "support_trace",
      "corridor_dossier",
      "method_dossier",
      "scenario_analysis",
      "saved_replay",
      "calculator_api_payload",
      "impact_only_api_payload",
      "markdown_report"
    ]);

    for (const snapshot of contract.visibleSurfaceSnapshots) {
      expect(snapshot).toMatchObject({
        basis: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
        budgetMetricIds: ["Ln,w", "DeltaLw"],
        deltaLwDb: 30.1,
        deltaLwToleranceDb: 5.5,
        lnWDb: 44.4,
        lnWToleranceDb: 6.5,
        sourceAbsentNotMeasuredEvidence: true
      });
    }

    for (const path of REQUIRED_GATE_BE_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps Gate BD runtime values and budgets frozen while surface parity lands", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 30.1,
      LnW: 44.4,
      basis: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
      errorBudgets: [
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
      ],
      metricBasis: {
        DeltaLw: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
        LnW: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS
      }
    });
    expect(result.dynamicImpactTrace?.selectedLabel).toBe("Heavy concrete combined upper/lower formula corridor");
    expect(result.impactSupport?.formulaNotes).toEqual(
      expect.arrayContaining([
        "Heavy-concrete combined upper/lower corridor is source-absent lab evidence, not a measured row.",
        "Heavy-concrete combined upper/lower error budgets are structured: Ln,w 44.4 dB [37.9..50.9] +/-6.5 dB; DeltaLw 30.1 dB [24.6..35.6] +/-5.5 dB; origin source_absent_formula_error_budget; not measured evidence.",
        "Corridor tolerance remains +/-6.5 dB for Ln,w and +/-5.5 dB for DeltaLw."
      ])
    );
  });

  it("keeps exact, existing formula, missing-input, ASTM, and field/building boundaries outside the promoted budget", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBESurfaceParityContract();

    expect(contract.boundaryGuards.map((guard) => guard.id)).toEqual([
      "exact_source_precedence",
      "heavy_floating_existing_corridor",
      "missing_lower_treatment",
      "missing_dynamic_stiffness",
      "astm_iic_non_alias",
      "field_building_non_alias"
    ]);
    expect(contract.boundaryGuards.every((guard) => guard.budgetFree)).toBe(true);
    expect(contract.boundaryGuards.find((guard) => guard.id === "exact_source_precedence")?.reason).toContain(
      "do not inherit Gate BD DeltaLw budgets"
    );
    expect(contract.boundaryGuards.find((guard) => guard.id === "astm_iic_non_alias")?.reason).toContain(
      "not an ASTM adapter"
    );
  });

  it("keeps docs and the current-gate runner aligned with Gate BE closeout and Gate BF selection", () => {
    const summary = summarizePersonalUseMvpCoverageSprintGateBE();

    expect(summary).toEqual({
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE,
      runtimeBasis: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
      runtimeDeltaLwDb: 30.1,
      runtimeLnWDb: 44.4,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTION_STATUS,
      surfaceParityLandedBeforeInputSurface: true
    });

    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_FILE);
      expect(content, path).toContain("Heavy concrete combined formula corridor");
      expect(content, path).toContain("Ln,w 44.4");
      expect(content, path).toContain("DeltaLw 30.1");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-be-floor-impact-source-absent-surface-parity-contract.test.ts"
    );
  });
});

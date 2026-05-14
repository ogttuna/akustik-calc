import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateBLContract,
  buildPersonalUseMvpCoverageSprintGateBLScenarioPack,
  gateBLCompleteSurfaceMatchesGateBKPredictorInput,
  GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
  GATE_BL_PARTIAL_STEEL_SUSPENDED_CEILING_SURFACE,
  GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS,
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTION_STATUS,
  type PersonalUseMvpCoverageSprintGateBLSurfaceScenario
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bl";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bk";
import {
  buildGateADSteelFloorImpactFormulaScenarioPack,
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";
import { buildSteelFloorFormulaPredictorInputFromSurface } from "./steel-floor-formula-input-surface";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BL_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl-steel-floor-suspended-ceiling-input-surface-contract.test.ts",
  "packages/engine/src/steel-floor-formula-input-surface.ts",
  "apps/web/features/workbench/steel-floor-formula-input-surface.ts",
  "apps/web/features/workbench/steel-floor-formula-input-surface.test.ts",
  "apps/web/features/workbench/steel-floor-formula-input-surface-acceptance.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_HANDOFF.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BL_STEEL_FLOOR_SUSPENDED_CEILING_INPUT_SURFACE_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const GATE_BL_HISTORICAL_SELECTION_DOCS = [
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function scenario(id: string): PersonalUseMvpCoverageSprintGateBLSurfaceScenario {
  const found = buildPersonalUseMvpCoverageSprintGateBLScenarioPack().find((entry) => entry.id === id);

  if (!found) {
    throw new Error(`Missing Gate BL scenario ${id}`);
  }

  return found;
}

describe("Personal-Use MVP Coverage Sprint Gate BL steel suspended-ceiling input surface", () => {
  it("lands Gate BL and selects post-input-surface revalidation next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBLContract();

    expect(contract).toMatchObject({
      completeSurfaceValueRetune: false,
      exactMeasuredRowsRemainPrecedence: true,
      fieldBuildingAndAstmAliasesRemainBlocked: true,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_LANDED_GATE,
      previousGateBK: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_FILE,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTION_STATUS
      },
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bk_steel_suspended_ceiling_input_surface",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTION_STATUS,
      suspendedCeilingFormulaBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      suspendedCeilingLnWToleranceDb: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB,
      upperLowerFormulaBasisFrozen: STEEL_FLOOR_FORMULA_BASIS
    });
    expect(contract.firstClassSurfaceFields).toEqual([
      "steelSupportForm",
      "steelCarrierDepthMm",
      "steelCarrierSpacingMm",
      "lowerCeilingIsolationSupportForm"
    ]);

    for (const path of REQUIRED_GATE_BL_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("feeds complete UI-derived suspended-ceiling steel fields into the Gate BK runtime without retuning", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });
    const result = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });
    const row = scenario("gate_bl_complete_ui_steel_suspended_ceiling_formula_corridor");

    expect(surface).toMatchObject({
      formulaBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor"
    });
    expect(gateBLCompleteSurfaceMatchesGateBKPredictorInput(surface.impactPredictorInput)).toBe(true);
    expect(result.impact).toMatchObject({
      basis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      LnW: 62.2,
      labOrField: "lab"
    });
    expect(result.impact?.DeltaLw).toBeUndefined();
    expect(result.impact?.errorBudgets?.[0]).toMatchObject({
      metricId: "Ln,w",
      origin: "source_absent_formula_error_budget",
      toleranceDb: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB
    });
    expect(result.floorSystemEstimate).toBeNull();
    expect(result.warnings.some((warning: string) => /low-confidence fallback active/i.test(warning))).toBe(false);
    expect(row).toMatchObject({
      formulaBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      impactSystemType: "suspended_ceiling_only",
      lowConfidenceFallbackActive: false,
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor",
      valuePins: [{ metric: "Ln,w", value: 62.2 }]
    });
  });

  it("turns partial steel suspended-ceiling surface input into precise missing-input posture instead of low-confidence final output", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      surface: GATE_BL_PARTIAL_STEEL_SUSPENDED_CEILING_SURFACE,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });
    const result = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });
    const row = scenario("gate_bl_partial_ui_steel_suspended_ceiling_needs_input");

    expect(surface).toMatchObject({
      formulaBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      impactPredictorInput: {
        impactSystemType: "suspended_ceiling_only"
      },
      missingPhysicalInputs: ["steelCarrierSpacingMm", "lowerCeilingIsolationSupportForm"],
      status: "needs_input"
    });
    expect(result.impact?.basis).not.toBe(STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS);
    expect(result.floorSystemEstimate?.kind).not.toBe("low_confidence");
    expect(result.supportedTargetOutputs).not.toContain("Ln,w");
    expect(row).toMatchObject({
      formulaBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      lowConfidenceFallbackActive: false,
      missingPhysicalInputs: ["steelCarrierSpacingMm", "lowerCeilingIsolationSupportForm"],
      status: "needs_input",
      valuePins: []
    });
  });

  it("keeps safe floor-row reorder stable and refuses unsafe duplicate steel carriers", () => {
    const safelyReorderedRows = [
      GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[0],
      GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[1],
      GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[3],
      GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[2],
      GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[4],
      GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[5]
    ];
    const duplicateCarrierRows = [
      ...GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 250 }
    ] as const;

    const reordered = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: safelyReorderedRows,
      surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });
    const duplicate = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: duplicateCarrierRows,
      surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });

    expect(reordered.status).toBe("ready_for_formula_corridor");
    expect(gateBLCompleteSurfaceMatchesGateBKPredictorInput(reordered.impactPredictorInput)).toBe(true);
    expect(duplicate).toMatchObject({
      impactPredictorInput: null,
      status: "unsafe_topology"
    });
  });

  it("keeps Gate AD upper/lower runtime frozen while Gate BL adds only the suspended-ceiling surface path", () => {
    const gateAD = buildGateADSteelFloorImpactFormulaScenarioPack()[0]?.contract.impact;

    expect(gateAD).toMatchObject({
      basis: STEEL_FLOOR_FORMULA_BASIS,
      DeltaLw: 22.4,
      LnW: 55.6,
      labOrField: "lab"
    });
  });

  it("keeps Gate BL historical docs and the current-gate runner carrying the Gate BL contract", () => {
    for (const path of GATE_BL_HISTORICAL_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_LANDED_GATE);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTION_STATUS);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_ACTION);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_FILE);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_LABEL);
    }
    expect(readRepoFile("AGENTS.md")).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_LANDED_GATE);
    expect(readRepoFile("AGENTS.md")).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_FILE);

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-bl-steel-floor-suspended-ceiling-input-surface-contract.test.ts"
    );
  });
});

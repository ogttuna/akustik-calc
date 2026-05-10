import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { ImpactErrorBudget, RequestedOutputId } from "@dynecho/shared";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  GATE_B_CLT_LAYERS,
  GATE_B_TIMBER_JOIST_LAYERS,
  buildGateBTimberCltDeltaLwScenarioPack,
  type GateBTimberCltDeltaLwScenarioId
} from "./timber-clt-floor-impact-delta-lw-input-contract";
import {
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_E = {
  apiShapeChange: false,
  landedGate: "gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan",
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan",
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan",
  selectedNextFile:
    "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-f-timber-clt-floor-impact-delta-lw-input-surface-contract.test.ts",
  selectionStatus:
    "gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_landed_selected_input_surface_gate_f",
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchVisibleBehaviorChange: true
} as const;

const REQUIRED_GATE_E_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts",
  "apps/web/features/workbench/timber-clt-delta-lw-corridor-view.ts",
  "apps/web/features/workbench/timber-clt-delta-lw-surface-parity.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/impact-metric-basis-view.ts",
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_E_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_D_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_E_HANDOFF.md"
] as const;

function readRepoFile(path: string): Promise<string> {
  return readFile(join(REPO_ROOT, path), "utf8");
}

function contractById(id: GateBTimberCltDeltaLwScenarioId) {
  const entry = buildGateBTimberCltDeltaLwScenarioPack().find((scenario) => scenario.id === id);

  if (!entry) {
    throw new Error(`Missing Gate B scenario ${id}`);
  }

  return entry.contract;
}

function layersFor(id: GateBTimberCltDeltaLwScenarioId) {
  return id.includes("clt") || id === "gate_b_missing_topping_mass_needs_input"
    ? GATE_B_CLT_LAYERS
    : GATE_B_TIMBER_JOIST_LAYERS;
}

function runScenario(
  id: GateBTimberCltDeltaLwScenarioId,
  targetOutputs: readonly RequestedOutputId[] = ["Ln,w", "DeltaLw"]
) {
  const contract = contractById(id);

  if (!contract.normalizedPredictorInput) {
    throw new Error(`Gate B scenario ${id} has no predictor input`);
  }

  return calculateImpactOnly(layersFor(id), {
    impactPredictorInput: contract.normalizedPredictorInput,
    targetOutputs
  });
}

describe("Personal-Use MVP Coverage Sprint Gate E timber/CLT DeltaLw surface parity", () => {
  it("lands surface parity without changing Gate D runtime values and selects Gate F input surface work", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_E).toEqual({
      apiShapeChange: false,
      landedGate: "gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan",
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-f-timber-clt-floor-impact-delta-lw-input-surface-contract.test.ts",
      selectionStatus:
        "gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_landed_selected_input_surface_gate_f",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchVisibleBehaviorChange: true
    });

    for (const path of REQUIRED_GATE_E_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps dynamic trace and support notes honest for the timber and CLT formula companion", () => {
    const timber = runScenario("gate_b_timber_joist_complete_ready_for_formula_corridor");
    const clt = runScenario("gate_b_clt_complete_ready_for_formula_corridor");

    expect(timber.impact).toMatchObject({
      DeltaLw: 25.2,
      LnW: 51,
      basis: "official_floor_system_exact_match",
      metricBasis: {
        DeltaLw: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
      }
    });
    expect(clt.impact).toMatchObject({
      DeltaLw: 22.6,
      LnW: 50,
      basis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      metricBasis: {
        DeltaLw: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
      }
    });

    for (const result of [timber, clt]) {
      expect(result.dynamicImpactTrace?.availableMetricLabels).toEqual(expect.arrayContaining(["Ln,w", "DeltaLw"]));
      expect(result.dynamicImpactTrace?.detectedSupportFamily).toMatch(/timber|clt/);
      expect(result.impactPredictorStatus).toMatchObject({
        implementedFormulaEstimate: true,
        inputMode: "explicit_predictor_input"
      });
      expect(result.impactSupport?.notes).toContain(
        "Timber/CLT DeltaLw formula corridor is active; exact or published Ln,w stays on its own metric basis."
      );
      expect(result.impactSupport?.formulaNotes).toEqual(expect.arrayContaining([
        "Timber/CLT DeltaLw uses 13 log10(m'load) - 14.2 log10(s') + 20.8 plus structural-family and lower-assembly coupling corrections.",
        "Timber/CLT DeltaLw corridor is source-absent lab evidence, not a measured row.",
        `Corridor tolerance remains +/-${TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB} dB for DeltaLw.`
      ]));
      expect((result.impactSupport?.formulaNotes ?? []).some((note: string) =>
        note.includes("origin source_absent_formula_error_budget; not measured evidence")
      )).toBe(true);
    }
  });

  it("keeps the source-absent DeltaLw budget attached only to promoted timber/CLT metrics", () => {
    const promoted = runScenario("gate_b_timber_joist_complete_ready_for_formula_corridor");
    const budget = promoted.impact?.errorBudgets?.find((item: ImpactErrorBudget) => item.metricId === "DeltaLw");

    expect(budget).toMatchObject({
      estimate: 25.2,
      max: 32.7,
      metricId: "DeltaLw",
      min: 17.7,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: 7.5,
      totalBudgetDb: 7.5
    });

    const negativeCases: GateBTimberCltDeltaLwScenarioId[] = [
      "gate_b_missing_dynamic_stiffness_needs_input",
      "gate_b_missing_load_basis_needs_input",
      "gate_b_missing_topping_mass_needs_input",
      "gate_b_missing_lower_isolation_needs_input",
      "gate_b_wrong_family_steel_not_timber_clt"
    ];

    for (const id of negativeCases) {
      const result = runScenario(id);
      expect(result.impact?.DeltaLw, id).toBeUndefined();
      expect(result.impact?.metricBasis?.DeltaLw, id).toBeUndefined();
      expect(result.impact?.errorBudgets?.some((item: ImpactErrorBudget) => item.metricId === "DeltaLw") ?? false, id).toBe(false);
    }

    const field = runScenario("gate_b_field_context_non_alias_blocked", ["L'n,w", "L'nT,w"]);
    const astm = runScenario("gate_b_astm_iic_aiic_boundary_unsupported", ["IIC", "AIIC"]);
    const lnWOnly = runScenario("gate_b_timber_joist_complete_ready_for_formula_corridor", ["Ln,w"]);

    expect(field.impact?.DeltaLw).toBeUndefined();
    expect(field.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(astm.impact?.DeltaLw).toBeUndefined();
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(lnWOnly.impact?.DeltaLw).toBeUndefined();
    expect(lnWOnly.supportedTargetOutputs).toEqual(["Ln,w"]);
  });

  it("keeps docs and the current-gate runner aligned with Gate E and next Gate F", async () => {
    const docs = await Promise.all(CURRENT_SELECTION_DOCS.map((path) => readRepoFile(path)));
    const runner = await readRepoFile("tools/dev/run-calculator-current-gate.ts");

    for (const content of docs) {
      expect(content).toContain(
        "gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan"
      );
      expect(content).toContain(
        "calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts"
      );
      expect(content).toContain(
        "gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan"
      );
    }

    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts"
    );
    expect(runner).toContain("features/workbench/timber-clt-delta-lw-surface-parity.test.ts");
  });
});

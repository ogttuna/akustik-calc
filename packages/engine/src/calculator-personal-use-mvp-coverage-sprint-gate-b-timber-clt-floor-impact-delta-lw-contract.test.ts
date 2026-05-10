import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTION_STATUS,
  buildGateBTimberCltDeltaLwInputContract,
  buildGateBTimberCltDeltaLwScenarioPack
} from "./timber-clt-floor-impact-delta-lw-input-contract";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_B = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_a_personal_use_mvp_coverage_matrix_plan",
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_B_SURFACES = [
  "packages/engine/src/timber-clt-floor-impact-delta-lw-input-contract.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts",
  "packages/engine/src/calculate-impact-only.ts",
  "packages/engine/src/impact-predictor-input.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function contractById(id: string) {
  const entry = buildGateBTimberCltDeltaLwScenarioPack().find((scenario) => scenario.id === id);

  if (!entry) {
    throw new Error(`Missing Gate B scenario ${id}`);
  }

  return entry.contract;
}

describe("Personal-Use MVP Coverage Sprint Gate B timber/CLT floor-impact DeltaLw contract", () => {
  it("lands the timber/CLT DeltaLw input contract without runtime movement and selects Gate C", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_B).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_a_personal_use_mvp_coverage_matrix_plan",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts",
      selectionStatus:
        "gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_landed_no_runtime_selected_formula_corridor_gate_c",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_B_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ships complete timber joist and CLT formula-readiness positives while current runtime keeps DeltaLw unsupported", () => {
    const timber = contractById("gate_b_timber_joist_complete_ready_for_formula_corridor");
    const clt = contractById("gate_b_clt_complete_ready_for_formula_corridor");

    expect(timber).toMatchObject({
      deltaLwInventedFromIicOrAiic: false,
      deltaLwInventedFromLnW: false,
      formulaCorridorReady: true,
      inputCompleteness: {
        missingPhysicalInputs: [],
        requiredFields: [
          "baseSlabOrFloor",
          "toppingOrFloatingLayer",
          "resilientLayerDynamicStiffnessMNm3",
          "loadBasisKgM2",
          "ceilingOrLowerAssembly"
        ],
        status: "complete"
      },
      missingPhysicalInputs: [],
      runtimePromotionAllowedInGateB: false,
      runtimeValueMovement: false,
      status: "ready_for_formula_corridor_gate"
    });
    expect(timber.formulaLanes).toContainEqual(
      expect.objectContaining({
        laneId: "timber_joist_dry_floating_lower_ceiling_delta_lw",
        status: "ready_for_formula_corridor_gate"
      })
    );
    expect(timber.currentRuntimeSnapshot).toMatchObject({
      basisId: "official_floor_system_exact_match",
      deltaLwDb: null,
      lnWDb: 51,
      supportedTargetOutputs: ["Ln,w"],
      unsupportedTargetOutputs: ["DeltaLw"]
    });

    expect(clt).toMatchObject({
      formulaCorridorReady: true,
      missingPhysicalInputs: [],
      normalizedPredictorInput: {
        structuralSupportType: "mass_timber_clt"
      },
      status: "ready_for_formula_corridor_gate"
    });
    expect(clt.formulaLanes).toContainEqual(
      expect.objectContaining({
        laneId: "mass_timber_clt_dry_floating_delta_lw",
        status: "ready_for_formula_corridor_gate"
      })
    );
    expect(clt.currentRuntimeSnapshot).toMatchObject({
      basisId: "predictor_mass_timber_clt_dataholz_dry_estimate",
      deltaLwDb: null,
      lnWDb: 50,
      supportedTargetOutputs: ["Ln,w"],
      unsupportedTargetOutputs: ["DeltaLw"]
    });
  });

  it("names exact missing physical fields for dynamic stiffness, load, topping mass, and lower isolation", () => {
    const scenarioPack = buildGateBTimberCltDeltaLwScenarioPack();

    expect(scenarioPack.map((entry) => ({
      id: entry.id,
      missing: entry.contract.missingPhysicalInputs,
      status: entry.contract.status
    }))).toEqual([
      {
        id: "gate_b_timber_joist_complete_ready_for_formula_corridor",
        missing: [],
        status: "ready_for_formula_corridor_gate"
      },
      {
        id: "gate_b_clt_complete_ready_for_formula_corridor",
        missing: [],
        status: "ready_for_formula_corridor_gate"
      },
      {
        id: "gate_b_missing_dynamic_stiffness_needs_input",
        missing: ["resilientLayerDynamicStiffnessMNm3"],
        status: "needs_input"
      },
      {
        id: "gate_b_missing_load_basis_needs_input",
        missing: ["loadBasisKgM2"],
        status: "needs_input"
      },
      {
        id: "gate_b_missing_topping_mass_needs_input",
        missing: ["toppingOrFloatingLayer"],
        status: "needs_input"
      },
      {
        id: "gate_b_missing_lower_isolation_needs_input",
        missing: ["ceilingOrLowerAssembly"],
        status: "needs_input"
      },
      {
        id: "gate_b_astm_iic_aiic_boundary_unsupported",
        missing: [],
        status: "unsupported_astm_rating_basis"
      },
      {
        id: "gate_b_field_context_non_alias_blocked",
        missing: [],
        status: "blocked_field_basis_non_alias"
      },
      {
        id: "gate_b_exact_lnw_source_precedence_keeps_delta_lw_unpromoted",
        missing: [],
        status: "blocked_exact_lnw_source_precedence_delta_lw_unpromoted"
      },
      {
        id: "gate_b_wrong_family_steel_not_timber_clt",
        missing: ["baseSlabOrFloor"],
        status: "not_timber_clt_floor"
      }
    ]);

    const missingDynamic = contractById("gate_b_missing_dynamic_stiffness_needs_input");
    expect(missingDynamic.inputCompleteness).toMatchObject({
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      status: "needs_input"
    });
    expect(missingDynamic.prompts).toContainEqual(
      expect.objectContaining({
        fieldId: "resilientLayerDynamicStiffnessMNm3",
        source: "material_property"
      })
    );

    const missingLower = contractById("gate_b_missing_lower_isolation_needs_input");
    expect(missingLower.prompts).toContainEqual(
      expect.objectContaining({
        fieldId: "ceilingOrLowerAssembly",
        source: "floor_role"
      })
    );
  });

  it("keeps ISO lab DeltaLw separate from ASTM and field bases", () => {
    const astm = contractById("gate_b_astm_iic_aiic_boundary_unsupported");
    const field = contractById("gate_b_field_context_non_alias_blocked");

    expect(astm).toMatchObject({
      deltaLwInventedFromIicOrAiic: false,
      deltaLwInventedFromLnW: false,
      formulaCorridorReady: false,
      inputCompleteness: null,
      unsupportedOutputs: ["IIC", "AIIC"]
    });
    expect(astm.formulaLanes.every((lane) => lane.status === "not_applicable")).toBe(true);
    expect(astm.currentRuntimeSnapshot).toMatchObject({
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["IIC", "AIIC"]
    });

    expect(field).toMatchObject({
      formulaCorridorReady: false,
      inputCompleteness: null,
      status: "blocked_field_basis_non_alias",
      unsupportedOutputs: ["L'n,w", "L'nT,w"]
    });
    expect(field.basisBoundaries).toContain(
      "field_impact_Lprime_requires_explicit_field_context_and_not_Gate_B_DeltaLw"
    );
  });

  it("preserves exact Ln,w source precedence without inventing DeltaLw from the exact row", () => {
    const exact = contractById("gate_b_exact_lnw_source_precedence_keeps_delta_lw_unpromoted");

    expect(exact).toMatchObject({
      currentRuntimeSnapshot: {
        basisId: "official_floor_system_exact_match",
        deltaLwDb: null,
        lnWDb: 51,
        supportedTargetOutputs: ["Ln,w"],
        unsupportedTargetOutputs: ["DeltaLw"]
      },
      deltaLwInventedFromLnW: false,
      formulaCorridorReady: false,
      inputCompleteness: null,
      missingFormulaOwners: [],
      missingPhysicalInputs: [],
      precedenceOrder: [
        "exact_full_stack_measured_source_for_requested_metric",
        "same_family_measured_anchor_or_holdout",
        "timber_clt_family_physics_formula_corridor",
        "bound_or_screening_support",
        "needs_input"
      ],
      status: "blocked_exact_lnw_source_precedence_delta_lw_unpromoted"
    });
    expect(exact.formulaLanes).toContainEqual(
      expect.objectContaining({
        laneId: "timber_joist_dry_floating_lower_ceiling_delta_lw",
        status: "blocked_by_exact_source_precedence"
      })
    );
  });

  it("does not consume steel floors or broad source crawls in the timber/CLT contract", () => {
    const steel = contractById("gate_b_wrong_family_steel_not_timber_clt");
    const timber = contractById("gate_b_timber_joist_complete_ready_for_formula_corridor");

    expect(steel).toMatchObject({
      formulaCorridorReady: false,
      missingPhysicalInputs: ["baseSlabOrFloor"],
      sourceRowsRequiredForInputContract: false,
      sourceRowsRequiredForRuntimeSelection: false,
      status: "not_timber_clt_floor"
    });
    expect(steel.formulaLanes.every((lane) => lane.status === "not_applicable")).toBe(true);
    expect(timber.evidenceRowsFromGateA).toEqual([
      "floor.timber_joist_impact.lab",
      "floor.clt_mass_timber_impact.lab",
      "floor.complete_field_impact_context.lprime"
    ]);
    expect(timber.requiredFormulaOwners).toEqual([
      "timberJoistReferenceFloorOwner",
      "massTimberCltReferenceFloorOwner",
      "timberCltUpperTreatmentMassOwner",
      "timberCltDynamicStiffnessTransferOwner",
      "timberCltLowerAssemblyCouplingOwner",
      "timberCltDeltaLwHoldoutSetOwner",
      "timberCltBasisAndToleranceOwner"
    ]);
  });

  it("keeps docs and the current-gate runner aligned with Gate B and selected Gate C", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain("gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan");
      expect(content, path).toContain(
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts"
      );
      expect(content, path).toContain(
        "gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts"
    );
  });

  it("also supports direct contract calls with no predictor input for partial user input", () => {
    const missingAll = buildGateBTimberCltDeltaLwInputContract({
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(missingAll).toMatchObject({
      missingPhysicalInputs: [
        "baseSlabOrFloor",
        "toppingOrFloatingLayer",
        "resilientLayerDynamicStiffnessMNm3",
        "loadBasisKgM2",
        "ceilingOrLowerAssembly"
      ],
      status: "needs_input"
    });
    expect(missingAll.prompts.map((prompt) => prompt.fieldId)).toEqual([
      "baseSlabOrFloor",
      "toppingOrFloatingLayer",
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2",
      "ceilingOrLowerAssembly"
    ]);
  });
});

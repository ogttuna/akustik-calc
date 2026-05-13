import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildPersonalUseMvpCoverageSprintGateBCFormulaCorridorContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_FORMULA_BASIS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBDNextLanes,
  summarizePersonalUseMvpCoverageSprintGateBC
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bc";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bb";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_BC = {
  apiShapeChange: false,
  broadSourceCrawlSelected: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
  previousSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION,
  previousSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS,
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_BC_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bc.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bc-floor-impact-source-absent-formula-corridor-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate BC floor-impact source-absent formula corridor", () => {
  it("lands Gate BC as a no-runtime formula corridor and selects Gate BD runtime corridor", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBCFormulaCorridorContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_BC).toEqual({
      apiShapeChange: false,
      broadSourceCrawlSelected: false,
      evidencePromotion: false,
      landedGate: "gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan",
      previousSelectedNextAction: "gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan",
      previousSelectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bc-floor-impact-source-absent-formula-corridor-contract.test.ts",
      previousSelectionStatus:
        "gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_landed_no_runtime_selected_formula_corridor_gate_bc",
      selectedNextAction: "gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts",
      selectionStatus:
        "gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_bd",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });
    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
      runtimePromotionAllowedInGateBC: false,
      runtimeValueMovement: false,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS,
      sourceRowsRequiredForFormulaDesign: false,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_BC_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("consumes Gate BB and defines the combined upper/lower heavy-concrete formula terms", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBCFormulaCorridorContract();
    const candidate = contract.candidateFormulaCorridor;

    expect(candidate).toMatchObject({
      affectedFormulaOutputs: ["Ln,w", "DeltaLw"],
      basisId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_FORMULA_BASIS,
      corridorStatus: "formula_corridor_defined_runtime_gate_required",
      deltaLwRuntimeEstimateDb: null,
      exactMeasuredRowsRemainPrecedence: true,
      formulaLaneId: "heavy_concrete_combined_upper_lower_coupled_delta_lw",
      gateBBScenarioId: "gate_bb_complete_combined_upper_lower_ready_for_gate_bc",
      inputContractStatus: "ready_for_formula_corridor_gate",
      lnWRuntimeEstimateDb: null,
      proposedDeltaLwEnvelopeDb: { max: 38, min: 26 },
      proposedLnWEnvelopeDb: { max: 50, min: 41 },
      requiredPhysicalInputs: [
        "baseSlabOrFloor",
        "toppingOrFloatingLayer",
        "resilientLayerDynamicStiffnessMNm3",
        "loadBasisKgM2",
        "ceilingOrLowerAssembly"
      ],
      supportBucketLabel: "heavy concrete combined upper/lower impact formula corridor design",
      upperOnlyRuntimeAnchor: {
        basisId: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
        deltaLwDb: 24.3,
        lnWDb: 50.3,
        source: "gate_bb_current_upper_only_runtime_snapshot_not_combined_lower_metric_owner"
      }
    });
    expect(candidate.requiredFormulaOwners).toEqual([
      "floorImpactReferenceFamilyOwner",
      "floorImpactDynamicStiffnessOrProductCurveOwner",
      "floorImpactLoadBasisOwner",
      "floorImpactUpperTreatmentMassOwner",
      "floorImpactLowerTreatmentCouplingOwner",
      "floorImpactHostileTopologyBoundaryOwner",
      "floorImpactSourceAbsentBudgetOwner"
    ]);
    expect(candidate.formulaTerms.map((term) => term.termId)).toEqual([
      "bare_heavy_reference_ln_w",
      "upper_floating_delta_lw_mass_spring",
      "upper_resonance_frequency_check",
      "lower_ceiling_coupling_delta_lw",
      "upper_lower_coupling_penalty",
      "coupled_system_uncertainty_budget"
    ]);
    expect(candidate.formulaTerms.every((term) => term.runtimeOwnedInGateBC === false)).toBe(true);
    expect(candidate.formulaStatement).toEqual([
      "DeltaLw_total = DeltaLw_upper(m'load, s') + DeltaLw_lower(lower assembly) - couplingPenalty(upper, lower)",
      "Ln,w = Ln,w_bare_heavy_reference - DeltaLw_total",
      "Gate BC defines the terms and error budget only; Gate BD must own runtime calculation and surface parity before values can promote."
    ]);
  });

  it("pins source-absent design budgets without presenting them as measured evidence", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBCFormulaCorridorContract();
    const budgets = contract.candidateFormulaCorridor.toleranceBudgets;

    expect(budgets).toMatchObject([
      {
        metricId: "Ln,w",
        notMeasuredEvidence: true,
        totalBudgetDb: 6.5
      },
      {
        metricId: "DeltaLw",
        notMeasuredEvidence: true,
        totalBudgetDb: 5.5
      }
    ]);
    expect(budgets[0]?.terms.map((term) => term.termId)).toEqual([
      "heavy_reference_floor_family_spread",
      "lower_assembly_coupling_simplification",
      "upper_lower_interaction_simplification",
      "dynamic_stiffness_precision",
      "load_basis_precision"
    ]);
    expect(budgets[1]?.terms.map((term) => term.termId)).toEqual([
      "combined_system_holdout_absence",
      "lower_assembly_coupling_simplification",
      "upper_lower_interaction_simplification",
      "dynamic_stiffness_precision",
      "load_basis_precision"
    ]);
    expect(budgets.flatMap((budget) => budget.terms).every((term) => term.basis === "source_absent_formula_design_budget")).toBe(
      true
    );
  });

  it("keeps Gate BB missing-input, family, basis, exact-source, and existing-corridor boundaries fail-closed", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBCFormulaCorridorContract();
    const boundaries = contract.negativeBoundaries.map((boundary) => ({
      id: boundary.gateBBScenarioId,
      missing: boundary.missingPhysicalInputs,
      status: boundary.status
    }));

    expect(boundaries).toEqual([
      {
        id: "gate_bb_missing_dynamic_stiffness_needs_input",
        missing: ["resilientLayerDynamicStiffnessMNm3"],
        status: "blocked_missing_input"
      },
      {
        id: "gate_bb_missing_load_basis_published_anchor_lnw_only",
        missing: ["toppingOrFloatingLayer", "loadBasisKgM2"],
        status: "blocked_missing_input"
      },
      {
        id: "gate_bb_missing_lower_treatment_needs_input",
        missing: ["ceilingOrLowerAssembly"],
        status: "blocked_missing_input"
      },
      {
        id: "gate_bb_lightweight_concrete_not_heavy_formula",
        missing: [],
        status: "blocked_family_specific_contract"
      },
      {
        id: "gate_bb_composite_panel_family_contract_required",
        missing: [],
        status: "blocked_family_specific_contract"
      },
      {
        id: "gate_bb_mixed_support_family_fail_closed",
        missing: ["duplicateOwnershipGuard"],
        status: "fail_closed_hostile_topology"
      },
      {
        id: "gate_bb_hostile_duplicate_roles_fail_closed",
        missing: ["duplicateOwnershipGuard"],
        status: "fail_closed_hostile_topology"
      },
      {
        id: "gate_bb_exact_source_precedence_preserved",
        missing: [],
        status: "blocked_exact_source_precedence"
      },
      {
        id: "gate_bb_complete_heavy_floating_existing_corridor_owned",
        missing: [],
        status: "existing_runtime_corridor_preserved"
      },
      {
        id: "gate_bb_astm_iic_aiic_basis_unsupported",
        missing: [],
        status: "blocked_basis_alias"
      },
      {
        id: "gate_bb_field_or_building_basis_non_alias_blocked",
        missing: [],
        status: "blocked_basis_alias"
      }
    ]);
    expect(contract.negativeBoundaries.every((boundary) => boundary.deltaLwRuntimeEstimateDb === null)).toBe(
      true
    );
    expect(contract.negativeBoundaries.every((boundary) => boundary.lnWRuntimeEstimateDb === null)).toBe(true);
  });

  it("freezes current runtime probes while defining the new combined formula corridor", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBCFormulaCorridorContract();

    expect(contract.runtimeFrozenSnapshot).toEqual({
      astmSupportedOutputs: [],
      exactSourceDeltaLwDb: null,
      exactSourceLnWDb: 51,
      heavyFloatingDeltaLwDb: 24.3,
      heavyFloatingLnWDb: 50.3,
      missingLoadDeltaLwDb: null,
      missingLoadLnWDb: 47
    });
    expect(contract.basisAliasBlocked).toEqual({
      astmIicAiic: true,
      buildingPrediction: true,
      fieldLPrime: true,
      labLnWOnlyFromPublishedAnchor: true
    });
  });

  it("selects Gate BD runtime corridor before surface parity, input surface, adapters, retune, or source crawl", () => {
    const candidates = rankPersonalUseMvpCoverageSprintGateBDNextLanes();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      id: "floor_impact_source_absent_runtime_corridor",
      runtimeMovementAllowedAtGateBC: true,
      score: 1.64,
      selected: true,
      sourceRowsRequiredForSelection: false
    });
    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "floor_impact_source_absent_runtime_corridor",
      "floor_impact_budget_surface_parity",
      "workbench_floor_impact_input_surface",
      "floor_impact_field_building_adapter",
      "astm_impact_rating_adapter",
      "floor_impact_source_absent_formula_retune",
      "broad_floor_source_row_crawl"
    ]);
    expect(candidates.at(-1)).toMatchObject({
      broadSourceCrawl: true,
      selected: false,
      sourceRowsRequiredForSelection: true
    });
  });

  it("summarizes Gate BC without broad source crawl or runtime movement", () => {
    const summary = summarizePersonalUseMvpCoverageSprintGateBC();

    expect(summary).toEqual({
      candidateStatus: "formula_corridor_defined_runtime_gate_required",
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
      negativeBoundaryCount: 11,
      noRuntimeValueMovement: true,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS,
      sourceAbsentRuntimeCorridorSelectedBeforeBroadSourceCrawl: true
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate BC closeout and Gate BD selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE);
      expect(content, path).toContain("floor-impact source-absent runtime corridor");
      expect(content, path).toContain("no-runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bc-floor-impact-source-absent-formula-corridor-contract.test.ts"
    );
  });
});

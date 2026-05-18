import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildPersonalUseMvpCoverageSprintGateBBInputContract,
  buildPersonalUseMvpCoverageSprintGateBBProbeSnapshot,
  buildPersonalUseMvpCoverageSprintGateBBScenarioPack,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBCNextLanes,
  summarizePersonalUseMvpCoverageSprintGateBB
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bb";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ba";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_BB = {
  apiShapeChange: false,
  broadSourceCrawlSelected: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE,
  previousSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_ACTION,
  previousSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_FILE,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS,
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_BB_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ba.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ba-floor-impact-source-absent-solver-gap-cartography-contract.test.ts",
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
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function contractById(id: string) {
  const entry = buildPersonalUseMvpCoverageSprintGateBBScenarioPack().find((scenario) => scenario.id === id);

  if (!entry) {
    throw new Error(`Missing Gate BB scenario ${id}`);
  }

  return entry.contract;
}

describe("Personal-Use MVP Coverage Sprint Gate BB floor-impact source-absent input contract", () => {
  it("lands Gate BB as a no-runtime floor-impact input contract and selects Gate BC", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_BB).toEqual({
      apiShapeChange: false,
      broadSourceCrawlSelected: false,
      evidencePromotion: false,
      landedGate: "gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan",
      previousSelectedNextAction: "gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan",
      previousSelectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts",
      previousSelectionStatus:
        "gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_landed_no_runtime_selected_floor_impact_source_absent_input_contract_gate_bb",
      selectedNextAction: "gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bc-floor-impact-source-absent-formula-corridor-contract.test.ts",
      selectionStatus:
        "gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_landed_no_runtime_selected_formula_corridor_gate_bc",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_BB_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("consumes Gate BA and summarizes the floor-impact input contract surface", () => {
    const summary = summarizePersonalUseMvpCoverageSprintGateBB();

    expect(summary).toMatchObject({
      broadSourceCrawlSelected: false,
      gateBASelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_ACTION,
      gateBASelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_FILE,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS,
      scenarioCount: 15,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS,
      sourceAbsentFormulaCorridorSelectedBeforeBroadSourceCrawl: true
    });
    expect(summary.statusCounts).toEqual({
      exact_source_precedence: 1,
      fail_closed_hostile_topology: 1,
      fail_closed_mixed_family: 1,
      family_specific_contract_required: 2,
      needs_input: 3,
      published_anchor_lnw_only_delta_lw_needs_input: 1,
      ready_existing_runtime_corridor: 3,
      ready_for_formula_corridor_gate: 1,
      unsupported_basis: 2
    });
  }, 30000);

  it("names the physical owner fields and default policy before any wider formula promotion", () => {
    const complete = contractById("gate_bb_complete_combined_upper_lower_ready_for_gate_bc");
    const fields = complete.physicalOwnerRequirements;
    const byField = new Map(fields.map((field) => [field.fieldId, field]));

    expect(complete.requiredFormulaOwners).toEqual([
      "floorImpactReferenceFamilyOwner",
      "floorImpactDynamicStiffnessOrProductCurveOwner",
      "floorImpactLoadBasisOwner",
      "floorImpactUpperTreatmentMassOwner",
      "floorImpactLowerTreatmentCouplingOwner",
      "floorImpactHostileTopologyBoundaryOwner",
      "floorImpactSourceAbsentBudgetOwner"
    ]);
    expect(byField.get("baseSlabOrFloor")).toMatchObject({
      defaultPolicy: "no_default",
      missingBehavior: "needs_input",
      ownerGroup: "base_carrier_family"
    });
    expect(byField.get("resilientLayerDynamicStiffnessMNm3")).toMatchObject({
      defaultPolicy: "no_default",
      missingBehavior: "needs_input",
      ownerGroup: "upper_delta_lw_package"
    });
    expect(byField.get("loadBasisKgM2")).toMatchObject({
      defaultPolicy: "no_default",
      missingBehavior: "needs_input"
    });
    expect(byField.get("ceilingOrLowerAssembly")).toMatchObject({
      ownerGroup: "lower_treatment_coupling"
    });
    expect(byField.get("steelSupportForm")).toMatchObject({
      ownerGroup: "steel_carrier_geometry"
    });
    expect(byField.get("impactFieldContext")).toMatchObject({
      defaultPolicy: "source_required",
      missingBehavior: "unsupported"
    });
    expect(byField.get("outputBasis")).toMatchObject({
      ownerGroup: "astm_or_building_basis_boundary"
    });
  });

  it("classifies complete, partial, family-specific, existing-corridor, and hostile floor-impact scenarios", () => {
    const scenarioSummary = buildPersonalUseMvpCoverageSprintGateBBScenarioPack().map((entry) => ({
      id: entry.id,
      missing: entry.contract.missingPhysicalInputs,
      status: entry.contract.status
    }));

    expect(scenarioSummary).toEqual([
      {
        id: "gate_bb_exact_source_precedence_preserved",
        missing: [],
        status: "exact_source_precedence"
      },
      {
        id: "gate_bb_complete_heavy_floating_existing_corridor_owned",
        missing: [],
        status: "ready_existing_runtime_corridor"
      },
      {
        id: "gate_bb_complete_combined_upper_lower_ready_for_gate_bc",
        missing: [],
        status: "ready_for_formula_corridor_gate"
      },
      {
        id: "gate_bb_missing_dynamic_stiffness_needs_input",
        missing: ["resilientLayerDynamicStiffnessMNm3"],
        status: "needs_input"
      },
      {
        id: "gate_bb_missing_load_basis_published_anchor_lnw_only",
        missing: ["toppingOrFloatingLayer", "loadBasisKgM2"],
        status: "published_anchor_lnw_only_delta_lw_needs_input"
      },
      {
        id: "gate_bb_missing_lower_treatment_needs_input",
        missing: ["ceilingOrLowerAssembly"],
        status: "needs_input"
      },
      {
        id: "gate_bb_lightweight_concrete_not_heavy_formula",
        missing: [],
        status: "family_specific_contract_required"
      },
      {
        id: "gate_bb_composite_panel_family_contract_required",
        missing: [],
        status: "family_specific_contract_required"
      },
      {
        id: "gate_bb_steel_missing_carrier_or_lower_inputs_needs_input",
        missing: ["steelCarrierSpacingMm", "lowerCeilingIsolationSupportForm"],
        status: "needs_input"
      },
      {
        id: "gate_bb_timber_existing_corridor_preserved",
        missing: [],
        status: "ready_existing_runtime_corridor"
      },
      {
        id: "gate_bb_clt_existing_corridor_preserved",
        missing: [],
        status: "ready_existing_runtime_corridor"
      },
      {
        id: "gate_bb_mixed_support_family_fail_closed",
        missing: ["duplicateOwnershipGuard"],
        status: "fail_closed_mixed_family"
      },
      {
        id: "gate_bb_hostile_duplicate_roles_fail_closed",
        missing: ["duplicateOwnershipGuard"],
        status: "fail_closed_hostile_topology"
      },
      {
        id: "gate_bb_astm_iic_aiic_basis_unsupported",
        missing: [],
        status: "unsupported_basis"
      },
      {
        id: "gate_bb_field_or_building_basis_non_alias_blocked",
        missing: [],
        status: "unsupported_basis"
      }
    ]);
  });

  it("keeps current runtime probe values frozen while tightening the input boundary", () => {
    const probes = buildPersonalUseMvpCoverageSprintGateBBProbeSnapshot();

    expect(probes.exactSourcePrecedence.impact).toMatchObject({
      LnW: 51,
      basis: "official_floor_system_exact_match"
    });
    expect(probes.exactSourcePrecedence.supportedImpactOutputs).toEqual(["Ln,w"]);
    expect(probes.exactSourcePrecedence.unsupportedImpactOutputs).toEqual(["DeltaLw"]);

    expect(probes.heavyConcreteFormula.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 50.3,
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    });
    expect(probes.heavyConcreteFormula.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);

    expect(probes.missingLoadPublishedAnchor.impact).toMatchObject({
      LnW: 47,
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate"
    });
    expect(probes.missingLoadPublishedAnchor.impact?.DeltaLw).toBeUndefined();
    expect(probes.missingLoadPublishedAnchor.supportedImpactOutputs).toEqual(["Ln,w"]);
    expect(probes.missingLoadPublishedAnchor.unsupportedImpactOutputs).toEqual(["DeltaLw"]);

    expect(probes.astmBoundary.supportedImpactOutputs).toEqual([]);
    expect(probes.astmBoundary.unsupportedImpactOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("preserves exact, field, ASTM, published-anchor, and hostile negative boundaries", () => {
    const exact = contractById("gate_bb_exact_source_precedence_preserved");
    const missingLoad = contractById("gate_bb_missing_load_basis_published_anchor_lnw_only");
    const astm = contractById("gate_bb_astm_iic_aiic_basis_unsupported");
    const building = contractById("gate_bb_field_or_building_basis_non_alias_blocked");
    const hostile = contractById("gate_bb_hostile_duplicate_roles_fail_closed");

    expect(exact).toMatchObject({
      currentRuntimeSnapshot: {
        basisId: "official_floor_system_exact_match",
        deltaLwDb: null,
        lnWDb: 51,
        supportedTargetOutputs: ["Ln,w"],
        unsupportedTargetOutputs: ["DeltaLw"]
      },
      exactSourcePrecedencePreserved: true,
      formulaCorridorReady: false,
      inputCompleteness: null,
      status: "exact_source_precedence"
    });
    expect(exact.formulaLanes.every((lane) => lane.status === "not_applicable")).toBe(true);

    expect(missingLoad).toMatchObject({
      inputCompleteness: {
        missingPhysicalInputs: ["toppingOrFloatingLayer", "loadBasisKgM2"],
        requiredFields: [
          "baseSlabOrFloor",
          "toppingOrFloatingLayer",
          "resilientLayerDynamicStiffnessMNm3",
          "loadBasisKgM2"
        ],
        status: "needs_input"
      },
      publishedFamilyAnchorAllowedForLnWOnly: true
    });
    expect(missingLoad.prompts.map((prompt) => prompt.fieldId)).toEqual([
      "toppingOrFloatingLayer",
      "loadBasisKgM2"
    ]);

    expect(astm).toMatchObject({
      deltaLwInventedFromFieldOrAstm: false,
      inputCompleteness: null,
      status: "unsupported_basis",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
    expect(building).toMatchObject({
      basisBoundaries: expect.arrayContaining([
        "building_prediction_impact_needs_future_flanking_junction_room_owners"
      ]),
      status: "unsupported_basis",
      unsupportedOutputs: ["L'nT,w", "L'nT,50"]
    });
    expect(hostile).toMatchObject({
      inputCompleteness: null,
      noRuntimeValueMovement: true,
      status: "fail_closed_hostile_topology"
    });
  });

  it("selects the bounded Gate BC formula corridor before budget, adapters, retune, or source crawl", () => {
    const candidates = rankPersonalUseMvpCoverageSprintGateBCNextLanes();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      id: "floor_impact_source_absent_formula_corridor",
      runtimeMovementAllowedAtGateBB: false,
      score: 1.58,
      selected: true,
      sourceRowsRequiredForSelection: false
    });
    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "floor_impact_source_absent_formula_corridor",
      "floor_impact_error_budget_surface",
      "floor_impact_field_building_adapter",
      "astm_impact_adapter",
      "floor_impact_formula_retune",
      "broad_source_row_crawl"
    ]);
    expect(candidates.at(-1)).toMatchObject({
      broadSourceCrawl: true,
      selected: false,
      sourceRowsRequiredForSelection: true
    });
  });

  it("also supports direct partial contract calls without predictor input", () => {
    const partial = buildPersonalUseMvpCoverageSprintGateBBInputContract({
      family: "heavy_concrete_combined_upper_lower",
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(partial).toMatchObject({
      formulaCorridorReady: false,
      inputCompleteness: {
        missingPhysicalInputs: [
          "baseSlabOrFloor",
          "toppingOrFloatingLayer",
          "resilientLayerDynamicStiffnessMNm3",
          "loadBasisKgM2",
          "ceilingOrLowerAssembly"
        ],
        status: "needs_input"
      },
      missingPhysicalInputs: [
        "baseSlabOrFloor",
        "toppingOrFloatingLayer",
        "resilientLayerDynamicStiffnessMNm3",
        "loadBasisKgM2",
        "ceilingOrLowerAssembly"
      ],
      status: "needs_input"
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate BB closeout and Gate BC selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE);
      expect(content, path).toContain("floor-impact source-absent formula corridor");
      expect(content, path).toContain("no-runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts"
    );
  });
});

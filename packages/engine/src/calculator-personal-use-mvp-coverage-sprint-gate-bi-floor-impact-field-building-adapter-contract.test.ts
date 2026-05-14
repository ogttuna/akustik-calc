import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type {
  PersonalUseMvpCoverageMetricValuePin,
  PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateBHFloorImpactCoverageMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBILanes,
  summarizePersonalUseMvpCoverageSprintGateBH
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bh";
import {
  buildPersonalUseMvpCoverageSprintGateBIContract,
  buildPersonalUseMvpCoverageSprintGateBIOwnerGroups,
  buildPersonalUseMvpCoverageSprintGateBIScenarioPack,
  GATE_BI_BUILDING_PREDICTION_OWNER_INPUTS,
  GATE_BI_BUILDING_PREDICTION_PHYSICAL_INPUTS,
  GATE_BI_FIELD_APPARENT_OWNER_INPUTS,
  GATE_BI_FIELD_APPARENT_PHYSICAL_INPUTS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bi";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BI_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bh.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bh-floor-impact-source-absent-coverage-matrix-refresh-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_CALCULATION_GRADE_REVIEW.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BI_FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_CONTRACT_PLAN.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing Gate BH floor-impact matrix row ${id}`);
  }

  return row;
}

function scenario(id: string) {
  const found = buildPersonalUseMvpCoverageSprintGateBIScenarioPack().find((entry) => entry.id === id);

  if (!found) {
    throw new Error(`Missing Gate BI scenario ${id}`);
  }

  return found;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("Personal-Use MVP Coverage Sprint Gate BI floor-impact field/building adapter contract", () => {
  it("lands Gate BI as a no-runtime owner contract and selects the runtime corridor next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBIContract();

    expect(contract).toMatchObject({
      astmImpactAdapterAdded: false,
      buildingPredictionRuntimePromoted: false,
      companyInternalCalculationGradeNextLane: true,
      currentFieldRowsPreserved: {
        lPrimeNT50Db: 49,
        lPrimeNTwDb: 50.6,
        lPrimeNWDb: 53
      },
      fieldAndBuildingOwnersSeparated: true,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_LANDED_GATE,
      labBudgetAliasedToFieldOrBuilding: false,
      noRuntimeValueMovement: true,
      previousGateBH: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE,
        selectedNextLane: "floor_impact_field_building_adapter_contract",
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS
      },
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_BI_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps Gate BH lane selection and existing field/lab values pinned while defining the next owner boundary", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateBHFloorImpactCoverageMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateBH(rows);
    const selectedLane = rankPersonalUseMvpCoverageSprintGateBILanes(rows).find((candidate) => candidate.selected);

    expect(summary.selectedGateBILane).toBe("floor_impact_field_building_adapter_contract");
    expect(selectedLane).toMatchObject({
      id: "floor_impact_field_building_adapter_contract",
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(values(byId(rows, "floor.heavy_concrete_combined_input_surface.lab"))).toEqual({
      "DeltaLw": 30.1,
      "Ln,w": 44.4
    });
    expect(values(byId(rows, "floor.lightweight_steel_complete_formula.lab"))).toEqual({
      "DeltaLw": 22.4,
      "Ln,w": 55.6
    });
    expect(values(byId(rows, "floor.timber_joist_impact.lab"))).toEqual({
      "DeltaLw": 25.2,
      "Ln,w": 51
    });
    expect(values(byId(rows, "floor.clt_mass_timber_impact.lab"))).toEqual({
      "DeltaLw": 22.6,
      "Ln,w": 50
    });
    expect(values(byId(rows, "floor.complete_field_impact_context.lprime"))).toEqual({
      "L'n,w": 53,
      "L'nT,w": 50.6
    });
    expect(values(byId(rows, "floor.clt_mass_timber_field_lnt50.local_guide"))).toEqual({
      "L'nT,50": 49
    });
    expect(byId(rows, "floor.building_impact.prediction_adapter_boundary")).toMatchObject({
      currentPosture: "unsupported",
      failureClass: "basis_boundary",
      runtime: {
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["L'nT,w", "L'nT,50"],
        valuePins: []
      }
    });
  });

  it("separates field-apparent and building-prediction owner groups before runtime promotion", () => {
    const groups = buildPersonalUseMvpCoverageSprintGateBIOwnerGroups();

    expect(groups).toEqual([
      {
        adapterBasis: "field_apparent",
        id: "field_apparent_impact_adapter_owners",
        lowFrequencyOwnerRequiredFor: ["L'nT,50"],
        requiredOwnerInputs: [...GATE_BI_FIELD_APPARENT_OWNER_INPUTS],
        requiredPhysicalInputs: [...GATE_BI_FIELD_APPARENT_PHYSICAL_INPUTS],
        targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"]
      },
      {
        adapterBasis: "building_prediction",
        id: "building_prediction_impact_adapter_owners",
        lowFrequencyOwnerRequiredFor: ["L'nT,50"],
        requiredOwnerInputs: [...GATE_BI_BUILDING_PREDICTION_OWNER_INPUTS],
        requiredPhysicalInputs: [...GATE_BI_BUILDING_PREDICTION_PHYSICAL_INPUTS],
        targetOutputs: ["L'nT,w", "L'nT,50"]
      }
    ]);
    expect(groups[0].requiredOwnerInputs).toContain("labImpactAnchorLnWOrDeltaLw");
    expect(groups[1].requiredOwnerInputs).toContain("directSeparatingFloorImpactCurveOwner");
    expect(groups[1].requiredOwnerInputs).toContain("buildingFlankingPathEnergyOwner");
    expect(groups[1].requiredPhysicalInputs).toContain("junctionCouplingLengthM");
  });

  it("makes missing fields, low-frequency ownership, building runtime ownership, and ASTM aliases executable", () => {
    expect(scenario("gate_bi_complete_field_apparent_ready_for_gate_bj_runtime_corridor")).toMatchObject({
      adapterBasis: "field_apparent",
      blockedOutputs: [],
      labBudgetAliasAllowed: false,
      missingOwnerInputs: [],
      missingPhysicalInputs: [],
      readyOutputs: ["L'n,w", "L'nT,w"],
      runtimePromotionAllowedAtGateBI: false,
      status: "ready_for_runtime_corridor",
      unsupportedOutputs: []
    });
    expect(scenario("gate_bi_field_low_frequency_owner_missing")).toMatchObject({
      blockedOutputs: ["L'nT,50"],
      missingOwnerInputs: ["lowFrequencyImpactSpectrumOrCI50_2500Owner"],
      missingPhysicalInputs: [],
      readyOutputs: [],
      status: "blocked_low_frequency_owner",
      unsupportedOutputs: []
    });
    expect(scenario("gate_bi_field_missing_separating_area_needs_input")).toMatchObject({
      missingPhysicalInputs: ["partitionAreaM2"],
      readyOutputs: [],
      status: "needs_input"
    });
    expect(scenario("gate_bi_building_complete_physical_context_runtime_owners_missing")).toMatchObject({
      adapterBasis: "building_prediction",
      missingPhysicalInputs: [],
      readyOutputs: [],
      status: "runtime_owner_missing",
      unsupportedOutputs: ["L'nT,w", "L'nT,50"]
    });
    expect(scenario("gate_bi_building_missing_junction_coupling_needs_input")).toMatchObject({
      missingPhysicalInputs: ["junctionCouplingLengthM"],
      status: "needs_input"
    });
    expect(scenario("gate_bi_astm_iic_aiic_remains_unsupported")).toMatchObject({
      adapterBasis: "astm_rating_boundary",
      status: "unsupported_basis",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
    expect(scenario("gate_bi_lab_lnw_delta_lw_budget_not_field_building_alias")).toMatchObject({
      adapterBasis: "element_lab",
      labBudgetAliasAllowed: false,
      status: "unsupported_basis",
      unsupportedOutputs: ["Ln,w", "DeltaLw"]
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate BI closeout and Gate BJ selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_FILE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("calculation-grade");
      expect(content, path).toContain("low-confidence/screening");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts"
    );
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBRLanes,
  summarizePersonalUseMvpCoverageSprintGateBQ
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bq";
import {
  buildPersonalUseMvpCoverageSprintGateBRContract,
  buildPersonalUseMvpCoverageSprintGateBRCurrentBoundaryCalculation,
  buildPersonalUseMvpCoverageSprintGateBROwnerGroups,
  buildPersonalUseMvpCoverageSprintGateBRRuntimeBoundarySnapshot,
  buildPersonalUseMvpCoverageSprintGateBRScenarioPack,
  GATE_BR_ASTM_FIELD_AIIC_OWNER_INPUTS,
  GATE_BR_ASTM_FIELD_AIIC_PHYSICAL_INPUTS,
  GATE_BR_ASTM_LAB_IIC_OWNER_INPUTS,
  GATE_BR_ASTM_LAB_IIC_PHYSICAL_INPUTS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBSLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-br";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BR_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-br.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-br-floor-impact-astm-iic-aiic-adapter-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq-coverage-matrix-refresh-after-reinforced-concrete-cleanup-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_HANDOFF.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BR_FLOOR_IMPACT_ASTM_IIC_AIIC_ADAPTER_CONTRACT_PLAN.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function scenario(id: string) {
  const found = buildPersonalUseMvpCoverageSprintGateBRScenarioPack().find((entry) => entry.id === id);

  if (!found) {
    throw new Error(`Missing Gate BR scenario ${id}`);
  }

  return found;
}

describe("Personal-Use MVP Coverage Sprint Gate BR floor-impact ASTM IIC/AIIC adapter contract", () => {
  it("lands Gate BR as a no-runtime ASTM adapter owner contract and selects the runtime corridor next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBRContract();

    expect(contract).toMatchObject({
      aiicAliasedToFieldImpact: false,
      astmImpactRuntimePromoted: false,
      exactAstmSourcePrecedenceRequired: true,
      fieldOrBuildingMetricsAliasedToAstm: false,
      iicAliasedToIsoLnWOrDeltaLw: false,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBQ: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE,
        selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_LABEL,
        selectedNextLane: "floor_impact_astm_iic_aiic_adapter_contract",
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS
      },
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bq_floor_impact_astm_iic_aiic_adapter_contract",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_BR_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the Gate BQ ASTM boundary selected and the current runtime unsupported", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateBQ(rows);
    const selectedLane = rankPersonalUseMvpCoverageSprintGateBRLanes(rows).selectedCandidate;
    const rawBoundary = buildPersonalUseMvpCoverageSprintGateBRCurrentBoundaryCalculation();
    const boundary = buildPersonalUseMvpCoverageSprintGateBRRuntimeBoundarySnapshot();

    expect(summary.selectedGateBRLane).toBe("floor_impact_astm_iic_aiic_adapter_contract");
    expect(summary.unsupportedAstmBoundaryRowIds).toEqual([
      "floor.astm_iic_aiic_boundary.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.reinforced_concrete_combined_astm_iic.unsupported"
    ]);
    expect(selectedLane).toMatchObject({
      id: "floor_impact_astm_iic_aiic_adapter_contract",
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(rawBoundary.supportedTargetOutputs).toEqual([]);
    expect(rawBoundary.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(boundary).toMatchObject({
      aiicDb: null,
      iicDb: null,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["IIC", "AIIC"],
      warningIncludesUnsupportedAstmOutputs: true
    });
    expect(boundary.impactBasisPresentButNotAstm).not.toBe("astm_e989_iic_aiic_rating_adapter");
  });

  it("separates ASTM lab IIC and field AIIC owner groups before runtime promotion", () => {
    const groups = buildPersonalUseMvpCoverageSprintGateBROwnerGroups();

    expect(groups).toEqual([
      {
        adapterBasis: "astm_lab_iic",
        id: "astm_lab_iic_adapter_owners",
        requiredOwnerInputs: [...GATE_BR_ASTM_LAB_IIC_OWNER_INPUTS],
        requiredPhysicalInputs: [...GATE_BR_ASTM_LAB_IIC_PHYSICAL_INPUTS],
        targetOutputs: ["IIC"]
      },
      {
        adapterBasis: "astm_field_aiic",
        id: "astm_field_aiic_adapter_owners",
        requiredOwnerInputs: [...GATE_BR_ASTM_FIELD_AIIC_OWNER_INPUTS],
        requiredPhysicalInputs: [...GATE_BR_ASTM_FIELD_AIIC_PHYSICAL_INPUTS],
        targetOutputs: ["AIIC"]
      }
    ]);
    expect(groups[0].requiredOwnerInputs).toContain("astmE492NormalizedImpactCurveOwner");
    expect(groups[0].requiredOwnerInputs).toContain("isoLnWDeltaLwNonAliasBoundaryOwner");
    expect(groups[1].requiredOwnerInputs).toContain("astmE1007OrFieldImpactCurveOwner");
    expect(groups[1].requiredPhysicalInputs).toContain("receivingRoomRt60S");
  });

  it("makes missing bands, missing rating owners, and ISO/field/building aliases executable", () => {
    expect(scenario("gate_br_complete_lab_iic_ready_for_gate_bs_runtime_corridor")).toMatchObject({
      adapterBasis: "astm_lab_iic",
      blockedOutputs: [],
      isoLnWOrDeltaLwAliasAllowed: false,
      missingOwnerInputs: [],
      missingPhysicalInputs: [],
      readyOutputs: ["IIC"],
      runtimePromotionAllowedAtGateBR: false,
      status: "ready_for_runtime_corridor",
      unsupportedOutputs: []
    });
    expect(scenario("gate_br_lab_iic_missing_frequency_bands_needs_input")).toMatchObject({
      missingPhysicalInputs: ["frequencyBandSet"],
      readyOutputs: [],
      status: "needs_input"
    });
    expect(scenario("gate_br_lab_iic_missing_rating_owner_runtime_owner_missing")).toMatchObject({
      missingOwnerInputs: ["astmE989IicContourRatingOwner"],
      readyOutputs: [],
      status: "runtime_owner_missing",
      unsupportedOutputs: ["IIC"]
    });
    expect(scenario("gate_br_complete_field_aiic_ready_for_gate_bs_runtime_corridor")).toMatchObject({
      adapterBasis: "astm_field_aiic",
      missingOwnerInputs: [],
      missingPhysicalInputs: [],
      readyOutputs: ["AIIC"],
      status: "ready_for_runtime_corridor"
    });
    expect(scenario("gate_br_field_aiic_missing_rt60_needs_input")).toMatchObject({
      missingPhysicalInputs: ["receivingRoomRt60S"],
      status: "needs_input"
    });
    expect(scenario("gate_br_iso_lnw_delta_lw_not_iic_alias")).toMatchObject({
      adapterBasis: "iso_lab_impact",
      isoLnWOrDeltaLwAliasAllowed: false,
      readyOutputs: [],
      status: "blocked_basis_alias",
      unsupportedOutputs: ["IIC"]
    });
    expect(scenario("gate_br_iso_field_lprime_not_aiic_alias")).toMatchObject({
      adapterBasis: "iso_field_impact",
      readyOutputs: [],
      status: "blocked_basis_alias",
      unsupportedOutputs: ["AIIC"]
    });
    expect(scenario("gate_br_building_prediction_not_astm_aiic_alias")).toMatchObject({
      adapterBasis: "building_prediction",
      readyOutputs: [],
      status: "unsupported_basis",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
  });

  it("ranks Gate BS runtime-corridor investigation ahead of broad ASTM source crawling", () => {
    const lanes = rankPersonalUseMvpCoverageSprintGateBSLanes();
    const selected = lanes.find((lane) => lane.selected);

    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      id: "astm_iic_aiic_runtime_corridor",
      runtimeMovementAllowedAtGateBR: false,
      sourceRowsRequiredForSelection: false
    });
    expect(lanes.find((lane) => lane.id === "broad_astm_source_crawl")).toMatchObject({
      broadSourceCrawl: true,
      selected: false,
      sourceRowsRequiredForSelection: true
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate BR closeout and Gate BS selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_FILE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("not alias");
      expect(content, path).toContain("ASTM");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-br-floor-impact-astm-iic-aiic-adapter-contract.test.ts"
    );
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-br";
import {
  buildPersonalUseMvpCoverageSprintGateBSAstmRatingAdapterBasisSet,
  buildPersonalUseMvpCoverageSprintGateBSContract,
  buildPersonalUseMvpCoverageSprintGateBSCurrentBoundaryCalculation,
  buildPersonalUseMvpCoverageSprintGateBSRuntimeBoundarySnapshot,
  buildPersonalUseMvpCoverageSprintGateBSRuntimeProbes,
  buildPersonalUseMvpCoverageSprintGateBSStandardsPublicMetadataReferences,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBTLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bs";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BS_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bs.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bs-floor-impact-astm-iic-aiic-runtime-corridor-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-br.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-br-floor-impact-astm-iic-aiic-adapter-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_HANDOFF.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BS_FLOOR_IMPACT_ASTM_IIC_AIIC_RUNTIME_CORRIDOR_PLAN.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function probe(previousGateBRScenarioId: string) {
  const found = buildPersonalUseMvpCoverageSprintGateBSRuntimeProbes().find(
    (entry) => entry.previousGateBRScenarioId === previousGateBRScenarioId
  );

  if (!found) {
    throw new Error(`Missing Gate BS runtime probe for ${previousGateBRScenarioId}`);
  }

  return found;
}

describe("Personal-Use MVP Coverage Sprint Gate BS floor-impact ASTM IIC/AIIC runtime corridor", () => {
  it("lands Gate BS as a no-runtime runtime-corridor probe and selects the metric schema bridge next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBSContract();

    expect(contract).toMatchObject({
      aiicAliasedToIsoFieldImpact: false,
      astmImpactRuntimePromoted: false,
      exactAstmSourcePrecedenceRuntimeOwnerMissing: true,
      iicAliasedToIsoLnWOrDeltaLw: false,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBR: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_FILE,
        selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_LABEL,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTION_STATUS
      },
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_br_floor_impact_astm_iic_aiic_runtime_corridor",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_BS_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("proves the current runtime still cannot expose ASTM IIC or AIIC values", () => {
    const rawBoundary = buildPersonalUseMvpCoverageSprintGateBSCurrentBoundaryCalculation();
    const boundary = buildPersonalUseMvpCoverageSprintGateBSRuntimeBoundarySnapshot();

    expect(rawBoundary.supportedTargetOutputs).toEqual([]);
    expect(rawBoundary.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(boundary).toMatchObject({
      aiicDb: null,
      astmRatingBasisPresent: false,
      exactImpactSourceOwnsAstmE989SingleNumber: false,
      iicDb: null,
      impactCalculationSchemaOwnsIicAiicValues: false,
      supportedTargetOutputs: [],
      targetOutputSupportBlocksAstmImpactOutputs: true,
      unsupportedTargetOutputs: ["IIC", "AIIC"],
      warningIncludesUnsupportedAstmOutputs: true
    });
    expect(boundary.impactBasisPresentButNotAstm).not.toBe("astm_e989_iic_from_impact_level_curve");
    expect(boundary.impactBasisPresentButNotAstm).not.toBe("astm_e989_aiic_from_field_impact_curve");
  });

  it("keeps ASTM adapter metadata planned until runtime metric owners exist", () => {
    const adapters = buildPersonalUseMvpCoverageSprintGateBSAstmRatingAdapterBasisSet();

    expect(adapters.map((adapter) => adapter.metricId)).toEqual(["IIC", "AIIC"]);
    expect(adapters.map((adapter) => adapter.adapterId)).toEqual([
      "astm_e989_iic_from_impact_level_curve",
      "astm_e989_aiic_from_field_impact_curve"
    ]);
    expect(adapters.every((adapter) => adapter.ratingStandard === "ASTM E989")).toBe(true);
    expect(adapters.every((adapter) => adapter.implementationStatus === "planned_not_implemented")).toBe(true);
    expect(adapters.find((adapter) => adapter.metricId === "IIC")?.contextBasis).toBe("element_lab");
    expect(adapters.find((adapter) => adapter.metricId === "AIIC")?.contextBasis).toBe("field_measurement");
    expect(adapters.find((adapter) => adapter.metricId === "IIC")?.blockedReasons).toContain(
      "impactCalculationIicMetricValueOwner"
    );
    expect(adapters.find((adapter) => adapter.metricId === "AIIC")?.blockedReasons).toContain(
      "impactCalculationAiicMetricValueOwner"
    );
    expect(adapters.flatMap((adapter) => adapter.aliasBlocks.map((block) => block.fromMetricId))).toEqual([
      "Ln,w",
      "DeltaLw",
      "L'n,w",
      "L'nT,w"
    ]);
  });

  it("turns Gate BR ready probes into precise runtime-owner blockers instead of ASTM values", () => {
    expect(probe("gate_br_complete_lab_iic_ready_for_gate_bs_runtime_corridor")).toMatchObject({
      adapterBasis: "astm_lab_iic",
      basisAliasRejected: false,
      blockedOutputs: [],
      missingPhysicalInputs: [],
      missingRuntimeOwners: [
        "impactCalculationIicMetricValueOwner",
        "impactMetricBasisIicOwner",
        "astmE989ExecutableIicContourRatingProcedureOwner",
        "targetOutputSupportAstmIicOwner",
        "exactAstmSourcePrecedenceRuntimeOwner",
        "astmIicVisibleSurfaceParityOwner"
      ],
      promotedOutputs: [],
      runtimePromotionAllowedAtGateBS: false,
      sourceRowsRequiredForRuntimeSelection: false,
      status: "runtime_owner_missing",
      targetOutputs: ["IIC"],
      unsupportedOutputs: ["IIC"]
    });
    expect(probe("gate_br_complete_field_aiic_ready_for_gate_bs_runtime_corridor")).toMatchObject({
      adapterBasis: "astm_field_aiic",
      missingPhysicalInputs: [],
      missingRuntimeOwners: [
        "impactCalculationAiicMetricValueOwner",
        "impactMetricBasisAiicOwner",
        "astmE989ExecutableAiicApparentRatingProcedureOwner",
        "targetOutputSupportAstmAiicOwner",
        "exactAstmSourcePrecedenceRuntimeOwner",
        "astmAiicVisibleSurfaceParityOwner"
      ],
      promotedOutputs: [],
      status: "runtime_owner_missing",
      targetOutputs: ["AIIC"],
      unsupportedOutputs: ["AIIC"]
    });
  });

  it("preserves missing-input, missing-rating-owner, ISO alias, field alias, and building boundaries", () => {
    expect(probe("gate_br_lab_iic_missing_frequency_bands_needs_input")).toMatchObject({
      blockedOutputs: ["IIC"],
      missingPhysicalInputs: ["frequencyBandSet"],
      missingRuntimeOwners: [],
      promotedOutputs: [],
      status: "needs_input",
      unsupportedOutputs: []
    });
    expect(probe("gate_br_field_aiic_missing_rt60_needs_input")).toMatchObject({
      blockedOutputs: ["AIIC"],
      missingPhysicalInputs: ["receivingRoomRt60S"],
      missingRuntimeOwners: [],
      status: "needs_input"
    });
    expect(probe("gate_br_lab_iic_missing_rating_owner_runtime_owner_missing")).toMatchObject({
      missingRuntimeOwners: ["astmE989IicContourRatingOwner"],
      promotedOutputs: [],
      status: "runtime_owner_missing",
      unsupportedOutputs: ["IIC"]
    });
    expect(probe("gate_br_iso_lnw_delta_lw_not_iic_alias")).toMatchObject({
      adapterBasis: "iso_lab_impact",
      basisAliasRejected: true,
      missingRuntimeOwners: [],
      promotedOutputs: [],
      status: "blocked_basis_alias",
      unsupportedOutputs: ["IIC"]
    });
    expect(probe("gate_br_iso_field_lprime_not_aiic_alias")).toMatchObject({
      adapterBasis: "iso_field_impact",
      basisAliasRejected: true,
      promotedOutputs: [],
      status: "blocked_basis_alias",
      unsupportedOutputs: ["AIIC"]
    });
    expect(probe("gate_br_building_prediction_not_astm_aiic_alias")).toMatchObject({
      adapterBasis: "building_prediction",
      promotedOutputs: [],
      status: "unsupported_basis",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
  });

  it("ranks the Gate BT metric schema and adapter bridge ahead of broad ASTM source crawling", () => {
    const lanes = rankPersonalUseMvpCoverageSprintGateBTLanes();
    const selected = lanes.find((lane) => lane.selected);

    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      id: "astm_iic_aiic_metric_schema_adapter_bridge",
      runtimeMovementAllowedAtGateBS: false,
      sourceRowsRequiredForSelection: false
    });
    expect(lanes.find((lane) => lane.id === "broad_astm_source_crawl")).toMatchObject({
      broadSourceCrawl: true,
      selected: false,
      sourceRowsRequiredForSelection: true
    });
    expect(lanes.find((lane) => lane.id === "iso_impact_adapter_reuse")).toMatchObject({
      selected: false,
      sourceRowsRequiredForSelection: false
    });
  });

  it("keeps the standards refresh as public metadata only", () => {
    const references = buildPersonalUseMvpCoverageSprintGateBSStandardsPublicMetadataReferences();

    expect(references.map((reference) => reference.standard)).toEqual([
      "ASTM E492",
      "ASTM E989",
      "ASTM E1007"
    ]);
    expect(references.map((reference) => reference.url)).toEqual([
      "https://store.astm.org/e0492-25.html",
      "https://store.astm.org/e0989-21.html",
      "https://store.astm.org/e1007-25.html"
    ]);
    expect(references.every((reference) => reference.role.includes("no standard text"))).toBe(true);
  });

  it("keeps docs and the current-gate runner aligned with Gate BS closeout and Gate BT selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_FILE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("no-runtime");
      expect(content, path).toContain("not alias");
      expect(content, path).toContain("ASTM");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bs-floor-impact-astm-iic-aiic-runtime-corridor-contract.test.ts"
    );
  });
});

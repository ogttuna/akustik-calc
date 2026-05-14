import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { ImpactCalculationSchema } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bs";
import {
  buildPersonalUseMvpCoverageSprintGateBTAstmRatingAdapterBasisSet,
  buildPersonalUseMvpCoverageSprintGateBTBridgeProbes,
  buildPersonalUseMvpCoverageSprintGateBTContract,
  buildPersonalUseMvpCoverageSprintGateBTCurrentRuntimeBoundary,
  buildPersonalUseMvpCoverageSprintGateBTFieldAiicBridgeImpact,
  buildPersonalUseMvpCoverageSprintGateBTLabIicBridgeImpact,
  buildPersonalUseMvpCoverageSprintGateBTNegativeProbes,
  GATE_BT_ASTM_E989_AIIC_METRIC_BASIS,
  GATE_BT_ASTM_E989_BRIDGE_BASIS,
  GATE_BT_ASTM_E989_IIC_METRIC_BASIS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBULanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bt";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BT_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt-floor-impact-astm-iic-aiic-metric-schema-and-adapter-bridge-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bs.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bs-floor-impact-astm-iic-aiic-runtime-corridor-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_HANDOFF.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BT_FLOOR_IMPACT_ASTM_IIC_AIIC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_PLAN.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate BT floor-impact ASTM IIC/AIIC metric schema and adapter bridge", () => {
  it("lands Gate BT as a no-runtime schema bridge and selects the rating procedure owner next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBTContract();

    expect(contract).toMatchObject({
      astmRuntimePromoted: false,
      exactAstmSourcePrecedenceRuntimeOwnerMissing: true,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBS: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_FILE,
        selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_LABEL,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTION_STATUS
      },
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bs_floor_impact_astm_iic_aiic_metric_schema_adapter_bridge",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_BT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("lets ImpactCalculation carry ASTM IIC and AIIC only with owned ASTM metric basis", () => {
    const labIic = buildPersonalUseMvpCoverageSprintGateBTLabIicBridgeImpact();
    const fieldAiic = buildPersonalUseMvpCoverageSprintGateBTFieldAiicBridgeImpact();
    const negativeProbes = buildPersonalUseMvpCoverageSprintGateBTNegativeProbes();

    expect(ImpactCalculationSchema.safeParse(labIic).success).toBe(true);
    expect(ImpactCalculationSchema.safeParse(fieldAiic).success).toBe(true);
    expect(labIic).toMatchObject({
      IIC: 52,
      availableOutputs: ["IIC"],
      basis: GATE_BT_ASTM_E989_BRIDGE_BASIS,
      labOrField: "lab",
      metricBasis: {
        IIC: GATE_BT_ASTM_E989_IIC_METRIC_BASIS
      }
    });
    expect(fieldAiic).toMatchObject({
      AIIC: 48,
      availableOutputs: ["AIIC"],
      basis: GATE_BT_ASTM_E989_BRIDGE_BASIS,
      labOrField: "field",
      metricBasis: {
        AIIC: GATE_BT_ASTM_E989_AIIC_METRIC_BASIS
      }
    });
    expect(negativeProbes.map((probe) => probe.id)).toEqual([
      "iic_value_without_astm_metric_basis_rejected",
      "iic_value_without_lab_context_rejected",
      "aiic_value_without_field_context_rejected",
      "iic_available_without_value_rejected"
    ]);
    expect(negativeProbes.every((probe) => probe.parseSuccess === false)).toBe(true);
  });

  it("opens target-output support only for matching ASTM bridge probes", () => {
    const probes = buildPersonalUseMvpCoverageSprintGateBTBridgeProbes();
    const iic = probes.find((probe) => probe.metricId === "IIC");
    const aiic = probes.find((probe) => probe.metricId === "AIIC");

    expect(iic).toMatchObject({
      basis: GATE_BT_ASTM_E989_BRIDGE_BASIS,
      labOrField: "lab",
      metricBasis: GATE_BT_ASTM_E989_IIC_METRIC_BASIS,
      runtimeEvidence: false,
      sourceRowsIngested: false,
      support: {
        supportedImpactOutputs: ["IIC"],
        supportedTargetOutputs: ["IIC"],
        targetOutputs: ["IIC", "AIIC"],
        unsupportedImpactOutputs: ["AIIC"],
        unsupportedTargetOutputs: ["AIIC"]
      },
      valueDb: 52
    });
    expect(aiic).toMatchObject({
      basis: GATE_BT_ASTM_E989_BRIDGE_BASIS,
      labOrField: "field",
      metricBasis: GATE_BT_ASTM_E989_AIIC_METRIC_BASIS,
      runtimeEvidence: false,
      sourceRowsIngested: false,
      support: {
        supportedImpactOutputs: ["AIIC"],
        supportedTargetOutputs: ["AIIC"],
        targetOutputs: ["IIC", "AIIC"],
        unsupportedImpactOutputs: ["IIC"],
        unsupportedTargetOutputs: ["IIC"]
      },
      valueDb: 48
    });
  });

  it("keeps current runtime unsupported for ASTM IIC and AIIC", () => {
    const runtimeBoundary = buildPersonalUseMvpCoverageSprintGateBTCurrentRuntimeBoundary();
    const contract = buildPersonalUseMvpCoverageSprintGateBTContract();

    expect(runtimeBoundary).toEqual({
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["IIC", "AIIC"]
    });
    expect(contract.currentRuntimeStillUnsupported).toEqual(runtimeBoundary);
    expect(contract.astmRuntimePromoted).toBe(false);
    expect(contract.noRuntimeValueMovement).toBe(true);
  });

  it("removes schema bridge blockers from planned adapters but keeps runtime procedure blockers", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBTContract();
    const adapters = buildPersonalUseMvpCoverageSprintGateBTAstmRatingAdapterBasisSet();
    const blockedReasons = adapters.flatMap((adapter) => adapter.blockedReasons);

    expect(adapters.map((adapter) => adapter.metricId)).toEqual(["IIC", "AIIC"]);
    expect(adapters.every((adapter) => adapter.implementationStatus === "planned_not_implemented")).toBe(true);
    expect(adapters.every((adapter) => adapter.ratingStandard === "ASTM E989")).toBe(true);
    expect(adapters.find((adapter) => adapter.metricId === "IIC")?.blockedReasons).toEqual([
      "astmE989ExecutableIicContourRatingProcedureOwner",
      "exactAstmSourcePrecedenceRuntimeOwner",
      "astmIicVisibleSurfaceParityOwner"
    ]);
    expect(adapters.find((adapter) => adapter.metricId === "AIIC")?.blockedReasons).toEqual([
      "astmE989ExecutableAiicApparentRatingProcedureOwner",
      "exactAstmSourcePrecedenceRuntimeOwner",
      "astmAiicVisibleSurfaceParityOwner"
    ]);

    for (const ownedBridgeTerm of contract.schemaBridgeOwns) {
      expect(blockedReasons, ownedBridgeTerm).not.toContain(ownedBridgeTerm);
    }
  });

  it("ranks Gate BU rating procedure and exact-source ownership ahead of broad source crawling", () => {
    const lanes = rankPersonalUseMvpCoverageSprintGateBULanes();
    const selected = lanes.find((lane) => lane.selected);

    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      id: "astm_iic_aiic_rating_procedure_exact_source_owner",
      runtimeMovementAllowedAtGateBT: false,
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

  it("keeps docs and the current-gate runner aligned with Gate BT closeout and Gate BU selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_FILE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("no-runtime");
      expect(content, path).toContain("not alias");
      expect(content, path).toContain("ASTM");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bt-floor-impact-astm-iic-aiic-metric-schema-and-adapter-bridge-contract.test.ts"
    );
  });
});

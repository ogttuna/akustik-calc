import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  POST_V1_GATE_EN_COUNTERS,
  POST_V1_GATE_EN_OWNER_ID,
  POST_V1_GATE_EN_OWNER_LEDGER,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_FILE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTION_STATUS,
  buildPostV1GateENRuntimeReadinessEvidence
} from "./post-v1-wall-direct-fixed-double-leaf-bridge-loss-owner-gate-en";
import {
  POST_V1_GATE_EO_COUNTERS,
  POST_V1_GATE_EO_PLAN_DOC_PATH,
  POST_V1_GATE_EO_RUNTIME_ASSERTIONS,
  POST_V1_GATE_EO_TARGET_OUTPUTS,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_FILE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_LABEL,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTION_STATUS,
  buildPostV1GateEORuntimeEvidence,
  summarizePostV1WallDirectFixedDoubleLeafBridgeLossRuntimeGateEO
} from "./post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
  POST_V1_GATE_EO_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall direct-fixed double-leaf bridge-loss runtime Gate EO", () => {
  it("lands after Gate EN, moves runtime through the direct-fixed owner, and selects Gate EP", () => {
    const gateENReadiness = buildPostV1GateENRuntimeReadinessEvidence();
    const summary = summarizePostV1WallDirectFixedDoubleLeafBridgeLossRuntimeGateEO();

    expect(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTION_STATUS).toBe(
      "post_v1_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en_landed_no_runtime_selected_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo"
    );
    expect(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_LANDED_GATE
    );
    expect(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo-contract.test.ts"
    );
    expect(gateENReadiness).toMatchObject({
      directFixedBridgeClass: "direct_fixed_bridge",
      directFixedCurrentReadinessStatus: "negative_boundary",
      directFixedInputCompletenessStatus: "complete",
      directFixedMissingPhysicalInputs: []
    });

    expect(summary).toMatchObject({
      counters: POST_V1_GATE_EO_COUNTERS,
      landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_LANDED_GATE,
      ownerId: POST_V1_GATE_EN_OWNER_ID,
      ownerLedger: POST_V1_GATE_EN_OWNER_LEDGER,
      previousGateEN: {
        counters: POST_V1_GATE_EN_COUNTERS,
        landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_LANDED_GATE,
        selectedNextAction: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTION_STATUS
      },
      selectedNextAction: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_EO_TARGET_OUTPUTS
    });
  });

  it("pins the complete direct-fixed lab metrics and selected runtime basis", () => {
    const evidence = buildPostV1GateEORuntimeEvidence();

    expect(evidence).toMatchObject({
      directFixedBasisMethod: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
      directFixedErrorBudgetDb: 6,
      directFixedMetrics: POST_V1_GATE_EO_RUNTIME_ASSERTIONS.directFixedExpectedMetrics,
      directFixedRuntimeValueMovement: true,
      directFixedSelectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
      directFixedSupportedOutputs: POST_V1_GATE_EO_TARGET_OUTPUTS,
      directFixedUnsupportedOutputs: []
    });
  });

  it("preserves route boundaries around the new direct-fixed owner", () => {
    const evidence = buildPostV1GateEORuntimeEvidence();

    expect(evidence.missingSpacingSelectedCandidateId).toBe(
      POST_V1_GATE_EO_RUNTIME_ASSERTIONS.missingSpacingExpectedCandidateId
    );
    expect(evidence.missingSpacingBasisMethod).toBe(
      "dynamic_calculator_route_input_contract_missing_physical_fields"
    );
    expect(evidence.missingSpacingMissingPhysicalInputs).toEqual(["supportSpacingMm"]);

    expect(evidence.fieldRequestSelectedCandidateId).not.toBe(
      GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID
    );
    expect(evidence.fieldRequestBasisMethod).not.toBe(
      GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD
    );
    expect(evidence.fieldRequestSupportedOutputs).toEqual(["R'w", "DnT,w"]);

    expect(evidence.independentBasisMethod).toBe(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD);
    expect(evidence.independentRw).toBe(45);
    expect(evidence.independentSelectedCandidateId).toBe(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID);
  });

  it("keeps Gate EO counters honest about accuracy correction rather than source crawling or frontend work", () => {
    expect(POST_V1_GATE_EO_COUNTERS).toMatchObject({
      fieldBuildingRequestShapesWidened: 0,
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 1,
      runtimeCorrectedLayerTemplates: 1,
      runtimeCorrectedRequestShapes: 4,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 4,
      sourceRowsImported: 0
    });
  });

  it("keeps docs and current-gate runner aligned with Gate EO closeout and Gate EP selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD);
      expect(contents, path).toContain("Rw 31 / STC 31 / C -1.2 / Ctr -5.9");
      expect(contents, path).toContain("runtimeCorrectedRequestShapes 4");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo-contract.test.ts"
    );
  });
});

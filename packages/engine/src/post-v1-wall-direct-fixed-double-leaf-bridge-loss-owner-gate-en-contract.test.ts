import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_EM_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EM_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-em";
import {
  POST_V1_GATE_EN_COUNTERS,
  POST_V1_GATE_EN_OWNER_ID,
  POST_V1_GATE_EN_OWNER_LEDGER,
  POST_V1_GATE_EN_PLAN_DOC_PATH,
  POST_V1_GATE_EN_REJECTED_BOUNDARIES,
  POST_V1_GATE_EN_REQUIRED_OWNER_FIELDS,
  POST_V1_GATE_EN_TARGET_OUTPUTS,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_FILE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_LABEL,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTION_STATUS,
  buildPostV1GateENRuntimeReadinessEvidence,
  summarizePostV1WallDirectFixedDoubleLeafBridgeLossOwnerGateEN
} from "./post-v1-wall-direct-fixed-double-leaf-bridge-loss-owner-gate-en";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
  POST_V1_GATE_EN_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall direct-fixed double-leaf bridge-loss owner Gate EN", () => {
  it("lands after Gate EM, accepts the owner no-runtime, and selects Gate EO runtime", () => {
    const summary = summarizePostV1WallDirectFixedDoubleLeafBridgeLossOwnerGateEN();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_em_landed_no_runtime_selected_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-owner-gate-en-contract.test.ts"
    );

    expect(summary).toMatchObject({
      counters: POST_V1_GATE_EN_COUNTERS,
      landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_LANDED_GATE,
      noRuntimeValueMovement: true,
      ownerId: POST_V1_GATE_EN_OWNER_ID,
      ownerLedger: POST_V1_GATE_EN_OWNER_LEDGER,
      planDocPath: POST_V1_GATE_EN_PLAN_DOC_PATH,
      previousGateEM: {
        counters: POST_V1_GATE_EM_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_LANDED_GATE,
        selectedCandidateId: POST_V1_GATE_EM_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTION_STATUS
      },
      rejectedBoundaries: POST_V1_GATE_EN_REJECTED_BOUNDARIES,
      selectedNextAction: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_EN_TARGET_OUTPUTS
    });
  });

  it("pins the direct-fixed owner fields and keeps runtime value movement at zero", () => {
    expect(POST_V1_GATE_EN_REQUIRED_OWNER_FIELDS).toEqual([
      "sideALeafGroup",
      "sideBLeafGroup",
      "sideALeafMassKgM2",
      "sideBLeafMassKgM2",
      "cavity1DepthMm",
      "supportTopology=direct_fixed",
      "connectionType=direct_fix",
      "supportSpacingMm",
      "directFixedEquivalentCoupledMassOwner",
      "directFixedBridgeLossOwner",
      "directFixedNoMassAirMassBoostBoundary",
      "ISO717_1_Rw_adapter",
      "ASTM_E413_STC_adapter_boundary"
    ]);
    expect(POST_V1_GATE_EN_OWNER_LEDGER).toMatchObject({
      acceptedFormerGateRNegativeReason:
        "direct_fixed_bridge_behaves_like_mechanically_coupled_single_partition_until_a_dedicated_bridge_loss_model_is_owned",
      formulaCorridorId: "wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner",
      ownerId: POST_V1_GATE_EN_OWNER_ID,
      ownerStatus: "accepted_no_runtime",
      runtimePromotionAllowed: false,
      sourceRowsRequiredForOwner: false,
      targetOutputs: POST_V1_GATE_EN_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_EN_COUNTERS).toMatchObject({
      acceptedOwnerLedgers: 1,
      boundaryLedgersPinned: POST_V1_GATE_EN_REJECTED_BOUNDARIES.length,
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("proves the current direct-fixed boundary is complete input, not missing input, and keeps Gate S families separate", () => {
    const evidence = buildPostV1GateENRuntimeReadinessEvidence();

    expect(evidence).toMatchObject({
      directFixedBridgeClass: "direct_fixed_bridge",
      directFixedCurrentReadinessStatus: "negative_boundary",
      directFixedInputCompletenessStatus: "complete",
      directFixedMissingPhysicalInputs: [],
      independentCurrentReadinessStatus: "solver_candidate_ready",
      independentRemainsExistingGateSFamily: "double_stud_system",
      ownerLedgerFormulaCorridor: "wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner",
      runtimePromotionAllowedNow: false
    });
    expect(evidence.directFixedNegativeBoundaryReasons).toEqual(
      expect.arrayContaining([
        "direct_fixed_bridge_behaves_like_mechanically_coupled_single_partition_until_a_dedicated_bridge_loss_model_is_owned"
      ])
    );
  });

  it("pins negative boundaries so the owner proof cannot widen into wrong metric or wrong family routes", () => {
    expect(POST_V1_GATE_EN_REJECTED_BOUNDARIES).toEqual([
      {
        boundary: "gate_s_non_direct_fixed_stays_on_existing_owner",
        id: "independent_twin_shared_and_resilient_double_leaf_stay_gate_s",
        reason:
          "The new owner is only for direct-fixed bridge loss; independent, twin-frame, shared-stud, and resilient systems stay on the existing Gate S corridor."
      },
      {
        boundary: "missing_route_physical_inputs_need_input",
        id: "missing_leaf_group_cavity_support_or_spacing_stays_needs_input",
        reason:
          "Direct-fixed owner selection still requires explicit leaf groups, cavity depth, direct-fixed support topology, connection type, and spacing."
      },
      {
        boundary: "multicavity_or_triple_leaf_family_boundary",
        id: "multicavity_and_triple_leaf_do_not_collapse_to_direct_fixed_double_leaf",
        reason:
          "Multicavity and triple-leaf routes keep their separate topology owners rather than being forced into the direct-fixed two-leaf owner."
      },
      {
        boundary: "field_building_metric_alias_rejected",
        id: "lab_rw_stc_c_ctr_do_not_alias_to_field_or_building_outputs",
        reason:
          "Gate EN owns only lab Rw/STC/C/Ctr readiness; R'w, Dn,w, and DnT,w require explicit field/building adapters."
      },
      {
        boundary: "source_row_catalog_not_required",
        id: "finite_direct_fixed_source_row_crawl_not_selected",
        reason:
          "No finite source-row catalog is needed for this owner proof; source rows can later calibrate or hold out the selected owner."
      }
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate EN closeout and Gate EO selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EN_OWNER_ID);
      expect(contents, path).toContain("Gate EO");
      expect(contents, path).toContain("equivalent coupled mass");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const plan = readRepoFile(POST_V1_GATE_EN_PLAN_DOC_PATH);
    expect(plan).toContain("Gate EN Owner Proof Result");
    expect(plan).toContain("wall.direct_fixed_double_leaf.bridge_loss_owner");
    expect(plan).toContain("wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner");
    expect(plan).toContain("Gate EO Work Order");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-em-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-owner-gate-en-contract.test.ts"
    );
  });
});

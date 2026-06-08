import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_EP_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EP_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ep";
import {
  POST_V1_GATE_EQ_ADAPTER_OWNER_LEDGERS,
  POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_ID,
  POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_LEDGER,
  POST_V1_GATE_EQ_BUILDING_ADAPTER_REQUIRED_OWNER_FIELDS,
  POST_V1_GATE_EQ_COUNTERS,
  POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_ID,
  POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_LEDGER,
  POST_V1_GATE_EQ_FIELD_ADAPTER_REQUIRED_OWNER_FIELDS,
  POST_V1_GATE_EQ_OWNER_ASSERTIONS,
  POST_V1_GATE_EQ_PLAN_DOC_PATH,
  POST_V1_GATE_EQ_REJECTED_BOUNDARIES,
  POST_V1_GATE_EQ_SELECTED_RUNTIME_PLAN_DOC_PATH,
  POST_V1_GATE_EQ_TARGET_OUTPUTS,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_FILE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_LABEL,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTION_STATUS,
  buildPostV1GateEQOwnerReadinessEvidence,
  summarizePostV1WallDirectFixedDoubleLeafFieldBuildingAdapterOwnerGateEQ
} from "./post-v1-wall-direct-fixed-double-leaf-field-building-adapter-owner-gate-eq";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  POST_V1_GATE_EQ_PLAN_DOC_PATH,
  POST_V1_GATE_EQ_SELECTED_RUNTIME_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall direct-fixed double-leaf field/building adapter owner Gate EQ", () => {
  it("lands after Gate EP, accepts field/building adapter owners no-runtime, and selects Gate ER runtime", () => {
    const summary = summarizePostV1WallDirectFixedDoubleLeafFieldBuildingAdapterOwnerGateEQ();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ep_landed_no_runtime_selected_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-owner-gate-eq-contract.test.ts"
    );

    expect(summary).toMatchObject({
      adapterOwnerLedgers: POST_V1_GATE_EQ_ADAPTER_OWNER_LEDGERS,
      counters: POST_V1_GATE_EQ_COUNTERS,
      landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_LANDED_GATE,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EQ_PLAN_DOC_PATH,
      previousGateEP: {
        counters: POST_V1_GATE_EP_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_LANDED_GATE,
        selectedCandidateId: POST_V1_GATE_EP_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTION_STATUS
      },
      rejectedBoundaries: POST_V1_GATE_EQ_REJECTED_BOUNDARIES,
      selectedNextAction:
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_LABEL,
      selectedRuntimePlanDocPath: POST_V1_GATE_EQ_SELECTED_RUNTIME_PLAN_DOC_PATH,
      selectionStatus: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_EQ_TARGET_OUTPUTS
    });
  });

  it("pins two adapter owner ledgers and keeps runtime value movement at zero", () => {
    expect(POST_V1_GATE_EQ_FIELD_ADAPTER_REQUIRED_OWNER_FIELDS).toEqual([
      "baseCurve=wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner",
      "contextMode=field_between_rooms",
      "panelWidthMm",
      "panelHeightMm",
      "partitionAreaM2_from_panel_dimensions",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "fieldMetricAdapter:R'w/Dn,w/DnT,w",
      "ISO12354_1_direct_separating_element_curve_owner",
      "ISO12354_1_field_apparent_adapter",
      "ISO717_1_rating_adapter"
    ]);
    expect(POST_V1_GATE_EQ_BUILDING_ADAPTER_REQUIRED_OWNER_FIELDS).toEqual([
      "baseCurve=wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner",
      "contextMode=building_prediction",
      "panelWidthMm",
      "panelHeightMm",
      "sourceRoomVolumeM3",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "flankingJunctionClass",
      "conservativeFlankingAssumption",
      "buildingPredictionOutputBasis",
      "junctionCouplingLengthM",
      "ISO12354_1_direct_separating_element_curve_owner",
      "ISO12354_1_flanking_junction_adapter",
      "ISO12354_1_room_standardization_adapter",
      "ISO717_1_rating_adapter"
    ]);
    expect(POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_LEDGER).toMatchObject({
      ownerId: POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_ID,
      ownerStatus: "accepted_no_runtime",
      runtimePromotionAllowed: false,
      sourceRowsRequiredForOwner: false,
      targetOutputs: POST_V1_GATE_EQ_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_LEDGER).toMatchObject({
      ownerId: POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_ID,
      ownerStatus: "accepted_no_runtime",
      runtimePromotionAllowed: false,
      sourceRowsRequiredForOwner: false,
      targetOutputs: POST_V1_GATE_EQ_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_EQ_COUNTERS).toMatchObject({
      acceptedAdapterOwnerLedgers: 2,
      boundaryLedgersPinned: POST_V1_GATE_EQ_REJECTED_BOUNDARIES.length,
      estimatedNextNewCalculableLayerTemplates: 1,
      estimatedNextNewCalculableRequestShapes: 3,
      estimatedNextRuntimeCorrectedLayerTemplates: 1,
      estimatedNextRuntimeCorrectedRequestShapes: 3,
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("proves current runtime evidence still has the field/building gap while the owner is accepted", () => {
    const evidence = buildPostV1GateEQOwnerReadinessEvidence();

    expect(evidence).toMatchObject({
      buildingAdapterRuntimeMethodOwner: POST_V1_GATE_EQ_OWNER_ASSERTIONS.buildingAdapterRuntimeMethodOwner,
      buildingCurrentBasisMethod: POST_V1_GATE_EQ_OWNER_ASSERTIONS.buildingCurrentUnsupportedMethod,
      buildingCurrentSelectedCandidateId:
        POST_V1_GATE_EQ_OWNER_ASSERTIONS.buildingCurrentUnsupportedSelectedCandidateId,
      buildingCurrentSupportedOutputs: [],
      buildingCurrentUnsupportedOutputs: POST_V1_GATE_EQ_TARGET_OUTPUTS,
      buildingRuntimePromotionAllowedNow: false,
      fieldAdapterRuntimeMethodOwner: POST_V1_GATE_EQ_OWNER_ASSERTIONS.fieldAdapterRuntimeMethodOwner,
      fieldCurrentBasisMethod: POST_V1_GATE_EQ_OWNER_ASSERTIONS.fieldCurrentScreeningMethod,
      fieldCurrentMetrics: POST_V1_GATE_EQ_OWNER_ASSERTIONS.fieldExpectedMetrics,
      fieldCurrentSelectedCandidateId: POST_V1_GATE_EQ_OWNER_ASSERTIONS.fieldCurrentScreeningCandidateId,
      fieldCurrentSupportedOutputs: POST_V1_GATE_EQ_TARGET_OUTPUTS,
      fieldCurrentUnsupportedOutputs: [],
      fieldRuntimePromotionAllowedNow: false,
      labBaseCurveBasisMethod: POST_V1_GATE_EQ_OWNER_ASSERTIONS.labBaseCurveMethod,
      labBaseCurveSelectedCandidateId: POST_V1_GATE_EQ_OWNER_ASSERTIONS.labBaseCurveSelectedCandidateId,
      missingFieldRt60BasisMethod: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingFieldRt60MissingPhysicalInputs: ["receivingRoomRt60S"],
      runtimePromotionAllowedNow: false
    });
    expect(evidence.fieldCurrentBasisMethod).not.toBe(POST_V1_GATE_EQ_OWNER_ASSERTIONS.fieldAdapterRuntimeMethodOwner);
    expect(evidence.buildingCurrentBasisMethod).not.toBe(
      POST_V1_GATE_EQ_OWNER_ASSERTIONS.buildingAdapterRuntimeMethodOwner
    );
  });

  it("pins negative boundaries so Gate EQ cannot widen into aliases, guessed inputs, or source crawling", () => {
    expect(POST_V1_GATE_EQ_REJECTED_BOUNDARIES).toEqual([
      {
        boundary: "lab_metric_alias_rejected",
        id: "lab_rw_stc_c_ctr_do_not_publish_field_or_building_metrics",
        reason:
          "The Gate EO lab curve can be the direct separating-element base, but lab Rw/STC/C/Ctr are not relabelled as R'w, Dn,w, or DnT,w."
      },
      {
        boundary: "missing_field_context_stays_needs_input",
        id: "missing_receiving_room_rt60_stays_needs_input",
        reason:
          "The field adapter owns only explicit field_between_rooms context with partition area, receiving-room volume, and receiving-room RT60."
      },
      {
        boundary: "missing_building_context_stays_blocked",
        id: "missing_building_prediction_flanking_context_stays_blocked",
        reason:
          "The building adapter owns only explicit building_prediction context with source/receiving volumes, RT60, flanking class, conservative assumption, output basis, and coupling length."
      },
      {
        boundary: "missing_support_spacing_stays_needs_input",
        id: "missing_direct_fixed_support_spacing_stays_gate_eo_needs_input",
        reason:
          "The field/building adapters require the Gate EO direct curve first; missing supportSpacingMm still blocks that base curve as needs_input."
      },
      {
        boundary: "non_direct_fixed_families_stay_existing_adapters",
        id: "independent_resilient_shared_and_twin_frame_routes_stay_gate_s_i_ar",
        reason:
          "Non-direct-fixed double-leaf/framed systems already use Gate S plus Gate I/AR when complete physical inputs are present."
      },
      {
        boundary: "multicavity_or_triple_leaf_family_boundary",
        id: "multicavity_and_triple_leaf_routes_do_not_collapse_to_direct_fixed_double_leaf",
        reason:
          "Gate EQ is limited to the visible two-leaf, one-cavity direct-fixed subset; multicavity and triple-leaf routes keep their own topology owners."
      },
      {
        boundary: "building_runtime_waits_for_gate_er",
        id: "complete_building_prediction_requests_remain_unsupported_until_runtime_gate",
        reason:
          "Gate EQ proves adapter ownership only; complete building_prediction requests still wait for Gate ER before runtime values move."
      },
      {
        boundary: "source_row_catalog_not_required",
        id: "finite_field_building_source_row_crawl_not_selected",
        reason:
          "No finite field/building source-row catalog is needed for this owner proof; source rows can later calibrate or hold out the selected adapters."
      }
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate EQ closeout and Gate ER selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_ID);
      expect(contents, path).toContain(POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_ID);
      expect(contents, path).toContain("Gate ER");
      expect(normalizedWhitespaceContent, path).toContain("direct-fixed double-leaf field/building adapter runtime");
      expect(contents, path).toContain("acceptedAdapterOwnerLedgers 2");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const gateEpEqPlan = readRepoFile(POST_V1_GATE_EQ_PLAN_DOC_PATH);
    expect(gateEpEqPlan).toContain("Gate EQ Owner Proof Result");
    expect(gateEpEqPlan).toContain(POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_ID);
    expect(gateEpEqPlan).toContain(POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_ID);
    expect(gateEpEqPlan).toContain("Gate ER Work Order");

    const gateErPlan = readRepoFile(POST_V1_GATE_EQ_SELECTED_RUNTIME_PLAN_DOC_PATH);
    expect(gateErPlan).toContain("Gate ER Iteration 1");
    expect(gateErPlan).toContain("Gate ER Iteration 2");
    expect(gateErPlan).toContain("Gate ER Work Order");
    expect(gateErPlan).toContain("move runtime values");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ep-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-owner-gate-eq-contract.test.ts"
    );
  });
});

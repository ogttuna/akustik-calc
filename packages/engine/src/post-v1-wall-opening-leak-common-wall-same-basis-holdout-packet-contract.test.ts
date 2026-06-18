import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";
import {
  POST_V1_GATE_FB_COUNTERS,
  POST_V1_GATE_FB_OWNER_DECISION_ID,
  POST_V1_GATE_FB_REJECTED_BOUNDARIES,
  POST_V1_GATE_FB_TARGET_OUTPUTS,
  buildPostV1GateFBFrozenRuntimePins,
  buildPostV1GateFBOwnerLedgers
} from "./post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb";
import {
  POST_V1_GATE_CJ_BUILDING_VALUE_PINS
} from "./post-v1-wall-common-auto-topology-expansion-gate-cj";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_landed_no_runtime_selected_wall_opening_leak_common_wall_same_basis_holdout_packet";

const PACKET_ACTION =
  "post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_plan";
const PACKET_FILE =
  "packages/engine/src/post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts";
const PACKET_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_OPENING_LEAK_COMMON_WALL_SAME_BASIS_HOLDOUT_PACKET_PLAN_2026-06-18.md";
const PACKET_STATUS =
  "post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_landed_no_runtime_selected_runtime_first_route_family_rerank";
const PACKET_SELECTED_CANDIDATE_ID =
  "wall.opening_leak_common_wall_same_basis_holdout_packet";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_common_wall_same_basis_holdout_packet_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_OPENING_LEAK_COMMON_WALL_SAME_BASIS_HOLDOUT_PACKET_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after wall opening/leak common-wall same-basis holdout packet";

const TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const ROUTE_REQUIRED_PHYSICAL_INPUTS = [
  "hostWallAreaM2",
  "openingLeakElements",
  "panelWidthMm",
  "panelHeightMm",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "sourceRoomVolumeM3",
  "flankingJunctionClass",
  "junctionCouplingLengthM",
  "conservativeFlankingAssumption",
  "buildingPredictionOutputBasis"
] as const;

const PACKET_COUNTERS = {
  acceptedSameBasisHoldoutRows: 0,
  benchmarkOnlyRows: 4,
  evidencePacketsReviewed: 1,
  estimatedRuntimeValuesMovedAfterEvidence: TARGET_OUTPUTS.length,
  frontendImplementationFilesTouched: 0,
  localCandidateRowsReviewed: 7,
  rejectedCandidateRows: 3,
  routeRequiredPhysicalInputsNamed: ROUTE_REQUIRED_PHYSICAL_INPUTS.length,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sameBasisHoldoutRowsRequiredBeforeRuntimeOwner: 1,
  sourceRowsImported: 0
} as const;

type PacketFamily = "common_wall" | "opening_leak" | "opening_leak_common_wall";

type PacketBasis =
  | "building_prediction"
  | "building_prediction_a_weighted"
  | "element_lab"
  | "field_apparent"
  | "field_apparent_a_weighted"
  | "unknown";

type EvidenceRowKind =
  | "future_acceptance_probe"
  | "lab_anchor"
  | "near_miss_source_context"
  | "source_absent_runtime_output"
  | "source_owned_measured_row";

type EvidenceDecision =
  | "accepted_same_family_same_basis_holdout"
  | "benchmark_only_source_absent_runtime_output"
  | "rejected_missing_construction_boundary"
  | "rejected_missing_route_required_inputs"
  | "rejected_rights_or_locator_missing"
  | "rejected_wrong_metric_basis";

type PacketUse = "anchor" | "benchmark_only" | "calibration_holdout" | "exact";

type EvidenceCandidate = {
  readonly constructionBoundaryOwned: boolean;
  readonly family: PacketFamily;
  readonly id: string;
  readonly intendedUse: PacketUse;
  readonly metricBasis: PacketBasis;
  readonly metricBasisMatchesTarget: boolean;
  readonly missingRequiredInputs: readonly string[];
  readonly rowKind: EvidenceRowKind;
  readonly rightsSafeLocatorPresent: boolean;
  readonly sourceAbsentRuntimeOutput: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
};

type EvaluatedEvidenceCandidate = EvidenceCandidate & {
  readonly countsTowardRuntimeOwner: boolean;
  readonly decision: EvidenceDecision;
  readonly runtimeValueMovementAllowedNow: false;
};

const LOCAL_EVIDENCE_CANDIDATES = [
  {
    constructionBoundaryOwned: true,
    family: "opening_leak",
    id: "gate_s_opening_leak_composite_lab_anchor",
    intendedUse: "anchor",
    metricBasis: "element_lab",
    metricBasisMatchesTarget: false,
    missingRequiredInputs: [],
    rowKind: "lab_anchor",
    rightsSafeLocatorPresent: true,
    sourceAbsentRuntimeOutput: false,
    targetOutputs: ["Rw", "STC"]
  },
  {
    constructionBoundaryOwned: true,
    family: "opening_leak",
    id: "company_internal_opening_leak_field_runtime_probe",
    intendedUse: "benchmark_only",
    metricBasis: "field_apparent",
    metricBasisMatchesTarget: true,
    missingRequiredInputs: [],
    rowKind: "source_absent_runtime_output",
    rightsSafeLocatorPresent: true,
    sourceAbsentRuntimeOutput: true,
    targetOutputs: ["R'w", "Dn,w", "DnT,w"]
  },
  {
    constructionBoundaryOwned: true,
    family: "opening_leak",
    id: "company_internal_opening_leak_building_runtime_probe",
    intendedUse: "benchmark_only",
    metricBasis: "building_prediction",
    metricBasisMatchesTarget: true,
    missingRequiredInputs: [],
    rowKind: "source_absent_runtime_output",
    rightsSafeLocatorPresent: true,
    sourceAbsentRuntimeOutput: true,
    targetOutputs: ["R'w", "DnT,w"]
  },
  {
    constructionBoundaryOwned: true,
    family: "opening_leak",
    id: "company_internal_opening_leak_a_weighted_runtime_probe",
    intendedUse: "benchmark_only",
    metricBasis: "building_prediction_a_weighted",
    metricBasisMatchesTarget: true,
    missingRequiredInputs: [],
    rowKind: "source_absent_runtime_output",
    rightsSafeLocatorPresent: true,
    sourceAbsentRuntimeOutput: true,
    targetOutputs: ["DnT,A"]
  },
  {
    constructionBoundaryOwned: true,
    family: "common_wall",
    id: "gate_cj_common_flat_double_leaf_building_value_pins",
    intendedUse: "benchmark_only",
    metricBasis: "building_prediction",
    metricBasisMatchesTarget: true,
    missingRequiredInputs: [],
    rowKind: "source_absent_runtime_output",
    rightsSafeLocatorPresent: true,
    sourceAbsentRuntimeOutput: true,
    targetOutputs: TARGET_OUTPUTS
  },
  {
    constructionBoundaryOwned: true,
    family: "common_wall",
    id: "knauf_w111_w112_lab_field_family_evidence",
    intendedUse: "anchor",
    metricBasis: "field_apparent",
    metricBasisMatchesTarget: false,
    missingRequiredInputs: ["sourceRoomVolumeM3", "junctionCouplingLengthM", "buildingPredictionOutputBasis"],
    rowKind: "near_miss_source_context",
    rightsSafeLocatorPresent: true,
    sourceAbsentRuntimeOutput: false,
    targetOutputs: ["Rw", "R'w"]
  },
  {
    constructionBoundaryOwned: false,
    family: "opening_leak_common_wall",
    id: "unspecified_catalog_common_wall_or_opening_row",
    intendedUse: "calibration_holdout",
    metricBasis: "unknown",
    metricBasisMatchesTarget: false,
    missingRequiredInputs: ROUTE_REQUIRED_PHYSICAL_INPUTS,
    rowKind: "near_miss_source_context",
    rightsSafeLocatorPresent: false,
    sourceAbsentRuntimeOutput: false,
    targetOutputs: TARGET_OUTPUTS
  }
] as const satisfies readonly EvidenceCandidate[];

const ACCEPTED_FUTURE_PACKET_PROBE = {
  constructionBoundaryOwned: true,
  family: "opening_leak_common_wall",
  id: "future_rights_safe_same_basis_building_prediction_holdout_packet",
  intendedUse: "calibration_holdout",
  metricBasis: "building_prediction",
  metricBasisMatchesTarget: true,
  missingRequiredInputs: [],
  rowKind: "future_acceptance_probe",
  rightsSafeLocatorPresent: true,
  sourceAbsentRuntimeOutput: false,
  targetOutputs: TARGET_OUTPUTS
} as const satisfies EvidenceCandidate;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  PACKET_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function evaluateEvidenceCandidate(row: EvidenceCandidate): EvaluatedEvidenceCandidate {
  if (!row.rightsSafeLocatorPresent) {
    return {
      ...row,
      countsTowardRuntimeOwner: false,
      decision: "rejected_rights_or_locator_missing",
      runtimeValueMovementAllowedNow: false
    };
  }

  if (!row.constructionBoundaryOwned) {
    return {
      ...row,
      countsTowardRuntimeOwner: false,
      decision: "rejected_missing_construction_boundary",
      runtimeValueMovementAllowedNow: false
    };
  }

  if (row.missingRequiredInputs.length > 0) {
    return {
      ...row,
      countsTowardRuntimeOwner: false,
      decision: "rejected_missing_route_required_inputs",
      runtimeValueMovementAllowedNow: false
    };
  }

  if (!row.metricBasisMatchesTarget) {
    return {
      ...row,
      countsTowardRuntimeOwner: false,
      decision: "rejected_wrong_metric_basis",
      runtimeValueMovementAllowedNow: false
    };
  }

  if (row.sourceAbsentRuntimeOutput) {
    return {
      ...row,
      countsTowardRuntimeOwner: false,
      decision: "benchmark_only_source_absent_runtime_output",
      runtimeValueMovementAllowedNow: false
    };
  }

  return {
    ...row,
    countsTowardRuntimeOwner: true,
    decision: "accepted_same_family_same_basis_holdout",
    runtimeValueMovementAllowedNow: false
  };
}

function buildPacketSummary() {
  const localEvidence = LOCAL_EVIDENCE_CANDIDATES.map(evaluateEvidenceCandidate);
  const acceptedLocalHoldouts = localEvidence.filter((row) => row.countsTowardRuntimeOwner);
  const rejectedLocalRows = localEvidence.filter((row) => row.decision.startsWith("rejected_"));
  const benchmarkRows = localEvidence.filter(
    (row) => row.decision === "benchmark_only_source_absent_runtime_output"
  );
  const ownerLedgers = buildPostV1GateFBOwnerLedgers();

  if (acceptedLocalHoldouts.length !== 0) {
    throw new Error("Current packet must not admit runtime movement without a same-basis holdout row.");
  }

  if (ownerLedgers.some((ledger) => ledger.holdoutRowIds.length > 0)) {
    throw new Error("Gate FB ledgers unexpectedly gained holdout rows before this packet owner.");
  }

  return {
    acceptedFuturePacketProbe: evaluateEvidenceCandidate(ACCEPTED_FUTURE_PACKET_PROBE),
    acceptedLocalHoldouts,
    benchmarkRows,
    counters: PACKET_COUNTERS,
    frozenRuntimePins: buildPostV1GateFBFrozenRuntimePins(),
    landedGate: PACKET_ACTION,
    localEvidence,
    noRuntimeValueMovement: true,
    ownerDecisionId: POST_V1_GATE_FB_OWNER_DECISION_ID,
    packetPlanDoc: PACKET_PLAN_DOC,
    previousGateFBCounters: POST_V1_GATE_FB_COUNTERS,
    previousRerank: {
      landedGate: PREVIOUS_RERANK_ACTION,
      selectedNextFile: PREVIOUS_RERANK_FILE,
      selectionStatus: PREVIOUS_RERANK_STATUS
    },
    rejectedBoundaries: POST_V1_GATE_FB_REJECTED_BOUNDARIES,
    rejectedLocalRows,
    routeRequiredPhysicalInputs: ROUTE_REQUIRED_PHYSICAL_INPUTS,
    selectedCandidateId: PACKET_SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: PACKET_STATUS,
    targetOutputs: TARGET_OUTPUTS
  };
}

describe("post-V1 wall opening/leak common-wall same-basis holdout packet", () => {
  it("lands the no-runtime packet and selects a runtime-first rerank instead of a runtime owner", () => {
    const summary = buildPacketSummary();

    expect(summary).toMatchObject({
      acceptedLocalHoldouts: [],
      counters: PACKET_COUNTERS,
      landedGate: PACKET_ACTION,
      noRuntimeValueMovement: true,
      packetPlanDoc: PACKET_PLAN_DOC,
      previousRerank: {
        landedGate: PREVIOUS_RERANK_ACTION,
        selectedNextFile: PREVIOUS_RERANK_FILE,
        selectionStatus: PREVIOUS_RERANK_STATUS
      },
      selectedCandidateId: PACKET_SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: PACKET_STATUS,
      targetOutputs: TARGET_OUTPUTS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      PACKET_FILE,
      PACKET_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("classifies local candidates as benchmark-only or rejected until a rights-safe same-basis holdout exists", () => {
    const summary = buildPacketSummary();
    const byId = new Map(summary.localEvidence.map((row) => [row.id, row]));

    expect(summary.localEvidence).toHaveLength(PACKET_COUNTERS.localCandidateRowsReviewed);
    expect(summary.rejectedLocalRows).toHaveLength(PACKET_COUNTERS.rejectedCandidateRows);
    expect(summary.benchmarkRows).toHaveLength(PACKET_COUNTERS.benchmarkOnlyRows);
    expect(summary.acceptedLocalHoldouts).toEqual([]);

    expect(byId.get("gate_s_opening_leak_composite_lab_anchor")).toMatchObject({
      decision: "rejected_wrong_metric_basis",
      metricBasis: "element_lab",
      targetOutputs: ["Rw", "STC"]
    });
    expect(byId.get("company_internal_opening_leak_field_runtime_probe")).toMatchObject({
      decision: "benchmark_only_source_absent_runtime_output",
      metricBasis: "field_apparent",
      sourceAbsentRuntimeOutput: true,
      targetOutputs: ["R'w", "Dn,w", "DnT,w"]
    });
    expect(byId.get("company_internal_opening_leak_building_runtime_probe")).toMatchObject({
      decision: "benchmark_only_source_absent_runtime_output",
      metricBasis: "building_prediction",
      sourceAbsentRuntimeOutput: true,
      targetOutputs: ["R'w", "DnT,w"]
    });
    expect(byId.get("company_internal_opening_leak_a_weighted_runtime_probe")).toMatchObject({
      decision: "benchmark_only_source_absent_runtime_output",
      metricBasis: "building_prediction_a_weighted",
      sourceAbsentRuntimeOutput: true,
      targetOutputs: ["DnT,A"]
    });
    expect(byId.get("gate_cj_common_flat_double_leaf_building_value_pins")).toMatchObject({
      decision: "benchmark_only_source_absent_runtime_output",
      metricBasis: "building_prediction",
      sourceAbsentRuntimeOutput: true,
      targetOutputs: TARGET_OUTPUTS
    });
    expect(byId.get("knauf_w111_w112_lab_field_family_evidence")).toMatchObject({
      decision: "rejected_missing_route_required_inputs",
      missingRequiredInputs: ["sourceRoomVolumeM3", "junctionCouplingLengthM", "buildingPredictionOutputBasis"]
    });
    expect(byId.get("unspecified_catalog_common_wall_or_opening_row")).toMatchObject({
      decision: "rejected_rights_or_locator_missing",
      missingRequiredInputs: ROUTE_REQUIRED_PHYSICAL_INPUTS,
      rightsSafeLocatorPresent: false
    });
  });

  it("defines the future acceptance gate without moving current runtime values", () => {
    const summary = buildPacketSummary();

    expect(summary.acceptedFuturePacketProbe).toMatchObject({
      countsTowardRuntimeOwner: true,
      decision: "accepted_same_family_same_basis_holdout",
      family: "opening_leak_common_wall",
      metricBasis: "building_prediction",
      missingRequiredInputs: [],
      runtimeValueMovementAllowedNow: false,
      sourceAbsentRuntimeOutput: false,
      targetOutputs: TARGET_OUTPUTS
    });
    expect(summary.routeRequiredPhysicalInputs).toEqual(ROUTE_REQUIRED_PHYSICAL_INPUTS);
    expect(summary.counters).toMatchObject({
      acceptedSameBasisHoldoutRows: 0,
      estimatedRuntimeValuesMovedAfterEvidence: TARGET_OUTPUTS.length,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("freezes representative opening/leak and common-wall runtime pins while evidence is missing", () => {
    const pins = buildPacketSummary().frozenRuntimePins;

    expect(pins.openingLeakField).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
      metrics: {
        "Dn,A": null,
        "Dn,w": 36.7,
        "DnT,A": null,
        "DnT,w": 36.9,
        "R'w": 36.4
      },
      supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w"]
    });
    expect(pins.openingLeakBuilding).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
      metrics: {
        "Dn,A": null,
        "Dn,w": null,
        "DnT,A": null,
        "DnT,w": 32.1,
        "R'w": 31.6
      },
      supportedTargetOutputs: ["R'w", "DnT,w"]
    });
    expect(pins.openingLeakAWeightedField.metrics).toHaveProperty("Dn,A");
    expect(pins.openingLeakAWeightedField.metrics).toHaveProperty("DnT,A");
    expect(pins.openingLeakAWeightedBuilding.metrics).toHaveProperty("DnT,A");
    expect(pins.commonWallBuildingValuePins).toEqual(POST_V1_GATE_CJ_BUILDING_VALUE_PINS);
  });

  it("keeps prior owner ledgers rejected and prevents lab/field/building/A-weighted aliasing", () => {
    const summary = buildPacketSummary();
    const boundaryNames = new Set(summary.rejectedBoundaries.map((boundary) => boundary.boundary));

    expect(buildPostV1GateFBOwnerLedgers()).toHaveLength(POST_V1_GATE_FB_COUNTERS.ownerLedgersRejected);
    expect(new Set(POST_V1_GATE_FB_TARGET_OUTPUTS)).toEqual(new Set(TARGET_OUTPUTS));
    expect(boundaryNames).toEqual(new Set([
      "a_weighted_requires_explicit_frequency_band_set",
      "building_prediction_rows_do_not_calibrate_field_apparent",
      "common_wall_lab_field_rows_do_not_calibrate_building_prediction",
      "exact_same_stack_same_basis_rows_keep_precedence",
      "field_apparent_rows_do_not_calibrate_building_prediction",
      "lab_rw_stc_rows_do_not_calibrate_field_building_or_a_weighted",
      "missing_opening_leak_physical_inputs_stay_needs_input"
    ]));
    expect(summary.previousGateFBCounters).toMatchObject({
      runtimeBudgetTighteningAdmitted: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sameBasisHoldoutLedgersMissing: 5,
      sourceRowsImported: 0
    });
  });

  it("keeps active docs and the current-gate runner aligned with the packet and next rerank", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);
      const normalized = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(PACKET_ACTION);
      expect(contents, path).toContain(PACKET_STATUS);
      expect(contents, path).toContain(PACKET_FILE);
      expect(contents, path).toContain(PACKET_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(normalized, path).toContain("acceptedSameBasisHoldoutRows: 0");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-contract.test.ts"
    );
    expect(runner).toContain(
      "src/post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts"
    );
  });
});

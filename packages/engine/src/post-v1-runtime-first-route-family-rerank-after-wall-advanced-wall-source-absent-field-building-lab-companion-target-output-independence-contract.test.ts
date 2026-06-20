import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
  buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint,
  type AirborneContext,
  type LayerInput,
  type ProjectUserMeasuredWallAirborneFrequencyAnchor,
  type ProjectUserMeasuredWallAirborneFrequencyBands,
  type ProjectUserMeasuredWallConstructionSnapshot,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
} from "./project-user-measured-wall-airborne-frequency-compatible-delta";
import {
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
} from "./project-user-measured-wall-airborne-frequency-exact-curve-bridge";
import {
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_WARNING
} from "./project-user-measured-wall-airborne-frequency-field-building-adapter";
import { buildProjectUserMeasuredWallRwRequestSnapshot } from "./project-user-measured-wall-rw-exact-bridge";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner";

const SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 project/user measured wall airborne frequency field/building lab-companion basis integrity owner";

const HIGH_ROI_SELECTION_PLAN_DOC =
  "docs/calculator/HIGH_ROI_CALCULATOR_IMPLEMENTATION_SELECTION_PLAN_2026-06-18.md";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 4,
  estimatedNextCalculableTargetOutputs: 4,
  estimatedNextLabCompanionTargetOutputs: 4,
  estimatedNextRuntimeBasisPromotions: 4,
  estimatedNextRuntimeValuesMoved: 4,
  estimatedNextUnsupportedBoundariesProtected: 8,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_closed_chain"
  | "rejected_context_or_evidence_missing"
  | "rejected_frontend_first"
  | "rejected_other_agent_conflict"
  | "rejected_too_broad"
  | "selected_runtime_owner_ready";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly runtimeOwnerAuthorizedNext: boolean;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetOutputs: readonly (RequestedOutputId | "OITC")[];
};

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const EXACT_FIELD_MIXED_OUTPUTS = [
  "R'w",
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const BUILDING_MIXED_OUTPUTS = [
  "DnT,w",
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const RW_ONLY = ["Rw"] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_runtime_owner_ready",
    estimatedRuntimeValuesMoved: 4,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "Project/user measured airborne frequency curves already own lab Rw/STC/C/Ctr and the landed field/building adapter already owns Gate I / Gate AR values for exact and compatible measured curves. Mixed field/building requests already publish STC/C/Ctr from the measured curve, but still park lab Rw, so the next bounded owner should publish Rw from the measured curve basis without relabelling it as R'w.",
    routeFamily: "project_user_measured_wall_airborne_frequency.field_building_lab_companion_basis_integrity",
    runtimeOwnerAuthorizedNext: true,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: LAB_OUTPUTS
  },
  {
    decision: "rejected_closed_chain",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_closed",
    reason:
      "The immediately previous owner and refresh already made advanced-wall source-absent field/building lab companions target-output independent.",
    routeFamily: "wall.advanced_wall_source_absent.field_building_lab_companion_target_output_independence",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: LAB_OUTPUTS
  },
  {
    decision: "rejected_closed_chain",
    estimatedRuntimeValuesMoved: 0,
    id: "project_user_measured_wall_airborne_frequency_field_building_adapter_owner_closed",
    reason:
      "The project/user measured-frequency field/building adapter already opened R'w, Dn,w, Dn,A, DnT,w, and DnT,A for exact and compatible measured curves.",
    routeFamily: "project_user_measured_wall_airborne_frequency.field_building_adapter",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: FIELD_BUILDING_OUTPUTS
  },
  {
    decision: "rejected_context_or_evidence_missing",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.opening_leak_common_wall_same_basis_holdout_packet",
    reason:
      "Opening/leak and common-wall residuals remain valuable, but the local holdout packet path already found no accepted same-basis holdout rows. It should not displace a measured-curve route with owned lab and field/building bases.",
    routeFamily: "wall.opening_leak.common_wall.building_prediction",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: true,
    targetOutputs: FIELD_BUILDING_OUTPUTS
  },
  {
    decision: "rejected_too_broad",
    estimatedRuntimeValuesMoved: 0,
    id: "generic_user_material_physical_input_adjacent_widening",
    reason:
      "User-material input coverage is the highest strategic ROI, but this rerank has a narrower measured-curve mixed-basis gap with complete inputs and known target movement.",
    routeFamily: "user_material_physical_input.generic",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"]
  },
  {
    decision: "rejected_too_broad",
    estimatedRuntimeValuesMoved: 0,
    id: "frequency_band_backbone_oitc_owner",
    reason:
      "Measured frequency curves make companion completeness attractive, but OITC needs an explicit rating owner and negative alias boundaries before runtime movement.",
    routeFamily: "frequency_band_backbone.oitc",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["OITC"]
  },
  {
    decision: "rejected_other_agent_conflict",
    estimatedRuntimeValuesMoved: 0,
    id: "layer_combination_resolver_registry_count_alignment",
    reason:
      "The worktree contains concurrent resolver/registry/matrix count edits. Gate-stability alignment should not replace this calculator value-moving owner selection.",
    routeFamily: "calculator_resolver_gate_stability",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: []
  },
  {
    decision: "rejected_frontend_first",
    estimatedRuntimeValuesMoved: 0,
    id: "ui_report_or_process_cleanup",
    reason:
      "UI/report work, confidence copy, broad source crawling, and generic cleanup do not improve calculator route ownership or numeric accuracy in this selected slice.",
    routeFamily: "non_calculator",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: []
  }
] as const satisfies readonly Candidate[];

const BASE_WALL_LAYERS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 70 },
  { materialId: "glasswool_board", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const ADDED_BOARD_WALL_LAYERS = [
  ...BASE_WALL_LAYERS,
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const BASE_LAB_CONTEXT = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1DepthMm: 70,
    cavity1LayerIndices: [1, 2],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [3],
    topologyMode: "flat_layer_order"
  }
} as const satisfies AirborneContext;

const ADDED_BOARD_LAB_CONTEXT = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1DepthMm: 70,
    cavity1LayerIndices: [1, 2],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [3, 4],
    topologyMode: "flat_layer_order"
  }
} as const satisfies AirborneContext;

const FIELD_CONTEXT = {
  ...ADDED_BOARD_LAB_CONTEXT,
  contextMode: "field_between_rooms",
  hostWallAreaM2: 10,
  panelHeightMm: 2500,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 40,
  sourceRoomVolumeM3: 42
} as const satisfies AirborneContext;

const BUILDING_CONTEXT = {
  ...ADDED_BOARD_LAB_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "single_conservative_path",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 3.2,
  panelHeightMm: 2500,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 40,
  sourceRoomVolumeM3: 42
} as const satisfies AirborneContext;

const INCOMPLETE_FIELD_CONTEXT = {
  ...ADDED_BOARD_LAB_CONTEXT,
  contextMode: "field_between_rooms",
  hostWallAreaM2: 10,
  panelHeightMm: 2500,
  panelWidthMm: 4000,
  receivingRoomVolumeM3: 40
} as const satisfies AirborneContext;

const FREQUENCY_BANDS = {
  bandSet: "third_octave_100_3150",
  values: [
    { frequencyHz: 100, transmissionLossDb: 28.4 },
    { frequencyHz: 125, transmissionLossDb: 31.2 },
    { frequencyHz: 160, transmissionLossDb: 34.1 },
    { frequencyHz: 200, transmissionLossDb: 37.8 },
    { frequencyHz: 250, transmissionLossDb: 40.6 },
    { frequencyHz: 315, transmissionLossDb: 43.3 },
    { frequencyHz: 400, transmissionLossDb: 46.1 },
    { frequencyHz: 500, transmissionLossDb: 49.2 },
    { frequencyHz: 630, transmissionLossDb: 52.5 },
    { frequencyHz: 800, transmissionLossDb: 55.1 },
    { frequencyHz: 1000, transmissionLossDb: 57.4 },
    { frequencyHz: 1250, transmissionLossDb: 59.2 },
    { frequencyHz: 1600, transmissionLossDb: 61.5 },
    { frequencyHz: 2000, transmissionLossDb: 63.1 },
    { frequencyHz: 2500, transmissionLossDb: 64.2 },
    { frequencyHz: 3150, transmissionLossDb: 65.4 }
  ]
} as const satisfies ProjectUserMeasuredWallAirborneFrequencyBands;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  HIGH_ROI_SELECTION_PLAN_DOC,
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateWall(input: {
  readonly context?: AirborneContext;
  readonly frequencyAnchors?: readonly ProjectUserMeasuredWallAirborneFrequencyAnchor[] | null;
  readonly layers?: readonly LayerInput[];
  readonly targetOutputs?: readonly RequestedOutputId[];
} = {}) {
  return calculateAssembly(input.layers ?? ADDED_BOARD_WALL_LAYERS, {
    airborneContext: input.context ?? ADDED_BOARD_LAB_CONTEXT,
    airborneMeasuredFrequencySourceAnchors: input.frequencyAnchors ?? null,
    calculator: "dynamic",
    targetOutputs: input.targetOutputs ?? LAB_OUTPUTS
  });
}

function buildRuntimeSnapshot(input: {
  readonly context?: AirborneContext;
  readonly layers?: readonly LayerInput[];
} = {}): ProjectUserMeasuredWallConstructionSnapshot {
  const baseline = calculateWall({
    context: input.context ?? ADDED_BOARD_LAB_CONTEXT,
    layers: input.layers ?? ADDED_BOARD_WALL_LAYERS,
    targetOutputs: RW_ONLY
  });

  return buildProjectUserMeasuredWallRwRequestSnapshot({
    airborneContext: input.context ?? ADDED_BOARD_LAB_CONTEXT,
    resolvedLayers: baseline.layers
  });
}

function buildActiveFrequencyAnchor(input: {
  readonly id: string;
  readonly snapshot: ProjectUserMeasuredWallConstructionSnapshot;
}): ProjectUserMeasuredWallAirborneFrequencyAnchor {
  const ratingStandards: ProjectUserMeasuredWallAirborneFrequencyAnchor["ratingStandards"] = [
    "ISO 717-1",
    "ASTM E413"
  ];
  const fingerprint = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
    frequencyBands: FREQUENCY_BANDS,
    measurementMethodStandard: "ISO 10140-2",
    ratingStandards,
    snapshot: input.snapshot
  });

  return {
    canonicalizationVersion: PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-18T16:00:00.000Z",
    createdBy: "project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-rerank",
    createdFromProjectId: "project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-rerank",
    curveBasis: "measured_frequency_curve",
    fingerprint,
    frequencyBands: FREQUENCY_BANDS,
    id: input.id,
    inputBasis: "airborne_transmission_loss_curve",
    measurementMethodStandard: "ISO 10140-2",
    metricBasis: "lab_airborne_transmission_loss_curve",
    metricFamily: "airborne",
    ratingStandards,
    revision: 1,
    scope: "project_measured",
    snapshot: input.snapshot,
    sourceLabel: input.id,
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T16:00:00.000Z"
  };
}

function buildExactAddedBoardAnchor() {
  return buildActiveFrequencyAnchor({
    id: "project-user-measured-wall-airborne-frequency-lab-companion-basis-exact-added-board",
    snapshot: buildRuntimeSnapshot({
      context: ADDED_BOARD_LAB_CONTEXT,
      layers: ADDED_BOARD_WALL_LAYERS
    })
  });
}

function buildCompatibleBaseAnchor() {
  return buildActiveFrequencyAnchor({
    id: "project-user-measured-wall-airborne-frequency-lab-companion-basis-compatible-base",
    snapshot: buildRuntimeSnapshot({
      context: BASE_LAB_CONTEXT,
      layers: BASE_WALL_LAYERS
    })
  });
}

function expectMixedClosure(input: {
  readonly fieldResult: ReturnType<typeof calculateAssembly>;
  readonly buildingResult: ReturnType<typeof calculateAssembly>;
}) {
  expect(input.fieldResult.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
  expect(input.fieldResult.supportedTargetOutputs).toEqual([...EXACT_FIELD_MIXED_OUTPUTS]);
  expect(input.fieldResult.unsupportedTargetOutputs).toEqual([]);
  expect(input.fieldResult.warnings).toContain(
    POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_WARNING
  );

  expect(input.buildingResult.airborneBasis?.method).toBe(
    GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
  );
  expect(input.buildingResult.supportedTargetOutputs).toEqual([...BUILDING_MIXED_OUTPUTS]);
  expect(input.buildingResult.unsupportedTargetOutputs).toEqual([]);
  expect(input.buildingResult.warnings).toContain(
    POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_WARNING
  );
}

describe("post-V1 runtime-first route-family rerank after wall advanced-wall source-absent field/building lab-companion target-output independence", () => {
  it("selects project/user measured-frequency field/building lab-companion basis integrity after closed-chain subtraction", () => {
    const selected = CANDIDATES.find((candidate) => candidate.decision === "selected_runtime_owner_ready");
    const byId = new Map(CANDIDATES.map((candidate) => [candidate.id, candidate]));

    expect(CANDIDATES).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      decision: "selected_runtime_owner_ready",
      id: SELECTED_CANDIDATE_ID,
      runtimeOwnerAuthorizedNext: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selected?.estimatedRuntimeValuesMoved).toBe(
      RERANK_COUNTERS.estimatedNextRuntimeValuesMoved
    );
    expect(byId.get("wall.advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_closed")).toMatchObject({
      decision: "rejected_closed_chain",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("wall.opening_leak_common_wall_same_basis_holdout_packet")).toMatchObject({
      decision: "rejected_context_or_evidence_missing",
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(byId.get("frequency_band_backbone_oitc_owner")).toMatchObject({
      decision: "rejected_too_broad",
      runtimeOwnerAuthorizedNext: false
    });
    expect(RERANK_COUNTERS).toEqual({
      candidateCount: 8,
      estimatedNextCalculableRequestShapes: 4,
      estimatedNextCalculableTargetOutputs: 4,
      estimatedNextLabCompanionTargetOutputs: 4,
      estimatedNextRuntimeBasisPromotions: 4,
      estimatedNextRuntimeValuesMoved: 4,
      estimatedNextUnsupportedBoundariesProtected: 8,
      frontendImplementationFilesTouched: 0,
      roiAnalysisIterations: 4,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("records the selected measured-frequency mixed field/building Rw gap and the landed owner closure", () => {
    const exactAnchor = buildExactAddedBoardAnchor();
    const compatibleAnchor = buildCompatibleBaseAnchor();
    const exactLab = calculateWall({
      context: ADDED_BOARD_LAB_CONTEXT,
      frequencyAnchors: [exactAnchor],
      targetOutputs: LAB_OUTPUTS
    });
    const compatibleLab = calculateWall({
      context: ADDED_BOARD_LAB_CONTEXT,
      frequencyAnchors: [compatibleAnchor],
      targetOutputs: LAB_OUTPUTS
    });
    const exactFieldMixed = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [exactAnchor],
      targetOutputs: EXACT_FIELD_MIXED_OUTPUTS
    });
    const exactBuildingMixed = calculateWall({
      context: BUILDING_CONTEXT,
      frequencyAnchors: [exactAnchor],
      targetOutputs: BUILDING_MIXED_OUTPUTS
    });
    const compatibleFieldMixed = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [compatibleAnchor],
      targetOutputs: EXACT_FIELD_MIXED_OUTPUTS
    });
    const compatibleBuildingMixed = calculateWall({
      context: BUILDING_CONTEXT,
      frequencyAnchors: [compatibleAnchor],
      targetOutputs: BUILDING_MIXED_OUTPUTS
    });

    expect(exactLab.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(exactLab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(compatibleLab.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
    );
    expect(compatibleLab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);

    expectMixedClosure({
      buildingResult: exactBuildingMixed,
      fieldResult: exactFieldMixed
    });
    expectMixedClosure({
      buildingResult: compatibleBuildingMixed,
      fieldResult: compatibleFieldMixed
    });
  });

  it("keeps target-output independence, missing context, and impact outside the selected basis-integrity owner", () => {
    const anchor = buildCompatibleBaseAnchor();
    const labOnlyField = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const incompleteField = calculateWall({
      context: INCOMPLETE_FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: EXACT_FIELD_MIXED_OUTPUTS
    });
    const impact = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: IMPACT_OUTPUTS
    });

    expect(labOnlyField.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(labOnlyField.unsupportedTargetOutputs).toEqual([]);
    expect(incompleteField.supportedTargetOutputs).toEqual([]);
    expect(incompleteField.unsupportedTargetOutputs).toEqual([...EXACT_FIELD_MIXED_OUTPUTS]);
    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("documents the landed rerank and selected runtime owner handoff", () => {
    expect(PREVIOUS_OWNER_FILE).toBe(
      "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-owner-contract.test.ts"
    );
    expect(PREVIOUS_COVERAGE_FILE).toBe(
      "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts"
    );
    expect(RERANK_FILE).toBe(
      "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-contract.test.ts"
    );
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    for (const docPath of REQUIRED_DOCS) {
      const doc = readRepoFile(docPath);

      expect(doc).toContain(PREVIOUS_OWNER_ACTION);
      expect(doc).toContain(PREVIOUS_OWNER_STATUS);
      expect(doc).toContain(PREVIOUS_OWNER_PLAN_DOC);
      expect(doc).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(doc).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(doc).toContain(PREVIOUS_COVERAGE_PLAN_DOC);
      expect(doc).toContain(RERANK_ACTION);
      expect(doc).toContain(RERANK_STATUS);
      expect(doc).toContain(SELECTED_CANDIDATE_ID);
      expect(doc).toContain(SELECTED_NEXT_ACTION);
      expect(doc).toContain(SELECTED_NEXT_FILE);
      expect(doc).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(doc).toContain(SELECTED_NEXT_LABEL);
      expect(doc).toContain("candidateCount: 8");
      expect(doc).toContain("roiAnalysisIterations: 4");
      expect(doc).toContain("estimatedNextCalculableRequestShapes: 4");
      expect(doc).toContain("estimatedNextCalculableTargetOutputs: 4");
      expect(doc).toContain("estimatedNextRuntimeValuesMoved: 4");
      expect(doc).toContain("runtimeValuesMoved 0");
      expect(doc).toContain("runtimeFormulaRetunes: 0");
      expect(doc).toContain("sourceRowsImported: 0");
      expect(doc).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});

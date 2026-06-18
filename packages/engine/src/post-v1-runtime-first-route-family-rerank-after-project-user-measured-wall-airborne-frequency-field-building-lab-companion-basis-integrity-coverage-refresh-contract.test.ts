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
import { buildProjectUserMeasuredWallRwRequestSnapshot } from "./project-user-measured-wall-rw-exact-bridge";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const PREVIOUS_OWNER_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner";
const SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 project/user measured wall airborne frequency field/building lab-companion target-output independence owner";

const HIGH_ROI_SELECTION_PLAN_DOC =
  "docs/calculator/HIGH_ROI_CALCULATOR_IMPLEMENTATION_SELECTION_PLAN_2026-06-18.md";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 4,
  estimatedNextCalculableTargetOutputs: 16,
  estimatedNextLabCompanionTargetOutputs: 16,
  estimatedNextRuntimeBasisPromotions: 4,
  estimatedNextRuntimeValuesMoved: 16,
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
  readonly targetOutputs: readonly RequestedOutputId[];
};

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_MIXED_OUTPUTS = [
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
    estimatedRuntimeValuesMoved: 16,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "Exact and compatible project/user measured wall airborne frequency curves already own lab Rw/STC/C/Ctr, and the field/building adapter already proves the same field/building contexts for mixed output requests. The basis-integrity owner moved the missing mixed Rw companion; the remaining bounded gap is target-output independence for lab-only field/building requests on the same measured-frequency basis.",
    routeFamily: "project_user_measured_wall_airborne_frequency.field_building_lab_companion_target_output_independence",
    runtimeOwnerAuthorizedNext: true,
    targetOutputs: LAB_OUTPUTS
  },
  {
    decision: "rejected_closed_chain",
    estimatedRuntimeValuesMoved: 0,
    id: "project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_closed",
    reason:
      "The previous runtime owner and coverage refresh already moved mixed field/building lab Rw basis integrity. Reopening it would not increase calculator scope.",
    routeFamily: "project_user_measured_wall_airborne_frequency.field_building_lab_companion_basis_integrity",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["Rw"]
  },
  {
    decision: "rejected_closed_chain",
    estimatedRuntimeValuesMoved: 0,
    id: "wall_advanced_wall_source_absent_target_output_independence_closed",
    reason:
      "Advanced-wall source-absent field/building lab companions are already target-output independent and refreshed.",
    routeFamily: "wall.advanced_wall_source_absent.field_building_lab_companion_target_output_independence",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: LAB_OUTPUTS
  },
  {
    decision: "rejected_closed_chain",
    estimatedRuntimeValuesMoved: 0,
    id: "project_user_measured_wall_airborne_frequency_field_building_adapter_closed",
    reason:
      "Exact and compatible measured-frequency field/building adapter values are already owned and refreshed for R'w/Dn,w/Dn,A/DnT,w/DnT,A.",
    routeFamily: "project_user_measured_wall_airborne_frequency.field_building_adapter",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
  },
  {
    decision: "rejected_too_broad",
    estimatedRuntimeValuesMoved: 0,
    id: "generic_building_prediction_flanking_runtime_owner",
    reason:
      "Generic building/flanking runtime is strategically high ROI, but broader than this measured-frequency lab-only target-output gap and would need a separate junction/flanking inventory.",
    routeFamily: "building_prediction_flanking.generic",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["R'w", "Dn,w", "DnT,w"]
  },
  {
    decision: "rejected_context_or_evidence_missing",
    estimatedRuntimeValuesMoved: 0,
    id: "opening_leak_common_wall_or_open_web_residual_owner",
    reason:
      "Opening/leak, common-wall, and open-web residuals still matter, but this worktree has adjacent dirty files and no stronger same-basis proof than the measured-frequency owner selected here.",
    routeFamily: "wall.opening_leak.common_wall.open_web",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["R'w", "Dn,w", "DnT,w"]
  },
  {
    decision: "rejected_too_broad",
    estimatedRuntimeValuesMoved: 0,
    id: "frequency_band_backbone_oitc_owner",
    reason:
      "Frequency-band backbone and OITC are important, but this route only authorizes Rw/STC/C/Ctr companions already supported by the measured curve rating basis.",
    routeFamily: "frequency_band_backbone.oitc",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["OITC"]
  },
  {
    decision: "rejected_frontend_first",
    estimatedRuntimeValuesMoved: 0,
    id: "ui_report_source_crawl_or_process_cleanup",
    reason:
      "UI/report work, broad source crawling, confidence copy, and generic process cleanup do not improve calculator route ownership or numeric accuracy in this selected slice.",
    routeFamily: "non_calculator",
    runtimeOwnerAuthorizedNext: false,
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
    createdAtIso: "2026-06-18T19:00:00.000Z",
    createdBy: "project-user-measured-wall-airborne-frequency-target-output-rerank",
    createdFromProjectId: "project-user-measured-wall-airborne-frequency-target-output-rerank",
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
    updatedAtIso: "2026-06-18T19:00:00.000Z"
  };
}

function buildExactAddedBoardAnchor() {
  return buildActiveFrequencyAnchor({
    id: "project-user-measured-wall-airborne-frequency-target-output-rerank-exact",
    snapshot: buildRuntimeSnapshot({
      context: ADDED_BOARD_LAB_CONTEXT,
      layers: ADDED_BOARD_WALL_LAYERS
    })
  });
}

function buildCompatibleBaseAnchor() {
  return buildActiveFrequencyAnchor({
    id: "project-user-measured-wall-airborne-frequency-target-output-rerank-compatible",
    snapshot: buildRuntimeSnapshot({
      context: BASE_LAB_CONTEXT,
      layers: BASE_WALL_LAYERS
    })
  });
}

function buildRerankSummary() {
  const selected = CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID);
  if (!selected) {
    throw new Error("Rerank must select one candidate.");
  }

  return {
    candidates: CANDIDATES,
    counters: RERANK_COUNTERS,
    landedGate: RERANK_ACTION,
    previousCoverage: {
      implementationFile: PREVIOUS_COVERAGE_FILE,
      planDoc: PREVIOUS_COVERAGE_PLAN_DOC,
      selectedGate: PREVIOUS_COVERAGE_ACTION,
      status: PREVIOUS_COVERAGE_STATUS
    },
    previousOwner: {
      implementationFile: PREVIOUS_OWNER_FILE,
      planDoc: PREVIOUS_OWNER_PLAN_DOC,
      selectedGate: PREVIOUS_OWNER_ACTION,
      status: PREVIOUS_OWNER_STATUS
    },
    runtimeValueMovement: false,
    selectedCandidate: selected,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

function expectLabOnlyFieldBuildingOwnerClosure(input: {
  readonly building: ReturnType<typeof calculateAssembly>;
  readonly expectedLab: ReturnType<typeof calculateAssembly>;
  readonly field: ReturnType<typeof calculateAssembly>;
}) {
  for (const result of [input.field, input.building]) {
    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics.estimatedRwDb).toBe(input.expectedLab.metrics.estimatedRwDb);
    expect(result.metrics.estimatedStc).toBe(input.expectedLab.metrics.estimatedStc);
    expect(result.metrics.estimatedCDb).toBe(input.expectedLab.metrics.estimatedCDb);
    expect(result.metrics.estimatedCtrDb).toBe(input.expectedLab.metrics.estimatedCtrDb);
  }
}

describe("post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building lab-companion basis integrity coverage refresh", () => {
  it("selects measured-frequency field/building lab-companion target-output independence after closed-chain subtraction", () => {
    const summary = buildRerankSummary();

    expect(summary).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      runtimeValueMovement: false,
      selectedCandidate: {
        decision: "selected_runtime_owner_ready",
        estimatedRuntimeValuesMoved: 16,
        id: SELECTED_CANDIDATE_ID,
        runtimeOwnerAuthorizedNext: true,
        targetOutputs: [...LAB_OUTPUTS]
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RERANK_STATUS
    });

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(summary.candidates.filter((candidate) => candidate.decision === "selected_runtime_owner_ready"))
      .toHaveLength(1);
    expect(summary.candidates.every((candidate) =>
      candidate.id === SELECTED_CANDIDATE_ID || !candidate.runtimeOwnerAuthorizedNext
    )).toBe(true);

    for (const path of [
      PREVIOUS_COVERAGE_FILE,
      PREVIOUS_COVERAGE_PLAN_DOC,
      PREVIOUS_OWNER_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("records the selected lab-only field/building target-output independence gap as owner-closed", () => {
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

    expect(exactLab.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(exactLab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(compatibleLab.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
    );
    expect(compatibleLab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);

    expectLabOnlyFieldBuildingOwnerClosure({
      building: calculateWall({
        context: BUILDING_CONTEXT,
        frequencyAnchors: [exactAnchor],
        targetOutputs: LAB_OUTPUTS
      }),
      expectedLab: exactLab,
      field: calculateWall({
        context: FIELD_CONTEXT,
        frequencyAnchors: [exactAnchor],
        targetOutputs: LAB_OUTPUTS
      })
    });
    expectLabOnlyFieldBuildingOwnerClosure({
      building: calculateWall({
        context: BUILDING_CONTEXT,
        frequencyAnchors: [compatibleAnchor],
        targetOutputs: LAB_OUTPUTS
      }),
      expectedLab: compatibleLab,
      field: calculateWall({
        context: FIELD_CONTEXT,
        frequencyAnchors: [compatibleAnchor],
        targetOutputs: LAB_OUTPUTS
      })
    });
  });

  it("keeps mixed-output basis integrity green after lab-only owner closure", () => {
    const exactAnchor = buildExactAddedBoardAnchor();
    const compatibleAnchor = buildCompatibleBaseAnchor();

    const exactField = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [exactAnchor],
      targetOutputs: FIELD_MIXED_OUTPUTS
    });
    const exactBuilding = calculateWall({
      context: BUILDING_CONTEXT,
      frequencyAnchors: [exactAnchor],
      targetOutputs: BUILDING_MIXED_OUTPUTS
    });
    const compatibleField = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [compatibleAnchor],
      targetOutputs: FIELD_MIXED_OUTPUTS
    });
    const compatibleBuilding = calculateWall({
      context: BUILDING_CONTEXT,
      frequencyAnchors: [compatibleAnchor],
      targetOutputs: BUILDING_MIXED_OUTPUTS
    });

    expect(exactField.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(exactField.supportedTargetOutputs).toEqual([...FIELD_MIXED_OUTPUTS]);
    expect(exactField.unsupportedTargetOutputs).toEqual([]);
    expect(exactField.metrics.estimatedRwPrimeDb).toBe(49);
    expect(typeof exactField.metrics.estimatedRwDb).toBe("number");

    expect(exactBuilding.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(exactBuilding.supportedTargetOutputs).toEqual([...BUILDING_MIXED_OUTPUTS]);
    expect(exactBuilding.unsupportedTargetOutputs).toEqual([]);
    expect(exactBuilding.metrics.estimatedDnTwDb).toBe(50);
    expect(typeof exactBuilding.metrics.estimatedRwDb).toBe("number");

    expect(compatibleField.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(compatibleField.supportedTargetOutputs).toEqual([...FIELD_MIXED_OUTPUTS]);
    expect(compatibleField.unsupportedTargetOutputs).toEqual([]);
    expect(compatibleField.metrics.estimatedRwPrimeDb).toBe(52);
    expect(typeof compatibleField.metrics.estimatedRwDb).toBe("number");

    expect(compatibleBuilding.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(compatibleBuilding.supportedTargetOutputs).toEqual([...BUILDING_MIXED_OUTPUTS]);
    expect(compatibleBuilding.unsupportedTargetOutputs).toEqual([]);
    expect(compatibleBuilding.metrics.estimatedDnTwDb).toBe(53);
    expect(typeof compatibleBuilding.metrics.estimatedRwDb).toBe("number");
  });

  it("keeps missing context, impact, and non-calculator candidates rejected", () => {
    const anchor = buildCompatibleBaseAnchor();
    const incompleteField = calculateWall({
      context: INCOMPLETE_FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const impact = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: IMPACT_OUTPUTS
    });
    const summary = buildRerankSummary();

    expect(incompleteField.supportedTargetOutputs).toEqual([]);
    expect(incompleteField.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(summary.candidates.find((candidate) => candidate.id === "ui_report_source_crawl_or_process_cleanup"))
      .toMatchObject({
        decision: "rejected_frontend_first",
        runtimeOwnerAuthorizedNext: false
      });
    expect(summary.candidates.find((candidate) => candidate.id === "frequency_band_backbone_oitc_owner"))
      .toMatchObject({
        decision: "rejected_too_broad",
        runtimeOwnerAuthorizedNext: false
      });
  });

  it("keeps active docs aligned with the selected target-output independence owner handoff", () => {
    for (const path of REQUIRED_DOCS) {
      const doc = readRepoFile(path);

      expect(doc, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(doc, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(doc, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(doc, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(doc, path).toContain(RERANK_ACTION);
      expect(doc, path).toContain(RERANK_STATUS);
      expect(doc, path).toContain(RERANK_FILE);
      expect(doc, path).toContain(RERANK_PLAN_DOC);
      expect(doc, path).toContain(SELECTED_CANDIDATE_ID);
      expect(doc, path).toContain(SELECTED_NEXT_ACTION);
      expect(doc, path).toContain(SELECTED_NEXT_FILE);
      expect(doc, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(doc, path).toContain(SELECTED_NEXT_LABEL);
      expect(doc, path).toContain("candidateCount: 8");
      expect(doc, path).toContain("roiAnalysisIterations: 4");
      expect(doc, path).toContain("estimatedNextRuntimeValuesMoved: 16");
      expect(doc, path).toContain("runtimeValuesMoved 0");
      expect(doc, path).toContain("runtimeFormulaRetunes: 0");
      expect(doc, path).toContain("sourceRowsImported: 0");
      expect(doc, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
  buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint,
  type AirborneContext,
  type LayerInput,
  type MaterialDefinition,
  type ProjectUserMeasuredWallAirborneFrequencyAnchor,
  type ProjectUserMeasuredWallAirborneFrequencyBands,
  type ProjectUserMeasuredWallConstructionSnapshot,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD,
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_WARNING_PREFIX,
  maybeBuildProjectUserMeasuredWallAirborneFrequencyExactCurveBridge
} from "./project-user-measured-wall-airborne-frequency-exact-curve-bridge";
import { buildProjectUserMeasuredWallRwRequestSnapshot } from "./project-user-measured-wall-rw-exact-bridge";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";
const PREVIOUS_RUNTIME_METHOD =
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD;

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_compatible_delta_owner";
const SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_airborne_frequency_compatible_delta_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 project/user measured wall airborne frequency compatible-delta owner";

const COMPATIBLE_ANCHOR_DELTA_FILE = "packages/engine/src/post-v1-wall-compatible-anchor-delta.ts";
const EXACT_CURVE_BRIDGE_FILE = "packages/engine/src/project-user-measured-wall-airborne-frequency-exact-curve-bridge.ts";
const HIGH_ROI_SELECTION_PLAN_DOC = "docs/calculator/HIGH_ROI_CALCULATOR_IMPLEMENTATION_SELECTION_PLAN_2026-06-18.md";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 4,
  estimatedNextCalculableTargetOutputs: 4,
  estimatedNextRequiredPhysicalInputsCaptured: 6,
  estimatedNextRuntimeBasisPromotions: 1,
  estimatedNextRuntimeValuesMoved: 4,
  estimatedNextUnsupportedBoundariesProtected: 7,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_alias_risk"
  | "rejected_context_missing"
  | "rejected_evidence_missing"
  | "rejected_frontend_first"
  | "rejected_too_broad"
  | "selected_runtime_owner_ready";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly id: string;
  readonly reason: string;
  readonly requiredInputsOrEvidence: readonly string[];
  readonly routeFamily: string;
  readonly runtimeOwnerAuthorizedNext: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
};

const SELECTED_TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_runtime_owner_ready",
    id: SELECTED_CANDIDATE_ID,
    reason:
      "The exact measured wall airborne frequency curve bridge is live for full-stack matches, and the existing compatible-anchor delta route already owns a bounded exterior-board mass delta shape. The next best calculator move is to apply that bounded delta to a project/user measured curve when the reduced stack exactly matches the measured anchor.",
    requiredInputsOrEvidence: [
      "airborneMeasuredFrequencySourceAnchors",
      "exactReducedStackMeasuredCurveFingerprint",
      "oneSideOrPairedExteriorBoardDelta",
      "boardSurfaceMassKgM2",
      "elementLabContext",
      "declaredRatingStandards"
    ],
    routeFamily: "wall.project_user_measured_frequency_curve.compatible_delta",
    runtimeOwnerAuthorizedNext: true,
    targetOutputs: SELECTED_TARGET_OUTPUTS
  },
  {
    decision: "rejected_too_broad",
    id: "user_material_physical_input_coverage_owner",
    reason:
      "User-material physical input coverage remains the highest strategic stream, but this rerank has a narrower measured-curve delta owner that directly increases near-measured layer-combination coverage without guessing topology.",
    requiredInputsOrEvidence: [
      "leafGrouping",
      "supportTopology",
      "supportSpacing",
      "cavityDepth",
      "absorberFlowResistivity"
    ],
    routeFamily: "wall.user_material_physical_inputs",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: SELECTED_TARGET_OUTPUTS
  },
  {
    decision: "rejected_context_missing",
    id: "building_prediction_flanking_runtime_owner",
    reason:
      "Measured lab curves can feed building prediction later, but R'w, Dn,w, DnT,w, and A-weighted building metrics still require explicit room, area, junction, flanking, and output-basis context. This rerank must not copy lab ratings into building outputs.",
    requiredInputsOrEvidence: [
      "panelAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "junctionClass",
      "flankingPathBasis"
    ],
    routeFamily: "wall.building_prediction_flanking",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["R'w", "Dn,w", "DnT,w"]
  },
  {
    decision: "rejected_too_broad",
    id: "frequency_band_backbone_owned_route_owner",
    reason:
      "Frequency-band ownership is the long-term accuracy ceiling, but a broad backbone rewrite is larger than this selected slice. The measured-curve compatible-delta owner is the bounded frequency-first route available now.",
    requiredInputsOrEvidence: [
      "ownedThirdOctaveCurve",
      "routeCurveIdentity",
      "ratingAdapterBasis",
      "negativeAliasTests"
    ],
    routeFamily: "frequency_band_backbone",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: SELECTED_TARGET_OUTPUTS
  },
  {
    decision: "rejected_alias_risk",
    id: "companion_metric_completeness_from_owned_spectrum_owner",
    reason:
      "The exact measured curve bridge already exposes Rw, STC, C, and Ctr. OITC is not backed by a runtime adapter in the current rating inventory, so selecting companion completeness here would either be empty or alias-prone.",
    requiredInputsOrEvidence: [
      "ownedSpectrumRoute",
      "implementedOitcAdapter",
      "scalarOnlyNegativeBoundary"
    ],
    routeFamily: "owned_spectrum.companion_metrics",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    decision: "rejected_evidence_missing",
    id: "calibration_holdout_packet_owner",
    reason:
      "Calibration remains high ROI, but the current rerank has no new rights-safe same-family holdout packet that beats the measured-curve compatible-delta runtime unlock.",
    requiredInputsOrEvidence: [
      "rightsSafeRows",
      "sameFamilyBasis",
      "beforeAfterErrorBudget"
    ],
    routeFamily: "calibration_holdout",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: []
  },
  {
    decision: "rejected_evidence_missing",
    id: "opening_leak_common_wall_or_open_web_residual_owner",
    reason:
      "Opening/leak and common-wall residual work is already in a separate dirty same-basis holdout packet chain and still reports acceptedSameBasisHoldoutRows: 0; selecting it here would collide with other-agent work and lacks runtime authorization.",
    requiredInputsOrEvidence: [
      "sameBasisOpeningLeakHoldout",
      "sameBasisCommonWallHoldout",
      "explicitBuildingContext"
    ],
    routeFamily: "wall.opening_leak.common_wall",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["R'w", "Dn,w", "DnT,w"]
  },
  {
    decision: "rejected_frontend_first",
    id: "broad_ui_report_source_or_cleanup_work",
    reason:
      "UI/report work, confidence copy, broad source crawling, and generic cleanup do not improve calculator route ownership or numeric accuracy in this selected slice.",
    requiredInputsOrEvidence: [],
    routeFamily: "non_calculator",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: []
  }
] as const satisfies readonly Candidate[];

const PROJECT_BOARD = {
  acoustic: {
    behavior: "panel_leaf",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "finish",
  densityKgM3: 720,
  id: "project_frequency_delta_rerank_board_720",
  name: "Project frequency delta rerank board 720",
  tags: ["board", "project-user-measured-frequency-delta-rerank"]
} as const satisfies MaterialDefinition;

const PROJECT_AIR = {
  acoustic: {
    behavior: "air_cavity",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "gap",
  densityKgM3: 0,
  id: "project_frequency_delta_rerank_air_gap",
  name: "Project frequency delta rerank air gap",
  tags: ["project-user-measured-frequency-delta-rerank"]
} as const satisfies MaterialDefinition;

const PROJECT_ABSORBER = {
  acoustic: {
    absorberClass: "porous_absorptive",
    behavior: "porous_absorber",
    flowResistivityPaSM2: 12000,
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "insulation",
  densityKgM3: 48,
  id: "project_frequency_delta_rerank_absorber_48",
  name: "Project frequency delta rerank absorber 48",
  tags: ["project-user-measured-frequency-delta-rerank"]
} as const satisfies MaterialDefinition;

const PROJECT_MATERIALS = [
  PROJECT_BOARD,
  PROJECT_AIR,
  PROJECT_ABSORBER
] as const satisfies readonly MaterialDefinition[];

const BASE_WALL_LAYERS = [
  { materialId: PROJECT_BOARD.id, thicknessMm: 12.5 },
  { materialId: PROJECT_AIR.id, thicknessMm: 70 },
  { materialId: PROJECT_ABSORBER.id, thicknessMm: 50 },
  { materialId: PROJECT_BOARD.id, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const ADDED_BOARD_WALL_LAYERS = [
  ...BASE_WALL_LAYERS,
  { materialId: PROJECT_BOARD.id, thicknessMm: 12.5 }
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

function calculateProjectWall(input: {
  readonly context?: AirborneContext;
  readonly frequencyAnchors?: readonly ProjectUserMeasuredWallAirborneFrequencyAnchor[] | null;
  readonly layers?: readonly LayerInput[];
  readonly targetOutputs?: readonly RequestedOutputId[];
} = {}) {
  return calculateAssembly(input.layers ?? BASE_WALL_LAYERS, {
    airborneContext: input.context ?? BASE_LAB_CONTEXT,
    airborneMeasuredFrequencySourceAnchors: input.frequencyAnchors ?? null,
    calculator: "dynamic",
    catalog: PROJECT_MATERIALS,
    targetOutputs: input.targetOutputs ?? SELECTED_TARGET_OUTPUTS
  });
}

function buildRuntimeSnapshot(input: {
  readonly context?: AirborneContext;
  readonly layers?: readonly LayerInput[];
} = {}): ProjectUserMeasuredWallConstructionSnapshot {
  const baseline = calculateProjectWall({
    context: input.context ?? BASE_LAB_CONTEXT,
    layers: input.layers ?? BASE_WALL_LAYERS,
    targetOutputs: ["Rw"]
  });

  return buildProjectUserMeasuredWallRwRequestSnapshot({
    airborneContext: input.context ?? BASE_LAB_CONTEXT,
    resolvedLayers: baseline.layers
  });
}

function buildActiveFrequencyAnchor(
  snapshot: ProjectUserMeasuredWallConstructionSnapshot = buildRuntimeSnapshot()
): ProjectUserMeasuredWallAirborneFrequencyAnchor {
  const fingerprint = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
    frequencyBands: FREQUENCY_BANDS,
    measurementMethodStandard: "ISO 10140-2",
    ratingStandards: ["ISO 717-1", "ASTM E413"],
    snapshot
  });

  return {
    canonicalizationVersion: PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-18T14:00:00.000Z",
    createdBy: "frequency-compatible-delta-rerank-contract",
    createdFromProjectId: "project-frequency-compatible-delta-rerank",
    curveBasis: "measured_frequency_curve",
    fingerprint,
    frequencyBands: FREQUENCY_BANDS,
    id: "project-user-measured-wall-frequency-compatible-delta-rerank-anchor",
    inputBasis: "airborne_transmission_loss_curve",
    measurementMethodStandard: "ISO 10140-2",
    metricBasis: "lab_airborne_transmission_loss_curve",
    metricFamily: "airborne",
    ratingStandards: ["ISO 717-1", "ASTM E413"],
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceLabel: "Project measured wall frequency compatible delta rerank anchor",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T14:00:00.000Z"
  };
}

function hasExactCurveWarning(result: ReturnType<typeof calculateProjectWall>): boolean {
  return result.warnings.some((warning: string) =>
    warning.startsWith(POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_WARNING_PREFIX)
  );
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
    noRuntimeValueMovement: true,
    previousCoverageRefresh: {
      implementationFile: PREVIOUS_COVERAGE_FILE,
      planDoc: PREVIOUS_COVERAGE_PLAN_DOC,
      runtimeMethod: PREVIOUS_RUNTIME_METHOD,
      selectedGate: PREVIOUS_COVERAGE_ACTION,
      status: PREVIOUS_COVERAGE_STATUS
    },
    selectedCandidate: selected,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first rerank after project/user measured wall airborne frequency exact curve bridge coverage refresh", () => {
  it("lands a no-runtime rerank and selects the measured-curve compatible-delta owner", () => {
    const summary = buildRerankSummary();

    expect(summary).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      noRuntimeValueMovement: true,
      previousCoverageRefresh: {
        implementationFile: PREVIOUS_COVERAGE_FILE,
        planDoc: PREVIOUS_COVERAGE_PLAN_DOC,
        runtimeMethod: PREVIOUS_RUNTIME_METHOD,
        selectedGate: PREVIOUS_COVERAGE_ACTION,
        status: PREVIOUS_COVERAGE_STATUS
      },
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RERANK_STATUS
    });

    for (const path of [
      PREVIOUS_COVERAGE_FILE,
      PREVIOUS_COVERAGE_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("proves the exact measured curve is owned while a one-board changed stack still needs the selected delta owner", () => {
    const anchor = buildActiveFrequencyAnchor();
    const exactResult = calculateProjectWall({
      frequencyAnchors: [anchor],
      targetOutputs: SELECTED_TARGET_OUTPUTS
    });
    const modifiedResolvedLayers = [
      ...exactResult.layers,
      {
        ...exactResult.layers[exactResult.layers.length - 1],
        thicknessMm: ADDED_BOARD_WALL_LAYERS[ADDED_BOARD_WALL_LAYERS.length - 1].thicknessMm
      }
    ];
    const modifiedExactBridgeProbe = maybeBuildProjectUserMeasuredWallAirborneFrequencyExactCurveBridge({
      airborneContext: ADDED_BOARD_LAB_CONTEXT,
      anchors: [anchor],
      compatibleAnchorDeltaAlreadyApplied: false,
      exactFullStackAlreadyApplied: false,
      resolvedLayers: modifiedResolvedLayers,
      targetOutputs: SELECTED_TARGET_OUTPUTS
    });

    expect(exactResult.airborneBasis).toMatchObject({
      method: PREVIOUS_RUNTIME_METHOD,
      origin: "measured_exact_full_stack",
      toleranceClass: "exact_source"
    });
    expect(exactResult.supportedTargetOutputs).toEqual([...SELECTED_TARGET_OUTPUTS]);
    expect(hasExactCurveWarning(exactResult)).toBe(true);

    expect(modifiedExactBridgeProbe.applied).toBe(false);
    expect(modifiedExactBridgeProbe.basis?.method).not.toBe(PREVIOUS_RUNTIME_METHOD);
    expect(modifiedExactBridgeProbe.values).toEqual({});
    expect(modifiedExactBridgeProbe.warnings).toEqual([]);
  });

  it("finds local runtime prerequisites for a bounded measured-curve exterior-board delta", () => {
    const exactCurveBridge = readRepoFile(EXACT_CURVE_BRIDGE_FILE);
    const compatibleDelta = readRepoFile(COMPATIBLE_ANCHOR_DELTA_FILE);

    expect(exactCurveBridge).toContain("curveBasis: \"measured_frequency_curve\"");
    expect(exactCurveBridge).toContain("origin: \"measured_exact_full_stack\"");
    expect(exactCurveBridge).toContain("compatible deltas");
    expect(compatibleDelta).toContain("POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD");
    expect(compatibleDelta).toContain("bounded exterior board delta");
    expect(compatibleDelta).toContain("isCompatibleAddedBoardLayer");
    expect(compatibleDelta).toContain("shiftCurveToRw");
    expect(compatibleDelta).toContain("exactReducedStackSourceRow");
  });

  it("rejects high-ROI candidates that are blocked by context, evidence, alias risk, or other-agent conflict", () => {
    const summary = buildRerankSummary();
    const byId = new Map(summary.candidates.map((candidate) => [candidate.id, candidate]));

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(summary.selectedCandidate).toMatchObject({
      decision: "selected_runtime_owner_ready",
      runtimeOwnerAuthorizedNext: true,
      routeFamily: "wall.project_user_measured_frequency_curve.compatible_delta",
      targetOutputs: SELECTED_TARGET_OUTPUTS
    });
    expect(byId.get("user_material_physical_input_coverage_owner")).toMatchObject({
      decision: "rejected_too_broad",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("building_prediction_flanking_runtime_owner")).toMatchObject({
      decision: "rejected_context_missing",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("companion_metric_completeness_from_owned_spectrum_owner")).toMatchObject({
      decision: "rejected_alias_risk",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("opening_leak_common_wall_or_open_web_residual_owner")).toMatchObject({
      decision: "rejected_evidence_missing",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("broad_ui_report_source_or_cleanup_work")).toMatchObject({
      decision: "rejected_frontend_first",
      runtimeOwnerAuthorizedNext: false
    });
  });

  it("keeps this rerank no-runtime while estimating the next bounded runtime movement", () => {
    const summary = buildRerankSummary();

    expect(summary.counters).toMatchObject({
      estimatedNextCalculableRequestShapes: 4,
      estimatedNextCalculableTargetOutputs: 4,
      estimatedNextRequiredPhysicalInputsCaptured: 6,
      estimatedNextRuntimeBasisPromotions: 1,
      estimatedNextRuntimeValuesMoved: 4,
      estimatedNextUnsupportedBoundariesProtected: 7,
      frontendImplementationFilesTouched: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(summary.selectedCandidate.requiredInputsOrEvidence).toEqual([
      "airborneMeasuredFrequencySourceAnchors",
      "exactReducedStackMeasuredCurveFingerprint",
      "oneSideOrPairedExteriorBoardDelta",
      "boardSurfaceMassKgM2",
      "elementLabContext",
      "declaredRatingStandards"
    ]);
  });

  it("keeps active docs aligned with the selected measured-curve compatible-delta owner", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_FILE);
      expect(contents, path).toContain(RERANK_ACTION);
      expect(contents, path).toContain(RERANK_STATUS);
      expect(contents, path).toContain(RERANK_FILE);
      expect(contents, path).toContain(SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(contents, path).toContain("candidateCount: 8");
      expect(contents, path).toContain("roiAnalysisIterations: 4");
      expect(contents, path).toContain("estimatedNextRuntimeValuesMoved: 4");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("runtimeFormulaRetunes: 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});

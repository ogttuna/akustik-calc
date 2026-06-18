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

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner";

const OWNER_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md";
const OWNER_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 project/user measured wall airborne frequency field/building lab-companion target-output independence coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 4,
  newCalculableTargetOutputs: 16,
  runtimeBasisPromotions: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 16,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 8
} as const;

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
  OWNER_PLAN_DOC,
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
    createdAtIso: "2026-06-18T20:00:00.000Z",
    createdBy: "project-user-measured-wall-airborne-frequency-target-output-owner",
    createdFromProjectId: "project-user-measured-wall-airborne-frequency-target-output-owner",
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
    updatedAtIso: "2026-06-18T20:00:00.000Z"
  };
}

function buildExactAddedBoardAnchor() {
  return buildActiveFrequencyAnchor({
    id: "project-user-measured-wall-airborne-frequency-target-output-owner-exact",
    snapshot: buildRuntimeSnapshot({
      context: ADDED_BOARD_LAB_CONTEXT,
      layers: ADDED_BOARD_WALL_LAYERS
    })
  });
}

function buildCompatibleBaseAnchor() {
  return buildActiveFrequencyAnchor({
    id: "project-user-measured-wall-airborne-frequency-target-output-owner-compatible",
    snapshot: buildRuntimeSnapshot({
      context: BASE_LAB_CONTEXT,
      layers: BASE_WALL_LAYERS
    })
  });
}

function expectLabValuesEqual(input: {
  readonly actual: ReturnType<typeof calculateAssembly>;
  readonly expectedLab: ReturnType<typeof calculateAssembly>;
}) {
  expect(input.actual.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
  expect(input.actual.unsupportedTargetOutputs).toEqual([]);
  expect(input.actual.metrics.estimatedRwDb).toBe(input.expectedLab.metrics.estimatedRwDb);
  expect(input.actual.metrics.estimatedStc).toBe(input.expectedLab.metrics.estimatedStc);
  expect(input.actual.metrics.estimatedCDb).toBe(input.expectedLab.metrics.estimatedCDb);
  expect(input.actual.metrics.estimatedCtrDb).toBe(input.expectedLab.metrics.estimatedCtrDb);
}

describe("post-V1 project/user measured wall airborne frequency field/building lab-companion target-output independence owner", () => {
  it("publishes exact measured lab companions for lab-only field and building requests", () => {
    const anchor = buildExactAddedBoardAnchor();
    const lab = calculateWall({
      context: ADDED_BOARD_LAB_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const fieldLabOnly = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const buildingLabOnly = calculateWall({
      context: BUILDING_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });

    expect(lab.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(fieldLabOnly.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(buildingLabOnly.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expectLabValuesEqual({ actual: fieldLabOnly, expectedLab: lab });
    expectLabValuesEqual({ actual: buildingLabOnly, expectedLab: lab });
  });

  it("publishes compatible measured lab companions for lab-only field and building requests", () => {
    const anchor = buildCompatibleBaseAnchor();
    const lab = calculateWall({
      context: ADDED_BOARD_LAB_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const fieldLabOnly = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const buildingLabOnly = calculateWall({
      context: BUILDING_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });

    expect(lab.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
    );
    expect(fieldLabOnly.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(buildingLabOnly.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expectLabValuesEqual({ actual: fieldLabOnly, expectedLab: lab });
    expectLabValuesEqual({ actual: buildingLabOnly, expectedLab: lab });
  });

  it("preserves mixed field/building values and measured lab companions", () => {
    const anchor = buildCompatibleBaseAnchor();
    const lab = calculateWall({
      context: ADDED_BOARD_LAB_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const fieldMixed = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: FIELD_MIXED_OUTPUTS
    });
    const buildingMixed = calculateWall({
      context: BUILDING_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: BUILDING_MIXED_OUTPUTS
    });

    expect(fieldMixed.supportedTargetOutputs).toEqual([...FIELD_MIXED_OUTPUTS]);
    expect(fieldMixed.unsupportedTargetOutputs).toEqual([]);
    expect(fieldMixed.metrics.estimatedRwPrimeDb).toBe(52);
    expect(fieldMixed.metrics.estimatedRwDb).toBe(lab.metrics.estimatedRwDb);
    expect(buildingMixed.supportedTargetOutputs).toEqual([...BUILDING_MIXED_OUTPUTS]);
    expect(buildingMixed.unsupportedTargetOutputs).toEqual([]);
    expect(buildingMixed.metrics.estimatedDnTwDb).toBe(53);
    expect(buildingMixed.metrics.estimatedRwDb).toBe(lab.metrics.estimatedRwDb);
  });

  it("keeps missing context and impact boundaries outside this owner", () => {
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

    expect(incompleteField.supportedTargetOutputs).toEqual([]);
    expect(incompleteField.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("documents the landed owner, counters, and selected coverage refresh handoff", () => {
    expect(OWNER_COUNTERS).toEqual({
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 4,
      newCalculableTargetOutputs: 16,
      runtimeBasisPromotions: 4,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 16,
      sourceRowsImported: 0,
      unsupportedBoundariesProtected: 8
    });
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    for (const docPath of REQUIRED_DOCS) {
      const doc = readRepoFile(docPath);

      expect(doc, docPath).toContain(PREVIOUS_RERANK_ACTION);
      expect(doc, docPath).toContain(PREVIOUS_RERANK_STATUS);
      expect(doc, docPath).toContain(PREVIOUS_RERANK_PLAN_DOC);
      expect(doc, docPath).toContain(OWNER_ACTION);
      expect(doc, docPath).toContain(OWNER_STATUS);
      expect(doc, docPath).toContain(OWNER_FILE);
      expect(doc, docPath).toContain(OWNER_PLAN_DOC);
      expect(doc, docPath).toContain(SELECTED_CANDIDATE_ID);
      expect(doc, docPath).toContain(SELECTED_NEXT_ACTION);
      expect(doc, docPath).toContain(SELECTED_NEXT_FILE);
      expect(doc, docPath).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(doc, docPath).toContain(SELECTED_NEXT_LABEL);
      expect(doc, docPath).toContain("newCalculableRequestShapes: 4");
      expect(doc, docPath).toContain("newCalculableTargetOutputs: 16");
      expect(doc, docPath).toContain("runtimeValuesMoved 16");
      expect(doc, docPath).toContain("runtimeFormulaRetunes: 0");
      expect(doc, docPath).toContain("sourceRowsImported: 0");
      expect(doc, docPath).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});

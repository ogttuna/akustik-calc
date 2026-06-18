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
  "post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-contract.test.ts";
const PREVIOUS_RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-18.md";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner";

const OWNER_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md";
const OWNER_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 project/user measured wall airborne frequency field/building lab-companion basis integrity coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 4,
  newCalculableTargetOutputs: 4,
  runtimeBasisPromotions: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 4,
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
    createdAtIso: "2026-06-18T17:00:00.000Z",
    createdBy: "project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-owner",
    createdFromProjectId:
      "project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-owner",
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
    updatedAtIso: "2026-06-18T17:00:00.000Z"
  };
}

function buildExactAddedBoardAnchor() {
  return buildActiveFrequencyAnchor({
    id: "project-user-measured-wall-airborne-frequency-lab-companion-basis-owner-exact",
    snapshot: buildRuntimeSnapshot({
      context: ADDED_BOARD_LAB_CONTEXT,
      layers: ADDED_BOARD_WALL_LAYERS
    })
  });
}

function buildCompatibleBaseAnchor() {
  return buildActiveFrequencyAnchor({
    id: "project-user-measured-wall-airborne-frequency-lab-companion-basis-owner-compatible",
    snapshot: buildRuntimeSnapshot({
      context: BASE_LAB_CONTEXT,
      layers: BASE_WALL_LAYERS
    })
  });
}

function expectMixedFieldBuildingOutputs(input: {
  readonly buildingDnTw: number;
  readonly buildingResult: ReturnType<typeof calculateAssembly>;
  readonly expectedRw: number;
  readonly fieldResult: ReturnType<typeof calculateAssembly>;
  readonly fieldRwPrime: number;
}) {
  expect(input.fieldResult.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
  expect(input.fieldResult.supportedTargetOutputs).toEqual([...FIELD_MIXED_OUTPUTS]);
  expect(input.fieldResult.unsupportedTargetOutputs).toEqual([]);
  expect(input.fieldResult.metrics.estimatedRwDb).toBe(input.expectedRw);
  expect(input.fieldResult.metrics.estimatedRwPrimeDb).toBe(input.fieldRwPrime);

  expect(input.buildingResult.airborneBasis?.method).toBe(
    GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
  );
  expect(input.buildingResult.supportedTargetOutputs).toEqual([...BUILDING_MIXED_OUTPUTS]);
  expect(input.buildingResult.unsupportedTargetOutputs).toEqual([]);
  expect(input.buildingResult.metrics.estimatedRwDb).toBe(input.expectedRw);
  expect(input.buildingResult.metrics.estimatedDnTwDb).toBe(input.buildingDnTw);
}

describe("post-V1 project/user measured wall airborne frequency field/building lab-companion basis integrity owner", () => {
  it("publishes exact measured lab Rw next to field and building mixed outputs without changing field/building values", () => {
    const anchor = buildExactAddedBoardAnchor();
    const lab = calculateWall({
      context: ADDED_BOARD_LAB_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: FIELD_MIXED_OUTPUTS
    });
    const building = calculateWall({
      context: BUILDING_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: BUILDING_MIXED_OUTPUTS
    });

    expect(lab.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expectMixedFieldBuildingOutputs({
      buildingDnTw: 50,
      buildingResult: building,
      expectedRw: lab.metrics.estimatedRwDb ?? NaN,
      fieldResult: field,
      fieldRwPrime: 49
    });
  });

  it("publishes compatible measured lab Rw next to field and building mixed outputs without changing field/building values", () => {
    const anchor = buildCompatibleBaseAnchor();
    const lab = calculateWall({
      context: ADDED_BOARD_LAB_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: FIELD_MIXED_OUTPUTS
    });
    const building = calculateWall({
      context: BUILDING_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: BUILDING_MIXED_OUTPUTS
    });

    expect(lab.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
    );
    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expectMixedFieldBuildingOutputs({
      buildingDnTw: 53,
      buildingResult: building,
      expectedRw: lab.metrics.estimatedRwDb ?? NaN,
      fieldResult: field,
      fieldRwPrime: 52
    });
  });

  it("records later lab-only closure while missing context and impact boundaries stay outside this owner", () => {
    const anchor = buildCompatibleBaseAnchor();
    const lab = calculateWall({
      context: ADDED_BOARD_LAB_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const labOnlyField = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const labOnlyBuilding = calculateWall({
      context: BUILDING_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const incompleteField = calculateWall({
      context: INCOMPLETE_FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: FIELD_MIXED_OUTPUTS
    });
    const impact = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: IMPACT_OUTPUTS
    });

    for (const result of [labOnlyField, labOnlyBuilding]) {
      expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.metrics.estimatedRwDb).toBe(lab.metrics.estimatedRwDb);
      expect(result.metrics.estimatedStc).toBe(lab.metrics.estimatedStc);
      expect(result.metrics.estimatedCDb).toBe(lab.metrics.estimatedCDb);
      expect(result.metrics.estimatedCtrDb).toBe(lab.metrics.estimatedCtrDb);
    }
    expect(incompleteField.supportedTargetOutputs).toEqual([]);
    expect(incompleteField.unsupportedTargetOutputs).toEqual([...FIELD_MIXED_OUTPUTS]);
    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("documents the landed owner, counters, and selected coverage refresh handoff", () => {
    expect(PREVIOUS_RERANK_FILE).toBe(
      "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-contract.test.ts"
    );
    expect(OWNER_FILE).toBe(
      "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-owner-contract.test.ts"
    );
    expect(OWNER_COUNTERS).toEqual({
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 4,
      newCalculableTargetOutputs: 4,
      runtimeBasisPromotions: 4,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 4,
      sourceRowsImported: 0,
      unsupportedBoundariesProtected: 8
    });
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    for (const docPath of REQUIRED_DOCS) {
      const doc = readRepoFile(docPath);

      expect(doc).toContain(PREVIOUS_RERANK_ACTION);
      expect(doc).toContain(PREVIOUS_RERANK_STATUS);
      expect(doc).toContain(PREVIOUS_RERANK_PLAN_DOC);
      expect(doc).toContain(OWNER_ACTION);
      expect(doc).toContain(OWNER_STATUS);
      expect(doc).toContain(OWNER_PLAN_DOC);
      expect(doc).toContain(SELECTED_CANDIDATE_ID);
      expect(doc).toContain(SELECTED_NEXT_ACTION);
      expect(doc).toContain(SELECTED_NEXT_FILE);
      expect(doc).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(doc).toContain(SELECTED_NEXT_LABEL);
      expect(doc).toContain("newCalculableRequestShapes: 4");
      expect(doc).toContain("newCalculableTargetOutputs: 4");
      expect(doc).toContain("runtimeValuesMoved 4");
      expect(doc).toContain("runtimeFormulaRetunes: 0");
      expect(doc).toContain("sourceRowsImported: 0");
      expect(doc).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});

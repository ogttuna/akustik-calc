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
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING } from "./dynamic-airborne-gate-l-building-prediction-boundary";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
} from "./project-user-measured-wall-airborne-frequency-compatible-delta";
import {
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
} from "./project-user-measured-wall-airborne-frequency-exact-curve-bridge";
import {
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID,
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_WARNING
} from "./project-user-measured-wall-airborne-frequency-field-building-adapter";
import { buildProjectUserMeasuredWallRwRequestSnapshot } from "./project-user-measured-wall-rw-exact-bridge";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const OWNER_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md";
const OWNER_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID;

const SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 project/user measured wall airborne frequency field/building adapter coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 4,
  newCalculableTargetOutputs: 20,
  runtimeBasisPromotions: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 20,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 7
} as const;

const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
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

const INCOMPLETE_FIELD_CONTEXT = {
  ...ADDED_BOARD_LAB_CONTEXT,
  contextMode: "field_between_rooms",
  hostWallAreaM2: 10,
  panelHeightMm: 2500,
  panelWidthMm: 4000,
  receivingRoomVolumeM3: 40
} as const satisfies AirborneContext;

const BUILDING_CONTEXT = {
  ...ADDED_BOARD_LAB_CONTEXT,
  contextMode: "building_prediction",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "single_conservative_path",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 3.2,
  panelHeightMm: 2500,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 40,
  sourceRoomVolumeM3: 42
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
    createdAtIso: "2026-06-18T14:00:00.000Z",
    createdBy: "project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract",
    createdFromProjectId: "project-user-measured-wall-airborne-frequency-field-building-adapter-owner",
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
    updatedAtIso: "2026-06-18T14:00:00.000Z"
  };
}

function buildExactAddedBoardAnchor() {
  return buildActiveFrequencyAnchor({
    id: "project-user-measured-wall-airborne-frequency-field-building-exact-added-board",
    snapshot: buildRuntimeSnapshot({
      context: ADDED_BOARD_LAB_CONTEXT,
      layers: ADDED_BOARD_WALL_LAYERS
    })
  });
}

function buildCompatibleBaseAnchor() {
  return buildActiveFrequencyAnchor({
    id: "project-user-measured-wall-airborne-frequency-field-building-compatible-base",
    snapshot: buildRuntimeSnapshot({
      context: BASE_LAB_CONTEXT,
      layers: BASE_WALL_LAYERS
    })
  });
}

function expectFieldBuildingMetrics(
  result: ReturnType<typeof calculateAssembly>,
  expected: {
    readonly dnw: number;
    readonly dna: number;
    readonly dnta: number;
    readonly dntw: number;
    readonly rwPrime: number;
  }
) {
  expect(result.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics.estimatedRwPrimeDb).toBe(expected.rwPrime);
  expect(result.metrics.estimatedDnWDb).toBe(expected.dnw);
  expect(result.metrics.estimatedDnADb).toBe(expected.dna);
  expect(result.metrics.estimatedDnTwDb).toBe(expected.dntw);
  expect(result.metrics.estimatedDnTADb).toBe(expected.dnta);
}

function expectProjectMeasuredAdapterBasis(result: ReturnType<typeof calculateAssembly>, method: string) {
  expect(result.airborneBasis).toMatchObject({
    calculationStandard: "ISO 12354-1",
    kind: "airborne_physics_prediction",
    method,
    origin: "family_physics_prediction",
    ratingStandard: "ISO 717-1"
  });
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "airborneMeasuredFrequencySourceAnchors",
      "projectUserMeasuredFrequencyDirectTransmissionLossCurve",
      "GateI_or_GateAR_field_building_adapter_owner"
    ])
  );
  expect(result.airborneBasis?.assumptions).toEqual(
    expect.arrayContaining([
      expect.stringContaining("lab Rw, STC, C, and Ctr are not relabelled")
    ])
  );
  expect(result.warnings).toContain(
    POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_WARNING
  );
}

describe("post-V1 project/user measured wall airborne frequency field/building adapter owner", () => {
  it("adapts an exact full-stack measured TL curve into owned field outputs without relabelling lab metrics", () => {
    const anchor = buildExactAddedBoardAnchor();
    const labResult = calculateWall({
      context: ADDED_BOARD_LAB_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const fieldResult = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });

    expect(labResult.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(labResult.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expectFieldBuildingMetrics(fieldResult, {
      dnw: 49,
      dna: 47.7,
      dnta: 48.8,
      dntw: 50,
      rwPrime: 49
    });
    expectProjectMeasuredAdapterBasis(fieldResult, GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(fieldResult.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "projectUserMeasuredFrequencyFieldBuildingSource:exact_full_stack",
        "fieldContext.contextMode:field_between_rooms",
        "fieldContext.receivingRoomVolumeM3",
        "fieldContext.receivingRoomRt60S"
      ])
    );
    expect(fieldResult.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);
    expect(fieldResult.supportedTargetOutputs).not.toContain("STC");
  });

  it("adapts a compatible measured TL curve plus bounded exterior-board delta into owned field and building outputs", () => {
    const anchor = buildCompatibleBaseAnchor();
    const labResult = calculateWall({
      context: ADDED_BOARD_LAB_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const fieldResult = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    const buildingResult = calculateWall({
      context: BUILDING_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });

    expect(labResult.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
    );
    expectFieldBuildingMetrics(fieldResult, {
      dnw: 52,
      dna: 50.7,
      dnta: 51.8,
      dntw: 53,
      rwPrime: 52
    });
    expectProjectMeasuredAdapterBasis(fieldResult, GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(fieldResult.airborneBasis?.requiredInputs).toContain(
      "projectUserMeasuredFrequencyFieldBuildingSource:compatible_delta"
    );
    expectFieldBuildingMetrics(buildingResult, {
      dnw: 52,
      dna: 50.7,
      dnta: 51.8,
      dntw: 53,
      rwPrime: 52
    });
    expectProjectMeasuredAdapterBasis(buildingResult, GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(buildingResult.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "buildingPredictionOutputBasis",
        "flankingJunctionClass",
        "conservativeFlankingAssumption",
        "junctionCouplingLengthM",
        "ISO_12354_1_direct_separating_element_frequency_curve_owner"
      ])
    );
    expect(buildingResult.warnings).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING);
    expect(buildingResult.warnings).not.toContain(GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING);
  });

  it("keeps incomplete context and impact requests outside the measured-frequency field/building owner", () => {
    const anchor = buildCompatibleBaseAnchor();
    const incompleteFieldResult = calculateWall({
      context: INCOMPLETE_FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    const impactResult = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: IMPACT_OUTPUTS
    });

    expect(incompleteFieldResult.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(incompleteFieldResult.supportedTargetOutputs).toEqual([]);
    expect(incompleteFieldResult.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(incompleteFieldResult.warnings).not.toContain(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_WARNING
    );
    expect(impactResult.supportedTargetOutputs).toEqual([]);
    expect(impactResult.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impactResult.airborneBasis?.assumptions ?? []).toEqual(
      expect.not.arrayContaining([
        expect.stringContaining("Gate I / Gate AR must calculate field/building outputs")
      ])
    );
  });

  it("documents the landed owner, counters, and selected coverage refresh handoff", () => {
    expect(OWNER_FILE).toBe(
      "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract.test.ts"
    );
    expect(SELECTED_CANDIDATE_ID).toBe("project_user_measured_wall_airborne_frequency_field_building_adapter_owner");
    expect(OWNER_COUNTERS).toEqual({
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 4,
      newCalculableTargetOutputs: 20,
      runtimeBasisPromotions: 4,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 20,
      sourceRowsImported: 0,
      unsupportedBoundariesProtected: 7
    });
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    for (const docPath of REQUIRED_DOCS) {
      const doc = readRepoFile(docPath);

      expect(doc).toContain(OWNER_ACTION);
      expect(doc).toContain(OWNER_STATUS);
      expect(doc).toContain(SELECTED_CANDIDATE_ID);
      expect(doc).toContain(SELECTED_NEXT_ACTION);
      expect(doc).toContain(SELECTED_NEXT_FILE);
      expect(doc).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(doc).toContain(SELECTED_NEXT_LABEL);
      expect(doc).toContain("newCalculableRequestShapes: 4");
      expect(doc).toContain("newCalculableTargetOutputs: 20");
      expect(doc).toContain("runtimeValuesMoved 20");
      expect(doc).toContain("sourceRowsImported: 0");
    }
  });
});

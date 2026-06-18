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

const COVERAGE_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan";
const COVERAGE_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const COVERAGE_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building lab-companion basis integrity coverage refresh";

const COVERAGE_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
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
  "docs/calculator/HIGH_ROI_CALCULATOR_IMPLEMENTATION_SELECTION_PLAN_2026-06-18.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  OWNER_PLAN_DOC,
  COVERAGE_PLAN_DOC,
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
    createdAtIso: "2026-06-18T18:00:00.000Z",
    createdBy: "project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-coverage",
    createdFromProjectId:
      "project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-coverage",
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
    updatedAtIso: "2026-06-18T18:00:00.000Z"
  };
}

function buildExactAddedBoardAnchor() {
  return buildActiveFrequencyAnchor({
    id: "project-user-measured-wall-airborne-frequency-lab-companion-basis-coverage-exact",
    snapshot: buildRuntimeSnapshot({
      context: ADDED_BOARD_LAB_CONTEXT,
      layers: ADDED_BOARD_WALL_LAYERS
    })
  });
}

function buildCompatibleBaseAnchor() {
  return buildActiveFrequencyAnchor({
    id: "project-user-measured-wall-airborne-frequency-lab-companion-basis-coverage-compatible",
    snapshot: buildRuntimeSnapshot({
      context: BASE_LAB_CONTEXT,
      layers: BASE_WALL_LAYERS
    })
  });
}

function expectLabCompanionValues(input: {
  readonly buildingDnTw: number;
  readonly buildingResult: ReturnType<typeof calculateAssembly>;
  readonly expectedLabResult: ReturnType<typeof calculateAssembly>;
  readonly fieldResult: ReturnType<typeof calculateAssembly>;
  readonly fieldRwPrime: number;
}) {
  expect(input.fieldResult.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
  expect(input.fieldResult.supportedTargetOutputs).toEqual([...FIELD_MIXED_OUTPUTS]);
  expect(input.fieldResult.unsupportedTargetOutputs).toEqual([]);
  expect(input.fieldResult.metrics.estimatedRwPrimeDb).toBe(input.fieldRwPrime);

  expect(input.buildingResult.airborneBasis?.method).toBe(
    GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
  );
  expect(input.buildingResult.supportedTargetOutputs).toEqual([...BUILDING_MIXED_OUTPUTS]);
  expect(input.buildingResult.unsupportedTargetOutputs).toEqual([]);
  expect(input.buildingResult.metrics.estimatedDnTwDb).toBe(input.buildingDnTw);

  for (const result of [input.fieldResult, input.buildingResult]) {
    expect(result.metrics.estimatedRwDb).toBe(input.expectedLabResult.metrics.estimatedRwDb);
    expect(typeof result.metrics.estimatedStc).toBe("number");
    expect(typeof result.metrics.estimatedCDb).toBe("number");
    expect(typeof result.metrics.estimatedCtrDb).toBe("number");
  }
}

function coverageSummary() {
  return {
    counters: COVERAGE_COUNTERS,
    landedGate: COVERAGE_ACTION,
    previousOwner: {
      implementationFile: OWNER_FILE,
      planDoc: OWNER_PLAN_DOC,
      selectedGate: OWNER_ACTION,
      status: OWNER_STATUS
    },
    previousRerank: {
      implementationFile: PREVIOUS_RERANK_FILE,
      planDoc: PREVIOUS_RERANK_PLAN_DOC,
      selectedGate: PREVIOUS_RERANK_ACTION,
      status: PREVIOUS_RERANK_STATUS
    },
    runtimeValueMovement: false,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_STATUS
  };
}

describe("post-V1 project/user measured wall airborne frequency field/building lab-companion basis integrity coverage refresh", () => {
  it("lands a no-runtime refresh over the measured-frequency field/building lab companion owner", () => {
    expect(coverageSummary()).toMatchObject({
      counters: COVERAGE_COUNTERS,
      landedGate: COVERAGE_ACTION,
      runtimeValueMovement: false,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_STATUS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      PREVIOUS_RERANK_PLAN_DOC,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      COVERAGE_FILE,
      COVERAGE_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("freezes exact measured lab companions beside mixed field and building outputs", () => {
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
    expectLabCompanionValues({
      buildingDnTw: 50,
      buildingResult: building,
      expectedLabResult: lab,
      fieldResult: field,
      fieldRwPrime: 49
    });
  });

  it("freezes compatible measured lab companions beside mixed field and building outputs", () => {
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
    expectLabCompanionValues({
      buildingDnTw: 53,
      buildingResult: building,
      expectedLabResult: lab,
      fieldResult: field,
      fieldRwPrime: 52
    });
  });

  it("records later lab-only closure while missing context and impact boundaries stay protected", () => {
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

  it("keeps active docs aligned with the coverage refresh and next rerank handoff", () => {
    for (const path of REQUIRED_DOCS) {
      const doc = readRepoFile(path);

      expect(doc, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(doc, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(doc, path).toContain(OWNER_ACTION);
      expect(doc, path).toContain(OWNER_STATUS);
      expect(doc, path).toContain(OWNER_FILE);
      expect(doc, path).toContain(OWNER_PLAN_DOC);
      expect(doc, path).toContain(SELECTED_CANDIDATE_ID);
      expect(doc, path).toContain(COVERAGE_ACTION);
      expect(doc, path).toContain(COVERAGE_STATUS);
      expect(doc, path).toContain(COVERAGE_FILE);
      expect(doc, path).toContain(COVERAGE_PLAN_DOC);
      expect(doc, path).toContain(SELECTED_NEXT_ACTION);
      expect(doc, path).toContain(SELECTED_NEXT_FILE);
      expect(doc, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(doc, path).toContain(SELECTED_NEXT_LABEL);
      expect(doc, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(doc, path).toContain("runtimeValuesMoved 0");
      expect(doc, path).toContain("runtimeFormulaRetunes: 0");
      expect(doc, path).toContain("sourceRowsImported: 0");
      expect(doc, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});

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
import { buildLayerCombinationResolverTraceForAssembly } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD,
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_SELECTED_CANDIDATE_ID,
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_WARNING_PREFIX
} from "./project-user-measured-wall-airborne-frequency-compatible-delta";
import {
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
} from "./project-user-measured-wall-airborne-frequency-exact-curve-bridge";
import { buildProjectUserMeasuredWallRwRequestSnapshot } from "./project-user-measured-wall-rw-exact-bridge";

export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_PLAN =
  "post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_plan";
export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_landed_runtime_selected_coverage_refresh";
export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan";
export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts";
export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md";

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

const NON_BOARD_CHANGED_WALL_LAYERS = [
  ...BASE_WALL_LAYERS,
  { materialId: "air_gap", thicknessMm: 12.5 }
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

const ADDED_BOARD_FIELD_CONTEXT = {
  ...ADDED_BOARD_LAB_CONTEXT,
  contextMode: "field_between_rooms",
  hostWallAreaM2: 10,
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
    context: input.context ?? BASE_LAB_CONTEXT,
    layers: input.layers ?? BASE_WALL_LAYERS,
    targetOutputs: RW_ONLY
  });

  return buildProjectUserMeasuredWallRwRequestSnapshot({
    airborneContext: input.context ?? BASE_LAB_CONTEXT,
    resolvedLayers: baseline.layers
  });
}

function buildActiveFrequencyAnchor(
  input: {
    readonly id?: string;
    readonly ratingStandards?: readonly ("ASTM E413" | "ISO 717-1" | "source_report_unknown")[];
    readonly snapshot?: ProjectUserMeasuredWallConstructionSnapshot;
  } = {}
): ProjectUserMeasuredWallAirborneFrequencyAnchor {
  const snapshot = input.snapshot ?? buildRuntimeSnapshot();
  const ratingStandards: ProjectUserMeasuredWallAirborneFrequencyAnchor["ratingStandards"] = [
    ...(input.ratingStandards ?? ["ISO 717-1", "ASTM E413"])
  ];
  const fingerprint = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
    frequencyBands: FREQUENCY_BANDS,
    measurementMethodStandard: "ISO 10140-2",
    ratingStandards,
    snapshot
  });

  return {
    canonicalizationVersion: PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-18T10:00:00.000Z",
    createdBy: "project-user-measured-wall-airborne-frequency-compatible-delta-owner-contract",
    createdFromProjectId: "project-user-measured-wall-airborne-frequency-compatible-delta-owner",
    curveBasis: "measured_frequency_curve",
    fingerprint,
    frequencyBands: FREQUENCY_BANDS,
    id: input.id ?? "project-user-measured-wall-airborne-frequency-compatible-delta-base-stack",
    inputBasis: "airborne_transmission_loss_curve",
    measurementMethodStandard: "ISO 10140-2",
    metricBasis: "lab_airborne_transmission_loss_curve",
    metricFamily: "airborne",
    ratingStandards,
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceLabel: "Project measured wall airborne frequency compatible-delta base stack",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T10:00:00.000Z"
  };
}

describe("post-V1 project/user measured wall airborne frequency compatible-delta owner", () => {
  it("uses a matching reduced measured TL curve plus bounded exterior-board delta for lab Rw, STC, C, and Ctr", () => {
    const anchor = buildActiveFrequencyAnchor();
    const baseExact = calculateWall({
      context: BASE_LAB_CONTEXT,
      frequencyAnchors: [anchor],
      layers: BASE_WALL_LAYERS,
      targetOutputs: LAB_OUTPUTS
    });
    const result = calculateWall({
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const selectedCandidate = result.airborneCandidateResolution?.candidates.find(
      (candidate: { readonly selected: boolean }) => candidate.selected
    );
    const trace = buildLayerCombinationResolverTraceForAssembly(result);

    expect(baseExact.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(result.airborneBasis).toMatchObject({
      anchorSourceId: anchor.id,
      calculationStandard: "engine_bounded_estimate",
      curveBasis: "calculated_frequency_curve",
      kind: "airborne_anchored_delta",
      measurementStandard: "ISO 10140-2",
      method: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD,
      origin: "measured_exact_subassembly_plus_calculated_delta",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.metrics.estimatedRwDb).toBeGreaterThan(baseExact.metrics.estimatedRwDb ?? 0);
    expect(typeof result.metrics.estimatedStc).toBe("number");
    expect(typeof result.metrics.estimatedCDb).toBe("number");
    expect(typeof result.metrics.estimatedCtrDb).toBe("number");
    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_SELECTED_CANDIDATE_ID,
      selectedOrigin: "measured_exact_subassembly_plus_calculated_delta",
      selectedBasis: {
        method: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
      }
    });
    expect(selectedCandidate).toMatchObject({
      id: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_SELECTED_CANDIDATE_ID,
      origin: "measured_exact_subassembly_plus_calculated_delta",
      selected: true
    });
    expect(result.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "airborneMeasuredFrequencySourceAnchors",
        "canonicalReducedWallAirborneFrequencyFingerprint",
        "compatibleExteriorBoardDelta",
        "boundedAddedBoardMassDelta",
        "explicitWallTopologyLayerIndices",
        "targetOutput:Rw",
        "targetOutput:STC",
        "targetOutput:C",
        "targetOutput:Ctr"
      ])
    );
    expect(result.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        expect.stringContaining("removing only compatible exterior board layer changes"),
        expect.stringContaining("field, building, impact, OITC")
      ])
    );
    expect(result.warnings.some((warning: string) =>
      warning.startsWith(POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_WARNING_PREFIX)
    )).toBe(true);
    expect(trace).toMatchObject({
      basis: "element_lab",
      runtimeBasisId: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
    });
    expect(trace?.surfaceDetail).toMatch(/measured subassembly anchor plus the owned calculated added-layer delta/i);
  });

  it("keeps target-output independence for single lab outputs without requiring Rw to be requested", () => {
    const anchor = buildActiveFrequencyAnchor();

    for (const output of LAB_OUTPUTS) {
      const result = calculateWall({
        frequencyAnchors: [anchor],
        targetOutputs: [output]
      });

      expect(result.airborneBasis?.method).toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
      );
      expect(result.airborneCandidateResolution?.selectedOrigin).toBe(
        "measured_exact_subassembly_plus_calculated_delta"
      );
      expect(result.supportedTargetOutputs).toEqual([output]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.airborneBasis?.requiredInputs).toContain(`targetOutput:${output}`);
    }
  });

  it("lets exact full-stack measured curves outrank compatible-delta when the current stack matches exactly", () => {
    const exactCurrentAnchor = buildActiveFrequencyAnchor({
      snapshot: buildRuntimeSnapshot({
        context: ADDED_BOARD_LAB_CONTEXT,
        layers: ADDED_BOARD_WALL_LAYERS
      })
    });
    const result = calculateWall({
      frequencyAnchors: [exactCurrentAnchor],
      targetOutputs: LAB_OUTPUTS
    });

    expect(result.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(result.airborneCandidateResolution?.selectedOrigin).toBe("measured_exact_full_stack");
    expect(result.warnings.some((warning: string) =>
      warning.startsWith(POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_WARNING_PREFIX)
    )).toBe(false);
  });

  it("keeps missing rating-standard outputs unsupported instead of aliasing ISO and ASTM ratings", () => {
    const isoOnlyAnchor = buildActiveFrequencyAnchor({
      ratingStandards: ["ISO 717-1"]
    });
    const result = calculateWall({
      frequencyAnchors: [isoOnlyAnchor],
      targetOutputs: ["STC"]
    });

    expect(result.airborneBasis?.method).not.toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
    );
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["STC"]);
    expect(result.warnings.some((warning: string) =>
      /does not declare the required rating standard basis/i.test(warning)
    )).toBe(true);
  });

  it("rejects ambiguous reduced-stack anchors instead of picking one arbitrarily", () => {
    const firstAnchor = buildActiveFrequencyAnchor({
      id: "project-user-measured-wall-airborne-frequency-compatible-delta-base-stack-a"
    });
    const secondAnchor = buildActiveFrequencyAnchor({
      id: "project-user-measured-wall-airborne-frequency-compatible-delta-base-stack-b"
    });
    const result = calculateWall({
      frequencyAnchors: [firstAnchor, secondAnchor],
      targetOutputs: ["Rw"]
    });

    expect(result.airborneBasis?.method).not.toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
    );
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw"]);
    expect(result.warnings.some((warning: string) =>
      /multiple active reduced-stack anchors/i.test(warning)
    )).toBe(true);
  });

  it("keeps field, impact, and non-board changes outside the compatible-delta owner", () => {
    const anchor = buildActiveFrequencyAnchor();
    const field = calculateWall({
      context: ADDED_BOARD_FIELD_CONTEXT,
      frequencyAnchors: [anchor],
      targetOutputs: ["R'w"]
    });
    const impact = calculateWall({
      frequencyAnchors: [anchor],
      targetOutputs: ["IIC"]
    });
    const nonBoardChange = calculateWall({
      context: {
        ...ADDED_BOARD_LAB_CONTEXT,
        wallTopology: {
          ...ADDED_BOARD_LAB_CONTEXT.wallTopology,
          sideBLeafLayerIndices: [3],
          cavity1LayerIndices: [1, 2, 4]
        }
      },
      frequencyAnchors: [anchor],
      layers: NON_BOARD_CHANGED_WALL_LAYERS,
      targetOutputs: ["Rw"]
    });

    for (const result of [field, impact, nonBoardChange]) {
      expect(result.airborneBasis?.method).not.toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
      );
      expect(result.airborneCandidateResolution?.selectedBasis?.method).not.toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
      );
      expect(result.warnings.some((warning: string) =>
        warning.startsWith(POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_WARNING_PREFIX)
      )).toBe(false);
    }
  });

  it("documents runtime movement and the selected coverage-refresh follow-up", () => {
    expect({
      counters: {
        frontendImplementationFilesTouched: 0,
        newCalculableLayerTemplates: 0,
        newCalculableRequestShapes: 4,
        newCalculableTargetOutputs: 4,
        runtimeBasisPromotions: 1,
        runtimeFormulaRetunes: 0,
        runtimeValuesMoved: 4,
        sourceRowsImported: 0,
        unsupportedBoundariesProtected: 7
      },
      noBroadSourceCrawl: true,
      plan: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_PLAN,
      selectedCandidate:
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_SELECTED_CANDIDATE_ID,
      selectedNextAction:
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_SELECTED_NEXT_FILE,
      selectedNextPlanDoc:
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_SELECTED_NEXT_PLAN_DOC,
      status: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_STATUS
    }).toMatchObject({
      counters: {
        newCalculableRequestShapes: 4,
        newCalculableTargetOutputs: 4,
        runtimeValuesMoved: 4
      },
      noBroadSourceCrawl: true,
      selectedNextAction:
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_SELECTED_NEXT_ACTION,
      status: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_STATUS
    });
  });
});

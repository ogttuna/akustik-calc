import {
  EstimateRequestSchema,
  PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
  PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION,
  buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint,
  buildProjectUserMeasuredWallRwAnchorFingerprint,
  type AirborneContext,
  type LayerInput,
  type MaterialDefinition,
  type ProjectUserMeasuredWallAirborneFrequencyAnchor,
  type ProjectUserMeasuredWallAirborneFrequencyBands,
  type ProjectUserMeasuredWallConstructionSnapshot,
  type ProjectUserMeasuredWallRwAnchor,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildRatingsFromCurve } from "./curve-rating";
import {
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD,
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_SELECTED_CANDIDATE_ID,
  POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_WARNING_PREFIX
} from "./project-user-measured-wall-airborne-frequency-exact-curve-bridge";
import { buildProjectUserMeasuredWallRwRequestSnapshot } from "./project-user-measured-wall-rw-exact-bridge";

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const RW_ONLY = ["Rw"] as const satisfies readonly RequestedOutputId[];

const PROJECT_BOARD = {
  acoustic: {
    behavior: "panel_leaf",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "finish",
  densityKgM3: 720,
  id: "project_frequency_exact_bridge_board_720",
  name: "Project frequency exact bridge board 720",
  tags: ["project-user-measured-frequency-anchor-test"]
} as const satisfies MaterialDefinition;

const PROJECT_AIR = {
  acoustic: {
    behavior: "air_cavity",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "gap",
  densityKgM3: 0,
  id: "project_frequency_exact_bridge_air_gap",
  name: "Project frequency exact bridge air gap",
  tags: ["project-user-measured-frequency-anchor-test"]
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
  id: "project_frequency_exact_bridge_absorber_48",
  name: "Project frequency exact bridge absorber 48",
  tags: ["project-user-measured-frequency-anchor-test"]
} as const satisfies MaterialDefinition;

const PROJECT_MATERIALS = [
  PROJECT_BOARD,
  PROJECT_AIR,
  PROJECT_ABSORBER
] as const satisfies readonly MaterialDefinition[];

const PROJECT_WALL_LAYERS = [
  { materialId: PROJECT_BOARD.id, thicknessMm: 12.5 },
  { materialId: PROJECT_AIR.id, thicknessMm: 70 },
  { materialId: PROJECT_ABSORBER.id, thicknessMm: 50 },
  { materialId: PROJECT_BOARD.id, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const LAB_CONTEXT = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1DepthMm: 70,
    cavity1LayerIndices: [1, 2],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [3],
    topologyMode: "flat_layer_order"
  }
} as const satisfies AirborneContext;

const FIELD_CONTEXT = {
  ...LAB_CONTEXT,
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

function calculateProjectWall(
  input: {
    readonly context?: AirborneContext;
    readonly frequencyAnchors?: readonly ProjectUserMeasuredWallAirborneFrequencyAnchor[] | null;
    readonly layers?: readonly LayerInput[];
    readonly rwAnchors?: readonly ProjectUserMeasuredWallRwAnchor[] | null;
    readonly targetOutputs?: readonly RequestedOutputId[];
  } = {}
) {
  return calculateAssembly(input.layers ?? PROJECT_WALL_LAYERS, {
    airborneContext: input.context ?? LAB_CONTEXT,
    airborneMeasuredFrequencySourceAnchors: input.frequencyAnchors ?? null,
    airborneMeasuredSourceAnchors: input.rwAnchors ?? null,
    calculator: "dynamic",
    catalog: PROJECT_MATERIALS,
    targetOutputs: input.targetOutputs ?? LAB_OUTPUTS
  });
}

function buildRuntimeSnapshot(
  input: {
    readonly context?: AirborneContext;
    readonly layers?: readonly LayerInput[];
  } = {}
): ProjectUserMeasuredWallConstructionSnapshot {
  const baseline = calculateProjectWall({
    context: input.context ?? LAB_CONTEXT,
    layers: input.layers ?? PROJECT_WALL_LAYERS,
    targetOutputs: RW_ONLY
  });

  return buildProjectUserMeasuredWallRwRequestSnapshot({
    airborneContext: input.context ?? LAB_CONTEXT,
    resolvedLayers: baseline.layers
  });
}

function buildActiveFrequencyAnchor(
  input: {
    readonly frequencyBands?: ProjectUserMeasuredWallAirborneFrequencyBands;
    readonly ratingStandards?: readonly ("ASTM E413" | "ISO 717-1" | "source_report_unknown")[];
    readonly snapshot?: ProjectUserMeasuredWallConstructionSnapshot;
  } = {},
  overrides: Partial<ProjectUserMeasuredWallAirborneFrequencyAnchor> = {}
): ProjectUserMeasuredWallAirborneFrequencyAnchor {
  const snapshot = input.snapshot ?? buildRuntimeSnapshot();
  const frequencyBands = input.frequencyBands ?? FREQUENCY_BANDS;
  const ratingStandards: ProjectUserMeasuredWallAirborneFrequencyAnchor["ratingStandards"] = [
    ...(input.ratingStandards ?? ["ISO 717-1", "ASTM E413"])
  ];
  const fingerprint = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
    frequencyBands,
    measurementMethodStandard: "ISO 10140-2",
    ratingStandards,
    snapshot
  });

  return {
    canonicalizationVersion: PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-18T10:00:00.000Z",
    createdBy: "frequency-exact-curve-bridge-owner-contract",
    createdFromProjectId: "project-frequency-exact-curve-bridge-owner",
    curveBasis: "measured_frequency_curve",
    fingerprint,
    frequencyBands,
    id: "project-user-measured-wall-airborne-frequency-exact-curve-bridge",
    inputBasis: "airborne_transmission_loss_curve",
    measurementMethodStandard: "ISO 10140-2",
    metricBasis: "lab_airborne_transmission_loss_curve",
    metricFamily: "airborne",
    ratingStandards,
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceLabel: "Project measured wall airborne frequency exact curve",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T10:00:00.000Z",
    ...overrides
  };
}

function buildActiveRwAnchor(
  snapshot: ProjectUserMeasuredWallConstructionSnapshot = buildRuntimeSnapshot()
): ProjectUserMeasuredWallRwAnchor {
  const fingerprint = buildProjectUserMeasuredWallRwAnchorFingerprint({
    measurementMethodStandard: "ISO 10140-2",
    ratingStandard: "ISO 717-1",
    snapshot
  });

  return {
    canonicalizationVersion: PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-18T10:00:00.000Z",
    createdBy: "frequency-exact-curve-bridge-owner-contract",
    createdFromProjectId: "project-frequency-exact-curve-bridge-owner",
    fingerprint,
    id: "project-user-measured-wall-rw-exact-curve-bridge-separation",
    measurementMethodStandard: "ISO 10140-2",
    metric: "Rw",
    metricBasis: "lab_rw",
    ratingStandard: "ISO 717-1",
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceLabel: "Project measured wall Rw scalar separation",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T10:00:00.000Z",
    valueDb: 63
  };
}

function expectedRatings(anchor: ProjectUserMeasuredWallAirborneFrequencyAnchor) {
  const sortedBands = [...anchor.frequencyBands.values].sort((left, right) =>
    left.frequencyHz - right.frequencyHz
  );

  return buildRatingsFromCurve(
    sortedBands.map((band) => band.frequencyHz),
    sortedBands.map((band) => band.transmissionLossDb)
  );
}

describe("post-V1 project/user measured wall airborne frequency exact curve bridge owner", () => {
  it("accepts active measured frequency anchors and publishes exact curve-rated lab Rw, STC, C, and Ctr", () => {
    const anchor = buildActiveFrequencyAnchor();
    const parsedRequest = EstimateRequestSchema.safeParse({
      airborneContext: LAB_CONTEXT,
      airborneMeasuredFrequencySourceAnchors: [anchor],
      calculator: "dynamic",
      layers: PROJECT_WALL_LAYERS,
      materialCatalog: PROJECT_MATERIALS,
      targetOutputs: LAB_OUTPUTS
    });
    const expected = expectedRatings(anchor);
    const result = calculateProjectWall({
      frequencyAnchors: [anchor],
      targetOutputs: LAB_OUTPUTS
    });
    const selectedCandidate = result.airborneCandidateResolution?.candidates.find(
      (candidate: { readonly id: string }) =>
        candidate.id === POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_SELECTED_CANDIDATE_ID
    );

    expect(parsedRequest.success).toBe(true);
    expect(result.metrics).toMatchObject({
      estimatedCDb: expected.iso717.C,
      estimatedCtrDb: expected.iso717.Ctr,
      estimatedRwDb: expected.iso717.Rw,
      estimatedStc: expected.astmE413.STC
    });
    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneBasis).toMatchObject({
      curveBasis: "measured_frequency_curve",
      exactSourceId: anchor.id,
      frequencyBands: {
        bandSet: "third_octave_100_3150",
        frequenciesHz: anchor.frequencyBands.values.map((band) => band.frequencyHz)
      },
      kind: "airborne_measured_exact",
      method: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD,
      origin: "measured_exact_full_stack",
      toleranceClass: "exact_source"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_SELECTED_CANDIDATE_ID,
      selectedOrigin: "measured_exact_full_stack",
      selectedBasis: {
        method: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
      }
    });
    expect(selectedCandidate).toMatchObject({
      metricIds: [...LAB_OUTPUTS],
      origin: "measured_exact_full_stack",
      outputIds: [...LAB_OUTPUTS],
      rejectionReasons: [],
      selected: true
    });
    expect(result.airborneCandidateResolution?.candidates[0]?.basis.requiredInputs).toEqual(
      expect.arrayContaining([
        "airborneMeasuredFrequencySourceAnchors",
        "canonicalWallAirborneFrequencyFingerprint",
        "targetOutput:Rw",
        "targetOutput:STC",
        "targetOutput:C",
        "targetOutput:Ctr"
      ])
    );
    expect(result.airborneCandidateResolution?.candidates[0]?.basis.assumptions).toEqual(
      expect.arrayContaining([
        expect.stringContaining("field, building, impact")
      ])
    );
    expect(result.airborneCandidateResolution?.candidates[0]?.basis.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(result.airborneCandidateResolution?.candidates[0]?.basis.exactSourceId).toBe(anchor.id);
    expect(result.airborneCandidateResolution?.candidates[0]?.basis.ratingStandard).toBeUndefined();
    expect(result.airborneCandidateResolution?.candidates[0]?.basis.frequencyBands?.frequenciesHz).toEqual(
      anchor.frequencyBands.values.map((band) => band.frequencyHz)
    );
    expect(result.airborneCandidateResolution?.candidates[0]?.basis.requiredInputs).not.toContain(
      "airborneMeasuredSourceAnchors"
    );
    expect(result.warnings.some((warning: string) =>
      warning.startsWith(POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_WARNING_PREFIX)
    )).toBe(true);
  });

  it("keeps target-output independence for single lab outputs and lets curve anchors outrank scalar Rw anchors", () => {
    const snapshot = buildRuntimeSnapshot();
    const frequencyAnchor = buildActiveFrequencyAnchor({ snapshot });
    const scalarRwAnchor = buildActiveRwAnchor(snapshot);
    const expected = expectedRatings(frequencyAnchor);

    for (const output of LAB_OUTPUTS) {
      const result = calculateProjectWall({
        frequencyAnchors: [frequencyAnchor],
        rwAnchors: [scalarRwAnchor],
        targetOutputs: [output]
      });
      const selectedCandidate = result.airborneCandidateResolution?.candidates.find((candidate: { readonly selected: boolean }) =>
        candidate.selected
      );

      expect(result.airborneBasis?.method).toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
      );
      expect(result.airborneCandidateResolution?.selectedOrigin).toBe("measured_exact_full_stack");
      expect(selectedCandidate?.basis.requiredInputs).toContain(
        `targetOutput:${output}`
      );
      expect(result.airborneCandidateResolution?.selectedBasis?.method).toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
      );

      if (output === "Rw") {
        expect(result.metrics.estimatedRwDb).toBe(expected.iso717.Rw);
        expect(result.metrics.estimatedRwDb).not.toBe(scalarRwAnchor.valueDb);
      }
      if (output === "STC") {
        expect(result.metrics.estimatedStc).toBe(expected.astmE413.STC);
      }
      if (output === "C") {
        expect(result.metrics.estimatedCDb).toBe(expected.iso717.C);
      }
      if (output === "Ctr") {
        expect(result.metrics.estimatedCtrDb).toBe(expected.iso717.Ctr);
      }
    }
  });

  it("leaves missing rating-standard outputs unsupported instead of aliasing another standard", () => {
    const isoOnlyAnchor = buildActiveFrequencyAnchor({
      ratingStandards: ["ISO 717-1"]
    });
    const result = calculateProjectWall({
      frequencyAnchors: [isoOnlyAnchor],
      targetOutputs: ["STC"]
    });

    expect(result.airborneBasis?.method).not.toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["STC"]);
    expect(result.warnings.some((warning: string) =>
      /does not declare the required rating standard basis/i.test(warning)
    )).toBe(true);
  });

  it("keeps mismatched, field/building, and mixed field requests outside the exact curve bridge", () => {
    const runtimeSnapshot = buildRuntimeSnapshot();
    const staleButValidDifferentStackSnapshot = {
      ...runtimeSnapshot,
      layers: runtimeSnapshot.layers.map((layer, index) =>
        index === 0 ? { ...layer, thicknessMm: 15 } : layer
      )
    } satisfies ProjectUserMeasuredWallConstructionSnapshot;
    const mismatchedAnchor = buildActiveFrequencyAnchor({
      snapshot: staleButValidDifferentStackSnapshot
    });
    const matchingAnchor = buildActiveFrequencyAnchor();
    const baseline = calculateProjectWall({
      targetOutputs: LAB_OUTPUTS
    });
    const mismatch = calculateProjectWall({
      frequencyAnchors: [mismatchedAnchor],
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateProjectWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [matchingAnchor],
      targetOutputs: FIELD_OUTPUTS
    });
    const mixedField = calculateProjectWall({
      context: LAB_CONTEXT,
      frequencyAnchors: [matchingAnchor],
      targetOutputs: ["Rw", "R'w"]
    });

    expect(mismatch.metrics.estimatedRwDb).toBe(baseline.metrics.estimatedRwDb);

    for (const result of [mismatch, field, mixedField]) {
      expect(result.airborneBasis?.method).not.toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
      );
      expect(result.airborneCandidateResolution?.selectedBasis?.method).not.toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
      );
      expect(result.warnings.some((warning: string) =>
        warning.startsWith(POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_WARNING_PREFIX)
      )).toBe(false);
    }
  });
});

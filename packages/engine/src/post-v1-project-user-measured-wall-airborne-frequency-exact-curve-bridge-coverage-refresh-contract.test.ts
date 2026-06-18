import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

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

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_OWNER_PLAN_2026-06-18.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_landed_runtime_selected_coverage_refresh";
const PREVIOUS_SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency exact curve bridge coverage refresh";

const COVERAGE_REFRESH_COUNTERS = {
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
const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const RW_ONLY = ["Rw"] as const satisfies readonly RequestedOutputId[];

const PROJECT_BOARD = {
  acoustic: {
    behavior: "panel_leaf",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "finish",
  densityKgM3: 720,
  id: "project_frequency_exact_bridge_coverage_board_720",
  name: "Project frequency exact bridge coverage board 720",
  tags: ["project-user-measured-frequency-anchor-coverage"]
} as const satisfies MaterialDefinition;

const PROJECT_AIR = {
  acoustic: {
    behavior: "air_cavity",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "gap",
  densityKgM3: 0,
  id: "project_frequency_exact_bridge_coverage_air_gap",
  name: "Project frequency exact bridge coverage air gap",
  tags: ["project-user-measured-frequency-anchor-coverage"]
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
  id: "project_frequency_exact_bridge_coverage_absorber_48",
  name: "Project frequency exact bridge coverage absorber 48",
  tags: ["project-user-measured-frequency-anchor-coverage"]
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

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

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
    createdAtIso: "2026-06-18T11:00:00.000Z",
    createdBy: "frequency-exact-curve-bridge-coverage-contract",
    createdFromProjectId: "project-frequency-exact-curve-bridge-coverage",
    curveBasis: "measured_frequency_curve",
    fingerprint,
    frequencyBands,
    id: "project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage",
    inputBasis: "airborne_transmission_loss_curve",
    measurementMethodStandard: "ISO 10140-2",
    metricBasis: "lab_airborne_transmission_loss_curve",
    metricFamily: "airborne",
    ratingStandards,
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceLabel: "Project measured wall airborne frequency exact curve coverage",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T11:00:00.000Z",
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
    createdAtIso: "2026-06-18T11:00:00.000Z",
    createdBy: "frequency-exact-curve-bridge-coverage-contract",
    createdFromProjectId: "project-frequency-exact-curve-bridge-coverage",
    fingerprint,
    id: "project-user-measured-wall-rw-frequency-coverage-separation",
    measurementMethodStandard: "ISO 10140-2",
    metric: "Rw",
    metricBasis: "lab_rw",
    ratingStandard: "ISO 717-1",
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceLabel: "Project measured wall Rw scalar coverage separation",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T11:00:00.000Z",
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

function summarizeCoverageRefreshCloseout() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    previousOwner: {
      selectedNextAction: COVERAGE_REFRESH_ACTION,
      selectedNextFile: COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
    },
    previousOwnerAction: PREVIOUS_OWNER_ACTION,
    previousOwnerFile: PREVIOUS_OWNER_FILE,
    previousOwnerPlanDoc: PREVIOUS_OWNER_PLAN_DOC,
    runtimeMethod: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD,
    selectedCandidateId: PREVIOUS_SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function hasExactCurveWarning(result: ReturnType<typeof calculateProjectWall>): boolean {
  return result.warnings.some((warning: string) =>
    warning.startsWith(POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_WARNING_PREFIX)
  );
}

describe("post-V1 project/user measured wall airborne frequency exact curve bridge coverage refresh", () => {
  it("lands after the exact curve bridge owner and selects a runtime-first rerank next", () => {
    expect(summarizeCoverageRefreshCloseout()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      previousOwner: {
        selectedNextAction: COVERAGE_REFRESH_ACTION,
        selectedNextFile: COVERAGE_REFRESH_FILE,
        selectionStatus: PREVIOUS_OWNER_STATUS
      },
      runtimeMethod: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD,
      selectedCandidateId: PREVIOUS_SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });
    expect(existsSync(join(REPO_ROOT, PREVIOUS_OWNER_FILE))).toBe(true);
  });

  it("freezes the exact curve path through request intake, runtime basis, candidate resolution, and resolver trace", () => {
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
    expect(selectedCandidate?.basis.requiredInputs).toEqual(
      expect.arrayContaining([
        "airborneMeasuredFrequencySourceAnchors",
        "canonicalWallAirborneFrequencyFingerprint",
        "targetOutput:Rw",
        "targetOutput:STC",
        "targetOutput:C",
        "targetOutput:Ctr"
      ])
    );
    expect(result.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "exact_measured_override",
      requestedBasis: "element_lab",
      route: "wall",
      runtimeBasisId: "verified_airborne_exact_source",
      supportBucket: "exact",
      supportedMetrics: [...LAB_OUTPUTS]
    });
    expect(hasExactCurveWarning(result)).toBe(true);
  });

  it("keeps target-output independence and curve-anchor precedence over scalar Rw anchors", () => {
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

      expect(result.airborneBasis?.method).toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
      );
      expect(result.airborneCandidateResolution?.selectedBasis?.method).toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
      );
      expect(result.supportedTargetOutputs).toEqual([output]);
      expect(result.unsupportedTargetOutputs).toEqual([]);

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

  it("keeps schema guards active for inactive, stale, duplicate-id, and duplicate-fingerprint curve anchors", () => {
    const anchor = buildActiveFrequencyAnchor();
    const inactive = EstimateRequestSchema.safeParse({
      airborneMeasuredFrequencySourceAnchors: [
        buildActiveFrequencyAnchor({}, {
          sourceStatus: "draft"
        })
      ],
      calculator: "dynamic",
      layers: PROJECT_WALL_LAYERS,
      materialCatalog: PROJECT_MATERIALS,
      targetOutputs: ["Rw"]
    });
    const stale = EstimateRequestSchema.safeParse({
      airborneMeasuredFrequencySourceAnchors: [
        buildActiveFrequencyAnchor({}, {
          fingerprint: "dynecho:wall-airborne-frequency-anchor:v1:0000000000000000"
        })
      ],
      calculator: "dynamic",
      layers: PROJECT_WALL_LAYERS,
      materialCatalog: PROJECT_MATERIALS,
      targetOutputs: ["Rw"]
    });
    const duplicate = EstimateRequestSchema.safeParse({
      airborneMeasuredFrequencySourceAnchors: [
        anchor,
        {
          ...anchor,
          sourceLabel: "Duplicate measured wall airborne frequency coverage"
        }
      ],
      calculator: "dynamic",
      layers: PROJECT_WALL_LAYERS,
      materialCatalog: PROJECT_MATERIALS,
      targetOutputs: ["Rw"]
    });

    expect(inactive.success).toBe(false);
    if (!inactive.success) {
      expect(inactive.error.issues[0]?.path).toEqual([
        "airborneMeasuredFrequencySourceAnchors",
        0,
        "sourceStatus"
      ]);
    }
    expect(stale.success).toBe(false);
    if (!stale.success) {
      expect(stale.error.issues[0]?.path).toEqual([
        "airborneMeasuredFrequencySourceAnchors",
        0,
        "fingerprint"
      ]);
    }
    expect(duplicate.success).toBe(false);
    if (!duplicate.success) {
      expect(duplicate.error.issues.map((issue) => issue.path.join("."))).toEqual(
        expect.arrayContaining([
          "airborneMeasuredFrequencySourceAnchors.1.id",
          "airborneMeasuredFrequencySourceAnchors.1.fingerprint"
        ])
      );
    }
  });

  it("keeps missing rating-standard and ambiguous exact-curve conflicts unsupported instead of aliasing", () => {
    const isoOnlyAnchor = buildActiveFrequencyAnchor({
      ratingStandards: ["ISO 717-1"]
    });
    const firstAnchor = buildActiveFrequencyAnchor();
    const secondAnchor = buildActiveFrequencyAnchor({}, {
      id: "project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-conflict",
      sourceLabel: "Project measured wall airborne frequency exact curve coverage conflict"
    });
    const missingStandard = calculateProjectWall({
      frequencyAnchors: [isoOnlyAnchor],
      targetOutputs: ["STC"]
    });
    const ambiguous = calculateProjectWall({
      frequencyAnchors: [firstAnchor, secondAnchor],
      targetOutputs: ["Rw", "STC"]
    });

    expect(missingStandard.airborneBasis?.method).not.toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(missingStandard.supportedTargetOutputs).toEqual([]);
    expect(missingStandard.unsupportedTargetOutputs).toEqual(["STC"]);
    expect(missingStandard.warnings.some((warning: string) =>
      /does not declare the required rating standard basis/i.test(warning)
    )).toBe(true);

    expect(ambiguous.airborneBasis?.method).not.toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(ambiguous.supportedTargetOutputs).toEqual([]);
    expect(ambiguous.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(ambiguous.warnings).toContain(
      "Project/user measured wall airborne frequency exact curve bridge found multiple active anchors for the same element-lab wall request; DynEcho kept the requested lab outputs unsupported until the conflict is resolved."
    );
  });

  it("keeps mismatched stacks, field/building outputs, impact outputs, and mixed lab+field requests outside", () => {
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
    const probes = [
      calculateProjectWall({
        frequencyAnchors: [mismatchedAnchor],
        targetOutputs: LAB_OUTPUTS
      }),
      calculateProjectWall({
        context: FIELD_CONTEXT,
        frequencyAnchors: [matchingAnchor],
        targetOutputs: FIELD_OUTPUTS
      }),
      calculateProjectWall({
        frequencyAnchors: [matchingAnchor],
        targetOutputs: IMPACT_OUTPUTS
      }),
      calculateProjectWall({
        frequencyAnchors: [matchingAnchor],
        targetOutputs: ["Rw", "R'w"]
      })
    ];

    expect(probes[0].metrics.estimatedRwDb).toBe(baseline.metrics.estimatedRwDb);

    for (const result of probes) {
      expect(result.airborneBasis?.method).not.toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
      );
      expect(result.airborneCandidateResolution?.selectedBasis?.method).not.toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
      );
      expect(result.layerCombinationResolverTrace?.runtimeBasisId).not.toBe("verified_airborne_exact_source");
      expect(hasExactCurveWarning(result)).toBe(false);
    }
  });

  it("keeps active docs aligned with the landed no-runtime coverage refresh", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(contents, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(contents, path).toContain(PREVIOUS_OWNER_FILE);
      expect(contents, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(contents, path).toContain(COVERAGE_REFRESH_FILE);
      expect(contents, path).toContain(COVERAGE_REFRESH_PLAN_DOC);
      expect(contents, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(contents, path).toContain(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
      );
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(contents, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});

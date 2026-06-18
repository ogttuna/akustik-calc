import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
  PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION,
  buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint,
  buildProjectUserMeasuredWallRwAnchorFingerprint,
  type AirborneContext,
  type LayerInput,
  type ProjectUserMeasuredWallAirborneFrequencyAnchor,
  type ProjectUserMeasuredWallAirborneFrequencyBands,
  type ProjectUserMeasuredWallConstructionSnapshot,
  type ProjectUserMeasuredWallRwAnchor,
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

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const OWNER_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_PLAN_2026-06-18.md";
const OWNER_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_airborne_frequency_compatible_delta_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency compatible-delta coverage refresh";

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
const RW_C_CTR_OUTPUTS = ["Rw", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
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

const PAIRED_ADDED_BOARD_WALL_LAYERS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  ...BASE_WALL_LAYERS,
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const CAVITY_CHANGED_WALL_LAYERS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 95 },
  { materialId: "glasswool_board", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
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

const PAIRED_ADDED_BOARD_LAB_CONTEXT = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1DepthMm: 70,
    cavity1LayerIndices: [2, 3],
    sideALeafLayerIndices: [0, 1],
    sideBLeafLayerIndices: [4, 5],
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
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateWall(input: {
  readonly context?: AirborneContext;
  readonly frequencyAnchors?: readonly ProjectUserMeasuredWallAirborneFrequencyAnchor[] | null;
  readonly layers?: readonly LayerInput[];
  readonly rwAnchors?: readonly ProjectUserMeasuredWallRwAnchor[] | null;
  readonly targetOutputs?: readonly RequestedOutputId[];
} = {}) {
  return calculateAssembly(input.layers ?? ADDED_BOARD_WALL_LAYERS, {
    airborneContext: input.context ?? ADDED_BOARD_LAB_CONTEXT,
    airborneMeasuredFrequencySourceAnchors: input.frequencyAnchors ?? null,
    airborneMeasuredSourceAnchors: input.rwAnchors ?? null,
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
    createdAtIso: "2026-06-18T12:00:00.000Z",
    createdBy: "project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract",
    createdFromProjectId: "project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh",
    curveBasis: "measured_frequency_curve",
    fingerprint,
    frequencyBands: FREQUENCY_BANDS,
    id: input.id ?? "project-user-measured-wall-airborne-frequency-compatible-delta-coverage-base-stack",
    inputBasis: "airborne_transmission_loss_curve",
    measurementMethodStandard: "ISO 10140-2",
    metricBasis: "lab_airborne_transmission_loss_curve",
    metricFamily: "airborne",
    ratingStandards,
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceLabel: "Project measured wall airborne frequency compatible-delta coverage base stack",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T12:00:00.000Z"
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
    createdAtIso: "2026-06-18T12:00:00.000Z",
    createdBy: "project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract",
    createdFromProjectId: "project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh",
    fingerprint,
    id: "project-user-measured-wall-rw-compatible-delta-coverage-scalar-only",
    measurementMethodStandard: "ISO 10140-2",
    metric: "Rw",
    metricBasis: "lab_rw",
    ratingStandard: "ISO 717-1",
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceLabel: "Project measured wall scalar Rw compatible-delta coverage guard",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T12:00:00.000Z",
    valueDb: 64
  };
}

function summarizeCoverageRefreshCloseout() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    ownerAction: OWNER_ACTION,
    ownerFile: OWNER_FILE,
    ownerStatus: OWNER_STATUS,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 project/user measured wall airborne frequency compatible-delta coverage refresh", () => {
  it("lands the no-runtime refresh and selects the next runtime-first rerank", () => {
    expect(summarizeCoverageRefreshCloseout()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      ownerAction: OWNER_ACTION,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      OWNER_FILE,
      OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("freezes one-side exterior-board compatible delta value pins and resolver provenance", () => {
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
    const trace = buildLayerCombinationResolverTraceForAssembly(result);

    expect(baseExact.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(result.airborneBasis).toMatchObject({
      anchorSourceId: anchor.id,
      curveBasis: "calculated_frequency_curve",
      kind: "airborne_anchored_delta",
      method: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD,
      origin: "measured_exact_subassembly_plus_calculated_delta"
    });
    expect(result.metrics.estimatedRwDb).toBeGreaterThan(baseExact.metrics.estimatedRwDb ?? 0);
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
    expect(trace).toMatchObject({
      basis: "element_lab",
      runtimeBasisId: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_SELECTED_CANDIDATE_ID
    });
    expect(trace?.candidateKind).toBe("similarity_anchor");
    expect(trace?.surfaceDetail).toMatch(/measured subassembly anchor plus the owned calculated added-layer delta/i);
  });

  it("keeps single-output target independence and paired exterior-board delta coverage", () => {
    const anchor = buildActiveFrequencyAnchor();
    const paired = calculateWall({
      context: PAIRED_ADDED_BOARD_LAB_CONTEXT,
      frequencyAnchors: [anchor],
      layers: PAIRED_ADDED_BOARD_WALL_LAYERS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(paired.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
    );
    expect(paired.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(paired.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        expect.stringContaining("input_start:gypsum_board"),
        expect.stringContaining("input_end:gypsum_board")
      ])
    );

    for (const output of LAB_OUTPUTS) {
      const result = calculateWall({
        frequencyAnchors: [anchor],
        targetOutputs: [output]
      });

      expect(result.airborneBasis?.method).toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
      );
      expect(result.supportedTargetOutputs).toEqual([output]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.airborneBasis?.requiredInputs).toContain(`targetOutput:${output}`);
    }
  });

  it("protects exact precedence, scalar-anchor separation, and rating-standard boundaries", () => {
    const exactCurrentAnchor = buildActiveFrequencyAnchor({
      snapshot: buildRuntimeSnapshot({
        context: ADDED_BOARD_LAB_CONTEXT,
        layers: ADDED_BOARD_WALL_LAYERS
      })
    });
    const exact = calculateWall({
      frequencyAnchors: [exactCurrentAnchor],
      targetOutputs: LAB_OUTPUTS
    });
    const scalarOnly = calculateWall({
      frequencyAnchors: [],
      rwAnchors: [buildActiveRwAnchor()],
      targetOutputs: LAB_OUTPUTS
    });
    const astmOnly = calculateWall({
      frequencyAnchors: [
        buildActiveFrequencyAnchor({
          ratingStandards: ["ASTM E413"]
        })
      ],
      targetOutputs: RW_C_CTR_OUTPUTS
    });
    const isoOnly = calculateWall({
      frequencyAnchors: [
        buildActiveFrequencyAnchor({
          ratingStandards: ["ISO 717-1"]
        })
      ],
      targetOutputs: ["STC"]
    });

    expect(exact.airborneBasis?.method).toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD
    );
    expect(exact.airborneCandidateResolution?.selectedOrigin).toBe("measured_exact_full_stack");
    expect(scalarOnly.airborneBasis?.method).not.toBe(
      POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
    );

    for (const result of [astmOnly, isoOnly]) {
      expect(result.airborneBasis?.method).not.toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD
      );
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.warnings.some((warning: string) =>
        /does not declare the required rating standard basis/i.test(warning)
      )).toBe(true);
    }
    expect(astmOnly.unsupportedTargetOutputs).toEqual([...RW_C_CTR_OUTPUTS]);
    expect(isoOnly.unsupportedTargetOutputs).toEqual(["STC"]);
  });

  it("keeps ambiguous anchors, field/building, impact aliases, and cavity changes outside", () => {
    const firstAnchor = buildActiveFrequencyAnchor({
      id: "project-user-measured-wall-airborne-frequency-compatible-delta-coverage-a"
    });
    const secondAnchor = buildActiveFrequencyAnchor({
      id: "project-user-measured-wall-airborne-frequency-compatible-delta-coverage-b"
    });
    const ambiguous = calculateWall({
      frequencyAnchors: [firstAnchor, secondAnchor],
      targetOutputs: ["Rw"]
    });
    const field = calculateWall({
      context: FIELD_CONTEXT,
      frequencyAnchors: [firstAnchor],
      targetOutputs: ["R'w"]
    });
    const impact = calculateWall({
      frequencyAnchors: [firstAnchor],
      targetOutputs: ["IIC", "AIIC"]
    });
    const cavityChange = calculateWall({
      context: {
        ...ADDED_BOARD_LAB_CONTEXT,
        wallTopology: {
          ...ADDED_BOARD_LAB_CONTEXT.wallTopology,
          cavity1DepthMm: 95
        }
      },
      frequencyAnchors: [firstAnchor],
      layers: CAVITY_CHANGED_WALL_LAYERS,
      targetOutputs: ["Rw"]
    });

    expect(ambiguous.supportedTargetOutputs).toEqual([]);
    expect(ambiguous.unsupportedTargetOutputs).toEqual(["Rw"]);
    expect(ambiguous.warnings.some((warning: string) =>
      /multiple active reduced-stack anchors/i.test(warning)
    )).toBe(true);

    for (const result of [ambiguous, field, impact, cavityChange]) {
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

  it("keeps live docs and handoff files aligned with the no-runtime refresh", () => {
    for (const path of REQUIRED_DOCS) {
      const text = readRepoFile(path);

      expect(text, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(text, path).toContain(COVERAGE_REFRESH_FILE);
      expect(text, path).toContain(COVERAGE_REFRESH_PLAN_DOC);
      expect(text, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(text, path).toContain(SELECTED_NEXT_ACTION);
      expect(text, path).toContain(SELECTED_NEXT_FILE);
      expect(text, path).toContain(SELECTED_NEXT_PLAN_DOC);
    }
  });
});

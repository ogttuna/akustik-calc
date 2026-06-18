import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EstimateRequestSchema,
  PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION,
  buildProjectUserMeasuredWallRwAnchorFingerprint,
  type AirborneContext,
  type LayerInput,
  type MaterialDefinition,
  type ProjectUserMeasuredWallConstructionSnapshot,
  type ProjectUserMeasuredWallRwAnchor,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD,
  POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_SELECTED_CANDIDATE_ID,
  POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_WARNING_PREFIX,
  buildProjectUserMeasuredWallRwRequestSnapshot
} from "./project-user-measured-wall-rw-exact-bridge";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_project_user_measured_wall_rw_exact_bridge_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_OWNER_PLAN_2026-06-18.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_project_user_measured_wall_rw_exact_bridge_owner_landed_runtime_selected_coverage_refresh";
const PREVIOUS_SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_rw_exact_bridge_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after project/user measured wall Rw exact bridge coverage refresh";

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

const RW_ONLY = ["Rw"] as const satisfies readonly RequestedOutputId[];
const MIXED_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const PROJECT_BOARD = {
  acoustic: {
    behavior: "panel_leaf",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "finish",
  densityKgM3: 720,
  id: "project_exact_bridge_coverage_board_720",
  name: "Project exact bridge coverage board 720",
  tags: ["project-user-measured-anchor-coverage"]
} as const satisfies MaterialDefinition;

const PROJECT_AIR = {
  acoustic: {
    behavior: "air_cavity",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "gap",
  densityKgM3: 0,
  id: "project_exact_bridge_coverage_air_gap",
  name: "Project exact bridge coverage air gap",
  tags: ["project-user-measured-anchor-coverage"]
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
  id: "project_exact_bridge_coverage_absorber_48",
  name: "Project exact bridge coverage absorber 48",
  tags: ["project-user-measured-anchor-coverage"]
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
    readonly anchors?: readonly ProjectUserMeasuredWallRwAnchor[] | null;
    readonly context?: AirborneContext;
    readonly layers?: readonly LayerInput[];
    readonly targetOutputs?: readonly RequestedOutputId[];
  } = {}
) {
  return calculateAssembly(input.layers ?? PROJECT_WALL_LAYERS, {
    airborneContext: input.context ?? LAB_CONTEXT,
    airborneMeasuredSourceAnchors: input.anchors ?? null,
    calculator: "dynamic",
    catalog: PROJECT_MATERIALS,
    targetOutputs: input.targetOutputs ?? RW_ONLY
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

function buildActiveAnchor(
  input: {
    readonly snapshot?: ProjectUserMeasuredWallConstructionSnapshot;
    readonly valueDb?: number;
  } = {},
  overrides: Partial<ProjectUserMeasuredWallRwAnchor> = {}
): ProjectUserMeasuredWallRwAnchor {
  const snapshot = input.snapshot ?? buildRuntimeSnapshot();
  const fingerprint = buildProjectUserMeasuredWallRwAnchorFingerprint({
    measurementMethodStandard: "ISO 10140-2",
    ratingStandard: "ISO 717-1",
    snapshot
  });

  return {
    canonicalizationVersion: PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-18T09:00:00.000Z",
    createdBy: "exact-bridge-coverage-refresh-contract",
    createdFromProjectId: "project-exact-bridge-coverage-refresh",
    fingerprint,
    id: "project-user-measured-wall-rw-exact-bridge-coverage",
    measurementMethodStandard: "ISO 10140-2",
    metric: "Rw",
    metricBasis: "lab_rw",
    ratingStandard: "ISO 717-1",
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceLabel: "Project measured wall Rw exact bridge coverage",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T09:00:00.000Z",
    valueDb: input.valueDb ?? 56,
    ...overrides
  };
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
    runtimeMethod: POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD,
    selectedCandidateId: PREVIOUS_SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function hasExactBridgeWarning(result: ReturnType<typeof calculateProjectWall>): boolean {
  return result.warnings.some((warning: string) =>
    warning.startsWith(POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_WARNING_PREFIX)
  );
}

describe("post-V1 project/user measured wall Rw exact bridge coverage refresh", () => {
  it("lands after the exact bridge owner and selects a runtime-first rerank next", () => {
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
      runtimeMethod: POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD,
      selectedCandidateId: PREVIOUS_SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });
    expect(existsSync(join(REPO_ROOT, PREVIOUS_OWNER_FILE))).toBe(true);
  });

  it("freezes the exact active anchor path through request intake, runtime basis, candidate resolution, and resolver trace", () => {
    const anchor = buildActiveAnchor({ valueDb: 56 });
    const parsed = EstimateRequestSchema.safeParse({
      airborneContext: LAB_CONTEXT,
      airborneMeasuredSourceAnchors: [anchor],
      calculator: "dynamic",
      layers: PROJECT_WALL_LAYERS,
      materialCatalog: PROJECT_MATERIALS,
      targetOutputs: RW_ONLY
    });
    const result = calculateProjectWall({
      anchors: [anchor],
      targetOutputs: RW_ONLY
    });
    const selectedCandidate = result.airborneCandidateResolution?.candidates.find(
      (candidate: { readonly id: string }) =>
        candidate.id === POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_SELECTED_CANDIDATE_ID
    );

    expect(parsed.success).toBe(true);
    expect(result.metrics.estimatedRwDb).toBe(56);
    expect(result.supportedTargetOutputs).toEqual([...RW_ONLY]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneBasis).toMatchObject({
      exactSourceId: anchor.id,
      kind: "airborne_measured_exact",
      method: POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD,
      origin: "measured_exact_full_stack",
      toleranceClass: "exact_source"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_SELECTED_CANDIDATE_ID,
      selectedOrigin: "measured_exact_full_stack",
      selectedBasis: {
        method: POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD
      }
    });
    expect(selectedCandidate).toMatchObject({
      metricIds: [...RW_ONLY],
      origin: "measured_exact_full_stack",
      outputIds: [...RW_ONLY],
      rejectionReasons: [],
      selected: true
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "exact_measured_override",
      requestedBasis: "element_lab",
      route: "wall",
      runtimeBasisId: "verified_airborne_exact_source",
      supportBucket: "exact",
      supportedMetrics: [...RW_ONLY],
      valuePins: [{ metric: "Rw", value: 56 }]
    });
    expect(hasExactBridgeWarning(result)).toBe(true);
  });

  it("keeps schema guards active for inactive, stale, duplicate-id, and duplicate-fingerprint measured anchors", () => {
    const anchor = buildActiveAnchor();
    const inactive = EstimateRequestSchema.safeParse({
      airborneMeasuredSourceAnchors: [
        buildActiveAnchor({}, {
          sourceStatus: "draft"
        })
      ],
      calculator: "dynamic",
      layers: PROJECT_WALL_LAYERS,
      materialCatalog: PROJECT_MATERIALS,
      targetOutputs: RW_ONLY
    });
    const stale = EstimateRequestSchema.safeParse({
      airborneMeasuredSourceAnchors: [
        buildActiveAnchor({}, {
          fingerprint: "dynecho:wall-rw-anchor:v1:0000000000000000"
        })
      ],
      calculator: "dynamic",
      layers: PROJECT_WALL_LAYERS,
      materialCatalog: PROJECT_MATERIALS,
      targetOutputs: RW_ONLY
    });
    const duplicate = EstimateRequestSchema.safeParse({
      airborneMeasuredSourceAnchors: [
        anchor,
        {
          ...anchor,
          sourceLabel: "Duplicate exact bridge coverage anchor",
          valueDb: 57
        }
      ],
      calculator: "dynamic",
      layers: PROJECT_WALL_LAYERS,
      materialCatalog: PROJECT_MATERIALS,
      targetOutputs: RW_ONLY
    });

    expect(inactive.success).toBe(false);
    if (!inactive.success) {
      expect(inactive.error.issues[0]?.path).toEqual(["airborneMeasuredSourceAnchors", 0, "sourceStatus"]);
    }
    expect(stale.success).toBe(false);
    if (!stale.success) {
      expect(stale.error.issues[0]?.path).toEqual(["airborneMeasuredSourceAnchors", 0, "fingerprint"]);
    }
    expect(duplicate.success).toBe(false);
    if (!duplicate.success) {
      expect(duplicate.error.issues.map((issue) => issue.path.join("."))).toEqual(
        expect.arrayContaining([
          "airborneMeasuredSourceAnchors.1.id",
          "airborneMeasuredSourceAnchors.1.fingerprint"
        ])
      );
    }
  });

  it("keeps mismatched and ambiguous direct-runtime anchors out of the published exact answer", () => {
    const runtimeSnapshot = buildRuntimeSnapshot();
    const mismatchedSnapshot = {
      ...runtimeSnapshot,
      layers: runtimeSnapshot.layers.map((layer, index) =>
        index === 0 ? { ...layer, thicknessMm: 15 } : layer
      )
    } satisfies ProjectUserMeasuredWallConstructionSnapshot;
    const mismatchedAnchor = buildActiveAnchor({
      snapshot: mismatchedSnapshot,
      valueDb: 56
    });
    const firstAnchor = buildActiveAnchor({ valueDb: 56 });
    const secondAnchor = buildActiveAnchor({ valueDb: 57 }, {
      id: "project-user-measured-wall-rw-exact-bridge-coverage-conflict"
    });
    const baseline = calculateProjectWall();
    const mismatched = calculateProjectWall({
      anchors: [mismatchedAnchor],
      targetOutputs: RW_ONLY
    });
    const ambiguous = calculateProjectWall({
      anchors: [firstAnchor, secondAnchor],
      targetOutputs: RW_ONLY
    });

    for (const result of [mismatched, ambiguous]) {
      expect(result.metrics.estimatedRwDb).toBe(baseline.metrics.estimatedRwDb);
      expect(result.metrics.estimatedRwDb).not.toBe(56);
      expect(result.airborneBasis?.method).not.toBe(POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD);
      expect(result.airborneCandidateResolution?.selectedBasis?.method).not.toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD
      );
    }
    expect(hasExactBridgeWarning(mismatched)).toBe(false);
    expect(ambiguous.warnings).toContain(
      "Project/user measured wall Rw exact bridge found multiple active anchors with the same request fingerprint; DynEcho ignored them until the conflict is resolved."
    );
  });

  it("keeps companion aliases, field/building outputs, impact outputs, and compatible deltas outside the exact Rw bridge", () => {
    const anchor = buildActiveAnchor({ valueDb: 56 });
    const thickerBoardLayers = PROJECT_WALL_LAYERS.map((layer, index) =>
      index === 0 ? { ...layer, thicknessMm: 15 } : layer
    ) satisfies readonly LayerInput[];
    const probes = [
      calculateProjectWall({
        anchors: [anchor],
        targetOutputs: ["STC"]
      }),
      calculateProjectWall({
        anchors: [anchor],
        targetOutputs: MIXED_LAB_OUTPUTS
      }),
      calculateProjectWall({
        anchors: [anchor],
        context: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      }),
      calculateProjectWall({
        anchors: [anchor],
        targetOutputs: IMPACT_OUTPUTS
      }),
      calculateProjectWall({
        anchors: [anchor],
        layers: thickerBoardLayers,
        targetOutputs: RW_ONLY
      })
    ];

    for (const result of probes) {
      expect(result.metrics.estimatedRwDb).not.toBe(56);
      expect(result.airborneBasis?.method).not.toBe(POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD);
      expect(result.airborneCandidateResolution?.selectedBasis?.method).not.toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD
      );
      expect(result.layerCombinationResolverTrace?.runtimeBasisId).not.toBe("verified_airborne_exact_source");
      expect(hasExactBridgeWarning(result)).toBe(false);
    }
  });

  it("keeps active docs and current-gate runner aligned with the landed no-runtime coverage refresh", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(contents, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(contents, path).toContain(PREVIOUS_OWNER_FILE);
      expect(contents, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(contents, path).toContain(COVERAGE_REFRESH_FILE);
      expect(contents, path).toContain(COVERAGE_REFRESH_PLAN_DOC);
      expect(contents, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(contents, path).toContain(POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(contents, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts"
    );
    expect(runner).toContain(
      "src/post-v1-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts"
    );
    expect(runner).toContain(
      "src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts"
    );
  });
});

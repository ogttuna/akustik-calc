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

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_landed_no_runtime_selected_project_user_measured_wall_rw_exact_bridge_owner";

const OWNER_ACTION =
  "post_v1_project_user_measured_wall_rw_exact_bridge_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_OWNER_PLAN_2026-06-18.md";
const OWNER_STATUS =
  "post_v1_project_user_measured_wall_rw_exact_bridge_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_rw_exact_bridge_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 project/user measured wall Rw exact bridge coverage refresh";

const OWNER_COUNTERS = {
  apiRouteBridgeFilesTouched: 1,
  engineRuntimeFilesTouched: 3,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 1,
  newCalculableTargetOutputs: 1,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 1,
  sharedApiFilesTouched: 1,
  sourceRowsImported: 0
} as const;

const RW_ONLY = ["Rw"] as const satisfies readonly RequestedOutputId[];
const MIXED_LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w"] as const satisfies readonly RequestedOutputId[];

const PROJECT_BOARD = {
  acoustic: {
    behavior: "panel_leaf",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "finish",
  densityKgM3: 720,
  id: "project_exact_bridge_board_720",
  name: "Project exact bridge board 720",
  tags: ["project-user-measured-anchor-test"]
} as const satisfies MaterialDefinition;

const PROJECT_AIR = {
  acoustic: {
    behavior: "air_cavity",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "gap",
  densityKgM3: 0,
  id: "project_exact_bridge_air_gap",
  name: "Project exact bridge air gap",
  tags: ["project-user-measured-anchor-test"]
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
  id: "project_exact_bridge_absorber_48",
  name: "Project exact bridge absorber 48",
  tags: ["project-user-measured-anchor-test"]
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
  OWNER_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildRuntimeSnapshot(): ProjectUserMeasuredWallConstructionSnapshot {
  const baseline = calculateAssembly(PROJECT_WALL_LAYERS, {
    airborneContext: LAB_CONTEXT,
    calculator: "dynamic",
    catalog: PROJECT_MATERIALS,
    targetOutputs: RW_ONLY
  });

  return buildProjectUserMeasuredWallRwRequestSnapshot({
    airborneContext: LAB_CONTEXT,
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
    createdAtIso: "2026-06-18T08:00:00.000Z",
    createdBy: "exact-bridge-owner-contract",
    createdFromProjectId: "project-exact-bridge-owner",
    fingerprint,
    id: "project-user-measured-wall-rw-exact-bridge",
    measurementMethodStandard: "ISO 10140-2",
    metric: "Rw",
    metricBasis: "lab_rw",
    ratingStandard: "ISO 717-1",
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceLabel: "Project measured wall Rw exact bridge",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T08:00:00.000Z",
    valueDb: input.valueDb ?? 55,
    ...overrides
  };
}

function buildOwnerSummary() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    ownerFile: OWNER_FILE,
    ownerPlanDoc: OWNER_PLAN_DOC,
    previousRerank: {
      selectedNextAction: OWNER_ACTION,
      selectedNextFile: OWNER_FILE,
      selectionStatus: PREVIOUS_RERANK_STATUS
    },
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

describe("post-V1 project/user measured wall Rw exact bridge owner", () => {
  it("lands after the schema/fingerprint rerank and selects coverage refresh next", () => {
    expect(buildOwnerSummary()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      previousRerank: {
        selectedNextAction: OWNER_ACTION,
        selectedNextFile: OWNER_FILE,
        selectionStatus: PREVIOUS_RERANK_STATUS
      },
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });
    expect(existsSync(join(REPO_ROOT, PREVIOUS_RERANK_FILE))).toBe(true);
  });

  it("accepts active measured anchors at request intake and promotes exact lab Rw on matching fingerprints", () => {
    const anchor = buildActiveAnchor({ valueDb: 55 });
    const parsedRequest = EstimateRequestSchema.safeParse({
      airborneContext: LAB_CONTEXT,
      airborneMeasuredSourceAnchors: [anchor],
      calculator: "dynamic",
      layers: PROJECT_WALL_LAYERS,
      materialCatalog: PROJECT_MATERIALS,
      targetOutputs: RW_ONLY
    });
    const baseline = calculateAssembly(PROJECT_WALL_LAYERS, {
      airborneContext: LAB_CONTEXT,
      calculator: "dynamic",
      catalog: PROJECT_MATERIALS,
      targetOutputs: RW_ONLY
    });
    const result = calculateAssembly(PROJECT_WALL_LAYERS, {
      airborneContext: LAB_CONTEXT,
      airborneMeasuredSourceAnchors: [anchor],
      calculator: "dynamic",
      catalog: PROJECT_MATERIALS,
      targetOutputs: RW_ONLY
    });
    const selectedCandidate = result.airborneCandidateResolution?.candidates.find(
      (candidate: { readonly id: string }) =>
        candidate.id === POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_SELECTED_CANDIDATE_ID
    );

    expect(parsedRequest.success).toBe(true);
    expect(baseline.metrics.estimatedRwDb).not.toBe(anchor.valueDb);
    expect(result.metrics.estimatedRwDb).toBe(anchor.valueDb);
    expect(result.supportedTargetOutputs).toEqual(RW_ONLY);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneBasis).toMatchObject({
      curveBasis: "source_single_number_rating",
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
    expect(result.warnings.some((warning: string) =>
      warning.startsWith(POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_WARNING_PREFIX)
    )).toBe(true);
  });

  it("falls back to the existing formula route when the active anchor fingerprint does not match the request", () => {
    const runtimeSnapshot = buildRuntimeSnapshot();
    const staleButValidDifferentStackSnapshot = {
      ...runtimeSnapshot,
      layers: runtimeSnapshot.layers.map((layer, index) =>
        index === 0 ? { ...layer, thicknessMm: 15 } : layer
      )
    } satisfies ProjectUserMeasuredWallConstructionSnapshot;
    const mismatchedAnchor = buildActiveAnchor({
      snapshot: staleButValidDifferentStackSnapshot,
      valueDb: 55
    });
    const baseline = calculateAssembly(PROJECT_WALL_LAYERS, {
      airborneContext: LAB_CONTEXT,
      calculator: "dynamic",
      catalog: PROJECT_MATERIALS,
      targetOutputs: RW_ONLY
    });
    const result = calculateAssembly(PROJECT_WALL_LAYERS, {
      airborneContext: LAB_CONTEXT,
      airborneMeasuredSourceAnchors: [mismatchedAnchor],
      calculator: "dynamic",
      catalog: PROJECT_MATERIALS,
      targetOutputs: RW_ONLY
    });

    expect(result.metrics.estimatedRwDb).toBe(baseline.metrics.estimatedRwDb);
    expect(result.airborneBasis?.method).not.toBe(POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD);
    expect(result.airborneCandidateResolution?.selectedOrigin).not.toBe("measured_exact_full_stack");
    expect(result.warnings.some((warning: string) =>
      warning.startsWith(POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_WARNING_PREFIX)
    )).toBe(false);
  });

  it("rejects inactive and stale measured anchors before they reach runtime", () => {
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

    expect(inactive.success).toBe(false);
    if (!inactive.success) {
      expect(inactive.error.issues[0]?.path).toEqual(["airborneMeasuredSourceAnchors", 0, "sourceStatus"]);
    }
    expect(stale.success).toBe(false);
    if (!stale.success) {
      expect(stale.error.issues[0]?.path).toEqual(["airborneMeasuredSourceAnchors", 0, "fingerprint"]);
    }
  });

  it("keeps STC, mixed lab, and field/building requests outside the exact Rw bridge", () => {
    const anchor = buildActiveAnchor({ valueDb: 55 });
    const stcOnly = calculateAssembly(PROJECT_WALL_LAYERS, {
      airborneContext: LAB_CONTEXT,
      airborneMeasuredSourceAnchors: [anchor],
      calculator: "dynamic",
      catalog: PROJECT_MATERIALS,
      targetOutputs: ["STC"]
    });
    const mixedLab = calculateAssembly(PROJECT_WALL_LAYERS, {
      airborneContext: LAB_CONTEXT,
      airborneMeasuredSourceAnchors: [anchor],
      calculator: "dynamic",
      catalog: PROJECT_MATERIALS,
      targetOutputs: MIXED_LAB_OUTPUTS
    });
    const field = calculateAssembly(PROJECT_WALL_LAYERS, {
      airborneContext: FIELD_CONTEXT,
      airborneMeasuredSourceAnchors: [anchor],
      calculator: "dynamic",
      catalog: PROJECT_MATERIALS,
      targetOutputs: FIELD_OUTPUTS
    });

    for (const result of [stcOnly, mixedLab, field]) {
      expect(result.metrics.estimatedRwDb).not.toBe(anchor.valueDb);
      expect(result.airborneBasis?.method).not.toBe(POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD);
      expect(result.airborneCandidateResolution?.selectedBasis?.method).not.toBe(
        POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD
      );
      expect(result.warnings.some((warning: string) =>
        warning.startsWith(POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_WARNING_PREFIX)
      )).toBe(false);
    }
  });

  it("keeps active docs and current-gate runner aligned with the coverage refresh next step", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(contents, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(contents, path).toContain(PREVIOUS_RERANK_FILE);
      expect(contents, path).toContain(OWNER_ACTION);
      expect(contents, path).toContain(OWNER_STATUS);
      expect(contents, path).toContain(OWNER_FILE);
      expect(contents, path).toContain(POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(contents, path).toContain("runtimeValuesMoved 1");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts"
    );
    expect(runner).toContain(
      "src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts"
    );
  });
});

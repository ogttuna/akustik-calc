import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ActiveProjectUserMeasuredWallRwAnchorSchema,
  EstimateRequestSchema,
  buildProjectUserMeasuredWallRwAnchorFingerprint,
  type ProjectUserMeasuredWallConstructionSnapshot,
  type ProjectUserMeasuredWallRwAnchor
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_SCHEMA_ACTION =
  "post_v1_project_user_measured_wall_rw_anchor_schema_fingerprint_plan";
const PREVIOUS_SCHEMA_FILE =
  "packages/shared/src/domain/project-user-measured-source-anchor.test.ts";
const PREVIOUS_SCHEMA_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md";
const PREVIOUS_SCHEMA_STATUS =
  "post_v1_project_user_measured_wall_rw_anchor_schema_fingerprint_landed_no_runtime_selected_runtime_first_route_family_rerank";
const PREVIOUS_SCHEMA_SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_rw_anchor_schema_fingerprint";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_RW_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_landed_no_runtime_selected_project_user_measured_wall_rw_exact_bridge_owner";
const SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_rw_exact_bridge_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_rw_exact_bridge_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_OWNER_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 project/user measured wall Rw exact bridge owner";

const ESTIMATE_REQUEST_SCHEMA_FILE = "packages/shared/src/api/estimate.ts";
const SHARED_ANCHOR_SCHEMA_FILE = "packages/shared/src/domain/project-user-measured-source-anchor.ts";

const RERANK_COUNTERS = {
  activeMeasuredAnchorCandidateSchemas: 1,
  candidateCount: 6,
  estimatedNextCalculableRequestShapes: 1,
  estimatedNextExactMeasuredAnchorRuntimeFamilies: 1,
  estimatedNextRuntimeBasisPromotions: 1,
  estimatedNextRuntimeValuesMoved: 1,
  estimatedNextTargetOutputsMoved: 1,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_evidence_missing"
  | "rejected_frontend_first"
  | "rejected_prerequisite_missing"
  | "rejected_too_broad"
  | "selected_runtime_owner_ready";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly id: string;
  readonly reason: string;
  readonly runtimeOwnerAuthorizedNext: boolean;
};

const CANDIDATES = [
  {
    decision: "selected_runtime_owner_ready",
    id: SELECTED_CANDIDATE_ID,
    reason:
      "The shared active wall lab Rw anchor schema and canonical fingerprint now exist; the next owner can expose a bounded request/resolver bridge for exact fingerprint matches without UI, source crawling, compatible deltas, or metric aliasing.",
    runtimeOwnerAuthorizedNext: true
  },
  {
    decision: "rejected_prerequisite_missing",
    id: "project_user_measured_wall_rw_compatible_exterior_board_delta_owner",
    reason:
      "Compatible deltas need an exact measured anchor bridge first, plus reduced-stack and exterior-board-only boundaries.",
    runtimeOwnerAuthorizedNext: false
  },
  {
    decision: "rejected_frontend_first",
    id: "project_user_measured_anchor_ui_storage_owner",
    reason:
      "UI/storage should wait until the request field and runtime resolver semantics are owned.",
    runtimeOwnerAuthorizedNext: false
  },
  {
    decision: "rejected_evidence_missing",
    id: "wall_opening_leak_common_wall_runtime_retune_reopen",
    reason:
      "The previous opening/leak common-wall packet still has acceptedSameBasisHoldoutRows: 0.",
    runtimeOwnerAuthorizedNext: false
  },
  {
    decision: "rejected_too_broad",
    id: "frequency_band_backbone_rearchitecture",
    reason:
      "Frequency backbone is strategic, but broader than this exact-measured-row bridge and not the highest-ready next slice.",
    runtimeOwnerAuthorizedNext: false
  },
  {
    decision: "rejected_too_broad",
    id: "broad_source_crawl_or_confidence_labeling",
    reason:
      "A broad crawl or confidence-copy change does not create a bounded exact measured source route.",
    runtimeOwnerAuthorizedNext: false
  }
] as const satisfies readonly Candidate[];

const SAMPLE_SNAPSHOT = {
  layers: [
    { materialId: "acoustic_gypsum_board", role: "board", side: "side_a", thicknessMm: 12.5 },
    { materialId: "steel_stud_70", role: "support", side: "cavity", thicknessMm: 70 },
    { materialId: "custom_glasswool_48", role: "absorber", side: "cavity", thicknessMm: 50 },
    { materialId: "acoustic_gypsum_board", role: "board", side: "side_b", thicknessMm: 12.5 }
  ],
  materialCatalog: [
    {
      acoustic: {
        behavior: "panel_leaf",
        notes: [],
        propertySourceStatus: "catalog_nominal"
      },
      category: "finish",
      densityKgM3: 800,
      id: "acoustic_gypsum_board",
      name: "Acoustic gypsum board",
      tags: ["board"]
    },
    {
      acoustic: {
        absorberClass: "porous_absorptive",
        behavior: "porous_absorber",
        flowResistivityPaSM2: 12000,
        notes: [],
        propertySourceStatus: "user_supplied"
      },
      category: "insulation",
      densityKgM3: 48,
      id: "custom_glasswool_48",
      name: "Project glass wool 48 kg/m3",
      tags: ["project"]
    },
    {
      acoustic: {
        behavior: "structural_bridge",
        notes: [],
        propertySourceStatus: "catalog_nominal"
      },
      category: "support",
      densityKgM3: 7850,
      id: "steel_stud_70",
      name: "Steel stud 70",
      tags: ["stud"]
    }
  ],
  materialVisualOverrides: [],
  wallContext: {
    cavityDepthMm: 70,
    cavityFillMaterialId: "custom_glasswool_48",
    supportSpacingMm: 600,
    supportTopology: "steel_stud",
    wallTopology: "framed_double_leaf"
  }
} as const satisfies ProjectUserMeasuredWallConstructionSnapshot;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildSampleActiveAnchor(): ProjectUserMeasuredWallRwAnchor {
  const fingerprint = buildProjectUserMeasuredWallRwAnchorFingerprint({
    measurementMethodStandard: "ISO 10140-2",
    ratingStandard: "ISO 717-1",
    snapshot: SAMPLE_SNAPSHOT
  });

  return {
    canonicalizationVersion: 1,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-18T06:30:00.000Z",
    createdBy: "rerank-contract",
    createdFromProjectId: "project-rerank",
    fingerprint,
    id: "project-rerank-measured-wall-rw",
    measurementMethodStandard: "ISO 10140-2",
    metric: "Rw",
    metricBasis: "lab_rw",
    ratingStandard: "ISO 717-1",
    revision: 1,
    scope: "project_measured",
    snapshot: SAMPLE_SNAPSHOT,
    sourceLabel: "Project measured wall Rw",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T06:30:00.000Z",
    valueDb: 50
  };
}

function buildRerankSummary() {
  const selected = CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID);
  if (!selected) {
    throw new Error("Rerank must select one candidate.");
  }

  return {
    candidates: CANDIDATES,
    counters: RERANK_COUNTERS,
    landedGate: RERANK_ACTION,
    noRuntimeValueMovement: true,
    previousSchema: {
      implementationFile: PREVIOUS_SCHEMA_FILE,
      planDoc: PREVIOUS_SCHEMA_PLAN_DOC,
      selectedCandidateId: PREVIOUS_SCHEMA_SELECTED_CANDIDATE_ID,
      selectedGate: PREVIOUS_SCHEMA_ACTION,
      status: PREVIOUS_SCHEMA_STATUS
    },
    selectedCandidate: selected,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first rerank after project/user measured wall Rw anchor schema fingerprint", () => {
  it("lands the no-runtime rerank and selects the exact bridge runtime owner", () => {
    const summary = buildRerankSummary();

    expect(summary).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      noRuntimeValueMovement: true,
      previousSchema: {
        implementationFile: PREVIOUS_SCHEMA_FILE,
        planDoc: PREVIOUS_SCHEMA_PLAN_DOC,
        selectedCandidateId: PREVIOUS_SCHEMA_SELECTED_CANDIDATE_ID,
        selectedGate: PREVIOUS_SCHEMA_ACTION,
        status: PREVIOUS_SCHEMA_STATUS
      },
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RERANK_STATUS
    });

    for (const path of [
      PREVIOUS_SCHEMA_FILE,
      PREVIOUS_SCHEMA_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC,
      ESTIMATE_REQUEST_SCHEMA_FILE,
      SHARED_ANCHOR_SCHEMA_FILE
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("proves the exact bridge prerequisite is present and request intake now preserves active anchors", () => {
    const activeAnchor = buildSampleActiveAnchor();
    const parsedAnchor = ActiveProjectUserMeasuredWallRwAnchorSchema.safeParse(activeAnchor);

    expect(parsedAnchor.success).toBe(true);
    if (parsedAnchor.success) {
      expect(parsedAnchor.data.fingerprint).toMatch(/^dynecho:wall-rw-anchor:v1:[a-f0-9]{16}$/u);
      expect(parsedAnchor.data.metric).toBe("Rw");
      expect(parsedAnchor.data.metricBasis).toBe("lab_rw");
      expect(parsedAnchor.data.sourceMode).toBe("lab");
    }

    const estimateRequestSchema = readRepoFile(ESTIMATE_REQUEST_SCHEMA_FILE);
    expect(estimateRequestSchema).toContain("airborneMeasuredSourceAnchors");

    const parsedRequest = EstimateRequestSchema.safeParse({
      airborneMeasuredSourceAnchors: [activeAnchor],
      calculator: "dynamic",
      layers: activeAnchor.snapshot.layers.map((layer) => ({
        materialId: layer.materialId,
        thicknessMm: layer.thicknessMm
      })),
      materialCatalog: activeAnchor.snapshot.materialCatalog,
      targetOutputs: ["Rw"]
    });

    expect(parsedRequest.success).toBe(true);
    if (parsedRequest.success) {
      expect(parsedRequest.data.airborneMeasuredSourceAnchors?.[0]?.id).toBe(activeAnchor.id);
      expect(parsedRequest.data.airborneMeasuredSourceAnchors?.[0]?.metricBasis).toBe("lab_rw");
    }
  });

  it("rejects adjacent candidates that would skip the exact bridge boundary", () => {
    const summary = buildRerankSummary();
    const byId = new Map(summary.candidates.map((candidate) => [candidate.id, candidate]));

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(summary.selectedCandidate).toMatchObject({
      decision: "selected_runtime_owner_ready",
      runtimeOwnerAuthorizedNext: true
    });
    expect(byId.get("project_user_measured_wall_rw_compatible_exterior_board_delta_owner")).toMatchObject({
      decision: "rejected_prerequisite_missing",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("project_user_measured_anchor_ui_storage_owner")).toMatchObject({
      decision: "rejected_frontend_first",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("wall_opening_leak_common_wall_runtime_retune_reopen")).toMatchObject({
      decision: "rejected_evidence_missing",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("frequency_band_backbone_rearchitecture")).toMatchObject({
      decision: "rejected_too_broad",
      runtimeOwnerAuthorizedNext: false
    });
  });

  it("keeps this rerank no-runtime while estimating the next exact Rw movement", () => {
    const summary = buildRerankSummary();

    expect(summary.counters).toMatchObject({
      activeMeasuredAnchorCandidateSchemas: 1,
      estimatedNextCalculableRequestShapes: 1,
      estimatedNextExactMeasuredAnchorRuntimeFamilies: 1,
      estimatedNextRuntimeBasisPromotions: 1,
      estimatedNextRuntimeValuesMoved: 1,
      estimatedNextTargetOutputsMoved: 1,
      frontendImplementationFilesTouched: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("keeps active docs and current-gate runner aligned with the selected owner", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_SCHEMA_ACTION);
      expect(contents, path).toContain(PREVIOUS_SCHEMA_STATUS);
      expect(contents, path).toContain(PREVIOUS_SCHEMA_FILE);
      expect(contents, path).toContain(PREVIOUS_SCHEMA_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(RERANK_ACTION);
      expect(contents, path).toContain(RERANK_STATUS);
      expect(contents, path).toContain(RERANK_FILE);
      expect(contents, path).toContain(SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts"
    );
    expect(runner).toContain("src/domain/project-user-measured-source-anchor.test.ts");
  });
});

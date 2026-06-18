import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EstimateRequestSchema } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_PACKET_ACTION =
  "post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_plan";
const PREVIOUS_PACKET_FILE =
  "packages/engine/src/post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts";
const PREVIOUS_PACKET_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_OPENING_LEAK_COMMON_WALL_SAME_BASIS_HOLDOUT_PACKET_PLAN_2026-06-18.md";
const PREVIOUS_PACKET_STATUS =
  "post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_landed_no_runtime_selected_runtime_first_route_family_rerank";
const PREVIOUS_PACKET_SELECTED_CANDIDATE_ID =
  "wall.opening_leak_common_wall_same_basis_holdout_packet";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_common_wall_same_basis_holdout_packet_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_OPENING_LEAK_COMMON_WALL_SAME_BASIS_HOLDOUT_PACKET_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_common_wall_same_basis_holdout_packet_landed_no_runtime_selected_project_user_measured_wall_rw_anchor_schema_fingerprint";
const SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_rw_anchor_schema_fingerprint";

const SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_rw_anchor_schema_fingerprint_plan";
const SELECTED_NEXT_FILE =
  "packages/shared/src/domain/project-user-measured-source-anchor.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 project/user measured wall Rw anchor schema + fingerprint";

const PROJECT_USER_MEASURED_SOURCE_ANCHOR_PLAN =
  "docs/calculator/PROJECT_USER_MEASURED_SOURCE_ANCHOR_PLAN_2026-06-15.md";
const ESTIMATE_REQUEST_SCHEMA_FILE = "packages/shared/src/api/estimate.ts";

const RERANK_COUNTERS = {
  acceptedSameBasisHoldoutRowsFromPreviousPacket: 0,
  candidateCount: 9,
  estimatedNextExactMeasuredAnchorInputFamilies: 1,
  estimatedNextRuntimeValuesMovedAfterBridge: 1,
  estimatedNextSharedDomainFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "closed_historical_chain"
  | "rejected_already_supported_or_lower_roi"
  | "rejected_evidence_missing"
  | "rejected_frontend_first"
  | "rejected_runtime_prerequisite_missing"
  | "selected_no_runtime_prerequisite";

type RerankCandidate = {
  readonly decision: CandidateDecision;
  readonly id: string;
  readonly improvesAnswerOrderStep: 1 | 2 | 3 | 4;
  readonly reason: string;
  readonly runtimeOwnerAuthorizedNow: boolean;
  readonly selectedNextAction?: string;
};

const RERANK_CANDIDATES = [
  {
    decision: "selected_no_runtime_prerequisite",
    id: SELECTED_CANDIDATE_ID,
    improvesAnswerOrderStep: 1,
    reason:
      "The estimate request accepts custom materials and exact impact sources, but no project/user airborne measured source anchor list; schema and stable fingerprints are the required first slice before exact wall Rw anchors can become runtime truth.",
    runtimeOwnerAuthorizedNow: false,
    selectedNextAction: SELECTED_NEXT_ACTION
  },
  {
    decision: "rejected_runtime_prerequisite_missing",
    id: "project_user_measured_wall_rw_exact_bridge_now",
    improvesAnswerOrderStep: 1,
    reason:
      "Exact bridge is high ROI, but it must wait until active measured anchor schema, metric basis, scope, and fingerprint conflict policy exist.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_evidence_missing",
    id: "wall.opening_leak_common_wall_runtime_retune_owner",
    improvesAnswerOrderStep: 3,
    reason:
      "The previous packet found acceptedSameBasisHoldoutRows: 0, so opening/leak and common-wall residuals remain benchmark-only.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "closed_historical_chain",
    id: "wall.framed_lab_spectrum_or_building_adapter_reopen",
    improvesAnswerOrderStep: 3,
    reason:
      "Framed LSF/timber lab spectrum companions and the framed building adapter chain already landed and have current coverage.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "closed_historical_chain",
    id: "floor.steel_open_web_visible_formula_input_bridge_reopen",
    improvesAnswerOrderStep: 3,
    reason:
      "The Gate DH/DI/DK steel and open-web visible formula input bridge chain is already closed.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "closed_historical_chain",
    id: "wall.double_leaf_post_runtime_revalidation_reopen",
    improvesAnswerOrderStep: 3,
    reason:
      "The post double-leaf/framed wall banded revalidation contract exists and is already part of the current gate lineage.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_already_supported_or_lower_roi",
    id: "inline_layer_material_physical_properties",
    improvesAnswerOrderStep: 3,
    reason:
      "Custom material physical inputs are already accepted through materialCatalog; unknown ids without catalog should still fail precisely.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_frontend_first",
    id: "workbench_anchor_manager_ui_first",
    improvesAnswerOrderStep: 1,
    reason:
      "UI/storage is useful only after shared schema and canonical fingerprint contracts exist.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_evidence_missing",
    id: "broad_source_crawl_or_confidence_labeling",
    improvesAnswerOrderStep: 1,
    reason:
      "Broad crawl and confidence copy do not create a rights-safe exact measured source route or owned formula route in this slice.",
    runtimeOwnerAuthorizedNow: false
  }
] as const satisfies readonly RerankCandidate[];

const CLOSED_CHAIN_FILES = [
  "packages/engine/src/post-v1-wall-framed-building-adapter-gate-ax.ts",
  "packages/engine/src/post-v1-floor-steel-visible-formula-input-bridge-gate-di-contract.test.ts",
  "packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts"
] as const;

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

function buildRerankSummary() {
  const selected = RERANK_CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID);
  const rejectedOrClosed = RERANK_CANDIDATES.filter((candidate) => candidate.id !== SELECTED_CANDIDATE_ID);

  if (!selected) {
    throw new Error("Rerank must select a calculator-first next candidate.");
  }

  if (selected.runtimeOwnerAuthorizedNow) {
    throw new Error("Schema/fingerprint prerequisite must not move runtime values in this rerank.");
  }

  return {
    candidates: RERANK_CANDIDATES,
    counters: RERANK_COUNTERS,
    landedGate: RERANK_ACTION,
    noRuntimeValueMovement: true,
    previousPacket: {
      acceptedSameBasisHoldoutRows: 0,
      landedGate: PREVIOUS_PACKET_ACTION,
      packetFile: PREVIOUS_PACKET_FILE,
      packetPlanDoc: PREVIOUS_PACKET_PLAN_DOC,
      selectedCandidateId: PREVIOUS_PACKET_SELECTED_CANDIDATE_ID,
      selectionStatus: PREVIOUS_PACKET_STATUS
    },
    rejectedOrClosed,
    rerankPlanDoc: RERANK_PLAN_DOC,
    selectedCandidate: selected,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first rerank after wall opening/leak common-wall same-basis holdout packet", () => {
  it("lands the no-runtime rerank and selects measured wall Rw anchor schema plus fingerprint", () => {
    const summary = buildRerankSummary();

    expect(summary).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      noRuntimeValueMovement: true,
      previousPacket: {
        acceptedSameBasisHoldoutRows: 0,
        landedGate: PREVIOUS_PACKET_ACTION,
        packetFile: PREVIOUS_PACKET_FILE,
        packetPlanDoc: PREVIOUS_PACKET_PLAN_DOC,
        selectedCandidateId: PREVIOUS_PACKET_SELECTED_CANDIDATE_ID,
        selectionStatus: PREVIOUS_PACKET_STATUS
      },
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RERANK_STATUS
    });

    for (const path of [
      PREVIOUS_PACKET_FILE,
      PREVIOUS_PACKET_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC,
      PROJECT_USER_MEASURED_SOURCE_ANCHOR_PLAN,
      ESTIMATE_REQUEST_SCHEMA_FILE
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("rejects runtime retunes and closed chains before selecting the schema prerequisite", () => {
    const summary = buildRerankSummary();
    const byId = new Map(summary.candidates.map((candidate) => [candidate.id, candidate]));

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(summary.selectedCandidate).toMatchObject({
      decision: "selected_no_runtime_prerequisite",
      improvesAnswerOrderStep: 1,
      runtimeOwnerAuthorizedNow: false,
      selectedNextAction: SELECTED_NEXT_ACTION
    });

    expect(byId.get("wall.opening_leak_common_wall_runtime_retune_owner")).toMatchObject({
      decision: "rejected_evidence_missing",
      runtimeOwnerAuthorizedNow: false
    });
    expect(byId.get("project_user_measured_wall_rw_exact_bridge_now")).toMatchObject({
      decision: "rejected_runtime_prerequisite_missing",
      runtimeOwnerAuthorizedNow: false
    });
    expect(byId.get("workbench_anchor_manager_ui_first")).toMatchObject({
      decision: "rejected_frontend_first",
      runtimeOwnerAuthorizedNow: false
    });
    expect(byId.get("broad_source_crawl_or_confidence_labeling")).toMatchObject({
      decision: "rejected_evidence_missing",
      runtimeOwnerAuthorizedNow: false
    });

    for (const path of CLOSED_CHAIN_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
    expect(summary.rejectedOrClosed.every((candidate) => !candidate.runtimeOwnerAuthorizedNow)).toBe(true);
  });

  it("proves material and impact inputs exist while live measured-anchor intake rejects bare rows", () => {
    const estimateRequestSchema = readRepoFile(ESTIMATE_REQUEST_SCHEMA_FILE);
    const measuredAnchorPlan = readRepoFile(PROJECT_USER_MEASURED_SOURCE_ANCHOR_PLAN);

    expect(estimateRequestSchema).toContain("exactImpactSource: ExactImpactSourceSchema.optional()");
    expect(estimateRequestSchema).toContain("materialCatalog: EstimateMaterialCatalogSchema.optional()");
    expect(estimateRequestSchema).not.toContain("projectMeasuredSourceAnchors");
    if (estimateRequestSchema.includes("airborneMeasuredSourceAnchors")) {
      expect(estimateRequestSchema).toContain("ActiveProjectUserMeasuredWallRwAnchorSchema");
    }

    expect(measuredAnchorPlan).toContain("It does not yet accept a project/user airborne measured source anchor list.");
    expect(measuredAnchorPlan).toContain("Phase 1");
    expect(measuredAnchorPlan).toContain("Fingerprint must exclude:");

    const parsed = EstimateRequestSchema.safeParse({
      airborneMeasuredSourceAnchors: [
        {
          fingerprint: "wall-rw:user:example",
          metric: "Rw",
          metricBasis: "lab_rw",
          sourceStatus: "active",
          valueDb: 50
        }
      ],
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [
        {
          acoustic: {
            behavior: "rigid_mass",
            propertySourceStatus: "user_supplied"
          },
          category: "finish",
          densityKgM3: 720,
          id: "custom_cork_finish",
          name: "Custom cork finish",
          tags: ["custom-workbench-material", "finish"]
        }
      ],
      targetOutputs: ["Rw"]
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path[0]).toBe("airborneMeasuredSourceAnchors");
    }
  });

  it("keeps this rerank no-runtime and limits the next slice to schema/fingerprint prerequisites", () => {
    const summary = buildRerankSummary();

    expect(summary.counters).toMatchObject({
      acceptedSameBasisHoldoutRowsFromPreviousPacket: 0,
      estimatedNextExactMeasuredAnchorInputFamilies: 1,
      estimatedNextRuntimeValuesMovedAfterBridge: 1,
      estimatedNextSharedDomainFilesTouched: 1,
      frontendImplementationFilesTouched: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(summary.selectedCandidate.reason).toContain("schema and stable fingerprints");
    expect(summary.selectedNextFile).toBe("packages/shared/src/domain/project-user-measured-source-anchor.test.ts");
  });

  it("keeps active docs and current-gate runner aligned with the rerank and selected next plan", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_PACKET_ACTION);
      expect(contents, path).toContain(PREVIOUS_PACKET_STATUS);
      expect(contents, path).toContain(PREVIOUS_PACKET_FILE);
      expect(contents, path).toContain(PREVIOUS_PACKET_SELECTED_CANDIDATE_ID);
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
      "src/post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts"
    );
    expect(runner).toContain(
      "src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts"
    );
  });
});

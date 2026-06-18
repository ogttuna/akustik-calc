import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";
const PREVIOUS_RUNTIME_METHOD = "post_v1_project_user_measured_wall_rw_exact_bridge";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint";
const SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_lab_airborne_frequency_curve_anchor_schema_fingerprint";

const SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan";
const SELECTED_NEXT_FILE = "packages/shared/src/domain/project-user-measured-source-anchor.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 project/user measured wall airborne frequency anchor schema + fingerprint";

const AIRBORNE_BASIS_FILE = "packages/shared/src/domain/airborne-basis.ts";
const ESTIMATE_REQUEST_SCHEMA_FILE = "packages/shared/src/api/estimate.ts";
const RATING_ADAPTER_FILE = "packages/shared/src/domain/rating-adapter.ts";
const SHARED_ANCHOR_SCHEMA_FILE = "packages/shared/src/domain/project-user-measured-source-anchor.ts";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCompanionTargetOutputsUnlockedAfterBridge: 4,
  estimatedNextFrequencyCurveAnchorSchemas: 1,
  estimatedNextMeasuredCurveMetricFamilies: 1,
  estimatedNextRuntimeBasisPromotionsAfterBridge: 1,
  estimatedNextSharedDomainFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_alias_risk"
  | "rejected_context_missing"
  | "rejected_evidence_missing"
  | "rejected_frontend_first"
  | "rejected_too_broad"
  | "selected_no_runtime_prerequisite";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly id: string;
  readonly reason: string;
  readonly runtimeOwnerAuthorizedNow: boolean;
};

const CANDIDATES = [
  {
    decision: "selected_no_runtime_prerequisite",
    id: SELECTED_CANDIDATE_ID,
    reason:
      "The exact measured Rw bridge is intentionally scalar-only; the next highest-ROI prerequisite is a project/user measured wall lab airborne transmission-loss curve anchor schema and canonical fingerprint so future Rw, STC, C, Ctr, and OITC work can derive from owned bands instead of scalar aliases.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_alias_risk",
    id: "project_user_measured_wall_scalar_stc_c_ctr_anchor_expansion",
    reason:
      "Adding scalar STC/C/Ctr companions beside the landed Rw anchor would invite metric aliasing unless each scalar has its own measured basis or derives from an owned frequency curve.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_alias_risk",
    id: "companion_metric_completeness_from_scalar_rw_anchor",
    reason:
      "Companion completeness is valid only for owned spectra or direct companion formulas; a single-number Rw source row cannot publish C, Ctr, STC, or OITC.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_frontend_first",
    id: "project_user_measured_anchor_ui_storage_owner",
    reason:
      "UI and storage should wait until shared schema, metric basis, fingerprint, and runtime boundaries for curve anchors are owned.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_evidence_missing",
    id: "wall_opening_leak_common_wall_runtime_retune_reopen",
    reason:
      "The bounded opening/leak common-wall packet still has acceptedSameBasisHoldoutRows: 0, so a formula retune would be source-absent.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_context_missing",
    id: "building_prediction_flanking_runtime_owner",
    reason:
      "Building prediction remains high ROI, but this branch has no new bounded room, area, junction, or flanking evidence that would prevent lab-to-field copying.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_too_broad",
    id: "user_material_physical_input_adjacent_widening",
    reason:
      "User-material physical input coverage remains the highest strategic stream, but this rerank did not identify a narrower adjacent route that beats the measured-curve prerequisite without guessing topology or defaulting missing inputs.",
    runtimeOwnerAuthorizedNow: false
  },
  {
    decision: "rejected_too_broad",
    id: "broad_source_crawl_report_ui_or_confidence_copy",
    reason:
      "Broad source crawling, report UI work, and confidence wording do not improve this calculator route boundary or numeric ownership.",
    runtimeOwnerAuthorizedNow: false
  }
] as const satisfies readonly Candidate[];

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
  const selected = CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID);
  if (!selected) {
    throw new Error("Rerank must select one candidate.");
  }

  return {
    candidates: CANDIDATES,
    counters: RERANK_COUNTERS,
    landedGate: RERANK_ACTION,
    noRuntimeValueMovement: true,
    previousCoverageRefresh: {
      implementationFile: PREVIOUS_COVERAGE_FILE,
      planDoc: PREVIOUS_COVERAGE_PLAN_DOC,
      runtimeMethod: PREVIOUS_RUNTIME_METHOD,
      selectedGate: PREVIOUS_COVERAGE_ACTION,
      status: PREVIOUS_COVERAGE_STATUS
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

describe("post-V1 runtime-first rerank after project/user measured wall Rw exact bridge coverage refresh", () => {
  it("lands a no-runtime rerank and selects the measured airborne frequency anchor prerequisite", () => {
    const summary = buildRerankSummary();

    expect(summary).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      noRuntimeValueMovement: true,
      previousCoverageRefresh: {
        implementationFile: PREVIOUS_COVERAGE_FILE,
        planDoc: PREVIOUS_COVERAGE_PLAN_DOC,
        runtimeMethod: PREVIOUS_RUNTIME_METHOD,
        selectedGate: PREVIOUS_COVERAGE_ACTION,
        status: PREVIOUS_COVERAGE_STATUS
      },
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RERANK_STATUS
    });

    for (const path of [
      PREVIOUS_COVERAGE_FILE,
      PREVIOUS_COVERAGE_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_FILE,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects frequency-curve schema work because current shared foundations already separate curves and rating adapters", () => {
    const airborneBasis = readRepoFile(AIRBORNE_BASIS_FILE);
    const ratingAdapter = readRepoFile(RATING_ADAPTER_FILE);
    const sharedAnchorSchema = readRepoFile(SHARED_ANCHOR_SCHEMA_FILE);
    const estimateRequestSchema = readRepoFile(ESTIMATE_REQUEST_SCHEMA_FILE);

    expect(airborneBasis).toContain("measured_frequency_curve");
    expect(airborneBasis).toContain("frequencyBands");
    expect(airborneBasis).toContain("AirborneFrequencyBandsSchema");
    expect(ratingAdapter).toContain("iso_717_1_rw_from_airborne_transmission_loss_curve");
    expect(ratingAdapter).toContain("astm_e413_stc_from_airborne_transmission_loss_curve");
    expect(ratingAdapter).toContain("STC requires the ASTM E413 rating standard");
    expect(ratingAdapter).toContain("must not be silently rated as ASTM E413/STC");
    expect(sharedAnchorSchema).toContain("ProjectUserMeasuredWallRwAnchorBaseSchema");
    expect(sharedAnchorSchema).toContain('metric: z.literal("Rw")');
    expect(sharedAnchorSchema).toContain("valueDb");
    expect(estimateRequestSchema).toContain("airborneMeasuredSourceAnchors");
  });

  it("rejects adjacent high-ROI candidates that would move runtime without owned curve, context, or evidence", () => {
    const summary = buildRerankSummary();
    const byId = new Map(summary.candidates.map((candidate) => [candidate.id, candidate]));

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(summary.selectedCandidate).toMatchObject({
      decision: "selected_no_runtime_prerequisite",
      runtimeOwnerAuthorizedNow: false
    });
    expect(byId.get("project_user_measured_wall_scalar_stc_c_ctr_anchor_expansion")).toMatchObject({
      decision: "rejected_alias_risk",
      runtimeOwnerAuthorizedNow: false
    });
    expect(byId.get("companion_metric_completeness_from_scalar_rw_anchor")).toMatchObject({
      decision: "rejected_alias_risk",
      runtimeOwnerAuthorizedNow: false
    });
    expect(byId.get("wall_opening_leak_common_wall_runtime_retune_reopen")).toMatchObject({
      decision: "rejected_evidence_missing",
      runtimeOwnerAuthorizedNow: false
    });
    expect(byId.get("building_prediction_flanking_runtime_owner")).toMatchObject({
      decision: "rejected_context_missing",
      runtimeOwnerAuthorizedNow: false
    });
    expect(byId.get("project_user_measured_anchor_ui_storage_owner")).toMatchObject({
      decision: "rejected_frontend_first",
      runtimeOwnerAuthorizedNow: false
    });
  });

  it("keeps the rerank no-runtime while estimating the next shared-domain unlock", () => {
    const summary = buildRerankSummary();

    expect(summary.counters).toMatchObject({
      estimatedNextCompanionTargetOutputsUnlockedAfterBridge: 4,
      estimatedNextFrequencyCurveAnchorSchemas: 1,
      estimatedNextMeasuredCurveMetricFamilies: 1,
      estimatedNextRuntimeBasisPromotionsAfterBridge: 1,
      estimatedNextSharedDomainFilesTouched: 1,
      frontendImplementationFilesTouched: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("keeps active docs and current-gate runner aligned with the selected next schema slice", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_FILE);
      expect(contents, path).toContain(PREVIOUS_RUNTIME_METHOD);
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
      "src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts"
    );
    expect(runner).toContain("src/domain/project-user-measured-source-anchor.test.ts");
  });
});

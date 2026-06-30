import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-spectral-rating-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_landed_no_runtime_selected_post_v1_spectral_rating_backbone_v1";

const SELECTED_CANDIDATE_ID = "post_v1_spectral_rating_backbone_v1";
const SELECTED_NEXT_ACTION = "post_v1_spectral_rating_backbone_v1_plan";
const SELECTED_NEXT_FILE = "packages/engine/src/post-v1-spectral-rating-backbone-v1-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_SPECTRAL_RATING_BACKBONE_V1_PLAN_2026-06-29.md";
const SELECTED_NEXT_LABEL = "post-V1 spectral rating backbone V1";

const RERANK_COUNTERS = {
  candidateCount: 6,
  estimatedNextCalculableRequestShapes: 0,
  estimatedNextCalculableTargetOutputs: 0,
  estimatedNextRequiredPhysicalInputsCaptured: 0,
  estimatedNextReusableRatingProceduresMoved: 3,
  estimatedNextRuntimeBasisPromotions: 0,
  estimatedNextRuntimeValuesMoved: 0,
  estimatedNextUnsupportedBoundariesProtected: 6,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_blocked_until_holdout"
  | "rejected_lower_roi_after_oitc"
  | "rejected_no_same_basis_evidence"
  | "rejected_support_drift"
  | "selected_support_prerequisite";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly unlocks: readonly string[];
  readonly unsupportedBoundaries: readonly string[];
};

const SPECTRAL_RATING_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "OITC",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];
const OITC_OUTPUT = ["OITC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_support_prerequisite",
    estimatedRuntimeValuesMoved: 0,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "The OITC runtime owner landed, but rating and band-basis ownership is still split across curve-rating, OITC-specific rating code, and shared adapter metadata. A bounded spectral rating backbone now has higher ROI than another route owner because it prevents repeated rating/band validation logic and unlocks safer future value-moving owners.",
    routeFamily: "rating.spectral_backbone",
    selected: true,
    targetOutputs: SPECTRAL_RATING_OUTPUTS,
    unlocks: [
      "shared band-set and frequency-coverage validation for owned curves",
      "basis-valid companion derivation from route-owned curves",
      "a value-moving owner that consumes the backbone after this support slice"
    ],
    unsupportedBoundaries: [
      "no runtime OITC, Rw, STC, IIC, or AIIC value publication from this rerank",
      "no metric aliasing between ISO, ASTM E413, ASTM E1332, and ASTM E989 ratings",
      "no formula retune without same-family same-basis holdout evidence",
      "no broad source crawl",
      "no frontend polish",
      "no route-family solver rewrite"
    ]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "opening.facade_outdoor_indoor_oitc_spectral_rating_owner",
    reason:
      "The OITC ASTM E1332 runtime owner and its no-runtime coverage refresh already landed.",
    routeFamily: "opening.facade_outdoor_indoor.oitc_spectral_rating",
    selected: false,
    targetOutputs: OITC_OUTPUT,
    unlocks: [],
    unsupportedBoundaries: ["no stale repeat of the landed OITC owner"]
  },
  {
    decision: "rejected_no_same_basis_evidence",
    estimatedRuntimeValuesMoved: 1,
    id: "opening.facade_outdoor_indoor_oitc_calibration_retune",
    reason:
      "OITC calibration would be valuable only with admissible same-family, same-basis outdoor-indoor holdout evidence. The current repository evidence proves value routing and boundaries, not a calibration set.",
    routeFamily: "opening.facade_outdoor_indoor.oitc_calibration",
    selected: false,
    targetOutputs: OITC_OUTPUT,
    unlocks: [],
    unsupportedBoundaries: ["no OITC formula retune without holdout evidence"]
  },
  {
    decision: "rejected_lower_roi_after_oitc",
    estimatedRuntimeValuesMoved: 0,
    id: "post_v1_route_input_family_first_class_surface_v1",
    reason:
      "First-class route/input families remain high ROI, but the just-landed OITC owner exposes an immediate repeated spectral-rating primitive. Stabilizing that primitive first reduces the cost and risk of later route/input-family work.",
    routeFamily: "route_input_family.first_class_surface",
    selected: false,
    targetOutputs: [],
    unlocks: ["future route-required input question engine"],
    unsupportedBoundaries: ["defer until the spectral rating backbone support slice closes or blocks"]
  },
  {
    decision: "rejected_blocked_until_holdout",
    estimatedRuntimeValuesMoved: 4,
    id: "post_v1_wall_triple_leaf_multicavity_runtime_promotion_after_holdout_v1",
    reason:
      "Triple-leaf and multi-cavity runtime promotion can move real values, but the current high-ROI plan keeps it behind calibration and holdout blockers.",
    routeFamily: "wall.triple_leaf_multicavity",
    selected: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    unlocks: [],
    unsupportedBoundaries: ["no triple-leaf promotion before holdout and calibration blockers are closed"]
  },
  {
    decision: "rejected_support_drift",
    estimatedRuntimeValuesMoved: 0,
    id: "broad_source_crawl_or_frontend_polish",
    reason:
      "Broad source crawling, confidence-label work, cosmetic UI work, and generic process cleanup do not directly increase owned calculator scope from the post-OITC state.",
    routeFamily: "support.parallel_non_runtime",
    selected: false,
    targetOutputs: IMPACT_OUTPUTS,
    unlocks: [],
    unsupportedBoundaries: ["no support-only drift away from the selected calculator slice"]
  }
] as const satisfies readonly Candidate[];

const IMPLEMENTATION_EVIDENCE_FILES = [
  "packages/engine/src/curve-rating.ts",
  "packages/engine/src/oitc-rating.ts",
  "packages/shared/src/domain/rating-adapter.ts",
  "packages/shared/src/domain/rating.ts",
  "packages/engine/src/layer-combination-resolver-registry.ts",
  "docs/calculator/CALCULATOR_HIGH_ROI_SYSTEM_STRENGTHENING_PLAN_2026-06-29.md"
] as const;

const CURRENT_AUTHORITY_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 runtime-first route-family rerank after opening/facade outdoor-indoor OITC spectral rating coverage refresh", () => {
  it("lands the no-runtime rerank and selects the spectral rating backbone V1 support prerequisite", () => {
    for (const path of [
      PREVIOUS_COVERAGE_FILE,
      PREVIOUS_COVERAGE_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    expect(CANDIDATES).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(CANDIDATES.filter((candidate) => candidate.selected)).toHaveLength(1);
    expect(CANDIDATES.find((candidate) => candidate.selected)).toMatchObject({
      decision: "selected_support_prerequisite",
      estimatedRuntimeValuesMoved: 0,
      id: SELECTED_CANDIDATE_ID,
      targetOutputs: SPECTRAL_RATING_OUTPUTS
    });
    expect(RERANK_STATUS).toContain(SELECTED_CANDIDATE_ID);
    expect(RERANK_COUNTERS).toMatchObject({
      estimatedNextCalculableRequestShapes: 0,
      estimatedNextCalculableTargetOutputs: 0,
      estimatedNextRequiredPhysicalInputsCaptured: 0,
      estimatedNextRuntimeBasisPromotions: 0,
      estimatedNextRuntimeValuesMoved: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("grounds the selected backbone in the current implementation evidence", () => {
    for (const path of IMPLEMENTATION_EVIDENCE_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    const curveRating = readRepoFile("packages/engine/src/curve-rating.ts");
    const oitcRating = readRepoFile("packages/engine/src/oitc-rating.ts");
    const ratingAdapter = readRepoFile("packages/shared/src/domain/rating-adapter.ts");
    const highRoiPlan = readRepoFile(
      "docs/calculator/CALCULATOR_HIGH_ROI_SYSTEM_STRENGTHENING_PLAN_2026-06-29.md"
    );

    expect(curveRating).toContain("export function buildRatingsFromCurve");
    expect(curveRating).toContain("export function computeRwFromCurve");
    expect(curveRating).toContain("export function computeStcFromCurve");
    expect(oitcRating).toContain("export function computeAstmE1332OitcFromCurve");
    expect(oitcRating).toContain("ASTM_E1332_OITC_BAND_SET");
    expect(ratingAdapter).toContain("astm_e1332_oitc_from_outdoor_indoor_transmission_loss_curve");
    expect(ratingAdapter).toContain("outdoor_indoor_transmission_loss_curve");
    expect(ratingAdapter).toContain("ASTM E1332");
    expect(highRoiPlan).toContain("post_v1_spectral_rating_backbone_v1");
    expect(highRoiPlan).toContain("ratingsFromOwnedCurve");
  });

  it("rejects unsafe or lower-ROI next actions from the post-OITC state", () => {
    expect(CANDIDATES.find((candidate) => candidate.id === "opening.facade_outdoor_indoor_oitc_spectral_rating_owner")).toMatchObject({
      decision: "rejected_already_landed"
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "opening.facade_outdoor_indoor_oitc_calibration_retune")).toMatchObject({
      decision: "rejected_no_same_basis_evidence"
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "post_v1_wall_triple_leaf_multicavity_runtime_promotion_after_holdout_v1")).toMatchObject({
      decision: "rejected_blocked_until_holdout"
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "broad_source_crawl_or_frontend_polish")).toMatchObject({
      decision: "rejected_support_drift"
    });
  });

  it("keeps current docs and current gate synchronized with the landed rerank", () => {
    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_FILE);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("candidateCount: 6");
      expect(content, path).toContain("estimatedNextReusableRatingProceduresMoved: 3");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(RERANK_FILE.replace("packages/engine/", ""));
  });
});

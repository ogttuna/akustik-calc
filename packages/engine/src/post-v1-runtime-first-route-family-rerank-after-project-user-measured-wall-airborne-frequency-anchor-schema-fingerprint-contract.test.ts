import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema,
  buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint,
  type ProjectUserMeasuredWallAirborneFrequencyAnchor,
  type ProjectUserMeasuredWallAirborneFrequencyBands,
  type ProjectUserMeasuredWallConstructionSnapshot
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_SCHEMA_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan";
const PREVIOUS_SCHEMA_FILE =
  "packages/shared/src/domain/project-user-measured-source-anchor.test.ts";
const PREVIOUS_SCHEMA_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md";
const PREVIOUS_SCHEMA_STATUS =
  "post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_landed_no_runtime_selected_runtime_first_route_family_rerank";
const PREVIOUS_IMPLEMENTED_CANDIDATE_ID =
  "project_user_measured_wall_lab_airborne_frequency_curve_anchor_schema_fingerprint";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-anchor-schema-fingerprint-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner";
const SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_OWNER_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 project/user measured wall airborne frequency exact curve bridge owner";

const CALCULATE_ASSEMBLY_FILE = "packages/engine/src/calculate-assembly.ts";
const CURVE_RATING_FILE = "packages/engine/src/curve-rating.ts";
const ESTIMATE_REQUEST_SCHEMA_FILE = "packages/shared/src/api/estimate.ts";
const RATING_ADAPTER_FILE = "packages/shared/src/domain/rating-adapter.ts";
const RESOLVER_RUNTIME_FILE = "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts";
const SHARED_ANCHOR_SCHEMA_FILE = "packages/shared/src/domain/project-user-measured-source-anchor.ts";

const RERANK_COUNTERS = {
  activeMeasuredFrequencyAnchorCandidateSchemas: 1,
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 4,
  estimatedNextExactMeasuredCurveRuntimeFamilies: 1,
  estimatedNextRuntimeBasisPromotions: 1,
  estimatedNextRuntimeValuesMoved: 4,
  estimatedNextSharedApiFilesTouched: 1,
  estimatedNextTargetOutputsMoved: 4,
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
      "The shared active measured wall lab airborne frequency anchor schema and canonical fingerprint now exist, the engine already has curve rating infrastructure, and request/runtime intake is the missing bounded bridge for exact element-lab Rw, STC, C, and Ctr derivation without scalar aliasing.",
    runtimeOwnerAuthorizedNext: true
  },
  {
    decision: "rejected_alias_risk",
    id: "project_user_measured_wall_scalar_stc_c_ctr_anchor_expansion",
    reason:
      "Scalar companion anchors would require separate measured scalar bases and still would not unlock the frequency-band backbone; the exact curve bridge should own companions first.",
    runtimeOwnerAuthorizedNext: false
  },
  {
    decision: "rejected_prerequisite_missing",
    id: "project_user_measured_wall_airborne_frequency_compatible_delta_owner",
    reason:
      "Compatible deltas need exact measured curve request/runtime matching before any reduced-stack or exterior-board delta boundary can be proven.",
    runtimeOwnerAuthorizedNext: false
  },
  {
    decision: "rejected_frontend_first",
    id: "project_user_measured_frequency_anchor_ui_storage_owner",
    reason:
      "UI/storage should wait until request schema and runtime exact-curve bridge semantics are owned.",
    runtimeOwnerAuthorizedNext: false
  },
  {
    decision: "rejected_context_missing",
    id: "building_prediction_flanking_from_measured_curve_owner",
    reason:
      "Measured lab curves can seed building prediction later, but field/building outputs require explicit room, area, junction, and flanking context and must not copy lab ratings.",
    runtimeOwnerAuthorizedNext: false
  },
  {
    decision: "rejected_evidence_missing",
    id: "wall_opening_leak_common_wall_runtime_retune_reopen",
    reason:
      "The bounded opening/leak common-wall packet still has acceptedSameBasisHoldoutRows: 0, so retuning remains source-absent.",
    runtimeOwnerAuthorizedNext: false
  },
  {
    decision: "rejected_too_broad",
    id: "user_material_physical_input_adjacent_widening",
    reason:
      "User-material input coverage remains strategically highest ROI, but this immediate bridge moves four exact measured lab target outputs with lower blast radius and no guessed topology.",
    runtimeOwnerAuthorizedNext: false
  },
  {
    decision: "rejected_too_broad",
    id: "broad_source_crawl_report_ui_or_confidence_copy",
    reason:
      "Broad crawling, report/UI work, and confidence wording do not improve formula ownership, exact curve runtime basis, or metric integrity.",
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

const SAMPLE_FREQUENCY_BANDS = {
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
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildSampleActiveFrequencyAnchor(): ProjectUserMeasuredWallAirborneFrequencyAnchor {
  const fingerprint = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
    frequencyBands: SAMPLE_FREQUENCY_BANDS,
    measurementMethodStandard: "ISO 10140-2",
    ratingStandards: ["ISO 717-1", "ASTM E413"],
    snapshot: SAMPLE_SNAPSHOT
  });

  return {
    canonicalizationVersion: 1,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-18T11:30:00.000Z",
    createdBy: "frequency-rerank-contract",
    createdFromProjectId: "project-frequency-rerank",
    curveBasis: "measured_frequency_curve",
    fingerprint,
    frequencyBands: SAMPLE_FREQUENCY_BANDS,
    id: "project-rerank-measured-wall-frequency",
    inputBasis: "airborne_transmission_loss_curve",
    measurementMethodStandard: "ISO 10140-2",
    metricBasis: "lab_airborne_transmission_loss_curve",
    metricFamily: "airborne",
    ratingStandards: ["ISO 717-1", "ASTM E413"],
    revision: 1,
    scope: "project_measured",
    snapshot: SAMPLE_SNAPSHOT,
    sourceLabel: "Project measured wall airborne TL curve",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T11:30:00.000Z"
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
      implementedCandidateId: PREVIOUS_IMPLEMENTED_CANDIDATE_ID,
      planDoc: PREVIOUS_SCHEMA_PLAN_DOC,
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

describe("post-V1 runtime-first rerank after project/user measured wall airborne frequency anchor schema fingerprint", () => {
  it("lands the no-runtime rerank and selects the exact curve bridge runtime owner", () => {
    const summary = buildRerankSummary();

    expect(summary).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      noRuntimeValueMovement: true,
      previousSchema: {
        implementationFile: PREVIOUS_SCHEMA_FILE,
        implementedCandidateId: PREVIOUS_IMPLEMENTED_CANDIDATE_ID,
        planDoc: PREVIOUS_SCHEMA_PLAN_DOC,
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
      SHARED_ANCHOR_SCHEMA_FILE
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("proves exact curve schema and rating infrastructure are present before the selected owner lands request/runtime intake", () => {
    const activeAnchor = buildSampleActiveFrequencyAnchor();
    const parsedAnchor = ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema.safeParse(activeAnchor);

    expect(parsedAnchor.success).toBe(true);
    if (parsedAnchor.success) {
      expect(parsedAnchor.data.fingerprint).toMatch(/^dynecho:wall-airborne-frequency-anchor:v1:[a-f0-9]{16}$/u);
      expect(parsedAnchor.data.curveBasis).toBe("measured_frequency_curve");
      expect(parsedAnchor.data.metricBasis).toBe("lab_airborne_transmission_loss_curve");
      expect(parsedAnchor.data.ratingStandards).toEqual(["ISO 717-1", "ASTM E413"]);
    }

    const curveRating = readRepoFile(CURVE_RATING_FILE);
    const ratingAdapter = readRepoFile(RATING_ADAPTER_FILE);
    const resolverRuntime = readRepoFile(RESOLVER_RUNTIME_FILE);
    const estimateRequestSchema = readRepoFile(ESTIMATE_REQUEST_SCHEMA_FILE);
    const calculateAssembly = readRepoFile(CALCULATE_ASSEMBLY_FILE);

    expect(curveRating).toContain("export function buildRatingsFromCurve");
    expect(ratingAdapter).toContain("iso_717_1_rw_from_airborne_transmission_loss_curve");
    expect(ratingAdapter).toContain("astm_e413_stc_from_airborne_transmission_loss_curve");
    expect(ratingAdapter).toContain("STC requires the ASTM E413 rating standard");
    expect(ratingAdapter).toContain("must not be silently rated as ASTM E413/STC");
    expect(resolverRuntime).toContain("ratingAdapterBasisIds");
    expect(resolverRuntime).toContain("astm_e413_stc_from_airborne_transmission_loss_curve");
    expect(estimateRequestSchema).toContain("ActiveProjectUserMeasuredWallRwAnchorSchema");
    expect(estimateRequestSchema).toContain("ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema");
    expect(estimateRequestSchema).toContain("airborneMeasuredFrequencySourceAnchors");
    expect(calculateAssembly).toContain("ProjectUserMeasuredWallRwAnchor");
    expect(calculateAssembly).toContain("ProjectUserMeasuredWallAirborneFrequencyAnchor");
  });

  it("rejects adjacent candidates that would skip exact curve runtime ownership or conflate metric bases", () => {
    const summary = buildRerankSummary();
    const byId = new Map(summary.candidates.map((candidate) => [candidate.id, candidate]));

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(summary.selectedCandidate).toMatchObject({
      decision: "selected_runtime_owner_ready",
      runtimeOwnerAuthorizedNext: true
    });
    expect(byId.get("project_user_measured_wall_scalar_stc_c_ctr_anchor_expansion")).toMatchObject({
      decision: "rejected_alias_risk",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("project_user_measured_wall_airborne_frequency_compatible_delta_owner")).toMatchObject({
      decision: "rejected_prerequisite_missing",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("building_prediction_flanking_from_measured_curve_owner")).toMatchObject({
      decision: "rejected_context_missing",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("wall_opening_leak_common_wall_runtime_retune_reopen")).toMatchObject({
      decision: "rejected_evidence_missing",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("project_user_measured_frequency_anchor_ui_storage_owner")).toMatchObject({
      decision: "rejected_frontend_first",
      runtimeOwnerAuthorizedNext: false
    });
  });

  it("keeps this rerank no-runtime while estimating the next exact curve movement", () => {
    const summary = buildRerankSummary();

    expect(summary.counters).toMatchObject({
      activeMeasuredFrequencyAnchorCandidateSchemas: 1,
      estimatedNextCalculableRequestShapes: 4,
      estimatedNextExactMeasuredCurveRuntimeFamilies: 1,
      estimatedNextRuntimeBasisPromotions: 1,
      estimatedNextRuntimeValuesMoved: 4,
      estimatedNextSharedApiFilesTouched: 1,
      estimatedNextTargetOutputsMoved: 4,
      frontendImplementationFilesTouched: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("keeps active docs and current-gate runner aligned with the selected exact curve bridge owner", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_SCHEMA_ACTION);
      expect(contents, path).toContain(PREVIOUS_SCHEMA_STATUS);
      expect(contents, path).toContain(PREVIOUS_SCHEMA_FILE);
      expect(contents, path).toContain(PREVIOUS_IMPLEMENTED_CANDIDATE_ID);
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
      "src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-anchor-schema-fingerprint-contract.test.ts"
    );
    expect(runner).toContain("src/domain/project-user-measured-source-anchor.test.ts");
  });
});

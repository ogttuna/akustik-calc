import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-calculated-lab-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-british-gypsum-exact-lab-calculated-lab-companion-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_landed_no_runtime_selected_wall_user_material_formula_required_input_surface_owner";

const SELECTED_CANDIDATE_ID =
  "wall.user_material_formula_required_input_surface_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_user_material_formula_required_input_surface_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_REQUIRED_INPUT_SURFACE_OWNER_PLAN_2026-06-24.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall user-material formula required input surface owner";

const RERANK_COUNTERS = {
  candidateCount: 6,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 8,
  estimatedNextRequiredPhysicalInputsCaptured: 8,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 8,
  estimatedNextUnsupportedBoundariesProtected: 5,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_evidence_missing"
  | "rejected_frontend_or_catalog_only"
  | "rejected_too_broad"
  | "selected_runtime_input_surface_owner";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly requiredInputsOrEvidence: readonly string[];
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
};

const LAB_TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const SELECTED_TARGET_OUTPUTS = [
  ...LAB_TARGET_OUTPUTS,
  ...FIELD_BUILDING_TARGET_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_runtime_input_surface_owner",
    estimatedRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "The British Gypsum exact-row chain is now protected, and the highest bounded calculator ROI is to move back to arbitrary source-absent user wall stacks. This owner should expose the route-critical physical input surface for the owned wall formula route: explicit surface mass or density-derived surface mass, cavity depth, support topology, absorber flow resistivity, and complete field/building context when adapters are requested. It opens calculation through owned physics instead of adding source rows or copying manufacturer ratings.",
    requiredInputsOrEvidence: [
      "layer.surfaceMassKgM2_or_materialCatalog.densityKgM3_and_thicknessMm",
      "airborneContext.wallTopology.supportTopology",
      "airborneContext.wallTopology.sideALeafLayerIndices",
      "airborneContext.wallTopology.sideBLeafLayerIndices",
      "airborneContext.wallTopology.cavity1DepthMm",
      "airborneContext.wallTopology.cavity1AbsorptionClass_or_absorberFlowResistivityPaSM2",
      "airborneContext.studSpacingMm_or_supportSpacingMm",
      "field_or_building_room_context_when_field_outputs_are_requested"
    ],
    routeFamily: "wall.source_absent_user_material_formula_input_surface",
    selected: true,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: SELECTED_TARGET_OUTPUTS
  },
  {
    decision: "rejected_evidence_missing",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.british_gypsum_nearby_same_family_anchor_delta_owner",
    reason:
      "Nearby British Gypsum delta work remains plausible, but the local corpus for this chain contains only exact A046005/A046006 source rows and the landed owner explicitly keeps nearby rows closed. Selecting a same-family delta now would require primary-source construction evidence and a bounded same-basis delta that this rerank does not have.",
    requiredInputsOrEvidence: [
      "additional_British_Gypsum_source_rows",
      "same_family_construction_identity",
      "same_basis_metric_identity",
      "bounded_delta_rule_or_admissible_measured_pair",
      "explicit_resilientBarSideCount"
    ],
    routeFamily: "wall.british_gypsum_nearby_anchor_delta",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true,
    targetOutputs: LAB_TARGET_OUTPUTS
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.british_gypsum_exact_lab_calculated_lab_companion_owner",
    reason:
      "The exact A046005/A046006 calculated lab companion owner and its coverage refresh have already landed. Re-selecting it would extend a support loop without opening a new construction family.",
    requiredInputsOrEvidence: [
      "exact_A046005_or_A046006_source_row",
      "explicit_resilientBarSideCount",
      "calculated_frequency_curve"
    ],
    routeFamily: "wall.british_gypsum_exact_lab",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: LAB_TARGET_OUTPUTS
  },
  {
    decision: "rejected_too_broad",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.generic_building_flanking_context_broadening",
    reason:
      "Generic building/flanking broadening is valid calculator work, but it should not outrun the base source-absent wall input surface. The selected owner is a smaller vertical slice with precise missing-input behavior.",
    requiredInputsOrEvidence: [
      "route_family_matrix",
      "junction_catalog",
      "flanking_path_set",
      "cross_family_holdout_rows"
    ],
    routeFamily: "wall.airborne_building_prediction_generic",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: FIELD_BUILDING_TARGET_OUTPUTS
  },
  {
    decision: "rejected_frontend_or_catalog_only",
    estimatedRuntimeValuesMoved: 0,
    id: "public_source_material_catalog_expansion_followup",
    reason:
      "Product material rows are useful physical inputs, but catalog work by itself is support. The next calculator owner must consume physical inputs through an owned formula route and keep manufacturer rating copy closed.",
    requiredInputsOrEvidence: [
      "material_density_or_dynamic_stiffness",
      "route_direct_calculation_contract",
      "no_acoustic_rating_copy_boundary"
    ],
    routeFamily: "catalog_input_support",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Rw", "STC", "Ln,w", "DeltaLw"]
  },
  {
    decision: "rejected_frontend_or_catalog_only",
    estimatedRuntimeValuesMoved: 0,
    id: "broad_ui_report_confidence_or_source_crawl_work",
    reason:
      "UI polish, confidence wording, generic cleanup, and broad source crawling do not move calculator route ownership or numeric output in this slice.",
    requiredInputsOrEvidence: [],
    routeFamily: "non_calculator",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true,
    targetOutputs: []
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

function summarizeRerank() {
  return {
    counters: RERANK_COUNTERS,
    landedGate: RERANK_ACTION,
    previousCoverageRefresh: {
      action: PREVIOUS_COVERAGE_REFRESH_ACTION,
      file: PREVIOUS_COVERAGE_REFRESH_FILE,
      planDoc: PREVIOUS_COVERAGE_REFRESH_PLAN_DOC,
      selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
    },
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first rerank after wall British Gypsum exact lab calculated lab companion coverage refresh", () => {
  it("lands the no-runtime rerank and selects the user-material formula input-surface owner", () => {
    expect(summarizeRerank()).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RERANK_STATUS
    });

    for (const path of [
      PREVIOUS_COVERAGE_REFRESH_FILE,
      PREVIOUS_COVERAGE_REFRESH_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps source-absent formula input capture above nearby BG deltas without bounded evidence", () => {
    const selected = CANDIDATES.filter((candidate) => candidate.selected);

    expect(selected).toEqual([
      expect.objectContaining({
        decision: "selected_runtime_input_surface_owner",
        estimatedRuntimeValuesMoved: 8,
        id: SELECTED_CANDIDATE_ID,
        routeFamily: "wall.source_absent_user_material_formula_input_surface",
        sourceRowsRequiredForRuntimeSelection: false
      })
    ]);

    expect(CANDIDATES.find((candidate) => candidate.id === "wall.british_gypsum_nearby_same_family_anchor_delta_owner")).toMatchObject({
      decision: "rejected_evidence_missing",
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
  });

  it("requires physical route inputs instead of catalog rating copy or support-loop work", () => {
    const selected = CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID);

    expect(selected?.requiredInputsOrEvidence).toEqual(
      expect.arrayContaining([
        "layer.surfaceMassKgM2_or_materialCatalog.densityKgM3_and_thicknessMm",
        "airborneContext.wallTopology.supportTopology",
        "airborneContext.wallTopology.cavity1DepthMm",
        "airborneContext.wallTopology.cavity1AbsorptionClass_or_absorberFlowResistivityPaSM2"
      ])
    );
    expect(selected?.targetOutputs).toEqual(expect.arrayContaining([...LAB_TARGET_OUTPUTS]));
    expect(selected?.targetOutputs).toEqual(expect.arrayContaining([...FIELD_BUILDING_TARGET_OUTPUTS]));
    expect(CANDIDATES.find((candidate) => candidate.id === "public_source_material_catalog_expansion_followup")).toMatchObject({
      decision: "rejected_frontend_or_catalog_only",
      selected: false
    });
    expect(RERANK_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(RERANK_COUNTERS.runtimeFormulaRetunes).toBe(0);
    expect(RERANK_COUNTERS.sourceRowsImported).toBe(0);
    expect(RERANK_COUNTERS.frontendImplementationFilesTouched).toBe(0);
  });

  it("keeps docs and current-gate runner synchronized with the rerank and selected owner", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_FILE);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("candidateCount: 6");
      expect(content, path).toContain("roiAnalysisIterations: 4");
      expect(content, path).toContain("estimatedNextCalculableRequestShapes: 2");
      expect(content, path).toContain("estimatedNextCalculableTargetOutputs: 8");
      expect(content, path).toContain("estimatedNextRequiredPhysicalInputsCaptured: 8");
      expect(content, path).toContain("estimatedNextRuntimeBasisPromotions: 2");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 8");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toMatch(/not (a )?broad source crawl/i);
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(RERANK_FILE.replace("packages/engine/", ""));
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_landed_no_runtime_selected_wall_opening_leak_common_wall_same_basis_holdout_packet";

const HIGH_ROI_SELECTION_PLAN_DOC =
  "docs/calculator/HIGH_ROI_CALCULATOR_IMPLEMENTATION_SELECTION_PLAN_2026-06-18.md";

const SELECTED_CANDIDATE_ID =
  "wall.opening_leak_common_wall_same_basis_holdout_packet";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_OPENING_LEAK_COMMON_WALL_SAME_BASIS_HOLDOUT_PACKET_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall opening/leak common-wall same-basis holdout packet";

const RERANK_COUNTERS = {
  candidateCount: 6,
  estimatedNextEvidencePackets: 1,
  estimatedNextRuntimeValuesMovedAfterEvidence: 5,
  frontendImplementationFilesTouched: 0,
  immediateRuntimeValuesMoved: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const SELECTED_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

type ReadinessGate =
  | "blocked_missing_same_basis_evidence"
  | "blocked_unbounded_runtime_scope"
  | "closed_chain_subtracted"
  | "passes_no_runtime_evidence_packet"
  | "ready_later_after_narrow_route";

type Candidate = {
  readonly candidateOrder: number;
  readonly gate: ReadinessGate;
  readonly id: string;
  readonly reason: string;
  readonly requiredInputsOrEvidence: readonly string[];
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetOutputs: readonly (RequestedOutputId | "OITC")[];
};

const CANDIDATES = [
  {
    candidateOrder: 1,
    gate: "closed_chain_subtracted",
    id: "user_material_physical_input_adjacent_widening",
    reason:
      "Custom double-leaf/framed wall route-input, missing-topology, porous-flow, field/building companion, and low-density user-material impact chains are already landed or refreshed. No new adjacent request shape is locally proven for this rerank without reusing a closed owner.",
    requiredInputsOrEvidence: [
      "leaf_grouping",
      "support_topology",
      "bridge_class",
      "cavity_depth",
      "absorber_flow_resistivity",
      "dynamic_stiffness",
      "load_basis"
    ],
    routeFamily: "wall.floor.user_material_physical_input",
    selected: false,
    selectedNextActionIfSelected: null,
    selectedNextFileIfSelected: null,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr", "Ln,w", "DeltaLw"]
  },
  {
    candidateOrder: 2,
    gate: "passes_no_runtime_evidence_packet",
    id: SELECTED_CANDIDATE_ID,
    reason:
      "Opening/leak building adapters already prove the calculator can separate lab, field, and building bases for explicit room and junction inputs, but the common-wall residual lane remains blocked until same-family, same-basis evidence or a bounded residual rule exists. The highest-ROI safe next step is a narrow rights-safe holdout packet, not runtime value movement.",
    requiredInputsOrEvidence: [
      "hostWallAreaM2",
      "openingLeakElements",
      "panelWidthMm",
      "panelHeightMm",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "sourceRoomVolumeM3",
      "flankingJunctionClass",
      "junctionCouplingLengthM",
      "buildingPredictionOutputBasis",
      "same_basis_opening_or_common_wall_holdout"
    ],
    routeFamily: "wall.opening_leak.common_wall.building_prediction",
    selected: true,
    selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
    selectedNextFileIfSelected: SELECTED_NEXT_FILE,
    sourceRowsRequiredForRuntimeSelection: true,
    targetOutputs: SELECTED_TARGET_OUTPUTS
  },
  {
    candidateOrder: 3,
    gate: "closed_chain_subtracted",
    id: "floor_open_box_open_web_timber_impact_residual",
    reason:
      "Open-box/open-web raw-bare, helper-only, field/building input, and package-transfer corridors have substantial existing coverage. Selecting another floor residual from this rerank would duplicate closed broad-accuracy chains unless a fresh same-basis target-output gap is reproduced.",
    requiredInputsOrEvidence: [
      "joist_or_open_web_topology",
      "resilient_layer_role",
      "dynamic_stiffness",
      "load_basis",
      "same_stack_impact_holdout"
    ],
    routeFamily: "floor.open_box_open_web.impact",
    selected: false,
    selectedNextActionIfSelected: null,
    selectedNextFileIfSelected: null,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
  },
  {
    candidateOrder: 4,
    gate: "blocked_unbounded_runtime_scope",
    id: "companion_metric_completeness_audit",
    reason:
      "Companion completeness remains useful, but this rerank did not identify a narrow owned-spectrum route with hidden companions that beats the opening/common-wall evidence blocker. A broad audit would become metric-by-metric process work.",
    requiredInputsOrEvidence: [
      "owned_spectrum_route",
      "rating_adapter",
      "scalar_only_negative_boundary",
      "field_building_adapter_boundary"
    ],
    routeFamily: "owned_spectrum.companion_metrics",
    selected: false,
    selectedNextActionIfSelected: null,
    selectedNextFileIfSelected: null,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["C", "Ctr", "STC", "OITC"]
  },
  {
    candidateOrder: 5,
    gate: "ready_later_after_narrow_route",
    id: "frequency_band_backbone_narrow_route",
    reason:
      "Frequency-band ownership is the long-term accuracy ceiling, but the local triple-leaf frequency lane is waiting on a rights-safe source packet and a broad backbone rewrite is too large for this selected-next rerank.",
    requiredInputsOrEvidence: [
      "owned_third_octave_curve",
      "rating_derivation",
      "curve_identity_map",
      "negative_alias_tests"
    ],
    routeFamily: "frequency_band_backbone",
    selected: false,
    selectedNextActionIfSelected: null,
    selectedNextFileIfSelected: null,
    sourceRowsRequiredForRuntimeSelection: true,
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    candidateOrder: 6,
    gate: "blocked_missing_same_basis_evidence",
    id: "calibration_holdout_packet_for_one_family",
    reason:
      "Calibration/holdout work is high value, but it must be attached to one family. The selected opening/common-wall packet is the narrower expression of this stream for the current rerank.",
    requiredInputsOrEvidence: [
      "one_family_scope",
      "rights_safe_source",
      "same_metric_basis",
      "before_after_error_budget"
    ],
    routeFamily: "calibration_holdout",
    selected: false,
    selectedNextActionIfSelected: null,
    selectedNextFileIfSelected: null,
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
  HIGH_ROI_SELECTION_PLAN_DOC,
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function summarizeRerank() {
  return {
    candidates: CANDIDATES,
    counters: RERANK_COUNTERS,
    landedGate: RERANK_ACTION,
    previousCoverageRefresh: {
      landedGate: PREVIOUS_COVERAGE_REFRESH_ACTION,
      selectedNextFile: PREVIOUS_COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
    },
    previousRuntimeOwner: {
      landedGate: PREVIOUS_OWNER_ACTION,
      selectedNextFile: PREVIOUS_OWNER_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
    },
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectedTargetOutputs: SELECTED_TARGET_OUTPUTS,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first route-family rerank after wall timber-stud + CLT formula building lab-companion basis integrity", () => {
  it("lands the no-runtime rerank and selects the opening/common-wall same-basis holdout packet", () => {
    expect(summarizeRerank()).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectedTargetOutputs: SELECTED_TARGET_OUTPUTS,
      selectionStatus: RERANK_STATUS
    });

    for (const path of [
      PREVIOUS_COVERAGE_REFRESH_FILE,
      PREVIOUS_OWNER_FILE,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      HIGH_ROI_SELECTION_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("applies the high-ROI gates instead of reusing closed chains or guessing runtime values", () => {
    const selected = CANDIDATES.filter((candidate) => candidate.selected);
    const byId = new Map(CANDIDATES.map((candidate) => [candidate.id, candidate]));

    expect(CANDIDATES).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(selected).toEqual([
      expect.objectContaining({
        gate: "passes_no_runtime_evidence_packet",
        id: SELECTED_CANDIDATE_ID,
        routeFamily: "wall.opening_leak.common_wall.building_prediction",
        selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
        selectedNextFileIfSelected: SELECTED_NEXT_FILE,
        sourceRowsRequiredForRuntimeSelection: true,
        targetOutputs: SELECTED_TARGET_OUTPUTS
      })
    ]);

    expect(byId.get("user_material_physical_input_adjacent_widening")).toMatchObject({
      gate: "closed_chain_subtracted",
      selected: false
    });
    expect(byId.get("floor_open_box_open_web_timber_impact_residual")).toMatchObject({
      gate: "closed_chain_subtracted",
      selected: false
    });
    expect(byId.get("companion_metric_completeness_audit")).toMatchObject({
      gate: "blocked_unbounded_runtime_scope",
      selected: false
    });
    expect(byId.get("frequency_band_backbone_narrow_route")).toMatchObject({
      gate: "ready_later_after_narrow_route",
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
  });

  it("keeps the selected packet evidence-only until same-basis proof exists", () => {
    expect(RERANK_COUNTERS.immediateRuntimeValuesMoved).toBe(0);
    expect(RERANK_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(RERANK_COUNTERS.runtimeFormulaRetunes).toBe(0);
    expect(RERANK_COUNTERS.sourceRowsImported).toBe(0);
    expect(RERANK_COUNTERS.frontendImplementationFilesTouched).toBe(0);
    expect(RERANK_COUNTERS.estimatedNextEvidencePackets).toBe(1);
    expect(RERANK_COUNTERS.estimatedNextRuntimeValuesMovedAfterEvidence).toBe(SELECTED_TARGET_OUTPUTS.length);

    const selected = CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID);
    expect(selected?.requiredInputsOrEvidence).toEqual([
      "hostWallAreaM2",
      "openingLeakElements",
      "panelWidthMm",
      "panelHeightMm",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "sourceRoomVolumeM3",
      "flankingJunctionClass",
      "junctionCouplingLengthM",
      "buildingPredictionOutputBasis",
      "same_basis_opening_or_common_wall_holdout"
    ]);
  });

  it("keeps active docs and the current-gate runner aligned to the selected packet", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(RERANK_ACTION);
      expect(contents, path).toContain(RERANK_STATUS);
      expect(contents, path).toContain(SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-contract.test.ts"
    );
  });
});

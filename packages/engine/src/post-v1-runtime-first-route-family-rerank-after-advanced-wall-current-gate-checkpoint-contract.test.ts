import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-advanced-wall-current-gate-checkpoint-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_ADVANCED_WALL_CURRENT_GATE_CHECKPOINT_PLAN_2026-06-24.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_landed_no_runtime_selected_opening_facade_door_window_frequency_input_boundary_owner";

const SELECTED_CANDIDATE_ID =
  "opening.facade_door_window_frequency_input_boundary_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_frequency_input_boundary_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window frequency-input boundary owner";

const CURRENT_SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan";
const CURRENT_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts";
const CURRENT_SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const CURRENT_SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window frequency-input boundary coverage refresh";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 0,
  estimatedNextCalculableTargetOutputs: 0,
  estimatedNextRequiredPhysicalInputsCaptured: 6,
  estimatedNextRuntimeBasisPromotions: 0,
  estimatedNextRuntimeValuesMoved: 0,
  estimatedNextUnsupportedBoundariesProtected: 8,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_holdout_not_admissible"
  | "rejected_parallel_support_lane"
  | "rejected_stale_repeat"
  | "rejected_too_broad_for_next_owner"
  | "selected_required_input_boundary_owner";

type Candidate = {
  readonly actionItems: readonly string[];
  readonly decision: CandidateDecision;
  readonly estimatedNextRequiredPhysicalInputsCaptured: number;
  readonly estimatedNextRuntimeValuesMoved: number;
  readonly id: string;
  readonly implementationEvidencePaths: readonly string[];
  readonly reason: string;
  readonly requiredPhysicalInputs: readonly string[];
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected?: typeof SELECTED_NEXT_ACTION;
  readonly targetOutputs: readonly (RequestedOutputId | "OITC")[];
  readonly unsupportedBoundaries: readonly string[];
};

const LAB_AIRBORNE_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const SELECTED_REQUIRED_INPUTS = [
  "hostWallAreaM2",
  "openingLeakElements[].areaM2",
  "openingLeakElements[].elementType",
  "openingLeakElements[].frequencyBandsOrRatingBasis",
  "openingLeakElements[].sealLeakageClass",
  "facadeOutdoorOrRoomNormalizationContext"
] as const;

const SELECTED_UNSUPPORTED_BOUNDARIES = [
  "no generic door/window/facade scalar alias from nearby opening rows",
  "no lab-to-field or lab-to-building copy without owned context",
  "no OITC promotion before an owned outdoor-indoor spectrum adapter",
  "no ASTM/ISO metric aliasing",
  "no impact metric fallback",
  "no broad product/source crawl",
  "no area-free composite transmission loss",
  "no target-output widening beyond requested metrics"
] as const;

const CANDIDATES = [
  {
    actionItems: ["action_1_frequency_first_backbone", "action_3_openings_facades", "action_6_input_capture"],
    decision: "selected_required_input_boundary_owner",
    estimatedNextRequiredPhysicalInputsCaptured:
      RERANK_COUNTERS.estimatedNextRequiredPhysicalInputsCaptured,
    estimatedNextRuntimeValuesMoved: 0,
    id: SELECTED_CANDIDATE_ID,
    implementationEvidencePaths: [
      "packages/engine/src/dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor.ts",
      "packages/engine/src/dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter.ts",
      "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts",
      "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts",
      "docs/calculator/INDUSTRY_GRADE_CALCULATOR_GAP_ANALYSIS_AND_ROUTE_SELECTION_GUARD_2026-06-25.md"
    ],
    reason:
      "Gate S and Gate AH already calculate element-lab opening/leak Rw/STC from owned host-wall and area-energy logic, but the current implementation still lacks a dedicated door/window/facade frequency-input boundary. Selecting this owner protects the product from claiming facade/window/door coverage from scalar opening rows, captures the physical inputs required for a later frequency-first route, and keeps field/building and OITC blocked until their contexts are owned.",
    requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS,
    routeFamily: "opening.facade_door_window.frequency_input_boundary",
    selected: true,
    selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
    targetOutputs: [...LAB_AIRBORNE_OUTPUTS, ...FIELD_BUILDING_OUTPUTS, "OITC"],
    unsupportedBoundaries: SELECTED_UNSUPPORTED_BOUNDARIES
  },
  {
    actionItems: ["action_1_frequency_first_backbone"],
    decision: "rejected_already_landed",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "wall.double_leaf_framed_frequency_backbone_repeat",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-owner-contract.test.ts",
      "packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-coverage-refresh-contract.test.ts"
    ],
    reason:
      "The wall double-leaf/framed frequency-backbone owner and coverage refresh are already in the landed owner chain, so repeating it would not increase current calculable scope.",
    requiredPhysicalInputs: [],
    routeFamily: "wall.double_leaf_framed.frequency_backbone",
    selected: false,
    targetOutputs: LAB_AIRBORNE_OUTPUTS,
    unsupportedBoundaries: ["no stale rerun of an already-landed wall owner"]
  },
  {
    actionItems: ["action_2_floor_impact_depth", "action_6_input_capture"],
    decision: "rejected_already_landed",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "floor.user_material_impact_dynamic_stiffness_repeat",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts",
      "packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts",
      "packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts"
    ],
    reason:
      "Dynamic-stiffness and load-basis impact-input ownership are already represented. A deeper floor-impact runtime owner remains valuable, but it should be selected by a route-specific rerank after the current opening/facade boundary gap is closed.",
    requiredPhysicalInputs: [],
    routeFamily: "floor.user_material_impact.dynamic_stiffness",
    selected: false,
    targetOutputs: IMPACT_OUTPUTS,
    unsupportedBoundaries: ["no repeat selection of the already-landed dynamic-stiffness input owner"]
  },
  {
    actionItems: ["action_3_openings_facades"],
    decision: "rejected_stale_repeat",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.gate_s_gate_ah_runtime_repeat",
    implementationEvidencePaths: [
      "packages/engine/src/dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor.ts",
      "packages/engine/src/dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter.ts"
    ],
    reason:
      "The existing opening/leak element-lab Rw/STC runtime must be preserved, but simply rerunning Gate S/Gate AH does not add the missing door/window/facade input boundary or field/building/OITC safeguards.",
    requiredPhysicalInputs: [],
    routeFamily: "opening.leak.element_lab_rw_stc",
    selected: false,
    targetOutputs: ["Rw", "STC"],
    unsupportedBoundaries: ["no field/building/OITC promotion from Gate S or Gate AH alone"]
  },
  {
    actionItems: ["action_5_calibration_holdout"],
    decision: "rejected_holdout_not_admissible",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.common_wall_same_basis_holdout_runtime_now",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts",
      "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts"
    ],
    reason:
      "The common-wall opening/leak holdout packet remains useful evidence, but the current packet rejected candidate ledgers rather than admitting a calibrated runtime move. It should not outrank a physical input-boundary owner.",
    requiredPhysicalInputs: [],
    routeFamily: "opening.leak.same_basis_holdout_packet",
    selected: false,
    targetOutputs: ["Rw", "STC"],
    unsupportedBoundaries: ["no holdout-backed runtime promotion without accepted same-basis holdouts"]
  },
  {
    actionItems: ["action_2_floor_impact_depth"],
    decision: "rejected_already_landed",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "floor.astm_iic_aiic_exact_band_input_repeat",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts",
      "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts",
      "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
    ],
    reason:
      "Exact ASTM IIC/AIIC contour and band-input behavior exists for exact evidence. The remaining arbitrary floor-impact formula depth needs a separate owner, not a repeat of exact-source behavior.",
    requiredPhysicalInputs: [],
    routeFamily: "floor.astm_iic_aiic.exact_band_input",
    selected: false,
    targetOutputs: ["IIC", "AIIC"],
    unsupportedBoundaries: ["no exact-source IIC/AIIC row reuse as arbitrary impact formula coverage"]
  },
  {
    actionItems: ["action_4_building_flanking", "action_5_calibration_holdout"],
    decision: "rejected_too_broad_for_next_owner",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "global_iso_12354_building_flanking_backbone",
    implementationEvidencePaths: [
      "docs/calculator/INDUSTRY_GRADE_CALCULATOR_GAP_ANALYSIS_AND_ROUTE_SELECTION_GUARD_2026-06-25.md",
      "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"
    ],
    reason:
      "A global building/flanking backbone is strategically correct but too broad for the next vertical owner. The selected opening/facade boundary captures missing context now and keeps later building/flanking work bounded.",
    requiredPhysicalInputs: [
      "junctionTopology",
      "flankingElementRatings",
      "roomVolumes",
      "partitionAreas",
      "reverberationOrNormalizationBasis"
    ],
    routeFamily: "building_prediction.global_flanking_backbone",
    selected: false,
    targetOutputs: FIELD_BUILDING_OUTPUTS,
    unsupportedBoundaries: ["no generic building penalty or lab-to-field copy"]
  },
  {
    actionItems: ["action_7_rerank_stop_conditions"],
    decision: "rejected_parallel_support_lane",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "broad_source_crawl_or_ui_input_polish",
    implementationEvidencePaths: [
      "docs/calculator/PUBLIC_SOURCE_MATERIAL_CATALOG_EXPANSION_HANDOFF_2026-06-23.md",
      "docs/calculator/WORKBENCH_V2_ROUTE_INPUT_VALIDATION_AND_NEEDS_INPUT_FIX_PLAN_2026-06-24.md"
    ],
    reason:
      "Catalog seeding and Workbench input polish can support calculator work, but they do not replace a route-family owner and must not be selected as the current calculator slice.",
    requiredPhysicalInputs: [],
    routeFamily: "support.parallel_non_runtime",
    selected: false,
    targetOutputs: [],
    unsupportedBoundaries: ["no support-only loop after the current rerank"]
  }
] as const satisfies readonly Candidate[];

const CURRENT_AUTHORITY_DOCS = [
  "AGENTS.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md"
] as const;

const RERANK_RECORD_DOCS = [
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC,
  "docs/calculator/INDUSTRY_GRADE_CALCULATOR_GAP_ANALYSIS_AND_ROUTE_SELECTION_GUARD_2026-06-25.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 runtime-first route-family rerank after advanced-wall current gate checkpoint", () => {
  it("lands a no-runtime rerank and selects the next bounded calculator owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(PREVIOUS_COVERAGE_ACTION).toBe(
      "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_plan"
    );
    expect(PREVIOUS_COVERAGE_STATUS).toContain("selected_runtime_first_route_family_rerank");
    expect(RERANK_STATUS).toContain("landed_no_runtime");
    expect(SELECTED_NEXT_ACTION).toBe("post_v1_opening_facade_door_window_frequency_input_boundary_owner_plan");

    expect(RERANK_COUNTERS).toMatchObject({
      candidateCount: CANDIDATES.length,
      estimatedNextCalculableRequestShapes: 0,
      estimatedNextCalculableTargetOutputs: 0,
      estimatedNextRequiredPhysicalInputsCaptured: 6,
      estimatedNextRuntimeBasisPromotions: 0,
      estimatedNextRuntimeValuesMoved: 0,
      frontendImplementationFilesTouched: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("ranks live candidates against implementation evidence instead of stale selected-next prose", () => {
    const selectedCandidates = CANDIDATES.filter((candidate) => candidate.selected);
    expect(selectedCandidates).toHaveLength(1);
    expect(selectedCandidates[0]?.id).toBe(SELECTED_CANDIDATE_ID);
    expect(selectedCandidates[0]?.selectedNextActionIfSelected).toBe(SELECTED_NEXT_ACTION);

    expect(CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "opening.facade_door_window_frequency_input_boundary_owner",
      "wall.double_leaf_framed_frequency_backbone_repeat",
      "floor.user_material_impact_dynamic_stiffness_repeat",
      "opening.gate_s_gate_ah_runtime_repeat",
      "opening.common_wall_same_basis_holdout_runtime_now",
      "floor.astm_iic_aiic_exact_band_input_repeat",
      "global_iso_12354_building_flanking_backbone",
      "broad_source_crawl_or_ui_input_polish"
    ]);

    expect(
      CANDIDATES.filter((candidate) => candidate.decision === "rejected_already_landed").map(
        (candidate) => candidate.id
      )
    ).toEqual([
      "wall.double_leaf_framed_frequency_backbone_repeat",
      "floor.user_material_impact_dynamic_stiffness_repeat",
      "floor.astm_iic_aiic_exact_band_input_repeat"
    ]);

    expect(
      CANDIDATES.find((candidate) => candidate.id === "opening.common_wall_same_basis_holdout_runtime_now")
        ?.decision
    ).toBe("rejected_holdout_not_admissible");
    expect(
      CANDIDATES.find((candidate) => candidate.id === "broad_source_crawl_or_ui_input_polish")?.decision
    ).toBe("rejected_parallel_support_lane");
  });

  it("keeps the selected owner actionable without moving runtime values in the rerank", () => {
    const selected = CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID);

    expect(selected?.routeFamily).toBe("opening.facade_door_window.frequency_input_boundary");
    expect(selected?.targetOutputs).toEqual([
      "Rw",
      "STC",
      "C",
      "Ctr",
      "R'w",
      "Dn,w",
      "Dn,A",
      "DnT,w",
      "DnT,A",
      "OITC"
    ]);
    expect(selected?.requiredPhysicalInputs).toEqual([...SELECTED_REQUIRED_INPUTS]);
    expect(selected?.unsupportedBoundaries).toEqual([...SELECTED_UNSUPPORTED_BOUNDARIES]);
    expect(selected?.estimatedNextRequiredPhysicalInputsCaptured).toBe(6);
    expect(selected?.estimatedNextRuntimeValuesMoved).toBe(0);
    expect(RERANK_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(RERANK_COUNTERS.runtimeFormulaRetunes).toBe(0);
    expect(RERANK_COUNTERS.sourceRowsImported).toBe(0);
  });

  it("ties every candidate to present implementation or authority evidence", () => {
    for (const candidate of CANDIDATES) {
      expect(candidate.implementationEvidencePaths.length).toBeGreaterThan(0);
      for (const evidencePath of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, evidencePath)), `${candidate.id}: ${evidencePath}`).toBe(true);
      }
    }
  });

  it("keeps current docs and the current gate runner synchronized after the selected owner handoff", () => {
    for (const docPath of CURRENT_AUTHORITY_DOCS) {
      const doc = readRepoFile(docPath);
      expect(doc, docPath).toContain(RERANK_ACTION);
      expect(doc, docPath).toContain(RERANK_FILE);
      expect(doc, docPath).toContain(RERANK_STATUS);
      expect(doc, docPath).toContain(SELECTED_CANDIDATE_ID);
      expect(doc, docPath).toContain(CURRENT_SELECTED_NEXT_ACTION);
      expect(doc, docPath).toContain(CURRENT_SELECTED_NEXT_FILE);
      expect(doc, docPath).toContain(CURRENT_SELECTED_NEXT_PLAN_DOC);
      expect(doc, docPath).toContain(CURRENT_SELECTED_NEXT_LABEL);
    }

    for (const docPath of RERANK_RECORD_DOCS) {
      const doc = readRepoFile(docPath);
      expect(doc, docPath).toContain(RERANK_ACTION);
      expect(doc, docPath).toContain(RERANK_FILE);
      expect(doc, docPath).toContain(RERANK_STATUS);
      expect(doc, docPath).toContain(SELECTED_CANDIDATE_ID);
      expect(doc, docPath).toContain(SELECTED_NEXT_ACTION);
      expect(doc, docPath).toContain(String(RERANK_COUNTERS.candidateCount));
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-runtime-first-route-family-rerank-after-advanced-wall-current-gate-checkpoint-contract.test.ts"
    );
  });
});

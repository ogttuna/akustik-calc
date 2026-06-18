import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ay";
import {
  GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT,
  GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK
} from "./calculator-personal-use-mvp-coverage-sprint-gate-az";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_landed_no_runtime_selected_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner";

const SELECTED_CANDIDATE_ID =
  "wall.advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall advanced-wall source-absent field/building lab-companion target-output independence owner";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 8,
  estimatedNextLabCompanionTargetOutputs: 8,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 8,
  estimatedNextUnsupportedBoundariesProtected: 7,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_closed_chain"
  | "rejected_context_or_evidence_missing"
  | "rejected_frontend_first"
  | "rejected_other_agent_conflict"
  | "rejected_too_broad"
  | "selected_runtime_owner_ready";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly runtimeOwnerAuthorizedNext: boolean;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
};

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_MIXED_OUTPUTS = [
  "R'w",
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const BUILDING_MIXED_OUTPUTS = [
  "DnT,w",
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_runtime_owner_ready",
    estimatedRuntimeValuesMoved: 8,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "Complete advanced-wall source-absent field/building contexts already publish Gate AY lab companions when a field/building output is requested, but lab-only target sets still return unsupported. The next owner should use the same Gate AY lab basis without requiring R'w or DnT,w in the target output set.",
    routeFamily: "wall.advanced_wall_source_absent.field_building_lab_companion_target_output_independence",
    runtimeOwnerAuthorizedNext: true,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: LAB_OUTPUTS
  },
  {
    decision: "rejected_closed_chain",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_closed",
    reason:
      "The previous owner already protects mixed field/building requests where lab outputs and field/building outputs are requested together.",
    routeFamily: "wall.advanced_wall_source_absent.field_building_lab_companion_basis_integrity",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: LAB_OUTPUTS
  },
  {
    decision: "rejected_closed_chain",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.advanced_wall_source_absent_field_building_adapter_owner_closed",
    reason:
      "The field/building adapter chain is already landed and refreshed for R'w, Dn,w, Dn,A, DnT,w, and DnT,A.",
    routeFamily: "wall.advanced_wall_source_absent.field_building_adapter",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: FIELD_BUILDING_OUTPUTS
  },
  {
    decision: "rejected_too_broad",
    estimatedRuntimeValuesMoved: 0,
    id: "generic_building_prediction_flanking_runtime_owner",
    reason:
      "Cross-family building/flanking work is high-value, but this rerank has a smaller owned advanced-wall gap with known values and explicit negative boundaries.",
    routeFamily: "building_prediction_flanking.generic",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: FIELD_BUILDING_OUTPUTS
  },
  {
    decision: "rejected_too_broad",
    estimatedRuntimeValuesMoved: 0,
    id: "frequency_band_backbone_oitc_owner",
    reason:
      "A frequency backbone can raise the accuracy ceiling, but OITC and cross-standard curve work need their own rating owner instead of being folded into this bounded route.",
    routeFamily: "frequency_band_backbone",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    decision: "rejected_context_or_evidence_missing",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.opening_leak_common_wall_same_basis_holdout_packet",
    reason:
      "Opening/leak and common-wall residuals need same-basis holdout evidence before runtime movement; this rerank can move already-owned advanced-wall lab companions now.",
    routeFamily: "wall.opening_leak.common_wall.building_prediction",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: true,
    targetOutputs: FIELD_BUILDING_OUTPUTS
  },
  {
    decision: "rejected_other_agent_conflict",
    estimatedRuntimeValuesMoved: 0,
    id: "layer_combination_resolver_registry_count_alignment",
    reason:
      "The worktree contains concurrent resolver/registry/matrix count changes. That gate-stability work should not displace the selected calculator runtime owner in this rerank.",
    routeFamily: "calculator_resolver_gate_stability",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: []
  },
  {
    decision: "rejected_frontend_first",
    estimatedRuntimeValuesMoved: 0,
    id: "ui_report_or_process_cleanup",
    reason:
      "UI/report work, confidence copy, broad source crawling, and generic cleanup are outside this calculator-first runtime slice.",
    routeFamily: "non_calculator",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
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
  "docs/calculator/HIGH_ROI_CALCULATOR_IMPLEMENTATION_SELECTION_PLAN_2026-06-18.md",
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function cloneGateAYAdvancedWallInput(): NonNullable<AirborneContext["advancedWall"]> {
  return {
    ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
    cavities: GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.cavities.map((cavity) => ({ ...cavity })),
    frameCoupling: { ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.frameCoupling },
    panels: GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.panels.map((panel) => ({
      ...panel,
      layerIds: [...(panel.layerIds ?? [])]
    })),
    targetOutputs: [...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.targetOutputs]
  };
}

function buildFieldContext(): AirborneContext {
  return {
    advancedWall: {
      ...cloneGateAYAdvancedWallInput(),
      outputBasis: "field_between_rooms",
      targetOutputs: [...FIELD_BUILDING_OUTPUTS]
    },
    contextMode: "field_between_rooms",
    panelHeightMm: 2800,
    panelWidthMm: 3200,
    receivingRoomRt60S: 0.6,
    receivingRoomVolumeM3: 55
  };
}

function buildBuildingContext(): AirborneContext {
  return {
    advancedWall: {
      ...cloneGateAYAdvancedWallInput(),
      outputBasis: "building_prediction",
      targetOutputs: [...FIELD_BUILDING_OUTPUTS]
    },
    buildingPredictionOutputBasis: "apparent_and_standardized",
    conservativeFlankingAssumption: "multi_path_conservative",
    contextMode: "building_prediction",
    flankingJunctionClass: "rigid_t_junction",
    junctionCouplingLengthM: 4.8,
    panelHeightMm: 2800,
    panelWidthMm: 3200,
    receivingRoomRt60S: 0.6,
    receivingRoomVolumeM3: 55,
    sourceRoomVolumeM3: 42
  };
}

function calculateAdvancedWall(
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function summarizeRerank() {
  const selected = CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID);
  if (!selected) {
    throw new Error("Rerank must select exactly one candidate.");
  }

  return {
    candidates: CANDIDATES,
    counters: RERANK_COUNTERS,
    landedGate: RERANK_ACTION,
    noRuntimeValueMovement: true,
    previousCoverageRefresh: {
      implementationFile: PREVIOUS_COVERAGE_FILE,
      planDoc: PREVIOUS_COVERAGE_PLAN_DOC,
      selectedGate: PREVIOUS_COVERAGE_ACTION,
      status: PREVIOUS_COVERAGE_STATUS
    },
    previousRuntimeOwner: {
      implementationFile: PREVIOUS_OWNER_FILE,
      planDoc: PREVIOUS_OWNER_PLAN_DOC,
      selectedGate: PREVIOUS_OWNER_ACTION,
      status: PREVIOUS_OWNER_STATUS
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

describe("post-V1 runtime-first route-family rerank after wall advanced-wall source-absent field/building lab-companion basis integrity", () => {
  it("lands the no-runtime rerank and selects the target-output independence runtime owner", () => {
    const summary = summarizeRerank();

    expect(summary).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      noRuntimeValueMovement: true,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RERANK_STATUS
    });

    for (const path of [
      PREVIOUS_OWNER_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      PREVIOUS_COVERAGE_FILE,
      PREVIOUS_COVERAGE_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("records the selected target-output dependence gap and the landed owner closure", () => {
    const lab = calculateAdvancedWall(GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT, LAB_OUTPUTS);
    const fieldMixed = calculateAdvancedWall(buildFieldContext(), FIELD_MIXED_OUTPUTS);
    const buildingMixed = calculateAdvancedWall(buildBuildingContext(), BUILDING_MIXED_OUTPUTS);
    const fieldLabOnly = calculateAdvancedWall(buildFieldContext(), LAB_OUTPUTS);
    const buildingLabOnly = calculateAdvancedWall(buildBuildingContext(), LAB_OUTPUTS);

    expect(lab.airborneBasis?.method).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD);
    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(lab.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6.4,
      estimatedRwDb: 65,
      estimatedStc: 65
    });

    expect(fieldMixed.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(fieldMixed.supportedTargetOutputs).toEqual([...FIELD_MIXED_OUTPUTS]);
    expect(fieldMixed.unsupportedTargetOutputs).toEqual([]);
    expect(fieldMixed.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6.4,
      estimatedRwDb: 65,
      estimatedRwPrimeDb: 63,
      estimatedStc: 65
    });

    expect(buildingMixed.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(buildingMixed.supportedTargetOutputs).toEqual([...BUILDING_MIXED_OUTPUTS]);
    expect(buildingMixed.unsupportedTargetOutputs).toEqual([]);
    expect(buildingMixed.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6.4,
      estimatedDnTwDb: 66,
      estimatedRwDb: 65,
      estimatedStc: 65
    });

    expect(fieldLabOnly.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(fieldLabOnly.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(fieldLabOnly.unsupportedTargetOutputs).toEqual([]);
    expect(fieldLabOnly.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6.4,
      estimatedRwDb: 65,
      estimatedStc: 65
    });

    expect(buildingLabOnly.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(buildingLabOnly.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(buildingLabOnly.unsupportedTargetOutputs).toEqual([]);
    expect(buildingLabOnly.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6.4,
      estimatedRwDb: 65,
      estimatedStc: 65
    });
  }, 30000);

  it("ranks the bounded target-output independence owner above broad or conflicted work", () => {
    const summary = summarizeRerank();
    const selected = summary.candidates.filter((candidate) => candidate.runtimeOwnerAuthorizedNext);
    const byId = new Map(summary.candidates.map((candidate) => [candidate.id, candidate]));

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(selected).toEqual([
      expect.objectContaining({
        decision: "selected_runtime_owner_ready",
        estimatedRuntimeValuesMoved: 8,
        id: SELECTED_CANDIDATE_ID,
        routeFamily: "wall.advanced_wall_source_absent.field_building_lab_companion_target_output_independence",
        sourceRowsRequiredForRuntimeSelection: false
      })
    ]);
    expect(byId.get("wall.advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_closed"))
      .toMatchObject({ decision: "rejected_closed_chain" });
    expect(byId.get("generic_building_prediction_flanking_runtime_owner")).toMatchObject({
      decision: "rejected_too_broad"
    });
    expect(byId.get("frequency_band_backbone_oitc_owner")).toMatchObject({
      decision: "rejected_too_broad"
    });
    expect(byId.get("wall.opening_leak_common_wall_same_basis_holdout_packet")).toMatchObject({
      decision: "rejected_context_or_evidence_missing",
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(byId.get("layer_combination_resolver_registry_count_alignment")).toMatchObject({
      decision: "rejected_other_agent_conflict"
    });
    expect(byId.get("ui_report_or_process_cleanup")).toMatchObject({
      decision: "rejected_frontend_first"
    });
  });

  it("keeps the rerank no-runtime while estimating the next bounded value movement", () => {
    expect(RERANK_COUNTERS).toEqual({
      candidateCount: 8,
      estimatedNextCalculableRequestShapes: 2,
      estimatedNextCalculableTargetOutputs: 8,
      estimatedNextLabCompanionTargetOutputs: 8,
      estimatedNextRuntimeBasisPromotions: 2,
      estimatedNextRuntimeValuesMoved: 8,
      estimatedNextUnsupportedBoundariesProtected: 7,
      frontendImplementationFilesTouched: 0,
      roiAnalysisIterations: 4,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("keeps active docs aligned with the selected target-output independence owner handoff", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(contents, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(contents, path).toContain(PREVIOUS_OWNER_FILE);
      expect(contents, path).toContain(PREVIOUS_OWNER_PLAN_DOC);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_FILE);
      expect(contents, path).toContain(PREVIOUS_COVERAGE_PLAN_DOC);
      expect(contents, path).toContain(RERANK_ACTION);
      expect(contents, path).toContain(RERANK_STATUS);
      expect(contents, path).toContain(RERANK_FILE);
      expect(contents, path).toContain(RERANK_PLAN_DOC);
      expect(contents, path).toContain(SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(contents, path).toContain(SELECTED_NEXT_LABEL);
      expect(contents, path).toContain("candidateCount: 8");
      expect(contents, path).toContain("roiAnalysisIterations: 4");
      expect(contents, path).toContain("estimatedNextRuntimeValuesMoved: 8");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("runtimeFormulaRetunes: 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});

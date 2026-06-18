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
import {
  POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_WARNING,
  POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING
} from "./advanced-wall-source-absent-field-building-adapter";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_landed_no_runtime_selected_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner";

const SELECTED_CANDIDATE_ID =
  "wall.advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall advanced-wall source-absent field/building lab-companion basis integrity owner";

const HIGH_ROI_SELECTION_PLAN_DOC =
  "docs/calculator/HIGH_ROI_CALCULATOR_IMPLEMENTATION_SELECTION_PLAN_2026-06-18.md";

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
  readonly id: string;
  readonly reason: string;
  readonly requiredInputsOrEvidence: readonly string[];
  readonly routeFamily: string;
  readonly runtimeOwnerAuthorizedNext: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
};

const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
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

const CANDIDATES = [
  {
    decision: "selected_runtime_owner_ready",
    id: SELECTED_CANDIDATE_ID,
    reason:
      "The field/building adapter owner is landed and already has the same complete Gate AY advanced-wall direct curve in hand, but mixed field/building requests still park lab Rw/STC/C/Ctr. The next bounded owner should publish those lab companions from the Gate AY lab basis while keeping R'w/DnT,w on Gate I / Gate AR, instead of aliasing field-adapted STC/C/Ctr values.",
    requiredInputsOrEvidence: [
      "advancedWall.wallSolverIntent=advanced_source_absent_wall",
      "GateAYAdvancedWallDirectTransmissionLossCurve",
      "GateAYLabBasisForRwStcCCtr",
      "GateI_or_GateAR_field_building_adapter_owner",
      "perOutputBasisIntegrityForMixedFieldLabRequests",
      "fieldContext.contextMode_or_buildingPredictionContext",
      "negativeAliasBoundaryForFieldAdaptedSTC_C_Ctr"
    ],
    routeFamily: "wall.advanced_wall_source_absent.field_building_lab_companion_basis_integrity",
    runtimeOwnerAuthorizedNext: true,
    targetOutputs: LAB_OUTPUTS
  },
  {
    decision: "rejected_closed_chain",
    id: "wall.advanced_wall_source_absent_field_building_adapter_owner",
    reason:
      "The previous owner and refresh already opened complete advanced-wall source-absent R'w/Dn,w/Dn,A/DnT,w/DnT,A for explicit field/building contexts. Re-selecting it would loop on a closed chain.",
    requiredInputsOrEvidence: [
      "previousOwnerGreen",
      "previousCoverageRefreshGreen",
      "GateI_GateARFieldBuildingValuesFrozen"
    ],
    routeFamily: "wall.advanced_wall_source_absent.field_building_adapter",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: FIELD_BUILDING_OUTPUTS
  },
  {
    decision: "rejected_too_broad",
    id: "generic_frequency_band_backbone_oitc_owner",
    reason:
      "OITC and a broad frequency-band backbone remain high-value, but they need a separate rating-standard owner. This rerank has a smaller live gap with owned Rw/STC/C/Ctr companions.",
    requiredInputsOrEvidence: [
      "ownedOitcRatingAdapter",
      "standardSpecificCurveBasis",
      "crossFamilyNegativeAliasTests"
    ],
    routeFamily: "frequency_band_backbone",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    decision: "rejected_context_or_evidence_missing",
    id: "wall.opening_leak_common_wall_same_basis_holdout_packet",
    reason:
      "Opening/leak and common-wall residuals are still important, but runtime movement needs same-family, same-basis holdout evidence. The advanced-wall lab companion gap can move calculator values now without a source crawl.",
    requiredInputsOrEvidence: [
      "same_basis_opening_holdout",
      "same_basis_common_wall_holdout",
      "rights_safe_source_packet"
    ],
    routeFamily: "wall.opening_leak.common_wall.building_prediction",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
  },
  {
    decision: "rejected_other_agent_conflict",
    id: "layer_combination_resolver_registry_count_alignment",
    reason:
      "The current worktree has concurrent resolver/registry/matrix edits and failing count assertions from another slice. That may be a gate-stability task, but it is not the selected calculator runtime owner for this rerank.",
    requiredInputsOrEvidence: [
      "resolverRegistryOwnershipClear",
      "matrixCountDiffScopedToOneAgent",
      "fullGateAfterConcurrentChanges"
    ],
    routeFamily: "calculator_resolver_gate_stability",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: []
  },
  {
    decision: "rejected_too_broad",
    id: "generic_building_prediction_flanking_runtime_owner",
    reason:
      "Generic building/flanking runtime across all airborne families is too large for this selected next. The chosen owner stays inside one already-owned advanced-wall route and preserves basis separation.",
    requiredInputsOrEvidence: [
      "crossFamilyDirectCurveInventory",
      "junctionCatalog",
      "flankingPathSet",
      "perFamilyBasisNegativeTests"
    ],
    routeFamily: "building_prediction_flanking.generic",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
  },
  {
    decision: "rejected_context_or_evidence_missing",
    id: "advanced_wall_source_absent_calibration_holdout_packet",
    reason:
      "Calibration could tighten the Gate AY error budget, but no new rights-safe same-family holdout is attached to this rerank. Runtime companion publication can proceed from already-owned formulas.",
    requiredInputsOrEvidence: [
      "rightsSafeAdvancedWallRows",
      "sameFamilySameBasisHoldout",
      "beforeAfterErrorBudget"
    ],
    routeFamily: "calibration_holdout.advanced_wall",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: []
  },
  {
    decision: "rejected_frontend_first",
    id: "broad_ui_report_source_or_cleanup_work",
    reason:
      "UI/report work, confidence copy, broad source crawling, and generic cleanup do not improve calculator route ownership or numeric accuracy in this selected slice.",
    requiredInputsOrEvidence: [],
    routeFamily: "non_calculator",
    runtimeOwnerAuthorizedNext: false,
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

describe("post-V1 runtime-first route-family rerank after wall advanced-wall source-absent field/building adapter coverage refresh", () => {
  it("lands a no-runtime rerank and selects the bounded lab-companion basis-integrity owner", () => {
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

    expect(existsSync(join(REPO_ROOT, PREVIOUS_OWNER_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_OWNER_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);
  });

  it("records the selected mixed-output gap and the landed owner closure", () => {
    const lab = calculateAdvancedWall(GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT, LAB_OUTPUTS);
    const fieldMixed = calculateAdvancedWall(buildFieldContext(), FIELD_MIXED_OUTPUTS);
    const buildingMixed = calculateAdvancedWall(buildBuildingContext(), BUILDING_MIXED_OUTPUTS);

    expect(lab.airborneBasis?.method).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD);
    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6.4,
      estimatedRwDb: 65,
      estimatedStc: 65
    });

    expect(fieldMixed.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(fieldMixed.supportedTargetOutputs).toEqual([...FIELD_MIXED_OUTPUTS]);
    expect(fieldMixed.unsupportedTargetOutputs).toEqual([]);
    expect(fieldMixed.metrics.estimatedRwPrimeDb).toBe(63);
    expect(fieldMixed.metrics.estimatedRwDb).toBe(65);
    expect(fieldMixed.metrics.estimatedStc).toBe(65);
    expect(fieldMixed.metrics.estimatedCDb).toBe(-1.1);
    expect(fieldMixed.metrics.estimatedCtrDb).toBe(-6.4);
    expect(fieldMixed.warnings).toContain(
      POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING
    );
    expect(fieldMixed.warnings).toContain(
      POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_WARNING
    );

    expect(buildingMixed.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(buildingMixed.supportedTargetOutputs).toEqual([...BUILDING_MIXED_OUTPUTS]);
    expect(buildingMixed.unsupportedTargetOutputs).toEqual([]);
    expect(buildingMixed.metrics.estimatedDnTwDb).toBe(66);
    expect(buildingMixed.metrics.estimatedRwDb).toBe(65);
    expect(buildingMixed.metrics.estimatedStc).toBe(65);
    expect(buildingMixed.metrics.estimatedCDb).toBe(-1.1);
    expect(buildingMixed.metrics.estimatedCtrDb).toBe(-6.4);
    expect(buildingMixed.warnings).toContain(
      POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING
    );
    expect(buildingMixed.warnings).toContain(
      POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_WARNING
    );
  }, 30000);

  it("subtracts closed chains and rejects broad, conflicted, or non-calculator work", () => {
    const summary = summarizeRerank();
    const selected = summary.candidates.filter((candidate) => candidate.runtimeOwnerAuthorizedNext);
    const byId = new Map(summary.candidates.map((candidate) => [candidate.id, candidate]));

    expect(summary.candidates).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(selected).toHaveLength(1);
    expect(selected[0]).toMatchObject({
      decision: "selected_runtime_owner_ready",
      id: SELECTED_CANDIDATE_ID,
      routeFamily: "wall.advanced_wall_source_absent.field_building_lab_companion_basis_integrity",
      targetOutputs: [...LAB_OUTPUTS]
    });
    expect(byId.get("wall.advanced_wall_source_absent_field_building_adapter_owner")).toMatchObject({
      decision: "rejected_closed_chain",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("generic_frequency_band_backbone_oitc_owner")).toMatchObject({
      decision: "rejected_too_broad",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("layer_combination_resolver_registry_count_alignment")).toMatchObject({
      decision: "rejected_other_agent_conflict",
      runtimeOwnerAuthorizedNext: false
    });
    expect(byId.get("broad_ui_report_source_or_cleanup_work")).toMatchObject({
      decision: "rejected_frontend_first",
      runtimeOwnerAuthorizedNext: false
    });
  });

  it("keeps the rerank no-runtime while estimating the next bounded value movement", () => {
    const summary = summarizeRerank();

    expect(summary.counters).toMatchObject({
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
    expect(summary.selectedCandidate.requiredInputsOrEvidence).toEqual([
      "advancedWall.wallSolverIntent=advanced_source_absent_wall",
      "GateAYAdvancedWallDirectTransmissionLossCurve",
      "GateAYLabBasisForRwStcCCtr",
      "GateI_or_GateAR_field_building_adapter_owner",
      "perOutputBasisIntegrityForMixedFieldLabRequests",
      "fieldContext.contextMode_or_buildingPredictionContext",
      "negativeAliasBoundaryForFieldAdaptedSTC_C_Ctr"
    ]);
  });

  it("keeps active docs aligned with the selected lab-companion owner handoff", () => {
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

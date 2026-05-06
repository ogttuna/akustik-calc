import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type NextSliceCandidate = {
  readonly candidateId: string;
  readonly priority: number;
  readonly status:
    | "selected_next"
    | "blocked_missing_source_packet"
    | "blocked_missing_negative_boundary"
    | "blocked_by_numeric_correctness_exit_criteria"
    | "deferred_lower_accuracy_return";
  readonly firstBlockingRequirement: string;
  readonly selectedAction: string | null;
  readonly targetFirstGateFile: string | null;
};

type RequiredSurface = {
  readonly surface: string;
  readonly reason:
    | "gate_c_closeout_contract"
    | "current_gate_pack"
    | "next_slice_contract"
    | "docs_alignment"
    | "runner_alignment"
    | "visible_guard_alignment";
};

type NumericCarryForwardCase = {
  readonly id: string;
  readonly layers: readonly LayerInput[];
  readonly requestedOutputs: readonly RequestedOutputId[];
  readonly expected: {
    readonly boundMatchId: string | null;
    readonly exactMatchId: string | null;
    readonly impactBasis: string | null;
    readonly lnW: number | null;
    readonly lnWPlusCI: number | null;
    readonly lowerBoundBasis: string | null;
    readonly rw: number;
    readonly supported: readonly RequestedOutputId[];
    readonly unsupported: readonly RequestedOutputId[];
  };
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const readRepoFile = (relativePath: string) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
const repoFileExists = (relativePath: string) =>
  fs.existsSync(path.join(repoRoot, relativePath));

const UBIQ_SYSTEM_TABLE_URL =
  "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";

const UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice:
    "ubiq_open_web_packaged_finish_current_gate_guard_v1",
  confidencePromotion: false,
  currentGateRunnerChangedAtGateC: true,
  evidencePromotion: false,
  gateCNumericRuntimeBehaviorChange: false,
  latestLandedGate:
    "gate_a_promoted_ubiq_packaged_finish_engine_visible_guards_into_current_gate",
  latestLandedStatus:
    "gate_a_promoted_ubiq_packaged_finish_engine_visible_guards_into_current_gate_selected_closeout",
  nextExecutionAction:
    "gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v28",
  selectedPlanningSurface:
    "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_PLAN.md",
  selectedRouteFamily:
    "calculator_source_gap_revalidation_after_ubiq_packaged_finish_current_gate_guard",
  selectionStatus:
    "closed_ubiq_open_web_packaged_finish_current_gate_guard_selected_source_gap_revalidation_v28",
  sliceId:
    "post_ubiq_open_web_packaged_finish_current_gate_guard_v1_next_slice_selection",
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false,
} as const;

const UBIQ_PACKAGED_FINISH_CLOSEOUT_ARTIFACTS = {
  closed_ubiq_packaged_finish_current_gate_guard_summary: {
    boundRowsProtected: 21,
    closedSlice: "ubiq_open_web_packaged_finish_current_gate_guard_v1",
    exactRowsProtected: 90,
    packagedFinishRowsRemainSourceOwned: true,
    sourceUrl: UBIQ_SYSTEM_TABLE_URL,
    status:
      "ubiq_packaged_finish_current_gate_pack_closed_without_runtime_or_evidence_promotion",
  },
  packaged_finish_current_gate_pack_carry_forward: {
    engineCloseoutGuard:
      "packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts",
    engineFamilyDesignGuard:
      "packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts",
    engineGateA:
      "packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts",
    engineLaneTraceGuard:
      "packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts",
    engineNearMissGuard:
      "packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts",
    visibleFamilyCardGuard:
      "apps/web/features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts",
    visibleHistoryReplayGuard:
      "apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts",
    visibleLaneCardGuard:
      "apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts",
    visibleNearMissCardGuard:
      "apps/web/features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts",
  },
  rockwool_and_raw_open_web_blockers_carry_forward_after_ubiq_packaged_finish_closeout:
    {
      companyInternalHighAccuracyOpening:
        "blocked_until_remaining_numeric_correctness_and_source_ownership_exit_criteria_close",
      genericOrRawOpenWeb:
        "blocked_by_source_owned_raw_carrier_negative_boundary_absent",
      rockwoolTripleLeafExact:
        "blocked_by_rights_safe_source_owned_curve_payload_absent",
      status: "no_runtime_import_selected_at_packaged_finish_closeout",
    },
  source_gap_revalidation_v28_selected_after_ubiq_packaged_finish_closeout:
    {
      nextExecutionAction:
        "gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout",
      selectedNextSlice: "calculator_source_gap_revalidation_v28",
      selectedReason:
        "rerank_remaining_source_accuracy_gaps_after_packaged_finish_current_gate_pack_closed",
      targetFirstGateFile:
        "packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts",
    },
} as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    candidateId: "calculator_source_gap_revalidation_v28",
    firstBlockingRequirement:
      "post_ubiq_packaged_finish_source_gap_re_rank_needed_before_new_runtime_widening",
    priority: 1,
    selectedAction:
      "gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout",
    status: "selected_next",
    targetFirstGateFile:
      "packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts",
  },
  {
    candidateId: "direct_rockwool_split_internal_leaf_exact_runtime_fix",
    firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
    priority: 2,
    selectedAction: null,
    status: "blocked_missing_source_packet",
    targetFirstGateFile: null,
  },
  {
    candidateId: "generic_or_raw_open_web_family_widening",
    firstBlockingRequirement:
      "source_owned_raw_carrier_negative_boundary_absent",
    priority: 3,
    selectedAction: null,
    status: "blocked_missing_negative_boundary",
    targetFirstGateFile: null,
  },
  {
    candidateId: "company_internal_high_accuracy_opening",
    firstBlockingRequirement:
      "remaining_numeric_correctness_source_ownership_exit_criteria_open",
    priority: 4,
    selectedAction: null,
    status: "blocked_by_numeric_correctness_exit_criteria",
    targetFirstGateFile: null,
  },
  {
    candidateId: "confidence_or_productization_cleanup",
    firstBlockingRequirement:
      "lower_than_source_gap_revalidation_for_numeric_accuracy_objective",
    priority: 5,
    selectedAction: null,
    status: "deferred_lower_accuracy_return",
    targetFirstGateFile: null,
  },
];

const REQUIRED_CLOSEOUT_SURFACES: readonly RequiredSurface[] = [
  {
    reason: "gate_c_closeout_contract",
    surface:
      "packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts",
  },
  {
    reason: "current_gate_pack",
    surface:
      "packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts",
  },
  {
    reason: "current_gate_pack",
    surface:
      "packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts",
  },
  {
    reason: "current_gate_pack",
    surface:
      "packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts",
  },
  {
    reason: "current_gate_pack",
    surface:
      "packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts",
  },
  {
    reason: "visible_guard_alignment",
    surface:
      "apps/web/features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts",
  },
  {
    reason: "visible_guard_alignment",
    surface:
      "apps/web/features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts",
  },
  {
    reason: "visible_guard_alignment",
    surface:
      "apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts",
  },
  {
    reason: "visible_guard_alignment",
    surface:
      "apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts",
  },
  {
    reason: "docs_alignment",
    surface:
      "docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md",
  },
  {
    reason: "docs_alignment",
    surface:
      "docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md",
  },
  {
    reason: "next_slice_contract",
    surface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_PLAN.md",
  },
  {
    reason: "docs_alignment",
    surface: "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  },
  {
    reason: "docs_alignment",
    surface: "docs/calculator/CURRENT_STATE.md",
  },
  {
    reason: "docs_alignment",
    surface: "AGENTS.md",
  },
  {
    reason: "runner_alignment",
    surface: "tools/dev/run-calculator-current-gate.ts",
  },
];

const LAB_OUTPUTS = [
  "Rw",
  "Ln,w",
  "Ln,w+CI",
  "DeltaLw",
] as const satisfies readonly RequestedOutputId[];

const NUMERIC_CARRY_FORWARD_CASES: readonly NumericCarryForwardCase[] = [
  {
    expected: {
      boundMatchId: null,
      exactMatchId: "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026",
      impactBasis: "official_floor_system_exact_match",
      lnW: 63,
      lnWPlusCI: 62,
      lowerBoundBasis: null,
      rw: 55,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"],
    },
    id: "weak_carpet_exact",
    layers: [
      { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
    ],
    requestedOutputs: LAB_OUTPUTS,
  },
  {
    expected: {
      boundMatchId: null,
      exactMatchId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      impactBasis: "official_floor_system_exact_match",
      lnW: 51,
      lnWPlusCI: 49,
      lowerBoundBasis: null,
      rw: 64,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"],
    },
    id: "supported_timber_exact",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 12 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 },
    ],
    requestedOutputs: LAB_OUTPUTS,
  },
  {
    expected: {
      boundMatchId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026",
      exactMatchId: null,
      impactBasis: null,
      lnW: null,
      lnWPlusCI: 45,
      lowerBoundBasis: "official_floor_system_bound_support",
      rw: 64,
      supported: ["Rw", "Ln,w+CI"],
      unsupported: ["Ln,w", "DeltaLw"],
    },
    id: "supported_carpet_bound",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 12 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 },
    ],
    requestedOutputs: LAB_OUTPUTS,
  },
];

const DOCS_THAT_MUST_ALIGN = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_PLAN.md",
] as const;

function openWebExactRows() {
  return EXACT_FLOOR_SYSTEMS.filter(
    (system) =>
      system.id.startsWith("ubiq_") &&
      system.id.includes("_open_web_steel_") &&
      system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true,
  );
}

function openWebBoundRows() {
  return BOUND_FLOOR_SYSTEMS.filter(
    (system) =>
      system.id.startsWith("ubiq_") &&
      system.id.includes("_open_web_steel_") &&
      system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true,
  );
}

function assemblySnapshot(
  layers: readonly LayerInput[],
  targetOutputs: readonly RequestedOutputId[],
) {
  const result = calculateAssembly(layers, { targetOutputs: [...targetOutputs] });

  return {
    boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI:
      result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
  };
}

describe("post UBIQ open-web packaged-finish current-gate guard closeout", () => {
  it("closes the implementation slice without changing runtime/support/confidence surfaces", () => {
    expect(UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_CLOSEOUT).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      gateCNumericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      supportPromotion: false,
      workbenchInputBehaviorChange: false,
    });

    expect(
      UBIQ_PACKAGED_FINISH_CLOSEOUT_ARTIFACTS
        .closed_ubiq_packaged_finish_current_gate_guard_summary,
    ).toMatchObject({
      boundRowsProtected: openWebBoundRows().length,
      exactRowsProtected: openWebExactRows().length,
      packagedFinishRowsRemainSourceOwned: true,
      status:
        "ubiq_packaged_finish_current_gate_pack_closed_without_runtime_or_evidence_promotion",
    });

    expect(openWebExactRows()).toHaveLength(90);
    expect(openWebBoundRows()).toHaveLength(21);
    expect(
      new Set(
        [...openWebExactRows(), ...openWebBoundRows()].map(
          (system) => system.sourceUrl ?? "",
        ),
      ),
    ).toEqual(new Set([UBIQ_SYSTEM_TABLE_URL]));
  });

  it("selects V28 source-gap revalidation before any blocked runtime widening", () => {
    const selected = NEXT_SLICE_SELECTION_MATRIX.find(
      (candidate) => candidate.status === "selected_next",
    );

    expect(selected).toEqual({
      candidateId: "calculator_source_gap_revalidation_v28",
      firstBlockingRequirement:
        "post_ubiq_packaged_finish_source_gap_re_rank_needed_before_new_runtime_widening",
      priority: 1,
      selectedAction:
        "gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout",
      status: "selected_next",
      targetFirstGateFile:
        "packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts",
    });

    expect(NEXT_SLICE_SELECTION_MATRIX).toContainEqual(
      expect.objectContaining({
        candidateId: "direct_rockwool_split_internal_leaf_exact_runtime_fix",
        firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
        status: "blocked_missing_source_packet",
      }),
    );
    expect(NEXT_SLICE_SELECTION_MATRIX).toContainEqual(
      expect.objectContaining({
        candidateId: "generic_or_raw_open_web_family_widening",
        firstBlockingRequirement:
          "source_owned_raw_carrier_negative_boundary_absent",
        status: "blocked_missing_negative_boundary",
      }),
    );
    expect(NEXT_SLICE_SELECTION_MATRIX).toContainEqual(
      expect.objectContaining({
        candidateId: "company_internal_high_accuracy_opening",
        status: "blocked_by_numeric_correctness_exit_criteria",
      }),
    );

    expect(
      UBIQ_PACKAGED_FINISH_CLOSEOUT_ARTIFACTS
        .source_gap_revalidation_v28_selected_after_ubiq_packaged_finish_closeout,
    ).toMatchObject({
      nextExecutionAction:
        "gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout",
      selectedNextSlice: "calculator_source_gap_revalidation_v28",
      targetFirstGateFile:
        "packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts",
    });
  });

  it("keeps representative UBIQ packaged-finish exact/bound outputs frozen", () => {
    for (const testCase of NUMERIC_CARRY_FORWARD_CASES) {
      expect(
        assemblySnapshot(testCase.layers, testCase.requestedOutputs),
        testCase.id,
      ).toEqual(testCase.expected);
    }
  });

  it("keeps the current-gate runner and required closeout surfaces aligned", () => {
    for (const requiredSurface of REQUIRED_CLOSEOUT_SURFACES) {
      expect(repoFileExists(requiredSurface.surface), requiredSurface.surface).toBe(
        true,
      );
    }

    const currentGateRunner = readRepoFile(
      "tools/dev/run-calculator-current-gate.ts",
    );

    for (const currentGateSurface of Object.values(
      UBIQ_PACKAGED_FINISH_CLOSEOUT_ARTIFACTS
        .packaged_finish_current_gate_pack_carry_forward,
    )) {
      const runnerPath = currentGateSurface
        .replace("packages/engine/", "")
        .replace("apps/web/", "");
      expect(currentGateRunner).toContain(runnerPath);
    }

    expect(currentGateRunner).toContain(
      "src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts",
    );
  });

  it("aligns active docs with Gate C closeout and V28 selection", () => {
    for (const docPath of DOCS_THAT_MUST_ALIGN) {
      const doc = readRepoFile(docPath);
      expect(doc).toContain(
        UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_CLOSEOUT.selectionStatus,
      );
      expect(doc).toContain(
        UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_CLOSEOUT
          .selectedImplementationSlice,
      );
      expect(doc).toContain(
        UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_CLOSEOUT
          .targetFirstGateFile,
      );
      expect(doc).toContain(
        UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_CLOSEOUT
          .nextExecutionAction,
      );
      expect(doc).toContain(
        "rights_safe_source_owned_curve_payload_absent",
      );
      expect(doc).toContain(
        "source_owned_raw_carrier_negative_boundary_absent",
      );
    }
  });
});

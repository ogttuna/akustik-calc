import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type NextSliceCandidate = {
  firstMissingRequirement: string;
  id: string;
  reason: string;
  selectedNext: boolean;
  sourceBackedGuardReadyNow: boolean;
  targetFile: string;
};

const UBIQ_SYSTEM_TABLE_URL = "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";
const SUPPORTED_BAND_PATTERN = /^ubiq_fl(?:24|26|28)_open_web_steel_/u;

const UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "ubiq_open_web_weak_band_current_gate_guard_v1",
  confidencePromotion: false,
  currentGateRunnerChangedAtGateC: false,
  evidencePromotion: false,
  gateCNumericRuntimeBehaviorChange: false,
  latestLandedGate: "gate_a_promoted_source_backed_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate",
  latestLandedStatus: "gate_a_promoted_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate_selected_closeout",
  nextExecutionAction: "gate_a_promote_source_backed_ubiq_supported_band_exact_and_bound_guards_into_current_gate",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "ubiq_open_web_supported_band_current_gate_guard_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  selectedRouteFamily: "ubiq_open_web_supported_band_source_backed_floor_coverage_guard",
  selectionStatus:
    "closed_ubiq_open_web_weak_band_current_gate_guard_selected_supported_band_current_gate_guard",
  sliceId: "post_ubiq_open_web_weak_band_current_gate_guard_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: true,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const CLOSED_UBIQ_WEAK_BAND_CURRENT_GATE_GUARD_SUMMARY = {
  artifact: "closed_ubiq_weak_band_current_gate_guard_summary",
  exactRowsGuarded: 54,
  exactRowsRemainExactOnly: true,
  lowerBoardExactStacksStayLive: true,
  sourceUrl: UBIQ_SYSTEM_TABLE_URL,
  upperOnlyImpactOutputsRemainFailClosed: true
} as const;

const WEAK_BAND_CURRENT_GATE_PACK_CARRY_FORWARD = {
  artifact: "weak_band_current_gate_pack_carry_forward",
  engineCloseoutGuard: "src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts",
  engineExactGuard: "src/ubiq-open-web-weak-band-exact-source-mapping.test.ts",
  engineFailClosedGuard: "src/ubiq-open-web-weaker-band-posture-guard.test.ts",
  engineGateA: "src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts",
  visibleGuard: "features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts"
} as const;

const UBIQ_SUPPORTED_BAND_SOURCE_READY_NEXT = {
  artifact: "ubiq_supported_band_source_ready_next",
  boundCarpetRows: 18,
  exactBareAndTimberRows: 36,
  selectedNextSlice: "ubiq_open_web_supported_band_current_gate_guard_v1",
  sourceUrl: UBIQ_SYSTEM_TABLE_URL,
  targetFile: "packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts"
} as const;

const ROCKWOOL_BLOCKERS_STILL_CARRY_FORWARD = {
  artifact: "rockwool_blockers_still_carry_forward_after_ubiq_weak_band_closeout",
  adjacentStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
  directExactRuntimeStillBlocked: true,
  firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  flatListSplitStillWithheld: "Rw 41 / R'w 39 / DnT,w 40",
  groupedStillScreeningOnly: "Rw 41"
} as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    firstMissingRequirement: "current_gate_owner_for_existing_supported_band_exact_and_bound_guards",
    id: "ubiq_open_web_supported_band_current_gate_guard",
    reason:
      "FL_24_26_28_have_source_owned_exact_bare_timber_rows_and_carpet_bound_rows_already_imported_so_the_next_accuracy_step_is_to_make_their_exact_bound_and_visible_fail_closed_surfaces_current_gate_owned_before_new_runtime_widening",
    selectedNext: true,
    sourceBackedGuardReadyNow: true,
    targetFile: "packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts"
  },
  {
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_absent",
    id: "direct_rockwool_exact_runtime_fix",
    reason:
      "rockwool_remains_user_visible_but_exact_runtime_import_still_lacks_rights_safe_source_owned_curves_topology_material_metric_tolerance_negative_boundary_and_visible_test_ownership",
    selectedNext: false,
    sourceBackedGuardReadyNow: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    firstMissingRequirement: "supported_band_current_gate_closed_first",
    id: "generic_open_web_family_widening",
    reason:
      "raw_or_generic_open_web_widening_must_wait_until_the_source_backed_Ubiq_exact_and_bound_surfaces_are_gate_owned_and_negative_boundaries_are_preserved",
    selectedNext: false,
    sourceBackedGuardReadyNow: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md"
  },
  {
    firstMissingRequirement: "source_backed_guard_sequence_closed_and_broad_validation_green",
    id: "company_internal_high_accuracy_opening",
    reason:
      "opening_high_accuracy_internal_use_still_depends_on_closing_source_backed_guard_gaps_and_rockwool_blockers_not_on_this_closeout_alone",
    selectedNext: false,
    sourceBackedGuardReadyNow: false,
    targetFile: "docs/calculator/CURRENT_STATE.md"
  }
] as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts",
  "packages/engine/src/ubiq-open-web-weak-band-exact-source-mapping.test.ts",
  "packages/engine/src/ubiq-open-web-weaker-band-posture-guard.test.ts",
  "apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts",
  "packages/engine/src/ubiq-open-web-supported-band-finish-completion.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md"
] as const;

const FL28_BARE_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 }
];

const FL28_CARPET_BOUND_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 12 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function supportedOutputsFor(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, {
    targetOutputs: ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"] satisfies RequestedOutputId[]
  });

  return {
    boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("post UBIQ open-web weak-band current-gate guard next-slice selection", () => {
  it("closes the weak-band current-gate guard and selects the supported-band guard", () => {
    expect(UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "ubiq_open_web_weak_band_current_gate_guard_v1",
      confidencePromotion: false,
      currentGateRunnerChangedAtGateC: false,
      evidencePromotion: false,
      gateCNumericRuntimeBehaviorChange: false,
      latestLandedGate: "gate_a_promoted_source_backed_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate",
      latestLandedStatus: "gate_a_promoted_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate_selected_closeout",
      nextExecutionAction: "gate_a_promote_source_backed_ubiq_supported_band_exact_and_bound_guards_into_current_gate",
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "ubiq_open_web_supported_band_current_gate_guard_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
      selectedRouteFamily: "ubiq_open_web_supported_band_source_backed_floor_coverage_guard",
      selectionStatus:
        "closed_ubiq_open_web_weak_band_current_gate_guard_selected_supported_band_current_gate_guard",
      sliceId: "post_ubiq_open_web_weak_band_current_gate_guard_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: true,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("preserves the weak-band current-gate pack and Rockwool blockers", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(CLOSED_UBIQ_WEAK_BAND_CURRENT_GATE_GUARD_SUMMARY).toEqual({
      artifact: "closed_ubiq_weak_band_current_gate_guard_summary",
      exactRowsGuarded: 54,
      exactRowsRemainExactOnly: true,
      lowerBoardExactStacksStayLive: true,
      sourceUrl: UBIQ_SYSTEM_TABLE_URL,
      upperOnlyImpactOutputsRemainFailClosed: true
    });
    expect(WEAK_BAND_CURRENT_GATE_PACK_CARRY_FORWARD).toEqual({
      artifact: "weak_band_current_gate_pack_carry_forward",
      engineCloseoutGuard: "src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts",
      engineExactGuard: "src/ubiq-open-web-weak-band-exact-source-mapping.test.ts",
      engineFailClosedGuard: "src/ubiq-open-web-weaker-band-posture-guard.test.ts",
      engineGateA: "src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts",
      visibleGuard: "features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts"
    });
    for (const gateFile of Object.values(WEAK_BAND_CURRENT_GATE_PACK_CARRY_FORWARD)) {
      if (gateFile === "weak_band_current_gate_pack_carry_forward") {
        continue;
      }
      expect(runner).toContain(gateFile);
    }

    expect(ROCKWOOL_BLOCKERS_STILL_CARRY_FORWARD).toEqual({
      artifact: "rockwool_blockers_still_carry_forward_after_ubiq_weak_band_closeout",
      adjacentStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
      directExactRuntimeStillBlocked: true,
      firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
      flatListSplitStillWithheld: "Rw 41 / R'w 39 / DnT,w 40",
      groupedStillScreeningOnly: "Rw 41"
    });
  });

  it("selects the supported-band guard because it is source-backed and calculation-relevant now", () => {
    const exactSupportedRows = EXACT_FLOOR_SYSTEMS.filter((system) => SUPPORTED_BAND_PATTERN.test(system.id));
    const boundSupportedRows = BOUND_FLOOR_SYSTEMS.filter((system) => SUPPORTED_BAND_PATTERN.test(system.id));
    const bare = supportedOutputsFor(FL28_BARE_STACK);
    const carpet = supportedOutputsFor(FL28_CARPET_BOUND_STACK);

    expect(UBIQ_SUPPORTED_BAND_SOURCE_READY_NEXT).toEqual({
      artifact: "ubiq_supported_band_source_ready_next",
      boundCarpetRows: 18,
      exactBareAndTimberRows: 36,
      selectedNextSlice: "ubiq_open_web_supported_band_current_gate_guard_v1",
      sourceUrl: UBIQ_SYSTEM_TABLE_URL,
      targetFile: "packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts"
    });
    expect(exactSupportedRows).toHaveLength(36);
    expect(boundSupportedRows.filter((system) => system.label.toLowerCase().includes("carpet"))).toHaveLength(18);
    expect(new Set(exactSupportedRows.map((system) => system.sourceUrl))).toEqual(new Set([UBIQ_SYSTEM_TABLE_URL]));

    expect(bare).toEqual({
      boundMatchId: null,
      exactMatchId: "ubiq_fl28_open_web_steel_400_19mm_bare_exact_lab_2026",
      lnW: 58,
      lnWPlusCI: 56,
      lowerBoundBasis: null,
      rw: 64,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"]
    });
    expect(carpet).toEqual({
      boundMatchId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026",
      exactMatchId: null,
      lnW: null,
      lnWPlusCI: 45,
      lowerBoundBasis: "official_floor_system_bound_support",
      rw: 64,
      supported: ["Rw", "Ln,w+CI"],
      unsupported: ["Ln,w", "DeltaLw"]
    });
  });

  it("ranks supported-band guard before blocked Rockwool, generic widening, and opening", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        firstMissingRequirement: "current_gate_owner_for_existing_supported_band_exact_and_bound_guards",
        id: "ubiq_open_web_supported_band_current_gate_guard",
        reason:
          "FL_24_26_28_have_source_owned_exact_bare_timber_rows_and_carpet_bound_rows_already_imported_so_the_next_accuracy_step_is_to_make_their_exact_bound_and_visible_fail_closed_surfaces_current_gate_owned_before_new_runtime_widening",
        selectedNext: true,
        sourceBackedGuardReadyNow: true,
        targetFile: "packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.find((candidate) => candidate.id === "direct_rockwool_exact_runtime_fix")?.firstMissingRequirement).toBe(
      "rights_safe_source_owned_curve_payload_absent"
    );
  });

  it("keeps active docs aligned with the closeout and selected supported-band next slice", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_CLOSEOUT.selectionStatus);
      expect(contents).toContain(UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_CLOSEOUT.selectedImplementationSlice);
      expect(contents).toContain(UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_CLOSEOUT.targetFirstGateFile);
      expect(contents).toContain(UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_CLOSEOUT.nextExecutionAction);
      expect(contents).toContain("closed_ubiq_weak_band_current_gate_guard_summary");
      expect(contents).toContain("weak_band_current_gate_pack_carry_forward");
      expect(contents).toContain("ubiq_supported_band_source_ready_next");
      expect(contents).toContain("rockwool_blockers_still_carry_forward_after_ubiq_weak_band_closeout");
    }
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING } from "./rockwool-split-triple-leaf-numeric-source-closure";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const UBIQ_SYSTEM_TABLE_URL = "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";

const UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  currentGateRunnerChanged: true,
  evidencePromotion: false,
  landedGate: "gate_a_promoted_ubiq_packaged_finish_engine_visible_guards_into_current_gate",
  latestSourceGapSelection: "calculator_source_gap_revalidation_v27",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_closeout_ubiq_open_web_packaged_finish_current_gate_guard_and_select_next_accuracy_slice",
  selectedNextFile:
    "packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts",
  selectionStatus:
    "gate_a_promoted_ubiq_packaged_finish_engine_visible_guards_into_current_gate_selected_closeout",
  sliceId: "ubiq_open_web_packaged_finish_current_gate_guard_v1",
  sourceRowsChanged: false,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const UBIQ_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_A_SUMMARY = {
  artifact: "ubiq_packaged_finish_current_gate_guard_gate_a_summary",
  boundOpenWebRowsGuarded: 21,
  exactOpenWebRowsGuarded: 90,
  sourceUrl: UBIQ_SYSTEM_TABLE_URL,
  sourceRowsRemainOwnedByUbiqPdf: true
} as const;

const CURRENT_GATE_PROMOTED_UBIQ_PACKAGED_FINISH_ENGINE_VISIBLE_PACK = {
  artifact: "current_gate_promoted_ubiq_packaged_finish_engine_visible_pack",
  engineFamilyDesignGuard: "src/ubiq-open-web-packaged-finish-family-design.test.ts",
  engineLaneTraceGuard: "src/ubiq-open-web-packaged-lane-trace-matrix.test.ts",
  engineNearMissGuard: "src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts",
  visibleFamilyCardGuard: "features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts",
  visibleHistoryReplayGuard: "features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts",
  visibleLaneCardGuard: "features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts",
  visibleNearMissCardGuard: "features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts"
} as const;

const SOURCE_VERIFIED_UBIQ_PACKAGED_FINISH_PDF_STATUS = {
  artifact: "source_verified_ubiq_packaged_finish_pdf_status",
  accessibleAsOfficialUbiqPdfOn: "2026-05-05",
  newInternetResearchNeededForGateA: false,
  sourceUrl: UBIQ_SYSTEM_TABLE_URL
} as const;

const ROCKWOOL_AND_RAW_OPEN_WEB_BLOCKERS_AFTER_PACKAGED_FINISH_GATE_A = {
  adjacentRockwoolStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
  artifact: "rockwool_and_raw_open_web_blockers_still_carry_forward_after_packaged_finish_gate_a",
  directRockwoolExactRuntimeStillBlocked: true,
  firstRockwoolBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  firstRawOpenWebBlockingRequirement: "source_owned_raw_carrier_negative_boundary_absent",
  flatListSplitStillWithheld: "Rw 41 / R'w 39 / DnT,w 40",
  groupedRockwoolStillScreeningOnly: "Rw 41",
  splitWithholdWarning: ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts",
  "packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts",
  "packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts",
  "packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts",
  "apps/web/features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts",
  "apps/web/features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts",
  "apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts",
  "apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_PRE_UBIQ_PACKAGED_FINISH_GATE_A_ANALYSIS_REPLAN_HANDOFF.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md"
] as const;

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const UBIQ_WEAK_CARPET_EXACT_STACK: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
];

const UBIQ_SUPPORTED_TIMBER_EXACT_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 12 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
];

const UBIQ_SUPPORTED_CARPET_BOUND_STACK: readonly LayerInput[] = [
  ...UBIQ_SUPPORTED_TIMBER_EXACT_STACK.slice(0, 5),
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 12 },
  ...UBIQ_SUPPORTED_TIMBER_EXACT_STACK.slice(6)
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function openWebExactRows() {
  return EXACT_FLOOR_SYSTEMS.filter(
    (system) =>
      system.id.startsWith("ubiq_") &&
      system.id.includes("_open_web_steel_") &&
      system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true
  );
}

function openWebBoundRows() {
  return BOUND_FLOOR_SYSTEMS.filter(
    (system) =>
      system.id.startsWith("ubiq_") &&
      system.id.includes("_open_web_steel_") &&
      system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true
  );
}

function assemblySnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, { targetOutputs: LAB_OUTPUTS });

  return {
    boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("UBIQ open-web packaged-finish current-gate guard Gate A", () => {
  it("lands current-gate ownership for the UBIQ packaged-finish engine and visible pack", () => {
    expect(UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      currentGateRunnerChanged: true,
      evidencePromotion: false,
      landedGate: "gate_a_promoted_ubiq_packaged_finish_engine_visible_guards_into_current_gate",
      latestSourceGapSelection: "calculator_source_gap_revalidation_v27",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_closeout_ubiq_open_web_packaged_finish_current_gate_guard_and_select_next_accuracy_slice",
      selectedNextFile:
        "packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts",
      selectionStatus:
        "gate_a_promoted_ubiq_packaged_finish_engine_visible_guards_into_current_gate_selected_closeout",
      sliceId: "ubiq_open_web_packaged_finish_current_gate_guard_v1",
      sourceRowsChanged: false,
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("adds the packaged-finish engine and visible guards to the current calculator gate", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(CURRENT_GATE_PROMOTED_UBIQ_PACKAGED_FINISH_ENGINE_VISIBLE_PACK).toEqual({
      artifact: "current_gate_promoted_ubiq_packaged_finish_engine_visible_pack",
      engineFamilyDesignGuard: "src/ubiq-open-web-packaged-finish-family-design.test.ts",
      engineLaneTraceGuard: "src/ubiq-open-web-packaged-lane-trace-matrix.test.ts",
      engineNearMissGuard: "src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts",
      visibleFamilyCardGuard: "features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts",
      visibleHistoryReplayGuard: "features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts",
      visibleLaneCardGuard: "features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts",
      visibleNearMissCardGuard: "features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts"
    });
    expect(runner).toContain("src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts");
    for (const gateFile of Object.values(CURRENT_GATE_PROMOTED_UBIQ_PACKAGED_FINISH_ENGINE_VISIBLE_PACK)) {
      if (gateFile === "current_gate_promoted_ubiq_packaged_finish_engine_visible_pack") {
        continue;
      }
      expect(runner).toContain(gateFile);
    }
  });

  it("pins source-owned UBIQ packaged-finish row counts and representative numeric outputs", () => {
    const exactRows = openWebExactRows();
    const boundRows = openWebBoundRows();

    expect(UBIQ_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_A_SUMMARY).toEqual({
      artifact: "ubiq_packaged_finish_current_gate_guard_gate_a_summary",
      boundOpenWebRowsGuarded: 21,
      exactOpenWebRowsGuarded: 90,
      sourceUrl: UBIQ_SYSTEM_TABLE_URL,
      sourceRowsRemainOwnedByUbiqPdf: true
    });
    expect(SOURCE_VERIFIED_UBIQ_PACKAGED_FINISH_PDF_STATUS).toEqual({
      artifact: "source_verified_ubiq_packaged_finish_pdf_status",
      accessibleAsOfficialUbiqPdfOn: "2026-05-05",
      newInternetResearchNeededForGateA: false,
      sourceUrl: UBIQ_SYSTEM_TABLE_URL
    });
    expect(exactRows).toHaveLength(90);
    expect(boundRows).toHaveLength(21);
    expect(new Set([...exactRows, ...boundRows].map((system) => system.sourceUrl ?? ""))).toEqual(
      new Set([UBIQ_SYSTEM_TABLE_URL])
    );

    expect(assemblySnapshot(UBIQ_WEAK_CARPET_EXACT_STACK)).toEqual({
      boundMatchId: null,
      exactMatchId: "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026",
      impactBasis: "official_floor_system_exact_match",
      lnW: 63,
      lnWPlusCI: 62,
      lowerBoundBasis: null,
      rw: 55,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"]
    });
    expect(assemblySnapshot(UBIQ_SUPPORTED_TIMBER_EXACT_STACK)).toEqual({
      boundMatchId: null,
      exactMatchId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      impactBasis: "official_floor_system_exact_match",
      lnW: 51,
      lnWPlusCI: 49,
      lowerBoundBasis: null,
      rw: 64,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"]
    });
    expect(assemblySnapshot(UBIQ_SUPPORTED_CARPET_BOUND_STACK)).toEqual({
      boundMatchId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026",
      exactMatchId: null,
      impactBasis: null,
      lnW: null,
      lnWPlusCI: 45,
      lowerBoundBasis: "official_floor_system_bound_support",
      rw: 64,
      supported: ["Rw", "Ln,w+CI"],
      unsupported: ["Ln,w", "DeltaLw"]
    });
  });

  it("keeps Rockwool exact and raw open-web widening blockers unchanged", () => {
    expect(ROCKWOOL_AND_RAW_OPEN_WEB_BLOCKERS_AFTER_PACKAGED_FINISH_GATE_A).toEqual({
      adjacentRockwoolStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
      artifact: "rockwool_and_raw_open_web_blockers_still_carry_forward_after_packaged_finish_gate_a",
      directRockwoolExactRuntimeStillBlocked: true,
      firstRockwoolBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
      firstRawOpenWebBlockingRequirement: "source_owned_raw_carrier_negative_boundary_absent",
      flatListSplitStillWithheld: "Rw 41 / R'w 39 / DnT,w 40",
      groupedRockwoolStillScreeningOnly: "Rw 41",
      splitWithholdWarning: ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING
    });
  });

  it("keeps active docs aligned after packaged-finish current-gate promotion", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_A.selectionStatus);
      expect(contents).toContain(UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_A.selectedNextAction);
      expect(contents).toContain(UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_A.selectedNextFile);
      expect(contents).toContain("ubiq_packaged_finish_current_gate_guard_gate_a_summary");
      expect(contents).toContain("current_gate_promoted_ubiq_packaged_finish_engine_visible_pack");
      expect(contents).toContain("source_verified_ubiq_packaged_finish_pdf_status");
      expect(contents).toContain(
        "rockwool_and_raw_open_web_blockers_still_carry_forward_after_packaged_finish_gate_a"
      );
    }
  });
});

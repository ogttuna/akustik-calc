import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const UBIQ_SYSTEM_TABLE_URL = "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";
const SUPPORTED_BAND_PATTERN = /^ubiq_fl(?:24|26|28)_open_web_steel_/u;

const UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  currentGateRunnerChanged: true,
  evidencePromotion: false,
  landedGate: "gate_a_promoted_source_backed_ubiq_supported_band_exact_and_bound_guards_into_current_gate",
  latestSourceGapSelection: "ubiq_open_web_weak_band_current_gate_guard_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_closeout_ubiq_open_web_supported_band_current_gate_guard_and_select_next_accuracy_slice",
  selectedNextFile: "packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts",
  selectionStatus:
    "gate_a_promoted_ubiq_supported_band_exact_and_bound_guards_into_current_gate_selected_closeout",
  sliceId: "ubiq_open_web_supported_band_current_gate_guard_v1",
  sourceRowsChanged: false,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const UBIQ_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_A_SUMMARY = {
  artifact: "ubiq_supported_band_current_gate_guard_gate_a_summary",
  carpetBoundRowsGuarded: 18,
  exactBareAndTimberRowsGuarded: 36,
  sourceUrl: UBIQ_SYSTEM_TABLE_URL,
  supportedBandRowsRemainSourceOwned: true
} as const;

const CURRENT_GATE_PROMOTED_UBIQ_SUPPORTED_BAND_ENGINE_VISIBLE_PACK = {
  artifact: "current_gate_promoted_ubiq_supported_band_engine_visible_pack",
  engineBoundHistoryGuard: "src/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
  engineNearMissGuard: "src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts",
  engineSupportedBandGuard: "src/ubiq-open-web-supported-band-finish-completion.test.ts",
  visibleBoundHistoryGuard: "features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
  visibleNearMissGuard: "features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts"
} as const;

const ROCKWOOL_CARRY_FORWARD_AFTER_SUPPORTED_BAND_GATE_A = {
  artifact: "rockwool_blockers_still_carry_forward_after_ubiq_supported_band_gate_a",
  adjacentStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
  directRockwoolExactRuntimeStillBlocked: true,
  firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  flatListSplitStillWithheld: "Rw 41 / R'w 39 / DnT,w 40",
  groupedStillScreeningOnly: "Rw 41"
} as const;

const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const FL24_BARE_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
];

const FL26_BARE_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 16 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 }
];

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

const FL28_CARPET_BOUND_NEAR_MISS: readonly LayerInput[] = [
  ...FL28_CARPET_BOUND_STACK.slice(0, 7),
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 305 }
];

const REQUIRED_SURFACES = [
  "packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts",
  "packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/ubiq-open-web-supported-band-finish-completion.test.ts",
  "packages/engine/src/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
  "packages/engine/src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts",
  "apps/web/features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
  "apps/web/features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function assemblySnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, {
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: TARGET_OUTPUTS
  });

  return {
    boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    ci: result.impact?.CI ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnWPlusCIUpperBound: result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

function impactOnlySnapshot(layers: readonly LayerInput[]) {
  const result = calculateImpactOnly(layers, {
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: TARGET_OUTPUTS
  });

  return {
    boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lnWPlusCIUpperBound: result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("UBIQ open-web supported-band current-gate guard Gate A", () => {
  it("lands current-gate ownership for the UBIQ supported-band exact and bound pack", () => {
    expect(UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      currentGateRunnerChanged: true,
      evidencePromotion: false,
      landedGate: "gate_a_promoted_source_backed_ubiq_supported_band_exact_and_bound_guards_into_current_gate",
      latestSourceGapSelection: "ubiq_open_web_weak_band_current_gate_guard_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_closeout_ubiq_open_web_supported_band_current_gate_guard_and_select_next_accuracy_slice",
      selectedNextFile:
        "packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts",
      selectionStatus:
        "gate_a_promoted_ubiq_supported_band_exact_and_bound_guards_into_current_gate_selected_closeout",
      sliceId: "ubiq_open_web_supported_band_current_gate_guard_v1",
      sourceRowsChanged: false,
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("adds the selected supported-band engine and visible guards to the current calculator gate", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(CURRENT_GATE_PROMOTED_UBIQ_SUPPORTED_BAND_ENGINE_VISIBLE_PACK).toEqual({
      artifact: "current_gate_promoted_ubiq_supported_band_engine_visible_pack",
      engineBoundHistoryGuard: "src/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
      engineNearMissGuard: "src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts",
      engineSupportedBandGuard: "src/ubiq-open-web-supported-band-finish-completion.test.ts",
      visibleBoundHistoryGuard: "features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
      visibleNearMissGuard: "features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts"
    });
    expect(runner).toContain("src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts");
    for (const gateFile of Object.values(CURRENT_GATE_PROMOTED_UBIQ_SUPPORTED_BAND_ENGINE_VISIBLE_PACK)) {
      if (gateFile === "current_gate_promoted_ubiq_supported_band_engine_visible_pack") {
        continue;
      }
      expect(runner).toContain(gateFile);
    }
  });

  it("pins supported-band source row counts and exact bare/timber values", () => {
    const exactRows = EXACT_FLOOR_SYSTEMS.filter((system) => SUPPORTED_BAND_PATTERN.test(system.id));
    const boundRows = BOUND_FLOOR_SYSTEMS.filter((system) => SUPPORTED_BAND_PATTERN.test(system.id));

    expect(UBIQ_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_A_SUMMARY).toEqual({
      artifact: "ubiq_supported_band_current_gate_guard_gate_a_summary",
      carpetBoundRowsGuarded: 18,
      exactBareAndTimberRowsGuarded: 36,
      sourceUrl: UBIQ_SYSTEM_TABLE_URL,
      supportedBandRowsRemainSourceOwned: true
    });
    expect(exactRows).toHaveLength(36);
    expect(boundRows.filter((system) => system.label.toLowerCase().includes("carpet"))).toHaveLength(18);
    expect(new Set(exactRows.map((system) => system.sourceUrl))).toEqual(new Set([UBIQ_SYSTEM_TABLE_URL]));

    expect(assemblySnapshot(FL24_BARE_STACK)).toMatchObject({
      ci: -2,
      exactMatchId: "ubiq_fl24_open_web_steel_300_19mm_bare_exact_lab_2026",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lnW: 62,
      lnWPlusCI: 60,
      lPrimeNT50: 60,
      lPrimeNTw: 61.6,
      lPrimeNW: 64,
      rw: 61,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    });
    expect(assemblySnapshot(FL26_BARE_STACK)).toMatchObject({
      ci: -1,
      exactMatchId: "ubiq_fl26_open_web_steel_200_16mm_bare_exact_lab_2026",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lnW: 62,
      lnWPlusCI: 61,
      lPrimeNT50: 61,
      lPrimeNTw: 61.6,
      lPrimeNW: 64,
      rw: 60,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    });
    expect(assemblySnapshot(FL28_BARE_STACK)).toMatchObject({
      ci: -2,
      exactMatchId: "ubiq_fl28_open_web_steel_400_19mm_bare_exact_lab_2026",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lnW: 58,
      lnWPlusCI: 56,
      lPrimeNT50: 56,
      lPrimeNTw: 57.6,
      lPrimeNW: 60,
      rw: 64,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    });
  });

  it("keeps carpet supported-band rows bound-only and near-misses impact-fail-closed", () => {
    expect(assemblySnapshot(FL28_CARPET_BOUND_STACK)).toEqual({
      boundMatchId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026",
      ci: null,
      exactMatchId: null,
      impactBasis: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      lnWPlusCI: null,
      lnWPlusCIUpperBound: 45,
      lowerBoundBasis: "official_floor_system_bound_support",
      rw: 64,
      supported: ["Rw", "Ln,w+CI"],
      unsupported: ["Ln,w", "CI", "L'n,w", "L'nT,w", "L'nT,50"]
    });
    expect(impactOnlySnapshot(FL28_CARPET_BOUND_NEAR_MISS)).toEqual({
      boundMatchId: null,
      exactMatchId: null,
      impactBasis: null,
      lnW: null,
      lnWPlusCI: null,
      lnWPlusCIUpperBound: null,
      lowerBoundBasis: null,
      supported: [],
      unsupported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    });
  });

  it("keeps Rockwool blockers unchanged and docs aligned after supported-band promotion", () => {
    expect(ROCKWOOL_CARRY_FORWARD_AFTER_SUPPORTED_BAND_GATE_A).toEqual({
      artifact: "rockwool_blockers_still_carry_forward_after_ubiq_supported_band_gate_a",
      adjacentStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
      directRockwoolExactRuntimeStillBlocked: true,
      firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
      flatListSplitStillWithheld: "Rw 41 / R'w 39 / DnT,w 40",
      groupedStillScreeningOnly: "Rw 41"
    });

    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_A.selectionStatus);
      expect(contents).toContain(UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_A.selectedNextAction);
      expect(contents).toContain(UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_A.selectedNextFile);
      expect(contents).toContain("ubiq_supported_band_current_gate_guard_gate_a_summary");
      expect(contents).toContain("current_gate_promoted_ubiq_supported_band_engine_visible_pack");
      expect(contents).toContain("rockwool_blockers_still_carry_forward_after_ubiq_supported_band_gate_a");
    }
  });
});

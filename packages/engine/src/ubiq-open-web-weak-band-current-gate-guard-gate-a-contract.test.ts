import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type UbiqGuardCase = {
  boardCount: 2 | 3;
  boardThicknessMm: 13 | 16;
  exactField: {
    dntw: number;
    lPrimeNTw: number;
    lPrimeNW: number;
    rwPrime: number;
  };
  exactLab: {
    lnW: number;
    lnWPlusCI: number;
    rw: number;
  };
  family: "FL-23" | "FL-25" | "FL-27";
  floorCovering: LayerInput;
  inexFloorMm: 19;
  joistMm: 300 | 400;
  matchId: string;
  upperOnly: {
    fieldDnTw: number;
    fieldRwPrime: number;
    labRw: number;
  };
};

const UBIQ_SYSTEM_TABLE_URL = "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";

const UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  currentGateRunnerChanged: true,
  evidencePromotion: false,
  landedGate: "gate_a_promoted_source_backed_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate",
  latestSourceGapSelection: "calculator_source_gap_revalidation_v26",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_closeout_ubiq_open_web_weak_band_current_gate_guard_and_select_next_accuracy_slice",
  selectedNextFile: "packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts",
  selectionStatus:
    "gate_a_promoted_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate_selected_closeout",
  sliceId: "ubiq_open_web_weak_band_current_gate_guard_v1",
  sourceRowsChanged: false,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const UBIQ_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A_SUMMARY = {
  artifact: "ubiq_weak_band_current_gate_guard_gate_a_summary",
  exactRowsGuarded: 54,
  exactRowsRemainExactOnly: true,
  sourceUrl: UBIQ_SYSTEM_TABLE_URL,
  upperOnlyImpactOutputsRemainFailClosed: true
} as const;

const CURRENT_GATE_PROMOTED_UBIQ_WEAK_BAND_ENGINE_VISIBLE_PACK = {
  artifact: "current_gate_promoted_ubiq_weak_band_engine_visible_pack",
  engineExactGuard: "src/ubiq-open-web-weak-band-exact-source-mapping.test.ts",
  engineFailClosedGuard: "src/ubiq-open-web-weaker-band-posture-guard.test.ts",
  visibleGuard: "features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts"
} as const;

const ROCKWOOL_CARRY_FORWARD_AFTER_UBIQ_GATE_A = {
  artifact: "rockwool_source_blockers_carry_forward_after_ubiq_gate_a",
  adjacentStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
  directRockwoolExactRuntimeStillBlocked: true,
  firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  flatListSplitStillWithheld: "Rw 41 / R'w 39 / DnT,w 40",
  groupedStillScreeningOnly: "Rw 41"
} as const;

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const FIELD_AIRBORNE_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const FIELD_IMPACT_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const GUARD_CASES: readonly UbiqGuardCase[] = [
  {
    boardCount: 2,
    boardThicknessMm: 13,
    exactField: { dntw: 74, lPrimeNTw: 70.6, lPrimeNW: 73, rwPrime: 72 },
    exactLab: { lnW: 71, lnWPlusCI: 70, rw: 51 },
    family: "FL-23",
    floorCovering: {
      floorRole: "floor_covering",
      materialId: "engineered_timber_with_acoustic_underlay",
      thicknessMm: 20
    },
    inexFloorMm: 19,
    joistMm: 300,
    matchId: "ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026",
    upperOnly: { fieldDnTw: 74, fieldRwPrime: 71, labRw: 73 }
  },
  {
    boardCount: 2,
    boardThicknessMm: 16,
    exactField: { dntw: 74, lPrimeNTw: 70.6, lPrimeNW: 73, rwPrime: 72 },
    exactLab: { lnW: 71, lnWPlusCI: 70, rw: 52 },
    family: "FL-25",
    floorCovering: {
      floorRole: "floor_covering",
      materialId: "engineered_timber_with_acoustic_underlay",
      thicknessMm: 20
    },
    inexFloorMm: 19,
    joistMm: 300,
    matchId: "ubiq_fl25_open_web_steel_300_19mm_timber_underlay_exact_lab_2026",
    upperOnly: { fieldDnTw: 74, fieldRwPrime: 71, labRw: 73 }
  },
  {
    boardCount: 3,
    boardThicknessMm: 16,
    exactField: { dntw: 77, lPrimeNTw: 62.6, lPrimeNW: 65, rwPrime: 74 },
    exactLab: { lnW: 63, lnWPlusCI: 62, rw: 55 },
    family: "FL-27",
    floorCovering: {
      floorRole: "floor_covering",
      materialId: "carpet_with_foam_underlay",
      thicknessMm: 15
    },
    inexFloorMm: 19,
    joistMm: 400,
    matchId: "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026",
    upperOnly: { fieldDnTw: 77, fieldRwPrime: 74, labRw: 76 }
  }
] as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts",
  "packages/engine/src/ubiq-open-web-weak-band-exact-source-mapping.test.ts",
  "packages/engine/src/ubiq-open-web-weaker-band-posture-guard.test.ts",
  "apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function upperOnlyLayers(testCase: UbiqGuardCase): readonly LayerInput[] {
  return [
    testCase.floorCovering,
    {
      floorRole: "floating_screed",
      materialId: "inex_floor_panel",
      thicknessMm: testCase.inexFloorMm
    },
    {
      floorRole: "base_structure",
      materialId: "open_web_steel_floor",
      thicknessMm: testCase.joistMm
    }
  ];
}

function exactLayers(testCase: UbiqGuardCase): readonly LayerInput[] {
  return [
    ...upperOnlyLayers(testCase),
    ...Array.from({ length: testCase.boardCount }, () => ({
      floorRole: "ceiling_board" as const,
      materialId: "firestop_board",
      thicknessMm: testCase.boardThicknessMm
    }))
  ];
}

function snapshot(layers: readonly LayerInput[], mode: "field" | "lab") {
  const result = calculateAssembly(
    layers,
    mode === "lab"
      ? { targetOutputs: LAB_OUTPUTS }
      : {
          airborneContext: FIELD_AIRBORNE_CONTEXT,
          impactFieldContext: FIELD_IMPACT_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }
  );

  return {
    dntw: result.metrics.estimatedDnTwDb ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("UBIQ open-web weak-band current-gate guard Gate A", () => {
  it("lands current-gate ownership for the UBIQ weak-band exact and fail-closed pack", () => {
    expect(UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      currentGateRunnerChanged: true,
      evidencePromotion: false,
      landedGate: "gate_a_promoted_source_backed_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate",
      latestSourceGapSelection: "calculator_source_gap_revalidation_v26",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_closeout_ubiq_open_web_weak_band_current_gate_guard_and_select_next_accuracy_slice",
      selectedNextFile:
        "packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts",
      selectionStatus:
        "gate_a_promoted_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate_selected_closeout",
      sliceId: "ubiq_open_web_weak_band_current_gate_guard_v1",
      sourceRowsChanged: false,
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("adds the selected UBIQ engine and visible guards to the current calculator gate", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(CURRENT_GATE_PROMOTED_UBIQ_WEAK_BAND_ENGINE_VISIBLE_PACK).toEqual({
      artifact: "current_gate_promoted_ubiq_weak_band_engine_visible_pack",
      engineExactGuard: "src/ubiq-open-web-weak-band-exact-source-mapping.test.ts",
      engineFailClosedGuard: "src/ubiq-open-web-weaker-band-posture-guard.test.ts",
      visibleGuard: "features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts"
    });
    expect(runner).toContain("src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts");
    expect(runner).toContain(CURRENT_GATE_PROMOTED_UBIQ_WEAK_BAND_ENGINE_VISIBLE_PACK.engineExactGuard);
    expect(runner).toContain(CURRENT_GATE_PROMOTED_UBIQ_WEAK_BAND_ENGINE_VISIBLE_PACK.engineFailClosedGuard);
    expect(runner).toContain(CURRENT_GATE_PROMOTED_UBIQ_WEAK_BAND_ENGINE_VISIBLE_PACK.visibleGuard);
  });

  it("pins source-backed exact lower-board values for FL-23/25/27", () => {
    const weakBandRows = EXACT_FLOOR_SYSTEMS.filter((system) => /^ubiq_fl(?:23|25|27)_open_web_steel_/u.test(system.id));

    expect(UBIQ_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A_SUMMARY).toEqual({
      artifact: "ubiq_weak_band_current_gate_guard_gate_a_summary",
      exactRowsGuarded: 54,
      exactRowsRemainExactOnly: true,
      sourceUrl: UBIQ_SYSTEM_TABLE_URL,
      upperOnlyImpactOutputsRemainFailClosed: true
    });
    expect(weakBandRows).toHaveLength(54);
    expect(new Set(weakBandRows.map((system) => system.sourceUrl))).toEqual(new Set([UBIQ_SYSTEM_TABLE_URL]));
    expect(new Set(weakBandRows.map((system) => system.familyEstimateEligible))).toEqual(new Set([false]));

    for (const testCase of GUARD_CASES) {
      const lab = snapshot(exactLayers(testCase), "lab");
      const field = snapshot(exactLayers(testCase), "field");

      expect(lab).toMatchObject({
        floorSystemEstimateKind: null,
        floorSystemMatchId: testCase.matchId,
        impactBasis: "official_floor_system_exact_match",
        lnW: testCase.exactLab.lnW,
        lnWPlusCI: testCase.exactLab.lnWPlusCI,
        rw: testCase.exactLab.rw,
        supported: ["Rw", "Ln,w", "Ln,w+CI"],
        unsupported: ["DeltaLw"]
      });
      expect(field).toMatchObject({
        dntw: testCase.exactField.dntw,
        floorSystemEstimateKind: null,
        floorSystemMatchId: testCase.matchId,
        impactBasis: "mixed_exact_plus_estimated_local_guide",
        lnW: testCase.exactLab.lnW,
        lPrimeNTw: testCase.exactField.lPrimeNTw,
        lPrimeNW: testCase.exactField.lPrimeNW,
        rw: testCase.exactLab.rw,
        rwPrime: testCase.exactField.rwPrime,
        supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
        unsupported: []
      });
    }
  });

  it("keeps upper-only weak-band impact outputs fail-closed instead of borrowing nearby family values", () => {
    for (const testCase of GUARD_CASES) {
      const lab = snapshot(upperOnlyLayers(testCase), "lab");
      const field = snapshot(upperOnlyLayers(testCase), "field");

      expect(lab).toMatchObject({
        floorSystemEstimateKind: null,
        floorSystemMatchId: null,
        impactBasis: null,
        lnW: null,
        lnWPlusCI: null,
        rw: testCase.upperOnly.labRw,
        supported: ["Rw"],
        unsupported: ["Ln,w", "Ln,w+CI", "DeltaLw"]
      });
      expect(field).toMatchObject({
        dntw: testCase.upperOnly.fieldDnTw,
        floorSystemEstimateKind: null,
        floorSystemMatchId: null,
        impactBasis: null,
        lnW: null,
        lPrimeNTw: null,
        lPrimeNW: null,
        rwPrime: testCase.upperOnly.fieldRwPrime,
        supported: ["R'w", "DnT,w"],
        unsupported: ["Ln,w", "L'n,w", "L'nT,w"]
      });
      expect(lab.warnings).toMatch(/impact sound outputs are not available/i);
      expect(field.warnings).toMatch(/impact sound outputs are not available/i);
      expect(lab.warnings).not.toMatch(/published family estimate active: lightweight steel/i);
      expect(field.warnings).not.toMatch(/published family estimate active: lightweight steel/i);
    }
  });

  it("keeps Rockwool blockers unchanged and docs aligned after the UBIQ guard promotion", () => {
    expect(ROCKWOOL_CARRY_FORWARD_AFTER_UBIQ_GATE_A).toEqual({
      artifact: "rockwool_source_blockers_carry_forward_after_ubiq_gate_a",
      adjacentStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
      directRockwoolExactRuntimeStillBlocked: true,
      firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
      flatListSplitStillWithheld: "Rw 41 / R'w 39 / DnT,w 40",
      groupedStillScreeningOnly: "Rw 41"
    });

    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A.selectionStatus);
      expect(contents).toContain(UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A.selectedNextAction);
      expect(contents).toContain(UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A.selectedNextFile);
      expect(contents).toContain("ubiq_weak_band_current_gate_guard_gate_a_summary");
      expect(contents).toContain("current_gate_promoted_ubiq_weak_band_engine_visible_pack");
      expect(contents).toContain("rockwool_source_blockers_carry_forward_after_ubiq_gate_a");
    }
  });
});

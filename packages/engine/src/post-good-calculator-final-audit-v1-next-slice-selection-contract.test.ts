import { describe, expect, it } from "vitest";

export const POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION = {
  closedSliceId: "good_calculator_final_audit_v1",
  closedSliceRole:
    "Reconciled MASTER_PLAN section 3/8 to the implemented calculator surface, added coverage-grid-consistency.test.ts as an executable grid and C1-C6 audit, moved the focused calculator gate onto the final-audit label, and opened the post-calculator productization roadmap without reopening source-gated runtime work.",
  evidenceLedger: [
    "docs/calculator/MASTER_PLAN.md",
    "docs/archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md",
    "packages/engine/src/coverage-grid-consistency.test.ts",
    "tools/dev/run-calculator-current-gate.ts",
    "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  ],
  completionSignals: {
    c1WallPresetCoverage: "green with honest exact/benchmark/formula tiering",
    c2WallCorridorAudit: "green; preset and selector corridor surfaces are VALUE-pinned",
    c3WallFieldContinuation: "green for wall preset and selector surfaces; floor field-continuation expansion remains non-blocking",
    c4HostileInputDiscipline: "green for floor and wall matrices plus step-7 O1 torture coverage",
    c5ReorderAndSplitInvariance:
      "green for wall reorder and defended floor split/parity surfaces; arbitrary floor reorder expansion is not claimed by this audit",
    c6ArchitectureHygiene:
      "documented deferral; dynamic_airborne_split_refactor_v2 remains the path to full under-2000-line closure"
  },
  deferred: {
    dynamicAirborneSplitRefactorV2:
      "Remaining dynamic-airborne.ts composer/floor-guard carve needs composer injection and stays documented in DYNAMIC_AIRBORNE_CARTOGRAPHY.md.",
    wallFormulaFamilyWideningV1:
      "Timber stud formula accuracy remains source-gated. Current formula-owned values are VALUE-pinned and must not be silently widened.",
    deepHybridSwapValuePins:
      "Deep-hybrid swap corridors remain narrative/invariant pinned; per-cell VALUE pins are low-ROI unless a later audit finds drift.",
    workbenchCardSelectorValuePins:
      "Workbench card-level selector VALUE pins remain optional unless user-visible card drift appears.",
    framedWallMonotonicFloorWarningDrift:
      "F3 warning-only drift stays deferred because numeric outputs are unchanged.",
    floorFieldContinuationExpansion:
      "Full floor field-continuation expansion remains a non-blocking follow-up from the 2026-04-22 ledger.",
    arbitraryFloorReorderExpansion:
      "The final audit does not claim arbitrary floor reorder invariance beyond the defended floor split/parity surfaces.",
    allCallerThicknessGuard:
      "Standalone all-caller floor/wall direct engine invalid-thickness guard remains a hardening follow-up.",
    floorManyLayer50PlusRegression:
      "Wall 50-layer behavior is pinned; a dedicated floor 50+ layer regression remains a future hardening track.",
    blockedSourceQueue:
      "GDMTXA04A direct exact, C11c exact import, raw bare open-box/open-web impact, reinforced-concrete reopening, and wall-selector widening remain closed/fail-closed unless a later source-backed slice imports new evidence."
  },
  selectedImplementationSlice: "server_backed_project_storage_v1",
  selectedPlanningSurface: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md",
  selectedImplementationSliceRole:
    "First productization slice. Move saved scenarios from browser-local assumptions toward durable server-backed project records, because persistence is the base for auth, billing, proposal history, collaboration, monitoring, and future desktop sync.",
  kept: {
    calculatorRuntimeNotWidenedByFinalAudit: true,
    blockedSourcePostureUnchanged: true,
    masterPlanGridExecutable: true,
    completionSignalsExecutable: true,
    focusedGateIncludesFinalAudit: true,
    productizationRoadmapOpened: true,
    browserLocalPersistenceHonestyPreserved: true
  }
} as const;

describe("post-good calculator final audit v1 - next slice selection contract", () => {
  it("records the final-audit slice id and selects the first productization implementation slice", () => {
    expect(POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.closedSliceId).toBe(
      "good_calculator_final_audit_v1"
    );
    expect(POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.selectedImplementationSlice).toBe(
      "server_backed_project_storage_v1"
    );
    expect(POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.selectedPlanningSurface).toBe(
      "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
    );
  });

  it("pins the evidence ledger to the master plan, executable audit test, focused gate, and product roadmap", () => {
    expect(POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.evidenceLedger).toEqual([
      "docs/calculator/MASTER_PLAN.md",
      "docs/archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md",
      "packages/engine/src/coverage-grid-consistency.test.ts",
      "tools/dev/run-calculator-current-gate.ts",
      "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
    ]);
  });

  it("records C1-C6 with explicit honesty for C3, C5, and C6", () => {
    expect(
      POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.completionSignals.c1WallPresetCoverage
    ).toContain("green");
    expect(
      POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.completionSignals.c2WallCorridorAudit
    ).toContain("VALUE-pinned");
    expect(
      POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.completionSignals.c3WallFieldContinuation
    ).toContain("floor field-continuation expansion remains non-blocking");
    expect(
      POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.completionSignals.c5ReorderAndSplitInvariance
    ).toContain("arbitrary floor reorder expansion is not claimed");
    expect(
      POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.completionSignals.c6ArchitectureHygiene
    ).toContain("documented deferral");
  });

  it("carries all explicit deferrals forward without reopening source-gated calculator work", () => {
    expect(Object.keys(POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.deferred)).toEqual([
      "dynamicAirborneSplitRefactorV2",
      "wallFormulaFamilyWideningV1",
      "deepHybridSwapValuePins",
      "workbenchCardSelectorValuePins",
      "framedWallMonotonicFloorWarningDrift",
      "floorFieldContinuationExpansion",
      "arbitraryFloorReorderExpansion",
      "allCallerThicknessGuard",
      "floorManyLayer50PlusRegression",
      "blockedSourceQueue"
    ]);
    expect(
      POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.deferred.blockedSourceQueue
    ).toContain("remain closed/fail-closed");
  });

  it("keeps the final audit scoped to evidence and productization handoff", () => {
    expect(
      POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.kept.calculatorRuntimeNotWidenedByFinalAudit
    ).toBe(true);
    expect(
      POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.kept.blockedSourcePostureUnchanged
    ).toBe(true);
    expect(POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.kept.masterPlanGridExecutable).toBe(true);
    expect(POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.kept.completionSignalsExecutable).toBe(true);
    expect(POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.kept.focusedGateIncludesFinalAudit).toBe(true);
    expect(POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.kept.productizationRoadmapOpened).toBe(true);
    expect(
      POST_GOOD_CALCULATOR_FINAL_AUDIT_V1_NEXT_SLICE_SELECTION.kept.browserLocalPersistenceHonestyPreserved
    ).toBe(true);
  });
});

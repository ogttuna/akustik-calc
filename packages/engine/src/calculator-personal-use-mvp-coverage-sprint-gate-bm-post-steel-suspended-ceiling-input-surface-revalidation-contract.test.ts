import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildPersonalUseMvpCoverageSprintGateBJScenarioPack,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bj";
import {
  buildPersonalUseMvpCoverageSprintGateBKScenarioPack,
  GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bk";
import {
  buildPersonalUseMvpCoverageSprintGateBMRevalidationContract,
  GATE_BM_STEEL_TOLERANCE_PINS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bm";
import {
  GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
  GATE_BL_PARTIAL_STEEL_SUSPENDED_CEILING_SURFACE,
  GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS,
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bl";
import {
  buildPersonalUseMvpCoverageSprintGateBGRevalidationContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bg";
import { buildSteelFloorFormulaPredictorInputFromSurface } from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BM_REVALIDATION_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bm.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bm-post-steel-suspended-ceiling-input-surface-revalidation-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl-steel-floor-suspended-ceiling-input-surface-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts",
  "apps/web/features/workbench/steel-floor-formula-input-surface.ts",
  "apps/web/features/workbench/steel-floor-formula-input-surface.test.ts",
  "apps/web/features/workbench/steel-floor-formula-input-surface-acceptance.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_HANDOFF.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BM_POST_STEEL_SUSPENDED_CEILING_INPUT_SURFACE_REVALIDATION_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const GATE_BM_HISTORICAL_SELECTION_DOCS = [
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function gateBKScenario(id: string) {
  const found = buildPersonalUseMvpCoverageSprintGateBKScenarioPack().find((entry) => entry.id === id);

  if (!found) {
    throw new Error(`Missing Gate BK scenario ${id}`);
  }

  return found;
}

function gateBJScenario(id: string) {
  const found = buildPersonalUseMvpCoverageSprintGateBJScenarioPack().find((entry) => entry.id === id);

  if (!found) {
    throw new Error(`Missing Gate BJ scenario ${id}`);
  }

  return found;
}

describe("Personal-Use MVP Coverage Sprint Gate BM post steel suspended-ceiling input-surface revalidation", () => {
  it("lands Gate BM as no-runtime revalidation and selects the post-steel matrix refresh next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBMRevalidationContract();

    expect(contract).toMatchObject({
      apiShapeChange: false,
      evidencePromotion: false,
      fieldBuildingAdapterMoved: false,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE,
      labFieldBuildingAliasAdded: false,
      numericRuntimeBehaviorChange: false,
      previousGateBL: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_FILE,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTION_STATUS
      },
      revalidatedAdjacentFloorImpactSourceAbsentLane: {
        deltaLw: 30.1,
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE,
        lnW: 44.4
      },
      revalidatedFieldBuildingGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE,
      revalidatedPreviousSteelGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE,
      routeCardValueChange: false,
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bl_post_steel_suspended_ceiling_input_surface_revalidation",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(contract.revalidatedGateBKSuspendedCeilingSurfaceRuntime).toMatchObject({
      basis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      deltaLw: null,
      lnW: 62.2,
      supportedTargetOutputs: ["Ln,w"],
      toleranceDb: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB,
      unsupportedTargetOutputs: ["DeltaLw", "IIC", "AIIC", "L'nT,50"]
    });

    for (const path of REQUIRED_GATE_BM_REVALIDATION_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-pins complete, safe-reordered, and impact-only steel suspended-ceiling runtime values", () => {
    const safeReorderedRows = [
      GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[0],
      GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[1],
      GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[3],
      GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[2],
      GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[4],
      GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[5]
    ];

    const completeSurface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });
    const reorderedSurface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: safeReorderedRows,
      surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });
    const complete = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
      impactPredictorInput: completeSurface.impactPredictorInput,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });
    const reordered = calculateAssembly(safeReorderedRows, {
      impactPredictorInput: reorderedSurface.impactPredictorInput,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });
    const impactOnly = calculateImpactOnly([], {
      impactPredictorInput: GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });

    for (const result of [complete, reordered, impactOnly]) {
      expect(result.impact).toMatchObject({
        LnW: 62.2,
        basis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
        metricBasis: {
          LnW: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
        }
      });
      expect(result.impact?.DeltaLw).toBeUndefined();
      expect(result.supportedTargetOutputs).toEqual(["Ln,w"]);
      expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw", "IIC", "AIIC", "L'nT,50"]);
      expect(result.impact?.errorBudgets).toEqual([
        expect.objectContaining({
          metricId: "Ln,w",
          notMeasuredEvidence: true,
          origin: "source_absent_formula_error_budget",
          toleranceDb: GATE_BM_STEEL_TOLERANCE_PINS.gateBKSuspendedCeilingLnW
        })
      ]);
      expect(result.floorSystemEstimate).toBeNull();
      expect(result.warnings.some((warning: string) => /low-confidence fallback active/i.test(warning))).toBe(false);
    }
  });

  it("keeps partial steel surface input and hostile duplicate carrier edits parked without low-confidence output", () => {
    const duplicateCarrierRows = [
      ...GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 250 }
    ] as const;
    const partialSurface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      surface: GATE_BL_PARTIAL_STEEL_SUSPENDED_CEILING_SURFACE,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });
    const duplicateSurface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: duplicateCarrierRows,
      surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });
    const partial = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
      impactPredictorInput: partialSurface.impactPredictorInput,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });

    expect(partialSurface).toMatchObject({
      missingPhysicalInputs: ["steelCarrierSpacingMm", "lowerCeilingIsolationSupportForm"],
      status: "needs_input"
    });
    expect(partial.impact).toBeNull();
    expect(partial.floorSystemEstimate?.kind).not.toBe("low_confidence");
    expect(partial.supportedTargetOutputs).toEqual([]);
    expect(partial.unsupportedTargetOutputs).toEqual(GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS);
    expect(
      partial.warnings.some((warning: string) =>
        /needs steelCarrierSpacingMm, lowerCeilingIsolationSupportForm before calculating lab Ln,w/i.test(warning)
      )
    ).toBe(true);
    expect(duplicateSurface).toMatchObject({
      impactPredictorInput: null,
      status: "unsafe_topology"
    });
  });

  it("keeps Gate AD, exact-source precedence, and adjacent floor-impact source-absent lanes frozen", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBMRevalidationContract();
    const gateAD = contract.revalidatedGateADUpperLowerRuntime;
    const exact = gateBKScenario("gate_bk_exact_source_precedence_stays_first");
    const adjacent = buildPersonalUseMvpCoverageSprintGateBGRevalidationContract();

    expect(gateAD).toMatchObject({
      basis: STEEL_FLOOR_FORMULA_BASIS,
      deltaLw: 22.4,
      lnW: 55.6,
      supportedTargetOutputs: ["Ln,w", "DeltaLw"],
      toleranceDb: GATE_BM_STEEL_TOLERANCE_PINS.gateADLnW,
      unsupportedTargetOutputs: []
    });
    expect(GATE_BM_STEEL_TOLERANCE_PINS.gateADDeltaLw).toBe(2);
    expect(exact).toMatchObject({
      basisId: "official_floor_system_exact_match",
      confidenceLevel: "high",
      lowConfidenceFallbackActive: false,
      supportedTargetOutputs: ["Ln,w", "Rw"],
      unsupportedTargetOutputs: ["DeltaLw", "Ctr", "IIC", "AIIC", "L'nT,50"],
      valuePins: [{ metric: "Ln,w", value: 58 }]
    });
    expect(adjacent.revalidatedRuntimeImpact).toMatchObject({
      DeltaLw: 30.1,
      LnW: 44.4
    });
  });

  it("keeps field/building, ASTM/IIC/AIIC, DeltaLw, and L'nT,50 basis boundaries explicit", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
      targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
    });
    const field = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
      impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 60 },
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"]
    });
    const astm = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
      impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 60 },
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: ["IIC", "AIIC"]
    });
    const deltaLw = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
      impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 60 },
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: ["DeltaLw"]
    });
    const gateBJField = gateBJScenario("gate_bj_complete_field_volume_runtime_corridor");
    const gateBJBuilding = gateBJScenario("gate_bj_complete_building_direct_flanking_runtime_corridor");

    expect(field.impact).toMatchObject({
      LPrimeNTw: 62.4,
      LPrimeNW: 65.2,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      metricBasis: {
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LnW: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
      }
    });
    expect(field.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(field.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(deltaLw.supportedTargetOutputs).toEqual([]);
    expect(deltaLw.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(gateBJField).toMatchObject({
      basisId: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      status: "ready_with_runtime_corridor",
      valuePins: [
        { metric: "L'n,w", value: 52.3 },
        { metric: "L'nT,w", value: 49.9 }
      ]
    });
    expect(gateBJBuilding).toMatchObject({
      basisId: "mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum",
      status: "ready_with_runtime_corridor_and_low_frequency_boundary",
      supportedTargetOutputs: ["L'nT,w"],
      unsupportedTargetOutputs: ["L'nT,50"],
      valuePins: [{ metric: "L'nT,w", value: 52.4 }]
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate BM closeout and Gate BN selection", () => {
    for (const path of GATE_BM_HISTORICAL_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_FILE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("Ln,w 62.2");
      expect(content, path).toContain("DeltaLw 22.4");
    }
    expect(readRepoFile("AGENTS.md")).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE);
    expect(readRepoFile("AGENTS.md")).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_FILE);

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bm-post-steel-suspended-ceiling-input-surface-revalidation-contract.test.ts"
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "steel-floor-formula-input-surface-acceptance.test.ts"
    );
  });
});

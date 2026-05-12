import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import type { PersonalUseMvpCoverageScenarioRow } from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aa";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-af";
import {
  GATE_AG_FLOOR_FORMULA_SURFACE_POLISH_RUNTIME_PINS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTION_STATUS,
  summarizePersonalUseMvpCoverageSprintGateAG
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ag";
import {
  buildGateAFSteelFloorFormulaInputSurfaceContract,
  buildSteelFloorFormulaPredictorInputFromSurface,
  STEEL_FLOOR_FORMULA_INPUT_SURFACE_LABELS
} from "./steel-floor-formula-input-surface";
import { STEEL_FLOOR_FORMULA_BASIS } from "./steel-floor-impact-formula-corridor";
import {
  GATE_B_CLT_LAYERS,
  GATE_B_TIMBER_JOIST_LAYERS
} from "./timber-clt-floor-impact-delta-lw-input-contract";
import {
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";
import {
  buildGateFTimberCltDeltaLwInputSurfaceContract,
  buildTimberCltDeltaLwPredictorInputFromSurface,
  TIMBER_CLT_DELTA_LW_INPUT_SURFACE_LABELS
} from "./timber-clt-delta-lw-input-surface";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const LAB_TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_TARGET_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const MODULAR_STEEL_FLOOR_ROWS = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 10 },
  { floorRole: "floating_screed", materialId: "cement_board", thicknessMm: 18 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4.5 },
  { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 },
  { floorRole: "ceiling_cavity", materialId: "air_gap", thicknessMm: 200 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const COMPLETE_STEEL_SURFACE = {
  loadBasisKgM2: 64,
  lowerCeilingIsolationSupportForm: "elastic_furred_channels",
  resilientLayerDynamicStiffnessMNm3: 35,
  steelCarrierDepthMm: 200,
  steelCarrierSpacingMm: 600,
  steelSupportForm: "open_web_or_rolled"
} as const;

const COMPLETE_TIMBER_SURFACE = {
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 72,
  lowerAssemblyType: "suspended_ceiling_elastic_hanger",
  lowerBoardLayerCount: 2,
  lowerBoardThicknessMm: 12.5,
  lowerCavityDepthMm: 27,
  lowerCavityFillThicknessMm: 100,
  lowerSupportClass: "furred_channels",
  resilientLayerDynamicStiffnessMNm3: 30,
  resilientLayerThicknessMm: 30,
  structuralSupportType: "timber_joists",
  upperTreatmentDensityKgM3: 1150,
  upperTreatmentThicknessMm: 25
} as const;

const COMPLETE_CLT_SURFACE = {
  baseFloorDensityKgM3: 470,
  impactSystemType: "dry_floating_floor",
  loadBasisKgM2: 90,
  lowerAssemblyType: "none",
  resilientLayerDynamicStiffnessMNm3: 40,
  resilientLayerThicknessMm: 20,
  structuralSupportType: "mass_timber_clt",
  upperFillDensityKgM3: 500,
  upperFillThicknessMm: 70,
  upperTreatmentDensityKgM3: 1150,
  upperTreatmentThicknessMm: 22
} as const;

const REQUIRED_GATE_AG_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ag.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ag-floor-formula-surface-polish-contract.test.ts",
  "packages/engine/src/steel-floor-formula-input-surface.ts",
  "packages/engine/src/timber-clt-delta-lw-input-surface.ts",
  "apps/web/features/workbench/steel-floor-formula-input-surface.ts",
  "apps/web/features/workbench/timber-clt-delta-lw-input-surface.ts",
  "apps/web/features/workbench/steel-floor-formula-input-surface-acceptance.test.ts",
  "apps/web/features/workbench/timber-clt-delta-lw-input-surface-acceptance.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(
  rows: readonly PersonalUseMvpCoverageScenarioRow[],
  id: string
): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((candidate) => candidate.id === id);

  if (!row) {
    throw new Error(`Missing Gate AG scenario row: ${id}`);
  }

  return row;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin) => [pin.metric, pin.value]));
}

describe("Personal-Use MVP Coverage Sprint Gate AG floor formula surface polish", () => {
  it("lands Gate AG as prompt/input polish and selects opening/leak STC next", () => {
    const summary = summarizePersonalUseMvpCoverageSprintGateAG();

    expect(summary).toMatchObject({
      apiShapeChange: false,
      gateAAMatrixRows: 40,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_LANDED_GATE,
      noRuntimeValueMovement: true,
      polishedFloorFormulaRows: [
        "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input",
        "floor.lightweight_steel_formula_missing_spacing.needs_input",
        "floor.heavy_concrete_floating_floor_safe_reorder.lab"
      ],
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS,
      runtimePins: GATE_AG_FLOOR_FORMULA_SURFACE_POLISH_RUNTIME_PINS,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchPromptCopyChange: true
    });
    expect(summary.steelInputLabels).toMatchObject({
      loadBasisKgM2: "Resilient-layer load basis (kg/m2)",
      resilientLayerDynamicStiffnessMNm3: "Upper resilient dynamic stiffness (MN/m3)",
      steelCarrierSpacingMm: "Steel carrier spacing (mm)"
    });
    expect(summary.timberCltInputLabels).toMatchObject({
      loadBasisKgM2: "Resilient-layer load basis (kg/m2)",
      resilientLayerDynamicStiffnessMNm3: "Upper resilient dynamic stiffness (MN/m3)",
      toppingOrFloatingLayer: "Upper floating/topping mass"
    });

    for (const path of REQUIRED_GATE_AG_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps steel, timber, CLT, and heavy-concrete floor formula values frozen", () => {
    const steelSurface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: MODULAR_STEEL_FLOOR_ROWS,
      surface: COMPLETE_STEEL_SURFACE,
      targetOutputs: LAB_TARGET_OUTPUTS
    });
    const steelResult = calculateAssembly(MODULAR_STEEL_FLOOR_ROWS, {
      impactPredictorInput: steelSurface.impactPredictorInput,
      targetOutputs: LAB_TARGET_OUTPUTS
    });

    const timberSurface = buildTimberCltDeltaLwPredictorInputFromSurface({
      layers: GATE_B_TIMBER_JOIST_LAYERS,
      surface: COMPLETE_TIMBER_SURFACE,
      targetOutputs: LAB_TARGET_OUTPUTS
    });
    const timberResult = calculateAssembly(GATE_B_TIMBER_JOIST_LAYERS, {
      impactPredictorInput: timberSurface.impactPredictorInput,
      targetOutputs: LAB_TARGET_OUTPUTS
    });

    const cltSurface = buildTimberCltDeltaLwPredictorInputFromSurface({
      layers: GATE_B_CLT_LAYERS,
      surface: COMPLETE_CLT_SURFACE,
      targetOutputs: LAB_TARGET_OUTPUTS
    });
    const cltResult = calculateAssembly(GATE_B_CLT_LAYERS, {
      impactPredictorInput: cltSurface.impactPredictorInput,
      targetOutputs: LAB_TARGET_OUTPUTS
    });

    const heavyConcrete = byId(
      buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix(),
      "floor.heavy_concrete_floating_floor_safe_reorder.lab"
    );

    expect(steelSurface.status).toBe("ready_for_formula_corridor");
    expect(steelResult.impact).toMatchObject({
      basis: STEEL_FLOOR_FORMULA_BASIS,
      DeltaLw: 22.4,
      LnW: 55.6,
      labOrField: "lab"
    });

    expect(timberSurface).toMatchObject({
      formulaBasis: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
      status: "ready_for_formula_corridor"
    });
    expect(timberResult.impact).toMatchObject({
      basis: "official_floor_system_exact_match",
      DeltaLw: 25.2,
      LnW: 51,
      metricBasis: {
        DeltaLw: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
      }
    });

    expect(cltSurface).toMatchObject({
      formulaBasis: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
      status: "ready_for_formula_corridor"
    });
    expect(cltResult.impact).toMatchObject({
      basis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      DeltaLw: 22.6,
      LnW: 50,
      metricBasis: {
        DeltaLw: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
      }
    });

    expect(heavyConcrete).toMatchObject({
      currentPosture: "family_physics",
      runtime: {
        basisId: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
        supportedTargetOutputs: ["Ln,w", "DeltaLw"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(heavyConcrete)).toEqual({ "DeltaLw": 32.6, "Ln,w": 39.2 });
  });

  it("keeps missing input, exact-source, and field/basis boundaries closed", () => {
    const missingSteelSpacing = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: MODULAR_STEEL_FLOOR_ROWS,
      surface: {
        ...COMPLETE_STEEL_SURFACE,
        steelCarrierSpacingMm: undefined
      },
      targetOutputs: LAB_TARGET_OUTPUTS
    });
    const missingTimberDynamicStiffness = buildTimberCltDeltaLwPredictorInputFromSurface({
      layers: GATE_B_TIMBER_JOIST_LAYERS,
      surface: {
        ...COMPLETE_TIMBER_SURFACE,
        resilientLayerDynamicStiffnessMNm3: undefined
      },
      targetOutputs: LAB_TARGET_OUTPUTS
    });
    const steelField = calculateAssembly(MODULAR_STEEL_FLOOR_ROWS, {
      impactPredictorInput: buildSteelFloorFormulaPredictorInputFromSurface({
        layers: MODULAR_STEEL_FLOOR_ROWS,
        surface: COMPLETE_STEEL_SURFACE,
        targetOutputs: FIELD_TARGET_OUTPUTS
      }).impactPredictorInput,
      targetOutputs: FIELD_TARGET_OUTPUTS
    });
    const timberField = buildTimberCltDeltaLwPredictorInputFromSurface({
      layers: GATE_B_TIMBER_JOIST_LAYERS,
      surface: COMPLETE_TIMBER_SURFACE,
      targetOutputs: FIELD_TARGET_OUTPUTS
    });

    expect(missingSteelSpacing).toMatchObject({
      missingPhysicalInputs: ["steelCarrierSpacingMm"],
      status: "needs_input"
    });
    expect(STEEL_FLOOR_FORMULA_INPUT_SURFACE_LABELS.steelCarrierSpacingMm).toBe(
      "Steel carrier spacing (mm)"
    );

    expect(missingTimberDynamicStiffness).toMatchObject({
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      status: "needs_input"
    });
    expect(TIMBER_CLT_DELTA_LW_INPUT_SURFACE_LABELS.resilientLayerDynamicStiffnessMNm3).toBe(
      "Upper resilient dynamic stiffness (MN/m3)"
    );

    expect(buildGateAFSteelFloorFormulaInputSurfaceContract({
      exactSourceRowAvailable: true,
      layers: MODULAR_STEEL_FLOOR_ROWS,
      surface: COMPLETE_STEEL_SURFACE,
      targetOutputs: LAB_TARGET_OUTPUTS
    })).toMatchObject({
      runtimeFormulaImpact: null,
      status: "exact_source_precedence"
    });
    expect(buildGateFTimberCltDeltaLwInputSurfaceContract({
      exactSourceRowAvailable: true,
      layers: GATE_B_TIMBER_JOIST_LAYERS,
      surface: COMPLETE_TIMBER_SURFACE,
      targetOutputs: LAB_TARGET_OUTPUTS
    })).toMatchObject({
      runtimeFormulaImpact: null,
      status: "exact_source_precedence"
    });

    expect(steelField.impact).toMatchObject({
      basis: STEEL_FLOOR_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(steelField.unsupportedTargetOutputs).toEqual(expect.arrayContaining([...FIELD_TARGET_OUTPUTS]));
    expect(steelField.impact?.LPrimeNW).toBeUndefined();
    expect(steelField.impact?.LPrimeNTw).toBeUndefined();
    expect(timberField).toMatchObject({
      missingPhysicalInputs: [],
      status: "inactive"
    });
  });

  it("keeps web prompt labels, exports, docs, and current-gate runner aligned", () => {
    const engineIndex = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const steelWorkbench = readRepoFile("apps/web/features/workbench/steel-floor-formula-input-surface.ts");
    const timberWorkbench = readRepoFile("apps/web/features/workbench/timber-clt-delta-lw-input-surface.ts");
    const routePanel = readRepoFile("apps/web/features/workbench/simple-workbench-route-panel.tsx");
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/README.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_HANDOFF.md")
    ].join("\n");

    expect(engineIndex).toContain('export * from "./calculator-personal-use-mvp-coverage-sprint-gate-ag";');
    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-ag-floor-formula-surface-polish-contract.test.ts"
    );
    expect(steelWorkbench).toContain("STEEL_FLOOR_FORMULA_INPUT_SURFACE_LABELS");
    expect(timberWorkbench).toContain("TIMBER_CLT_DELTA_LW_INPUT_SURFACE_LABELS");
    expect(routePanel).toContain("Steel carrier spacing (mm)");
    expect(routePanel).toContain("Upper resilient dynamic stiffness");
    expect(routePanel).toContain("Resilient-layer load basis");
    expect(docs).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_LANDED_GATE);
    expect(docs).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTION_STATUS);
    expect(docs).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTED_NEXT_ACTION);
    expect(docs).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTED_NEXT_FILE);
  });
});

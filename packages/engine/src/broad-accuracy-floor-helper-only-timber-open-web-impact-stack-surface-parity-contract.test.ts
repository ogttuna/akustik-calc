import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTION_STATUS
} from "./broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor";
import {
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTION_STATUS,
  buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackSurfaceParityContract
} from "./broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity";
import { calculateAssembly } from "./calculate-assembly";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "R'w",
  "DnT,w",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const HELPER_ONLY_OPEN_BOX_TIMBER = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_BOX_TIMBER_SAFE_SPLIT = [
  ...HELPER_ONLY_OPEN_BOX_TIMBER.slice(0, -1),
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_TIMBER_JOIST = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 120 },
  { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_WEB = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const R5B_DRY_PACKAGE = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_BOX_TIMBER = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_PACKAGE = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const SUPPORTED_BAND_PACKAGE = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const BUILDING_PREDICTION_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 4,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 55
} as const satisfies AirborneContext;

const REQUIRED_SURFACES = [
  "packages/engine/src/helper-only-timber-open-web-impact-stack-estimate.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity-contract.test.ts",
  "apps/web/features/workbench/helper-only-timber-open-web-impact-stack-surface.ts",
  "apps/web/features/workbench/helper-only-timber-open-web-impact-stack-surface-parity.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/validation-regime.ts",
  "apps/web/features/workbench/impact-lane-view.ts",
  "apps/web/features/workbench/impact-metric-basis-view.ts",
  "apps/web/features/workbench/impact-confidence-view.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function expectHelperOnlySurface(
  layers: readonly LayerInput[],
  expected: {
    C: number;
    CI: number;
    CI50_2500: number;
    Ctr: number;
    LnW: number;
    LnWPlusCI: number;
    Rw: number;
    fitPercent: number;
    lnwBudgetToleranceDb: number;
    rwBudgetToleranceDb: number;
    structuralFamily: string;
  }
) {
  const result = calculateAssembly(layers, {
    calculator: "dynamic",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(result.floorSystemMatch).toBeNull();
  expect(result.floorSystemEstimate).toMatchObject({
    fitPercent: expected.fitPercent,
    kind: "family_archetype",
    structuralFamily: expected.structuralFamily
  });
  expect(result.impact).toMatchObject({
    CI: expected.CI,
    CI50_2500: expected.CI50_2500,
    LnW: expected.LnW,
    LnWPlusCI: expected.LnWPlusCI,
    basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
    labOrField: "lab"
  });
  expect(result.floorSystemRatings).toMatchObject({
    C: expected.C,
    Ctr: expected.Ctr,
    Rw: expected.Rw,
    RwCtr: Number((expected.Rw + expected.C).toFixed(1)),
    basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
  });
  expect(result.dynamicImpactTrace).toMatchObject({
    fitPercent: expected.fitPercent,
    impactBasisLabel: "Helper-only timber/open-web formula corridor",
    selectedLabel: "Helper-only timber/open-web formula corridor",
    selectionKindLabel: "Scoped formula estimate",
    systemTypeLabel: "Suspended ceiling only"
  });
  expect(result.impact?.errorBudgets?.find((budget: ImpactErrorBudget) => budget.metricId === "Rw")).toMatchObject({
    estimate: expected.Rw,
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    toleranceDb: expected.rwBudgetToleranceDb
  });
  expect(result.impact?.errorBudgets?.find((budget: ImpactErrorBudget) => budget.metricId === "Ln,w")).toMatchObject({
    estimate: expected.LnW,
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    toleranceDb: expected.lnwBudgetToleranceDb
  });
  expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "L'nT,w", "IIC", "AIIC"]);

  return result;
}

describe("broad accuracy floor helper-only timber/open-web impact stack surface parity contract", () => {
  it("lands helper-only surface parity without runtime movement and selects coverage refresh", () => {
    const contract = buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackSurfaceParityContract();

    expect(contract).toMatchObject({
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
      exactPackageRawBareFieldBuildingAndAstmBoundariesStayFirst: true,
      landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_LANDED_GATE,
      runtimeMovedAtSurfaceParity: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTION_STATUS,
      surfaceTargets: [
        "output_cards",
        "route_posture",
        "confidence_provenance",
        "metric_basis_rows",
        "method_dossier",
        "local_saved_replay",
        "server_snapshot_replay",
        "calculator_api_payload",
        "impact_only_api_payload",
        "markdown_report"
      ]
    });
    expect(contract.previousRuntime).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTION_STATUS
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps helper-only runtime pins visible for open-box timber, timber joist, and open-web steel", () => {
    const contract = buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackSurfaceParityContract();
    const byId = new Map(contract.valuePins.map((pin) => [pin.id, pin]));
    const cases = [
      { layers: HELPER_ONLY_OPEN_BOX_TIMBER, pin: byId.get("open_box_timber_helper_only_lower_treatment") },
      { layers: HELPER_ONLY_OPEN_BOX_TIMBER_SAFE_SPLIT, pin: byId.get("safe_split_open_box_timber_helper_only_lower_treatment") },
      { layers: HELPER_ONLY_TIMBER_JOIST, pin: byId.get("timber_joist_helper_only_lower_treatment") },
      { layers: HELPER_ONLY_OPEN_WEB, pin: byId.get("open_web_steel_helper_only_lower_treatment") }
    ];

    for (const entry of cases) {
      expect(entry.pin).toBeDefined();
      expectHelperOnlySurface(entry.layers, {
        C: entry.pin?.expected.C ?? 0,
        CI: entry.pin?.expected.CI ?? 0,
        CI50_2500: entry.pin?.expected.CI50_2500 ?? 0,
        Ctr: entry.pin?.expected.Ctr ?? 0,
        LnW: entry.pin?.expected.LnW ?? 0,
        LnWPlusCI: entry.pin?.expected.LnWPlusCI ?? 0,
        Rw: entry.pin?.expected.Rw ?? 0,
        fitPercent: entry.pin?.expected.fitPercent ?? 0,
        lnwBudgetToleranceDb: entry.pin?.expected.lnwBudgetToleranceDb ?? 0,
        rwBudgetToleranceDb: entry.pin?.expected.rwBudgetToleranceDb ?? 0,
        structuralFamily: entry.pin?.structuralFamily ?? ""
      });
    }
  });

  it("keeps exact/package/raw-bare/direct-fixed/supported-band and non-lab boundaries outside helper-only surfaces", () => {
    const dryPackage = calculateAssembly(R5B_DRY_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const rawOpenBox = calculateAssembly(RAW_OPEN_BOX_TIMBER, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const rawOpenWeb = calculateAssembly(RAW_OPEN_WEB_300, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const directFixed = calculateAssembly(DIRECT_FIXED_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const supportedBand = calculateAssembly(SUPPORTED_BAND_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const fieldAlias = calculateAssembly(HELPER_ONLY_OPEN_WEB, {
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ["Ln,w", "L'n,w", "L'nT,w", "IIC"]
    });
    const building = calculateAssembly(HELPER_ONLY_OPEN_WEB, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ["R'w", "DnT,w", "L'n,w", "L'nT,w"]
    });
    const astm = calculateAssembly(HELPER_ONLY_OPEN_WEB, {
      calculator: "dynamic",
      targetOutputs: ["IIC", "AIIC"]
    });

    expect(dryPackage.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(rawOpenBox.impact?.basis).toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(rawOpenWeb.impact?.basis).toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
    expect(directFixed.impact?.basis).toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(supportedBand.impact?.basis).toBe(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS);

    for (const result of [dryPackage, rawOpenBox, rawOpenWeb, directFixed, supportedBand]) {
      expect(result.impact?.basis).not.toBe(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
    }

    expect(fieldAlias.impact).toMatchObject({
      LnW: 59.6,
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
      labOrField: "lab"
    });
    expect(fieldAlias.impact?.LPrimeNW).toBeUndefined();
    expect(fieldAlias.impact?.LPrimeNTw).toBeUndefined();
    expect(fieldAlias.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(fieldAlias.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "IIC"]);

    expect(building.impact?.basis).toBeUndefined();
    expect(building.supportedTargetOutputs).toEqual([]);
    expect(building.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "L'nT,w"]);
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("keeps docs, exports, web surface files, and the current gate aligned with surface parity", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(content, path).toContain(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
      expect(normalized, path).toContain("helper-only timber/open-web");
      expect(normalized, path).toContain("surface parity");
      expect(normalized, path).toContain("coverage refresh");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      "broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity"
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity-contract.test.ts"
    );
    expect(readRepoFile("apps/web/features/workbench/helper-only-timber-open-web-impact-stack-surface.ts")).toContain(
      HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
    );
    expect(readRepoFile("apps/web/features/workbench/helper-only-timber-open-web-impact-stack-surface-parity.test.ts")).toContain(
      HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
    );
  });
});

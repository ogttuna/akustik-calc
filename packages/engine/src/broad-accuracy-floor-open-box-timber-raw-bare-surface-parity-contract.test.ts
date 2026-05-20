import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberRawBareSurfaceParityContract
} from "./broad-accuracy-floor-open-box-timber-raw-bare-surface-parity";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

const RAW_BARE_370 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const RAW_BARE_SPLIT_370 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 }
] as const satisfies readonly LayerInput[];

const RAW_BARE_220 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 220 }
] as const satisfies readonly LayerInput[];

const R5B_EXACT_PACKAGE_LAYERS = [
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

const REQUIRED_SURFACES = [
  "packages/engine/src/open-box-timber-raw-bare-estimate.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-surface-parity-contract.test.ts",
  "apps/web/features/workbench/open-box-timber-raw-bare-surface.ts",
  "apps/web/features/workbench/open-box-timber-raw-bare-surface-parity.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/validation-regime.ts",
  "apps/web/features/workbench/impact-lane-view.ts",
  "apps/web/features/workbench/impact-metric-basis-view.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
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
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function expectRawBareSurface(
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
  }
) {
  const result = calculateAssembly(layers, {
    calculator: "dynamic",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(result.impact).toMatchObject({
    CI: expected.CI,
    CI50_2500: expected.CI50_2500,
    LnW: expected.LnW,
    LnWPlusCI: expected.LnWPlusCI,
    basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    labOrField: "lab"
  });
  expect(result.floorSystemRatings).toMatchObject({
    C: expected.C,
    Ctr: expected.Ctr,
    Rw: expected.Rw,
    RwCtr: Number((expected.Rw + expected.C).toFixed(1)),
    basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
  });
  expect(result.dynamicImpactTrace).toMatchObject({
    candidateRowCount: 1,
    detectedSupportFamilyLabel: "open box timber",
    fitPercent: expected.fitPercent,
    impactBasisLabel: "Raw-bare open-box timber formula corridor",
    selectedLabel: "Raw-bare open-box timber formula corridor",
    selectionKindLabel: "Scoped formula estimate",
    structuralSupportLabel: "Open-box timber",
    systemTypeLabel: "Bare floor"
  });
  expect(result.impact?.errorBudgets?.find((budget) => budget.metricId === "Ln,w")).toMatchObject({
    estimate: expected.LnW,
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    toleranceDb: 10
  });
  expect(result.impact?.errorBudgets?.find((budget) => budget.metricId === "Rw")).toMatchObject({
    estimate: expected.Rw,
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    toleranceDb: 8
  });
  expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);

  return result;
}

describe("broad accuracy floor open-box timber raw-bare surface parity contract", () => {
  it("lands raw-bare surface parity without runtime movement and selects the coverage refresh follow-up", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareSurfaceParityContract();

    expect(contract).toMatchObject({
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
      runtimeMovedAtSurfaceParity: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS,
      surfaceTargets: [
        "output_cards",
        "method_dossier",
        "local_saved_replay",
        "server_snapshot_replay",
        "calculator_api_payload",
        "impact_only_api_payload",
        "markdown_report"
      ]
    });
    expect(contract.previousRuntime).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTION_STATUS
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the 370 mm raw-bare open-box timber runtime values while naming the visible lane explicitly", () => {
    expectRawBareSurface(RAW_BARE_370, {
      C: -1.4,
      CI: -1.1,
      CI50_2500: 3.1,
      Ctr: -5.8,
      LnW: 88.2,
      LnWPlusCI: 87.1,
      Rw: 42.3,
      fitPercent: 100
    });
  });

  it("keeps split and 220 mm runtime pins unchanged under the surface parity gate", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareSurfaceParityContract();
    const byId = new Map(contract.valuePins.map((pin) => [pin.id, pin.expected]));
    const cases = [
      {
        expected: byId.get("split_185_185_raw_bare_open_box_base_only"),
        layers: RAW_BARE_SPLIT_370
      },
      {
        expected: byId.get("tagged_220mm_raw_bare_open_box_base_only"),
        layers: RAW_BARE_220
      }
    ];

    for (const entry of cases) {
      expect(entry.expected).toBeDefined();
      expectRawBareSurface(entry.layers, {
        C: entry.expected?.C ?? 0,
        CI: entry.expected?.CI ?? 0,
        CI50_2500: entry.expected?.CI50_2500 ?? 0,
        Ctr: entry.expected?.Ctr ?? 0,
        LnW: entry.expected?.LnW ?? 0,
        LnWPlusCI: entry.expected?.LnWPlusCI ?? 0,
        Rw: entry.expected?.Rw ?? 0,
        fitPercent: entry.expected?.fitPercent ?? 0
      });
    }
  });

  it("keeps exact source precedence ahead of the raw-bare surface parity lane", () => {
    const result = calculateAssembly(R5B_EXACT_PACKAGE_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(result.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(result.floorSystemEstimate).toBeNull();
    expect(result.impact?.LnW).toBe(44);
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 75,
      RwCtrSemantic: "rw_plus_c"
    });
  });

  it("keeps docs and the current-gate runner aligned with the raw-bare surface parity closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(normalizedContent, path).toContain("cards");
      expect(normalizedContent, path).toContain("method dossier");
      expect(normalizedContent, path).toContain("server snapshot replay");
      expect(normalizedContent, path).toContain("calculator api");
      expect(normalizedContent, path).toContain("impact-only api");
      expect(normalizedContent, path).toContain("markdown report");
      expect(normalizedContent, path).toContain("rw 42.3");
      expect(normalizedContent, path).toContain("ln,w 88.2");
      expect(normalizedContent, path).toContain("ci,50-2500 3.1");
      expect(normalizedContent, path).toContain("+/-8 db");
      expect(normalizedContent, path).toContain("+/-10 db");
      expect(normalizedContent, path).toContain("raw-bare open-box timber");
      expect(normalizedContent, path).toContain("package-transfer");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-box-timber-raw-bare-surface-parity");
    expect(runner).toContain("broad-accuracy-floor-open-box-timber-raw-bare-surface-parity-contract.test.ts");
    expect(runner).toContain("open-box-timber-raw-bare-surface-parity.test.ts");
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTION_STATUS
} from "./broad-accuracy-floor-open-web-raw-bare-runtime-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebRawBareSurfaceParityContract
} from "./broad-accuracy-floor-open-web-raw-bare-surface-parity";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "R'w",
  "DnT,w",
  "L'n,w",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_SAFE_SPLIT = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 150 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_400 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 }
] as const satisfies readonly LayerInput[];

const UBIQ_FL26_EXACT_PACKAGE = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_PACKAGE = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const REQUIRED_SURFACES = [
  "packages/engine/src/open-web-raw-bare-estimate.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-surface-parity-contract.test.ts",
  "apps/web/features/workbench/open-web-raw-bare-surface.ts",
  "apps/web/features/workbench/open-web-raw-bare-surface-parity.test.ts",
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
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-20_BROAD_ACCURACY_REVALIDATION_AND_OPEN_BOX_FRAGMENTATION_PLAN.md"
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

  expect(result.floorSystemMatch).toBeNull();
  expect(result.floorSystemEstimate).toMatchObject({
    fitPercent: expected.fitPercent,
    kind: "family_archetype",
    structuralFamily: "open-web steel raw-bare"
  });
  expect(result.impact).toMatchObject({
    CI: expected.CI,
    CI50_2500: expected.CI50_2500,
    LnW: expected.LnW,
    LnWPlusCI: expected.LnWPlusCI,
    basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
    labOrField: "lab"
  });
  expect(result.floorSystemRatings).toMatchObject({
    C: expected.C,
    Ctr: expected.Ctr,
    Rw: expected.Rw,
    RwCtr: Number((expected.Rw + expected.C).toFixed(1)),
    basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
  });
  expect(result.dynamicImpactTrace).toMatchObject({
    candidateRowCount: 1,
    detectedSupportFamilyLabel: "open-web steel",
    fitPercent: expected.fitPercent,
    impactBasisLabel: "Raw-bare open-web steel formula corridor",
    selectedLabel: "Raw-bare open-web steel formula corridor",
    selectionKindLabel: "Scoped formula estimate",
    structuralSupportLabel: "Open-web steel",
    systemTypeLabel: "Bare floor"
  });
  expect(result.impact?.errorBudgets?.find((budget: ImpactErrorBudget) => budget.metricId === "Rw")).toMatchObject({
    estimate: expected.Rw,
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    toleranceDb: 9
  });
  expect(result.impact?.errorBudgets?.find((budget: ImpactErrorBudget) => budget.metricId === "Ln,w")).toMatchObject({
    estimate: expected.LnW,
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    toleranceDb: 12
  });
  expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "IIC"]);

  return result;
}

describe("broad accuracy floor open-web raw-bare surface parity contract", () => {
  it("lands raw-bare open-web surface parity without runtime movement and selects the coverage refresh follow-up", () => {
    const contract = buildBroadAccuracyFloorOpenWebRawBareSurfaceParityContract();

    expect(contract).toMatchObject({
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
      runtimeMovedAtSurfaceParity: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS,
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
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTION_STATUS
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the 300 mm raw-bare open-web runtime values while naming the visible lane explicitly", () => {
    expectRawBareSurface(RAW_OPEN_WEB_300, {
      C: -2.2,
      CI: 1.8,
      CI50_2500: 5.2,
      Ctr: -7.8,
      LnW: 96,
      LnWPlusCI: 97.8,
      Rw: 32,
      fitPercent: 100
    });
  });

  it("keeps split and 400 mm runtime pins unchanged under the surface parity gate", () => {
    const contract = buildBroadAccuracyFloorOpenWebRawBareSurfaceParityContract();
    const byId = new Map(contract.valuePins.map((pin) => [pin.id, pin.expected]));
    const cases = [
      {
        expected: byId.get("split_150_150_raw_bare_open_web_base_only"),
        layers: RAW_OPEN_WEB_SAFE_SPLIT
      },
      {
        expected: byId.get("tagged_400mm_raw_bare_open_web_base_only"),
        layers: RAW_OPEN_WEB_400
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

  it("keeps exact package and direct-fixed open-web routes ahead of the raw-bare surface parity lane", () => {
    const exactPackage = calculateAssembly(UBIQ_FL26_EXACT_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const directFixed = calculateAssembly(DIRECT_FIXED_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(exactPackage.floorSystemMatch?.system.id).toBe("ubiq_fl26_open_web_steel_300_19mm_bare_exact_lab_2026");
    expect(exactPackage.impact?.basis).toBe("official_floor_system_exact_match");
    expect(exactPackage.floorSystemEstimate).toBeNull();
    expect(exactPackage.impact?.LnW).toBe(61);

    expect(directFixed.floorSystemEstimate?.impact.basis).toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(directFixed.impact?.basis).toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(directFixed.impact?.basis).not.toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
  });

  it("keeps docs and the current-gate runner aligned with the raw-bare open-web surface parity closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(content, path).toContain(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
      expect(normalizedContent, path).toContain("cards");
      expect(normalizedContent, path).toContain("method dossier");
      expect(normalizedContent, path).toContain("server snapshot replay");
      expect(normalizedContent, path).toContain("calculator api");
      expect(normalizedContent, path).toContain("impact-only api");
      expect(normalizedContent, path).toContain("markdown report");
      expect(normalizedContent, path).toContain("ln,w 96");
      expect(normalizedContent, path).toContain("rw 32");
      expect(normalizedContent, path).toContain("open-web raw-bare");
      expect(normalizedContent, path).toContain("ubiq inex/firestop");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-floor-open-web-raw-bare-surface-parity-contract.test.ts");
    expect(runner).toContain("open-web-raw-bare-surface-parity.test.ts");
  });
});

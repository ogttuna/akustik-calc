import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebDirectFixedLiningRuntimeContract
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor-contract.test.ts",
  "packages/engine/src/lightweight-steel-open-web-direct-fixed-lining-estimate.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/shared/src/domain/impact.ts",
  "packages/engine/src/impact-confidence.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/impact-predictor-status.ts",
  "packages/engine/src/calculate-assembly.ts",
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

const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildDirectFixedLayers(input: {
  baseThicknessMm: number;
  boardCount: 2 | 3;
  boardThicknessMm: 13 | 16;
  deckThicknessMm: 16 | 19;
  floorCoveringMaterialId?: "carpet_with_foam_underlay" | "engineered_timber_with_acoustic_underlay";
}): readonly LayerInput[] {
  return [
    ...Array.from({ length: input.boardCount }, () => ({
      floorRole: "ceiling_board",
      materialId: "firestop_board",
      thicknessMm: input.boardThicknessMm
    }) satisfies LayerInput),
    ...(input.floorCoveringMaterialId
      ? [
          {
            floorRole: "floor_covering",
            materialId: input.floorCoveringMaterialId,
            thicknessMm: input.floorCoveringMaterialId === "carpet_with_foam_underlay" ? 12 : 20
          } satisfies LayerInput
        ]
      : []),
    { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: input.deckThicknessMm },
    { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: input.baseThicknessMm }
  ];
}

function buildSupportedBandLayers(): readonly LayerInput[] {
  return [
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
    { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
    { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
    { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
    { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
    { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
  ];
}

function budgetMap(errorBudgets: readonly ImpactErrorBudget[] | undefined): Map<string, ImpactErrorBudget> {
  return new Map((errorBudgets ?? []).map((budget) => [budget.metricId, budget]));
}

function expectDirectFixedRuntime(
  layers: readonly LayerInput[],
  expected: ReturnType<typeof buildBroadAccuracyFloorOpenWebDirectFixedLiningRuntimeContract>["supportedScenarios"][number]
) {
  const result = calculateAssembly(layers, {
    calculator: "dynamic",
    targetOutputs: TARGET_OUTPUTS
  });
  const budgets = budgetMap(result.impact?.errorBudgets);

  expect(result.floorSystemMatch).toBeNull();
  expect(result.boundFloorSystemMatch).toBeNull();
  expect(result.boundFloorSystemEstimate).toBeNull();
  expect(result.floorSystemEstimate).toMatchObject({
    impact: {
      CI: expected.expectedImpact.CI,
      LnW: expected.expectedImpact.LnW,
      LnWPlusCI: expected.expectedImpact.LnWPlusCI,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
      scope: "family_estimate"
    },
    kind: "family_archetype",
    structuralFamily: "lightweight steel"
  });
  expect(result.impact?.basis).toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
  expect(result.impact?.metricBasis).toMatchObject({
    CI: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
    LnW: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
    LnWPlusCI: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
  });
  expect(result.impact?.estimateCandidateIds).toEqual(expected.sourceAnchorIds);
  expect(result.floorSystemRatings).toMatchObject({
    Rw: expected.expectedAirborne.Rw,
    RwCtr: expected.expectedAirborne.RwCtr,
    RwCtrSemantic: "rw_plus_ctr",
    basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
  });
  expect(result.supportedTargetOutputs).toEqual(TARGET_OUTPUTS);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(budgets.get("Ln,w")).toMatchObject({
    estimate: expected.expectedImpact.LnW,
    metricId: "Ln,w",
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    toleranceDb: expected.expectedToleranceBudgets.LnW
  });
  expect(budgets.get("CI")).toMatchObject({
    estimate: expected.expectedImpact.CI,
    metricId: "CI",
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    toleranceDb: expected.expectedToleranceBudgets.CI
  });
  expect(budgets.get("Ln,w+CI")).toMatchObject({
    estimate: expected.expectedImpact.LnWPlusCI,
    metricId: "Ln,w+CI",
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    toleranceDb: expected.expectedToleranceBudgets.LnWPlusCI
  });
  expect(result.warnings).toContain(
    `Published family estimate active: open-web steel direct-fixed lining interpolation at ${result.floorSystemEstimate?.fitPercent}% fit. DynEcho stayed inside the UBIQ FL-23/FL-25/FL-27 direct-fixed source grid instead of borrowing resilient suspended-ceiling rows or the broad steel blend.`
  );

  return result;
}

describe("broad accuracy floor open-web direct-fixed lining runtime corridor contract", () => {
  it("lands the runtime corridor and selects the surface-parity follow-up", () => {
    const contract = buildBroadAccuracyFloorOpenWebDirectFixedLiningRuntimeContract();

    expect(contract).toMatchObject({
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_LANDED_GATE,
      promotedRuntimeFamilies: ["UBIQ FL-23", "UBIQ FL-25", "UBIQ FL-27"],
      runtimeMovementThisGate: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTION_STATUS
    });
    expect(contract.previousFormulaCorridor).toEqual({
      landedGate: "broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_plan",
      selectedNextAction: "broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor-contract.test.ts",
      selectionStatus:
        "broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_landed_no_runtime_selected_runtime_corridor"
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes source-absent FL-23, FL-25, and FL-27 direct-fixed stacks through the same-family interpolation basis", () => {
    const scenarios = buildBroadAccuracyFloorOpenWebDirectFixedLiningRuntimeContract().supportedScenarios;

    expectDirectFixedRuntime(
      buildDirectFixedLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 13,
        deckThicknessMm: 19,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      scenarios[0]!
    );
    expectDirectFixedRuntime(
      buildDirectFixedLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 16,
        deckThicknessMm: 16
      }),
      scenarios[1]!
    );
    expectDirectFixedRuntime(
      buildDirectFixedLayers({
        baseThicknessMm: 350,
        boardCount: 3,
        boardThicknessMm: 16,
        deckThicknessMm: 19,
        floorCoveringMaterialId: "carpet_with_foam_underlay"
      }),
      scenarios[2]!
    );
  });

  it("keeps exact source rows and resilient supported-band stacks ahead of the direct-fixed runtime", () => {
    const exact = calculateAssembly(
      buildDirectFixedLayers({
        baseThicknessMm: 300,
        boardCount: 2,
        boardThicknessMm: 13,
        deckThicknessMm: 19,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS }
    );
    const supportedBand = calculateAssembly(buildSupportedBandLayers(), {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(exact.floorSystemMatch?.system.id).toBe("ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026");
    expect(exact.impact?.basis).toBe("official_floor_system_exact_match");
    expect(exact.floorSystemEstimate).toBeNull();
    expect(supportedBand.floorSystemEstimate?.impact.basis).toBe(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS);
    expect(supportedBand.impact?.basis).toBe(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS);
    expect(supportedBand.floorSystemEstimate?.impact.basis).not.toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
  });

  it("keeps out-of-band, duplicate-carrier, and field/ASTM aliases outside the direct-fixed runtime", () => {
    const outOfBand = calculateAssembly(
      buildDirectFixedLayers({
        baseThicknessMm: 450,
        boardCount: 2,
        boardThicknessMm: 13,
        deckThicknessMm: 19,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS }
    );
    const duplicateCarrier = calculateAssembly(
      [
        ...buildDirectFixedLayers({
          baseThicknessMm: 250,
          boardCount: 2,
          boardThicknessMm: 13,
          deckThicknessMm: 19,
          floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
        }),
        { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
      ],
      { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS }
    );
    const fieldAlias = calculateAssembly(
      buildDirectFixedLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 13,
        deckThicknessMm: 19,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: ["L'n,w", "IIC", "R'w", "DnT,w"] }
    );

    expect(outOfBand.impact?.basis).not.toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(outOfBand.floorSystemEstimate?.impact.basis).not.toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(duplicateCarrier.impact?.basis).not.toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(duplicateCarrier.floorSystemEstimate?.impact.basis).not.toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(fieldAlias.supportedTargetOutputs).toEqual([]);
    expect(fieldAlias.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC", "R'w", "DnT,w"]);
    expect(fieldAlias.impact?.basis).not.toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
  });

  it("keeps docs, exports, and the current-gate runner aligned with runtime closeout and selected next file", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const text = readRepoFile(path);
      const normalizedText = text.toLowerCase();

      expect(text, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_LANDED_GATE);
      expect(text, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTION_STATUS);
      expect(text, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_ACTION);
      expect(text, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_RUNTIME_SELECTED_NEXT_FILE);
      expect(text, path).toContain("FL-23/FL-25/FL-27");
      expect(text, path).toContain("Ln,w 71");
      expect(text, path).toContain("Rw 51");
      expect(text, path).toContain("+/-4 dB");
      expect(text, path).toContain("+/-3 dB");
      expect(normalizedText, path).toContain("direct-fixed");
      expect(normalizedText, path).toContain("surface parity");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor");
    expect(runner).toContain("broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor-contract.test.ts");
  });
});

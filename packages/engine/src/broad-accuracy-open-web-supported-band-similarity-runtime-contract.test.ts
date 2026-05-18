import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTION_STATUS,
  buildBroadAccuracyOpenWebSupportedBandSimilarityRuntimeContract
} from "./broad-accuracy-open-web-supported-band-similarity-runtime";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime-contract.test.ts",
  "packages/engine/src/lightweight-steel-open-web-supported-band-estimate.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/shared/src/domain/impact.ts",
  "packages/engine/src/impact-confidence.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/impact-predictor-status.ts",
  "apps/web/features/workbench/validation-regime.ts",
  "packages/engine/src/calculate-assembly.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
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

function buildOpenWebSupportedBandLayers(input: {
  baseThicknessMm: number;
  boardCount: 2 | 3;
  boardThicknessMm: number;
  floorCoveringMaterialId?: "carpet_with_foam_underlay" | "engineered_timber_with_acoustic_underlay";
}): readonly LayerInput[] {
  return [
    ...Array.from({ length: input.boardCount }, () => ({
      floorRole: "ceiling_board",
      materialId: "firestop_board",
      thicknessMm: input.boardThicknessMm
    }) satisfies LayerInput),
    { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
    { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
    ...(input.floorCoveringMaterialId
      ? [
          {
            floorRole: "floor_covering",
            materialId: input.floorCoveringMaterialId,
            thicknessMm: input.floorCoveringMaterialId === "carpet_with_foam_underlay" ? 12 : 3
          } satisfies LayerInput
        ]
      : []),
    { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
    { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: input.baseThicknessMm }
  ];
}

function expectSupportedBandRuntime(
  layers: readonly LayerInput[],
  expected: ReturnType<typeof buildBroadAccuracyOpenWebSupportedBandSimilarityRuntimeContract>["supportedScenarios"][number]
) {
  const result = calculateAssembly(layers, { targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"] });

  expect(result.floorSystemMatch).toBeNull();
  expect(result.boundFloorSystemMatch).toBeNull();
  expect(result.boundFloorSystemEstimate).toBeNull();
  expect(result.floorSystemEstimate).toMatchObject({
    fitPercent: expected.expectedFitPercent,
    impact: {
      CI: expected.expectedImpact.CI,
      LnW: expected.expectedImpact.LnW,
      LnWPlusCI: expected.expectedImpact.LnWPlusCI,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
      scope: "family_estimate"
    },
    kind: "family_archetype",
    structuralFamily: "lightweight steel"
  });
  expect(result.impact?.basis).toBe(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS);
  expect(result.impact?.metricBasis).toMatchObject({
    CI: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
    LnW: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
    LnWPlusCI: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
  });
  expect(result.floorSystemRatings).toMatchObject({
    Rw: expected.expectedAirborne.Rw,
    RwCtr: expected.expectedAirborne.RwCtr,
    RwCtrSemantic: "rw_plus_ctr",
    basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
  });
  expect(result.supportedTargetOutputs).toEqual(expected.metricsUnlocked);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.warnings).toContain(
    `Published family estimate active: open-web steel supported-band similarity at ${expected.expectedFitPercent}% fit. DynEcho stayed inside the UBIQ FL-24/FL-26 elastic suspended-ceiling source grid instead of falling back to a broad steel blend or bound-only row.`
  );

  return result;
}

describe("broad accuracy open-web supported-band similarity runtime corridor contract", () => {
  it("lands the runtime corridor and selects the surface-parity follow-up", () => {
    const contract = buildBroadAccuracyOpenWebSupportedBandSimilarityRuntimeContract();

    expect(contract).toMatchObject({
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
      landedGate: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_LANDED_GATE,
      promotedRuntimeFamilies: ["UBIQ FL-24", "UBIQ FL-26"],
      runtimeMovementThisGate: true,
      selectedNextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTION_STATUS
    });
    expect(contract.previousFloorSystemAnchor).toEqual({
      selectedNextAction: "broad_accuracy_open_web_supported_band_similarity_runtime_corridor_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime-contract.test.ts",
      selectionStatus:
        "broad_accuracy_floor_system_similarity_anchor_landed_no_runtime_selected_open_web_supported_band_runtime_corridor"
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete FL-26 timber-underlay supported-band input before the broad steel blend or bound-only lane", () => {
    const expected = buildBroadAccuracyOpenWebSupportedBandSimilarityRuntimeContract().supportedScenarios.find(
      (scenario) => scenario.id === "fl26_250mm_timber_supported_band_similarity"
    );

    expect(expected).toBeDefined();
    const result = expectSupportedBandRuntime(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      expected!
    );

    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual([
      "ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026",
      "ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026",
      "ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026",
      "ubiq_fl26_open_web_steel_200_exact_lab_2026",
      "ubiq_fl26_open_web_steel_300_exact_lab_2026",
      "ubiq_fl26_open_web_steel_400_exact_lab_2026"
    ]);
  });

  it("promotes complete FL-24 timber-underlay and FL-26 bare supported-band inputs without borrowing FL-28", () => {
    const scenarios = buildBroadAccuracyOpenWebSupportedBandSimilarityRuntimeContract().supportedScenarios;
    const fl24Timber = scenarios.find((scenario) => scenario.id === "fl24_250mm_timber_supported_band_similarity");
    const fl26Bare = scenarios.find((scenario) => scenario.id === "fl26_250mm_bare_supported_band_similarity");

    expect(fl24Timber).toBeDefined();
    expect(fl26Bare).toBeDefined();

    const fl24Result = expectSupportedBandRuntime(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 13,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      fl24Timber!
    );
    const fl26BareResult = expectSupportedBandRuntime(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 16
      }),
      fl26Bare!
    );

    expect(fl24Result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual([
      "ubiq_fl24_open_web_steel_200_16mm_exact_lab_2026",
      "ubiq_fl24_open_web_steel_300_16mm_exact_lab_2026",
      "ubiq_fl24_open_web_steel_400_16mm_exact_lab_2026",
      "ubiq_fl24_open_web_steel_200_exact_lab_2026",
      "ubiq_fl24_open_web_steel_300_exact_lab_2026",
      "ubiq_fl24_open_web_steel_400_exact_lab_2026"
    ]);
    expect(fl26BareResult.floorSystemEstimate?.impact.estimateCandidateIds).toEqual([
      "ubiq_fl26_open_web_steel_200_16mm_bare_exact_lab_2026",
      "ubiq_fl26_open_web_steel_300_16mm_bare_exact_lab_2026",
      "ubiq_fl26_open_web_steel_400_16mm_bare_exact_lab_2026",
      "ubiq_fl26_open_web_steel_200_19mm_bare_exact_lab_2026",
      "ubiq_fl26_open_web_steel_300_19mm_bare_exact_lab_2026",
      "ubiq_fl26_open_web_steel_400_19mm_bare_exact_lab_2026"
    ]);
  });

  it("keeps exact-source precedence and the existing FL-28 interpolation seed ahead of the new corridor", () => {
    const exactResult = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 300,
        boardCount: 2,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"] }
    );
    const fl28Result = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 3,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"] }
    );

    expect(exactResult.floorSystemMatch?.system.id).toBe("ubiq_fl26_open_web_steel_300_exact_lab_2026");
    expect(exactResult.impact?.basis).toBe("official_floor_system_exact_match");
    expect(exactResult.floorSystemEstimate).toBeNull();
    expect(fl28Result.floorSystemEstimate?.impact.basis).toBe(
      "predictor_lightweight_steel_fl28_interpolation_estimate"
    );
    expect(fl28Result.impact?.basis).toBe("predictor_lightweight_steel_fl28_interpolation_estimate");
    expect(fl28Result.impact?.LnW).toBe(51.5);
    expect(fl28Result.floorSystemRatings).toMatchObject({
      Rw: 63.5,
      RwCtr: 58,
      basis: "predictor_lightweight_steel_fl28_interpolation_estimate"
    });
  });

  it("keeps carpet, missing-fill, and non-lab output boundaries out of the promoted similarity corridor", () => {
    const carpetResult = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "carpet_with_foam_underlay"
      }),
      { targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"] }
    );
    const missingFillLayers = buildOpenWebSupportedBandLayers({
      baseThicknessMm: 250,
      boardCount: 2,
      boardThicknessMm: 16,
      floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
    }).filter((layer) => layer.floorRole !== "ceiling_fill");
    const missingFillResult = calculateAssembly(missingFillLayers, { targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"] });
    const fieldAliasResult = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { targetOutputs: ["L'n,w", "IIC"] }
    );

    expect(carpetResult.floorSystemEstimate?.impact.basis).not.toBe(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS);
    expect(carpetResult.impact?.basis).not.toBe(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS);
    expect(carpetResult.supportedTargetOutputs).toEqual(["Rw"]);
    expect(carpetResult.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);
    expect(missingFillResult.floorSystemEstimate).toBeNull();
    expect(missingFillResult.boundFloorSystemEstimate?.lowerBoundImpact.basis).toBe(
      "predictor_lightweight_steel_bound_interpolation_estimate"
    );
    expect(missingFillResult.unsupportedTargetOutputs).toEqual(["Ln,w+CI"]);
    expect(fieldAliasResult.supportedTargetOutputs).toEqual([]);
    expect(fieldAliasResult.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);
  });

  it("keeps docs and the current-gate runner aligned with the runtime closeout and selected next file", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);

      expect(content, path).toContain(BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTION_STATUS);
      expect(content, path).toContain(
        BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE);
      expect(content, path).toContain("FL-24/FL-26");
      expect(content, path).toContain("open-web steel supported-band similarity");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-open-web-supported-band-similarity-runtime-contract.test.ts");
  });
});

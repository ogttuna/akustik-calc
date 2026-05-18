import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS,
  buildBroadAccuracyOpenWebSupportedBandSimilarityCoverageRefreshContract
} from "./broad-accuracy-open-web-supported-band-similarity-coverage-refresh";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime-contract.test.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-surface-parity.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-surface-parity-contract.test.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh-contract.test.ts",
  "packages/engine/src/lightweight-steel-open-web-supported-band-estimate.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/calculate-assembly.ts",
  "apps/web/features/workbench/open-web-supported-band-similarity-surface.ts",
  "apps/web/features/workbench/open-web-supported-band-similarity-surface-parity.test.ts",
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
  includeCeilingFill?: boolean;
}): readonly LayerInput[] {
  return [
    ...Array.from({ length: input.boardCount }, () => ({
      floorRole: "ceiling_board",
      materialId: "firestop_board",
      thicknessMm: input.boardThicknessMm
    }) satisfies LayerInput),
    ...(input.includeCeilingFill === false
      ? []
      : [{ floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 } satisfies LayerInput]),
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

describe("broad accuracy open-web supported-band similarity coverage refresh contract", () => {
  it("lands the coverage refresh matrix without moving runtime and selects the wall multileaf solver lane", () => {
    const contract = buildBroadAccuracyOpenWebSupportedBandSimilarityCoverageRefreshContract();

    expect(contract).toMatchObject({
      landedGate: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS
    });
    expect(contract.previousSurfaceParity).toEqual({
      landedGate: "broad_accuracy_open_web_supported_band_similarity_surface_parity_plan",
      selectedNextAction: "broad_accuracy_open_web_supported_band_similarity_coverage_refresh_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh-contract.test.ts",
      selectionStatus:
        "broad_accuracy_open_web_supported_band_similarity_surface_parity_landed_selected_coverage_refresh"
    });
    expect(contract.remainingFollowups).toEqual([
      {
        id: "open_web_steel_direct_fixed_lining_similarity",
        reason: "direct-fixed lower support needs its own transfer owner before runtime promotion",
        selectedNow: false
      },
      {
        id: "open_box_timber_measured_similarity",
        reason: "open-box timber measured rows need a separate wet/dry hybrid owner and must not borrow open-web steel",
        selectedNow: false
      }
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("summarizes supported, exact, blocked, and follow-up rows with no readiness inflation", () => {
    const contract = buildBroadAccuracyOpenWebSupportedBandSimilarityCoverageRefreshContract();

    expect(contract.summary).toEqual({
      basisBoundaryRowIds: ["floor.open_web_supported_band_field_lnw.boundary"],
      correctlyBlockedRowIds: [
        "floor.open_web_supported_band_missing_fill.needs_input",
        "floor.open_web_supported_band_carpet_bound.unsupported",
        "floor.open_web_supported_band_astm_iic.unsupported"
      ],
      exactSourcePrecedenceRowIds: ["floor.open_web_supported_band_fl26_300_exact_precedence.lab"],
      failureClassCounts: {
        basis_boundary: 1,
        correct_block: 1,
        coverage_followup: 3,
        none: 5,
        unsupported_metric: 2
      },
      noRuntimeValueMovement: true,
      rankedFollowupRowIds: [
        "floor.open_web_direct_fixed_lining.followup",
        "floor.open_box_timber_similarity.followup",
        "wall.multileaf_triple_leaf_screening_blend.next"
      ],
      rowCount: 12,
      selectedNextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      supportedRuntimeRowIds: [
        "floor.open_web_supported_band_fl26_250_timber.lab",
        "floor.open_web_supported_band_fl24_250_timber.lab",
        "floor.open_web_supported_band_fl26_250_bare.lab"
      ]
    });
    expect(contract.matrixRows.find((row) => row.id === "wall.multileaf_triple_leaf_screening_blend.next")).toMatchObject(
      {
        currentPosture: "followup_ranked",
        missingPhysicalInputs: ["calibratedTripleLeafFrequencySolverOwner", "screeningBlendRetirementContract"],
        nextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
        requestedMetrics: ["Rw", "STC", "C", "Ctr"],
        route: "wall"
      }
    );
  });

  it("keeps supported-band runtime values and exact-source precedence pinned through public calculator entry points", () => {
    const fl26TimberResult = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS }
    );
    const fl24TimberResult = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 13,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI"] }
    );
    const fl26BareResult = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 16
      }),
      { calculator: "dynamic", targetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI"] }
    );
    const exactResult = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 300,
        boardCount: 2,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"] }
    );
    const fl28Result = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 3,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"] }
    );

    expect(fl26TimberResult.impact).toMatchObject({
      CI: -1.5,
      LnW: 53.5,
      LnWPlusCI: 52,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
    });
    expect(fl26TimberResult.floorSystemRatings).toMatchObject({
      Rw: 61.5,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
    });
    expect(fl26TimberResult.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "CI", "Ln,w+CI"]);
    expect(fl26TimberResult.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);

    expect(fl24TimberResult.impact).toMatchObject({
      CI: -1.5,
      LnW: 54.5,
      LnWPlusCI: 53,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
    });
    expect(fl24TimberResult.floorSystemRatings).toMatchObject({
      Rw: 60.5,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
    });

    expect(fl26BareResult.impact).toMatchObject({
      CI: -1.5,
      LnW: 61.5,
      LnWPlusCI: 60,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
    });
    expect(fl26BareResult.floorSystemRatings).toMatchObject({
      Rw: 61.5,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
    });

    expect(exactResult.floorSystemMatch?.system.id).toBe("ubiq_fl26_open_web_steel_300_exact_lab_2026");
    expect(exactResult.impact).toMatchObject({
      LnW: 53,
      LnWPlusCI: 51,
      basis: "official_floor_system_exact_match"
    });
    expect(exactResult.floorSystemRatings).toMatchObject({
      Rw: 62,
      basis: "official_floor_system_exact_match"
    });
    expect(exactResult.floorSystemEstimate).toBeNull();

    expect(fl28Result.impact).toMatchObject({
      LnW: 51.5,
      LnWPlusCI: 50,
      basis: "predictor_lightweight_steel_fl28_interpolation_estimate"
    });
    expect(fl28Result.floorSystemRatings).toMatchObject({
      Rw: 63.5,
      basis: "predictor_lightweight_steel_fl28_interpolation_estimate"
    });
  });

  it("keeps carpet, missing-fill, field, and ASTM/IIC requests out of the promoted lab similarity answer", () => {
    const carpetResult = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "carpet_with_foam_underlay"
      }),
      { calculator: "dynamic", targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"] }
    );
    const missingFillResult = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay",
        includeCeilingFill: false
      }),
      { calculator: "dynamic", targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"] }
    );
    const fieldAliasResult = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: ["L'n,w"] }
    );
    const astmAliasResult = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: ["IIC"] }
    );

    expect(carpetResult.impact?.basis).not.toBe(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS);
    expect(carpetResult.supportedTargetOutputs).toEqual(["Rw"]);
    expect(carpetResult.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);

    expect(missingFillResult.floorSystemEstimate).toBeNull();
    expect(missingFillResult.boundFloorSystemEstimate?.lowerBoundImpact.basis).toBe(
      "predictor_lightweight_steel_bound_interpolation_estimate"
    );
    expect(missingFillResult.impact?.basis).not.toBe(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS);
    expect(missingFillResult.unsupportedTargetOutputs).toEqual(["Ln,w+CI"]);

    expect(fieldAliasResult.supportedTargetOutputs).toEqual([]);
    expect(fieldAliasResult.unsupportedTargetOutputs).toEqual(["L'n,w"]);
    expect(astmAliasResult.supportedTargetOutputs).toEqual([]);
    expect(astmAliasResult.unsupportedTargetOutputs).toEqual(["IIC"]);
  });

  it("keeps docs and the current-gate runner aligned with the coverage refresh closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS);
      expect(content, path).toContain(
        BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE);
      expect(normalizedContent, path).toContain("wall multileaf triple-leaf calibrated solver");
      expect(normalizedContent, path).toContain("coverage refresh");
      expect(normalizedContent, path).toContain("direct-fixed");
      expect(normalizedContent, path).toContain("open-box");
      expect(normalizedContent, path).toContain("ln,w 53.5");
      expect(normalizedContent, path).toContain("open-web steel supported-band similarity");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-open-web-supported-band-similarity-coverage-refresh-contract.test.ts");
  });
});

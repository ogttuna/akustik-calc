import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebDirectFixedLiningCoverageRefreshContract
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const DIRECT_FIXED_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const BROAD_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "IIC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh-contract.test.ts",
  "packages/engine/src/lightweight-steel-open-web-direct-fixed-lining-estimate.ts",
  "apps/web/features/workbench/open-web-direct-fixed-lining-surface.ts",
  "apps/web/features/workbench/open-web-direct-fixed-lining-surface-parity.test.ts",
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
    { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 3 },
    { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
    { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
  ];
}

describe("broad accuracy floor open-web direct-fixed lining coverage refresh contract", () => {
  it("lands the coverage refresh matrix without runtime movement and selects open-box timber transfer ownership", () => {
    const contract = buildBroadAccuracyFloorOpenWebDirectFixedLiningCoverageRefreshContract();

    expect(contract).toMatchObject({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTION_STATUS
    });
    expect(contract.previousSurfaceParity).toEqual({
      landedGate: "broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_plan",
      selectedNextAction: "broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh-contract.test.ts",
      selectionStatus:
        "broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_landed_selected_coverage_refresh"
    });
    expect(contract.remainingFollowups).toEqual([
      {
        id: "open_box_timber_measured_similarity",
        reason:
          "selected now because direct-fixed open-web is closed and open-box timber is the remaining floor similarity lane with exact packaged evidence but no safe measured-similarity transfer owner",
        selectedNow: true
      },
      {
        id: "airborne_or_impact_field_building_adapters",
        reason: "not selected here because lab direct-fixed evidence cannot alias to field or building metrics",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_rating_curve_owner",
        reason: "not selected here because ISO Ln,w/CI single-number evidence cannot create ASTM IIC/AIIC ratings",
        selectedNow: false
      }
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("summarizes supported, exact, separate-lane, blocked, and follow-up rows without readiness inflation", () => {
    const contract = buildBroadAccuracyFloorOpenWebDirectFixedLiningCoverageRefreshContract();

    expect(contract.summary).toEqual({
      basisBoundaryRowIds: [
        "floor.open_web_direct_fixed_field_lnw.boundary",
        "floor.open_web_direct_fixed_airborne_field.boundary"
      ],
      correctlyBlockedRowIds: [
        "floor.open_web_direct_fixed_out_of_band_depth.boundary",
        "floor.open_web_direct_fixed_duplicate_carrier.boundary",
        "floor.open_web_direct_fixed_astm_iic.unsupported"
      ],
      exactPrecedenceBoundaryRowIds: ["floor.open_web_direct_fixed_fl23_300_timber.exact_precedence"],
      failureClassCounts: {
        basis_boundary: 2,
        correct_block: 3,
        coverage_followup: 1,
        exact_precedence_boundary: 1,
        none: 3,
        separate_lane_boundary: 1
      },
      noRuntimeValueMovement: true,
      rankedFollowupRowIds: ["floor.open_box_timber_similarity.next"],
      rowCount: 11,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      separateLaneBoundaryRowIds: ["floor.open_web_supported_band_fl26_250_timber.separate_lane"],
      supportedRuntimeRowIds: [
        "floor.open_web_direct_fixed_fl23_250_timber.lab",
        "floor.open_web_direct_fixed_fl25_250_bare.lab",
        "floor.open_web_direct_fixed_fl27_350_carpet.lab"
      ]
    });
    expect(contract.matrixRows.find((row) => row.id === "floor.open_box_timber_similarity.next")).toMatchObject({
      currentPosture: "followup_ranked",
      missingPhysicalInputs: [
        "openBoxTimberWetDryHybridInteractionOwner",
        "samePackageFragmentationBoundary",
        "rawBareCarrierReopeningGuard"
      ],
      nextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      requestedMetrics: ["Rw", "Ln,w", "Ln,w+CI"]
    });
  });

  it("keeps supported direct-fixed runtime pins, exact precedence, and supported-band separation through public calculator entry points", () => {
    const fl23 = calculateAssembly(
      buildDirectFixedLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 13,
        deckThicknessMm: 19,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: BROAD_OUTPUTS }
    );
    const fl25 = calculateAssembly(
      buildDirectFixedLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 16,
        deckThicknessMm: 16
      }),
      { calculator: "dynamic", targetOutputs: DIRECT_FIXED_OUTPUTS }
    );
    const fl27 = calculateAssembly(
      buildDirectFixedLayers({
        baseThicknessMm: 350,
        boardCount: 3,
        boardThicknessMm: 16,
        deckThicknessMm: 19,
        floorCoveringMaterialId: "carpet_with_foam_underlay"
      }),
      { calculator: "dynamic", targetOutputs: DIRECT_FIXED_OUTPUTS }
    );
    const exact = calculateAssembly(
      buildDirectFixedLayers({
        baseThicknessMm: 300,
        boardCount: 2,
        boardThicknessMm: 13,
        deckThicknessMm: 19,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: DIRECT_FIXED_OUTPUTS }
    );
    const supportedBand = calculateAssembly(buildSupportedBandLayers(), {
      calculator: "dynamic",
      targetOutputs: DIRECT_FIXED_OUTPUTS
    });

    expect(fl23.impact).toMatchObject({
      CI: -0.5,
      LnW: 71,
      LnWPlusCI: 70.5,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
    });
    expect(fl23.floorSystemRatings).toMatchObject({
      Rw: 51,
      RwCtr: 43.5,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
    });
    expect(fl23.supportedTargetOutputs).toEqual(["Ln,w", "CI", "Ln,w+CI"]);
    expect(fl23.unsupportedTargetOutputs).toEqual(["Rw", "L'n,w", "IIC", "R'w", "DnT,w"]);

    expect(fl25.impact).toMatchObject({
      CI: -0.5,
      LnW: 77,
      LnWPlusCI: 76.5,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
    });
    expect(fl25.floorSystemRatings).toMatchObject({
      Rw: 51,
      RwCtr: 43.5,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
    });

    expect(fl27.impact).toMatchObject({
      CI: -1,
      LnW: 63,
      LnWPlusCI: 62,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
    });
    expect(fl27.floorSystemRatings).toMatchObject({
      Rw: 54.5,
      RwCtr: 47.5,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
    });

    expect(exact.floorSystemMatch?.system.id).toBe("ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026");
    expect(exact.impact).toMatchObject({
      CI: -1,
      LnW: 71,
      LnWPlusCI: 70,
      basis: "official_floor_system_exact_match"
    });
    expect(exact.floorSystemRatings).toMatchObject({
      Rw: 51,
      RwCtr: 44,
      basis: "official_floor_system_exact_match"
    });
    expect(exact.floorSystemEstimate).toBeNull();

    expect(supportedBand.impact).toMatchObject({
      CI: -1.5,
      LnW: 53.5,
      LnWPlusCI: 52,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
    });
    expect(supportedBand.floorSystemRatings).toMatchObject({
      Rw: 61.5,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
    });
  });

  it("keeps out-of-band, duplicate-carrier, field, and ASTM/IIC requests out of the direct-fixed lane", () => {
    const outOfBand = calculateAssembly(
      buildDirectFixedLayers({
        baseThicknessMm: 450,
        boardCount: 2,
        boardThicknessMm: 13,
        deckThicknessMm: 19,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: DIRECT_FIXED_OUTPUTS }
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
        { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 } satisfies LayerInput
      ],
      { calculator: "dynamic", targetOutputs: DIRECT_FIXED_OUTPUTS }
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

    expect(outOfBand.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(outOfBand.impact?.basis).not.toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(duplicateCarrier.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(duplicateCarrier.impact?.basis).not.toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(fieldAlias.impact).toBeNull();
    expect(fieldAlias.supportedTargetOutputs).toEqual([]);
    expect(fieldAlias.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC", "R'w", "DnT,w"]);
  });

  it("keeps docs, exports, and the current-gate runner aligned with the coverage refresh closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTION_STATUS);
      expect(content, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE);
      expect(normalizedContent, path).toContain("coverage refresh");
      expect(normalizedContent, path).toContain("direct-fixed");
      expect(normalizedContent, path).toContain("fl-23/fl-25/fl-27");
      expect(normalizedContent, path).toContain("ln,w 71");
      expect(normalizedContent, path).toContain("ln,w 77");
      expect(normalizedContent, path).toContain("ln,w 63");
      expect(normalizedWhitespaceContent, path).toContain("exact source precedence");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
      expect(normalizedContent, path).toContain("open-box timber similarity transfer owner");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh");
    expect(runner).toContain("broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh-contract.test.ts");
  });
});

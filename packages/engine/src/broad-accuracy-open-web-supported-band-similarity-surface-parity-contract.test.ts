import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS,
  buildBroadAccuracyOpenWebSupportedBandSimilaritySurfaceParityContract
} from "./broad-accuracy-open-web-supported-band-similarity-surface-parity";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime-contract.test.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-surface-parity.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-surface-parity-contract.test.ts",
  "packages/engine/src/lightweight-steel-open-web-supported-band-estimate.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/shared/src/domain/impact.ts",
  "apps/web/features/workbench/open-web-supported-band-similarity-surface.ts",
  "apps/web/features/workbench/open-web-supported-band-similarity-surface-parity.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/validation-regime.ts",
  "apps/web/features/workbench/impact-lane-view.ts",
  "apps/web/features/workbench/impact-metric-basis-view.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
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
  boardThicknessMm: number;
  floorCoveringMaterialId?: "engineered_timber_with_acoustic_underlay";
}): readonly LayerInput[] {
  return [
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: input.boardThicknessMm },
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: input.boardThicknessMm },
    { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
    { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
    ...(input.floorCoveringMaterialId
      ? [
          {
            floorRole: "floor_covering",
            materialId: input.floorCoveringMaterialId,
            thicknessMm: 3
          } satisfies LayerInput
        ]
      : []),
    { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
    { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: input.baseThicknessMm }
  ];
}

describe("broad accuracy open-web supported-band similarity surface parity contract", () => {
  it("lands the surface parity gate without runtime movement and selects the coverage refresh follow-up", () => {
    const contract = buildBroadAccuracyOpenWebSupportedBandSimilaritySurfaceParityContract();

    expect(contract).toMatchObject({
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
      landedGate: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_LANDED_GATE,
      runtimeMovedAtSurfaceParity: false,
      selectedNextAction: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS,
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
      landedGate: "broad_accuracy_open_web_supported_band_similarity_runtime_corridor_plan",
      selectedNextAction: "broad_accuracy_open_web_supported_band_similarity_surface_parity_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-surface-parity-contract.test.ts",
      selectionStatus:
        "broad_accuracy_open_web_supported_band_similarity_runtime_corridor_landed_selected_surface_parity"
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the FL-26 supported-band runtime values while naming the visible lane explicitly", () => {
    const result = calculateAssembly(
      buildOpenWebSupportedBandLayers({
        baseThicknessMm: 250,
        boardThicknessMm: 16,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS }
    );

    expect(result.impact).toMatchObject({
      CI: -1.5,
      LnW: 53.5,
      LnWPlusCI: 52,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
      labOrField: "lab"
    });
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 61.5,
      RwCtr: 56,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
    });
    expect(result.dynamicImpactTrace).toMatchObject({
      candidateRowCount: 6,
      detectedSupportFamilyLabel: "steel joists",
      fitPercent: 89.5,
      impactBasisLabel: "Open-web steel supported-band similarity",
      selectedLabel: "Open-web steel supported-band similarity",
      selectionKindLabel: "Published family estimate",
      supportFormLabel: "Open-web or rolled",
      systemTypeLabel: "Combined upper and lower system"
    });
    expect(result.dynamicImpactTrace?.notes).toContain(
      "Open-web steel supported-band similarity stayed inside the UBIQ FL-24/FL-26 elastic suspended-ceiling source grid."
    );
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "CI", "Ln,w+CI"]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);
  });

  it("keeps all runtime pins unchanged for FL-24 timber, FL-26 timber, and FL-26 bare cases", () => {
    const contract = buildBroadAccuracyOpenWebSupportedBandSimilaritySurfaceParityContract();
    const byId = new Map(contract.valuePins.map((pin) => [pin.id, pin.expected]));
    const cases = [
      {
        expected: byId.get("fl26_250mm_timber"),
        layers: buildOpenWebSupportedBandLayers({
          baseThicknessMm: 250,
          boardThicknessMm: 16,
          floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
        })
      },
      {
        expected: byId.get("fl24_250mm_timber"),
        layers: buildOpenWebSupportedBandLayers({
          baseThicknessMm: 250,
          boardThicknessMm: 13,
          floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
        })
      },
      {
        expected: byId.get("fl26_250mm_bare"),
        layers: buildOpenWebSupportedBandLayers({
          baseThicknessMm: 250,
          boardThicknessMm: 16
        })
      }
    ];

    for (const entry of cases) {
      expect(entry.expected).toBeDefined();
      const result = calculateAssembly(entry.layers, {
        calculator: "dynamic",
        targetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI"]
      });

      expect(result.impact).toMatchObject({
        CI: entry.expected?.CI,
        LnW: entry.expected?.LnW,
        LnWPlusCI: entry.expected?.LnWPlusCI,
        basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
      });
      expect(result.floorSystemRatings).toMatchObject({
        Rw: entry.expected?.Rw,
        basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
      });
      expect(result.dynamicImpactTrace?.fitPercent).toBe(entry.expected?.fitPercent);
    }
  });

  it("keeps docs and the current-gate runner aligned with the surface parity closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(
        BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(BROAD_ACCURACY_OPEN_WEB_SUPPORTED_BAND_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(normalizedContent, path).toContain("cards, method");
      expect(normalizedContent, path).toContain("dossier, saved");
      expect(normalizedContent, path).toContain("server snapshot replay");
      expect(normalizedContent, path).toContain("calculator api");
      expect(normalizedContent, path).toContain("impact-only api");
      expect(normalizedContent, path).toContain("markdown");
      expect(normalizedContent, path).toContain("report");
      expect(normalizedContent, path).toContain("ln,w 53.5");
      expect(normalizedContent, path).toContain("open-web steel");
      expect(normalizedContent, path).toContain("supported-band similarity");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-open-web-supported-band-similarity-surface-parity-contract.test.ts");
    expect(runner).toContain("open-web-supported-band-similarity-surface-parity.test.ts");
  });
});

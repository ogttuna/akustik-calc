import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebDirectFixedLiningSurfaceParityContract
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity-contract.test.ts",
  "packages/engine/src/lightweight-steel-open-web-direct-fixed-lining-estimate.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/shared/src/domain/impact.ts",
  "apps/web/features/workbench/open-web-direct-fixed-lining-surface.ts",
  "apps/web/features/workbench/open-web-direct-fixed-lining-surface-parity.test.ts",
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

describe("broad accuracy floor open-web direct-fixed lining surface parity contract", () => {
  it("lands the surface parity gate without runtime movement and selects the coverage refresh follow-up", () => {
    const contract = buildBroadAccuracyFloorOpenWebDirectFixedLiningSurfaceParityContract();

    expect(contract).toMatchObject({
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_LANDED_GATE,
      runtimeMovedAtSurfaceParity: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTION_STATUS,
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
      landedGate: "broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_plan",
      selectedNextAction: "broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity-contract.test.ts",
      selectionStatus:
        "broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_landed_selected_surface_parity"
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the direct-fixed runtime values while naming the visible lane explicitly", () => {
    const result = calculateAssembly(
      buildDirectFixedLayers({
        baseThicknessMm: 250,
        boardCount: 2,
        boardThicknessMm: 13,
        deckThicknessMm: 19,
        floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
      }),
      { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS }
    );

    expect(result.impact).toMatchObject({
      CI: -0.5,
      LnW: 71,
      LnWPlusCI: 70.5,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
      labOrField: "lab"
    });
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 51,
      RwCtr: 43.5,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
    });
    expect(result.dynamicImpactTrace).toMatchObject({
      candidateRowCount: 2,
      detectedSupportFamilyLabel: "steel joists",
      fitPercent: 92,
      impactBasisLabel: "Open-web steel direct-fixed lining interpolation",
      selectedLabel: "Open-web steel direct-fixed lining interpolation",
      selectionKindLabel: "Published family estimate",
      supportFormLabel: "Open-web or rolled",
      systemTypeLabel: "Combined upper and lower system"
    });
    expect(result.dynamicImpactTrace?.notes).toContain(
      "Open-web steel direct-fixed lining interpolation stayed inside the UBIQ FL-23/FL-25/FL-27 direct-fixed source grid."
    );
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "CI", "Ln,w+CI"]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);
  });

  it("keeps all runtime pins unchanged for FL-23 timber, FL-25 bare, and FL-27 carpet cases", () => {
    const contract = buildBroadAccuracyFloorOpenWebDirectFixedLiningSurfaceParityContract();
    const byId = new Map(contract.valuePins.map((pin) => [pin.id, pin.expected]));
    const cases = [
      {
        expected: byId.get("fl23_250mm_19mm_timber_direct_fixed"),
        layers: buildDirectFixedLayers({
          baseThicknessMm: 250,
          boardCount: 2,
          boardThicknessMm: 13,
          deckThicknessMm: 19,
          floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay"
        })
      },
      {
        expected: byId.get("fl25_250mm_16mm_bare_direct_fixed"),
        layers: buildDirectFixedLayers({
          baseThicknessMm: 250,
          boardCount: 2,
          boardThicknessMm: 16,
          deckThicknessMm: 16
        })
      },
      {
        expected: byId.get("fl27_350mm_19mm_carpet_direct_fixed"),
        layers: buildDirectFixedLayers({
          baseThicknessMm: 350,
          boardCount: 3,
          boardThicknessMm: 16,
          deckThicknessMm: 19,
          floorCoveringMaterialId: "carpet_with_foam_underlay"
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
        basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
      });
      expect(result.floorSystemRatings).toMatchObject({
        Rw: entry.expected?.Rw,
        RwCtr: entry.expected?.RwCtr,
        basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
      });
      expect(result.dynamicImpactTrace?.fitPercent).toBe(entry.expected?.fitPercent);
    }
  });

  it("keeps docs and the current-gate runner aligned with the surface parity closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(normalizedContent, path).toContain("cards");
      expect(normalizedContent, path).toContain("method dossier");
      expect(normalizedContent, path).toContain("server snapshot replay");
      expect(normalizedContent, path).toContain("calculator api");
      expect(normalizedContent, path).toContain("impact-only api");
      expect(normalizedContent, path).toContain("markdown report");
      expect(normalizedContent, path).toContain("ln,w 71");
      expect(normalizedContent, path).toContain("direct-fixed");
      expect(normalizedContent, path).toContain("fl-23/fl-25/fl-27");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity-contract.test.ts");
    expect(runner).toContain("open-web-direct-fixed-lining-surface-parity.test.ts");
  });
});

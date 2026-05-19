import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-similarity-runtime-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberSimilaritySurfaceParityContract
} from "./broad-accuracy-floor-open-box-timber-similarity-surface-parity";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-surface-parity-contract.test.ts",
  "packages/engine/src/open-box-timber-similarity-estimate.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/shared/src/domain/impact.ts",
  "apps/web/features/workbench/open-box-timber-similarity-surface.ts",
  "apps/web/features/workbench/open-box-timber-similarity-surface-parity.test.ts",
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

const DRY_GYPSUM_FIBER_SOURCE_ABSENT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 32 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 45 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const THIN_LAMINATE_SOURCE_ABSENT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const REINFORCED_CEILING_SOURCE_ABSENT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const R5B_EXACT_LAYERS = [
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy floor open-box timber similarity surface parity contract", () => {
  it("lands surface parity without runtime movement and selects the coverage refresh follow-up", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberSimilaritySurfaceParityContract();

    expect(contract).toMatchObject({
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_LANDED_GATE,
      runtimeMovedAtSurfaceParity: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS,
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
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTION_STATUS
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the dry gypsum-fiber open-box timber runtime values while naming the visible lane explicitly", () => {
    const result = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(result.impact).toMatchObject({
      CI: 1.3,
      CI50_2500: 3.3,
      LnW: 50.8,
      LnWPlusCI: 52,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      labOrField: "lab"
    });
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 66,
      RwCtr: 62.1,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(result.dynamicImpactTrace).toMatchObject({
      candidateRowCount: 4,
      detectedSupportFamilyLabel: "open box timber",
      fitPercent: 85,
      impactBasisLabel: "Open-box timber package-transfer corridor",
      selectedLabel: "Open-box timber package-transfer corridor",
      selectionKindLabel: "Published family estimate",
      structuralSupportLabel: "Open-box timber",
      systemTypeLabel: "Combined upper and lower system"
    });
    expect(result.dynamicImpactTrace?.notes).toContain(
      "Open-box timber package-transfer corridor stayed inside the TUAS measured open-box timber packet family."
    );
    expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);
  });

  it("keeps all runtime pins unchanged for dry, thin, and reinforced open-box timber packets", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberSimilaritySurfaceParityContract();
    const byId = new Map(contract.valuePins.map((pin) => [pin.id, pin.expected]));
    const cases = [
      {
        expected: byId.get("source_absent_dry_gypsum_fiber_upper_mid_packet"),
        layers: DRY_GYPSUM_FIBER_SOURCE_ABSENT
      },
      {
        expected: byId.get("source_absent_thin_laminate_eps_no_upper_packet"),
        layers: THIN_LAMINATE_SOURCE_ABSENT
      },
      {
        expected: byId.get("source_absent_reinforced_ceiling_laminate_packet"),
        layers: REINFORCED_CEILING_SOURCE_ABSENT
      }
    ];

    for (const entry of cases) {
      expect(entry.expected).toBeDefined();
      const result = calculateAssembly(entry.layers, {
        calculator: "dynamic",
        targetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
      });

      expect(result.impact).toMatchObject({
        CI: entry.expected?.CI,
        CI50_2500: entry.expected?.CI50_2500,
        LnW: entry.expected?.LnW,
        LnWPlusCI: entry.expected?.LnWPlusCI,
        basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
      });
      expect(result.floorSystemRatings).toMatchObject({
        Rw: entry.expected?.Rw,
        RwCtr: entry.expected?.RwPlusC,
        basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
      });
      expect(result.dynamicImpactTrace?.fitPercent).toBe(entry.expected?.fitPercent);
    }
  });

  it("keeps exact source precedence ahead of the visible surface parity lane", () => {
    const result = calculateAssembly(R5B_EXACT_LAYERS, {
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

  it("keeps docs and the current-gate runner aligned with the surface parity closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(normalizedContent, path).toContain("cards");
      expect(normalizedContent, path).toContain("method dossier");
      expect(normalizedContent, path).toContain("server snapshot replay");
      expect(normalizedContent, path).toContain("calculator api");
      expect(normalizedContent, path).toContain("impact-only api");
      expect(normalizedContent, path).toContain("markdown report");
      expect(normalizedContent, path).toContain("ln,w 50.8");
      expect(normalizedContent, path).toContain("ci,50-2500 3.3");
      expect(normalizedContent, path).toContain("rw 66");
      expect(normalizedContent, path).toContain("open-box timber");
      expect(normalizedContent, path).toContain("package-transfer");
      expect(normalizedContent, path).toContain("exact-only hybrid");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-box-timber-similarity-surface-parity");
    expect(runner).toContain("broad-accuracy-floor-open-box-timber-similarity-surface-parity-contract.test.ts");
    expect(runner).toContain("open-box-timber-similarity-surface-parity.test.ts");
  });
});

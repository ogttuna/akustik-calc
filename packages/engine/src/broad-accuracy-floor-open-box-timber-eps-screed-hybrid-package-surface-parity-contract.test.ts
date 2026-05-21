import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactFloorSystem,
  FloorRole,
  FloorSystemRoleCriteria,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSurfaceParityContract
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

const ROLE_ORDER = [
  "ceiling_board",
  "ceiling_fill",
  "ceiling_cavity",
  "floor_covering",
  "resilient_layer",
  "upper_fill",
  "floating_screed",
  "base_structure"
] as const satisfies readonly FloorRole[];

const EPS_SCREED_HYBRID_VARIANT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 43 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const EPS_SCREED_HYBRID_SAFE_SPLIT_VARIANT = [
  ...EPS_SCREED_HYBRID_VARIANT.slice(0, -1),
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 }
] as const satisfies readonly LayerInput[];

const DRY_PACKAGE_LAYERS = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 53 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 63 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const REQUIRED_SURFACES = [
  "packages/engine/src/open-box-timber-eps-screed-hybrid-package-estimate.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity-contract.test.ts",
  "apps/web/features/workbench/open-box-timber-eps-screed-hybrid-surface.ts",
  "apps/web/features/workbench/open-box-timber-eps-screed-hybrid-surface-parity.test.ts",
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

function exactSystem(id: "tuas_r7b_open_box_timber_measured_2026"): ExactFloorSystem {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === id);

  if (!system) {
    throw new Error(`Missing exact system ${id}`);
  }

  return system;
}

function criteriaToLayers(role: FloorRole, criteria: FloorSystemRoleCriteria | undefined): readonly LayerInput[] {
  if (!criteria) {
    return [];
  }

  if (criteria.materialScheduleIds || criteria.thicknessScheduleMm) {
    const materialSchedule = criteria.materialScheduleIds ?? criteria.materialIds ?? [];
    const thicknessSchedule = criteria.thicknessScheduleMm ?? [];

    return thicknessSchedule.map((thicknessMm, index) => ({
      floorRole: role,
      materialId: materialSchedule[index] ?? materialSchedule[0] ?? criteria.materialIds?.[0] ?? "generic_fill",
      thicknessMm
    }));
  }

  const materialId = criteria.materialIds?.[0] ?? "generic_fill";
  const baseThicknessMm = criteria.thicknessMm ?? 1;
  const layerCount = criteria.layerCount ?? 1;

  return Array.from({ length: layerCount }).map(() => ({
    floorRole: role,
    materialId,
    thicknessMm: baseThicknessMm
  }));
}

function layersFromSystem(system: ExactFloorSystem): readonly LayerInput[] {
  return ROLE_ORDER.flatMap((role) => {
    const criteria =
      role === "base_structure"
        ? system.match.baseStructure
        : role === "ceiling_board"
          ? system.match.ceilingBoard
          : role === "ceiling_cavity"
            ? system.match.ceilingCavity
            : role === "ceiling_fill"
              ? system.match.ceilingFill
              : role === "floating_screed"
                ? system.match.floatingScreed
                : role === "floor_covering"
                  ? system.match.floorCovering
                  : role === "resilient_layer"
                    ? system.match.resilientLayer
                    : system.match.upperFill;

    return criteriaToLayers(role, criteria);
  });
}

function expectHybridSurface(
  layers: readonly LayerInput[],
  expected: {
    C: number;
    CI: number;
    CI50_2500: number;
    LnW: number;
    LnWPlusCI: number;
    Rw: number;
    RwPlusC: number;
    fitPercent: number;
  }
) {
  const result = calculateAssembly(layers, {
    calculator: "dynamic",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(result.floorSystemMatch).toBeNull();
  expect(result.impact).toMatchObject({
    CI: expected.CI,
    CI50_2500: expected.CI50_2500,
    LnW: expected.LnW,
    LnWPlusCI: expected.LnWPlusCI,
    basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS,
    labOrField: "lab"
  });
  expect(result.floorSystemRatings).toMatchObject({
    C: expected.C,
    Rw: expected.Rw,
    RwCtr: expected.RwPlusC,
    RwCtrSemantic: "rw_plus_c",
    basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
  });
  expect(result.dynamicImpactTrace).toMatchObject({
    candidateRowCount: 1,
    detectedSupportFamilyLabel: "open box timber",
    estimateTierLabel: "Archetype family",
    fitPercent: expected.fitPercent,
    selectedLabel: "Open-box timber EPS/screed hybrid package formula corridor",
    selectionKindLabel: "Published family estimate",
    structuralSupportLabel: "Open-box timber",
    systemTypeLabel: "Dry floating floor"
  });
  expect(result.dynamicImpactTrace?.selectedSourceIds).toEqual(["tuas_r7b_open_box_timber_measured_2026"]);
  expect(result.impact?.errorBudgets?.map((budget) => [budget.metricId, budget.toleranceDb])).toEqual([
    ["Rw", 7],
    ["C", 3],
    ["Rw+C", 7.5],
    ["Ln,w", 8],
    ["CI", 2.5],
    ["CI,50-2500", 3],
    ["Ln,w+CI", 8.5]
  ]);
  expect(result.impact?.errorBudgets?.every((budget) => budget.notMeasuredEvidence)).toBe(true);
  expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);

  return result;
}

describe("broad accuracy floor open-box timber EPS/screed hybrid package surface parity contract", () => {
  it("lands EPS/screed surface parity without runtime movement and selects the matrix refresh follow-up", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSurfaceParityContract();

    expect(contract).toMatchObject({
      basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_LANDED_GATE,
      runtimeMovedAtSurfaceParity: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTION_STATUS,
      surfaceTargets: [
        "impact_lane",
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
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTION_STATUS
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps EPS/screed runtime values visible for complete and safe-split variants", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSurfaceParityContract();
    const byId = new Map(contract.valuePins.map((pin) => [pin.id, pin.expected]));

    for (const entry of [
      {
        expected: byId.get("source_absent_eps_screed_hybrid_43mm_screed_variant"),
        layers: EPS_SCREED_HYBRID_VARIANT
      },
      {
        expected: byId.get("safe_split_support_eps_screed_hybrid_43mm_screed_variant"),
        layers: EPS_SCREED_HYBRID_SAFE_SPLIT_VARIANT
      }
    ]) {
      expect(entry.expected).toBeDefined();
      expectHybridSurface(entry.layers, {
        C: entry.expected?.C ?? 0,
        CI: entry.expected?.CI ?? 0,
        CI50_2500: entry.expected?.CI50_2500 ?? 0,
        LnW: entry.expected?.LnW ?? 0,
        LnWPlusCI: entry.expected?.LnWPlusCI ?? 0,
        Rw: entry.expected?.Rw ?? 0,
        RwPlusC: entry.expected?.RwPlusC ?? 0,
        fitPercent: entry.expected?.fitPercent ?? 0
      });
    }
  });

  it("keeps exact R7b and dry package-transfer precedence ahead of the surface-parity lane", () => {
    const exact = calculateAssembly(layersFromSystem(exactSystem("tuas_r7b_open_box_timber_measured_2026")), {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const dryPackage = calculateAssembly(DRY_PACKAGE_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(exact.floorSystemMatch?.system.id).toBe("tuas_r7b_open_box_timber_measured_2026");
    expect(exact.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(exact.floorSystemEstimate).toBeNull();
    expect(exact.impact?.basis).not.toBe(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);

    expect(dryPackage.floorSystemEstimate?.impact.basis).toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
    expect(dryPackage.impact?.basis).toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
    expect(dryPackage.impact?.basis).not.toBe(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);
  });

  it("keeps docs, exports, and current-gate runner aligned with EPS/screed surface parity closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(content, path).toContain(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);
      expect(content, path).toContain("Rw 72");
      expect(content, path).toContain("Ln,w 47");
      expect(content, path).toContain("+/-7 dB");
      expect(content, path).toContain("+/-8 dB");
      expect(normalizedContent, path).toContain("eps/screed");
      expect(normalizedContent, path).toContain("cards");
      expect(normalizedContent, path).toContain("method dossier");
      expect(normalizedContent, path).toContain("server snapshot replay");
      expect(normalizedContent, path).toContain("calculator api");
      expect(normalizedContent, path).toContain("impact-only api");
      expect(normalizedContent, path).toContain("markdown report");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity");
    expect(runner).toContain("broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity-contract.test.ts");
    expect(runner).toContain("open-box-timber-eps-screed-hybrid-surface-parity.test.ts");
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { ImpactErrorBudget,
  ExactFloorSystem,
  FloorRole,
  FloorSystemRoleCriteria,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRuntimeCorridorContract
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "R'w", "IIC"] as const satisfies readonly RequestedOutputId[];

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

const R8B_PARTIAL_FINISH_VARIANT = EPS_SCREED_HYBRID_VARIANT.filter(
  (layer) => layer.floorRole !== "floor_covering" && layer.floorRole !== "resilient_layer"
) satisfies readonly LayerInput[];

const R9B_SCREED_ONLY_VARIANT = EPS_SCREED_HYBRID_VARIANT.filter(
  (layer) => layer.floorRole !== "upper_fill"
) satisfies readonly LayerInput[];

const R2C_MISSING_LOWER_MASS_VARIANT = EPS_SCREED_HYBRID_VARIANT.filter(
  (layer) => layer.floorRole !== "upper_fill" && layer.floorRole !== "floating_screed" && layer.floorRole !== "ceiling_fill"
) satisfies readonly LayerInput[];

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

const UNSAFE_DUPLICATE_UPPER = [
  ...EPS_SCREED_HYBRID_VARIANT,
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 10 }
] as const satisfies readonly LayerInput[];

const OPEN_WEB_WRONG_FAMILY = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 }
] as const satisfies readonly LayerInput[];

const REQUIRED_SURFACES = [
  "packages/engine/src/open-box-timber-eps-screed-hybrid-package-estimate.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/impact-confidence.ts",
  "packages/engine/src/impact-support.ts",
  "packages/shared/src/domain/impact.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts"
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

function expectHybridRuntime(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, {
    calculator: "dynamic",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(result.floorSystemMatch).toBeNull();
  expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
  expect(result.floorSystemEstimate?.structuralFamily).toBe("open-box timber EPS/screed hybrid package");
  expect(result.floorSystemEstimate?.impact).toMatchObject({
    CI: 0,
    CI50_2500: 1,
    LnW: 47,
    LnWPlusCI: 47,
    basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS,
    labOrField: "lab",
    scope: "family_estimate"
  });
  expect(result.impact?.basis).toBe(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);
  expect(result.impact?.metricBasis).toMatchObject({
    CI: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS,
    CI50_2500: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS,
    LnW: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS,
    LnWPlusCI: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
  });
  expect(result.impact?.errorBudgets?.map((budget: ImpactErrorBudget) => [budget.metricId, budget.toleranceDb])).toEqual([
    ["Rw", 7],
    ["C", 3],
    ["Rw+C", 7.5],
    ["Ln,w", 8],
    ["CI", 2.5],
    ["CI,50-2500", 3],
    ["Ln,w+CI", 8.5]
  ]);
  expect(result.impact?.errorBudgets?.every((budget: ImpactErrorBudget) => budget.notMeasuredEvidence)).toBe(true);
  expect(result.floorSystemRatings).toMatchObject({
    C: -1.3,
    Rw: 72,
    RwCtr: 70.7,
    RwCtrSemantic: "rw_plus_c",
    basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
  });
  expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["R'w", "IIC"]);
  expect(
    result.warnings.some((warning: string) => /EPS\/screed hybrid package formula corridor/i.test(warning))
  ).toBe(true);
  expect(
    result.dynamicImpactTrace?.notes.some((note: string) => /EPS\/screed hybrid package/i.test(note))
  ).toBe(true);
  expect(
    result.impactSupport?.formulaNotes.some((note: string) => /EPS\/screed hybrid package error budgets/i.test(note))
  ).toBe(true);

  return result;
}

describe("broad accuracy floor open-box timber EPS/screed hybrid package runtime corridor contract", () => {
  it("lands runtime movement and selects surface parity next", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRuntimeCorridorContract();

    expect(contract).toMatchObject({
      basis: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_BASIS,
      exactRowsStayFirst: true,
      fieldBuildingAndAstmAliasesBlocked: true,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_LANDED_GATE,
      runtimeMovementThisGate: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTION_STATUS
    });
    expect(contract.previousFormulaCorridor).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTION_STATUS
    });
    expect(contract.supportedScenarios.map((scenario) => scenario.id)).toEqual([
      "source_absent_eps_screed_hybrid_43mm_screed_variant",
      "safe_split_support_eps_screed_hybrid_43mm_screed_variant"
    ]);
    expect(contract.negativeBoundaries).toContain(
      "field_building_and_astm_iic_outputs_remain_unpromoted_by_this_element_lab_runtime_corridor"
    );

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete source-absent EPS/screed hybrid package variants through the runtime formula corridor", () => {
    expectHybridRuntime(EPS_SCREED_HYBRID_VARIANT);
    expectHybridRuntime(EPS_SCREED_HYBRID_SAFE_SPLIT_VARIANT);
  });

  it("keeps exact R7b and dry package-transfer lanes first", () => {
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

  it("keeps sibling negatives, wrong families, unsafe duplicates, and field aliases blocked", () => {
    const partial = calculateAssembly(R8B_PARTIAL_FINISH_VARIANT, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const screedOnly = calculateAssembly(R9B_SCREED_ONLY_VARIANT, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const missingLowerMass = calculateAssembly(R2C_MISSING_LOWER_MASS_VARIANT, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const duplicate = calculateAssembly(UNSAFE_DUPLICATE_UPPER, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const wrongFamily = calculateAssembly(OPEN_WEB_WRONG_FAMILY, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const fieldAlias = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      calculator: "dynamic",
      impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 50 },
      targetOutputs: ["Ln,w", "L'n,w", "L'nT,w", "IIC"]
    });

    for (const result of [partial, screedOnly, missingLowerMass, duplicate, wrongFamily]) {
      expect(result.impact?.basis).not.toBe(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);
      expect(result.floorSystemEstimate?.impact.basis).not.toBe(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);
    }

    expect(fieldAlias.impact).toMatchObject({
      LPrimeNTw: 48,
      LPrimeNW: 50,
      LnW: 47,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      labOrField: "lab"
    });
    expect(fieldAlias.impact?.metricBasis).toMatchObject({
      LnW: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
    });
    expect(fieldAlias.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);
    expect(fieldAlias.unsupportedTargetOutputs).toEqual(["IIC"]);
  });

  it("keeps docs, exports, schema, and current-gate runner aligned with the landed runtime corridor", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_FILE);
      expect(content, path).toContain(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);
      expect(content, path).toContain("Rw 72");
      expect(content, path).toContain("Ln,w 47");
      expect(content, path).toContain("+/-8 dB");
      expect(content, path).toContain("+/-7 dB");
      expect(normalizedContent, path).toContain("eps/screed");
      expect(normalizedContent, path).toContain("surface parity");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor";'
    );
    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./open-box-timber-eps-screed-hybrid-package-estimate";'
    );
    expect(readRepoFile("packages/shared/src/domain/impact.ts")).toContain(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor-contract.test.ts"
    );
  });
});

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
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity";
import {
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTION_STATUS,
  buildBroadAccuracyOpenBoxTimberPostEpsScreedHybridMatrixRefreshContract
} from "./broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const OPEN_BOX_LAB_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_ALIAS_OUTPUTS = ["L'n,w", "L'nT,w", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

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

const RAW_BARE_370 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const RAW_BARE_220 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 220 }
] as const satisfies readonly LayerInput[];

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

const R10A_MIXED_STAGED_VARIANT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh.ts",
  "packages/engine/src/broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-coverage-refresh.ts",
  "packages/engine/src/open-box-timber-eps-screed-hybrid-package-estimate.ts",
  "packages/engine/src/open-box-timber-raw-bare-estimate.ts",
  "packages/engine/src/open-box-timber-similarity-estimate.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/CHECKPOINT_2026-05-20_BROAD_ACCURACY_REVALIDATION_AND_OPEN_BOX_FRAGMENTATION_PLAN.md",
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

function exactSystem(id: "tuas_r5b_open_box_timber_measured_2026" | "tuas_r7b_open_box_timber_measured_2026"): ExactFloorSystem {
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

function valueMap(result: ReturnType<typeof calculateAssembly>) {
  return {
    basis: result.impact?.basis ?? null,
    ci: result.impact?.CI ?? null,
    ci50: result.impact?.CI50_2500 ?? null,
    lnw: result.impact?.LnW ?? null,
    lnwPlusCi: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwPlusC: result.floorSystemRatings?.RwCtr ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("broad accuracy open-box timber post EPS/screed hybrid matrix refresh", () => {
  it("lands a no-runtime matrix refresh and selects open-web raw-bare owner next", () => {
    const contract = buildBroadAccuracyOpenBoxTimberPostEpsScreedHybridMatrixRefreshContract();

    expect(contract).toMatchObject({
      landedGate: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTION_STATUS
    });
    expect(contract.previousSurfaceParity).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTION_STATUS
    });
    expect(contract.remainingFollowups).toEqual([
      {
        id: "open_web_raw_bare_carrier_owner",
        reason:
          "selected now because open-box package-transfer/raw-bare/EPS lanes are visible and the remaining common floor gap is raw open-web impact ownership, not another open-box retune",
        selectedNow: true
      },
      {
        id: "tuas_c11c_source_tuple_recheck",
        reason:
          "not selected here because C11c still has a source/frequency tuple anomaly and should not be exact-promoted or used as a formula anchor",
        selectedNow: false
      },
      {
        id: "airborne_or_impact_field_building_adapter",
        reason:
          "not selected here because element-lab open-box Rw/Ln,w values cannot alias to field apparent or building-prediction outputs",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_rating_curve_owner",
        reason: "not selected here because ISO Ln,w/CI evidence cannot create ASTM IIC/AIIC ratings",
        selectedNow: false
      }
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("summarizes supported lanes, exact precedence, boundaries, and the operating envelope", () => {
    const contract = buildBroadAccuracyOpenBoxTimberPostEpsScreedHybridMatrixRefreshContract();

    expect(contract.summary).toEqual({
      basisBoundaryRowIds: ["floor.open_box_timber_field_building.boundary"],
      correctlyBlockedRowIds: [
        "floor.open_box_timber_r8b_partial_no_finish.boundary",
        "floor.open_box_timber_r9b_screed_only.boundary",
        "floor.open_box_timber_r2c_missing_lower_mass.boundary",
        "floor.open_box_timber_r10a_mixed_staged.boundary",
        "floor.open_box_timber_astm_iic.unsupported"
      ],
      exactPrecedenceBoundaryRowIds: [
        "floor.open_box_timber_r7b_exact_precedence.lab",
        "floor.open_box_timber_r5b_exact_precedence.lab"
      ],
      failureClassCounts: {
        basis_boundary: 1,
        correct_block: 5,
        coverage_followup: 1,
        exact_precedence_boundary: 2,
        none: 7,
        separate_lane_boundary: 2
      },
      noRuntimeValueMovement: true,
      rankedFollowupRowIds: ["floor.open_web_raw_bare_owner.next"],
      rowCount: 18,
      selectedNextAction: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
      separateLaneBoundaryRowIds: [
        "floor.open_box_timber_dry_package_separate_from_eps.boundary",
        "floor.open_box_timber_raw_bare_separate_from_eps.boundary"
      ],
      supportedRuntimeRowIds: [
        "floor.open_box_timber_package_transfer_dry_gypsum_fiber.lab",
        "floor.open_box_timber_package_transfer_thin_laminate.lab",
        "floor.open_box_timber_package_transfer_reinforced_ceiling.lab",
        "floor.open_box_timber_raw_bare_370.lab",
        "floor.open_box_timber_raw_bare_220.lab",
        "floor.open_box_timber_eps_screed_hybrid.lab",
        "floor.open_box_timber_eps_screed_hybrid_safe_split.lab"
      ]
    });
    expect(contract.operatingEnvelope).toMatchObject({
      selectedNextGapCluster: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      supportedFamilyRoutes: [
        "exact TUAS open-box timber source rows",
        "open-box timber package-transfer source-absent family corridor",
        "open-box timber raw-bare source-absent family corridor",
        "open-box timber EPS/screed hybrid source-absent family corridor"
      ],
      toleranceBudgetFamilies: [
        "package-transfer: +/-7 dB Ln,w, +/-6 dB Rw",
        "raw-bare: +/-10 dB Ln,w, +/-8 dB Rw",
        "EPS/screed hybrid: +/-8 dB Ln,w, +/-7 dB Rw"
      ]
    });
  });

  it("keeps package-transfer, raw-bare, and EPS/screed runtime pins unchanged through public calculator entry points", () => {
    expect(valueMap(calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, { targetOutputs: OPEN_BOX_LAB_OUTPUTS }))).toMatchObject({
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      ci: 1.3,
      ci50: 3.3,
      lnw: 50.8,
      lnwPlusCi: 52,
      rw: 66,
      rwPlusC: 62.1,
      supported: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupported: ["Ctr", "L'n,w", "IIC"]
    });
    expect(valueMap(calculateAssembly(RAW_BARE_370, { targetOutputs: OPEN_BOX_LAB_OUTPUTS }))).toMatchObject({
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      ci: -1.1,
      ci50: 3.1,
      lnw: 88.2,
      lnwPlusCi: 87.1,
      rw: 42.3,
      supported: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupported: ["L'n,w", "IIC"]
    });
    expect(valueMap(calculateAssembly(RAW_BARE_220, { targetOutputs: OPEN_BOX_LAB_OUTPUTS }))).toMatchObject({
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      ci: -0.9,
      ci50: 3.4,
      lnw: 91.1,
      lnwPlusCi: 90.2,
      rw: 38.1,
      supported: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupported: ["L'n,w", "IIC"]
    });

    for (const layers of [EPS_SCREED_HYBRID_VARIANT, EPS_SCREED_HYBRID_SAFE_SPLIT_VARIANT]) {
      expect(valueMap(calculateAssembly(layers, { targetOutputs: OPEN_BOX_LAB_OUTPUTS }))).toMatchObject({
        basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS,
        ci: 0,
        ci50: 1,
        lnw: 47,
        lnwPlusCi: 47,
        rw: 72,
        rwPlusC: 70.7,
        supported: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        unsupported: ["Ctr", "L'n,w", "IIC"]
      });
    }
  });

  it("keeps exact R7b/R5b precedence and R8b/R9b/R2c/R10a out of the EPS/screed runtime lane", () => {
    const exactR7b = calculateAssembly(layersFromSystem(exactSystem("tuas_r7b_open_box_timber_measured_2026")), {
      targetOutputs: OPEN_BOX_LAB_OUTPUTS
    });
    const exactR5b = calculateAssembly(layersFromSystem(exactSystem("tuas_r5b_open_box_timber_measured_2026")), {
      targetOutputs: OPEN_BOX_LAB_OUTPUTS
    });

    expect(exactR7b.floorSystemMatch?.system.id).toBe("tuas_r7b_open_box_timber_measured_2026");
    expect(exactR7b.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(exactR7b.impact?.basis).not.toBe(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);
    expect(exactR5b.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(exactR5b.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(exactR5b.impact?.basis).not.toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);

    for (const layers of [
      R8B_PARTIAL_FINISH_VARIANT,
      R9B_SCREED_ONLY_VARIANT,
      R2C_MISSING_LOWER_MASS_VARIANT,
      R10A_MIXED_STAGED_VARIANT
    ]) {
      const result = calculateAssembly(layers, { targetOutputs: OPEN_BOX_LAB_OUTPUTS });

      expect(result.impact?.basis).not.toBe(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);
      expect(result.floorSystemEstimate?.impact.basis).not.toBe(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);
    }
  });

  it("keeps field/building and ASTM/IIC aliases blocked and ranks raw open-web as the next owner gap", () => {
    const fieldBuilding = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      impactFieldContext: { fieldKDb: 2, receivingRoomVolumeM3: 55 },
      targetOutputs: IMPACT_ALIAS_OUTPUTS
    });
    const astm = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, { targetOutputs: ASTM_OUTPUTS });
    const rawOpenWeb = calculateAssembly(RAW_OPEN_WEB, { targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"] });

    expect(fieldBuilding.impact?.basis).not.toBe(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);
    expect(fieldBuilding.supportedTargetOutputs).toEqual([]);
    expect(fieldBuilding.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "R'w", "DnT,w"]);
    expect(astm.impact).toBeNull();
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);

    expect(rawOpenWeb.floorSystemMatch).toBeNull();
    expect(rawOpenWeb.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(rawOpenWeb.impact).toMatchObject({
      LnW: 96,
      LnWPlusCI: 97.8,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(rawOpenWeb.floorSystemRatings).toMatchObject({
      Rw: 32,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(rawOpenWeb.impact?.basis).not.toBe(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS);
    expect(rawOpenWeb.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(rawOpenWeb.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps docs, exports, and current-gate runner aligned to the matrix refresh closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE);
      expect(normalizedContent, path).toContain("company-internal v0 operating-envelope");
      expect(normalizedContent, path).toContain("open-web raw-bare");
      expect(normalizedContent, path).toContain("rw 72");
      expect(normalizedContent, path).toContain("ln,w 47");
      expect(normalizedContent, path).toContain("rw 42.3");
      expect(normalizedContent, path).toContain("ln,w 88.2");
      expect(normalizedContent, path).toContain("ln,w 50.8");
      expect(normalizedWhitespaceContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh-contract.test.ts"
    );
  });
});

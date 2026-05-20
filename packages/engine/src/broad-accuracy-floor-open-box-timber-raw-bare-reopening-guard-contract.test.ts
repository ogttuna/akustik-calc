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
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy";
import { evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor } from "./broad-accuracy-floor-open-box-timber-similarity-formula-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberRawBareReopeningGuardContract,
  type BroadAccuracyFloorOpenBoxTimberRawBareProbeId
} from "./broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

type RawBareSnapshot = {
  readonly floorSystemEstimateKind: string | null;
  readonly floorSystemMatchId: string | null;
  readonly impactBasis: string | null;
  readonly impactLnW: number | null;
  readonly ratingsBasis: string | null;
  readonly ratingsRw: number | null;
  readonly supported: readonly RequestedOutputId[];
  readonly unsupported: readonly RequestedOutputId[];
};

type ExactSnapshot = {
  readonly floorSystemMatchId: string | null;
  readonly impactLnW: number | null;
  readonly ratingsRw: number | null;
  readonly supported: readonly RequestedOutputId[];
};

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const FORMULA_OUTPUTS = ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

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

const RAW_BARE_PROBE_LAYERS = {
  roleless_370mm_open_box_base_only: [{ materialId: "open_box_timber_slab", thicknessMm: 370 }],
  tagged_370mm_open_box_base_only: [
    { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
  ],
  split_185_185_open_box_base_only: [
    { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 },
    { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 }
  ],
  upper_only_dry_package_without_lower_owner: [
    { materialId: "laminate_flooring", thicknessMm: 8 },
    { materialId: "eps_underlay", thicknessMm: 3 },
    { materialId: "generic_fill", thicknessMm: 50 },
    { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
    { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
  ],
  lower_only_helper_package_without_upper_owner: [
    { materialId: "gypsum_board", thicknessMm: 13 },
    { materialId: "rockwool", thicknessMm: 90 },
    { materialId: "furring_channel", thicknessMm: 28 },
    { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
  ],
  open_web_wrong_family_base_only: [
    { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
  ]
} as const satisfies Record<BroadAccuracyFloorOpenBoxTimberRawBareProbeId, readonly LayerInput[]>;

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor.ts",
  "packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts",
  "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
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

function rawBareSnapshot(layers: readonly LayerInput[]): RawBareSnapshot {
  const result = calculateAssembly(layers, { targetOutputs: LAB_OUTPUTS });

  return {
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    impactLnW: result.impact?.LnW ?? null,
    ratingsBasis: result.floorSystemRatings?.basis ?? null,
    ratingsRw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

function exactSnapshot(layers: readonly LayerInput[]): ExactSnapshot {
  const result = calculateAssembly(layers, { targetOutputs: LAB_OUTPUTS });

  return {
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactLnW: result.impact?.LnW ?? null,
    ratingsRw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs
  };
}

function splitThickness(thicknessMm: number): readonly number[] {
  if (thicknessMm <= 2) {
    return [thicknessMm];
  }

  const first = Math.floor(thicknessMm / 2);
  return [first, thicknessMm - first];
}

function criteriaToLayers(
  role: FloorRole,
  criteria: FloorSystemRoleCriteria | undefined,
  options: { readonly fragment: boolean }
): readonly LayerInput[] {
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

  return Array.from({ length: layerCount }).flatMap(() => {
    const schedule = options.fragment ? splitThickness(baseThicknessMm) : [baseThicknessMm];

    return schedule.map((thicknessMm) => ({
      floorRole: role,
      materialId,
      thicknessMm
    }));
  });
}

function layersFromSystem(system: ExactFloorSystem, options: { readonly fragment: boolean }): readonly LayerInput[] {
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

    return criteriaToLayers(role, criteria, options);
  });
}

function exactSystem(sourceId: string): ExactFloorSystem {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === sourceId);

  if (!system) {
    throw new Error(`Missing exact floor system ${sourceId}`);
  }

  return system;
}

describe("broad accuracy floor open-box timber raw-bare reopening guard contract", () => {
  it("lands a no-runtime guard and selects a bare-carrier owner lane", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareReopeningGuardContract();

    expect(contract).toMatchObject({
      exactRowsStayFirst: true,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_LANDED_GATE,
      noRuntimeValueMovement: true,
      packageTransferBasis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      rawBareFormulaStatus: "blocked_raw_bare_open_box",
      runtimePromotionAllowedInGate: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTION_STATUS
    });
    expect(contract.previousExactOnlyHybridPolicy).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS
    });
    expect(contract.basisAliasBlocked).toEqual({
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    });
    expect(contract.bareCarrierOwnerFieldsRequiredBeforeRuntime).toEqual([
      "source_owned_bare_open_box_impact_curve_or_defensible_physics_owner",
      "source_owned_bare_open_box_airborne_direct_curve_or_defensible_physics_owner",
      "raw_bare_finish_absence_owner",
      "lower_treatment_absence_or_presence_owner",
      "package_transfer_exclusion_owner",
      "raw_bare_uncertainty_budget_owner"
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("classifies raw-bare probes and freezes package-transfer pins without admitting runtime", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareReopeningGuardContract();

    expect(contract.rawBareProbes.map((probe) => probe.id)).toEqual([
      "roleless_370mm_open_box_base_only",
      "tagged_370mm_open_box_base_only",
      "split_185_185_open_box_base_only",
      "upper_only_dry_package_without_lower_owner",
      "lower_only_helper_package_without_upper_owner",
      "open_web_wrong_family_base_only"
    ]);
    expect(contract.rawBareProbes.map((probe) => [probe.id, probe.expectedCurrentRw, probe.formulaStatus])).toEqual([
      ["roleless_370mm_open_box_base_only", 42, "blocked_raw_bare_open_box"],
      ["tagged_370mm_open_box_base_only", 42, "blocked_raw_bare_open_box"],
      ["split_185_185_open_box_base_only", 42, "blocked_raw_bare_open_box"],
      ["upper_only_dry_package_without_lower_owner", 52, "blocked_raw_bare_open_box"],
      ["lower_only_helper_package_without_upper_owner", 43, "blocked_raw_bare_open_box"],
      ["open_web_wrong_family_base_only", 72, "blocked_wrong_support_family"]
    ]);

    for (const probe of contract.rawBareProbes) {
      expect(probe).toMatchObject({
        expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3",
        expectedSupportedOutputs: ["Rw"],
        expectedUnsupportedOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        impactRuntimeAdmission: "blocked",
        packageTransferBasisForbidden: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
        packageTransferBorrowingAllowed: false
      });
      expect(probe.requiredOwnerGaps.length).toBeGreaterThanOrEqual(1);
    }
    expect(contract.packageTransferPinsFrozen.map((pin) => [pin.packageId, pin.LnW, pin.CI50_2500, pin.Rw])).toEqual([
      ["dry_gypsum_fiber_upper", 50.8, 3.3, 66],
      ["thin_laminate_eps_no_upper", 53.5, 3.5, 55.5],
      ["reinforced_ceiling_laminate", 53.5, 2, 63.5]
    ]);
  });

  it("keeps formula evaluation blocked for raw-bare and wrong-family probes", () => {
    const rawBare = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "none_raw_bare",
      packageId: "dry_gypsum_fiber_upper",
      roleTopologyState: "source_equivalent",
      supportFamily: "raw_open_box_roleless",
      targetOutputs: FORMULA_OUTPUTS
    });
    const openWebWrongFamily = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
      finishPairState: "complete_laminate_eps",
      packageId: "dry_gypsum_fiber_upper",
      roleTopologyState: "source_equivalent",
      supportFamily: "open_web_steel",
      targetOutputs: FORMULA_OUTPUTS
    });

    expect(rawBare).toMatchObject({
      affectedFormulaOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      anchorSourceIds: [],
      blockedFormulaOutputs: ["L'n,w", "IIC"],
      blockedSourceIds: [],
      corridorStatus: "blocked_raw_bare_open_box",
      designMetrics: { CI: null, CI50_2500: null, LnW: null, LnWPlusCI: null, Rw: null, RwPlusC: null },
      runtimePromotionAllowedInGate: false,
      runtimeValues: { CI: null, CI50_2500: null, LnW: null, LnWPlusCI: null, Rw: null, RwPlusC: null }
    });
    expect(openWebWrongFamily).toMatchObject({
      anchorSourceIds: [],
      blockedFormulaOutputs: ["L'n,w", "IIC"],
      blockedSourceIds: [],
      corridorStatus: "blocked_wrong_support_family",
      designMetrics: { CI: null, CI50_2500: null, LnW: null, LnWPlusCI: null, Rw: null, RwPlusC: null },
      runtimePromotionAllowedInGate: false,
      runtimeValues: { CI: null, CI50_2500: null, LnW: null, LnWPlusCI: null, Rw: null, RwPlusC: null }
    });
  });

  it("keeps raw-bare public calculator probes out of package-transfer impact while complete base-only probes use the later raw-bare runtime corridor", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareReopeningGuardContract();
    const forbiddenPackageTransferRws = new Set(contract.packageTransferPinsFrozen.map((pin) => pin.Rw));
    const completeBaseOnlyRuntimeProbeIds = new Set<BroadAccuracyFloorOpenBoxTimberRawBareProbeId>([
      "roleless_370mm_open_box_base_only",
      "tagged_370mm_open_box_base_only",
      "split_185_185_open_box_base_only"
    ]);

    for (const probe of contract.rawBareProbes) {
      const snapshot = rawBareSnapshot(RAW_BARE_PROBE_LAYERS[probe.id]);

      if (completeBaseOnlyRuntimeProbeIds.has(probe.id)) {
        expect(snapshot, probe.id).toMatchObject({
          floorSystemEstimateKind: "family_archetype",
          floorSystemMatchId: null,
          impactBasis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
          impactLnW: 88.2,
          ratingsBasis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
          ratingsRw: 42.3,
          supported: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
          unsupported: []
        });
      } else {
        expect(snapshot, probe.id).toMatchObject({
          floorSystemEstimateKind: null,
          floorSystemMatchId: null,
          impactBasis: null,
          impactLnW: null,
          ratingsBasis: probe.expectedCurrentAirborneBasis,
          ratingsRw: probe.expectedCurrentRw,
          supported: probe.expectedSupportedOutputs,
          unsupported: probe.expectedUnsupportedOutputs
        });
      }
      expect(snapshot.ratingsBasis, probe.id).not.toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
      expect(forbiddenPackageTransferRws.has(snapshot.ratingsRw ?? NaN), probe.id).toBe(false);
    }
  });

  it("keeps exact TUAS package rows first and source-equivalent fragmentation exact", () => {
    const anchorSourceIds = buildBroadAccuracyFloorOpenBoxTimberRawBareReopeningGuardContract()
      .packageTransferPinsFrozen.flatMap((pin) => pin.anchorSourceIds);
    const failures: string[] = [];

    for (const sourceId of anchorSourceIds) {
      const system = exactSystem(sourceId);
      const canonical = exactSnapshot(layersFromSystem(system, { fragment: false }));
      const fragmented = exactSnapshot(layersFromSystem(system, { fragment: true }));

      if (canonical.floorSystemMatchId !== sourceId) {
        failures.push(`${sourceId}: canonical stack missed exact row`);
      }

      if (JSON.stringify(fragmented) !== JSON.stringify(canonical)) {
        failures.push(`${sourceId}: fragmented stack drifted from canonical exact route`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps docs, exports, and current-gate list aligned to the landed guard", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_LANDED_GATE);
      expect(contents, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTION_STATUS);
      expect(contents, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("no-runtime");
      expect(contents, path).toContain("bare-carrier");
      expect(contents, path).toContain("field/building");
      expect(contents, path).toContain("ASTM/IIC");
      expect(contents, path).toContain("Ln,w 50.8");
      expect(contents, path).toContain("CI,50-2500 3.3");
      expect(contents, path).toContain("Rw 66");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard-contract.test.ts"
    );
  });
});

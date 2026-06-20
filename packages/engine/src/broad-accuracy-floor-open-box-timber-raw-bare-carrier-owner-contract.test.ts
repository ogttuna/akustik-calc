import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerContract
} from "./broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTION_STATUS,
  type BroadAccuracyFloorOpenBoxTimberRawBareProbeId
} from "./broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

type CalculatorSnapshot = {
  readonly floorSystemEstimateKind: string | null;
  readonly floorSystemMatchId: string | null;
  readonly impactBasis: string | null;
  readonly ratingsBasis: string | null;
  readonly ratingsRw: number | null;
  readonly supported: readonly RequestedOutputId[];
  readonly unsupported: readonly RequestedOutputId[];
};

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

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

const R5B_EXACT_PACKAGE_LAYERS = [
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

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor.ts",
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

function snapshot(layers: readonly LayerInput[]): CalculatorSnapshot {
  const result = calculateAssembly(layers, { targetOutputs: LAB_OUTPUTS });

  return {
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    ratingsBasis: result.floorSystemRatings?.basis ?? null,
    ratingsRw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("broad accuracy floor open-box timber raw-bare carrier owner contract", () => {
  it("lands a no-runtime bare-carrier owner gate and selects raw-bare formula corridor next", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerContract();

    expect(contract).toMatchObject({
      acceptedRuntimeBasisRoutes: [
        "source_owned_bare_open_box_measurement_packet",
        "defensible_source_absent_bare_carrier_physics_model"
      ],
      exactRowsStayFirst: true,
      forbiddenBorrowedPackageTransferBasis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
      noRuntimeValueMovement: true,
      runtimePromotionAllowedInGate: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS
    });
    expect(contract.previousRawBareGuard).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTION_STATUS
    });
    expect(contract.basisAliasBlocked).toEqual({
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines the physical owner checklist before any raw-bare formula corridor can move values", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerContract();

    expect(contract.carrierOwnerTerms.map((term) => term.id)).toEqual([
      "support_family_and_geometry_owner",
      "airborne_direct_curve_owner",
      "bare_impact_curve_owner",
      "finish_absence_owner",
      "lower_treatment_state_owner",
      "package_transfer_exclusion_owner",
      "source_or_physics_basis_owner",
      "uncertainty_budget_owner",
      "exact_source_precedence_owner",
      "basis_boundary_owner",
      "hostile_topology_owner"
    ]);
    expect(contract.carrierOwnerTerms.find((term) => term.id === "support_family_and_geometry_owner")).toMatchObject({
      requiredPhysicalFields: [
        "supportFamily=open_box_timber",
        "supportForm=open_box_timber_slab",
        "carrierDepthMm",
        "surfaceMassKgM2",
        "panelPlateSchedule",
        "ribOrWebSpacingMm",
        "voidFractionOrCavityDepthMm",
        "densityKgM3",
        "lossFactor"
      ],
      status: "owned_for_formula_corridor"
    });
    expect(contract.carrierOwnerTerms.find((term) => term.id === "bare_impact_curve_owner")).toMatchObject({
      requiredPhysicalFields: [
        "bareCarrierNormalizedImpactCurve",
        "walkingSurfaceHardnessClass",
        "structuralMobilityModel",
        "impactRadiationEfficiency",
        "iso717ImpactRatingAdapter"
      ],
      status: "runtime_blocked_until_formula_corridor"
    });
    expect(contract.carrierOwnerTerms.find((term) => term.id === "uncertainty_budget_owner")).toMatchObject({
      requiredPhysicalFields: [
        "RwToleranceBudgetOwner",
        "LnWToleranceBudgetOwner",
        "CIBudgetOwner",
        "CI50_2500BudgetOwner",
        "inputPrecisionBudgetOwner",
        "topologySimplificationBudgetOwner"
      ],
      status: "runtime_blocked_until_formula_corridor"
    });
    expect(contract.negativeBoundaries).toEqual([
      "raw_bare_owner_contract_does_not_promote_runtime_values",
      "raw_bare_airborne_screening_remains_screening_until_direct_curve_owner_lands",
      "raw_bare_impact_outputs_remain_unsupported_until_bare_impact_curve_owner_lands",
      "upper_only_and_lower_only_packages_do_not_become_complete_package_transfer",
      "package_transfer_values_Lnw_50_8_CI50_2500_3_3_Rw_66_remain_forbidden",
      "exact_tuas_package_rows_remain_first",
      "field_building_and_astm_iic_aliases_remain_unpromoted",
      "safe_split_base_only_stays_equivalent_to_unsplit_base_only"
    ]);
  });

  it("keeps the owner-gate boundaries while the later runtime gate promotes only base-only raw-bare probes", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerContract();
    const forbiddenPackageTransferRws = new Set(contract.packageTransferPinsStillFrozen.map((pin) => pin.Rw));

    expect(contract.rawBareProbePosture.map((probe) => [probe.id, probe.currentRw])).toEqual([
      ["roleless_370mm_open_box_base_only", 42],
      ["tagged_370mm_open_box_base_only", 42],
      ["split_185_185_open_box_base_only", 42],
      ["upper_only_dry_package_without_lower_owner", 52],
      ["lower_only_helper_package_without_upper_owner", 43],
      ["open_web_wrong_family_base_only", 72]
    ]);

    for (const id of ["tagged_370mm_open_box_base_only", "split_185_185_open_box_base_only"] as const) {
      const current = snapshot(RAW_BARE_PROBE_LAYERS[id]);

      expect(current, id).toMatchObject({
        floorSystemEstimateKind: "family_archetype",
        floorSystemMatchId: null,
        impactBasis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
        ratingsBasis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
        ratingsRw: 42.3,
        supported: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        unsupported: ["L'n,w", "IIC"]
      });
      expect(current.ratingsBasis, id).not.toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
      expect(forbiddenPackageTransferRws.has(current.ratingsRw ?? NaN), id).toBe(false);
    }

    expect(snapshot(RAW_BARE_PROBE_LAYERS.roleless_370mm_open_box_base_only)).toMatchObject({
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: null,
      ratingsBasis: "screening_mass_law_curve_seed_v3",
      ratingsRw: 42,
      supported: ["Rw"],
      unsupported: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"]
    });

    for (const id of [
      "upper_only_dry_package_without_lower_owner",
      "lower_only_helper_package_without_upper_owner",
      "open_web_wrong_family_base_only"
    ] as const) {
      const current = snapshot(RAW_BARE_PROBE_LAYERS[id]);

      expect(current.impactBasis, id).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
      expect(current.ratingsBasis, id).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
      expect(current.ratingsBasis, id).not.toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
    }
  });

  it("preserves exact TUAS package precedence while raw-bare package-transfer pins stay frozen", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerContract();
    const exact = calculateAssembly(R5B_EXACT_PACKAGE_LAYERS, {
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(exact.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(exact.floorSystemEstimate).toBeNull();
    expect(exact.impact).toMatchObject({
      CI: 0,
      CI50_2500: 3,
      LnW: 44,
      LnWPlusCI: 44,
      basis: "open_measured_floor_system_exact_match"
    });
    expect(exact.floorSystemRatings).toMatchObject({
      Rw: 75,
      basis: "open_measured_floor_system_exact_match"
    });
    expect(contract.packageTransferPinsStillFrozen.map((pin) => [pin.packageId, pin.LnW, pin.CI50_2500, pin.Rw])).toEqual([
      ["dry_gypsum_fiber_upper", 50.8, 3.3, 66],
      ["thin_laminate_eps_no_upper", 53.5, 3.5, 55.5],
      ["reinforced_ceiling_laminate", 53.5, 2, 63.5]
    ]);
  });

  it("keeps docs, exports, and current-gate list aligned to the landed owner gate", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_LANDED_GATE);
      expect(contents, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS);
      expect(contents, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("no-runtime");
      expect(contents, path).toContain("bare-carrier");
      expect(contents, path).toContain("raw-bare formula corridor");
      expect(contents, path).toContain("field/building");
      expect(contents, path).toContain("ASTM/IIC");
      expect(contents, path).toContain("Ln,w 50.8");
      expect(contents, path).toContain("CI,50-2500 3.3");
      expect(contents, path).toContain("Rw 66");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner-contract.test.ts"
    );
  });
});
